// Smoothness of several sides, one run after another (never in parallel: they would steal each other's CPU),
// as one table. Each cell is the median of <runs> runs of tools/perf-side.mjs.
//   node tools/perf-table.mjs original,original-canvas [--framing=phone] [--throttle=4] [--runs=3] [--scenes=01,02,03,04,05] [--out=file.json]
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const args = process.argv.slice(2), flags = {};
const pos = args.filter((x) => { const m = /^--(\w+)(?:=(.*))?$/.exec(x); if (m) flags[m[1]] = m[2] == null ? true : m[2]; return !m; });
const sides = (pos[0] || "original").split(","), framing = flags.framing || "phone", throttle = flags.throttle || "4", runs = +(flags.runs || 3);
const RANGES = { "01": [0, 7000], "02": [7000, 14600], "03": [14600, 21800], "04": [21800, 27800], "05": [27800, 38000] };
const scenes = (flags.scenes || "01,02,03,04,05").split(",");
const med = (v) => [...v].sort((a, b) => a - b)[Math.floor(v.length / 2)];

const rows = [];
for (const sc of scenes) for (const side of sides) {
  const rs = [];
  for (let i = 0; i < runs; i++) {
    try {
      const out = execFileSync("node", ["tools/perf-side.mjs", side, `--framing=${framing}`, `--from=${RANGES[sc][0]}`, `--to=${RANGES[sc][1]}`, `--throttle=${throttle}`, "--json"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
      rs.push(JSON.parse(out.trim().split("\n").pop()));
    } catch (e) { rs.push(null); }
  }
  const ok = rs.filter(Boolean);
  if (!ok.length) { rows.push({ scene: sc, side, failed: true }); console.log(`${sc}  ${side.padEnd(22)} FAILED`); continue; }
  const row = { scene: sc, side, median: med(ok.map((r) => r.frameMs.median)), p95: med(ok.map((r) => r.frameMs.p95)), worst: med(ok.map((r) => r.frameMs.worst)), over16: med(ok.map((r) => r.over16Pct)), over33: med(ok.map((r) => r.over33Pct)), draw: med(ok.map((r) => r.drawMs.mean)), drawP95: med(ok.map((r) => r.drawMs.p95)), errors: ok.some((r) => r.errors && r.errors.length) };
  rows.push(row);
  console.log(`${sc}  ${side.padEnd(22)} frame median ${String(row.median).padStart(5)} ms  p95 ${String(row.p95).padStart(5)}  worst ${String(row.worst).padStart(6)}  over 16.7 ms ${String(row.over16).padStart(5)} %  over 33 ms ${String(row.over33).padStart(4)} %  draw ${String(row.draw).padStart(5)} ms (p95 ${row.drawP95})${row.errors ? "  ERRORS" : ""}`);
}
console.log(`\n${framing} framing, CPU ${throttle}x slower, median of ${runs} runs`);
if (flags.out) fs.writeFileSync(flags.out, JSON.stringify({ framing, throttle: +throttle, runs, rows }, null, 1));
