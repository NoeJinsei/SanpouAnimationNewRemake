// What a phone and a desktop really see of the stage, per scene.
//   node tools/crop-table.mjs <side>
import { launch, BASE } from "./pw.mjs";

const side = process.argv[2] || "round2";
const MOMENTS = [["01 入荷", 3500], ["02 積込", 10500], ["03 輸送", 18000], ["04 map", 24500], ["05 finale", 32000], ["05 climb", 40000]];
const VIEWS = { phone: { w: 390, h: 844, dpr: 2 }, desktop: { w: 1440, h: 900, dpr: 1 } };

const browser = await launch();
for (const [vname, V] of Object.entries(VIEWS)) {
  const page = await browser.newPage({ viewport: { width: V.w, height: V.h }, deviceScaleFactor: V.dpr });
  await page.goto(`${BASE}/viewer/frame.html?side=${encodeURIComponent(side)}&framing=site`);
  await page.waitForFunction(() => window.heroFrame && (window.heroFrame.seek || window.heroFrame.error), null, { timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  for (const [label, ms] of MOMENTS) {
    await page.evaluate((t) => window.heroFrame.seek(t), ms);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const box = await page.evaluate(() => {
      const host = document.querySelector("#sanpou-journey");
      const svg = host && host.querySelector("svg");
      if (!svg) return null;
      const r = host.getBoundingClientRect();
      const m = svg.getScreenCTM().inverse();
      const p = (x, y) => { const q = svg.createSVGPoint(); q.x = x; q.y = y; const o = q.matrixTransform(m); return [o.x, o.y]; };
      const tl = p(r.left, r.top), br = p(r.right, r.bottom);
      return { x0: tl[0], y0: tl[1], x1: br[0], y1: br[1] };
    });
    if (!box) { console.log(vname, label, "no svg"); continue; }
    const f = (v) => Math.round(v);
    console.log(`${vname.padEnd(8)} ${label.padEnd(10)} x ${f(box.x0)}..${f(box.x1)}  (${f(box.x1 - box.x0)} wide)   y ${f(box.y0)}..${f(box.y1)}  (${f(box.y1 - box.y0)} tall)`);
  }
  await page.close();
}
await browser.close();
