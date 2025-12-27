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
    const { message, history = [], siteAnalysis, projectContext: clientContext } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Build comprehensive project context
    const settings = project.settings || {};

    // Get stored analysis data (from import wizard) - check both possible field names
    const storedAnalysis = settings.importAnalysis || settings.analysisData || {};

    // Merge stored analysis with any new analysis from request
    const mergedAnalysis = {
      ...storedAnalysis,
      ...(siteAnalysis || {}),
    };

    // Auto-detect industry from all available sources
    const detectedIndustry = settings.industry ||
      clientContext?.industry ||
      detectIndustry({
        businessName: settings.businessName || mergedAnalysis.businessName,
        description: mergedAnalysis.description,
        title: mergedAnalysis.title,
        services: settings.services || mergedAnalysis.services,
      });

    // Build project context for smart prompts, merging all sources
    const projectContext: ProjectContext = {
      projectName: project.name,
      businessName: settings.businessName || mergedAnalysis.businessName || clientContext?.businessName,
      industry: detectedIndustry,
      location: settings.location || mergedAnalysis.contactInfo?.address || clientContext?.location,
      phone: settings.phone || mergedAnalysis.contactInfo?.phone || clientContext?.phone,
      email: settings.email || mergedAnalysis.contactInfo?.email || clientContext?.email,
      services: settings.services || mergedAnalysis.services || clientContext?.services,
      features: settings.selectedFeatures || settings.features || clientContext?.features,
      existingWebsiteUrl: settings.importedFromUrl || settings.existingUrl || mergedAnalysis.url || clientContext?.existingWebsiteUrl,
      analysisData: {
        title: mergedAnalysis.title,
        description: mergedAnalysis.description,
        issues: mergedAnalysis.issues,
        strengths: mergedAnalysis.strengths,
        hasBooking: mergedAnalysis.contentSections?.some((s: { type: string }) =>
          s.type?.toLowerCase().includes('book') || s.type?.toLowerCase().includes('appointment')
        ),
        hasForms: mergedAnalysis.contentSections?.some((s: { type: string }) =>
          s.type?.toLowerCase().includes('form') || s.type?.toLowerCase().includes('contact')
        ),
        hasReviews: mergedAnalysis.contentSections?.some((s: { type: string }) =>
          s.type?.toLowerCase().includes('testimonial') || s.type?.toLowerCase().includes('review')
        ),
        socialLinks: mergedAnalysis.socialLinks?.map((s: { platform: string }) => s.platform),
        currentDesignScore: mergedAnalysis.designScore,
        seoScore: mergedAnalysis.seoScore,
        mobileScore: mergedAnalysis.mobileScore,
      },
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
