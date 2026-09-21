#!/usr/bin/env node
/* Helderpath one-pager builder.
   Turns a content file (JSON) into a single-page A4 PowerPoint file that opens in Google Slides.
   Usage:  node build.js <content.json> [out.pptx] [--report]
   Layout only: no real content lives in this file. See SCHEMA.md for the content format. */
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
process.on("uncaughtException", e => { console.error("ERROR: " + e.message); process.exit(1); });   // short, readable errors

// ---------- page and brand constants (mirror LAYOUT.md) ----------
const PAGE = { w: 8.27, h: 11.69 };          // A4 portrait, inches
const L = 0.866, W = 6.538;                  // 2.2 cm side margins
const TOP = 1.10, BOTTOM_SOFT = 10.45, BOTTOM_HARD = 10.80;
const NAVY = "10253F", TEAL = "007A80", PALE = "EBEFF4";
const GAP = 0.22;                            // space between blocks

// ---------- text measuring (real character widths from the brand fonts; see metrics.json) ----------
const METRICS = JSON.parse(fs.readFileSync(path.join(__dirname, "metrics.json"), "utf8"));
const SAFETY = 1.03;                          // small margin for kerning and Slides differences
function wordEm(word, font) {
  const m = METRICS[font]; let w = 0;
  for (const ch of word) w += m[ch] !== undefined ? m[ch] : 0.55;
  return w;
}
function lines(text, widthIn, pt, font) {
  const usable = widthIn / SAFETY / (pt / 72);   // usable width, in em
  const space = METRICS[font][" "];
  let n = 1, cur = 0;
  for (const word of String(text).split(/\s+/)) {
    const w = wordEm(word, font);
    if (cur > 0 && cur + space + w > usable) { n++; cur = w; } else cur += (cur > 0 ? space : 0) + w;
  }
  return n;
}
const lh = (pt, mult) => pt * mult / 72;

// ---------- content ----------
const args = process.argv.slice(2).filter(a => !a.startsWith("--"));
const report = process.argv.includes("--report");
if (!args[0]) { console.error("Usage: node build.js <content.json> [out.pptx] [--report]"); process.exit(1); }
const content = JSON.parse(fs.readFileSync(args[0], "utf8"));
const outFile = args[1] || path.join("out", path.basename(args[0], ".json") + ".pptx");
fs.mkdirSync(path.dirname(outFile), { recursive: true });
const footerText = content.footer || "www.helderpath.com";
const defaultStyle = content.style === "outline" ? "outline" : "fill";

const pres = new pptxgen();
pres.defineLayout({ name: "A4_PORTRAIT", width: PAGE.w, height: PAGE.h });
pres.layout = "A4_PORTRAIT";
pres.title = content.title || "Helderpath one-pager";
pres.author = "Helderpath";
pres.defineSlideMaster({
  title: "HELDERPATH_PAGE", background: { color: "FFFFFF" },
  objects: [
    { image: { x: L, y: 0.47, w: 1.575, h: 0.293, path: path.join(__dirname, "assets", "helderpath-wordmark-light-bg.png") } },
    { line: { x: L, y: 0.88, w: W, h: 0, line: { color: NAVY, width: 0.75 } } },
    { line: { x: L, y: 10.97, w: W, h: 0, line: { color: NAVY, width: 0.75 } } },
    { text: { text: footerText, options: { x: L, y: 11.02, w: W, h: 0.25, align: "right", valign: "top", fontFace: "Poppins", fontSize: 9, color: NAVY, margin: 0 } } },
  ],
});
const slide = pres.addSlide({ masterName: "HELDERPATH_PAGE" });

// ---------- style helpers ----------
const plain = { isTextBox: true, margin: 0, valign: "top", color: NAVY };
const body = (pt = 10) => ({ fontFace: "Poppins", fontSize: pt, color: NAVY });
const head = (pt, color = NAVY) => ({ fontFace: "Comfortaa", bold: true, fontSize: pt, color });
const PAD = 10;                                // card padding, points
const PADIN = PAD / 72;
function shapeStyle(style) {
  return style === "outline"
    ? { fill: { color: "FFFFFF" }, line: { color: NAVY, width: 0.75 } }
    : { fill: { color: PALE }, line: { type: "none" } };
}
const need = (b, ...keys) => keys.forEach(k => { if (b[k] === undefined) throw new Error(`Block "${b.type}" needs "${k}"`); });
const labelH = 0.26;
function drawLabel(text, x, y, w) {
  slide.addText(String(text).toUpperCase(), { ...plain, x, y, w, h: 0.2, ...head(9), charSpacing: 1 });
}

// ---------- block types: each returns { h, gap?, draw(y) } ----------
const blocks = {
  eyebrow(b) { need(b, "text"); return { h: 0.2, gap: 0.08, draw: y => drawLabel(b.text, L, y, W) }; },
  headline(b) {
    need(b, "text"); const h = lines(b.text, W, 24, "Comfortaa") * lh(24, 1.2) + 0.06;
    return { h, gap: 0.12, draw: y => slide.addText(b.text, { ...plain, x: L, y, w: W, h, ...head(24) }) };
  },
  intro(b) {
    need(b, "text"); const h = lines(b.text, W, 10, "Poppins") * lh(10, 1.3) + 0.05;
    return { h, draw: y => slide.addText(b.text, { ...plain, x: L, y, w: W, h, ...body(10) }) };
  },
  subheader(b) { need(b, "text"); return { h: 0.3, gap: 0.08, draw: y => slide.addText(b.text, { ...plain, x: L, y, w: W, h: 0.3, ...head(13) }) }; },
  paragraph(b) {
    need(b, "text"); const pt = b.size || 9; const h = lines(b.text, W, pt, "Poppins") * lh(pt, 1.3) + 0.05;
    return { h, draw: y => slide.addText(b.text, { ...plain, x: L, y, w: W, h, ...body(pt) }) };
  },
  steps(b) {
    need(b, "items"); const n = b.items.length, gap = 0.25, cw = (W - gap * (n - 1)) / n;
    const hs = b.items.map(it => 0.2 + lines(it.body, cw, 9.5, "Poppins") * lh(9.5, 1.3) + 0.05);
    const h = Math.max(...hs) + (b.label ? labelH : 0);
    return { h, draw: y => {
      if (b.label) drawLabel(b.label, L, y, W);
      b.items.forEach((it, i) => slide.addText([
        { text: (it.n || i + 1) + "  ", options: head(11, TEAL) },
        { text: it.title, options: { ...head(11), breakLine: true, paraSpaceAfter: 3 } },
        { text: it.body, options: body(9.5) }],
        { ...plain, x: L + i * (cw + gap), y: y + (b.label ? labelH : 0), w: cw, h: Math.max(...hs) }));
    } };
  },
  chips(b) {
    need(b, "items"); const n = b.items.length, g = 0.06, cw = (W - g * (n - 1)) / n;
    const cap = b.caption ? lines(b.caption, W, 9, "Poppins") * lh(9, 1.3) + 0.08 : 0;
    return { h: 0.32 + cap, draw: y => {
      b.items.forEach((t, i) => slide.addText(t, { isTextBox: true, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.08, x: L + i * (cw + g), y, w: cw, h: 0.32,
        fill: { color: PALE }, line: { type: "none" }, align: "center", valign: "middle", margin: 0, ...head(8.5) }));
      if (b.caption) slide.addText(b.caption, { ...plain, x: L, y: y + 0.4, w: W, h: cap - 0.08, ...body(9) });
    } };
  },
  columns(b) {
    need(b, "left", "right"); const gap = 0.35, cw = (W - gap) / 2;
    const side = s => s.bullets.reduce((a, t) => a + lines(t, cw - 0.17, 9.5, "Poppins") * lh(9.5, 1.3) + 0.06, 0);
    const h = labelH + Math.max(side(b.left), side(b.right)) + 0.05;
    const bullets = arr => arr.map((t, i) => ({ text: t, options: { ...body(9.5), bullet: { indent: 11 }, breakLine: i < arr.length - 1, paraSpaceAfter: 4 } }));
    return { h, draw: y => [[b.left, L], [b.right, L + cw + gap]].forEach(([s, x]) => {
      drawLabel(s.label, x, y, cw);
      slide.addText(bullets(s.bullets), { ...plain, x, y: y + labelH, w: cw, h: h - labelH });
    }) };
  },
  cards(b) {
    need(b, "items"); const cols = b.columns || Math.min(b.items.length, 3), gap = 0.2, cw = (W - gap * (cols - 1)) / cols;
    const style = shapeStyle(b.style || defaultStyle);
    const ih = it => 2 * PADIN + (it.tag ? 0.17 : 0) + lines(it.title, cw - 2 * PADIN, 12, "Comfortaa") * lh(12, 1.2) + (it.subtitle ? 0.17 : 0.03)
                   + lines(it.body, cw - 2 * PADIN, 9.5, "Poppins") * lh(9.5, 1.3) + 0.06;
    const rows = Math.ceil(b.items.length / cols), rowH = Math.max(...b.items.map(ih));
    const h = (b.label ? labelH : 0) + rows * rowH + (rows - 1) * gap;
    return { h, draw: y => {
      if (b.label) drawLabel(b.label, L, y, W);
      b.items.forEach((it, i) => {
        const r = Math.floor(i / cols), c = i % cols;
        const runs = [];
        if (it.tag) runs.push({ text: String(it.tag).toUpperCase(), options: { ...head(8, TEAL), breakLine: true, paraSpaceAfter: 2 } });
        runs.push({ text: it.title, options: { ...head(12), breakLine: true, paraSpaceAfter: it.subtitle ? 1 : 3 } });
        if (it.subtitle) runs.push({ text: it.subtitle, options: { ...body(9), breakLine: true, paraSpaceAfter: 4 } });
        runs.push({ text: it.body, options: body(9.5) });
        slide.addText(runs, { ...style, isTextBox: true, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.12, valign: "top", margin: PAD,
          x: L + c * (cw + gap), y: y + (b.label ? labelH : 0) + r * (rowH + gap), w: cw, h: rowH });
      });
    } };
  },
  cta(b) {
    need(b, "heading", "text"); const h = 2 * PADIN + 0.26 + lines(b.text, W - 2 * PADIN, 10, "Poppins") * lh(10, 1.3) + 0.05;
    return { h, draw: y => slide.addText([
      { text: b.heading, options: { ...head(13, TEAL), breakLine: true, paraSpaceAfter: 3 } },
      { text: b.text, options: { ...body(10), ...(b.link ? { hyperlink: { url: b.link, tooltip: b.text } } : {}) } }],
      { ...shapeStyle(b.style || defaultStyle), isTextBox: true, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.12, valign: "top", margin: PAD, x: L, y, w: W, h }) };
  },
};

// ---------- layout ----------
if (!Array.isArray(content.blocks)) throw new Error('Content file needs a "blocks" list');
let y = TOP; const log = [];
content.blocks.forEach((b, i) => {
  if (!blocks[b.type]) throw new Error(`Unknown block type "${b.type}" (block ${i + 1}). See SCHEMA.md.`);
  const blk = blocks[b.type](b);
  log.push({ n: i + 1, type: b.type, y: +y.toFixed(2), h: +blk.h.toFixed(2) });
  blk.draw(y);
  y += blk.h + (blk.gap !== undefined ? blk.gap : GAP);
});
const bottom = y - GAP;
const fill = ((bottom - TOP) / (BOTTOM_HARD - TOP) * 100).toFixed(0);
if (report) { log.forEach(r => console.log(`  ${String(r.n).padStart(2)}  ${r.type.padEnd(10)} y=${String(r.y).padStart(5)}  h=${String(r.h).padStart(5)}`)); }
console.log(`Content ends at ${bottom.toFixed(2)} in of ${BOTTOM_HARD} (${fill}% of the usable page).`);
if (bottom > BOTTOM_HARD) { console.error("ERROR: content does not fit on one page. Shorten the text or remove a block."); process.exit(2); }
if (bottom > BOTTOM_SOFT) console.warn("WARNING: page is very full. Google Slides can space text slightly differently; consider cutting a line or two.");
pres.writeFile({ fileName: outFile }).then(f => console.log("Wrote " + f));
