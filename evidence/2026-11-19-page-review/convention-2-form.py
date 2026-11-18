# Convention item 2: make the enquiry form a business form.
# Run from the site root (sanpou-site-v2). Reads and writes with newline="" so CRLF is left alone.
#
# Today the form asks お名前（必須）→ フリガナ（必須）→ 会社名 → 部署, which is the shape of a consumer
# form: the person first, the company optional afterwards. A logistics enquiry comes from a company.
# After: 種別 → 会社名 → 部署 → お名前 → フリガナ → メール → 電話.
#
# 会社名 is already conditionally required for the four business enquiry types (data-require-when in the
# partial, 'b2b' in app.php), so that part is right already and is not touched.
#
# フリガナ becomes optional: the kana FORMAT check stays, so a value that is filled is still validated,
# but it no longer blocks a business enquiry.
#
# Two files must agree or the notification mail stops matching the form:
#   partials/form-contact.html   the form itself (sync.py injects it into public_html/contact.html)
#   private/form/app.php         the server's field spec, whose order is the mail's order
# The confirmation screen needs no change: form.js builds it by walking the form's own fields in order.
import re, sys

# ---- 1. the partial: move 会社名 and 部署 above お名前, and relax フリガナ -------------------
f = "partials/form-contact.html"
s = open(f, encoding="utf-8", newline="").read()
nl = "\r\n" if "\r\n" in s else "\n"
lines = s.split(nl)

def block(id_attr):
    """the <div class="form-row"> … </div> that contains this field id"""
    hit = [i for i, l in enumerate(lines) if id_attr in l]
    if len(hit) != 1:
        sys.exit("STOP: %s matched %d lines in the partial" % (id_attr, len(hit)))
    i = hit[0]
    while i >= 0 and 'class="form-row"' not in lines[i]:
        i -= 1
    j = i
    while j < len(lines) and lines[j].strip() != "</div>":
        j += 1
    return i, j

ci, cj = block('id="f-company"')
di, dj = block('id="f-dept"')
ni, nj = block('id="f-name"')
if not (nj < ci and cj < di):
    sys.exit("STOP: the partial is not in the order this script expects — nothing written")

moved = lines[ci:dj + 1]                      # company block .. dept block, blanks between kept
if not any("会社名" in l for l in moved) or not any("部署" in l for l in moved):
    sys.exit("STOP: the block taken is not 会社名 + 部署 — nothing written")
rest = lines[:ci] + lines[dj + 1:]
# drop the blank line the move left behind, then insert before the name block
while rest and rest[ci - 1].strip() == "" and rest[ci - 2].strip() == "":
    del rest[ci - 1]
lines = rest[:ni] + moved + [""] + rest[ni:]
print("  moved  会社名 and 部署 above お名前")

s = nl.join(lines)

# フリガナ: optional, but still format-checked when it is filled
before = s
s = s.replace('<label class="form-label" for="f-furigana">フリガナ<span class="form-badge is-req">必須</span></label>',
              '<label class="form-label" for="f-furigana">フリガナ<span class="form-badge is-opt">任意</span></label>')
s = s.replace(' maxlength="50" required placeholder="例：ヤマダ タロウ"', ' maxlength="50" placeholder="例：ヤマダ タロウ"')
s = s.replace(' data-msg-required="フリガナを入力してください。"', '')
if s == before:
    sys.exit("STOP: the フリガナ field did not change — nothing written")
print("  relaxed フリガナ to optional (the kana format check stays)")
open(f, "w", encoding="utf-8", newline="").write(s)

# ---- 2. app.php: the same order, and furigana no longer required ---------------------------
f2 = "private/form/app.php"
a = open(f2, encoding="utf-8", newline="").read()
old = """            'name'     => ['text',     50,   true,  'お名前'],
            'furigana' => ['kana',     50,   true,  'フリガナ'],
            'company'  => ['text',     100,  'b2b', '会社名'],
            'dept'     => ['text',     100,  false, '部署'],"""
new = """            'company'  => ['text',     100,  'b2b', '会社名'],
            'dept'     => ['text',     100,  false, '部署'],
            'name'     => ['text',     50,   true,  'お名前'],
            'furigana' => ['kana',     50,   false, 'フリガナ'],"""
old = old.replace("\n", "\r\n") if "\r\n" in a else old
new = new.replace("\n", "\r\n") if "\r\n" in a else new
if a.count(old) != 1:
    sys.exit("STOP: app.php's contact spec is not in the expected shape — the partial was written, revert it")
open(f2, "w", encoding="utf-8", newline="").write(a.replace(old, new))
print("  app.php: same order, furigana no longer required")
print("\nnow run: python tools/sync.py")
