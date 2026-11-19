# The code and documentation half of what two reviews found in commits 4158405 and e300be8.
#
# A  RESTORE the three 推奨環境 rows. They are FACTS under COPY-STYLE-ja §0
#    (名称: six browsers and two platforms; 条件: 各最新版 / 標準ブラウザの最新版), they were
#    reachable nowhere else on the site after the deletion (grep: zero hits), and
#    docs/research/inventory.json records the finished site's #environment table with
#    "drafts_pending": "None" — so it is the client's carried-over text, not one of our
#    案N drafts. The same commit cited that rule as its reason for NOT touching
#    receiving.html's repeated hours. It was applied inconsistently inside one commit.
#    Restored byte for byte from a4f1ca7, which also un-orphans the lead sentence
#    「当サイトは、次の環境でご覧いただくことを推奨しています。」.
# B  Page-scope the new #reasons rule. css-src/45-home.css's own first line says
#    "Page-scoped under .page-home where a rule could leak", and id="reasons" is on
#    index.html AND reasons.html. Latent today; it bites the first time a second link
#    goes under that heading on reasons.html.
# C  Remove .fl-intro > div > p + p. Deleting .fl-total left that div with a .sec-head
#    and ONE <p>, so the rule matches nothing, on the only page .fl-intro appears.
#    (The commit said "three CSS rules" went with .fl-total. There were four.)
# D  Narrow the check_headers tolerance to the one URL that needs it. Applied to all
#    ten OLD_URLS it would silently accept a future ^info(\.html)?/?$ that shadows a
#    real page.
# E  docs/SPEC.md §5.1 said sitepolicy carries the three road photos "as thumbnails";
#    they are gone. And §5 item 7 lists receiving.html's sections with 所在地 last; it
#    is second now, and the page's own index and the sitemap were updated while SPEC
#    was not — in a commit that edited SPEC.
# F  docs/FORMS.md's preset example cites slitting.html, deleted on 2026-11-10.
#
# Line endings: public_html and docs are CRLF, css-src is LF, SPEC.md is MIXED.
# Every anchor is built from the file's own ending.

import io, os, sys

ROOT = r"C:/Users/RTX4070TI/Desktop/sanpou-site-v2"
HERE = os.path.dirname(os.path.abspath(__file__))
changed = []

def read(p):
    with io.open(os.path.join(ROOT, p), "r", encoding="utf-8", newline="") as f:
        s = f.read()
    return s, ("\r\n" if "\r\n" in s else "\n")

def write(p, s):
    with io.open(os.path.join(ROOT, p), "w", encoding="utf-8", newline="") as f:
        f.write(s)
    if p not in changed:
        changed.append(p)

def sub(s, old, new, what):
    n = s.count(old)
    if n != 1:
        sys.exit("ABORT: %s found %d times, expected 1" % (what, n))
    return s.replace(old, new, 1)

# ------------------------------------------------- A  the 推奨環境 rows go back
p = "public_html/sitepolicy.html"
s, E = read(p)
with io.open(os.path.join(HERE, "_env_tbody.txt"), "r", encoding="utf-8", newline="") as f:
    ORIGINAL = f.read()

i = s.find('id="environment"')
if i < 0:
    sys.exit("ABORT: #environment not found")
a = s.find("<tbody>", i)
b = s.find("</tbody>", i) + len("</tbody>")
if a < 0 or b < len("</tbody>"):
    sys.exit("ABORT: the #environment tbody is not where it should be")
current = s[a:b]
if "JavaScript" not in current:
    sys.exit("ABORT: the JavaScript row is missing from the current tbody")
if current == ORIGINAL:
    sys.exit("ABORT: the tbody is already the original")
s = s[:a] + ORIGINAL + s[b:]
for must in ("Google Chrome", "\u6a19\u6e96\u30d6\u30e9\u30a6\u30b6",
             "\u6587\u5b57\u306e\u5927\u304d\u3055", "JavaScript"):
    if must not in s:
        sys.exit("ABORT: %r did not come back" % must)
write(p, s)

# ------------------------------------------------------ B  page-scope #reasons
p = "css-src/45-home.css"
s, E = read(p)
s = sub(s, "#reasons .more-row + .more-row { margin-top: 12px; }",
        ".page-home #reasons .more-row + .more-row { margin-top: 12px; }",
        "reasons more-row rule")
write(p, s)

# --------------------------------------------------------- C  the dead rule
p = "css-src/50-services.css"
s, E = read(p)
s = sub(s, ".fl-intro > div > p + p { margin-top: 1em; }" + E, "",
        "fl-intro paragraph rule")
write(p, s)

# ------------------------------- D  the redirect tolerance, narrowed to one URL
p = "tools/check_headers.py"
s, E = read(p)
s = sub(s,
        "    # /slitting is the one old URL that also existed as /slitting.html, so its rule in .htaccess" + E +
        "    # carries an extra (\\.html)? group: it matches everything this assertion asked for and one" + E +
        "    # more address besides. Accept either shape \u2014 the live check below still requests the URL." + E +
        "    tail = r'(?:\\(\\\\\\.html\\)\\?)?/\\?\\$'" + E +
        "    for old, new in OLD_URLS.items():" + E +
        "        ok(has(r'^RewriteRule\\s+\\^' + re.escape(old) + tail + r'\\s+' + re.escape(new) + r'\\s+\\[R=301')," + E,
        "    # /slitting is the one old URL that also existed as /slitting.html, so its rule in .htaccess" + E +
        "    # carries an extra (\\.html)? group: it matches everything this assertion asks for and one more" + E +
        "    # address besides. The tolerance is for THAT name only \u2014 given to all ten it would silently" + E +
        "    # accept a future ^info(\\.html)?/?$ that shadows a real page." + E +
        "    DOT_HTML_TOO = {'slitting'}" + E +
        "    for old, new in OLD_URLS.items():" + E +
        "        tail = r'(?:\\(\\\\\\.html\\)\\?)?/\\?\\$' if old in DOT_HTML_TOO else r'/\\?\\$'" + E +
        "        ok(has(r'^RewriteRule\\s+\\^' + re.escape(old) + tail + r'\\s+' + re.escape(new) + r'\\s+\\[R=301')," + E,
        "check_headers redirect loop")
write(p, s)

# ----------------------------------------------- E  SPEC, twice, same commit
p = "docs/SPEC.md"
s, E = read(p)
s = sub(s,
        "| sitepolicy | only the three credited road photos, as thumbnails in its \u5199\u771f credits list |",
        "| sitepolicy | none. The three credited road photos lost their thumbnails on 2026-11-19 "
        "(character 11): the \u5199\u771f credits are text only, and the photographs themselves stay on the "
        "pages that use them |",
        "SPEC 5.1 sitepolicy row")
s = sub(s,
        "7. **receiving.html (\u5165\u5EAB\u306E\u3054\u6848\u5185\u30FB\u5FD7\u6728\u55B6\u696D\u6240)** "
        "\u2014 the live receiving clock (from the sample: Japan time, \u795D\u65E5,\n"
        "   the \u6708\u30FB\u706B\u30FB\u91D1 noon window); \u4E88\u7D04\u3068\u53D7\u4ED8\u6642\u9593 ledger; "
        "\u3054\u6765\u5834\u6642\u306E\u304A\u9858\u3044; \u55B6\u696D\u6642\u9593\u30FB\u4F11\u696D\u65E5; "
        "\u6240\u5728\u5730; \u5FD7\u6728 TEL\n",
        "7. **receiving.html (\u5165\u5EAB\u306E\u3054\u6848\u5185\u30FB\u5FD7\u6728\u55B6\u696D\u6240)** "
        "\u2014 the live receiving clock (from the sample: Japan time, \u795D\u65E5,\n"
        "   the \u6708\u30FB\u706B\u30FB\u91D1 noon window); \u6240\u5728\u5730\u30FB\u304A\u554F\u3044\u5408\u308F\u305B "
        "(moved to second place on 2026-11-19: a driver at a gate needs where and who to call\n"
        "   before the rules); \u4E88\u7D04\u3068\u53D7\u4ED8\u6642\u9593 ledger; \u3054\u6765\u5834\u6642\u306E\u304A\u9858\u3044; "
        "\u55B6\u696D\u6642\u9593\u30FB\u4F11\u696D\u65E5; \u5FD7\u6728 TEL\n",
        "SPEC 5 item 7 receiving outline")
write(p, s)

# ------------------------------------------- F  the preset example's dead page
p = "docs/FORMS.md"
s, E = read(p)
s = sub(s,
        "Examples: `contact.html?type=\u6d41\u901a\u52a0\u5de5` (slitting.html),",
        "Examples: `contact.html?type=\u6d41\u901a\u52a0\u5de5` (business.html#processing),",
        "FORMS preset example")
write(p, s)

print("changed:")
for c in changed:
    print("  " + c)
