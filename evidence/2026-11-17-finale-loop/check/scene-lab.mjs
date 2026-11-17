// The scene code run without a browser.
//
// A side's scene functions are pure: they take a frame (and a clock) and return a description of the picture
// as nodes. So the picture at any moment can be worked out here, in Node, exactly and thousands of times a
// second, and two moments (or two versions of the code) can be compared node by node and number by number.
// This is what the browser checks cannot do: they compare photographs, a few at a time.
//
//   import { load, pictureAt, same, channels } from "./scene-lab.mjs";
//   const side = load("round2");                 // a side from sides.json, with the viewer's own clock
//   pictureAt(side, 31000)                       // what the player draws at 31000 ms: [{ scene, style, tree }]
//
// Used by loop-check.mjs (is the finale the same picture one turn later?), same-check.mjs (are scenes 01-04
// untouched by a change?) and step-check.mjs (does anything move in steps or jump?).
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

// load a side: its scene files and the viewer's clock (viewer/timeline.js), in a context of their own
export function load(id, opts = {}) {
  const sides = JSON.parse(fs.readFileSync(path.join(ROOT, "sides.json"), "utf8")).sides;
  const side = sides.find((s) => s.id === id);
  if (!side && !opts.base) throw new Error("no such side: " + id);
  const base = opts.base || side.base, scripts = opts.scripts || side.scripts;
  const sb = { console, Math, Date, JSON, Array, Object, String, Number, parseInt, parseFloat, isNaN, Float32Array, Uint8Array, Map, Set, Error, RegExp, Infinity, NaN };
  sb.window = sb; sb.globalThis = sb; sb.document = {};
  vm.createContext(sb);
  for (const f of scripts) vm.runInContext(fs.readFileSync(path.join(ROOT, base, f), "utf8"), sb, { filename: base + f });
  vm.runInContext(fs.readFileSync(path.join(ROOT, "viewer/timeline.js"), "utf8"), sb, { filename: "viewer/timeline.js" });
  if (side && side.schedule) sb.HeroTimeline.setSchedule(side.schedule);
  return { id, JP: sb.JourneyPort, S: sb.JourneyPort._scenes, TL: sb.HeroTimeline };
}

// what the player draws at a moment on the site clock: the layers, bottom first
export function pictureAt(side, ms) {
  const st = side.TL.stateAt(ms);
  return side.TL.layersFor(st).map((L) => ({ scene: L.scene, style: (L.opacity != null ? "opacity:" + L.opacity + ";" : "") + (L.style || ""), tree: side.S[L.scene](L.frame, L.time) }));
}

// a node as text: tag, attributes in a fixed order, children
export function text(v) {
  if (v == null) return "";
  if (typeof v === "string") return JSON.stringify(v);
  if (Array.isArray(v)) return v.map(text).join("");
  const a = v.a, keys = Object.keys(a).sort();
  let s = "<" + v.t;
  for (const k of keys) s += " " + k + "=" + JSON.stringify(a[k]);
  s += ">";
  for (const c of v.c) s += text(c);
  return s + "</" + v.t + ">";
}

function kids(v) { const out = []; (function flat(c) { if (c == null || c === false || c === true) return; if (Array.isArray(c)) c.forEach(flat); else out.push(c); })(v.c); return out; }
// a name for a node a person can find in the code: its place in the tree as "index:tag", with the name of any
// named group (data-cache, data-sky, an id, a clip) it passes through; the last five steps are kept
function nameOf(v) { const a = v.a || {}; return a["data-cache"] || a["data-sky"] || a["data-city"] || a.id || (a["clip-path"] ? "clip " + a["clip-path"] : ""); }
function step(v, i) {
  if (typeof v === "string") return i + ":text";
  const n = nameOf(v);
  return i + ":" + v.t + (n ? "(" + n + ")" : "") + (v.a.fill && /^#|^url/.test(v.a.fill) ? "[" + v.a.fill + "]" : "");
}
export function short(where) { const p = where.split("/"); return p.length > 6 ? "…/" + p.slice(-6).join("/") : where; }
// walk two descriptions of the same picture together and list where they differ
export function same(A, B, max = 40) {
  const out = [];
  (function walk(a, b, where, hid) {
    if (out.length >= max) return;
    if (typeof a === "string" || typeof b === "string") { if (a !== b) out.push({ where, attr: "text", a, b, hidden: hid }); return; }
    if (a === b) return;
    if (a.t !== b.t) { out.push({ where, attr: "tag", a: a.t, b: b.t, hidden: hid }); return; }
    const h2 = hid || a.a.display === "none" || /display:\s*none/.test(a.a.style || "");
    for (const k of new Set([...Object.keys(a.a), ...Object.keys(b.a)])) if (a.a[k] !== b.a[k]) out.push({ where, attr: k, a: a.a[k], b: b.a[k], hidden: h2 });
    const ka = kids(a), kb = kids(b);
    if (ka.length !== kb.length) { out.push({ where, attr: "children", a: ka.length, b: kb.length, hidden: h2 }); return; }
    for (let i = 0; i < ka.length; i++) walk(ka[i], kb[i], where + "/" + step(ka[i], i), h2);
  })(A, B, "", false);
  return out;
}

// every attribute of every node, as [where, attribute, value], in drawing order; hidden branches are marked
export function attrs(tree, prefix = "") {
  const out = [];
  // "hidden" = not in the picture: under display:none, or faded to nothing (its own strength times that of the groups above it)
  (function walk(v, where, hidden, op) {
    if (typeof v === "string") return;
    const a = v.a, st = a.style || "";
    const own = a.opacity != null ? +a.opacity : (/(?:^|;)opacity:([^;]*)/.exec(st) || [, 1])[1] * 1;
    const fo = a["fill-opacity"] != null ? +a["fill-opacity"] : 1;
    const op2 = op * (isNaN(own) ? 1 : own);
    const gone = hidden || a.display === "none" || /display:\s*none/.test(st) || op2 < 0.02;
    for (const k in a) out.push([where, k, a[k], gone || op2 * fo < 0.02]);
    const ks = kids(v);
    for (let i = 0; i < ks.length; i++) walk(ks[i], where + "/" + step(ks[i], i), gone, op2);
  })(tree, prefix, false, 1);
  return out;
}

// the numbers in an attribute, each with what kind of quantity it is
const NUM = /-?\d+(?:\.\d+)?(?:e-?\d+)?/g;
export function numbers(attr, value) {
  const out = [];
  if (attr === "transform" || (attr === "style" && /transform/.test(value))) {
    const src = attr === "style" ? (/transform:([^;]*)/.exec(value) || [, ""])[1] : value;
    for (const m of src.matchAll(/(translate[XY]?|scale|rotate)\(([^)]*)\)/g)) {
      const n = (m[2].match(NUM) || []).map(Number);
      n.forEach((x, i) => out.push([x, m[1].startsWith("translate") ? "pos" : m[1] === "scale" ? "scale" : i === 0 ? "rot" : "pos"]));
    }
    if (attr === "style") { const o = /(?:^|;)opacity:([^;]*)/.exec(value); if (o) out.push([+o[1], "alpha"]); }
    return out;
  }
  if (attr === "style") {
    const o = /(?:^|;)opacity:([^;]*)/.exec(value); if (o) out.push([+o[1], "alpha"]);
    for (const m of value.matchAll(/(?:^|;)(left|top|width|height):(-?[\d.]+)px/g)) out.push([+m[2], "pos"]);
    return out;
  }
  if (attr === "opacity" || attr === "fill-opacity" || attr === "stroke-opacity") return [[+value, "alpha"]];
  if (attr === "d" || attr === "points" || /^(x|y|cx|cy|r|rx|ry|width|height|x1|x2|y1|y2|stroke-dashoffset)$/.test(attr)) return (String(value).match(NUM) || []).map((x) => [Number(x), "pos"]);
  return out;
}

// Follow every number that changes through a stretch of the film.
//   times: the moments (ms) in order. Returns [{ where, attr, i, kind, hidden, v: Float64Array }]
// A path whose count of numbers changes from moment to moment (the birds: a wing's outline is written the other
// way round when it turns over) cannot be followed number by number; it is returned with v = null and `shape: true`.
export function channels(side, times, filter) {
  const live = new Map();                                    // "where|attr" -> true once its text has changed
  let prev = null;
  for (const ms of times) {                                  // pass 1: which attributes change at all
    const now = new Map();
    for (const L of pictureAt(side, ms)) {
      if (L.style) now.set(L.scene + "|layer-style", L.style);
      for (const [w, k, val] of attrs(L.tree, L.scene)) now.set(w + "|" + k, val);
    }
    if (prev) for (const [key, val] of now) if (prev.has(key) && prev.get(key) !== val) live.set(key, true);
    prev = now;
  }
  const series = new Map();
  times.forEach((ms, ti) => {                                // pass 2: their numbers
    for (const L of pictureAt(side, ms)) {
      const list = attrs(L.tree, L.scene);
      if (L.style) list.push([L.scene, "layer-style", L.style, false]);
      for (const [w, k, val, hid] of list) {
        const key = w + "|" + k;
        if (!live.has(key) || (filter && !filter(w, k))) continue;
        const n = numbers(k === "layer-style" ? "style" : k, val);
        let s = series.get(key);
        if (!s) { s = { where: w, attr: k, n: n.length, kinds: n.map((x) => x[1]), hidden: new Uint8Array(times.length), v: n.map(() => new Float64Array(times.length).fill(NaN)), shape: false, text: new Array(times.length) }; series.set(key, s); }
        s.hidden[ti] = hid ? 1 : 0; s.text[ti] = val.length > 140 ? val.slice(0, 140) : val;
        if (n.length !== s.n) { s.shape = true; continue; }
        for (let i = 0; i < n.length; i++) s.v[i][ti] = n[i][0];
      }
    }
  });
  return [...series.values()];
}

export function flags(argv) {
  const f = {}, pos = argv.filter((x) => { const m = /^--([\w-]+)(?:=(.*))?$/.exec(x); if (m) f[m[1]] = m[2] == null ? true : m[2]; return !m; });
  return { f, pos };
}
