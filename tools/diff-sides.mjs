// Compares two sides of the viewer at the same moments and saves the pictures.
//   node tools/diff-sides.mjs <a> <b> [outDir] [--framing=full|desktop|phone] [--times=0,6000,...] [--threshold=0.1]
// Prints, per moment, how many pixels differ (pixelmatch, anti-aliasing ignored) and writes
// <out>/t<ms>-<a>.png, t<ms>-<b>.png and t<ms>-diff.png. Exit code 1 if a side fails to start or logs an error.
import fs from "node:fs";
import path from "node:path";
import { launch, PNG, pixelmatch, BASE } from "./pw.mjs";

const args = process.argv.slice(2), flags = {};
const pos = args.filter((x) => { const m = /^--(\w+)=(.*)$/.exec(x); if (m) flags[m[1]] = m[2]; return !m; });
const a = pos[0] || "original", b = pos[1] || "remake", out = pos[2] || `shots/diff-${a}-${b}`.replace(/[^\w/.-]+/g, "_");
const framing = flags.framing || "full", threshold = +(flags.threshold || 0.1);
const TIMES = flags.times ? flags.times.split(",").map(Number)
  : [0, 1500, 3200, 6000, 7000, 9000, 11000, 14000, 14600, 15500, 15750, 16200, 20000, 21800, 22200, 22600, 25000, 27800, 29500, 32000, 45000, 45800];
const VIEW = { full: [3900, 1400], desktop: [3000, 1100], phone: [1000, 1000] }[framing];
fs.mkdirSync(out, { recursive: true });

const browser = await launch();
const page = await browser.newPage({ viewport: { width: VIEW[0], height: VIEW[1] } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
page.on("response", (r) => { if (r.status() >= 400) errors.push(r.status() + " " + r.url()); });
await page.goto(`${BASE}/viewer.html#a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}&framing=${framing}&layout=split&t=0`);
try { await page.waitForFunction(() => window.viewer && window.viewer.ready(), null, { timeout: 30000 }); }
catch (e) { console.log("a side did not start:", errors.join(" | ")); await browser.close(); process.exit(1); }
await page.evaluate(() => document.fonts.ready);
const ha = await page.$("#scA"), hb = await page.$("#scB");
let worst = 0, sum = 0;
for (const t of TIMES) {
  await page.evaluate((ms) => window.viewer.seek(ms), t);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const ba = await ha.screenshot(), bb = await hb.screenshot();
  const pa = PNG.sync.read(ba), pb = PNG.sync.read(bb);
  const diff = new PNG({ width: pa.width, height: pa.height });
  const d = pixelmatch(pa.data, pb.data, diff.data, pa.width, pa.height, { threshold });
  const pct = d / (pa.width * pa.height) * 100;
  worst = Math.max(worst, pct); sum += pct;
  fs.writeFileSync(path.join(out, `t${t}-a.png`), ba);
  fs.writeFileSync(path.join(out, `t${t}-b.png`), bb);
  fs.writeFileSync(path.join(out, `t${t}-diff.png`), PNG.sync.write(diff));
  console.log(`t=${String(t).padStart(5)}  ${String(d).padStart(8)} px differ  (${pct.toFixed(3)} %)`);
}
const costs = await page.evaluate(() => window.viewer.costs());
console.log(`\n${a} vs ${b}, ${framing}: mean ${(sum / TIMES.length).toFixed(3)} %, worst ${worst.toFixed(3)} % of pixels differ (threshold ${threshold}); draw ${costs.a.toFixed(2)} / ${costs.b.toFixed(2)} ms; pictures in ${out}`);
await browser.close();
if (errors.length) { console.log("console / network errors:\n  " + [...new Set(errors)].join("\n  ")); process.exit(1); }
