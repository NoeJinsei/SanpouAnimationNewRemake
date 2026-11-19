# templates/news-detail.html had drifted from the three pages it builds. A workflow of
# four reviewers plus adversarial verification found it; two earlier reviews and I all
# missed it, because every check in this repository reads public_html/ and none compares
# the template with the pages it produces.
#
# Two instances, from two different commits today:
#
#  1  4158405 (convention 16) removed the duplicated 「お知らせ一覧」 text link from all
#     three news pages, keeping the button in the pager, and re-tuned .ns-recent's bottom
#     padding for its absence. The template kept the paragraph, so the next article the
#     client builds from it reinstates the duplicate — inside a panel sized for one row
#     fewer.
#  2  5f6ba73 (this morning, the roman kickers) removed 「Contents」 from the three pages
#     and left it in the template. Never flagged until now.
#
# The template's own header tells the client to copy it to public_html and rename it, so
# a drifted template is a drifted future page. Both lines go; nothing else is touched.
#
# The template is CRLF like the rest of public_html.

import io, sys

P = r"C:/Users/RTX4070TI/Desktop/sanpou-site-v2/templates/news-detail.html"
with io.open(P, "r", encoding="utf-8", newline="") as f:
    s = f.read()
E = "\r\n" if "\r\n" in s else "\n"

MORE = ('<p class="ns-recent-more"><a class="link-arrow" href="news.html">'
        '\u304a\u77e5\u3089\u305b\u4e00\u89a7</a></p>' + E)
KICKER = '<p class="en-label" lang="en" aria-hidden="true">Contents</p>' + E

for name, frag in (("ns-recent-more paragraph", MORE), ("Contents kicker", KICKER)):
    n = s.count(frag)
    if n != 1:
        sys.exit("ABORT: %s found %d times, expected 1" % (name, n))
    s = s.replace(frag, "", 1)

# the pager's button is the one that stays — prove it survived
if 'class="ns-back"' not in s:
    sys.exit("ABORT: the お知らせ一覧へ戻る button is gone; that is not the intent")
if s.count('class="en-label"') != 2:
    sys.exit("ABORT: expected the News and Contact kickers to remain, found %d"
             % s.count('class="en-label"'))

with io.open(P, "w", encoding="utf-8", newline="") as f:
    f.write(s)

print("templates/news-detail.html now matches the three pages it builds")
