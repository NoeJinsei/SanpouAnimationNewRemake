# What to change on the website, and why (2026-11-19)

Six readers surveyed **38 readable Japanese logistics company sites** — navigation and page sets, home-page
section order, wording register across a whole site, service pages, 会社概要 and 採用, and what reads as
current rather than 2015. Everything below has evidence behind it; anything that did not, is not here.

## The wording: it is not a vocabulary problem

The clichés are **already absent**. Counted across all 21 pages: 迅速 **0**, ニーズ **0**, 寄り添う **0**,
弊社 **0**, 安心 **1**, 〜させていただ **4** (two of them in a holiday notice, where it is correct). The
register is right too — です・ます in sentences, nouns in headings, 当社 throughout, 私たち only in the
president's greeting.

What reads as machine-made is **four habits of shape**:

1. **Sentences whose only job is to announce the section below them.** The ones ending ご案内します /
   ご紹介します / まとめました. **29 of them in visible copy** (19 + 8 + 2); `reasons.html` alone has five.
   Not one of the 15 carrier sites read opens a 会社概要 table, a history or a strengths block that way —
   they go straight from the heading to the table. **This is the loudest tell, and the fix is the delete
   key.** (The 18 more in meta description tags are doing their job there and stay.)
2. **Soft verbs on the promises that matter.** 努めます / 努めています **11 times, 5 on the safety page**, on
   exactly the items a shipper wants committed. Credible peers name the tool and use a flat verb. One
   exception: the statutory safety-policy text keeps its official wording, 努めます included, because a
   compliance reader checks it against the government model.
3. **Two abstract nouns glued together with a soft verb** — "業務効率の向上とコストの適正化をお手伝い" has
   nothing you can picture or check. **The test to apply to every paragraph: is there a number, a named
   tool, a named operation, or a photograph of their own beside it? If not, cut it.** Length is not the
   problem; floating prose is.
4. **Lists invented from the category rather than from the job book** — and this one was untrue. See below.

## Two false claims, found and cut (the owner confirmed on 2026-11-19)

Same-day and emergency spot work is on the client's own removed list. It was being advertised twice:

- `reasons.html`: 「繁忙期の増便や**当日の緊急便**にも…」 → the clause cut, the sentence kept. Not falling
  back on 傭車 is the strongest operational claim on the site and it still stands for the busy season.
- `business.html`: 「催事・イベント物資の**緊急輸送**など」 → replaced with work the same page already
  documents two paragraphs above, 印刷物・原紙のパレット輸送, so nothing is invented.

**No same-day or emergency claim now appears anywhere on the site.** Both are committed in the site's own
repository (`d73a789`, `132fa77`). That repository **has no remote**, so the changes are local only.

## The safety page is unfinished, and only the owner can finish it

**16 「要入力」 placeholders on `safety.html` and 3 on `recruit-requirements.html`** — template slots that
shipped. They sit inside `hidden` blocks so nothing broken shows, but the result is that the page tells a
reader to telephone for figures a shipper expects to read: the policy date, the year's targets, last year's
results, the accident breakdown, and the 受動喫煙対策 line the job adverts are legally required to carry.
(The survey reported 28 on safety.html; my own count is 16. Mine is the one I can stand behind.)

## The changes, ranked

| | area | change | effort |
|---|---|---|---|
| 1 | wording, all pages | delete the 29 "this section is about…" sentences; heading straight into the table or cards | small |
| 2 | wording, safety + business | replace 努めます with the plain verb and the named tool, except in the statutory text | small |
| 3 | facts | **done** — the two false claims above | small |
| 4 | home page | nine bands down to six or seven: fold 拠点 / 車両・設備 / 安全 / 会社案内 into one row of cards, and **move お知らせ down from directly under the hero** | medium |
| 5 | safety page | fill the placeholders (owner's figures) | small |
| 6 | photographs | replace the 15 generated illustrations and 3 borrowed road photos with their own yard, dock, forklifts, a roll in the clamp, and each of the three bases | medium |
| 7 | navigation | bring 車両・設備 out of the footer, or fold it into 事業内容 as 事業・車両紹介 | small |
| 8 | business page | make **paper on rolls a named capability** — no surveyed carrier presents roll-clamp handling as a service, so it is the one thing no competitor can copy | medium |
| 9 | english labels | keep one roman word per top-level section; delete the sub-block ones (Roll call, Maintenance, Lineup) — no Japanese carrier labels a safety sub-block "Roll call" | small |
| 10 | calls to action | add a softer second button beside お問い合わせ — 資料請求 / 会社案内ダウンロード, a 2–4 page PDF built from pages that already exist. 資料請求 appears **0 times** today | medium |

**On the home page's order:** across 20 peer home pages the **median is 7 sections**; ours has nine, and
news sits directly under the hero, which spends the best space on the least persuasive content.

**Our navigation is already right.** 事業内容 / 選ばれる理由 / 拠点・配送エリア / 会社案内 / 採用情報 /
お知らせ is six items in the majority order, and dropping the ホーム item puts us with the current builds
rather than the templates. 採用情報 in the main nav is correct (33 of 38 do it). The header's phone-plus-
contact corner is the small-carrier convention — the one refinement is to show the reception hours beside
the number, as 丸正運輸, 北関東物流, 春日運送 and the company's own old site all do.

## Pages most peers have that we do not

事例紹介 / お客様の声 (13 of 38 — the page that answers "have you carried something like mine");
環境・サステナビリティ or a welded 安全・環境 (17 of 38); a landing page for someone looking for storage
space (8 of 38, and we sell storage); 資料請求 / 会社案内ダウンロード; ご利用の流れ as a nav line (the
content already exists on business.html); and 「ご家族の皆様へ」 under recruit, which three carriers of our
size carry and which is aimed at the driver's family.

## Overbuilt, for what it is worth

サイトポリシー as its own page carrying font licences, image credits, browser recommendations and a security
contact — no surveyed carrier publishes any of that. The quote band under the privacy policy and the 404.
Three recruit pages for a 35-person company, which is fine **only if someone edits them when a vacancy
closes** — a quarter of peers send the live vacancy list to an outside job board for exactly that reason.
Worth keeping although rare: 運送約款・掲示事項 (7 of 38) and 入庫のご案内 — quiet credibility against
template sites.

## Only the owner can answer these

- **The headline.** "Probably something like 3" is still ambiguous between wording **H3** and layout **3**.
- **Will he take the photographs?** Everything in item 6 is free if he does and impossible if he does not.
  A phone in daylight, 20–30 frames, shot straight on, is enough; no photographer, no budget.
- **The safety figures** — policy date, targets, last year's results, accident breakdown. If the figure is
  not zero it still has to be published.
- **受動喫煙対策** at each base, for the job adverts. Legally required wording, so it needs the fact.
- **Will the vacancy page be maintained?**

---

## Done so far (2026-11-19), and what each cost

| # | item | result |
|---|---|---|
| 3 | the two false claims | **done** — `d73a789`, `132fa77` |
| 1 | the announcement sentences | **done** — `7b8b433`: 11 cut, 2 trimmed, 13-line diff, 0 left in visible copy |
| 4 | the home page | **done** - d2fbc9a: 9 bands to 7, news moved off position 2, page 12% shorter |
| 9 | the english labels | **done** - 5f6ba73: 103 labels in 62 words down to 56 in 24 |
| 2 | the soft verbs | **partly done** — `2383c4f`: 3 of 11 flattened; 8 kept on purpose |

**Why item 2 is only partly done, and it is not laziness.** The recommendation was "replace the soft verb
with the plain verb **and the named tool**". The second half is not available: the company's own fact list
rules out claiming digital tachographs or dashcams, and no other equipment is documented anywhere in the
project. So softness could be removed; specifics could not be added. Eight of the eleven were kept, each
for a reason:

- **privacy.html ×2 and the sitepolicy disclaimer** — statutory and standard legal wording. A compliance
  reader checks these against the model text.
- **safety.html ×3** — inside the transport-safety policy the law requires to be published. Not editable.
- **company.html ×2** — both in the president's greeting, where 努めてまいります is the correct register
  and not a dodge. The survey's complaint was about service-page promises, not a 代表挨拶.

**What would finish item 2:** a list from the owner of what is actually fitted and actually done — the
equipment in the cabs, who runs the safety training and how often, whether ride-along coaching happens.
Each fact turns one soft sentence into a hard one. Without them, the honest move was to stop at three.

## Two mistakes of mine on this pass, recorded so they are not repeated

1. **A substring that the site's own `nw` spans split in two.** The site wraps phrases in
   `<span class="nw">` to stop them breaking, so a plain-text substring often does not exist in the markup.
   The script's uniqueness guard caught this four separate times and wrote nothing each time.
2. **CRLF converted to LF.** Reading with Python's default text mode translated the line endings, so the
   first successful run rewrote **every line of eight files** — 3,119 insertions where there should have
   been 2. Reverted with `git checkout --`, and the script now reads *and* writes with `newline=""`.
   **Any future script that edits this site must do the same**, or the diff becomes unreadable and the real
   change is invisible inside it.
