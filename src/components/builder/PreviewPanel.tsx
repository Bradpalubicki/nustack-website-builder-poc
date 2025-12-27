'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Monitor,
  Tablet,
  Smartphone,
  RefreshCw,
  ExternalLink,
  Maximize2,
  Loader2,
} from 'lucide-react';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface PreviewPanelProps {
  previewUrl?: string | null;
  html?: string; // Support inline HTML via srcDoc
  isLoading?: boolean;
}

const DEVICE_CONFIGS: Record<DeviceType, { width: string; height: string; label: string }> = {
  desktop: { width: '100%', height: '100%', label: 'Desktop' },
  tablet: { width: '768px', height: '1024px', label: 'Tablet' },
  mobile: { width: '375px', height: '667px', label: 'Mobile' },
};

export function PreviewPanel({ previewUrl, html, isLoading = false }: PreviewPanelProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [iframeLoading, setIframeLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Determine if we have content to show
  const hasContent = previewUrl || html;

  // Reset iframe loading state when URL or HTML changes
  useEffect(() => {
    if (previewUrl || html) {
      setIframeLoading(true);
      // For srcDoc, loading is nearly instant
      if (html && !previewUrl) {
        const timer = setTimeout(() => setIframeLoading(false), 100);
        return () => clearTimeout(timer);
      }
    }
  }, [previewUrl, html, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    setIframeLoading(true);
  };

  const handleOpenInNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    } else if (html) {
      // Open HTML content in new tab using data URL
      const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
      window.open(dataUrl, '_blank');
    }
  };

  const deviceConfig = DEVICE_CONFIGS[device];

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-background border rounded-lg">
        <div className="flex items-center justify-between p-3 border-b">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
        <div className="flex-1 p-4">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
      </div>
    );
  }

  // No preview content yet
  if (!hasContent) {
    return (
      <div className="h-full flex flex-col bg-background border rounded-lg">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">Preview</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Monitor className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">No Preview Available</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Start building with AI to see your site preview here
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Monitor className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">Live Preview</span>
          {iframeLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Device toggles */}
          <div className="flex items-center bg-muted rounded-md p-1 mr-2">
            <Button
              variant={device === 'desktop' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setDevice('desktop')}
              title="Desktop view"
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={device === 'tablet' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setDevice('tablet')}
              title="Tablet view"
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={device === 'mobile' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setDevice('mobile')}
              title="Mobile view"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>

          {/* Refresh button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleRefresh}
            disabled={iframeLoading}
            title="Refresh preview"
          >
            <RefreshCw className={`h-4 w-4 ${iframeLoading ? 'animate-spin' : ''}`} />
          </Button>

          {/* Open in new tab */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleOpenInNewTab}
            title="Open in new tab"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Preview container */}
      <div className="flex-1 p-4 bg-slate-100 dark:bg-slate-900 overflow-auto">
        <div
          className={`mx-auto bg-white dark:bg-slate-950 shadow-2xl rounded-lg overflow-hidden transition-all duration-300 ${
            device !== 'desktop' ? 'border-8 border-slate-800 rounded-3xl' : ''
          }`}
          style={{
            width: deviceConfig.width,
            height: device === 'desktop' ? 'calc(100% - 2rem)' : deviceConfig.height,
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        >
          {/* Device frame for mobile/tablet */}
          {device !== 'desktop' && (
            <div className="bg-slate-800 h-6 flex items-center justify-center">
              <div className="w-16 h-1 bg-slate-600 rounded-full" />
            </div>
          )}

          {/* Loading state */}
          {iframeLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-slate-950 z-10">
              <div className="text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="text-sm text-muted-foreground">Loading preview...</p>
              </div>
            </div>
          )}

          {/* iframe */}
          <iframe
            key={`${refreshKey}-${html?.length || 0}`}
            src={previewUrl || undefined}
            srcDoc={!previewUrl && html ? html : undefined}
            className={`w-full h-full border-0 transition-opacity duration-300 ${
              iframeLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIframeLoading(false)}
            title="Site Preview"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
      </div>

      {/* Device label */}
      <div className="flex items-center justify-center p-2 border-t bg-muted/30">
        <span className="text-xs text-muted-foreground">
          {deviceConfig.label} Preview
          {device !== 'desktop' && ` (${deviceConfig.width} x ${deviceConfig.height})`}
        </span>
      </div>
    </div>
  );
}

export default PreviewPanel;
