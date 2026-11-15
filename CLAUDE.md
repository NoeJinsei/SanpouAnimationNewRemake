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
- **The film is finished to the brief** (the reviewer, 2026-11-16): every drawing remade, both seams as
  camera moves, no pops, the route line through, and smoother than what it replaces. **Start nothing else.**
  The owner watches it end to end next; putting it into the site is a separate task that does not start
  until he has said yes to the film.
- **The finished film, recorded end to end for watching** (2026-11-16; the film itself unchanged):
  `evidence/2026-11-16-the-film/index.html` (through the viewer's server) plays four recordings with no
  cuts, 0 to 48000 ms at 60 fps: the remake and the original, on a desktop (1440 x 720, the hero section)
  and on a phone (780 x 1360, `--dpr=2`). The plane's pass at the Tower (45.4 to 46.9 s) is in them. If the
  film changes, record them again; the `tools/record.mjs` commands are on the page. **The viewer's server
  (python's `http.server`) cannot send part of a file, so a `<video>` played straight from it cannot be
  scrubbed:** that page fetches each film whole and plays it from memory. The clips on the round 7 page
  play but cannot be dragged, for the same reason.
- New tools: `check-seams.mjs` (the real player plays both moves, at both framings, and by click),
  `trace-side.mjs` (where a frame's time goes), `what-moves.mjs` (where two moments differ),
  `what-changes.mjs` (what the patcher writes per step), `map-band.mjs`; `record.mjs` takes `--dpr=2`.
  `sheet.py` gives every tile of a row the same label bar (a second label line used to shift one picture).

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
