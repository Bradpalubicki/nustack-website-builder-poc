'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
} from 'lucide-react';

interface ImportExistingWizardProps {
  onComplete: (projectId: string) => void;
  onBack: () => void;
  onCancel: () => void;
}

type ImportMethod = 'github' | 'url' | 'upload';
type WizardStep = 'method' | 'source' | 'settings' | 'confirm' | 'creating';

interface SiteAnalysis {
  title?: string;
  description?: string;
  businessName?: string;
  pages: string[];
  techStack: string[];
  colors: string[];
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  seoSettings?: {
    metaTitle?: string;
    metaDescription?: string;
  };
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

  const [importData, setImportData] = useState<ImportData>({
    method: null,
    githubUrl: '',
    websiteUrl: '',
    uploadedFile: null,
    analysis: null,
    projectName: '',
    businessName: '',
    domain: '',
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

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setAnalyzeProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

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

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to analyze site');
      }

      const analysis = await response.json();

      setImportData((prev) => ({
        ...prev,
        analysis: analysis.analysis,
        projectName: analysis.analysis?.title || extractNameFromUrl(url),
        businessName: analysis.analysis?.businessName || '',
      }));

      setCurrentStep('settings');
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
      setCurrentStep('settings');
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
      setCurrentStep('settings');
    } else {
      setError('Please upload a ZIP file');
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

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

  const canProceed = () => {
    switch (currentStep) {
      case 'method':
        return !!importData.method;
      case 'source':
        if (importData.method === 'github') {
          return !!importData.githubUrl && validateGitHubUrl(importData.githubUrl);
        }
        if (importData.method === 'url') {
          return !!importData.websiteUrl && validateWebsiteUrl(importData.websiteUrl);
        }
        if (importData.method === 'upload') {
          return !!importData.uploadedFile;
        }
        return false;
      case 'settings':
        return !!importData.projectName.trim();
      case 'confirm':
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Import Existing Site</h1>
        <p className="text-muted-foreground mt-2">
          Connect your existing website or repository
        </p>
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
                      disabled={!canProceed() || isAnalyzing}
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
                          Scanning repository structure...
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
                      disabled={!canProceed() || isAnalyzing}
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
                          Scanning pages and extracting content...
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

          {/* Step 3: Project Settings */}
          {currentStep === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Project Settings</h2>

              {/* Analysis Results */}
              {importData.analysis && (
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="space-y-2">
                      <p className="font-medium text-green-800 dark:text-green-300">
                        Analysis Complete!
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Folder className="h-4 w-4 text-green-600" />
                          <span>{importData.analysis.pages.length} pages detected</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileCode className="h-4 w-4 text-green-600" />
                          <span>{importData.analysis.techStack.join(', ') || 'Unknown stack'}</span>
                        </div>
                        {importData.analysis.colors.length > 0 && (
                          <div className="flex items-center gap-2 col-span-2">
                            <Palette className="h-4 w-4 text-green-600" />
                            <span>Colors detected:</span>
                            <div className="flex gap-1">
                              {importData.analysis.colors.slice(0, 5).map((color, i) => (
                                <div
                                  key={i}
                                  className="w-5 h-5 rounded border"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
          )}

          {/* Step 4: Confirmation */}
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
                    {importData.businessName && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Business Name:</span>
                        <span className="font-medium">{importData.businessName}</span>
                      </div>
                    )}
                    {importData.domain && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Custom Domain:</span>
                        <span className="font-medium">{importData.domain}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800 dark:text-amber-300">
                        Ready to import
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                        Your project will be created with the imported content. You can then use AI to customize and enhance it.
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
          onClick={
            currentStep === 'method'
              ? onBack
              : () => {
                  if (currentStep === 'source') setCurrentStep('method');
                  else if (currentStep === 'settings') setCurrentStep('source');
                  else if (currentStep === 'confirm') setCurrentStep('settings');
                }
          }
          disabled={isCreating || isAnalyzing}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {currentStep === 'settings' && (
          <Button
            onClick={() => setCurrentStep('confirm')}
            disabled={!canProceed()}
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
