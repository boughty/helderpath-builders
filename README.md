# Helderpath builders

Small programs that turn a plain content file into a branded, ready-to-edit document. This repository holds **layout only**. It never holds real content.

## What is here

| Folder | What it makes | Status |
|---|---|---|
| `onepager/` | A single-page A4 one-pager as a PowerPoint (.pptx) file that opens in Google Slides | Version 1 |

Scope: **one page only.** Not for emails, posts, or documents that run onto a second page. Those use other routes.

## Quick start

```
npm install                                   # once; installs pptxgenjs
node onepager/build.js onepager/content.sample.json out/sample.pptx --report
```

Open `out/sample.pptx` in Google Slides (upload to Drive, then Open with Google Slides). Export the PDF with **File > Download > PDF** (not the print route, so links stay clickable).

Two sample content files show every block type:
- `content.sample.json`: pitfalls layout (four cards, options, call to action)
- `content.sample-classic.json`: classic layout (steps, lifecycle chips, two columns, options)

## Using it for a real piece

1. Write a **content file** for the piece. Keep it **outside this repository** (or in a git-ignored place). The format is in `onepager/SCHEMA.md`.
2. Run: `node onepager/build.js /path/to/my-content.json out/my-piece.pptx --report`
3. The report shows how full the page is. The builder refuses to build if the content will not fit on one page, and warns when it is very full.
4. Look at a preview, adjust the words, rebuild. Then open in Slides for the final touches.

## For Claude, when asked to build a one-pager

1. Confirm it is a single A4 page. If not, do not use this builder.
2. Fetch it: `git clone --depth 1 <this repository's URL>` (needs network access to github.com).
3. Read `onepager/SCHEMA.md` and `onepager/LAYOUT.md`. The brand and page rules in the project's standards file win if anything differs.
4. Write the content file **outside the clone** (for example in `/tmp`). Never add real content to the repository.
5. Run the builder with `--report`, render a preview (LibreOffice to PDF to image), and check the page visually. The height estimate is good but is not a substitute for looking.
6. Deliver the .pptx and one preview image. Do not push to the repository.

## Safety: this repository is public

- No real copy, prices, drafts, client names, or personal contact details belong here. Sample files use placeholder text and `example.com`.
- Real content files are ignored by git (`.gitignore`).
- Before every commit, run `npm run check-public`. It flags real email addresses, currency amounts, private-looking words, local file paths, and stray content files.
- Anything committed stays in the history even after deletion, so check before committing, not after.

The Helderpath wordmark in `onepager/assets/` is already public on helderpath.com.

## How it works (short)

`build.js` reads the content file, measures each block's text using the real widths of the brand fonts (`metrics.json`), stacks the blocks down the page, and writes the .pptx. The wordmark, the two rules, and the footer address sit on the slide layout, so they cannot be nudged by accident when editing.

`tools/make_metrics.py` regenerates `metrics.json` if the brand fonts ever change. It is not needed to build a page.

See `NOTICE` for the copyright statement.
