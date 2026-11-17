// (Written by a reviewer of round 11.) the REAL player (hero-glue.js) through scene 03's entrance -> hold, on a stepped screen.
// Reads the road's lane line (stroke-dashoffset = scroll % 180) after every frame and prints the road's speed.
import fs from "node:fs";
import { execSync } from "node:child_process";
// the player and the scene file as they were before round 11 (commit 37d9144)
const before = (f) => execSync("git show 37d9144:round2/js/" + f, { encoding: "utf8", maxBuffer: 1 << 27 });
import { launch, BASE } from "../../../tools/pw.mjs";
const HEAD_GLUE = before("hero-glue.js"), HEAD_PORT = before("hero-port-b.js");
const browser = await launch();
for (const which of ["NOW", "HEAD"]) for (const iv of [16.4, 16.9, 1000 / 60]) {
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
  for (let i = 0; i < 1500; i++) {
    await page.evaluate((iv) => window.__step(iv, 1), iv);
    if (await page.evaluate(() => !!(window.JourneyPort && document.querySelectorAll("#sjxStage svg").length))) break;
    await page.waitForTimeout(20);
  }
  const series = await page.evaluate(async (iv) => {
    const out = [], n = Math.round(17800 / iv);
    for (let i = 0; i < n; i++) {
      window.__step(iv, 1);
      const el = document.querySelector('#sjxStage line[stroke-dasharray="72 108"]');
      out.push(el ? +el.getAttribute("stroke-dashoffset") : NaN);
      if (i % 30 === 0) await new Promise((r) => setTimeout(r, 0));
    }
    return out;
  }, iv);
  const v = series.map((x, i) => i ? (((x - series[i - 1]) % 180 + 180) % 180) / iv * 1000 : 0);
  // the handover: the last frame of a run at the entrance's speed (over 318 px/s for 12 frames)
  let k = -1;
  for (let i = 20; i < v.length - 12; i++) { let ok = true; for (let j = i - 12; j < i; j++) if (!(v[j] > 318 && v[j] < 345)) ok = false; if (ok) k = i; }
  let first = -1;
  for (let i = 20; i < v.length; i++) { let ok = true; for (let j = i - 12; j < i; j++) if (!(v[j] > 318 && v[j] < 345)) ok = false; if (ok && !(v[i] > 318 && v[i] < 345)) { first = i; break; } }
  console.log(`${which}  frame time ${iv.toFixed(2)} ms: road speed px/s, frame by frame, round the entrance -> hold handover (frame ${first})`);
  console.log("   " + v.slice(first - 5, first + 9).map((x, i) => (i === 5 ? "[" : "") + x.toFixed(0) + (i === 5 ? "]" : "")).join(" "));
  await page.close();
}
await browser.close();
