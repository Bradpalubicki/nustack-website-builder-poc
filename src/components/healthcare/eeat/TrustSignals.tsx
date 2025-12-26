'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  MapPin,
  Star,
  Calendar,
  Award,
  Building2,
  CheckCircle,
  Newspaper,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RatingSource {
  source: string;
  rating: number;
  reviewCount: number;
  url?: string;
}

export interface TrustSignalsProps {
  /** Years the business has been operating */
  yearsInBusiness?: number;
  /** Number of patients served */
  patientsServed?: string;
  /** Number of locations */
  locationsCount?: number;
  /** Ratings from various sources */
  ratings?: RatingSource[];
  /** Professional accreditations */
  accreditations?: string[];
  /** Media features ("As seen in...") */
  mediaFeatures?: string[];
  /** Additional trust badges */
  badges?: string[];
  /** Display layout */
  layout?: 'grid' | 'row' | 'compact';
  /** Additional CSS classes */
  className?: string;
  /** Whether to animate counters */
  animateCounters?: boolean;
}

/**
 * Format large numbers with K/M suffixes
 */
function formatNumber(value: string | number): string {
  if (typeof value === 'string') return value;
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toString();
}

/**
 * Star rating display
 */
function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(max)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-4 w-4',
            i < Math.floor(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : i < rating
                ? 'fill-yellow-400/50 text-yellow-400'
                : 'text-gray-300'
          )}
        />
      ))}
    </div>
  );
}

/**
 * Single stat card component
 */
function StatCard({
  icon: Icon,
  value,
  label,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string | number;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-3 p-4', className)}>
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <p className="text-2xl font-bold">{typeof value === 'number' ? formatNumber(value) : value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

/**
 * TrustSignals Component
 *
 * Aggregate trust indicators for the site.
 * Displays social proof elements that build credibility.
 */
export function TrustSignals({
  yearsInBusiness,
  patientsServed,
  locationsCount,
  ratings,
  accreditations,
  mediaFeatures,
  badges,
  layout = 'grid',
  className,
}: TrustSignalsProps) {
  const hasStats = yearsInBusiness || patientsServed || locationsCount;
  const hasRatings = ratings && ratings.length > 0;
  const hasAccreditations = accreditations && accreditations.length > 0;
  const hasMediaFeatures = mediaFeatures && mediaFeatures.length > 0;

  if (layout === 'compact') {
    return (
      <div className={cn('flex flex-wrap items-center gap-4', className)}>
        {yearsInBusiness && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{yearsInBusiness}+ Years</span>
          </div>
        )}
        {patientsServed && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-primary" />
            <span>{patientsServed} Patients</span>
          </div>
        )}
        {locationsCount && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{locationsCount} Locations</span>
          </div>
        )}
        {hasRatings && ratings[0] && (
          <div className="flex items-center gap-2 text-sm">
            <StarRating rating={ratings[0].rating} />
            <span>{ratings[0].rating} ({ratings[0].reviewCount} reviews)</span>
          </div>
        )}
      </div>
    );
  }

  if (layout === 'row') {
    return (
      <Card className={className}>
        <CardContent className="p-0">
          <div className="flex flex-wrap divide-x">
            {yearsInBusiness && (
              <StatCard icon={Calendar} value={`${yearsInBusiness}+`} label="Years in Business" />
            )}
            {patientsServed && (
              <StatCard icon={Users} value={patientsServed} label="Patients Served" />
            )}
            {locationsCount && (
              <StatCard icon={MapPin} value={locationsCount} label="Locations" />
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid layout (default)
  return (
    <div className={cn('space-y-6', className)}>
      {/* Stats Grid */}
      {hasStats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {yearsInBusiness && (
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold">{yearsInBusiness}+</p>
                <p className="text-sm text-muted-foreground">Years in Business</p>
              </CardContent>
            </Card>
          )}
          {patientsServed && (
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold">{patientsServed}</p>
                <p className="text-sm text-muted-foreground">Patients Served</p>
              </CardContent>
            </Card>
          )}
          {locationsCount && (
            <Card>
              <CardContent className="p-4 text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold">{locationsCount}</p>
                <p className="text-sm text-muted-foreground">Locations</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Ratings */}
      {hasRatings && (
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Patient Reviews
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ratings.map((rating) => (
              <Card key={rating.source}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{rating.source}</span>
                    <StarRating rating={rating.rating} />
                  </div>
                  <p className="text-2xl font-bold">{rating.rating.toFixed(1)}</p>
                  <p className="text-sm text-muted-foreground">
                    Based on {rating.reviewCount.toLocaleString()} reviews
                  </p>
                  {rating.url && (
                    <a
                      href={rating.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline mt-2 inline-block"
                    >
                      Read reviews →
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Accreditations */}
      {hasAccreditations && (
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Accreditations & Memberships
          </h3>
          <div className="flex flex-wrap gap-2">
            {accreditations.map((accreditation) => (
              <Badge key={accreditation} variant="outline" className="gap-1 py-1.5 px-3">
                <CheckCircle className="h-3 w-3 text-green-600" />
                {accreditation}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Media Features */}
      {hasMediaFeatures && (
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-primary" />
            As Seen In
          </h3>
          <div className="flex flex-wrap items-center gap-6 opacity-60">
            {mediaFeatures.map((feature) => (
              <span key={feature} className="text-lg font-semibold">
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Additional Badges */}
      {badges && badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <Badge key={badge} className="gap-1">
              <Building2 className="h-3 w-3" />
              {badge}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrustSignals;
