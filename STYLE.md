# Style Guide

Any kind of page lives here: explainers, notes, comparisons, cheat sheets, plans, write-ups. Part 1 applies
to every page. Part 2 lists tools you may use. Part 3 applies only to explainers. Pick the form that fits the
content; nothing below is a required template.

The reader is an experienced engineer, often reading on a phone. They want understanding, not filler.

## 1. Every page

### Words and sentences

- One idea per sentence. Aim for 20 words or fewer; never more than 30.
- Paragraphs of at most 4 sentences.
- Active voice: "the client retries", not "the request is retried".
- Plain words: "before" (not "prior to"), "use" (not "utilise"), "make sure" (not "ensure").
- One word, one meaning. Pick one term for a thing and use only that term on the page.
- Spell out an acronym the first time, unless every engineer knows it (HTTP, CPU, API).
- No filler: no "it's worth noting", "interestingly", "simply", "just", "obviously", "in today's world".
- Do not rely on the reader's memory of something far above. Restate it in a few words.

### Accuracy

- Accuracy comes first. Do not invent numbers, quotes, incidents or citations. If you cannot confirm
  something, cut it.
- Give orders of magnitude with units and context ("tens of milliseconds across a continent"), not one flat
  number for something that varies. Say when a fact varies by OS, vendor, version or year.
- Date anything that changes: "as of 2026", "described in Google's 2016 paper". Never present an old
  company description as the current setup.
- A **Sources** section (`## Sources`: title, kind, year, link) is optional. Add one when the page relies on
  specific facts a reader may want to check.

### Formatting

- At most 5–6 bullets in a list. Split longer lists into groups.
- Tables only for comparisons across the same attributes.
- Bold sparingly: key terms where they are explained, and summary lines.
- Short, scannable `##` sections. Length follows the content; there is no word target.

## 2. Tools on hand (use any, none required)

Pages are VitePress Markdown, so plain HTML works anywhere in them.

- **Containers:** `::: info`, `::: tip`, `::: warning`, `::: danger`, and `::: details Title` for
  collapsible detail.
- **Diagrams:** inline SVG inside `<figure class="figure">…<figcaption>…</figcaption></figure>`.
  `viewBox` 640 wide; keep text inside it. Shared classes (light and dark mode handled):
  - shapes: `box`, `box-a` (blue), `box-b` (orange), `box-c` (green), `box-d` (purple), `ghost` (dashed)
  - text: `h` (heading), `tb` (bold), `t` (normal), `m` (muted, small), `mono`
  - lines: `ln`, `ln-a`, `ln-b`, `ln-c`, `ln-dash`; arrowhead fill `arrowhead`
  - colours as CSS variables: `--d-a`…`--d-d`, `--d-a-soft`…`--d-d-soft`, `--d-stroke`, `--d-muted`, `--ok`, `--bad`
- **Interactive widgets:** a `<script setup>` block at the top of the page (Vue 3: `ref`, `computed`) and
  markup in `<div class="widget">` (it styles `h4`, `button`, `button.primary`, `input`, `select`, `.row`).
  Raw `<script>` tags do not work in Markdown; use `<script setup>`. Add `<style scoped>` for one-off CSS.
- **Code:** fenced blocks with a language get syntax highlighting.
- **Custom layout:** front matter `layout: page` drops the docs chrome (no outline), for dashboards or
  full-width designs. `aside: false` hides the outline only.
- **Fully standalone HTML:** put it at `docs/public/<slug>.html` (served as is, at `/pages/<slug>.html`).
  Also add `docs/p/<slug>.md` with the front matter and a one-line link to it, so it appears on the index.
- Escape `{{` in prose as `<span v-pre>{{</span>`, because Vue reads `{{ }}` as an expression. Inside code
  blocks it is safe.

Use a diagram or widget where seeing or doing it helps understanding, not for decoration.

## 3. Explainers

When a page explains a concept, these rules matter most:

1. **Never use a term before you explain it.** Explain it in plain words where it first appears.
2. **Show the example before the name.** Describe the concrete situation first, then give the formal term.
3. **Keep two layers.** The main text makes complete sense on its own, in plain language. Exact numbers,
   spec details and company-specific systems go in `::: details Going deeper: <topic>` boxes.

Start each `##` section with a one-line bold summary beginning **In short:**. Open the page with two
sentences: what this is and why it matters.

A good explainer usually has some of these, in whatever order reads best:
- the intuition, with a concrete example
- a diagram or a small interactive widget
- a worked example with real-ish numbers
- tradeoffs, and when to use it versus the alternatives
- where it breaks: real failure modes or public incidents (dated, linked)
- common misconceptions; a few key takeaways

Example of the tone. Too dense:

> A Bloom filter is a space-efficient probabilistic structure using k hash functions over an m-bit array,
> admitting false positives at rate (1 − e^(−kn/m))^k.

Following this guide:

> You want to know if a username is taken, without storing every username. Keep a row of bits, all zero.
> For each name, hash it a few ways and set those bits to one. To check a name, look at its bits: if any is
> zero, the name is definitely new. This structure is a **Bloom filter**.
