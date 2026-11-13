# Reference material (third-party, for study only)

Someone else's work, kept here so the remake sessions can study it on this machine. **Not ours**: nothing from
it is copied into the animation — not its designs, shapes, palette, type or shot order. Only the grammar
(how light, depth, shading and motion are built) is learned from it. The media is deliberately **not committed
to git** (see `.gitignore`); if the folder is ever lost, the links below say where it came from.

## `motion-film/` — the quality bar

Motion (@motion_so), "Introducing Fable 5.2 for animation", posted 2026-11-10.
Source: https://x.com/motion_so/status/2119956569597358414/video/1
The owner gave this link as the level the remake should reach.

| Path | What it is |
|---|---|
| `clip.mp4` | the film itself, 1920×1080, 30 fps, 900 frames, 30.0 s (16.6 MB) |
| `frames/f_NNN.jpg` | one frame every 0.5 s. **`f_001` is t = 0.233 s**, and `f_K` is source frame 15·(K−1)+7, so t = (K−1)·0.5 + 0.233 s |
| `frames/x_NNNN.jpg` | extra frames named by their exact frame number (t = N/30), dense around every cut and fast move |
| `lossless/p_NNNN.png` | 16 lossless frames (0, 45, 90, 112, 150, 210, 275, 304, 372, 480, 600, 650, 720, 790, 815, 870) — use these, not the JPEGs, to sample colours |
| `crops/` | enlarged detail crops: castle (`z01_*`), door (`z90_*`), hall (`z150_*`), the film's own exploded layer stack (`z52_layers_*`), ambient-motion strips (`amb_*`) |
| `notes/` | contact sheets, and two write-ups from earlier viewings (`gemini-report.md`, `local-report.md`) |

**The measured study of this film is `../research/reference-film-study.json`** — its palette with hex values,
how each technique is built, how to reproduce each one in flat vector, and its weaknesses. Read that first;
come back to the frames when you need to look at something specific.

Only the first 3.9 s is daylight; the rest is a dark interior and a near-black interface. The owner wants the
daylight shot's level of craft, in Sanpou's own daylight palette — **not** the film's dark half, and not its
acid yellow-green accent.

To watch it moving rather than frame by frame, use the `watch` skill on `clip.mp4` (the Gemini engine has a
key on this machine; `--engine local` is the fallback).
