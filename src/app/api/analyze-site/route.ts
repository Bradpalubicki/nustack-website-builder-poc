import { NextRequest, NextResponse } from 'next/server';

interface SiteAnalysis {
  title?: string;
  description?: string;
  businessName?: string;
  pages: string[];
  techStack: string[];
  colors: string[];
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  seoSettings?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

async function fetchAndParseHtml(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NuStackBot/1.0; +https://nustack.io)',
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

function extractColors(html: string): string[] {
  const colors: Set<string> = new Set();

  // Extract hex colors
  const hexPattern = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/g;
  let match;
  while ((match = hexPattern.exec(html)) !== null) {
    colors.add(match[0].toUpperCase());
  }

  // Extract rgb colors
  const rgbPattern = /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/gi;
  while ((match = rgbPattern.exec(html)) !== null) {
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    colors.add(`#${r}${g}${b}`.toUpperCase());
  }

  // Filter out common default colors
  const filtered = Array.from(colors).filter((color) => {
    const normalized = color.toUpperCase();
    return (
      normalized !== '#FFFFFF' &&
      normalized !== '#FFF' &&
      normalized !== '#000000' &&
      normalized !== '#000' &&
      normalized !== '#333333' &&
      normalized !== '#666666' &&
      normalized !== '#999999' &&
      normalized !== '#CCCCCC'
    );
  });

  return filtered.slice(0, 10);
}

function extractLinks(html: string, baseUrl: string): string[] {
  const pages: Set<string> = new Set();
  const linkPattern = /<a[^>]+href=["']([^"'#]+)["']/gi;
  let match;

  try {
    const base = new URL(baseUrl);

    while ((match = linkPattern.exec(html)) !== null) {
      const href = match[1];

      // Skip external links, assets, and common non-page links
      if (
        href.startsWith('http') &&
        !href.includes(base.hostname)
      ) {
        continue;
      }

      if (
        href.includes('.css') ||
        href.includes('.js') ||
        href.includes('.png') ||
        href.includes('.jpg') ||
        href.includes('.svg') ||
        href.includes('.pdf') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:')
      ) {
        continue;
      }

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
          pages.add(parsed.pathname || '/');
        }
      } catch {
        // Invalid URL, skip
      }
    }
  } catch (error) {
    console.error('Failed to parse base URL:', error);
  }

  return Array.from(pages).slice(0, 20);
}

function detectTechStack(html: string): string[] {
  const techStack: string[] = [];

  // Detect common frameworks and technologies
  if (html.includes('__NEXT_DATA__') || html.includes('/_next/')) {
    techStack.push('Next.js');
  }
  if (html.includes('__NUXT__') || html.includes('/_nuxt/')) {
    techStack.push('Nuxt.js');
  }
  if (html.includes('data-reactroot') || html.includes('_reactRootContainer')) {
    techStack.push('React');
  }
  if (html.includes('ng-version') || html.includes('ng-app')) {
    techStack.push('Angular');
  }
  if (html.includes('data-v-') || html.includes('Vue.js')) {
    techStack.push('Vue.js');
  }
  if (html.includes('wp-content') || html.includes('wp-includes')) {
    techStack.push('WordPress');
  }
  if (html.includes('Shopify.theme') || html.includes('cdn.shopify.com')) {
    techStack.push('Shopify');
  }
  if (html.includes('wix.com') || html.includes('static.wixstatic.com')) {
    techStack.push('Wix');
  }
  if (html.includes('squarespace.com') || html.includes('static1.squarespace.com')) {
    techStack.push('Squarespace');
  }
  if (html.includes('tailwindcss') || html.includes('tailwind')) {
    techStack.push('Tailwind CSS');
  }
  if (html.includes('bootstrap')) {
    techStack.push('Bootstrap');
  }

  return techStack.length > 0 ? techStack : ['Unknown'];
}

function extractContactInfo(html: string): { phone?: string; email?: string; address?: string } {
  const contactInfo: { phone?: string; email?: string; address?: string } = {};

  // Extract phone
  const phonePattern = /(?:tel:|phone:|call us:|call:?\s*)?\+?1?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})/gi;
  const phoneMatch = html.match(phonePattern);
  if (phoneMatch) {
    contactInfo.phone = phoneMatch[0].replace(/[^\d+()-.\s]/gi, '').trim();
  }

  // Extract email
  const emailPattern = /[\w.-]+@[\w.-]+\.\w{2,}/i;
  const emailMatch = html.match(emailPattern);
  if (emailMatch) {
    contactInfo.email = emailMatch[0];
  }

  return contactInfo;
}

function extractBusinessName(html: string, title: string | undefined): string | undefined {
  // Try to extract from common patterns
  const patterns = [
    /<meta\s+property=["']og:site_name["']\s+content=["']([^"']+)["']/i,
    /<meta\s+content=["']([^"']+)["']\s+property=["']og:site_name["']/i,
    /<span[^>]*class=["'][^"']*logo[^"']*["'][^>]*>([^<]+)</i,
    /<div[^>]*class=["'][^"']*logo[^"']*["'][^>]*>([^<]+)</i,
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
      .replace(/\s*[-|•–]\s*.+$/, '') // Remove "| Tagline" style suffixes
      .replace(/\s*-\s*Home$/i, '')
      .trim();
  }

  return undefined;
}

async function analyzeGitHubRepo(url: string): Promise<SiteAnalysis> {
  // Extract owner and repo from URL
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) {
    throw new Error('Invalid GitHub URL');
  }

  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/\.git$/, '');

  // Fetch repo info from GitHub API
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
      }
    } catch {
      // Ignore package.json fetch errors
    }

    return {
      title: repoData.name,
      description: repoData.description,
      businessName: repoData.name,
      pages: ['/', '/about', '/contact'], // Default pages
      techStack: [...new Set(techStack)],
      colors: [],
      seoSettings: {
        metaTitle: repoData.name,
        metaDescription: repoData.description,
      },
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
  const contactInfo = extractContactInfo(html);

  return {
    title,
    description,
    businessName,
    pages: pages.length > 0 ? pages : ['/'],
    techStack,
    colors,
    contactInfo,
    seoSettings: {
      metaTitle: title,
      metaDescription: description,
    },
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
