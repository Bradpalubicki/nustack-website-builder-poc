'use client';

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import {
  Search,
  Brain,
  FileCode,
  FolderPlus,
  Settings,
  Rocket,
  Check,
  Loader2,
  Clock,
  Lightbulb,
} from 'lucide-react';

interface BuildStep {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}

interface FileStatus {
  path: string;
  status: 'completed' | 'in_progress' | 'queued';
}

interface BuildProgressProps {
  isBuilding: boolean;
  estimatedTime?: number; // in seconds
  onBuildComplete?: () => void;
}

const BUILD_STEPS: BuildStep[] = [
  {
    id: 'analyzing',
    icon: <Search className="h-4 w-4" />,
    label: 'Analyzing',
    description: 'Analyzing your request...',
  },
  {
    id: 'thinking',
    icon: <Brain className="h-4 w-4" />,
    label: 'AI Thinking',
    description: 'AI is thinking...',
  },
  {
    id: 'writing',
    icon: <FileCode className="h-4 w-4" />,
    label: 'Writing Code',
    description: 'Writing code...',
  },
  {
    id: 'creating',
    icon: <FolderPlus className="h-4 w-4" />,
    label: 'Creating Files',
    description: 'Creating files...',
  },
  {
    id: 'configuring',
    icon: <Settings className="h-4 w-4" />,
    label: 'Configuring',
    description: 'Configuring project...',
  },
  {
    id: 'preparing',
    icon: <Rocket className="h-4 w-4" />,
    label: 'Preparing Preview',
    description: 'Preparing preview...',
  },
];

const DID_YOU_KNOW_TIPS = [
  "Your site will be SEO-optimized out of the box",
  "We're using the latest Next.js 14 for blazing fast performance",
  "All code follows industry best practices",
  "Your site will score 90+ on Google Lighthouse",
  "Components are built with accessibility in mind",
  "Your site will be fully responsive across all devices",
  "We generate clean, maintainable TypeScript code",
  "All images will be automatically optimized",
];

const SIMULATED_FILES = [
  'src/app/page.tsx',
  'src/components/Header.tsx',
  'src/components/Footer.tsx',
  'src/app/about/page.tsx',
  'src/app/contact/page.tsx',
  'src/components/Hero.tsx',
  'src/components/Features.tsx',
  'src/styles/globals.css',
];

export function BuildProgress({
  isBuilding,
  estimatedTime = 30,
  onBuildComplete,
}: BuildProgressProps) {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [files, setFiles] = useState<FileStatus[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Progress simulation
  useEffect(() => {
    if (!isBuilding) {
      setProgress(0);
      setCurrentStepIndex(0);
      setFiles([]);
      setElapsedTime(0);
      return;
    }

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          onBuildComplete?.();
          return 100;
        }
        // Smoother progress with slight randomness
        const increment = Math.random() * 3 + 1;
        return Math.min(prev + increment, 100);
      });
    }, estimatedTime * 10); // Spread over estimated time

    return () => clearInterval(progressInterval);
  }, [isBuilding, estimatedTime, onBuildComplete]);

  // Update current step based on progress
  useEffect(() => {
    const stepProgress = 100 / BUILD_STEPS.length;
    const newStepIndex = Math.min(
      Math.floor(progress / stepProgress),
      BUILD_STEPS.length - 1
    );
    setCurrentStepIndex(newStepIndex);
  }, [progress]);

  // Rotate tips
  useEffect(() => {
    if (!isBuilding) return;

    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % DID_YOU_KNOW_TIPS.length);
    }, 4000);

    return () => clearInterval(tipInterval);
  }, [isBuilding]);

  // Simulate file creation
  useEffect(() => {
    if (!isBuilding) return;

    const fileInterval = setInterval(() => {
      setFiles((prev) => {
        if (prev.length >= SIMULATED_FILES.length) {
          clearInterval(fileInterval);
          return prev;
        }

        // Update previous in_progress to completed
        const updated = prev.map((f) =>
          f.status === 'in_progress' ? { ...f, status: 'completed' as const } : f
        );

        // Add next file as in_progress
        const nextIndex = updated.filter((f) => f.status === 'completed').length;
        if (nextIndex < SIMULATED_FILES.length) {
          updated.push({
            path: SIMULATED_FILES[nextIndex],
            status: 'in_progress',
          });

          // Add queued files
          for (let i = nextIndex + 1; i < Math.min(nextIndex + 3, SIMULATED_FILES.length); i++) {
            if (!updated.find((f) => f.path === SIMULATED_FILES[i])) {
              updated.push({
                path: SIMULATED_FILES[i],
                status: 'queued',
              });
            }
          }
        }

        return updated;
      });
    }, estimatedTime * 100); // Stagger file creation

    return () => clearInterval(fileInterval);
  }, [isBuilding, estimatedTime]);

  // Elapsed time counter
  useEffect(() => {
    if (!isBuilding) return;

    const timeInterval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timeInterval);
  }, [isBuilding]);

  if (!isBuilding) return null;

  const currentStep = BUILD_STEPS[currentStepIndex];

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20 animate-pulse-subtle">
      {/* Header with estimated time */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 animate-pulse">
            <Rocket className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Building Your Site</h3>
            <p className="text-xs text-muted-foreground">
              Please wait while we create your website
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            {elapsedTime}s / ~{estimatedTime}s
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{currentStep.description}</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between">
        {BUILD_STEPS.map((step, index) => (
          <div
            key={step.id}
            className={`flex flex-col items-center gap-1 ${
              index <= currentStepIndex
                ? 'text-primary'
                : 'text-muted-foreground opacity-50'
            }`}
          >
            <div
              className={`p-2 rounded-full ${
                index < currentStepIndex
                  ? 'bg-primary text-primary-foreground'
                  : index === currentStepIndex
                    ? 'bg-primary/20 animate-pulse'
                    : 'bg-muted'
              }`}
            >
              {index < currentStepIndex ? (
                <Check className="h-4 w-4" />
              ) : index === currentStepIndex ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                step.icon
              )}
            </div>
            <span className="text-xs hidden sm:block">{step.label}</span>
          </div>
        ))}
      </div>

      {/* Files being created */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <FolderPlus className="h-4 w-4" />
            Files being created
          </h4>
          <div className="bg-slate-900 rounded-lg p-3 max-h-32 overflow-y-auto">
            <div className="space-y-1 font-mono text-xs">
              {files.map((file) => (
                <div key={file.path} className="flex items-center gap-2">
                  {file.status === 'completed' && (
                    <Check className="h-3 w-3 text-green-400" />
                  )}
                  {file.status === 'in_progress' && (
                    <Loader2 className="h-3 w-3 text-yellow-400 animate-spin" />
                  )}
                  {file.status === 'queued' && (
                    <Clock className="h-3 w-3 text-slate-500" />
                  )}
                  <span
                    className={
                      file.status === 'completed'
                        ? 'text-green-400'
                        : file.status === 'in_progress'
                          ? 'text-yellow-400'
                          : 'text-slate-500'
                    }
                  >
                    {file.path}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Did you know tips */}
      <div className="flex items-start gap-3 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
        <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
            Did you know?
          </p>
          <p className="text-sm text-muted-foreground mt-1 transition-opacity duration-300">
            {DID_YOU_KNOW_TIPS[tipIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BuildProgress;
