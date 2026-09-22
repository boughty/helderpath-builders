# Layout baked into the one-pager builder

The project's standards file is the authority for brand and page rules. This file records what the code currently implements, so differences are easy to spot.

| Item | Value |
|---|---|
| Page | A4 portrait, 21 x 29.7 cm (8.27 x 11.69 in) |
| Side margins | 2.2 cm (0.866 in); content width 6.538 in |
| Header | Light-background wordmark, top left, about 4 cm wide; 0.75 pt navy rule under it |
| Footer | 0.75 pt navy rule; address right-aligned below it in Poppins 9 pt. If `footerLeft` is set (added 2026-09-22), a second address is left-aligned on the same rule |
| Content area | From 1.10 in to 10.80 in from the top; warning above 10.45 in |
| Text colours | Navy `#10253F` for all headings and body text. An accent colour (bright teal `#00CED1` as of 2026-09-22; see the project standards file for the current approved accent) is used only for step/tile numbers, card tags, ring arcs, and the `dark` call-to-action heading. Deep teal `#007A80` is no longer used by the builder as of 2026-09-22 |
| Box styles | Fill: pale `#EBEFF4`, no outline. Outline: white with a 0.75 pt navy outline. `dark` (added 2026-09-22, `cta` and `tiles`/`stagetiles` blocks only): solid navy `#10253F` fill, white text. All styles use rounded corners |
| Fonts | Comfortaa Bold for headlines, labels, box titles; Poppins Regular for body and small print |
| Sizes | Headline 24, subheader 13, card and step/tile titles 11 to 12, body 9.5 to 10, small print 9, labels 9 (uppercase, letter-spaced), stat ring values 13 |
| Block gap | 0.22 in by default; overridable per file with the top-level `gap` setting (added 2026-09-22), and per block with a block-level `gap` override |

## New in this build (2026-09-22)

- **`stagetiles` and `tiles`** are solid navy rounded boxes, one per item, sized to a shared row height. `tiles` additionally aligns every item's title to a shared height before the body text starts, so numerals and bodies stay level across the row even if one title wraps to a second line.
- **`stats` rings** are drawn as two overlapping shapes (a pale-track oval plus an accent-coloured arc), not a native chart object. Ring diameter, track thickness, and arc thickness are all block-level options (`arc`, `track`, in points) with defaults tuned for a three-ring row at this page's content width.
- **`cards` can take unequal column widths** via a `widths` array (fractions of the row, summing to 1), and an optional `foot` line per item that pins to the bottom-right corner of its card regardless of how much body text is above it.
- **`cta` with `style: "dark"`** draws a full-width solid navy bar instead of the pale/outline card, and accepts a `qr` image path to place a QR code at the right edge.
- **Page-level `gap`** lets a content file tighten or loosen the space between every block at once, rather than only per-block. Text blocks (`paragraph`, `intro`, `callout`, etc.) trim a small amount off the configured gap by default, since their own line spacing already reads as some of that gap visually; box-shaped blocks (`cards`, `tiles`, `stagetiles`, `cta`) use the full configured gap.

## Known limits

- **Text height is estimated,** using the real widths of the brand fonts. It is close but not exact; Google Slides can space lines slightly differently. Always look at a preview.
- **Boxes have fixed heights.** If you add text in Slides, resize the box by hand.
- **`stats` ring values don't recompute.** They're shapes sized from the JSON at build time; changing a number later means editing the JSON and rebuilding, or manually dragging the arc's shape handles in Slides.
- **Fonts:** Comfortaa and Poppins are Google fonts and are available in Google Slides. On a computer without them, previews substitute another font; Comfortaa in particular renders lighter (closer to Regular) in some preview environments than it will in Slides, so weight can look different in a rendered preview versus the real file.
- **One page.** There is no overflow to a second page by design.
