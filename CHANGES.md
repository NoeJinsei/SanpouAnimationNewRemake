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
