'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Github,
  Globe,
  Upload,
  ExternalLink,
  AlertCircle,
  FileCode,
  Folder,
  Palette,
  Search,
  CheckCircle2,
  XCircle,
  Building2,
  Phone,
  Mail,
  MapPin,
  Image,
  Type,
  Share2,
  LayoutGrid,
  Sparkles,
  Settings,
  Target,
  Users,
  MessageSquare,
} from 'lucide-react';

interface ImportExistingWizardProps {
  onComplete: (projectId: string) => void;
  onBack: () => void;
  onCancel: () => void;
}

type ImportMethod = 'github' | 'url' | 'upload';
type WizardStep = 'method' | 'source' | 'analysis' | 'discovery' | 'settings' | 'confirm' | 'creating';

interface PageInfo {
  path: string;
  title?: string;
  isNavigation: boolean;
}

interface ColorInfo {
  hex: string;
  usage: 'primary' | 'secondary' | 'accent' | 'background' | 'text' | 'unknown';
  frequency: number;
}

interface ImageInfo {
  src: string;
  alt?: string;
  isLogo: boolean;
  isHero: boolean;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface NavigationItem {
  label: string;
  href: string;
}

interface ContentSection {
  type: string;
  heading?: string;
}

interface AnalyticsInfo {
  hasGoogleAnalytics: boolean;
  hasGoogleTagManager: boolean;
  hasFacebookPixel: boolean;
  hasHotjar: boolean;
}

interface SiteAnalysis {
  title?: string;
  description?: string;
  businessName?: string;
  pages: PageInfo[];
  techStack: string[];
  colors: ColorInfo[];
  fonts: string[];
  images: ImageInfo[];
  socialLinks: SocialLink[];
  navigation: NavigationItem[];
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
    formUrl?: string;
  };
  seoSettings?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    ogImage?: string;
    canonical?: string;
  };
  contentSections: ContentSection[];
  analytics?: AnalyticsInfo;
}

interface DiscoveryAnswers {
  businessGoal: string;
  targetAudience: string;
  keyDifferentiator: string;
  wantToChange: string;
  additionalFeatures: string[];
}

interface ImportData {
  method: ImportMethod | null;
  githubUrl: string;
  websiteUrl: string;
  uploadedFile: File | null;
  analysis: SiteAnalysis | null;
  projectName: string;
  businessName: string;
  domain: string;
  discovery: DiscoveryAnswers;
}

const IMPORT_METHODS = [
  {
    id: 'github' as ImportMethod,
    title: 'Connect GitHub Repo',
    description: 'Import an existing repository from GitHub',
    icon: Github,
    color: 'text-slate-900 dark:text-white',
    bgColor: 'bg-slate-100 dark:bg-slate-800',
  },
  {
    id: 'url' as ImportMethod,
    title: 'Enter Website URL',
    description: 'We\'ll analyze and recreate your existing site',
    icon: Globe,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    id: 'upload' as ImportMethod,
    title: 'Upload Code',
    description: 'Drag & drop a zip file with your project',
    icon: Upload,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
];

const ADDITIONAL_FEATURES = [
  { id: 'blog', label: 'Blog / News Section', icon: FileCode },
  { id: 'ecommerce', label: 'E-commerce / Online Store', icon: LayoutGrid },
  { id: 'booking', label: 'Appointment Booking', icon: Users },
  { id: 'chat', label: 'Live Chat Widget', icon: MessageSquare },
  { id: 'analytics', label: 'Advanced Analytics', icon: Target },
  { id: 'seo', label: 'SEO Optimization', icon: Search },
];

export function ImportExistingWizard({
  onComplete,
  onBack,
  onCancel,
}: ImportExistingWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('method');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [analyzeStage, setAnalyzeStage] = useState('');

  const [importData, setImportData] = useState<ImportData>({
    method: null,
    githubUrl: '',
    websiteUrl: '',
    uploadedFile: null,
    analysis: null,
    projectName: '',
    businessName: '',
    domain: '',
    discovery: {
      businessGoal: '',
      targetAudience: '',
      keyDifferentiator: '',
      wantToChange: '',
      additionalFeatures: [],
    },
  });

  const handleMethodSelect = (method: ImportMethod) => {
    setImportData((prev) => ({ ...prev, method }));
    setCurrentStep('source');
  };

  const validateGitHubUrl = (url: string): boolean => {
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
    return githubRegex.test(url);
  };

  const validateWebsiteUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleAnalyzeSite = async () => {
    setError(null);
    setIsAnalyzing(true);
    setAnalyzeProgress(0);

    const stages = [
      'Connecting to site...',
      'Extracting content...',
      'Analyzing colors & fonts...',
      'Detecting tech stack...',
      'Mapping navigation...',
      'Scanning social links...',
      'Finalizing analysis...',
    ];

    try {
      let stageIndex = 0;
      const progressInterval = setInterval(() => {
        setAnalyzeProgress((prev) => Math.min(prev + 12, 90));
        if (stageIndex < stages.length) {
          setAnalyzeStage(stages[stageIndex]);
          stageIndex++;
        }
      }, 600);

      let url = '';
      if (importData.method === 'github') {
        if (!validateGitHubUrl(importData.githubUrl)) {
          throw new Error('Please enter a valid GitHub repository URL');
        }
        url = importData.githubUrl;
      } else if (importData.method === 'url') {
        if (!validateWebsiteUrl(importData.websiteUrl)) {
          throw new Error('Please enter a valid website URL');
        }
        url = importData.websiteUrl;
      }

      const response = await fetch('/api/analyze-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          method: importData.method,
        }),
      });

      clearInterval(progressInterval);
      setAnalyzeProgress(100);
      setAnalyzeStage('Analysis complete!');

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to analyze site');
      }

      const { analysis } = await response.json();

      setImportData((prev) => ({
        ...prev,
        analysis,
        projectName: analysis?.title || extractNameFromUrl(url),
        businessName: analysis?.businessName || '',
      }));

      setCurrentStep('analysis');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze site');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const extractNameFromUrl = (url: string): string => {
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname.replace(/^www\./, '');
      return hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1);
    } catch {
      return 'Imported Project';
    }
  };

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportData((prev) => ({
        ...prev,
        uploadedFile: file,
        projectName: file.name.replace(/\.zip$/, ''),
      }));
      setCurrentStep('discovery');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.zip')) {
      setImportData((prev) => ({
        ...prev,
        uploadedFile: file,
        projectName: file.name.replace(/\.zip$/, ''),
      }));
      setCurrentStep('discovery');
    } else {
      setError('Please upload a ZIP file');
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const toggleFeature = (featureId: string) => {
    setImportData((prev) => ({
      ...prev,
      discovery: {
        ...prev.discovery,
        additionalFeatures: prev.discovery.additionalFeatures.includes(featureId)
          ? prev.discovery.additionalFeatures.filter((f) => f !== featureId)
          : [...prev.discovery.additionalFeatures, featureId],
      },
    }));
  };

  const handleCreate = async () => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: importData.projectName,
          description: importData.analysis?.description || '',
          templateId: 'imported',
          settings: {
            domain: importData.domain,
            businessName: importData.businessName,
            importedFromUrl: importData.method === 'url' ? importData.websiteUrl : undefined,
            importedFromRepo: importData.method === 'github' ? importData.githubUrl : undefined,
            importAnalysis: importData.analysis,
            discoveryAnswers: importData.discovery,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create project');
      }

      const { project } = await response.json();
      onComplete(project.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsCreating(false);
    }
  };

  const getStepNumber = () => {
    const steps = ['method', 'source', 'analysis', 'discovery', 'settings', 'confirm'];
    return steps.indexOf(currentStep) + 1;
  };

  const getTotalSteps = () => {
    return importData.method === 'upload' ? 5 : 6;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Import Existing Site</h1>
            <p className="text-muted-foreground mt-2">
              Connect your existing website or repository
            </p>
          </div>
          {currentStep !== 'method' && currentStep !== 'creating' && (
            <Badge variant="outline" className="text-sm">
              Step {getStepNumber()} of {getTotalSteps()}
            </Badge>
          )}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {/* Step 1: Choose Import Method */}
          {currentStep === 'method' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">Choose Import Method</h2>
                <p className="text-muted-foreground mt-2">
                  How would you like to import your existing site?
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {IMPORT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handleMethodSelect(method.id)}
                    className={`group p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                      importData.method === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg ${method.bgColor} flex items-center justify-center mb-4`}>
                      <method.icon className={`h-6 w-6 ${method.color}`} />
                    </div>
                    <h3 className="font-semibold">{method.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {method.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Source Details */}
          {currentStep === 'source' && (
            <div className="space-y-6">
              {/* GitHub Import */}
              {importData.method === 'github' && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Github className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Connect GitHub Repository</h2>
                      <p className="text-sm text-muted-foreground">
                        Enter your repository URL
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="githubUrl">Repository URL</Label>
                      <Input
                        id="githubUrl"
                        placeholder="https://github.com/username/repository"
                        value={importData.githubUrl}
                        onChange={(e) =>
                          setImportData((prev) => ({
                            ...prev,
                            githubUrl: e.target.value,
                          }))
                        }
                      />
                      {importData.githubUrl && !validateGitHubUrl(importData.githubUrl) && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          Please enter a valid GitHub URL
                        </p>
                      )}
                      {importData.githubUrl && validateGitHubUrl(importData.githubUrl) && (
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                          Valid GitHub repository URL
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={handleAnalyzeSite}
                      disabled={!importData.githubUrl || !validateGitHubUrl(importData.githubUrl) || isAnalyzing}
                      className="w-full"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing Repository...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Analyze Repository
                        </>
                      )}
                    </Button>

                    {isAnalyzing && (
                      <div className="space-y-2">
                        <Progress value={analyzeProgress} className="h-2" />
                        <p className="text-sm text-center text-muted-foreground">
                          {analyzeStage}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* URL Import */}
              {importData.method === 'url' && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Globe className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Analyze Website</h2>
                      <p className="text-sm text-muted-foreground">
                        We&apos;ll scan your site and extract content
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="websiteUrl">Website URL</Label>
                      <Input
                        id="websiteUrl"
                        placeholder="https://example.com"
                        value={importData.websiteUrl}
                        onChange={(e) =>
                          setImportData((prev) => ({
                            ...prev,
                            websiteUrl: e.target.value,
                          }))
                        }
                      />
                      {importData.websiteUrl && !validateWebsiteUrl(importData.websiteUrl) && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          Please enter a valid URL (include https://)
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={handleAnalyzeSite}
                      disabled={!importData.websiteUrl || !validateWebsiteUrl(importData.websiteUrl) || isAnalyzing}
                      className="w-full"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing Website...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Analyze Site
                        </>
                      )}
                    </Button>

                    {isAnalyzing && (
                      <div className="space-y-2">
                        <Progress value={analyzeProgress} className="h-2" />
                        <p className="text-sm text-center text-muted-foreground">
                          {analyzeStage}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Upload Import */}
              {importData.method === 'upload' && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Upload className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Upload Your Code</h2>
                      <p className="text-sm text-muted-foreground">
                        Drag & drop a ZIP file with your project
                      </p>
                    </div>
                  </div>

                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-muted rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <input
                      type="file"
                      accept=".zip"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                        <Upload className="h-8 w-8 text-purple-600" />
                      </div>
                      {importData.uploadedFile ? (
                        <div className="space-y-2">
                          <p className="font-semibold text-green-600 flex items-center justify-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            {importData.uploadedFile.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {(importData.uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="font-semibold">Drop your ZIP file here</p>
                          <p className="text-sm text-muted-foreground">
                            or click to browse
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3: Analysis Results */}
          {currentStep === 'analysis' && importData.analysis && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Analysis Complete!</h2>
                  <p className="text-sm text-muted-foreground">
                    Here&apos;s what we found on your site
                  </p>
                </div>
              </div>

              {/* Analysis Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Business Info */}
                <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Building2 className="h-4 w-4 text-primary" />
                    Business Info
                  </div>
                  {importData.analysis.businessName && (
                    <p className="text-sm"><span className="text-muted-foreground">Name:</span> {importData.analysis.businessName}</p>
                  )}
                  {importData.analysis.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{importData.analysis.description}</p>
                  )}
                  {importData.analysis.contactInfo?.email && (
                    <p className="text-sm flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {importData.analysis.contactInfo.email}
                    </p>
                  )}
                  {importData.analysis.contactInfo?.phone && (
                    <p className="text-sm flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {importData.analysis.contactInfo.phone}
                    </p>
                  )}
                  {importData.analysis.contactInfo?.address && (
                    <p className="text-sm flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {importData.analysis.contactInfo.address}
                    </p>
                  )}
                </div>

                {/* Tech Stack */}
                <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <FileCode className="h-4 w-4 text-primary" />
                    Tech Stack
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {importData.analysis.techStack.map((tech, i) => (
                      <Badge key={i} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                </div>

                {/* Pages */}
                <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Folder className="h-4 w-4 text-primary" />
                    Pages Detected ({importData.analysis.pages.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {importData.analysis.pages.slice(0, 8).map((page, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {typeof page === 'string' ? page : page.path}
                      </Badge>
                    ))}
                    {importData.analysis.pages.length > 8 && (
                      <Badge variant="outline" className="text-xs">
                        +{importData.analysis.pages.length - 8} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Navigation */}
                {importData.analysis.navigation.length > 0 && (
                  <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <LayoutGrid className="h-4 w-4 text-primary" />
                      Navigation
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {importData.analysis.navigation.map((item, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {item.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colors */}
                {importData.analysis.colors.length > 0 && (
                  <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Palette className="h-4 w-4 text-primary" />
                      Brand Colors
                    </div>
                    <div className="flex gap-2">
                      {importData.analysis.colors.slice(0, 6).map((color, i) => (
                        <div key={i} className="text-center">
                          <div
                            className="w-10 h-10 rounded-lg border shadow-sm"
                            style={{ backgroundColor: color.hex }}
                            title={`${color.hex} (${color.usage})`}
                          />
                          <p className="text-[10px] mt-1 text-muted-foreground">
                            {color.usage !== 'unknown' ? color.usage : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fonts */}
                {importData.analysis.fonts.length > 0 && (
                  <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Type className="h-4 w-4 text-primary" />
                      Fonts
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {importData.analysis.fonts.map((font, i) => (
                        <Badge key={i} variant="secondary">{font}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Links */}
                {importData.analysis.socialLinks.length > 0 && (
                  <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Share2 className="h-4 w-4 text-primary" />
                      Social Profiles
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {importData.analysis.socialLinks.map((link, i) => (
                        <Badge key={i} variant="outline">{link.platform}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content Sections */}
                {importData.analysis.contentSections.length > 0 && (
                  <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <LayoutGrid className="h-4 w-4 text-primary" />
                      Content Sections
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {importData.analysis.contentSections.map((section, i) => (
                        <Badge key={i} variant="secondary" className="capitalize">
                          {section.type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Images */}
                {importData.analysis.images.length > 0 && (
                  <div className="p-4 rounded-lg bg-muted/50 space-y-3 md:col-span-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Image className="h-4 w-4 text-primary" />
                      Key Images ({importData.analysis.images.length})
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {importData.analysis.images.filter(img => img.isLogo || img.isHero).slice(0, 4).map((img, i) => (
                        <div key={i} className="relative flex-shrink-0">
                          <img
                            src={img.src}
                            alt={img.alt || 'Site image'}
                            className="w-20 h-20 object-cover rounded-lg border"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          {img.isLogo && (
                            <Badge className="absolute -top-2 -right-2 text-[10px] px-1" variant="secondary">Logo</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Smart Discovery Questions */}
          {currentStep === 'discovery' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Tell us about your goals</h2>
                  <p className="text-sm text-muted-foreground">
                    This helps our AI create a better website for you
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessGoal">
                    What&apos;s the main goal for your website?
                  </Label>
                  <Textarea
                    id="businessGoal"
                    placeholder="e.g., Generate leads, sell products, provide information, book appointments..."
                    value={importData.discovery.businessGoal}
                    onChange={(e) =>
                      setImportData((prev) => ({
                        ...prev,
                        discovery: { ...prev.discovery, businessGoal: e.target.value },
                      }))
                    }
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience">
                    Who is your target audience?
                  </Label>
                  <Input
                    id="targetAudience"
                    placeholder="e.g., Small business owners, healthcare professionals, young professionals..."
                    value={importData.discovery.targetAudience}
                    onChange={(e) =>
                      setImportData((prev) => ({
                        ...prev,
                        discovery: { ...prev.discovery, targetAudience: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keyDifferentiator">
                    What makes your business unique?
                  </Label>
                  <Input
                    id="keyDifferentiator"
                    placeholder="e.g., 24/7 support, lowest prices, best quality, fastest delivery..."
                    value={importData.discovery.keyDifferentiator}
                    onChange={(e) =>
                      setImportData((prev) => ({
                        ...prev,
                        discovery: { ...prev.discovery, keyDifferentiator: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wantToChange">
                    What would you like to improve about your current site?
                  </Label>
                  <Textarea
                    id="wantToChange"
                    placeholder="e.g., Make it faster, improve mobile experience, add more content, update design..."
                    value={importData.discovery.wantToChange}
                    onChange={(e) =>
                      setImportData((prev) => ({
                        ...prev,
                        discovery: { ...prev.discovery, wantToChange: e.target.value },
                      }))
                    }
                    rows={2}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Would you like to add any new features?</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {ADDITIONAL_FEATURES.map((feature) => (
                      <button
                        key={feature.id}
                        type="button"
                        onClick={() => toggleFeature(feature.id)}
                        className={`p-3 rounded-lg border-2 text-left text-sm transition-all ${
                          importData.discovery.additionalFeatures.includes(feature.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-muted hover:border-primary/50'
                        }`}
                      >
                        <feature.icon className="h-4 w-4 mb-1" />
                        {feature.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Project Settings */}
          {currentStep === 'settings' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Settings className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Project Settings</h2>
                  <p className="text-sm text-muted-foreground">
                    Configure your new project
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name *</Label>
                  <Input
                    id="projectName"
                    placeholder="My Website"
                    value={importData.projectName}
                    onChange={(e) =>
                      setImportData((prev) => ({
                        ...prev,
                        projectName: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName">
                    <Building2 className="inline h-4 w-4 mr-1" />
                    Business Name
                  </Label>
                  <Input
                    id="businessName"
                    placeholder="Your Business Name"
                    value={importData.businessName}
                    onChange={(e) =>
                      setImportData((prev) => ({
                        ...prev,
                        businessName: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domain">
                    <Globe className="inline h-4 w-4 mr-1" />
                    Custom Domain (optional)
                  </Label>
                  <Input
                    id="domain"
                    placeholder="mywebsite.com"
                    value={importData.domain}
                    onChange={(e) =>
                      setImportData((prev) => ({
                        ...prev,
                        domain: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Confirmation */}
          {currentStep === 'confirm' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Confirm Import</h2>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h3 className="font-medium mb-3">Import Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Project Name:</span>
                      <span className="font-medium">{importData.projectName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Import Method:</span>
                      <span className="font-medium capitalize">{importData.method}</span>
                    </div>
                    {importData.method === 'github' && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Repository:</span>
                        <a
                          href={importData.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          View on GitHub
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                    {importData.method === 'url' && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Source URL:</span>
                        <a
                          href={importData.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          {new URL(importData.websiteUrl).hostname}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                    {importData.analysis && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pages:</span>
                          <span className="font-medium">{importData.analysis.pages.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tech Stack:</span>
                          <span className="font-medium">{importData.analysis.techStack.join(', ')}</span>
                        </div>
                      </>
                    )}
                    {importData.discovery.additionalFeatures.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">New Features:</span>
                        <span className="font-medium">
                          {importData.discovery.additionalFeatures.length} selected
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-300">
                        Ready to build your new site!
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                        Our AI will use your imported content and preferences to create an optimized website.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Creating */}
          {currentStep === 'creating' && (
            <div className="py-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <h2 className="text-xl font-semibold mt-4">Importing Your Project</h2>
              <p className="text-muted-foreground mt-2">
                Setting up your imported website...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/50 text-red-600 rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => {
            if (currentStep === 'method') {
              onBack();
            } else if (currentStep === 'source') {
              setCurrentStep('method');
            } else if (currentStep === 'analysis') {
              setCurrentStep('source');
            } else if (currentStep === 'discovery') {
              setCurrentStep(importData.analysis ? 'analysis' : 'source');
            } else if (currentStep === 'settings') {
              setCurrentStep('discovery');
            } else if (currentStep === 'confirm') {
              setCurrentStep('settings');
            }
          }}
          disabled={isCreating || isAnalyzing}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {currentStep === 'analysis' && (
          <Button onClick={() => setCurrentStep('discovery')}>
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}

        {currentStep === 'discovery' && (
          <Button onClick={() => setCurrentStep('settings')}>
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}

        {currentStep === 'settings' && (
          <Button
            onClick={() => setCurrentStep('confirm')}
            disabled={!importData.projectName.trim()}
          >
            Review & Import
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}

        {currentStep === 'confirm' && (
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Create Project
                <Check className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
