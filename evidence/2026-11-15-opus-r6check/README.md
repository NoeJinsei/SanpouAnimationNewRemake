# Round 6, checked from my own frames (Opus, 2026-11-15)

Not Fable's pictures: these are shot again from `round2` and from `before-round3` (the frozen state
before round 6), at the real crops.

| picture | what it shows |
|---|---|
| `s03-desktop.jpg`, `s03-phone.jpg` | scene 03 before and now, 16 / 18 / 20 s |
| `street-desktop.jpg`, `street-phone.jpg` | the street of scenes 01 and 02, before and now |
| `map-phone.jpg` | the map's trucks driving, 23.0 to 27.2 s |
| `truck-zoom.jpg` | one map truck at 3x, to judge whether it reads as a truck |
| `plane-phone.jpg` | the plane on a phone, 41.5 to 45.5 s |
| `map-plane-desktop.jpg` | the map and the finale at the desktop crop |

## What I measured myself

- **The plane on a phone** (`node tools/plane-visible.mjs round2`): at least half of it in open sky
  below the buttons for **4.1 s (41.5 - 45.5 s)**, at least 80 % of it for 1.5 s. Inside the film's
  own 45.8 s, not after it. The site's player holds the last scene and its ambient clock runs on
  (`hero-glue.js`: "final scene holds and loops its ambient idle"), so the later pass at the Tower
  does happen, but the good window does not depend on it.
- **Smoothness, back to back in one sitting** (`tools/perf-side.mjs`, phone @2x, CPU 4x slower):
  original **71.2 fps, median 13.5 ms, 12.1 %** of frames over 16.7 ms;
  round2 **63.9 fps, median 14.7 ms, 33.1 %** over 16.7 ms.
  Drawing (script) is *lower* in the remake: mean 5.22 ms against 6.23. The extra cost is style,
  layout and paint, not the scene code. Absolute numbers swing hard with machine load (three
  sittings today gave three different pictures), but two of the three put the original ahead.
- **Nodes** (`node tools/node-count.mjs original round2`): 6294 against 6948 over the six moments;
  scene 03 is now *below* the original (1254 -> 944).
- `check-viewer` 0 console errors; `cd original && sha256sum -c SHA256SUMS` all OK; the website
  folder is still at 72862b6 with a clean tree.

## What I think is still wrong

1. The map truck is steered properly but reads as a pill, not a truck: 18 u x 9 u is 29 x 15 stage
   px, and its nose taper is 1.5 screen px on a phone. Bigger, or clearer, or both.
2. On desktop the map's subject — the three bases, the hub, 東京 — sits where the site's dark band
   starts.
3. Smoothness: the film is not smoother than the one it replaces.
