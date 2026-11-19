# Append the second pass's deferred halves to PROPOSALS-NOT-YET-APPLIED.md.
# The file is CRLF; newline="" on read and write, and the text below uses the file's
# own ending so nothing else in it is rewritten.

import io, sys

P = r"C:/Users/RTX4070TI/Desktop/sanpou-site-v2/PROPOSALS-NOT-YET-APPLIED.md"
with io.open(P, "r", encoding="utf-8", newline="") as f:
    s = f.read()
E = "\r\n" if "\r\n" in s else "\n"

if "## 5. The receiving page" in s:
    sys.exit("ABORT: the second pass is already appended")

TEXT = """
---

# Second pass, 2026-11-19 — the halves of five findings that could not be done

Conventions 11, 15 and 16 were done whole. Five more were done in part: what follows is the
part that was NOT done, and why. In each case the reason is the same rule that the first pass
hit — a fact may not be removed, client-marked drafts are theirs to confirm, and a rewrite is a
proposal rather than an edit.

## 5. The receiving page's hours, printed three times

**Done:** 所在地・お問い合わせ moved from fifth place to second, right after the live
opening-hours block, and the page's own index and the sitemap follow it. Every section's
background flipped so the page still alternates. A driver at a gate now reads where, who to
call, then the rules.

**Not done, and this is the reason:** every table on that page carries
`data-draft="案4 入庫のご案内（旧サイト2023年7月更新の内容）"`. The client has not yet confirmed
the page, so deleting rows from it would change what they are being asked to approve.

These are the exact repeats, ready to go when they answer:

| printed | where | also at |
|---|---|---|
| 受付は16:30まで。…なるべく15:00までにお越しください。 | #status の `.rc-foot` | #reserve の「受付時間」行 — word for word |
| 水・木 12:00〜13:00 は昼休憩 | #status の時計と表 | #reserve の「昼休憩」行、#hours の「倉庫」行 |
| 休業日 土曜日・日曜日・祝日 | #status の表 | #hours の「休業日」行 |
| 事務所 平日 9:00〜17:30 | #status の `.rc-call-hrs` | #hours の「事務所」行、#place の「電話番号」行 |

Note that #hours carries no fact that is not already on the page somewhere above it. Removing
rows means its heading 「営業時間・休業日」 and #reserve's 「入出庫の予約と受付時間」 need
re-reading too, which is why this is one decision and not four.

## 6. 「上記エリア外への輸送についても、まずはお気軽にご相談ください。」 cannot simply move

**Done:** the coverage map no longer goes silent. Six of the eight areas have no depot of their
own, and the 拠点 row used to vanish for them — the panel lost a line at the exact moment the
reader is asking "do you cover me". It now falls back to the page's own authored row
(拠点 板橋・志木・入間), which is where those areas are served from. 東京 and 埼玉 still show
their own depots.

**Not done:** the sentence sits directly under the `配送対応エリア` row that lists the
prefectures, and 「上記エリア」 points at exactly that list. Moving it up beside the map breaks
the reference, so it needs the words changed — a proposal, not a move.

## 7. The site policy's font block and its security paragraph

**Done:** the 推奨環境 table lost three of its four rows — a list of four desktop browsers,
the same for phones, and an instruction to hold Ctrl and press ＋. None of it tells a freight
customer anything and all of it dates the page. The JavaScript row STAYS, and should: it is the
only place the site says what stops working without JavaScript, including that the menu button
then opens the sitemap.

**Not done — the font block.** The review was right on the law: both fonts are SIL OFL, the
licence requires the notice to travel WITH the font files, `assets/fonts/OFL-noto-sans-jp.txt`
and `OFL-zen-old-mincho.txt` are served beside them, and nothing in this repository asks for a
page credit (SPEC §2 mentions the licences only as files). So it CAN go. It is left because
crediting other people's work is the owner's call, not ours, and four lines on the page that is
about exactly that subject is a small price. Say the word and it goes.

**Not done — the security paragraph.** Shortening it to one sentence without the RFC number is
rewriting, so it is a proposal.

## 8. The home page's 車両・設備 band

**Done:** fleet.html asserted 32台 three times in visible text within about a screen and a half.
The middle one — `.fl-total`, 「保有車両 合計 32台（軽1BOX〜13t）」 — was a near word-for-word
repeat of the page lead above it AND of the count figure's own total about thirty pixels below
it. It is gone, and no fact left the page: the number is still in the lead and in the table that
proves it.

**Not done:** giving the home band the half it is missing — the equipment (forklifts and the
roll clamps) and the picture it is the only band to lack. That is new writing, and the roll
clamps are inside 案3, which is still waiting for the client.

## 9. Stop illustrating the trust pages with other people's things

Not done, because the item's own deliverable is a list for the owner and because taking the
pictures out leaves holes until he replaces them. What to take, and where each goes:

| slot | picture to take | replaces |
|---|---|---|
| reasons.html 「三豊運輸が選ばれる4つの理由」 の頭 | — （移すだけ: 関越道の写真は network.html へ、またはなし） | 他人が撮った高速道路の写真 |
| safety.html 車両の点検・整備 | 車両の日常点検 | 荷捌き場のイラスト |
| safety.html 安全教育・研修 | 乗務前の点呼 | 高速道路の案内標識のイラスト（reasons.html と同じ絵。2クリックで二度会う） |
| receiving.html | 志木の門とヤード、トレーラーが入っているところ | 使い回しのイラストと、国道254号バイパスの借り物写真 |
| business.html 倉庫保管 | クランプに巻取紙が入っているところ | — |
| company.html 代表挨拶 | 代表の顔写真 | 事務所のイラスト |

All of these are phone-camera shots. What is blocked is the owner taking them, or giving someone
on site permission to.

**Already done from the same family:** the copyright page's three borrowed photographs lost
their thumbnails and are now three compact text credits, so the owned illustrations lead the
section. Every credit line survives word for word, including 国道254号's, whose CC BY-SA licence
requires attribution. The whole block should disappear when their own photographs arrive.

## And one finding from the first pass that turned out to be nothing

The `案5` fleet-lineup block deleted from the home page on 2026-11-19 was **not** restored, and
should not be: `fleet.html` still carries the same figure, with the same
`data-draft="案5 車種別の保有台数（旧サイトの内訳と2026年5月の増車）"` marker and more detail than
the home page had. The home page was a second copy of it. Nothing left the site, the draft is
still marked, and it now has one owner instead of two — which is convention 5's own argument.
"""

with io.open(P, "w", encoding="utf-8", newline="") as f:
    f.write(s.rstrip("\r\n") + E + TEXT.replace("\n", E))

print("appended")
