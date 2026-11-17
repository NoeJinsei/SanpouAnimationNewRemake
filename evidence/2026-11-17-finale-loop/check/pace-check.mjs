// How often does the site's real player draw, on screens of different refresh rates, and does it stall on input?
// A test browser only has a 60 Hz screen, so the screen is simulated: the page's animation-frame clock is
// replaced by one this script steps, at 60, 72, 75, 90, 100, 120, 144, 165 and 240 steps a second, and every
// drawing of the stage is counted. The player (hero-glue.js) cannot tell the difference: it is given frame
// times exactly as a screen of that rate would give them.
//   node evidence/2026-11-17-finale-loop/check/pace-check.mjs <side> [--rates=60,90,120] [--seconds=5] [--input] [--cost=6] [--late=0.4]
// --cost: every drawing takes this many ms (a slow device: the player should then give way to input as it always did).
// --late: this share of the screen's frames comes in a frame late (a device that cannot fill its screen: the
//         player should then fall back to drawing on every second frame, which is steady).
// Prints, per rate: drawings a second, the shortest and longest gap between two drawings, and with --input the
// longest gap after a wheel turn, a key and a tap (the player's "input first" pause, if it has one).
import { launch, BASE } from "../../../tools/pw.mjs";
import { flags } from "./scene-lab.mjs";

const { f, pos } = flags(process.argv.slice(2));
const side = pos[0] || "round2", secs = +(f.seconds || 5);
const rates = String(f.rates || "60,72,75,90,100,119,120,144,165,240").split(",").map(Number);
const browser = await launch();
const rows = [];
for (const R of rates) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript(() => {
    // the screen's clock: animation frames come only when stepped, and performance.now() is the stepped time
    window.__q = []; window.__now = 0; window.__draws = [];
    performance.now = () => window.__now;
    window.requestAnimationFrame = (cb) => { window.__q.push(cb); return window.__q.length; };
    window.cancelAnimationFrame = () => { window.__q = []; };
    // a frame comes at its own time on the screen's beat (__at), however long the drawing before it took
    window.__at = 0; window.__late = 0; let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    window.__step = (iv, n) => { for (let i = 0; i < n; i++) { window.__at += iv * (rnd() < window.__late ? 2 : 1); window.__now = Math.max(window.__now, window.__at); const q = window.__q; window.__q = []; for (const cb of q) cb(window.__at); } };
  });
  await page.goto(`${BASE}/viewer/frame.html?side=${encodeURIComponent(side)}&framing=site&player=glue`);
  // bring the page up: step the clock until the player has drawn
  for (let i = 0; i < 1500; i++) {
    await page.evaluate((iv) => window.__step(iv, 2), 1000 / R);
    if (await page.evaluate(() => !!(window.JourneyPort && document.querySelectorAll("#sjxStage svg").length))) break;
    await page.waitForTimeout(20);
  }
  await page.evaluate((cost) => { const JP = window.JourneyPort, m = JP.mount; JP.mount = function () { const d = window.__draws; if (d[d.length - 1] !== window.__at) { d.push(window.__at); window.__now += cost; } return m.apply(this, arguments); }; }, +(f.cost || 0));
  const r = await page.evaluate(async ([iv, secs, input, late]) => {
    window.__late = late;
    const n = Math.round(secs * 1000 / iv), out = {};
    window.__draws.length = 0;
    for (let i = 0; i < n; i++) { window.__step(iv, 1); if (i % 40 === 0) await new Promise((r) => setTimeout(r, 0)); }
    const d = window.__draws.slice(), gaps = d.slice(1).map((v, i) => v - d[i]);
    out.fps = (d.length - 1) / ((d[d.length - 1] - d[0]) / 1000); out.min = Math.min(...gaps); out.max = Math.max(...gaps);
    if (input) {
      out.input = {};
      for (const [name, fire] of [["wheel", () => document.dispatchEvent(new WheelEvent("wheel", { bubbles: true }))], ["key", () => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Shift", bubbles: true }))], ["tap", () => document.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }))], ["scroll", () => window.dispatchEvent(new Event("scroll"))]]) {
        window.__step(iv, Math.round(400 / iv));
        const last = window.__draws[window.__draws.length - 1];   // the last drawing before the input
        window.__draws.length = 0; fire();
        window.__step(iv, Math.round(500 / iv));
        const e = [last, ...window.__draws], g = e.slice(1).map((v, i) => v - e[i]);
        out.input[name] = g.length ? Math.max(...g) : 500;
      }
    }
    return out;
  }, [1000 / R, secs, !!f.input, +(f.late || 0)]);
  rows.push({ R, ...r });
  await page.close();
}
await browser.close();
console.log(`${side}: the site's real player on screens of different refresh rates (${secs} s of scene 01 each)${f.cost ? `, every drawing taking ${f.cost} ms` : ""}${f.late ? `, ${100 * f.late} % of frames a frame late` : ""}`);
console.log("  screen     drawn      gaps between drawings" + (f.input ? "      longest gap after a wheel turn / key / tap / scroll" : ""));
for (const r of rows) {
  const inp = r.input ? `      ${["wheel", "key", "tap", "scroll"].map((k) => r.input[k].toFixed(0) + " ms").join(" / ")}` : "";
  console.log(`  ${String(r.R).padStart(3)} Hz   ${r.fps.toFixed(1).padStart(5)} a second   ${r.min.toFixed(1)}..${r.max.toFixed(1)} ms${inp}${r.fps < 59 ? "   BELOW 60" : ""}`);
}
process.exit(!f.cost && !f.late && rows.some((r) => r.fps < 59) ? 1 : 0);
