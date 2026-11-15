# Sanpou hero animation remake — references and prep notes

Separate project from the website (`sanpou-site-v2`). Nothing here goes into the site until the remake is
finished and approved. Started 2026-11-13, brainstorming / prep phase.

## The goal, in the owner's words

A "remake", like the Resident Evil or Final Fantasy remakes: same game, same story and scenes, better graphics
and features. The current hero (`sanpou-site-v2/public_html/assets/js/hero-port-b.js`, daylight, commit
`72862b6`) is the original game.

- Keep: the five scenes and their order, camera path and timing, the story, the named cast and where it sits,
  how the trucks move. (This line first said "layout, the buildings and their places". That reading produced two
  rejections and is withdrawn: every drawing is redrawn, and the skyline, clouds and traffic are composed again.
  `CLAUDE.md` and `PROMPT-FOR-FABLE.md` are the rule.)
- Raise: graphics quality of every element, lighting/atmosphere, detail, secondary motion, smoothness —
  to the level of the Motion reference film below.
- Separate tasks: website wording / polish; integrating the remake into the site (only after it is finished).

## Links

- Quality reference: Motion (@motion_so), "Introducing Fable 5.2 for animation", 2026-11-10 —
  https://x.com/motion_so/status/2119956569597358414/video/1
- Style benchmark: Kurzgesagt — https://www.youtube.com/channel/UCsXVk37bltHxD1rDPwtNM8Q
- Original July daylight version: Logistics-Website-Animation `sanpou-site/index.html` @ d24a12c
- The owner's GitHub repository for this project (given 2026-11-16, to upload this folder to and keep the
  session connected to): https://github.com/NoeJinsei/SanpouAnimationNewRemake.git
- Tools installed for this work (each scanned with skill-inspector first):
  - frontend-design (official) — https://github.com/anthropics/claude-plugins-official.git — APPROVE
  - oil-ui — https://github.com/oil-oil/oil-ui.git (commit 28948c3, update check off) — CAUTION
  - claude-video `watch` — https://github.com/bradautomates/claude-video.git (commit 03ceb42, local engine;
    Gemini engine set up but no key) — CAUTION
  - also available: unslop, ui-ux-pro-max, lemo-opuscar (method), webapp-testing / Playwright

## What the Motion film does well (measured, 2026-11-13)

Measured with ffmpeg on the 1920×1080 file: 30 fps, 900 frames, per-frame picture change over time.

1. **No stutter.** Repeated frames appear only in deliberate holds (the "948" card, the end card); every camera
   move changes the picture on every frame.
2. **Cuts hidden at peak speed.** The castle → door push accelerates over ~18 frames, cuts at maximum velocity
   (2.57 s), then decelerates over ~13 frames. The eye reads one continuous move, not a cut.
3. **Bell-shaped moves.** Each push is ease-in-out with a long ease-out tail (door → vault: ~55 frames,
   rising and falling smoothly); nothing starts or stops abruptly.
4. **The world never freezes.** Even "still" shots keep low, constant motion (water, clouds, light), until
   the deliberate holds for reading text.
5. **One thread through everything.** A single acid yellow-green route line runs from the illustration into
   the blueprint and the step strip.
6. **Illustration ↔ diagram match.** The painted castle becomes a line-art blueprint of itself.
7. **Lighting and depth.** Diagonal light shafts, big layered cumulus with flat shading steps, foreground rocks
   darker than the subject, foam and water texture.
8. **Purposeful detail.** Rivets, pipes, brass, chevrons, labels — detail that implies a working machine.
9. **Type.** Short serif lines, one word in italic or colour, appearing after the camera settles.

Weaknesses to avoid (owner noted): inconsistent colour between scenes, oddly shaped buildings, a dark cyber
palette that doesn't fit Sanpou.

## Warehouse operation references (owner-supplied, 2026-11-14)

Six stock illustrations the owner gave as a **reference point for the feel of a working depot** — his words:
"Im not saying to copy these, but use these are a reference point for fable and create a original / unique
version for our animation." Kept in `reference/warehouse-ops/`, gitignored like the motion film: study
material, never shipped, nothing traced or lifted.

| File | What it is | What to take from it |
|---|---|---|
| `01-isometric-warehouse-interior.webp` | isometric DC interior: deep racking, forklift in an aisle, pallets, a truck backed into a shutter with the load half in | the **inventory of a working depot** — racking bays, stacked pallets, a forklift mid-task, a part-loaded truck body |
| `02-isometric-handling-equipment.webp` | isometric kit sheet: counterbalance forklifts, a walkie stacker, pallet trucks, a scale, a scissor lift, racking, drums, a container | **how handling equipment is built** — mast, forks, counterweight, wheels, overhead guard |
| `03-flat-warehouse-banners.webp` | flat side-on banners: a gabled shed with two open bays full of pallets, an articulated lorry, a forklift, a lit interior | the **side-on staging** of bays full of goods behind an open shutter |
| `04-flat-warehouse-and-trucks.png` | flat: a shed with an open bay, racking inside, a lorry alongside, a forklift loading a trailer | the clearest match to our camera: **one building, open bay, goods visible, vehicle alongside** |
| `05-single-shed-open-bay.png` | a single clad shed, blue plinth and trim, roller door open on lit racking, pallets outside, a small box truck | **modern clad-shed construction** — profiled sheeting, a coloured plinth band, eaves, a roller door hood |
| `06-isometric-forklift-aisle.webp` | isometric aisle: racking, cartons, forklifts, staff with tablets | depth of racking receding into the building |

**What NOT to take.** Four of the six are isometric and our film is not — the owner asked on 2026-11-14 to go
back to a **flat 2D** view. Take the content, never the projection. They are also full of **people and faces**,
which are banned in this film; the work has to read as a working depot with no one in frame. Their palettes
(primary red/yellow/green, brown interiors) are not ours; everything is drawn in `DAY`. They carry in-art
lettering and lorem ipsum; our art carries no titles or captions. And none of their vehicles or buildings
belongs to anyone we can identify — no other company's branding goes into our version.
