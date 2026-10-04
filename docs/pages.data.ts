import { createContentLoader } from 'vitepress'

// Every page in docs/p/, newest first. Front matter: title, date (YYYY-MM-DD), optional description.
export default createContentLoader('p/*.md', {
  transform: (raw) =>
    raw
      .map((p) => ({
        url: p.url,
        title: p.frontmatter.title ?? p.url,
        date: String(p.frontmatter.date ?? '').slice(0, 10),
        description: p.frontmatter.description ?? '',
      }))
      .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title)),
})
