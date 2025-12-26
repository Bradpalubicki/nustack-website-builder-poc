'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GoogleMapEmbedProps {
  /** Google Maps embed URL */
  embedUrl?: string;
  /** Google Place ID for generating embed */
  placeId?: string;
  /** Latitude for static map fallback */
  latitude?: number;
  /** Longitude for static map fallback */
  longitude?: number;
  /** Height in pixels */
  height?: number;
  /** Whether to show directions link */
  showDirections?: boolean;
  /** Custom marker label */
  markerLabel?: string;
  /** Address for fallback */
  address?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Generate Google Maps embed URL from place ID
 */
function generateEmbedUrl(placeId: string): string {
  return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=place_id:${placeId}`;
}

/**
 * Generate static map URL for fallback
 */
function generateStaticMapUrl(lat: number, lng: number, label?: string): string {
  const marker = label ? `markers=label:${label}%7C${lat},${lng}` : `markers=${lat},${lng}`;
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x400&${marker}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`;
}

/**
 * Generate directions URL
 */
function generateDirectionsUrl(placeId?: string, lat?: number, lng?: number, address?: string): string {
  if (placeId) {
    return `https://www.google.com/maps/dir/?api=1&destination_place_id=${placeId}`;
  }
  if (lat && lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }
  if (address) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  }
  return 'https://maps.google.com';
}

/**
 * GoogleMapEmbed Component
 *
 * Embedded Google Map with proper styling.
 * Supports lazy loading and fallback to static map.
 */
export function GoogleMapEmbed({
  embedUrl,
  placeId,
  latitude,
  longitude,
  height = 400,
  showDirections = true,
  markerLabel,
  address,
  className,
}: GoogleMapEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Determine the map URL to use
  const mapUrl = embedUrl || (placeId ? generateEmbedUrl(placeId) : null);
  const directionsUrl = generateDirectionsUrl(placeId, latitude, longitude, address);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // If we have no map URL and no coordinates, show a placeholder
  if (!mapUrl && (!latitude || !longitude)) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center bg-muted rounded-lg border',
          className
        )}
        style={{ height }}
      >
        <MapPin className="h-12 w-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground text-sm mb-4">Map not available</p>
        {address && (
          <Button variant="outline" size="sm" asChild>
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation className="h-4 w-4 mr-2" />
              Get Directions
            </a>
          </Button>
        )}
      </div>
    );
  }

  // If there's an error or no embed URL, show static map
  if (hasError || !mapUrl) {
    const staticMapUrl =
      latitude && longitude ? generateStaticMapUrl(latitude, longitude, markerLabel) : null;

    return (
      <div className={cn('relative rounded-lg overflow-hidden border', className)} style={{ height }}>
        {staticMapUrl ? (
          <img
            src={staticMapUrl}
            alt={address || 'Map location'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <MapPin className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        {showDirections && (
          <div className="absolute bottom-4 right-4">
            <Button size="sm" asChild>
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </a>
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Show interactive embed
  return (
    <div className={cn('relative rounded-lg overflow-hidden border', className)} style={{ height }}>
      {isLoading && (
        <Skeleton className="absolute inset-0" />
      )}
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={address || 'Google Map'}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(isLoading && 'opacity-0')}
      />
      {showDirections && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button size="sm" asChild>
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation className="h-4 w-4 mr-2" />
              Get Directions
            </a>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a
              href={`https://www.google.com/maps/place/?q=place_id:${placeId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}

export default GoogleMapEmbed;
