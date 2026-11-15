# Puts stills side by side or one above the other, each under a label bar, into one picture for the owner.
#   python tools/sheet.py <out.jpg> [--cols=1] [--width=1280] [--title="..."] "<label>=<image.png>" ...
# e.g. the three-way comparison of a scene (original / frozen round 2 / new), top to bottom:
#   python tools/sheet.py evidence/x/three-way-scene01.jpg "1  Original - the site today=a.png" "2  Round 2 as it stood=b.png" "3  New=c.png"
# --cols=N lays the pictures out N to a row (size options). --width is the width of one picture.
# A label may carry more lines, each after a "|" (drawn smaller, e.g. what is new and what is still old).
# Every picture is scaled to the same width, and the pictures of one row start at the same height whatever
# their labels: compare two tiles of a row and nothing but the pictures differs.
import sys
from PIL import Image, ImageDraw, ImageFont

args, flags, items = sys.argv[1:], {}, []
out = None
for a in args:
    if a.startswith('--') and '=' in a:
        k, v = a[2:].split('=', 1); flags[k] = v
    elif out is None:
        out = a
    else:
        label, path = a.rsplit('=', 1); items.append((label, path))
cols, width, title = int(flags.get('cols', 1)), int(flags.get('width', 1280)), flags.get('title')

# The label bars must be able to write 三豊運輸: a font with Japanese glyphs comes first (it has Latin too),
# Arial only as the last resort.
JP_BOLD = ['C:/Windows/Fonts/YuGothB.ttc', 'C:/Windows/Fonts/meiryob.ttc', 'C:/Windows/Fonts/BIZ-UDGothicB.ttc']
JP_REG = ['C:/Windows/Fonts/YuGothM.ttc', 'C:/Windows/Fonts/meiryo.ttc', 'C:/Windows/Fonts/BIZ-UDGothicR.ttc', 'C:/Windows/Fonts/msgothic.ttc']
def font(size, bold=True):
    for f in (JP_BOLD if bold else []) + JP_REG + (['C:/Windows/Fonts/arialbd.ttf'] if bold else []) + ['C:/Windows/Fonts/arial.ttf']:
        try: return ImageFont.truetype(f, size)
        except OSError: pass
    return ImageFont.load_default()

BAR, SUB, NAVY, PAPER = 40, 24, (38, 58, 88), (255, 255, 255)
f1, f2, f0 = font(20), font(17, False), font(24)
tiles = []
# Every tile in a row gets the same label bar, as tall as the row's longest label: a tile whose label has a
# second line used to get a taller bar than its neighbour, so in a before/after the two pictures stood at
# different heights and it could look as if something had moved or been zoomed when nothing had.
lines = [len(label.split('|')) - 1 for label, _ in items]
for i, (label, path) in enumerate(items):
    im = Image.open(path).convert('RGB')
    im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    head, *subs = label.split('|')
    most = max(lines[i - i % cols:i - i % cols + cols])
    bar = BAR + SUB * most + (4 if most else 0)
    t = Image.new('RGB', (width, im.height + bar), NAVY)
    d = ImageDraw.Draw(t)
    d.text((14, 9), head.strip(), font=f1, fill=PAPER)
    for k, sub in enumerate(subs): d.text((14, BAR - 2 + SUB * k), sub.strip(), font=f2, fill=(205, 219, 238))
    t.paste(im, (0, bar))
    tiles.append(t)

rows = [tiles[i:i + cols] for i in range(0, len(tiles), cols)]
top = 52 if title else 0
W = cols * width + (cols - 1) * 6
H = top + sum(max(t.height for t in r) for r in rows) + (len(rows) - 1) * 6
sheet = Image.new('RGB', (W, H), (20, 32, 52))
if title: ImageDraw.Draw(sheet).text((14, 12), title, font=f0, fill=PAPER)
y = top
for r in rows:
    x = 0
    for t in r:
        sheet.paste(t, (x, y)); x += width + 6
    y += max(t.height for t in r) + 6
sheet.save(out, quality=90)
print('wrote', out, sheet.size)
