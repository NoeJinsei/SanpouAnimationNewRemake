# Convention 11 and 15 from the page review (2026-11-19).
#
# 15  Put トップページ on its own row at the top of the sitemap, the way the drawer
#     already does, instead of leaving it sixteenth of twenty inside the ご案内 group.
# 11  company.html's search description: swap the two middle sentences so the facts
#     come before the table of contents. Same characters, same length, nothing new.
#
# Files here are CRLF. newline="" on BOTH read and write, or every line is rewritten.
# Phrases are wrapped in <span class="nw">, so anchors are taken from the file itself.

import io, os, sys

ROOT = r"C:/Users/RTX4070TI/Desktop/sanpou-site-v2"

def read(p):
    with io.open(os.path.join(ROOT, p), "r", encoding="utf-8", newline="") as f:
        return f.read()

def write(p, s):
    with io.open(os.path.join(ROOT, p), "w", encoding="utf-8", newline="") as f:
        f.write(s)

def once(hay, needle, what):
    n = hay.count(needle)
    if n != 1:
        sys.exit("ABORT: %s found %d times, expected 1" % (what, n))

changed = []

# ---------------------------------------------------------------- 15  sitemap
p = "public_html/sitemap.html"
s = read(p)
before = s

CARD = (
    '<li class="lg-sm-page">\r\n'
    '<h3 class="lg-sm-title"><a href="index.html">\u30c8\u30c3\u30d7\u30da\u30fc\u30b8</a></h3>\r\n'
    '<p class="lg-sm-desc">\u4e8b\u696d\u5185\u5bb9\u3001\u62e0\u70b9\u30fb\u914d\u9001\u30a8\u30ea\u30a2\u3001'
    '\u63a1\u7528\u60c5\u5831\u306a\u3069\u306e\u6982\u8981\u3068\u3001'
    '<span class="nw">\u6700\u65b0\u306e\u304a\u77e5\u3089\u305b\u3067\u3059\u3002</span></p>\r\n'
    '</li>\r\n'
)
once(s, CARD, "sitemap home card")
s = s.replace(CARD, "", 1)

BREAD = ('<nav class="breadcrumb" aria-label="\u30d1\u30f3\u304f\u305a\u30ea\u30b9\u30c8">'
         '<ol class="container"><li><a href="index.html">\u30db\u30fc\u30e0</a></li>'
         '<li aria-current="page">\u30b5\u30a4\u30c8\u30de\u30c3\u30d7</li></ol></nav>\r\n')
once(s, BREAD, "sitemap breadcrumb")

HOME_ROW = (
    '\r\n'
    '<section class="section band sm-home" id="sm-home" aria-label="\u30c8\u30c3\u30d7\u30da\u30fc\u30b8">\r\n'
    '<div class="container">\r\n'
    '<ul class="lg-sm-pages">\r\n'
    '<li class="lg-sm-page is-wide">\r\n'
    '<h3 class="lg-sm-title"><a href="index.html">\u30c8\u30c3\u30d7\u30da\u30fc\u30b8</a></h3>\r\n'
    '<p class="lg-sm-desc">\u4e8b\u696d\u5185\u5bb9\u3001\u62e0\u70b9\u30fb\u914d\u9001\u30a8\u30ea\u30a2\u3001'
    '\u63a1\u7528\u60c5\u5831\u306a\u3069\u306e\u6982\u8981\u3068\u3001'
    '<span class="nw">\u6700\u65b0\u306e\u304a\u77e5\u3089\u305b\u3067\u3059\u3002</span></p>\r\n'
    '</li>\r\n'
    '</ul>\r\n'
    '</div>\r\n'
    '</section>\r\n'
)
s = s.replace(BREAD, BREAD + HOME_ROW, 1)

if s == before:
    sys.exit("ABORT: sitemap unchanged")
write(p, s)
changed.append(p)

# the one row is a band, so the page still alternates band / plain down its length,
# and it carries far less than a full section of content.
p = "public_html/assets/css/site.css"
s = read(p)
ANCHOR = ".lg-sm-page.is-wide { grid-column: 1 / -1; }\r\n"
once(s, ANCHOR, "is-wide rule")
RULE = (
    "/* the home row at the top of the sitemap: one card, so it takes far less than a section's height */\r\n"
    ".sm-home { padding-block: 28px; }\r\n"
    "@media (max-width: 767.98px) { .sm-home { padding-block: 16px; } }\r\n"
)
if ".sm-home" in s:
    sys.exit("ABORT: .sm-home already present")
s = s.replace(ANCHOR, ANCHOR + RULE, 1)
write(p, s)
changed.append(p)

# ------------------------------------------------------- 11  company.html meta
p = "public_html/company.html"
s = read(p)

TOC = ("\u4ee3\u8868\u6328\u62f6\u3001\u4f1a\u793e\u6982\u8981\u3001\u6cbf\u9769\u3001\u62e0\u70b9\u4e00\u89a7\u3001"
       "\u672c\u793e\u3078\u306e\u30a2\u30af\u30bb\u30b9\u3092\u3054\u6848\u5185\u3057\u307e\u3059\u3002")
FACTS = ("\u662d\u548c50\u5e74\uff081975\u5e74\uff09\u5275\u696d\u3001\u6771\u4eac\u90fd\u677f\u6a4b\u533a\u306b"
         "\u672c\u793e\u3092\u7f6e\u304d\u3001\u95a2\u67711\u90fd6\u770c\u3068\u65b0\u6f5f\u770c\u65b0\u6f5f\u5e02"
         "\u65b9\u9762\u3078\u306e\u8f38\u9001\u3068\u5009\u5eab\u4fdd\u7ba1\u3092\u884c\u3063\u3066\u3044\u307e\u3059\u3002")
OLD = TOC + FACTS
NEW = FACTS + TOC
once(s, OLD, "company description body")
s = s.replace(OLD, NEW, 1)
# og:description carries the table of contents alone and is a different field; left alone.
write(p, s)
changed.append(p)

print("changed:")
for c in changed:
    print("  " + c)
