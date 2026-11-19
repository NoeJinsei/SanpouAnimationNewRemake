# Sanpou hero animation — REMAKE project

Read this file and `REFERENCES.md` (same folder) before doing anything. Written 2026-11-13 at the end of the
prep session (Opus 5.5) as the handoff to the build sessions (Fable 5.2).

## What the owner wants

A **remake** of the website's hero animation, in the sense of game remakes (Resident Evil, Final Fantasy):
same game, same story and scenes, much better graphics and features. The current animation is the "original
game"; this project builds the remake.

**The brief for the current round is `PROMPT-FOR-FABLE.md`. Read it first, all of it.**

- **Keep exactly:** the five scenes and their order (01 入荷 receiving, 02 積込 loading, 03 輸送 expressway,
  04 配送ネットワーク map, 05 地域とともに finale), the story, copy, facts, timings and camera path, the
  daylight, and the **named** cast (supplier building, Sanpou warehouse, trucks, Tokyo Tower, Mt Fuji, the
  signs, the map, the plane) in about its place and size.
- **Redraw from a blank page:** every drawing, with a new silhouette and new proportions, not the old shape
  with detail added. The background fields (skyline tiers, cloud field, road traffic) are not cast: they are
  composed again, with new widths, heights, gaps and outline. (This list used to say "layout, every background
  building and its place"; that instruction produced two rejections and is withdrawn.)
- **Raise:** the graphics quality of every element (buildings, roads, sky, clouds, trucks, signs, map),
  lighting and atmosphere, detail, secondary motion, and smoothness — to the level of the Motion reference
  film (see `REFERENCES.md`), in Kurzgesagt-style flat vector, fitting a Japanese logistics company.
- **Avoid** what the reference does badly: inconsistent colours between scenes, oddly shaped buildings,
  dark cyber palettes.
- Never change scenes, story, copy or facts without asking the owner first.

## Hard boundaries

- **Do not touch the website** (`C:\Users\RTX4070TI\Desktop\sanpou-site-v2`) — read it only. The remake is
  integrated into the site only after it is fully finished and approved, as a separate task.
- Website wording / polish is a **separate task** too; not part of this project.
- Before installing ANY new skill, plugin or library: run the `skill-inspector` skill (`skillspector scan
  <folder> --no-llm`) and show the owner the verdict first. Ask before adding libraries (e.g. GSAP, PixiJS).
- Save every link or resource the owner gives into `REFERENCES.md`.

## The original game (source of truth, read-only)

In `C:\Users\RTX4070TI\Desktop\sanpou-site-v2` (git, branch `main`, commit `72862b6`):

- `public_html/assets/js/hero-port-b.js` — all scene art and motion. Remotion-style: every scene is a pure
  function of the frame (`sceneWorld(frame, t)` = scenes 01–02, `sceneTransit(frame)` = 03,
  `sceneNetwork(frame, t)` = 04–05), drawn with `h(tag, props, ...children)` virtual nodes and a positional diff
  patcher (conditional `null`s shift positions — keep node lists stable). One `DAY` palette object holds every
  colour. `truckMotion()` gives trucks spring pitch from acceleration. Timings in `T_WORLD`, `T_TRANSIT`,
  `T_NETWORK`. Exposed as `window.JourneyPort` (`_scenes`, `mount`, `renderMaster`).
- `hero-port-a.js` — map data (`JRMAP`). `hero-flag.js` — sets `JX_CLEAN_HERO`. `hero-glue.js` — the
  player: scene stops, camera, crossfade between two stages, 30fps fallback, input hold, road progress truck.
- `css-src/40-hero.css` — hero overlay (navy copy on a pale-sky wash; never a dark scrim over daylight).
- History of decisions: `docs/superpowers/plans/2026-11-09-hero-animation-polish.md`,
  `docs/superpowers/plans/2026-11-10-hero-daylight-revamp.md`, `docs/qa-shots/`.
- Gotchas: SVG ids must be unique per scene (two stages coexist during the dissolve); `FujiMountain` and the
  finale's lane loop use a local variable `L` (the palette is `DAY`); scenes must render in < ~1 ms/frame today.

## Read `CONTEXT.md` and `HANDOFF.md` first

`CONTEXT.md` says what this animation is for (the hero section of the company's new website), who the company
is, every website involved including their current live site, and every version the animation has been
through since it was a Remotion film.

The owner watched round 1 end to end on 2026-11-13 and rejected the direction: the elements still looked like
the originals with polish on them. The project is now a **full remake** — every element redrawn from a blank
page, same cast and staging, much better drawing and much better motion, done in Fable 5.2.
`HANDOFF.md` has the brief, what changed in the rules, and where everything is.

## Where the project stands (end of the first build session, 2026-11-13)

Done (see `git log`, one commit per pass, evidence in `evidence/`):

- `original/` = untouched copies of the site's hero (check: `cd original && sha256sum -c SHA256SUMS`);
  `remake/` = working copy, still identical to the original.
- **Viewer**: serve this folder (`python -m http.server 8791 --bind 127.0.0.1`, or the `hero-viewer` launch
  config) and open `http://127.0.0.1:8791/viewer.html`. Two "sides" (listed in `sides.json`) drawn for the
  same moment of the site clock (`viewer/timeline.js` = the site player's schedule as a pure function of ms;
  scene 01 = 0–7000, 02 = 7000–14600, 03 = 14600–21800, 04 = 21800–27800, 05 = 27800–45800).
- **Tools** (`tools/`, Node + the Playwright named below): `shots.mjs` (stills, contact sheets),
  `diff-sides.mjs` (two sides at the same moments), `perf-side.mjs` / `perf-table.mjs` (smoothness with a
  slowed CPU and the real GPU; run one at a time), `check-viewer.mjs` (0 console errors, determinism, the site's
  real player incl. rapid clicks and reduced motion), `check-player-vs-glue.mjs`.
- **The look**: `STYLE.md` (rules for every scene) and `CHANGES.md` (what changes per scene; the owner
  approves its rows on a style frame). `research/` holds the reference-film study, the past owner decisions,
  the scene 01 element checklist and a survey of the installed skills.
- **Scene 01 style frame, round 1**: `samples/frame-a/` (side "Style frame"). Waiting for the owner's verdict;
  nothing from it is in `remake/` yet.
- **Renderer**: `engine/vcanvas.js` draws the same scene code on a canvas (side "… on canvas") and matches the
  SVG rendering, so art written in the `h()` vocabulary of `STYLE.md` §2 can be drawn by either engine.
  Measured on the phone framing: the richer scene 01 art is as smooth in SVG as the original, and canvas is
  not smoother (numbers in the commit messages and `evidence/2026-11-13-renderer/`). Recommendation given to
  the owner: stay SVG/DOM, keep the canvas engine as a fallback. Check the owner's answer before building on it.

Round 1 is finished and is now reference material, not the basis for more polish: scene 01 approved and built
with its motion pass, scenes 02 and 03 drawn as style frames in `samples/`, all three merged into
`samples/preview` and recorded (`evidence/2026-11-13-preview/`). The owner rejected the direction after
watching it; see `HANDOFF.md`.

Round 2 (the full remake, in Fable 5.2), as of 2026-11-14:

- **Mt Fuji: approved by the owner** (2026-11-14). It is the level every element is drawn to.
- **`round2/` is the round 2 working copy** (viewer side `round2`, "Remake (round 2)"). `remake/` is round 1,
  set aside. Each redrawn element lives in its own file in `round2/parts/` and is put into
  `round2/js/hero-port-b.js` with `python tools/splice.py round2/js/hero-port-b.js round2/parts/<part>.js`
  (a part file names the code it replaces in `//== REPLACE from "..." to "..."` header lines). Edit the part,
  splice, check; that also lets two helpers draw two elements at once without sharing a file.
- **Scene 01: every element redrawn** (sky and light shafts, clouds, the city as a kit of six building kinds,
  Tokyo Tower, street furniture and road, the supplier building, the truck and parcels, the guard rail).
  Shown to the owner as a style frame beside the original (`evidence/2026-11-14-scene01-r2/`); **check the
  owner's verdict before building on it.** The sky, clouds, city kit, Tower and truck are shared, so scenes
  02, 03 and 05 already show them; the warehouse, the expressway, the map, the airport and the finale's own
  pieces are still the original drawings.
- The owner's verdict on that scene 01: "I do see some changes but I dont see a significant improvement",
  because the skyline layout had been kept. A second pass rebuilt the city with volume (the slightly-3d look,
  which the owner kept) and redrew the map; the owner still wanted a far more drastic change.

Round 3 (started 2026-11-14, brief in `PROMPT-FOR-FABLE.md`):

- **Everything drawn so far is a floor, not a ceiling.** Each element is drawn again and shown as three
  pictures: original, frozen round 2, new. The only settled things are the brief's "Closed" list and the
  company facts.
- **Step 0 is done:** `round2/js` is the one working copy and now holds the rebuilt city, the taller trial
  tiers, the bigger trial Fuji and the teal map (parts `city2`, `skyline-calls`, `finale-city-size`,
  `fuji-size`, `map`, applied in that order after the scene 01 parts). `samples/before-round3` (side "Round 2,
  frozen") is a plain copy of that state, never edited, used as the middle picture of every comparison.
  The `city-v2` and `map-v2` sides and their build scripts are gone. `CHANGES.md` ends with what each element
  becomes in round 3.
- **The film is FLAT 2D (owner, 2026-11-14, after seeing pass 1).** This reverses the "slightly-3d look"
  he had kept. Every building is a straight-on elevation: level top edges, one face, no receding side face,
  no thin band down one side, nothing skewed. Depth comes from overlap, value, scale and haze. It applies to
  everything, drawn already or still to come. **Clouds stay in the sky:** no cloud base below the roofline
  of the tier it is in front of, none sitting down behind the skyline; glass must read as glass (no cloud
  shapes that look like objects inside a tower).
- **Order and gates** (one at a time; stop and wait for the owner's yes at each), as the owner re-ordered it
  on 2026-11-14: 1 the shared art (sky, sun, shafts, clouds, city kit and skyline, Tower, window light,
  Fuji's size), re-shown flat → 2 **the Sanpou warehouse** (the three-bay building of scene 02, never redrawn
  until now: bigger, trucks standing at the docks, packages loading into each truck with smooth animation,
  a forklift at work; then the same working feel at the supplier building's dock in scene 01; references in
  `reference/warehouse-ops/`, notes in `REFERENCES.md`) → 3 **the airport, the terminal and the plane**
  (moved up: he has noticed three times that the plane has not changed) → 4 the rest of scenes 01-02 (truck,
  street, lamps, props) → 5 scene 03 → 6 scene 04 → 7 the rest of scene 05 → 8 the seams and the motion pass
  → 9 the last look. He wants the drawing approved first and the motion built after it, except the loading
  at the docks, which he asked for with the warehouse.
- When the owner says "the warehouse" check which building he means and say it back in one line before
  starting: the **Sanpou warehouse** is the three-bay building in scene 02; the **supplier building** is the
  one in scene 01.
- **Pass 1 was drawn and shown (2026-11-14) in the oblique view** (`evidence/2026-11-14-r3-pass1/`); the
  owner's verdict was the five changes recorded at the end of `CHANGES.md` (flat 2D, clouds up, the plane
  moved up, the warehouse, and his size picks postponed until he has seen it flat). It also held two things
  he pulled forward: the supplier building redrawn modern and a little bigger, and the three map depots.
- **Pass 1 was re-shown flat on 2026-11-14 and the owner picked the sizes: city height B, Fuji size 2**
  (his answer to the flat frames; he asked for no changes). Both are in `round2/js`:
  `SKYLINE_SIZE = { base: 1.12, amp: 1.15 }`, Fuji at the trial size (scene 03 `w: 1480, ht: 596`, scene 05
  `w: 2020, ht: 706`), and the clouds composed by hand for that city height. Parts after the pass 1 ones:
  `r3-flat-city`, `r3-flat-supplier`, `r3-flat-tower`, `r3-flat-depots`, `r3-flat-parcel`, `r3-clouds-up`,
  `r3-size-pick`, `r3-clouds-b`. Details and check results are at the end of `CHANGES.md`; pictures in
  `evidence/2026-11-14-r3-flat/` (`picked-scene01/03/05.jpg` are the chosen sizes). The sizes are closed:
  do not reopen them.
- **The Sanpou warehouse of scene 02: approved by the owner (2026-11-14)** ("The warehouse is right").
  Parts `r3-warehouse`, `r3-clouds-b2` and `r3-sign-jp` are in `round2/js`; evidence in
  `evidence/2026-11-14-r3-warehouse/` and `evidence/2026-11-14-lettering/`; details at the end of
  `CHANGES.md`. Its sign reads 三豊運輸　物流センター (Japanese, never roman only).
- **The supplier building's dock of scene 01 is drawn, merged and shown (2026-11-15), waiting for the
  owner's verdict.** Parts `r3-supplier-dock` and `r3-supplier-dock-fix` are in `round2/js`: an open door
  with stock inside, a roller conveyor carrying six cartons into the truck in place of the hopping parcels,
  the supplier's own blue-grey forklift seen through the door. Evidence in
  `evidence/2026-11-14-r3-supplier-dock/`; details, constants and check results at the end of `CHANGES.md`.
  Open for him: the shutter is up from the first frame (it could roll up), and which comes next, the trucks
  or the airport and plane.
- **The company name on things (owner, 2026-11-14).** The characters are 三豊運輸 (never 株式会社, never
  三豊運送). Both jobs below were done in the batch of 2026-11-15 (see that section): **the trucks** (his note of 2026-11-14 says "the trucks are
  next after the supplier dock", while the order above puts the airport and the plane there: ask him which
  comes first when the supplier dock is shown): on the box side 三豊運輸 becomes the big line and the roman SANPOU the small one under it, the way the scene 04
  card does it, because on a 390 px phone the truck is the only place the name is read (this replaces "truck
  lettering exactly as it is"); **the Sanpou depot in the finale** (with the rest of scene 05): put 三豊運輸
  on it, legible on a phone. Leave all other copy alone: scene 03's caption says 関東一円, which the company
  facts ban, but copy is the owner's call and he has not decided.
- `trial` is a scratch viewer side (`sh tools/build-side.sh trial <part>`, `samples/trial/` is gitignored):
  use it to try a part before splicing it into `round2/js`, instead of adding a side each time.
- **Three checks added with the flat pass:** `node tools/cloud-check.mjs <side> --skip=7417-9139` (no cloud
  base below a roof; `--at=<ms> --roofs` prints every cloud and the roofline for composing; `--fit=<file>`
  with `python tools/cloud-lift.py` lifts clouds on a sample side), and `python tools/sheet.py` (stacks stills
  under label bars: the three-way pictures with the new-versus-old line on them, and the option sheets).
- How the passes are drawn: one fresh Fable helper per element with a self-contained brief, each in its own
  trial side built by `sh tools/build-side.sh <side> round2/parts/<part>.js`, two at a time at most; a cheaper
  model for engineering. The main session reviews the frames, merges the parts, runs the checks
  (`check-viewer`, `motion-check`, `contrast-check`, `sha256sum -c`) and shows the owner.
- A part file's anchors are used up by its first splice. To change something already spliced, write a new
  part whose anchors match the file as it is now; to try something, build a sample side from a fresh copy of
  `round2/js` and point its build script at the part in `round2/parts/` (never a second copy of the part).

## What the owner changed on 2026-11-15

- **The gate is relaxed for this batch.** The rule above is one element at a time, stopping for his yes at
  each. He has now asked for the remaining queue to be worked through and shown together: "work on
  everything else that we are pushing as well and give us its output once they are finished for us to review
  them and give it feedback at the end". Keep committing one pass per element with its own evidence, but do
  not stop for a verdict between them. The per-element gate comes back after this batch.
- **The map's look is Fable's to decide.** He asked Fable to come up with its own style for a moving
  background behind the map, and for the colouring of both that background and the map itself. The options
  built on 2026-11-15 (navy / indigo / slate; lift / light / card) are a floor to beat, not a choice he has
  made. Everything in the "Closed" list still binds.
- **Closed on the map, from his earlier words:** the service area is no longer green; vermilion stays the
  route's alone; scene 04 carries no sky, sun or clouds (`map-nosky.js`); the land is not a plate with
  thickness (`map-flat-plate.js`); the prefecture names are no longer near-black. Grid lines behind the map
  were ruled out long ago — if Fable's own direction needs something near one, it says so and shows it as an
  option rather than slipping it in.
- **Judge every map frame at the desktop and phone framings, never on the bare 1920 stage.** The site crops
  the stage. The "card" background looked the strongest of three on the bare stage and died at the real
  crop, its corners outside the frame.
- **The clouds are being redrawn** in every scene: the owner called them "a bit odd … not that natural /
  professionally designed". The old `STYLE.md` rule is what produced them and has been rewritten. That is
  the third rejection traced to a rule written here (after the footprint rule and the skyline-layout rule) —
  each time the rule described a construction method instead of a result. Write rules as results.

## The batch of 2026-11-15: drawn, merged, shown together, waiting for the owner's review

All of it is in `round2/js` (parts `r4-*`, one commit each with its own evidence folder), and the pictures
are gathered on one page: `evidence/2026-11-15-batch-review/index.html` (open it through the viewer's
server: `http://127.0.0.1:8791/evidence/2026-11-15-batch-review/index.html`). `python tools/review-pack.py
<outDir>` rebuilds the three-way pictures, the desktop and phone sheets, the scene-change strips and the
loading strips; its new-versus-old lines are in the script. Details and check numbers are at the end of
`CHANGES.md`. **Check the owner's verdict before building on any of it.**

- **Clouds** (`r4-clouds`): one silhouette each, wide and low, one pale shade area; the skies composed again.
- **The map's look** (`r4-map-look`): the panel is the sea in the film's blue, the service area Sanpou
  white, moving shallow water off the Pacific coast; four option frames were judged at the real crops (the
  rejected ones are `r4-map-opt-*.js` and on the review page). **Routes** (`r4-map-routes`): vermilion
  dashes moving outward and a small truck on each corridor.
- **Trucks** (`r4-truck`): redrawn; 三豊運輸 is the big line on the box, SANPOU the small one.
- **Scene 05** (`r4-plane`, `r4-finale-ground`): the airliner and its 19 s cycle; the finale's skyline
  composed again under its climb line (it was `y = 968 - 0.56 (x - 614)`; since the fix below the climb is
  steeper, `PLANE.SLOPE` 0.92, so every roof has more room, but still think of the plane before raising any
  roof in `cityFinale()` or anything at the airport); the airport; the Sanpou depot with
  三豊運輸 written downward on a navy band; two-axle road trucks.
- **Values** (`r4-values`): `CITY_LOOK` and `CITY_HAZE` widened from navy to air.
- **The batch was accepted, and four fixes were made on it (2026-11-15, parts `r5-*`, one commit each,
  shown together on the same review page under "The four fixes"; accepted, and round 6 below builds on
  them: the prefecture step and the plane's speed were changed again there):**
  the plane no longer passes behind Tokyo Tower's lattice: it climbs at 42.6 degrees and passes in front of
  the thin mast above the top deck, one slot again (`r5-plane-tower`; the rejected options are
  `r5-plane-opt-front` and `r5-plane-opt-cloud`); the map has moving water off Niigata as well and its
  prefectures step to white while their trucks stand there (`r5-map-alive`); 東京 and 埼玉 are 15 units like
  the other names (`r5-map-names`); 入間 stands beside 志木 with no dots or stub (`r5-map-hub`).
  **The fixes added no nodes (1133 to 1059 elements on the stage). Node count is the film's cost, not
  script time: say the number whenever a pass adds nodes.** `tools/sheet.py` now writes Japanese in its
  label bars.
- **What a viewer really sees** (measured, every scene, 2026-11-15; design to it, never to the bare stage).
  Desktop is the full width at stage y 60 to 1020, with a dark band over the lower third and the caption
  over the lower left. A 390 px phone sees a strip about 550 to 615 stage px wide, full height:

  | scene | phone sees (stage x) |
  |---|---|
  | 01 入荷 | 644 – 1191 |
  | 02 積込 | 763 – 1309 |
  | 03 輸送 | 631 – 1187 |
  | 04 map | **708 – 1322** |
  | 05 finale | 991 – 1598 |
  | 05 climb | 955 – 1553 |

  Re-measure with `node tools/crop-table.mjs <side>` (it reads the stage's
  `getScreenCTM()` on `viewer/frame.html?framing=site` at each viewport) if the camera path ever changes.
- Three scratch sides exist (`trial`, `trial2`, `trial3`) so helpers can build side by side. A helper
  stopped by the usage limit is resumed with a message to it; its part file on disk survives.

## Round 6 (2026-11-15): accepted (round 7 below builds on it)

Asked for after the four fixes were accepted; parts `r6-*`, one commit each with its own evidence folder,
gathered on `evidence/2026-11-15-round6-review/index.html` (through the viewer's server). Details and
numbers are at the end of `CHANGES.md`. Accepted on 2026-11-15: scene 03, the street, the steered map
trucks, the arrival ring and the plane's speed stay as they are.

- **Map trucks** (`r6-map-corridors`, `r6-map-truck`): the owner saw them slide ("sliding by the side
  rather than actually driving"). The truck is a plan view (4 nodes), steered along its corridor;
  `mapTruckAt` returns the heading. No corridor passes under a name card: Niigata's rounds the 志木 card on
  the east, Tochigi's moved over, Gunma's shares Saitama's road to the gap between the two cards and
  branches north, so a corridor is one or two curves. Rejected: `r6-map-truck-opt-side`, `-opt-paper`.
- **The arrival** (`r6-map-arrival`): the prefecture no longer steps to white (`MAP_ANSWER` is gone); the
  place dot opens into a ring while its truck stands there. `r6-map-arrival-opt-onewhite` is an extra
  picture for the owner (the service area one flat white), not the pick.
- **The plane on a phone** (`r6-plane-slow`): the accepted path past the Tower's mast is kept; the speed
  along it changed (`PLANE.CLIMB_V` 74 px/s over the ground, then it gathers speed `PLANE.ACC_AT` s after
  lift-off). Cycle 26 s. A phone's only open sky in the finale is the band between the two buttons (stage
  y 356) and the roofs, left of the Tower: half or more of the plane is in it for 4.1 s (was 1.1 s),
  measured by `node tools/plane-visible.mjs <side>`. The pass at the Tower now comes at 45.4 to 46.9 s on
  the site clock, after the last scene's dwell: the finale holds and its clock runs on, and
  `viewer/timeline.js` lets tools ask for moments past 45.8 s. Rejected speeds: `r6-plane-opt-fast`,
  `-opt-slow`.
- **Scene 03's road** (`r6-expressway`) and **the street of scenes 01 and 02** (`r6-street`): the last
  original and round 2 drawings IN THE SCENE CODE, drawn again from a blank page. (This line used to say
  that nothing in the film was an original drawing any more. That was not true: the little truck on the
  progress bar was still the site's original until 2026-11-16. See "What is in the picture but not in the
  scene code" below.) The sign wording and scene 03's caption (関東一円, the owner's call) are
  untouched. The street has 3 lamps where there were 11 (eight were never seen).
- **Nodes** (`node tools/node-count.mjs original round2`, elements on the stage per scene; original /
  before round 6 / now): 01 1337 / 1588 / 1472, 02 1372 / 1599 / 1483, 03 1254 / 1290 / 944,
  04 778 / 1059 / 1017, 05 777 / 1058 / 1016. No pass added a node. **Fewer nodes did not make it
  smoother:** on the slowed phone the frame median is 9.4 / 11.8 / 8.5 / 5.9 / 7.7 ms in scenes 01 to 05
  against the original's 6.2 / 6.8 / 6.3 / 5.9 / 5.6, about where it stood. Scene 02 is the heaviest. What
  costs is what is painted (the city rows, the trucks), so that is where the motion pass should look.
  (Round 7 found what it was: redrawing still scenery every frame. See "The cost" below.)
- The seams and the motion pass were not part of round 6; they are round 7, below.

## Round 7 (2026-11-15 and 16): built, merged, shown together, waiting for review

Round 6 was accepted. Round 7 was four corrections on it and then the half of the brief that had never
been touched: the seams, the motion pass and the cost. Parts `r7-*`, one commit each; shown on
`evidence/2026-11-16-round7-review/index.html` (through the viewer's server), with clips. Details and
numbers are at the end of `CHANGES.md`. **Check the verdict before building on any of it.**

- **The four corrections:** the map truck redrawn at 1.5 times (`r7-map-truck`: box, gap, narrower cab,
  tyres, a shadow; rejected `-opt-sizeonly`, `-opt-125`); the map 36 px higher (`r7-map-lift`); 神奈川's ring
  open on the name's side (`r7-map-ring`); no power lines across Tokyo Tower (`r7-tower-wires`).
  The map against the desktop band was left open here (36 px was all a phone left) and was closed on
  2026-11-16: see "Three fixes on round 7" below. `node tools/map-band.mjs <side>` prints the numbers.
- **Every scene change is a camera move** (`r7-seams`, `r7-seam-fix`, and the remake's own player
  `round2/js/hero-glue.js`). 02 -> 03: the camera goes after the departing trucks along the road, the
  street gives way to the expressway at its fastest moment (`SEAM23`, `seam23X`), and it lands riding with
  the convoy. 03 -> 04: the expressway, still running, goes down out of the frame as the map comes down
  into it (`SEAM34`, `seam34`): one stage, two slots, no dissolve. 01 -> 02 (the pan) and 04 -> 05 (the
  map's retreat) keep their frames and land on `landEase`. The phone camera moves from scene to scene on a
  1.8 s ease (`camEase`), not at a fixed chase rate. The dwells, `ENTER_RATE`, the five stops and the
  camera paths are untouched: only how a move eases changed.
- **The viewer's clock player follows the side:** `JourneyPort.SEAM23` / `seam34` in a side's scene file and
  `schedule.camEase` in `sides.json` switch `viewer/timeline.js` and `viewer/player.js` to the new seams and
  camera; a side without them (the original) plays as before. `samples/before-round7` (side "Before the
  motion pass, frozen") is the working copy after the four corrections and before all of this, never edited.
- **Nothing pops** (`r7-pops-landings`): scenes 01-02 have ONE ambient clock (the trucks' idle used to step
  back a pixel at 14600 ms); the finale is no longer faded in as one group (every gradient used to shift a
  level at 28700 ms): it stands finished under the map's opaque panel. `motion-check` on the whole film:
  0 frozen steps, 0 pops, in every scene.
- **The route line** (`r7-route-line`): the roads' centre dashes (street, expressway, finale road) are the
  vermilion of the map's corridors, `DAY.routeLine`. Its own commit, so it can be dropped alone.
- **The cost (`r7-cost-a`, `r7-cost-b`). Read this before adding anything that moves.**
  What the remake cost was not its script and not its node count: it was REDRAWING. Everything shared one
  layer, so any change anywhere made the browser draw the whole scene again (13.6 ms a frame of raster work
  in scene 02 against the original's 0.4 ms; `node tools/trace-side.mjs <side> --from --to` shows it).
  The engine's rules now:
  - a group with `data-cache` is a finished drawing and **gets its own layer** (`will-change`), drawn once.
    Give `data-cache` to anything big that only ever moves as a whole. Do not put something that changes
    inside one (its layer is drawn again whenever it changes). `data-layer` on such a group opts out (the
    buildings of a row that already has a layer).
  - **a scene is a stack of pictures**, not one svg (scenes 01-02): live pictures (`h("svg", PIC, ...)`) and
    still ones (`stillPic(x, ...)`, the rows of the city, moved by the camera as layers). Keep the order.
  - a single filled shape's `opacity` is written as `fill-opacity` by `h()`: same picture, no effect node.
    A GROUP with opacity is still expensive (the browser draws it through a buffer): avoid new ones.
  - the patcher skips a node whose description is the very object it was last patched to, so drawings built
    once and kept (memoised) cost nothing per frame. Never change such an object after it is built.
  Measured back to back in one sitting (phone @2x, CPU 4x slower, the finished film, after the three
  fixes): original 74 to 75 fps, median 13 ms, 6 % of frames over 16.7 ms; remake 83 to 85 fps, 11.3 to
  11.6 ms, 3 %. (The reviewer's own sitting: original 58.4 fps / 15.7 ms / 41.5 %, remake 77 / 12.6 / 12.6.) Per scene the remake is at
  or better than the original in all five. Always report both sides from the same run.
- **Already there, checked, not added to:** ambient motion in every hold (clouds, birds, the Tower's beacon,
  cranes, lit windows, exhaust, both forklifts, the airport's windsock, radar and baggage train, the map's
  water and dashes) and weight wherever a truck moves (`truckMotion`, the forklifts' pitch, `mapRunEase`).
- **Three fixes on round 7 (2026-11-16, parts `r8-*`, shown on
  `evidence/2026-11-16-three-fixes-review/index.html`, waiting for review):**
  - **The map's place is closed** (`r8-map-lift`, the reviewer's own answer): `MAP_BOX` top -77 (the full
    89 px, full size) and the name 新潟 moved into Niigata's own land (`MAP_LABEL.NIIGATA` at 376, 592, with
    `at` keeping its wipe's aim). Hub and all three cards 0 % under the desktop band, 東京 4 %, 新潟 17 px
    under the phone's buttons. Do not make the map smaller: at 1 u = 1.417 px the map truck's gap, tyres
    and windscreen fall under the 3 stage px floor.
  - **The map truck** (`r8-map-truck`, then `r9-map-truck-tail`): the film's own truck seen from above: a
    long white box inside ONE NAVY OUTLINE with the vermilion stripe as a band across its tail, one navy cab
    joined to the box with the windscreen across it, four short wheel marks. Steering, wheelbase, shadow and
    the 1.5x size are round 7's. Rejected, kept as parts: the stripe along both sides
    (`r9-map-truck-opt-sides`: Fable's first pick, taken out by the reviewer) and a gap behind the cab
    (`r8-map-truck-opt-gap`). Why the outline won, as a result to hold to: **at about 29 stage px a thing
    on the map needs a dark edge all round to read as an object, and on the map vermilion means ROUTE:**
    **nothing that drives on a route may carry vermilion along its length.**
  - **The truck on the progress bar** (a direct edit of `round2/js/hero-glue.js`, `truckEl.innerHTML`): the
    film's truck at the same 30 x 16 CSS px. **Its cab is closed (2026-11-16): it keeps the lighter navy,
    #30466f. Do not reopen it.** Turned down, a picture only (`evidence/2026-11-16-r9-progress-truck-cab/`):
    the film's own cab navy with a light edge. At real size the two look the same, and it costs a node.
- **What is in the picture but not in the scene code. Look here too when asked to redraw "everything":**
  - the little truck on the progress bar: `round2/js/hero-glue.js`, `truckEl.innerHTML`, an inline SVG. Its
    box must stay 30 x 16 CSS px: the site's CSS places it (`.sjx-truck { top: 50%; margin-top: -15px }`)
    and this project does not touch the site. Keep it ONE assignment of quoted pieces: the viewer's clock
    player reads the drawing out of each side's own glue file (`viewer/frame.html`), so a side shows its
    own truck and there is no second copy to forget.
  - the bar it rides (`.hc-fill`), the dark band, the pale wash, the copy, the two buttons, the caption:
    the site's HTML and CSS (`original/site/`, `original/css/40-hero.css`), READ ONLY. For the integration
    task: beside the redrawn truck the bar's flat vermilion dashes read a little crude at 2x.

## Two things the owner raised on 2026-11-16, both the WEBSITE, both still open

He watched the film and said it "looks pretty good overall, for now". These are for the integration task,
not this project; nothing has been changed. **Do not touch the site; ask him before acting on either.**

- **The copy wash on the left: BUILT on his "yes, start it" (2026-11-16), waiting for his verdict.**
  He asked whether the fade should be there at all, "since it blocks half the animation section". It was
  worse than half: on a 1440 desktop `.hc-scrim::before` was .86 opaque at x 0, .72 at x 720 (half the
  screen) and only clear at 1040, full height, and on scenes 02 and 03 `.hc-scrim-sign` sat on top of it
  - up to 95 % opaque together. On a phone it is a different rule, a band across the TOP. It could not
  simply go: with it off the headline crosses the supplier building's dark storey at t=0 and measures
  1.33:1 against the 3 it needs, and narrowing it does not help because the worst spot is outside any
  narrower wash. The four options are in `evidence/2026-11-16-opus-copy-wash/`.
  **What was built:** the copy and BOTH washes are up on the opening scene, then clear so the film plays
  in the whole frame, and come back when the film is paused, when the copy is focused, and under reduced
  motion. That is what the site ALREADY did on scene 04; these rules apply it to every scene after the
  first. `round2/css/hero-copy.css` (40 lines, ADDITIVE - the site itself is untouched); the class
  `copy-out` is set by `round2/js/hero-glue.js` `mark()` and `viewer/player.js` `controls()` on every
  scene after `COPY_UNTIL` (0 = the opening only; change that one constant to keep the copy up longer).
  A side may now carry its own stylesheets (`sides.json` `"css"`, one path **or a list** in cascade order,
  loaded by `viewer/frame.html` before the side is ready); the `original` side has none, so it still shows
  the old behaviour for comparison.
  **The wash itself is now a PATCH, and the phone layout is rebuilt (2026-11-17, the owner picked "faint").**
  `round2/css/light/patch-faint.css`, loaded after `hero-copy.css`. The half-screen wash is replaced by a soft
  local ellipse behind the copy block; when the copy clears it drifts up and left and swells over 1.5 s while
  the words rise 10 px. On a phone the copy block is ~110 px shorter (two content-width buttons in place of
  two half-screen slabs, smaller headline and tag), so the film starts that much higher. Three rules that
  cost real contrast when they were got wrong, all measured: **faint (.64 peak) is the FLOOR** - one notch
  fainter and the desktop sub-copy is 3.29 against the 4.5 it needs; **the copy needs TWO strengths**, because
  paused or focused it returns on a scene the faint patch was never sized for (headline 2.47 over the
  expressway), so `.is-static` and `:has(.hc-content:focus-within)` go to full strength and let the second
  wash back; and **the site's own mask must be KEPT** (opaque to 70% of the height, gone by 88%) - clearing it
  let the pale patch reach the dark caption band and dropped the caption text to 2.43. The stronger options he
  did not take are kept: `patch-strong.css`, `patch-soft.css`, `patch-whisper.css` (the one that fails).
  Pictures, clips and the check results: `evidence/2026-11-16-opus-copy-clears/index.html`.
  **The remake's two whole-film recordings were made again with it** (`evidence/2026-11-16-the-film/`,
  16 November 20:05): the remake now plays with the copy clearing, the original keeps the overlay the
  site has today, so each pair shows both changes at once. All four checked whole with the new
  `sh tools/check-recording.sh <file.mp4>` - 2880 frames, none repeated, none off the beat.
  New tools: `check-copy.mjs` (the real player: up on the opening, gone while it runs, back on pause,
  on keyboard focus and under reduced motion - it FAILS on the `original` side by design, since that side
  has no stylesheet); `contrast-check.mjs` takes `--css=<file>` and `--static` (measure with the hero
  paused, so copy that is normally faded out is measured too); `scrim-shot.mjs` shoots the hero at any
  wash strength (`--states=before,after`).
- **The wording: three directions drawn for him on 2026-11-16, waiting for his pick. NOTHING IS CHANGED.**
  He has never liked it: "doesnt sound like a text or phrase a person wrote it, doesnt sound natural like
  what other websites for a logistics company uses it." The copy is `original/site/hero-section.html`
  (read-only here) and **copy is HIS call**; the facts are fixed (関東1都6県と新潟市方面, 昭和50年創業,
  板橋・志木・入間の3拠点, 32台, 輸送・保管・流通加工・3PL).
  What is genuinely off, as against taste: the headline says where TO, then where FROM, then the verb,
  which is backwards in Japanese; 「方面」 is timetable language; the sub is one 70-character sentence
  carrying six facts. 「昭和50年」 is NOT a fault (it carries the age better than 1975 would) - it is only
  said twice. The five scene captions were read and are fine.
  Three rounds of options have been drawn, all in `evidence/2026-11-16-opus-wording/` with their reasoning:
  A/B/C (`copy/hero-copy-options.json`), then the B2B set D1-D4 (`copy/hero-copy-b2b.json`), then
  **E1-E4 (`copy/hero-copy-basic.json`), which is the live set** - `basic-desktop.jpg`, `basic-phone.jpg`.
  **His two rules, given on 2026-11-16 after D: do not emphasise the years of operation, and do not lean
  on 企業** (he wants to stay open about who he carries for), "just a bit more basic but still relatively
  impactful". So D1-D4 are dead and so is anything built on 創業 / 半世紀 / 昭和50年 or 企業.
  E1 「板橋から、／関東と新潟市へ。」, E2 「毎日の荷物を、／確かに運ぶ。」,
  E3 「関東と新潟市をつなぐ／毎日の物流」 (体言止め, no punctuation), E4 「荷物を、まっすぐ運ぶ。」 (one line).
  **PLACE NAMES ARE OUT (2026-11-17), and that kills rounds A-F entirely.** His words on F1-F4: "None
  really clicks with me, maybe because we are emphasizing the names of the location / city / prefecture too
  much here, when that is not the main message we want to write on the hero section of our website." A
  survey of 90 readable Japanese logistics heroes (`research/jp-hero-survey-2026-11-17.md`, every link in
  it) backs him hard: 13 name a place, but seven of those are search-engine sentences on template sites,
  **exactly ONE is a written place slogan**, and **not one of the 90 is built as "from X to Y"**. It also
  found the other reason the drafts read wrong: **every hero that is a sentence puts the VERB LAST and what
  it acts on FIRST**, and **no hero carries facts** (so the tag and sub below, which carry all of them,
  stay). The live set is round 5, `copy/hero-copy-message.json` + `message-desktop.jpg` / `message-phone.jpg`:
  **G2 「受け取る手で、送り出す。」** (the reviewer's pick: one house from intake to dispatch, their real
  differentiator, said without naming a service), **G1 「角ひとつ、つぶさない。」** (the workflow's own pick;
  a native ear must settle whether it reads as a depot safety slogan), G3 「同じ屋根の下に／棚と荷台」,
  G4 「荷物を整える運び手」, G5 「また朝が来て、／また運ぶ。」. The three message types that fit are
  PROMISE, ROLE and IDENTITY; SCOPE, CHANGE, CHALLENGE, BENEFIT and INVITATION are traps, with reasons in
  the survey. Words already killed with their reasons, so the ground is not walked twice: 荷物 (scene 01's
  caption shares the frame), 届く／届ける, 棚に並ぶ, 置いておく, 静かに, and any noun-ending line carrying
  punctuation.
  **Superseded, kept only as history:** he had picked the SHAPES of E1 and E3 and asked for better words
  inside them ("Either E1 or 3, but I think it could worded better"). Round 4 (`copy/hero-copy-final.json`, `final-desktop.jpg`, `final-phone.jpg`,
  a workflow of 8 agents) is the live set: **F1 「板橋から、／関東と新潟市へ運ぶ。」** (the reviewer's pick:
  E1 plus the one verb it lacked), F2 「板橋から／関東と新潟市へ」 (no punctuation), F3 「板橋から関東と新潟市へ」
  (one line), F4 「関東と新潟市へ運ぶ／板橋の三豊運輸」 (the answer to E3). Nine of ten other finalists were
  killed on checkable grounds, recorded in the evidence note: **no 32台 in a headline** (it is in the sub and
  the fleet is spread over three bases), no 「倉庫も車も自社で持つ」 (ownership is not in CONTEXT.md),
  no 「板橋から…まで」 (板橋 is in 関東, so から…まで ends where it starts), no 届ける (his current
  「お届けします」 with the politeness clipped, and the parcel register the B2B round threw out), no 今日も and
  no 走る (driver-recruitment cadence), and nothing opening 「荷物を、」 (scene 01's caption breaks there and is
  on screen with the headline). Structural, for later: 関東と新潟市 is now on screen four times at once
  (headline, tag, sub, scene 04's caption) - room for the H1 has to come from shortening the TAG.
  **Twelve Japanese logistics heroes have now been read** (`REFERENCES.md`): at most ONE 、 in a headline
  and never one in both lines (his own note); a ONE-LINE headline is the commonest shape of all, 5 of the
  12, and on this site it lifts the buttons and opens the picture; 企業 is in none of the twelve; and the
  only one that opens with 半世紀 is 服部運輸倉庫, a carrier in 板橋 like him. Keep 新潟市, never bare
  新潟: the company covers 新潟市方面, not the prefecture.
  **The phone sets the shape:** `.hc-line` is `white-space: nowrap` at `clamp(21px, 6.6vw, 30px)`, so a
  headline line has 358 px on a 390 px phone. The line as it stands uses 345. The polite ending
  「確かに運びます。」 needs 394 and the spelled-out 「関東1都6県」 needs 423: both overflow.
  `node tools/copy-shot.mjs <side> <sets.json> <outDir> [--framing=]` renders any wording in the real hero
  and prints each line's width against that 358. It touches no file.
  **Before any of it ships a native writer should read it**, and the owner must choose.
- Also found while measuring, pre-existing and unrelated: `contrast-check` fails one row,
  `track unfilled` 1.00 against the needed 3 - the site's own progress bar over a pale sky. It fails on
  the `original` side too (1.05 on a phone), so it is the site's, not the remake's.
- **「関東一円」 is CLOSED, and was never a problem.** It is in `hero-port-b.js` twice
  (`CONTENT.brand.commitBody`, scene 03's `SceneCaption`) but both sit inside `SceneTitle` /
  `SceneCaption`, which `return null` when `window.JX_CLEAN_HERO` is set, and `hero-flag.js` sets it.
  Dead code; it never reaches the screen. Earlier notes called it an open copy question - it is not.
- **The film is finished to the brief** (the reviewer, 2026-11-16): every drawing remade, both seams as
  camera moves, no pops, the route line through, and smoother than what it replaces. **Start nothing else.**
  The owner watches it end to end next; putting it into the site is a separate task that does not start
  until he has said yes to the film. (He watched it on 2026-11-16 and gave two notes, the birds and the
  sky: see "Round 10" below. His yes to the film is still to come.)
- **The finished film, recorded end to end for watching** (2026-11-16; the film itself unchanged):
  `evidence/2026-11-16-the-film/index.html` (through the viewer's server) plays four recordings with no
  cuts, 0 to 48000 ms at 60 fps: the remake and the original, on a desktop (1440 x 720, the hero section)
  and on a phone (780 x 1360, `--dpr=2`). The plane's pass at the Tower (45.4 to 46.9 s) is in them.
  **If the film OR the overlay changes, record them again** (`tools/record.mjs`, the commands are on the
  page) and check each one with `sh tools/check-recording.sh <file.mp4>` (frames, repeats, the beat).
  The remake's two were last made on 16 November at 20:05, with the copy clearing after the opening. **The viewer's server
  (python's `http.server`) cannot send part of a file, so a `<video>` played straight from it cannot be
  scrubbed:** that page fetches each film whole and plays it from memory. The clips on the round 7 page
  play but cannot be dragged, for the same reason.
- New tools: `check-seams.mjs` (the real player plays both moves, at both framings, and by click),
  `trace-side.mjs` (where a frame's time goes), `what-moves.mjs` (where two moments differ),
  `what-changes.mjs` (what the patcher writes per step), `map-band.mjs`; `record.mjs` takes `--dpr=2`.
  `sheet.py` gives every tile of a row the same label bar (a second label line used to shift one picture).

## Round 10 (2026-11-16): the birds and the sky, waiting for the owner's verdict

The owner watched the film end to end and said: "It is nearly perfect, but the way the birds are flying is a
bit odd personally. Also, might need some polishing on the sky / clouds as well, make sure its all smooth
and natural looking." Parts `r10-birds`, `r10-sky` (in that order); shown on
`evidence/2026-11-16-r10-birds-sky/index.html` with before/after clips; the whole film recorded again on
`evidence/2026-11-16-the-film/index.html`. Details and numbers at the end of `CHANGES.md`; the rules it
leaves are in `STYLE.md` (Birds, Streaks, the sun, the sky's clock). **Check his verdict before building on
it.** Nothing else in the film was touched.

- **Birds: a bird goes where it points, at a pace its wings could give it.** The old ones were drawn
  head-on and slid sideways (the fault he had already seen in the map trucks). Now one small solid model
  (`BIRD_KIND`) is turned to its heading and seen from below (`birdD`); the flock flies right in side view,
  a few beats then a glide (`birdBeat`), each bird on its own time; the kite really turns round its circle.
  Still one path per scene. `BIRD_SETS` says where they fly. On a desktop the headline stands over stage
  x 160 to 1075 from y 264 down, so a flock keeps above y 264 while it is left of 1075, and it passes under
  the sun's ring. The finale's flocks come round every two plane cycles (`span: 52 * 52`): one crosses
  Tokyo Tower every 26 s, nine seconds before the plane. Keep that if the plane's cycle or the birds' speed
  changes.
- **Sky:** the sun stands clear in every scene (the streak that lay across it is a high streak to its
  left); streaks are lens-shaped paths written out whole (`CLOUDS[k].path`); the finale's sky has its own
  clock (`skyT`) and starts from rest at its own pace when the map draws back (it used to dart 23 px in
  0.4 s). The cumulus clouds were looked at and left as accepted.
- **Tools:** `node tools/sky-motion.mjs <side>` follows every cloud through the film and lists any that
  goes faster than its drift, jumps or pops. `sh tools/cut-pairs.sh <before dir> <after dir> <out dir>`
  cuts before/after clips out of two sets of whole-film recordings.
- **If the film changes again, record the four films again** (the commands are on the film page) and say
  so on that page.

## Round 11 (2026-11-17): the finale loops, and five things that were not smooth. ACCEPTED (round 12 below changed three of its numbers)

Brief `PROMPT-FOR-FABLE-LOOP.md` (his words: the last scene "a complete seamless loop", and the film to
"look 60 fps like (smooth without any jaggedness or issues)"). Four passes, one commit each; shown on
`evidence/2026-11-17-round11-review/index.html`; details and every number at the end of `CHANGES.md`; the
rules it leaves are in `STYLE.md` §5. **Check his verdict before building on it.**

- **The finale is the same picture every 52 s** (parts `r11-loop-sky`, `-birds`, `-city`, `-ground`).
  Every moving thing in it goes round a whole number of times in 52 s (`LOOP`, `loopW`, `loopT`, `loopN`);
  nothing is reset, so there is no seam. The loop starts with the finale's hold (30.4 s into the film).
  Parts other scenes share take the loop as an argument and are unchanged without it.
  **Anything new that moves in the finale must pass**
  `node evidence/2026-11-17-finale-loop/check/loop-check.mjs round2 --from=30420 --step=16.6667 --turns=2`.
  - **The clouds.** A cloud that drifts one way cannot loop in 52 s, so in the finale they go out and come
    home on one sine: for half of every loop they move back against the wind. He accepted that, and asked
    for them a bit faster (round 12: `SKY_SWAY = [75, 165]` px; it was `[53, 116]`).
  - Things that share a patch of the picture are on rounds that fit each other: the plane 26 s, the baggage
    train once in each of the plane's flights (19 s crossing, then it waits behind the depot), the kite four
    turns a loop (at the right-hand end of its circle whenever the plane passes: `turns: 4, turn0: 2.684` since round 13),
    a flock across Tokyo Tower nine seconds before each plane. **Change one and check the others.**
  - The road runs on 52 s (it was 38): `MINI.C`, `MINI.GAP`. The two depot trucks swap drawing slots 20 s
    after each departure, unseen, so every node repeats.
- **Nothing loses a sixth of its speed when a hold begins** (`r11-handover`). The player plays an entrance
  1.2 times as fast as a hold. Scenes 03 and 04: the hold sets off at the entrance's pace and settles
  (`holdSettle`; the scene is 0.15 s ahead afterwards). Scene 05 has its own clock (`now`), one second a
  second from the frame the map draws back; the map's is `mapT`. `ENTER_PACE` in the scene file must stay
  equal to the player's `ENTER_RATE`. Scenes 01 and 02 keep two tiny steps (the Tower's lift, a glint).
  `check/handover-check.mjs <side>` measures them.
- **Scene 01's first truck and the rear doors** (`r11-first-frames`): the truck drives in from outside the
  picture (it stood at the left edge for 0.22 s and then jumped to full speed); the doors are shut by the
  frame each scene holds on (`doorClose [169, 185]`, `doorsClose2 [380, 391]`: two beats moved by 0.1 s
  and less, said to the owner on the review page).
- **The player** (`round2/js/hero-glue.js`): 60 to 100 drawings a second on every screen (`PACE` 9.5 ms; it
  was 36 to 55 on 72, 75, 90, 100, 144 and 165 Hz screens); the 160 ms pause on input only where drawing is
  slow (`slowDraw`); what the clock ran past an entrance goes into the hold; a click on 04 during 03's
  entrance no longer drops the road's speed. `check/pace-check.mjs` and
  `evidence/2026-11-17-player-pace/check/` play the real player on simulated screens (a test browser has
  only 60 Hz). **The viewer's clock player and the recordings do not use this file**: its faults and fixes
  show only in the real player.
- **How it was checked.** `evidence/2026-11-17-finale-loop/check/scene-lab.mjs` runs the scene code in Node
  with the viewer's clock, with no browser: every node of every frame can be compared (`loop-check`,
  `same-check` against a folder holding the code as it was, `step-check`, `handover-check`). Use it before
  the browser tools; it takes seconds. Three reviewers then went over the uncommitted work with one lens
  each (the loop, everything outside it, what still was not smooth) and found the train under the plane, the
  kite behind the plane, the first truck, the doors and four faults in the player's first fix. Do that again
  for work of this size.
- **Left, with reasons** (end of `CHANGES.md`): exhaust puffs flicker behind a truck at full speed; the
  first truck's parking bounce begins abruptly; scenes 01 and 02's tiny handover steps.
- **`check-player-vs-glue` fails on some runs at a scene 02 or 03 moment, and it is TIMER JITTER, not the
  overlay.** Round 11 attributed it to the copy's patch still clearing in the clock player and handed it to
  the session that owns `tools/`; **that attribution was checked on 2026-11-17 and does not hold**
  (`evidence/2026-11-17-opus-round11-check/`). Measured with the overlay stylesheet OFF the scene 03 figure
  is 7.85 %, with it ON 7.32 %, and on a later clean run 4.99 % — **removing the overlay makes it worse, not
  better.** The tolerance is `pct < 8` and its own comment says why it sits there: "the expressway scrolls
  270 px a second, so 20 ms of timer noise already moves every edge there." It is noise on the fastest
  scrolling scene, it is nobody's defect, and it should not be chased. Round 11 was right that it failed the
  same way before its changes. (Still true and worth keeping: a still or a recording made right after a jump
  to another scene can catch the patch half cleared, so give it 3 s.) `check-viewer`'s occasional "1 problem" is
  `net::ERR_NO_BUFFER_SPACE` from the local server when many test browsers have been run in a short time.
- Recording is slow (about 4 frames a second for one recorder): run several `tools/record.mjs` side by side.
- The four whole-film recordings and `films/remake-2.mp4` were made again at the end of this round.

## Round 12 (2026-11-18): the clouds a bit faster, the plane builds speed from its roll. The clouds ACCEPTED; the plane turned up again in round 13

Brief `PROMPT-FOR-FABLE-SPEED.md` (his words: the cloud "a bit faster"; the plane "sped up based on its
acceleration when it is departing from the runway, kind of like an actual plane flying"). Parts
`r12-clouds-faster`, `r12-plane-accel`; shown with before/after clips on
`evidence/2026-11-18-round12-speed/index.html`; numbers at the end of `CHANGES.md`. **His verdict
(2026-11-19): "I think the clouds are fine, but the plane could accelerate just a bit faster than what we
have."** So the clouds are closed, and the plane's numbers below were turned up in round 13 (next section:
read the plane's numbers there, not here). The 52 s loop is intact (`what-moves round2 32000 84000` 0.00 %, `loop-check`).

- **Clouds:** `SKY_SWAY = [75, 165]` px, one sine a loop still (4.5 and 10 px/s at their fastest, 1.4 times
  what it was). Two sines a loop was rejected: they would turn back twice as often. At the far end the big
  left cloud is 71 px over the edge and the small one rests 20 px beside Tokyo Tower's top deck: more
  travel than this needs a look at both.
- **The plane's speed only ever rises** (`planeRun`, `planeGain`): the roll as it was, the push easing to
  `CLIMB_A` 6 px/s2 from `EASE_AT`, rising to `SURGE_A` 45 from `SURGE_AT`, which is when it is in front of
  the Tower and above a phone's buttons. 85 px/s as the wheels leave, 112 to 129 across a phone's sky, 131
  at the Tower, 227 leaving. The path, the 26 s cycle and the moment it passes the Tower are unchanged
  (`PLANE.HOLD` is 4.24 s: it stands lined up for the time the quicker climb saves).
- **A phone sees it for less:** half or more of the plane in a phone's open sky for 3.0 s (4.7 before),
  80 % for 1.9 s (3.3). **He accepted that on 2026-11-18 ("Yes, keep it"): it is closed, do not reopen
  it.** (His answer was to that one question; his verdict on the rest of round 12 is still to come.) If the
  plane's speed is ever changed again, measure this again and say both numbers; a gentler climb
  through that patch is the lever (`CLIMB_A`, `EASE_AT`), and `node tools/plane-visible.mjs round2` measures it.
- **Everything timed to the plane hangs on three numbers.** Change `PLANE.HOLD` or the speed and check:
  the kite's `turn0` (it must be at the right-hand end of its circle when the gear is at x 1250), the
  baggage train (tied to `PLANE.HOLD` in `Airport`: it once came up to 12 px behind the tail), the flock
  nine seconds ahead at the Tower. The pitch and the body's height are read by the place (`planeRollS` on
  the runway, `planeOldS` in the air), so the speed can change without moving the path.
- `films/remake-3.mp4` is the film after this round; remake-1 and remake-2 are untouched.

## Round 13 (2026-11-19): the plane accelerates a bit faster. Waiting for the owner's verdict

His words on round 12: "I think the clouds are fine, but the plane could accelerate just a bit faster than
what we have." Part `r13-plane-quicker` (numbers only, no code); shown with before/after clips on
`evidence/2026-11-19-round13-plane/index.html`; numbers at the end of `CHANGES.md`. **Check his verdict
before building on it.** The clouds were not touched. The loop is intact (`what-moves round2 32000 84000`
0.00 %, `loop-check`); scenes 01 to 04 are the same node for node; no node added.

- **`PLANE` now:** `EASE_AT` 1.5 (1.2 in round 12), `CLIMB_A` 8 (6), `SURGE_A` 50 (45), `SURGE_AT` 8.3
  (9.4), `HOLD` 5.35 (4.24), `OUT` 11.1 (12.5); the kite's `turn0` 2.684 (2.747). 92 px/s as the wheels
  leave (85), 131 to 151 across a phone's sky (112 to 129), 154 at the Tower (131), 220 as the last of it
  leaves the picture (202). Wheels off to the Tower: 6.3 s (7.3). The push along the runway itself
  (`PLANE.ACC`) is the same: the gain begins as the nose comes up. The path, the 26 s cycle and the moment
  it passes the Tower (21.75 s into the cycle) are unchanged; it stands lined up 1.1 s longer.
- **A phone sees it for less again: half or more of the plane for 2.4 s (3.0 in round 12, which he had
  accepted), 80 % for 1.6 s (1.9).** Both numbers were said to him with this round; **his word on 2.4 s is
  still to come.** A faster climb and a longer look on a phone pull against each other, because a phone's
  open sky IS the climb. If he wants the time back: put `CLIMB_A` and `EASE_AT` back (6 and 1.2), keep
  `SURGE_A`, and set `HOLD`, `OUT` and `turn0` again (`shots/` is not in git; the method is in `CHANGES.md`:
  `HOLD` = 21.744 minus the time from the brakes coming off to the gear at x 1360, minus 8.1).
- What is timed to the plane was checked again: the flock 9.9 s ahead at the Tower on both rounds, the
  kite 68 px clear on both passes, the baggage train 150 px behind the tail.
- One verifier (Node only, one agent) went over the work before it was committed: nothing wrong with the
  motion, four statements corrected. **A speed quoted "as it leaves the picture" must be the speed when
  the last of the drawing leaves the stage, not when the gear passes x 1860** (it is out of sight by then).
- `films/remake-4.mp4` is the film after this round; remake-1, remake-2 and remake-3 are untouched. The
  remake's two recordings on the film page were made again.

## WHERE IT STANDS WHEN YOU PICK THIS UP (2026-11-17, the owner logged off)

Everything is committed and pushed; the working tree is clean. Two threads are live.

**1. Fable 5.2 had the film: rounds 11 and 12 are accepted (round 12's clouds in so many words) and round 13 (above) waits for the owner's verdict.** What follows is the brief as it was handed over.
`PROMPT-FOR-FABLE-LOOP.md` is its brief, handed over and approved by the
owner ("Looks right"): make scene 05 a complete seamless loop (L = 52 s, two plane cycles and one bird
cycle; position AND velocity continuous at the wrap; the five scene buttons must keep working), and chase
the two different faults hiding under "jaggedness" - dropped frames, and motion that steps rather than
flows. **File boundary: Fable owns `round2/js/` and `round2/parts/`; this session owns `round2/css/`,
`copy/`, `sides.json`, `viewer/` and `tools/`.** Do not cross it without saying so.

**2. This session has the copy and the overlay.** Settled and wired in: the **faint patch** he chose
(`round2/css/light/patch-faint.css`, loaded after `hero-copy.css`) and the rebuilt phone layout. Open:
the wording and the layout.

**THE ONE THING TO RESOLVE FIRST, and do NOT guess it.** His last message was *"Probably something like 3,
but pause and save the progress need to log off now so."* It was an answer to a two-part question (which
headline, and which layout), and **"3" is ambiguous between two lists he had just been shown**:
- **H3** `荷を預かる、荷を運ぶ。` - the wording in the film's own order (01 入荷, 02 積込, 03 輸送), from
  `evidence/2026-11-17-round-h/`;
- **layout 3, the VERTICAL RAIL** (`round2/css/layouts/tategaki-rail.css`), from
  `evidence/2026-11-17-opus-layouts/final-*.jpg`.
"something LIKE 3" also reads as a direction rather than a final pick. **Ask him which he meant, in one
line, before building anything on it.** If he meant the rail, note it wants a SHORT headline: one column
holds about seven Japanese characters at both framings, so H2 `荷を預かる物流` (7) fits one column and H1/H3
(11) run to two.

Everything either answer needs is already built, measured and on disk - no work is lost and nothing is
half-done.

## GitHub (2026-11-16)

`origin` is the owner's repository, https://github.com/NoeJinsei/SanpouAnimationNewRemake.git, and `main`
tracks `origin/main`. He asked for this folder to be uploaded there and for the session to stay connected to
it; the whole history was pushed on 2026-11-16. **The repository is public: anything pushed can be seen by
anyone.** So:

- Push with a plain `git push` (this machine is already signed in; never type a password or a token).
- **Push after every finished pass without asking** (his answer on 2026-11-16: "Yes, every pass"). A pass is
  finished when it is committed with its evidence and its checks have run. Work in progress is not pushed.
- Never add the ignored folders to git: `reference/motion-film/` and `reference/warehouse-ops/` hold other
  people's material, and the scratch sides and `shots/` are throwaway.
- Before a push, look at what is new for anything private (an address, a key, a personal detail). The
  history pushed so far has none: no e-mail address in any file, and every commit is signed "Claude".

Usage: this account has a 5-hour usage limit; a burst of parallel agents exhausted it in the first session and
killed work in progress. Use one or two agents at a time (a cheaper model for engineering, the best one for
art) and keep the main session short.

## Quality bar (from the Motion film, measured)

Smooth every-frame motion (target 60 fps on the site), camera moves eased in and out with long soft landings,
scene changes as one continuous move with the cut hidden at peak speed, the world never fully frozen (low
ambient motion), light shafts / layered clouds / depth, purposeful detail, one route line threading through
the scenes. Details and numbers: `REFERENCES.md`.

## How to verify (works on this machine)

- Playwright from `C:/Users/RTX4070TI/Desktop/Logistics-Website-Animation/journey/verify/` via
  `createRequire(...)`; if the bundled Chromium won't start, use `{ channel: 'chrome' }`.
- Serve with `python -m http.server <port> --bind 127.0.0.1` and use `http://127.0.0.1` (bare `localhost`
  fails over IPv6). Pages without `<meta charset="utf-8">` garble 三豊運輸.
- `ffmpeg` is installed (WinGet); use it to measure smoothness (frame diffs, duplicate frames) of recordings.
- Check every pass: all scenes, 0 console errors, 390px phone, reduced motion, rapid scene clicks,
  render cost per frame, before/after shots.

## Tools available

frontend-design, oil-ui (update check off), unslop, ui-ux-pro-max, lemo-opuscar (its style-frame method),
webapp-testing, `watch` (claude-video: Gemini engine has a key; Google returned 503 "high demand" on
2026-11-13 — retry, or use `--engine local`).

## Working with the owner

Plain words, short answers, no jargon. Show sample frames, don't describe them. With every frame, say in
one line exactly which elements in that picture are new and which are still old (the owner asked for this on
2026-11-14, so he judges the new work and not the leftovers). Ask before choosing between
directions. One commit per pass in this folder's own git repo, with before/after evidence.
