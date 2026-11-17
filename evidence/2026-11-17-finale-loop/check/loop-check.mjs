// Is the finale a loop? Works out the picture at a moment and at the same moment one turn (L seconds) later,
// for every step of a whole turn, and lists every node that is not the same in both.
//   node evidence/2026-11-17-finale-loop/check/loop-check.mjs <side> [--L=52] [--from=30500] [--step=33.3333] [--turns=1] [--top=40] [--hidden]
// --from is on the site clock (the finale holds from 30411 ms). Hidden nodes (under display:none) are counted
// apart: they are not in the picture, but they are still worked out and written every frame.
import { load, pictureAt, same, short, flags } from "./scene-lab.mjs";

const { f, pos } = flags(process.argv.slice(2));
const side = load(pos[0] || "round2"), L = +(f.L || 52) * 1000, from = +(f.from || 30500), step = +(f.step || 1000 / 30), turns = +(f.turns || 1), top = +(f.top || 40);
const tally = new Map();
let moments = 0, bad = 0, badSeen = 0, worst = null;
for (let ms = from; ms < from + L * turns - 1e-6; ms += step) {
  const A = pictureAt(side, ms), B = pictureAt(side, ms + L);
  moments++;
  let any = false, seen = false;
  for (let i = 0; i < A.length; i++) {
    const d = same(A[i].tree, B[i].tree, 100000);
    if (!d.length) continue;
    any = true;
    for (const x of d) {
      const hid = x.hidden;                                  // in a branch that is not displayed
      if (!hid) seen = true;
      const key = (hid ? "(hidden) " : "") + short(x.where) + "  [" + x.attr + "]";
      const t = tally.get(key) || { n: 0, hid, eg: x, at: ms };
      t.n++; tally.set(key, t);
    }
  }
  if (any) bad++;
  if (seen) { badSeen++; if (!worst) worst = ms; }
}
console.log(`${side.id}: the finale at t and at t + ${L / 1000} s, ${moments} moments from ${from} ms, a step of ${step.toFixed(2)} ms`);
console.log(`  moments where the picture differs: ${badSeen}   (moments where any node differs, hidden ones included: ${bad})`);
const rows = [...tally.entries()].sort((a, b) => (a[1].hid - b[1].hid) || (b[1].n - a[1].n));
for (const [k, t] of rows.slice(0, top)) {
  const cut = (s) => { s = String(s); return s.length > 46 ? s.slice(0, 46) + "…" : s; };
  console.log(`  ${String(t.n).padStart(5)}  ${k}\n         e.g. at ${t.at.toFixed(0)} ms: ${cut(t.eg.a)}  ->  ${cut(t.eg.b)}`);
}
if (rows.length > top) console.log(`  … and ${rows.length - top} more kinds`);
console.log(badSeen ? "NOT A LOOP" : (bad ? "the picture loops; only hidden nodes differ" : "A LOOP: every node is the same one turn later"));
process.exit(badSeen ? 1 : 0);
