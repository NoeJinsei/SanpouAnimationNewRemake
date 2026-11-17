# Round 11 checked from my own measurements (Opus, 2026-11-17)

Fable reported the finale loops exactly and five one-frame motion faults are fixed. I checked the claims
that matter rather than passing the report on.

## Verified, independently

- **The loop is exact.** `node tools/what-moves.mjs round2 32000 84000` → **0.00 % of the stage changed, in
  0 regions.** As a control, the same tool at half a loop (`32000 58000`) reports six changed regions, so the
  test can see change and the zero is real, not a dead measurement. `shots/clouds2/cycle.jpg` shows the
  cycle: the t=32 s and t=84 s frames are the same picture.
- **No element was added.** `node tools/node-count.mjs original round2` → 01 1483, 02 1494, 03 943, 04 945,
  05 944 / 944. Identical to the figures recorded before round 11.
- **`films/remake-1.mp4` is untouched** — 11,360,629 bytes, 17 November 02:06, the same file the owner asked
  to keep. `remake-2.mp4` is new beside it.
- **Fable stayed in its lane.** `git diff --stat` over its five commits touches only `round2/js/`,
  `round2/parts/`, `evidence/` and `films/`. Nothing of `round2/css/`, `copy/`, `sides.json`, `viewer/` or
  `tools/` was changed.

## One claim that does not hold

Fable reported that the intermittent `check-player-vs-glue` failure is caused by *"a fading overlay in the
viewer's clock player"* which *"belongs to another session"*. **That attribution is wrong, and the evidence
is already in this project's history.**

- I ran it again here: it **passes**, scene 03 measuring 4.99 % against a tolerance of 8 %.
- On 2026-11-16 I measured the same check with the overlay stylesheet switched OFF (7.85 %) and ON (7.32 %).
  **Removing the overlay made the number worse, not better.**
- The tolerance's own comment says why it is noisy there: *"the expressway scrolls 270 px a second, so 20 ms
  of timer noise already moves every edge there."*

So it is timer jitter on the one scene that scrolls fastest, sitting at the tolerance boundary by design. It
is not the overlay, it is not a defect in either session's work, and it should not be carried forward in the
notes as a known cause. Fable was right that it failed the same way before its changes.

## The clouds: the decision Fable put to the owner

In the finale the clouds now **go out and come home** — they drift left with the wind at their approved
pace, stop half a loop later and drift back. For half of every 52 s they move against the wind.

**Fable's reasoning is right, and the numbers back it.** `CloudField` already wraps (a modulo over
`SKY_SPAN = 3600` with a 60 px fade at each end), so a one-way drift is not impossible — but the finale's
sky holds only two far clouds (x 40, 1040) and three near ones (x 110, 820, 1570) in that 3600 px span. The
largest gap on the near plane is **2140 px** and on the far plane **2600 px**, against a visible window of
1920 px. At 7 and 3.2 px/s that is **about 5 minutes with the near sky bare and 13 minutes with the far sky
bare.** One-way wind would empty the finale's sky for minutes at a time.

So the honest options, with what each costs:

| | wind | cloud pace | cost |
|---|---|---|---|
| **as built** (`SKY_SWAY = [53, 116]`) | reverses for half of every 52 s | **the approved pace** — peak 3.2 and 7 px/s, exactly as before | the reversal itself |
| gentler (`r11-loop-opt-gentle.js`, `[24, 52]`) | reverses, but travels less than half as far | **peak ~1.5 and 3.1 px/s — under half the approved pace** | the clouds look sluggish against the film he approved |
| one-way wind | never reverses | approved pace | the finale's sky must be repopulated across the whole 3600 px span (more clouds, more nodes), and the approved sky becomes one moment out of many; the loop stretches to about 19 minutes |

**Recommended: keep it as built.** The owner approved how these clouds look and move, and the as-built option
is the only one of the three that keeps their pace. The reversal is the price, and at 116 px of travel on a
1920 px stage it is subtle — but it is the same class of fault he has caught twice himself (the birds
sliding sideways, the map trucks sliding), so if it bothers him when he watches it, the one-way route is
real and the table says what it costs.
