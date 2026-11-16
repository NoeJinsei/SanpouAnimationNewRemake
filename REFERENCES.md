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

---

## The company's live site, and how Japanese logistics sites write their hero (2026-11-16)

The owner gave the live site again when he asked for the wording, with one reminder:
**they no longer do 紙スリッター加工.**

| Link | What it is |
|---|---|
| https://www.sanpou-unyu.com/ | **The company's own site today** (Wix, © 2020, server-rendered). Its main heading is a SERVICE LIST: 「紙スリッター加工業・運送業・倉庫保管」 — which **leads with the service they have dropped**. Two warehouse sites named (板橋・志木, not 入間), coverage given as 関東, 13t wing/gate down to 軽トラック, ロールクランプ. No founding year, no vehicle count, no staff count anywhere on it. Representative since April 2025: 小松 幸恵. |

**Read for how the industry writes a hero** (structure only; none of their copy is used or reproduced):

| Link | |
|---|---|
| https://www.maruzenshowa.co.jp/ | 丸全昭和運輸 — 4 lines, 8–14 chars, no 、inside a line, plain + 体言止め |
| https://www.konoike.net/ | 鴻池運輸 — kicker + 2 lines (10, 7), 、at the line break, plain form |
| https://www.tonami.co.jp/ | トナミ運輸 — 3 lines, 6–9 chars, 、at the line break, one 。at the end, plain form |
| https://www.hamakyorex.co.jp/ | ハマキョウレックス — 2 lines (11, 20), 、at the line break, polite (the company is the subject) |
| https://www.trancom.co.jp/ | トランコム — 1 line, ~16 chars, plain form, dictionary-form verb |
| https://www.suzuyo.co.jp/ | 鈴与 — 3 lines (3, 8, 3), no punctuation at all, elliptical |

**The conventions they share**, which the new copy should follow:

1. **Short lines: 3 to 14 characters**, most 6 to 12. The new site's are 14 and 11 — about twice as long
   as the norm once you count both.
2. **The 、 marks the LINE BREAK.** It sits at the end of line 1 and nowhere else. Four of the six do this;
   none puts a 、 inside both lines. (The owner saw this himself on 2026-11-16: "the comma in between can
   be a bit odd, at least for both lines.")
3. **One 。 at the very end, or none at all.** Never one per line.
4. **Plain form (常体) or 体言止め, not です・ます.** Four of six. Polite only where the company name is the
   grammatical subject.
5. **A slogan or a stance, never a list of services** in the headline itself. The services go in the
   sub-copy. (The company's own live site is the exception, and that is the older SME convention.)
6. **None of them names the customer** in the headline — no 荷主, no 荷主企業. That belongs in the sub.
   An SME may say 企業の to make the B2B footing clear without the trade jargon.

### Six more, read 2026-11-16 after the owner asked for more sources

He asked for more reference homepages, with two new rules of his own: **do not emphasise the years of
operation**, and **do not lean on 企業** (he wants to stay open about who he carries for). So this round
looked at bigger carriers and at two of his own neighbours in 板橋.

| Link | The hero, as it stood |
|---|---|
| https://www.seino.co.jp/ | 西濃運輸 — ONE line, 12 chars, one 、 inside it, 。 at the end, plain form |
| https://www.sagawa-exp.co.jp/ | 佐川急便 — ONE line, 、 after the opening adverb, **polite ます**, the company itself as the subject |
| https://www.sbs-group.co.jp/ | SBSホールディングス — ONE line, 13 chars, one 、, plain form |
| https://www.hamakyorex.co.jp/ | ハマキョウレックス — ONE line, 8 chars, 体言止め, **no punctuation at all** |
| https://hattori-group.com/ | 服部運輸倉庫 (板橋区高島平, a neighbour) — 3 lines, 9 / 5 / 7, 体言止め, no punctuation; **it opens with 創業から半世紀** |
| https://shutoken.net/ | 首都圏物流 (板橋区板橋, a neighbour) — one long 体言止め line, recruiting-flavoured |

Also tried and unreadable: 福山通運 (mis-encoded Shift_JIS), 第一貨物, 名鉄運輸, ニッコンHD (the hero is a
picture with no text), センコー (403), 新潟運輸 and 久留米運送 (no such host).

**What the second round changes:**

7. **A single 、 inside ONE line is completely normal** — 西濃, 佐川 and SBS all do it. What none of the
   twelve does is put a 、 in BOTH lines, which is what the new site does and what the owner noticed.
   So: at most one 、 in the whole headline; if the headline breaks, it goes at the break.
8. **A ONE-LINE headline is the commonest shape of all** — 5 of the 12 (西濃, 佐川, SBS, ハマキョウ,
   トランコム). On this site a one-line headline also lifts the tag and the buttons and leaves much more
   of the film visible, on a phone especially.
9. **Years of operation are rare, and the nearest company already uses them.** Only 服部運輸倉庫 leads with
   半世紀 — and they are in 板橋 too. A second 板橋 carrier opening the same way is a reason not to.
10. **企業 appears in none of the twelve heroes.** Point 6's "an SME may say 企業の" is withdrawn.

### The big survey, 2026-11-17: `research/jp-hero-survey-2026-11-17.md`

The owner rejected the place-name drafts — "that is not the main message we want to write on the hero section
of our website" — and asked for more examples. Six readers took a slice each (national carriers, 3PL and
warehouse groups, Kanto regionals, small carriers of 20–80 trucks, last-mile, and companies selling his exact
four services): **123 companies, 90 heroes readable**, every one classified by WHAT IT SAYS. Every link, every
company and the full reasoning are in that file. The headline results:

11. **He was right about the places, and the number is brutal.** 13 of the 90 heroes contain a place name,
    but seven of those are search-engine sentences pasted in as a headline on template-built small-firm sites.
    **Exactly ONE is a deliberately written place slogan** (a 612-staff carrier whose claim IS its twelve
    prefectures), and **not one hero in 90 is built as "from X to Y"** — the shape of every draft of mine that
    he rejected. The place belongs in the page title, the small line under the headline, or the footer.
12. **The commonest messages are IDENTITY (19), PROMISE (15) and ROLE (13)** — what kind of carrier we are,
    what we undertake, and where we fit in an ordinary day. Those three are what suit this company. The traps
    are SCOPE (listing the services is what makes a hero long and inhuman), CHANGE and CHALLENGE (national-group
    register; CHALLENGE reads as a recruitment poster), BENEFIT (it needs a named customer, which he has banned)
    and INVITATION (it asks before the film has told).
13. **PROMISE is the biggest group among small carriers and the nationals barely touch it** — "we are reliable"
    is defensive from a brand everyone knows and necessary from one nobody has heard of. ROLE runs the other
    way, so a ROLE line from a 32-truck firm must stay the size of a street or a morning, never a nation.
14. **Length: 7 to 16 characters for the WHOLE headline**, median 12–13. Above ~22 almost nothing still sounds
    human; 25 to 69 characters is search copy without exception. Shortness and quality tracked together across
    the whole pool.
15. **The verb goes LAST and what it acts on FIRST.** Not one hero in 90 is built as "to X, from Y, we carry".
    That is the structural reason the rejected drafts read as wrong, quite apart from the place names.
16. **No hero carries facts** — no fleet count, no founding year, no depot count, no service list — except the
    search-written ones, which carry all of them and read worst.
