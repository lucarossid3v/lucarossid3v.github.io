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
};
