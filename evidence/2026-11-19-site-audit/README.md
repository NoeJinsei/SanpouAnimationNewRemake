# The website, read against the company's own facts (Opus, 2026-11-19)

The owner asked to move on to the website: *"seriously work on the overall wording and format of our
website, to make it look modern, with proper jp wordings (without the ai traits / slop elements), and look
and see if there are any better improvements that could be made from the previous version."*

**The site was read only. Nothing in `sanpou-site-v2` has been changed.**

## First, round 12 of the film, verified from my own measurements

Fable's last round landed while the owner was away, and its weekly limit then stopped it. I checked the
three claims that matter rather than taking the report:

- **The 52-second loop still holds.** `node tools/what-moves.mjs round2 32000 84000` → **0.00 % of the stage
  changed, in 0 regions.**
- **Nothing was added.** `node tools/node-count.mjs original round2` → 1483 / 1494 / 943 / 945 / 944 / 944,
  unchanged.
- **The plane on a phone matches what he accepted**: `plane-visible` gives **1.9 s** at 80 % of the plane
  and **3.0 s** at half — exactly the figures in Fable's report and in his "Yes, keep it".

Round 12 stands. His verdict on the look of it (the faster clouds, the plane's climb) is still open.

## The wording is better than the brief assumed

I read the real body copy before judging it, and it does **not** read as machine-written. It is specific,
concrete, and in natural です・ます business Japanese. Three examples of writing that is doing real work:

- the fleet described by what it is, not by adjectives — 軽1BOX through 13t, 32 vehicles, by service type;
- safety put as a system rather than a virtue: safety is not left to a driver's attention, it is built up
  as something the company does;
- the paper work named exactly — 印刷物, 原紙, 平判, 巻取紙, pallet transport — which is the kind of detail a
  machine does not invent and a buyer recognises.

So the "AI slop" problem is **not** general across the site. Where it is real is the **hero headline**,
which is the one piece we have been working on for five rounds, and which is also the only copy on the site
written to a formula (where TO, where FROM, the verb last — a shape not one of 90 real logistics heroes
uses). That finding already stands in `research/jp-hero-survey-2026-11-17.md`.

## One real defect: the site advertises a service the client removed

**`reasons.html` says the company handles 「当日の緊急便」 — same-day emergency runs.**

> 繁忙期の増便や当日の緊急便にも、外部の傭車に頼らず自社の車両とドライバーで対応できるため…

Same-day / emergency spot delivery is on the client's own removed list (`CONTEXT.md`, and
`research/past-decisions.json` → `constraints`), alongside refrigerated and frozen trucks, Gマーク, digital
tachographs, food cargo and the paper slitter service. The sentence is otherwise a good one — the argument
that they never fall back on 傭車 is their strongest operational claim — so the fix is to cut the
same-day clause and keep the rest. **The owner should confirm, because it is possible the service was
removed from the OLD site's wording and not from the business.**

Checked and clean, for the record: 「当日のご予約」 on `receiving.html` is a booking slot for arriving at the
warehouse, not a delivery promise — no conflict.

## Everything else in the fact audit passes

| | result |
|---|---|
| 株式会社三豊 anywhere | **none** — correct, it is 有限会社 |
| 有限会社三豊運輸 | on all 21 pages, consistent |
| coverage wording | 関東1都6県 used 24 times, the correct form; 「関東一円」 **nowhere** |
| 関東北西部 (5 uses) | not a defect — it describes which part of that area the 入間営業所 serves |
| 32台 / 3拠点 / 昭和50年 | consistent wherever they appear |
| 冷蔵・冷凍, Gマーク, デジタコ, ドラレコ, 食品, スリッター | **none anywhere** |

## The shape of the site as it stands

Global navigation: 事業内容 / 選ばれる理由 / 拠点・配送エリア / 会社案内 / 採用情報 / お知らせ, with the
phone number and a contact button in the header's corner.

Home page, top to bottom: hero → **お知らせ** → 事業内容 → 三豊運輸が選ばれる理由 → 拠点・配送エリア →
車両・設備 → 安全への取り組み → a recruitment band → 会社案内 → お問い合わせ・お見積もり.

That is a conventional and sensible structure for this industry. The one thing that stands out before the
survey lands is **news sitting first, directly under the hero** — that is an older convention, and it
spends the most valuable space on the page on the least persuasive content. Whether to move it is in the
survey's hands.

A six-slice survey of how Japanese logistics sites are built whole — navigation, home-page section order,
wording register across a site, service pages, 会社概要 and 採用, and what reads as current in 2026 — is
running, and the ranked plan follows it.
