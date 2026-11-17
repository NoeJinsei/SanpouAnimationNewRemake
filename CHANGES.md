# Changes from the original, by scene

One row per decision: what the original has, what the remake has, why. The owner approves these on a style
frame. At most five rows per round, so each can be judged. Status: proposed / approved / dropped.

## Scene 01 入荷 (and the shared world: sky, city, street, truck) — round 1, APPROVED by the owner on 2026-11-13

The frame: `samples/frame-a/js/hero-port-b.js` (side "Style frame" in the viewer). Stills:
`evidence/2026-11-13-style-frame-01/` (`styleframe-vs-original.jpg` = original left, remake right).

| # | Element | Original | Remake (as drawn) | Why |
|---|---|---|---|---|
| 1 | Clouds | Seven small puffs, four lobes each, one grey-blue underside, all one size class | Four composed clouds on the old plane plus a slow far plane with one big summer cumulus on the left horizon; pure white, one crisp shade edge on the side away from the sun; the sun is clear of cloud | The reference's sky is its strongest part; big white shapes give the frame a clear light-dark design |
| 2 | Light and shadow | A sun disc with a soft glow; buildings have one thin shade strip | Three white light shafts (8.5 to 12 %) fanning from beyond the top right, behind sun, clouds and buildings; a shade side (left) and lit side (right) on every block; on the supplier a shade strip under the roof, one diagonal band, the awning's shadow; flat contact shadows under building, truck, vending machines, streetlights | Lighting is what makes flat art look expensive; the original has no light direction |
| 3 | Depth | Three city tiers with haze, all similar in strength | Far tier mixed 34 % toward the sky, mid tier 20 %; the farthest tier is a plain silhouette (no windows); the supplier is the strongest blue block; the foreground band is dark navy with a guard rail | So the eye lands on the truck and the dock first |
| 4 | Working detail | Buildings and truck clean but plain | Supplier: drain pipes, roof units with fans and louvres, flue, wall louvre, slatted shutter, steel threshold, yellow/black corner guards, door lamp, a roll cage and a pallet stack. Truck: panel seams, hinges, tank straps, mud-flap bands, rear reflector, mirror stay, tyre walls. Street: kerb joints, manhole covers, guard rail | "Detail that implies a working machine", true to a Japanese depot |
| 5 | Shade colour | Translucent navy at one strength | Solid tones from the palette, named by job; white shades into periwinkle | Clean, consistent colour in every scene |

Also changed while drawing (not in the five rows; shown to the owner and approved with the frame):
- the supplier building is a clearly stronger blue than before (third party reads blue, Sanpou reads white);
- the truck's tail-lamp glow is off (lamps off by day);
- scene 03's foreground band uses the same dark navy, so 02 to 03 does not jump;
- tried and removed: road studs (read as stray yellow dots) and a pale halo in the sky.

Until their own rounds, scenes 03 and 05 inherit the new clouds, city shading and truck but have no light shafts
or big cumulus yet, so the film is uneven between scenes.

The approved look now lives in `remake/js/hero-port-b.js` (copied from `samples/frame-a/`).

Not changed in this round: sky colours (the July family stays), the sun's place, building shapes and places,
the truck's design and lettering, Tokyo Tower, timings and motion.

## Scene 02 積込 (the Sanpou warehouse) — round 1, proposed

The camera pans from the supplier to the Sanpou warehouse (frames 185-391), the three bay shutters open,
parcels are loaded into three trucks, and the scene holds at frame 391. Sky, clouds, light shafts, city,
street and trucks already carry the approved scene 01 look; the warehouse itself does not.

| # | Element | Original | Remake | Why |
|---|---|---|---|---|
| 1 | Warehouse light and shade | A flat cream wall, one flat roof slab, no light direction | The same one sun as scene 01: a shade strip under the roof slab and the canopy, one diagonal cast shadow across the wall, the lit right side and shaded left side of every volume, flat contact shadows under the building | It stands beside a scene 01 supplier that is now lit; flat next to lit reads as unfinished |
| 2 | The bays read as a working interior | A dark gradient with a few vague boxes and one faint forklift | Real depth in each bay: racking with pallets, stacked boxes, a forklift at work, the back wall catching the daylight, and the light from the open shutter falling on the floor as one flat shape | The dock is the subject of this scene; today it is a dark hole |
| 3 | Working detail on the building | Plain wall, plain bay openings, a sign and bay numbers | Dock bumpers and a leveller lip at each bay, bollards, downpipes, wall lamps, roof units with turning fans (as on the supplier), safety stripes at the bay edges, a shutter slat box above each opening | "Detail that implies a working machine", true to a Japanese distribution centre |
| 4 | The apron in front of the bays | Plain asphalt and a kerb | Painted bay guide lines and bay numbers on the ground, a wheel stop per bay, kerb joints and a drain, worn lane marks | The ground is a third of the frame here and carries no information today |
| 5 | The hold is never frozen | The player holds scene 02 at frame 391 with ambient time stopped, so for about five seconds clouds, light shafts, birds and fans all stand still | Ambient time runs on through the hold, as it already does in scenes 01 and 04 | The quality bar: the world is never fully frozen. This is a player fix (`remake/js/hero-glue.js`), not art |

Not changed in this round: the camera pan and its timing, the loading choreography, the trucks' places and
paths, the warehouse's size, position and sign, the three bay positions.

## Scene 03 輸送 (the expressway) — round 1, proposed

The convoy drives and the world scrolls past (`sceneTransit`); there is no camera move, so the scene is judged
at t = 20000 ms with a second look at t = 16500 (just after the slide in). It already inherits the approved
clouds, city shading and trucks, but not the light, so today it looks like a different film from scenes 01-02.

| # | Element | Original | Remake | Why |
|---|---|---|---|---|
| 1 | The light | No light shafts and no big cumulus here: the sky is bare, and the scene reads cooler and flatter than scenes 01-02 | The same three fanned shafts and the same composed cumulus as scenes 01-02, with the same sun direction and strength, scrolling with their own plane | One light across all five scenes. The reference film's worst fault is colour that changes between shots, and the owner named it |
| 2 | Mt Fuji | A white slab: the snow cap has taken over almost the whole mountain, with a pale blue sliver at the base and no shading | The owner's reference shape: a pale blue body, one white cap with the irregular drip hem, a shade side away from the sun, sitting behind the haze so it reads as distance | Fuji went through four rounds with the owner to reach that shape; today's version loses it |
| 3 | The expressway | Flat grey bands, a dashed centre line, a plain fence | A road built like a road: value split (lighter far, darker near), lane wear either side of the dashes, surface joints, delineator posts, and a proper barrier with posts and its own shadow | The road is a third of the frame and carries no light or detail today |
| 4 | Gantry and signs | A plain dark bar and flat green plates | Structure on the gantry (truss, brackets, walkway) and sign plates with a lit top edge, a shaded underside, a frame and a cast shadow on what is behind them | The signs are the one place the scene says where the trucks are going; they should look made, not pasted |
| 5 | Depth | All city tiers at similar strength, the convoy level with the background | The same depth as scene 01: far tiers tinted toward the sky and simplified, the near plane stronger, the foreground barrier darkest, so the convoy reads first | Consistency with scenes 01-02, and the trucks are the subject |

Not changed in this round: the convoy's speed, spacing and motion, the scroll speed, the gantry phase (back and
front must stay identical or the pillar leaves its sign), the sign wording, Fuji's position and size, the
layout of the city tiers.

## Owner's decisions, 2026-11-13 (carry into round 2)

- **The trucks' engines are running at the dock.** A parked truck shows a faint exhaust wisp and a trace of
  engine movement. The original hides the exhaust at idle (its opacity is multiplied by the truck's speed), so
  idle needs its own small baseline. A fast, sub-pixel tremble was tried in round 1 and removed because it made
  the box edge and the lettering shimmer; use a slower, slightly larger movement.
- **Mt Fuji's blue should be clearly darker**, in the owner's words "like the typical fuji mountain
  illustrations that is out there". It is one colour for the whole film (`DAY.fuji`, with `DAY.fujiShade` a
  step below), so every scene changes together. Options rendered in `evidence/2026-11-13-fuji/`; the exact
  value is the owner's pick.

## Round 2 brief: what each element becomes (owner's direction, 2026-11-13)

The owner looked at the Fuji colour options and then gave direction on four things. Their words are quoted;
the diagnosis of *why* each one reads as it does is mine, from the source.

### Mt Fuji — colour chosen, shape rejected

**Colour: decided.** Body `#5f93c9`, its shade `#4d7db2`, cap white. One colour for the whole film
(`DAY.fuji` / `DAY.fujiShade`), so every scene changes together. Do not go darker: at `#4a7ab5` the mountain
reads darker than the city standing in front of it, which breaks the rule that distant things stay lighter.

**Shape: "the white top part looks kind of cut off and the fuji mountain's shape and its design still looks a
bit janky / basic … I want a advanced designed fuji mountain but with matching design direction."**

Why it looks cut off (`FujiMountain`, original lines 730-762): the summit is not a summit. The silhouette
puts its "shoulders" at ±8.8 % of the width and lifts the crown only 5.2 % of the height above them, so the
top 10 % of the mountain is a near-flat plateau. The cap then fills that plateau, and its hem is one zigzag
band of eleven straight segments at a constant height. The result reads as a trapezoid with a white slab on
top rather than as a peak.

What it becomes: the real silhouette — long **concave** flanks that flare as they reach the base and sweep up
to a **narrow** summit with only a slight crater dip; the snow cap sitting on that summit and reaching down the
mountain in the familiar **irregular fingers that follow the gullies**, deeper on some lines than others, not a
single sawtooth at one height; a shaded flank away from the sun that meets the cap's own shade on the same
line; and enough drawing in it to hold up at the size it fills in scene 05, where it is 1700 px wide. Keep its
position, width, height and the way the city hides its base.

**Round 2 drawing: APPROVED by the owner on 2026-11-14 ("Yes, carry on")**, and now in `round2/`, the round 2
working copy. It is the level every other element is drawn to. Shown on 2026-11-13 as viewer side `fuji-r2`
(`samples/fuji-r2/` = the original with only `FujiMountain` and its palette entries replaced, so scenes 01, 02
and 04 are pixel-identical to the original). Before and after in `evidence/2026-11-13-fuji-r2/`.
How it is built, so the next element can match it: the mountain is drawn in "cone space" (across the cone,
down the cone), so every edge that follows a gully fans out with the flank. The profile is an exponential
flank with a narrow crater rim and the crater's far wall showing through the dip. The snow hem is seven fingers
of different lengths lying in the gullies with rock ridges rising between them, plus five strips of snow left
lower down. One light: the flank away from the sun is one tone down along a single line through snow and rock;
three ridges on the sunlit side each throw one band of shade to their left across snow and rock alike, and
their crests catch a blade of light. Two new palette entries: `fujiLight #73a5d7` (the crest light) and
`fujiCapShade #d9e4f5` (snow in shade). Not in `remake/` yet.

### The background city — "basic and look quite the same"

**"all look pretty basic and look quite the same, I want a more well designed distinct buildings that
resembles the metropolis / megacity that is Tokyo for the scenes with its background buildings, with varieties
of buildings."**

Why they look the same: `makeSkylineTier` (lines 444-457) walks one repeating rhythm of six widths and six
heights, and `CityBuilding` (lines 594-644) draws exactly one kind of building for all of them — a plain box,
a parapet cap, an even grid of identical windows, a shade strip down the left, a rim down the right, and
sometimes a small roof box or mast. Every tower in all five scenes is that one drawing at a different size.

What it becomes: a **kit of genuinely different Tokyo buildings**, chosen per slot rather than one shape
scaled. At least: glass curtain-wall towers with a banded facade; older concrete mid-rises with rows of
balconies; towers that step back as they rise; slim "pencil" buildings on narrow plots; low wide blocks with
rooftop plant, water tanks, vents and stair heads; buildings carrying signage boards or a billboard frame;
one or two with a crown or antenna mast. Different window logic per type — ribbon glazing, punched windows,
balcony shadow, a dark glazed core — not one grid everywhere. Keep the tier structure, the parallax factors,
the overall skyline rhythm and the silhouette heights that frame Fuji, the Tower and the warehouse, and keep
the far tiers simple: variety belongs to the tiers you can actually see.

### The airport and its plane — "even more polished"

**"For the plane design (with its terminal / airport too) that flies in the background, I want its design and
animation to be even more polished too."**

Today (`Airport` lines 1577-1629, `AirportPlane` 1630-1676, `JetPlane` 1535-1576): the terminal is a white
box with a glazed strip, the tower a tapered shaft with a cab, and the aircraft a side-view jet that runs a
19-second loop of approach, flare, touchdown bump, rollout, a stand hold, take-off roll and climb-out.

What it becomes: an aircraft that is actually drawn — a believable airliner silhouette with its wing, engines,
tail and livery reading at that size — and an airport that looks like an airport: a terminal with piers and
jet bridges, an apron with stand markings and ground vehicles, a tower that reads as a control tower.
The cycle stays (it is good, and it is continuous motion in a scene that needs it), but the motion gets the
same treatment as everything else: weight on touchdown, flap and gear movement, a nose that settles rather
than snaps, and no pose that changes in a single frame.

### Scene 04, the map — "redesigned and animated with advanced design and animation sequence"

**"for the mapping scene in the second last scene, I want its animation scene to be further improved as well,
showing the streamline of the truck's routes and prefecture lines / labels and also of the three locations as
well, I want this scene to also be redesigned and animated with advanced design and animation sequence too."**

Today (`CoverageMap` lines 1081-1143): the prefectures fade in on a rank order, seven straight lines are drawn
from the Itabashi hub to each prefecture's centre, dashes flow along them, the three bases pop in as numbered
discs, and the labels fade in on dark pills.

What it becomes, as the one scene that carries the company's reach:
- **Routes that read as journeys**, not straight lines from a hub to a dot: curved, drawn as a travelling
  stroke with a visible head, arriving one after another, with the already-travelled part reading differently
  from the part still to come. The owner's word is "streamline".
- **Prefecture lines and labels drawn, not faded**: outlines that draw themselves, labels that arrive with
  their prefecture and sit clear of the routes.
- **The three bases as the subject**: 本社（板橋）, 志木営業所, 入間営業所 arriving in order, each clearly
  anchored to its place, with the hub reading as the hub.
- One continuous sequence rather than separate fades, ending in the settled picture it holds.
- **Fix while redrawing** (see HANDOFF.md): the seventh route, Saitama, never reaches full draw, so it alone
  never starts flowing.
- Keep: the prefectures covered and their names, the three bases and their places, areas only and never
  distances, and 新潟 as 新潟市方面 only.

### And the whole film

**"overall it should be a remake to a better animation for this overall."** The motion bar in `HANDOFF.md`
and the measured reference curve in `research/reference-motion-profile.md` apply to every scene: no frozen
holds, bell-shaped moves with long landings, secondary motion on anything that starts, stops or lands, and
scene changes hidden at the fastest moment of a move.


## Scene 01 入荷, round 2: what each element becomes (drawn 2026-11-14, to be approved on the style frame)

**Status, 2026-11-14: all rows below are drawn and in `round2/`; shown to the owner as a style frame beside the
original (`evidence/2026-11-14-scene01-r2/`), waiting for the verdict.** Checked: 0 console errors, no frozen
frames and no pops across scene 01, drawing 1.98 ms a frame against the original's 2.61 ms in the same run.
Not done yet: the motion pass. One change beyond the rows: the truck has two axles (twin rear tyres) instead of
three wheels, as the real medium truck does.

Same shot: the supplier building on the left, the Sanpou truck parked at its dock, the city behind in three
tiers, Tokyo Tower on the right, the sun top right, the road along the bottom. Every position, size and depth
plane in `research/scene01-checklist.json` stays. Everything below is redrawn from a blank page, to the level
of the approved Fuji: a confident silhouette, then structure, then working parts, under one light.

| Element | Today | Becomes |
|---|---|---|
| Sky and sun | a gradient, a disc half hidden behind a cloud | the same July blue; three broad shafts of light from the sun's corner; a clear sun that no cloud covers at the hold |
| Clouds | seven copies of one four-lobe cloud | a few large built cumulus, each composed differently, flat-based, one crisp shade shape away from the sun; two depth planes |
| Hill | one pale curve | two overlapping ridges, the nearer one a tone stronger |
| City, three tiers | one box with one window grid at every size | the Tokyo kit of the round 2 brief: glass towers with banded facades, concrete mid-rises with balcony rows, stepped towers, pencil buildings, low blocks with rooftop plant, sign frames, masts. Far tiers stay simple silhouettes; the variety is in the tier you can see |
| Tokyo Tower | a lattice drawn with strokes | the real structure, built as shapes: four legs and the arch, main deck, top deck, the banded mast, a lit and a shaded side |
| Utility poles and wires | a taper, two arms, five wires | a real pole: transformer, crossarms, insulators, a street light on some; fewer and bolder wires |
| Street | flat bands | kerb stones, a tactile strip, lane markings with a stop line and worn patches kept bold; street lamps and the vending pair redrawn |
| Supplier building | a box with a window grid | better architecture: what the owner liked in round 1 (the richer dock) taken further, with real cast shadows |
| Truck | the original drawing | a believable Japanese medium box truck redrawn; lettering, stripe and motion model exactly as they are; a faint exhaust at idle (owner's decision) |
| Parcels | a box with tape | a carton with flaps, tape and a label, redrawn |
| Foreground | a grey band with post caps | a guard rail that frames the bottom of the picture |

## Round 2, second pass: why the first pass still read as polish (2026-11-14)

The owner watched scene 01 round 2 and said: "I do see some changes but I dont see a significant
improvement to it, nothing like the professional looking animation that I saw from x post."

**The checkable cause.** `makeSkylineTier` and its cycle tables were byte-identical to the original in
round 2's first pass (verified by diff). Every background building therefore stood at the original's x,
with the original's width and the original's height. Only the texture *inside* each box was redrawn. The
city's silhouette - what the eye reads first, from across the room - never moved. Same failure as round 1,
one level up: round 1 froze each element's footprint, round 2 froze the layout. `STYLE.md` §0 is corrected.

**What the owner is also seeing.** The map (scene 04), the plane and airport (05), the warehouse (02) and
the expressway (03) are still the ORIGINAL drawings - nothing has been done to them yet.

| Element | What it became |
|---|---|
| Skyline layout | Composed again, not inherited: plot widths that differ by 3x (slivers beside slabs), heights over a far wider range, every seventh plot a landmark tower that breaks the tier's band, some gaps negative so neighbours overlap, three depths inside each tier |
| Every building | A volume, not a cut-out: the shaded left return is drawn as a real face receding toward the eye line, tapering with distance, with the coping running over front and return as one slab |
| Crowns | Eight kinds instead of one flat lid: parapet, double setback, chamfered corner, sloped slice, crowned mast, plant deck, water tanks, pitched roof |
| Tier values | The far tier given air and the near one weight, so the city has a front and a back instead of one pale wash |

Built as `samples/city-v2` (viewer side "City rebuilt"); `samples/city-v2/build.sh` rebuilds it from
`round2/js` + `round2/parts/city2.js`. 0 console errors over 22 moments and three framings, deterministic,
and it draws at **1.97 ms a frame against the original's 2.57 ms**.

## The owner's direction after seeing the rebuilt city (2026-11-14) — round 3

Verbatim, so nothing is lost in paraphrase:

> For the city background and the scene you built, the 2d (slightly 3d ish) is still fine, but I was
> expecting a more drastic change in its designs, with its buildings and other elements, including the
> airport / terminal, the plane, roads, and the trucks at the bottom as well.
>
> The redesign of the warehouse looks better, but it looks a bit old school (especially with the a bit too
> detailed elements on its roof, I know those are there and personally I like it but this is a animation for
> a logistics company, and we dont really want it to show those on it I think. I want it to make it look more
> modern looking warehouse, but the windows and the bottom docking section actually looks pretty solid, but I
> want to ask Fable to make it more neat / clean and modern but still with improved design choice. For the
> buildings as well, in the background, I want to make them a bit bigger / taller, same for the fuji mountain
> as well.
>
> Make sure in the animation, I want the lightings / reflections (subtle) from the windows from the buildings
> in the background is also added as well as a minor touch in it. For the truck, two wheels is fine for now,
> since fable asked if I wanted 3.
>
> (tokyo tower's legs at the bottom could be further improved I think, along with its general design, make
> sure all of the other elements including these are redesigned in full details and with better structure and
> also have very smooth scene transitions between each scenes.
>
> Tha map scnen too, dont use red as its base, use some other color that would be more appropriate to the
> flow of the animation scene, with the dots of the three company indicators changed to the mini warehouse
> illustration with appropriate animation when it pops up as well.

What this settles:

| | |
|---|---|
| The slightly-3d look | **Kept.** The oblique volume introduced in the city rebuild is the right language. What is not enough is how far the designs themselves travel. |
| Truck wheels | **Closed.** Two axles, twin rear tyres. Do not revisit. |
| Supplier building roof | The plant, tanks, condensers and ducts come **off**. Real, but they date the drawing and they are not what a logistics company shows. |
| Supplier building windows + dock | **Keep the arrangement** — the owner likes them. Draw them neater, cleaner and more modern. |
| Background buildings | **Bigger and taller**, and the designs themselves changed far more, not only their layout. |
| Mt Fuji | **Bigger and taller.** Its drawing was approved on 2026-11-14 and its colour is settled; only its scale changes. |
| Window light | Subtle lighting and reflections on the background buildings' windows, as a **minor** touch in motion — never a twinkle field. |
| Tokyo Tower | The legs at the bottom and the general structure redesigned in full. |
| Scene seams | **"Very smooth scene transitions between each scenes"** — the owner has now asked for the seams to be worked on, which answers the open question about whether they may be redesigned. |
| The map's base colour | **Not red.** A colour that fits the flow of the scene, which dissolves out of a blue sky and back into one. Vermilion stays a scarce accent at most. |
| The three base markers | **Not dots.** A mini warehouse illustration each, with a real pop-in. |

Still untouched and still the original drawings: the warehouse of scene 02, the expressway of scene 03, the
airport, terminal, plane, office block and road traffic of scene 05.

## Round 3: what each element becomes (written 2026-11-14, before anything is drawn)

The brief for this round is `PROMPT-FOR-FABLE.md`. Everything drawn so far is a floor: each element below is
drawn again and has to beat the version in `samples/before-round3` (viewer side "Round 2, frozen") on its
own, shown as three pictures: the original, the frozen round 2, and the new one. The owner approves each pass
on a style frame from the real scene code before any motion is built on it. Sizes marked **(owner picks)**
are shown as options on the frame and are not decided here.

**Why the last two attempts read as polish, and what changes in how I draw.** Round 2's buildings were boxes
with rectangles on them, lit weakly, in a pale sky: correct, and flat. This round is drawn like a lit
illustration instead of a diagram: a sky with value structure, three clearly separated depth planes, cast
shadows you can read from across the room, shapes built from several volumes rather than one box, and
something moving in every plane. Before a frame is shown, two checks have to pass: the named thing's outline
is visibly different from the original's (overlaid), and `diff-sides` shows the field it sits in was composed
again, not re-textured.

### Pass 1: the shared art (appears in four scenes, drawn once)

| Element | It becomes |
|---|---|
| Sky | One sky family for all five scenes: a deeper blue overhead, paling through the middle, and two or three broad flat bands of pale air low on the horizon, so the top third has depth and the horizon value no longer jumps at a seam. Measured for copy contrast under the wash before it is shown. |
| Sun | One component used by every scene, same size and finish everywhere: disc, lighter core, a warm bloom into the sky. A thin cloud can cross it. |
| Light shafts | Three or four wedges of clearly different width that really fan from the sun's position, present in every scene, with a cloud edge cutting across one so they sit in the air and not on top of the picture. |
| Clouds | Four species instead of one: a tall towering cumulus, the flat-based fair-weather cloud, a thin high streak, and small scraps. Composed overlaps on two depth planes, one speed per plane and the same wrap in every scene; the far plane passes behind the tall buildings. |
| Birds | Small filled silhouettes with a body and two wings, a flap-then-glide cycle on each bird's own phase, banking when they turn, one loose group and a single; never the same bird drawn twice. |
| Hills | The two soft curves go. One distant mountain range takes their place: a jagged far ridge and a lower, longer near ridge, the range Fuji stands behind in scenes 03 and 05. |
| Skyline layout | Composed again by hand in clusters (a knot of towers, a belt of mid-rises, gaps of low roofs), not on a repeating cycle, and taller: raised base and wider range. **How much taller (owner picks)**: today's trial and two steps up, on the frame. |
| The buildings | Nine real Tokyo types, each built from several volumes in the oblique view, each with its own window system: a curtain-wall tower with a rounded corner and cloud shapes reflected in the glass; an apartment slab with balcony rows, an open side corridor and a zigzag escape stair; a tower that steps back unevenly; a slim pencil building with a stack of blank blade signs and a blank party wall; a wide podium with a tower set back on it; a corner building with a chamfered face and ribbon windows wrapping it; a low block with tanks and a roof fence; a building topped by a blank billboard frame; and one under construction, half wrapped in mesh, with a tower crane. No invented shapes. |
| Window light | A thin moving layer over the near tier, outside the cached drawings: one slow sheen sliding down one glass tower, three to five single panes catching the sun, one or two warm panes changing slowly. Daylight on glass, never a twinkle field. |
| Haze and depth | The same two haze bands at the same strength in every scene, and depth carried mostly by value and scale: the far tier pale but readable, the near tier strong. |
| Roof beacons | The dark stubs come out. (Blinking roof lamps were rejected before as a night element.) |
| Tokyo Tower | Rebuilt around its legs: four of them, each a braced lattice you can see sky through, the far pair a tone down behind the near pair; the arch framed between the legs with thickness and a shaded side; a real base (the low building under the tower, splayed footings, a contact shadow); both decks; the whole height banded in orange and white; lit per face. A lift car riding between the ground and the main deck, and the beacon, live outside the cache. |
| Mt Fuji | The approved drawing, unchanged. **Its size (owner picks)**: approved size, today's trial, one step between; and in scene 05 the city is arranged so the mountain reads whole instead of in slivers. |

### Pass 2: scenes 01 and 02, the depot street

| Element | It becomes |
|---|---|
| Utility poles and wires | Drawn for their distance: one bold pole shape with a crossarm and a transformer that still read on a phone, two wires with different sag per span, a slow sway. Nothing spent where the supplier building hides them. |
| The street | A road that is used: lighter polished wheel tracks, joints, one manhole and one kerb grating drawn boldly, a stop line and a striped crossing seen in perspective, a dropped kerb at the dock. Clean and dark where the controls sit over it. |
| Street lamps | Irregular spacing, two heights, one carrying a pair of blank banners, each with a flat shadow on the paving. The same lamp design is used in scene 03. |
| Vending machines | Staged in the oblique view with a side and a top, at slightly different depths, the cans simplified to bold rows; something small beside them so the paving is not empty. Unbranded. |
| Supplier building | A modern logistics building with a new outline: clean flat roof with nothing on it, metal-panel walls in broad bands, a glazed office corner whose ribbon windows wrap the return face, a slim cantilevered canopy. The owner's window and dock arrangement stays, drawn lighter: thin frames, varied reflections, blinds with soft folds. The dock works: its shutter opens for the truck. |
| Yard props | Tied to the work instead of standing by: a short roller conveyor from the dock to the truck's tail carries the cartons (shown as an option against hand-off arcs), pallets stacked on purpose with their shadow, one ink rule for all of them. |
| The truck | A modern Japanese medium box truck with form: raked windscreen under a sun visor, rounded cab corners, a front overhang, mirrors on arms, a box with a roof deflector and side skirts. Two axles, twin rear tyres, lettering and stripe exactly as they are, plain dry box. |
| Trucks at the bays | Shown two ways on the frame, **(owner picks)**: three of the same truck, or a mixed fleet from our own range (a 軽 van, a 2 t, the 4 t, a large truck), all plain dry bodies. |
| Parcels | The carton stays; they are carried, enter the truck through its door instead of vanishing at an edge, and never pass in front of a cab. (Choreography is built in the motion pass.) |
| Foreground rail | Behaves like the nearest thing to the camera: heavier, with a break in it and uneven post spacing, and a sparrow that lands on it. |
| Vignette | Removed; the dark foreground and the deeper sky do its job. Shown with and without. |

### Pass 3: the Sanpou warehouse (scene 02)

| Element | It becomes |
|---|---|
| The building | A modern distribution centre: a long white volume with a return face and a real parapet, a navy base course, the vermilion fascia line, and a glazed office block at one end that rises above the roofline and gives it a silhouette. |
| The roof | Clean: the spikes and grey boxes go; the office block is the one deliberate element. |
| The name sign | 「Sanpou 物流センター」 on a raised sign band with standoffs and its own shadow. The lettering is not changed; the Archivo font question is raised with the owner at this frame. |
| The three bays | Real dock positions at the same places and sizes: a reveal, a door frame, black dock seals, a leveller plate, bumpers, guide posts, the bay number on a plate. |
| The shutters | Sectional doors that roll into a hood above each bay, with weight and a settle, each on its own timing. |
| Light in the bays | True to midday: the interior is cool shade with racking in silhouette, and the sun falls into each open bay as one flat shape on the floor. **Interior brightness and the forklift in bay 02 (owner picks).** |
| Ground shadow | One flat hard-edged shape, down-left, like everywhere else. |

### Pass 4: scene 03, the expressway

| Element | It becomes |
|---|---|
| The road | An expressway from the shared road palette: a near and a far lane of different value, edge lines and lane lines, joints, wear, a concrete barrier with its own lit top and shaded face. The invisible studs are deleted. |
| Light poles | The street lamp of scene 01, spaced without a hole. |
| The gantry | A real truss with front and back chords, diagonals, a walkway with a handrail, brackets, and a cast shadow on the road. |
| The signs | Same wording. Plates with thickness, a lit top edge and shaded underside, hung from the truss on frames, proper sign arrows. The vermilion bar comes off the exit sign. |
| Near gantry leg | Flanges, a base plate with bolts, a contact shadow; phase-locked to the far leg. |
| The convoy | Staged in two lanes at real depth, with one truck slowly overtaking in the same direction (no oncoming cars: those were rejected before), weight in the bodies, and the shot developing as the gantry, the signs and a cloud shadow pass. **Mixed fleet as chosen in pass 2.** |
| Jet cameo | **(owner picks)**: cut it here, or bring it properly into frame. |
| Foreground | The same dark rail family as scenes 01 and 02, so the frame's foot does not change value at the seam. |
| Hill band | Removed (it is not visible, and a repeating hill band in this scene was rejected before); the shared mountain range and Fuji are the middle ground. |

### Pass 5: scene 04, the coverage map

| Element | It becomes |
|---|---|
| Base colour | Not red. Two or three families shown on a frame, **(owner picks)**, all of them cool and belonging between two blue skies; vermilion only on the route line. |
| The map as an object | One land plate with a real edge and one flat contact shadow, lifted off the sky. |
| The rest of Japan | Drawn cool and quiet with curved coasts; only what is inside the frame is drawn. |
| Covered prefectures | Real shapes whose outlines draw themselves, crisp seams, full opacity. Same seven prefectures plus 新潟市方面. |
| The routes | A branching network instead of seven lines from one point: trunks leave 板橋 and split on the way out, so nothing knots at the hub. Each draws with a visible head, arrives in turn, and then flows; the Saitama route completes. |
| The three bases | Mini versions of the redrawn Sanpou warehouse, each standing in its real place (入間 in Saitama), arriving with weight and settling, then a name card sliding out. The crowded corner is solved first; one option is to open close on the three bases and then widen, **(owner decides, since it is a move inside the scene)**. |
| Labels | Part of the picture: prefecture names set on the land at one size, depot names on small attached cards, nothing black. |
| Masks and dead code | Both masks removed; the invisible stars, the shooting star, the unused ray loop and the empty group cleared in one careful pass. |

### Pass 6: scene 05, the finale

| Element | It becomes |
|---|---|
| Sun and back tier | Through the shared sun and the shared building kit; the fifteen flat boxes go. |
| Depth | Four planes separated by the shared haze bands and by value: mountain, far city, airport and near city, road. |
| The airport | An apron that sits in the world, a taxiway, stand markings, a few ground vehicles at work. |
| The terminal | A terminal with a pier and jet bridges, a roof structure, a canopy, drawn for the phone. No vermilion and no real operator's branding. |
| Control tower | Mass, a glazed cab with mullions and a reflection, a shaft with structure, lit from the right. |
| Runway | Drawn to agree with the side-on camera. |
| Windsock | Fills and flaps. |
| The airliner | A believable twin-engine airliner in a neutral livery of our own: tapered wing with winglet, engines on pylons, a real tail, gear that retracts, flaps and spoilers that move, smoke at the mains. The 19-second cycle stays. |
| Sanpou office block | Our building in the last shot: a volume with a return face, canopy, dock, depth under the parapet and a mounted sign. **What the sign says (owner picks).** |
| Road and little trucks | A taller road with lanes at real depth and markings that move with the traffic; the little trucks are the two-axle family of scenes 01 to 03 and never slide through each other. |
| The hold | Keeps developing for its fifteen seconds: the plane's cycle, cloud shadows crossing the city, traffic, the Tower's lift, the window light, a flock, the shafts drifting. |

### Pass 7: the seams and the motion pass

| Seam | It becomes |
|---|---|
| 01 into 02 | The same pan with a bell shape and a long landing; near things lead, far things lag, and the picture settles after it stops. |
| 02 into 03 | One move: the camera leaves with the departing trucks, the cut sits at the fastest frame, and the expressway is already running when it lands. |
| 03 into 04 | No frozen frame: the expressway keeps running as the picture lifts into the sky both scenes share, and the map arrives in that sky. |
| 04 into 05 | The map sinks toward 板橋 while the city rises in layers, far first, near last. |
| Inside every scene | Arrivals with long landings, weight on anything heavy, and its own slow phase for every ambient thing. The durations and the camera path are not changed without asking. |

### Pass 8: the last look

All five scenes on one sheet for colour drift; dead code removed in one deliberate pass; the leftover
mismatches fixed. Full verification and one commit.

### Owner's additions during pass 1 (2026-11-14)

- **Supplier building roof gear: removed now** (water tank, both condensers, stair head, handrail, vent), before
  pass 1 is shown, because it was the first thing the eye landed on (`round2/parts/r3-supplier-roof.js`).
- **Supplier building redraw pulled forward into pass 1**, in the owner's words: "more modern and attractive in
  its design, not like a super high tech, but a modern general looking warehouse look, and make it a bit bigger
  in size of its building". (He calls the scene 01 supplier building "the warehouse".) Bigger means about 12 to
  15 percent, grown to the left and up so the dock and the truck stay where they are.
- **The three depot buildings on the map**: polished now too, and sized as they pop up so they never overlap
  each other. The rest of the map still waits for pass 5.
- **Every frame shown carries one line saying which elements are new and which are still old.**

### Pass 1 as drawn (2026-11-14): shown to the owner, waiting for the verdict and two size picks

In `round2/js` (parts `r3-sky`, `r3-tower`, `r3-supplier-roof`, `r3-city`, `r3-supplier`, `r3-sky-fix`, `r3-depots`,
applied in that order). Evidence in `evidence/2026-11-14-r3-pass1/`: `three-way-scene01/02/03/05.jpg` (original,
frozen round 2, new), `options-city-height.jpg`, `options-fuji-size.jpg`, `depots/`, and one folder per part.

- **New in this pass:** the sky family, the sun, the light shafts, four cloud species on two planes, the birds,
  the mountain range; the city (nine Tokyo building types, hand-composed skylines for scenes 01/02, 03 and 05,
  the finale's back row through the kit, two haze bands everywhere, the window light, the crane); Tokyo Tower;
  the supplier building (modern, about 12 percent wider and its office corner 15 percent taller, roof clean);
  the three map depots and how they arrive.
- **Still old in these frames:** the truck, parcels, street, lamps, poles, vending machines and foreground rail
  (round 2); the Sanpou warehouse, the expressway and its gantry and signs, the airport, terminal, plane,
  office block, the finale's road and little trucks (original drawings); the map apart from its depots
  (round 2's teal map); Mt Fuji's drawing (approved, unchanged).
- **Owner picks, on the option sheets:** how tall the city stands (`SKYLINE_SIZE`: A = 1 / 1 as drawn,
  B = 1.12 / 1.15, C = 1.25 / 1.3) and how big Fuji is (1 = the size it was approved at, 2 = the trial about a
  fifth bigger, which is what the frames show, 3 = a step bigger again). `tools/size-options.py` rebuilds them.
- **Checked on the working copy:** `original/` intact; 0 console errors over 22 moments and three framings;
  draw 1.69 ms a frame against frozen round 2's 1.74 in the same run; no frozen steps and no pops in scenes
  01, 03 and 05; copy contrast: headline 9.0, sub-copy 9.9, caption lead 5.1 (all pass AA). The unfilled
  progress track measures about 1:1 where it crosses pale sky, on the original too; it is the site's own
  chrome and is carried as an open item.
- **Known, to settle in a later pass:** the city's cast shadows are see-through navy overlays, which breaks the
  one-step shadow rule on paper (convert to solid tones in the last look); the canvas engine has not been run
  on the new parts; scene 04's sky holds the finale's sun and clouds still (motion pass); scene 02 shows two
  cranes.

## The owner's verdict on pass 1 (2026-11-14): five changes

His message, in full:

> Five changes. Read the new "Warehouse operation references" section at the end of REFERENCES.md first.
>
> 1. BACK TO FLAT 2D. The background buildings look tilted, leaning right. Two things cause it: the top edges
> slope down to the right instead of being level, and each building carries a thin second face down one side.
> Take both off. Every building goes back to a straight-on flat elevation — level top edges, one face, no
> receding side, nothing skewed. Keep everything else you drew: the nine building types, the recomposed
> skyline, the crowns, the window light, the separation between near and far tiers. Depth comes from overlap,
> from value and scale, and from the haze — not from a fake side face. Do the same everywhere else it crept
> in, so the whole film shares one projection: the supplier building, the map depots, anything carrying an
> oblique. This reverses what I said earlier about the slightly-3d look; I've now seen it across a whole
> skyline and I don't want it.
>
> 2. THE CLOUDS SIT TOO LOW. In scene 05 a big cloud hangs with its base below the rooftops, so it reads as a
> cloud parked in the middle of the city, and small ones sit down behind the skyline. Keep clouds in the sky —
> no cloud base below the roofline of the tier it is in front of. And the two clouds inside the glass tower
> read as clouds stuck in the building, not as a reflection: make them read as glass — faint, in the pane's
> own tone family, skewed and clipped to the facade — or take them out.
>
> 3. THE PLANE. It has not changed, and it is the third time I have noticed. Move the airport, the terminal
> and the plane up the order: do them straight after the warehouse, before the expressway.
>
> 4. THE WAREHOUSE. Bigger again. I want trucks standing at the docking and loading area, packages loading
> into each truck with smooth animation, and a forklift working somewhere sensible. Six reference
> illustrations are now in reference/warehouse-ops/ with notes in REFERENCES.md. They are a reference point
> for the feel of a working depot — do not copy them, make an original version that is ours. Mind what the
> notes say: most of them are isometric and we are going flat, they are full of people and we have none in
> this film, and their palettes are not ours.
>
> Be explicit about which building you are doing. I mean the Sanpou warehouse with the three bays in scene 02,
> which has never been redrawn — and I want the same working feel at the supplier building's dock in scene 01.
> Say in one line which you are starting with before you start.
>
> 5. MY PICKS. I will choose the city height and the Fuji size once I have seen it flat — the tilt changes how
> the whole thing reads. Re-show me pass 1 after the flattening, with the size options, and the line on each
> picture saying what is new and what is still old.

What this changes in the plan above:

| Was | Is now |
|---|---|
| "The slightly-3d look: kept" (and every row that says volume, a return face, a side and a top, the oblique view) | **Flat 2D.** One straight-on elevation per object: level top edges, one face, no side face, no band down a side, no roof seen from above, no diagonal cast shadow that implies a side. Depth from overlap, value, scale, haze. Applies to the city, Tokyo Tower, the supplier building, the map depots, and everything still to come (vending machines, the Sanpou warehouse, the office block, the airport). |
| Clouds: "the far plane passes behind the tall buildings", "a tower of cumulus standing behind the skyline" | **Clouds stay in the sky.** Every cloud's base clears the roofline beneath it in every scene and at every size option; nothing sits down behind the skyline. |
| Glass tower: "cloud shapes reflected in the glass" | Glass reads as glass: flat tone bands and sheens clipped to the facade, no cloud that reads as an object inside the building. |
| Order: shared art → scenes 01-02 → warehouse → scene 03 → 04 → 05 → seams and motion → last look | Shared art re-shown flat → **the Sanpou warehouse (scene 02)**, then the same working feel at the supplier's dock (scene 01) → **the airport, the terminal and the plane** → the rest of scenes 01-02 → scene 03 → scene 04 → the rest of scene 05 → seams and motion → last look. |
| Sanpou warehouse: three bays "at the same places and sizes"; "interior brightness and the forklift in bay 02 (owner picks)" | **Bigger.** Trucks standing at the docks, packages loading into each truck with smooth animation (built with the drawing, not left to the motion pass), a forklift at work. A working depot with no people in frame. |
| City height and Fuji size: picked on the oblique frames | Picked on the flat frames. |

## Pass 1 re-shown flat (2026-11-14): waiting for the owner's verdict and two size picks

Changes 1, 2 and 5 of the verdict above are done in `round2/js` (parts `r3-flat-city`, `r3-flat-supplier`,
`r3-flat-tower`, `r3-flat-depots`, `r3-flat-parcel`, `r3-clouds-up`, applied in that order). Evidence:
`evidence/2026-11-14-r3-flat/` (`three-way-scene01/02/03/05.jpg`, `three-way-map.jpg`, each with its
new-versus-old line printed on the new panel; `options-city-height.jpg`, `options-fuji-size.jpg`;
`site-desktop.jpg`, `site-phone.jpg`; `city/` with `types-1-9.jpg`; `cast/` with the depot overlap check).

**What became flat.**
- **The city**: all nine types are straight-on elevations with level tops and one face (glass tower, apartment
  slab with balconies or the zigzag stair, stepped tower, pencil building with blade signs, podium and tower,
  ribbon-window building, low block with roof gear, billboard building, building site with crane). The same
  composed skylines, order and heights; each front widened into the space its side face used to fill. No lit
  edge strip, no diagonal shadows from one building onto the next (so the see-through shadow overlays noted
  after pass 1 are gone). Depth is by overlap, value (nearest row pushed toward navy, back rows paler) and haze.
- **Glass towers**: the cloud shapes are out; glass reads through a sky band across the top and two diagonal
  sheens one step lighter than the glass.
- **Tokyo Tower**: one symmetric lattice, flat decks, a truss arch, the same height; its base is narrower
  (about 234 px against 292 in scene 01) because the far pair of legs no longer shows beside the near pair.
- **The supplier building**: two straight-on rectangles (slate office part, pale dock hall), same footprint
  (x 174 to 926, top y 394), dock unmoved; the front face grew from 692 to 752 px.
- **The map depots**: flat white fronts, same resting sizes, same arrival; 0 overlaps (stage, every 10 ms of
  the arrival, and phone).
- **The carton**: the shaded strip down its left side is gone.

**The clouds.** Recomposed in every scene: the cumulus that stood behind the skyline is gone; each scene has
one tall cloud high in a gap between the towers, fair-weather clouds, streaks and scraps, all above the roofs.
`node tools/cloud-check.mjs round2 --skip=7417-9139` measures every cloud's underside against every roof under
it (city buildings, the supplier building, the warehouse) at every sampled moment of scenes 01, 02, 03 and 05:
**0 clouds below a roof**. The pan between scenes 01 and 02 is left out of the measurement (the city slides
past the sky there). Clouds may still pass behind Mt Fuji and Tokyo Tower.

**Size options** (`python tools/size-options.py`, then `tools/cloud-check.mjs --fit` and `tools/cloud-lift.py`
on each taller-city option so its clouds clear the taller roofs too): city A as drawn / B a step taller /
C two steps taller; Fuji 1 the approved size / 2 about a fifth bigger (what the frames show) / 3 a step bigger
again. In B and C the lifted clouds crowd the sun or leave the top of the frame; whichever the owner picks gets
its clouds composed by hand.

**Checks on `round2`.** `original/` intact; 0 console errors; draw (original / round2) 2.40 / 1.97 ms full,
2.56 / 2.21 desktop, 2.25 / 2.04 phone; no frozen steps and no pops in scenes 01, 03 and 05 (scene 04 keeps the
site's own two held frames and the step at its end, as before); all copy passes contrast; the unfilled progress
track still fails (about 1:1) as it does on the original.

**Still open:** the canvas engine has not been run on the new parts; scene 04's sky holds the finale's sun and
clouds still (motion pass); the building site's mesh is a large pale slab in scene 05; the glass sheen travels
only about 100 px where a front-row building stands before the tower.

## The owner's size picks (2026-11-14): city B, Fuji 2

His answer to the flat re-show was "City B, Fuji 2", with no changes asked for. In `round2/js`:
`SKYLINE_SIZE = { base: 1.12, amp: 1.15 }` (part `r3-size-pick`); Fuji stays at the size the frames showed
(scene 03 `w: 1480, ht: 596`, scene 05 `w: 2020, ht: 706`). The clouds were then composed by hand for the
taller city (part `r3-clouds-b`): in scenes 01 and 02 the towers now reach y 121 to 126, so the tall cloud
stands over the low roofs left of them, the long streak passes behind the top-left cloud, the thin streak
crosses the lower half of the sun, and scene 02 keeps one small cloud by Tokyo Tower; in scene 05 the tall
cloud stands 45 px higher and the cloud on the right drifts in from the edge. Checks on `round2`: 0 clouds
below a roof in scenes 01, 02, 03, 05; 0 console errors; draw (original / round2) 1.88 / 1.52 ms full,
1.76 / 1.49 desktop, 1.79 / 1.62 phone; no frozen steps and no pops in scenes 01, 03, 05; copy contrast
passes. Pictures: `evidence/2026-11-14-r3-flat/picked-scene01/03/05.jpg`. The sizes are closed.

## The Sanpou warehouse of scene 02 (2026-11-14): drawn, merged, shown, waiting for the owner's verdict

Change 4 of the verdict above, first half: the three-bay Sanpou warehouse, never redrawn before. In `round2/js`
(parts `r3-warehouse`, then `r3-clouds-b2`). Evidence: `evidence/2026-11-14-r3-warehouse/`
(`three-way-scene02-loading.jpg`, `three-way-scene02-hold.jpg`, `loading-in-six-stills.jpg`, the loading
strips, `forklift-loop.jpg`, a desktop and a phone still, a crop of dock 03).

- **The building, bigger and flat.** It was x 80 to 1448 with its roof at y 477. It now starts at x 42 and
  runs off the right edge of the frame: a white insulated-panel hall to x 1288 (parapet y 439, navy base
  course, the one vermilion fascia line, a slim canopy over the docks), a glazed office block at x 1288 to
  1623 rising to y 300, and a low open wing beyond it. The name sign is the same two text nodes on a raised
  navy band; bay plates 01, 02, 03.
- **Three docks with room to work.** Doors 141 x 213 px at x 80, 604 and 1117; truck rears at 236, 760, 1273
  and noses at 594, 1107, 1620, so every door is clear of its neighbour's cab (before, each cab covered most
  of the next bay). Constants changed: `WAREHOUSE_W` 720 to 1020, `WAREHOUSE_BAYS` to [0, 276, 546], `BAY_W`
  100 to 74, `BAY_Y` to -112; `Warehouse()` takes `time: skyTime`. `T_WORLD`, the camera, the truck drawing,
  `B_SCALE`, `T_SCALE` and `WAREHOUSE_X` are untouched, so the trucks stand a little further apart than on the
  site (the third by about 76 px less far right, the first about 200 px further left).
- **Inside**: cool shade, racking in silhouette with stock on it, the sun on the floor.
- **Loading**: a roller conveyor in each dock at the truck's floor height. Four cartons, 62 px apart, ride
  at 5.4 px a frame into each truck from frames 320 / 327 / 335 and are all in by 379 (inside the old
  `loadParcels` window of 308 to 388); a fifth stops on the conveyor. Eased over 10 frames, cut at the truck's
  rear plane. No hops.
- **The forklift**: white with a dark-glass cab (no operator to see or miss), in the open wing right of
  truck 3, on a 14 s loop from the continuous sky clock, so it keeps working through the 1.9 s hold: it puts a
  pallet on the rack, and on its next visit takes it down.
- The small cloud that stood by Tokyo Tower in scene 02 was removed (behind the deck it read as a cloud stuck
  on the tower).

**Checks on `round2`.** `original/` intact; 0 console errors; draw (original / round2) 1.74 / 1.42 ms full,
1.77 / 1.42 desktop, 1.71 / 1.60 phone, and against frozen round 2 1.59 / 1.45, 1.64 / 1.47, 1.63 / 1.39;
scene 02 has 0 frozen steps and the one step at 14600 ms that the scene change always had; 0 pops while the
trucks leave; scene 01 is pixel-identical to before; copy contrast passes (the unfilled progress track fails
as on the original); clouds: 0 below a roof in scenes 01, 02, 03, 05, the warehouse and the supplier building
now measured by their real outline (`tools/cloud-check.mjs`).

**Known, for the owner to decide or for a later pass:** on a 390 px phone the crop shows dock 03 being loaded
but never reaches the forklift (it stands in the right-hand wing); the departing trucks pass in front of the
wing and hide the forklift as they go; an open truck door covers the right fifth of each doorway. The trucks
are still round 2's drawing, the street, lamps and rail too. The supplier building's dock in scene 01 (the
same working feel, using this conveyor, pallets and forklift) is the next thing, then the airport, the
terminal and the plane.


## Every piece of lettering in the film, checked (2026-11-14)

The owner, on seeing the new warehouse: "the sanpou name should be in jp using the correct characters.
Check on other elements and scenes as well." Every string in `round2/js/hero-port-b.js` that reaches the
screen was listed and read against the company facts in `CONTEXT.md` and against the live site.

**The characters.** 三豊運輸 — confirmed: `CONTEXT.md` (有限会社三豊運輸, never 株式会社) and 143 occurrences
on the live site, with no variant spelling anywhere.

| Where | Scene | Said | Verdict |
|---|---|---|---|
| Warehouse fascia | 02 | `Sanpou` (latin 27) ｜ `物流センター` | **wrong** — the company's own building named in roman letters only |
| Truck box side | 01, 02, 03 | `Sanpou` (latin 12.5) over `三豊運輸` (jp 7.5) | both present, but the roman name is the big one; on a phone it is the only name on screen |
| Finale depot | 05 | nothing | the vermilion fascia says Sanpou, no name on it |
| Scene 04 brand card | 04 | `三豊運輸` (54) over `SANPOU UNYU　SINCE 1975` | right way round |
| Dock bay numbers | 02 | `01 02 03` | fine |
| Expressway signs | 03 | `関越自動車道 / KAN-ETSU EXPWY`, `新潟 / Niigata`, `前橋 / Maebashi`, `板橋 出口 / ITABASHI EXIT` | right: real Japanese road signs carry both |
| Map labels, base cards, legend | 04 | 新潟 群馬 栃木 茨城 埼玉 東京 千葉 神奈川, 本社（板橋）志木営業所 入間営業所 | right |
| Finale panels and tagline | 05 | 主要拠点, 物流拠点, 対応都県, 大切な荷物を、きょうも確実に。 | right |

**The sign, fixed.** `round2/parts/r3-sign-jp.js` — one block, the two `text.push` lines of the fascia.
It now reads 「三豊運輸　物流センター」: `CONTENT.brand.nameJp` in `FONTS.jp` at 26 px with 1.5 letter
spacing, so four kanji sit between y -176.5 and -202.5 inside the band at -169..-209 and end 27 units before
the rule at x 171. Built as side `trial`: 0 console errors, draw 1.49 ms against 1.75. Not spliced into
`round2/js` — the Fable session has that file. Evidence: `evidence/2026-11-14-lettering/`.

**Two things found while reading, for the owner.**

1. **「関東一円」 is in the film twice**, and `CONTEXT.md` says never to use it (the company covers
   関東1都6県 and 新潟市方面, areas and never 関東一円). One of the two is on screen: scene 03's caption
   「関東一円から新潟へ、毎日定時で。」 (line 3447). The other, `CONTENT.brand.commitBody` (line 220), is
   defined and never drawn. On the live site the wording appears only inside this animation file — the rest
   of the site says 1都6県 in 27 places. Copy is not changed without the owner, so it is left as it is.
2. **The truck lettering.** The roman name is the big one and 三豊運輸 the small one under it. On a 390 px
   phone the warehouse sign is outside the crop, so the truck is the only place the name is read at all.


## The owner's verdict on the warehouse (2026-11-14): right, go on; the sign in Japanese is in

"The warehouse is right — go on to the supplier building's dock in scene 01." The Sanpou warehouse of scene 02
is approved.

- **The sign.** `round2/parts/r3-sign-jp.js` is spliced into `round2/js` (one block, the two `text.push`
  lines of the fascia): it reads 「三豊運輸　物流センター」. Checked on `round2`: 0 console errors; draw
  (original / round2) 1.97 / 1.46 ms full, 1.90 / 1.43 desktop, 1.73 / 1.55 phone. Picture:
  `evidence/2026-11-14-lettering/sign-in-round2.png`.
- **Two jobs for later, each when its element is redrawn** (the owner's words, in short):
  1. **The trucks** (next after the supplier dock): 三豊運輸 becomes the big line on the box side and the
     roman SANPOU the small one under it, the way the scene 04 card does it. On a 390 px phone the warehouse
     sign is outside the crop, so the truck is the only place the name is read at all. This replaces the old
     rule "truck lettering exactly as it is"; the words themselves do not change.
  2. **The Sanpou depot in the finale** (with the rest of scene 05): it carries the vermilion fascia line but
     no name; put 三豊運輸 on it, sized so it is legible on a phone.
- **All other copy is left alone.** Scene 03's caption uses 関東一円, which contradicts the company facts, but
  copy is the owner's call and he has not decided yet.


## The supplier building's dock of scene 01 (2026-11-15): drawn, merged, shown, waiting for the owner's verdict

Change 4 of the pass 1 verdict, second half: "the same working feel at the supplier building's dock in
scene 01". In `round2/js` (parts `r3-supplier-dock`, then `r3-supplier-dock-fix`). Evidence:
`evidence/2026-11-14-r3-supplier-dock/` (`three-way-scene01-loading.jpg`, `three-way-scene01-hold.jpg`,
`loading-strip.jpg`, `forklift-loop.jpg`, `crop-dock-2x.png`, `arrival-and-departure.png`, full and phone
stills).

- **Only the dock zone changed.** The building's outline, office part, windows, staff door and footprint are
  as they were; scene 01 differs from before only inside stage x 652 to 959, y 701 to 881.
- **An open dock.** The door is open to the ground (screen x 668 to 865, head y 701); the shutter is rolled
  up from the first frame and does not move. Inside: cool shade, racking with stock at the back, a working
  rack at the right of the door. The raised sill, the cartons that stood on it and the right-hand guide post
  are gone.
- **Loading.** A roller conveyor from the door to the truck (screen x 668 to 951, rollers at y 864, a plate
  on to the truck's rear at 960). Six cartons: three wait in the door (drawn under the truck, which drives
  in over them); the line starts at frame 68, runs at 4.8 px a frame, five cross the truck's rear plane at
  frames 96 to 159 (inside `T_WORLD.parcels`, door open, before it closes) and the line is at rest by frame
  171; the sixth stops in the door for the next load. No hops: `parcelPose` and `Parcel` are removed.
- **The forklift** is the supplier's own: the warehouse's drawing in the supplier's blue-greys with a yellow
  band and a dark-glass cab (no operator), at 0.86 of the building's units so it reads as inside, cut to the
  door opening. A round of 24.2 s on the continuous sky clock: it comes in with a pallet as the scene opens,
  lifts it while the truck is loaded, sets it on the rack and backs off while the scene holds, leaves; on
  its next visit it takes the pallet down again, so the loop closes with nothing popping.
- **Constants.** `T_WORLD` and `TRUCK_PARK_1` untouched. Removed: `SUPPLIER_DOCK`, `parcelPose`, `Parcel`.
  New: `supplierArt`, `supForkPose`, `SupplierCartons(frame)`, `supplierJambX`, `SUP_FORK = 0.86`,
  `SUP_ROUND = 24.2`, `DAY.supIn*` and `DAY.supFk*`, clip paths `wSupDoor` and `wSupLine`;
  `SupplierBuilding()` takes `time: skyTime`; `clipT1` is now the window over the truck's open rear door.
- **Found on review and fixed** (`r3-supplier-dock-fix`): that window followed the truck as it pulled away,
  so the cartons already loaded showed in mid-air behind it during the pan to scene 02. It now ends where
  the truck's rear stands while parked and closes as the truck leaves (`arrival-and-departure.png`).

**Checks on `round2`.** `original/` intact; 0 console errors; draw (original / round2) 2.79 / 2.11 ms full,
2.69 / 2.17 desktop, 2.47 / 2.19 phone, and against frozen round 2 2.27 / 2.15, 2.47 / 2.27, 2.35 / 2.24
(the machine measured slower all round today; the ratio is as before); scene 01 (0 to 7000 ms) 0 frozen
steps, 0 pops; the departure and pan (7000 to 9400 ms) 0 frozen steps, 0 pops; scene 02 pixel-identical at
9200, 11000, 11800, 13500 and 14400 ms; copy contrast passes (the unfilled progress track fails as on the
original); clouds: 0 below a roof.

**Known, for the owner to decide or for a later pass:** the shutter is already up when the film opens (it
could roll up as the truck pulls in); on a 390 px phone the crop drifts right during the scene, so by the
hold the left part of the door is cut off (the forklift's set-down on the rack is timed to the part still in
view); the cartons on the line hide the forklift's lower body while loading; the conveyor's end stands
34 px past the building's corner to reach the truck; in the first 0.17 s nothing moves in the dock itself.
The truck, street, lamps, vending machines and rail are still round 2's drawings.

**Order to confirm with the owner:** his note of 2026-11-14 says the trucks are next after the supplier
dock; the order he set earlier puts the airport, the terminal and the plane there.


## The batch of 2026-11-15, element 4: the truck of scenes 01, 02 and 03, redrawn

Part `r4-truck` (one block, the whole truck) is in `round2/js`. Evidence: `evidence/2026-11-15-trucks/`
(`truck-old-new-2x.jpg`, `truck-door-open-2x.png`, full, desktop and phone stills, the two departure strips).

- **The vehicle.** A flat side-on cab-over dry van, drawn from a blank page: a white box with a rounded
  front top corner, panel rails, corner posts and one vermilion stripe; a lower navy cab with a raked
  windscreen, a visor, a mirror on its stays, a stacked lamp, a step and a chamfered bumper; a battery box,
  tank and side guard on the chassis; a level contact shadow (the diagonal ground shadow is gone). No roof
  deflector, so nothing stands in front of the box's front wall; no badge, no plate, no people.
- **The lettering (the owner's decision of 2026-11-14).** 三豊運輸 is the big line: 19 local units, 38 stage
  px at scale 2, about 27 px on a 390 px phone. SANPOU is the small line under it: 7 units, 14 stage px,
  letter spacing 3.6. The words are the same; only their order of size changed.
- **Kept.** `Truck(p)`'s interface, `truckMotion`, the rear plane at local x 0, the floor height, the length
  (the bumper still ends at 177.6), the door leaf (24 units), the exhaust wisps, every timing.
  `TRUCK_WHEELS` is `[50, 148]` (was `[50, 150]`), radius 11.
- **Secondary motion.** The cab nods 0.45 x `pitch` about its front; the mud flaps trail `run` x 6 degrees.
- **Colours.** Cab `#28395a` (lit `#46608f`, shade `#1c2a45`), bumper `#8a9bb5` / `#bcc8d9`; new
  `truckBumperShade`, `truckBoxSeam`, `truckSeam`; `truckStripe2` removed (one stripe now).

**Checks on `round2`.** `original/` intact; 0 console errors; draw (original / round2) 2.64 / 1.94 ms full,
2.36 / 1.97 desktop, 2.38 / 2.10 phone; against the old truck in the same sitting 1.96 / 1.57 ms and
2.04 / 1.71 with the sides swapped (no slower; 24 fewer nodes a truck); 0 frozen steps in scenes 01 to 03;
one step at 14600 ms (the scene clock stepping back at the 02 to 03 seam, 1.16 against 1.04 before); scenes
04 and 05 pixel-identical; copy contrast passes (the unfilled track fails as on the original).

**Known.** On a 390 px phone scene 02's crop cuts the name on both trucks in view (豊運輸 on one, 三豊 on
the next): that is where the trucks stand, which is closed. The three trucks at the docks are still three
of the same truck (the mixed-fleet question is still open with the owner). The finale's small road trucks
and the map's route trucks are separate drawings, done with their scenes.


## The batch of 2026-11-15, element 1: the clouds, redrawn in every scene

The owner: "the model of the clouds on other scenes looks a bit odd, idk doesnt look that natural /
professionally designed or fits the animation scenes overall." Part `r4-clouds` (two blocks: the species
and the three composed skies) is in `round2/js`. Evidence: `evidence/2026-11-15-clouds/`
(`species-old-new.jpg`, `scenes-old-new.jpg`, full, desktop and phone stills of scenes 01, 02, 03, 05).

- **What a cloud is now.** One silhouette, two paths (the white and one shade area), 2.7 to 3.0 times
  wider than tall, the mass low, the dome off-centre, the far side stepping down and trailing away; its own
  slightly uneven base. The pile of discs, the crescent on every lobe and the pill under the lobes are gone.
- **The seven species.** 0 large cumulus (a broad dome left of centre, a knuckle, a lower second dome
  trailing right); 1 fair-weather (a long low lobe left, a dome right of centre); 2 small humped (a dome
  left, three steps down right); 3 and 4 the high streaks, the same construction pressed flat into a long
  pale bank (3 with a wisp above it); 5 and 6 scraps of three or four low lobes.
- **Shade.** One area along the base with a softly swelling top edge, deep on the left (away from the sun)
  and gone at the right end: `#d1e4f6` near, `#d4e6f6` far (far white `#f3f8fd`), cooler and much closer
  to white than the old `#b9caef`.
- **The skies, composed again.** 01: the large cumulus upper left, a fair-weather cloud lower right of it,
  a scrap by Tokyo Tower, a streak across the sun. 02: the same fair-weather cloud at the left edge, a
  scrap, the sun streak; the middle left empty. 03: the large cumulus low right of Mt Fuji, a fair-weather
  cloud behind Fuji's left shoulder, a small one near the sun, a bank behind Fuji. 05: the large one upper
  left, a fair-weather cloud between Fuji and the Tower, a bank behind Fuji, the sun streak, a scrap.
- **Kept.** Seven species, two depth planes, the wind speeds, the wrap and the edge fades, the list format,
  the `cloud3-` cache names and `data-sky` tags the cloud check reads.

**Checks on `round2`.** `original/` intact; 0 clouds below a roof in scenes 01, 02, 03, 05; 0 console
errors; draw (original / round2) 2.44 / 2.13 ms full, 2.96 / 2.10 desktop, 2.53 / 2.27 phone; scene 01
0 frozen steps, 0 pops; scene 05's first six seconds 0 frozen steps and the one step at 28700 ms that was
there before (0.889 against 0.891); every copy row passes contrast.

**Known.** On desktop the mid-sky cumulus of scenes 03 and 05 sits behind the right end of the headline
(under the pale wash). Scene 02's sky is sparse in the middle: a cumulus there would cover the sun in
scene 01, which shares the list. The streaks now read as flat banks rather than wisps. The canvas engine
was not run. Scene 05's roofs are being recomposed with the plane's corridor, so its cloud check is run
again with that pass.


## The batch of 2026-11-15, element 2: the map's look (scene 04) — background, colours, what moves

The owner: "I want to have somekind of a cool moving elements behind the map scene / background that is
fitting to the animation (with the context of being a logistics company). I want Fable to come up with its
style, what it would be, and the coloring of the background and the map itself as well."
Part `r4-map-look` (eight blocks) is in `round2/js`; it applies on its own and replaces what the floor parts
`map-nosky`, `map-flat-plate`, `map-col-*` and `map-bg-*` did (those are not spliced). Evidence:
`evidence/2026-11-15-map-look/`.

**Four directions were built as option frames and judged at the desktop and phone crops**
(`options-desktop.jpg`, `options-phone.jpg`; parts `r4-map-opt-*.js` are kept for the review):

1. **Open water, white area — picked.** The only one that keeps the film's blue and white while giving the
   map real ground.
2. Open water, navy area: holds best under the site's pale wash, but turns near-black under the bottom band,
   the darkest thing in the film.
3. Working line (a pale panel with conveyors of cartons on the right): reads as decoration, and a phone sees
   none of it.
4. Open water with a freighter: rejected, a ship implies a service the company does not sell.

**What scene 04 is now.**
- **The panel is the sea**, in the film's own blue (`#5fabe4`), so the film never leaves its colour between
  the expressway, the map and the finale. No sky, sun, shafts or clouds in scene 04.
- **The service area is Sanpou white** (`#ffffff` running to `#d6e5f7`), the brightest thing on the panel,
  with crisp seams (`#6f97cc`); the rest of Japan is a quiet blue-grey (`#a9bbdb`, seams `#98acd1`); names
  `#2f4d78`; the depots' name cards are navy signs (`#1f3b66`). Vermilion is still the route's alone.
- **All of Japan inside the frame is drawn** from the existing map data, so every edge is real coast and
  the left of the panel is land, not a fade. The map's old CSS mask is gone, and so is the plate's edge
  copy (flat 2D).
- **What moves: the water.** A band of shallow water (`#b7d9f3`, a 39 px apron off the coast from Ibaraki
  round to Kanagawa) leaves the coast and travels outward, growing 1.95 times about the head office and
  fading into the sea. Three copies, one leaving every 3.78 s, each living 11.3 s, about 24 px a second.
  Only transform and opacity change; nothing moves on the left, under the copy.
- The prefecture shapes, the wipe, the depots, the routes and every timing are untouched.

**Checks on `round2`.** `original/` intact; 0 console errors; draw (original / round2) 2.52 / 2.42 ms full,
2.59 / 2.31 desktop, 2.39 / 2.36 phone; phone frame rate with the CPU slowed four times 75 fps against 78
before. The hold of scene 04: 0 frozen steps from 21850 ms (before, it froze); the two steps at 21800 to
21833 are the player's dissolve lead, as before; nine steps flagged as pops are one 8-bit level across a
fading band (0.087 to 0.105), not visible. Into the map 0 pops; out of it the one step at 28700 ms that was
there before. Every copy row passes contrast (the unfilled track fails as on the original). Scenes 01, 02,
03 and 05 pixel-identical.

**Known.** A phone sees the water only as a thin strip at its right edge (the map fills the phone). Niigata's
coast has no moving water (it is under the copy on desktop). The map's layers carry `will-change`; Safari is
untested. The routes are still the connected lines: the dashed routes and the small trucks are the next
pass.


## The batch of 2026-11-15, element 5a: the airliner of scene 05, its flight, and the sky it flies in

The owner has raised the plane three times; at 38 s it flew into the side of a tower. Part `r4-plane`
(four blocks: `cityFinale`, `JetPlane`, `AirportPlane`, and a back slot before Tokyo Tower) is in `round2/js`.
Evidence: `evidence/2026-11-15-plane/` (`plane-old-new-2x.jpg`, `plane-gear-flaps.jpg`,
`skyline-old-new.jpg` with the climb line drawn on it, `cycle-strip-desktop.jpg`, `cycle-strip-phone.jpg`,
stills).

- **The airliner.** A 224 px twin-jet (was 180) in flat side elevation: nose and tail cone, cockpit glazing,
  eleven cabin windows, two doors, a tapered wing with a winglet and flap-track fairings, flaps that slide
  and spoilers that stand, an engine on a pylon, fin and tailplane, a nose leg that swings forward behind
  its door, bogie main legs that fold inward, a white strobe. The gear retracts by folding, not by fading.
  Livery: white and periwinkle with a blue belly and tail; no vermilion, no lettering, no carrier.
- **The cycle (19 s, same shape).** Touchdown at 29.8 s on the site clock, at the stand (x 474) 32.7 to
  34.1 s, lift-off at x 554 at 36.1 s, then a straight climb `y = 968 - 0.56 (x - 614)` (29.2 degrees),
  gone at 41.7 s. Gear compression on touchdown, a nose that settles, spoilers and flaps, a designed tyre
  puff, a contact shadow that tightens. `AirportPlane` always returns the same node shape now (it returned
  `null` off-screen before).
- **Somewhere to fly.** The finale's skyline (`cityFinale()`, all three rows) is composed again under that
  line: the low belt in front of Mt Fuji ends at x 606 in two rows (roofs y 810 to 900), there is open sky
  over the depot, the buildings step up toward the Tower (792, 756, 724 at x 1052 to 1250), and the knot
  right of the Tower steps up rightward (566, 492, 392) with the crane at x 1830. Gone: the glass tower at
  x 942, the two billboard buildings, two far towers. Mt Fuji now stands whole. **In 139 measured moments
  (every 50 ms of the climb) the plane is over no building; the nearest roof is 23 px away (the depot).**
- **Behind Tokyo Tower.** The plane is drawn in front until x 1170 (39.3 s), then in a second slot before
  the Tower (`AirportPlaneBack`), so it passes behind the Tower's open lattice between the two decks at 39.9
  to 40.3 s. On a 390 px phone it crosses the visible strip from 37.9 to 40.9 s.

**Checks on `round2`.** `original/` intact; 0 console errors; draw (original / round2) 2.41 / 2.22 ms full,
2.40 / 2.26 desktop, 2.34 / 2.19 phone (2.24 against 2.32 before, same sitting); scene 05 0 frozen steps and
the one step at 28700 ms that was there before; every copy row passes contrast; 0 clouds below a roof with
the new roofs; scenes 01 to 04 pixel-identical.

**Known.** `JetPlane` is also scene 03's far-off jet (never on screen on the site clock); it now draws the
new plane. The take-off roll is only 80 px (the stand is fixed). The airport, terminal, windsock, depot,
road and little trucks are still the old drawings (next pass): the windsock stands under the wheels at
36.9 s and the approach passes in front of the old control tower. The pale hills of `MountainRange` now show
between the belt and the depot.


## The batch of 2026-11-15, element 3: the routes on the map — dashed lines and a small truck on each

The owner wanted a dotted or dashed line instead of a connected one, with a small truck running each
corridor to its destination: "real models, drawn and sized for this, not dots with a box on them". Part
`r4-map-routes` (six blocks, map code only) is in `round2/js`. Evidence: `evidence/2026-11-15-map-routes/`
(`truck-model-6x.png`, `routes-old-new.jpg`, `routes-strip-desktop.jpg`, `routes-strip-phone.jpg`,
`routes-strip-phone-close.jpg`, stills).

- **The line.** The white casing is kept; on it, round-ended vermilion dashes 7.8 map units long and 3 apart
  move outward from the head office at 22.9 units a second, so the direction of travel reads. The connected
  core, the flowing highlight and the travelling head are gone.
- **The truck**, designed at map size rather than shrunk from the big one: 17.7 x 11.6 map units, about
  19 x 13 px on a 390 px phone (a branch depot is 19.5 units wide). A white box in a navy outline with the
  vermilion stripe at its foot, a lower navy cab with one pane, a pale bumper, two wheels with pale hubs. No
  lettering. Mirrored for corridors that run left, never rotated.
- **The timetable** (site clock, first seen to arrival): Chiba 23230 to 24310 ms, Gunma 23490 to 24880,
  Kanagawa 23650 to 24740, Niigata 23870 to 26080, Ibaraki 24200 to 25880, Tochigi 25350 to 26910, Saitama
  25840 to 27220. A run takes 1.25 to 2.4 s with a soft start and a soft arrival; the truck stops with its
  nose at the destination dot, stands 0.2 to 0.9 s and fades over 0.3 to 0.4 s while the next is on its way.
  The loop is 3.78 s (1.89 s for Chiba and Kanagawa); two to five trucks are on the road at any moment.
  Each truck comes out from behind the head-office depot once its corridor has drawn.
- Everything else of the map is untouched: shapes, colours, names, wipe, depots, cards, water, the corridors'
  geometry and drawing order, every timing.

**Checks on `round2`.** `original/` intact; 0 console errors; draw (original / round2) 2.21 / 2.02 ms full,
2.31 / 2.00 desktop, 1.95 / 1.94 phone (against the map before the routes, same sitting: 2.49 / 2.29,
2.52 / 2.32, 2.25 / 2.05, so a little cheaper). The hold: 0 pops, frozen only in the player's dissolve lead
(21800 to 21833); the map receding: only the step at 28700 ms that was there before. The clock step at
27800 ms now changes 25 px of the picture (it was 4451). Every copy row passes contrast; scenes 01, 02, 03
and 05 pixel-identical.

**Known.** The tyre round each hub is 1.45 units, under the 3 px floor (the wheel as a whole is over it).
Saitama's truck stops 24 units short of its dot, between 埼玉 and the 志木 name card (nearer, it would cover
the name). Trucks pass behind the depots and the name cards. Tochigi's and Saitama's trucks leave about two
seconds after their lines draw, so that nothing jumps when the scene's clock steps at 27800 ms.


## The batch of 2026-11-15, the value range: the city widened from navy to air

"Across the whole film the value range is narrow: everything sits in a pale blue-grey band and the road is
the only dark thing anywhere. Widen it, carefully, without breaking the daylight or putting anything dark
under the copy overlay." Part `r4-values` (one block: `CITY_LOOK` and `CITY_HAZE`) is in `round2/js`.
Evidence: `evidence/2026-11-15-values/` (four scenes at the desktop crop, before above and after below;
crops of scenes 01 and 05 at full size, before left and after right).

- The middle of the film's range lives in the city, so that is where it is widened. The nearest row goes
  decisively toward navy (`air` -0.08 to -0.3: it carries the weight of the picture, just above the road),
  the row behind it is no longer washed toward the air (0.2 to 0.04), and the far rows go a little further
  into the air (0.52 / 0.62 / 0.78 to 0.5 / 0.66 / 0.82): five clear steps from navy to sky instead of
  three of the same grey-blue. The haze over the near rows is thinner (0.2 to 0.13).
- Untouched: the sky, the clouds, the whites (trucks, warehouse, Fuji's cap), every shape. Nothing above
  the roofs gets darker, so the copy's ground does not change.

**Checks on `round2`.** `original/` intact; 0 console errors; draw (original / round2) 2.28 / 2.10 ms
full, 2.37 / 2.12 desktop, 2.13 / 1.95 phone; all 13 copy rows pass contrast over the whole film at both
framings (the two unfilled-track rows fail as on the original); 0 clouds below a roof.


## The batch of 2026-11-15, element 5b: the ground of scene 05 — the airport, the Sanpou depot with its name, the road

Part `r4-finale-ground` (two blocks: `Airport()` and the finale's ground in `sceneNetwork`) is in
`round2/js`. Evidence: `evidence/2026-11-15-finale-ground/` (`scene05-old-new.jpg`, `depot-old-new-2x.jpg`,
`airport-old-new-2x.jpg`, `phone-name-crop.png`, `ground-life-strip.jpg`, desktop, phone and full stills).

- **What decides the design:** a 390 px phone shows only the strip round Tokyo Tower (stage x about 942 to
  1579), and on desktop the lower third lies under the dark caption band. So what must be seen stands up
  out of the bottom of the frame.
- **The Sanpou depot** (x 750 to 1168): a low dock hall (two docks under a canopy, the vermilion fascia
  line), an office with three ribbons of windows, an entrance and roof plant, and a stair core. **The name
  三豊運輸 is written downward on a navy band on the core** (x 1100 to 1158, y 745 to 941), 46 px type, each
  character 36 to 43 stage px tall, 23 to 28 px on a phone, inside the strip a phone sees. Vertical because
  the phone's left edge drifts. The building steps up to the right under the plane's climb line: the plane
  clears it by at least 30.5 px at every measured moment.
- **The airport:** a control tower with a wing, a shaft lit on the right, a leaning glazed cab, a roof,
  radar and lamp (top y 675); a terminal under one roof rising to the right, with seven glass bays, a
  transom, a base and two jet bridges; an apron with a stair truck, a bowser and a baggage train; the runway
  edge-on (y 968 to 982) with its paint, side line and eight edge lights; a windsock at x 727 in Tokyo
  Tower's red and white that fills and flaps. The vermilion is off the terminal; nothing is branded.
- **The road trucks:** two axles, white box, vermilion stripe, navy cab, no lettering; one speed per lane,
  the far lane running right and the near lane left, so none slides through another.
- **The ground stays alive through the hold:** the windsock and the radar (continuous), the lamp's pulse, a
  baggage train (19 s), a dock shutter closing at 35.8 to 38.0 s, a truck pulling out of the depot at
  38.8 s (two trucks alternate on a 76 s round), through traffic (38 s).

**Checks on `round2`.** `original/` intact; 0 console errors; draw (original / round2) 2.19 / 2.29 ms
full, 2.22 / 1.96 desktop, 2.02 / 1.98 phone (2.02 against 2.28 before this pass, same sitting); the plane
overlaps nothing at every 100 ms of 28500 to 30500 and 36000 to 39000 (tower cab 51.6 px clear, terminal
roofline 29.0, windsock 10.0, depot 30.5); scene 05 0 frozen steps and the one step at 28700 ms that was
there before; every copy row passes contrast (the desktop caption, which sits over the airport, 5.31 to
5.40; its lead was 6.31); 0 clouds below a roof, the depot and airport now counted as roofs; scenes 01 to
04 pixel-identical.

**Known.** The name is vertical. The control cab's glass leans and the terminal roof is a curve (both real
shapes seen straight-on, not side faces). The lane directions are swapped from the original. Two corners of
the depot are within 3 px of the 30 px limit under the plane. The little road trucks' wheels do not spin.
The terminal hides the city belt between x 146 and 560.


## The batch of 2026-11-15: the final checks on the whole film, and the review page

Everything in the batch is merged in `round2/js`: `r4-truck`, `r4-clouds`, `r4-map-look`, `r4-plane`,
`r4-map-routes`, `r4-values`, `r4-finale-ground`, in that order. The pictures are gathered on
`evidence/2026-11-15-batch-review/index.html` (three-way pictures of every scene with the new-versus-old
line, the map's four option frames, the route trucks and the loading at both docks as strips, all five
scenes at the desktop and phone crops, both scene changes round the map frame by frame, the numbers below).
`python tools/review-pack.py <outDir>` rebuilds the pictures.

**The numbers, on the finished working copy.**
- `original/` intact; the website folder untouched.
- `check-viewer`: 0 console errors over 22 moments at three framings; determinism, the site's real player,
  rapid scene clicks and reduced motion pass. Draw (original / round2): 2.19 / 2.29 ms full, 2.22 / 1.96
  desktop, 2.02 / 1.98 phone.
- Frame pacing on the phone framing with the CPU slowed four times (`perf-table`, median of two runs,
  original / round2): scene 01 9.8 / 10.8 ms, 02 10.7 / 12.0, 03 9.9 / 9.9, 04 9.8 / 9.3, 05 8.9 / 9.1;
  frames over 16.7 ms 0.3 / 1.7 %, 1 / 6.9 %, 3.4 / 6.2 %, 1.4 / 1 %, 0.3 / 0.8 %; script time lower in
  every scene (3.2 to 4.0 ms against 3.9 to 4.8). Nowhere near the 15 ms that drops the film to 30 fps.
- `motion-check`: 0 frozen steps in scenes 01, 02, 03 and 05; scene 04 only the player's two-step dissolve
  lead (its hold used to freeze). Two pops, both there before the batch: 14600 ms (1.16, the clock stepping
  back at the 02 to 03 change) and 28700 ms (0.96, the same at 04 to 05).
- `contrast-check`, whole film, desktop and phone: all 13 copy rows pass AA; the tightest is the caption's
  lead line on desktop, 4.84 against 4.5, at 30000 ms (it sits over the new airport). The unfilled progress
  track fails (about 1:1) as on the original.
- `cloud-check`: 0 clouds below a roof in scenes 01, 02, 03, 05, the depot and airport counted.
- `check-player-vs-glue`: the viewer's clock matches the site's player in every hold (phone).

**For the owner to decide** (also on the review page): the depot's name is vertical; the map's prefecture
names turn pale under the site's wash at the top of the frame and could go a step darker; a phone sees the
map's moving water only as a thin strip; scene 02's phone crop cuts the name on both trucks; the truck has
no roof deflector; scene 02's sky is sparse in the middle; scene 03's caption still says 関東一円.


## Fixes on the batch, 1 of 4 (2026-11-15): the plane is no longer sliced by Tokyo Tower

The reviewer: at 40.0 s the airliner crossed Tokyo Tower behind its lattice, which cut straight through the
fuselage and the window line, dead centre of the phone's picture: it read as a crash. Part `r5-plane-tower`
(four blocks) is in `round2/js`. Evidence: `evidence/2026-11-15-fix-plane/` (`options-phone.jpg`,
`options-desktop.jpg`, `before-after-phone.jpg`, `before-after-desktop.jpg`, `crossing-zoom.jpg`, stills).

**Three options were built and judged at the phone crop** (stage x 955 to 1553):
- **A, steep: picked.** The only one where the plane overlaps nothing but the thin mast, and nothing is
  ever drawn across it.
- B, front (`r5-plane-opt-front`): the old climb drawn in front of the Tower. Nothing cut, but the plane
  covers the Tower's waist in the centre of the phone's picture.
- C, cloud (`r5-plane-opt-cloud`): a 440 px cloud parked at the Tower to hide the crossing. It washes out
  the Tower's white bands, changes the accepted sky and adds four nodes.

**The new path.** Lift-off is unchanged (x 554, 36.1 s) and so is everything before it. The plane now bends
over 185 px into a straight 42.6 degree climb (slope 0.92; it was 0.56, 29.2 degrees). It passes the
Tower's x 1360 at 39.7 to 40.3 s **in front of the thin mast**, above the top deck: fuselage at y 237 to
274, its lowest point 310 over the antenna drum (collar at 333) and 322 over the top deck (roof at 362). It
leaves by the top edge at x 1630 to 1740 at about 41.0 s, passing up-left of the sun, 20 px outside its
halo. On a phone it climbs up behind the buttons before it reaches the Tower, so the Tower's body is never
touched. The back slot behind the Tower (`AirportPlaneBack`) is removed: the plane is one slot again.

**Nodes: 1132 to 1064** at the same moment (68 fewer).

**Checks on `round2`.** `original/` intact; 0 console errors; draw (original / round2) 1.80 / 1.73 ms full,
1.74 / 1.72 desktop, 1.73 / 1.74 phone (1.95 to 1.63 against the film before the fix, same sitting);
scene 05 0 frozen steps and only the step at 28700 ms that was there before; every copy row passes
contrast; everything before the rotation pixel-identical; nothing new under the plane (the windsock is
22 px clear, it was 18); 0 clouds below a roof.

**Known, for the owner.** 43 degrees is steep for an airliner. On desktop at 40.0 s the plane sits right at
the Tower's tip for a moment (`crossing-zoom.jpg`): a close pass in front of the mast, not through it. It
covers some of the birds that circle the Tower's top.


## Fixes on the batch, 2 of 4 (2026-11-15): the map's background is alive where a phone looks

The reviewer measured two frames 1.5 s apart (25500 to 27000 ms): not one pixel changed in stage x 0 to 708,
and the moving water lay outside x 708 to 1322, which is all a phone sees of scene 04. Part `r5-map-alive`
(six blocks) is in `round2/js`. Evidence: `evidence/2026-11-15-fix-map/alive-*`.

- **Water off Niigata too.** The Sea of Japan coast gets the same shallow water as the Pacific coast: a
  24 unit apron in two bands, growing 1.18 times about an inland point (630, 570), reaching 28 to 45 units
  seaward, on the same 3.78 s period. It is at the top left of the phone's picture and the right edge of
  the desktop's left third (Toyama Bay).
- **The land answers the trucks.** A prefecture steps softly to full white while its truck stands at its
  destination (0.5 s rise; it falls back with the truck's fade): big flat areas, in the middle of the
  phone's picture, and it means something (a delivery made).
- Each water is now one path instead of several.

| Changed pixels, 25500 to 27000 ms | Before | After |
|---|---|---|
| stage x 0 to 708 | 0.0 % | 2.1 % |
| stage x 708 to 1322 (the phone) | 10.7 % | 40.6 % |
| stage x 1322 to 1920 | 27.7 % | 27.7 % |

**Nodes: 1065 to 1059** at 26500 ms (six fewer).

**Checks on `round2`.** `original/` intact; 0 console errors; draw (original / round2) 1.84 / 1.68 ms full,
1.73 / 1.68 desktop, 1.68 / 1.72 phone. (The hold's smoothness, contrast and the other scenes were measured
with all three map fixes in: see fix 4.)

**Known.** The left third is alive only at its right edge. The answer of the land is soft: 41 colour levels
for Niigata, 20 to 24 for Ibaraki, Tochigi and Gunma, 13 or fewer for the rest (the most-delivered
prefectures are nearly white already).


## Fixes on the batch, 3 of 4 (2026-11-15): 東京 and 埼玉 are no longer the smallest names

`MAP_LABEL` set TOKYO and SAITAMA at 11.5 units while every other name was 14 or 15: the company's home
prefectures, which carry the head office and both branches, had the faintest type on the map (about 12 px
on a phone). Part `r5-map-names` (two blocks) is in `round2/js`. Evidence:
`evidence/2026-11-15-fix-map/names-*`.

- **東京 and 埼玉 go from 11.5 to 15**, the size of the rest, each inside its own shape (16 does not fit).
  The colour stays `#2f4d78`. Each name keeps the angle at which the wipe reaches it, through a stored
  `at` point, so the timing of its appearance does not move.
- **Nodes: 1059 to 1059.**

**Checks on `round2`.** `original/` intact; 0 console errors; draw (original / round2) 1.76 / 1.67 ms full,
1.74 / 1.72 desktop, 1.69 / 1.72 phone.

**Known.** With this fix alone, the arriving 入間 depot covers half of 埼玉 for a third of a second; fix 4
(the hub) removes that.


## Fixes on the batch, 4 of 4 (2026-11-15): the knot at the centre of the map is opened

Inside about 140 x 60 map units stood three name cards, three depots, two place dots, a stub line, the
meeting of all seven corridors and the names 埼玉 and 東京: nothing overlapped, but it read as a knot, in
the centre of the phone's picture. Part `r5-map-hub` (six blocks) is in `round2/js`. Evidence:
`evidence/2026-11-15-fix-map/hub-*`.

- **入間 stands on its real point, beside 志木** (a 5 unit gap between the two depots). Both place dots and
  the stub line are gone (their nodes are kept, empty, so the node list keeps its shape): the depots
  themselves mark the places.
- **The Saitama corridor passes behind 入間**, and its truck now runs all the way to its dot (it used to
  stop 24 units short so as not to cover a name).
- The three bases keep their real places and names; the head office is untouched.
- **0 overlaps** among depots, cards and names over 195 measured moments. **Nodes: 1059 to 1059.**

**Checks on `round2`, all four fixes in.** `original/` intact; 0 console errors; draw (original / round2)
1.73 / 1.71 ms full, 1.66 / 1.70 desktop, 1.71 / 1.71 phone (against the film before the map fixes, same
sitting: 2.04 to 1.64, 1.90 to 1.59, 1.81 to 1.56). The rest of the checks are in the section below.

**Known, for the owner.** 入間's depot arrives at 1.8 times its size instead of 1.9 (the arrival is a closed
item; this is the one number of it that changed, so that it does not touch 志木 as it lands). Two corridors
still pass behind the 志木 name card.


## The four fixes: the checks on the finished film, and how they are shown

All four are in `round2/js` (`r5-plane-tower`, `r5-map-alive`, `r5-map-names`, `r5-map-hub`, in that
order). They are shown together at the top of `evidence/2026-11-15-batch-review/index.html` ("The four
fixes"): each before and after at the desktop framing and at the phone crop for its scene, one line per
picture saying what is new, and the plane's three options. The batch's three-way pictures and the desktop
and phone sheets were rebuilt with the fixes in; their label bars now write Japanese (`tools/sheet.py`).

**The numbers, on the finished film.**
- `original/` intact; the website folder untouched.
- `check-viewer`: 0 console errors; determinism, the real player, rapid clicks and reduced motion pass.
  Draw (original / round2): 1.73 / 1.71 ms full, 1.66 / 1.70 desktop, 1.71 / 1.71 phone.
- `motion-check`: 0 frozen steps in scenes 01, 02, 03 and 05; scene 04 only the player's two-step dissolve
  lead (21800 to 21833 ms); the only pops are the two that were there before (14600 ms, 1.16; 28700 ms, 0.96).
- `contrast-check`, whole film, both framings: all 13 copy rows pass AA (tightest: the desktop caption's
  lead line, 4.84 against 4.5, at 30000 ms); the unfilled track fails as on the original.
- `cloud-check`: 0 clouds below a roof.
- **Nodes:** 1133 elements on the stage before the fixes, 1059 after. No fix added a node.
- **Frame pacing, phone framing, CPU slowed four times** (`perf-table`, median of two runs, one sitting;
  original / frozen round 2 / the film now): scene 01 5.4 / 5.8 / 8.2 ms, 02 6.1 / 7.4 / 11.1,
  03 5.6 / 5.9 / 8.2, 04 5.3 / 8.2 / 5.0, 05 4.6 / 4.5 / 7.6; frames over 16.7 ms 0.1 / 0.3 / 0.5 %,
  0.1 / 0.2 / 1.4 %, 0.3 / 1.1 / 4.2 %, 0.3 / 0.6 / 0.4 %, 0.1 / 0.4 / 0.5 %. Script time is 1.7 to 2.3 ms
  in every scene on all three sides, so the difference is node count. Scene 02 is the heaviest; all of it
  is still well above 60 frames a second, but scene 03 and the motion pass are still to come.


## Round 6 (2026-11-15): what the owner and the reviewer asked for after the four fixes

The four fixes were accepted. This round: the map trucks (they slid), the plane on a phone, the prefecture
that turned white, and the last old drawings (scene 03's road, the street of scenes 01 and 02). One commit
per element, shown together at the end. Nothing in it may add nodes.

### The plane's climb, slowed (`r6-plane-slow`)

**Why.** On a phone the plane was clearly in open sky for about a second. A phone's only open sky in the
finale is the band between the two buttons (stage y 356) and the roofs, left of Tokyo Tower (the phone sees
x 955 to 1553), and the plane crossed it at 250 to 300 px a second, still gaining speed.

**What changed.** The path is the one that was accepted (the 42.6 degree climb that passes in front of the
Tower's thin mast); only the speed along it changed. The plane used to keep the thrust of its roll all the
way up. Now, from lift-off, the speed over the ground settles to `PLANE.CLIMB_V` = 74 px/s (101 px/s along
the path: a little more than it had on the runway, less than its approach), and 8.8 s after lift-off, when
its nose has gone up behind the buttons on a phone, it gathers speed again (62 px/s2) and climbs away. The
pitch is read by the place and not by the clock (`planeOldS`), so the nose rises over the same stretch as
before and the tail is as clear of the runway as it was. The cycle is 26 s (was 19): lift-off at 36.1 s on
the site clock as before, on a phone from 40.1 s, past the Tower's mast at 45.4 to 46.9 s (1.5 s, was
0.6 s), out by the top at 48.6 s. The site holds on the finale after 45.8 s and its clock runs on, so this
is seen; `viewer/timeline.js` now lets a moment past the end of the schedule be asked for, as the site's
player does.

**Measured** (`node tools/plane-visible.mjs <side>`: the frame with the plane against the frame without it,
counting only the pixels below the buttons on a phone):

| the plane in open phone sky | before | after |
|---|---|---|
| half of it or more | 1.1 s | 4.1 s |
| a quarter of it or more | 1.3 s | 4.9 s |
| four fifths of it or more | 0.4 s | 1.5 s |

**Checks.** `original/` intact, site untouched; `check-viewer` 0 console errors; `motion-check` 27800 to
49500 ms: 0 frozen steps, the one pop that was there (28700 ms, 0.96); `contrast-check` scene 05: every copy
row passes, the unfilled track fails as on the original; `cloud-check` 0; **nodes 1058 before, 1058 after**
(`node tools/node-count.mjs round2 trial3`, a new tool: elements on the stage per scene).
Evidence: `evidence/2026-11-15-plane-slow/` (phone and desktop before / after, the Tower pass).

**Known, for the owner.** The climb is slower than a real one would look (about half a plane-length a
second, like its approach). If it reads as floating, `CLIMB_V` is the one number to raise: 84 gives 3.3 s on
a phone, 95 about 3 s.


### The map trucks, seen from above, and the corridors clear of the name cards (`r6-map-corridors`, `r6-map-truck`)

**Why.** The owner: "it looks like the truck is sliding by the side rather than actually driving." The
truck was a side elevation on a plan-view map, mirrored once per corridor and never turned, and five of the
seven corridors run more north than east.

**The corridors.** Two of them (Gunma's, Niigata's) ran behind the 志木営業所 name card. Now none passes
under a card (every corridor sampled every 0.25 u against every card: 0 hits, the nearest centre line is
3.4 u from one; `evidence/2026-11-15-map-trucks/corridor-check.txt`). Niigata's rounds the card on the east,
Tochigi's moved over for it, and Gunma's shares Saitama's road as far as the gap between the two cards and
branches north there (that gap is 11.4 u, room for one corridor), so Gunma is two curves; `mapRoutes` and
`mapRuns` handle a corridor of one or two curves. The cards and depots did not move.

**The truck.** Three directions were built at the phone crop (`options-phone.jpg`):
- **picked, plan view with a navy outline** (18 x 9 u, 4 nodes): white box, vermilion stripe, navy cab with
  its glass. The only one that reads as a truck pointing along its road on white land. It is steered: the
  rear axle is dragged behind the front, so the tail swings through a bend. `mapTruckAt` returns the
  heading with the position; `face` is gone. Largest turn 2.7 degrees in one frame, none while it stands
  or fades (`heading-and-nodes.txt`);
- rejected, `r6-map-truck-opt-side`: today's side view turned to the road. It has an up and a down, so on
  a road that runs up the map it stands on its tail, and it has to flip where a road bends past vertical;
- rejected, `r6-map-truck-opt-paper`: no outline, on a hard shadow. The white box vanishes on white land.

**Checks.** `original/` intact; `check-viewer` 0 console errors; `motion-check` 21800 to 27800 ms: only
the dissolve's two-step lead, 0 pops; **nodes 1059 before, 1017 after** (each truck is 4 nodes, was 10).
Evidence: `evidence/2026-11-15-map-trucks/`.


### The arrival is shown at the place, not by a whole prefecture (`r6-map-arrival`)

**Why.** A prefecture stepped to white while its truck stood there (fix 2 of the four). It did not read:
most of the area is nearly white already, so the service area only looked patchy at different moments.

**What changed.** That step is removed: every prefecture keeps its own tint all the time
(`mapAnswerFill` and `MAP_ANSWER` are gone). The answer is on the destination: as the truck comes to rest,
its place dot opens into a target (the dot and a vermilion ring, 16 u across, 26 stage px, 17 px on a
phone), stays open while the truck stands and closes over the truck's fade. It runs on the truck's own
clock, so it repeats with it and never jumps. It uses the two circles each corridor's end already had.
One more picture for the owner, not the pick: `option-onewhite-phone.jpg` (part
`r6-map-arrival-opt-onewhite`), the whole service area one flat white.

**Checks.** `original/` intact; `check-viewer` 0 console errors; `motion-check` 21800 to 27800 ms: the
dissolve's two-step lead only, 0 pops; `contrast-check` scene 04: all 13 copy rows pass, the unfilled track
fails as on the original; **nodes 1017 before, 1017 after**. Evidence: `evidence/2026-11-15-map-arrival/`.

**Known, for the owner.** Kanagawa's place dot already sat on the last stroke of 川; the target now opens
around that stroke. Clearing it means moving that dot or the name, and both are closed.


### Scene 03: the expressway, drawn again from a blank page (`r6-expressway`)

Everything the road is made of was still the original drawing. All of it is new; the sky, city, Fuji,
trucks, timings and the scroll are as they were, and the caption and title lines are not touched.

- **The gantry** is an open galvanised-steel truss with a soft navy outline (it was a navy slab), on a far
  column with a plinth and knee braces; its near column still passes in front of the trucks. It sits about
  70 px lower, so the boards clear the site's two buttons on a phone.
- **The signs** carry the same words, green and white as Japanese expressway signs are: 関越自動車道 /
  KAN-ETSU EXPWY / 新潟 Niigata / 前橋 Maebashi with two arrows, and 板橋 出口 / ITABASHI EXIT with its
  vermilion bar. The direction board is 450 px wide (was 560), so a phone shows it whole; the place names
  are 58 px (were 37) with the roman under each, and each board has a lamp at its foot.
- **The road**: a concrete parapet with joints and a steel rail on posts, two lanes with long dashes, a
  darker hard shoulder, expansion seams, a kerb, and a dark guard rail in front (it was a band with 46
  posts a tile).
- **The lamps**: tapered columns with a swept arm and a flat head, two between gantries, so none stands
  behind a board.

**Checks.** `original/` intact; `check-viewer` 0 console errors; `motion-check` 14600 to 21800 ms: 0 frozen
steps, 0 pops; `contrast-check` scene 03: all 13 copy rows pass (the desktop caption's lead line is 9.18
at its tightest, it was 6.52; the track's filled part on a phone 5.06, was 3.24), the unfilled track fails
as on the original; `cloud-check` 0. **Nodes: scene 03 had 1290 elements on the stage, now 944** (the
original has 1254). Evidence: `evidence/2026-11-15-expressway/`.

**Known, for the owner.** There is no pale edge line on the near side of the road: the site's caption and
progress track lie over stage y 918 to 995 and a pale line there cut through "03 輸送". The near column
wears a dark jacket below the trucks' wheels for the same reason. The lamps are kept as pale as the old
ones (nothing above the barrier may get darker, the copy sits there), so they are faint under a phone's
wash. On a phone the big board is whole inside the strip for about 0.3 s as it passes; that comes from the
scroll and the camera, which are closed.


### Scenes 01 and 02: the street, drawn again from a blank page (`r6-street`)

The street itself was still the round 2 drawing. All of it is new; the buildings, trucks, cartons, sky,
city, Tokyo Tower, camera and timings are as they were.

- **The ground**: paving with an unbroken tactile strip, a kerb stone, a concrete gutter with drain
  grates, asphalt with one row of long centre dashes and the near lane one tone down. The dashes lie on
  y 934 to 939, above both of the site's progress tracks, and repeat every 300 px (the pan is 2100 px), so
  in both scenes the desktop caption's number and name stand over a gap.
- **The lamps**: 277 px tall (were 192), pale galvanised steel with the soft outline scene 03 uses: a
  tapered column on a bolted skirt, a switch box on straps, a raked arm, a flat head. **There are 3, not
  11**: the other eight stood behind the two buildings and were never seen.
- **The utility poles**: 240 px (were 176), 640 px apart, one braced crossarm, a transformer on every
  other pole, the cable with its splice case.
- **The vending corner**: a wide white machine, a lower blue one and a bin for empties, seen square on,
  no lettering, no vermilion. It stands further left, so Tokyo Tower's foot is clear.
- **The foreground**: a pedestrian guard fence of pipe hoops (it was two pipes on posts).

**Checks.** `original/` intact; `check-viewer` 0 console errors; `motion-check` 0 to 14600 ms: 0 frozen
steps, the one pop that was there (14600 ms, 1.18, the scene's end); `contrast-check` scenes 01 and 02: all
13 copy rows pass (the desktop caption's number 15.85 at its tightest, it was 8.79), the unfilled track
fails as on the original; `cloud-check` 0. **Nodes: scene 01 1588 before, 1472 after; scene 02 1599
before, 1483 after.** Evidence: `evidence/2026-11-15-street/`.

**Known, for the owner.** Three lamps: say if you want more of them in the open stretch between the two
buildings. The power lines still cross Tokyo Tower in scene 01, as they did (now two lines and a cable).
A phone sees little of the street: the ground, the fence, and one pole head in scene 01.

### Round 6: the checks on the finished film, and how it is shown

All of it is in `round2/js` (`r6-plane-slow`, `r6-map-corridors`, `r6-map-truck`, `r6-map-arrival`,
`r6-expressway`, `r6-street`, in that order). It is shown together on
`evidence/2026-11-15-round6-review/index.html`: each item before and after at the desktop framing and at
the phone crop for its scene, a line per picture saying what is new and what is still old, the truck's and
the plane's rejected options, all five scenes as the site shows them, the numbers, and what is the owner's
to decide.

**The numbers, on the finished film.**
- `original/` intact (7 of 7 checksums); the website folder untouched (commit `72862b6`, no changes).
- `check-viewer`: 0 console errors; determinism, the real player, rapid clicks and reduced motion pass;
  `check-player-vs-glue` matches in every hold. Draw (original / round2): 1.71 / 1.70 ms full,
  1.77 / 1.81 desktop, 1.75 / 1.76 phone.
- `motion-check`, scene by scene (the finale to 49500 ms): 0 frozen steps in scenes 01, 02, 03 and 05;
  scene 04 only the player's two-step dissolve lead (21800 to 21833 ms); the only pops are the two that
  were there before (14600 ms, 1.18; 28700 ms, 0.96).
- `contrast-check`, whole film, both framings: all 13 copy rows pass AA (tightest: the desktop caption's
  lead line, 4.84 against 4.5, at 30000 ms); the unfilled track fails as on the original.
- `cloud-check`: 0 clouds below a roof in scenes 01, 02, 03 and 05.
- **Nodes** (`node tools/node-count.mjs original round2`; original / before round 6 / now):
  scene 01 1337 / 1588 / 1472, 02 1372 / 1599 / 1483, 03 1254 / 1290 / 944, 04 778 / 1059 / 1017,
  05 777 / 1058 / 1016. No pass added a node.
- **Smoothness, phone framing, CPU slowed four times, one sitting, nothing else running.**
  `perf-side`, the whole film: original 167.3 fps, frame median 5.7 ms, 0.2 % of frames over 16.7 ms;
  round2 113.9 fps, 8.3 ms, 1.5 %. `perf-table`, median of two runs (original / round2): scene 01
  6.2 / 9.4 ms, 02 6.8 / 11.8, 03 6.3 / 8.5, 04 5.9 / 5.9, 05 5.6 / 7.7; frames over 16.7 ms
  0.1 / 0.8 %, 0.2 / 1.8 %, 0.5 / 3.4 %, 0.4 / 0.4 %, 0.2 / 0.5 %
  (`evidence/2026-11-15-round6-review/perf.json`). That is where the film stood before this round (the
  original itself measured 0.6 to 0.8 ms slower in this sitting than in the last): it is not heavier, and
  it is not lighter although scenes 01 to 03 lost 116, 116 and 346 nodes. Scene 03 now has fewer nodes
  than the original and is still 2.2 ms a frame slower, so the cost is in what is painted, not in the
  count alone.

## Round 7 (2026-11-15), part 1: four corrections on round 6

Round 6 was accepted (scene 03, the street, the steered map trucks, the arrival ring, the plane's speed).
These four were asked for with it. One commit each, parts `r7-*`, each with its own evidence folder.

### The map truck reads as a truck (`r7-map-truck`)
- The steering stays. The drawing was 18 x 9 u (about 18 x 9 px on a phone) and read as a pill with a dark
  end. It is 27 u long now (`MAP_TRUCK.k` 1.5): a white box in one navy outline with the vermilion stripe, a
  gap with the chassis in it, a navy cab 1.9 u narrower than the box on each side with the windscreen at its
  nose, four tyres standing 1.9 u out, and a flat shadow that keeps its place on the map while the truck
  turns over it. Nothing under 1.9 u (3 stage px).
- Three treatments at the phone crop (`evidence/2026-11-15-r7-map-truck/options-phone.jpg`): the old drawing
  at 1.5 times (still a pill: `r7-map-truck-opt-sizeonly`), the new drawing at 1.25 times (wheels and gap
  under the floor: `r7-map-truck-opt-125`), the new drawing at 1.5 times (picked).
- Nodes in scene 04: 1017 to 1003. A truck has one more node (its shadow); 21 nodes that drew nothing are
  gone (the empty place marks and shadow groups under the three depots).
- Known: the gap between the 志木 and 入間 name cards is 11.4 u and the truck is 11 u wide without its tyres,
  so Gunma's truck passes with its tyres under the two cards' edges for a moment.

### The map against the desktop band (`r7-map-lift`)
- `MAP_BOX`'s top is -24 (was 12): the map stands 36 px higher. `node tools/map-band.mjs <side>` (new)
  prints the band's darkness over the hub, the cards and 東京 on a desktop, and how far 新潟 clears the two
  buttons on a phone. Before to now: hub 25 to 15 %, 東京 29 to 19 %, the 入間 card 15 to 5 %, the 本社 card
  25 to 15 %, the 志木 card 3 to 0 %; 新潟 clears the buttons by 10 px (was 34).
- **It is not cleared, and the trade is the reviewer's / the owner's to decide.** Clearing the band takes
  89 px; a phone has 46. The two ways to clear it are parts and pictures at both crops
  (`evidence/2026-11-15-r7-map-lift/`): the map 13 % smaller (`r7-map-lift-opt-shrink`), or the same size
  89 px higher with 新潟 behind the buttons (`r7-map-lift-opt-high`).
- Not ours: on a desktop the site's pale wash under the copy column reaches the hub at about half strength.

### 神奈川's ring (`r7-map-ring`)
- A place listed in `MAP_ARRIVE.open` gets an open ring. Kanagawa's runs from ten o'clock round by the top
  and the right to five o'clock and is left out where the name is: no line of it crosses a stroke of 川.
  One circle with a dash pattern; no node added.

### The wires at Tokyo Tower (`r7-tower-wires`)
- `STREET.POLE_OPEN`: the span of poles the Tower stands behind in scene 01 carries no lines. During the pan
  the next span reaches the Tower only after the warehouse covers it.

### Checks after the four
`original/` intact, site untouched; `check-viewer` 0 console errors; `motion-check` scene 04: only the
two-step dissolve lead frozen, 0 pops; `contrast-check` scene 04: every copy row passes at both framings
(the unfilled track fails as on the original).

## Round 7, part 2: the seams, the motion pass and the cost (2026-11-15 and 16)

The drawing was finished; this is the half of the brief that makes it a film. The owner's timings are
untouched (`AUTO_DWELL` [7000, 7600, 7200, 6000, 18000], `ENTER_RATE` 1.2, the five stops, the camera paths):
only HOW a move eases changed. Shown with clips on `evidence/2026-11-16-round7-review/index.html`.

### Every scene change is one camera move (`r7-seams`, `r7-seam-fix`, `round2/js/hero-glue.js`)
- **02 -> 03** was an 18-frame dissolve between two still cameras. Now the camera goes after the departing
  trucks along the road, to the right: slowly, then fast (`SEAM23.v` 118 px a frame at the top, 4250 px/s).
  At its fastest the street gives way to the expressway, going by at the same speed, over 6 frames (0.17 s);
  then it lands over 1.25 s until it rides with the convoy. `seam23X(m)` is the camera's extra travel at
  master frame m: in scene 02 it is added to the camera (every layer answers at its own depth), in scene 03
  the road's scroll is short of its steady pace by what is still to come, and the convoy, at its own steady
  speed, is simply ahead on the road until the camera has caught it up. No truck fades in any more. Once the
  camera has landed scene 03 is the picture it always was (0.03 % of pixels differ from before).
- **03 -> 04** was a 0.85 s dissolve onto a frozen frame, between two stages. Now the expressway, still
  running, goes down out of the frame and the map comes down into it from above (`seam34(f)`, 34 frames,
  0.94 s, 114 px a frame at the top). One stage, two slots, a transform on each. A click on 04 from 03's
  hold plays the same move; every other jump still dissolves.
- **01 -> 02** (the pan inside one scene) and **04 -> 05** (the map draws back, the land is there) keep their
  frames and distances and ease on `landEase` (quick start, long landing) instead of in-out cubic.
- **The phone camera** (the glue's art-directed framing) used to chase its target at a fixed rate, so it set
  off at full speed when a scene changed. Each scene change is now one move of 1.8 s from where the camera is
  to the new scene's own path, eased in over the first 0.3 and landing over the rest (`camEase`).
- `tools/check-seams.mjs` runs the real player: both moves play, at both framings, and by click.

### Nothing pops (`r7-pops-landings`)
- 14600 ms: the three trucks at the docks moved a pixel in one step. Their idle ran on the frame clock while
  the sky ran on its own. Scenes 01-02 have ONE ambient clock now.
- 28700 ms: the finale was faded in as one group over the whole stage; on the step its opacity reached 1 the
  browser stopped drawing it through a buffer and every gradient shifted by one level. The finale now stands
  finished under the map's opaque panel and is seen as the panel goes. While the map is up it is not drawn.
- `motion-check`, the finished film, scene by scene (0..7000, 7000..14600, 14600..21800, 21800..27800,
  27800..49500 ms, 60 steps a second): **0 frozen steps and 0 pops in every scene.** (Scene 04 used to
  begin with two frozen steps, the dissolve's lead; there is no dissolve there now.)

### The world is never frozen; heavy things show weight (checked, nothing added)
- What is alive in each hold (`node tools/what-moves.mjs <side> <ms> <ms + 500>`): scene 01 the clouds, the
  birds, the shafts, the Tower's beacon, a crane, the supplier's forklift, the truck's idle and exhaust;
  scene 02 the warehouse forklift, three trucks' idle and exhaust, clouds, birds; scene 03 everything;
  scene 04 the water off both coasts, the corridors' dashes, the trucks; scene 05 the plane's 26 s cycle,
  the road trucks, the depot's trucks, the airport's windsock, radar, tower lamp and baggage train, the
  beacon, cranes, lit windows, clouds, birds.
- Weight: every truck that starts or stops goes through `truckMotion` (scene 01's arrival, the move to the
  dock, the three departures, the depot's trucks in the finale); both forklifts pitch on their own
  acceleration; the map trucks run on `mapRunEase` (soft start, longer landing); the plane has its own.

### The route line (`r7-route-line`)
- The centre dashes of the street, the lane dashes of the expressway and the centre dashes of the finale's
  road are the vermilion of the map's corridors (`DAY.routeLine`): same dashes, same places, nothing added.
  With the corridors and the site's dashed track it is one line from the first scene to the last. It lies
  under the site's dark band, so it is quiet. Its own commit: it can be dropped alone.

### The cost (`r7-cost-a`, `r7-cost-b`)
- **What it was.** `tools/trace-side.mjs` (new) adds up a frame's work from a Chrome trace. Scene 02, phone,
  CPU slowed four times: the remake's script was faster than the original's (5.1 against 7.3 ms) and its
  main thread about level (14.6 against 15.6 ms), but its raster work was 17 ms a frame against 0.4 ms.
  Everything shared one layer, so anything that moved anywhere (a cloud, a lit window, a truck's idle) made
  the browser draw the whole scene again, and merging rectangles into a few large paths to save nodes had
  made that drawing dear. That is why fewer nodes had not made it smoother.
- **What changed** (the picture is the same: 0.08 % of pixels differ on the stage, worst 0.27 %; 0.10 % on a
  phone, worst 0.57 %; all at the edges of layers):
  1. a group with `data-cache` gets a layer of its own: drawn once, then only moved (raster 13.6 to 1.3 ms);
  2. the patcher skips a node whose description is the very object it was last patched to (script 5.6 to
     4.2 ms);
  3. a single filled shape's `opacity` is written as `fill-opacity` (scenes 01-02 had 150 such shapes; each
     was a separate effect for the browser: paint and layer work 8.2 to 6.4 ms);
  4. scenes 01-02 are a stack of pictures instead of one svg: the four rows of the city are still pictures
     with one layer each (their 41 buildings no longer take one apiece), moved by the camera as layers;
  5. 56 circles that were never seen and an empty opacity group are gone from scenes 04-05.
- **Measured back to back, one sitting, phone @2x, CPU 4x slower.** The finished film, two runs each, one
  side after the other: original 73.0 / 73.4 fps, frame median 13.1 / 13.2 ms, 8.5 / 7.6 % of frames over
  16.7 ms, 1.1 / 1.0 % over 33 ms, worst frame 134 / 119 ms; remake 81.8 / 79.3 fps, 11.7 / 12.1 ms,
  3.0 / 3.6 %, 0.3 / 0.3 %, worst 97 / 99 ms. Script per frame: 5.98 / 5.97 ms against 4.06 / 4.24 ms.
  (Before the cost work the remake stood at 50 to 54 fps and 43 to 54 %, against an original at 72 to 73
  fps and 8 to 9 %.) Scene by scene, median of two runs, original / remake:
  01 14.0 / 12.9 ms, 2.8 / 2.0 % over 16.7 ms; 02 13.1 / 13.8 ms, 22.4 / 3.6 %; 03 14.8 / 12.4 ms,
  19.0 / 4.7 %; 04 14.3 / 11.5 ms, 15.2 / 9.2 %; 05 13.4 / 11.4 ms, 3.2 / 2.0 %.
- **Nodes** (`node tools/node-count.mjs original round2`; original / before round 7 / now): 01 1337 / 1472 /
  1484, 02 1372 / 1483 / 1495, 03 1254 / 944 / 944, 04 778 / 1017 / 946, 05 777 / 1016 / 945. Scenes 01 and
  02 have 12 more than before the round (the wrappers of the picture stack); scene 03 has as many, scenes
  04 and 05 have 71 fewer.

### Checks on the finished film
`original/` intact (7 of 7), the website folder untouched; `check-viewer` 0 console errors (determinism, the
real player, rapid clicks, reduced motion); `check-seams` passes at both framings; `check-player-vs-glue`
matches in every hold; `motion-check` 0 frozen steps and 0 pops in all five scenes; `contrast-check` all 13
copy rows pass at both framings (the unfilled track fails as on the original); `cloud-check` 0 clouds below
a roof.

## Three fixes on round 7 (2026-11-16)

Asked for after round 7 was looked at; nothing else in round 7 was reopened. Parts `r8-*`, one commit each
with its own evidence folder, gathered on `evidence/2026-11-16-three-fixes-review/index.html`.

### The map's place against the desktop band is closed (`r8-map-lift`)
- The reviewer's answer: neither of the two options shown. The map stays at FULL SIZE, `MAP_BOX`'s top is
  -77 (the full 89 px; it was -24), and the name 新潟 moved from above its place into the open land south
  west of it (`MAP_LABEL.NIIGATA` at 376, 592, `at: [397.0, 552.7]` so its wipe is aimed as before).
- `node tools/map-band.mjs round2`: the hub and all three name cards 0 % under the band (the hub was 15 %),
  東京 4 % (19 %), 新潟 17 px under the phone's buttons (10 px).
- Why not the 13 % smaller map: at 1 u = 1.417 px the map truck's gap, tyres and windscreen fall under
  the 3 stage px floor and the depot cards' text shrinks on a phone.
- Seen: on a phone Niigata's open arrival ring comes within about 3 px of the buttons while its truck
  stands there; Niigata's northern end runs off the top of the frame. The truck and the corridor do not
  come near the name.

### The map truck (`r8-map-truck`)
- Round 7's drawing read as an armature of dark parts: tyre blocks as two crossbeams, a dark nib of a cab,
  the stripe as a bar across the box. The steering, the wheelbase model, the shadow and the 1.5x size stay.
- Now it is the film's own truck seen from above: a long white box (13.55 of 18 units) whose two long edges
  are the vermilion stripe, its tail navy; one navy cab joined to the box and as wide as it, the windscreen
  across it (1.6 x 4.7 units), the bumper's corners cut; four short wheel marks at the corners. Nothing
  under 1.23 base units. Four shared nodes and a shadow each, as before (scene 04: 946 nodes then, 945 now).
- Three drawings judged on the real map at the phone crop and magnified 8 times: picked the side stripes
  with the cab joined; rejected a navy outline all round with the stripe as a tail band
  (`r8-map-truck-opt-tail`) and the picked drawing with a gap behind the cab (`r8-map-truck-opt-gap`).
- Differs from the reviewer's words in one thing, told on the review page: he described a navy outline
  round the box; a navy outline and a side stripe together leave a white strip 2.2 units wide.

### The truck on the progress bar (`round2/js/hero-glue.js`)
- It was the site's original drawing, never remade because it is not in the scene code. Now the film's
  truck in the same 30 x 16 CSS px: a tall white box in a navy outline, the stripe in its lower third with
  a white row under it, a lower navy cab (#30466f, the film's navy a step lighter so it holds on the dark
  band) with its glass, a dark chassis, two wheels with steel hubs tucked under the body. Edges on whole
  and half pixels. One node fewer than the original's.
- `viewer/frame.html` reads the truck out of each side's own glue file, so the clock player shows the
  side's truck (it had its own copy of the old one). Checked identical in both players, for both sides.
- For the integration task, not changed: the bar (`.hc-fill`, the site's CSS) reads a little crude beside
  the redrawn truck at 2x.

### Checks on the finished film
`original/` intact (7 of 7), the website folder untouched; `check-viewer` 0 console errors;
`check-player-vs-glue` passes at both framings (remake and original); `check-seams` passes; `motion-check`
0 frozen steps and 0 pops in all five scenes (to 49.5 s); `contrast-check` all 13 copy rows pass (the
unfilled track fails as on the original); `cloud-check` passes; `map-band` as above. Nodes per scene
(original / now): 1337 / 1483, 1372 / 1494, 1254 / 943, 778 / 945, 777 / 944: one fewer in each than
before these fixes. `perf-side`, phone @2x, CPU 4x slower, one sitting, one side after the other, two
runs each: original 75.1 / 74.3 fps, median 12.9 / 13.0 ms, 5.5 / 6.6 % of frames over 16.7 ms; remake
82.8 / 84.9 fps, 11.6 / 11.3 ms, 3.3 / 2.9 %.

## The map truck's stripe moves to the tail; two smaller things (2026-11-16)

### The map truck (`r9-map-truck-tail`)
- The reviewer's verdict on the side-stripe drawing of the round before, which comes out: (1) with no dark
  edge along its long sides it read as a pale capsule, not an object, at true phone size; (2) on this map
  vermilion means ROUTE (the corridors, the arrival ring), so a truck with vermilion flanks on a vermilion
  dashed line blurred into the line (`STYLE.md` section 3, vermilion creep); (3) the tail band is the film's
  truck (white box, navy, one small vermilion accent) and sits with the navy cards and names. At 29 stage
  px the outline is worth more than where exactly the stripe sits.
- Now: a navy outline all round the white box, the stripe as a band across its tail (1.75 units). Nothing
  else about the truck changed: the steering, the wheelbase, the shadow, the 1.5x size, the cab, the four
  wheel marks.
- The side-stripe drawing is kept the other way round as the rejected option (`r9-map-truck-opt-sides`,
  which rebuilds it exactly) with its picture. Evidence in `evidence/2026-11-16-r9-map-truck-tail/`, with
  the whole of scene 04 at the phone crop and the desktop crop.
- No node added (scene 04: 945). `check-viewer` 0 console errors; `motion-check` on scene 04: 0 frozen
  steps, 0 pops; `contrast-check`: all 13 copy rows pass.

### The progress truck's cab: a picture, not a change
- The cab (#30466f) is lighter than the box's outline, so it is not the darkest part of the truck as it is
  on every other truck in the film. One alternative, shown at both framings in scene 04 and in scene 05:
  the film's own cab navy (#28395a) with a light edge along its roof and front. It holds against the band
  at both framings in both scenes; its edge is one pixel wide on a desktop and it costs one node.
  `evidence/2026-11-16-r9-progress-truck-cab/` has the picture and the two pieces of markup. Not applied.
- **Answered the same day: the cab stays as it is.** At its real size the two are all but the same picture;
  magnified, the light edge reads as a stray line beside the cab; and it costs a node for nothing (the
  reviewer's own frames: `evidence/2026-11-16-opus-tailband/`). Closed.

### `tools/sheet.py`
- Every tile in a row gets the same label bar, as tall as the row's longest label. A tile whose label had a
  second line used to get a taller bar than its neighbour, so the two pictures of a before/after stood at
  different heights and it could look as if something had moved.

### Where the film stands
Finished to the brief, in the reviewer's words: every drawing remade, both seams as camera moves, no pops,
the route line through, and faster than what it replaces. Nothing else is started. The owner watches it
end to end next; integrating it into the site is a separate task that waits for his yes.

## The finished film recorded end to end (2026-11-16)

The film does not change; this only makes it watchable. Until now the only whole-film recordings in the
project were round 1's (13 November, the rejected version); the finished remake existed as clips of single
scenes and seams, and the plane's pass at Tokyo Tower was in none of them.

- Four recordings in `evidence/2026-11-16-the-film/`, each the whole film in one take with no cuts, 0 to
  48000 ms on the site clock at 60 frames a second (`tools/record.mjs`, the phone ones with `--dpr=2`):

  | file | picture | length | frames | size |
  |---|---|---|---|---|
  | `remake-desktop.mp4` | 1440 x 720 | 48.0 s | 2880 | 6.2 MB |
  | `remake-phone.mp4` | 780 x 1360 | 48.0 s | 2880 | 9.8 MB |
  | `original-desktop.mp4` | 1440 x 720 | 48.0 s | 2880 | 4.3 MB |
  | `original-phone.mp4` | 780 x 1360 | 48.0 s | 2880 | 7.5 MB |

  The picture is the site's hero section itself (1440 x 720 in a 1440 x 900 window, 390 x 680 on a
  390 x 844 phone), with the site's copy, buttons, band and progress bar over the film. No labels in it.
- No frame dropped in any of them: 2880 frames each, every one exactly 1/60 s after the one before, and no
  frame's picture the same as the one before it (`ffprobe`, `ffmpeg -f framemd5`).
- `index.html` in that folder plays them: the remake large and the original under it on a desktop, the two
  beside each other on a phone, a line under each, and "Play both together" for each pair. Checked through
  the viewer's server at 1440, 1280 and 390 px wide: all four load at 48 s, nothing overflows sideways, 0
  console errors, both of a pair play in step.
- Found on the way: the viewer's server (python's `http.server`) cannot send part of a file, so a film
  played straight from it runs from the start but cannot be scrubbed (every jump lands back on 0). The page
  fetches each film whole and plays it from memory; jumps to 15, 46.2 and 47.9 s then land where asked in
  all four. The clips on the round 7 review page have the same limit and were left as they are.
- A recording shows the film as it is meant to play at 60 frames a second. It is not a measure of how
  smoothly a given machine plays it live; that is the cost table above.

## Round 10: the birds and the sky (2026-11-16)

The owner watched the film end to end: "It is nearly perfect, but the way the birds are flying is a bit odd
personally. Also, might need some polishing on the sky / clouds as well, make sure its all smooth and natural
looking." Parts `r10-birds` and `r10-sky` (spliced in that order: the sky part's last anchor is a line the
birds part writes). Shown with before/after pictures and clips on
`evidence/2026-11-16-r10-birds-sky/index.html`. Nothing else in the film was touched.

### The birds (`r10-birds`)
- What was odd: they were drawn facing the viewer, wings out to both sides, and slid sideways at 14 px a
  second, so they hung in the air; their wings beat up into a deep V; the kite went round its circle without
  turning. (The same fault he saw in the map trucks: sliding, not going where they point.)
- Now each bird is one small solid model in its own axes (`BIRD_KIND`: a body from above and from the side,
  a tail, two wings of two panels), turned to its heading, banked and pitched, and projected as seen from
  the ground, a little from below (`birdD`). Every piece is written the same way round on the screen so
  overlaps never cut a hole. Still ONE path per scene: no node added.
- The flock flies across in side view, the way the trucks drive, at 40 px/s (scenes 01-02), 44 (03) and 52
  (05). `birdBeat`: three beats and a glide, every 2.5 to 3.4 s, each bird on its own time; the downstroke
  is the quicker, the hand trails the arm, the beats swell from the held wing and die back into it with no
  step in the wing's speed; the bird climbs 6 to 9 px while it beats and sinks while it glides, and its nose
  follows its path.
- The kite soars round a level circle seen from below (the far side lies lower and smaller), banked 25
  degrees into the turn, heading along its path, and beats twice in nine seconds.
- Where they fly (`BIRD_SETS`): scenes 01-02 along the top of the sky (y 126), above the glass tower and
  into the open sky of scene 02; scene 03 from x 1150, over the cumulus and on; the finale from the
  headline's end past Tokyo Tower and under the sun, coming down 6 px in every 100. On a desktop the
  headline stands over stage x 160 to 1075 from y 264 down (measured from the frame; an earlier note of
  mine said it ended at 853), so a flock keeps above y 264 while it is left of 1075.
- The finale has two flocks half a round apart, and a round is two of the plane's cycles
  (`span: 52 * 52`): a flock crosses Tokyo Tower every 26 s, always nine seconds before the plane passes it.
- While the map hides the finale its birds are not worked out (`DayBirdsNone`).

### The sky (`r10-sky`)
- **The sun stands clear.** A far streak lay across the sun's disc in all three skies; at full size it read
  as a pale bar over the sun. It is now a high streak to the sun's left (`SKY_WORLD.far` 1180, 100, 500;
  `SKY_TRANSIT.far` 820, 108, 500; `SKY_FINALE.far` 1040, 150, 480). It cannot go under the sun: in scene
  02 the tower block's roof (y 121) stands there, and in the finale Tokyo Tower's tip (y 168).
- **Streaks** (cloud species 3 and 4) were a row of low lobes on a level base with round ends, and 3 had a
  detached dash above it. Each is now one long lens with a low uneven back and pointed ends, written out
  whole (`CLOUDS[k].path`; 3 has a second, shorter lens on its back).
- **The finale's sky no longer darts.** Its clock was the scene's clock times how far the map had drawn
  back, so at 28.1 s the clouds ran 23 px in 0.4 s (up to 107 px/s against a drift of 7) and the shafts
  swung into place. It now has its own clock (`skyT`): still under the map's panel, then the scene's clock
  from the frame the map starts to go. After the map has gone every cloud is where it was composed.
- Found by `tools/sky-motion.mjs` (new): it follows every cloud on the screen through the film and lists
  any that goes faster than three times its own drift, jumps, or pops.

### Looked at and left alone
- The cumulus clouds: as accepted. They drift without stepping (one cloud's edge measured at every 1/60 s:
  0.11 to 0.19 px a frame, never a whole pixel).
- The recording: the sky in the first recordings was a little blockier than the live film (video
  compression). All four were recorded again at `--crf=18`.
- The vignette (a soft dark frame over the whole picture) dulls a white cloud near the top corners
  (255 to 244 at the first cloud's top). On a desktop that corner is under the pale wash.
- The small jet in scene 03's sky never comes into view while the scene lasts (it starts 360 px off the
  left edge at 38 px/s).
- The kite and the plane cross the same patch of sky for about a second now and then, as before.

### Checks
`original/` intact (7 of 7), the website folder untouched; `check-viewer` 0 console errors (one run of ten
reported one problem whose message I had not kept; the nine after it were clean); `check-seams` passes at
both framings; `check-player-vs-glue` passes at both framings; `motion-check` 0 frozen steps and 0 pops in
all five scenes (to 49.5 s); `contrast-check` all 13 copy rows pass (the unfilled track fails as on the
original); `cloud-check` passes; `sky-motion`: no jumps, nothing faster than its drift outside a camera
move. Nodes per scene: 1483, 1494, 943, 945, 944, unchanged.

Cost, one sitting (the machine was quicker than in earlier sittings: compare the rows). `perf-side`, phone
@2x, CPU 4x slower, two runs each: original 188.5 / 189.7 fps, median 5.1 / 5.0 ms; remake 203.1 / 202.3
fps, 4.4 / 4.4 ms. `perf-table`, phone, CPU 4x slower, frame median of three runs, scenes 01 to 05:
original 5.4 / 6.3 / 5.6 / 5.3 / 4.6 ms; the remake before this round 5.3 / 5.1 / 5.3 / 4.1 / 3.7; now
5.5 / 5.2 / 5.3 / 4.0 / 4.0. The new birds cost about 0.1 to 0.2 ms a frame of script on the slowed phone
where there are birds; scene 01 is level with the original, the other four ahead.

### The film, recorded again
`evidence/2026-11-16-the-film/`: all four recordings made again (0 to 48000 ms, 60 fps, `--crf=18`), each
48.0 s and 2880 frames with none dropped or repeated: `remake-desktop.mp4` 7.8 MB, `remake-phone.mp4`
12.4 MB, `original-desktop.mp4` 5.3 MB, `original-phone.mp4` 9.8 MB.

## 2026-11-17 — the phone rebuilt and the wash replaced by a patch (the owner picked "faint")

His note: *"Not only the wordings, but the smartphone view of the page and its elements / formatting looks
atrocious. For the desktop site view (and the app as well) if possible I would like the animation section to
be able to be visible as much as possible with a hint of somekind of appropriate element for the text to be
visible if appropriate (like the slight fade effect, or a fade effect with a smooth animation that is
appropriate to the animation section)."* He was shown four strengths and **chose faint**.

Live in `round2/css/light/patch-faint.css`, loaded by `sides.json` after `round2/css/hero-copy.css`.
`viewer/frame.html` now takes `"css"` as one path **or a list**, in cascade order, so each decision keeps its
own file. The stronger options he did not take are kept as the record: `patch-strong.css`, `patch-soft.css`,
and `patch-whisper.css`, which is one notch fainter and fails.

### The phone, measured before it was touched (`shots/diag-p1/`)
The copy furniture took the top THIRD of a 390 px screen and the caption bar another sixth: a full-width pale
band with a visible edge across the frame, a headline running gutter to gutter at 30 px, and two half-screen
button slabs 48 px tall that were the heaviest objects on the screen. Now: the block starts at 18 px instead
of 32, the headline is `clamp(20px, 5.9vw, 27px)` with a little line-height, the tag 13 px, and the slabs are
two content-width buttons 44 px tall. Same copy, same two actions, same controls, about 110 px shorter — the
whole supplier building, the conveyor, every parcel and the truck are visible where the building used to be
cut.

### The veil
A soft elliptical patch behind the copy block (44% x 50% at 27% 46% on a desktop; 88% x 30% at 46% 12% on a
phone) in place of a wash that paled half the desktop screen full height. When the copy clears after the
opening the patch drifts up and left and swells 7% over 1.5 s on the site's own easing while the words rise
10 px — the pace of the film's clouds, not a flat dissolve. It returns the same way on pause and on focus,
and does not move at all under reduced motion.

**Two strengths, because the copy has two lives.** While the film plays the copy is only up on the opening
scene, and faint is enough there. Paused or focused it comes back on whatever scene is on screen, and faint
is not enough over the expressway — measured, headline 2.47 at t=16000. So `.is-static` and
`:has(.hc-content:focus-within)` take the patch to full strength and let the second wash return. Nothing is
lost: the film is stopped, so there is no animation to keep visible.

**The site's own mask is KEPT.** The first cut cleared it (`mask-image: none`, copied from the phone rule) and
that cost the caption text its contrast when the film was paused on the finale: `caption name` 2.44 and
`caption lead` 2.43 against the 4.5 they need. The mask (opaque to 70% of the height, gone by 88%) is what
stops any pale wash reaching the dark band under the captions.

### How faint it can go, measured over the opening scene
Worst case, against what AA needs (headline 3, sub-copy 4.5):

| | peak | headline desktop | sub-copy desktop | headline phone |
|---|---|---|---|---|
| the wash as it was | .86 over half the screen | 9.74 | 9.86 | 12.21 |
| strong | .95 | 9.85 | 9.94 | 10.45 |
| soft | .82 | 7.19 | 7.17 | 7.84 |
| **faint (chosen)** | **.64** | **4.91** | **4.84** | **5.58** |
| whisper | .46 | 3.30 | 3.29 FAIL | 4.04 |
| nothing | — | 1.33 FAIL | 1.34 FAIL | 2.05 FAIL |

Faint is the floor, and the limiting spot is where the headline crosses the supplier building's dark storey
at t=0, which no narrowing avoids because it is the copy's own position.

### Checks
`contrast-check` whole film, playing: every copy row passes (4.91 / 4.84 / 5.48 / 4.98 the worst four).
`contrast-check` whole film, `--static`: every copy row passes (8.00 / 12.24 / 12.37 / 5.65 the worst four),
captions 5.32 and 4.84. The only failures left at either setting are the two `track unfilled` rows — the
site's own progress bar over a pale sky, which fails on the `original` side too. `check-copy` OK (up on the
opening, gone while it runs, back on pause, on focus and under reduced motion). `check-viewer` 0 console
errors at all three framings. `original/` 7 of 7; the website folder untouched.
`tools/record.mjs` now takes `--css=<file>`, the flag `contrast-check.mjs` already had.

## Round 11 (2026-11-17): the finale is a loop, and five things that were not smooth

The owner asked for two things: "make sure the last scene is a complete seamless loop (the user can switch
back to other scenes by clicking on the bar that we have on the hero section so)" and "I want the animation
scenes to look 60 fps like (smooth without any jaggedness or issues)". Brief: `PROMPT-FOR-FABLE-LOOP.md`.
Four passes, one commit each: the loop (parts `r11-loop-sky`, `-birds`, `-city`, `-ground`), the handovers
(`r11-handover`), the film's first frames and the doors (`r11-first-frames`), the player
(`round2/js/hero-glue.js`, edited directly). Shown together on
`evidence/2026-11-17-round11-review/index.html`. **Waiting for the owner's verdict.**

Three reviewers then went over the uncommitted work independently, each told to break it (one on the loop,
one on everything outside it and the player, one on what still did not move smoothly). What they found is
marked (review) below; what was left is at the end.

### 1. The finale is the same picture every 52 s

Nothing brought the finale back to its start. It simply ran on, and after a minute it was in states nobody
had composed: the clouds drift one way, so 52 s on the big cloud was half out of the picture, after three
minutes the middle of the sky was empty, and the next cloud only came in on the right after five
(`evidence/2026-11-17-finale-loop/without-the-loop.jpg`). Nothing else repeated either: the road ran on a
38 s timetable beside the plane's 26 s, the baggage train on 19 s, the kite on 15 s.

Now every moving thing in the finale goes round a whole number of times in 52 s (`LOOP`), so the picture
52 s from now is this picture. Nothing is reset to make it so: there is no seam and no special frame. 52 s
because the two longest cycles already agreed on it (the plane's 26 s, the flocks' 52 s).

| what moves | before | now (turns in 52 s) |
|---|---|---|
| the plane | 26 s | 26 s (2). Its climb's slight weave and its lamp are read on its own cycle now, so every flight is the same flight |
| the two flocks | 52 s | 52 s (1 each). Their wander, heading and beats: the nearest whole numbers of turns |
| the kite | 15.0 s a circle | 13 s (4): the same place at both of the plane's passes, on the far side of the plane's line (review) |
| the clouds | one way for ever: round again in 8.6 minutes (near) and 18.8 (far) | out and home once: 116 px (near) and 53 px (far), see below |
| the light shafts, the sun | 21.7, 48.3, 27.3, 15.3 s; 12.6 s | 26, 52, 26, 17.3 s; 13 s |
| Tokyo Tower's lift | 20 s | 26 s: it rides at the pace it had, 7 s each way, and waits 6 s at each end, not 3 |
| ... its glass reflection, its lamp | 9 s, 2.99 s | 8.67 s, 3.06 s |
| the cranes (slew, trolley, hook) | 57, 76, 65 s | 52 s each, on their own phases |
| window sheen, glints, warm rooms | 20 s, each pane's own, 31 s | 17.3 s, the nearest that fits, 26 s |
| the radar, the tower's lamp | 4.333 s, 2.73 s | 4.333 s (it was within a hair of 12 turns already), 2.74 s |
| the baggage train | a crossing every 19 s | a crossing every 26 s: 19 s edge to edge at the pace it had, then it waits behind the depot (review) |
| the windsock | 10.1, 3.70, 0.885 s | 10.4, 3.71, 0.881 s |
| the depot's trucks and shutter | a truck leaves every 38 s | every 52 s. The dock stands empty 18 s as before; a truck then stands there 34 s (was 20) |
| the through truck, the near lane's two | once in 38 s | once in 52 s |

**The first round is the one in the approved film.** The first truck leaves at 14.2 s on the finale's clock,
the next stands there 18 s later, the through truck is where it was, the plane's first flight is the flight
it always was, the baggage train comes in when it did. The near lane's second truck is the one that came in
at the right edge 41.8 s into the film, on its way into a phone's view (review: it had been left on a phase
that lost it). The road's traffic is a quarter thinner from then on (the same trucks on a longer round); no
truck was added.

**The clouds: the one thing that could not simply be re-timed.** A cloud that drifts one way for ever cannot
be in a loop. It comes back only by leaving the picture and coming in on the other side, and at a cloud's
pace (7 px/s) that takes 8.6 minutes; to do it in 52 s it would have to cross at 70 px/s. So in the finale
the clouds go out and come home: from where they were composed they drift left with the wind, at the pace
they always had at their fastest (7 and 3.2 px/s), slow to a stop after 26 s, and drift back, starting and
landing at rest (one sine a loop, `SKY_SWAY`). For the first 20 s, which is all of the finale anyone had
watched, they move as they did. They never leave the stretch of sky the film had already shown, so the sun
stays clear and every cloud stays above its roofs for good (250 px or more at the far end). **What it
costs: for half of every loop the clouds move back, against the wind the windsock shows.** That is for the
owner to see and judge: the review page shows one whole loop of the sky beside the option kept as a part,
`r11-loop-opt-gentle` (they go less than half as far, so they are slower all the way and the turn is less
to see). The other way out, a loop long enough for the clouds to come round (520 s or more), was not built:
it leaves the sky empty for minutes, as before.

**The baggage train and the plane (review).** Left on a round of its own (19 s, or a third of the loop) the
train drove along under the plane all through every second landing. It now comes in once in each of the
plane's cycles, always just after the touchdown and well behind the plane, as in the approved film.

**The kite and the plane (review).** The plane's wheels climb straight through the middle of the kite's
circle. With three turns a loop the kite was at opposite ends of its circle on the two passes, and at the
left end the plane's body went over it. With four it is at the right-hand end on both, on the empty side of
the plane's line, 58 px or more clear.

**Other scenes are untouched by this pass.** The parts that scenes 01 to 03 share (shafts, sun, birds,
Tower, cranes, window light) take the loop as an argument (`loop`, `loopW`, `loopT`); without it they work
as they did, to the last digit.

**The two depot trucks** take turns, so each is on a round of two loops; they are the same drawing, so the
picture repeats every loop. Their two slots swap trucks 20 s after each departure, when one is off the
picture and the other stands at the dock, so every node is the same one loop later too.

Proof (`evidence/2026-11-17-finale-loop/`):
- `check/loop-check.mjs round2 --from=30420 --step=16.6667 --turns=2`: the scene code run without a browser,
  the picture at each of 6,240 moments (every 60th of a second for two loops) compared node by node with the
  picture 52 s later: every node the same.
- `loop-proof.jpg`: four pairs of photographs one loop apart on the bare stage, 0 of 2,073,600 pixels differ
  in each; the same at the desktop and the phone framing.
- `check/loop-buttons-check.mjs`: the site's real player on a stepped clock, left on the finale for four
  loops (208 s): the same picture one loop later and four loops later; all five scene buttons work from
  there; a jump back to 05 lands on the loop. Desktop and phone.
- `tools/motion-check.mjs` over the film and a further whole loop (0 to 84 s): 0 frozen steps, 0 pops.
- Clips through two loops, desktop and phone, with nothing marking the join.

The loop starts where the finale's hold starts, 30.4 s into the film. On a phone the camera is still moving
across the finale until its 18 s dwell is over (45.8 s), as it always did; from then on a phone's picture
repeats too.

### 2. Nothing loses a sixth of its speed in one frame when a hold begins (part `r11-handover`)

The player plays every entrance 1.2 times as fast as a hold (`ENTER_RATE`, the site's own), and a scene's
clock was simply its frame. So everything in a scene ran a fifth faster while it entered and dropped to its
own speed in the single frame the hold began. Where fast things were moving at that moment it showed as a
lurch:

| | before | now |
|---|---|---|
| scene 03, 16.93 s: the road, the skyline, the wheels | 324 -> 270 px/s in one frame (45 numbers) | none |
| scene 04, 24.02 s: a map truck at its cruise | 118 -> 97 map units a second | 118 -> 116 -> 115 |
| scene 05, 30.41 s: the plane rolling out; the trucks | 99 -> 79 px/s; 72 -> 60 px/s (12 numbers) | none |

- **Scene 03** and **scene 04**: the hold sets off at the entrance's pace and settles to its own over a
  second and a half (`holdSettle`). After that the scene is 0.15 s ahead of where it was, and nothing else
  changes. Scene 04's clock keeps the hold's pace through the finale's entrance (review: on the frame alone
  it would have jumped to 1.2 times at 27.8 s, with the map still up), so the water, the dashes and any
  truck still on its road go on unbroken while the map draws back.
- **Scene 05**: the finale has its own clock (`now`), one second a second from the frame the map begins to
  draw back, through the entrance too. So the first landing is the same landing as every later one (it used
  to play a fifth too fast and brake in mid roll). The hold itself is untouched. While the map is up the
  finale's clock stands still, so nothing under the map is worked out again in scene 04.
- **Scenes 01 and 02 are left as they are**: at their handovers only small things change speed (the Tower's
  lift, a few px across, by 18 px/s; a corner of a glass reflection that begins its own sweep just then,
  21 px/s), and settling scene 01's hold would have to be carried through the pan into scene 02.
- The original has the same fault and worse: 75, 118, 68 and 21 px/s in scenes 01, 02, 03 and 05.

`check/handover-check.mjs <side>` measures every scene's. This is not something a frame-rate figure or the
pop check sees: the film was "0 frozen steps, 0 pops" with it.

### 3. The film's first frames, and the rear doors (part `r11-first-frames`) (review)

Both are in scenes 01 and 02, both were there before the remake, and both are a thing stopping or starting
dead:

- **The first truck.** For the film's first 0.22 s the truck stood still with its cab inside the left edge
  of a desktop's picture, and then set off at 2,260 px/s in one frame. It now comes in already driving: at
  frame 0 it is off the picture, and from frame 8 on nothing has changed.
- **The rear doors.** The doors' closing ran three and two frames past the frame each scene holds on, so
  every hold stopped them a sixth open: a sliver of door stood ajar on the truck for the whole of scene
  01's hold and on all three trucks for scene 02's, and shut as they drove off. They are shut by the hold
  now: `doorClose [169, 185]` (was `[172, 188]`), `doorsClose2 [380, 391]` (was `[382, 393]`). **This moves
  two beats of the choreography by 0.1 s and under.**

Nothing else in scenes 01 and 02 differs from before, node for node (`check/same-check.mjs`).

### 4. The player (`round2/js/hero-glue.js`)

All four are the site's own player's habits, carried into the remake's.

- **Frame pacing.** The loop waited 14.7 ms before drawing again. That is 60 a second on a 60 Hz and a
  120 Hz screen, but 36, 37.5, 45 and 50 on a 72, 75, 90 and 100 Hz screen, and 48 and 55 at 144 and
  165 Hz. Now it waits 9.5 ms (`PACE`): 60 to 100 a second on every screen. A device that cannot fill a
  fast screen at that pace goes back to the old wait, which is steady (`half`); it is judged by whether its
  drawings come when the pace asked for them (review: judged by every late frame, a 144 Hz screen whose
  drawing took 10 ms fell back to 48 though it was holding an even 72). The screen's own frame time is
  learned again when the screen changes its rate (review).
- **The 30 fps grid on a 90 Hz phone (review).** A 90 Hz phone that cannot fill its screen draws on every
  second frame, 22.2 ms, which sat right on the grid's threshold of 22 ms: it flipped between 45 and 30 a
  second about once a second. The threshold is 23.5 ms now and such a phone holds an even 45. A 60 Hz
  device that misses frames still goes to an even 30, as before.
- **The pause on input.** For 160 ms after every tap, key and turn of the wheel, and for as long as the
  page was being scrolled, the film stood still, on every device. It is kept only where drawing is slow
  (`slowDraw`: the scene's own drawing over 4 ms on a running average, or the 30 fps mode), which is where
  it was needed.
- **The frame a hold begins in (review).** What the clock had run past the entrance's last frame was
  dropped, so that one frame moved the scene by anything from a full step to nothing: on a 60 Hz screen the
  expressway stood still for a frame. It goes into the hold now, as the viewer's clock always did.
- **A click on to 04 in the last moments of 03's entrance (review)** used to drop the road from 324 to
  270 px/s in one frame. The expressway keeps the entrance's pace up to the frame its hold begins at.

`check/pace-check.mjs` plays the real player on simulated screens (a test browser only has 60 Hz):

| screen | drawn a second, before | now |
|---|---|---|
| 60 Hz | 60 | 60 |
| 72 / 75 Hz | 36 / 37.5 | 72 / 75 |
| 90 / 100 Hz | 45 / 50 | 90 / 100 |
| 119 / 120 Hz | 59.5 / 60 | 59.5 / 60 |
| 144 / 165 Hz | 48 / 55 | 72 / 82.5 |
| 240 Hz | 60 | 80 |

Longest stall after a wheel turn, a key or a tap: 167 ms before, none now (133 ms on a scroll, none now);
with drawing made slow (6 ms a frame) the 167 ms pause is still there, as intended.

### What was measured and found sound

- **No number moves in steps.** `check/step-check.mjs` follows every number the scene code writes through
  the whole film at 60 steps a second: nothing is rounded coarsely enough to stand still and then move by a
  visible amount. A reviewer's scan at 240 a second over the film and two loops found no other place that
  changes speed in one frame than those fixed or listed here.
- **The browser moves slow things smoothly.** `check/edge-track.mjs` measures a drifting cloud's place to a
  small fraction of a pixel in photographs, with the real GPU: it glides 0.09 to 0.11 px a frame with no
  frame in which it stands still. The cached layers of round 7 are not snapped to whole pixels.
- **Frames are not dropped.** Phone framing, CPU 4x slower, median of 3 runs, one sitting; frame median and
  share of frames over 16.7 ms:

  | scene | original | before this round | after the loop pass |
  |---|---|---|---|
  | 01 | 10.7 ms, 0.5 % | 9.9 ms, 0.4 % | 10.4 ms, 0.4 % |
  | 02 | 10.3 ms, 3.9 % | 10.1 ms, 0.4 % | 9.7 ms, 0.5 % |
  | 03 | 10.5 ms, 3.5 % | 9.8 ms, 2.7 % | 9.8 ms, 2.7 % |
  | 04 | 11.3 ms, 3.5 % | 8.9 ms, 1.4 % | 8.8 ms, 1.2 % |
  | 05 | 9.5 ms, 0.4 % | 8.7 ms, 0.6 % | 8.3 ms, 0.7 % |

  (Other things were running on the machine, so every figure is higher than round 10's sitting. Compare
  across a row, not with earlier tables.)

### Left as it is, and why

- **The clouds come home against the wind** (above): the owner's to judge.
- **Exhaust puffs flicker behind a truck at speed** (review). A driving puff lives for 90 px of road; above
  about 900 px/s that is under six frames. They are 14 px across and pale, and everything is moving fast
  then (the truck leaving scene 01, the chase into scene 03).
- **Scene 01's truck: its body's bounce as it parks begins at full slope** (review): 71 to 10 px/s in one
  frame on a bounce 6 px high. It reads as part of the stop.
- **Scenes 01 and 02 at their handovers**: the Tower's lift and a reflection, 18 and 21 px/s (above).

### Found, not ours, left for the session that owns them

- `check-player-vs-glue` fails on some runs at a scene 02 or 03 moment, and did so at HEAD before any of
  this (8.6 to 12.8 % against its 8 % limit). Two causes, neither in the film: the pale patch behind the
  copy is still clearing in the clock player when the picture is taken (it clears on the real clock), and
  scene 03 scrolls 270 px/s, so a tenth of a second of start-up lag moves every edge. The finale's moment
  passes every time (0.2 to 0.7 %).
- For the same reason a still or a recording made with the clock player right after a jump to another scene
  can catch the copy's patch half cleared: give it 3 s, or step it by the film's clock.
- `check-viewer` once reported one problem: `net::ERR_NO_BUFFER_SPACE` from the local server while other
  browsers were loading from it. It is the machine, not the film (it explains the one unexplained
  "1 problem" of round 10 as well); the runs after it were clean.
