/**
 * AI Build API Route
 *
 * POST /api/projects/[projectId]/build
 *
 * Streams AI responses for building website components.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { streamMessage } from '@/lib/claude/client';
import { buildSystemPrompt, type ProjectContext } from '@/lib/ai/system-prompt';
import { detectIndustry } from '@/lib/ai/knowledge-base';

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
    const { message, history = [], siteAnalysis } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Build comprehensive project context
    const settings = project.settings || {};

    // Auto-detect industry if not set
    const detectedIndustry = settings.industry || detectIndustry({
      businessName: settings.businessName,
      description: siteAnalysis?.description,
      title: siteAnalysis?.title,
      services: settings.services,
    });

    // Build project context for smart prompts
    const projectContext: ProjectContext = {
      projectName: project.name,
      businessName: settings.businessName,
      industry: detectedIndustry,
      location: settings.location,
      phone: settings.phone,
      email: settings.email,
      services: settings.services,
      features: settings.features,
      existingWebsiteUrl: settings.existingUrl || siteAnalysis?.url,
      analysisData: siteAnalysis ? {
        title: siteAnalysis.title,
        description: siteAnalysis.description,
        hasBooking: siteAnalysis.contentSections?.some((s: { type: string }) =>
          s.type.toLowerCase().includes('book') || s.type.toLowerCase().includes('appointment')
        ),
        hasForms: siteAnalysis.contentSections?.some((s: { type: string }) =>
          s.type.toLowerCase().includes('form') || s.type.toLowerCase().includes('contact')
        ),
        socialLinks: siteAnalysis.socialLinks?.map((s: { platform: string }) => s.platform),
      } : undefined,
      customInstructions: settings.customInstructions,
    };

    // Build comprehensive system prompt
    const systemPrompt = buildSystemPrompt(projectContext);

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
