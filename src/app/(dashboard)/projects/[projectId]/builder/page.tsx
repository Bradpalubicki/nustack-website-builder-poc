"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AIChat } from "@/components/ai-chat"
import {
  ArrowLeft,
  Eye,
  Code,
  Settings,
  Play,
  ExternalLink,
  Save,
  Undo,
  Redo,
  Monitor,
  Tablet,
  Smartphone,
} from "lucide-react"
import Link from "next/link"

type ViewportSize = "desktop" | "tablet" | "mobile"

export default function BuilderPage() {
  const params = useParams()
  const projectId = params.projectId as string
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview")
  const [viewportSize, setViewportSize] = useState<ViewportSize>("desktop")
  const [generatedCode, setGeneratedCode] = useState<string>(`
<!DOCTYPE html>
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
</html>
  `)

  const handleCodeGenerated = (code: string) => {
    // In a real implementation, this would update the preview
    console.log("Code generated:", code)
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

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
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
            <Badge variant="secondary">Draft</Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* Undo/Redo */}
            <Button variant="ghost" size="icon" disabled>
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" disabled>
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
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={viewportSize === "tablet" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-none border-x"
                onClick={() => setViewportSize("tablet")}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={viewportSize === "mobile" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-l-none"
                onClick={() => setViewportSize("mobile")}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6 mx-2" />

            {/* Actions */}
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
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
            <div className="border-b px-4">
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
                  sandbox="allow-scripts"
                />
              </div>
            </TabsContent>

            <TabsContent value="code" className="flex-1 m-0 overflow-auto">
              <div className="h-full bg-slate-950 p-4">
                <pre className="text-sm text-slate-300 font-mono overflow-auto h-full">
                  <code>{generatedCode}</code>
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* AI Chat Sidebar */}
      <div className="w-96 border-l flex flex-col bg-background shrink-0">
        <AIChat projectId={projectId} onCodeGenerated={handleCodeGenerated} />
      </div>
    </div>
  )
}
