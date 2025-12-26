'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Award,
  ShieldCheck,
  GraduationCap,
  Building2,
  Stethoscope,
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type CredentialVariant = 'pills' | 'list' | 'icons';

export interface Credential {
  name: string;
  description?: string;
  icon?: 'award' | 'shield' | 'graduation' | 'building' | 'stethoscope' | 'heart';
}

export interface CredentialsBadgeProps {
  /** Array of credentials to display */
  credentials: (string | Credential)[];
  /** Display variant */
  variant?: CredentialVariant;
  /** Show tooltips with descriptions */
  showTooltips?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Maximum number to display (rest shown as +N) */
  maxDisplay?: number;
}

/**
 * Get icon component for credential type
 */
function getCredentialIcon(iconType?: string) {
  switch (iconType) {
    case 'shield':
      return ShieldCheck;
    case 'graduation':
      return GraduationCap;
    case 'building':
      return Building2;
    case 'stethoscope':
      return Stethoscope;
    case 'heart':
      return Heart;
    case 'award':
    default:
      return Award;
  }
}

/**
 * Get description for common credentials
 */
function getCredentialDescription(name: string): string {
  const descriptions: Record<string, string> = {
    'Board Certified': 'Passed rigorous examination and meets ongoing education requirements',
    'MD': 'Doctor of Medicine - Completed medical school and residency training',
    'DO': 'Doctor of Osteopathic Medicine - Completed osteopathic medical training',
    'FAAMFM': 'Fellow of the American Academy of Anti-Aging and Functional Medicine',
    'FACP': 'Fellow of the American College of Physicians',
    'FACS': 'Fellow of the American College of Surgeons',
    'DMD': 'Doctor of Dental Medicine',
    'DDS': 'Doctor of Dental Surgery',
    'NP': 'Nurse Practitioner - Advanced practice registered nurse',
    'PA-C': 'Certified Physician Assistant',
    'AMA Member': 'Member of the American Medical Association',
    'AACE Member': 'Member of the American Association of Clinical Endocrinologists',
  };

  return descriptions[name] || `Professional credential: ${name}`;
}

/**
 * Normalize credential to object format
 */
function normalizeCredential(cred: string | Credential): Credential {
  if (typeof cred === 'string') {
    return {
      name: cred,
      description: getCredentialDescription(cred),
      icon: 'award',
    };
  }
  return {
    ...cred,
    description: cred.description || getCredentialDescription(cred.name),
  };
}

/**
 * CredentialsBadge Component
 *
 * Display professional credentials with optional tooltips.
 * Helps establish expertise for E-E-A-T compliance.
 */
export function CredentialsBadge({
  credentials,
  variant = 'pills',
  showTooltips = true,
  className,
  maxDisplay = 5,
}: CredentialsBadgeProps) {
  if (!credentials || credentials.length === 0) {
    return null;
  }

  const normalizedCredentials = credentials.map(normalizeCredential);
  const displayCredentials = normalizedCredentials.slice(0, maxDisplay);
  const remainingCount = normalizedCredentials.length - maxDisplay;

  const renderCredential = (cred: Credential, index: number) => {
    const Icon = getCredentialIcon(cred.icon);

    const content = (
      <Badge
        key={index}
        variant="secondary"
        className={cn(
          'gap-1',
          variant === 'icons' && 'px-2',
          'bg-primary/10 text-primary hover:bg-primary/20'
        )}
      >
        <Icon className="h-3 w-3" />
        {variant !== 'icons' && <span>{cred.name}</span>}
      </Badge>
    );

    if (showTooltips && cred.description) {
      return (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p className="font-medium">{cred.name}</p>
              <p className="text-xs text-muted-foreground">{cred.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return content;
  };

  if (variant === 'list') {
    return (
      <ul className={cn('space-y-1', className)}>
        {displayCredentials.map((cred, index) => {
          const Icon = getCredentialIcon(cred.icon);
          return (
            <li key={index} className="flex items-center gap-2 text-sm">
              <Icon className="h-4 w-4 text-primary" />
              <span>{cred.name}</span>
              {showTooltips && cred.description && (
                <span className="text-muted-foreground text-xs">— {cred.description}</span>
              )}
            </li>
          );
        })}
        {remainingCount > 0 && (
          <li className="text-sm text-muted-foreground">+{remainingCount} more credentials</li>
        )}
      </ul>
    );
  }

  // Pills and icons variants
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {displayCredentials.map(renderCredential)}
      {remainingCount > 0 && (
        <Badge variant="outline" className="text-muted-foreground">
          +{remainingCount} more
        </Badge>
      )}
    </div>
  );
}

export default CredentialsBadge;
