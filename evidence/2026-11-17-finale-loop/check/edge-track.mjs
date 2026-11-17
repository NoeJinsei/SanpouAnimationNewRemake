// Does the BROWSER move a slow thing smoothly? The scene code can move a cloud a twentieth of a pixel a frame;
// what reaches the screen depends on how the browser draws it. This photographs one patch of the picture at
// every step and measures where the bright thing in it stands, to a small fraction of a pixel (the centre of
// its brightness), so a smooth glide and a move in whole-pixel steps can be told apart.
//   node evidence/2026-11-17-finale-loop/check/edge-track.mjs <side> --box=x,y,w,h --from=3000 --to=5000 [--fps=60] [--framing=stage|site] [--w=1920 --h=1080] [--dpr=1] [--bright=200] [--gpu] [--headed] [--csv=file]
// --box is in CSS px of the page; --bright: a pixel counts by how far its red is above this (clouds are white on blue).
// Prints: the speed (px a step), how even the steps are, and the share of steps in which it did not move at all.
import fs from "node:fs";
import { launch, BASE, PNG } from "../../../tools/pw.mjs";
import { flags } from "./scene-lab.mjs";

const { f, pos } = flags(process.argv.slice(2));
const side = pos[0] || "round2", fps = +(f.fps || 60), from = +(f.from || 3000), to = +(f.to || 5000), framing = f.framing || "stage";
const W = +(f.w || 1920), H = +(f.h || 1080), dpr = +(f.dpr || 1), bright = +(f.bright || 200);
const [bx, by, bw, bh] = String(f.box || "0,60,600,200").split(",").map(Number);
// --gpu: new-headless Chrome drawing on the machine's real GPU (as tools/perf-side.mjs does), where layers are moved by the GPU
const browser = await launch(f.gpu ? { channel: "chrome", headless: true, args: ["--headless=new", "--enable-gpu", "--ignore-gpu-blocklist", "--enable-gpu-rasterization", "--use-angle=d3d11"] } : f.headed ? { headless: false } : {});
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: dpr });
await page.goto(`${BASE}/viewer/frame.html?side=${encodeURIComponent(side)}&framing=${framing}`);
await page.waitForFunction(() => window.heroFrame && (window.heroFrame.seek || window.heroFrame.error), null, { timeout: 30000 });
await page.evaluate(() => document.fonts.ready);
const xs = [], ys = [], ts = [];
for (let i = 0; from + i * 1000 / fps <= to + 1e-6; i++) {
  const ms = from + i * 1000 / fps;
  await page.evaluate((t) => window.heroFrame.seek(t), ms);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const img = PNG.sync.read(await page.screenshot({ clip: { x: bx, y: by, width: bw, height: bh }, type: "png" }));
  let sw = 0, sx = 0, sy = 0;
  for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) {
    const w = Math.max(0, img.data[(y * img.width + x) * 4] - bright);
    sw += w; sx += w * x; sy += w * y;
  }
  xs.push(sx / sw / dpr); ys.push(sy / sw / dpr); ts.push(ms);
}
await browser.close();
const d = xs.slice(1).map((v, i) => v - xs[i]);
const mean = d.reduce((a, b) => a + b, 0) / d.length, sd = Math.sqrt(d.reduce((a, b) => a + (b - mean) * (b - mean), 0) / d.length);
const still = d.filter((v) => Math.abs(v) < Math.abs(mean) * 0.15).length, big = d.filter((v) => Math.abs(v) > Math.abs(mean) * 3).length;
// how far the place strays from a straight glide (the best line through it)
const n = xs.length, tm = (n - 1) / 2, xm = xs.reduce((a, b) => a + b, 0) / n;
let sxy = 0, sxx = 0; xs.forEach((v, i) => { sxy += (i - tm) * (v - xm); sxx += (i - tm) * (i - tm); });
const slope = sxy / sxx, off = xs.map((v, i) => v - (xm + slope * (i - tm))), worst = Math.max(...off.map(Math.abs));
console.log(`${side} ${framing} ${W}x${H}@${dpr}x${f.gpu ? " (real GPU)" : f.headed ? " (headed)" : ""}, box ${bx},${by},${bw},${bh}, ${from}..${to} ms at ${fps} a second: ${n} steps`);
console.log(`  it moves ${mean.toFixed(4)} px a step (${(mean * fps).toFixed(2)} px/s); the steps vary by ${sd.toFixed(4)} px (${(100 * sd / Math.abs(mean)).toFixed(0)} % of a step)`);
console.log(`  steps in which it barely moved: ${still} of ${d.length}; steps of three times the usual or more: ${big}`);
console.log(`  furthest from a straight glide: ${worst.toFixed(3)} px`);
console.log(`  the first steps: ${d.slice(0, 24).map((v) => v.toFixed(3)).join(" ")}`);
if (f.csv) fs.writeFileSync(f.csv, ts.map((t, i) => `${t.toFixed(1)},${xs[i].toFixed(4)},${ys[i].toFixed(4)}`).join("\n"));
