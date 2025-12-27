/**
 * AI Build API Route
 *
 * POST /api/projects/[projectId]/build
 *
 * Streams AI responses for building website components.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { streamMessage, BUILDER_SYSTEM_PROMPT, HEALTHCARE_SYSTEM_PROMPT } from '@/lib/claude/client';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the project to verify ownership and get settings
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();
    const { message, history = [] } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Determine system prompt based on project industry
    const industry = project.settings?.industry;
    let systemPrompt = BUILDER_SYSTEM_PROMPT;

    if (industry === 'healthcare') {
      systemPrompt = HEALTHCARE_SYSTEM_PROMPT;
    }

    // Add project context to system prompt
    systemPrompt += `\n\nProject Context:
- Project Name: ${project.name}
- Industry: ${industry || 'General'}
- Business Name: ${project.settings?.businessName || 'Not specified'}
- Primary Color: ${project.settings?.primaryColor || '#3B82F6'}

Generate code and content appropriate for this project.`;

    // Build message history
    const messages = [
      ...history.slice(-10), // Keep last 10 messages for context
      { role: 'user' as const, content: message },
    ];

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamMessage(messages, { systemPrompt })) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Build API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
