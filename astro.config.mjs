import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { rehypeCallouts } from './src/plugins/rehype-callouts.mjs';

export default defineConfig({
  // Placeholder until the final domain is decided; override with SITE_URL
  site: process.env.SITE_URL || 'https://lucarossid3v.github.io',
  integrations: [sitemap()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  markdown: {
    processor: satteri({
      hastPlugins: [rehypeCallouts()],
    }),
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true,
    },
  },
  vite: {
    server: {
      watch: {
        ignored: [
          '**/.obsidian/**',
          '**/_bases/**',
          '**/bases/**',
          '**/_home/**',
          '**/home/**',
          '**/_base/**',
          '**/base/**',
        ],
      },
    },
    assetsInclude: ['**/*.base', '**/.obsidian/**', '**/_bases/**'],
  },
});
