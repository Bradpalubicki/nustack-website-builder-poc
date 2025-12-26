/**
 * Script Loading Utilities
 *
 * Provides optimized script loading strategies for third-party scripts.
 * Proper script loading is critical for Core Web Vitals performance.
 *
 * Key strategies:
 * - Defer non-critical scripts to avoid blocking render
 * - Use async for independent scripts that don't need DOM
 * - Delay third-party scripts until after user interaction
 *
 * @see https://web.dev/articles/efficiently-load-third-party-javascript
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/** Script loading strategies */
export type ScriptLoadingStrategy = 'async' | 'defer' | 'blocking' | 'delayed';

/** Script importance levels */
export type ScriptImportance = 'critical' | 'high' | 'low';

/** Compression algorithms in order of preference */
export type CompressionAlgorithm = 'br' | 'gzip' | 'zstd';

/** Options for script loading */
export interface ScriptLoadOptions {
  /** Loading strategy */
  strategy?: ScriptLoadingStrategy;
  /** Script importance for resource prioritization */
  importance?: ScriptImportance;
  /** Delay in milliseconds before loading (for delayed strategy) */
  delay?: number;
  /** Whether to wait for user interaction before loading */
  waitForInteraction?: boolean;
  /** Callback when script loads */
  onLoad?: () => void;
  /** Callback when script fails to load */
  onError?: (error: Error) => void;
  /** Additional attributes to add to script element */
  attributes?: Record<string, string>;
  /** Nonce for CSP */
  nonce?: string;
}

/** Script entry for batch loading */
export interface ScriptEntry {
  src: string;
  options?: ScriptLoadOptions;
}

/** Loaded script registry entry */
interface LoadedScript {
  src: string;
  element: HTMLScriptElement;
  loadedAt: number;
  strategy: ScriptLoadingStrategy;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/** Preferred compression algorithms in order */
export const COMPRESSION_PREFERENCE: CompressionAlgorithm[] = ['br', 'gzip', 'zstd'];

/** Default delay for delayed scripts (ms) */
export const DEFAULT_DELAY = 3000;

/** User interaction events that trigger delayed script loading */
const INTERACTION_EVENTS = [
  'scroll',
  'click',
  'touchstart',
  'mousemove',
  'keydown',
] as const;

// ============================================================================
// STATE
// ============================================================================

/** Registry of loaded scripts to prevent duplicates */
const loadedScripts = new Map<string, LoadedScript>();

/** Queue of scripts waiting for user interaction */
const interactionQueue: Array<{ src: string; options: ScriptLoadOptions }> = [];

/** Whether interaction listeners have been set up */
let interactionListenersSet = false;

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

/**
 * Load a script with optimized settings
 *
 * @param src - Script source URL
 * @param options - Loading options
 * @returns Promise that resolves when script loads
 */
export function loadScript(
  src: string,
  options: ScriptLoadOptions = {}
): Promise<HTMLScriptElement> {
  const {
    strategy = 'defer',
    importance = 'low',
    delay = DEFAULT_DELAY,
    waitForInteraction = false,
    onLoad,
    onError,
    attributes = {},
    nonce,
  } = options;

  // Check if already loaded
  const existing = loadedScripts.get(src);
  if (existing) {
    onLoad?.();
    return Promise.resolve(existing.element);
  }

  // Handle delayed loading strategies
  if (waitForInteraction) {
    return loadOnInteraction(src, options);
  }

  if (strategy === 'delayed') {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        loadScriptElement(src, { ...options, strategy: 'async' })
          .then(resolve)
          .catch(reject);
      }, delay);
    });
  }

  return loadScriptElement(src, options);
}

/**
 * Load multiple scripts in parallel
 *
 * @param scripts - Array of script entries
 * @returns Promise that resolves when all scripts load
 */
export function loadScripts(scripts: ScriptEntry[]): Promise<HTMLScriptElement[]> {
  return Promise.all(scripts.map(({ src, options }) => loadScript(src, options)));
}

/**
 * Load multiple scripts sequentially
 *
 * Use this when scripts have dependencies on each other.
 *
 * @param scripts - Array of script entries in load order
 * @returns Promise that resolves when all scripts load
 */
export async function loadScriptsSequential(
  scripts: ScriptEntry[]
): Promise<HTMLScriptElement[]> {
  const loaded: HTMLScriptElement[] = [];

  for (const { src, options } of scripts) {
    const element = await loadScript(src, options);
    loaded.push(element);
  }

  return loaded;
}

/**
 * Preload a script without executing it
 *
 * Use this to hint to the browser that a script will be needed soon.
 */
export function preloadScript(src: string): void {
  if (typeof document === 'undefined') return;

  // Check if preload link already exists
  const existing = document.querySelector(`link[rel="preload"][href="${src}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'script';
  link.href = src;
  document.head.appendChild(link);
}

/**
 * Prefetch a script for future navigation
 *
 * Lower priority than preload, fetches during idle time.
 */
export function prefetchScript(src: string): void {
  if (typeof document === 'undefined') return;

  const existing = document.querySelector(`link[rel="prefetch"][href="${src}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = 'script';
  link.href = src;
  document.head.appendChild(link);
}

/**
 * Remove a loaded script from the DOM and registry
 */
export function unloadScript(src: string): boolean {
  const entry = loadedScripts.get(src);
  if (!entry) return false;

  entry.element.remove();
  loadedScripts.delete(src);
  return true;
}

/**
 * Check if a script is already loaded
 */
export function isScriptLoaded(src: string): boolean {
  return loadedScripts.has(src);
}

/**
 * Get compression Accept-Encoding header value
 *
 * Returns the preferred compression algorithms for the Accept-Encoding header.
 */
export function getCompressionPreference(): string {
  return COMPRESSION_PREFERENCE.join(', ');
}

/**
 * Get recommended third-party script loading configuration
 *
 * Returns optimized settings based on script category.
 */
export function getThirdPartyScriptConfig(
  category: 'analytics' | 'ads' | 'social' | 'chat' | 'maps' | 'video' | 'other'
): ScriptLoadOptions {
  switch (category) {
    case 'analytics':
      // Analytics should load early but not block
      return {
        strategy: 'async',
        importance: 'high',
        waitForInteraction: false,
      };

    case 'ads':
      // Ads should defer until after main content
      return {
        strategy: 'delayed',
        importance: 'low',
        delay: 3000,
      };

    case 'social':
      // Social widgets can wait for interaction
      return {
        strategy: 'delayed',
        importance: 'low',
        waitForInteraction: true,
      };

    case 'chat':
      // Chat widgets can wait for scroll/interaction
      return {
        strategy: 'delayed',
        importance: 'low',
        waitForInteraction: true,
        delay: 5000,
      };

    case 'maps':
      // Maps should load on interaction or when visible
      return {
        strategy: 'delayed',
        importance: 'low',
        waitForInteraction: true,
      };

    case 'video':
      // Video players can defer
      return {
        strategy: 'defer',
        importance: 'low',
      };

    default:
      return {
        strategy: 'defer',
        importance: 'low',
      };
  }
}

// ============================================================================
// INTERNAL FUNCTIONS
// ============================================================================

/**
 * Create and load a script element
 */
function loadScriptElement(
  src: string,
  options: ScriptLoadOptions
): Promise<HTMLScriptElement> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('Cannot load script in non-browser environment'));
      return;
    }

    const {
      strategy = 'defer',
      onLoad,
      onError,
      attributes = {},
      nonce,
    } = options;

    const script = document.createElement('script');
    script.src = src;

    // Set loading strategy
    if (strategy === 'async') {
      script.async = true;
    } else if (strategy === 'defer') {
      script.defer = true;
    }

    // Set nonce for CSP
    if (nonce) {
      script.nonce = nonce;
    }

    // Set additional attributes
    for (const [key, value] of Object.entries(attributes)) {
      script.setAttribute(key, value);
    }

    // Handle load event
    script.onload = () => {
      loadedScripts.set(src, {
        src,
        element: script,
        loadedAt: Date.now(),
        strategy,
      });
      onLoad?.();
      resolve(script);
    };

    // Handle error event
    script.onerror = () => {
      const error = new Error(`Failed to load script: ${src}`);
      onError?.(error);
      reject(error);
    };

    // Append to document
    document.head.appendChild(script);
  });
}

/**
 * Load script after user interaction
 */
function loadOnInteraction(
  src: string,
  options: ScriptLoadOptions
): Promise<HTMLScriptElement> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Cannot wait for interaction in non-browser environment'));
      return;
    }

    // Add to queue
    interactionQueue.push({
      src,
      options: {
        ...options,
        onLoad: () => {
          options.onLoad?.();
          const script = loadedScripts.get(src);
          if (script) resolve(script.element);
        },
        onError: (error) => {
          options.onError?.(error);
          reject(error);
        },
      },
    });

    // Set up listeners if not already done
    if (!interactionListenersSet) {
      setupInteractionListeners();
    }
  });
}

/**
 * Set up listeners for user interaction
 */
function setupInteractionListeners(): void {
  if (typeof window === 'undefined') return;

  const handleInteraction = () => {
    // Remove listeners
    INTERACTION_EVENTS.forEach((event) => {
      window.removeEventListener(event, handleInteraction, { capture: true });
    });

    // Load all queued scripts
    while (interactionQueue.length > 0) {
      const entry = interactionQueue.shift();
      if (entry) {
        loadScriptElement(entry.src, entry.options).catch(() => {
          // Error handling done in options.onError
        });
      }
    }
  };

  // Add listeners for all interaction events
  INTERACTION_EVENTS.forEach((event) => {
    window.addEventListener(event, handleInteraction, {
      once: true,
      capture: true,
      passive: true,
    });
  });

  interactionListenersSet = true;
}
