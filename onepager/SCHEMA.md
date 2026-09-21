# Content file format (one-pager)

A content file is JSON with a few top-level settings and an ordered list of `blocks`. The builder stacks the blocks from the top of the page down.

```json
{
  "title": "Name shown in the file properties",
  "style": "fill",
  "footer": "www.example.com",
  "blocks": [ ... ]
}
```

| Setting | Values | Default |
|---|---|---|
| `title` | Any text | "Helderpath one-pager" |
| `style` | `fill` (pale tint, no outline) or `outline` (white with a thin navy outline). Applies to every card and call to action unless a block sets its own `style`. | `fill` |
| `footer` | Text right-aligned under the footer rule | "www.helderpath.com" |

## Block types

| Type | Fields | Notes |
|---|---|---|
| `eyebrow` | `text` | Small uppercase label above the headline |
| `headline` | `text` | Comfortaa Bold 24 pt; keep to two lines |
| `intro` | `text` | Body paragraph, Poppins 10 pt |
| `subheader` | `text` | Comfortaa Bold 13 pt |
| `paragraph` | `text`, optional `size` (default 9) | Small print, credibility line, notes |
| `steps` | optional `label`; `items`: list of `title`, `body`, optional `n` | 2 to 4 columns with deep-teal numbers |
| `chips` | `items`: list of short labels; optional `caption` | Row of rounded chips, up to about 8 |
| `columns` | `left` and `right`, each with `label` and `bullets` | Two bullet columns |
| `cards` | optional `label`, `columns` (1 to 3), optional `style`; `items`: list of `title`, `body`, optional `subtitle`, optional `tag` | Rounded boxes. `tag` is a small deep-teal line above the title |
| `cta` | `heading`, `text`, optional `link`, optional `style` | Call-to-action box. `link` can be a `mailto:` or a web address |

## Rules of thumb

- **Aim for 80 to 90 percent full.** The report shows the figure. Above about 95 percent the builder warns; over 100 percent it refuses to build.
- **Keep text short.** A card body of two to three lines reads best. The page has no automatic text shrinking.
- **Deep teal is used only** for step numbers, card tags, and the call-to-action heading. Everything else is navy.
- **Unknown block types and missing fields** stop the build with a clear message.
