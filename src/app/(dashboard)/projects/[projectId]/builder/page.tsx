"use client"

import { useState, useCallback, useRef, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AIChat } from "@/components/builder/AIChat"
import { PreviewPanel } from "@/components/builder/PreviewPanel"
import { BuildProgress } from "@/components/builder/BuildProgress"
import { createClient } from "@/lib/supabase/client"
import { detectIndustry } from "@/lib/ai/knowledge-base"
import {
  ArrowLeft,
  Eye,
  Code,
  Play,
  ExternalLink,
  Save,
  Undo,
  Redo,
  Monitor,
  Tablet,
  Smartphone,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import Link from "next/link"

type ViewportSize = "desktop" | "tablet" | "mobile"
type LayoutMode = "split" | "preview-only" | "chat-only"

interface BuildState {
  isBuilding: boolean
  progress: number
  currentStep: string
}

const DEFAULT_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
  <div class="container mx-auto px-4 py-16">
    <div class="text-center">
      <h1 class="text-5xl font-bold text-white mb-6">
        Welcome to Your Website
      </h1>
      <p class="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
        Start describing your website in the AI chat, and watch it come to life!
      </p>
      <div class="flex justify-center gap-4">
        <button class="px-6 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition">
          Get Started
        </button>
        <button class="px-6 py-3 border border-slate-500 text-white rounded-lg font-semibold hover:bg-slate-700 transition">
          Learn More
        </button>
      </div>
    </div>
  </div>
</body>
</html>`

interface Project {
  id: string
  name: string
  settings?: {
    businessName?: string
    industry?: string
    importAnalysis?: any
    analysisData?: any
    discoveryAnswers?: Record<string, string>
    selectedFeatures?: string[]
    importedFromUrl?: string
  }
}

export default function BuilderPage() {
  const params = useParams()
  const projectId = params.projectId as string
  const supabase = createClient()

  // Project data state
  const [project, setProject] = useState<Project | null>(null)
  const [projectLoading, setProjectLoading] = useState(true)

  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview")
  const [viewportSize, setViewportSize] = useState<ViewportSize>("desktop")
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("split")
  const [generatedCode, setGeneratedCode] = useState<string>(DEFAULT_CODE)
  const [codeHistory, setCodeHistory] = useState<string[]>([DEFAULT_CODE])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [buildState, setBuildState] = useState<BuildState>({
    isBuilding: false,
    progress: 0,
    currentStep: ''
  })
  const previewRef = useRef<{ refresh: () => void } | null>(null)

  // Fetch project data on mount
  useEffect(() => {
    async function fetchProject() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single()

        if (data && !error) {
          setProject(data)
        }
      } catch (err) {
        console.error('Failed to fetch project:', err)
      } finally {
        setProjectLoading(false)
      }
    }

    fetchProject()
  }, [projectId, supabase])

  // Build projectContext from fetched data
  const projectContext = useMemo(() => {
    if (!project) return undefined

    const settings = project.settings || {}
    const analysis = settings.importAnalysis || settings.analysisData || {}

    // Detect industry from analysis if not set
    const industry = settings.industry || detectIndustry(analysis)

    return {
      projectName: project.name,
      businessName: settings.businessName || analysis.businessName,
      industry,
      location: analysis.contactInfo?.address,
      phone: analysis.contactInfo?.phone,
      email: analysis.contactInfo?.email,
      services: analysis.contentSections?.filter((s: any) => s.type === 'features')?.flatMap((s: any) => s.items || []),
      features: settings.selectedFeatures,
      existingWebsiteUrl: settings.importedFromUrl,
      analysisData: analysis ? {
        title: analysis.title,
        description: analysis.description,
        issues: analysis.issues,
        strengths: analysis.strengths,
        hasBooking: analysis.contentSections?.some((s: any) =>
          s.type?.toLowerCase().includes('book') || s.type?.toLowerCase().includes('appointment')
        ),
        hasForms: analysis.contentSections?.some((s: any) =>
          s.type?.toLowerCase().includes('form') || s.type?.toLowerCase().includes('contact')
        ),
        socialLinks: analysis.socialLinks?.map((s: any) => s.platform),
      } : undefined,
    }
  }, [project])

  const handleBuildStateChange = useCallback((state: BuildState) => {
    setBuildState(state)
  }, [])

  const handleCodeGenerated = useCallback((code: string, language: string) => {
    // Wrap component code in full HTML if needed
    let fullCode = code
    if (!code.includes('<!DOCTYPE') && !code.includes('<html')) {
      fullCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
${code}
</body>
</html>`
    }

    setGeneratedCode(fullCode)
    setCodeHistory(prev => [...prev.slice(0, historyIndex + 1), fullCode])
    setHistoryIndex(prev => prev + 1)

    // Auto-switch to preview when code is generated
    setActiveTab("preview")
  }, [historyIndex])

  const handlePreviewReady = useCallback((url: string) => {
    setPreviewUrl(url)
  }, [])

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setGeneratedCode(codeHistory[newIndex])
    }
  }

  const handleRedo = () => {
    if (historyIndex < codeHistory.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setGeneratedCode(codeHistory[newIndex])
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus("saving")

    try {
      // Simulate save - in production this would save to Supabase
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (error) {
      console.error("Save failed:", error)
      setSaveStatus("idle")
    } finally {
      setIsSaving(false)
    }
  }

  const handleRefreshPreview = () => {
    // Force refresh by toggling the code slightly
    setGeneratedCode(prev => prev + " ")
    setTimeout(() => setGeneratedCode(prev => prev.trim()), 10)
  }

  const getViewportWidth = () => {
    switch (viewportSize) {
      case "mobile":
        return "375px"
      case "tablet":
        return "768px"
      default:
        return "100%"
    }
  }

  const toggleLayoutMode = () => {
    if (layoutMode === "split") {
      setLayoutMode("preview-only")
    } else if (layoutMode === "preview-only") {
      setLayoutMode("chat-only")
    } else {
      setLayoutMode("split")
    }
  }

  // Show loading state while fetching project
  if (projectLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-dark-900">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Loading Project</h2>
          <p className="text-muted-foreground">Preparing your builder...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-dark-900">
      {/* Main Content Area */}
      <div className={`flex flex-col min-w-0 transition-all duration-300 ${
        layoutMode === "chat-only" ? "w-0 opacity-0" : "flex-1"
      }`}>
        {/* Top Toolbar - Glass effect */}
        <div className="h-16 border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-6 bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-4">
            <Link href="/projects">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 dark:hover:bg-white/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6 dark:bg-white/10" />
            <div>
              <h2 className="font-semibold text-lg">Project Builder</h2>
              <p className="text-xs text-muted-foreground font-mono">ID: {projectId.slice(0, 8)}...</p>
            </div>
            <Badge className="gap-1 bg-gradient-to-r from-brand-500 to-purple-600 text-white border-0">
              <Sparkles className="h-3 w-3" />
              AI Powered
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* Undo/Redo */}
            <Button
              variant="ghost"
              size="icon"
              disabled={historyIndex === 0}
              onClick={handleUndo}
              title="Undo"
              className="rounded-full"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={historyIndex >= codeHistory.length - 1}
              onClick={handleRedo}
              title="Redo"
              className="rounded-full"
            >
              <Redo className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-6 mx-2 dark:bg-white/10" />

            {/* Viewport Controls - Premium style */}
            <div className="flex items-center bg-slate-100 dark:bg-dark-700 rounded-full p-1">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full h-8 w-8 ${viewportSize === "desktop" ? "bg-white dark:bg-dark-500 shadow-sm" : ""}`}
                onClick={() => setViewportSize("desktop")}
                title="Desktop view"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full h-8 w-8 ${viewportSize === "tablet" ? "bg-white dark:bg-dark-500 shadow-sm" : ""}`}
                onClick={() => setViewportSize("tablet")}
                title="Tablet view"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full h-8 w-8 ${viewportSize === "mobile" ? "bg-white dark:bg-dark-500 shadow-sm" : ""}`}
                onClick={() => setViewportSize("mobile")}
                title="Mobile view"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6 mx-2 dark:bg-white/10" />

            {/* Actions */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2 rounded-full"
            >
              {saveStatus === "saving" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : saveStatus === "saved" ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saveStatus === "saved" ? "Saved!" : "Save"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => window.open(`data:text/html;charset=utf-8,${encodeURIComponent(generatedCode)}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button size="sm" className="rounded-full bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 border-0">
              <Play className="h-4 w-4 mr-2" />
              Deploy
            </Button>
          </div>
        </div>

        {/* Preview/Code Area */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "preview" | "code")} className="h-full flex flex-col">
            <div className="border-b px-4 flex items-center justify-between">
              <TabsList className="h-10">
                <TabsTrigger value="preview" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="code" className="gap-2">
                  <Code className="h-4 w-4" />
                  Code
                </TabsTrigger>
              </TabsList>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLayoutMode}
                className="gap-2"
              >
                {layoutMode === "split" ? (
                  <>
                    <PanelLeftClose className="h-4 w-4" />
                    Hide Chat
                  </>
                ) : layoutMode === "preview-only" ? (
                  <>
                    <PanelLeft className="h-4 w-4" />
                    Show Chat Only
                  </>
                ) : (
                  <>
                    <PanelLeft className="h-4 w-4" />
                    Split View
                  </>
                )}
              </Button>
            </div>

            <TabsContent value="preview" className="flex-1 m-0 p-6 bg-slate-100 dark:bg-dark-900 overflow-auto">
              <div
                className="mx-auto rounded-2xl bg-white dark:bg-dark-800 shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 transition-all duration-300"
                style={{
                  width: getViewportWidth(),
                  height: "100%",
                  maxHeight: "calc(100vh - 200px)",
                }}
              >
                {/* Browser Chrome */}
                <div className="h-10 bg-slate-100 dark:bg-dark-700 flex items-center gap-2 px-4 border-b border-slate-200 dark:border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white dark:bg-dark-600 rounded-full px-4 py-1 text-xs text-muted-foreground text-center">
                      {previewUrl || 'preview.nustack.app'}
                    </div>
                  </div>
                </div>
                {/* Preview Content */}
                <div className="h-[calc(100%-2.5rem)] overflow-auto">
                  <iframe
                    srcDoc={generatedCode}
                    className="w-full h-full border-0"
                    title="Website Preview"
                    sandbox="allow-scripts allow-same-origin"
                    key={generatedCode.length}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="code" className="flex-1 m-0 overflow-auto">
              <div className="h-full bg-slate-950 p-4 relative">
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    onClick={() => navigator.clipboard.writeText(generatedCode)}
                  >
                    Copy
                  </Button>
                </div>
                <pre className="text-sm text-slate-300 font-mono overflow-auto h-full pt-8">
                  <code>{generatedCode}</code>
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* AI Chat Sidebar */}
      <div className={`border-l flex flex-col bg-background shrink-0 transition-all duration-300 ${
        layoutMode === "preview-only" ? "w-0 border-l-0 opacity-0" :
        layoutMode === "chat-only" ? "w-full max-w-2xl mx-auto border-l-0" : "w-96"
      }`}>
        {layoutMode !== "preview-only" && (
          <>
            {layoutMode === "chat-only" && (
              <div className="h-14 border-b flex items-center justify-between px-4 bg-background">
                <div className="flex items-center gap-4">
                  <Link href="/projects">
                    <Button variant="ghost" size="icon">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Separator orientation="vertical" className="h-6" />
                  <h2 className="font-semibold">AI Builder Chat</h2>
                  <Badge variant="secondary">Project: {projectId}</Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLayoutMode("split")}
                  className="gap-2"
                >
                  <PanelLeft className="h-4 w-4" />
                  Show Preview
                </Button>
              </div>
            )}
            <AIChat
              projectId={projectId}
              projectContext={projectContext}
              onCodeGenerated={handleCodeGenerated}
              onPreviewReady={handlePreviewReady}
              onBuildStateChange={handleBuildStateChange}
            />
          </>
        )}
      </div>

      {/* Collapsed Chat Toggle */}
      {layoutMode === "preview-only" && (
        <Button
          className="fixed right-4 bottom-4 shadow-lg gap-2"
          onClick={() => setLayoutMode("split")}
        >
          <Sparkles className="h-4 w-4" />
          Open AI Chat
        </Button>
      )}

      {/* Full-Screen Build Progress Overlay - Premium */}
      {buildState.isBuilding && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
          <div className="max-w-md w-full mx-4">
            {/* Animated Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center animate-pulse shadow-lg shadow-brand-500/25">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-white dark:bg-dark-800 rounded-2xl p-8 shadow-2xl border border-slate-200 dark:border-white/10">
              <h2 className="text-2xl font-bold text-center mb-2">Building Your Site</h2>
              <p className="text-center text-muted-foreground mb-6">This usually takes 30-60 seconds</p>

              {/* Animated Progress Bar */}
              <div className="relative h-3 bg-slate-200 dark:bg-dark-600 rounded-full overflow-hidden mb-6">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-500 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${buildState.progress}%` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>

              {/* Current Step */}
              <div className="flex items-center justify-center gap-3 p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
                <Loader2 className="h-5 w-5 text-brand-600 dark:text-brand-400 animate-spin" />
                <span className="font-medium text-brand-700 dark:text-brand-300">{buildState.currentStep || 'Initializing...'}</span>
              </div>

              {/* Progress percentage */}
              <p className="text-center text-sm text-muted-foreground mt-4">
                {Math.round(buildState.progress)}% complete
              </p>
            </div>

            {/* Tip */}
            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">💡 Your site will be SEO-optimized out of the box</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
