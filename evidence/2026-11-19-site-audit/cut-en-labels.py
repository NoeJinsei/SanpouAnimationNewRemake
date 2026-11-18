# Removes the roman kicker labels whose words are outside the conventional vocabulary.
# Run from the site's public_html. Reads and writes with newline="" so CRLF endings are left alone.
#
# The site carries 103 of these in 62 different words. In the survey of 38 Japanese carrier sites,
# 8 pair a roman word with a Japanese heading, always at section level and always from a near-closed
# vocabulary. No Japanese carrier labels a safety sub-block "Roll call".
#
# These elements are aria-hidden="true" decoration, so removing one costs nothing to a screen reader.

KEEP = {
    # page identities and the home page's own bands
    "Contact", "News", "Company", "Recruit", "Service", "Business", "Fleet", "Network", "Safety",
    "Reason", "Reasons", "Receiving", "Requirements", "Entry", "404 Not Found",
    # conventional section words that appear in the peer vocabulary
    "Access", "FAQ", "Flow", "Message", "History",
    # legal page identities
    "Privacy Policy", "Terms", "Site Map", "Site Policy",
}

import re, glob, sys, collections

removed = collections.Counter()
kept = collections.Counter()
files = {}

for f in sorted(glob.glob("*.html")):
    s = open(f, encoding="utf-8", newline="").read()
    out, last, changed = [], 0, 0
    for m in re.finditer(r'[ \t]*<p class="en-label"[^>]*>(.*?)</p>\r?\n?', s, flags=re.S):
        lab = re.sub(r"<[^>]*>", "", m.group(1)).strip()
        if lab in KEEP:
            kept[lab] += 1
            continue
        if 'aria-hidden="true"' not in m.group(0):
            sys.exit("STOP: %s has a roman label that is not aria-hidden (%r) — nothing written" % (f, lab))
        out.append((m.start(), m.end()))
        removed[lab] += 1
        changed += 1
    if changed:
        buf, last = [], 0
        for a, b in out:
            buf.append(s[last:a]); last = b
        buf.append(s[last:])
        files[f] = "".join(buf)

for f, s in files.items():
    open(f, "w", encoding="utf-8", newline="").write(s)

print("REMOVED %d labels in %d words, across %d files:" % (sum(removed.values()), len(removed), len(files)))
print("  " + ", ".join("%s%s" % (w, "" if n == 1 else " x%d" % n) for w, n in sorted(removed.items())))
print()
print("KEPT %d labels in %d words:" % (sum(kept.values()), len(kept)))
print("  " + ", ".join("%s%s" % (w, "" if n == 1 else " x%d" % n) for w, n in sorted(kept.items())))
