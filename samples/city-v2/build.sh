#!/bin/sh
# Rebuilds this side from round2 + parts/city2.js. Run from the project root:
#   sh samples/city-v2/build.sh
# The part's anchors exist only in round2's file, so the side is always built from a fresh copy
# rather than spliced twice.
set -e
rm -rf samples/city-v2/js
cp -r round2/js samples/city-v2/js
python tools/splice.py samples/city-v2/js/hero-port-b.js samples/city-v2/parts/city2.js
# the three skyline call sites hand each plot its depth inside the tier
python - <<'PY'
import io
p = "samples/city-v2/js/hero-port-b.js"
s = io.open(p, encoding="utf-8", newline="").read()
n = 0
for old in ["h: o.b.h, seed:", "h: o.b.h + 110, seed:", "h: o.b.h + 50, seed:"]:
    n += s.count(old)
    s = s.replace(old, old.replace(" seed:", " dz: o.b.dz, land: o.b.land, seed:"))
io.open(p, "w", encoding="utf-8", newline="").write(s)
print("depth passed to", n, "skyline call sites")
PY
# the owner asked for a taller city and a bigger Fuji: scene 05's city is a literal list, so it is
# scaled here by the same factor the composed tiers use, and Fuji is enlarged in both scenes
python - <<'PY'
import io, re
p = "samples/city-v2/js/hero-port-b.js"
s = io.open(p, encoding="utf-8", newline="").read()
TALLER = 1.22
a = s.index("var CITY_BACK = ["); z = s.index("];", s.index("var CITY_FRONT = [")) + 2
block = s[a:z]
grown = re.sub(r"h: (\d+)", lambda m: "h: %d" % round(int(m.group(1)) * TALLER), block)
s = s[:a] + grown + s[z:]
fuji = [("FujiMountain({ cx: 460, baseY: 742, w: 1240, ht: 470 })",
         "FujiMountain({ cx: 440, baseY: 742, w: 1480, ht: 596 })"),
        ("FujiMountain({ cx: 400, baseY: 1008, w: 1700, ht: 560, capT: 0.3 })",
         "FujiMountain({ cx: 380, baseY: 1008, w: 2020, ht: 706, capT: 0.3 })")]
for old, new in fuji:
    assert s.count(old) == 1, old
    s = s.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="").write(s)
print("scene 05 city grown x%.2f, Fuji enlarged in scenes 03 and 05" % TALLER)
PY
node --check samples/city-v2/js/hero-port-b.js
echo "built samples/city-v2"
