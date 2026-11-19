# Rewrite the second-pass write-ups. Two reviews found ten statements in them that were
# wrong or over-general; several commit-message claims were wrong too, and a commit
# message cannot be corrected without rewriting history, so the correction lives here.

import io, sys

def swap(path, start_marker, new_text):
    with io.open(path, "r", encoding="utf-8", newline="") as f:
        s = f.read()
    E = "\r\n" if "\r\n" in s else "\n"
    i = s.find(start_marker)
    if i < 0:
        sys.exit("ABORT: %r not found in %s" % (start_marker[:40], path))
    if s.count(start_marker) != 1:
        sys.exit("ABORT: %r is not unique in %s" % (start_marker[:40], path))
    s = s[:i] + new_text.replace("\n", E)
    with io.open(path, "w", encoding="utf-8", newline="") as f:
        f.write(s)
    print("rewrote the tail of", path)


PROPOSALS = r"C:/Users/RTX4070TI/Desktop/sanpou-site-v2/PROPOSALS-NOT-YET-APPLIED.md"

swap(PROPOSALS, "---\n\n# Second pass, 2026-11-19", """---

# Second pass, 2026-11-19 — what was done, what was not, and one thing that was undone

Conventions 11, 15 and 16 were done whole. Four more were done in part and one was
attempted and reverted. The reasons differ and are given one by one below; an earlier
draft of this section claimed they were all the same rule, which was not true.

**This section was rewritten after two independent reviews of commits 4158405 and
e300be8.** Between them they found that the sitepolicy edit broke the very rule the
same commit cited elsewhere, and that ten statements in the commit messages and in this
file were wrong. A commit message cannot be corrected without rewriting history, so the
corrections are here. Each is marked **CORRECTION**.

## 5. The receiving page's hours, printed more than once

**Done:** 所在地・お問い合わせ moved from fifth place to second, right after the live
opening-hours block, and the page's own index and the sitemap follow it. Every section's
background flipped so the page still alternates. A driver at a gate now reads where, who
to call, then the rules. The move itself is provably clean: 371 lines before and after,
identical when sorted apart from the four background classes.

**Not done, and this is the reason:** the page is the client's carried-over content
awaiting confirmation. Two of its four tables carry
`data-draft="案4 入庫のご案内（旧サイト2023年7月更新の内容）"` directly, and the other two sit
inside ancestors carrying the same string — `div.rc-clock` and `section#reserve`. Deleting
rows would change what they are being asked to approve.

> **CORRECTION.** Commit e300be8 and the first draft of this section said "every table on
> that page carries data-draft=案4". Four tables; two carry it directly. The reason holds
> — every one of them is inside a 案4 scope — but the sentence did not, and it is the
> sentence a client question would rest on.

The repeats, with what a reader actually sees:

| printed | where | also at | seen by whom |
|---|---|---|---|
| 当社の積み込みもありますので、なるべく15:00までにお越しください。 | #status の `.rc-foot` | #reserve の「受付時間」行 | everyone. Only this SECOND sentence repeats verbatim; the first differs (「受付は16:30までです。」 against 「16:30まで。」) |
| 水・木 12:00〜13:00 は昼休憩 | #status の時計の凡例 | #reserve の「昼休憩」行、#hours の「倉庫」行 | everyone |
| 休業日 土曜日・日曜日・祝日 | #status の `#rcPlain` | #hours の「休業日」行 | **only with JavaScript OFF.** `assets/js/receiving.js` hides `#rcPlain` as soon as it runs, so for a normal visitor this is printed once |
| 事務所 平日 9:00〜17:30 | #status の `.rc-call-hrs` | #hours の「事務所」行、#place の「電話番号」行 | everyone |

> **CORRECTION.** The first draft of this table called row 1 "word for word" (only its
> second sentence is) and counted row 3 as a duplicate for every reader (it is not —
> `#rcPlain` is the no-JavaScript fallback).

#hours carries no fact that is not already somewhere above it on the page. Removing rows
means its heading 「営業時間・休業日」 and #reserve's 「入出庫の予約と受付時間」 have to be
re-read too, which is why this is one decision and not four.

## 6. 「上記エリア外への輸送についても、まずはお気軽にご相談ください。」 cannot simply move

**Done:** the coverage map no longer goes silent. Six of the eight areas have no depot of
their own, and the 拠点 row used to vanish for them — the panel lost a line at the exact
moment the reader is asking "do you cover me". It now falls back to the page's own
authored row (拠点 板橋・志木・入間). 東京 and 埼玉 still show their own depots. Verified
through 80 pin-and-release cycles: `total` is a snapshot taken before the first render and
never reassigned, so the fallback cannot go stale.

**Not done:** the sentence sits directly under the `配送対応エリア` row that lists the
prefectures, and 「上記エリア」 points at exactly that list. Moving it up beside the map
breaks the reference, so it needs the words changed.

**One wording for the client, new since this change.** For the six areas without a depot
the panel now reads 「拠点 ／ 板橋・志木・入間」 under a heading that says 「神奈川県」 or
「新潟県新潟市方面」, with nothing on screen saying those are the depots the area is served
FROM. Nothing false is stated — 東京 and 埼玉 say 都内の拠点 / 県内の拠点 and the others
claim no such thing — but it is the only place this pass puts a new combination of words
in front of a reader, so it belongs in the client questions rather than in a decision of
ours.

## 7. The site policy — ATTEMPTED AND REVERTED

> **CORRECTION, and the serious one.** Commit e300be8 deleted three rows from the 推奨環境
> table: the four-browser list, the phone row, and 「文字の大きさ」 with its Ctrl／command
> instruction. **That was a facts removal, and the rows are back.**
>
> Why it was wrong, on this repository's own terms. `docs/COPY-STYLE-ja.md` §0 says
> 「事実（数字・名称・地域・サービス・日付・時間・車種・条件）は、足さない・減らさない・変えない」.
> Six browser 名称, two platform 名称, and 各最新版 / 標準ブラウザの最新版 as 条件 are all
> inside that list, and after the deletion none of them was reachable anywhere on the site
> — `grep -rniE "google chrome|firefox|microsoft edge|標準ブラウザ|文字の大きさ"` over
> `public_html/`, `partials/` and `templates/` returned nothing. And
> `docs/research/inventory.json` records the finished site's sitepolicy as carrying
> `#environment 推奨環境 (table)` with `"drafts_pending": "None"`, so it is the client's
> carried-over text, not one of our 案N proposals: §0 allows only 誤字・文法・表記ゆれ・
> 法令上の問題 there, and "it dates the page" is none of the four.
>
> The same commit cited that exact rule as its reason for NOT touching receiving.html's
> repeated hours. It was applied inconsistently inside one commit.
>
> Restored byte for byte from `a4f1ca7`, which also un-orphans the lead sentence
> 「当サイトは、次の環境でご覧いただくことを推奨しています。」 — with one row left it
> introduced a table that recommended no environment.

So **nothing of convention 14 is done.** The whole of it is a proposal now:

- the four-browser list, the phone row and the 文字の大きさ instruction do date the page,
  and none of it tells a freight customer anything. They go to the client as a question.
- the JavaScript row should stay whatever happens to the rest. It is the only place the
  site says the hero animation, the coverage map and the menu button need JavaScript.
  > **CORRECTION.** e300be8 called it "the only place the site says what stops working
  > without JavaScript". It is not: `contact.html` and `recruit-entry.html` each carry two
  > `<noscript>` blocks saying the forms need JavaScript and giving the telephone and fax
  > numbers instead. The row is the only place covering the animation, the map and the menu.
- the font block CAN go — both fonts are SIL OFL, the licence requires the notice to
  travel with the font FILES, `assets/fonts/OFL-noto-sans-jp.txt` and
  `OFL-zen-old-mincho.txt` are served beside them (`.htaccess` explicitly permits
  `assets/**/*.txt`), and nothing in this repository asks for a page credit. The only
  mention anywhere is `docs/SPEC.md` **§1 Folder layout**, as files.
  > **CORRECTION.** The first draft of this section said §2. It is §1.
  It stays because crediting other people's work is the owner's call, not ours.
- shortening the security paragraph to one sentence without the RFC number is rewriting.

## 8. The home page's 車両・設備 band

**Done:** `.fl-total` — 「保有車両 合計 32台（軽1BOX〜13t）」 — is gone from fleet.html. It
repeated the page lead five lines above it almost word for word, on a page that asserted
32台 three times in visible text within about a screen and a half. No fact left the page:
the number is still in the lead, in the count figure's own total, and in the table caption.

> **CORRECTION.** e300be8 also justified it as a repeat of the count figure's total "about
> thirty pixels below it". Measured at 1440×900 it is about 470 px below, with the whole
> six-truck lineup figure in between. The repeat of the PAGE LEAD is the real argument, and
> that one holds.

**Not done:** giving the home band the half it is missing — the equipment (forklifts and
the roll clamps) and the picture it is the only band to lack. That is new writing, and the
roll clamps are inside 案3, still waiting for the client.

## 9. Stop illustrating the trust pages with other people's things

Not done, because the item's own deliverable is a list for the owner, and taking the
pictures out leaves holes until he replaces them. What to take, and where each goes:

| slot | picture to take | replaces |
|---|---|---|
| reasons.html 「三豊運輸が選ばれる4つの理由」 の頭 | — （移すだけ: 関越道の写真は network.html へ、またはなし） | 他人が撮った高速道路の写真 |
| safety.html 車両の点検・整備 | 車両の日常点検 | 荷捌き場のイラスト |
| safety.html 安全教育・研修 | 乗務前の点呼 | 高速道路の案内標識のイラスト（reasons.html と同じ絵。2クリックで二度会う） |
| receiving.html | 志木の門とヤード、トレーラーが入っているところ | 使い回しのイラストと、国道254号バイパスの借り物写真 |
| business.html 倉庫保管 | クランプに巻取紙が入っているところ | — |
| company.html 代表挨拶 | 代表の顔写真 | 事務所のイラスト |

All of these are phone-camera shots. What is blocked is the owner taking them, or giving
someone on site permission to.

**Partly done from the same family (character 11):** the copyright page's three borrowed
photographs lost their thumbnails, so the owned illustrations lead the section. Every
credit line survives word for word — 撮影, ライセンス and 出典 three times each —
including 国道254号's, whose CC BY-SA licence requires attribution.

> **CORRECTION.** The finding asked for the credits to be shrunk to **one-line credits**
> with no thumbnails. Only the thumbnails went: each credit is still five lines (title,
> place, 撮影, ライセンス, 出典). Shrinking them would collide with keeping every credit
> line word for word, so that half is a question too, not an oversight to fix quietly.

**And one thing this cost, recorded so nobody discovers it the hard way.** `tools/qa/links.mjs`'s
photo-credit rule is image-driven: it finds `<img>` elements matching
`assets/img/credits.json` and then requires a `.credits` line on that page. With
sitepolicy.html's three `<img>` tags gone, that page's credit block is no longer gated by
any check. It is not a live risk — the CC BY-SA attribution for `route254-kamimuneoka`
also sits inline on `receiving.html`, which still carries the `<img>` and is still gated —
but enforcement coverage went down.

## And one finding from the first pass that turned out to be nothing

The `案5` fleet-lineup block deleted from the home page on 2026-11-19 was **not** restored,
and should not be: `fleet.html` still carries the same figure, with the identical
`data-draft="案5 車種別の保有台数（旧サイトの内訳と2026年5月の増車）"` marker and the identical
figcaption, and more detail than the home page had. The home page was a second copy.
Nothing left the site, the draft is still marked, and it now has one owner instead of two —
which is convention 5's own argument.
""")


README = (r"C:/Users/RTX4070TI/Desktop/sanpou-hero-remake/evidence/"
          r"2026-11-19-page-review/README.md")

swap(README, "## Second pass, 2026-11-19: conventions 11 to 17 and character 11", """## Second pass, 2026-11-19: conventions 11 to 17 and character 11

Commits `4158405`, `e300be8` and the fix commit after them. **Done whole:** 11
(company.html's search description puts its facts before its table of contents), 15
(トップページ is a row of its own at the top of the sitemap) and all six parts of 16 (the
home news band dressed as a section again, the two missing home links, the 本社 access
link, the duplicated お知らせ一覧, the two sequences both numbered "Step", and the
紙スリッター加工 enquiry type still in `FORMS.md` and `SPEC.md`).

**Done in part**, with the other half written up in the site's `PROPOSALS-NOT-YET-APPLIED.md`
rather than guessed at:

| item | done | left, and why |
|---|---|---|
| 12 receiving | 所在地 moved to second place; the page index, the sitemap and the band alternation follow. 371 lines before and after, identical when sorted | the duplicated hours: the page is the client's 案4 content, so deleting rows changes what they are being asked to confirm |
| 13 coverage map | the 拠点 row no longer vanishes for the six areas with no depot of their own — it falls back to the page's own 板橋・志木・入間 | 「上記エリア外…」 cannot move: 上記 points at the list directly above it. And the fallback's wording goes to the client as a question |
| 17 fleet | `.fl-total`, a near word-for-word repeat of the page lead five lines above it | the home 車両・設備 band's missing half: new writing, and the roll clamps are inside 案3 |
| character 11 | the three borrowed photographs lost their thumbnails; every credit line survives word for word, 国道254号's CC BY-SA attribution included | the finding asked for ONE-LINE credits; each is still five lines, and shrinking them collides with keeping every line |

**Attempted and reverted: convention 14.** See below.

**Not done at all:** character 6, because the item's own deliverable is a list of
photographs for the owner to take, and pulling the pictures now leaves holes until he does.
The list of six slots is in the proposals file.

### Two reviews went over it, and found thirteen things

One lens on regressions and this repository's own rules, one on whether the work matched
its claims. **The serious one, and it is the same fault as this morning's:**

**Convention 14 removed facts from a page while the same commit cited the rule against
doing that.** Three rows went out of sitepolicy.html's 推奨環境 table — the four-browser
list, the phone row, and 「文字の大きさ」 with its Ctrl／command instruction. Six browser
名称, two platform 名称 and two 条件, all inside `COPY-STYLE-ja.md` §0's list, and after the
deletion reachable nowhere on the site. `docs/research/inventory.json` records that table
as the client's carried-over content with no pending draft, where §0 permits only
誤字・文法・表記ゆれ・法令上の問題. **Restored byte for byte**, which also un-orphaned the
lead sentence that was left recommending an environment the table no longer named.

Five more were real faults in the work:

- **a dead CSS rule** the deletion left behind — `.fl-intro > div > p + p` matched nothing
  once `.fl-total` went, on the only page `.fl-intro` appears. The commit said three rules
  went with it; there were four.
- **the `#reasons` rule was not page-scoped**, in a file whose own first line says to scope
  anything that could leak, with `id="reasons"` on two pages. Latent, now `.page-home`-scoped.
- **`docs/SPEC.md` §5.1 still said sitepolicy carries the three road photos "as thumbnails"**
  — in a commit that edited SPEC.md. Updated.
- **`docs/SPEC.md` §5 item 7 still listed receiving.html with 所在地 last.** The page's own
  index and the sitemap were updated and SPEC was not. Updated.
- **`docs/FORMS.md` still cited `slitting.html`** in a preset example, a page deleted on
  2026-11-10 — in the commit that claimed to clear the slitter out of that file.

And the redirect tolerance in `check_headers.py` was **too wide**: granted to all ten old
URLs it would silently accept a future `^info(\\.html)?/?$` shadowing a real page. Narrowed
to the one name that needs it, and negative-tested by perturbing `.htaccess` (the gate
failed as it should, and the file was restored byte for byte).

The rest were wrong statements in the commit messages and the proposals file — "every
table", "word for word", "thirty pixels", "the only place the site says what stops working
without JavaScript", a wrong SPEC section number, and a preamble that gave one reason for
five different decisions. A commit message cannot be corrected without rewriting history,
so every correction is marked **CORRECTION** in `PROPOSALS-NOT-YET-APPLIED.md`.

**The `案5` finding from the first review is closed: it was wrong.** The fleet-lineup block
deleted from the home page is still on `fleet.html` with the identical marker and figcaption
and more detail; the home page held a second copy.

**Two traps this pass hit, both caught by a check rather than by reading.**
`public_html/assets/css/site.css` is GENERATED from `css-src/*.css` — the first attempt
edited the generated file and `sync.py --check` caught it. And `css-src/*.css` are **LF**
while the files under `public_html` are **CRLF**, with `sync.py` converting on the way out;
`docs/SPEC.md` is MIXED. Anchors are built from each file's own ending now. The links gate
also caught an accessibility fault reading had missed: the new sitemap row was an `h3`
directly under the `h1`.

**Checks, after the fixes:** `sync.py --check` up to date; `check_headers` all 103 passed
(it was 1 mismatch before any of today's work, for an unrelated reason now fixed);
`check_hero` PASS; `check_copy` at its 33 pre-existing hits throughout; `links` PASS on 21
pages; axe-core (wcag2a/aa, 2.1, 2.2, best-practice) 0 violations on all seven pages
touched; every change looked at in a browser at 1440 and at 375. `check_verbatim` cannot
run on this machine (it needs the finished site at a path that does not exist here) and the
Playwright gates `axe`, `csp`, `lineprobe` and `func` shell out to `python3`, which Windows
does not provide — axe was run instead by loading axe-core into the served page.
""")
