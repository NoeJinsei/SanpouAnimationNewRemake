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
node --check samples/city-v2/js/hero-port-b.js
echo "built samples/city-v2"
