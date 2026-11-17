// Did a change leave part of the film alone? Works out the picture at every step of a stretch of the film
// with the code before and the code after, and lists every node that is not the same in both.
//   node evidence/2026-11-17-finale-loop/check/same-check.mjs <side> <folder with the code before> [--from=0 --to=27800 --fps=60 --top=20]
// The folder holds the three scene files as they were (hero-flag.js, hero-port-a.js, hero-port-b.js), e.g.
//   mkdir -p shots/pre/js && for f in hero-flag.js hero-port-a.js hero-port-b.js; do git show HEAD:round2/js/$f > shots/pre/js/$f; done
// Nodes that are not displayed (the finale standing finished under the map) are counted apart: they are not in the picture.
import { load, pictureAt, same, short, flags } from "./scene-lab.mjs";

const { f, pos } = flags(process.argv.slice(2));
const now = load(pos[0] || "round2"), before = load(pos[0] || "round2", { base: pos[1].replace(/\/?$/, "/") });
const from = +(f.from || 0), to = +(f.to || 27800), fps = +(f.fps || 60), top = +(f.top || 20);
const tally = new Map();
let moments = 0, seen = 0, any = 0;
for (let i = 0; from + i * 1000 / fps <= to + 1e-6; i++) {
  const ms = from + i * 1000 / fps, A = pictureAt(before, ms), B = pictureAt(now, ms);
  moments++;
  let s = false, a = false;
  if (A.length !== B.length) { s = a = true; tally.set("the number of layers", { n: 1, at: ms, eg: { a: A.length, b: B.length } }); }
  else for (let k = 0; k < A.length; k++) {
    if (A[k].style !== B[k].style) { s = a = true; const key = A[k].scene + " layer style"; const t = tally.get(key) || { n: 0, at: ms, eg: { a: A[k].style, b: B[k].style } }; t.n++; tally.set(key, t); }
    for (const x of same(A[k].tree, B[k].tree, 100000)) {
      a = true; if (!x.hidden) s = true;
      const key = (x.hidden ? "(not displayed) " : "") + A[k].scene + short(x.where) + "  [" + x.attr + "]";
      const t = tally.get(key) || { n: 0, at: ms, eg: x, hid: x.hidden }; t.n++; tally.set(key, t);
    }
  }
  if (s) seen++; if (a) any++;
}
console.log(`${now.id}: before and after, ${moments} moments from ${from} to ${to} ms`);
console.log(`  moments where the picture differs: ${seen}   (moments where any node differs, undisplayed ones included: ${any})`);
const cut = (s) => { s = String(s); return s.length > 46 ? s.slice(0, 46) + "…" : s; };
const rows = [...tally.entries()].sort((a, b) => (!!a[1].hid - !!b[1].hid) || (b[1].n - a[1].n));
for (const [k, t] of rows.slice(0, top)) console.log(`  ${String(t.n).padStart(5)}  ${k}\n         e.g. at ${t.at.toFixed(0)} ms: ${cut(t.eg.a)}  ->  ${cut(t.eg.b)}`);
if (rows.length > top) console.log(`  … and ${rows.length - top} more kinds`);
console.log(seen ? "THE PICTURE CHANGED" : "the picture is the same at every moment");
process.exit(seen ? 1 : 0);
