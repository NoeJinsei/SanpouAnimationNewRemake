# Convention 16 from the page review (2026-11-19): one housekeeping pass, six small things.
# None is serious alone; together they are what makes a careful reader feel a site was
# assembled rather than written. All six are leftovers of changes otherwise finished properly.
#
#  1  the home news band still wears the styling of the position it left this week
#  2  the home page never links to ご依頼の流れ or the FAQ, both one click away
#  3  the 本社 card on the contact page has no access link while the 志木 card has one
#  4  the news article pages offer お知らせ一覧 twice in two touching blocks
#  5  recruit.html numbers two unrelated sequences "Step"
#  6  the form documentation still describes the paper-slitter enquiry type
#
# Files are CRLF: newline="" on BOTH read and write. Phrases are wrapped in <span class="nw">,
# so every anchor below is copied out of the file rather than typed from the rendered text.

import io, os, sys

ROOT = r"C:/Users/RTX4070TI/Desktop/sanpou-site-v2"
changed = []

def read(p):
    with io.open(os.path.join(ROOT, p), "r", encoding="utf-8", newline="") as f:
        return f.read()

def write(p, s):
    with io.open(os.path.join(ROOT, p), "w", encoding="utf-8", newline="") as f:
        f.write(s)
    if p not in changed:
        changed.append(p)

def sub(s, old, new, what, times=1):
    n = s.count(old)
    if n != times:
        sys.exit("ABORT: %s found %d times, expected %d" % (what, n, times))
    return s.replace(old, new, times)

# ============================================================ 1  the home news band
# It was directly under the hero until 2026-11-19 (commit d2fbc9a) and kept that
# position's clothes: half a section's padding, a heading ten pixels smaller than
# every other section's, and a tinted background touching the tinted 会社案内 band
# above it. It is a section at the foot of the page now, so it is dressed like one.
p = "public_html/index.html"
s = read(p)
s = sub(s,
        '<section class="home-news band" aria-labelledby="news-title">',
        '<section class="section home-news" aria-labelledby="news-title">',
        "home news section tag")

# ---------------------------------------------------- 2  the two links the home lacked
# Both labels are the headings of the sections they point at; no new wording.
SVC_END = ('<a class="link-arrow card-link" href="business.html#threepl">'
           '<span class="nw">3PL</span>\u306e\u5bfe\u5fdc\u5185\u5bb9</a>\r\n'
           '</li>\r\n'
           '</ul>\r\n')
FLOW = ('<p class="more-row is-center"><a class="link-arrow" href="business.html#flow">'
        '\u3054\u4f9d\u983c\u306e\u6d41\u308c</a></p>\r\n')
s = sub(s, SVC_END, SVC_END + FLOW, "home service grid end")

REASONS_BTN = ('<p class="more-row"><a class="btn btn-outline btn-arrow" href="reasons.html">'
               '\u9078\u3070\u308c\u308b\u7406\u7531\u3092\u898b\u308b</a></p>\r\n')
FAQ = ('<p class="more-row"><a class="link-arrow" href="reasons.html#faq">'
       '\u3088\u304f\u3042\u308b\u3054\u8cea\u554f</a></p>\r\n')
s = sub(s, REASONS_BTN, REASONS_BTN + FAQ, "home reasons button")
write(p, s)

p = "public_html/assets/css/site.css"
s = read(p)
s = sub(s,
        "/* ---- news strip, directly under the hero ---- */\r\n"
        ".home-news { padding-block: 40px; background: var(--band); }\r\n",
        "/* ---- news, at the foot of main since 2026-11-19 (it was a strip under the hero) ---- */\r\n",
        "home-news comment and box rule")
s = sub(s, ".home-news-head h2 { font-size: 26px; line-height: 1.4; }\r\n", "",
        "home-news h2 size")
# on a paper section the shared .news-list rule already gives each row the tint
s = sub(s, ".home-news .news-list > li { background: var(--paper); }\r\n", "",
        "home-news row background")
s = sub(s,
        "@media (max-width: 767.98px) { .home-news { padding-block: 32px; } "
        ".home-news-head h2 { font-size: 22px; } }\r\n",
        "", "home-news phone overrides")
write(p, s)

# ================================================ 3  the 本社 card's access link
# 志木 ends with a link to its own page; 本社 ended with nothing, although
# company.html#access is exactly that page and the site links it from four others.
p = "public_html/contact.html"
s = read(p)
HQ_DL_END = ('<div><dt>\u6240\u5728\u5730</dt><dd><span class="nw">\u3012175-0083</span> '
             '<span class="nw">\u6771\u4eac\u90fd\u677f\u6a4b\u533a\u5fb3\u4e383-35-9</span></dd></div>\r\n'
             '</dl>\r\n')
HQ_LINK = ('<p class="ct-tel-more"><a class="link-arrow" href="company.html#access">'
           '\u672c\u793e\u30a2\u30af\u30bb\u30b9</a></p>\r\n')
s = sub(s, HQ_DL_END, HQ_DL_END + HQ_LINK, "contact HQ address row")
write(p, s)

# ====================================== 4  お知らせ一覧 offered twice, side by side
# The pager already ends with a 「お知らせ一覧へ戻る」 button; the 最近のお知らせ panel
# beside it repeated the same destination as a text link. The panel stays — it is the
# standard shape and it marks the article being read — but it stops repeating the button.
for p in ("public_html/news-20260401.html",
          "public_html/news-20260515.html",
          "public_html/news-20260620.html"):
    s = read(p)
    MORE = ('<p class="ns-recent-more"><a class="link-arrow" href="news.html">'
            '\u304a\u77e5\u3089\u305b\u4e00\u89a7</a></p>\r\n')
    s = sub(s, MORE, "", "news recent more link in " + p)
    write(p, s)

p = "public_html/assets/css/site.css"
s = read(p)
s = sub(s, ".ns-recent-more { margin-top: 4px; }\r\n", "", "ns-recent-more rule")
# the panel's last row now sets the bottom spacing, so it needs the padding back
s = sub(s, ".ns-recent { padding: 28px 24px 16px; border-radius: var(--radius); background: var(--band); }",
        ".ns-recent { padding: 28px 24px 24px; border-radius: var(--radius); background: var(--band); }",
        "ns-recent padding")
s = sub(s, "  .ns-recent { padding: 24px 16px 12px; }", "  .ns-recent { padding: 24px 16px 20px; }",
        "ns-recent phone padding")
write(p, s)

# ============================== 5  two unrelated sequences both numbered "Step"
# 選考の流れ is a procedure and keeps Step 01–04. The career ladder is not a procedure:
# it is four vehicle classes, and its own title already says ステップアップ. Its numbers
# said nothing the rising bars, the growing trucks and the three-step path below did not.
p = "public_html/recruit.html"
s = read(p)
for n, name in ((1, "\u8efd1BOX\u8eca"), (2, "2t\u8eca"), (3, "4t\u8eca"),
                (4, "\u5927\u578b\u30a6\u30a4\u30f3\u30b0\u8eca")):
    s = sub(s,
            '<span class="rec-up-no" lang="en">Step %d</span><span class="rec-up-name">' % n,
            '<span class="rec-up-name">',
            "career ladder Step %d" % n)
write(p, s)

p = "public_html/assets/css/site.css"
s = read(p)
s = sub(s,
        ".rec-up-no { font-size: 12px; font-weight: 600; line-height: 1.4; "
        "letter-spacing: var(--track-en); text-transform: uppercase; }\r\n",
        "", "rec-up-no rule")
s = sub(s, "  .rec-up-no { color: var(--accent-strong); }\r\n", "", "rec-up-no phone rule")
write(p, s)

# ================================ 6  the documentation still sells a deleted service
# 紙スリッター加工 was removed site-wide on 2026-11-10 with the owner's confirmation.
# The radio is 流通加工 and form.js accepts 「流通加工 processing」 only — the two
# documents that describe the form were never told.
p = "docs/FORMS.md"
s = read(p)
s = sub(s, "`\u8f38\u9001\u30fb\u914d\u9001` `\u5009\u5eab\u4fdd\u7ba1` "
           "`\u6d41\u901a\u52a0\u5de5\u30fb\u7d19\u30b9\u30ea\u30c3\u30bf\u30fc\u52a0\u5de5` `3PL`",
        "`\u8f38\u9001\u30fb\u914d\u9001` `\u5009\u5eab\u4fdd\u7ba1` `\u6d41\u901a\u52a0\u5de5` `3PL`",
        "FORMS radio values")
s = sub(s, "`\u6d41\u901a\u52a0\u5de5` `\u6d41\u901a\u52a0\u5de5\u30fb\u7d19\u30b9\u30ea\u30c3\u30bf\u30fc\u52a0\u5de5` "
           "`\u30b9\u30ea\u30c3\u30bf\u30fc` `\u7d19\u30b9\u30ea\u30c3\u30bf\u30fc\u52a0\u5de5` `processing` `slitting`",
        "`\u6d41\u901a\u52a0\u5de5` `processing`",
        "FORMS type aliases")
write(p, s)

p = "docs/SPEC.md"
s = read(p)
s = sub(s, "(radio: \u8f38\u9001\u30fb\u914d\u9001 / \u5009\u5eab\u4fdd\u7ba1 / "
           "\u6d41\u901a\u52a0\u5de5\u30fb\u7d19\u30b9\u30ea\u30c3\u30bf\u30fc\u52a0\u5de5 / 3PL / "
           "\u63a1\u7528 / \u305d\u306e\u4ed6),\r\n"
           "    \u304a\u540d\u524d, \u30d5\u30ea\u30ac\u30ca (hiragana is converted to katakana), "
           "\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9, "
           "\u304a\u554f\u3044\u5408\u308f\u305b\u5185\u5bb9 (3000 characters).\r\n"
           "  - Conditionally required (for the business types): \u4f1a\u793e\u540d, \u96fb\u8a71\u756a\u53f7.\r\n"
           "  - Optional: \u90e8\u7f72.\r\n"
           "  - Quote helpers: \u767a\u5730 / \u7740\u5730 / \u8377\u7269\u306e\u7a2e\u985e / "
           "\u6570\u91cf\u30fb\u983b\u5ea6. Optional; "
           "\u300c\u5206\u304b\u308b\u7bc4\u56f2\u3067\u3054\u8a18\u5165\u304f\u3060\u3055\u3044\u300d.\r\n",
        "(radio: \u8f38\u9001\u30fb\u914d\u9001 / \u5009\u5eab\u4fdd\u7ba1 / \u6d41\u901a\u52a0\u5de5 / 3PL / "
           "\u63a1\u7528 / \u305d\u306e\u4ed6),\r\n"
           "    \u304a\u540d\u524d, \u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9, "
           "\u304a\u554f\u3044\u5408\u308f\u305b\u5185\u5bb9 (3000 characters).\r\n"
           "  - Conditionally required (for the business types): \u4f1a\u793e\u540d, \u96fb\u8a71\u756a\u53f7.\r\n"
           "  - Optional: \u4f1a\u793e\u540d is asked before \u304a\u540d\u524d; \u90e8\u7f72; "
           "\u30d5\u30ea\u30ac\u30ca (hiragana is still converted to katakana, but it is no longer required \u2014 "
           "the job application form keeps it required).\r\n"
           "  - Quote helpers: \u767a\u5730 / \u7740\u5730 / \u8377\u7269\u306e\u7a2e\u985e / "
           "\u6570\u91cf\u30fb\u983b\u5ea6. Optional, and shown only for the four business types "
           "(`data-show-when`); "
           "\u300c\u5206\u304b\u308b\u7bc4\u56f2\u3067\u3054\u8a18\u5165\u304f\u3060\u3055\u3044\u300d.\r\n",
        "SPEC contact fields")
write(p, s)

print("changed:")
for c in changed:
    print("  " + c)
