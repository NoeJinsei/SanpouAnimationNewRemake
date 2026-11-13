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
