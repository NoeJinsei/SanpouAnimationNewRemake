// Smoothness of one side: steps the site clock at 60 steps a second, screenshots every step and measures how
// much the picture changes from each step to the next (mean absolute pixel difference, 0..255 scale).
//   node tools/motion-check.mjs <side> [--from=0 --to=7000] [--crop=x,y,w,h] [--json] [--scale=0.5] [--pop=3] [--floor=0.02]
// --crop is in stage pixels (1920x1080). The stage is drawn at --scale of its size (default 0.5 = 960x540) and
// every second pixel of every second row is compared, which keeps a 7 s run at about a minute.
// Reports: steps; frozen steps (no change at all) and the longest frozen run; median and largest change;
// "pops" = steps whose change is more than --pop times both neighbours and above both 2x the median and --floor.
// Note: very slow sub-pixel motion (a 0.7 px bob) is drawn by the GPU rasteriser in small quantised steps, so a
// nearly still crop shows tiny "pops" of about 0.1-0.25 even on the original; judge pops by their size too.
// The reference film has no repeated frames except deliberate holds, and no pops.
import { launch, BASE, PNG } from "./pw.mjs";

const args = process.argv.slice(2), flags = {};
const pos = args.filter((x) => { const m = /^--(\w+)(?:=(.*))?$/.exec(x); if (m) flags[m[1]] = m[2] == null ? true : m[2]; return !m; });
const side = pos[0] || "original";
const from = +(flags.from ?? 0), to = +(flags.to ?? 7000), scale = +(flags.scale || 0.5), popK = +(flags.pop || 3), floor = +(flags.floor ?? 0.02);
const W = Math.round(1920 * scale), H = Math.round(1080 * scale);
let crop = { x: 0, y: 0, width: W, height: H };
if (flags.crop) { const [x, y, w, h] = String(flags.crop).split(",").map(Number); crop = { x: Math.round(x * scale), y: Math.round(y * scale), width: Math.round(w * scale), height: Math.round(h * scale) }; }

const browser = await launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
await page.goto(`${BASE}/viewer/frame.html?side=${encodeURIComponent(side)}&framing=stage`);
await page.waitForFunction(() => window.heroFrame && (window.heroFrame.seek || window.heroFrame.error), null, { timeout: 30000 });
if (await page.evaluate(() => !!window.heroFrame.error)) { console.log("side did not start:", await page.evaluate(() => window.heroFrame.error)); await browser.close(); process.exit(1); }
await page.evaluate(() => document.fonts.ready);

const step = 1000 / 60, times = [];
for (let i = 0; from + i * step <= to + 1e-6; i++) times.push(from + i * step);

async function grab(ms) {
  await page.evaluate((t) => window.heroFrame.seek(t), ms);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const buf = await page.screenshot({ clip: crop, type: "png" });
  return PNG.sync.read(buf);
}
function diff(a, b) {
  const d1 = a.data, d2 = b.data, w = a.width, h = a.height;
  let s = 0, n = 0;
  for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) {
    const i = (y * w + x) * 4;
    s += Math.abs(d1[i] - d2[i]) + Math.abs(d1[i + 1] - d2[i + 1]) + Math.abs(d1[i + 2] - d2[i + 2]); n += 3;
  }
  return s / n;
}

let prev = await grab(times[0]);
const changes = []; // changes[i] = change from times[i] to times[i+1]
for (let i = 1; i < times.length; i++) { const cur = await grab(times[i]); changes.push(diff(prev, cur)); prev = cur; }
await browser.close();

const fmt = (ms) => Math.round(ms);
const sorted = [...changes].sort((a, b) => a - b), median = sorted[Math.floor(sorted.length / 2)] || 0;
let frozen = 0, run = 0, longest = 0, longestAt = null, runStart = 0;
changes.forEach((c, i) => {
  if (c === 0) { if (!run) runStart = i; run++; frozen++; if (run > longest) { longest = run; longestAt = [times[runStart], times[i + 1]]; } }
  else run = 0;
});
let maxI = 0; changes.forEach((c, i) => { if (c > changes[maxI]) maxI = i; });
const pops = [];
for (let i = 0; i < changes.length; i++) {
  const c = changes[i], l = i > 0 ? changes[i - 1] : null, r = i < changes.length - 1 ? changes[i + 1] : null;
  const nb = Math.max(l ?? 0, r ?? 0);
  if (c > popK * nb && c > Math.max(2 * median, floor)) pops.push({ at: fmt(times[i + 1]), change: +c.toFixed(4), neighbours: [l == null ? null : +l.toFixed(4), r == null ? null : +r.toFixed(4)] });
}
const result = {
  side, from, to, crop: flags.crop || "full", steps: changes.length,
  frozenSteps: frozen, longestFrozenRun: longest, longestFrozenAt: longestAt && longestAt.map(fmt),
  medianChange: +median.toFixed(4), largestChange: +changes[maxI].toFixed(4), largestAt: fmt(times[maxI + 1]),
  pops, consoleErrors: [...new Set(errors)],
};
if (flags.json) console.log(JSON.stringify(result, null, 1));
else {
  console.log(`${side} ${from}..${to} ms, crop ${result.crop}: ${result.steps} steps at 60/s`);
  console.log(`frozen steps: ${frozen}, longest frozen run: ${longest} steps${longestAt ? ` (${longestAt.map(fmt).join("..")} ms)` : ""}`);
  console.log(`change per step: median ${result.medianChange}, largest ${result.largestChange} at ${result.largestAt} ms`);
  console.log(`pops (> ${popK}x both neighbours): ${pops.length}` + (pops.length ? "\n  " + pops.map((p) => `${p.at} ms: ${p.change} (neighbours ${p.neighbours.join(", ")})`).join("\n  ") : ""));
  if (errors.length) console.log("console errors:\n  " + result.consoleErrors.join("\n  "));
}
process.exit(errors.length ? 1 : 0);
