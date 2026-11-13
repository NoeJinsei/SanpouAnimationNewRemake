# How the reference film moves, measured

Per-frame change of the picture (mean absolute difference between consecutive frames, luma, measured at
320 px wide with ffmpeg). It is a velocity curve for the whole film: high = the picture is changing fast,
0 = a repeated frame. 899 frames at 30 fps.

Reproduce: `ffmpeg -i clip.mp4 -vf "scale=320:-1,tblend=all_mode=difference,signalstats,metadata=print:key=lavfi.signalstats.YAVG" -f null -`

## What it says (the part that matters for us)

1. **The film is never still except to let you read.** Only 42 of its 899 frames repeat exactly, and every one
   of them is inside a deliberate hold: the 2.9 s text card at 15.0-17.9 s and the 1.6 s end card at 28.4 s.
   Everything else changes on every single frame.
2. **Even the "still" opening shot moves.** The first 2 seconds sit at a steady change of about 1.5 - a slow
   camera creep plus clouds, water, flags and light. Our film's holds sit near 0.
3. **Moves are bell-shaped.** The first push rises from 1.5 (at 1.5 s) to 28.7 (at 2.0-2.5 s) and falls back to
   1.8 by 3.0 s: about 15 frames up, 15 frames down, with the fastest frames in the middle.
4. **The cut is hidden at the top of the bell.** The change peaks at 38.7 around frame 76 and the cut is at
   frame 77 - the eye cannot resolve the join because everything is already moving at maximum speed.
5. **The second half is interface work** (4-27 s) at a change of 4-20: constant, lower-amplitude motion rather
   than stillness between events.

For the remake this means: give every scene a low constant ambient level instead of a frozen hold, shape every
camera move as a bell with a long landing, and put each scene change at the fastest moment of a move rather
than between two settled pictures.

## Shot structure

A cut shows as one very large spike. Spikes over 25 (the film's own cuts and wipes):

| time (s) | frame | change |
|---|---|---|
| 2.13 | 64 | 25.2 |
| 2.17 | 65 | 26.7 |
| 2.20 | 66 | 26.8 |
| 2.23 | 67 | 26.3 |
| 2.27 | 68 | 26.4 |
| 2.30 | 69 | 27.4 |
| 2.33 | 70 | 29.5 |
| 2.37 | 71 | 32.3 |
| 2.40 | 72 | 34.4 |
| 2.43 | 73 | 35.8 |
| 2.47 | 74 | 38.2 |
| 2.50 | 75 | 38.4 |
| 2.53 | 76 | 38.7 |
| 2.57 | 77 | 32.8 |
| 2.60 | 78 | 52.7 |
| 4.07 | 122 | 64.8 |
| 4.10 | 123 | 67.4 |
| 4.13 | 124 | 35.6 |
| 6.20 | 186 | 49.6 |
| 8.20 | 246 | 46.8 |
| 10.00 | 300 | 55.9 |
| 10.03 | 301 | 48.8 |
| 27.47 | 824 | 33.5 |
| 27.50 | 825 | 51.3 |
| 27.53 | 826 | 63.1 |
| 27.57 | 827 | 56.3 |
| 27.60 | 828 | 34.4 |

## Holds: frames where the picture barely changes

Runs of 4 or more near-still frames (change under 0.35):

| from (s) | to (s) | frames | seconds |
|---|---|---|---|
| 10.60 | 11.03 | 14 | 0.47 |
| 14.40 | 14.97 | 18 | 0.60 |
| 15.03 | 17.90 | 87 | 2.90 |
| 18.37 | 18.57 | 7 | 0.23 |
| 21.70 | 21.80 | 4 | 0.13 |
| 22.53 | 22.73 | 7 | 0.23 |
| 24.17 | 24.50 | 11 | 0.37 |
| 24.83 | 25.03 | 7 | 0.23 |
| 25.83 | 26.00 | 6 | 0.20 |
| 28.43 | 29.97 | 47 | 1.57 |

**Frames with no change at all (true repeats): 42 of 899.**

## The velocity curve, half a second at a time

Mean change per 15-frame block, so the shape of each move is visible:

| time (s) | mean change | bar |
|---|---|---|
|   0.0 |   1.48 | # |
|   0.5 |   1.50 | # |
|   1.0 |   1.90 | # |
|   1.5 |   3.02 | # |
|   2.0 |  28.72 | ################# |
|   2.5 |  13.83 | ######## |
|   3.0 |   1.76 | # |
|   3.5 |  14.66 | ######## |
|   4.0 |  20.22 | ############ |
|   4.5 |  16.39 | ######### |
|   5.0 |  13.21 | ####### |
|   5.5 |   3.62 | ## |
|   6.0 |   9.96 | ##### |
|   6.5 |   9.18 | ##### |
|   7.0 |   4.27 | ## |
|   7.5 |   1.63 | # |
|   8.0 |  10.30 | ###### |
|   8.5 |  12.13 | ####### |
|   9.0 |   6.64 | ### |
|   9.5 |   6.40 | ### |
|  10.0 |   6.85 | #### |
|  10.5 |   0.14 | # |
|  11.0 |   6.38 | ### |
|  11.5 |   5.40 | ### |
|  12.0 |   1.32 | # |
|  12.5 |   1.14 | # |
|  13.0 |   0.68 | # |
|  13.5 |   2.57 | # |
|  14.0 |   3.54 | ## |
|  14.5 |   0.17 | # |
|  15.0 |   0.22 | # |
|  15.5 |   0.17 | # |
|  16.0 |   0.14 | # |
|  16.5 |   0.17 | # |
|  17.0 |   0.18 | # |
|  17.5 |   0.49 | # |
|  18.0 |   2.94 | # |
|  18.5 |   1.35 | # |
|  19.0 |   0.58 | # |
|  19.5 |   1.07 | # |
|  20.0 |   1.85 | # |
|  20.5 |   0.49 | # |
|  21.0 |   2.98 | # |
|  21.5 |   0.70 | # |
|  22.0 |   0.72 | # |
|  22.5 |   2.48 | # |
|  23.0 |   1.26 | # |
|  23.5 |   5.07 | ### |
|  24.0 |   0.64 | # |
|  24.5 |   0.63 | # |
|  25.0 |   7.16 | #### |
|  25.5 |   2.79 | # |
|  26.0 |   1.48 | # |
|  26.5 |   3.14 | # |
|  27.0 |   8.06 | #### |
|  27.5 |  13.84 | ######## |
|  28.0 |   0.54 | # |
|  28.5 |   0.07 | # |
|  29.0 |   0.01 | # |
|  29.5 |   0.01 | # |
