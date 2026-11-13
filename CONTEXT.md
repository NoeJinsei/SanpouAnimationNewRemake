# Context: what this is, who it is for, and every version before this one

Written 2026-11-13 for the round 2 (full remake) sessions, which start with no memory of how the project got
here. `CLAUDE.md` is the rules, `HANDOFF.md` is the brief, `CHANGES.md` ends with the owner's round 2
direction. This file is the background behind all three.

## What we are building, and where it goes

**The hero section animation of a company website.** Not a film, not a demo: the band at the very top of the
home page, the first thing a visitor sees.

- It lives in `index.html` of the new site as `<section id="sanpou-journey">`, full width, and
  `clamp(560px, 80svh, 820px)` tall on desktop — on a phone it grows with its text instead.
- The animation is a 1920×1080 stage, scaled to **cover** that band and cropped, so the edges are never seen
  and the important action has to sit where the crop keeps it.
- **Live HTML text sits on top of it**, not inside the art: the Japanese headline
  「関東1都6県と新潟市方面へ、／板橋からお届けします。」, a sub-paragraph, two buttons
  (「事業内容を見る」「お問い合わせ」), and along the bottom the scene number, name and one-line description,
  five scene buttons and a pause button. A pale wash covers the left ~60 % so the navy text stays readable;
  a dark band along the bottom carries the white controls. **Nothing dark or busy may sit under the headline**,
  and the art must never carry headline text of its own.
- It plays by itself through five scenes and then holds on the last one. A visitor can jump between scenes,
  pause it, or tab through it with the keyboard. With reduced motion it shows one still frame and does not
  play at all.
- It must stay smooth on a phone, which is why every pass in this project measures frame times rather than
  trusting the eye.

**The five scenes, in order, and what each shows**

| | Name | What happens |
|---|---|---|
| 01 | 入荷 receiving | A Sanpou truck arrives at a supplier's dock; three parcels are loaded; the door closes |
| 02 | 積込 loading | The camera pans to the Sanpou warehouse; three bay shutters open; trucks are loaded |
| 03 | 輸送 transport | A convoy of four trucks runs the expressway past the 新潟・前橋 and 板橋出口 signs, with Fuji behind |
| 04 | 配送ネットワーク network | The coverage map: seven prefectures, routes out of the Itabashi hub, the three bases |
| 05 | 地域とともに with the region | The map recedes to a wide daylight Tokyo: the Tower, Fuji, the airport, the road |

## The company

**有限会社三豊運輸 (Sanpou Unyu)** — never 株式会社. A Tokyo logistics company, founded 昭和50年 (1975),
so half a century old. Three bases: 本社（板橋）, 志木営業所, 入間営業所. 32 vehicles, about 35 staff.
It covers 関東1都6県 and 新潟市方面 only — areas, never distances, and never the wording 「関東一円」.
Services: 輸送・配送, 倉庫保管, 流通加工, 3PL. Paper cargo (rolls, ロールクランプ) is real work of theirs.

Things the client removed, which must not be drawn or implied: refrigerated or frozen trucks, Gマーク,
digital tachographs or dashcams on every truck, same-day/emergency spot delivery, food cargo, and the paper
slitter service. The full list of fixed facts and bans is in `research/past-decisions.json` → `constraints`.

## The websites

| | |
|---|---|
| **The company's current site** | **https://www.sanpou-unyu.com** — built on Wix, still live. This is the site the owner showed at the start; the new site replaces it. Worth a look for what the company looks like today and how far this is moving. |
| **The new site (where the hero goes)** | `C:\Users\RTX4070TI\Desktop\sanpou-site-v2` — a git repo on branch `main` at commit `72862b6`. **Read-only from this project.** Not yet published; the plan is the owner's existing rental server, with the `sanpou-unyu.com` domain pointed at it. |
| **The hero's own files on that site** | `public_html/assets/js/` — `hero-flag.js`, `hero-port-a.js` (map data), `hero-port-b.js` (all the art), `hero-glue.js` (the player), loaded in that order; `css-src/40-hero.css` for the overlay. Untouched copies are in `original/`. |
| **The predecessor repo** | `C:\Users\RTX4070TI\Desktop\Logistics-Website-Animation` — where the animation was first built, and still where this project borrows Playwright from. |
| **The quality reference** | Motion (@motion_so), "Introducing Fable 5.2 for animation", https://x.com/motion_so/status/2119956569597358414/video/1 — the owner's bar for how good this should look and feel. The film itself and its study are in `reference/`. |
| **The style benchmark** | Kurzgesagt, https://www.youtube.com/channel/UCsXVk37bltHxD1rDPwtNM8Q — flat-vector grammar only, never their designs or characters. |

Integration is a **separate task, after this is finished and approved**. When it happens it has to respect the
site's own rules: no third-party requests, no CDN, no inline scripts, fonts self-hosted, the four scripts in
their fixed order, the hero's DOM skeleton unchanged, and `hero-port-b.js` is sha1-pinned in the site's checks.

## Every version before this one

1. **The Remotion film.** The animation began as a rendered video made with Remotion — the scenes, their
   order and their timings all come from it. `hero-port-b.js` still describes itself as "a FAITHFUL port, not
   a re-creation", and its easing helpers were copied from that project's own stubs.
2. **2026-06-14 — ported to the live web, at night.** The film was turned into SVG drawn by JavaScript, every
   scene a pure function of the frame (predecessor repo, commit `2a5f310`). The art was a night scene.
3. **2026-07-02/03 — night turned into day, and the city rebuilt.** Stars, beacons, lamps and glows were
   dropped; the city was redrawn in Kurzgesagt-style flat vector; Mt Fuji went through four rounds against a
   reference illustration the owner supplied; the clouds were rebuilt after the owner flagged a grey shade bar
   and clouds popping in; gold was tried for the accent and rejected ("looked poor", "read muddy"), and the
   coral/vermilion `#e16347` was adopted (`e9e7341` → `d24a12c`). **This is the "original July daylight" the
   owner later asked to go back to.**
4. **July → November — the finished site was built**, in a session whose history is not on this machine. Its
   result is the site baseline (`695d110`): a dusk sky left sitting over daytime-lit buildings — a half-done
   night-to-day conversion — with the data cards, in-art titles, floating dust, sun rays and map grid all
   switched off but still in the code.
5. **2026-11-09 — the polish pass.** Five audit findings fixed, plus the owner's own idea: the scene progress
   bar became a road whose driven part is the vermilion dashed centre line, with a small truck riding the edge
   (`b562767` → `3dfc1ee`).
6. **2026-11-10 — the daylight revamp.** Three look-dev variants were shown: A current, B blue hour, C night.
   The owner picked B, then asked instead for daylight like the July version. That landed as one `DAY` palette
   across every scene and the copy overlay turned to navy on a pale wash (`84c715b`), then trucks that carry
   their weight — body pitch from acceleration, speed-scaled shake (`72862b6`). **That commit is the "original
   game" this project remakes.**
7. **2026-11-13 — this project, round 1.** A side-by-side viewer, measuring tools, a canvas renderer (built,
   measured, not needed), a look sheet, and style frames for scenes 01–03. Scene 01 was approved and built
   with a motion pass. Then the owner watched the whole film and rejected the direction: the elements still
   read as the originals with shading added. See `HANDOFF.md`.
8. **Round 2 — the full remake.** Every element redrawn from a blank page; same scenes, same cast, same
   staging, much better drawing and much better motion. That is the work ahead.

## Where the owner's taste is recorded

Not guesswork — `research/past-decisions.json` lists every decision and rejection with its source, including:
daylight over blue hour or night; vermilion scarce and never on everything; no data cards, numbers or titles
in the art; no faint stripes, dots or dust that read as noise; no dark scrim over a daylight scene; no springy
overshoot on interface elements; text must never cover the artwork; and scene changes must feel like one
camera move rather than a slideshow.
