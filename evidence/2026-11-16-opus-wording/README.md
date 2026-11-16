# The hero's wording: three directions (Opus, 2026-11-16)

The owner, 2026-11-16: "I never really liked the wording there, it sounds really off, doesnt sound like a
text or phrase a person wrote it, doesnt sound natural like what other websites for a logistics company
uses it."

**Nothing is changed.** The copy lives in `original/site/hero-section.html`, which this project only reads,
and copy is the owner's call. These are options rendered in the real hero so they are judged on the
picture: `node tools/copy-shot.mjs round2 copy/hero-copy-options.json <outDir> [--framing=]`, which puts
the words into the page after it loads and touches no file.

## Two things I had wrong, corrected

- **「昭和50年」 is fine.** I said earlier that it needs converting to a year. For a Japanese reader of a
  fifty-year-old company's site it is normal, and it carries the age better than "1975" would. The real
  fault is that it appears twice, in the tag and again in the sub, saying nearly the same thing.
- **「関東一円」 is not on screen and never was.** It has stood as an open copy worry in the notes for days.
  It is in `hero-port-b.js` twice (`CONTENT.brand.commitBody`, and scene 03's `SceneCaption`), but both are
  inside `SceneTitle` / `SceneCaption`, which `return null` when `window.JX_CLEAN_HERO` is set — and
  `hero-flag.js` sets it. Dead code. Nothing to decide, and `CONTEXT.md`'s ban is not being broken.

## What is actually off, as against what is only taste

| | |
|---|---|
| **Genuinely off** | The headline is built backwards: 「関東1都6県と新潟市方面へ、板橋からお届けします。」 says where to, then where from, then the verb. Japanese says where from, then where to. |
| **Genuinely off** | **「方面」 is timetable language** — it is what a station board says, not what a company says about its customers. |
| **Genuinely off** | The sub is ONE 70-character sentence carrying six facts: the year, the half-century, three branch names, the vehicle count and five services. |
| Taste only | 「お引き受けしています」 reads a little subcontractor-ish. 「承っています」 is warmer. Not wrong either way. |
| Not off | 昭和50年, 三豊運輸, 事業内容を見る, お問い合わせ, and the five scene captions along the bottom — I read them all; they are plain, consistent and fine. |

## The three directions

All keep every fact: 関東1都6県, 新潟市方面, 昭和50年創業, 板橋・志木・入間の3拠点, 32台の自社車両,
輸送・配送・倉庫保管・流通加工・3PL. Pictures: `desktop.jpg`, `phone.jpg`. Words:
`copy/hero-copy-options.json`.

**A — one word out, one sentence split.** The smallest change that fixes a real fault.
「関東1都6県と新潟市へ、／板橋からお届けします。」 with the sub split after 半世紀 and 承っています for
お引き受けしています. Same shape, same rhythm, no 方面.

**B — where from, where to, then the promise. My pick.**
「板橋から、関東と新潟市へ。／毎日の荷物を、確かに運ぶ。」 Two short sentences of the same length, said in
the order Japanese says them, and it sounds like a person. 関東 is not a loosening of the facts: 関東地方
IS 1都6県 (茨城・栃木・群馬・埼玉・千葉・東京・神奈川), and the sub still spells it out.

**C — half a century first.** 「昭和50年から、板橋で。／地域の物流を支えています。」 Warm, and leads with
the age. Two costs: the headline no longer says where they deliver (the sub carries it), and
「地域の物流を支えて」 collides with scene 05's caption 「創業以来、地域の物流を支えてきました。」 — one of
the two would have to move.

## The phone decides the shape

`.hc-line` is `white-space: nowrap` and the headline is `clamp(21px, 6.6vw, 30px)`, so on a 390 px phone a
line has **358 px** and cannot wrap out of trouble. Measured by the tool:

| | line 1 | line 2 | |
|---|---|---|---|
| as it is | 14 chars, 345px | 11 chars, 289px | fits, with 13px to spare |
| A | 12 chars, 292px | 11 chars, 289px | fits |
| **B** | 13 chars, 341px | 13 chars, 341px | fits |
| C | 12 chars, 294px | 13 chars, 341px | fits |
| B, politely (…確かに運びます。) | 341px | **394px** | **over by 36px** |
| B, spelling out 1都6県 | **423px** | 341px | **over by 65px** |

So B's plain-form ending and its 関東 are not stylistic whims: the polite ending and the spelled-out
prefectures each overflow a 390 px phone. That is also why the headline as it stands has only 13px of room.

## Before this ships

I am not a native writer of Japanese business copy. The faults above are structural and I am confident
about them; the replacements should still be read by a native speaker, and by the owner, before they go on
a real company's home page.
