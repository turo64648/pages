# Pages

A VitePress site of miscellaneous pages (explainers, notes, comparisons, anything), at
https://turo64648.github.io/pages/. Sibling of the OS Primer and Networking Primer; same theme.
`.github/workflows/deploy.yml` deploys every push to `main`.

## Adding a page

1. Read `STYLE.md`. Do not read other pages or explore the repo.
2. Write the whole page in one Write call to `docs/p/<slug>.md` (kebab-case slug). Front matter:
   ```yaml
   ---
   title: Bloom Filters
   date: 2026-10-04          # today, YYYY-MM-DD
   description: One line for the index.   # optional
   ---
   ```
   Then a `# Title` heading and the content. The index lists pages automatically; never edit it.
3. Commit and push in one Bash call:
   `git add -A && git commit -m "Add <slug>" && git pull --rebase origin main && git push origin main`
   If pushing to `main` is refused (cloud sessions), push to the session's `claude/...` branch instead;
   the workflow merges it into `main` and deploys.
4. Reply with the URL `https://turo64648.github.io/pages/p/<slug>` (live 1–2 minutes after the push).

## Economy

- Aim for about 4 tool calls: read STYLE.md, write, push, and optionally `gh run watch` after a page with a
  `<script setup>` widget (a Vue error fails the deploy; fix and push again if it does).
- Do not run `npm install` or a local build. Do not re-read files you wrote.
- Web lookups only to confirm a fact or get a source link: at most ~3, batched in one step.
- To edit an existing page, read only that page.
- Shared files (`docs/.vitepress/`, `STYLE.md`, `index.md`) change only when the user asks.
