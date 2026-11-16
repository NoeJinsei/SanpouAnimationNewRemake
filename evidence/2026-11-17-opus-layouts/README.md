# The words audited, and six ways to lay the hero out (Opus, 2026-11-17)

His message was two things at once: *"These sounds horrible, check on each of the wording relative to the
reference websites. Also you dont really need to be stuck in this format of having its title text on top of
hero animation section. Check more references and try to be more creative in formatting / approach in this
design and placement of this."*

## Part one: the words. Two independent audits, and they agree

Two readers audited every line of rounds E, F and G against the corpus, opening the real sites rather than
reasoning from the summary. **Both graded all five G lines dead.** Audit 2 graded them dead unanimously;
audit 1 gave G4 and G5 "fixable" and the rest dead. They also agree on the cause, which is the useful part.

**Two of the five are not merely odd, they are broken Japanese:**

- **G1 「角ひとつ、つぶさない。」** is missing its particle. "Not one X" needs 角ひとつ**も**つぶさない. Without
  the も the line reads as a sentence that dropped a word. And 角 alone first reads as a street corner, since
  nothing in the line supplies the carton.
- **G3 「同じ屋根の下に／棚と荷台」** ends on a locative に with the verb amputated — the reader waits for an
  ある that never comes. 体言止め drops the predicate after を or は, not after に. On top of that 同じ屋根の下
  is a FAMILY idiom (and close to a famous TBS drama title); Japanese says ワンストップ or 一貫 for the
  business sense.

The other three: **G2** uses 受け取る手 (not a phrase; natural Japanese is 受け取った手, trade register 受入),
and 手 in business Japanese goes to 人手・手が足りない, so it reads as labour supply. **G4**'s 整える does not
collocate with 荷物 — its homes are 体調を整える, 身なりを整える — and 運び手 is a literary word for a bearer
that quietly demotes the company to the labour doing the carrying. **G5**'s また carries RESIGNATION
(また雨か, また月曜日), so the line reads as a driver's sigh; the industry's word for "every day, still" is
今日も.

Older lines, for the record: **確かに** (E2) is the wrong form — it means "indeed, it is true that"; the
reliability sense is 確実に. **まっすぐ運ぶ** (E4) means straight there with no stops, which advertises the
opposite of a company whose goods stop with them. **方面** (the line on the site today) is station-board
language, and that line is 26 characters, where everything from 25 up in the 90-site pool is search copy.

### The one mistake, five times

> Every line has been built by INVENTING a phrase. 角をつぶさない, 受け取る手で, 同じ屋根の下の棚と荷台,
> 荷物を整える, また朝が来て — not one of these word-pairings exists in Japanese. The corpus does the exact
> opposite: every good line in the 90 is assembled out of phrases the reader already owns, and its quality
> comes from the FIT of known pieces, not from novelty. A line a reader has to work out always sounds
> machine-made, because a person writing Japanese reaches for the phrase that is already there.

That is the owner's complaint, word for word, and it has had the same single cause for five rounds. Both
audits also note the vocabulary: across the sites they opened, the entire working lexicon of this industry's
heroes is about thirty words — 信頼, 安心, 想い, 地域, 未来, 価値, 答え, ニーズ, 誇り, プロ, 物流, 運ぶ,
届ける, 結ぶ, 配る, 載せる, 預かる, 確実, 安全, 迅速, 丁寧, 一貫. A rule that would have killed all five G
lines on its own: **if a word appears on none of the reference sites, it does not go in the headline.**

### What round H has to do

- **Say the combination, not the carrying.** "This is not only a trucking company" is the only claim on the
  table a competitor cannot paste unchanged, and the only one the film cannot make by itself.
- **預かる is the verb nobody has tried.** It is the one ordinary Japanese word that covers carrying AND
  keeping AND handling, it is what a customer actually does when they hand goods over, and 荷を預かる is a
  collocation every reader already owns.
- **Borrow a known grammar.** Two matched beats, each 〜を + plain verb, one 、, closing 。 — or a single
  体言止め noun phrase of 7 to 12 characters that makes a claim. Those two shapes cover most of the
  well-written heroes in the 90.
- **Is a plain, informative hero the answer instead?** Both audits say no, with the same evidence: the plain
  informative hero is a recognisable genre, and the genre is "template site built for Google". Every hero in
  the pool between 25 and 69 characters is one, all of them small regional firms — **and the line on his site
  today is one of them.**

**The wording in these layout frames, 「荷を預かり、確実に運ぶ。」, is a PLACEHOLDER** — a type specimen built
to the new rules so the layouts could be judged on shape and colour. It is not round H's proposal.

## Part two: six layouts, built and shot in the real hero

Four readers surveyed layout: Japanese logistics sites, Japanese corporate sites from the design galleries,
sites whose hero is a video or animation, and distinctly Japanese devices. **Three of the four independently
reported that taking the copy OFF the picture is the mainstream Japanese choice, not the brave one.**

Each layout is a stylesheet in `round2/css/layouts/`, additive, loaded on top of the site's own. **The site's
HTML, CSS and JS are untouched** — every one of these is reachable by CSS alone. `tools/layout-shot.mjs`
renders them in the real hero and prints the stage box and which slice of the 1920x1080 film it shows.

| | what it does | crop at 1440 desktop |
|---|---|---|
| **as it is** | copy over the film, both washes | x 0–1920, y 60–1020 |
| **1 film-card** | the film framed on the right, copy beside it on the page's ground, both washes deleted, caption and buttons under the copy | **x 68–1510, y 8–1080** |
| **2 plate-low** | copy drops to a plate at the foot; the half-screen wash goes, the bottom gradient is no deeper than the plate | unchanged |
| **3 tategaki-rail** | the headline set vertically in a rail at the edge; the film keeps the whole middle | unchanged |
| **4 lozenge** | the wash deleted; each headline line gets its own pale card, exactly as wide as its text | unchanged |
| **5 band-stack** | copy above on a pale ground, the film a letterbox band below; no overlay at all | **x 0–1920, y 225–854** |
| **6 title-beat** | a title card over a veiled frame for the opening scene, then it clears completely | unchanged |

### Honest verdict on the six, as built

- **1 film-card is the best of them on a desktop** and the one that answers both halves of his message: the
  copy is off the film entirely, so both washes are deleted rather than tuned, and the type is more legible
  than any wash has ever made it. **It is broken on a phone as written** — the card squeezes the film to a
  242 px strip and the two buttons stack into slivers. It needs a phone rule that puts the film above the
  copy; that is not written yet.
- **4 lozenge works at both framings** with no further work, and it is the cheapest change on the list: it
  touches no box, no crop and no camera.
- **5 band-stack** is clean, and on a phone it actually shows MORE of the film (900 stage px of width against
  543 today). On a desktop it is the one that genuinely damages the film: it cuts the sun, the upper clouds,
  the top of Tokyo Tower and most of the plane's climb.
- **6 title-beat** is legible and striking, but for the opening seven seconds the film is more covered than it
  is today — and scene 01 is the one scene every visitor sees.
- **2 plate-low is not finished.** The sub-copy sits in white over the pale warehouse wall and the gradient is
  not deep enough there to carry it; on a phone the headline clips off the top of the frame.
- **3 tategaki-rail is the weakest as built.** The vertical headline lands on Tokyo Tower and the vertical tag
  collides with it on a phone. The idea is sound — a column of type costs a ribbon of frame instead of a band
  — but the rail belongs on the left, over open sky, and it is not there yet.

Nothing here is a recommendation to change the site. The site is untouched and this is a project folder.

---

# Part three: the phone rebuilt, and the lightest veil that still reads (2026-11-17)

His next note: *"Not only the wordings, but the smartphone view of the page and its elements / formatting
looks atrocious. For the desktop site view (and the app as well) if possible I would like the animation
section to be able to be visible as much as possible with a hint of somekind of appropriate element for the
text to be visible if appropriate (like the slight fade effect, or a fade effect with a smooth animation that
is appropriate to the animation section)."*

So: maximum film, minimum ink, and fix the phone. All of it is in `round2/css/light/`, additive, four
strengths of one idea. **The site is not touched.**

## What was actually wrong with the phone

Shot and measured rather than guessed (`shots/diag-p1/`). On a 390 px phone the copy furniture took the top
**third** of the screen and the caption bar another sixth, leaving about half for the film:

- the pale wash was a full-width band with a visible edge across the frame at about y 430;
- the headline ran gutter to gutter at 30 px with no margin for the eye;
- the two buttons were **half-screen slabs, 48 px tall** — the heaviest objects on the screen, heavier than
  the headline;
- the tag line ran at 14 px and wrapped awkwardly under it.

The rebuild: the copy block starts at 18 px instead of 32, the headline drops to `clamp(20px, 5.9vw, 27px)`
with a little line-height, the tag to 13 px, and **the two slabs become two content-width buttons** 44 px
tall in a flex row. The caption bar tightens to the edge. Nothing is removed — it is the same copy, the same
two actions, the same controls. The copy block is about 110 px shorter, and the film starts that much higher:
`veil-phone.jpg` shows the whole supplier building, the conveyor, every parcel and the truck, where today the
building is cut.

## The veil: a patch, not a wash

Today's wash pales **half the desktop screen** full height (.86 opaque at x 0, .72 at x 720) to protect copy
that occupies about a seventh of it. The replacement is a soft elliptical patch behind the copy block only,
feathered to nothing by its edge, and the second wash (`.hc-scrim-sign`, which used to stack on scenes 02 and
03 up to 95 %) is deleted outright.

**And it leaves the way the film moves.** When the copy clears after the opening scene the patch does not
just dissolve: it drifts up and left and swells slightly over 1.5 s on the site's own easing, while the words
rise 10 px over 1.1 s — the pace of the film's own clouds rather than a flat fade. It comes back the same way
when the film is paused, when the copy is focused, and under reduced motion it does not move at all.
`clear-desktop.mp4` and `clear-phone.mp4` are the five seconds across that moment; `clear-phone-today.mp4` is
the same five seconds as it is now.

## How faint it can go, measured

`node tools/contrast-check.mjs round2 --css=round2/css/light/patch-<v>.css --from=0 --to=7000 --static`.
Worst case over the opening scene, against what WCAG AA needs:

| | peak | headline, desktop (needs 3) | sub-copy, desktop (needs 4.5) | headline, phone (needs 3) |
|---|---|---|---|---|
| today's wash | .86 across half the screen | 9.74 | 9.86 | 12.21 |
| **strong** | .95 | 9.85 | 9.94 | 10.45 |
| **soft** | .82 | 7.19 | 7.17 | 7.84 |
| **faint** | **.64** | **4.91** | **4.84** | **5.58** |
| whisper | .46 | 3.30 | **3.29 FAIL** | 4.04 |
| nothing at all | — | **1.33 FAIL** | **1.34 FAIL** | **2.05 FAIL** |

**Faint is the floor.** One notch below it the desktop sub-copy drops under what it needs, and that is a real
limit rather than a matter of taste: the worst spot is where the headline crosses the supplier building's
dark storey at t=0, which no amount of narrowing avoids because it is the copy's own position.

The recommendation is **faint**, with soft as the cautious choice. At faint the left half of the desktop
frame is plainly daylight — the sky keeps its blue, the sun its rays, the clouds and the building read
through it — where today that half is flat pale.

## Checks

- `node tools/check-viewer.mjs round2` → **viewer OK: 0 console errors**, all three framings. (One earlier run
  reported `ERR_NO_BUFFER_SPACE` against the round-1 side; it did not repeat and is the machine running out of
  sockets under many parallel browsers, not the page.)
- `contrast-check` at faint: every text row passes at both framings. The only failures left are the two
  `track unfilled` rows, which are the site's own progress bar over a pale sky and **fail on the `original`
  side too** — pre-existing, not ours.
- `cd original && sha256sum -c SHA256SUMS` → 7 OK.
- `tools/record.mjs` now takes `--css=<file>`, the same flag `contrast-check.mjs` has, so a proposed overlay
  can be recorded without changing a file on disk.

Nothing here is wired into a side yet: these are proposals measured in the real hero, and the working copy is
exactly as it was.

---

## He picked faint, and wiring it in found two more faults (2026-11-17)

`patch-faint.css` is now live on the `round2` side (`sides.json` takes a LIST of stylesheets, loaded after
`hero-copy.css`). Measuring the wired side across the whole film, rather than only the opening scene, turned
up two things the first cut had wrong. Both are fixed in the file; the numbers above for the PLAYING state
are unchanged.

- **The copy needs two strengths.** While the film plays the copy is only up on the opening scene, where
  faint is enough. But paused or keyboard-focused it comes back on whatever scene is on screen — and over
  the expressway the headline measured **2.47 against the 3 it needs**. So `.is-static` and
  `:has(.hc-content:focus-within)` now take the patch to full strength and let the second wash return.
  Nothing is lost by that: the film is stopped, so there is no animation to keep visible.
- **The site's own mask had to be kept.** The first cut cleared it (`mask-image: none`, copied from the
  phone rule). That mask is opaque to 70% of the height and gone by 88%, and it is the only thing stopping a
  pale wash reaching the dark band under the captions. With it cleared, the caption text measured **2.44 and
  2.43 against the 4.5 it needs** when the film was paused on the finale. Kept now.

**Where it stands, measured on the wired side:**

| | worst copy row | worst caption row | other failures |
|---|---|---|---|
| whole film, playing | 4.84 (sub-copy, needs 4.5) | 4.84 (needs 4.5) | the 2 `track unfilled` rows only |
| whole film, paused | 5.65 (tagline, needs 4.5) | 4.84 (needs 4.5) | the 2 `track unfilled` rows only |

`check-copy` OK. `check-viewer` 0 console errors at all three framings. `original/` 7 of 7. The two
`track unfilled` rows are the site's own progress bar over a pale sky and fail on the `original` side too.

The whole-film recordings were made again, because the overlay changed: `evidence/2026-11-16-the-film/`.
