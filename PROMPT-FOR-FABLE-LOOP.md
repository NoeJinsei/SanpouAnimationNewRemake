# Brief for Fable 5.2 — the finale loops, and the whole film runs smooth (2026-11-17)

Read `CLAUDE.md` and `REFERENCES.md` first, as always. This is your task; the main session is working on
the hero's **copy and its overlay CSS** at the same time, so see "Keep out of each other's way" at the end.

Two jobs, in this order.

---

## Job 1 — the last scene must be a complete, seamless loop

**What the owner asked for:** *"make sure the last scene is a complete seamless loop (the user can switch
back to other scenes by clicking on the bar that we have on the hero section so)"*.

Scene 05 地域とともに starts at 27800 ms on the site clock and then **holds** — the scene stops advancing but
its ambient clock runs on, so the finale is what a visitor sits and watches. Today it simply keeps running:
nothing is built to return to its start, so if a visitor stays long enough the sky, the plane and the birds
drift into states the composition was never checked at.

**What "seamless" has to mean here, precisely:** pick a loop length **L** and make the finale's picture at
time `t + L` identical to the picture at `t`, for every t. Not approximately — identically, pixel for pixel.
That means every moving thing in the finale has a period that divides L exactly, and that both its
**position and its velocity** are continuous across the wrap, so there is no flick at the seam.

**L = 52 s is the obvious choice and you should start there,** because the two longest cycles already agree
on it: `PLANE.T` is 26 s and the finale's flocks come round every two plane cycles (`BIRD_SETS` `span: 52 * 52`,
hero-port-b.js around line 2263). If something cannot be made to divide 52, say so and propose a different L
rather than fudging it.

Everything that moves in the finale has to be audited against L. At least: the plane and its whole cycle
(`PLANE`, line ~4786), the birds and the kite (`BIRD_SETS`), the cloud field and the streaks, the sky's own
clock (`skyT` / `skyTime`, line ~4202 — note it starts from rest at its own pace when the map draws back, so
the wrap has to respect that), the sun and its light shafts, the Tower's beacon, the lit windows
(`CityLights`), the cranes (`CityCranes`), the road trucks, the airport's windsock, radar and baggage train,
and the depot's own motion. Go through them one at a time; a single element with a period that does not
divide L is the whole loop broken.

**The scene buttons must keep working.** A visitor can click any of the five at any moment, including after
the finale has looped several times. Jumping away and back must land the finale somewhere valid on its
cycle with no pop, and `hero-glue.js` and `viewer/player.js` must agree about it — `check-player-vs-glue`
and `check-seams` both have to stay green.

**Do not change** the scene order, the timings, the camera path, the dwells, or anything in the first four
scenes. The finale's composition is approved: the plane's accepted path past the Tower's mast, its speed
(`CLIMB_V` 74, `ACC_AT` 8.8), the sizes, the skyline. You are making it repeat, not redrawing it.

**How to prove it.** Record the finale across at least two full loops and show that the frame at `t` and the
frame at `t + L` are identical:

```bash
node tools/record.mjs round2 shots/loop.mp4 --framing=full --from=27800 --to=131800 --fps=30
```

and compare frames L apart (`tools/what-moves.mjs` tells you where two moments differ, and
`tools/diff-sides.mjs` compares two sides at the same moments). `viewer/timeline.js` already lets tools ask
for moments past 45.8 s. A still-by-still proof at the wrap is what the owner needs to see, plus a clip that
runs through the seam without you saying where it is.

---

## Job 2 — the animation should look 60 fps, with no jaggedness

**What the owner asked for:** *"I want the animation scenes to look 60 fps like (smooth without any
jaggedness or issues)"*.

Two different faults hide under "jaggedness" and you should hunt both:

1. **Dropped or late frames** — the browser not finishing a frame in 16.7 ms. This has been measured
   repeatedly and the remake is at or better than the original in all five scenes, so this is probably not
   where the problem is. Re-measure anyway and report both sides from the same sitting:
   `node tools/perf-table.mjs` and `node tools/perf-side.mjs` (run one at a time, never together).
   `tools/trace-side.mjs <side> --from --to` shows where a frame's time actually goes, and the lesson from
   round 7 is in `CLAUDE.md`: what cost the remake was REDRAWING, not script or node count.

2. **Motion that steps rather than flows** — the likelier culprit, and it will not show up in a frame-rate
   number at all. Anything whose position is rounded to a whole pixel, quantised to a coarse clock, or
   recomputed only when some other value changes will visibly stutter even at a perfect 60 fps. Audit every
   moving thing for being a continuous function of time. `node tools/motion-check.mjs` reports frozen steps
   and pops; `node tools/sky-motion.mjs <side>` follows every cloud and flags anything that jumps, pops or
   moves faster than its drift; `node tools/what-changes.mjs` shows what the patcher actually writes per
   step — a value that changes in jumps is a value that will look jerky.

Watch the recordings yourself at full size before you declare it smooth. `sh tools/check-recording.sh
<file.mp4> [fps]` proves a recording has no repeated frames and nothing off the beat, which separates "the
film stutters" from "the recording stuttered".

If you find something genuinely jagged, fix it and show the before and after as clips cut from two
recordings (`sh tools/cut-pairs.sh <before dir> <after dir> <out dir>`).

---

## Checks every pass has to pass

`check-viewer` (0 console errors, all three framings), `motion-check` (0 frozen steps, 0 pops, every scene),
`check-seams`, `check-player-vs-glue`, `cloud-check`, `sky-motion`, `contrast-check`, and
`cd original && sha256sum -c SHA256SUMS` (7 of 7). Say the node count whenever a pass adds nodes
(`node tools/node-count.mjs original round2`) — node count is the film's cost, not script time.

## Keep out of each other's way

- **Yours:** `round2/js/`, `round2/parts/`, and the finale's art and motion. Work the usual way — one part
  file per change in `round2/parts/`, spliced with `python tools/splice.py`, one commit per pass with its own
  evidence folder, pushed when it is finished and checked.
- **Not yours, the main session is in them right now:** `round2/css/` (the hero's overlay: the faint patch
  and the phone layout the owner chose on 2026-11-17), `copy/`, `sides.json`, `viewer/frame.html`.
  If you need something changed in those, ask rather than editing.
- **Never:** the website folder `C:\Users\RTX4070TI\Desktop\sanpou-site-v2`, and `original/`.
- **The whole-film recordings in `evidence/2026-11-16-the-film/` are stale and deliberately not refreshed** —
  the overlay changed on 2026-11-17 and your work will change the film again. Record them once at the end of
  your work, not before, and say so on that page.
- `films/remake-1.mp4` is the owner's keepsake copy of the film as it stood on 2026-11-17 (1920x1080, 48 s,
  bare stage, no overlay). Do not overwrite it; a later one is `remake-2`.
