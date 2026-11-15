// How many elements the film keeps on the stage, per scene. Node count is the film's cost (not script time),
// so every pass says this number before and after.
//   node tools/node-count.mjs <side> [<side> ...] [--times=3500,10500,18000,24500,32000,40000]
// Prints one row per moment: the number of elements inside #sanpou-journey for each side.
import { launch, BASE } from "./pw.mjs";

const args = process.argv.slice(2), flags = {};
const sides = args.filter((x) => { const m = /^--(\w+)(?:=(.*))?$/.exec(x); if (m) flags[m[1]] = m[2] == null ? true : m[2]; return !m; });
if (!sides.length) sides.push("round2");
const MOMENTS = flags.times
  ? String(flags.times).split(",").map((t) => [t + " ms", +t])
  : [["01 at 3500", 3500], ["02 at 10500", 10500], ["03 at 18000", 18000], ["04 at 24500", 24500], ["05 at 32000", 32000], ["05 at 40000", 40000]];

const browser = await launch(), table = {};
for (const side of sides) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(`${BASE}/viewer/frame.html?side=${encodeURIComponent(side)}&framing=stage`);
  await page.waitForFunction(() => window.heroFrame && (window.heroFrame.seek || window.heroFrame.error), null, { timeout: 30000 });
  if (await page.evaluate(() => !!window.heroFrame.error)) { console.log(side, "did not start"); await page.close(); continue; }
  table[side] = [];
  for (const [, ms] of MOMENTS) {
    await page.evaluate((t) => window.heroFrame.seek(t), ms);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    table[side].push(await page.evaluate(() => document.querySelectorAll("#sanpou-journey *").length));
  }
  await page.close();
}
await browser.close();
const names = Object.keys(table);
console.log("moment".padEnd(14) + names.map((s) => s.padStart(15)).join(""));
MOMENTS.forEach(([label], i) => console.log(label.padEnd(14) + names.map((s) => String(table[s][i]).padStart(15)).join("")));
console.log("total".padEnd(14) + names.map((s) => String(table[s].reduce((a, b) => a + b, 0)).padStart(15)).join(""));
