# Lifts clouds in a side's scene file by the amounts cloud-check measured, so a taller city (a size option)
# still has every cloud's base above the roofs under it.
#   node tools/cloud-check.mjs <side> --skip=7417-9139 --fit=shots/fit.json
#   python tools/cloud-lift.py samples/<side>/js/hero-port-b.js shots/fit.json
# It rewrites the underside y of the named clouds in SKY_WORLD / SKY_TRANSIT / SKY_FINALE (ids w-far:0,
# t-near:2, n-near:1 ...: the list's name and the cloud's place in it). Only ever run it on a sample side
# (a copy); the working copy's clouds are composed by hand in a part file.
import io, json, re, sys

target, fit = sys.argv[1], json.load(io.open(sys.argv[2], encoding='utf-8'))
raw = io.open(target, encoding='utf-8', newline='').read()
nl = '\r\n' if '\r\n' in raw else '\n'
lines = raw.replace('\r\n', '\n').split('\n')
PREFIX = {'SKY_WORLD': 'w', 'SKY_TRANSIT': 't', 'SKY_FINALE': 'n'}
cur, done = None, 0
for i, line in enumerate(lines):
    m = re.match(r'\s*var (SKY_WORLD|SKY_TRANSIT|SKY_FINALE) = \{', line)
    if m: cur = PREFIX[m.group(1)]; continue
    if cur and line.strip() == '};': cur = None; continue
    m = cur and re.match(r'^(\s+)(\w+): (\[.*\])(,?)(\s*(?://.*)?)$', line)
    if not m: continue
    arr = json.loads(m.group(3))
    for k, c in enumerate(arr):
        lift = fit.get('%s-%s:%d' % (cur, m.group(2), k))
        if lift: c[1] -= lift; done += 1
    lines[i] = '%s%s: %s%s%s' % (m.group(1), m.group(2), json.dumps(arr), m.group(4), m.group(5))
io.open(target, 'w', encoding='utf-8', newline='').write(nl.join(lines))
print('lifted', done, 'of', len(fit), 'clouds in', target)
