"use client"

import { useState, useCallback, useRef } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AIChat } from "@/components/builder/AIChat"
import { PreviewPanel } from "@/components/builder/PreviewPanel"
import { BuildProgress } from "@/components/builder/BuildProgress"
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

export default function BuilderPage() {
  const params = useParams()
  const projectId = params.projectId as string
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

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Content Area */}
      <div className={`flex flex-col min-w-0 transition-all duration-300 ${
        layoutMode === "chat-only" ? "w-0 opacity-0" : "flex-1"
      }`}>
        {/* Top Toolbar */}
        <div className="h-14 border-b flex items-center justify-between px-4 bg-background shrink-0">
          <div className="flex items-center gap-4">
            <Link href="/projects">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h2 className="font-semibold">Project Builder</h2>
              <p className="text-xs text-muted-foreground">Project ID: {projectId}</p>
            </div>
            <Badge variant="secondary" className="gap-1">
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
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={historyIndex >= codeHistory.length - 1}
              onClick={handleRedo}
              title="Redo"
            >
              <Redo className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-6 mx-2" />

            {/* Viewport Controls */}
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewportSize === "desktop" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-r-none"
                onClick={() => setViewportSize("desktop")}
                title="Desktop view"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={viewportSize === "tablet" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-none border-x"
                onClick={() => setViewportSize("tablet")}
                title="Tablet view"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={viewportSize === "mobile" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-l-none"
                onClick={() => setViewportSize("mobile")}
                title="Mobile view"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6 mx-2" />

            {/* Actions */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2"
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
              onClick={() => window.open(`data:text/html;charset=utf-8,${encodeURIComponent(generatedCode)}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button size="sm">
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

            <TabsContent value="preview" className="flex-1 m-0 p-4 bg-muted/30 overflow-auto">
              <div
                className="mx-auto bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300"
                style={{
                  width: getViewportWidth(),
                  height: "100%",
                  maxHeight: "calc(100vh - 180px)",
                }}
              >
                <iframe
                  srcDoc={generatedCode}
                  className="w-full h-full border-0"
                  title="Website Preview"
                  sandbox="allow-scripts allow-same-origin"
                  key={generatedCode.length} // Force re-render on code change
                />
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

      {/* Full-Screen Build Progress Overlay */}
      {buildState.isBuilding && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl">
            <BuildProgress
              isBuilding={buildState.isBuilding}
              currentStep={buildState.currentStep}
              progress={buildState.progress}
              estimatedTime={30}
            />
          </div>
        </div>
      )}
    </div>
  )
}
