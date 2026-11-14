// Scratch: audits the flat city in the page. For every building group ([data-city]) drawn at a few moments:
//   - every edge that is neither vertical nor horizontal, by building type and tone (expected: stair flights
//     on M, billboard braces on B, sheens in the glass of G; nothing else)
//   - every rectangle that runs (nearly) the full height of its building along its left or right edge in a
//     tone other than the wall's (expected: none, except the steel columns of X under its mesh)
//   - that the top edge of the building's wall is level (its first, biggest rectangle)
//   node evidence/2026-11-14-r3-flat/city/audit.mjs <side>
import { launch, BASE } from "../../../tools/pw.mjs";
const side = process.argv[2] || "flat-city";
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(`${BASE}/viewer/frame.html?side=${encodeURIComponent(side)}&framing=stage`);
await page.waitForFunction(() => window.heroFrame && (window.heroFrame.seek || window.heroFrame.error), null, { timeout: 30000 });
const seen = new Map();
for (const t of [1000, 3500, 7500, 8300, 9000, 12000, 15000, 16500, 18000, 19500, 21500, 40000]) {
  await page.evaluate((ms) => window.heroFrame.seek(ms), t);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const got = await page.evaluate(() => [...document.querySelectorAll("[data-city]")].map((g) => ({
    key: g.getAttribute("data-cache"), type: g.getAttribute("data-city"), roof: +g.getAttribute("data-roof"), box: g.getAttribute("data-box"),
    paths: [...g.children].map((p) => ({ tag: p.tagName, fill: p.getAttribute("fill"), d: p.getAttribute("d") || "" }))
  })));
  for (const b of got) seen.set(b.key, b);
}
await browser.close();

const diag = {}, bands = [], tags = new Set();
let n = 0;
for (const b of seen.values()) {
  n++;
  const [bx, by, bw, bh] = b.box.split(" ").map(Number);
  let wall = null;
  for (const p of b.paths) {
    tags.add(p.tag);
    for (const sub of p.d.split("M").filter(Boolean)) {
      const rect = /^(-?[\d.]+),(-?[\d.]+)h(-?[\d.]+)v(-?[\d.]+)h(-?[\d.]+)z$/.exec(sub);
      if (rect) {
        const x = +rect[1], y = +rect[2], w = +rect[3], hh = +rect[4];
        if (!wall) wall = { x, y, w, h: hh, fill: p.fill };
        else if (p.fill !== wall.fill && hh >= wall.h * 0.9 && w < wall.w * 0.3 && (Math.abs(x - wall.x) < 8 || Math.abs(x + w - wall.x - wall.w) < 8))
          bands.push(`${b.type} ${b.key}: ${p.fill} band ${w}x${hh} at x ${x} (wall ${wall.x}..${wall.x + wall.w}, h ${wall.h})`);
        continue;
      }
      if (/a/.test(sub) && /^(-?[\d.]+),(-?[\d.]+)h/.test(sub)) continue;                 // a round-ended bar (a tank)
      const pts = sub.replace(/z$/, "").split("L").map((q) => q.split(",").map(Number));
      let d = 0;
      for (let i = 0; i < pts.length; i++) { const a = pts[i], c = pts[(i + 1) % pts.length]; if (Math.abs(a[0] - c[0]) > 0.11 && Math.abs(a[1] - c[1]) > 0.11) d++; }
      if (d) { const k = b.type + " " + p.fill; diag[k] = (diag[k] || 0) + 1; }
    }
  }
}
console.log(`${n} different buildings seen; tags inside them: ${[...tags].join(", ")}`);
console.log("shapes with a diagonal edge, by type and tone:");
for (const k of Object.keys(diag).sort()) console.log("  " + k + ": " + diag[k]);
console.log("full-height bands along a side: " + (bands.length ? "\n  " + bands.join("\n  ") : "none"));
