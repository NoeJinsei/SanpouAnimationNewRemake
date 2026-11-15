// Does the site's real player (hero-glue.js of a side) play the two seams as camera moves?
//   node tools/check-seams.mjs [side=round2] [--framing=phone|desktop]
// Runs the real player in real time and looks at the stage itself at moments round the two scene changes:
//   02 -> 03 (14600 ms on): the street and the expressway are both drawn while the picture changes, in one stage;
//   03 -> 04 (21800 ms on): the expressway goes down in its slot while the map comes down in its own, both with
//            a transform, in ONE stage (no second stage fading above it), and the road's slot is emptied after.
// Then two navigations by hand: a click on 04 from 03's hold plays the same move; a click back to 02 dissolves.
// Prints what it saw and exits 1 if a seam is not a move or a console error was seen.
import { launch, BASE } from "./pw.mjs";

const args = process.argv.slice(2), flags = {};
const pos = args.filter((x) => { const m = /^--(\w+)=(.*)$/.exec(x); if (m) flags[m[1]] = m[2]; return !m; });
const side = pos[0] || "round2", framing = flags.framing || "phone";
const VIEW = framing === "phone" ? { width: 390, height: 844 } : { width: 1440, height: 900 };

const browser = await launch();
const page = await browser.newPage({ viewport: VIEW });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
await page.goto(`${BASE}/viewer/frame.html?side=${side}&framing=site&player=glue`);
await page.waitForFunction(() => document.querySelectorAll("#sjxStage svg").length > 0);
const t0 = Date.now();
// what the stage holds right now: per slot (w, t, n) whether it has content and its transform / opacity, and
// whether a second stage is fading above it
const look = () => page.evaluate(() => {
  const st = document.getElementById("sjxStage"), out = {};
  ["w", "t", "n"].forEach((f, i) => {
    const sl = st.children[i], s = sl.getAttribute("style") || "";
    out[f] = !sl.firstChild || /display:\s*none/.test(s) ? "-" : (/translate3d\(([^)]*)\)/.exec(s) || [0, ""])[1].split(",")[1] || (/opacity:\s*([\d.]+)/.exec(s) || [0, "shown"])[1];
  });
  out.fading = [...document.querySelectorAll("#sjxFit > div")].filter((d) => d !== st && d.style.visibility !== "hidden" && d.style.opacity !== "").length;
  // the scene the controls mark as current (the caption's own text follows it 0.3 s later)
  out.scene = "0" + (1 + [...document.querySelectorAll("#sjxIndex button")].findIndex((b) => b.getAttribute("aria-current") === "true"));
  return out;
});
const at = async (ms) => { await page.waitForTimeout(Math.max(0, ms - (Date.now() - t0))); return look(); };
let bad = 0;
const say = (ok, what, v) => { if (!ok) bad++; console.log(`${ok ? "ok  " : "FAIL"} ${what}: ${JSON.stringify(v)}`); };

let v = await at(14300); say(v.w !== "-" && (v.t === "-" || v.t === "0") && v.scene === "02", "02 holds (street only; the expressway may be built ahead, unseen, at opacity 0)", v);
v = await at(15620); say(v.w !== "-" && v.t !== "-", "02 -> 03, the change of picture (street and expressway together)", v);
v = await at(16300); say(v.w === "-" && v.t !== "-" && v.scene === "03", "03 after the change (expressway only)", v);
v = await at(22150); say(v.t.endsWith("px") && v.n.endsWith("px") && !v.fading, "03 -> 04, the rise (road going down, map coming down, one stage)", v);
v = await at(23200); say(v.t === "-" && v.n !== "-" && v.scene === "04" && !v.fading, "04 after the rise (map only)", v);
// by hand: back to 03 (a jump: dissolve), wait for its hold, then forward to 04 (the move again)
await page.click("#sjxIndex li:nth-child(3) button"); await page.waitForTimeout(250);
v = await look(); say(v.fading === 1 && v.scene === "03", "click back to 03: a dissolve", v);
await page.waitForTimeout(1500);
await page.click("#sjxIndex li:nth-child(4) button"); await page.waitForTimeout(350);
v = await look(); say(v.t.endsWith("px") && v.n.endsWith("px") && !v.fading, "click on to 04 from 03's hold: the rise", v);
await page.waitForTimeout(1200);
v = await look(); say(v.t === "-" && v.n !== "-" && v.scene === "04", "04 after it", v);
await browser.close();
if (errors.length) { console.log("console errors:\n  " + [...new Set(errors)].join("\n  ")); bad++; }
console.log(bad ? `\n${bad} problem(s)` : `\nthe real player plays both seams as camera moves (${side}, ${framing})`);
process.exit(bad ? 1 : 0);
