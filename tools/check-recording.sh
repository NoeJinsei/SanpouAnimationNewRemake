#!/bin/sh
# Is a recording whole? Prints the picture, the length, the frame count, the size, and whether any
# frame is a repeat of the one before (a dropped frame shows as a repeat) or arrives off the beat.
#   sh tools/check-recording.sh <file.mp4> [expected fps, default 60]
f="$1"; fps="${2:-60}"
[ -f "$f" ] || { echo "no such file: $f"; exit 2; }
w=$(ffprobe -v error -select_streams v -show_entries stream=width -of csv=p=0 "$f")
h=$(ffprobe -v error -select_streams v -show_entries stream=height -of csv=p=0 "$f")
n=$(ffprobe -v error -select_streams v -count_frames -show_entries stream=nb_read_frames -of csv=p=0 "$f")
d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
r=$(ffprobe -v error -select_streams v -show_entries stream=r_frame_rate -of csv=p=0 "$f")
mb=$(ffprobe -v error -show_entries format=size -of csv=p=0 "$f" | awk '{printf "%.1f", $1/1048576}')
md5=$(ffmpeg -v error -i "$f" -f framemd5 - 2>/dev/null | grep -v '^#' | awk '{print $NF}')
rep=$(printf '%s\n' "$md5" | awk 'NR>1 && $0==p {c++} {p=$0} END {print c+0}')
gap=$(ffprobe -v error -select_streams v -show_entries frame=pkt_duration_time -of csv=p=0 "$f" 2>/dev/null \
  | awk -v fps="$fps" 'NF && $1!="N/A" {d=$1*fps; if (d<0.99 || d>1.01) c++} END {print c+0}')
echo "$f"
echo "  picture $w x $h, rate $r, $n frames, $d s, $mb MB"
echo "  repeated frames: $rep        frames off the beat: $gap"
want=$(awk -v d="$d" -v f="$fps" 'BEGIN{printf "%d", d*f+0.5}')
[ "$n" = "$want" ] && echo "  frame count matches the length at $fps a second" || echo "  MISMATCH: $n frames for $d s at $fps a second (wanted $want)"
[ "$rep" = "0" ] || echo "  WARNING: $rep frame(s) repeat the one before - a dropped frame looks like this"
