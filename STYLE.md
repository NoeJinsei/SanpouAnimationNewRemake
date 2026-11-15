# Sanpou hero remake: the look

> Flat-vector daylight illustration of a working logistics day in Tokyo, drawn by code: every scene is a pure
> function of the frame. This file holds what stays true in every scene. What changes per scene, and why, is
> in `CHANGES.md` (the owner approves those rows on a style frame before motion is added).
>
> References, for grammar only (never copy their designs): the Motion film "Introducing Fable 5.2 for
> animation" for light, cloud build, depth and purposeful detail; Kurzgesagt for flat shading and colour
> discipline. Not taken from them: their palettes (the film's dark blueprint half does not fit Sanpou), their
> building shapes, characters, type.

## 0. What never changes (the "same game")

Round 1 read this section as "keep the drawings and improve them", and the owner's verdict was that the result
looked like the original with polish on it. It is now explicit: **every element is redrawn from a blank page**;
what stays is the cast, the staging and the story. See `HANDOFF.md`.

- Five scenes, their order, story, copy, facts, timings (`T_WORLD`, `T_TRANSIT`, `T_NETWORK`, the player's
  stops and dwell) and the camera path.
- The cast: each scene still contains the same things (the checklists in `research/sceneNN-checklist.json`
  are the list). The **named** things — the supplier building, the warehouse, the trucks, the Tower, Fuji,
  the signs, the map, the plane — still sit in about the same part of the frame, at about the same size, in
  the same depth plane, so the shot reads the same and the composition still works under the copy overlay.
- **Not** the layout of the background fields.** The skyline tiers, the cloud field and the road traffic are
  COMPOSED AGAIN for the remake: new plot widths, new heights, new gaps, new silhouette. Round 2's first pass
  kept `makeSkylineTier` and its cycles byte for byte and only redrew the inside of each box, so every
  building stood at the original's x with the original's width and height. The city's silhouette — the thing
  the eye reads first — never changed, and the owner said, correctly, that he saw no significant improvement.
  A field of background shapes is not one of the "same things": it is scenery, and scenery gets redrawn.
- **Not** the drawings themselves: silhouette, proportions, construction, materials and detail of every
  element are expected to change, and to be clearly better. A building may gain a different roofline or window
  rhythm, the warehouse may become better architecture, Fuji may be built differently as long as it is still
  Fuji in that place and still the pale body with the white drip-hem cap the owner settled on.
- Ground lines and the anchors that hold the staging together (the ground y, the skyline tier spacing, the
  parallax factors, where the trucks stop, where the sun sits) stay unless the owner approves a change, because
  the camera path and the copy overlay are built around them.
- How trucks move (`truckMotion`: weight, pitch, speed-scaled shake) and the parcel arcs — the physics stays;
  the quality of the motion around it should rise.
- Daylight. One sun, top right. The single `DAY` palette object.
- Already decided by the owner, keep off: floating dust, rotating sun spokes, stars, night lamps and glows, data
  cards, in-art titles, grid lines behind the map, any faint ellipse or stripe that reads as noise.
- No other company's branding, no readable number plates, no people or faces, vending machines unbranded, the
  truck lettering's words exactly as they are (from 2026-11-14 三豊運輸 is the big line on the box side and the
  roman name the small one under it, once the trucks are redrawn), no new claims about the company (no refrigerated trucks, no badges).

## 1. Essence, and what it is not

1. A clear weekday noon over Tokyo: blue sky, yellow sun, white cumulus, crisp light.
2. Flat fills and hard edges, no grain, no blur (the reference has none either: its finish comes from value
   control, layering and detail). Soft gradients exist in exactly four places: the sky, the sun's glow, the
   haze between city tiers, and one pale halo in the sky behind a scene's main subject.
3. Things with a job (trucks, the two logistics buildings, parcels, signs, gantries) carry one navy outline and
   three tones. The city behind them has no outlines and grows paler and bluer with distance.
4. One light for all five scenes: sun top right, lit sides face right, shade sides face left, cast shadows fall
   down-left as flat shapes.
5. White, navy and vermilion are Sanpou's colours; vermilion is the colour of the route and stays scarce.

It is not: a dark or neon "cyber" picture; glossy, glassy or 3D; a washed-out pastel; busy for its own sake.
Buildings are plain Japanese city blocks (boxes with parapets, rooftop gear, water tanks, signs), never
fantasy silhouettes.

## 2. Materials and rendering

- **Vocabulary.** Scenes are built with `h(tag, props, ...children)` exactly as in the original, so the same
  code can be drawn by the SVG engine or the canvas engine. Use: `g`, `rect`, `circle`, `ellipse`, `line`,
  `polygon`, `path`, `text`, `linearGradient` / `radialGradient` (only for the three soft places above),
  `clipPath` with `rect` children. No SVG or CSS filters, no blur, no masks, no images, no foreignObject.
- **Three tones per lit surface**: light (top or sun side), base, shade. Shade is the base pushed toward navy
  blue, never toward grey or black. White things (truck box, Sanpou warehouse, clouds, Fuji's cap) shade into
  periwinkle.
- **The one-step shadow rule**: a cast shadow is a hard-edged flat shape that moves whatever it crosses exactly
  one tone down (wall, window, door each step down once along the same edge). No translucent black, no blur.
  Shadow edges and light shafts share one direction in a scene.
- **Outline**: the original's navy strokes stay at their weight on hero objects. Nothing in the background
  gains an outline.
- **Clouds**: a fair-weather cumulus, drawn as ONE silhouette. The owner's verdict on 2026-11-15 was that
  the clouds look "a bit odd … not that natural / professionally designed", and the rule that used to stand
  here is why: it said "a cluster of round lobes on a flat base … one shade shape, the same cluster moved a
  little down and to the left … so every lobe shows a crisp shaded edge", which is a recipe for a pile of
  equal circles each ringed with its own crescent. You could count the balls. That rule is withdrawn.
  What a cloud is now:
  - **One silhouette, not a stack.** The white is a single shape; a viewer must not be able to count the
    lobes that made it. No lobe gets its own outline or its own crescent.
  - **Lobes of clearly different sizes and shapes.** No two neighbours the same radius, and not every lobe a
    circle — the big forms are wider than they are tall. The largest sit near the cloud's shoulder, the
    smallest at its edges.
  - **Wider than tall**, about two to three times, with the mass low. A cloud as tall as it is wide reads as
    a tower of bubbles.
  - **Asymmetric**: the rising shoulder offset to one side, the other side trailing away lower and flatter.
  - **The underside is the cloud's own base**, flat and a little uneven, not a rounded bar laid underneath
    and sticking out past the lobes.
  - **Shade is one or two large flat areas** inside the silhouette, on the side away from the sun, following
    the big forms — never one crescent per lobe. Cool, and closer to white than the periwinkle `#b9caef`
    that made the old crescents read as lavender rings.
  A few big, composed clouds, not many small ones. Two depth planes at most, one speed per plane.
  Clouds fade in and out only at the wrap edges, and no cloud base sits below the roofline of the tier it
  stands in front of.
  **Streaks** (the thin far clouds, round 10): one long lens with a low uneven back, a nearly level
  underside and both ends drawn out to a point, in one pale colour. Never a bar with round ends, never a
  detached dash beside it.
  **The sun stands clear**: while a scene rests, no cloud crosses the sun's disc or its ring.
  **The sky's clock never runs fast.** A sky that was standing still starts at its own drift; it is never
  given the scene's clock multiplied by something that is easing in (that made the finale's clouds dart
  23 px in 0.4 s as the map drew back). `node tools/sky-motion.mjs <side>` follows every cloud and lists
  any that goes faster than its drift outside a camera move.
- **Birds** (round 10; the owner's verdict on the ones before: "the way the birds are flying is a bit odd"):
  **a bird goes where it points, at a pace its wings could give it.** A flock crosses the sky in side view,
  the way the trucks drive. Each bird beats a few times and then glides on set wings, on its own time; it
  rises a little while it beats and sinks while it glides, and its nose follows that path. A soaring bird
  really turns as it goes round its circle. Never a bird drawn facing the viewer that slides sideways, and
  never a wingbeat up into a deep V. They are the only dark things in the sky: on a desktop they keep above
  the headline (stage y 264) while they are left of its end (stage x 1075), and they pass under the sun's
  ring, not across the sun.
- **Light shafts**: three (at most four) wedges fanning from a point outside the frame on the sun's side, of
  clearly different widths and uneven spacing, each wider than 100 px where it crosses the middle of the sky,
  hard edges, plain white at 7 to 12 % strength, behind the clouds and behind every building. They must read
  as light, never as stripes; if in doubt, fewer and broader. In motion they breathe and sway very slowly.
- **Cast shadows**: one to three flat diagonal bands on a large sunlit wall at the same angle as the shafts,
  a shade strip under every overhang, one flat contact shadow under everything that stands on the ground.
- **Glass**: pane colour, a lighter sky reflection across the top or as one diagonal, a frame. Warm (lit)
  panes stay rare, about one in twenty.
- **Detail has a job.** Three levels per object: silhouette, structure (panels, frames, doors, seams), then
  small working parts (handles, hinges, vents, bolts, lamps, labels, bumpers, drain pipes, safety stripes).
  If a detail does not say "this thing works", leave it out. Detail is true to a Japanese logistics site
  (bay numbers, dock bumpers, roll cages, pallets), never abstract decoration.
- **Detail is sized for the phone.** On a phone the stage is shown at about two thirds of its size and
  cropped. Nothing that matters is thinner than 3 stage px; rows of tiny repeated marks shimmer and are left
  out.
- **Depth, back to front** (parallax factors as in the original): sky and shafts, sun, hill, deep tier, haze,
  clouds and far tier and the Tower, haze, mid tier and utility poles, haze, the street with its buildings and
  trucks, the foreground fence. Farther means lighter, bluer, less contrast, less detail: each plane's colours
  are mixed toward the sky colour behind it (most for the farthest tier, none for the street). The darkest
  values in the frame belong to the road, the truck cab, the outline ink and the foreground band, which frames
  the bottom of the picture.
- **No texture**: no grain, no hatching, no dither.

## 3. Colour logic

- One `DAY` object holds every colour for every scene; new colours are added there with a name that says
  their job. A colour used in one scene means the same thing in the others.
- Hue families: sky blues; city navy-blues (three tiers); blue-grey for third-party buildings; white for what
  is Sanpou's or the sky's; road greys; one green, for expressway signs only; yellow for the sun, tactile
  paving and safety stripes; amber for marker lenses and warm windows.
- Vermilion `#e16347` is reserved: truck stripe, parcel tape, the Sanpou warehouse's fascia line, the map's
  areas and routes, the route line. Tokyo Tower keeps its own red. Nothing else turns vermilion or orange.
- Shadows are cool (navy-tinted), highlights are white or the sun's pale warm white near the sun.
- The sky stays in the July family (`#58abe0` at the top to pale near the horizon). Its top may be deepened a
  little for contrast with white clouds; that is a `CHANGES.md` row, not a free choice.

## 5. Motion quality (after a style frame is approved)

- 30 fps design timeline, drawn at fractional frames up to 60 Hz; every value is a function of the frame or
  of ambient time, never of state.
- Arrivals decelerate with a long soft landing; departures accelerate; constant things move linearly.
  Heavy things (trucks, shutters) show weight; nothing pops, blinks on, or switches pose in one frame.
- The world is never fully frozen: every ambient element (clouds, birds, flags, fans, glints, exhaust, the
  Tower's beacon) has its own slow phase. Ambient motion is small and never competes with the action.
- Scene changes read as one camera move.

## 9. Pitfalls

- Faint, thin or repeated marks (stripes, dots, rings, dust) read as noise. Make it bold and few, or leave it out.
- Vermilion creep: one more orange object and the route colour stops meaning anything.
- Colour drift between scenes: check a sheet of all scenes side by side after every scene.
- Detail as decoration: rivets everywhere, random boxes on roofs.
- The copy overlay covers the left 60 % with a pale wash and the bottom with a dark band: the action and the
  interesting detail belong where they are seen, and nothing dark or busy may sit under the headline.
- Engine rules: the list of nodes a scene returns must not change shape from frame to frame (the SVG engine
  patches by position; switch things off with a constant `null` or opacity 0); ids are unique per scene;
  batch small repeated shapes into one `path`; memoise static groups, and mark big static groups with
  `data-cache="key"` and `data-box="x y w h"` so the canvas engine can keep them as a bitmap.
