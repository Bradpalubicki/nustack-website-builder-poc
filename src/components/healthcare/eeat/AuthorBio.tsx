'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Award,
  Linkedin,
  Twitter,
  Globe,
  Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SocialLink {
  platform: 'linkedin' | 'twitter' | 'website' | 'email' | string;
  url: string;
}

export interface AuthorBioProps {
  /** Author's full name */
  name: string;
  /** Professional credentials */
  credentials: string;
  /** Profile image URL */
  imageUrl?: string;
  /** Biography text */
  bio: string;
  /** Professional role/title */
  role: string;
  /** Social and professional links */
  socialLinks?: SocialLink[];
  /** Number of articles written */
  articlesWritten?: number;
  /** Years of professional experience */
  yearsExperience?: number;
  /** Areas of specialty */
  specialties?: string[];
  /** URL to author's full profile page */
  profileUrl?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether bio is expandable */
  expandable?: boolean;
  /** Maximum bio length before truncation */
  maxBioLength?: number;
}

/**
 * Get initials from a name
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Get icon for social platform
 */
function getSocialIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return Linkedin;
    case 'twitter':
    case 'x':
      return Twitter;
    case 'website':
      return Globe;
    case 'email':
      return Mail;
    default:
      return Globe;
  }
}

/**
 * AuthorBio Component
 *
 * Author information card for articles.
 * Provides E-E-A-T signals about content creators.
 */
export function AuthorBio({
  name,
  credentials,
  imageUrl,
  bio,
  role,
  socialLinks,
  articlesWritten,
  yearsExperience,
  specialties,
  profileUrl,
  className,
  expandable = true,
  maxBioLength = 200,
}: AuthorBioProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const initials = getInitials(name);
  const shouldTruncate = expandable && bio.length > maxBioLength;
  const displayBio = shouldTruncate && !isExpanded ? `${bio.slice(0, maxBioLength)}...` : bio;

  // Generate schema.org Person data
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle: role,
    description: bio,
    ...(imageUrl && { image: imageUrl }),
    ...(specialties && { knowsAbout: specialties }),
    ...(socialLinks && {
      sameAs: socialLinks.map((link) => link.url),
    }),
  };

  return (
    <Card className={cn('', className)} itemScope itemType="https://schema.org/Person">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Avatar */}
          <Avatar className="h-20 w-20 border-2 border-primary/20">
            <AvatarImage src={imageUrl} alt={name} itemProp="image" />
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg" itemProp="name">
                {profileUrl ? (
                  <a href={profileUrl} className="hover:text-primary hover:underline">
                    {name}
                  </a>
                ) : (
                  name
                )}
              </h3>
              <span className="text-muted-foreground">{credentials}</span>
            </div>

            <p className="text-sm text-muted-foreground mb-2" itemProp="jobTitle">
              {role}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mb-3 text-sm">
              {yearsExperience && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Award className="h-4 w-4" />
                  <span>{yearsExperience}+ years experience</span>
                </div>
              )}
              {articlesWritten && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{articlesWritten} articles written</span>
                </div>
              )}
            </div>

            {/* Specialties */}
            {specialties && specialties.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            )}

            {/* Bio */}
            <p className="text-sm text-muted-foreground mb-3" itemProp="description">
              {displayBio}
            </p>

            {shouldTruncate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-0 h-auto text-primary"
              >
                {isExpanded ? (
                  <>
                    Show less <ChevronUp className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    Read more <ChevronDown className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            )}

            {/* Social Links */}
            {socialLinks && socialLinks.length > 0 && (
              <div className="flex gap-2 mt-3">
                {socialLinks.map((link) => {
                  const Icon = getSocialIcon(link.platform);
                  return (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`${name} on ${link.platform}`}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Schema data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    </Card>
  );
}

export default AuthorBio;
