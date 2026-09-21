#!/usr/bin/env node
/* Run before every commit:  npm run check-public
   Scans this repository for things that should not be published. Exits with an error if it finds any.
   It is a safety net, not a guarantee: still read what you are about to publish. */
const fs = require("fs");
const path = require("path");
const root = path.resolve(process.argv[2] || path.join(__dirname, ".."));

const SKIP_DIRS = new Set(["node_modules", ".git", "out"]);
const TEXT_EXT = new Set([".js", ".json", ".md", ".txt", ".py", ".yml", ".yaml", ".sh", ""]);
const ALLOWED_CONTENT = new Set(["content.sample.json", "content.sample-classic.json"]);

const CHECKS = [
  { name: "email address (only example.com is allowed)", re: /[A-Za-z0-9._%+-]+@(?!example\.com\b)[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g },
  { name: "currency amount", re: /[\u20AC$\u00A3]\s?\d/g },
  { name: "private-looking word", re: /\b(KVK|BTW|IBAN|confidential|internal only|do not share|password|api[_-]?key|secret|token)\b/gi },
  { name: "local file path", re: /(\/Users\/[A-Za-z0-9._-]+|\/home\/[A-Za-z0-9._-]+|[A-Z]:\\Users\\|\/mnt\/user-data)/g },
  { name: "phone-number-like digits", re: /\+\d[\d\s().-]{8,}\d/g },
];

const problems = [];
(function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = path.join(dir, name), rel = path.relative(root, full);
    if (fs.statSync(full).isDirectory()) { walk(full); continue; }
    if (/^content.*\.json$/.test(name) && !ALLOWED_CONTENT.has(name)) problems.push(`${rel}: a content file that is not one of the two samples. Real content must never be committed.`);
    if (/\.(pptx|pdf|docx|xlsx)$/i.test(name)) problems.push(`${rel}: a finished document. Finished pieces do not belong in this repository.`);
    if (!TEXT_EXT.has(path.extname(name).toLowerCase()) || name === "check-public.js") continue;
    // decode \uXXXX escapes first, so symbols hidden inside JSON strings (a euro sign, for example) are still seen
    const lines = fs.readFileSync(full, "utf8").replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))).split("\n");
    lines.forEach((line, i) => CHECKS.forEach(c => { c.re.lastIndex = 0; const m = line.match(c.re); if (m) problems.push(`${rel}:${i + 1}: ${c.name}: ${m[0].trim()}`); }));
  }
})(root);

if (problems.length) {
  console.error(`\nFound ${problems.length} thing(s) to check before publishing:\n`);
  problems.forEach(p => console.error("  - " + p));
  console.error("\nFix or remove them, then run the check again.\n");
  process.exit(1);
}
console.log("check-public: nothing suspicious found. Still read the diff before you commit.");
