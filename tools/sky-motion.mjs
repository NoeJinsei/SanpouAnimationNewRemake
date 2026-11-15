// How the sky moves through the film: follows every cloud on the screen, frame by frame on the site clock, and
// says where one lurches (a speed far from its own drift), jumps (a step no smooth move would make) or pops
// (appears or goes in one frame while in view).
//   node tools/sky-motion.mjs <side> [--from=0 --to=48000 --fps=60 --framing=stage|site --w=1920 --h=1080 --detail]
// Clouds are the groups CloudField draws (`[data-sky] > g`). A cloud counts as seen when nothing above it in
// the page is hidden or fully transparent and part of it is inside the window.
import { launch, BASE } from "./pw.mjs";

const args = process.argv.slice(2), flags = {};
const pos = args.filter((x) => { const m = /^--(\w+)(?:=(.*))?$/.exec(x); if (m) flags[m[1]] = m[2] == null ? true : m[2]; return !m; });
const side = pos[0] || "round2", from = +(flags.from || 0), to = +(flags.to || 48000), fps = +(flags.fps || 60);
const framing = flags.framing || "stage", W = +(flags.w || (framing === "stage" ? 1920 : 1440)), H = +(flags.h || (framing === "stage" ? 1080 : 900));
const SCENES = [[0, 7000, "01"], [7000, 14600, "02"], [14600, 21800, "03"], [21800, 27800, "04"], [27800, 1e9, "05"]];
const sceneOf = (ms) => SCENES.find((s) => ms >= s[0] && ms < s[1])[2];

const browser = await launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.goto(`${BASE}/viewer/frame.html?side=${encodeURIComponent(side)}&framing=${framing}`);
await page.waitForFunction(() => window.heroFrame && (window.heroFrame.seek || window.heroFrame.error), null, { timeout: 30000 });

const n = Math.round((to - from) / 1000 * fps);
const track = new Map();           // key -> [{ i, x, y, o }]
for (let i = 0; i <= n; i++) {
  const ms = from + i * 1000 / fps;
  const seen = await page.evaluate((ms) => {
    window.heroFrame.seek(ms);
    const out = [], W = innerWidth, H = innerHeight;
    document.querySelectorAll("[data-sky]").forEach((field, fi) => {
      // is anything above this field hidden?
      let o = 1;
      for (let e = field; e && e.nodeType === 1; e = e.parentNode) {
        const cs = getComputedStyle(e);
        if (cs.display === "none" || cs.visibility === "hidden") { o = 0; break; }
        o *= +cs.opacity;
        const a = e.getAttribute && e.getAttribute("opacity");
        if (a != null && e !== field && e instanceof SVGElement && cs.opacity === "1") o *= +a;
      }
      if (o <= 0.001) return;
      // two stages can hold the same field while one scene gives way to the next: tell them apart by their order in the page
      const stage = [...document.querySelectorAll("[data-sky='" + field.getAttribute("data-sky") + "']")].indexOf(field);
      [...field.children].forEach((g, ci) => {
        const r = g.getBoundingClientRect(), own = +(g.getAttribute("opacity") || 1);
        if (r.right < 0 || r.left > W || r.bottom < 0 || r.top > H || !r.width) return;
        out.push({ k: field.getAttribute("data-sky") + "#" + ci + (stage ? "'" + stage : ""), x: r.left, y: r.top, o: o * own });
      });
    });
    return out;
  }, ms);
  for (const c of seen) { if (!track.has(c.k)) track.set(c.k, []); track.get(c.k).push({ i, x: c.x, y: c.y, o: c.o }); }
  if (i % 300 === 0) process.stderr.write(`\r  ${i}/${n}`);
}
await browser.close();
process.stderr.write("\r" + " ".repeat(20) + "\r");

const t = (i) => ((from + i * 1000 / fps) / 1000).toFixed(2);
const med = (a) => { const s = [...a].sort((p, q) => p - q); return s.length ? s[s.length >> 1] : 0; };
let flags_ = 0;
console.log(`${side}, ${framing} ${W}x${H}, ${from} to ${to} ms at ${fps} fps: ${track.size} clouds followed`);
for (const [k, pts] of [...track].sort()) {
  // runs of consecutive frames in view
  const runs = []; let run = [pts[0]];
  for (let j = 1; j < pts.length; j++) { if (pts[j].i === pts[j - 1].i + 1) run.push(pts[j]); else { runs.push(run); run = [pts[j]]; } }
  runs.push(run);
  for (const r of runs) {
    if (r.length < 4) continue;
    const vx = [], vy = [];
    for (let j = 1; j < r.length; j++) { vx.push((r[j].x - r[j - 1].x) * fps); vy.push((r[j].y - r[j - 1].y) * fps); }
    const sp = vx.map((v, j) => Math.hypot(v, vy[j]));
    // the cloud's own drift: its speed while the scene rests (the middle half of what it does)
    const rest = med(sp);
    let worstA = 0, worstAt = 0, jumps = [];
    for (let j = 1; j < sp.length; j++) {
      const a = Math.hypot(vx[j] - vx[j - 1], vy[j] - vy[j - 1]) * fps;      // px/s^2
      if (a > worstA) { worstA = a; worstAt = r[j].i; }
    }
    // a jump: one step far bigger than the steps either side of it
    for (let j = 1; j < sp.length - 1; j++) if (sp[j] > 60 && sp[j] > 4 * Math.max(sp[j - 1], sp[j + 1], 8)) jumps.push(r[j + 1].i);
    // a pop: the first or last frame of a run stands well inside the window at clear strength
    const a0 = r[0], a1 = r[r.length - 1];
    const popIn = a0.i > 0 && a0.o > 0.3, popOut = a1.i < n && a1.o > 0.3;
    // lurches: stretches where it goes more than 3 times its own drift (and more than 20 px/s)
    const lur = []; let s0 = -1;
    for (let j = 0; j <= sp.length; j++) {
      const fast = j < sp.length && sp[j] > Math.max(3 * rest, 20);
      if (fast && s0 < 0) s0 = j;
      if (!fast && s0 >= 0) { const seg = sp.slice(s0, j); lur.push(`${t(r[s0].i)}-${t(r[j].i)}s up to ${Math.max(...seg).toFixed(0)} px/s, ${Math.abs(r[j].x - r[s0].x).toFixed(0)} px`); s0 = -1; }
    }
    const scenes = [...new Set(r.map((p) => sceneOf(from + p.i * 1000 / fps)))].join("+");
    console.log(`  ${k.padEnd(14)} ${t(a0.i).padStart(6)}-${t(a1.i).padStart(5)}s  scene ${scenes.padEnd(8)} drift ${rest.toFixed(1).padStart(5)} px/s  hardest change ${worstA.toFixed(0).padStart(5)} px/s2 at ${t(worstAt)}s` +
      (jumps.length ? `  JUMPS at ${jumps.slice(0, 4).map(t).join(", ")}s` : "") + (popIn ? `  APPEARS at once (${a0.o.toFixed(2)})` : "") + (popOut ? `  GOES at once (${a1.o.toFixed(2)})` : ""));
    if (lur.length) console.log(`      faster than its drift: ${lur.join("; ")}`);
    flags_ += jumps.length;
    if (flags.detail) console.log("      x every 0.25 s: " + r.filter((p, j) => j % Math.round(fps / 4) === 0).map((p) => p.x.toFixed(0)).join(" "));
  }
}
console.log(flags_ ? `${flags_} jumps` : "no jumps");
