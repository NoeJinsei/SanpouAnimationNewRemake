# The hero's copy wash, measured (Opus, 2026-11-16)

The owner asked whether the fading background behind the title on the left should be there at all,
"since it blocks half the animation section". **This is the WEBSITE, not the film** — `.hc-scrim::before`
in `original/css/40-hero.css`, read-only here, and website polish is a separate task. Nothing was changed.
These are measurements and options so he can decide.

## He is right about how much it covers

On a 1440 px desktop the wash is a left-to-right gradient of the pale sky colour (rgb 238 246 251):

| at stage x | opacity |
|---|---|
| 0 | **.86** |
| 720 (exactly half the screen) | **.72** |
| 818 | .50 |
| 1040 (72 % of the width) | 0 |

It is full height, faded out only below 70 % of the height so it does not mix with the dark band. So it is
at least half-opaque over 57 % of the width and 70 % of the height. On a phone (<= 1099 px) it is a
different rule — a wash across the TOP, not the left — so this is a desktop question.

`1-what-it-costs.jpg` is scene 02 as it is, and the same moment with the copy and wash gone: the warehouse,
its sign 三豊運輸　物流センター, three bays, three loading trucks and the forklift. Most of that pass is
behind the wash.

## But it cannot simply be removed

`2-why-it-is-there.jpg` — the opening frame with the wash off. The headline's second line crosses the
supplier building's dark upper storey: navy on navy.

Measured with `node tools/contrast-check.mjs round2 --framings=desktop --every=2000 --css=<file>`
(the `--css` flag is new; it injects a stylesheet before measuring and changes nothing on disk):

| wash | headline worst (needs 3) | sub-copy worst (needs 4.5) |
|---|---|---|
| as it is | **7.64 PASS** | **9.86 PASS** |
| off | 1.33 FAIL | 1.34 FAIL |
| half the reach | 1.65 FAIL | 1.78 FAIL |
| half the reach, softer | 1.65 FAIL | 1.78 FAIL |

Both worst cases are at t=0, outside any narrowed wash, so narrowing it does not fix them: the copy sits
where the picture is dark. The 5th-percentile numbers do improve a lot (sub-copy 3.85 -> 7.13), i.e. a
narrower wash is fine almost all the time and fails on the opening frame.

## Four ways out

`3-four-ways.jpg`, scene 02:

- **A  as it is** — safe, and the complaint stands.
- **B  a pale panel that hugs the copy** instead of a wash down the whole side. Frees the sky above and the
  loading trucks below; the middle of the picture is still covered, and a rounded card is a louder design
  move than this site makes anywhere else.
- **C  half the reach, softer** — the picture reads nearly as well as with no wash at all, but it fails the
  opening frame, so the copy would have to move off the dark building or carry its own backing.
- **D  the copy clears after the opening** — show it, then fade it out and let the film play clean, bringing
  it back when the film is paused or the copy is focused. **The site already does exactly this on scene 04**
  (`#sanpou-journey.on-map :is(.hc-title, .hc-sub, .hc-tag) { opacity: 0 }`, back on `.is-static` and on
  `:focus-within`), so the behaviour and its accessibility fallback are already written and proven. This is
  the only one that gives the copy full legibility AND the film the whole frame.

My pick is D, with the wash fading out with the copy. It needs no new idea, only the existing rule applied
to every scene after the first instead of to the map alone.

## While measuring, one pre-existing fault, unrelated

`contrast-check` on the current build fails one row: `track unfilled @desktop`, 1.00 against the needed 3,
at t=28000. That is the site's own progress bar over the finale's pale sky, not the film and not new.
One for the integration task.
