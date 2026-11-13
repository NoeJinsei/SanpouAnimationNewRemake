// Contrast of the site's live text over the real rendered picture, moment by moment (WCAG AA), plus the unfilled progress track.
//   node tools/contrast-check.mjs <side> [--framings=desktop,phone] [--every=1000] [--from=0 --to=45800] [--json=<file>]
// Per moment: reads each visible text line box, hides all text (colour transparent, layout and backdrop untouched), screenshots,
// and compares the text colour with every backdrop pixel under the line (2 CSS px grid). Fading copy (opacity < .95) is skipped.
// Rows are per element and framing: worst ratio, 5th percentile, where the worst was, PASS/FAIL. Exit code 1 if any row fails.
// Track: each unfilled segment's own rendered colour against the picture 2..8 px above and below it (needs 3:1).
import fs from "node:fs";
import { launch, BASE, PNG } from "./pw.mjs";

const flags = {}, pos = process.argv.slice(2).filter((x) => { const m = /^--(\w+)(?:=(.*))?$/.exec(x); if (m) flags[m[1]] = m[2] ?? true; return !m; });
const side = pos[0] || "original", every = +(flags.every || 1000), from = +(flags.from || 0), to = +(flags.to || 45800);
const VIEWS = { desktop: { w: 1440, h: 900, dpr: 1 }, phone: { w: 390, h: 844, dpr: 2 } };
const framings = String(flags.framings || "desktop,phone").split(",");
const SEL = { headline: ".hc-title", tagline: ".hc-tag", "sub-copy": ".hc-sub", "button (filled)": ".hc-cta .btn", "button (outline)": ".hc-cta .hc-link", "caption number": "#hcNo", "caption name": "#hcScene", "caption lead": "#hcLead" };

const lin = Array.from({ length: 256 }, (_, i) => { const c = i / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
const L = (r, g, b) => 0.2126 * lin[r] + 0.7152 * lin[g] + 0.0722 * lin[b];
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const pct = (arr, p) => { arr.sort((x, y) => x - y); return arr[Math.min(arr.length - 1, Math.floor(arr.length * p))]; };

// runs in the page: every visible text element, its colour (opacity folded into alpha), size, weight and per-line boxes
function collect(SEL) {
  const hero = document.querySelector("#sanpou-journey"), H = hero.getBoundingClientRect();
  const cv = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  const rgba = (c) => { cv.clearRect(0, 0, 1, 1); cv.fillStyle = "#000"; cv.fillStyle = c; cv.fillRect(0, 0, 1, 1); const d = cv.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const out = [], skipped = [];
  for (const [name, sel] of Object.entries(SEL)) for (const el of document.querySelectorAll(sel)) {
    let op = 1, vis = true;
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) { const s = getComputedStyle(n); if (s.display === "none" || s.visibility === "hidden") vis = false; op *= +s.opacity; }
    if (!vis || op <= 0 || !el.getClientRects().length) continue;
    if (op < 0.95) { skipped.push(name); continue; }
    const cs = getComputedStyle(el), col = rgba(cs.color), rects = [];
    const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let t; (t = tw.nextNode()); ) { if (!t.data.trim()) continue; const r = document.createRange(); r.selectNodeContents(t);
      for (const q of r.getClientRects()) if (q.width >= 1 && q.height >= 1) rects.push([q.left - H.left, q.top - H.top, q.width, q.height]); }
    if (rects.length) out.push({ name, size: parseFloat(cs.fontSize), weight: +cs.fontWeight || (cs.fontWeight === "bold" ? 700 : 400), col, rects });
  }
  const segs = [...document.querySelectorAll("#sjxIndex .tr")].map((tr) => { const b = tr.getBoundingClientRect(), f = tr.querySelector(".hc-fill").getBoundingClientRect(); return { r: [b.left - H.left, b.top - H.top, b.width, b.height], filled: f.width >= 1 }; });
  return { out, skipped, segs };
}

const rows = {}, note = { skipped: {} };
const row = (k, size, need) => (rows[k] ||= { key: k, size, need, min: 99, at: "", ratios: [] });
const browser = await launch(), errors = [];
for (const fr of framings) {
  const V = VIEWS[fr]; if (!V) { console.log("unknown framing " + fr); process.exit(2); }
  const page = await browser.newPage({ viewport: { width: V.w, height: V.h }, deviceScaleFactor: V.dpr });
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(`${BASE}/viewer/frame.html?side=${encodeURIComponent(side)}&framing=site`);
  await page.waitForFunction(() => window.heroFrame && (window.heroFrame.seek || window.heroFrame.error), null, { timeout: 30000 });
  if (await page.evaluate(() => !!window.heroFrame.error)) { console.log("side did not start:", await page.evaluate(() => window.heroFrame.error)); process.exit(1); }
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: ".cc-hide #sanpou-journey *, .cc-hide #sanpou-journey *::before, .cc-hide #sanpou-journey *::after { color: transparent !important; -webkit-text-fill-color: transparent !important; text-shadow: none !important; transition: none !important; caret-color: transparent !important; }" });
  const hero = await page.$("#sanpou-journey"), raf2 = () => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  for (let t = from; t <= to; t += every) {
    await page.evaluate((ms) => window.heroFrame.seek(ms), t); await raf2();
    const info = await page.evaluate(collect, SEL);
    for (const s of info.skipped) note.skipped[s] = (note.skipped[s] || 0) + 1;
    const A = PNG.sync.read(await hero.screenshot());
    await page.evaluate(() => document.documentElement.classList.add("cc-hide")); await raf2();
    const B = PNG.sync.read(await hero.screenshot());
    await page.evaluate(() => document.documentElement.classList.remove("cc-hide"));
    const at = `${fr} t=${t}`, d = V.dpr;
    const px = (P, x, y) => { const X = Math.round(x * d), Y = Math.round(y * d); if (X < 0 || Y < 0 || X >= P.width || Y >= P.height) return null; const i = (Y * P.width + X) * 4; return [P.data[i], P.data[i + 1], P.data[i + 2]]; };
    for (const e of info.out) {
      const large = e.size >= 24 || (e.size >= 18.66 && e.weight >= 700), R = row(`${e.name} @${fr}`, e.size, large ? 3 : 4.5), [cr, cg, cb, ca] = e.col;
      for (const [x, y, w, h] of e.rects) for (let yy = y + 1; yy < y + h; yy += 2) for (let xx = x + 1; xx < x + w; xx += 2) {
        const p = px(B, xx, yy); if (!p) continue;
        const r = ratio(L(Math.round(cr * ca + p[0] * (1 - ca)), Math.round(cg * ca + p[1] * (1 - ca)), Math.round(cb * ca + p[2] * (1 - ca))), L(...p));
        R.ratios.push(r); if (r < R.min) { R.min = r; R.at = at; R.size = e.size; R.need = large ? 3 : 4.5; }
      }
    }
    for (const [i, s] of info.segs.entries()) if (!s.filled) {
      const [x, y, w, h] = s.r, R = row(`track unfilled @${fr}`, 6, 3);
      for (let xx = x + 2; xx < x + w - 2; xx += 2) {
        const c = px(A, xx, y + h / 2); if (!c) continue;
        for (const yy of [y - 2, y - 4, y - 6, y - 8, y + h + 2, y + h + 4, y + h + 6, y + h + 8]) {
          const p = px(B, xx, yy); if (!p) continue;
          const r = ratio(L(...c), L(...p)); R.ratios.push(r); if (r < R.min) { R.min = r; R.at = `${at} seg ${i + 1}`; }
        }
      }
    }
  }
  await page.close();
}
await browser.close();

const list = Object.values(rows).filter((r) => r.ratios.length), fails = list.filter((r) => r.min < r.need);
console.log(["element".padEnd(26), "px".padStart(4), "need".padStart(4), "worst".padStart(6), "p5".padStart(6), "where".padEnd(26), ""].join(" "));
for (const r of list) console.log([r.key.padEnd(26), String(r.size).padStart(4), String(r.need).padStart(4), r.min.toFixed(2).padStart(6), pct(r.ratios, 0.05).toFixed(2).padStart(6), r.at.padEnd(26), r.min < r.need ? "FAIL" : "PASS"].join(" "));
if (Object.keys(note.skipped).length) console.log("skipped while fading (opacity < .95): " + JSON.stringify(note.skipped));
if (errors.length) console.log("console errors:\n  " + [...new Set(errors)].join("\n  "));
if (flags.json) fs.writeFileSync(flags.json, JSON.stringify({ side, every, from, to, framings, rows: list.map((r) => ({ element: r.key, size: r.size, need: r.need, worst: r.min, p5: pct(r.ratios, 0.05), at: r.at, samples: r.ratios.length })), skipped: note.skipped }, null, 2));
console.log(fails.length ? `contrast FAIL: ${fails.length} element(s) below AA` : "contrast OK");
process.exit(fails.length ? 1 : 0);
