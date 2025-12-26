'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  Info,
  Zap,
  RefreshCw,
  MapPin,
  FileText,
  Code,
  Award,
  TrendingUp,
  ChevronRight,
  Wrench,
  Clock,
  Target,
} from 'lucide-react';
import Link from 'next/link';

// Mock data for demo
const mockAuditResult = {
  score: 78,
  timestamp: new Date().toISOString(),
  projectId: 'demo-project',
  breakdown: {
    technical: { score: 85, weight: 0.25, passed: 12, failed: 1, warnings: 2, issues: [] },
    content: { score: 78, weight: 0.25, passed: 10, failed: 1, warnings: 2, issues: [] },
    localSeo: { score: 72, weight: 0.25, passed: 8, failed: 2, warnings: 1, issues: [] },
    schema: { score: 80, weight: 0.15, passed: 9, failed: 0, warnings: 2, issues: [] },
    eeat: { score: 75, weight: 0.10, passed: 6, failed: 0, warnings: 2, issues: [] },
  },
  issues: [
    {
      id: 'local-1',
      type: 'critical' as const,
      category: 'local_seo',
      code: 'MISSING_NAP',
      title: 'NAP not on all pages',
      description: 'Name, Address, and Phone number are not visible in the footer of 3 pages.',
      affectedPages: ['/health-library/article-1', '/health-library/article-2', '/book-appointment'],
      howToFix: 'Add the business NAP information to the footer component on all pages.',
      autoFixAvailable: false,
      impact: 'high' as const,
      effort: 'low' as const,
    },
    {
      id: 'eeat-1',
      type: 'warning' as const,
      category: 'eeat',
      code: 'MISSING_MEDICAL_REVIEWER',
      title: 'Articles missing medical reviewer',
      description: '4 health articles are missing a medical reviewer attribution.',
      affectedPages: ['/health-library/article-1', '/health-library/article-2'],
      howToFix: 'Add medical reviewer badge to all health articles.',
      autoFixAvailable: true,
      autoFixAction: '/api/healthcare/auto-fix',
      impact: 'high' as const,
      effort: 'low' as const,
    },
    {
      id: 'tech-1',
      type: 'warning' as const,
      category: 'technical',
      code: 'META_TITLE_LENGTH',
      title: 'Meta titles need optimization',
      description: '3 pages have meta titles outside the optimal 50-60 character range.',
      affectedPages: ['/treatments/ed', '/treatments/trt', '/about'],
      howToFix: 'Edit the meta titles to be between 50-60 characters.',
      autoFixAvailable: true,
      autoFixAction: '/api/healthcare/auto-fix',
      impact: 'medium' as const,
      effort: 'low' as const,
    },
    {
      id: 'schema-1',
      type: 'warning' as const,
      category: 'schema',
      code: 'MISSING_FAQ_SCHEMA',
      title: 'Missing FAQPage schema',
      description: '3 pages with FAQ sections are missing FAQPage structured data.',
      affectedPages: ['/treatments/ed', '/treatments/trt', '/treatments/weight-loss'],
      howToFix: 'Add FAQPage schema markup to pages that contain FAQ sections.',
      autoFixAvailable: true,
      autoFixAction: '/api/healthcare/auto-fix',
      impact: 'medium' as const,
      effort: 'low' as const,
    },
    {
      id: 'local-2',
      type: 'warning' as const,
      category: 'local_seo',
      code: 'MISSING_LOCATION_PAGES',
      title: 'Location×Service pages incomplete',
      description: '4 location×service combinations are missing dedicated pages.',
      affectedPages: [],
      howToFix: 'Generate local SEO pages for all location and service combinations.',
      autoFixAvailable: true,
      autoFixAction: '/api/healthcare/generate-local-pages',
      impact: 'high' as const,
      effort: 'medium' as const,
    },
    {
      id: 'content-1',
      type: 'info' as const,
      category: 'content',
      code: 'THIN_CONTENT',
      title: 'Thin content detected',
      description: '2 service pages have less than 500 words of content.',
      affectedPages: ['/treatments/b12-injections', '/treatments/nutritional-counseling'],
      howToFix: 'Expand the content to at least 500 words with helpful, relevant information.',
      autoFixAvailable: false,
      impact: 'medium' as const,
      effort: 'medium' as const,
    },
  ],
  recommendations: [
    {
      priority: 1,
      title: 'Fix critical SEO issues',
      description: 'You have 1 critical issue that needs immediate attention.',
      expectedImpact: 'High - fixing these will significantly improve search rankings',
      relatedIssues: ['local-1'],
    },
    {
      priority: 2,
      title: 'Apply automatic fixes',
      description: '4 issues can be automatically fixed. This is a quick win.',
      expectedImpact: 'Medium - quick improvements with minimal effort',
      relatedIssues: ['eeat-1', 'tech-1', 'schema-1', 'local-2'],
    },
    {
      priority: 3,
      title: 'Address quick wins',
      description: '3 high-impact, low-effort improvements available.',
      expectedImpact: 'High - significant improvement with minimal time investment',
      relatedIssues: ['local-1', 'eeat-1', 'tech-1'],
    },
  ],
};

const categoryConfig = {
  technical: { icon: Code, label: 'Technical', color: 'text-blue-500' },
  content: { icon: FileText, label: 'Content', color: 'text-green-500' },
  local_seo: { icon: MapPin, label: 'Local SEO', color: 'text-orange-500' },
  schema: { icon: Code, label: 'Schema', color: 'text-purple-500' },
  eeat: { icon: Award, label: 'E-E-A-T', color: 'text-pink-500' },
};

function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-500';
  if (score >= 70) return 'text-yellow-500';
  if (score >= 50) return 'text-orange-500';
  return 'text-red-500';
}

function getScoreGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

function getSeverityIcon(type: 'critical' | 'warning' | 'info') {
  switch (type) {
    case 'critical':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'info':
      return <Info className="h-4 w-4 text-blue-500" />;
  }
}

function getSeverityBadge(type: 'critical' | 'warning' | 'info') {
  const variants = {
    critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  };

  return (
    <Badge className={variants[type]} variant="outline">
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  );
}

export default function SEODashboardPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const auditResult = mockAuditResult;

  const stats = {
    criticalIssues: auditResult.issues.filter((i) => i.type === 'critical').length,
    warningIssues: auditResult.issues.filter((i) => i.type === 'warning').length,
    infoIssues: auditResult.issues.filter((i) => i.type === 'info').length,
    autoFixable: auditResult.issues.filter((i) => i.autoFixAvailable).length,
  };

  const handleRunAudit = async () => {
    setIsRunning(true);
    // Simulate audit running
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRunning(false);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SEO Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and improve your healthcare website&apos;s search visibility.
          </p>
        </div>
        <Button onClick={handleRunAudit} disabled={isRunning}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? 'Running Audit...' : 'Run Full Audit'}
        </Button>
      </div>

      {/* Score Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className={`text-5xl font-bold ${getScoreColor(auditResult.score)}`}>
                {auditResult.score}
              </div>
              <div className="flex flex-col">
                <Badge variant="outline" className={getScoreColor(auditResult.score)}>
                  Grade: {getScoreGrade(auditResult.score)}
                </Badge>
                <span className="text-xs text-muted-foreground mt-1">
                  Last audit: {new Date(auditResult.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Critical Issues
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.criticalIssues}</div>
            <p className="text-xs text-muted-foreground">Needs immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats.warningIssues}</div>
            <p className="text-xs text-muted-foreground">Should be addressed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Auto-Fixable
            </CardTitle>
            <Zap className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.autoFixable}</div>
            <p className="text-xs text-muted-foreground">Quick wins available</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Performance across different SEO categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(auditResult.breakdown).map(([key, category]) => {
              const config = categoryConfig[key as keyof typeof categoryConfig] || {
                icon: Search,
                label: key,
                color: 'text-gray-500',
              };
              const Icon = config.icon;

              return (
                <div key={key} className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg bg-muted ${config.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{config.label}</span>
                      <span className={`font-bold ${getScoreColor(category.score)}`}>
                        {category.score}%
                      </span>
                    </div>
                    <Progress value={category.score} className="h-2" />
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        {category.passed} passed
                      </span>
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-yellow-500" />
                        {category.warnings} warnings
                      </span>
                      {category.failed > 0 && (
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-red-500" />
                          {category.failed} failed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Issues and Recommendations */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Recommendations</TabsTrigger>
          <TabsTrigger value="issues">All Issues ({auditResult.issues.length})</TabsTrigger>
          <TabsTrigger value="quick-wins">Quick Wins</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          {auditResult.recommendations.map((rec) => (
            <Alert key={rec.priority} className="border-l-4 border-l-primary">
              <Target className="h-4 w-4" />
              <AlertTitle className="flex items-center gap-2">
                <Badge variant="outline">Priority {rec.priority}</Badge>
                {rec.title}
              </AlertTitle>
              <AlertDescription className="mt-2">
                <p>{rec.description}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  {rec.expectedImpact}
                </p>
              </AlertDescription>
            </Alert>
          ))}
        </TabsContent>

        <TabsContent value="issues" className="mt-4 space-y-4">
          {auditResult.issues.map((issue) => (
            <Card key={issue.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(issue.type)}
                    <CardTitle className="text-base">{issue.title}</CardTitle>
                    {getSeverityBadge(issue.type)}
                  </div>
                  {issue.autoFixAvailable && (
                    <Button size="sm" variant="outline">
                      <Wrench className="h-3 w-3 mr-1" />
                      Auto-Fix
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{issue.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary">
                    Impact: {issue.impact}
                  </Badge>
                  <Badge variant="secondary">
                    <Clock className="h-3 w-3 mr-1" />
                    Effort: {issue.effort}
                  </Badge>
                </div>
                {issue.affectedPages && issue.affectedPages.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium">Affected pages:</span>
                    <ul className="list-disc list-inside text-muted-foreground mt-1">
                      {issue.affectedPages.slice(0, 3).map((page) => (
                        <li key={page}>{page}</li>
                      ))}
                      {issue.affectedPages.length > 3 && (
                        <li>+{issue.affectedPages.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <span className="font-medium text-sm">How to fix:</span>
                  <p className="text-sm text-muted-foreground mt-1">{issue.howToFix}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="quick-wins" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {auditResult.issues
              .filter((i) => i.impact === 'high' && i.effort === 'low')
              .map((issue) => (
                <Card key={issue.id} className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{issue.title}</CardTitle>
                      {getSeverityBadge(issue.type)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{issue.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-green-600">
                          High Impact
                        </Badge>
                        <Badge variant="outline" className="text-green-600">
                          Low Effort
                        </Badge>
                      </div>
                      {issue.autoFixAvailable && (
                        <Button size="sm">
                          <Zap className="h-3 w-3 mr-1" />
                          Fix Now
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common healthcare SEO tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-auto py-4 justify-start">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
                  <MapPin className="h-4 w-4 text-orange-500" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Generate Local Pages</div>
                  <div className="text-xs text-muted-foreground">
                    Create location×service pages
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 ml-auto" />
              </div>
            </Button>

            <Button variant="outline" className="h-auto py-4 justify-start">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <Code className="h-4 w-4 text-purple-500" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Add Schema Markup</div>
                  <div className="text-xs text-muted-foreground">
                    Enhance structured data
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 ml-auto" />
              </div>
            </Button>

            <Button variant="outline" className="h-auto py-4 justify-start">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900">
                  <Award className="h-4 w-4 text-pink-500" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Add E-E-A-T Signals</div>
                  <div className="text-xs text-muted-foreground">
                    Improve trust signals
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 ml-auto" />
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
