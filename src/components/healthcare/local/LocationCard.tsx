'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation,
  ExternalLink,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PracticeLocation, BusinessHours } from '@/types/healthcare';

export type LocationCardVariant = 'card' | 'compact' | 'hero';

export interface LocationCardProps {
  /** Location data */
  location: PracticeLocation;
  /** Display variant */
  variant?: LocationCardVariant;
  /** Whether to show the map embed */
  showMap?: boolean;
  /** Whether to show business hours */
  showHours?: boolean;
  /** Whether to show available services */
  showServices?: boolean;
  /** Whether to show directions button */
  showDirectionsButton?: boolean;
  /** Whether to show call button */
  showCallButton?: boolean;
  /** Services available at this location */
  services?: Array<{ name: string; slug: string }>;
  /** Additional CSS classes */
  className?: string;
  /** Click tracking callback */
  onPhoneClick?: (location: PracticeLocation) => void;
  /** Directions click callback */
  onDirectionsClick?: (location: PracticeLocation) => void;
}

/**
 * Check if location is currently open
 */
function isCurrentlyOpen(hours?: BusinessHours): { isOpen: boolean; todayHours?: string } {
  if (!hours) return { isOpen: false };

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const now = new Date();
  const currentDay = days[now.getDay()];
  const todayHours = hours[currentDay as keyof BusinessHours];

  if (!todayHours || todayHours.closed) {
    return { isOpen: false, todayHours: 'Closed today' };
  }

  const currentTime = now.getHours() * 60 + now.getMinutes();

  // Parse opening and closing times
  const parseTime = (timeStr: string): number => {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let hour = hours;
    if (period?.toLowerCase() === 'pm' && hours !== 12) hour += 12;
    if (period?.toLowerCase() === 'am' && hours === 12) hour = 0;
    return hour * 60 + (minutes || 0);
  };

  const openTime = parseTime(todayHours.open);
  const closeTime = parseTime(todayHours.close);

  const isOpen = currentTime >= openTime && currentTime <= closeTime;

  return {
    isOpen,
    todayHours: `${todayHours.open} - ${todayHours.close}`,
  };
}

/**
 * Format full address
 */
function formatAddress(location: PracticeLocation): string {
  const parts = [location.addressLine1];
  if (location.addressLine2) parts.push(location.addressLine2);
  parts.push(`${location.city}, ${location.state} ${location.zip}`);
  return parts.join(', ');
}

/**
 * Get Google Maps directions URL
 */
function getDirectionsUrl(location: PracticeLocation): string {
  if (location.googlePlaceId) {
    return `https://www.google.com/maps/dir/?api=1&destination_place_id=${location.googlePlaceId}`;
  }
  const address = encodeURIComponent(formatAddress(location));
  return `https://www.google.com/maps/dir/?api=1&destination=${address}`;
}

/**
 * LocationCard Component
 *
 * Display location info with all NAP (Name, Address, Phone) data.
 * Essential for local SEO and multi-location practices.
 */
export function LocationCard({
  location,
  variant = 'card',
  showMap = false,
  showHours = true,
  showServices = false,
  showDirectionsButton = true,
  showCallButton = true,
  services,
  className,
  onPhoneClick,
  onDirectionsClick,
}: LocationCardProps) {
  const { isOpen, todayHours } = isCurrentlyOpen(location.hours);
  const fullAddress = formatAddress(location);
  const directionsUrl = getDirectionsUrl(location);

  const handlePhoneClick = () => {
    onPhoneClick?.(location);
  };

  const handleDirectionsClick = () => {
    onDirectionsClick?.(location);
  };

  // Schema.org LocalBusiness structured data
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: location.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: location.addressLine1,
      addressLocality: location.city,
      addressRegion: location.state,
      postalCode: location.zip,
      addressCountry: location.country,
    },
    telephone: location.phone,
    ...(location.email && { email: location.email }),
    ...(location.latitude &&
      location.longitude && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: location.latitude,
          longitude: location.longitude,
        },
      }),
    ...(location.acceptsNewPatients !== undefined && {
      isAcceptingNewPatients: location.acceptsNewPatients,
    }),
  };

  if (variant === 'compact') {
    return (
      <div
        className={cn('flex items-start gap-3 p-4 border rounded-lg', className)}
        itemScope
        itemType="https://schema.org/MedicalClinic"
      >
        <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold" itemProp="name">
            {location.name}
          </h3>
          <p className="text-sm text-muted-foreground" itemProp="address">
            {fullAddress}
          </p>
          <a
            href={`tel:${location.phone}`}
            className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-1"
            itemProp="telephone"
            onClick={handlePhoneClick}
          >
            <Phone className="h-3 w-3" />
            {location.phone}
          </a>
        </div>
        {showCallButton && (
          <Button size="sm" variant="outline" asChild>
            <a href={`tel:${location.phone}`} onClick={handlePhoneClick}>
              <Phone className="h-4 w-4" />
            </a>
          </Button>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </div>
    );
  }

  // Full card variant (default)
  return (
    <Card className={className} itemScope itemType="https://schema.org/MedicalClinic">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg" itemProp="name">
              {location.name}
            </CardTitle>
            {location.isPrimary && (
              <Badge variant="secondary" className="mt-1">
                Main Location
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {isOpen ? (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Open Now
              </Badge>
            ) : (
              <Badge variant="secondary">
                <XCircle className="h-3 w-3 mr-1" />
                Closed
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Address */}
        <div
          className="flex items-start gap-3"
          itemProp="address"
          itemScope
          itemType="https://schema.org/PostalAddress"
        >
          <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p itemProp="streetAddress">{location.addressLine1}</p>
            {location.addressLine2 && <p>{location.addressLine2}</p>}
            <p>
              <span itemProp="addressLocality">{location.city}</span>,{' '}
              <span itemProp="addressRegion">{location.state}</span>{' '}
              <span itemProp="postalCode">{location.zip}</span>
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-muted-foreground" />
          <a
            href={`tel:${location.phone}`}
            className="text-sm font-medium text-primary hover:underline"
            itemProp="telephone"
            onClick={handlePhoneClick}
          >
            {location.phone}
          </a>
        </div>

        {/* Email */}
        {location.email && (
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <a
              href={`mailto:${location.email}`}
              className="text-sm text-primary hover:underline"
              itemProp="email"
            >
              {location.email}
            </a>
          </div>
        )}

        {/* Today's Hours */}
        {showHours && todayHours && (
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">Today: {todayHours}</span>
          </div>
        )}

        {/* Accepting New Patients */}
        {location.acceptsNewPatients !== undefined && (
          <div className="flex items-center gap-2">
            {location.acceptsNewPatients ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700">Accepting New Patients</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Not Accepting New Patients</span>
              </>
            )}
          </div>
        )}

        {/* Service Areas */}
        {location.serviceAreas && location.serviceAreas.length > 0 && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Serving: </span>
            {location.serviceAreas.join(', ')}
          </div>
        )}

        {/* Available Services */}
        {showServices && services && services.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Services Available:</p>
            <div className="flex flex-wrap gap-1">
              {services.slice(0, 5).map((service) => (
                <Badge key={service.slug} variant="outline" className="text-xs">
                  {service.name}
                </Badge>
              ))}
              {services.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{services.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Map Embed */}
        {showMap && location.googleMapsEmbed && (
          <div className="aspect-video rounded-lg overflow-hidden border">
            <iframe
              src={location.googleMapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map of ${location.name}`}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {showCallButton && (
            <Button asChild className="flex-1">
              <a href={`tel:${location.phone}`} onClick={handlePhoneClick}>
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </a>
            </Button>
          )}
          {showDirectionsButton && (
            <Button variant="outline" asChild className="flex-1" onClick={handleDirectionsClick}>
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </a>
            </Button>
          )}
        </div>

        {/* Google Business Link */}
        {location.googleBusinessUrl && (
          <a
            href={location.googleBusinessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          >
            View on Google
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </CardContent>

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    </Card>
  );
}

export default LocationCard;
