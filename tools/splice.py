# Splices redrawn parts into a scene file, so each element can be drawn in its own file.
#   python tools/splice.py <target.js> <part.js> [<part.js> ...]
# A part file is a list of blocks. Each block starts with one header line and runs to the next header:
#   //== REPLACE from "<text that starts the old code>" to "<text that starts what follows it>"
#   //== INSERT before "<text>"
# REPLACE swaps everything from the first text up to (not including) the second for the block's code.
# Texts are matched exactly, on one line, and must occur in the target; the tool stops if one is missing.
import io, re, sys

target = sys.argv[1]
src = io.open(target, encoding='utf-8', newline='').read()
nl = '\r\n' if '\r\n' in src else '\n'
src = src.replace('\r\n', '\n')
head = re.compile(r'^//== (REPLACE from "(.*)" to "(.*)"|INSERT before "(.*)")\s*$')
for part in sys.argv[2:]:
    blocks, cur = [], None
    for line in io.open(part, encoding='utf-8').read().replace('\r\n', '\n').split('\n'):
        m = head.match(line)
        if m:
            cur = {'m': m, 'code': []}
            blocks.append(cur)
        elif cur is not None:
            cur['code'].append(line)
    if not blocks:
        sys.exit(part + ': no "//== REPLACE" or "//== INSERT" header found')
    for b in blocks:
        code = '\n'.join(b['code']).rstrip('\n') + '\n'
        m = b['m']
        g = lambda i: m.group(i).replace('\\"', '"') if m.group(i) is not None else None
        if g(4) is not None:
            at = src.find(g(4))
            if at < 0: sys.exit(part + ': cannot find "' + g(4) + '"')
            at = src.rfind('\n', 0, at) + 1
            src = src[:at] + code + src[at:]
        else:
            a = src.find(g(2))
            if a < 0: sys.exit(part + ': cannot find "' + g(2) + '"')
            a = src.rfind('\n', 0, a) + 1
            z = src.find(g(3), a + len(g(2)))
            if z < 0: sys.exit(part + ': cannot find "' + g(3) + '" after "' + g(2) + '"')
            z = src.rfind('\n', 0, z) + 1
            src = src[:a] + code + src[z:]
    print('spliced', part, '(' + str(len(blocks)) + ' blocks)')
io.open(target, 'w', encoding='utf-8', newline='').write(src.replace('\n', nl))
