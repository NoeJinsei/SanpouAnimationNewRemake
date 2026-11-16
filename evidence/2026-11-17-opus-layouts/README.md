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
