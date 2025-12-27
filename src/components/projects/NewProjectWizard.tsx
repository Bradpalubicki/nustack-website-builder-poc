'use client';

import { useState } from 'react';
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
import { TemplateSelector, Template } from './TemplateSelector';
import { ImportExistingWizard } from './ImportExistingWizard';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Building2,
  Globe,
  Palette,
  Sparkles,
  Upload,
  FileCode,
  Rocket,
} from 'lucide-react';

interface NewProjectWizardProps {
  onComplete: (projectId: string) => void;
  onCancel: () => void;
}

type WizardStep = 'start' | 'template' | 'details' | 'customize' | 'creating';

interface ProjectData {
  template: Template | null;
  name: string;
  description: string;
  domain: string;
  industry: string;
  businessName: string;
  primaryColor: string;
}

const STEPS: { id: WizardStep; title: string; description: string }[] = [
  { id: 'start', title: 'Get Started', description: 'Choose your path' },
  { id: 'template', title: 'Choose Template', description: 'Select a starting point' },
  { id: 'details', title: 'Project Details', description: 'Basic information' },
  { id: 'customize', title: 'Customize', description: 'Brand & settings' },
];

export function NewProjectWizard({ onComplete, onCancel }: NewProjectWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('start');
  const [showImportWizard, setShowImportWizard] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [projectData, setProjectData] = useState<ProjectData>({
    template: null,
    name: '',
    description: '',
    domain: '',
    industry: '',
    businessName: '',
    primaryColor: '#3B82F6',
  });

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

  const handleTemplateSelect = (template: Template) => {
    setProjectData((prev) => ({
      ...prev,
      template,
      industry: template.industry || '',
    }));
  };

  const handleStartFresh = () => {
    setCurrentStep('template');
  };

  const handleImportExisting = () => {
    setShowImportWizard(true);
  };

  const handleNext = () => {
    if (currentStep === 'start') {
      // This shouldn't happen as we use specific buttons
      return;
    }
    if (currentStep === 'template' && !projectData.template) {
      return;
    }
    if (currentStep === 'details' && !projectData.name) {
      return;
    }

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].id);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id);
    }
  };

  const handleCreate = async () => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectData.name,
          description: projectData.description,
          templateId: projectData.template?.id,
          settings: {
            domain: projectData.domain,
            industry: projectData.industry,
            businessName: projectData.businessName,
            primaryColor: projectData.primaryColor,
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
      case 'start':
        return false; // Use specific action buttons
      case 'template':
        return !!projectData.template;
      case 'details':
        return !!projectData.name.trim();
      case 'customize':
        return true;
      default:
        return false;
    }
  };

  // Show import wizard if selected
  if (showImportWizard) {
    return (
      <ImportExistingWizard
        onComplete={onComplete}
        onBack={() => setShowImportWizard(false)}
        onCancel={onCancel}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <p className="text-muted-foreground mt-2">
          Set up your website in just a few steps
        </p>
      </div>

      {/* Progress Steps - Only show after start step */}
      {currentStep !== 'start' && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.filter((s) => s.id !== 'start').map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    index < currentStepIndex - 1
                      ? 'bg-primary border-primary text-primary-foreground'
                      : index === currentStepIndex - 1
                        ? 'border-primary text-primary'
                        : 'border-muted text-muted-foreground'
                  }`}
                >
                  {index < currentStepIndex - 1 ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p
                    className={`text-sm font-medium ${
                      index <= currentStepIndex - 1
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                {index < STEPS.length - 2 && (
                  <div
                    className={`w-12 sm:w-24 h-0.5 mx-4 ${
                      index < currentStepIndex - 1 ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {/* Start Step - Choose Path */}
          {currentStep === 'start' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">How would you like to start?</h2>
                <p className="text-muted-foreground mt-2">
                  Create a new site from scratch or import an existing one
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Start Fresh Option */}
                <button
                  onClick={handleStartFresh}
                  className="group relative p-8 rounded-xl border-2 border-muted hover:border-primary transition-all duration-200 text-left bg-gradient-to-br from-primary/5 to-transparent hover:from-primary/10"
                >
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                      <Rocket className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Start Fresh</h3>
                      <p className="text-muted-foreground mt-2">
                        Choose from our professionally designed templates and customize with AI assistance
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        AI-Powered
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        Templates
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        SEO Ready
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                </button>

                {/* Import Existing Option */}
                <button
                  onClick={handleImportExisting}
                  className="group relative p-8 rounded-xl border-2 border-muted hover:border-primary transition-all duration-200 text-left bg-gradient-to-br from-amber-500/5 to-transparent hover:from-amber-500/10"
                >
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                      <FileCode className="h-5 w-5 text-amber-500" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                      <Upload className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Import Existing Site</h3>
                      <p className="text-muted-foreground mt-2">
                        Connect a GitHub repo, enter a website URL, or upload your code to get started
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        GitHub
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        URL Import
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        Code Upload
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-5 w-5 text-amber-500" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Template Selection */}
          {currentStep === 'template' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Choose a Template</h2>
              <TemplateSelector
                selectedTemplate={projectData.template}
                onSelect={handleTemplateSelect}
              />
            </div>
          )}

          {/* Project Details */}
          {currentStep === 'details' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Project Details</h2>

              <div className="space-y-2">
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  placeholder="My Awesome Website"
                  value={projectData.name}
                  onChange={(e) =>
                    setProjectData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="A brief description of your project"
                  value={projectData.description}
                  onChange={(e) =>
                    setProjectData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain">
                  <Globe className="inline h-4 w-4 mr-1" />
                  Domain (optional)
                </Label>
                <Input
                  id="domain"
                  placeholder="mywebsite.com"
                  value={projectData.domain}
                  onChange={(e) =>
                    setProjectData((prev) => ({ ...prev, domain: e.target.value }))
                  }
                />
              </div>
            </div>
          )}

          {/* Customize */}
          {currentStep === 'customize' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Customize Your Site</h2>

              <div className="space-y-2">
                <Label htmlFor="businessName">
                  <Building2 className="inline h-4 w-4 mr-1" />
                  Business Name
                </Label>
                <Input
                  id="businessName"
                  placeholder="Your Business Name"
                  value={projectData.businessName}
                  onChange={(e) =>
                    setProjectData((prev) => ({
                      ...prev,
                      businessName: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <select
                  id="industry"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={projectData.industry}
                  onChange={(e) =>
                    setProjectData((prev) => ({ ...prev, industry: e.target.value }))
                  }
                >
                  <option value="">Select an industry</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="legal">Legal</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="financial">Financial Services</option>
                  <option value="technology">Technology</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryColor">
                  <Palette className="inline h-4 w-4 mr-1" />
                  Primary Color
                </Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    id="primaryColor"
                    value={projectData.primaryColor}
                    onChange={(e) =>
                      setProjectData((prev) => ({
                        ...prev,
                        primaryColor: e.target.value,
                      }))
                    }
                    className="h-10 w-20 rounded border cursor-pointer"
                  />
                  <Input
                    value={projectData.primaryColor}
                    onChange={(e) =>
                      setProjectData((prev) => ({
                        ...prev,
                        primaryColor: e.target.value,
                      }))
                    }
                    className="w-32"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Creating */}
          {currentStep === 'creating' && (
            <div className="py-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <h2 className="text-xl font-semibold mt-4">Creating Your Project</h2>
              <p className="text-muted-foreground mt-2">
                Setting up your website with AI-powered features...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/50 text-red-600 rounded-md">
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
            currentStep === 'start'
              ? onCancel
              : currentStep === 'template'
                ? () => setCurrentStep('start')
                : handleBack
          }
          disabled={isCreating}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {currentStep === 'start' ? 'Cancel' : currentStep === 'template' ? 'Back to Start' : 'Back'}
        </Button>

        {currentStep !== 'start' && (
          <>
            {currentStepIndex < STEPS.length - 1 ? (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleCreate} disabled={isCreating || !canProceed()}>
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
          </>
        )}
      </div>
    </div>
  );
}
