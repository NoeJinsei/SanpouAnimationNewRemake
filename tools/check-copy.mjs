// The hero's copy and its washes: up on the opening scene, gone while the film runs, back when it is
// paused, when the copy is focused, and under reduced motion. Driven through the site's REAL player.
//   node tools/check-copy.mjs [side=round2] [--framing=desktop|phone]
import { launch, BASE } from "./pw.mjs";

const args = process.argv.slice(2), flags = {};
const pos = args.filter((x) => { const m = /^--(\w+)=(.*)$/.exec(x); if (m) flags[m[1]] = m[2]; return !m; });
const side = pos[0] || "round2", framing = flags.framing || "desktop";
const VIEW = framing === "phone" ? { width: 390, height: 844 } : { width: 1440, height: 900 };

const op = (page, sel, pseudo) => page.evaluate(([s, p]) => {
  const el = document.querySelector(s); if (!el) return null;
  return +getComputedStyle(el, p || null).opacity;
}, [sel, pseudo || null]);
const cls = (page) => page.evaluate(() => document.getElementById("sanpou-journey").className);

let failed = 0;
const want = (name, got, lo, hi) => {
  const ok = got != null && got >= lo && got <= hi;
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${got == null ? "missing" : got.toFixed(2)} (wanted ${lo}..${hi})`);
};

const browser = await launch();
async function open(reduced) {
  const ctx = await browser.newContext({ viewport: VIEW, reducedMotion: reduced ? "reduce" : "no-preference" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  await page.goto(`${BASE}/viewer/frame.html?side=${encodeURIComponent(side)}&framing=site&player=glue`);
  await page.waitForFunction(() => window.heroFrame && (window.heroFrame.live || window.heroFrame.error), null, { timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  return { page, ctx, errors };
}
const settle = (page, ms) => page.waitForTimeout(ms);

console.log(`copy check: ${side} (${framing})\n`);

// 1 the opening scene: everything up
let { page, ctx, errors } = await open(false);
await settle(page, 700);
console.log("on the opening scene  [" + (await cls(page)) + "]");
want("  headline", await op(page, ".hc-title"), 0.95, 1);
want("  copy wash", await op(page, ".hc-scrim", "::before"), 0.95, 1);

// 2 the film moves on: the copy and both washes clear
await page.click("#sjxIndex li:nth-child(2) button");
await settle(page, 900);
console.log("on scene 02, playing  [" + (await cls(page)) + "]");
want("  headline", await op(page, ".hc-title"), 0, 0.02);
want("  sub", await op(page, ".hc-sub"), 0, 0.02);
want("  copy wash", await op(page, ".hc-scrim", "::before"), 0, 0.02);
if (framing === "desktop") want("  sign wash", await op(page, ".hc-scrim-sign"), 0, 0.02);
want("  dark band stays", await op(page, ".hc-scrim"), 0.95, 1);

// 3 paused: back
await page.click("#sjxPause");
await settle(page, 900);
console.log("paused on scene 02    [" + (await cls(page)) + "]");
want("  headline", await op(page, ".hc-title"), 0.95, 1);
want("  copy wash", await op(page, ".hc-scrim", "::before"), 0.95, 1);
if (framing === "desktop") want("  sign wash", await op(page, ".hc-scrim-sign"), 0.95, 1);

// 4 playing again, and the copy is focused by keyboard: back at once
await page.click("#sjxPause");
await settle(page, 900);
await page.focus(".hc-cta .btn");
await settle(page, 60);
console.log("playing, copy focused [" + (await cls(page)) + "]");
want("  headline", await op(page, ".hc-title"), 0.95, 1);
want("  copy wash", await op(page, ".hc-scrim", "::before"), 0.95, 1);
if (errors.length) { failed++; console.log("FAIL console errors:\n  " + [...new Set(errors)].join("\n  ")); }
await ctx.close();

// 5 reduced motion: the player stands on the last scene, paused, so the copy must be readable
({ page, ctx, errors } = await open(true));
await settle(page, 700);
console.log("reduced motion        [" + (await cls(page)) + "]");
want("  headline", await op(page, ".hc-title"), 0.95, 1);
want("  copy wash", await op(page, ".hc-scrim", "::before"), 0.95, 1);
if (errors.length) { failed++; console.log("FAIL console errors:\n  " + [...new Set(errors)].join("\n  ")); }
await ctx.close();

await browser.close();
console.log(failed ? `\ncopy check FAILED: ${failed} check(s)` : "\ncopy check OK");
process.exit(failed ? 1 : 0);
