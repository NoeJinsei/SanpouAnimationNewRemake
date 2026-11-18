# Restructures the home page, as item 4 of the plan. Run from the site's public_html.
# Reads and writes with newline="" so the file's CRLF endings are left alone — without that, Python
# rewrites every line of the file and the real change disappears inside the diff.
#
# Three changes, each asserted before anything is written:
#   1. the news band moves from directly under the hero to the foot of <main>, above the contact band
#   2. the safety band is removed: the company band two below it is already a row of link cards and one
#      of those cards is 安全への取り組み, pointing at the same page. index.html links safety.html 6 times.
#   3. the fleet band keeps its sentence and its link and loses the six-vehicle breakdown figure, which
#      fleet.html already carries in full. The home page keeps the claim; the page keeps the proof.
import re, sys

SRC = "index.html"
s = open(SRC, encoding="utf-8", newline="").read()
before = len(s)

def block(html, start_pat, what):
    """span of a <section> ... </section> whose opening tag matches start_pat, counting nesting"""
    m = re.search(start_pat, html)
    if not m:
        sys.exit("STOP: could not find the %s section — nothing written" % what)
    depth, i = 0, m.start()
    for t in re.finditer(r"<section\b|</section>", html[m.start():]):
        depth += 1 if t.group(0).startswith("<section") else -1
        if depth == 0:
            return m.start(), m.start() + t.end()
    sys.exit("STOP: the %s section is not closed — nothing written" % what)

# --- 1. lift the news band out ---------------------------------------------------------------
a, b = block(s, r'<section class="home-news band"[^>]*>', "news")
news = s[a:b]
if "お知らせ" not in news:
    sys.exit("STOP: the block taken for the news band does not contain お知らせ — nothing written")
s = s[:a].rstrip("\r\n") + "\n" + s[b:].lstrip("\r\n")
print("  moved   news band out of position 2 (%d chars)" % len(news))

# --- 2. remove the safety band ---------------------------------------------------------------
a, b = block(s, r'<section class="[^"]*" id="safety"[^>]*>', "safety")
safety = s[a:b]
if "安全への取り組み" not in safety:
    sys.exit("STOP: the block taken for the safety band is not the safety band — nothing written")
s = s[:a].rstrip("\r\n") + "\n" + s[b:].lstrip("\r\n")
print("  removed safety band (%d chars) — the company card row already links to the same page" % len(safety))

# --- 3. drop the fleet breakdown figure ------------------------------------------------------
m = re.search(r'<figure class="lineup-fig"', s)
if not m:
    sys.exit("STOP: could not find the fleet lineup figure — nothing written")
depth, end = 0, None
for t in re.finditer(r"<figure\b|</figure>", s[m.start():]):
    depth += 1 if t.group(0).startswith("<figure") else -1
    if depth == 0:
        end = m.start() + t.end()
        break
if end is None:
    sys.exit("STOP: the fleet figure is not closed — nothing written")
fig = s[m.start():end]
if "lu-count" not in fig:
    sys.exit("STOP: the block taken for the fleet figure has no vehicle counts — nothing written")
s = s[:m.start()].rstrip("\r\n") + "\n" + s[end:].lstrip("\r\n")
print("  removed fleet breakdown figure (%d chars) — fleet.html carries it in full" % len(fig))

# --- 4. put the news band back, at the foot of <main> -----------------------------------------
m = re.search(r"\r?\n</main>", s)
if not m:
    sys.exit("STOP: could not find </main> — nothing written")
s = s[:m.start()] + "\n\n" + news.strip("\r\n") + s[m.start():]
print("  placed  news band at the foot of <main>, above the contact band")

open(SRC, "w", encoding="utf-8", newline="").write(s)
print("\n%s: %d chars -> %d (%d removed)" % (SRC, before, len(s), before - len(s)))
