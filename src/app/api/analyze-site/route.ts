import { NextRequest, NextResponse } from 'next/server';

interface SiteAnalysis {
  title?: string;
  description?: string;
  businessName?: string;
  pages: PageInfo[];
  techStack: string[];
  colors: ColorInfo[];
  fonts: string[];
  images: ImageInfo[];
  socialLinks: SocialLink[];
  navigation: NavigationItem[];
  contactInfo?: ContactInfo;
  seoSettings?: SEOSettings;
  contentSections: ContentSection[];
  analytics?: AnalyticsInfo;
}

interface PageInfo {
  path: string;
  title?: string;
  isNavigation: boolean;
}

interface ColorInfo {
  hex: string;
  usage: 'primary' | 'secondary' | 'accent' | 'background' | 'text' | 'unknown';
  frequency: number;
}

interface ImageInfo {
  src: string;
  alt?: string;
  isLogo: boolean;
  isHero: boolean;
}

interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

interface ContactInfo {
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
  formUrl?: string;
}

interface SEOSettings {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
  canonical?: string;
  robots?: string;
  schema?: string;
}

interface ContentSection {
  type: 'hero' | 'features' | 'testimonials' | 'cta' | 'pricing' | 'faq' | 'team' | 'gallery' | 'contact' | 'footer' | 'unknown';
  heading?: string;
  content?: string;
  items?: string[];
}

interface AnalyticsInfo {
  hasGoogleAnalytics: boolean;
  hasGoogleTagManager: boolean;
  hasFacebookPixel: boolean;
  hasHotjar: boolean;
}

async function fetchAndParseHtml(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NuStackBot/1.0; +https://nustack.io)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Failed to fetch URL:', error);
    throw error;
  }
}

function extractMetaContent(html: string, name: string): string | undefined {
  const patterns = [
    new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+name=["']${name}["']`, 'i'),
    new RegExp(`<meta\\s+property=["']og:${name}["']\\s+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta\\s+property=["']${name}["']\\s+content=["']([^"']+)["']`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }

  return undefined;
}

function extractTitle(html: string): string | undefined {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : undefined;
}

function extractColors(html: string): ColorInfo[] {
  const colorCounts: Map<string, number> = new Map();

  // Extract hex colors
  const hexPattern = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/g;
  let match;
  while ((match = hexPattern.exec(html)) !== null) {
    const color = match[0].toUpperCase();
    colorCounts.set(color, (colorCounts.get(color) || 0) + 1);
  }

  // Extract rgb/rgba colors
  const rgbPattern = /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)/gi;
  while ((match = rgbPattern.exec(html)) !== null) {
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    const color = `#${r}${g}${b}`.toUpperCase();
    colorCounts.set(color, (colorCounts.get(color) || 0) + 1);
  }

  // Extract hsl colors and convert to hex
  const hslPattern = /hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%(?:\s*,\s*[\d.]+)?\s*\)/gi;
  while ((match = hslPattern.exec(html)) !== null) {
    const h = parseInt(match[1]) / 360;
    const s = parseInt(match[2]) / 100;
    const l = parseInt(match[3]) / 100;
    const hex = hslToHex(h, s, l);
    colorCounts.set(hex, (colorCounts.get(hex) || 0) + 1);
  }

  // Filter out common default colors and sort by frequency
  const commonColors = new Set(['#FFFFFF', '#FFF', '#000000', '#000', '#333333', '#666666', '#999999', '#CCCCCC', '#F5F5F5', '#EEEEEE']);

  const sortedColors = Array.from(colorCounts.entries())
    .filter(([color]) => !commonColors.has(color))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return sortedColors.map(([hex, frequency], index) => ({
    hex,
    frequency,
    usage: inferColorUsage(hex, index, frequency),
  }));
}

function hslToHex(h: number, s: number, l: number): string {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function inferColorUsage(hex: string, index: number, frequency: number): ColorInfo['usage'] {
  // Simple heuristic based on position and frequency
  if (index === 0 && frequency > 5) return 'primary';
  if (index === 1 && frequency > 3) return 'secondary';
  if (index === 2) return 'accent';
  return 'unknown';
}

function extractFonts(html: string): string[] {
  const fonts: Set<string> = new Set();

  // Extract Google Fonts
  const googleFontPattern = /fonts\.googleapis\.com\/css2?\?family=([^"'&]+)/gi;
  let match;
  while ((match = googleFontPattern.exec(html)) !== null) {
    const fontFamily = decodeURIComponent(match[1])
      .split('|')
      .map(f => f.split(':')[0].replace(/\+/g, ' '));
    fontFamily.forEach(f => fonts.add(f));
  }

  // Extract from @font-face
  const fontFacePattern = /font-family:\s*["']?([^"';,}]+)["']?/gi;
  while ((match = fontFacePattern.exec(html)) !== null) {
    const fontName = match[1].trim();
    if (!fontName.includes('inherit') && !fontName.includes('sans-serif') &&
        !fontName.includes('serif') && !fontName.includes('monospace') &&
        fontName.length > 1) {
      fonts.add(fontName);
    }
  }

  // Extract Adobe Fonts (Typekit)
  if (html.includes('use.typekit.net')) {
    fonts.add('Adobe Fonts (Typekit)');
  }

  return Array.from(fonts).slice(0, 5);
}

function extractImages(html: string, baseUrl: string): ImageInfo[] {
  const images: ImageInfo[] = [];
  const seenSrcs: Set<string> = new Set();

  const imgPattern = /<img[^>]+>/gi;
  let match;

  while ((match = imgPattern.exec(html)) !== null) {
    const imgTag = match[0];

    // Extract src
    const srcMatch = imgTag.match(/src=["']([^"']+)["']/i);
    if (!srcMatch) continue;

    let src = srcMatch[1];

    // Skip data URIs and duplicates
    if (src.startsWith('data:') || seenSrcs.has(src)) continue;

    // Normalize URL
    try {
      if (src.startsWith('//')) {
        src = 'https:' + src;
      } else if (src.startsWith('/')) {
        const base = new URL(baseUrl);
        src = `${base.origin}${src}`;
      } else if (!src.startsWith('http')) {
        const base = new URL(baseUrl);
        src = `${base.origin}/${src}`;
      }
    } catch {
      continue;
    }

    seenSrcs.add(src);

    // Extract alt text
    const altMatch = imgTag.match(/alt=["']([^"']*)["']/i);
    const alt = altMatch ? altMatch[1] : undefined;

    // Detect if logo
    const isLogo = /logo|brand/i.test(imgTag) || /logo|brand/i.test(src);

    // Detect if hero image
    const isHero = /hero|banner|cover|jumbotron/i.test(imgTag) ||
                   /hero|banner|cover/i.test(src) ||
                   imgTag.includes('width="100%"') ||
                   imgTag.includes('w-full');

    images.push({ src, alt, isLogo, isHero });
  }

  // Also extract background images from inline styles
  const bgPattern = /background(?:-image)?:\s*url\(["']?([^"')]+)["']?\)/gi;
  while ((match = bgPattern.exec(html)) !== null) {
    let src = match[1];
    if (src.startsWith('data:') || seenSrcs.has(src)) continue;

    try {
      if (src.startsWith('/')) {
        const base = new URL(baseUrl);
        src = `${base.origin}${src}`;
      }
    } catch {
      continue;
    }

    seenSrcs.add(src);
    images.push({ src, isLogo: false, isHero: true });
  }

  return images.slice(0, 20);
}

function extractSocialLinks(html: string): SocialLink[] {
  const socialLinks: SocialLink[] = [];
  const platforms = [
    { name: 'Facebook', patterns: [/facebook\.com/i, /fb\.com/i] },
    { name: 'Twitter', patterns: [/twitter\.com/i, /x\.com/i] },
    { name: 'Instagram', patterns: [/instagram\.com/i] },
    { name: 'LinkedIn', patterns: [/linkedin\.com/i] },
    { name: 'YouTube', patterns: [/youtube\.com/i, /youtu\.be/i] },
    { name: 'TikTok', patterns: [/tiktok\.com/i] },
    { name: 'Pinterest', patterns: [/pinterest\.com/i] },
    { name: 'GitHub', patterns: [/github\.com/i] },
    { name: 'Discord', patterns: [/discord\.gg/i, /discord\.com/i] },
    { name: 'Telegram', patterns: [/t\.me/i, /telegram\.me/i] },
  ];

  const linkPattern = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
  let match;

  while ((match = linkPattern.exec(html)) !== null) {
    const href = match[1];

    for (const platform of platforms) {
      if (platform.patterns.some(p => p.test(href))) {
        if (!socialLinks.find(l => l.platform === platform.name)) {
          socialLinks.push({
            platform: platform.name,
            url: href,
          });
        }
        break;
      }
    }
  }

  return socialLinks;
}

function extractNavigation(html: string, baseUrl: string): NavigationItem[] {
  const navItems: NavigationItem[] = [];

  // Look for navigation elements
  const navPatterns = [
    /<nav[^>]*>([\s\S]*?)<\/nav>/gi,
    /<header[^>]*>([\s\S]*?)<\/header>/gi,
    /<div[^>]*class=["'][^"']*(?:nav|menu|header)[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi,
  ];

  let navHtml = '';
  for (const pattern of navPatterns) {
    const match = pattern.exec(html);
    if (match) {
      navHtml = match[1];
      break;
    }
  }

  if (!navHtml) return navItems;

  // Extract links from navigation
  const linkPattern = /<a[^>]+href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi;
  let match;

  const base = new URL(baseUrl);

  while ((match = linkPattern.exec(navHtml)) !== null) {
    const href = match[1];
    const label = match[2].trim();

    // Skip external links and common non-nav items
    if (href.startsWith('http') && !href.includes(base.hostname)) continue;
    if (href.startsWith('#') && href.length > 1) continue;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) continue;
    if (href.startsWith('javascript:')) continue;

    if (label && label.length > 0 && label.length < 50) {
      navItems.push({ label, href });
    }
  }

  return navItems.slice(0, 10);
}

function extractLinks(html: string, baseUrl: string): PageInfo[] {
  const pages: Map<string, PageInfo> = new Map();
  const linkPattern = /<a[^>]+href=["']([^"'#]+)["'][^>]*>([^<]*)<\/a>/gi;
  let match;

  try {
    const base = new URL(baseUrl);
    const navItems = extractNavigation(html, baseUrl);
    const navPaths = new Set(navItems.map(n => n.href));

    while ((match = linkPattern.exec(html)) !== null) {
      const href = match[1];
      const linkText = match[2].trim();

      // Skip external links, assets, and common non-page links
      if (href.startsWith('http') && !href.includes(base.hostname)) continue;
      if (/\.(css|js|png|jpg|jpeg|gif|svg|pdf|ico|woff|woff2|ttf|eot)$/i.test(href)) continue;
      if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;

      // Normalize the URL
      let fullUrl: string;
      if (href.startsWith('/')) {
        fullUrl = `${base.origin}${href}`;
      } else if (href.startsWith('http')) {
        fullUrl = href;
      } else {
        fullUrl = `${base.origin}/${href}`;
      }

      // Extract just the path
      try {
        const parsed = new URL(fullUrl);
        if (parsed.hostname === base.hostname) {
          const path = parsed.pathname || '/';
          if (!pages.has(path)) {
            pages.set(path, {
              path,
              title: linkText || undefined,
              isNavigation: navPaths.has(href) || navPaths.has(path),
            });
          }
        }
      } catch {
        // Invalid URL, skip
      }
    }
  } catch (error) {
    console.error('Failed to parse base URL:', error);
  }

  return Array.from(pages.values()).slice(0, 30);
}

function detectTechStack(html: string): string[] {
  const techStack: string[] = [];

  const detections = [
    { name: 'Next.js', patterns: ['__NEXT_DATA__', '/_next/'] },
    { name: 'Nuxt.js', patterns: ['__NUXT__', '/_nuxt/'] },
    { name: 'Gatsby', patterns: ['___gatsby', '/static/'] },
    { name: 'React', patterns: ['data-reactroot', '_reactRootContainer', 'react-dom'] },
    { name: 'Angular', patterns: ['ng-version', 'ng-app', 'angular'] },
    { name: 'Vue.js', patterns: ['data-v-', '__VUE__', 'Vue.js'] },
    { name: 'Svelte', patterns: ['svelte-', '__svelte'] },
    { name: 'WordPress', patterns: ['wp-content', 'wp-includes', '/wp-json/'] },
    { name: 'Shopify', patterns: ['Shopify.theme', 'cdn.shopify.com'] },
    { name: 'Wix', patterns: ['wix.com', 'static.wixstatic.com'] },
    { name: 'Squarespace', patterns: ['squarespace.com', 'static1.squarespace.com'] },
    { name: 'Webflow', patterns: ['webflow.com', '.webflow.'] },
    { name: 'Framer', patterns: ['framer.', 'framerusercontent.com'] },
    { name: 'Tailwind CSS', patterns: ['tailwindcss', 'tailwind.config'] },
    { name: 'Bootstrap', patterns: ['bootstrap.min', 'bootstrap.css', 'bootstrap.bundle'] },
    { name: 'Material UI', patterns: ['MuiButton', 'MuiTypography', '@mui'] },
    { name: 'Chakra UI', patterns: ['chakra-ui'] },
    { name: 'jQuery', patterns: ['jquery.min', 'jQuery'] },
    { name: 'Vercel', patterns: ['vercel.app', '_vercel'] },
    { name: 'Netlify', patterns: ['netlify.app', 'netlify.com'] },
    { name: 'Cloudflare', patterns: ['cloudflareinsights', 'cf-ray'] },
  ];

  for (const tech of detections) {
    if (tech.patterns.some(pattern => html.toLowerCase().includes(pattern.toLowerCase()))) {
      techStack.push(tech.name);
    }
  }

  return techStack.length > 0 ? techStack : ['Unknown'];
}

function extractContactInfo(html: string): ContactInfo {
  const contactInfo: ContactInfo = {};

  // Extract phone (various formats)
  const phonePatterns = [
    /(?:tel:|phone:|call us:|call:?\s*)?\+?1?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})/gi,
    /\+\d{1,3}[-.\s]?\d{2,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g,
  ];

  for (const pattern of phonePatterns) {
    const phoneMatch = html.match(pattern);
    if (phoneMatch) {
      contactInfo.phone = phoneMatch[0].replace(/[^\d+()-.\s]/gi, '').trim();
      break;
    }
  }

  // Extract email
  const emailPattern = /[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}/i;
  const emailMatch = html.match(emailPattern);
  if (emailMatch) {
    contactInfo.email = emailMatch[0];
  }

  // Extract address (look near common address indicators)
  const addressPatterns = [
    /<address[^>]*>([\s\S]*?)<\/address>/i,
    /(?:address|location|headquarters|office)[\s:]+([^<]+)/i,
  ];

  for (const pattern of addressPatterns) {
    const addressMatch = html.match(pattern);
    if (addressMatch) {
      contactInfo.address = addressMatch[1].replace(/<[^>]+>/g, ' ').trim().substring(0, 200);
      break;
    }
  }

  // Look for contact form
  if (html.includes('<form') && (html.includes('contact') || html.includes('message'))) {
    contactInfo.formUrl = '/contact';
  }

  return contactInfo;
}

function extractBusinessName(html: string, title: string | undefined): string | undefined {
  const patterns = [
    /<meta\s+property=["']og:site_name["']\s+content=["']([^"']+)["']/i,
    /<meta\s+content=["']([^"']+)["']\s+property=["']og:site_name["']/i,
    /<span[^>]*class=["'][^"']*logo[^"']*["'][^>]*>([^<]+)</i,
    /<div[^>]*class=["'][^"']*logo[^"']*["'][^>]*>([^<]+)</i,
    /<a[^>]*class=["'][^"']*logo[^"']*["'][^>]*>([^<]+)</i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1].trim()) {
      return match[1].trim();
    }
  }

  // Fall back to title, removing common suffixes
  if (title) {
    return title
      .replace(/\s*[-|•–—]\s*.+$/, '') // Remove "| Tagline" style suffixes
      .replace(/\s*-\s*Home$/i, '')
      .replace(/\s*-\s*Official\s*(?:Website|Site)?$/i, '')
      .trim();
  }

  return undefined;
}

function extractContentSections(html: string): ContentSection[] {
  const sections: ContentSection[] = [];

  // Detect hero section
  if (/class=["'][^"']*(?:hero|banner|jumbotron)[^"']*["']/i.test(html)) {
    const heroMatch = html.match(/<(?:section|div)[^>]*class=["'][^"']*(?:hero|banner)[^"']*["'][^>]*>([\s\S]*?)<\/(?:section|div)>/i);
    if (heroMatch) {
      const h1Match = heroMatch[1].match(/<h1[^>]*>([^<]+)<\/h1>/i);
      sections.push({
        type: 'hero',
        heading: h1Match ? h1Match[1].trim() : undefined,
      });
    }
  }

  // Detect features section
  if (/(?:features?|benefits?|why\s+choose|what\s+we\s+offer)/i.test(html)) {
    sections.push({ type: 'features' });
  }

  // Detect testimonials
  if (/(?:testimonials?|reviews?|what\s+(?:our\s+)?(?:clients?|customers?)\s+say)/i.test(html)) {
    sections.push({ type: 'testimonials' });
  }

  // Detect pricing
  if (/(?:pricing|plans?|packages?)/i.test(html) && /\$\d+|\d+\s*\/\s*mo/i.test(html)) {
    sections.push({ type: 'pricing' });
  }

  // Detect FAQ
  if (/(?:faq|frequently\s+asked|questions?)/i.test(html)) {
    sections.push({ type: 'faq' });
  }

  // Detect team section
  if (/(?:our\s+team|meet\s+the\s+team|about\s+us)/i.test(html)) {
    sections.push({ type: 'team' });
  }

  // Detect CTA
  if (/(?:get\s+started|sign\s+up|try\s+free|contact\s+us|request\s+(?:a\s+)?demo)/i.test(html)) {
    sections.push({ type: 'cta' });
  }

  // Detect contact section
  if (/class=["'][^"']*contact[^"']*["']/i.test(html) || /<form[^>]*id=["']contact/i.test(html)) {
    sections.push({ type: 'contact' });
  }

  return sections;
}

function extractAnalytics(html: string): AnalyticsInfo {
  return {
    hasGoogleAnalytics: /google-analytics\.com|gtag\(|ga\('send'/i.test(html),
    hasGoogleTagManager: /googletagmanager\.com/i.test(html),
    hasFacebookPixel: /facebook\.net\/en_US\/fbevents|fbq\('/i.test(html),
    hasHotjar: /hotjar\.com/i.test(html),
  };
}

function extractSEOSettings(html: string): SEOSettings {
  return {
    metaTitle: extractTitle(html),
    metaDescription: extractMetaContent(html, 'description'),
    metaKeywords: extractMetaContent(html, 'keywords')?.split(',').map(k => k.trim()),
    ogImage: extractMetaContent(html, 'image') || extractMetaContent(html, 'og:image'),
    canonical: (() => {
      const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
      return match ? match[1] : undefined;
    })(),
    robots: extractMetaContent(html, 'robots'),
    schema: (() => {
      const match = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
      return match ? 'Detected' : undefined;
    })(),
  };
}

async function analyzeGitHubRepo(url: string): Promise<SiteAnalysis> {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) {
    throw new Error('Invalid GitHub URL');
  }

  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/\.git$/, '');
  const apiUrl = `https://api.github.com/repos/${owner}/${cleanRepo}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'NuStack-Builder',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repoData = await response.json();

    // Fetch languages
    const languagesResponse = await fetch(`${apiUrl}/languages`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'NuStack-Builder',
      },
    });

    const languages = languagesResponse.ok ? await languagesResponse.json() : {};

    // Determine tech stack from languages
    const techStack: string[] = [];
    if (languages['TypeScript']) techStack.push('TypeScript');
    if (languages['JavaScript']) techStack.push('JavaScript');
    if (languages['HTML']) techStack.push('HTML');
    if (languages['CSS']) techStack.push('CSS');
    if (languages['SCSS']) techStack.push('SCSS');

    // Try to fetch package.json to detect frameworks
    try {
      const packageJsonResponse = await fetch(
        `https://raw.githubusercontent.com/${owner}/${cleanRepo}/main/package.json`
      );
      if (packageJsonResponse.ok) {
        const packageJson = await packageJsonResponse.json();
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

        if (deps['next']) techStack.push('Next.js');
        if (deps['react']) techStack.push('React');
        if (deps['vue']) techStack.push('Vue.js');
        if (deps['nuxt']) techStack.push('Nuxt.js');
        if (deps['tailwindcss']) techStack.push('Tailwind CSS');
        if (deps['bootstrap']) techStack.push('Bootstrap');
        if (deps['@angular/core']) techStack.push('Angular');
        if (deps['svelte']) techStack.push('Svelte');
      }
    } catch {
      // Ignore package.json fetch errors
    }

    // Try to fetch README for additional context
    let description = repoData.description;
    try {
      const readmeResponse = await fetch(
        `https://raw.githubusercontent.com/${owner}/${cleanRepo}/main/README.md`
      );
      if (readmeResponse.ok) {
        const readme = await readmeResponse.text();
        const firstParagraph = readme.split('\n\n')[1]?.substring(0, 200);
        if (firstParagraph && !description) {
          description = firstParagraph.replace(/[#*`]/g, '').trim();
        }
      }
    } catch {
      // Ignore README fetch errors
    }

    return {
      title: repoData.name,
      description,
      businessName: repoData.name,
      pages: [
        { path: '/', isNavigation: true },
        { path: '/about', isNavigation: true },
        { path: '/contact', isNavigation: true },
      ],
      techStack: [...new Set(techStack)],
      colors: [],
      fonts: [],
      images: [],
      socialLinks: repoData.homepage ? [{ platform: 'Website', url: repoData.homepage }] : [],
      navigation: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ],
      seoSettings: {
        metaTitle: repoData.name,
        metaDescription: description,
      },
      contentSections: [
        { type: 'hero' },
        { type: 'features' },
        { type: 'cta' },
      ],
    };
  } catch (error) {
    console.error('GitHub analysis error:', error);
    throw new Error('Failed to analyze GitHub repository');
  }
}

async function analyzeWebsite(url: string): Promise<SiteAnalysis> {
  const html = await fetchAndParseHtml(url);

  const title = extractTitle(html);
  const description = extractMetaContent(html, 'description');
  const businessName = extractBusinessName(html, title);
  const pages = extractLinks(html, url);
  const techStack = detectTechStack(html);
  const colors = extractColors(html);
  const fonts = extractFonts(html);
  const images = extractImages(html, url);
  const socialLinks = extractSocialLinks(html);
  const navigation = extractNavigation(html, url);
  const contactInfo = extractContactInfo(html);
  const seoSettings = extractSEOSettings(html);
  const contentSections = extractContentSections(html);
  const analytics = extractAnalytics(html);

  return {
    title,
    description,
    businessName,
    pages: pages.length > 0 ? pages : [{ path: '/', isNavigation: true }],
    techStack,
    colors,
    fonts,
    images,
    socialLinks,
    navigation,
    contactInfo,
    seoSettings,
    contentSections,
    analytics,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, method } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    let analysis: SiteAnalysis;

    if (method === 'github') {
      analysis = await analyzeGitHubRepo(url);
    } else {
      analysis = await analyzeWebsite(url);
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Site analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze site' },
      { status: 500 }
    );
  }
}
