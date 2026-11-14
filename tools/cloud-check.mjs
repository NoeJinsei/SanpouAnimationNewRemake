// Are the clouds in the sky? The owner's rule (2026-11-14): no cloud base below the roofline beneath it,
// nothing sitting down behind the skyline.
//   node tools/cloud-check.mjs <side> [--every=500] [--margin=6] [--scenes=01,02,03,05] [--skip=7417-9139] [--fit=<file.json>] [--at=40000]
// For every sampled moment it measures each cloud on screen (the cached cloud drawing's box: its underside
// is the box's bottom) against every city building under it (groups tagged data-city: their box's top is the
// roof, crowns included). A cloud fails when its underside is lower than a roof under it, less the margin.
// The supplier building and the Sanpou warehouse count as roofs too (their cached drawing, or any group
// tagged data-roof). Tokyo Tower, Mt Fuji and the cranes are not measured.
// Clouds are named by their field (the data-sky attribute CloudField writes, e.g. w-far) and their place in
// it, e.g. w-far:2, which is SKY_WORLD.far[2] in the scene code.
// --skip=<ms>-<ms>[,...] leaves moments out (the pan between scenes 01 and 02, where the city slides past
//   the sky and a tower may cross a cloud for a moment).
// --fit=<file> writes how far each failing cloud has to be lifted, as {"w-far:2": 41, ...}, for cloud-lift.py.
// --at=<ms> prints every cloud at that one moment with the highest roof under it, for composing.
// Exit code 1 when any cloud fails.
import fs from "node:fs";
import { launch, BASE } from "./pw.mjs";

const args = process.argv.slice(2), flags = {};
const pos = args.filter((x) => { const m = /^--(\w+)(?:=(.*))?$/.exec(x); if (m) flags[m[1]] = m[2] == null ? true : m[2]; return !m; });
const side = pos[0] || "round2", every = +(flags.every || 500), margin = +(flags.margin || 6);
const SCENES = { "01": [0, 7000], "02": [7000, 14600], "03": [14600, 21800], "04": [21800, 27800], "05": [27800, 45800] };
const want = String(flags.scenes || "01,02,03,05").split(",");
const skip = flags.skip ? String(flags.skip).split(",").map((r) => r.split("-").map(Number)) : [];

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(`${BASE}/viewer/frame.html?side=${encodeURIComponent(side)}&framing=stage`);
await page.waitForFunction(() => window.heroFrame && (window.heroFrame.seek || window.heroFrame.error), null, { timeout: 30000 });
if (await page.evaluate(() => !!window.heroFrame.error)) { console.log("side did not start:", await page.evaluate(() => window.heroFrame.error)); await browser.close(); process.exit(1); }

async function measure(t) {
  await page.evaluate((ms) => window.heroFrame.seek(ms), t);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  return page.evaluate(() => {
    const host = document.querySelector("#sanpou-journey").getBoundingClientRect();
    const seen = (el) => {                      // drawn at all: no ancestor faded out or hidden
      let o = 1;
      for (let n = el; n && n !== document.body; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (cs.display === "none" || cs.visibility === "hidden") return 0;
        o *= parseFloat(cs.opacity);
      }
      return o;
    };
    const svgs = [...document.querySelectorAll("svg")];   // two scenes are on screen during a dissolve: a cloud is only measured against its own picture
    const box = (el) => { const r = el.getBoundingClientRect(); return { pic: svgs.indexOf(el.closest("svg")), x0: r.left - host.left, x1: r.right - host.left, top: r.top - host.top, bottom: r.bottom - host.top }; };
    let clouds = [];
    const fields = [...document.querySelectorAll("g[data-sky]")];
    if (fields.length) {
      for (const f of fields) [...f.children].forEach((g, i) => {
        const el = g.querySelector('g[data-cache^="cloud3-"]');
        if (el) clouds.push({ id: f.getAttribute("data-sky") + ":" + i, key: el.getAttribute("data-cache"), o: seen(el), ...box(el) });
      });
    } else {
      clouds = [...document.querySelectorAll('g[data-cache^="cloud3-"]')].map((el, i) => ({ id: "cloud " + i, key: el.getAttribute("data-cache"), o: seen(el), ...box(el) }));
    }
    clouds = clouds.filter((c) => c.o > 0.5 && c.x1 > 0 && c.x0 < 1920 && c.bottom > 0 && c.top < 1080);
    let roofs = [...document.querySelectorAll("g[data-city], g[data-roof]")].map((el) => ({ type: el.getAttribute("data-city") || el.getAttribute("data-roof"), o: seen(el), ...box(el) }))
      .filter((b) => b.o > 0.5 && b.x1 > 0 && b.x0 < 1920 && b.bottom > b.top);
    // The supplier building and the Sanpou warehouse have parts of different heights and are drawn as a few
    // large shapes, so a box will not do: under each cloud, find the highest point of the building itself
    // (point-in-shape tests down each 8 px column), and hand that back as a roof that belongs to that cloud.
    const LIMIT = 40;                                   // how far below a cloud's underside a roof still matters
    for (const g of document.querySelectorAll('g[data-cache^="supplier-"], g[data-cache^="wh-"]')) {
      if (seen(g) <= 0.5) continue;
      const gb = box(g), shapes = [...g.querySelectorAll("rect, path, polygon, circle, ellipse, line")].map((el) => ({ el, b: box(el), inv: el.getScreenCTM().inverse() }));
      for (const c of clouds) {
        if (c.pic !== gb.pic || Math.min(c.x1, gb.x1) - Math.max(c.x0, gb.x0) < 8 || gb.top > c.bottom + LIMIT) continue;
        let top = Infinity;
        for (const sh of shapes) {
          const xa = Math.max(c.x0, sh.b.x0), xb = Math.min(c.x1, sh.b.x1);
          if (xb - xa < 8 || sh.b.top > Math.min(top, c.bottom + LIMIT)) continue;
          for (let x = xa + 1; x < xb; x += 8) for (let y = Math.max(sh.b.top, 0) + 0.5; y < Math.min(top, c.bottom + LIMIT); y += 3) {
            const p = new DOMPoint(x + host.left, y + host.top).matrixTransform(sh.inv);
            if (sh.el.isPointInFill(p) || sh.el.isPointInStroke(p)) { top = y; break; }
          }
        }
        if (top < Infinity) roofs.push({ type: g.getAttribute("data-cache").split("-")[0], only: c.id, pic: gb.pic, x0: Math.max(c.x0, gb.x0), x1: Math.min(c.x1, gb.x1), top, bottom: gb.bottom, o: 1 });
      }
    }
    return { clouds, roofs };
  });
}
const under = (c, roofs) => {                    // the highest roof standing under a cloud (8 px of overlap counts)
  let best = null;
  for (const b of roofs) if (b.pic === c.pic && (!b.only || b.only === c.id) && Math.min(c.x1, b.x1) - Math.max(c.x0, b.x0) >= 8 && (!best || b.top < best.top)) best = b;
  return best;
};
const r0 = (v) => Math.round(v);

if (flags.at != null) {
  const t = +flags.at, m = await measure(t);
  console.log(`${side} at ${t} ms: ${m.clouds.length} clouds, ${m.roofs.length} buildings in view`);
  for (const c of m.clouds) {
    const b = under(c, m.roofs);
    console.log(`  ${c.id} ${c.key}  x ${r0(c.x0)}..${r0(c.x1)}  top ${r0(c.top)}  underside ${r0(c.bottom)}  ` +
      (b ? `highest roof under it ${r0(b.top)} (${b.type} at x ${r0(b.x0)}..${r0(b.x1)})  ${c.bottom > b.top - margin ? "FAIL by " + r0(c.bottom - b.top + margin) : "clear by " + r0(b.top - c.bottom)}` : "nothing under it"));
  }
  if (flags.roofs) {                              // the roofline in 60 px columns, for composing
    let line = "  roofline by 60 px column: ";
    for (let x = 0; x < 1920; x += 60) { let top = 1080; for (const b of m.roofs) if (b.x1 > x && b.x0 < x + 60) top = Math.min(top, b.top); line += r0(top) + " "; }
    console.log(line);
  }
  await browser.close(); process.exit(0);
}

let bad = 0;
const fit = {};
for (const s of want) {
  const [a, z] = SCENES[s], fails = new Map();
  let n = 0, tagged = 0;
  for (let t = a; t <= z; t += every) {
    if (skip.some(([p, q]) => t >= p && t <= q)) continue;
    const m = await measure(t); n++; tagged = Math.max(tagged, m.roofs.length);
    for (const c of m.clouds) {
      const b = under(c, m.roofs);
      if (b && c.bottom > b.top - margin) {
        const d = c.bottom - b.top, f = fails.get(c.id) || { key: c.key, worst: -1e9, moments: 0 };
        f.moments++;
        if (d > f.worst) Object.assign(f, { worst: d, t, cx: `${r0(c.x0)}..${r0(c.x1)}`, base: r0(c.bottom), roof: r0(b.top), type: b.type, bx: `${r0(b.x0)}..${r0(b.x1)}` });
        fails.set(c.id, f);
        fit[c.id] = Math.max(fit[c.id] || 0, Math.ceil(d + margin));
      }
    }
  }
  if (!tagged) { console.log(`scene ${s}: no building carries data-city on this side, nothing measured`); continue; }
  console.log(`scene ${s}: ${n} moments, ${fails.size} cloud${fails.size === 1 ? "" : "s"} below a roof`);
  for (const [id, f] of fails) {
    bad++;
    console.log(`  ${id} ${f.key}: underside ${f.base} is ${r0(f.worst)} px below the roof at ${f.roof} (${f.type}, x ${f.bx}); cloud x ${f.cx}; worst at ${f.t} ms; ${f.moments} of ${n} moments`);
  }
}
await browser.close();
if (flags.fit) { fs.writeFileSync(String(flags.fit), JSON.stringify(fit, null, 1)); console.log("lifts written to", flags.fit); }
console.log(bad ? `FAIL: ${bad} cloud/scene pairs with the base below a roof` : "clouds OK: every cloud's base clears the roofs under it");
process.exit(bad ? 1 : 0);
