// a 60 Hz screen where every drawing takes 20 ms (misses a frame): the player should settle on an even 30 a second
import { execSync } from "node:child_process";
import { launch, BASE } from "../../../tools/pw.mjs";
// the player as it was before round 11 (commit 37d9144)
const HEAD_GLUE = execSync("git show 37d9144:round2/js/hero-glue.js", { encoding: "utf8", maxBuffer: 1 << 27 });
const browser = await launch();
for (const which of ["NOW ", "HEAD"]) {
  const side = "round2";
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  if (which === "HEAD") await page.route("**/round2/js/hero-glue.js*", (r) => r.fulfill({ body: HEAD_GLUE, contentType: "application/javascript; charset=utf-8" }));
  await page.addInitScript(() => {
    window.__q = []; window.__now = 0; window.__at = 0; window.__draws = []; window.__cost = 0;
    performance.now = () => window.__now;
    window.requestAnimationFrame = (cb) => { window.__q.push(cb); return window.__q.length; };
    window.cancelAnimationFrame = () => { window.__q = []; };
    // a frame comes on the screen's beat; a drawing that runs past a beat makes the page miss it
    window.__step = (iv, n) => { for (let i = 0; i < n; i++) { window.__at += iv; while (window.__at < window.__now - 0.01) window.__at += iv; window.__now = Math.max(window.__now, window.__at); const q = window.__q; window.__q = []; for (const cb of q) cb(window.__at); } };
  });
  await page.goto(`${BASE}/viewer/frame.html?side=${side}&framing=site&player=glue`);
  for (let i = 0; i < 1500; i++) { await page.evaluate(() => window.__step(1000 / 60, 2)); if (await page.evaluate(() => !!(window.JourneyPort && document.querySelectorAll("#sjxStage svg").length))) break; await page.waitForTimeout(20); }
  await page.evaluate(() => { const JP = window.JourneyPort, m = JP.mount; JP.mount = function () { const d = window.__draws; if (d[d.length - 1] !== window.__at) { d.push(window.__at); window.__now += window.__cost; } return m.apply(this, arguments); }; });
  for (const cost of [20, 12]) {
    const r = await page.evaluate(async (cost) => { window.__cost = cost; const out = []; for (let s = 0; s < 6; s++) { window.__draws.length = 0; const t0 = window.__at; while (window.__at < t0 + 1000) { window.__step(1000 / 60, 1); } const d = window.__draws, g = {}; d.slice(1).forEach((v, i) => { const k = (v - d[i]).toFixed(1); g[k] = (g[k] || 0) + 1; }); out.push(d.length + " drawn, gaps " + Object.entries(g).map(([k, n]) => k + "ms x" + n).join(", ")); await new Promise((r) => setTimeout(r, 0)); } return out; }, cost);
    console.log(`${which} 60 Hz, a drawing takes ${cost} ms:`); r.forEach((l, i) => console.log(`   s${i}: ${l}`));
  }
  await page.close();
}
await browser.close();
