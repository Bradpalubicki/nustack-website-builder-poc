'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  Globe,
  Calendar,
  MoreVertical,
  Loader2,
  RefreshCw,
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: 'draft' | 'building' | 'deployed';
  template_id: string;
  settings: {
    domain?: string;
    industry?: string;
    businessName?: string;
    primaryColor?: string;
  };
  created_at: string;
  updated_at: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your website projects</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchProjects}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Link href="/projects/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/50 text-red-600 rounded-md">
          {error}
          <Button
            variant="link"
            className="ml-2 text-red-600"
            onClick={fetchProjects}
          >
            Try again
          </Button>
        </div>
      )}

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

      {/* Empty State */}
      {projects.length === 0 && !error && (
        <Card className="p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
          <p className="text-muted-foreground mb-4">
            Create your first project to get started building with AI.
          </p>
          <Link href="/projects/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Project
            </Button>
          </Link>
        </Card>
      )}

      {/* Tabs */}
      {projects.length > 0 && (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Projects ({projects.length})</TabsTrigger>
            <TabsTrigger value="deployed">
              Deployed ({projects.filter((p) => p.status === 'deployed').length})
            </TabsTrigger>
            <TabsTrigger value="building">
              Building ({projects.filter((p) => p.status === 'building').length})
            </TabsTrigger>
            <TabsTrigger value="draft">
              Drafts ({projects.filter((p) => p.status === 'draft').length})
            </TabsTrigger>
          </TabsList>

          {['all', 'deployed', 'building', 'draft'].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects
                  .filter((p) => tabValue === 'all' || p.status === tabValue)
                  .map((project) => (
                    <Card
                      key={project.id}
                      className="hover:border-primary/50 transition-colors"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{project.name}</CardTitle>
                            <CardDescription className="mt-1">
                              {project.description || 'No description'}
                            </CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/projects/${project.id}/builder`}>
                                  Open Builder
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/projects/${project.id}/settings`}>
                                  Settings
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteProject(project.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              project.status === 'deployed'
                                ? 'default'
                                : project.status === 'building'
                                  ? 'secondary'
                                  : 'outline'
                            }
                          >
                            {project.status}
                          </Badge>
                          {project.settings?.industry && (
                            <span className="text-xs text-muted-foreground">
                              {project.settings.industry}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {project.settings?.domain && (
                            <div className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              <span className="truncate max-w-[150px]">
                                {project.settings.domain}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(project.created_at)}</span>
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
          ))}
        </Tabs>
      )}
    </div>
  );
}
