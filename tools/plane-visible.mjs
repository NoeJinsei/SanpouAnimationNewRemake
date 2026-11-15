// How long the airliner of scene 05 is really seen in open sky on a phone (or at the desktop framing).
//   node tools/plane-visible.mjs <side> [--framing=phone|desktop] [--from=35000 --to=47000 --every=100] [--min=30] [--table]
// At each moment the frame is photographed twice, with the plane and with the plane hidden; the pixels
// that differ by more than --min (sum over R, G, B) are the plane as the viewer sees it. On a phone only
// the pixels BELOW the headline, the tag line and the two buttons count: that is the open sky (the plane
// behind the buttons or under the copy's pale ground is not "seen"). The whole plane, for the percentage,
// is measured on the bare stage (no copy over it) and scaled to the framing.
// Prints for how long at least 80 %, half and a quarter of the plane is seen in open sky.
import { launch, BASE, PNG } from "./pw.mjs";

const args = process.argv.slice(2), flags = {};
const pos = args.filter((x) => { const m = /^--(\w+)(?:=(.*))?$/.exec(x); if (m) flags[m[1]] = m[2] == null ? true : m[2]; return !m; });
const side = pos[0] || "round2", framing = flags.framing || "phone";
const VIEW = { phone: { w: 390, h: 844, dpr: 2 }, desktop: { w: 1440, h: 900, dpr: 1 } }[framing];
const from = +(flags.from || 35000), to = +(flags.to || 47000), every = +(flags.every || 100), MIN = +(flags.min || 30);

const browser = await launch();
async function open(view, f) {
  const page = await browser.newPage({ viewport: { width: view.w, height: view.h }, deviceScaleFactor: view.dpr });
  await page.goto(`${BASE}/viewer/frame.html?side=${encodeURIComponent(side)}&framing=${f}`);
  await page.waitForFunction(() => window.heroFrame && (window.heroFrame.seek || window.heroFrame.error), null, { timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  return page;
}
// the plane's pixels at one moment: the frame with it against the frame without it; only rows from `top` down count
async function planePx(page, t, top) {
  const hero = await page.$("#sanpou-journey");
  const settle = () => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const show = (on) => page.evaluate((on) => {
    const c = document.getElementById("nPlaneRunway");
    if (!c) return false;
    c.parentNode.parentNode.style.display = on ? "" : "none";
    return true;
  }, on);
  await page.evaluate((ms) => window.heroFrame.seek(ms), t);
  await settle();
  const a = PNG.sync.read(await hero.screenshot());
  if (!(await show(false))) return 0;
  await settle();
  const b = PNG.sync.read(await hero.screenshot());
  await show(true);
  let n = 0;
  for (let i = Math.round(top) * a.width * 4; i < a.data.length; i += 4) {
    if (Math.abs(a.data[i] - b.data[i]) + Math.abs(a.data[i + 1] - b.data[i + 1]) + Math.abs(a.data[i + 2] - b.data[i + 2]) > MIN) n++;
  }
  return n;
}

// the whole plane, on the bare stage, in the air (the most that is ever seen in the run)
const stage = await open({ w: 1920, h: 1080, dpr: 1 }, "stage");
let whole = 0;
for (let t = from; t <= to; t += 500) whole = Math.max(whole, await planePx(stage, t, 0));
await stage.close();

const page = await open(VIEW, "site");
const geo = await page.evaluate(() => {
  const host = document.querySelector("#sanpou-journey"), r = host.getBoundingClientRect();
  let bottom = 0;
  for (const el of host.ownerDocument.querySelectorAll(".hc-title, .hc-tag, a.btn, a.hc-link")) {
    const q = el.getBoundingClientRect();
    if (q.width && q.bottom < r.top + r.height * 0.6) bottom = Math.max(bottom, q.bottom - r.top);
  }
  return { scale: host.querySelector("svg").getScreenCTM().a, copyBottom: bottom };
});
const top = framing === "phone" ? geo.copyBottom * VIEW.dpr : 0;
const scaled = Math.max(1, whole * Math.pow(geo.scale * VIEW.dpr, 2));
const raw = [];
for (let t = from; t <= to; t += every) raw.push([t, await planePx(page, t, top)]);
await browser.close();
// "the whole plane" at this framing is the most of it that is ever seen in open sky (the framing's own pale
// wash takes some of a white plane's edge away, so the bare stage's count is never reached); it is not
// allowed to fall under half of the bare stage's count, so a plane that is never whole is not called whole
const ref = Math.max(0.5 * scaled, ...raw.map((r) => r[1]));
const rows = raw.map((r) => [r[0], r[1] / ref]);

const span = (k) => rows.filter((r) => r[1] >= k).length * every / 1000;
const first = (k) => { const r = rows.find((r) => r[1] >= k); return r ? r[0] : "-"; };
const last = (k) => { const r = [...rows].reverse().find((r) => r[1] >= k); return r ? r[0] : "-"; };
if (flags.table) for (const [t, k] of rows) if (k > 0.005) console.log(String(t).padStart(6) + "  " + String(Math.round(100 * k)).padStart(3) + " %  " + "#".repeat(Math.round(40 * Math.min(1, k))));
console.log(`${side} (${framing}): the plane seen in open sky` + (top ? `, below the buttons (screen y ${Math.round(geo.copyBottom)})` : ""));
console.log(`  at least 80 % of it: ${span(0.8).toFixed(1)} s  (${first(0.8)} .. ${last(0.8)} ms)`);
console.log(`  at least half of it: ${span(0.5).toFixed(1)} s  (${first(0.5)} .. ${last(0.5)} ms)`);
console.log(`  at least a quarter:  ${span(0.25).toFixed(1)} s  (${first(0.25)} .. ${last(0.25)} ms)`);
