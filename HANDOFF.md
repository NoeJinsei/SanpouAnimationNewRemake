# Handoff: the full remake (round 2)

Written 2026-11-13 at the end of the first build session (Opus 5), for the sessions that do the real remake
(Fable 5.2). Read `CLAUDE.md`, then this file, then `STYLE.md`.

## The owner's verdict on round 1

The owner watched the whole film (`evidence/2026-11-13-preview/side-by-side.mp4`) and said, in their words:

> overall although I like the additional design / improvement of the first warehouse in scene 1, the rest of
> the scenes looks quite the same with the elements (like backgrounds, trucks, buildings, tokyo tower, mount
> fuji, clouds, the plane on the last scene, and even the japan region map with company location indicators)
> looks pretty much the same but with a slight enhancement in its design / polishes.
>
> Honestly, I want to do a full remake for each of these scenes … How the scene begins and what kind of
> elements should be in each scenes should be the same, but I want a complete remake of this with way better
> quality animations and with smoothness … the designs of each elements should be even better (revamped but
> the way each scenes has its elements … should be similar but way better.

So round 1 is **not** the direction. It is kept as a reference for what the elements are and where they sit
(`samples/`, `remake/`), not as the basis to polish further.

### Why round 1 came out as polish

Two rules I wrote caused it, and both are now changed:

1. `STYLE.md` §0 said *"an upgrade happens inside an element's own footprint"*. That forbids redesigning the
   thing itself, so every round could only add shading and small parts to the original shapes.
2. `CHANGES.md` rounds were capped at five conservative rows per scene, each phrased as an addition to what
   was there. Nobody was ever asked to draw the element again from a blank page.

The result was better lighting and more detail on the same drawings. The owner can see the original underneath.

## What a full remake means here

**Keep, exactly:**

- The five scenes, their order, and how each one begins and ends.
- The cast of each scene: the same things are present (supplier building, Sanpou warehouse with three bays,
  the trucks, parcels, the city skyline, Tokyo Tower, Mt Fuji, clouds, birds, the expressway with its gantries
  and green signs, the coverage map with the three base pins and the routes, the airport with its plane, the
  office building, the road traffic, the foreground framing).
- Roughly where each thing sits in the frame and how the eye moves through it, so each scene still reads as
  the same shot.
- The story, the copy, the facts, the figures and the scene captions (`research/past-decisions.json`
  → `constraints` is the list; nothing there changes without asking the owner).
- Daylight, one sun, and the brand's colours.

**Redraw, from a blank page:**

- Every element's actual design: its silhouette, proportions, construction, materials and detail. A building
  may gain a different roofline, setbacks, a canopy, a different window rhythm; the warehouse may be a better
  piece of architecture; Fuji may be built differently as long as it is still Fuji in that place; the map may
  be drawn with a different technique as long as it shows the same seven prefectures, the same three bases and
  the same routes; the plane, the trucks and the Tower likewise. "Similar but way better" is the test, not
  "the same shapes with shading on".
- The motion: see below. This matters as much as the drawing.

**Ask the owner before changing:** the scene durations, the camera path, the two scene seams (the 18-frame
slide into 03 and the 0.85 s dissolve into 04), anything in the copy, and anything that changes what the
company claims.

## The animation, which is half the job

The owner asked for "way better quality animations and with smoothness". The quality bar is the reference
film (`reference/README.md`, measured in `research/reference-film-study.json`). In practice:

- **Watch the reference move before drawing anything.** Frame grabs do not convey its timing. Use the `watch`
  skill on `reference/motion-film/clip.mp4`. Note: the Gemini engine (which watches the whole video) returned
  HTTP 503 "high demand" on every attempt on 2026-11-13, twice hours apart - retry it, and fall back to
  `--engine local`, which extracts frames and works.
- **The film's motion is already measured**: `reference/motion-film/notes/motion-profile.md` is its velocity
  curve frame by frame, with the cut points, the holds and the bell shapes, and how to reproduce it with
  ffmpeg. Read that even if the video will not play for you. The headline: 42 of 899 frames repeat, all inside
  two deliberate text holds; even the "still" opening shot keeps a steady low level of motion; every move
  rises and falls over about 15 frames each way; and the one hard cut sits on the fastest frame of the push.
- Every camera move is bell-shaped with a long soft landing; nothing starts or stops abruptly.
- The world is never fully frozen. Scene 05 holds for 18 seconds and is the worst offender today.
- Secondary motion everywhere: things that are pushed, braked, lifted or opened overshoot a little and settle.
- Scene changes read as one continuous move, with the cut hidden at peak speed.
- 60 fps on the site, checked with `tools/motion-check.mjs` (0 frozen frames, 0 pops) and
  `tools/perf-side.mjs` / `tools/perf-table.mjs`, not by eye.

### Defects found in the original, worth fixing in the redraw

- **Scene 02's hold froze the whole picture.** The site's player held it with ambient time stopped: 106
  identical frames in a row, the longest frozen run in the film. Already fixed in `remake/js/hero-glue.js`
  (it now passes the idle clock, as scenes 01 and 04 always did) - keep that fix.
- **The Saitama route on the map never finishes drawing.** In `CoverageMap`, each route's progress is
  `clamp01((routeProgress - i * 0.07) * 1.7)`, and the seventh route (`ROUTE_ORDER` ends with `SAITAMA`) tops
  out at 0.986 when `routeProgress` is 1. `AnimatedRoute` only switches to the moving flow dashes when `draw`
  reaches 1, so that one route stays a solid line with a small gap at its end while the other six flow. Shiki
  is in Saitama, so it is one of the three bases' own routes. Verified by evaluating the formula from the
  source; see `research/scene04-checklist.json`.

## What is in this folder

| Path | What it is |
|---|---|
| `original/` | the site's hero exactly as it ships (commit `72862b6`). Never edit. `cd original && sha256sum -c SHA256SUMS` |
| `remake/` | the working copy. Today it holds round 1's scene 01 plus the player fix |
| `samples/frame-a`, `frame-02`, `frame-03` | round 1's style frames, one per scene |
| `samples/preview` | the three merged, for watching the film in one piece |
| `viewer.html`, `viewer/` | the side-by-side viewer. Serve the folder and open `http://127.0.0.1:8791/viewer.html` |
| `sides.json` | which renderers the viewer offers; add one per new attempt |
| `tools/` | stills, contact sheets, picture diffs, smoothness, frozen-frame and pop detection, video recording, a check that the viewer agrees with the site's real player |
| `engine/` | a canvas renderer that draws the same scene code, if SVG is ever not enough (it was not needed: measured no faster) |
| `research/` | the reference-film study, the owner's past decisions and rejections with sources, and a full element checklist per scene |
| `reference/` | the reference film itself, its frames and crops (third-party, not committed) |
| `evidence/` | before-and-after stills and videos, one folder per pass |
| `STYLE.md` | the look rules |
| `CHANGES.md` | what changes per scene, and what the owner approved |

**The element checklists are the key documents for a redraw**: `research/scene01-checklist.json` through
`scene05-checklist.json` list every element of the original with its screen position, its construction, its
colours, its ambient motion and the scene's choreography, plus what is hidden or off screen. Use them to be
sure a redrawn scene still contains everything, in its place — then draw everything differently and better.

## Method

Unchanged in shape, bolder in content:

1. Per scene, write the round's intent in `CHANGES.md`: not five small rows, but what each element becomes.
2. Draw a **style frame** — a real frame of the film, from the real scene code, at the scene's settled moment.
3. Show the owner that frame beside the original and **wait**. Two rounds of notes at most; if it is still
   not right, change the approach rather than grinding.
4. Then the motion pass for that scene.
5. Verify every pass: all five scenes still play, 0 console errors, the 390 px phone, reduced motion, rapid
   scene clicks, smoothness measured, before-and-after evidence, one commit.

Order: finish one scene before starting the next, and after each one look at a sheet of all five scenes
together to catch colour drift. The scenes share components and one palette, so a change in scene 01 shows up
in scene 05 — that is wanted, but it has to be checked.

## Still waiting on the owner

- Scene 02 (round 1): interior brightness, whether to keep the forklift in bay 02, whether the ground should
  say more. These may be moot if scene 02 is redrawn from scratch.
- Scene 03 (round 1): Fuji's colour is shared by the whole film, so fixing it changed scene 05 too; keep that
  or not. Cloud drift direction. Cap size.
- The parked truck at the dock: engine running (a faint exhaust wisp) or switched off?
- From `research/past-decisions.json` → `openQuestions`: whether floating dust, sun rays and the map grid may
  come back in any form (they were switched off before, reason unrecorded); how much ambient motion is wanted;
  whether the two scene seams may be redesigned; and the reduced-motion still frame.

## Practical notes for the machine

- Serve the folder before using the viewer or any tool: `python -m http.server 8791 --bind 127.0.0.1`.
  Use `http://127.0.0.1`, not `localhost` (IPv6). The plain viewer address needs no query string.
- Playwright comes from `C:/Users/RTX4070TI/Desktop/Logistics-Website-Animation/journey/verify/` through
  `tools/pw.mjs`; if the bundled Chromium will not start it falls back to the installed Chrome.
- Run one measurement at a time. This machine's absolute numbers drift by 50 % with the owner's browser open,
  so always measure the two sides you are comparing in the same sitting.
- The account has a 5-hour usage limit and a weekly one. A burst of parallel agents exhausted it once and
  killed work in progress. One or two agents at a time; give well-specified engineering to a cheaper model and
  keep the best model for the art.
- Do not touch `C:\Users\RTX4070TI\Desktop\sanpou-site-v2`. The remake goes back to the site only when it is
  finished and approved, as a separate task.
