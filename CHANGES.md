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

