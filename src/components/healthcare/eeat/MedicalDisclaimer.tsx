'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AlertTriangle, ChevronDown, ChevronUp, Phone, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DisclaimerVariant = 'footer' | 'inline' | 'modal';

export interface MedicalDisclaimerProps {
  /** Display variant */
  variant?: DisclaimerVariant;
  /** Custom disclaimer text (overrides default) */
  customText?: string;
  /** Whether to show emergency information */
  showEmergencyInfo?: boolean;
  /** Emergency phone number */
  emergencyPhone?: string;
  /** Link to full disclaimer page */
  disclaimerUrl?: string;
  /** Additional CSS classes */
  className?: string;
  /** Collapsible on mobile (for footer variant) */
  collapsibleOnMobile?: boolean;
}

const DEFAULT_DISCLAIMER = `This information is provided for educational purposes only and is not intended as medical advice. The content on this website should not be used for diagnosing or treating any health problem or disease. Always consult with a qualified healthcare provider before starting any treatment, changing your healthcare regimen, or if you have questions regarding a medical condition.

Individual results may vary. The information provided is not intended to diagnose, treat, cure, or prevent any disease. Statements on this website have not been evaluated by the Food and Drug Administration.

If you think you may have a medical emergency, call your doctor or 911 immediately.`;

const SHORT_DISCLAIMER = `This information is for educational purposes only and is not a substitute for professional medical advice. Consult your healthcare provider before starting any treatment.`;

/**
 * MedicalDisclaimer Component
 *
 * Required legal/medical disclaimer for healthcare content.
 * Helps establish trust and legal compliance.
 */
export function MedicalDisclaimer({
  variant = 'footer',
  customText,
  showEmergencyInfo = true,
  emergencyPhone = '911',
  disclaimerUrl,
  className,
  collapsibleOnMobile = true,
}: MedicalDisclaimerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const disclaimerText = customText || DEFAULT_DISCLAIMER;

  const EmergencySection = showEmergencyInfo ? (
    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
      <Phone className="h-4 w-4 flex-shrink-0" />
      <span className="text-sm">
        <strong>Emergency?</strong> Call{' '}
        <a href={`tel:${emergencyPhone}`} className="font-bold underline">
          {emergencyPhone}
        </a>{' '}
        immediately.
      </span>
    </div>
  ) : null;

  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800',
          className
        )}
      >
        <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium mb-1">Medical Disclaimer</p>
          <p>{SHORT_DISCLAIMER}</p>
          {disclaimerUrl && (
            <a href={disclaimerUrl} className="text-amber-900 underline mt-2 inline-block">
              Read full disclaimer
            </a>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'modal') {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className={cn('text-muted-foreground', className)}>
            <Info className="h-4 w-4 mr-1" />
            Medical Disclaimer
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Medical Disclaimer
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground whitespace-pre-line">{disclaimerText}</p>
            {EmergencySection}
            {disclaimerUrl && (
              <a
                href={disclaimerUrl}
                className="text-sm text-primary underline block"
              >
                View full Terms & Disclaimer
              </a>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Footer variant (default)
  return (
    <Card className={cn('border-amber-200 bg-amber-50/50', className)}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">Medical Disclaimer</span>
            </div>
            {collapsibleOnMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="md:hidden"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          <div
            className={cn(
              'text-sm text-amber-800/90 whitespace-pre-line',
              collapsibleOnMobile && !isExpanded && 'hidden md:block'
            )}
          >
            {disclaimerText}
          </div>

          {/* Always show short version on mobile when collapsed */}
          {collapsibleOnMobile && !isExpanded && (
            <p className="text-sm text-amber-800/90 md:hidden">{SHORT_DISCLAIMER}</p>
          )}

          <div
            className={cn(
              'space-y-3',
              collapsibleOnMobile && !isExpanded && 'hidden md:block'
            )}
          >
            {EmergencySection}

            {disclaimerUrl && (
              <a
                href={disclaimerUrl}
                className="text-sm text-amber-900 underline inline-block"
              >
                Read full Terms & Medical Disclaimer
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MedicalDisclaimer;
