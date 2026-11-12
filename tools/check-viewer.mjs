// Checks the viewer itself: both pictures start, no console errors, and two copies of the same renderer
// drawn for the same time are pixel-identical (the player is a pure function of the time).
//   node tools/check-viewer.mjs [a=original] [b=remake] [outDir]
import fs from "node:fs";
import path from "node:path";
import { launch, PNG, pixelmatch, BASE } from "./pw.mjs";

const a = process.argv[2] || "original", b = process.argv[3] || "remake";
const out = process.argv[4] || "shots/check-viewer";
fs.mkdirSync(out, { recursive: true });
// one moment in every entrance and every hold, plus the 03 entrance fade and the 03 -> 04 dissolve
const TIMES = [0, 1500, 3200, 6000, 7000, 9000, 11000, 14000, 14600, 15500, 15750, 16200, 20000, 21800, 22200, 22600, 25000, 27800, 29500, 32000, 45000, 45800];

// a scaled stage can round a pixel differently at two places on the screen; anything real is thousands of pixels
const TOLERANCE = 50;

const browser = await launch();
const errors = [];
let failed = 0;
const fail = (m) => { failed++; console.log("FAIL  " + m); };

async function open(framing, w, h) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  page.on("console", (m) => { if (m.type() === "error") errors.push(`[${framing}] ${m.text()}`); });
  page.on("pageerror", (e) => errors.push(`[${framing}] pageerror: ${e.message}`));
  page.on("requestfailed", (r) => errors.push(`[${framing}] request failed: ${r.url()}`));
  page.on("response", (r) => { if (r.status() >= 400) errors.push(`[${framing}] ${r.status()} ${r.url()}`); });
  await page.goto(`${BASE}/viewer.html#a=${a}&b=${b}&framing=${framing}&layout=split&t=0`);
  await page.waitForFunction(() => window.viewer && window.viewer.ready(), null, { timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  return page;
}

for (const [framing, w, h] of [["full", 3900, 1400], ["desktop", 3000, 1100], ["phone", 1000, 1000]]) {
  const page = await open(framing, w, h);
  const ha = await page.$("#scA"), hb = await page.$("#scB");   // the visible part of each picture
  let maxDiff = 0, worst = -1;
  for (const t of TIMES) {
    await page.evaluate((ms) => window.viewer.seek(ms), t);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const pa = PNG.sync.read(await ha.screenshot()), pb = PNG.sync.read(await hb.screenshot());
    if (pa.width !== pb.width || pa.height !== pb.height) { fail(`${framing} t=${t}: sizes differ ${pa.width}x${pa.height} vs ${pb.width}x${pb.height}`); continue; }
    const d = pixelmatch(pa.data, pb.data, null, pa.width, pa.height, { threshold: 0.02 });
    if (d > maxDiff) { maxDiff = d; worst = t; }
    if (framing === "full" && [3200, 6000, 11000, 15750, 20000, 22200, 25000, 32000].includes(t)) fs.writeFileSync(path.join(out, `full-t${t}-${a}.png`), PNG.sync.write(pa));
  }
  const info = await page.evaluate(() => ({ costs: window.viewer.costs(), size: [document.querySelector("#scA").style.width, document.querySelector("#scA").style.height] }));
  console.log(`${framing}: ${TIMES.length} moments, picture ${info.size.join(" x ")}, largest difference ${a} vs ${b}: ${maxDiff} px` + (maxDiff ? ` (at t=${worst})` : "") + `, draw ${info.costs.a.toFixed(2)} / ${info.costs.b.toFixed(2)} ms`);
  if (a === b || (a === "original" && b === "remake" && process.env.EXPECT_SAME)) { if (maxDiff > TOLERANCE) fail(`${framing}: same renderer, different pixels`); }
  await page.screenshot({ path: path.join(out, `viewer-${framing}.png`) });
  await page.close();
}

// the three ways to compare, and the keyboard
{
  const page = await open("full", 1600, 900);
  await page.evaluate(() => window.viewer.seek(6000));
  await page.click('#layout button[data-v="wipe"]');
  await page.mouse.move(700, 400); await page.mouse.down(); await page.mouse.move(980, 420); await page.mouse.up();
  await page.screenshot({ path: path.join(out, "viewer-wipe.png") });
  await page.click('#layout button[data-v="swap"]');
  await page.keyboard.press("x");
  await page.screenshot({ path: path.join(out, "viewer-swap.png") });
  await page.click('#layout button[data-v="split"]');
  await page.keyboard.press("3");
  let t = await page.evaluate(() => window.viewer.state.t);
  if (t !== 14600) fail("key 3 should jump to scene 03 (14600), got " + t);
  await page.keyboard.press("ArrowRight");
  t = await page.evaluate(() => window.viewer.state.t);
  if (Math.abs(t - 14600 - 1000 / 60) > 0.01) fail("right arrow should step one frame, got " + t);
  // play for a second and see the clock move
  await page.click("#play"); await page.waitForTimeout(1000); await page.click("#play");
  const t2 = await page.evaluate(() => window.viewer.state.t);
  if (!(t2 > t + 600 && t2 < t + 1400)) fail("one second of play moved the clock by " + (t2 - t).toFixed(0) + " ms");
  // rapid scene jumps
  for (let i = 0; i < 40; i++) await page.keyboard.press(String(1 + (i * 3) % 5));
  await page.close();
}

// the site's real player (hero-glue.js) still runs each side: plays, answers a scene click, and holds still with reduced motion
for (const side of [...new Set([a, b])]) {
  for (const reduced of [false, true]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: reduced ? "reduce" : "no-preference" });
    const page = await ctx.newPage();
    page.on("console", (m) => { if (m.type() === "error") errors.push(`[glue ${side}] ${m.text()}`); });
    page.on("pageerror", (e) => errors.push(`[glue ${side}] pageerror: ${e.message}`));
    await page.goto(`${BASE}/viewer/frame.html?side=${side}&framing=site&player=glue`);
    await page.waitForFunction(() => window.heroFrame && window.heroFrame.live, null, { timeout: 30000 });
    await page.waitForTimeout(1200);
    const n0 = await page.evaluate(() => document.querySelectorAll("#sjxStage *").length);
    if (n0 < 300) fail(`glue ${side}${reduced ? " (reduced motion)" : ""}: stage has only ${n0} nodes`);
    if (reduced) {
      const one = await page.screenshot(); await page.waitForTimeout(600); const two = await page.screenshot();
      const p1 = PNG.sync.read(one), p2 = PNG.sync.read(two);
      if (pixelmatch(p1.data, p2.data, null, p1.width, p1.height, { threshold: 0.02 }) > TOLERANCE) fail(`glue ${side}: the picture moves with reduced motion on`);
    } else {
      for (let i = 0; i < 12; i++) await page.click(`#sjxIndex li:nth-child(${1 + (i * 2) % 5}) button`, { delay: 5 });
      await page.waitForTimeout(1300);
      const cur = await page.evaluate(() => [...document.querySelectorAll("#sjxIndex button")].findIndex((x) => x.getAttribute("aria-current") === "true"));
      if (cur !== 2) fail(`glue ${side}: after rapid clicks the current scene is ${cur + 1}, expected 3`);
      await page.screenshot({ path: path.join(out, `glue-${side.replace(/\W+/g, "_")}.png`) });
    }
    await ctx.close();
  }
}

await browser.close();
if (errors.length) { failed += errors.length; console.log("console / network errors:\n  " + [...new Set(errors)].join("\n  ")); }
console.log(failed ? `\n${failed} problem(s)` : "\nviewer OK: 0 console errors");
process.exit(failed ? 1 : 0);
