// Is the viewer's clock player the same film as the site's real player?
// Runs the site's own player (hero-glue.js) in real time and, at moments inside each scene's hold, compares its
// picture with the clock player sought to the same time. Holds move slowly, so a few tens of ms of timer noise
// do not matter; a wrong stop, dwell, idle clock or camera would show as a large difference.
//   node tools/check-player-vs-glue.mjs [side=original] [--framing=phone|desktop]
import fs from "node:fs";
import { launch, PNG, pixelmatch, BASE } from "./pw.mjs";

const args = process.argv.slice(2), flags = {};
const pos = args.filter((x) => { const m = /^--(\w+)=(.*)$/.exec(x); if (m) flags[m[1]] = m[2]; return !m; });
const side = pos[0] || "original", framing = flags.framing || "phone";
const VIEW = framing === "phone" ? { width: 390, height: 844 } : { width: 1440, height: 900 };
// late in each hold: 01, 02, 03, 04, 05 (the stops begin at 0, 7000, 14600, 21800, 27800)
const TIMES = [6400, 13900, 21000, 27200, 33000];
const out = "shots/check-player-vs-glue"; fs.mkdirSync(out, { recursive: true });

const browser = await launch();
const live = await browser.newPage({ viewport: VIEW }), clock = await browser.newPage({ viewport: VIEW });
await clock.goto(`${BASE}/viewer/frame.html?side=${side}&framing=site`);
await clock.waitForFunction(() => window.heroFrame && window.heroFrame.seek);
await live.goto(`${BASE}/viewer/frame.html?side=${side}&framing=site&player=glue`);
// the live player's clock starts with its first drawn frame
await live.waitForFunction(() => document.querySelectorAll("#sjxStage svg").length > 0);
const t0 = Date.now();
let failed = 0;
for (const t of TIMES) {
  await live.waitForTimeout(Math.max(0, t - (Date.now() - t0)));
  const at = Date.now() - t0;
  const shotLive = await (await live.$("#sanpou-journey .hc-stagebox")).screenshot();
  const scene = await live.evaluate(() => document.getElementById("hcNo").textContent);
  await clock.evaluate((ms) => window.heroFrame.seek(ms), at);
  await clock.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const shotClock = await (await clock.$("#sanpou-journey .hc-stagebox")).screenshot();
  const sceneClock = await clock.evaluate(() => document.getElementById("hcNo").textContent);
  const a = PNG.sync.read(shotLive), b = PNG.sync.read(shotClock), diff = new PNG({ width: a.width, height: a.height });
  const d = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 }), pct = d / (a.width * a.height) * 100;
  fs.writeFileSync(`${out}/${framing}-t${t}-live.png`, shotLive); fs.writeFileSync(`${out}/${framing}-t${t}-clock.png`, shotClock); fs.writeFileSync(`${out}/${framing}-t${t}-diff.png`, PNG.sync.write(diff));
  // the expressway scrolls 270 px a second, so 20 ms of timer noise already moves every edge there
  const ok = scene === sceneClock && pct < 8;
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"} at ${at} ms: live scene ${scene}, clock scene ${sceneClock}, ${pct.toFixed(2)} % of pixels differ`);
}
await browser.close();
console.log(failed ? `\n${failed} moment(s) differ` : `\nclock player matches the site's player in every hold (${framing})`);
process.exit(failed ? 1 : 0);
