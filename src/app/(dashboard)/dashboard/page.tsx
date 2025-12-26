import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Plus, FolderKanban, Globe, Activity } from "lucide-react"

const stats = [
  { name: "Total Projects", value: "12", icon: FolderKanban, change: "+2 this month" },
  { name: "Deployed Sites", value: "8", icon: Globe, change: "Active" },
  { name: "Build Minutes", value: "234", icon: Activity, change: "This month" },
]

const recentProjects = [
  { id: "1", name: "E-commerce Store", status: "deployed", progress: 100, url: "https://store.example.com" },
  { id: "2", name: "Portfolio Site", status: "building", progress: 65, url: null },
  { id: "3", name: "Blog Platform", status: "deployed", progress: 100, url: "https://blog.example.com" },
  { id: "4", name: "Landing Page", status: "draft", progress: 30, url: null },
]

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s an overview of your projects.</p>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
          <CardDescription>Your latest website projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{project.name}</h3>
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
                  </div>
                  {project.url && (
                    <p className="text-sm text-muted-foreground mt-1">{project.url}</p>
                  )}
                  {project.status === "building" && (
                    <div className="mt-2 w-48">
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  )}
                </div>
                <Link href={`/projects/${project.id}/builder`}>
                  <Button variant="outline" size="sm">
                    Open Builder
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
