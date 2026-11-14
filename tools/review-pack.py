# Builds the review pictures for a batch in one go (the owner asked to see a whole batch together).
#   python tools/review-pack.py <outDir> [--only=threeway,framings,seams,loading]
# Needs the viewer server on http://127.0.0.1:8791 and the sides original, before-round3 and round2.
# Writes into <outDir>:
#   three-way-<scene>.jpg     original / frozen round 2 / new, with the new-versus-old line on the new panel
#   scenes-desktop.jpg, scenes-phone.jpg   all five scenes as the site shows them, original above new
#   into-map.jpg, out-of-map.jpg           both scene changes around the map, a frame every 100 ms (desktop)
#   loading-scene01.jpg, loading-scene02.jpg   the loading at both docks, a still every 200 ms
# The new-versus-old lines live in THREEWAY below: edit them when an element changes.
import os, subprocess, sys, shutil
from PIL import Image

args = [a for a in sys.argv[1:] if not a.startswith('--')]
flags = dict(a[2:].split('=', 1) for a in sys.argv[1:] if a.startswith('--') and '=' in a)
out = args[0] if args else 'evidence/review'
only = set(flags.get('only', 'threeway,framings,seams,loading').split(','))
tmp = os.path.join(out, '_stills')
os.makedirs(tmp, exist_ok=True)

def shots(side, sub, extra):
    d = os.path.join(tmp, sub)
    subprocess.run(['node', 'tools/shots.mjs', side, d] + extra, check=True, stdout=subprocess.DEVNULL)
    return d

def still(d, side, t):
    return os.path.join(d, '%s-t%05d.png' % (side, t))

THREEWAY = [
    ('scene01-loading', 3300,
     'NEW in this batch: the clouds, the truck (三豊運輸 as the big line), deeper city values. Earlier in round 3: the supplier dock, sky, city, Tokyo Tower.',
     'STILL OLD (round 2): the street, the lamps, the vending machines, the foreground rail.'),
    ('scene02-loading', 11800,
     'NEW in this batch: the clouds, the three trucks, deeper city values. Earlier in round 3 (approved): the Sanpou warehouse and its sign.',
     'STILL OLD (round 2): the street, the lamps, the foreground rail.'),
    ('scene03-expressway', 17000,
     'NEW in this batch: the clouds, the trucks, deeper city values. Earlier: the city, Mt Fuji (approved), the sun.',
     'STILL OLD (the original drawings): the expressway, its lamps, the gantry and signs, the foreground fence.'),
    ('scene04-map', 26500,
     'NEW in this batch: the sea panel, the white service area and its colours, the moving water, the dashed routes, the small trucks, the navy name cards.',
     'Earlier in round 3: the three mini depots. STILL OLD: nothing in this picture.'),
    ('scene05-at-the-stand', 33500,
     'NEW in this batch: the airliner, the whole skyline, the airport, the Sanpou depot with its name, the road trucks, the clouds.',
     'Earlier: Mt Fuji (approved), Tokyo Tower, the sun. STILL OLD: nothing in this picture.'),
    ('scene05-climb', 38000,
     'NEW in this batch: the airliner and its open sky, the whole skyline, the airport, the Sanpou depot with its name, the road trucks, the clouds.',
     'Earlier: Mt Fuji (approved), Tokyo Tower, the sun. STILL OLD: nothing in this picture.'),
]

if 'threeway' in only:
    times = ','.join(str(t) for _, t, _, _ in THREEWAY)
    dirs = {s: shots(s, 'full-' + s, ['--framing=full', '--times=' + times]) for s in ('original', 'before-round3', 'round2')}
    for name, t, new, old in THREEWAY:
        subprocess.run(['python', 'tools/sheet.py', os.path.join(out, 'three-way-%s.jpg' % name), '--width=1280',
                        '1  Original - the site today=' + still(dirs['original'], 'original', t),
                        '2  Round 2 as it stood before round 3=' + still(dirs['before-round3'], 'before-round3', t),
                        '3  New|' + new + '|' + old + '=' + still(dirs['round2'], 'round2', t)], check=True)

if 'framings' in only:
    scenes = [('01', 3300), ('02', 11800), ('03', 17000), ('04', 26500), ('05', 38000)]
    times = ','.join(str(t) for _, t in scenes)
    for framing, width in (('desktop', 720), ('phone', 300)):
        items = []
        for side, label in (('original', 'Original'), ('round2', 'New')):
            d = shots(side, framing + '-' + side, ['--framing=' + framing, '--times=' + times])
            items += ['%s - scene %s=%s' % (label, n, still(d, side, t)) for n, t in scenes]
        subprocess.run(['python', 'tools/sheet.py', os.path.join(out, 'scenes-%s.jpg' % framing), '--cols=5', '--width=%d' % width,
                        '--title=All five scenes as a %s shows them: the site today above, the remake below' % framing] + items, check=True)

if 'seams' in only:
    for name, a, b in (('into-map', 21500, 22700), ('out-of-map', 27700, 29000)):
        d = shots('round2', name, ['--framing=desktop', '--from=%d' % a, '--to=%d' % b, '--every=100', '--sheet=7', '--scale=480'])
        shutil.copy(os.path.join(d, 'round2-sheet.jpg'), os.path.join(out, name + '.jpg'))

if 'loading' in only:
    for name, a, b, box, cols in (('loading-scene01', 2200, 4800, (560, 660, 1420, 940), 4), ('loading-scene02', 10400, 12800, (0, 660, 1920, 940), 2)):
        d = shots('round2', name, ['--framing=full', '--from=%d' % a, '--to=%d' % b, '--every=200'])
        ts = list(range(a, b + 1, 200))
        w, h = box[2] - box[0], box[3] - box[1]
        sc = 0.5
        tw, th = int(w * sc), int(h * sc)
        rows = (len(ts) + cols - 1) // cols
        sheet = Image.new('RGB', (tw * cols, th * rows), (20, 30, 50))
        for i, t in enumerate(ts):
            im = Image.open(still(d, 'round2', t)).convert('RGB').crop(box).resize((tw, th))
            sheet.paste(im, (tw * (i % cols), th * (i // cols)))
        sheet.save(os.path.join(out, name + '.jpg'), quality=88)

shutil.rmtree(tmp, ignore_errors=True)
print('review pictures in', out)
