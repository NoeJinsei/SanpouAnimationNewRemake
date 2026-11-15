#!/bin/sh
# Cuts the review clips out of whole-film recordings (tools/record.mjs), one set per framing.
#   sh tools/cut-clips.sh <recordings dir> <out dir>
# The recordings dir holds, each recorded at 60 frames a second from the site clock:
#   film-desktop.mp4, film-phone.mp4       the working copy, 0 to 49500 ms
#   before-desktop.mp4, before-phone.mp4   the side before-round7, 14000 to 23800 ms (the two old seams)
# e.g.  node tools/record.mjs round2 shots/r7/film-desktop.mp4 --framing=desktop --from=0 --to=49500 --fps=60
#       node tools/record.mjs round2 shots/r7/film-phone.mp4 --framing=phone --dpr=2 --from=0 --to=49500 --fps=60
#       node tools/record.mjs before-round7 shots/r7/before-desktop.mp4 --framing=desktop --from=14000 --to=23800 --fps=60
# Writes <out dir>/seam-<a>-<b>-<framing>.mp4, scene-<nn>-<framing>.mp4 and before-seam-<a>-<b>-<framing>.mp4.
set -e
in="$1"; out="$2"
[ -n "$in" ] && [ -n "$out" ] || { echo "usage: sh tools/cut-clips.sh <recordings dir> <out dir>"; exit 2; }
mkdir -p "$out"
cut() { # <source> <from s> <to s> <name>
  ffmpeg -y -loglevel error -i "$1" -ss "$2" -to "$3" -an -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -movflags +faststart "$out/$4"
}
for f in desktop phone; do
  cut "$in/film-$f.mp4" 7.0 9.8 "seam-01-02-$f.mp4"
  cut "$in/film-$f.mp4" 14.2 17.2 "seam-02-03-$f.mp4"
  cut "$in/film-$f.mp4" 21.3 23.8 "seam-03-04-$f.mp4"
  cut "$in/film-$f.mp4" 27.4 29.8 "seam-04-05-$f.mp4"
  cut "$in/film-$f.mp4" 0 7.0 "scene-01-$f.mp4"
  cut "$in/film-$f.mp4" 7.0 14.6 "scene-02-$f.mp4"
  cut "$in/film-$f.mp4" 14.6 21.8 "scene-03-$f.mp4"
  cut "$in/film-$f.mp4" 21.8 27.8 "scene-04-$f.mp4"
  cut "$in/film-$f.mp4" 27.8 49.5 "scene-05-$f.mp4"
  # the old seams: the recording starts at 14000 ms
  cut "$in/before-$f.mp4" 0.2 3.2 "before-seam-02-03-$f.mp4"
  cut "$in/before-$f.mp4" 7.3 9.8 "before-seam-03-04-$f.mp4"
done
ls -la "$out" | awk 'NR>1 {print $5, $NF}'
