import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Pages',
  description: 'Explainers, notes and other pages',
  // Set VITEPRESS_BASE=/repo-name/ when deploying to a GitHub Pages project site.
  base: process.env.VITEPRESS_BASE || '/',
  cleanUrls: true,
  lastUpdated: false,
  // Pages are written without a local build, so a stray link must not break the deploy.
  ignoreDeadLinks: true,
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap' }],
  ],
  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' },
  },
  themeConfig: {
    outline: { level: [2, 3], label: 'On this page' },
    search: { provider: 'local' },
    docFooter: { prev: false, next: false },
  },
})
