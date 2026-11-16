// The hero's live copy, swapped for alternatives and shot in place, so wording is judged on the picture
// and not as text in a chat. The site's own files are never touched: the words are put into the page
// after it loads.
//   node tools/copy-shot.mjs <side> <sets.json> <outDir> [--framing=desktop|phone] [--at=3500]
// sets.json: [ { "id": "now", "label": "...", "title": ["line 1", "line 2"], "tag": "...", "sub": "..." } ]
// Title lines and tag/sub may carry HTML (the site's <span class="nw"> keeps a phrase from breaking).
// Writes <outDir>/<id>.png, and prints each headline line's width against the room a 390 px phone has.
import fs from "node:fs";
import path from "node:path";
import { launch, BASE } from "./pw.mjs";

const args = process.argv.slice(2), flags = {};
const pos = args.filter((x) => { const m = /^--(\w+)(?:=(.*))?$/.exec(x); if (m) flags[m[1]] = m[2] == null ? true : m[2]; return !m; });
const side = pos[0] || "round2", setsFile = pos[1], out = pos[2] || "shots/copy", framing = flags.framing || "desktop";
if (!setsFile) { console.log("usage: node tools/copy-shot.mjs <side> <sets.json> <outDir> [--framing=] [--at=]"); process.exit(2); }
const VIEW = { phone: { w: 390, h: 844, dpr: 2 }, desktop: { w: 1440, h: 900, dpr: 1 } }[framing];
const at = +(flags.at || 3500);                       // inside scene 01, where the copy is up
const sets = JSON.parse(fs.readFileSync(setsFile, "utf8"));
const ROOM = 390 - 16 * 2;                            // a 390 px phone, both gutters

fs.mkdirSync(out, { recursive: true });
const browser = await launch();
const page = await browser.newPage({ viewport: { width: VIEW.w, height: VIEW.h }, deviceScaleFactor: VIEW.dpr });
await page.goto(`${BASE}/viewer/frame.html?side=${encodeURIComponent(side)}&framing=site`);
await page.waitForFunction(() => window.heroFrame && (window.heroFrame.seek || window.heroFrame.error), null, { timeout: 30000 });
await page.evaluate(() => document.fonts.ready);
await page.evaluate((ms) => window.heroFrame.seek(ms), at);
const hero = await page.$("#sanpou-journey");

for (const s of sets) {
  const widths = await page.evaluate((set) => {
    const q = (sel) => document.querySelector(sel);
    const t = q(".hc-title");
    if (set.title) t.innerHTML = set.title.map((l) => '<span class="hc-line">' + l + "</span>").join("");
    if (set.tag != null) q(".hc-tag").innerHTML = set.tag;
    if (set.sub != null) q(".hc-sub").innerHTML = set.sub;
    // measure each headline line as a 390 px phone would draw it: 6.6vw, the site's own clamp
    const probe = document.createElement("span");
    const cs = getComputedStyle(t);
    probe.style.cssText = `position:fixed;left:-9999px;top:0;white-space:nowrap;font-weight:${cs.fontWeight};`
      + `font-family:${cs.fontFamily};letter-spacing:.02em;font-size:${Math.min(30, Math.max(21, 390 * 0.066))}px`;
    document.body.appendChild(probe);
    const w = [...t.querySelectorAll(".hc-line")].map((l) => { probe.textContent = l.textContent; return Math.round(probe.getBoundingClientRect().width); });
    probe.remove();
    return { w, chars: [...t.querySelectorAll(".hc-line")].map((l) => l.textContent.length) };
  }, s);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await hero.screenshot({ path: path.join(out, `${s.id}.png`) });
  const over = widths.w.some((w) => w > ROOM);
  console.log(`${over ? "WIDE" : "ok  "} ${s.id.padEnd(6)} headline lines: `
    + widths.w.map((w, i) => `${widths.chars[i]} chars, ${w}px`).join("   |   ") + `   (a 390 px phone has ${ROOM}px)`);
}
await browser.close();
console.log(`\n${sets.length} shots (${framing}) in ${out}`);
