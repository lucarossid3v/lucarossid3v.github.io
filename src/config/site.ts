/**
 * Granular Feature Flags ("Complete by default, minimalist on demand")
 *
 * All flags default to `true` when omitted.
 * Minimalist or purist technical writers can set any flag to `false`
 * to completely eliminate markup, styles, and scripts during SSG build.
 */
export interface SiteFeatures {
  /** Full-text search modal + Ctrl/Cmd+K shortcuts + header triggers */
  search?: boolean;
  /** Sticky sidebar table of contents in blog posts */
  tableOfContents?: boolean;
  /** "X min read" badge in post headers */
  readingTime?: boolean;
  /** Accessible text-to-speech audio reader in blog posts and project details */
  audioPlayer?: boolean;
  /** Tag badges in post headers, article cards, and tag clouds */
  tags?: boolean;
  /** Notion-style share modal and trigger bar in blog posts */
  socialShare?: boolean;
  /** Theme toggle dropdown (White, Cream, Slate, Midnight) */
  themeSwitcher?: boolean;
  /** Floating smooth-scroll back-to-top button */
  backToTop?: boolean;
  /** Medium-style smooth image zoom modal on click */
  imageZoom?: boolean;
  /** Interactive blog comments powered by ScatterLeaf */
  comments?: boolean;
}

export interface SiteConfig {
  title: string;
  tagline: string;
  description: string;
  author: string;
  siteUrl: string;
  defaultTheme: 'white' | 'cream' | 'slate' | 'midnight';
  features?: SiteFeatures;
  socialLinks: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
  navLinks: {
    title: string;
    href: string;
  }[];
  comments?: {
    enabled: boolean;
    provider: 'scatterleaf';
    repo: string;
    category?: string;
    theme?: 'auto' | 'light' | 'dark' | 'cream' | 'midnight' | 'slate';
    lang?: string;
    broker?: string;
    clientId?: string;
    order?: 'oldest' | 'newest';
    features?: {
      reactions?: boolean;
      skinTone?: boolean;
      sorting?: boolean;
      codeScroll?: boolean;
      preview?: boolean;
      search?: boolean;
      images?: boolean;
    };
  };
}

export const siteConfig: SiteConfig = {
  title: 'lucarossi.d3',
  tagline: 'Notes on software, programming and technology.',
  description:
    'A tech and programming blog by Luca Rossi: Laravel/PHP, AI and LLM integration, DevOps and the craft of building software.',
  author: 'Luca Rossi',
  // Production domain (used for canonical SEO, OpenGraph, sitemap and RSS).
  // Placeholder until the final domain is decided; override via the SITE_URL environment variable.
  siteUrl:
    (typeof process !== 'undefined' && process.env?.SITE_URL) ||
    (import.meta as any).env?.SITE_URL ||
    'https://lucarossid3v.github.io',
  defaultTheme: 'cream',
  // Granular Feature Flags — "Complete by default, minimalist on demand"
  // Toggle any feature to false to completely omit markup & scripts in static build
  features: {
    search: true,
    tableOfContents: true,
    readingTime: true,
    audioPlayer: true,
    tags: true,
    socialShare: true,
    themeSwitcher: true,
    backToTop: true,
    imageZoom: true,
    // Off until a ScatterLeaf broker is configured (otherwise it shows simulated comments)
    comments: false,
  },
  socialLinks: {
    github: 'https://github.com/lucarossid3v',
    linkedin: 'https://www.linkedin.com/in/nextneed',
    email: 'mailto:l.rossi.d3v@gmail.com',
  },
  navLinks: [
    { title: 'Home', href: '/' },
    { title: 'Blog', href: '/blog' },
    { title: 'Projects', href: '/projects' },
    { title: 'Tags', href: '/tags' },
    { title: 'About', href: '/about' },
  ],
  comments: {
    enabled: false,
    provider: 'scatterleaf',
    repo: '',
    category: 'General',
    theme: 'auto',
    lang: 'auto',
    clientId: '',
    // Comments are disabled. To enable live discussions, set `repo` and `clientId`, deploy a
    // ScatterLeaf broker and supply its URL via PUBLIC_SCATTERLEAF_BROKER, then flip both flags.
    // With an empty broker ScatterLeaf only shows simulated comments.
    broker:
      (typeof process !== 'undefined' &&
        process.env?.PUBLIC_SCATTERLEAF_BROKER) ||
      (import.meta as any).env?.PUBLIC_SCATTERLEAF_BROKER ||
      '',
    features: {
      images: true,
    },
  },
};
