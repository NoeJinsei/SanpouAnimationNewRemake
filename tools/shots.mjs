// Stills of one side at given moments on the site clock, and optionally a contact sheet of them.
//   node tools/shots.mjs <side> <outDir> [--framing=full|desktop|phone] [--times=6000,11000] [--from=0 --to=7000 --every=200] [--sheet=5] [--scale=480]
// Writes <outDir>/<side>-t<ms>.png; with --sheet=<columns> also <outDir>/<side>-sheet.jpg (tiles <scale> px wide).
// A frame every 1-2 s gives a contact sheet of a scene; every 200 ms gives a strip of one action.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { launch, BASE } from "./pw.mjs";

const args = process.argv.slice(2), flags = {};
const pos = args.filter((x) => { const m = /^--(\w+)(?:=(.*))?$/.exec(x); if (m) flags[m[1]] = m[2] == null ? true : m[2]; return !m; });
const side = pos[0] || "original", out = pos[1] || "shots/stills", framing = flags.framing || "full";
const VIEW = { phone: { w: 390, h: 844, dpr: 2, f: "site" }, desktop: { w: 1440, h: 900, dpr: 1, f: "site" }, full: { w: 1920, h: 1080, dpr: 1, f: "stage" } }[framing];
let times = flags.times ? String(flags.times).split(",").map(Number) : [];
if (!times.length) { const a = +(flags.from || 0), b = +(flags.to || 45800), e = +(flags.every || 1000); for (let t = a; t <= b; t += e) times.push(t); }
fs.mkdirSync(out, { recursive: true });
const name = side.replace(/[^\w.-]+/g, "_");

const browser = await launch();
const page = await browser.newPage({ viewport: { width: VIEW.w, height: VIEW.h }, deviceScaleFactor: VIEW.dpr });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
await page.goto(`${BASE}/viewer/frame.html?side=${encodeURIComponent(side)}&framing=${VIEW.f}`);
await page.waitForFunction(() => window.heroFrame && (window.heroFrame.seek || window.heroFrame.error), null, { timeout: 30000 });
if (await page.evaluate(() => !!window.heroFrame.error)) { console.log("side did not start:", await page.evaluate(() => window.heroFrame.error)); await browser.close(); process.exit(1); }
await page.evaluate(() => document.fonts.ready);
const hero = await page.$("#sanpou-journey"), files = [];
for (const t of times) {
  await page.evaluate((ms) => window.heroFrame.seek(ms), t);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const f = path.join(out, `${name}-t${String(t).padStart(5, "0")}.png`);
  await hero.screenshot({ path: f }); files.push(f);
}
await browser.close();
console.log(`${files.length} stills of ${side} (${framing}) in ${out}`);

if (flags.sheet) {
  const cols = +flags.sheet || 5, rows = Math.ceil(files.length / cols), w = +(flags.scale || 480);
  const list = path.join(out, `${name}-sheet.txt`), sheet = path.join(out, `${name}-sheet.jpg`);
  fs.writeFileSync(list, files.map((f) => `file '${path.resolve(f).replace(/\\/g, "/")}'\nduration 1`).join("\n") + "\n");
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", list, "-vf", `scale=${w}:-1,tile=${cols}x${rows}:padding=6:margin=6:color=0x2b2d30`, "-frames:v", "1", "-q:v", "3", sheet]);
  fs.unlinkSync(list);
  console.log("contact sheet: " + sheet);
}
if (errors.length) { console.log("console errors:\n  " + [...new Set(errors)].join("\n  ")); process.exit(1); }
