// The site's real player, left on the finale for several loops, and then the five scene buttons.
// The player (hero-glue.js) is run on a clock this script steps (see pace-check.mjs), so several minutes of
// film take seconds. It checks that:
//   1. after N loops on the finale the player's picture is the picture it showed N loops earlier (photographed
//      at the same point of the loop), so nothing has drifted;
//   2. every scene button still works from there: the scene changes, the right family of drawings is on the
//      stage, the caption is the scene's own, and no error is logged;
//   3. going away and coming back lands on the finale's loop: the picture after a jump back is the picture
//      the finale has at its hold's first frame (frame 174), which the loop passes through every 52 s.
//   node evidence/2026-11-17-finale-loop/check/loop-buttons-check.mjs <side> [--loops=4] [--framing=desktop|phone]
import { launch, BASE, PNG, pixelmatch } from "../../../tools/pw.mjs";
import { flags } from "./scene-lab.mjs";

const { f, pos } = flags(process.argv.slice(2));
const side = pos[0] || "round2", loops = +(f.loops || 4), L = 52000, IV = 1000 / 60;
const VIEW = f.framing === "phone" ? { width: 390, height: 844 } : { width: 1440, height: 900 };
const browser = await launch(), page = await browser.newPage({ viewport: VIEW });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
await page.addInitScript(() => {
  window.__q = []; window.__now = 0;
  performance.now = () => window.__now;
  window.requestAnimationFrame = (cb) => { window.__q.push(cb); return window.__q.length; };
  window.cancelAnimationFrame = () => { window.__q = []; };
  window.__step = (iv, n) => { for (let i = 0; i < n; i++) { window.__now += iv; const q = window.__q; window.__q = []; for (const cb of q) cb(window.__now); } };
});
await page.goto(`${BASE}/viewer/frame.html?side=${encodeURIComponent(side)}&framing=site&player=glue`);
for (let i = 0; i < 200; i++) {
  await page.evaluate((iv) => window.__step(iv, 2), IV);
  if (await page.evaluate(() => !!(window.JourneyPort && document.querySelectorAll("#sjxStage svg").length))) break;
  await page.waitForTimeout(20);
}
const t0 = await page.evaluate(() => window.__now);
// run the film's clock on by ms (in chunks, so timers and observers get their turn)
async function run(ms) { let left = Math.round(ms / IV); while (left > 0) { const n = Math.min(left, 240); await page.evaluate(([iv, k]) => window.__step(iv, k), [IV, n]); left -= n; await page.waitForTimeout(0); } }
const box = await page.$("#sanpou-journey .hc-stagebox");
// (the site's own transitions, the caption's swap and the copy's clearing, run on the real clock: they are given time to finish)
const shot = async () => { await page.waitForTimeout(2500); return PNG.sync.read(await box.screenshot()); };
const state = () => page.evaluate(() => {
  const st = document.getElementById("sjxStage"), fam = ["w", "t", "n"], on = [];
  [...st.children].forEach((sl, i) => { if (sl.firstChild && sl.getAttribute("style") !== "display:none") on.push(fam[i]); });
  return { no: document.getElementById("hcNo").textContent, cur: [...document.querySelectorAll("#sjxIndex button")].findIndex((b) => b.getAttribute("aria-current") === "true"), on: on.join("") };
});
const differ = (a, b) => pixelmatch(a.data, b.data, null, a.width, a.height, { threshold: 0.02 });
let failed = 0;
const say = (ok, what) => { if (!ok) failed++; console.log(`${ok ? "ok  " : "FAIL"} ${what}`); };

// 1. to the finale, past its dwell (so the phone's camera has landed too), and then N loops on
await run(27800 + 18000 + 4000 - 0);
const a = await shot(), sa = await state();
say(sa.no === "05" && sa.on === "n", `the film reaches the finale and holds (scene ${sa.no})`);
await run(L);
const b = await shot();
say(differ(a, b) === 0, `one loop later (52 s) the player shows the same picture: ${differ(a, b)} px differ`);
await run(L * (loops - 1));
const c = await shot();
say(differ(a, c) === 0, `${loops} loops later (${loops * 52} s) it still does: ${differ(a, c)} px differ`);

// 2. the five buttons, from the finale after those loops
const WANT = [["01", "w"], ["02", "w"], ["03", "t"], ["04", "n"], ["05", "n"]];
for (const i of [0, 1, 2, 3, 4, 2, 4]) {
  await page.evaluate((k) => document.querySelectorAll("#sjxIndex button")[k].click(), i);
  // the click's own task, the dissolve (real time), then a few frames; a step forward plays the entrance, so that is let run
  await run(200); await page.waitForTimeout(1150); await run(i === 2 && (await state()).on === "w" ? 3500 : 300);
  const s = await state();
  say(s.no === WANT[i][0] && s.cur === i && s.on.includes(WANT[i][1]), `button ${i + 1}: scene ${s.no}, drawings on the stage: ${s.on}`);
}
// 3. back on the finale by a jump: its hold's first frame, a point of the loop
await run(18000 + 2000);                                                    // past the finale's dwell, so the phone's camera has landed
const back = await shot();
await page.evaluate(() => { window.__mark = window.__now; });
await run(L);
const again = await shot();
say(differ(back, again) === 0, `after the jump back to 05, the picture one loop later is the same: ${differ(back, again)} px differ`);
say(errors.length === 0, `console errors: ${errors.length}${errors.length ? " (" + errors[0] + ")" : ""}`);
await browser.close();
console.log(failed ? `\n${failed} check(s) failed` : `\nthe finale loops in the real player, and the scene buttons work after ${loops} loops (${side}, ${f.framing || "desktop"})`);
process.exit(failed ? 1 : 0);
