// The hero shot under a PROPOSED LAYOUT: an extra stylesheet on top of the site's own, and optionally
// different words, so a placement is judged on the picture. The site's files are never touched: the CSS is
// injected into the page after it loads and the words are put in after that.
//   node tools/layout-shot.mjs <side> <layouts.json> <outDir> [--framing=desktop|phone] [--at=3500]
// layouts.json: [ { "id", "label", "cssFile": "path", "css": "inline css", "title": ["l1","l2"], "tag", "sub" } ]
//   cssFile and css are both optional and both applied, cssFile first. Leave them out for the hero as it is.
//   title/tag/sub are optional; leave them out to keep the words the side already has.
// Writes <outDir>/<id>.png, and prints the stage box each layout produced plus which part of the 1920x1080
// film it shows, because changing the box changes the crop and the film is composed for a known crop.
import fs from "node:fs";
import path from "node:path";
import { launch, BASE } from "./pw.mjs";

const args = process.argv.slice(2), flags = {};
const pos = args.filter((x) => { const m = /^--(\w+)(?:=(.*))?$/.exec(x); if (m) flags[m[1]] = m[2] == null ? true : m[2]; return !m; });
const side = pos[0] || "round2", setsFile = pos[1], out = pos[2] || "shots/layout", framing = flags.framing || "desktop";
if (!setsFile) { console.log("usage: node tools/layout-shot.mjs <side> <layouts.json> <outDir> [--framing=] [--at=]"); process.exit(2); }
const VIEW = { phone: { w: 390, h: 844, dpr: 2 }, desktop: { w: 1440, h: 900, dpr: 1 } }[framing];
const at = +(flags.at || 3500);
const sets = JSON.parse(fs.readFileSync(setsFile, "utf8"));

fs.mkdirSync(out, { recursive: true });
const browser = await launch();

for (const s of sets) {
  // a fresh page per layout: injected CSS cannot be taken back out, and a half-removed layout would lie
  const page = await browser.newPage({ viewport: { width: VIEW.w, height: VIEW.h }, deviceScaleFactor: VIEW.dpr });
  await page.goto(`${BASE}/viewer/frame.html?side=${encodeURIComponent(side)}&framing=site`);
  await page.waitForFunction(() => window.heroFrame && (window.heroFrame.seek || window.heroFrame.error), null, { timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);

  if (s.cssFile) await page.addStyleTag({ content: fs.readFileSync(s.cssFile, "utf8") });
  if (s.css) await page.addStyleTag({ content: s.css });
  if (s.title || s.tag != null || s.sub != null) await page.evaluate((set) => {
    const q = (sel) => document.querySelector(sel);
    if (set.title) q(".hc-title").innerHTML = set.title.map((l) => '<span class="hc-line">' + l + "</span>").join("");
    if (set.tag != null) q(".hc-tag").innerHTML = set.tag;
    if (set.sub != null) q(".hc-sub").innerHTML = set.sub;
  }, s);

  // the stage refits through a ResizeObserver, which runs after the style change: give it two frames, then
  // seek again so the film is drawn at the asked-for moment INTO the box the layout just made
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await page.evaluate((ms) => window.heroFrame.seek(ms), at);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));

  const box = await page.evaluate(() => {
    const sb = document.querySelector(".hc-stagebox").getBoundingClientRect();
    // the scale lives on #sjxFit as data-scale; the translate is written on #sjxStage, not on the fit box
    const fit = document.getElementById("sjxFit"), stage = document.getElementById("sjxStage");
    const t = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)\s*scale\(([\d.]+)\)/.exec(stage.style.transform || "") || [];
    const sc = +(t[3] || 0) || parseFloat(fit.getAttribute("data-scale") || "0") || 0;
    return { w: Math.round(sb.width), h: Math.round(sb.height), sc, tx: +(t[1] || 0), ty: +(t[2] || 0) };
  });
  // which slice of the 1920x1080 stage the box shows, in stage pixels
  const sx = box.sc ? Math.round(-box.tx / box.sc) : 0, sy = box.sc ? Math.round(-box.ty / box.sc) : 0;
  const sw = box.sc ? Math.round(box.w / box.sc) : 0, sh = box.sc ? Math.round(box.h / box.sc) : 0;

  const hero = await page.$("#sanpou-journey");
  await hero.screenshot({ path: path.join(out, `${s.id}.png`) });
  console.log(`ok   ${String(s.id).padEnd(14)} stage box ${String(box.w).padStart(4)}x${String(box.h).padStart(4)} css px`
    + `   shows stage x ${sx}-${sx + sw}, y ${sy}-${sy + sh}   (of 1920x1080)`);
  await page.close();
}
await browser.close();
console.log(`\n${sets.length} shots (${framing}) in ${out}`);
