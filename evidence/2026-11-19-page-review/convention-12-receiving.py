# Convention 12: on the receiving page, 所在地・お問い合わせ moves to second position,
# right after the live opening-hours block.
#
# A driver reads this page at a gate, on a phone. He needs, in order: where, who to
# call, when to be there, what to do on arrival. The address was the LAST of five
# sections, below four blocks of rules.
#
# The second half of the finding — "let the live hours widget be the only place the
# hours are stated" — is NOT done here, and the reason is written into
# PROPOSALS-NOT-YET-APPLIED.md: every table on this page carries
# data-draft="案4 入庫のご案内（旧サイト2023年7月更新の内容）", which means the client has
# not yet confirmed it. Deleting rows would change what they are being asked to approve.
# Moving a whole section does not.
#
# The page index at the top of the page and the sitemap's sub-list follow the new order.
# Files are CRLF: newline="" on read and write.

import io, os, sys

ROOT = r"C:/Users/RTX4070TI/Desktop/sanpou-site-v2"
changed = []

def read(p):
    with io.open(os.path.join(ROOT, p), "r", encoding="utf-8", newline="") as f:
        return f.read()

def write(p, s):
    with io.open(os.path.join(ROOT, p), "w", encoding="utf-8", newline="") as f:
        f.write(s)
    changed.append(p)

def one(s, needle, what):
    n = s.count(needle)
    if n != 1:
        sys.exit("ABORT: %s found %d times, expected 1" % (what, n))

# ------------------------------------------------------------- receiving.html
p = "public_html/receiving.html"
s = read(p)

PLACE_OPEN = '<section class="section" id="place" aria-labelledby="place-title">\r\n'
one(s, PLACE_OPEN, "place section opening")
i = s.index(PLACE_OPEN)
END = "</section>\r\n"
j = s.index(END, i) + len(END)
block = s[i:j]
if "place-title" not in block or "</section>" not in block:
    sys.exit("ABORT: place block looks wrong")
# it must be the last section before </main>
rest = s[j:]
if rest.lstrip("\r\n").find("</main>") != 0:
    sys.exit("ABORT: place is not the last section; the cut would take the wrong text")

# the blank line that separated it from the section above goes with it
pre = s[:i]
if not pre.endswith("\r\n"):
    sys.exit("ABORT: unexpected text before the place section")
s = pre[:-2].rstrip("\r\n") + "\r\n" + rest.lstrip("\r\n")

STATUS_END = ('<p class="rc-foot">\u53d7\u4ed8\u306f<span class="nw">16:30\u307e\u3067</span>'
              '\u3067\u3059\u3002')
one(s, STATUS_END, "status foot sentence")
k = s.index(STATUS_END)
after = s.index(END, k) + len(END)   # closes the #status section
s = s[:after] + "\r\n" + block + s[after:]

# the page index at the top of the page follows the sections
IDX_PLACE = ('<li><a href="#place"><span>\u6240\u5728\u5730\u30fb'
             '<span class="nw">\u304a\u554f\u3044\u5408\u308f\u305b</span></span></a></li>\r\n')
IDX_RESERVE = ('<li><a href="#reserve"><span>\u4e88\u7d04\u3068'
               '<span class="nw">\u53d7\u4ed8\u6642\u9593</span></span></a></li>\r\n')
one(s, IDX_PLACE, "page index place entry")
one(s, IDX_RESERVE, "page index reserve entry")
s = s.replace(IDX_PLACE, "", 1)
s = s.replace(IDX_RESERVE, IDX_PLACE + IDX_RESERVE, 1)
write(p, s)

# ---------------------------------------------------------------- sitemap.html
p = "public_html/sitemap.html"
s = read(p)
SM_PLACE = ('<li><a href="receiving.html#place">\u6240\u5728\u5730\u30fb'
            '\u304a\u554f\u3044\u5408\u308f\u305b</a></li>\r\n')
SM_RESERVE = ('<li><a href="receiving.html#reserve">\u5165\u51fa\u5eab\u306e\u4e88\u7d04\u3068'
              '\u53d7\u4ed8\u6642\u9593</a></li>\r\n')
one(s, SM_PLACE, "sitemap place entry")
one(s, SM_RESERVE, "sitemap reserve entry")
s = s.replace(SM_PLACE, "", 1)
s = s.replace(SM_RESERVE, SM_PLACE + SM_RESERVE, 1)
write(p, s)

print("changed:")
for c in changed:
    print("  " + c)
