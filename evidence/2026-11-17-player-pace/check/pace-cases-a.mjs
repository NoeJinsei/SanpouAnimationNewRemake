// (Written by a reviewer of round 11.) Built on evidence/2026-11-17-finale-loop/check/pace-check.mjs: the real player (hero-glue.js)
// on a simulated screen, but with a screen that behaves like one:
//   - a drawing that takes `cost` ms of the main thread makes the page miss the screen frames that fall inside
//     it (the next animation frame comes at the first screen frame after the drawing is finished);
//   - the screen's rate can change in the middle (an adaptive 60/90 phone);
//   - frame times can be rounded to a millisecond with a random lean (a browser that coarsens its clocks).
//   node evidence/2026-11-17-player-pace/check/pace-cases-a.mjs
import fs from "node:fs";
import { execSync } from "node:child_process";
// the player and the scene file as they were before round 11 (commit 37d9144)
const before = (f) => execSync("git show 37d9144:round2/js/" + f, { encoding: "utf8", maxBuffer: 1 << 27 });
import { launch, BASE } from "../../../tools/pw.mjs";

const HEAD_GLUE = before("hero-glue.js");
// a case: plan = [[Hz, seconds], ...], cost = main-thread ms a drawing takes, round = coarse clock
const CASES = [
  { name: "144 Hz, a drawing takes 10 ms (more than one screen frame, less than two)", plan: [[144, 8]], cost: 10 },
  { name: "165 Hz, a drawing takes 9 ms", plan: [[165, 8]], cost: 9 },
  { name: "144 Hz, a drawing takes 3 ms (a fast machine)", plan: [[144, 6]], cost: 3 },
  { name: "90 Hz, a drawing takes 12 ms (a phone that cannot fill its screen)", plan: [[90, 10]], cost: 12 },
  { name: "90 Hz -> 60 Hz -> 90 Hz, a drawing takes 4 ms (adaptive screen)", plan: [[90, 4], [60, 3], [90, 4]], cost: 4 },
  { name: "120 Hz, frame times rounded to 1 ms with a random lean, a drawing takes 3 ms", plan: [[120, 8]], cost: 3, round: true },
];
const browser = await launch();
for (const glue of ["NOW", "HEAD"]) {
  console.log(`\n===== ${glue} player`);
  for (const C of CASES) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    if (glue === "HEAD") await page.route("**/round2/js/hero-glue.js*", (r) => r.fulfill({ body: HEAD_GLUE, contentType: "application/javascript; charset=utf-8" }));
    await page.addInitScript(() => {
      window.__q = []; window.__now = 0; window.__draws = []; window.__vs = 0; window.__busy = 0; window.__drew = false; window.__cost = 0; window.__round = false;
      performance.now = () => window.__now;
      window.requestAnimationFrame = (cb) => { window.__q.push(cb); return window.__q.length; };
      window.cancelAnimationFrame = () => { window.__q = []; };
      let seed = 11; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      window.__step = (iv, n) => {
        for (let i = 0; i < n; i++) {
          window.__vs += iv; const v = window.__vs;
          if (v < window.__busy - 1e-6) continue;                       // the main thread is still drawing: this screen frame is missed
          const ts = window.__round ? Math.floor(v) + (rnd() < v - Math.floor(v) ? 1 : 0) : v;   // rounded down or up, more often to the nearer side
          window.__now = Math.max(window.__now, v); window.__at = ts; window.__drew = false;
          const q = window.__q; window.__q = []; for (const cb of q) cb(ts);
          if (window.__drew) { window.__busy = v + window.__cost; window.__now = v + window.__cost; }
        }
      };
    });
    await page.goto(`${BASE}/viewer/frame.html?side=round2&framing=site&player=glue`);
    for (let i = 0; i < 1500; i++) {
      await page.evaluate((iv) => window.__step(iv, 2), 1000 / C.plan[0][0]);
      if (await page.evaluate(() => !!(window.JourneyPort && document.querySelectorAll("#sjxStage svg").length))) break;
      await page.waitForTimeout(20);
    }
    await page.evaluate(() => { const JP = window.JourneyPort, m = JP.mount; JP.mount = function () { if (!window.__drew) { window.__drew = true; window.__draws.push(window.__vs); } return m.apply(this, arguments); }; });
    const rows = await page.evaluate(async ([plan, cost, round]) => {
      window.__cost = cost; window.__round = round; const out = [];
      for (const [hz, secs] of plan) {
        const iv = 1000 / hz, n = Math.round(secs * 1000 / iv), t0 = window.__vs;
        for (let i = 0; i < n; i++) { window.__step(iv, 1); if (i % 40 === 0) await new Promise((r) => setTimeout(r, 0)); }
        // the stretch in windows of one second: drawings a second and the gaps between them
        for (let w = 0; w < secs; w++) {
          const d = window.__draws.filter((t) => t > t0 + w * 1000 && t <= t0 + (w + 1) * 1000), g = d.slice(1).map((v, i) => v - d[i]);
          const kinds = {}; g.forEach((x) => { const k = x.toFixed(1); kinds[k] = (kinds[k] || 0) + 1; });
          out.push({ hz, w, n: d.length, kinds });
        }
      }
      return out;
    }, [C.plan, C.cost, !!C.round]);
    console.log(`  ${C.name}`);
    let line = "";
    for (const r of rows) line += `    ${r.hz} Hz s${r.w}: ${String(r.n).padStart(3)} drawn, gaps ${Object.entries(r.kinds).map(([k, n]) => k + "ms x" + n).join(", ")}\n`;
    // fold identical consecutive seconds
    const ls = line.trimEnd().split("\n"), folded = []; let run = 0;
    for (let i = 0; i < ls.length; i++) { const key = ls[i].replace(/s\d+:/, ""); const prev = i ? ls[i - 1].replace(/s\d+:/, "") : null; if (key === prev) { run++; continue; } if (run) folded.push(`      (… ${run} more seconds the same)`); run = 0; folded.push(ls[i]); }
    if (run) folded.push(`      (… ${run} more seconds the same)`);
    console.log(folded.join("\n"));
    await page.close();
  }
}
await browser.close();
