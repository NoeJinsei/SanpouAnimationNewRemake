# The map truck's stripe, and the two fixes checked (Opus, 2026-11-16)

Shot again from `round2` and from a `trial` side built from the current working copy plus
`round2/parts/r8-map-truck-opt-tail.js`, so the only difference between the two map-truck pictures
is the drawing.

## The question Fable asked: side stripes, or the navy outline with a tail band?

**The tail band (the rejected one).** Three reasons, in order of weight:

1. **At true phone size the picked one has no dark boundary along its long sides**, so it reads as a
   pale capsule rather than an object (`niigata-ring.jpg`, true size, and `map-truck-fair.jpg`
   magnified from the bare stage where the geometry is identical).
2. **On this map vermilion means "route".** The corridors are vermilion dashes and the arrival ring
   is vermilion. A truck whose long edges are vermilion, driving along a vermilion dashed line,
   blurs into the line. `STYLE.md` §3: "Vermilion creep: one more orange object and the route colour
   stops meaning anything."
3. **The tail band is the film's truck.** White box, navy, one small vermilion accent — and it sits
   with the navy depot cards and the navy place names instead of competing with the routes.

Fable's objection is that a navy outline plus a *side* stripe leaves only 2.2 u of white. That is
true and it is why the stripe moves to the tail: at this size the outline is worth more than the
stripe's exact placement.

## The progress bar's truck

Clearly better (`bar-truck.jpg` at 6x, `bar-truck-2x.jpg` near true size): a real outline, the
stripe in the lower third with white under it like the film's trucks, wheels tucked under the body.

One observation, not a blocker: the cab is now **lighter** than the box's outline, so on the film's
trucks the cab is the darkest part and here it is not. Fable lightened it on purpose
(`#30466f` for `#28395a`) so it does not sink into the dark band. A dark cab with a thin light edge
would keep both; worth one picture.

## The map's place, checked

- `map-band.mjs round2`: 0 % over the hub and all three cards, 4 % over 東京, 新潟 17 px under the
  phone's buttons. Matches what I measured before the pass.
- Niigata's arrival ring never touches the buttons: `niigata-ring.jpg`, 25.4 to 27.7 s, a clear gap
  at every moment. 新潟's name reads on its own land, west of its dot and truck.
- `cd original && sha256sum -c SHA256SUMS` 7 OK; the website folder clean at 72862b6.
- Nodes (`node tools/node-count.mjs original round2`): 6294 against 6753 over six moments; scenes
  03, 04 and 05 are all below the original now (1254/943, 778/945... 05 777/944).

## A note on comparison pictures

Two tiles in a `tools/sheet.py` sheet are scaled to different sizes when one label carries a second
line and the other does not, which makes a before/after look like a zoom change. Give both labels
the same number of lines. (Two shots of the same side at the same moment are pixel identical, so
the viewer itself is deterministic.)
