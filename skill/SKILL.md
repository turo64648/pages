---
name: pages
description: Publish a page to the user's GitHub Pages site (turo64648.github.io/pages) - an explainer, notes, comparison, cheat sheet or any other page. Use when the user asks to "make a page", "push a page", "explain X as a page", "put this on pages", or similar.
---

# Publish to Pages

The site's source is the repo `turo64648/pages`. Get it and its instructions in one Bash call:

```sh
R=~/Projects/pages; { [ -d "$R" ] && git -C "$R" pull -q; } || git clone -q --depth 1 https://github.com/turo64648/pages "$R"; cat "$R/CLAUDE.md" "$R/STYLE.md"
```

(If the current directory is already the `pages` repo, use it and `cat CLAUDE.md STYLE.md` instead.)
Then follow `CLAUDE.md`: write `docs/p/<slug>.md` in one call, commit and push to `main`, reply with the URL.
