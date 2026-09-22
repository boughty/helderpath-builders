# Content file format (one-pager)

A content file is JSON with a few top-level settings and an ordered list of `blocks`. The builder stacks the blocks from the top of the page down.

```json
{
  "title": "Name shown in the file properties",
  "style": "fill",
  "footer": "www.example.com",
  "footerLeft": "info@example.com",
  "gap": 0.22,
  "blocks": [ ... ]
}
```

| Setting | Values | Default |
|---|---|---|
| `title` | Any text | "Helderpath one-pager" |
| `style` | `fill` (pale tint, no outline) or `outline` (white with a thin navy outline). Applies to every card and call to action unless a block sets its own `style`. | `fill` |
| `footer` | Text right-aligned under the footer rule | "www.helderpath.com" |
| `footerLeft` | Text left-aligned under the footer rule, on the same line as `footer` | none (footer shows right side only) |
| `gap` | Vertical space between blocks, in inches | 0.22 |

## Block types

| Type | Fields | Notes |
|---|---|---|
| `eyebrow` | `text` | Small uppercase label above the headline |
| `headline` | `text` | Comfortaa Bold 24 pt; keep to two lines |
| `intro` | `text` | Body paragraph, Poppins 10 pt |
| `subheader` | `text` | Comfortaa Bold 13 pt |
| `paragraph` | `text`, optional `size` (default 9) | Small print, credibility line, notes |
| `steps` | optional `label`; `items`: list of `title`, `body`, optional `n` | 2 to 4 columns with accent-coloured numbers. Superseded by `tiles` (below) for a boxed look; kept for a plain, unboxed step row |
| `chips` | `items`: list of short labels; optional `caption` | Row of rounded chips, up to about 8 |
| `columns` | `left` and `right`, each with `label` and `bullets` | Two bullet columns |
| `cards` | optional `label`, `columns` (1 to 3), optional `style`, optional `widths` (array of fractions summing to 1, one per column, to make columns unequal widths); `items`: list of `title`, `body`, optional `subtitle`, optional `tag`, optional `foot` (a short line pinned to the bottom-right of the card, e.g. price or format) | Rounded boxes. `tag` is a small accent-coloured line above the title. Card height is driven by the tallest item in a row |
| `cta` | `heading`, `text`, optional `link`, optional `style` (`dark` for a solid navy bar; default is the pale/outline card style), optional `qr` (path to a square image, shown right-aligned; only meaningful with `style: "dark"`) | Call-to-action box. `link` can be a `mailto:` or a web address. Use `dark` plus `qr` for a one-pager's primary, single-action close |
| `stagetiles` *(added 2026-09-22)* | `items`: list of `label`, `icon` (path to a square image, ideally SVG or a large transparent PNG) | A row of solid navy rounded tiles, one per item, icon centred above the label in white. Built for the seven lifecycle stages but works for any short icon-plus-label row |
| `tiles` *(added 2026-09-22)* | optional `label`; `items`: list of `title`, `body`, optional `n` | Like `steps`, but each item is its own solid navy rounded box with an accent-coloured numeral, a white title, and a white body line. All boxes in the row share one height, and all item titles share one height, so numerals and bodies line up across the row even when one title wraps |
| `stats` *(added 2026-09-22)* | optional `label`; `items`: list of `value` (0 to 100), `label`; optional `caption` | A row of drawn percentage rings: a pale track plus an accent-coloured arc, with the value as a numeral in the centre and a short label beside each ring. This is drawn geometry, not a data-bound chart; to change a value, edit the JSON and rebuild (or, in Slides, drag the arc's shape handles by hand). Use `caption` for a source line under the whole row |
| `callout` *(added 2026-09-22)* | `text`, optional `style` | A single pale (or outlined) full-width rounded box for a short example, aside, or bridge paragraph. Same box styling as `cards`, but always one column and no title |

## Rules of thumb

- **Aim for 80 to 90 percent full.** The report shows the figure. Above about 95 percent the builder warns; over 100 percent it refuses to build. In practice, a page dense with tiles, stats, and cards (rather than mostly text) can read well up to about 97 to 98 percent; treat 80 to 90 percent as the starting target and judge the actual page, not just the number.
- **Keep text short.** A card body of two to three lines reads best. The page has no automatic text shrinking.
- **The accent colour** (bright teal `#00CED1` by default, see the project standards file for the current approved accent) is used only for step numbers, card tags, and ring arcs. Everything else is navy, white, or the pale tint. Don't use the accent for headings or body text.
- **`stats` rings are shapes, not charts.** They don't recompute from data; treat each `value` as something you'll re-enter by hand if the underlying figure changes.
- **Icon images for `stagetiles`** should be simple, single-colour line art on a transparent background, sized so the artwork itself (not the canvas) is roughly centred; off-centre source art will look off-centre on the tile.
- **Unknown block types and missing fields** stop the build with a clear message.
