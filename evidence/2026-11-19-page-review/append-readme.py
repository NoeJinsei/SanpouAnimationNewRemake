# Bring the page-review README up to date: two rows of its progress table were still
# "not started" after the commits that did them, and the second pass needs recording.

import io, sys

P = r"C:/Users/RTX4070TI/Desktop/sanpou-hero-remake/evidence/2026-11-19-page-review/README.md"
with io.open(P, "r", encoding="utf-8", newline="") as f:
    s = f.read()
E = "\r\n" if "\r\n" in s else "\n"

def sub(old, new, what):
    global s
    if s.count(old) != 1:
        sys.exit("ABORT: %s found %d times, expected 1" % (what, s.count(old)))
    s = s.replace(old, new, 1)

sub("| 3 quote questions shown only to the enquiry types they fit | **not started** "
    "\u2014 needs about ten lines of JS, the twin of a rule the code already has |",
    "| 3 quote questions shown only to the enquiry types they fit | **done** \u2014 `47219c1`, "
    "`data-show-when` in `form.js`; widened to all four business types after a review found "
    "the storage links landed on a form with the quote block hidden |",
    "item 3 row")

sub("| 8 the recruitment route | **not started** |",
    "| 8 the recruitment route | **done** \u2014 `47219c1` |",
    "item 8 row")

if "## Second pass, 2026-11-19" in s:
    sys.exit("ABORT: the second pass is already recorded")

TEXT = """
## Second pass, 2026-11-19: conventions 11 to 17 and character 11

Commit `4158405` and the one after it. **Done whole:** 11 (company.html's search description
puts its facts before its table of contents), 15 (トップページ is a row of its own at the top of
the sitemap) and all six parts of 16 (the home news band dressed as a section again, the two
missing home links, the 本社 access link, the duplicated お知らせ一覧, the two sequences both
numbered "Step", and the 紙スリッター加工 enquiry type still in `FORMS.md` and `SPEC.md`).

**Done in part**, with the other half written up in the site's `PROPOSALS-NOT-YET-APPLIED.md`
rather than guessed at:

| item | done | left, and why |
|---|---|---|
| 12 receiving | 所在地 moved to second place; the page index, the sitemap and the band alternation follow | the duplicated hours: every table there is `data-draft 案4`, so deleting rows changes what the client is being asked to confirm |
| 13 coverage map | the 拠点 row no longer vanishes for the six areas with no depot of their own — it falls back to the page's own 板橋・志木・入間 | 「上記エリア外…」 cannot move: 上記 points at the list directly above it |
| 14 site policy | the browser list, the phone row and the Ctrl＋＋ instruction are gone; the JavaScript row stays, because it is the only place the site says what breaks without it | the font block (legally free to go — both fonts are OFL and the licence files are served — but crediting other people's work is the owner's call) and the security paragraph (rewriting) |
| 17 fleet | `.fl-total`, a near word-for-word repeat of the page lead AND of the count figure's own total thirty pixels below it | the home 車両・設備 band's missing half: new writing, and the roll clamps are inside 案3 |
| character 11 | the three borrowed photographs lost their thumbnails; every credit line survives word for word, 国道254号's CC BY-SA attribution included | the block disappears when their own photographs arrive |

**Not done at all:** character 6, because the item's own deliverable is a list of photographs
for the owner to take, and pulling the pictures now leaves holes until he does. The list of six
slots is in the proposals file.

**Two traps this pass hit, both caught by a check rather than by reading:**
`public_html/assets/css/site.css` is GENERATED from `css-src/*.css` — the first attempt edited
the generated file and `sync.py --check` caught it. And `css-src/*.css` are **LF** while the
files under `public_html` are **CRLF**, with `sync.py` converting on the way out; anchors are
built from each file's own ending now. The links gate also caught a real accessibility fault
that reading had missed: the new sitemap row was an `h3` directly under the `h1`.

**The `案5` finding from the first review was wrong and is closed.** The fleet-lineup block
deleted from the home page is still on `fleet.html` with its marker and more detail; the home
page held a second copy. Nothing left the site and the draft now has one owner, which is
convention 5's own argument.

**Checks:** `sync.py --check` up to date; `check_copy` at its 33 pre-existing hits throughout;
`links` PASS on 21 pages; axe-core (wcag2a/aa, 2.1, 2.2, best-practice) 0 violations on every
changed page; each change looked at in a browser at 1440. `check_verbatim` cannot run on this
machine (it needs the finished site at a path that does not exist here) and the Playwright
gates `axe`, `csp`, `lineprobe` and `func` shell out to `python3`, which Windows does not
provide — axe was run instead by loading axe-core into the served page.
"""

s = s.rstrip("\r\n") + E + E + TEXT.replace("\n", E)

with io.open(P, "w", encoding="utf-8", newline="") as f:
    f.write(s)
print("updated")
