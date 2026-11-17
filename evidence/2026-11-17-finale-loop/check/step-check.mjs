// Does anything move in steps, jump, or change speed in one frame?
// Follows every number the scene code writes (a place, a turn, a size, a strength) through a stretch of the
// film at 60 steps a second (or --fps), and lists the ones that are not a smooth function of the time:
//   STEPS  the number stands still for some frames and then moves by a visible amount (it is rounded too
//          coarsely, or it follows a coarse clock): what makes motion look jagged at a perfect frame rate
//   JUMP   one frame's change is many times its neighbours' (a pop, or a wrap that may be in view)
//   KINK   its speed changes by a visible amount in one frame (it starts or stops dead)
// A frame-rate figure sees none of these.
//   node evidence/2026-11-17-finale-loop/check/step-check.mjs <side> [--from=0 --to=48000 --fps=60 --top=30 --only=STEPS|JUMP|KINK] [--where=text] [--all]
// Hidden nodes are left out unless --all. Places are in the node's own units (stage px unless it stands in a scaled group).
import { load, channels, short, flags } from "./scene-lab.mjs";

const { f, pos } = flags(process.argv.slice(2));
const side = load(pos[0] || "round2"), from = +(f.from || 0), to = +(f.to || 48000), fps = +(f.fps || 60), top = +(f.top || 30);
const times = []; for (let i = 0; from + i * 1000 / fps <= to + 1e-6; i++) times.push(from + i * 1000 / fps);
// what counts as visible, per kind of number, at 60 steps a second (scaled for another rate)
const K = 60 / fps;
const SEE = { pos: { step: 0.25, jump: 4 * K, kink: 1.5 * K }, rot: { step: 0.15, jump: 2 * K, kink: 0.8 * K }, scale: { step: 0.003, jump: 0.05 * K, kink: 0.02 * K }, alpha: { step: 0.03, jump: 0.15 * K, kink: 0.08 * K } };
const med = (a) => { if (!a.length) return 0; const b = Float64Array.from(a).sort(); return b[b.length >> 1]; };

const list = channels(side, times, f.where ? (w) => w.includes(f.where) : null);
const found = [];
let followed = 0;
for (const s of list) {
  if (s.shape) { found.push({ kind: "SHAPE", s, i: 0, score: 0, note: "the count of numbers changes: not followed" }); continue; }
  const big = s.n > 60;                                       // a long path (the birds, a windsock): its numbers are followed for steps only
  for (let i = 0; i < s.n; i++) {
    const v = s.v[i], see = SEE[s.kinds[i]]; if (!see) continue;
    followed++;
    // the differences from each moment to the next, where the node is there and in the picture at both
    const d = new Float64Array(times.length - 1).fill(NaN);
    for (let t = 0; t < d.length; t++) if (!isNaN(v[t]) && !isNaN(v[t + 1]) && (f.all || (!s.hidden[t] && !s.hidden[t + 1]))) d[t] = s.kinds[i] === "rot" ? ((v[t + 1] - v[t] + 540) % 360) - 180 : v[t + 1] - v[t];   // a turn is the same turn after 360
    // STEPS: inside stretches where it is moving (it moved within 12 frames before and after), how many frames stand still
    let still = 0, moved = 0; const sizes = [];
    const last = new Int32Array(d.length).fill(-1e9), next = new Int32Array(d.length).fill(1e9);
    for (let t = 0, p = -1e9; t < d.length; t++) { if (d[t] !== 0 && !isNaN(d[t])) p = t; last[t] = p; }
    for (let t = d.length - 1, p = 1e9; t >= 0; t--) { if (d[t] !== 0 && !isNaN(d[t])) p = t; next[t] = p; }
    for (let t = 0; t < d.length; t++) {
      if (isNaN(d[t])) continue;
      if (d[t] !== 0) { moved++; sizes.push(Math.abs(d[t])); }
      else if (t - last[t] <= 12 && next[t] - t <= 12) still++;
    }
    const typical = med(sizes);
    if (moved >= 6 && still / (still + moved) >= 0.25 && typical >= see.step)
      found.push({ kind: "STEPS", s, i, score: typical * (still / (still + moved)), note: `${(100 * still / (still + moved)).toFixed(0)} % of its frames stand still, then it moves ${typical.toFixed(2)} at a time`, at: times[Math.max(0, d.findIndex((x) => x !== 0 && !isNaN(x)))] });
    if (big) continue;
    // JUMP and KINK: against the frames around
    for (let t = 1; t < d.length - 1; t++) {
      if (isNaN(d[t])) continue;
      const near = []; for (let u = Math.max(0, t - 6); u <= Math.min(d.length - 1, t + 6); u++) if (u !== t && !isNaN(d[u])) near.push(Math.abs(d[u]));
      if (near.length < 4) continue;
      const m = med(near), a = Math.abs(d[t]);
      if (a > see.jump && a > 8 * m + 1e-9) { found.push({ kind: "JUMP", s, i, score: a, note: `moves ${a.toFixed(2)} in one frame (the frames around it: ${m.toFixed(3)})`, at: times[t], from: v[t], to: v[t + 1] }); t += 6; continue; }
      if (!isNaN(d[t - 1])) {
        const acc = Math.abs(d[t] - d[t - 1]);
        const accs = []; for (let u = Math.max(1, t - 6); u <= Math.min(d.length - 1, t + 6); u++) if (u !== t && !isNaN(d[u]) && !isNaN(d[u - 1])) accs.push(Math.abs(d[u] - d[u - 1]));
        const ma = med(accs);
        if (acc > see.kink && acc > 8 * ma + 1e-9) { found.push({ kind: "KINK", s, i, score: acc, note: `its speed changes by ${acc.toFixed(2)} a frame in one frame (${d[t - 1].toFixed(3)} -> ${d[t].toFixed(3)})`, at: times[t] }); t += 6; }
      }
    }
  }
}
// one line per node, attribute and kind of fault: the worst number of that attribute
const best = new Map();
for (const x of found) {
  const key = x.kind + "|" + x.s.where + "|" + x.s.attr;
  const b = best.get(key);
  if (!b) best.set(key, { ...x, n: 1, first: x.at, lastAt: x.at });
  else { b.n++; if (x.at < b.first) b.first = x.at; if (x.at > b.lastAt) b.lastAt = x.at; if (x.score > b.score) Object.assign(b, { score: x.score, note: x.note, i: x.i, at: x.at, from: x.from, to: x.to }); }
}
console.log(`${side.id}: ${from}..${to} ms at ${fps} steps a second: ${list.length} attributes change, ${followed} numbers followed`);
for (const kind of ["STEPS", "JUMP", "KINK", "SHAPE"]) {
  if (f.only && f.only !== kind) continue;
  const rows = [...best.values()].filter((x) => x.kind === kind).sort((a, b) => b.score - a.score);
  console.log(`\n${kind}: ${rows.length}`);
  for (const r of rows.slice(0, top)) {
    const span = r.first === r.lastAt || r.first == null ? (r.at != null ? `at ${r.at.toFixed(0)} ms` : "") : `${r.n} times, ${r.first.toFixed(0)}..${r.lastAt.toFixed(0)} ms`;
    console.log(`  ${short(r.s.where)}  [${r.s.attr}${r.s.n > 1 ? " #" + r.i : ""}]\n      ${r.note}${r.from != null ? `: ${r.from} -> ${r.to}` : ""}  ${span}`);
  }
  if (rows.length > top) console.log(`  … and ${rows.length - top} more`);
}
