# The tail band checked, and the progress truck's cab answered (Opus, 2026-11-16)

Shot from `round2` after `r9-map-truck-tail` was spliced in, and from a scratch `trial` side that was a
copy of `round2/js` with ONLY the cab's two pieces of markup swapped (`evidence/2026-11-16-r9-progress-truck-cab/alternative.txt`).

## The map truck: the tail band is in and it works

`maptruck-ibaraki-5x.jpg` and `maptruck-gunma-5x.jpg` are the phone shot at 25.4 s magnified five times with
nearest-neighbour, so the pixel grid is the real one.

- The truck reads as an object at its real size: one dark edge all round, a white box, a navy cab with a
  pale windscreen, four short wheel marks.
- It no longer blurs into the corridor. The vermilion is one small band across the tail; the corridor's
  vermilion dashes run past it and stay the route.
- `scene04-desktop.png`: at the desktop crop the map's subject is clear of the dark band and the trucks
  still read at that size.

One small thing, not a blocker: a truck passes over a prefecture NAME (茨城 at 25.4 s). The names are pale
and the pass is momentary, and the rule that was written was about the depot name CARDS, not these. Worth
a look only if the owner notices it.

## The progress bar's cab: keep it as it is

`cab-at-true-size.jpg` — scene 04 and scene 05 on a phone, four times, the two cabs side by side.

Keep the lighter cab (`#30466f`). Why:

1. At the size it is really seen the two are all but the same picture. The light edge is one CSS pixel.
2. Magnified, the light edge reads as a stray line beside the cab rather than a highlight on it, and the
   darker cab runs into the box's own dark outline, so the cab reads less as a cab, not more.
3. The rule it was meant to satisfy ("the cab is the darkest part") is about the trucks IN THE FILM. This
   is a 30 x 16 px mark on the site's progress bar; what it has to do is read as a truck, which it does.
4. It costs a node and a stroke for nothing.

## Checks run here

- `node tools/node-count.mjs original round2`: 6294 / 6753; scene 04 is 945, unchanged by the swap.
  Scenes 03, 04 and 05 are all below the original.
- `node tools/map-band.mjs round2`: hub 0 %, all three cards 0 %, 東京 4 %, 新潟 17 px under the phone's
  buttons. Unchanged.
- `node tools/check-viewer.mjs round2`: 0 console errors, all three framings.
- `cd original && sha256sum -c SHA256SUMS`: 7 OK. The website is clean at `72862b6`.
