#!/bin/sh
# Cuts the same stretches out of two sets of whole-film recordings (tools/record.mjs), for before/after clips.
#   sh tools/cut-pairs.sh <before dir> <after dir> <out dir>
# Each dir holds desktop.mp4 and phone.mp4, recorded from 0 ms at the same frame rate, e.g.
#   node tools/record.mjs round2 shots/after/desktop.mp4 --framing=desktop --from=0 --to=48000 --fps=60
#   node tools/record.mjs round2 shots/after/phone.mp4 --framing=phone --dpr=2 --from=0 --to=48000 --fps=60
# Writes <out dir>/<name>-before.mp4 and <name>-after.mp4. The stretches are listed below: name, framing, from s, to s.
set -e
b="$1"; a="$2"; out="$3"
[ -n "$b" ] && [ -n "$a" ] && [ -n "$out" ] || { echo "usage: sh tools/cut-pairs.sh <before dir> <after dir> <out dir>"; exit 2; }
mkdir -p "$out"
cut() { # <source> <from s> <to s> <file>
  ffmpeg -y -loglevel error -i "$1" -ss "$2" -to "$3" -an -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -movflags +faststart "$4"
}
pair() { # <name> <framing> <from s> <to s>
  cut "$b/$2.mp4" "$3" "$4" "$out/$1-before.mp4"
  cut "$a/$2.mp4" "$3" "$4" "$out/$1-after.mp4"
}
pair scene-01-desktop desktop 0 7.0
pair scene-03-desktop desktop 15.6 21.8
pair change-04-05-desktop desktop 27.4 30.4
pair scene-05-desktop desktop 30.0 48.0
pair scene-05-phone phone 30.0 48.0
ls -la "$out" | awk 'NR>3 {print $5, $NF}'
