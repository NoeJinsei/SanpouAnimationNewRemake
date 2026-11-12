// Measures how smoothly one side plays, the way the site would play it: the clock advances in real time
// and the picture is redrawn on every animation frame, with the processor slowed down to stand in for a phone.
//   node tools/perf-side.mjs <side> [--framing=phone|desktop|full] [--from=0] [--to=45800] [--throttle=4] [--dpr=2] [--json]
// Reports frame intervals (what the eye gets) and the time spent drawing (script only for the DOM engine;
// style, layout and paint come on top and show up in the frame intervals).
import { launch, BASE } from "./pw.mjs";

const args = process.argv.slice(2), flags = {};
const pos = args.filter((x) => { const m = /^--(\w+)(?:=(.*))?$/.exec(x); if (m) flags[m[1]] = m[2] == null ? true : m[2]; return !m; });
const side = pos[0] || "original", framing = flags.framing || "phone";
const from = +(flags.from || 0), to = +(flags.to || 45800), throttle = +(flags.throttle || 4);
const VIEW = { phone: { w: 390, h: 844, dpr: 2, f: "site" }, desktop: { w: 1440, h: 900, dpr: 1, f: "site" }, full: { w: 1920, h: 1080, dpr: 1, f: "stage" } }[framing];
const dpr = +(flags.dpr || VIEW.dpr);

// a real GPU where the machine has one: new-headless Chrome with GPU raster, as a phone would raster on its GPU
const browser = await launch({ channel: "chrome", headless: true, args: ["--headless=new", "--enable-gpu", "--ignore-gpu-blocklist", "--enable-gpu-rasterization", "--use-angle=d3d11", "--disable-frame-rate-limit=false"] });
const ctx = await browser.newContext({ viewport: { width: VIEW.w, height: VIEW.h }, deviceScaleFactor: dpr });
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
await page.goto(`${BASE}/viewer/frame.html?side=${encodeURIComponent(side)}&framing=${VIEW.f}`);
await page.waitForFunction(() => window.heroFrame && (window.heroFrame.seek || window.heroFrame.error), null, { timeout: 30000 });
if (await page.evaluate(() => !!window.heroFrame.error)) { console.log("side did not start:", await page.evaluate(() => window.heroFrame.error)); await browser.close(); process.exit(1); }
await page.evaluate(() => document.fonts.ready);
const gpu = await page.evaluate(() => { try { const c = document.createElement("canvas").getContext("webgl"); const e = c.getExtension("WEBGL_debug_renderer_info"); return e ? c.getParameter(e.UNMASKED_RENDERER_WEBGL) : "unknown"; } catch (e) { return "none"; } });
// warm up (first calls compile the scene functions), then slow the processor down
await page.evaluate(([a, b]) => { for (let t = a; t < b; t += 400) window.heroFrame.seek(t); window.heroFrame.seek(a); }, [from, to]);
const cdp = await ctx.newCDPSession(page);
if (throttle > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: throttle });

const r = await page.evaluate(([a, b]) => new Promise((done) => {
  const gaps = [], costs = []; let t = a, prev = 0;
  function tick(ts) {
    if (prev) { const dt = ts - prev; gaps.push(dt); t += Math.min(dt, 100); }
    prev = ts;
    if (t >= b) return done({ gaps, costs });
    costs.push(window.heroFrame.seek(t));
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}), [from, to]);
await browser.close();

const sorted = (v) => [...v].sort((x, y) => x - y), q = (v, p) => { const s = sorted(v); return s[Math.min(s.length - 1, Math.floor(s.length * p))]; };
const mean = (v) => v.reduce((x, y) => x + y, 0) / v.length;
const out = {
  side, framing, throttle, dpr, gpu, from, to, frames: r.gaps.length,
  fps: +(1000 / mean(r.gaps)).toFixed(1),
  frameMs: { median: +q(r.gaps, 0.5).toFixed(1), p95: +q(r.gaps, 0.95).toFixed(1), worst: +Math.max(...r.gaps).toFixed(1) },
  // a frame that takes longer than 16.7 ms would be a dropped frame on a 60 Hz phone screen
  over16Pct: +(r.gaps.filter((g) => g > 16.7).length / r.gaps.length * 100).toFixed(1),
  over33Pct: +(r.gaps.filter((g) => g > 33.4).length / r.gaps.length * 100).toFixed(1),
  drawMs: { mean: +mean(r.costs).toFixed(2), p95: +q(r.costs, 0.95).toFixed(2), worst: +Math.max(...r.costs).toFixed(2) },
  errors: [...new Set(errors)]
};
if (flags.json) console.log(JSON.stringify(out));
else console.log(`${side} · ${framing} @${dpr}x · CPU ${throttle}x slower · ${gpu}\n  ${out.frames} frames over ${((to - from) / 1000).toFixed(1)} s: ${out.fps} fps; frame time median ${out.frameMs.median} ms, 95% under ${out.frameMs.p95} ms, worst ${out.frameMs.worst} ms; frames over 16.7 ms: ${out.over16Pct} %, over 33 ms: ${out.over33Pct} %\n  drawing: mean ${out.drawMs.mean} ms, 95% under ${out.drawMs.p95} ms, worst ${out.drawMs.worst} ms` + (errors.length ? `\n  errors: ${out.errors.join(" | ")}` : ""));
if (errors.length) process.exit(1);
