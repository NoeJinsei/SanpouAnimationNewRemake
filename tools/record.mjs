// Records a side as a video file, frame by frame on the site clock (so it is exact, not a screen capture).
//   node tools/record.mjs <side> <out.mp4> [--framing=full|desktop|phone] [--from=0 --to=45800] [--fps=30] [--width=1920] [--crf=20]
// Screenshots are piped straight into ffmpeg, so nothing large is written to disk.
import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import { launch, BASE } from "./pw.mjs";

const args = process.argv.slice(2), flags = {};
const pos = args.filter((x) => { const m = /^--(\w+)(?:=(.*))?$/.exec(x); if (m) flags[m[1]] = m[2] == null ? true : m[2]; return !m; });
const side = pos[0] || "remake", out = pos[1] || `shots/${side}.mp4`, framing = flags.framing || "full";
const from = +(flags.from || 0), to = +(flags.to || 45800), fps = +(flags.fps || 30), crf = +(flags.crf || 20);
const VIEW = { full: { w: 1920, h: 1080, f: "stage" }, desktop: { w: 1440, h: 900, f: "site" }, phone: { w: 390, h: 844, f: "site" } }[framing];
const width = +(flags.width || VIEW.w);
fs.mkdirSync(path.dirname(out) || ".", { recursive: true });

const browser = await launch();
const page = await browser.newPage({ viewport: { width: VIEW.w, height: VIEW.h } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
await page.goto(`${BASE}/viewer/frame.html?side=${encodeURIComponent(side)}&framing=${VIEW.f}`);
await page.waitForFunction(() => window.heroFrame && (window.heroFrame.seek || window.heroFrame.error), null, { timeout: 30000 });
if (await page.evaluate(() => !!window.heroFrame.error)) { console.log("side did not start:", await page.evaluate(() => window.heroFrame.error)); await browser.close(); process.exit(1); }
await page.evaluate(() => document.fonts.ready);
const shot = await page.$(framing === "full" ? "#sanpou-journey" : "#sanpou-journey");

// even dimensions, which h264 needs
const scale = width === VIEW.w ? "scale=trunc(iw/2)*2:trunc(ih/2)*2" : `scale=${Math.round(width / 2) * 2}:-2`;
const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(fps), "-i", "-",
  "-vf", scale, "-c:v", "libx264", "-preset", "medium", "-crf", String(crf), "-pix_fmt", "yuv420p", "-movflags", "+faststart", out],
  { stdio: ["pipe", "inherit", "inherit"] });
const write = (buf) => new Promise((ok) => (ff.stdin.write(buf) ? ok() : ff.stdin.once("drain", ok)));

const total = Math.round((to - from) / 1000 * fps);
const t0 = Date.now();
for (let i = 0; i < total; i++) {
  const ms = from + (i / fps) * 1000;
  await page.evaluate((v) => window.heroFrame.seek(v), ms);
  await write(await shot.screenshot({ type: "png" }));
  if (i % 120 === 0) process.stdout.write(`\r  ${i}/${total} frames (${((Date.now() - t0) / 1000).toFixed(0)}s)   `);
}
ff.stdin.end();
await new Promise((ok) => ff.on("close", ok));
await browser.close();
const mb = (fs.statSync(out).size / 1048576).toFixed(1);
console.log(`\n${side} ${framing}: ${total} frames at ${fps} fps -> ${out} (${mb} MB, ${((to - from) / 1000).toFixed(1)} s)`);
if (errors.length) { console.log("console errors:\n  " + [...new Set(errors)].join("\n  ")); process.exit(1); }
