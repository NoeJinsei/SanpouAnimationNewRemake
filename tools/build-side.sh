#!/bin/sh
# Builds a sample side from a FRESH copy of the working copy plus one or more part files.
# Run from the project root:
#   sh tools/build-side.sh <side-id> <part.js> [<part.js> ...]
# e.g. sh tools/build-side.sh r3-sky round2/parts/r3-sky.js
# The side lives in samples/<side-id>/js and is rebuilt from scratch every time, because a part's
# anchors are used up by its first splice. Parts always live in round2/parts/ (one copy, no duplicates).
set -e
side="$1"; shift
[ -n "$side" ] && [ "$#" -ge 1 ] || { echo "usage: sh tools/build-side.sh <side-id> <part.js> [...]"; exit 2; }
rm -rf "samples/$side/js"
mkdir -p "samples/$side"
cp -r round2/js "samples/$side/js"
python tools/splice.py "samples/$side/js/hero-port-b.js" "$@"
node --check "samples/$side/js/hero-port-b.js"
echo "built samples/$side from round2/js + $*"
