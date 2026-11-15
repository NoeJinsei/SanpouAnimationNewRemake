// Where does a frame's time go? Plays one side the way tools/perf-side.mjs does (real time, phone framing,
// the processor slowed down, the real GPU) while Chrome records a trace, and adds up the work per frame:
//   node tools/trace-side.mjs <side> [--framing=phone|desktop] [--from=0 --to=7000] [--throttle=4] [--top=0]
// Prints, in ms per drawn frame: script (the animation-frame callback), style (UpdateLayoutTree), layout,
// pre-paint, paint, layerize, commit on the page's main thread, and raster work on the raster threads.
// The DOM engine's cost is not its script: what the browser does after the script is in the other columns.
// --top=N also lists the N longest single tasks of each kind with their time in the run (hitches).
import { launch, BASE } from "./pw.mjs";

const args = process.argv.slice(2), flags = {};
const pos = args.filter((x) => { const m = /^--(\w+)(?:=(.*))?$/.exec(x); if (m) flags[m[1]] = m[2] == null ? true : m[2]; return !m; });
const side = pos[0] || "round2", framing = flags.framing || "phone";
const from = +(flags.from || 0), to = +(flags.to || 7000), throttle = +(flags.throttle || 4), top = +(flags.top || 0);
const VIEW = { phone: { w: 390, h: 844, dpr: 2, f: "site" }, desktop: { w: 1440, h: 900, dpr: 1, f: "site" }, full: { w: 1920, h: 1080, dpr: 1, f: "stage" } }[framing];

const browser = await launch({ channel: "chrome", headless: true, args: ["--headless=new", "--enable-gpu", "--ignore-gpu-blocklist", "--enable-gpu-rasterization", "--use-angle=d3d11", "--disable-frame-rate-limit=false"] });
const ctx = await browser.newContext({ viewport: { width: VIEW.w, height: VIEW.h }, deviceScaleFactor: VIEW.dpr });
const page = await ctx.newPage();
await page.goto(`${BASE}/viewer/frame.html?side=${encodeURIComponent(side)}&framing=${VIEW.f}`);
await page.waitForFunction(() => window.heroFrame && (window.heroFrame.seek || window.heroFrame.error), null, { timeout: 30000 });
await page.evaluate(() => document.fonts.ready);
await page.evaluate(([a, b]) => { for (let t = a; t < b; t += 400) window.heroFrame.seek(t); window.heroFrame.seek(a); }, [from, to]);
const cdp = await ctx.newCDPSession(page);
if (throttle > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: throttle });
await browser.startTracing(page, { categories: ["devtools.timeline", "disabled-by-default-devtools.timeline"] });
const frames = await page.evaluate(([a, b]) => new Promise((done) => {
  let t = a, prev = 0, n = 0;
  function tick(ts) {
    if (prev) t += Math.min(ts - prev, 100);
    prev = ts;
    if (t >= b) return done(n);
    window.heroFrame.seek(t); n++;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}), [from, to]);
const buf = await browser.stopTracing();
await browser.close();

const ev = JSON.parse(buf.toString()).traceEvents || [];
const KIND = {
  FireAnimationFrame: "script", UpdateLayoutTree: "style", Layout: "layout", PrePaint: "pre-paint", Paint: "paint",
  Layerize: "layerize", Commit: "commit", UpdateLayerTree: "layerize", RasterTask: "raster", "GPUTask": "gpu", ImageDecodeTask: "raster"
};
const sum = {}, long = {};
let t0 = Infinity;
for (const e of ev) if (e.ph === "X" && e.ts < t0) t0 = e.ts;
for (const e of ev) {
  if (e.ph !== "X" || !KIND[e.name]) continue;
  const k = KIND[e.name], ms = (e.dur || 0) / 1000;
  sum[k] = (sum[k] || 0) + ms;
  (long[k] = long[k] || []).push([ms, (e.ts - t0) / 1000]);
}
const order = ["script", "style", "layout", "pre-paint", "paint", "layerize", "commit", "raster", "gpu"];
const main = ["script", "style", "layout", "pre-paint", "paint", "layerize", "commit"].reduce((s, k) => s + (sum[k] || 0), 0);
console.log(`${side} · ${framing} · CPU ${throttle}x slower · ${from}..${to} ms · ${frames} frames (${(frames / ((to - from) / 1000)).toFixed(1)} fps)`);
console.log("  ms per frame: " + order.map((k) => `${k} ${((sum[k] || 0) / frames).toFixed(2)}`).join(" · "));
console.log(`  main thread, per frame: ${(main / frames).toFixed(2)} ms (of which script ${(100 * (sum.script || 0) / main).toFixed(0)} %)`);
if (top) for (const k of order) {
  const l = (long[k] || []).sort((a, b) => b[0] - a[0]).slice(0, top);
  if (l.length) console.log(`  longest ${k}: ` + l.map((x) => `${x[0].toFixed(1)} ms at ${(from + x[1]).toFixed(0)}`).join(", "));
}
