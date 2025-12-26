'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PracticeLocation, MedicalService } from '@/types/healthcare';

export interface LocationHeroProps {
  /** Location data */
  location: PracticeLocation;
  /** Service data (for location+service pages) */
  service?: MedicalService;
  /** Background image URL */
  backgroundImage?: string;
  /** Whether to show booking CTA */
  showBookingCTA?: boolean;
  /** Whether to show phone number prominently */
  showPhoneNumber?: boolean;
  /** Booking URL */
  bookingUrl?: string;
  /** Practice name */
  practiceName?: string;
  /** Additional CSS classes */
  className?: string;
  /** Custom headline override */
  customHeadline?: string;
  /** Custom subheadline override */
  customSubheadline?: string;
}

/**
 * LocationHero Component
 *
 * Hero section for location-specific pages.
 * Optimized for local SEO with location in headings.
 */
export function LocationHero({
  location,
  service,
  backgroundImage,
  showBookingCTA = true,
  showPhoneNumber = true,
  bookingUrl = '/book-appointment',
  practiceName,
  className,
  customHeadline,
  customSubheadline,
}: LocationHeroProps) {
  // Generate SEO-optimized headline
  const headline =
    customHeadline ||
    (service
      ? `${service.name} in ${location.city}, ${location.stateFull || location.state}`
      : `${practiceName || location.name} - ${location.city}, ${location.stateFull || location.state}`);

  const subheadline =
    customSubheadline ||
    (service
      ? `Expert ${service.shortName || service.name} treatment at our ${location.city} clinic. Personalized care from experienced medical professionals.`
      : `Quality healthcare services in ${location.city} and surrounding areas. Accepting new patients.`);

  return (
    <section
      className={cn(
        'relative py-16 md:py-24 lg:py-32',
        backgroundImage ? 'text-white' : 'bg-gradient-to-br from-primary/5 to-primary/10',
        className
      )}
    >
      {/* Background Image with Overlay */}
      {backgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </>
      )}

      <div className="container relative z-10 mx-auto px-4">
        {/* Breadcrumb-like location trail */}
        <div className="flex items-center gap-2 text-sm mb-4 opacity-80">
          <MapPin className="h-4 w-4" />
          <span>{location.city}</span>
          <span>•</span>
          <span>{location.stateFull || location.state}</span>
          {service && (
            <>
              <span>•</span>
              <span>{service.category}</span>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="max-w-3xl">
          {/* H1 - Critical for SEO */}
          <h1
            className={cn(
              'text-3xl md:text-4xl lg:text-5xl font-bold mb-4',
              backgroundImage ? 'text-white' : 'text-foreground'
            )}
          >
            {headline}
          </h1>

          {/* Subheadline */}
          <p
            className={cn(
              'text-lg md:text-xl mb-6',
              backgroundImage ? 'text-white/90' : 'text-muted-foreground'
            )}
          >
            {subheadline}
          </p>

          {/* Trust Signals */}
          <div className="flex flex-wrap gap-3 mb-8">
            {location.acceptsNewPatients && (
              <Badge
                variant="secondary"
                className={cn(
                  'gap-1',
                  backgroundImage ? 'bg-white/20 text-white border-white/30' : ''
                )}
              >
                <CheckCircle className="h-3 w-3" />
                Accepting New Patients
              </Badge>
            )}
            {service?.isFeatured && (
              <Badge
                variant="secondary"
                className={cn(backgroundImage ? 'bg-white/20 text-white border-white/30' : '')}
              >
                Featured Treatment
              </Badge>
            )}
            {location.serviceAreas && location.serviceAreas.length > 0 && (
              <Badge
                variant="secondary"
                className={cn(backgroundImage ? 'bg-white/20 text-white border-white/30' : '')}
              >
                Serving {location.serviceAreas.length}+ areas
              </Badge>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {showPhoneNumber && (
              <Button
                size="lg"
                className={cn(
                  'gap-2',
                  backgroundImage ? 'bg-white text-primary hover:bg-white/90' : ''
                )}
                asChild
              >
                <a href={`tel:${location.phone}`}>
                  <Phone className="h-5 w-5" />
                  <span className="font-semibold">{location.phone}</span>
                </a>
              </Button>
            )}
            {showBookingCTA && (
              <Button
                size="lg"
                variant={backgroundImage ? 'outline' : 'default'}
                className={cn(
                  'gap-2',
                  backgroundImage ? 'border-white text-white hover:bg-white/10' : ''
                )}
                asChild
              >
                <a href={bookingUrl}>
                  <Calendar className="h-5 w-5" />
                  Book Appointment
                </a>
              </Button>
            )}
          </div>

          {/* Address */}
          <div
            className={cn(
              'mt-6 text-sm',
              backgroundImage ? 'text-white/80' : 'text-muted-foreground'
            )}
          >
            <MapPin className="h-4 w-4 inline mr-1" />
            {location.addressLine1}, {location.city}, {location.state} {location.zip}
          </div>
        </div>
      </div>
    </section>
  );
}

export default LocationHero;
