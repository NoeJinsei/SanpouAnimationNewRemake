# Brief for Fable 5.2 — the clouds a little faster, and the plane accelerates like a real one

Read `CLAUDE.md` and `REFERENCES.md` first. Round 11 is accepted: the owner checked the loop himself and
said it "looks alright for the most part". Two things he wants quicker. Everything else in the finale stays
exactly as it is.

**The rule that governs both jobs: the 52-second loop must survive untouched.** It was verified
independently (`node tools/what-moves.mjs round2 32000 84000` → 0.00 % of the stage changed, 0 regions) and
that number has to come back zero when you are done. Run your own
`evidence/2026-11-17-finale-loop/check/loop-check.mjs` as well.

---

## Job 1 — the clouds, a bit faster

His words: *"for the cloud and the plane's departing animation, I think those could be moving a bit more
faster. Cloud, a bit faster."*

Today the finale's clouds go out and come home on one sine a loop: `SKY_SWAY = [53, 116]` is how far each
plane travels, and the peak speed is `SKY_SWAY × π / 52` — **3.20 px/s far, 7.01 px/s near**, which is
exactly the steady drift they had before the loop existed.

**The straightforward move is to raise `SKY_SWAY`,** since peak speed scales with it directly. For a given
peak speed v, `SKY_SWAY = v × 52 / π = 16.55 v`. So 10 px/s on the near plane is 165, 12 px/s is 199. Start
around **1.4x what is there now** and judge it on the picture, not the number.

**Three things that raising it will break if you are not careful, so check all three:**

1. **The clouds travel further from where they were composed.** The owner approved that sky. At the far end
   of a bigger travel the composition is further from the approved one than it has ever been, so look at the
   extreme (half a loop in) as well as the start.
2. **`node tools/cloud-check.mjs round2` must still pass at every moment of the loop**, not just at the
   start: no cloud base below the roofline of the tier it stands in front of. That rule has caused a
   rejection before.
3. **The sun must stand clear.** No cumulus may cover it while the scene holds — a rule from round 10.

**An alternative you may consider and should say why you rejected or took:** keep the travel as it is and
run two sines per loop instead of one, which doubles the speed without going further from the composed sky.
My reading is that this is worse, because the clouds would then reverse twice as often and the reversal is
the one thing about them that is not physical — but you are looking at it and I am not.

**Do not** change `SKY_WIND`, which scenes 01 to 04 share, or anything outside the finale. Scenes 01 to 04
must stay pixel-identical: Fable's own `same-check.mjs` proves that.

---

## Job 2 — the plane accelerates off the runway

His words: *"For the plane, it should be sped up based on its acceleration when it is departing from the
runway, kind of like an actual plane flying."*

So the departure should build speed the way an aircraft does: slow at the start of the roll, accelerating
all the way down the runway, still accelerating through rotation, and fastest as it climbs away. Today it
rolls, lifts, then holds a steady `CLIMB_V` of 74 px/s over the ground and only gathers speed `ACC_AT` =
8.8 s after lift-off. That is the wrong shape — the acceleration should be there from the start of the roll.

The constants are `PLANE` at `hero-port-b.js` line ~4858:
`T: 26, TD: 5.1, ROLL: 3, HOLD: 1.4, LIFT: 2.03, OUT: 14.7, GY: 968, TDX: 330, STAND: 474, SLOPE: 0.92,
BLEND: 185, ROT: 3.6, HANG: 5, NOSE_X: 82, CLIMB_V: 74, EASE: 1.5, LAG: 0.25, ACC_AT: 8.8, ACC: 62,
ACC_IN: 1`.

**Four things are closed and must come out unchanged:**

1. **`PLANE.T` stays 26 seconds.** The birds are tied to it — the finale's flocks come round every two plane
   cycles, one crossing Tokyo Tower every 26 s, nine seconds before the plane — and 26 is what makes the 52 s
   loop work. If a faster departure finishes the path sooner, **absorb the time saved in the standing or
   taxi phase**, not by shortening the cycle.
2. **The path past Tokyo Tower is approved and does not move.** The plane climbs at `SLOPE` 0.92 and passes
   in FRONT of the thin mast above the top deck, one slot. That was settled in round 5 after two rejected
   options. Change the speed ALONG the path, not the path.
3. **No one-frame speed changes.** Round 11 removed a lurch where the landing plane lost a sixth of its
   speed in a single frame. Speed must be continuous everywhere, including into and out of the hold —
   `evidence/2026-11-17-finale-loop/check/handover-check.mjs` is the check for it.
4. **The loop.** Whatever the speed profile is, the plane must be in the same place doing the same thing
   52 seconds later.

**The tension you must measure and report, because it works against him.** Round 6 deliberately SLOWED this
plane. A phone's only open sky in the finale is the band between the two buttons and the roofs, left of the
Tower, and the slower speed put half or more of the plane in that band for **4.1 s, up from 1.1 s**. A
faster departure cuts that straight back down. Run `node tools/plane-visible.mjs round2` before and after
and **put both numbers in your report.** If the new number is near 1 s, say so plainly and show him a phone
clip — he may want the acceleration shaped so the fast part happens after the plane has crossed that band,
which is both more realistic and kinder to the phone.

---

## Checks every pass has to pass

`what-moves round2 32000 84000` → 0.00 %; your `loop-check.mjs`, `same-check.mjs` (scenes 01–04 identical),
`handover-check.mjs`; `check-viewer` (0 console errors, all three framings); `motion-check` (0 frozen steps,
0 pops); `check-seams`; `cloud-check`; `sky-motion`; `plane-visible` (before and after);
`node tools/node-count.mjs original round2` (say the number if anything is added); and
`cd original && sha256sum -c SHA256SUMS` (7 of 7).

Show it as before/after clips cut from two recordings, not as stills — both of these are about speed.

## Keep out of each other's way

- **Yours:** `round2/js/`, `round2/parts/`, your own evidence folders, `films/`.
- **Not yours:** `round2/css/`, `copy/`, `sides.json`, `viewer/`, `tools/`. Ask rather than edit.
- **Never:** the website folder, and `original/`.
- **`check-player-vs-glue`'s intermittent scene 02/03 failure is NOT the overlay.** That attribution was
  checked on 2026-11-17 and does not hold: with the overlay stylesheet off the figure is 7.85 %, with it on
  7.32 %, on a clean run 4.99 %, against a tolerance of 8. It is timer jitter on the fastest-scrolling
  scene. Do not chase it and do not hand it on.
- **`films/remake-1.mp4` and `remake-2.mp4` are the owner's keepsakes — do not overwrite either.** A new
  one is `remake-3`. Record the whole film again at the end of this work, not before, and say so on the
  film page.
