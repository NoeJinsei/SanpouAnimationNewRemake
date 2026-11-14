// Overlap check for the three map depots and their name cards.
//   node overlap.mjs [side] [--from=21800 --to=29000 --every=100] [--framing=stage|site] [--w=1920 --h=1080 --dpr=1] [--verbose]
// For every sampled moment it reads, in screen px:
//   A. the VISIBLE box of each [data-depot] and [data-card] group: the union of its drawn shapes, stroke
//      included, shapes with no opacity or no size left out, text left out of cards (it is clipped to the plate);
//   B. the plain getBoundingClientRect() of the same groups (what a simple checker would read);
//   C. the boxes of the prefecture names on the map.
// It reports every pair of depot/card boxes that intersects (A and B separately), the smallest gap seen per
// pair, and any prefecture name touched by a depot or a card (while popping, and at rest).
import { launch, BASE } from "file:///C:/Users/RTX4070TI/Desktop/sanpou-hero-remake/tools/pw.mjs";

const args = process.argv.slice(2), flags = {};
const pos = args.filter((x) => { const m = /^--(\w+)(?:=(.*))?$/.exec(x); if (m) flags[m[1]] = m[2] == null ? true : m[2]; return !m; });
const side = pos[0] || "flat-cast";
const from = +(flags.from || 21800), to = +(flags.to || 29000), every = +(flags.every || 100);
const framing = flags.framing || "stage";
const W = +(flags.w || 1920), H = +(flags.h || 1080), DPR = +(flags.dpr || 1);

const browser = await launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: DPR });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
await page.goto(`${BASE}/viewer/frame.html?side=${encodeURIComponent(side)}&framing=${framing}`);
await page.waitForFunction(() => window.heroFrame && (window.heroFrame.seek || window.heroFrame.error), null, { timeout: 30000 });
await page.evaluate(() => document.fonts.ready);

const read = () => page.evaluate(() => {
  const out = { depots: {}, cards: {}, labels: [], naive: {}, cardText: {} };
  const opacityOf = (el) => { let op = 1, n = el; while (n && n.nodeType === 1) { const a = n.getAttribute("opacity"); if (a != null) op *= +a; const cs = n instanceof HTMLElement ? getComputedStyle(n).opacity : null; if (cs != null) op *= +cs; n = n.parentNode; } return op; };
  const leafBox = (el) => {
    const bb = el.getBBox(), m = el.getScreenCTM(); if (!m) return null;
    const st = el.getAttribute("stroke"), sw = st && st !== "none" ? (+el.getAttribute("stroke-width") || 1) / 2 : 0;
    if ((bb.width <= 1e-6 || bb.height <= 1e-6) && !(sw && (bb.width > 1e-6 || bb.height > 1e-6))) return null;
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    [[bb.x - sw, bb.y - sw], [bb.x + bb.width + sw, bb.y - sw], [bb.x - sw, bb.y + bb.height + sw], [bb.x + bb.width + sw, bb.y + bb.height + sw]].forEach(([x, y]) => {
      const X = m.a * x + m.c * y + m.e, Y = m.b * x + m.d * y + m.f; x0 = Math.min(x0, X); x1 = Math.max(x1, X); y0 = Math.min(y0, Y); y1 = Math.max(y1, Y);
    });
    return [x0, y0, x1, y1];
  };
  const groupBox = (g, skipText) => {
    if (opacityOf(g) < 0.01) return null;
    let b = null;
    g.querySelectorAll("rect,polygon,path,circle,ellipse,line" + (skipText ? "" : ",text")).forEach((el) => {
      if (el.closest("clipPath")) return; if (opacityOf(el) < 0.01) return;
      const q = leafBox(el); if (!q) return;
      b = b ? [Math.min(b[0], q[0]), Math.min(b[1], q[1]), Math.max(b[2], q[2]), Math.max(b[3], q[3])] : q;
    });
    if (b && (b[2] - b[0] < 0.05 || b[3] - b[1] < 0.05)) return null;
    return b;
  };
  const naive = (g) => { const r = g.getBoundingClientRect(); return r.width < 0.05 || r.height < 0.05 ? null : [r.left, r.top, r.right, r.bottom]; };
  let svg = null;
  document.querySelectorAll("[data-depot]").forEach((g) => { const id = g.getAttribute("data-depot"); svg = g.ownerSVGElement; out.depots[id] = groupBox(g, false); out.naive["depot:" + id] = naive(g); });
  document.querySelectorAll("[data-card]").forEach((g) => {
    const id = g.getAttribute("data-card"); out.cards[id] = groupBox(g, true); out.naive["card:" + id] = naive(g);
    const t = g.querySelector("text"); out.cardText[id] = t && opacityOf(t) >= 0.01 ? leafBox(t) : null;
  });
  if (svg) svg.querySelectorAll("text").forEach((t) => { if (t.closest("[data-card]")) return; if (opacityOf(t) < 0.05) return; const q = leafBox(t); if (q) out.labels.push({ nm: t.textContent, box: q }); });
  out.mapOpacity = svg ? opacityOf(svg) : 0;
  out.count = [document.querySelectorAll("[data-depot]").length, document.querySelectorAll("[data-card]").length];
  return out;
});

const inter = (a, b) => a && b ? Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1])) : 0;
const gap = (a, b) => { if (!a || !b) return Infinity; const dx = Math.max(a[0] - b[2], b[0] - a[2]), dy = Math.max(a[1] - b[3], b[1] - a[3]); return dx <= 0 && dy <= 0 ? Math.max(dx, dy) : dx > 0 && dy > 0 ? Math.hypot(dx, dy) : Math.max(dx, dy); };
const hitsA = [], hitsB = [], labelHits = [], minGap = {}, textOut = [];
let samples = 0, seen = { depots: 0, cards: 0 }, maxW = {};
for (let t = from; t <= to + 1e-6; t += every) {
  await page.evaluate((ms) => window.heroFrame.seek(ms), t);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const s = await read(); samples++;
  if (s.count[0] !== 3 || s.count[1] !== 3) { console.log(`t=${t}: found ${s.count[0]} depot groups and ${s.count[1]} card groups (expected 3 and 3)`); }
  const items = [];
  for (const id in s.depots) { items.push(["depot " + id, s.depots[id], s.naive["depot:" + id]]); if (s.depots[id]) { seen.depots++; maxW[id] = Math.max(maxW[id] || 0, s.depots[id][2] - s.depots[id][0]); } }
  for (const id in s.cards) { items.push(["card " + id, s.cards[id], s.naive["card:" + id]]); if (s.cards[id]) seen.cards++; }
  for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
    const k = items[i][0] + " / " + items[j][0];
    const a = inter(items[i][1], items[j][1]); if (a > 0.01) hitsA.push(`t=${t}  ${k}  overlap ${a.toFixed(1)} px2`);
    const b = inter(items[i][2], items[j][2]); if (b > 0.01) hitsB.push(`t=${t}  ${k}  overlap ${b.toFixed(1)} px2`);
    const g = gap(items[i][1], items[j][1]); if (g < (minGap[k] ? minGap[k][0] : Infinity)) minGap[k] = [g, t];
  }
  for (const L of s.labels) for (const it of items) { const a = inter(L.box, it[1]); if (a > 0.01) labelHits.push({ t, nm: L.nm, who: it[0], a }); }
  for (const id in s.cards) { const c = s.cards[id], x = s.cardText[id]; if (c && x && t >= 24100 && t <= 27800 && (x[0] < c[0] + 2 || x[2] > c[2] - 2)) textOut.push(`t=${t} text of ${id} is within 2 px of its plate's side (text ${x.map((v) => v.toFixed(1))} plate ${c.map((v) => v.toFixed(1))})`); if (t === 26000 && c && x) console.log(`   at rest: ${id} text x ${x[0].toFixed(1)}-${x[2].toFixed(1)} inside plate x ${c[0].toFixed(1)}-${c[2].toFixed(1)}`); }
  if (flags.verbose) console.log(t, JSON.stringify(items.map((q) => [q[0], q[1] && q[1].map((v) => +v.toFixed(1))])));
}
await browser.close();

console.log(`${side} (${framing} ${W}x${H}): ${samples} moments from ${from} to ${to} ms, every ${every} ms; depot boxes read ${seen.depots}, card boxes read ${seen.cards}`);
console.log("largest width of each depot on screen (px): " + Object.keys(maxW).map((k) => k + " " + maxW[k].toFixed(1)).join(", "));
console.log(`A. visible boxes: ${hitsA.length} intersecting pair-moments`); hitsA.slice(0, 40).forEach((x) => console.log("   " + x));
console.log(`B. plain getBoundingClientRect: ${hitsB.length} intersecting pair-moments`); hitsB.slice(0, 40).forEach((x) => console.log("   " + x));
console.log("smallest gap seen per pair (px, at ms):");
Object.keys(minGap).forEach((k) => console.log("   " + k.padEnd(34) + (minGap[k][0] === Infinity ? "never both on screen" : minGap[k][0].toFixed(1) + "  @" + minGap[k][1])));
const rest = labelHits.filter((x) => x.t >= 24100 && x.t <= 27800), pop = labelHits.filter((x) => x.t < 24100);
const sum = (arr) => { const m = {}; arr.forEach((x) => { const k = x.nm + " under " + x.who; m[k] = m[k] || { n: 0, a: 0, t0: x.t, t1: x.t }; m[k].n++; m[k].a = Math.max(m[k].a, x.a); m[k].t1 = x.t; }); return Object.keys(m).map((k) => `${k}: ${m[k].n} moments (${m[k].t0}-${m[k].t1} ms), up to ${m[k].a.toFixed(0)} px2`); };
console.log(`C. prefecture names touched while the depots arrive: ${pop.length ? "" : "none"}`); sum(pop).forEach((x) => console.log("   " + x));
console.log(`   prefecture names touched at rest (24100-27800 ms): ${rest.length ? "" : "none"}`); sum(rest).forEach((x) => console.log("   " + x));
if (textOut.length) { console.log("card text outside its plate:"); textOut.slice(0, 10).forEach((x) => console.log("   " + x)); }
if (errors.length) console.log("console errors:\n  " + [...new Set(errors)].join("\n  "));
process.exit(hitsA.length || hitsB.length || errors.length ? 1 : 0);
