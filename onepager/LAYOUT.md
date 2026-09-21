# Layout baked into the one-pager builder

The project's standards file is the authority for brand and page rules. This file records what the code currently implements, so differences are easy to spot.

| Item | Value |
|---|---|
| Page | A4 portrait, 21 x 29.7 cm (8.27 x 11.69 in) |
| Side margins | 2.2 cm (0.866 in); content width 6.538 in |
| Header | Light-background wordmark, top left, about 4 cm wide; 0.75 pt navy rule under it |
| Footer | 0.75 pt navy rule; address right-aligned below it in Poppins 9 pt |
| Content area | From 1.10 in to 10.80 in from the top; warning above 10.45 in |
| Text colours | Navy `#10253F`; deep teal `#007A80` for numbers, tags, and the call-to-action heading |
| Box styles | Fill: pale `#EBEFF4`, no outline. Outline: white with a 0.75 pt navy outline. Rounded corners |
| Fonts | Comfortaa Bold for headlines, labels, box titles; Poppins Regular for body and small print |
| Sizes | Headline 24, subheader 13, card and step titles 11 to 12, body 9.5 to 10, small print 9, labels 9 (uppercase, letter-spaced) |
| Block gap | 0.22 in |

## Known limits

- **Text height is estimated,** using the real widths of the brand fonts. It is close but not exact; Google Slides can space lines slightly differently. Always look at a preview.
- **Boxes have fixed heights.** If you add text in Slides, resize the box by hand.
- **Fonts:** Comfortaa and Poppins are Google fonts and are available in Google Slides. On a computer without them, previews substitute another font.
- **One page.** There is no overflow to a second page by design.
