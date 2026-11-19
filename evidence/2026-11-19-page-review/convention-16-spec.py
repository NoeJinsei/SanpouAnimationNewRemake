# The sixth part of convention 16, split out because docs/SPEC.md has MIXED line
# endings: most of it is CRLF, the §7 Forms block is LF. Anchors here use \n and the
# file is read and written with newline="" so nothing else in it is touched.

import io, sys

P = r"C:/Users/RTX4070TI/Desktop/sanpou-site-v2/docs/SPEC.md"

with io.open(P, "r", encoding="utf-8", newline="") as f:
    s = f.read()

OLD = (
    "  - Required: \u304a\u554f\u3044\u5408\u308f\u305b\u7a2e\u5225 (radio: \u8f38\u9001\u30fb\u914d\u9001 / "
    "\u5009\u5eab\u4fdd\u7ba1 / \u6d41\u901a\u52a0\u5de5\u30fb\u7d19\u30b9\u30ea\u30c3\u30bf\u30fc\u52a0\u5de5 / "
    "3PL / \u63a1\u7528 / \u305d\u306e\u4ed6),\n"
    "    \u304a\u540d\u524d, \u30d5\u30ea\u30ac\u30ca (hiragana is converted to katakana), "
    "\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9, \u304a\u554f\u3044\u5408\u308f\u305b\u5185\u5bb9 "
    "(3000 characters).\n"
    "  - Conditionally required (for the business types): \u4f1a\u793e\u540d, \u96fb\u8a71\u756a\u53f7.\n"
    "  - Optional: \u90e8\u7f72.\n"
    "  - Quote helpers: \u767a\u5730 / \u7740\u5730 / \u8377\u7269\u306e\u7a2e\u985e / \u6570\u91cf\u30fb\u983b\u5ea6."
    " Optional; \u300c\u5206\u304b\u308b\u7bc4\u56f2\u3067\u3054\u8a18\u5165\u304f\u3060\u3055\u3044\u300d.\n"
)

NEW = (
    "  - Required: \u304a\u554f\u3044\u5408\u308f\u305b\u7a2e\u5225 (radio: \u8f38\u9001\u30fb\u914d\u9001 / "
    "\u5009\u5eab\u4fdd\u7ba1 / \u6d41\u901a\u52a0\u5de5 / 3PL / \u63a1\u7528 / \u305d\u306e\u4ed6),\n"
    "    \u304a\u540d\u524d, \u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9, \u304a\u554f\u3044\u5408\u308f\u305b\u5185\u5bb9 "
    "(3000 characters).\n"
    "  - Conditionally required (for the business types): \u4f1a\u793e\u540d, \u96fb\u8a71\u756a\u53f7.\n"
    "  - Order: \u7a2e\u5225 \u2192 \u4f1a\u793e\u540d \u2192 \u90e8\u7f72 \u2192 \u304a\u540d\u524d \u2192 "
    "\u30d5\u30ea\u30ac\u30ca \u2192 \u30e1\u30fc\u30eb \u2192 \u96fb\u8a71 (a business form asks the account "
    "before the caller).\n"
    "  - Optional: \u90e8\u7f72; \u30d5\u30ea\u30ac\u30ca (hiragana is still converted to katakana, but it is no "
    "longer required here \u2014 recruit-entry keeps it required).\n"
    "  - Quote helpers: \u767a\u5730 / \u7740\u5730 / \u8377\u7269\u306e\u7a2e\u985e / \u6570\u91cf\u30fb\u983b\u5ea6."
    " Optional, and shown only for the four business types (`data-show-when` on the fieldset, cleared when "
    "hidden); \u300c\u5206\u304b\u308b\u7bc4\u56f2\u3067\u3054\u8a18\u5165\u304f\u3060\u3055\u3044\u300d.\n"
)

n = s.count(OLD)
if n != 1:
    sys.exit("ABORT: SPEC contact fields found %d times, expected 1" % n)

s = s.replace(OLD, NEW, 1)

with io.open(P, "w", encoding="utf-8", newline="") as f:
    f.write(s)

print("changed: docs/SPEC.md")
