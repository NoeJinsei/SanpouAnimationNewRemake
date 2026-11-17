// the REAL player: a click on to 04 in the last moments of 03's entrance; the road's speed frame by frame
import fs from "node:fs";
import { execSync } from "node:child_process";
// the player and the scene file as they were before round 11 (commit 37d9144)
const before = (f) => execSync("git show 37d9144:round2/js/" + f, { encoding: "utf8", maxBuffer: 1 << 27 });
import { launch, BASE } from "../../../tools/pw.mjs";
const HEAD_GLUE = before("hero-glue.js"), HEAD_PORT = before("hero-port-b.js");
const browser = await launch(), iv = 1000 / 60;
for (const which of ["NOW", "HEAD"]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  if (which === "HEAD") {
    await page.route("**/round2/js/hero-glue.js*", (r) => r.fulfill({ body: HEAD_GLUE, contentType: "application/javascript; charset=utf-8" }));
    await page.route("**/round2/js/hero-port-b.js*", (r) => r.fulfill({ body: HEAD_PORT, contentType: "application/javascript; charset=utf-8" }));
  }
  await page.addInitScript(() => {
    window.__q = []; window.__now = 0; window.__at = 0;
    performance.now = () => window.__now;
    window.requestAnimationFrame = (cb) => { window.__q.push(cb); return window.__q.length; };
    window.cancelAnimationFrame = () => { window.__q = []; };
    window.__step = (iv, n) => { for (let i = 0; i < n; i++) { window.__at += iv; window.__now = window.__at; const q = window.__q; window.__q = []; for (const cb of q) cb(window.__at); } };
  });
  await page.goto(`${BASE}/viewer/frame.html?side=round2&framing=site&player=glue`);
  for (let i = 0; i < 1500; i++) { await page.evaluate((iv) => window.__step(iv, 1), iv); if (await page.evaluate(() => !!(window.JourneyPort && document.querySelectorAll("#sjxStage svg").length))) break; await page.waitForTimeout(20); }
  const read = () => page.evaluate(() => { const el = document.querySelector('#sjxStage line[stroke-dasharray="72 108"]'); return el ? +el.getAttribute("stroke-dashoffset") : NaN; });
  const series = [];
  const stepRead = async (n) => { for (let i = 0; i < n; i++) { await page.evaluate((iv) => window.__step(iv, 1), iv); series.push(await read()); } };
  // to 0.1 s before 03's hold begins (16933 ms), in chunks
  let left = Math.round(16830 / iv); while (left > 0) { const n = Math.min(left, 240); await page.evaluate(([iv, k]) => window.__step(iv, k), [iv, n]); left -= n; await page.waitForTimeout(0); }
  await stepRead(6);
  const mark = series.length;
  await page.evaluate(() => document.querySelectorAll("#sjxIndex button")[3].click());
  await stepRead(1); await page.waitForTimeout(60);                 // the click's own task (a frame, then a timer)
  await stepRead(34);
  const v = series.map((x, i) => i ? (((x - series[i - 1]) % 180 + 180) % 180) / iv * 1000 : 0);
  console.log(`${which}: road speed (px/s) frame by frame; | = the click on 04 during 03's entrance`);
  console.log("   " + v.slice(1).map((x, i) => (i + 1 === mark ? "| " : "") + (isNaN(x) ? "-" : x.toFixed(0))).join(" "));
  await page.close();
}
await browser.close();
