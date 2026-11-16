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

---

# Round 4: better words inside the two shapes he picked (2026-11-16)

His answer to E1-E4: *"Either E1 or 3, but I think it could worded better."* So the shape is settled twice over
and only the words were open. Both branches were rewritten by a workflow of eight agents - two writers per
shape from different angles, a ranking pass per shape against the twelve-site conventions, and an adversarial
pass told to assume every finalist was bad. 40 candidates written, 5 ranked per shape, 10 stress-tested.

## What the adversarial pass killed, and why it matters

Nine of the ten finalists were dropped, every one on a ground that can be checked rather than argued:

- **Anything with 32台 in it.** Four of shape B's five finalists put the fleet in the headline. The number is
  already in the sub directly beneath it, and 「板橋の32台」 hands the whole fleet to Itabashi when it is spread
  over 板橋・志木・入間. No hero among the twelve reference sites carries a fleet count.
- **「倉庫も車も自社で持つ」** - `CONTEXT.md` says 倉庫保管 is a service of theirs; it does not say they own the
  warehouses. An unverifiable claim cannot ship.
- **「板橋から…まで」** - 板橋 is IN 関東, so から…まで reads as a span that ends where it started. へ tolerates
  this (it reads as dispatching outward); まで sharpens it into a route and exposes the geography.
- **「…届ける。」** - this is his current 「お届けします。」 with the politeness clipped off. 届ける is the single
  most worn verb on every delivery site in Japan and carries the parcel-to-a-householder flavour the B2B round
  already threw out.
- **「今日も…」 and 「…走る。」** - both are the cadence of driver-recruitment and CSR pages in this trade. 走る
  also says the trucks move without saying anything arrives, and leans on dash and hustle beside a company that
  does not take same-day or emergency spot work.
- **Anything opening 「荷物を、」** - scene 01's caption 「お預かりした荷物を、丁寧に検品します。」 is the one
  caption on screen at the same time as the headline, and it breaks at the same place.

## The four that survived, in `copy/hero-copy-final.json`

`final-desktop.jpg` and `final-phone.jpg`, each beside the E1 or E3 it answers.

- **F1 「板橋から、／関東と新潟市へ運ぶ。」** (5 + 10) - **the pick.** E1 with the one word it was short of.
  E1 is two place names and a particle, so it reads like a label on a map; 運ぶ finishes it into a sentence
  without touching a word he already approved. It is the only verb with no problem attached: plain trade
  language, the only verb that appears nowhere else on the screen (the tag says 輸送, the sub says カバー, the
  captions say 積み込みます and 向かいます), and the 運 of 運輸 in the company's own name, so headline and
  truck chime. Claims nothing they cannot do.
- **F2 「板橋から／関東と新潟市へ」** (4 + 7) - his own words with the punctuation taken out, which answers his
  comma note directly: no 、 anywhere, so the question cannot arise. The quietest of the four.
- **F3 「板橋から関東と新潟市へ」** (11, ONE line) - the same words again, on one line. A one-line hero is the
  commonest shape among the twelve, and on this page it lifts the tag and both buttons and opens the most
  picture of any option. 「〜へ」 as an ending is ordinary Japanese headline form.
- **F4 「関東と新潟市へ運ぶ／板橋の三豊運輸」** (9 + 7) - **the answer to E3.** 体言止め, no punctuation, and it
  replaces both weak halves of E3: 「つなぐ」 (the most worn verb in this industry's copy) and 「毎日の物流」
  (a noun phrase that could belong to anyone) with what the company is and where it is. 佐川's own hero names
  itself the same way.

**The one argument against F1,** found by the adversarial pass and worth saying out loud: 運ぶ is transitive and
the line never gives it an object, so on paper it reads a step clipped. On this page the object is on screen -
cartons going into the truck behind the words, and the tag beneath names the cargo work.

**One structural thing for later, not changed:** 関東と新潟市 now appears four times on one screen - headline,
tag, sub, and scene 04's caption 「配送エリアは、関東1都6県と新潟市方面です。」. Every finalist that reached for
a fact collided with the copy below it, because the tag and sub already carry every fact the company has. If he
wants the headline to say something new, the room has to come from shortening the tag, not lengthening the H1.

## Widths, measured as always

A headline line has 358 px on a 390 px phone. F1 131/263, F2 105/184, F3 289, F4 236/184 - against the 345 of
358 the line as it stands uses. All four have room at both framings.

**Still true:** nothing is changed, copy is the owner's call, and a native writer should read whichever he picks.

---

# Round 5: off the place names altogether (2026-11-17)

His verdict on F1-F4: *"None really clicks with me, maybe because we are emphasizing the names of the
location / city / prefecture too much here, when that is not the main message we want to write on the hero
section of our website."* And: check more Japanese logistics sites.

## First the survey, because it changes the brief

`research/jp-hero-survey-2026-11-17.md` — six readers, 123 companies, **90 heroes actually readable**,
every one classified by what it SAYS. The findings that matter here:

- **He was right about the places.** 13 of 90 contain a place name, but seven are search-engine sentences
  pasted in as a headline on template sites. **Exactly one is a written place slogan** (a 612-staff carrier
  whose claim IS its twelve prefectures), and **not one of the 90 is built as "from X to Y"** — the shape of
  every draft he rejected.
- **The verb goes last and what it acts on first.** Not one hero in 90 is built as "to X, from Y, we carry".
  That is the second reason the drafts read wrong, independent of the place names.
- **No hero carries facts** — no fleet, no year, no depots, no service list. So the tag and the sub under the
  headline, which carry all of them, are exactly where the industry puts them and they stay.
- **The three types that fit: PROMISE, ROLE, IDENTITY.** PROMISE is the largest group among small carriers
  and the nationals barely touch it — "we are reliable" is defensive from a famous brand and necessary from
  an unknown one. ROLE runs the other way, so a ROLE line from 32 trucks must stay the size of a street or a
  morning, never a nation. SCOPE, CHANGE, CHALLENGE, BENEFIT and INVITATION are traps, with reasons.

## Then the writing round

Six writers, two per type from different angles, a ranking pass per type, then one adversarial pass across
all three told to assume every finalist was bad. Options in `copy/hero-copy-message.json`,
`message-desktop.jpg` and `message-phone.jpg`.

- **G2 「受け取る手で、送り出す。」** (12, one line) — **the reviewer's pick.** It says the one thing that
  separates this company from the carrier next door — the same house takes the goods in, keeps them, works
  on them and sends them out — and it says it without naming a service. Two matched beats of six either side
  of one 、, verb last, and its first half is literally on screen while it is read.
- **G1 「角ひとつ、つぶさない。」** (5 + 6) — **the workflow's own pick**, and the disagreement is worth
  showing rather than hiding. The most spoken line in the set and the most memorable: a crushed carton
  corner is exactly what a shipper complains about, and only a firm that puts hands on the goods ever sees
  them. It says care without 丁寧・確実・安全. Against it: 「〜ひとつ、〜ない」 is the shape of the safety
  slogans that hang in depots, so a native reader has to confirm it lands as a person and not as a poster;
   角 means boxes, so rolled paper falls outside the picture; and it is an absolute about damage.
- **G3 「同じ屋根の下に／棚と荷台」** (7 + 4, no punctuation) — the most exclusive claim here: a
  trucking-only firm cannot say it at all. Against it: ひとつ屋根の下 is a household idiom and a famous
  drama title, and **the picture does not back it** — the headline plays over the supplier's door in scene
  01, not over their own warehouse.
- **G4 「荷物を整える運び手」** (9, one line) — the shortest, a clean formal profile. Against it: 整える
  reads first as tidying luggage, and 運び手 is current trade-press vocabulary (運び手不足), so it is less
  distinctive than it looks.
- **G5 「また朝が来て、また運ぶ。」** (7 + 5) — the most human voice in the whole set; no template could
  produce it. Against it: it owns nothing — any carrier could paste it — the doubled また can read as
  weariness, and 運ぶ alone throws away the keeping and handling half of the business.

**Killed, with the reason, so the same ground is not walked twice:** anything using 荷物 (scene 01's caption
sits in the same frame and uses it), 届く／届ける (the most worked verb in Japanese delivery copy and
parcel-to-a-household in register), 棚に並ぶ (a shop shelf, which narrows the cargo on the day he said the
customer must not be narrowed), 置いておく (in freight, goods sitting is a failure, not a service),
重い荷ほど静かに運ぶ (静かに lands first as low-noise night delivery), 同じ顔の運転手 (reads as a stone-faced
driver), and every noun-ending line that carried punctuation.

## Widths, measured as always

A headline line has 358 px on a 390 px phone. G1 131/158, G2 315, G3 184/105, G4 236, G5 184/131 — against
the 345 of 358 the line as it stands uses. The whole set is 11 to 12 characters, which is the industry's
median, not a compromise forced by the phone.

**Still true:** nothing is changed, copy is the owner's call, and a native writer should read whichever he
picks — G1 especially, because the safety-slogan question can only be settled by a native ear.
