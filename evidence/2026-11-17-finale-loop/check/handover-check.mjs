// Does anything change speed in one frame when a scene's entrance hands over to its hold?
// The player plays every entrance 1.2 times as fast as a hold (ENTER_RATE), so a scene whose clock is simply
// the frame runs a fifth faster while it enters and drops to its own speed in the one frame the hold begins.
// This measures every moving number's speed just before and just after that frame, in every scene, and lists
// the largest changes (px a second for places, degrees a second for turns).
//   node evidence/2026-11-17-finale-loop/check/handover-check.mjs <side> [--top=6] [--see=6] [--limit=25] [--base=<folder with the scene files>]
// --see: a change of speed smaller than this many px/s (or deg/s) is not listed. Exit code 1 if a place
// changes speed by more than --limit px/s at any handover. (Scenes 01 and 02 keep two small ones, listed and
// left: the Tower's lift, a few px across, by 18 px/s, and a corner of a glass reflection that starts its own
// sweep at that moment, 21 px/s. The limit stands above them and below anything that was a lurch.)
import { load, channels, short, flags } from "./scene-lab.mjs";

const { f, pos } = flags(process.argv.slice(2));
const side = load(pos[0] || "round2", f.base ? { base: f.base } : {}), TL = side.TL, top = +(f.top || 6), see = +(f.see || 6), limit = +(f.limit || 25), D = 1000 / 60;
let worstAll = 0;
for (let i = 0; i < TL.STOPS.length; i++) {
  // the same measure at three moments: a fifth of a second before the handover, at it, and a fifth of a second
  // after. A number that changes speed as much at the other two moments is doing so by itself (a body bouncing
  // on its springs, a thing easing to a stop) and is not listed.
  const t = TL.START[i] + TL.enterMs(i), OFF = [-3, -2, -1, 1, 2, 3], C = [-12, 0, 12];
  const times = C.flatMap((c) => OFF.map((o) => t + (c + o) * D));
  const rows = [];
  for (const s of channels(side, times)) {
    if (s.shape || s.n > 60) continue;
    // a thing moved by translate(x, y) is followed along its path (its speed, not the speed of x and of y: a truck
    // going into a bend keeps its speed while both of those change)
    const along = s.attr === "transform" && s.kinds[0] === "pos" && s.kinds[1] === "pos";
    for (let k = along ? 1 : 0; k < s.n; k++) {
      const kind = s.kinds[k]; if (kind !== "pos" && kind !== "rot") continue;
      const v = s.v[k], vx = s.v[0]; if ([...v].some(isNaN) || [...s.hidden].some(Boolean)) continue;
      const wrap = (d) => (kind === "rot" ? ((d + 540) % 360) - 180 : d);
      const step = (a, b) => (along && k === 1 ? Math.hypot(v[b] - v[a], vx[b] - vx[a]) : wrap(v[b] - v[a]));
      const at = (j) => { const o = j * 6; return { before: (step(o, o + 1) + step(o + 1, o + 2)) / 2 * 60, after: (step(o + 3, o + 4) + step(o + 4, o + 5)) / 2 * 60 }; };
      const m = at(1), change = m.after - m.before, usual = Math.max(Math.abs(at(0).after - at(0).before), Math.abs(at(2).after - at(2).before));
      if (Math.abs(change) < see || Math.abs(change) < 3 * usual) continue;
      rows.push({ where: short(s.where), attr: s.attr + (along && k === 1 ? ", along its path" : s.n > 1 ? " #" + k : ""), kind, before: m.before, after: m.after, change });
    }
  }
  rows.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
  const places = rows.filter((r) => r.kind === "pos"), worst = places.length ? Math.abs(places[0].change) : 0;
  worstAll = Math.max(worstAll, worst);
  console.log(`scene ${TL.STOPS[i].no}: the hold begins at ${t.toFixed(0)} ms: ${rows.length} numbers change speed by ${see} a second or more in that frame${places.length ? `; the largest: ${worst.toFixed(0)} px/s` : ""}`);
  for (const r of rows.slice(0, top)) console.log(`    ${r.before.toFixed(1).padStart(8)} -> ${r.after.toFixed(1).padStart(8)} ${r.kind === "pos" ? "px/s " : "deg/s"}  (${(100 * (r.after / r.before - 1)).toFixed(0)} %)  ${r.where} [${r.attr}]`);
}
console.log(worstAll > limit ? `
SPEED STEPS: something changes speed by ${worstAll.toFixed(0)} px/s in one frame` : `
no place changes speed by more than ${limit} px/s at any handover (the largest: ${worstAll.toFixed(0)} px/s)`);
process.exit(worstAll > limit ? 1 : 0);
