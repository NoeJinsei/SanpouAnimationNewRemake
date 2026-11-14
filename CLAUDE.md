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
  composed again under its climb line (`y = 968 - 0.56 (x - 614)`: nothing may rise to within 30 px of it,
  so think of that line before moving any roof in `cityFinale()`); the airport; the Sanpou depot with
  三豊運輸 written downward on a navy band; two-axle road trucks.
- **Values** (`r4-values`): `CITY_LOOK` and `CITY_HAZE` widened from navy to air.
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
- Still the original or round 2 drawings: scene 03's expressway, lamps, gantry, signs and fence; the
  street, lamps, vending machines and foreground rail of scenes 01 and 02. The seams and the motion pass
  are not done. Scene 03's caption still says 関東一円 (the owner's call).
- Three scratch sides exist (`trial`, `trial2`, `trial3`) so helpers can build side by side. A helper
  stopped by the usage limit is resumed with a message to it; its part file on disk survives.

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
