# Cuts the lead sentences whose only job is to announce the section below them.
# Run from the site's public_html. Every change is matched on an exact unique substring and asserted,
# so it either does precisely what is listed here or stops and changes nothing.
#
# NOT touched, deliberately:
#   - the 18 in <meta name="description"> tags: describing the page IS the job there
#   - the link-card blurbs on 404 / news / company / business / safety: a card describes its destination
#   - 「担当者より面接日程をご案内します。」 on the recruit pages: that is a real process statement
#     ("we will let you know the interview date"), not a section announcement
import io, os, sys

# (file, unique substring of the <p> line to remove whole). The site wraps phrases in
# <span class="nw"> to stop them breaking, so a substring must not cross a span boundary.
DELETE = [
    ("fleet.html",     "主な車種の最大積載量と、それぞれの用途を"),
    ("index.html",     "4つの点から"),
    ("index.html",     'class="sec-lead">点呼・健康管理'),   # the link-card blurb below it says the same and stays
    ("network.html",   "所在地と設備、"),
    ("privacy.html",   "個人情報の取扱いについての"),
    ("reasons.html",   "三豊運輸が選ばれてきた理由を、数字と日々の体制から"),
    ("reasons.html",   "創業年と、保有車両・拠点・従業員の数を"),
    ("reasons.html",   '当社の強みを</span><span class="nw">ご紹介します。'),
    ("reasons.html",   "確実な輸送のために、"),
    ("receiving.html", 'class="page-head-lead"><span class="nw">志木営業所での'),
    ("sitepolicy.html", 'class="page-head-lead">当サイトをご利用いただく際の注意事項と、'),
]

# the two that carry a real fact inside the announcement: the fact is kept, the announcement goes
REWRITE = [
    ("reasons.html",
     '<p class="sec-lead">ご依頼の前によくいただくご質問を<span class="nw">まとめました。</span>このほかのご質問も、<span class="nw">お気軽に</span><span class="nw">お問い合わせください。</span></p>',
     '<p class="sec-lead">このほかのご質問も、<span class="nw">お気軽に</span><span class="nw">お問い合わせください。</span></p>'),
    ("recruit-requirements.html",
     '<p class="page-head-lead">ドライバー職・倉庫スタッフを募集しています。仕事内容や給与、勤務時間などの<span class="nw">条件を、</span><span class="nw">職種ごとに</span><span class="nw">ご案内します。</span></p>',
     '<p class="page-head-lead">ドライバー職・倉庫スタッフを募集しています。</p>'),
]

def main():
    # newline="" on BOTH read and write: these files are CRLF, and letting Python translate the
    # line endings rewrites every line of every file instead of the thirteen that should change.
    def load(f):
        return open(f, encoding="utf-8", newline="").read().split("\n")

    files = {}
    for f, _ in DELETE:
        files.setdefault(f, load(f))
    for f, _, _ in REWRITE:
        files.setdefault(f, load(f))

    removed = kept = 0
    for f, needle in DELETE:
        lines = files[f]
        hits = [i for i, l in enumerate(lines) if l is not None and needle in l]
        if len(hits) != 1:
            sys.exit("STOP: %s matched %d lines for %r — nothing written" % (f, len(hits), needle))
        i = hits[0]
        if not lines[i].strip().startswith("<p ") or not lines[i].strip().endswith("</p>"):
            sys.exit("STOP: %s line %d is not a whole <p> element — nothing written" % (f, i + 1))
        print("  cut   %-26s L%-5d %s" % (f, i + 1, lines[i].strip()[:78]))
        lines[i] = None
        removed += 1

    for f, old, new in REWRITE:
        lines = files[f]
        hits = [i for i, l in enumerate(lines) if l is not None and l.strip() == old]
        if len(hits) != 1:
            sys.exit("STOP: %s matched %d lines for the rewrite — nothing written" % (f, len(hits)))
        i = hits[0]
        print("  trim  %-26s L%-5d -> %s" % (f, i + 1, new[:70]))
        lines[i] = new + ("\r" if lines[i].endswith("\r") else "")   # keep this line's own ending
        kept += 1

    for f, lines in files.items():
        out = "\n".join(l for l in lines if l is not None)
        open(f, "w", encoding="utf-8", newline="").write(out)

    print("\n%d sentences cut, %d trimmed to keep the fact inside them, across %d files"
          % (removed, kept, len(files)))

main()
