// What does a frame change in the DOM? Steps one side through a stretch of the film at 60 steps a second and
// counts, per step, the attributes the patcher writes: which attribute, on what kind of element, under which
// cached group or top-level group. Paint and raster follow these writes, so this is where a scene's cost starts.
//   node tools/what-changes.mjs <side> --from=13000 --to=14000 [--top=14]
import { launch, BASE } from "./pw.mjs";
const args = process.argv.slice(2), flags = {};
const pos = args.filter((x) => { const m = /^--(\w+)(?:=(.*))?$/.exec(x); if (m) flags[m[1]] = m[2] == null ? true : m[2]; return !m; });
const side = pos[0] || "round2", from = +(flags.from || 0), to = +(flags.to || 1000), top = +(flags.top || 14);
const b = await launch(), p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto(`${BASE}/viewer/frame.html?side=${encodeURIComponent(side)}&framing=stage`);
await p.waitForFunction(() => window.heroFrame && window.heroFrame.seek);
const r = await p.evaluate(async ([a, z]) => {
  window.heroFrame.seek(a);
  const tally = {}; let steps = 0, writes = 0, added = 0;
  const where = (el) => {
    let e = el, tag = el.tagName, path = [];
    while (e && e.id !== "sjxStage") { const c = e.getAttribute && (e.getAttribute("data-cache") || e.getAttribute("data-sky") || e.getAttribute("data-city") || e.id); if (c) path.push(String(c).replace(/[-_ ].*$/, "")); e = e.parentNode; }
    return tag + " in " + (path.slice(-2).reverse().join("/") || "(scene)");
  };
  const mo = new MutationObserver((list) => { for (const m of list) { if (m.type === "attributes") { writes++; const k = m.attributeName + " on " + where(m.target); tally[k] = (tally[k] || 0) + 1; } else added += m.addedNodes.length + m.removedNodes.length; } });
  mo.observe(document.getElementById("sjxStage"), { attributes: true, childList: true, subtree: true });
  for (let t = a + 1000 / 60; t <= z; t += 1000 / 60) { window.heroFrame.seek(t); steps++; await Promise.resolve(); }
  mo.takeRecords(); mo.disconnect();
  return { steps, writes, added, tally };
}, [from, to]);
await b.close();
console.log(`${side} ${from}..${to} ms: ${(r.writes / r.steps).toFixed(1)} attribute writes a step, ${r.added} nodes added or removed in ${r.steps} steps`);
for (const [k, n] of Object.entries(r.tally).sort((x, y) => y[1] - x[1]).slice(0, top)) console.log(`  ${(n / r.steps).toFixed(1).padStart(6)}  ${k}`);
