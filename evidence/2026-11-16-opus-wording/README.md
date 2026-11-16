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

---

# B2B: the owner's answer, 2026-11-16

> "Probably something along the line of C, but more polished considering the context of our company
> (our operation is close to B2B rather than to consumers directly so (Medium to Large companies))."

That is a change of brief, and it names the fault better than "it sounds off" did.

## The copy was written in consumer register

「お届けします」 is parcel language — what a 宅配 company says to a householder. The reader this site is
for is a 物流部長 or a 購買担当 at a mid-to-large manufacturer, choosing a partner. That reader does not
want to hear that you will deliver something **to** them; they want to know you can take their logistics
**off** them. Hence, through all four options below:

| consumer word | B2B word used instead | why |
|---|---|---|
| お届けします | 担う / 一貫して | shouldering the job, not handing over a parcel |
| 支える | 担う | 支える is CSR language, and it collides with scene 05's caption 「創業以来、地域の物流を支えてきました。」 |
| 地域の | 企業の / 荷主企業の | says who the customer is, outright |
| (services last) | services first in the sub | 輸送・保管・流通加工・3PL is what a buyer scans for; it used to be at the end of a 70-character sentence |

The sub is the same in all four: 「輸送・配送から倉庫保管、流通加工、3PLまで一貫して。板橋・志木・入間の
3拠点と32台の自社車両で、関東1都6県と新潟市方面をカバーしています。」 Two sentences: what you can hand
over, then the capacity and the reach. Every fact kept.

## The four

Pictures: `b2b-desktop.jpg`, `b2b-phone.jpg`. Words: `copy/hero-copy-b2b.json`.

- **C1** 「昭和50年から、板橋で。／企業の物流を担っています。」 The plainest: C's shape exactly, with 担う
  for 支える. Safest, warmest, nothing to argue with.
- **C2** 「半世紀、板橋の物流会社。／荷主企業の物流を担います。」 **The pick.** Line 1 is proof and a plain
  self-description; line 2 names the customer in the customer's own word (荷主企業) and finishes the verb.
  Identity, who it is for, what is done — in 25 characters.
- **C2-50** the same with 「創業50年」 in front. The badge is louder; strictly the company is 51 years old
  (founded 昭和50年 = 1975), so 50年 is the usual rounding rather than the fact. 「半世紀」 avoids that.
- **C3** 「昭和50年、板橋から。／止めない物流を、企業へ。」 The boldest, and the most memorable. It is also
  a promise with nothing on the page to back it up, and a hostage to the first bad day.

## Again, the phone sets the shape — measured, not guessed

A headline line has 358 px on a 390 px phone (`white-space: nowrap`, `clamp(21px, 6.6vw, 30px)`).
All four fit. These did not, and that is why they are not on the list:

| tried | widest line | |
|---|---|---|
| 創業半世紀、板橋の物流会社。 | 368px | over by 10 |
| 昭和50年創業、板橋の物流会社。 | 399px | over by 41 |
| 昭和50年から、板橋で。／**荷主企業の**物流を担っています。 | 394px | over by 36 |
| 創業50余年、板橋の物流会社。 | 372px | over by 14 |
| 荷主企業の物流を、一貫して。 (with the comma) | 368px | over by 10 |

So C2 is the only shape that carries the half-century, the word 荷主企業 and a finished verb inside a
phone's line. C1 drops 荷主企業 for 企業; C2-50 trades 半世紀 for the rounder badge.

Re-run any wording: `node tools/copy-shot.mjs round2 copy/hero-copy-b2b.json <outDir> [--framing=phone]`.
It prints every line against that 358 and touches no file.

**Still true:** nothing is changed, copy is the owner's call, and a native writer should read whichever he
picks before it goes on a real company's home page.

---

# Measured against the industry, 2026-11-16

The owner gave the live site (https://www.sanpou-unyu.com/), reminded us that **紙スリッター加工 is no
longer done**, said the comma in both lines reads odd, and asked for the style to be checked against other
Japanese logistics sites. Six were read; the links and the full conventions are in `REFERENCES.md`.

## What the company's own site says today

Its main heading is a service list — 「紙スリッター加工業・運送業・倉庫保管」 — and it **leads with the
service the company has dropped**. It also names only two warehouses (板橋・志木, not 入間), gives the
coverage as 関東 with no mention of 新潟, and carries no founding year, no vehicle count and no staff count
anywhere. Whatever is decided here, that page is advertising work the company no longer takes.

## The six conventions, and what each one costs the copy as it stands

| | the convention | the new site's line |
|---|---|---|
| 1 | lines of 3 to 14 characters, most 6 to 12 | 14 and 11 — about twice the norm across both |
| 2 | **the 、 marks the line break: end of line 1, nowhere else** | has it at the break, which is right |
| 3 | one 。 at the very end, or none | has one 。 — right |
| 4 | **plain form 常体 or 体言止め, not です・ます** | 「お届けします」 is polite AND 宅配 language |
| 5 | a slogan or a stance, never a service list | it is a statement of delivery — close enough |
| 6 | **the customer is not named in the headline** | it names no customer — right |

Convention 6 kills the earlier recommendation. **「荷主企業」 in a headline is something no one in the
industry does.** It was wrong and is withdrawn. 企業の is as far as a headline should go, and the sub
carries the rest.

Convention 4 is the other correction: 担います / 担っています were too polite. The industry uses the
dictionary form — 担う.

## The four, in the industry's own grammar

Pictures: `industry-desktop.jpg`, `industry-phone.jpg`. Words: `copy/hero-copy-b2b.json`. All four are
8–12 characters a line, one 、 at the break, one 。 at the end (or none), plain form, no customer named,
and every fact kept in the sub.

- **D1 「板橋から半世紀、／企業の物流を担う。」** (8 + 9) — **the pick.** Where they are, how long they
  have been there, and that they take the whole job. 企業の sets the B2B footing without trade jargon.
- **D2 「昭和50年から、／関東の物流を担う。」** (8 + 9) — the same shape with the ground instead of the
  reader. Loses 新潟市方面 from the headline; the sub still has it.
- **D3 「創業から半世紀、／物流をまるごと担う。」** (8 + 10) — まるごと says 一貫 and 3PL in a word anyone
  reads. The warmest of the four.
- **D4 「昭和50年から、／企業物流の一貫パートナー」** (8 + 12) — noun-ending, no full stop, the most
  3PL-sounding. Also the most like everyone else's.

The sub is unchanged from the B2B set: 「輸送・配送から倉庫保管、流通加工、3PLまで一貫して。板橋・志木・
入間の3拠点と32台の自社車両で、関東1都6県と新潟市方面をカバーしています。」

## Widths, measured as always

A headline line has 358 px on a 390 px phone. D1 210/236, D2 189/236, D3 210/263, D4 189/315 — all four
have room to spare, where the line as it stands uses 345 of 358. Shorter lines are not only the convention;
they are what leaves the picture visible on a phone.

**Still true:** nothing is changed, copy is the owner's call, and a native writer should read whichever he
picks.

---

# Round 3 of the wording: no years, no 企業 (2026-11-16)

The owner's answer to D1–D4: *"I dont want to emphasize on the years of operation, just a bit more basic
but still relatively impactful, also not focusing on 企業 as well, since we do want to be flexible in
operation partners."* And: check more Japanese logistics homepages.

## Six more homepages read

Recorded in `REFERENCES.md` with their links. Two of them are his own neighbours in 板橋.

| | the hero, as it stood |
|---|---|
| 西濃運輸 | ONE line, 12 chars, one 、 inside it, 。 at the end, plain form |
| 佐川急便 | ONE line, 、 after the opening adverb, **polite ます** |
| SBSホールディングス | ONE line, 13 chars, one 、, plain form |
| ハマキョウレックス | ONE line, 8 chars, 体言止め, **no punctuation at all** |
| 服部運輸倉庫 (板橋区高島平) | 3 lines, 9/5/7, 体言止め; **opens with 創業から半世紀** |
| 首都圏物流 (板橋区板橋) | one long 体言止め line, recruiting-flavoured |

Unreadable: 福山通運 (mis-encoded), 第一貨物 / 名鉄運輸 / ニッコンHD (picture heroes), センコー (403),
新潟運輸 and 久留米運送 (no such host).

**Three things the second round changed.**

1. **A single 、 inside ONE line is normal** — 西濃, 佐川 and SBS all do it. What none of the twelve does
   is put a 、 in BOTH lines, which is exactly what the new site does and what the owner noticed. At most
   one 、 in the whole headline; if it breaks, the 、 goes at the break.
2. **A one-line headline is the commonest shape of all** — 5 of the 12. On this site it also lifts the tag
   and the buttons and leaves much more of the film visible, a phone especially.
3. **The nearest company already opens with 半世紀.** 服部運輸倉庫 is in 板橋 too. A second 板橋 carrier
   opening the same way is its own reason not to — on top of the owner's.

And 企業 appears in none of the twelve heroes, so the earlier note that "an SME may say 企業の" is withdrawn.

## The four, in `copy/hero-copy-basic.json`

`basic-desktop.jpg` and `basic-phone.jpg`. Each is a different shape as well as different words.

- **E1 「板橋から、／関東と新潟市へ。」** (5 + 8) — where from, where to, and nothing else. The most basic
  of the four and the most concrete: it is the only one that says a real place.
- **E2 「毎日の荷物を、／確かに運ぶ。」** (7 + 6) — the job itself. 毎日 does the work 半世紀 used to do:
  it says dependable without counting years.
- **E3 「関東と新潟市をつなぐ／毎日の物流」** (10 + 5) — 体言止め, no punctuation at all, so the comma
  question does not arise. The calmest.
- **E4 「荷物を、まっすぐ運ぶ。」** (11, ONE line) — the commonest industry shape. On a phone the single
  line lifts the buttons and opens the sky above the truck.

**新潟市, not 新潟.** The company covers 新潟市方面, not the prefecture. Dropping the 市 in a headline would
be an over-claim, so all four keep it.

The tag and the sub are the B2B set unchanged, and neither carries 企業 or a founding year:
「関東1都6県・新潟市方面　輸送・保管・流通加工・3PL」 and 「輸送・配送から倉庫保管、流通加工、3PLまで一貫
して。板橋・志木・入間の3拠点と32台の自社車両で、関東1都6県と新潟市方面をカバーしています。」
昭和50年創業 is now in none of it; it can go back into the sub's tail on one word from him.

## Widths, measured as always

A headline line has 358 px on a 390 px phone. E1 131/210, E2 184/158, E3 263/131, E4 289 — against the
345 of 358 the line as it stands uses. All four have room to spare at both framings.

**Still true:** nothing is changed, copy is the owner's call, and a native writer should read whichever
he picks.
