"""Regenerates onepager/metrics.json: advance widths (in em) for the two brand fonts.
Needs fontTools and the font files. Only run this if the fonts change. Not needed to build a page."""
import json, sys
from fontTools.ttLib import TTFont
fonts = {"Poppins": sys.argv[1], "Comfortaa": sys.argv[2]}   # usage: make_metrics.py Poppins-Regular.ttf Comfortaa-Bold.ttf
chars = [chr(c) for c in range(32, 127)] + ["\u00b7", "\u20ac", "\u2019", "\u201c", "\u201d", "\u00e9", "\u00a0"]
out = {}
for name, path in fonts.items():
    f = TTFont(path); cmap = f.getBestCmap(); hm = f["hmtx"]; upm = f["head"].unitsPerEm
    out[name] = {c: round(hm[cmap[ord(c)]][0] / upm, 4) for c in chars if ord(c) in cmap}
json.dump(out, open("onepager/metrics.json", "w"), separators=(",", ":"))
print("wrote onepager/metrics.json")
