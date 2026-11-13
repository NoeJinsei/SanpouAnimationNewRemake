# Builds trial sides that differ from the working copy only in how tall the city stands and how big
# Mt Fuji is, so the owner can pick a size from real frames.
#   python tools/size-options.py            -> writes parts into shots/size-options/ and prints the build lines
# Each option is a tiny part file (three one-line REPLACE blocks) applied to a fresh copy of round2/js with
# tools/build-side.sh. The sides opt-c2, opt-c3, opt-f1, opt-f3 must exist in sides.json while it is used.
import io, os, re

SRC = 'round2/js/hero-port-b.js'
OUT = 'shots/size-options'
# city: base multiplies every height, amp widens the range above and below a row's usual roofline
# fuji: [scene 03 cx, w, ht], [scene 05 cx, w, ht]; base lines stay (742 and 1008)
OPTIONS = {
    'opt-c2': {'city': (1.12, 1.15)},
    'opt-c3': {'city': (1.25, 1.3)},
    'opt-f1': {'fuji': ((460, 1240, 470), (400, 1700, 560))},    # the size the drawing was approved at
    'opt-f3': {'fuji': ((430, 1660, 690), (366, 2260, 810))},    # one step past today's trial
}

lines = io.open(SRC, encoding='utf-8', newline='').read().replace('\r\n', '\n').split('\n')

def find(pred):
    hits = [i for i, l in enumerate(lines) if pred(l)]
    assert len(hits) == 1, (pred, hits)
    return hits[0]

def esc(s):
    return s.replace('"', '\\"')

def block(i, new):
    nxt = i + 1
    while not lines[nxt].strip():
        nxt += 1
    return '//== REPLACE from "%s" to "%s"\n%s\n' % (esc(lines[i].rstrip()), esc(lines[nxt].rstrip()), new)

i_city = find(lambda l: l.strip().startswith('var SKYLINE_SIZE = {'))
i_f3 = find(lambda l: 'FujiMountain({' in l and 'baseY: 742' in l)
i_f5 = find(lambda l: 'FujiMountain({' in l and 'baseY: 1008' in l)

os.makedirs(OUT, exist_ok=True)
for name, o in OPTIONS.items():
    part = ''
    if 'city' in o:
        part += block(i_city, re.sub(r'\{[^}]*\}', '{ base: %s, amp: %s }' % o['city'], lines[i_city], count=1))
    if 'fuji' in o:
        a, b = o['fuji']
        part += block(i_f3, re.sub(r'cx: \d+, baseY: 742, w: \d+, ht: \d+', 'cx: %d, baseY: 742, w: %d, ht: %d' % a, lines[i_f3]))
        part += block(i_f5, re.sub(r'cx: \d+, baseY: 1008, w: \d+, ht: \d+', 'cx: %d, baseY: 1008, w: %d, ht: %d' % b, lines[i_f5]))
    p = os.path.join(OUT, name + '.js').replace('\\', '/')
    io.open(p, 'w', encoding='utf-8', newline='\n').write(part)
    print('sh tools/build-side.sh %s %s' % (name, p))
