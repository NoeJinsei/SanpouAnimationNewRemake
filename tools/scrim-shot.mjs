// The hero's left-hand copy wash (.hc-scrim::before), shot in several strengths so it can be judged.
//   node tools/scrim-shot.mjs <side> <outDir> [--framing=desktop|phone] [--times=3500,10500]
// Writes <outDir>/<state>-t<ms>.png for every state in STATES.
import fs from "node:fs";
import path from "node:path";
import { launch, BASE } from "./pw.mjs";

const args = process.argv.slice(2), flags = {};
const pos = args.filter((x) => { const m = /^--(\w+)(?:=(.*))?$/.exec(x); if (m) flags[m[1]] = m[2] == null ? true : m[2]; return !m; });
const side = pos[0] || "round2", out = pos[1] || "shots/scrim", framing = flags.framing || "desktop";
const VIEW = { phone: { w: 390, h: 844, dpr: 2 }, desktop: { w: 1440, h: 900, dpr: 1 } }[framing];
const times = String(flags.times || "3500,10500,18000,32000").split(",").map(Number);
const only = flags.states ? String(flags.states).split(",") : null;

const W = "238, 246, 251";
const STATES = {
  // the two that matter now: the site's behaviour as it was, and the side as it stands
  "before": `#sanpou-journey.copy-out .hc-scrim::before { opacity: 1 !important; }
    #sanpou-journey.copy-out.on-sign .hc-scrim-sign { opacity: 1 !important; }
    #sanpou-journey.copy-out:not(.on-map) :is(.hc-title, .hc-sub, .hc-tag) { opacity: 1 !important; }`,
  "after": "",
  "as-is": "",
  "off": `#sanpou-journey .hc-scrim::before { background: none !important; }`,
  "half-reach": `#sanpou-journey .hc-scrim::before { background: linear-gradient(90deg, rgba(${W},.86) 0%, rgba(${W},.70) 19%, rgba(${W},0) 36%) !important; }`,
  "softer": `#sanpou-journey .hc-scrim::before { background: linear-gradient(90deg, rgba(${W},.62) 0%, rgba(${W},.40) 38%, rgba(${W},0) 66%) !important; }`,
  "half-and-softer": `#sanpou-journey .hc-scrim::before { background: linear-gradient(90deg, rgba(${W},.72) 0%, rgba(${W},.48) 19%, rgba(${W},0) 36%) !important; }`,
  // a pale panel that hugs the copy instead of a wash down the whole left side
  "panel": `#sanpou-journey .hc-scrim::before { background: none !important; }
    #sanpou-journey .hc-content { max-width: 788px; }
    #sanpou-journey .hc-content::before { content: ""; position: absolute; inset: -28px -32px -24px -32px;
      background: rgba(${W}, .9); border-radius: 18px; z-index: -1; }`,
  // what the film looks like once the copy has gone (the site already does this on scene 04)
  "copy-fades": `#sanpou-journey .hc-scrim::before { background: none !important; }
    #sanpou-journey :is(.hc-title, .hc-sub, .hc-tag) { opacity: 0 !important; }`,
};

fs.mkdirSync(out, { recursive: true });
const browser = await launch();
const page = await browser.newPage({ viewport: { width: VIEW.w, height: VIEW.h }, deviceScaleFactor: VIEW.dpr });
await page.goto(`${BASE}/viewer/frame.html?side=${encodeURIComponent(side)}&framing=site`);
await page.waitForFunction(() => window.heroFrame && (window.heroFrame.seek || window.heroFrame.error), null, { timeout: 30000 });
await page.evaluate(() => document.fonts.ready);
const hero = await page.$("#sanpou-journey");
let n = 0;
for (const [state, css] of Object.entries(STATES)) {
  if (only && !only.includes(state)) continue;
  await page.evaluate((c) => {
    let el = document.getElementById("scrimState");
    if (!el) { el = document.createElement("style"); el.id = "scrimState"; document.head.appendChild(el); }
    el.textContent = c;
  }, css);
  for (const t of times) {
    await page.evaluate((ms) => window.heroFrame.seek(ms), t);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    await hero.screenshot({ path: path.join(out, `${state}-t${String(t).padStart(5, "0")}.png`) });
    n++;
  }
}
await browser.close();
console.log(`${n} stills (${Object.keys(STATES).length} states x ${times.length} moments, ${framing}) in ${out}`);
