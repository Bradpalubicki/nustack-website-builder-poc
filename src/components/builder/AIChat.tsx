'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BuildProgress } from './BuildProgress';
import {
  Send,
  Loader2,
  Bot,
  User,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  PartyPopper,
  ExternalLink,
  FileCode,
  FolderPlus,
  Code2,
  Eye,
} from 'lucide-react';
import { buildInitialMessage, type ProjectContext } from '@/lib/ai/system-prompt';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface BuildSummary {
  filesCreated: number;
  componentsCreated: number;
  pagesCreated: number;
  previewUrl?: string;
}

interface SiteAnalysis {
  url: string;
  title?: string;
  description?: string;
  colors?: Array<{ hex: string; name?: string }>;
  fonts?: string[];
  images?: Array<{ src: string; alt?: string; type?: string }>;
  navigation?: Array<{ text: string; href: string }>;
  socialLinks?: Array<{ platform: string; url: string }>;
  contentSections?: Array<{ type: string; content: string }>;
}

interface AIChatProps {
  projectId: string;
  projectContext?: Partial<ProjectContext>;
  onCodeGenerated?: (code: string, language: string) => void;
  onPreviewReady?: (url: string) => void;
  onBuildStateChange?: (state: { isBuilding: boolean; progress: number; currentStep: string }) => void;
}

export function AIChat({ projectId, projectContext, onCodeGenerated, onPreviewReady, onBuildStateChange }: AIChatProps) {
  // Generate smart initial message based on project context
  const initialMessage = useMemo(() => {
    if (projectContext?.businessName && projectContext?.industry) {
      return buildInitialMessage({
        projectName: projectContext.projectName || projectContext.businessName,
        businessName: projectContext.businessName,
        industry: projectContext.industry,
        location: projectContext.location,
        services: projectContext.services,
        features: projectContext.features,
        existingWebsiteUrl: projectContext.existingWebsiteUrl,
        analysisData: projectContext.analysisData,
      });
    }
    return "Hi! I'm your AI assistant. I can help you build your website. Try:\n\n- Paste a URL like \"doctorsofhair.com\" and I'll analyze it\n- Ask me to create a hero section\n- Request a contact form or navigation menu\n\nWhat would you like to build?";
  }, [projectContext]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: initialMessage,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [buildComplete, setBuildComplete] = useState(false);
  const [buildSummary, setBuildSummary] = useState<BuildSummary | null>(null);
  const [estimatedTime, setEstimatedTime] = useState(30);
  const [currentStep, setCurrentStep] = useState('');
  const [buildProgress, setBuildProgress] = useState(0);
  const [siteAnalysis, setSiteAnalysis] = useState<SiteAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [developerMode, setDeveloperMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // URL detection regex - matches both full URLs and domain names
  const urlPattern = /(https?:\/\/[^\s]+)|([a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/gi;

  // Auto-analyze a URL
  const analyzeUrl = async (url: string): Promise<SiteAnalysis | null> => {
    try {
      setIsAnalyzing(true);
      setCurrentStep('Analyzing website...');
      onBuildStateChange?.({ isBuilding: true, progress: 10, currentStep: 'Analyzing website...' });

      // Ensure URL has protocol
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;

      const response = await fetch('/api/analyze-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: fullUrl }),
      });

      if (response.ok) {
        const analysis = await response.json();
        setSiteAnalysis(analysis);
        setCurrentStep('Analysis complete!');
        onBuildStateChange?.({ isBuilding: true, progress: 30, currentStep: 'Analysis complete!' });
        return analysis;
      }
    } catch (error) {
      console.error('URL analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
    return null;
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Trigger confetti celebration
  const triggerCelebration = useCallback(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Left side
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      // Right side
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }, []);

  const handleBuildComplete = useCallback(() => {
    setBuildComplete(true);
    triggerCelebration();

    // Simulate build summary (in real app, this would come from the API)
    const summary: BuildSummary = {
      filesCreated: Math.floor(Math.random() * 8) + 5,
      componentsCreated: Math.floor(Math.random() * 4) + 2,
      pagesCreated: Math.floor(Math.random() * 3) + 1,
      previewUrl: `https://${projectId}.vercel.app`, // Simulated preview URL
    };
    setBuildSummary(summary);

    if (summary.previewUrl && onPreviewReady) {
      onPreviewReady(summary.previewUrl);
    }
  }, [projectId, onPreviewReady, triggerCelebration]);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const extractCodeBlocks = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const blocks: { language: string; code: string }[] = [];
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      blocks.push({
        language: match[1] || 'text',
        code: match[2].trim(),
      });
    }

    return blocks;
  };

  // Estimate build time based on prompt complexity
  const estimateBuildTime = (prompt: string): number => {
    const wordCount = prompt.split(/\s+/).length;
    const hasMultipleComponents = prompt.toLowerCase().includes(' and ');
    const isComplexRequest =
      prompt.toLowerCase().includes('page') ||
      prompt.toLowerCase().includes('section') ||
      prompt.toLowerCase().includes('form');

    let baseTime = 20;
    if (wordCount > 20) baseTime += 10;
    if (hasMultipleComponents) baseTime += 15;
    if (isComplexRequest) baseTime += 10;

    return Math.min(baseTime, 60);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setBuildComplete(false);
    setBuildSummary(null);
    setEstimatedTime(estimateBuildTime(input));
    setBuildProgress(0);

    // Detect URLs in the message
    const urls = userMessage.content.match(urlPattern);
    let analysisData: SiteAnalysis | null = null;

    // Auto-analyze if URL detected
    if (urls && urls.length > 0) {
      setCurrentStep('Detecting website URL...');
      onBuildStateChange?.({ isBuilding: true, progress: 5, currentStep: 'Detecting website URL...' });
      analysisData = await analyzeUrl(urls[0]);
    }

    // Add placeholder for assistant response
    const assistantId = `assistant-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      },
    ]);

    setCurrentStep('Generating your website...');
    onBuildStateChange?.({ isBuilding: true, progress: 40, currentStep: 'Generating your website...' });

    try {
      // Build context with analysis data if available
      let enhancedMessage = userMessage.content;
      if (analysisData) {
        enhancedMessage = `
User wants to work with this website: ${analysisData.url}

SITE ANALYSIS DATA (already analyzed - do NOT ask for more info):
- Title: ${analysisData.title || 'N/A'}
- Description: ${analysisData.description || 'N/A'}
- Colors found: ${analysisData.colors?.map(c => c.hex).join(', ') || 'N/A'}
- Fonts: ${analysisData.fonts?.join(', ') || 'N/A'}
- Navigation items: ${analysisData.navigation?.map(n => n.text).join(', ') || 'N/A'}
- Social links: ${analysisData.socialLinks?.map(s => s.platform).join(', ') || 'N/A'}

User's request: ${userMessage.content}

IMPORTANT: You have all the data you need from the analysis above. Generate code immediately based on this data. Do NOT ask for the current code, colors, or other information - use what's provided above.`;
      }

      const response = await fetch(`/api/projects/${projectId}/build`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: enhancedMessage,
          history: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          siteAnalysis: analysisData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      setCurrentStep('Writing code...');
      onBuildStateChange?.({ isBuilding: true, progress: 60, currentStep: 'Writing code...' });

      if (reader) {
        let chunkCount = 0;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          fullContent += chunk;
          chunkCount++;

          // Update progress as we receive chunks
          const progress = Math.min(60 + (chunkCount * 2), 90);
          onBuildStateChange?.({ isBuilding: true, progress, currentStep: 'Writing code...' });

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: fullContent }
                : m
            )
          );
        }
      }

      setCurrentStep('Finalizing...');
      onBuildStateChange?.({ isBuilding: true, progress: 95, currentStep: 'Finalizing...' });

      // Mark streaming as complete
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, isStreaming: false }
            : m
        )
      );

      // Extract and notify about any code blocks
      const codeBlocks = extractCodeBlocks(fullContent);
      if (codeBlocks.length > 0 && onCodeGenerated) {
        codeBlocks.forEach((block) => {
          onCodeGenerated(block.code, block.language);
        });
      }

      // Trigger build complete celebration if code was generated
      if (codeBlocks.length > 0) {
        handleBuildComplete();
      }

      onBuildStateChange?.({ isBuilding: false, progress: 100, currentStep: 'Complete!' });
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content: 'Sorry, I encountered an error. Please try again.',
                isStreaming: false,
              }
            : m
        )
      );
      onBuildStateChange?.({ isBuilding: false, progress: 0, currentStep: '' });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderMessageContent = (message: Message) => {
    const content = message.content;

    // Parse code blocks
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    let codeBlockCount = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {content.slice(lastIndex, match.index)}
          </span>
        );
      }

      const language = match[1] || 'text';
      const code = match[2].trim();
      codeBlockCount++;

      // In developer mode, show full code blocks
      // In regular mode, show a friendly summary
      if (developerMode) {
        parts.push(
          <div
            key={`code-${match.index}`}
            className="my-3 rounded-lg overflow-hidden bg-slate-900 border border-slate-700"
          >
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
              <span className="text-xs text-slate-400 font-mono">{language}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-slate-400 hover:text-white"
                onClick={() => copyToClipboard(code, `${message.id}-${match!.index}`)}
              >
                {copiedId === `${message.id}-${match.index}` ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm max-h-[300px]">
              <code className="text-slate-300">{code}</code>
            </pre>
          </div>
        );
      } else {
        // Friendly mode - show a summary card instead of code
        parts.push(
          <div
            key={`code-${match.index}`}
            className="my-3 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium text-green-600 dark:text-green-400">
                  {language === 'html' ? 'Website section generated' : `${language.toUpperCase()} code generated`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {code.split('\n').length} lines of code ready for preview
                </p>
              </div>
            </div>
          </div>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>{content.slice(lastIndex)}</span>
      );
    }

    return parts.length > 0 ? parts : content;
  };

  return (
    <div className="flex flex-col h-full bg-background border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">AI Builder</h3>
            <p className="text-xs text-muted-foreground">
              Powered by Claude
            </p>
          </div>
        </div>

        {/* Developer Mode Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDeveloperMode(!developerMode)}
          className={`gap-2 ${developerMode ? 'bg-purple-500/10 text-purple-500' : ''}`}
        >
          {developerMode ? (
            <>
              <Code2 className="h-4 w-4" />
              <span className="text-xs">Dev Mode</span>
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              <span className="text-xs">Preview</span>
            </>
          )}
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">
                  {renderMessageContent(message)}
                  {message.isStreaming && (
                    <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
                  )}
                </div>
              </div>
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}

          {/* Build Progress */}
          {isLoading && (
            <BuildProgress
              isBuilding={isLoading}
              estimatedTime={estimatedTime}
            />
          )}

          {/* Build Complete Celebration */}
          {buildComplete && buildSummary && (
            <div className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20">
                  <PartyPopper className="h-8 w-8 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-600 dark:text-green-400">
                    Your site is ready!
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    We&apos;ve successfully built your website
                  </p>
                </div>

                {/* Build Summary */}
                <div className="flex justify-center gap-6 py-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                      <FileCode className="h-5 w-5 text-primary" />
                      {buildSummary.filesCreated}
                    </div>
                    <p className="text-xs text-muted-foreground">Files</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                      <FolderPlus className="h-5 w-5 text-primary" />
                      {buildSummary.componentsCreated}
                    </div>
                    <p className="text-xs text-muted-foreground">Components</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {buildSummary.pagesCreated}
                    </div>
                    <p className="text-xs text-muted-foreground">Pages</p>
                  </div>
                </div>

                {/* Preview Button */}
                {buildSummary.previewUrl && (
                  <Button
                    size="lg"
                    className="gap-2"
                    onClick={() => window.open(buildSummary.previewUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Preview Site
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className={`p-4 border-t ${isLoading ? 'animate-pulse bg-primary/5' : ''}`}>
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me to build something..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {isLoading
            ? `Estimated time: ~${estimatedTime} seconds`
            : 'Press Enter to send, Shift+Enter for new line'}
        </p>
      </div>
    </div>
  );
}

export default AIChat;
