"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Globe, Calendar, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const projects = [
  {
    id: "1",
    name: "E-commerce Store",
    description: "Online store with product catalog and checkout",
    status: "deployed",
    url: "https://store.example.com",
    createdAt: "2024-01-15",
    framework: "Next.js",
  },
  {
    id: "2",
    name: "Portfolio Site",
    description: "Personal portfolio showcasing projects",
    status: "building",
    url: null,
    createdAt: "2024-01-20",
    framework: "Next.js",
  },
  {
    id: "3",
    name: "Blog Platform",
    description: "Content-driven blog with markdown support",
    status: "deployed",
    url: "https://blog.example.com",
    createdAt: "2024-01-10",
    framework: "Next.js",
  },
  {
    id: "4",
    name: "Landing Page",
    description: "Marketing landing page for product launch",
    status: "draft",
    url: null,
    createdAt: "2024-01-25",
    framework: "Next.js",
  },
]

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectDescription, setNewProjectDescription] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateProject = () => {
    // TODO: Implement project creation
    console.log("Creating project:", { name: newProjectName, description: newProjectDescription })
    setIsDialogOpen(false)
    setNewProjectName("")
    setNewProjectDescription("")
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your website projects</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Start building a new website with AI assistance
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder="My Awesome Website"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectDescription">Description</Label>
                <Textarea
                  id="projectDescription"
                  placeholder="Describe what you want to build..."
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject}>Create Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="deployed">Deployed</TabsTrigger>
          <TabsTrigger value="building">Building</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="mt-1">{project.description}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        project.status === "deployed"
                          ? "default"
                          : project.status === "building"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {project.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{project.framework}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {project.url && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        <span className="truncate max-w-[150px]">{project.url}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{project.createdAt}</span>
                    </div>
                  </div>

                  <Link href={`/projects/${project.id}/builder`}>
                    <Button className="w-full" variant="outline">
                      Open Builder
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deployed">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects
              .filter((p) => p.status === "deployed")
              .map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/projects/${project.id}/builder`}>
                      <Button className="w-full" variant="outline">
                        Open Builder
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="building">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects
              .filter((p) => p.status === "building")
              .map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/projects/${project.id}/builder`}>
                      <Button className="w-full" variant="outline">
                        Open Builder
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="draft">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects
              .filter((p) => p.status === "draft")
              .map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/projects/${project.id}/builder`}>
                      <Button className="w-full" variant="outline">
                        Open Builder
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
