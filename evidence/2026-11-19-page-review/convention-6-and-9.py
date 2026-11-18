# Convention items 6 and 9 from the page review. Run from the site's public_html.
# Reads and writes with newline="" so the CRLF endings are left alone.
#
#  6. Delete the two "this page is about…" leads the November wording pass missed. That pass touched eight
#     files and neither of these was among them, and neither is on its deliberate exceptions list, so this
#     finishes a decision already taken.
#  9. End each of the four service sections with a way to ask about THAT service. The machinery already
#     exists: the form's 種別 radios carry data-preset keywords, and fleet.html already ends with
#     「車両について相談する」 pointing at contact.html?type=transport#form. business.html is the one page
#     that sells the four services and the only one where the pattern was never applied.
import re, sys

def load(f):
    return open(f, encoding="utf-8", newline="").read()

def save(f, s):
    open(f, "w", encoding="utf-8", newline="").write(s)

def cut_line(f, needle, must):
    s = load(f)
    lines = s.split("\n")
    hits = [i for i, l in enumerate(lines) if needle in l]
    if len(hits) != 1:
        sys.exit("STOP: %s matched %d lines for %r" % (f, len(hits), needle))
    i = hits[0]
    if must not in lines[i] or not lines[i].strip().startswith("<p "):
        sys.exit("STOP: %s line %d is not the paragraph expected" % (f, i + 1))
    print("  cut   %-16s L%-4d %s" % (f, i + 1, re.sub(r"<[^>]*>", "", lines[i]).strip()[:62]))
    del lines[i]
    save(f, "\n".join(lines))

# --- item 6 --------------------------------------------------------------------------------
# already applied 2026-11-19:
# cut_line("news.html", 'page-head-lead">休業日のご案内や', "page-head-lead")
# cut_line("company.html", 'sec-lead">昭和<span class="nw">50年</span>の創業から', "sec-lead")

# --- item 9 --------------------------------------------------------------------------------
LINK = '<a class="link-arrow" href="contact.html?type=%s#form">%sについて<span class="nw">相談する</span></a>'
s = load("business.html")

# the two sections that already have a link row: append to it
for sid, preset, label, anchor in [
    ("transport",  "transport",  "輸送・配送", '<a class="link-arrow" href="network.html">配送エリアを見る</a></p>'),
    ("warehouse",  "warehouse",  "倉庫保管",   '入庫のご案内</span></a></p>'),
]:
    if s.count(anchor) != 1:
        sys.exit("STOP: business.html anchor for %s matched %d times" % (sid, s.count(anchor)))
    s = s.replace(anchor, anchor[:-4] + LINK % (preset, label) + "</p>")
    print("  add   business.html  %-12s -> %sについて相談する" % (sid, label))

# the two that have no link row: give them one, in the same place the others sit
for sid, preset, label, anchor in [
    ("processing", "processing", "流通加工", "<li>販促物の同梱作業など</li></ul></dd></div>\n</dl>"),
    ("threepl",    "3pl",        "3PL",     "</figcaption>\n</figure>"),
]:
    m = list(re.finditer(anchor, s))
    if len(m) != 1:
        sys.exit("STOP: business.html insertion point for %s matched %d times" % (sid, len(m)))
    s = s[:m[0].end()] + ('\n<p class="biz-links">' + LINK % (preset, label) + "</p>") + s[m[0].end():]
    print("  add   business.html  %-12s -> %sについて相談する (new link row)" % (sid, label))

save("business.html", s)

n = len(re.findall(r'href="contact\.html\?type=', load("business.html")))
print("\nbusiness.html now ends %d service sections with a way to ask about that service" % n)
