#!/bin/sh
# Rebuild the "map-v2" side from round 2 plus the redrawn scene-04 map.
# Splice anchors are consumed by the first splice, so always start from a fresh copy of round2/js.
#   sh samples/map-v2/build.sh        (run from the project root)
set -e
root=$(cd "$(dirname "$0")/../.." && pwd)
rm -rf "$root/samples/map-v2/js"
cp -r "$root/round2/js" "$root/samples/map-v2/js"
python "$root/tools/splice.py" "$root/samples/map-v2/js/hero-port-b.js" "$root/round2/parts/map.js"
echo "map-v2 rebuilt"
