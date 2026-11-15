// What changes between two moments? Photographs the bare stage at two times and reports where the picture
// differs: the boxes (stage px) of the regions that changed and how much of the stage changed.
//   node tools/what-moves.mjs <side> <ms A> <ms B> [--out=diff.png] [--min=24] [--cell=40]
// Uses: finding what pops in one step (A and B one step apart), and seeing what is alive in a hold (A and B
// half a second apart). --out writes a picture: frame B, dimmed, with everything that changed in vermilion.
import fs from "node:fs";
import { launch, BASE, PNG } from "./pw.mjs";

const args = process.argv.slice(2), flags = {};
const pos = args.filter((x) => { const m = /^--(\w+)(?:=(.*))?$/.exec(x); if (m) flags[m[1]] = m[2] == null ? true : m[2]; return !m; });
const side = pos[0] || "round2", A = +pos[1], B = +pos[2], MIN = +(flags.min || 24), CELL = +(flags.cell || 40);
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(`${BASE}/viewer/frame.html?side=${encodeURIComponent(side)}&framing=stage`);
await page.waitForFunction(() => window.heroFrame && (window.heroFrame.seek || window.heroFrame.error), null, { timeout: 30000 });
await page.evaluate(() => document.fonts.ready);
const hero = await page.$("#sanpou-journey");
const shot = async (t) => {
  await page.evaluate((ms) => window.heroFrame.seek(ms), t);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  return PNG.sync.read(await hero.screenshot());
};
const a = await shot(A), b = await shot(B);
await browser.close();
const W = a.width, H = a.height, cols = Math.ceil(W / CELL), rows = Math.ceil(H / CELL), grid = new Uint32Array(cols * rows);
let changed = 0;
const out = new PNG({ width: W, height: H });
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = (y * W + x) * 4;
  const d = Math.abs(a.data[i] - b.data[i]) + Math.abs(a.data[i + 1] - b.data[i + 1]) + Math.abs(a.data[i + 2] - b.data[i + 2]);
  const hit = d > MIN;
  if (hit) { changed++; grid[Math.floor(y / CELL) * cols + Math.floor(x / CELL)]++; }
  out.data[i] = hit ? 225 : b.data[i] * 0.35 + 150; out.data[i + 1] = hit ? 60 : b.data[i + 1] * 0.35 + 150; out.data[i + 2] = hit ? 40 : b.data[i + 2] * 0.35 + 150; out.data[i + 3] = 255;
}
// join neighbouring cells that changed into boxes
const seen = new Uint8Array(cols * rows), boxes = [];
for (let c = 0; c < cols * rows; c++) {
  if (!grid[c] || seen[c]) continue;
  const q = [c]; seen[c] = 1; let x0 = cols, y0 = rows, x1 = 0, y1 = 0, n = 0;
  while (q.length) {
    const k = q.pop(), cx = k % cols, cy = Math.floor(k / cols);
    n += grid[k]; x0 = Math.min(x0, cx); x1 = Math.max(x1, cx); y0 = Math.min(y0, cy); y1 = Math.max(y1, cy);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cx + dx, ny = cy + dy, j = ny * cols + nx;
      if (nx >= 0 && ny >= 0 && nx < cols && ny < rows && grid[j] && !seen[j]) { seen[j] = 1; q.push(j); }
    }
  }
  boxes.push({ x: x0 * CELL, y: y0 * CELL, w: (x1 - x0 + 1) * CELL, h: (y1 - y0 + 1) * CELL, px: n });
}
boxes.sort((p, q) => q.px - p.px);
console.log(`${side}: ${A} ms -> ${B} ms: ${(100 * changed / (W * H)).toFixed(2)} % of the stage changed, in ${boxes.length} region(s)`);
for (const r of boxes.slice(0, +(flags.top || 12))) console.log(`  x ${r.x}..${r.x + r.w}  y ${r.y}..${r.y + r.h}   ${r.px} px`);
if (flags.out) { fs.writeFileSync(flags.out, PNG.sync.write(out)); console.log("picture: " + flags.out); }
