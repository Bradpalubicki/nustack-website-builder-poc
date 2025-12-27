import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Plus, FolderKanban, Globe, Activity, FolderPlus, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch real projects from database
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  // Calculate stats from real data
  const totalProjects = projects?.length || 0
  const deployedSites = projects?.filter(p => p.status === 'deployed').length || 0
  const buildingProjects = projects?.filter(p => p.status === 'building').length || 0

  const stats = [
    {
      name: "Total Projects",
      value: totalProjects.toString(),
      icon: FolderKanban,
      change: totalProjects > 0 ? "Active projects" : "No projects yet"
    },
    {
      name: "Deployed Sites",
      value: deployedSites.toString(),
      icon: Globe,
      change: deployedSites > 0 ? "Live on the web" : "None deployed"
    },
    {
      name: "In Progress",
      value: buildingProjects.toString(),
      icon: Activity,
      change: buildingProjects > 0 ? "Currently building" : "None building"
    },
  ]

  // Get user's first name for greeting
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'there'

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {firstName}!
          </h1>
          <p className="text-muted-foreground">
            {totalProjects > 0
              ? "Here's an overview of your projects."
              : "Let's build your first website."}
          </p>
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

      {/* Recent Projects or Empty State */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
          <CardDescription>Your latest website projects</CardDescription>
        </CardHeader>
        <CardContent>
          {!projects || projects.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {projects.slice(0, 5).map((project) => (
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
                    {project.description && (
                      <p className="text-sm text-muted-foreground mt-1 truncate max-w-md">
                        {project.description}
                      </p>
                    )}
                    {project.settings?.domain && (
                      <p className="text-sm text-blue-600 mt-1">
                        {project.settings.domain}
                      </p>
                    )}
                    {project.status === "building" && (
                      <div className="mt-2 w-48">
                        <Progress value={65} className="h-2" />
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <FolderPlus className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        Create your first website to get started. Describe what you want and let AI build it for you.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Site
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/projects/new">
            <Sparkles className="mr-2 h-4 w-4" />
            Import Existing Site
          </Link>
        </Button>
      </div>
    </div>
  )
}
