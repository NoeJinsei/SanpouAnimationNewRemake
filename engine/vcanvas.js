/* VCanvas: paints the hero's virtual-node trees ({t, a, c} from h()) on a 2D canvas, matching what the
 * browser shows when JourneyPort.mount() turns the same tree into HTML + inline SVG.
 *
 * It is a general painter for the h() vocabulary, with no knowledge of any scene.
 *
 *   VCanvas.create(JP)  -> { scenes: { world, transit, network }, ready, stats() }
 *       scenes.x(ctx, frame, time, env) calls JP._scenes.x and paints the tree. ctx arrives with a base
 *       transform of one unit = one stage pixel (setTransform(res,0,0,res,tx,ty); any translation is
 *       honoured: the base is read once per frame with getTransform() and everything composes on it).
 *   VCanvas.render(ctx, tree, env)   paints any tree (used by the test pages).
 *
 * SUPPORTED
 *   HTML  div (and any other non-svg tag, treated as a div): position:absolute with inset / left / top /
 *         right / bottom / width / height (px or %); static boxes pass their containing block through.
 *         background: colour, linear-gradient(to <side> | <angle>, stops), radial-gradient([ellipse|circle]
 *         [W H | keyword] [at X Y], stops), several comma-separated layers. opacity (a box with children is
 *         composited as one picture), transform (translate/translateX/translateY/scale/scaleX/scaleY/rotate/
 *         matrix) with transform-origin, overflow:hidden, mask-image / -webkit-mask-image with ONE gradient
 *         layer, mix-blend-mode, display:none. Inline svg with width / height / viewBox
 *         (preserveAspectRatio xMidYMid meet|slice|none), clipped to its box like the UA stylesheet does.
 *   SVG   g, svg, defs, clipPath (shape children, userSpaceOnUse), linearGradient / radialGradient (stops,
 *         stop-color, stop-opacity, gradientUnits both kinds, gradientTransform, fx/fy, spread pad),
 *         mask (luminance, maskContentUnits userSpaceOnUse), rect (rx/ry), circle, ellipse, line, polygon,
 *         polyline, path (Path2D: the full path syntax), text (x, y, font-*, letter-spacing, text-anchor,
 *         text-rendering). Presentation attributes fill, stroke, stroke-width, stroke-dasharray,
 *         stroke-dashoffset, stroke-linecap, stroke-linejoin, stroke-miterlimit, fill-rule, opacity,
 *         fill-opacity, stroke-opacity, transform, clip-path, mask; style display / opacity / mix-blend-mode.
 *         Inheritance as in SVG. A group with opacity < 1 is painted to a scratch surface (limited to the
 *         device rectangle its content touched) and laid over as one picture, unless it provably holds one
 *         paint operation or children whose boxes do not overlap. A shape with fill AND stroke and
 *         opacity < 1 is isolated the same way. url(#id) resolves to the first element with that id in
 *         the tree being painted.
 *   Remake opt-ins  <g data-cache="key" data-box="x y w h"> renders the group once to a bitmap (LRU, at most
 *         64 MB of pixels) and re-renders only when the key, res, or the group's scale changes by more
 *         than 25 %; data-blur="px" on such a group blurs the bitmap once (ctx.filter, or a down/up-scale
 *         pass where ctx.filter is missing, e.g. Safari). mix-blend-mode screen|multiply|overlay|soft-light
 *         (any canvas composite name) on g / div / shapes.
 *
 * SPEED (what keeps a frame cheap; none of it changes what is drawn, except where said)
 *   Parsed transforms, styles, colours, dash arrays, Path2D objects and gradients are cached by string.
 *   Canvas state (matrix, fill, stroke, alpha, line style, font) is only set when it changes.
 *   Gradient sprites: a gradient-filled box is drawn from a cached bitmap (1-pixel strip for axis-aligned
 *     linear gradients: exact; quarter resolution for radial ones: within a level or two).
 *   Memoised groups: <g> objects the scene code hands back unchanged (learnt once at create(), never
 *     from history) are drawn from bitmaps at the current scale; at a fractional device offset the
 *     bitmap is resampled, softening edges by under a pixel (budget 96 MB, LRU).
 *   Opacity groups are drawn from a bitmap keyed by their content (attribute signature), so drifting
 *     clouds are not re-composited every frame; the same resampling note applies.
 *   Masked groups and fill+stroke shapes with opacity keep their composited pixels for the next frames
 *     when content and device matrix are unchanged (exactly the pixels the scratch surface gives).
 *   VCanvas.render(ctx, tree, env) without { memo: true } uses none of the bitmap layers but data-cache.
 *
 * DELIBERATELY NOT SUPPORTED (absent from the scenes): HTML text and flow layout, tspan / textPath, markers,
 *   patterns, filters, <use>, <image>, CSS mask with several layers, the mask region (x/y/width/height of
 *   <mask>; the mask is not clipped to it), SVG nested-svg overflow, ids shared between two different
 *   layers (the DOM resolves url(#id) across the whole document; here each tree resolves its own).
 *   A luminance mask is exact for non-overlapping mask shapes (each paint is turned into an alpha).
 */
(function (root) {
  "use strict";

  var PI2 = Math.PI * 2, DEG = Math.PI / 180;
  var HAS_LS = typeof CanvasRenderingContext2D !== "undefined" && "letterSpacing" in CanvasRenderingContext2D.prototype;
  var HAS_FILTER = typeof CanvasRenderingContext2D !== "undefined" && "filter" in CanvasRenderingContext2D.prototype;
  var HAS_TR = typeof CanvasRenderingContext2D !== "undefined" && "textRendering" in CanvasRenderingContext2D.prototype;

  /* ------------------------------------------------------------------ small caches */
  function Cache(limit) { this.m = new Map(); this.limit = limit; }
  Cache.prototype.get = function (k) { return this.m.get(k); };
  Cache.prototype.set = function (k, v) {
    if (this.m.size >= this.limit) { var it = this.m.keys(), n = this.limit >> 2; while (n--) this.m.delete(it.next().value); }
    this.m.set(k, v); return v;
  };
  var tfCache = new Cache(4000), cssTfCache = new Cache(1000), styleCache = new Cache(2000), pathCache = new Cache(3000),
    pointsCache = new Cache(1000), dashCache = new Cache(500), urlCache = new Cache(500), colorCache = new Cache(1000),
    gradCache = new Cache(400), cssBgCache = new Cache(300), fontCache = new Cache(300), textWCache = new Cache(2000);
  var isoMemo = new WeakMap();

  function num(v, d) { if (v == null || v === "") return d; var x = parseFloat(v); return x === x ? x : d; }

  /* ---------------------------------------------------------------------- matrices */
  // [a b c d e f] as in canvas setTransform; mul(o, m, n): o = m * n
  function mul(o, m, n) {
    var a = m[0] * n[0] + m[2] * n[1], b = m[1] * n[0] + m[3] * n[1], c = m[0] * n[2] + m[2] * n[3], d = m[1] * n[2] + m[3] * n[3],
      e = m[0] * n[4] + m[2] * n[5] + m[4], f = m[1] * n[4] + m[3] * n[5] + m[5];
    o[0] = a; o[1] = b; o[2] = c; o[3] = d; o[4] = e; o[5] = f; return o;
  }
  function mat(a, b, c, d, e, f) { return [a, b, c, d, e, f]; }
  function rotM(deg) { var r = deg * DEG, c = Math.cos(r), s = Math.sin(r); return [c, s, -s, c, 0, 0]; }
  function numsOf(s) { var out = [], re = /[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi, m; while ((m = re.exec(s))) out.push(+m[0]); return out; }

  function svgTransform(str) {
    var hit = tfCache.get(str); if (hit !== undefined) return hit;
    var M = [1, 0, 0, 1, 0, 0], re = /(\w+)\s*\(([^)]*)\)/g, m;
    while ((m = re.exec(str))) {
      var f = m[1], v = numsOf(m[2]), F = null;
      if (f === "translate") F = mat(1, 0, 0, 1, v[0] || 0, v[1] || 0);
      else if (f === "scale") F = mat(v[0], 0, 0, v.length > 1 ? v[1] : v[0], 0, 0);
      else if (f === "rotate") {
        F = rotM(v[0] || 0);
        if (v.length > 2) { mul(F, mat(1, 0, 0, 1, v[1], v[2]), F); mul(F, F, mat(1, 0, 0, 1, -v[1], -v[2])); }
      } else if (f === "matrix") F = v.slice(0, 6);
      else if (f === "skewX") F = mat(1, 0, Math.tan(v[0] * DEG), 1, 0, 0);
      else if (f === "skewY") F = mat(1, Math.tan(v[0] * DEG), 0, 1, 0, 0);
      if (F) mul(M, M, F);
    }
    if (M[0] === 1 && M[1] === 0 && M[2] === 0 && M[3] === 1 && M[4] === 0 && M[5] === 0) M = null;
    return tfCache.set(str, M);
  }
  function cssLen(s, ref) { s = String(s).trim(); var v = parseFloat(s); if (!(v === v)) return 0; return s.charAt(s.length - 1) === "%" ? v / 100 * ref : v; }
  function cssAngle(s) { var v = parseFloat(s); if (/rad/.test(s)) return v / DEG; if (/turn/.test(s)) return v * 360; if (/grad/.test(s)) return v * 0.9; return v; }
  function cssTransform(str, w, h) {
    var key = str + "|" + w + "|" + h, hit = cssTfCache.get(key); if (hit !== undefined) return hit;
    var M = [1, 0, 0, 1, 0, 0], re = /([\w]+)\s*\(([^)]*)\)/g, m;
    while ((m = re.exec(str))) {
      var f = m[1], p = m[2].split(","), F = null;
      if (f === "translate") F = mat(1, 0, 0, 1, cssLen(p[0], w), p.length > 1 ? cssLen(p[1], h) : 0);
      else if (f === "translateX") F = mat(1, 0, 0, 1, cssLen(p[0], w), 0);
      else if (f === "translateY") F = mat(1, 0, 0, 1, 0, cssLen(p[0], h));
      else if (f === "scale") { var sx = parseFloat(p[0]); F = mat(sx, 0, 0, p.length > 1 ? parseFloat(p[1]) : sx, 0, 0); }
      else if (f === "scaleX") F = mat(parseFloat(p[0]), 0, 0, 1, 0, 0);
      else if (f === "scaleY") F = mat(1, 0, 0, parseFloat(p[0]), 0, 0);
      else if (f === "rotate") F = rotM(cssAngle(p[0]));
      else if (f === "matrix") F = p.map(parseFloat);
      if (F) mul(M, M, F);
    }
    return cssTfCache.set(key, M);
  }

  /* ------------------------------------------------------------------------ colours */
  var NAMED = { black: [0, 0, 0, 1], white: [255, 255, 255, 1], transparent: [0, 0, 0, 0], none: [0, 0, 0, 0], red: [255, 0, 0, 1], gray: [128, 128, 128, 1], grey: [128, 128, 128, 1] };
  function parseColor(s) {
    var hit = colorCache.get(s); if (hit) return hit;
    var t = String(s).trim().toLowerCase(), c = NAMED[t], m;
    if (!c && t.charAt(0) === "#") {
      var x = t.slice(1);
      if (x.length === 3 || x.length === 4) x = x.replace(/./g, "$&$&");
      c = [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16), x.length === 8 ? parseInt(x.slice(6, 8), 16) / 255 : 1];
    } else if (!c && (m = /^rgba?\(([^)]*)\)/.exec(t))) {
      var v = numsOf(m[1]); c = [v[0], v[1], v[2], v.length > 3 ? (/%\s*\)?$/.test(m[1]) ? v[3] / 100 : v[3]) : 1];
    }
    return colorCache.set(s, c || [0, 0, 0, 1]);
  }
  function rgba(c) { return "rgba(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + "," + c[3] + ")"; }
  // a luminance mask turns every colour into an alpha (sRGB coefficients, as for color-interpolation:sRGB)
  function lumAlpha(s, extraA) { var c = parseColor(s); return "rgba(0,0,0," + ((0.2125 * c[0] + 0.7154 * c[1] + 0.0721 * c[2]) / 255 * c[3] * extraA) + ")"; }

  /* ------------------------------------------------------------------------- styles */
  function splitTop(s, sep) {
    var out = [], depth = 0, start = 0;
    for (var i = 0; i < s.length; i++) {
      var ch = s.charAt(i);
      if (ch === "(") depth++; else if (ch === ")") depth--;
      else if (ch === sep && depth === 0) { out.push(s.slice(start, i)); start = i + 1; }
    }
    out.push(s.slice(start)); return out;
  }
  function parseStyle(str) {
    var hit = styleCache.get(str); if (hit) return hit;
    var o = {}, parts = splitTop(str, ";");
    for (var i = 0; i < parts.length; i++) { var p = parts[i], k = p.indexOf(":"); if (k > 0) o[p.slice(0, k).trim().toLowerCase()] = p.slice(k + 1).trim(); }
    var bg = o.background || o["background-image"] || o["background-color"];
    o.$bg = bg ? splitTop(bg, ",").length && parseBgLayers(bg) : null;
    var mk = o["mask-image"] || o["-webkit-mask-image"];
    o.$mask = mk && mk !== "none" ? parseBgLayers(mk) : null;
    o.$op = o.opacity != null ? num(o.opacity, 1) : 1;
    o.$abs = o.position === "absolute" || o.position === "fixed";
    if (o.inset != null) { var iv = o.inset.split(/\s+/); o.$t = iv[0]; o.$r = iv[1] || iv[0]; o.$b = iv[2] || iv[0]; o.$l = iv[3] || iv[1] || iv[0]; }
    if (o.top != null) o.$t = o.top; if (o.right != null) o.$r = o.right; if (o.bottom != null) o.$b = o.bottom; if (o.left != null) o.$l = o.left;
    o.$blend = o["mix-blend-mode"] && o["mix-blend-mode"] !== "normal" ? o["mix-blend-mode"] : null;
    o.$hidden = o.display === "none" || o.visibility === "hidden";
    return styleCache.set(str, o);
  }

  /* ------------------------------------------------------------ CSS gradient layers */
  function parseStops(parts) {
    var st = [];
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i].trim(); if (!p) continue;
      var m = /^(.*?)(?:\s+(-?[\d.]+)(%|px)?)?(?:\s+(-?[\d.]+)(%|px)?)?$/.exec(p);
      var col = m[1].trim();
      if (m[2] != null) { st.push({ c: col, p: +m[2], u: m[3] || "%" }); if (m[4] != null) st.push({ c: col, p: +m[4], u: m[5] || "%" }); }
      else st.push({ c: col, p: null, u: "%" });
    }
    return st;
  }
  function parseBgLayers(bg) {
    var layers = splitTop(bg, ","), out = [];
    for (var i = 0; i < layers.length; i++) {
      var L = layers[i].trim(), m = /^(repeating-)?(linear|radial)-gradient\((.*)\)$/.exec(L);
      if (!m) { if (L && L !== "none") out.push({ type: "color", c: L }); continue; }
      var args = splitTop(m[3], ","), first = args[0].trim(), g = { type: m[2] };
      if (m[2] === "linear") {
        g.angle = 180;
        if (/^to\s/.test(first)) {
          var to = first.slice(3).trim();
          g.angle = { top: 0, right: 90, bottom: 180, left: 270, "top right": 45, "right top": 45, "bottom right": 135, "right bottom": 135, "bottom left": 225, "left bottom": 225, "top left": 315, "left top": 315 }[to];
          if (g.angle == null) g.angle = 180;
          args.shift();
        } else if (/^-?[\d.]+(deg|rad|turn|grad)$/.test(first)) { g.angle = cssAngle(first); args.shift(); }
      } else {
        g.shape = "ellipse"; g.size = null; g.at = ["50%", "50%"];
        if (!/^(rgba?\(|hsla?\(|#|transparent\b)/.test(first) && !/^[a-z]+(\s+-?[\d.]+%?)?$/.test(first) || /\bat\b|^(ellipse|circle|closest|farthest)/.test(first)) {
          var pre = first, k = pre.indexOf(" at ");
          if (/^at\s/.test(pre)) { g.at = pre.slice(3).trim().split(/\s+/); pre = ""; }
          else if (k >= 0) { g.at = pre.slice(k + 4).trim().split(/\s+/); pre = pre.slice(0, k); }
          var toks = pre.trim().split(/\s+/).filter(Boolean), sz = [];
          for (var j = 0; j < toks.length; j++) { if (toks[j] === "circle" || toks[j] === "ellipse") g.shape = toks[j]; else sz.push(toks[j]); }
          if (sz.length) g.size = sz;
          if (g.at.length === 1) g.at.push("50%");
          args.shift();
        }
      }
      g.stops = parseStops(args);
      out.push(g);
    }
    return out;
  }
  function kwPos(s, ref) { if (s === "left" || s === "top") return 0; if (s === "right" || s === "bottom") return ref; if (s === "center") return ref / 2; return cssLen(s, ref); }
  // resolves stop positions (0..1 along the gradient line of length len) and splits transparent stops the way
  // CSS (premultiplied interpolation) reads them, so a canvas gradient gives the same colours
  function resolveStops(stops, len) {
    var n = stops.length, pos = new Array(n), i;
    for (i = 0; i < n; i++) { var s = stops[i]; pos[i] = s.p == null ? null : (s.u === "px" ? s.p / (len || 1) : s.p / 100); }
    if (pos[0] == null) pos[0] = 0; if (pos[n - 1] == null) pos[n - 1] = Math.max(1, pos[0]);
    for (i = 1; i < n; i++) if (pos[i] != null && pos[i] < pos[i - 1]) pos[i] = pos[i - 1];
    for (i = 1; i < n - 1; i++) if (pos[i] == null) {
      var j = i; while (pos[j] == null) j++;
      for (var k = i; k < j; k++) pos[k] = pos[i - 1] + (pos[j] - pos[i - 1]) * (k - i + 1) / (j - i + 1);
    }
    var out = [];
    for (i = 0; i < n; i++) {
      var c = parseColor(stops[i].c);
      if (c[3] === 0 && n > 1) {
        var L = i > 0 ? parseColor(stops[i - 1].c) : null, R = i < n - 1 ? parseColor(stops[i + 1].c) : null;
        if (L) out.push({ p: pos[i], c: rgba([L[0], L[1], L[2], 0]) });
        if (R) out.push({ p: pos[i], c: rgba([R[0], R[1], R[2], 0]) });
      } else out.push({ p: pos[i], c: rgba(c) });
    }
    return out;
  }
  function addStops(g, st, lo, hi, maskMode) {
    var span = hi - lo || 1;
    for (var i = 0; i < st.length; i++) {
      var o = Math.max(0, Math.min(1, (st[i].p - lo) / span));
      g.addColorStop(o, maskMode ? "rgba(0,0,0," + parseColor(st[i].c)[3] + ")" : st[i].c);
    }
  }

  /* ---------------------------------------------------------------- path geometry */
  function pathEntry(d) {
    var e = pathCache.get(d);
    if (!e) e = pathCache.set(d, { p: new Path2D(d), bb: null, d: d });
    return e;
  }
  // bounding box from end points and control points (an over-estimate for curves, used for dirty
  // rectangles and gradient boxes of paths)
  function pathBox(e) {
    if (e.bb) return e.bb;
    var re = /([MmLlHhVvCcSsQqTtAaZz])|([-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)/g, m, cmd = "M", args = [], x = 0, y = 0, sx = 0, sy = 0;
    var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    function add(px, py) { if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py; }
    var need = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };
    function flush() {
      var U = cmd.toUpperCase(), rel = cmd !== U, n = need[U];
      while (args.length >= n && n > 0) {
        var a = args.splice(0, n), ox = rel ? x : 0, oy = rel ? y : 0, i;
        if (U === "H") { x = a[0] + ox; add(x, y); }
        else if (U === "V") { y = a[0] + oy; add(x, y); }
        else if (U === "A") { var nx = a[5] + ox, ny = a[6] + oy, r = Math.max(Math.abs(a[0]), Math.abs(a[1])); add(x - r, y - r); add(x + r, y + r); add(nx, ny); x = nx; y = ny; }
        else { for (i = 0; i < n; i += 2) add(a[i] + ox, a[i + 1] + oy); x = a[n - 2] + ox; y = a[n - 1] + oy; }
        if (U === "M") { sx = x; sy = y; cmd = rel ? "l" : "L"; U = "L"; n = 2; }
      }
    }
    while ((m = re.exec(e.d))) {
      if (m[1]) { flush(); cmd = m[1]; args = []; if (cmd === "Z" || cmd === "z") { x = sx; y = sy; } }
      else { args.push(+m[2]); flush(); }
    }
    e.bb = x0 <= x1 ? [x0, y0, x1, y1] : [0, 0, 0, 0];
    return e.bb;
  }
  function pointsEntry(s) {
    var e = pointsCache.get(s); if (e) return e;
    var v = numsOf(s), x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (var i = 0; i + 1 < v.length; i += 2) { if (v[i] < x0) x0 = v[i]; if (v[i] > x1) x1 = v[i]; if (v[i + 1] < y0) y0 = v[i + 1]; if (v[i + 1] > y1) y1 = v[i + 1]; }
    return pointsCache.set(s, { v: v, bb: x0 <= x1 ? [x0, y0, x1, y1] : [0, 0, 0, 0] });
  }
  function dashOf(s) {
    var hit = dashCache.get(s); if (hit !== undefined) return hit;
    var v = s === "none" ? [] : numsOf(s), sum = 0;
    for (var i = 0; i < v.length; i++) { if (v[i] < 0) { v = []; break; } sum += v[i]; }
    if (!(sum > 0)) v = null; else if (v.length % 2) v = v.concat(v);
    return dashCache.set(s, v);
  }
  function urlId(s) {
    var hit = urlCache.get(s); if (hit !== undefined) return hit;
    var m = /url\(\s*['"]?#([^'")\s]+)['"]?\s*\)/.exec(s);
    return urlCache.set(s, m ? m[1] : null);
  }

  /* -------------------------------------------------------------------- the state */
  var INH_KEYS = { fill: "fill", stroke: "stroke", "stroke-width": "sw", "stroke-dasharray": "dash", "stroke-dashoffset": "doff",
    "stroke-linecap": "cap", "stroke-linejoin": "join", "stroke-miterlimit": "miter", "fill-opacity": "fo", "stroke-opacity": "so",
    "fill-rule": "rule", "font-family": "ff", "font-size": "fs", "font-weight": "fw", "letter-spacing": "ls", "text-anchor": "anchor",
    "text-rendering": "tr", "font-style": "fst" };
  var INH0 = { fill: "#000", stroke: "none", sw: "1", dash: "none", doff: "0", cap: "butt", join: "miter", miter: "4", fo: "1", so: "1",
    rule: "nonzero", ff: "sans-serif", fs: "16", fw: "400", ls: "0", anchor: "start", tr: "auto", fst: "normal" };
  function inherit(inh, a, style) {
    var out = null;
    for (var k in a) { var key = INH_KEYS[k]; if (key) { if (!out) out = copy(inh); out[key] = a[k]; } }
    if (style) for (var s in INH_KEYS) if (style[s] != null) { if (!out) out = copy(inh); out[INH_KEYS[s]] = style[s]; }
    return out || inh;
  }
  function copy(o) { var r = {}; for (var k in o) r[k] = o[k]; return r; }

  var R = null;            // render state of the frame being painted
  var stats = { nodes: 0, shapes: 0, groups: 0, cacheHits: 0, cacheMisses: 0, pathCache: 0, layerBytes: 0, memoBytes: 0 };
  var scratch = [];        // scratch surfaces by nesting level (1..)
  var STACK = 96, mstack = []; for (var si = 0; si < STACK; si++) mstack.push(new Float64Array(6));

  function newCanvas(w, h) { var c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
  function newCS() { return { tf: null, t: new Float64Array(6), fill: null, stroke: null, alpha: -1, lw: -1, font: null, cap: null, join: null, miter: -1 }; }
  function scratchAt(level) {
    var s = scratch[level];
    if (!s) { var cv = newCanvas(R.W, R.H); s = scratch[level] = { cv: cv, ctx: cv.getContext("2d"), cs: newCS() }; }
    if (s.cv.width !== R.W || s.cv.height !== R.H) { s.cv.width = R.W; s.cv.height = R.H; }
    return s;
  }

  function pushM(local) {
    var nd = R.md + 1, o = mstack[nd];
    if (local) mul(o, R.m, local); else o.set(R.m);
    R.md = nd; R.m = o;
  }
  function popM() { R.md--; R.m = mstack[R.md]; }
  // skips the call when the context already has this matrix (cs.tf === 1 means cs.t is what the context holds)
  function applyM(ctx) {
    var m = R.m, cs = R.cs, t = cs.t;
    if (cs.tf === 1 && t[4] === m[4] && t[5] === m[5] && t[0] === m[0] && t[3] === m[3] && t[1] === m[1] && t[2] === m[2]) return;
    ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]); t.set(m); cs.tf = 1;
  }
  function setAlpha(a) { if (R.cs.alpha !== a) { R.ctx.globalAlpha = a; R.cs.alpha = a; } }
  function setFill(f) { if (R.cs.fill !== f) { R.ctx.fillStyle = f; R.cs.fill = f; } }
  function setStroke(f) { if (R.cs.stroke !== f) { R.ctx.strokeStyle = f; R.cs.stroke = f; } }

  // device-space rectangle a scratch surface has been painted in (so only that much is composited / cleared)
  function dirty(x0, y0, x1, y1, pad) {
    var D = R.dirty; if (!D) return;
    var m = R.m; x0 -= pad; y0 -= pad; x1 += pad; y1 += pad;
    for (var i = 0; i < 4; i++) {
      var px = i & 1 ? x1 : x0, py = i & 2 ? y1 : y0, X = m[0] * px + m[2] * py + m[4], Y = m[1] * px + m[3] * py + m[5];
      if (X < D[0]) D[0] = X; if (X > D[2]) D[2] = X; if (Y < D[1]) D[1] = Y; if (Y > D[3]) D[3] = Y;
    }
  }

  function beginScratch(maskMode) {
    var lv = R.level + 1, s = scratchAt(lv);
    R.saved.push({ ctx: R.ctx, cs: R.cs, dirty: R.dirty, alpha: R.alpha, mask: R.maskMode });
    R.level = lv; R.ctx = s.ctx; R.cs = s.cs; R.cs.tf = null;
    R.dirty = [Infinity, Infinity, -Infinity, -Infinity]; R.alpha = 1; if (maskMode) R.maskMode = true;
    stats.groups++;
    return s;
  }
  function dirtyRect(D) {
    var x0 = Math.max(0, Math.floor(D[0]) - 1), y0 = Math.max(0, Math.floor(D[1]) - 1), x1 = Math.min(R.W, Math.ceil(D[2]) + 1), y1 = Math.min(R.H, Math.ceil(D[3]) + 1);
    return x1 > x0 && y1 > y0 ? [x0, y0, x1 - x0, y1 - y0] : null;
  }
  // ends the innermost scratch level: lays it over the level below (alpha, composite op) and clears it
  function endScratch(alpha, op, keepDirty, capKey) {
    var s = scratch[R.level], D = R.dirty, sv = R.saved.pop();
    R.level--; R.ctx = sv.ctx; R.cs = sv.cs; R.dirty = sv.dirty; R.alpha = sv.alpha; R.maskMode = sv.mask;
    var r = dirtyRect(D);
    if (r && capKey) isoStore(capKey, s.cv, r);
    if (r && alpha > 0) {
      var c = R.ctx; c.setTransform(1, 0, 0, 1, 0, 0); R.cs.tf = null; setAlpha(alpha);
      if (op) c.globalCompositeOperation = op;
      c.drawImage(s.cv, r[0], r[1], r[2], r[3], r[0], r[1], r[2], r[3]);
      if (op) c.globalCompositeOperation = "source-over";
      if (R.dirty && !keepDirty) { var P = R.dirty; if (r[0] < P[0]) P[0] = r[0]; if (r[1] < P[1]) P[1] = r[1]; if (r[0] + r[2] > P[2]) P[2] = r[0] + r[2]; if (r[1] + r[3] > P[3]) P[3] = r[1] + r[3]; }
    }
    if (r && !keepDirty) { s.ctx.setTransform(1, 0, 0, 1, 0, 0); s.ctx.clearRect(r[0], r[1], r[2], r[3]); s.cs.tf = null; }
    return r;
  }
  function clearScratch(level, r) { var s = scratch[level]; if (s && r) { s.ctx.setTransform(1, 0, 0, 1, 0, 0); s.ctx.clearRect(r[0], r[1], r[2], r[3]); s.cs.tf = null; } }

  function ctxSave() { R.ctx.save(); }
  function ctxRestore() { R.ctx.restore(); ctxRestore0(); }
  function setTf() { applyM(R.ctx); }

  /* ------------------------------------------------------------------ defs lookup */
  var DEF_TAGS = { linearGradient: 1, radialGradient: 1, clipPath: 1, mask: 1, pattern: 1, filter: 1, symbol: 1 };
  function registerDefs(n) {
    for (var i = 0; i < n.c.length; i++) { var c = n.c[i]; if (typeof c === "string") continue; if (c.a.id != null && !R.defs.has(c.a.id)) R.defs.set(c.a.id, c); if (c.t === "defs" || c.t === "g") registerDefs(c); }
  }
  function lookup(id) {
    var n = R.defs.get(id);
    if (!n && !R.fullScan) {
      R.fullScan = true;
      (function walk(x) { if (typeof x === "string") return; if (x.a.id != null && DEF_TAGS[x.t] && !R.defs.has(x.a.id)) R.defs.set(x.a.id, x); for (var i = 0; i < x.c.length; i++) walk(x.c[i]); })(R.root);
      n = R.defs.get(id);
    }
    return n || null;
  }

  /* ------------------------------------------------------------------- SVG paints */
  // CanvasGradient for an SVG gradient element, in its own unit space (bbox space for objectBoundingBox)
  function svgGradient(g) {
    var key = (R.maskMode ? "M" : "") + g.t, i, a = g.a;
    for (var k in a) key += "|" + k + "=" + a[k];
    for (i = 0; i < g.c.length; i++) { var s = g.c[i]; if (typeof s === "string") continue; for (var sk in s.a) key += "," + sk + "=" + s.a[sk]; key += ";"; }
    var hit = gradCache.get(key); if (hit) return hit;
    var bbox = a.gradientUnits !== "userSpaceOnUse";
    function L(v, d) { if (v == null) return d; var x = parseFloat(v); return String(v).indexOf("%") >= 0 ? x / 100 : x; }
    var cg;
    if (g.t === "linearGradient") cg = R.main.createLinearGradient(L(a.x1, 0), L(a.y1, 0), L(a.x2, bbox ? 1 : 0), L(a.y2, 0));
    else { var cx = L(a.cx, 0.5), cy = L(a.cy, 0.5), r = L(a.r, 0.5); cg = R.main.createRadialGradient(L(a.fx, cx), L(a.fy, cy), 0, cx, cy, r); }
    var last = 0;
    for (i = 0; i < g.c.length; i++) {
      var st = g.c[i]; if (typeof st === "string" || st.t !== "stop") continue;
      var sty = st.a.style ? parseStyle(st.a.style) : null;
      var off = Math.max(last, Math.max(0, Math.min(1, L(st.a.offset, 0)))); last = off;
      var col = (sty && sty["stop-color"]) || st.a["stop-color"] || "#000", so = num((sty && sty["stop-opacity"]) || st.a["stop-opacity"], 1);
      if (R.maskMode) col = lumAlpha(col, so); else if (so !== 1) { var c = parseColor(col); col = rgba([c[0], c[1], c[2], c[3] * so]); }
      cg.addColorStop(off, col);
    }
    var tfm = a.gradientTransform ? svgTransform(a.gradientTransform) : null, lin = g.t === "linearGradient";
    var axisOK = !tfm || (tfm[1] === 0 && tfm[2] === 0);
    var axis = lin && axisOK ? (L(a.x1, 0) === L(a.x2, bbox ? 1 : 0) ? "v" : L(a.y1, 0) === L(a.y2, 0) ? "h" : null) : null;
    var lastA = 1;
    for (i = g.c.length - 1; i >= 0; i--) { var ls = g.c[i]; if (typeof ls !== "string" && ls.t === "stop") { lastA = parseColor(ls.a["stop-color"] || "#000")[3] * num(ls.a["stop-opacity"], 1); break; } }
    // a radial gradient that covers its ellipse and ends transparent hides the shape's own edge
    var edge0 = !lin && bbox && !tfm && lastA === 0 && L(a.cx, 0.5) === 0.5 && L(a.cy, 0.5) === 0.5 && L(a.r, 0.5) >= 0.5 && a.fx == null && a.fy == null;
    var out = { g: cg, bbox: bbox, tf: tfm, key: key, linear: lin, axis: axis, edge0: edge0 };
    return gradCache.set(key, out);
  }
  // resolves a fill/stroke value: null (nothing), a colour string, or a gradient record
  function paintOf(v, alphaMul) {
    if (v == null || v === "none" || v === "transparent") return null;
    if (v.charAt(0) === "u") {
      var id = urlId(v), g = id && lookup(id);
      if (!g || (g.t !== "linearGradient" && g.t !== "radialGradient")) { var fb = /\)\s*(.+)$/.exec(v); return fb ? paintOf(fb[1], alphaMul) : null; }
      return svgGradient(g);
    }
    if (v === "currentColor") v = "#000";
    return R.maskMode ? lumAlpha(v, 1) : v;
  }

  /* ---------------------------------------------------------------------- shapes */
  // geometry kinds: 0 rect, 1 circle, 2 ellipse, 3 line, 4 poly, 5 path
  var GEO = { rect: 0, circle: 1, ellipse: 2, line: 3, polygon: 4, polyline: 4, path: 5 };
  function geoBox(t, a) {
    switch (GEO[t]) {
      case 0: var x = num(a.x, 0), y = num(a.y, 0); return [x, y, x + num(a.width, 0), y + num(a.height, 0)];
      case 1: var cx = num(a.cx, 0), cy = num(a.cy, 0), r = num(a.r, 0); return [cx - r, cy - r, cx + r, cy + r];
      case 2: var ex = num(a.cx, 0), ey = num(a.cy, 0), rx = num(a.rx, num(a.ry, 0)), ry = num(a.ry, rx); return [ex - rx, ey - ry, ex + rx, ey + ry];
      case 3: var x1 = num(a.x1, 0), y1 = num(a.y1, 0), x2 = num(a.x2, 0), y2 = num(a.y2, 0); return [Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2)];
      case 4: return a.points ? pointsEntry(a.points).bb : null;
      case 5: return a.d ? pathBox(pathEntry(a.d)) : null;
    }
    return null;
  }
  // traces a primitive into the context's current path (device space, so the transform may change before fill)
  function trace(ctx, kind, a, t) {
    ctx.beginPath();
    switch (kind) {
      case 0:
        var x = num(a.x, 0), y = num(a.y, 0), w = num(a.width, 0), h = num(a.height, 0);
        var rx = a.rx != null ? num(a.rx, 0) : (a.ry != null ? num(a.ry, 0) : 0), ry = a.ry != null ? num(a.ry, 0) : rx;
        rx = Math.min(Math.max(rx, 0), w / 2); ry = Math.min(Math.max(ry, 0), h / 2);
        if (rx > 0 && rx === ry && ctx.roundRect) ctx.roundRect(x, y, w, h, rx);
        else if (rx > 0 && ry > 0) {
          ctx.moveTo(x + rx, y); ctx.lineTo(x + w - rx, y); ctx.ellipse(x + w - rx, y + ry, rx, ry, 0, -Math.PI / 2, 0);
          ctx.lineTo(x + w, y + h - ry); ctx.ellipse(x + w - rx, y + h - ry, rx, ry, 0, 0, Math.PI / 2);
          ctx.lineTo(x + rx, y + h); ctx.ellipse(x + rx, y + h - ry, rx, ry, 0, Math.PI / 2, Math.PI);
          ctx.lineTo(x, y + ry); ctx.ellipse(x + rx, y + ry, rx, ry, 0, Math.PI, Math.PI * 1.5); ctx.closePath();
        } else ctx.rect(x, y, w, h);
        return w > 0 && h > 0;
      case 1: var r = num(a.r, 0); if (r > 0) ctx.arc(num(a.cx, 0), num(a.cy, 0), r, 0, PI2); return r > 0;
      case 2:
        var erx = num(a.rx, num(a.ry, 0)), ery = num(a.ry, erx);
        if (erx > 0 && ery > 0) ctx.ellipse(num(a.cx, 0), num(a.cy, 0), erx, ery, 0, 0, PI2); return erx > 0 && ery > 0;
      case 3: ctx.moveTo(num(a.x1, 0), num(a.y1, 0)); ctx.lineTo(num(a.x2, 0), num(a.y2, 0)); return true;
      case 4:
        var v = a.points ? pointsEntry(a.points).v : [];
        if (v.length < 4) return false;
        ctx.moveTo(v[0], v[1]); for (var i = 2; i + 1 < v.length; i += 2) ctx.lineTo(v[i], v[i + 1]);
        if (t === "polygon") ctx.closePath(); return true;
    }
    return false;
  }

  function fillPaint(kind, a, t, P, rule, alpha, box, path2d) {
    var ctx = R.ctx;
    setAlpha(alpha);
    if (typeof P === "string") { setFill(P); if (path2d) ctx.fill(path2d, rule); else ctx.fill(rule); return; }
    // gradient: transform the context into the gradient's space after the path is laid down
    var G = [1, 0, 0, 1, 0, 0];
    if (P.bbox) { if (!box || box[2] - box[0] <= 0 || box[3] - box[1] <= 0) return; G = [box[2] - box[0], 0, 0, box[3] - box[1], box[0], box[1]]; }
    if (P.tf) mul(G, G, P.tf);
    if (!path2d && box && (kind === 0 && !(num(a.rx, 0) > 0) && !(num(a.ry, 0) > 0) || (kind === 1 || kind === 2) && P.edge0)) {
      if (spriteFill(P, G, kind === 0 ? "box" : kind, a, t, box, alpha)) return;
    }
    setFill(P.g);
    if (path2d) {
      ctxSave(); ctx.clip(path2d, rule);
      pushM(G); setTf(); popM();
      var inv = invert(G), bb = box || [-1e5, -1e5, 1e5, 1e5];
      // fill the shape's box, expressed in gradient space
      var pts = [[bb[0], bb[1]], [bb[2], bb[1]], [bb[2], bb[3]], [bb[0], bb[3]]];
      ctx.beginPath(); for (var i = 0; i < 4; i++) { var p = pts[i]; var X = inv[0] * p[0] + inv[2] * p[1] + inv[4], Y = inv[1] * p[0] + inv[3] * p[1] + inv[5]; if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); }
      ctx.closePath(); ctx.fillStyle = P.g; ctx.globalAlpha = alpha; ctx.fill();
      ctxRestore();
    } else {
      pushM(G); setTf(); popM();
      ctx.fill(rule);
    }
  }
  /* Gradient sprites. Rasterising a large gradient is the most expensive thing a 2D canvas does here (a
   * full-screen gradient costs 10-25x an image blit in software and SwiftShader rendering), so a gradient
   * fill of a box is drawn from a cached bitmap instead: an axis-aligned linear gradient as a 1-pixel strip
   * stretched over the box (exact), a radial one at quarter resolution scaled up (gradients are smooth, so
   * bilinear upscaling is within a level or two). A circle / ellipse qualifies when its gradient fades to
   * transparent at the shape's edge, so the soft upscaled edge cannot show. Other cases fill directly. */
  var sprites = new Map(), spriteBytes = 0, SPRITE_LIMIT = 24 * 1024 * 1024;
  function spriteFill(P, G, kind, a, t, box, alpha) {
    var m = R.m, bw = box[2] - box[0], bh = box[3] - box[1];
    if (!(bw > 0) || !(bh > 0)) return false;
    var sx = Math.sqrt(m[0] * m[0] + m[1] * m[1]), sy = Math.sqrt(m[2] * m[2] + m[3] * m[3]), W, H;
    if (P.axis === "v" && kind === "box") { W = 1; H = Math.ceil(bh * sy); }
    else if (P.axis === "h" && kind === "box") { W = Math.ceil(bw * sx); H = 1; }
    else if (!P.linear) { W = Math.ceil(bw * sx / 4); H = Math.ceil(bh * sy / 4); }
    else return false;
    W = Math.max(2, Math.min(W, 4096)); H = Math.max(2, Math.min(H, 4096));
    if (P.axis === "v" && kind === "box") W = 1; else if (P.axis === "h" && kind === "box") H = 1;
    var key = P.key + "|" + kind + "|" + box[0] + "," + box[1] + "," + bw + "," + bh + "|" + W + "x" + H + "|" + G.join(","), sp = sprites.get(key);
    if (sp) { sprites.delete(key); sprites.set(key, sp); }
    else {
      sp = document.createElement("canvas"); sp.width = W; sp.height = H;
      var c = sp.getContext("2d");
      c.setTransform(W / bw, 0, 0, H / bh, -box[0] * W / bw, -box[1] * H / bh);
      if (kind === "box") { c.beginPath(); c.rect(box[0], box[1], bw, bh); } else trace(c, kind, a, t);
      c.transform(G[0], G[1], G[2], G[3], G[4], G[5]);
      c.fillStyle = P.g; c.fill();
      sprites.set(key, sp); spriteBytes += W * H * 4;
      var it = sprites.keys();
      while (spriteBytes > SPRITE_LIMIT && sprites.size > 1) { var k = it.next().value, o = sprites.get(k); sprites.delete(k); spriteBytes -= o.width * o.height * 4; }
    }
    setTf(); setAlpha(alpha);
    R.ctx.drawImage(sp, 0, 0, W, H, box[0], box[1], bw, bh);
    return true;
  }
  function invert(m) {
    var det = m[0] * m[3] - m[1] * m[2]; if (!det) return [1, 0, 0, 1, 0, 0];
    return [m[3] / det, -m[1] / det, -m[2] / det, m[0] / det, (m[2] * m[5] - m[3] * m[4]) / det, (m[1] * m[4] - m[0] * m[5]) / det];
  }

  function drawShape(n, inh, op, alpha) {
    var a = n.a, t = n.t, kind = GEO[t], ctx = R.ctx;
    stats.shapes++;
    var fv = a.fill != null ? a.fill : inh.fill, sv = a.stroke != null ? a.stroke : inh.stroke;
    var F = kind === 3 ? null : paintOf(fv), S = paintOf(sv);
    var sw = num(a["stroke-width"] != null ? a["stroke-width"] : inh.sw, 1);
    if (!(sw > 0)) S = null;
    if (!F && !S) return;
    var fo = num(a["fill-opacity"] != null ? a["fill-opacity"] : inh.fo, 1), so = num(a["stroke-opacity"] != null ? a["stroke-opacity"] : inh.so, 1);
    var box = R.dirty || (F && typeof F !== "string") ? geoBox(t, a) : null;
    if (R.dirty && box) dirty(box[0], box[1], box[2], box[3], S ? sw * (inh.join === "miter" || a["stroke-linejoin"] === "miter" ? 4 : 1) + 2 : 2);
    var path2d = null, rule = (a["fill-rule"] || inh.rule) === "evenodd" ? "evenodd" : "nonzero";
    setTf();
    if (kind === 5) { if (!a.d) return; path2d = pathEntry(a.d).p; }
    else if (!trace(ctx, kind, a, t)) return;
    if (F && fo > 0) fillPaint(kind, a, t, F, rule, alpha * fo, box, path2d);
    if (S && so > 0) {
      if (typeof S !== "string") { S = S.g; } // gradient strokes: drawn in user space (not used by the scenes)
      setTf();
      setAlpha(alpha * so); setStroke(S);
      if (R.cs.lw !== sw) { ctx.lineWidth = sw; R.cs.lw = sw; }
      var cap = a["stroke-linecap"] || inh.cap, join = a["stroke-linejoin"] || inh.join, ml = num(a["stroke-miterlimit"] || inh.miter, 4), cs = R.cs;
      if (cs.cap !== cap) { ctx.lineCap = cap; cs.cap = cap; }
      if (cs.join !== join) { ctx.lineJoin = join; cs.join = join; }
      if (cs.miter !== ml) { ctx.miterLimit = ml; cs.miter = ml; }
      var dash = dashOf(a["stroke-dasharray"] || inh.dash);
      if (dash) { ctx.setLineDash(dash); ctx.lineDashOffset = num(a["stroke-dashoffset"] != null ? a["stroke-dashoffset"] : inh.doff, 0); }
      if (path2d) ctx.stroke(path2d); else ctx.stroke();
      if (dash) ctx.setLineDash([]);
    }
  }

  function fontOf(inh, a) {
    var fw = a["font-weight"] || inh.fw, fs = num(a["font-size"] || inh.fs, 16), ff = a["font-family"] || inh.ff, fst = a["font-style"] || inh.fst;
    var key = fst + "|" + fw + "|" + fs + "|" + ff, hit = fontCache.get(key);
    if (hit) return hit;
    return fontCache.set(key, { css: (fst !== "normal" ? fst + " " : "") + fw + " " + fs + "px " + ff, size: fs });
  }
  function textWidth(ctx, font, ls, s) {
    var key = font.css + "|" + ls + "|" + s, w = textWCache.get(key);
    if (w == null) { w = 0; for (var i = 0; i < s.length; i++) w += ctx.measureText(s.charAt(i)).width + ls; textWCache.set(key, w); }
    return w;
  }
  function drawText(n, inh, alpha, style) {
    var a = n.a, s = "";
    for (var i = 0; i < n.c.length; i++) if (typeof n.c[i] === "string") s += n.c[i];
    if (!s) return;
    stats.shapes++;
    var F = paintOf(a.fill != null ? a.fill : inh.fill), fo = num(a["fill-opacity"] != null ? a["fill-opacity"] : inh.fo, 1);
    if (!F || typeof F !== "string" || !(fo > 0)) return;
    var ctx = R.ctx, font = fontOf(inh, a), ls = num(a["letter-spacing"] != null ? a["letter-spacing"] : inh.ls, 0) || 0;
    var anchor = a["text-anchor"] || inh.anchor, x = num(a.x, 0), y = num(a.y, 0);
    var tr = (style && style["text-rendering"]) || a["text-rendering"] || inh.tr;
    setTf();
    if (R.cs.font !== font.css) { ctx.font = font.css; R.cs.font = font.css; }
    if (HAS_TR) ctx.textRendering = tr === "geometricPrecision" ? "geometricPrecision" : tr === "optimizeLegibility" ? "optimizeLegibility" : "auto";
    ctx.textBaseline = "alphabetic";
    setAlpha(alpha * fo); setFill(F);
    if (R.dirty) { var wEst = s.length * (font.size * 1.1 + Math.abs(ls)) + 4, x0 = anchor === "middle" ? x - wEst / 2 : anchor === "end" ? x - wEst : x; dirty(x0, y - font.size * 1.2, x0 + wEst, y + font.size * 0.5, 2); }
    if (HAS_LS || !ls) {
      ctx.textAlign = anchor === "middle" ? "center" : anchor === "end" ? "right" : "left";
      if (HAS_LS) ctx.letterSpacing = ls + "px";
      ctx.fillText(s, x, y);
      if (HAS_LS && ls) ctx.letterSpacing = "0px";
    } else {
      // no ctx.letterSpacing (older Safari / Firefox): place the glyphs one by one
      var total = textWidth(ctx, font, ls, s), cx = anchor === "middle" ? x - total / 2 : anchor === "end" ? x - total : x;
      ctx.textAlign = "left";
      for (var j = 0; j < s.length; j++) { var ch = s.charAt(j); ctx.fillText(ch, cx, y); cx += ctx.measureText(ch).width + ls; }
    }
  }

  /* ------------------------------------------------------------- isolation tests */
  function opsOf(n, limit) {
    var t = n.t, a = n.a;
    if (t === "text") return 1;
    if (GEO[t] != null) return (t !== "line" && a.fill !== "none" ? 1 : 0) + (a.stroke != null && a.stroke !== "none" ? 1 : 0);
    if (DEF_TAGS[t] || t === "defs") return 0;
    var c = 0;
    if (a.stroke != null && a.stroke !== "none") c++; // an inherited stroke makes every descendant two operations
    for (var i = 0; i < n.c.length && c <= limit; i++) if (typeof n.c[i] !== "string") c += opsOf(n.c[i], limit);
    return c;
  }
  // true when a group with opacity < 1 must be painted as one picture (its paints could overlap)
  function needsIsolation(n) {
    var hit = isoMemo.get(n); if (hit !== undefined) return hit;
    var res = true;
    if (opsOf(n, 1) <= 1) res = false;
    else if (n.c.length <= 8 && !(n.a.stroke != null && n.a.stroke !== "none")) {
      var boxes = [], ok = true;
      for (var i = 0; i < n.c.length && ok; i++) {
        var c = n.c[i]; if (typeof c === "string") continue;
        if (GEO[c.t] == null || c.a.transform || c.a["clip-path"] || c.a.mask || opsOf(c, 1) > 1) { ok = false; break; }
        var b = geoBox(c.t, c.a); if (!b) { ok = false; break; }
        var p = num(c.a["stroke-width"] || n.a["stroke-width"], 1) * 2 + 2;
        boxes.push([b[0] - p, b[1] - p, b[2] + p, b[3] + p]);
      }
      if (ok) {
        res = false;
        for (var x = 0; x < boxes.length && !res; x++) for (var y = x + 1; y < boxes.length; y++) {
          var A = boxes[x], B = boxes[y];
          if (A[0] < B[2] && B[0] < A[2] && A[1] < B[3] && B[1] < A[3]) { res = true; break; }
        }
      }
    }
    isoMemo.set(n, res);
    return res;
  }

  /* ------------------------------------------------------------------ SVG walker */
  function clipWith(id) {
    var cp = lookup(id); if (!cp) return false;
    var ctx = R.ctx; ctxSave();
    ctx.beginPath();
    var units = cp.a.clipPathUnits === "objectBoundingBox";
    var cpTf = cp.a.transform ? svgTransform(cp.a.transform) : null;
    var p2 = null;
    for (var i = 0; i < cp.c.length; i++) {
      var c = cp.c[i]; if (typeof c === "string") continue;
      var k = GEO[c.t]; if (k == null) continue;
      var ctf = c.a.transform ? svgTransform(c.a.transform) : null, pushed = 0;
      if (cpTf) { pushM(cpTf); pushed++; }
      if (ctf) { pushM(ctf); pushed++; }
      setTf();
      if (k === 5) { if (c.a.d) { if (!p2) p2 = new Path2D(); var m = R.m; p2.addPath(pathEntry(c.a.d).p, { a: m[0], b: m[1], c: m[2], d: m[3], e: m[4], f: m[5] }); } }
      else traceAppend(ctx, k, c.a, c.t);
      while (pushed--) popM();
    }
    if (units) { /* objectBoundingBox clip units are not used by the scenes */ }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (p2) { ctx.clip(p2); }
    else ctx.clip();
    R.cs.tf = null;
    return true;
  }
  // like trace() but appends to the current path
  function traceAppend(ctx, kind, a, t) {
    switch (kind) {
      case 0: var x = num(a.x, 0), y = num(a.y, 0), w = num(a.width, 0), h = num(a.height, 0); if (w > 0 && h > 0) { ctx.moveTo(x, y); ctx.rect(x, y, w, h); } break;
      case 1: var r = num(a.r, 0); if (r > 0) { ctx.moveTo(num(a.cx, 0) + r, num(a.cy, 0)); ctx.arc(num(a.cx, 0), num(a.cy, 0), r, 0, PI2); } break;
      case 2: var rx = num(a.rx, 0), ry = num(a.ry, rx); if (rx > 0 && ry > 0) { ctx.moveTo(num(a.cx, 0) + rx, num(a.cy, 0)); ctx.ellipse(num(a.cx, 0), num(a.cy, 0), rx, ry, 0, 0, PI2); } break;
      case 4: var v = a.points ? pointsEntry(a.points).v : []; if (v.length >= 4) { ctx.moveTo(v[0], v[1]); for (var i = 2; i + 1 < v.length; i += 2) ctx.lineTo(v[i], v[i + 1]); ctx.closePath(); } break;
    }
  }

  function paintSvg(n, inh) {
    if (typeof n === "string") return;
    stats.nodes++;
    var t = n.t, a = n.a;
    if (t === "defs") { registerDefs(n); return; }
    if (DEF_TAGS[t]) { if (a.id != null && !R.defs.has(a.id)) R.defs.set(a.id, n); return; }
    var style = a.style ? parseStyle(a.style) : null;
    if (style && style.$hidden) return;
    if (a.display === "none" || a.visibility === "hidden") return;
    var op = a.opacity != null ? num(a.opacity, 1) : 1;
    if (style && style.opacity != null) op *= style.$op;
    if (!(op > 0)) return;
    var tf = a.transform ? svgTransform(a.transform) : null;
    if (tf) pushM(tf);
    var clipped = false, cpRef = a["clip-path"] || (style && style["clip-path"]);
    if (cpRef && cpRef !== "none") { var cid = urlId(cpRef); clipped = cid ? clipWith(cid) : false; }
    var blend = style && style.$blend;
    if (t === "g" || t === "svg" || t === "a" || t === "switch") paintGroup(n, inherit(inh, a, style), op, blend, style);
    else if (GEO[t] != null || t === "text") {
      var maskRef = a.mask && urlId(a.mask);
      var twoOps = t !== "text" && t !== "line" && op < 1 && paintOf(a.fill != null ? a.fill : inh.fill) && (a.stroke != null ? a.stroke : inh.stroke) !== "none";
      var shapeInh = style ? inherit(inh, {}, style) : inh;
      if (twoOps || maskRef || blend) {
        var key = isoKey(n, shapeInh);
        if (!isoDraw(key, R.alpha * op, blend)) {
          var cap = key && isoWanted(key) ? key : null;
          beginScratch();
          if (t === "text") drawText(n, shapeInh, 1, style); else drawShape(n, shapeInh, 1, 1);
          finishIsolated(maskRef, op, blend, cap);
        }
      } else if (t === "text") drawText(n, shapeInh, R.alpha * op, style);
      else drawShape(n, shapeInh, op, R.alpha * op);
    }
    if (clipped) ctxRestore();
    if (tf) popM();
  }

  // applies a luminance mask (by id) to the current scratch level, then lays the level over the one below
  function finishIsolated(maskId, alpha, blend, capKey) {
    if (maskId) {
      var mk = lookup(maskId);
      if (mk) {
        var D = R.dirty.slice(), lv = R.level;
        beginScratch(true);
        var inhM = INH0;
        for (var i = 0; i < mk.c.length; i++) paintSvg(mk.c[i], inhM);
        var maskDirty = R.dirty.slice();
        var sv = R.saved.pop(); var s = scratch[R.level];
        R.level--; R.ctx = sv.ctx; R.cs = sv.cs; R.dirty = sv.dirty; R.alpha = sv.alpha; R.maskMode = sv.mask;
        var r = dirtyRect(D);
        if (r) {
          var c = R.ctx; c.setTransform(1, 0, 0, 1, 0, 0); R.cs.tf = null; setAlpha(1);
          c.globalCompositeOperation = "destination-in";
          c.drawImage(s.cv, r[0], r[1], r[2], r[3], r[0], r[1], r[2], r[3]);
          c.globalCompositeOperation = "source-over";
        }
        clearScratch(lv + 1, dirtyRect([Math.min(D[0], maskDirty[0]), Math.min(D[1], maskDirty[1]), Math.max(D[2], maskDirty[2]), Math.max(D[3], maskDirty[3])]));
      }
    }
    endScratch(R.saved[R.saved.length - 1].alpha * alpha, blend, false, capKey);
  }

  /* ---------------------------------------------------- isolated-picture cache
   * A group (or shape) that has to be composited as one picture costs a scratch surface and a synchronous
   * flush of everything painted so far. When the very same content (same attributes all the way down, same
   * referenced gradients / masks, same inherited values) is drawn with the very same device matrix in
   * consecutive frames, the composited pixels of the scratch are kept and later frames lay the copy over.
   * Because the key includes the full matrix, the copy is exactly what the scratch would give: whether a
   * frame uses it or not never changes a pixel. */
  var isoCache = new Map(), isoBytes = 0, ISO_LIMIT = 48 * 1024 * 1024, isoSeen = new Map(), renderSeq = 0, sigMemo = new WeakMap();
  function sigOf(n) {
    if (typeof n === "string") return "'" + n;
    var hit = sigMemo.get(n); if (hit) return hit;
    var s = "<" + n.t, ext = false, a = n.a;
    for (var k in a) {
      var v = a[k]; s += " " + k + "=" + v;
      if (typeof v === "string" && v.indexOf("url(") >= 0) { var d = lookup(urlId(v)); s += "{" + (d ? sigOf(d) : "") + "}"; ext = true; }
    }
    s += ">";
    for (var i = 0; i < n.c.length; i++) { var c = n.c[i]; s += sigOf(c); if (typeof c !== "string" && !sigMemo.has(c)) ext = true; }
    s += "</>";
    if (!ext) sigMemo.set(n, s);
    return s;
  }
  function isoKey(n, inh) {
    if (!R.auto) return null;
    var m = R.m;
    return sigOf(n) + "|" + inhSig(inh) + "|" + m[0] + "," + m[1] + "," + m[2] + "," + m[3] + "," + m[4] + "," + m[5] + "|" + R.W + "x" + R.H + (R.maskMode ? "M" : "");
  }
  // true when the key was asked for in one of the last few frames (content that holds still)
  function isoWanted(key) {
    var prev = isoSeen.get(key);
    if (isoSeen.size > 4000) isoSeen.clear();
    isoSeen.set(key, renderSeq);
    return prev != null && prev >= renderSeq - 4 && prev !== renderSeq;
  }
  function isoStore(key, src, r) {
    if (r[2] * r[3] > 4e6) return;
    var cv = newCanvas(r[2], r[3]); cv.getContext("2d").drawImage(src, r[0], r[1], r[2], r[3], 0, 0, r[2], r[3]);
    var e = { cv: cv, x: r[0], y: r[1], bytes: r[2] * r[3] * 4 };
    isoCache.set(key, e); isoBytes += e.bytes;
    var it = isoCache.keys();
    while (isoBytes > ISO_LIMIT && isoCache.size > 1) { var k = it.next().value; isoBytes -= isoCache.get(k).bytes; isoCache.delete(k); }
  }
  // lays a kept picture over; false when there is none (the caller isolates as usual)
  function isoDraw(key, alpha, blend) {
    var e = key && isoCache.get(key);
    if (!e) return false;
    stats.cacheHits++; isoCache.delete(key); isoCache.set(key, e); isoSeen.set(key, renderSeq);
    if (alpha > 0) {
      var c = R.ctx; c.setTransform(1, 0, 0, 1, 0, 0); R.cs.tf = null; setAlpha(alpha);
      if (blend) c.globalCompositeOperation = blend;
      c.drawImage(e.cv, e.x, e.y);
      if (blend) c.globalCompositeOperation = "source-over";
      var D = R.dirty;
      if (D) { if (e.x < D[0]) D[0] = e.x; if (e.y < D[1]) D[1] = e.y; if (e.x + e.cv.width > D[2]) D[2] = e.x + e.cv.width; if (e.y + e.cv.height > D[3]) D[3] = e.y + e.cv.height; }
    }
    return true;
  }

  function paintChildren(n, inh) { for (var i = 0; i < n.c.length; i++) { var c = n.c[i]; if (typeof c !== "string") paintSvg(c, inh); } }

  function paintGroup(n, inh, op, blend, style) {
    var a = n.a, maskId = a.mask && urlId(a.mask);
    var cacheKey = a["data-cache"], box = cacheKey != null && a["data-box"] ? numsOf(a["data-box"]) : null;
    if (box && box.length < 4) box = null;
    if (box && !maskId && !blend) { drawCached(n, inh, box, cacheKey, R.alpha * op); return; }
    var memo = !box && memoEligible(n);
    // a memoised group's bitmap is already one picture, so opacity alone needs no scratch surface
    if (memo && !maskId && !blend) { drawMemo(n, inh, R.alpha * op); return; }
    var isolate = !!(maskId || blend || (op < 1 && needsIsolation(n)));
    if (!isolate) {
      var keep = R.alpha; R.alpha = keep * op;
      paintChildren(n, inh);
      R.alpha = keep;
      return;
    }
    if (R.auto && !maskId && !box && !memo && drawSigBitmap(n, inh, R.alpha * op, blend)) return;
    var key = isoKey(n, inh);
    if (isoDraw(key, R.alpha * op, blend)) return;
    var cap = key && isoWanted(key) ? key : null;
    beginScratch();
    if (box) drawCached(n, inh, box, cacheKey, 1); else if (memo) drawMemo(n, inh, 1); else paintChildren(n, inh);
    finishIsolated(maskId, op, blend, cap);
  }

  /* ------------------------------------------------- memoised groups as bitmaps
   * The scene code returns the very same node object for its static parts. Which objects those are is
   * learnt ONCE, when the engine is created (the scenes are called at sample frames and every <g> met in
   * two different calls is marked), never from the frames painted later, so a picture never depends on
   * what was painted before it. A marked group with enough paint operations is painted into a bitmap at
   * the current device scale (no rotation) and later frames draw that bitmap: at a whole-pixel offset the
   * result equals painting the shapes; at a fractional offset (moving camera) it is resampled, which
   * softens edges by less than a pixel. */
  var memoSet = new WeakSet(), memoInfo = new WeakMap(), memoBmp = new WeakMap(), memoLRU = new Map(), memoBytes = 0, MEMO_LIMIT = 96 * 1024 * 1024, MEMO_MIN_OPS = 3;
  var memoSeq = 0, inhSigs = new WeakMap();
  function memoEligible(n) {
    if (!R.auto || !memoSet.has(n)) return false;
    var m = R.m; if (m[1] !== 0 || m[2] !== 0) return false;
    var info = memoInfo.get(n);
    if (!info) {
      var ids = {}, refs = [], ops = 0;
      (function scan(x) {
        if (typeof x === "string") return;
        var a = x.a;
        if (a.id != null) ids[a.id] = 1;
        if (GEO[x.t] != null || x.t === "text") ops++;
        for (var k in a) { var v = a[k]; if (typeof v === "string" && v.indexOf("url(") >= 0) refs.push(urlId(v)); }
        for (var i = 0; i < x.c.length; i++) scan(x.c[i]);
      })(n);
      var self = true;
      for (var r = 0; r < refs.length; r++) if (!ids[refs[r]]) { self = false; break; }
      // a group that points at gradients / clips defined elsewhere could change without changing itself
      info = { ok: self && ops >= MEMO_MIN_OPS, box: null };
      memoInfo.set(n, info);
    }
    return info.ok;
  }
  function inhSig(inh) {
    var s = inhSigs.get(inh); if (s) return s;
    s = ""; for (var k in inh) s += inh[k] + ";";
    inhSigs.set(inh, s); return s;
  }
  function drawMemo(n, inh, alpha) {
    var m = R.m, key = (R.maskMode ? "M" : "") + m[0] + "," + m[3] + "|" + inhSig(inh);
    var per = memoBmp.get(n), e = per && per.get(key);
    if (!e) {
      var info = memoInfo.get(n);
      if (!info.box) info.box = boundsOf(n, inh);
      e = bitmapOf(n, inh, info.box);
      if (!e) { info.ok = false; paintChildren(n, inh); return; }
      e.drop = function () { var p = memoBmp.get(n); if (p) p.delete(key); };
      if (!per) { per = new Map(); memoBmp.set(n, per); }
      per.set(key, e);
      lruAdd(e);
    } else lruHit(e);
    drawBitmap(e, alpha, null);
  }
  /* An isolated group (opacity < 1 over overlapping paints) is drawn the same way, keyed by its content
   * (the signature of every attribute below it) and the matrix without its translation. Whether this path
   * is taken depends only on the tree, so pictures stay independent of what was drawn before; animated
   * content simply gets a new bitmap (its old canvas is recycled). */
  var sigBmp = new Map(), pool = [];
  function drawSigBitmap(n, inh, alpha, blend) {
    var m = R.m, key = (R.maskMode ? "M" : "") + m[0] + "," + m[1] + "," + m[2] + "," + m[3] + "|" + inhSig(inh) + "|" + sigOf(n);
    var e = sigBmp.get(key);
    if (!e) {
      e = bitmapOf(n, inh, boundsOf(n, inh));
      if (!e) return false;
      e.drop = function () { sigBmp.delete(key); };
      e.sig = true;
      sigBmp.set(key, e); lruAdd(e);
    } else lruHit(e);
    drawBitmap(e, alpha, blend);
    return true;
  }
  // renders a group's children into a bitmap with the current matrix minus its translation
  function bitmapOf(n, inh, b) {
    var m = R.m, xs = Infinity, ys = Infinity, xe = -Infinity, ye = -Infinity;
    for (var i = 0; i < 4; i++) {
      var px = i & 1 ? b[2] : b[0], py = i & 2 ? b[3] : b[1], X = m[0] * px + m[2] * py, Y = m[1] * px + m[3] * py;
      if (X < xs) xs = X; if (X > xe) xe = X; if (Y < ys) ys = Y; if (Y > ye) ye = Y;
    }
    var bx = Math.floor((Math.floor(xs) - 2) / 8) * 8, by = Math.floor((Math.floor(ys) - 2) / 8) * 8, W = Math.ceil(xe) + 2 - bx, H = Math.ceil(ye) + 2 - by;
    if (!(W > 0 && H > 0) || W * H > 6e6) return null;
    stats.cacheMisses++;
    // canvases are recycled: one at least this big (and not wastefully bigger) is cleared and reused
    var cv = null;
    for (var k = 0; k < pool.length; k++) {
      var q = pool[k];
      if (q.width >= W && q.height >= H && q.width * q.height <= W * H * 2 + 65536) { cv = pool.splice(k, 1)[0]; break; }
    }
    if (cv) { var c0 = cv.getContext("2d"); c0.setTransform(1, 0, 0, 1, 0, 0); c0.clearRect(0, 0, W, H); }
    else cv = newCanvas(Math.ceil(W / 32) * 32, Math.ceil(H / 32) * 32);
    renderInto(cv, [m[0], m[1], m[2], m[3], -bx, -by], function () { paintChildren(n, inh); });
    return { id: ++memoSeq, cv: cv, w: W, h: H, bx: bx, by: by, bytes: cv.width * cv.height * 4, used: renderSeq };
  }
  function lruAdd(e) {
    memoLRU.set(e.id, e); memoBytes += e.bytes;
    var it = memoLRU.keys();
    while (memoBytes > MEMO_LIMIT && memoLRU.size > 1) { var old = memoLRU.get(it.next().value); evict(old); }
  }
  function lruHit(e) { stats.cacheHits++; e.used = renderSeq; memoLRU.delete(e.id); memoLRU.set(e.id, e); }
  function evict(e) { memoLRU.delete(e.id); e.drop(); memoBytes -= e.bytes; if (pool.length < 12) pool.push(e.cv); }
  // content-keyed bitmaps nobody asked for in the last few frames are given back (their canvases are reused)
  function expireSig() {
    memoLRU.forEach(function (e) { if (e.sig && e.used < renderSeq - 3) evict(e); });
  }
  function drawBitmap(e, alpha, blend) {
    if (!(alpha > 0)) return;
    var m = R.m, X = m[4] + e.bx, Y = m[5] + e.by;
    R.ctx.setTransform(1, 0, 0, 1, X, Y); R.cs.tf = null; setAlpha(alpha);
    if (blend) R.ctx.globalCompositeOperation = blend;
    R.ctx.drawImage(e.cv, 0, 0, e.w, e.h, 0, 0, e.w, e.h);
    if (blend) R.ctx.globalCompositeOperation = "source-over";
    var D = R.dirty;
    if (D) { if (X < D[0]) D[0] = X; if (Y < D[1]) D[1] = Y; if (X + e.w > D[2]) D[2] = X + e.w; if (Y + e.h > D[3]) D[3] = Y + e.h; }
  }
  // paints fn() into a separate canvas with matrix M and a fresh state, then returns to the frame
  function renderInto(cv, M, fn) {
    var save = { ctx: R.ctx, cs: R.cs, dirty: R.dirty, alpha: R.alpha, m: R.m, md: R.md, W: R.W, H: R.H, level: R.level, saved: R.saved, scratch: scratch, auto: R.auto };
    var md = R.md + 1, mm = mstack[md];
    for (var i = 0; i < 6; i++) mm[i] = M[i];
    R.ctx = cv.getContext("2d"); R.cs = newCS(); R.dirty = null; R.alpha = 1; R.m = mm; R.md = md; R.W = cv.width; R.H = cv.height;
    R.level = 0; R.saved = []; R.auto = false;
    scratch = [];  // scratch surfaces sized for this canvas (only when the content has its own groups)
    try { fn(); }
    finally {
      scratch = save.scratch;
      R.ctx = save.ctx; R.cs = save.cs; R.dirty = save.dirty; R.alpha = save.alpha; R.m = save.m; R.md = save.md; R.W = save.W; R.H = save.H;
      R.level = save.level; R.saved = save.saved; R.auto = save.auto;
      R.cs.tf = null;
    }
  }
  // local bounding box of a node's content (children, in the node's own coordinates), generous for strokes and text
  var measureCtx = null;
  function boundsOf(n, inh) {
    var B = [Infinity, Infinity, -Infinity, -Infinity];
    function addPt(M, x, y) { var X = M[0] * x + M[2] * y + M[4], Y = M[1] * x + M[3] * y + M[5]; if (X < B[0]) B[0] = X; if (X > B[2]) B[2] = X; if (Y < B[1]) B[1] = Y; if (Y > B[3]) B[3] = Y; }
    function addBox(M, b, p) { addPt(M, b[0] - p, b[1] - p); addPt(M, b[2] + p, b[1] - p); addPt(M, b[0] - p, b[3] + p); addPt(M, b[2] + p, b[3] + p); }
    function walk(x, M, ih) {
      if (typeof x === "string" || x.t === "defs" || DEF_TAGS[x.t]) return;
      var a = x.a, MM = a.transform ? mul([0, 0, 0, 0, 0, 0], M, svgTransform(a.transform) || [1, 0, 0, 1, 0, 0]) : M;
      var ih2 = inherit(ih, a, a.style ? parseStyle(a.style) : null);
      var t = x.t;
      if (GEO[t] != null) {
        var b = geoBox(t, a); if (!b) return;
        var stroked = (a.stroke != null ? a.stroke : ih2.stroke) !== "none";
        var sw = stroked ? num(a["stroke-width"] != null ? a["stroke-width"] : ih2.sw, 1) : 0;
        addBox(MM, b, sw * ((a["stroke-linejoin"] || ih2.join) === "miter" ? 2.5 : 0.75) + 1);
      } else if (t === "text") {
        var f = fontOf(ih2, a), s = "", ls = num(a["letter-spacing"] != null ? a["letter-spacing"] : ih2.ls, 0) || 0;
        for (var i = 0; i < x.c.length; i++) if (typeof x.c[i] === "string") s += x.c[i];
        if (!measureCtx) measureCtx = document.createElement("canvas").getContext("2d");
        measureCtx.font = f.css;
        var w = measureCtx.measureText(s).width + Math.abs(ls) * s.length + f.size * 0.3;
        var an = a["text-anchor"] || ih2.anchor, tx = num(a.x, 0), ty = num(a.y, 0), x0 = an === "middle" ? tx - w / 2 : an === "end" ? tx - w : tx - f.size * 0.15;
        addBox(MM, [x0, ty - f.size * 1.15, x0 + w, ty + f.size * 0.4], 1);
      } else for (var j = 0; j < x.c.length; j++) walk(x.c[j], MM, ih2);
    }
    for (var k = 0; k < n.c.length; k++) walk(n.c[k], [1, 0, 0, 1, 0, 0], inh);
    return B[0] <= B[2] ? B : [0, 0, 0, 0];
  }
  // marks the <g> nodes the scenes hand back unchanged from call to call
  function learnMemo(JP) {
    var S = JP && JP._scenes, seen = new WeakMap(), call = 0;
    function walk(n) {
      if (n == null || typeof n === "string") return;
      if (Array.isArray(n)) { for (var j = 0; j < n.length; j++) walk(n[j]); return; }
      if (n.t === "g") {
        var c = seen.get(n);
        if (c != null && c !== call) { memoSet.add(n); return; } // its subtree was walked when first met
        seen.set(n, call);
      }
      for (var i = 0; i < n.c.length; i++) walk(n.c[i]);
    }
    var trees = [];
    try {
      ["world", "transit", "network"].forEach(function (k) {
        if (!S || !S[k]) return;
        for (var f = 0; f <= 900; f += 20) { call++; var t = S[k](f); trees.push(t); walk(t); }
      });
    } catch (e) { /* a scene that cannot be sampled simply gets no memo bitmaps */ }
    return trees;
  }

  /* ----------------------------------------------------- data-cache layer bitmaps */
  var layers = new Map(), layerBytes = 0, LAYER_LIMIT = 64 * 1024 * 1024;
  function drawCached(n, inh, box, key, alpha) {
    var m = R.m, sc = Math.sqrt(Math.abs(m[0] * m[3] - m[1] * m[2])) || 1;
    var blur = num(n.a["data-blur"], 0) || 0;
    var id = key + "|" + R.res, e = layers.get(id);
    if (e && (sc > e.sc * 1.25 || sc < e.sc / 1.25)) { layers.delete(id); layerBytes -= e.bytes; e = null; }
    if (e) { stats.cacheHits++; layers.delete(id); layers.set(id, e); }
    else { stats.cacheMisses++; e = renderLayer(n, inh, box, sc, blur); layers.set(id, e); layerBytes += e.bytes; trimLayers(); }
    if (!(alpha > 0)) return;
    var ctx = R.ctx;
    pushM([1 / e.sc, 0, 0, 1 / e.sc, box[0] - e.px / e.sc, box[1] - e.py / e.sc]);
    setTf(); setAlpha(alpha);
    ctx.drawImage(e.cv, 0, 0);
    if (R.dirty) dirty(0, 0, e.cv.width, e.cv.height, 2);
    popM();
  }
  function trimLayers() {
    var it = layers.keys();
    while (layerBytes > LAYER_LIMIT && layers.size > 1) { var k = it.next().value, e = layers.get(k); layers.delete(k); layerBytes -= e.bytes; }
    stats.layerBytes = layerBytes;
  }
  function renderLayer(n, inh, box, sc, blur) {
    var pad = Math.ceil(blur * 3 * sc) + 1, px = pad, py = pad;
    // gradients are dithered in a pattern tied to device pixels: keep the bitmap origin on that pattern's grid
    var ox = R.m[4] + box[0] * sc - pad, oy = R.m[5] + box[1] * sc - pad;
    if (Math.abs(ox - Math.round(ox)) < 1e-6) px += ((Math.round(ox) % 8) + 8) % 8;
    if (Math.abs(oy - Math.round(oy)) < 1e-6) py += ((Math.round(oy) % 8) + 8) % 8;
    var w = Math.max(1, Math.ceil(box[2] * sc) + px + pad), h = Math.max(1, Math.ceil(box[3] * sc) + py + pad);
    var cv = newCanvas(w, h);
    renderInto(cv, [sc, 0, 0, sc, px - box[0] * sc, py - box[1] * sc], function () { paintChildren(n, inh); });
    if (blur > 0) cv = blurred(cv, blur * sc);
    return { cv: cv, sc: sc, px: px, py: py, bytes: cv.width * cv.height * 4 };
  }
  // blurs a bitmap once: ctx.filter where it exists; otherwise a few halving passes and one scale back up
  // (Safari has no ctx.filter; the result is softer-edged than a true gaussian but close at these radii)
  function blurred(src, px) {
    var out = document.createElement("canvas"); out.width = src.width; out.height = src.height;
    var o = out.getContext("2d");
    if (HAS_FILTER) { o.filter = "blur(" + px + "px)"; o.drawImage(src, 0, 0); o.filter = "none"; return out; }
    var steps = Math.max(1, Math.min(5, Math.round(Math.log(Math.max(2, px)) / Math.LN2))), cur = src, w = src.width, h = src.height;
    for (var i = 0; i < steps; i++) {
      w = Math.max(1, w >> 1); h = Math.max(1, h >> 1);
      var c = document.createElement("canvas"); c.width = w; c.height = h;
      var cc = c.getContext("2d"); cc.imageSmoothingQuality = "high"; cc.drawImage(cur, 0, 0, w, h); cur = c;
    }
    o.imageSmoothingQuality = "high"; o.drawImage(cur, 0, 0, out.width, out.height);
    return out;
  }

  /* ------------------------------------------------------------------ HTML walker */
  function bgGradient(L, w, h) {
    var key = (R.maskMode ? "M" : "") + JSON.stringify(L) + "|" + w + "|" + h, hit = cssBgCache.get(key);
    if (hit) return hit;
    var out = null;
    if (L.type === "linear") {
      var ang = L.angle * DEG, sx = Math.sin(ang), sy = -Math.cos(ang), len = Math.abs(w * sx) + Math.abs(h * sy);
      var st = resolveStops(L.stops, len), lo = Math.min(0, st[0].p), hi = Math.max(1, st[st.length - 1].p);
      var cx = w / 2, cy = h / 2, x0 = cx - sx * len / 2, y0 = cy - sy * len / 2, dx = sx * len, dy = sy * len;
      var g = R.main.createLinearGradient(x0 + dx * lo, y0 + dy * lo, x0 + dx * hi, y0 + dy * hi);
      addStops(g, st, lo, hi, R.maskMode);
      var am = ((L.angle % 180) + 180) % 180;
      out = { g: g, tf: null, key: key, linear: true, axis: am === 0 ? "v" : am === 90 ? "h" : null };
    } else if (L.type === "radial") {
      var px = kwPos(L.at[0], w), py = kwPos(L.at[1], h), rx, ry;
      var fx = Math.max(px, w - px), fy = Math.max(py, h - py), nx = Math.min(px, w - px), ny = Math.min(py, h - py);
      var sz = L.size;
      if (sz && sz.length === 2 && !/side|corner/.test(sz[0])) { rx = cssLen(sz[0], w); ry = cssLen(sz[1], h); }
      else if (sz && sz.length === 1 && !/side|corner/.test(sz[0])) { rx = ry = cssLen(sz[0], w); }
      else {
        var kw = sz ? sz[0] : "farthest-corner", circle = L.shape === "circle";
        if (kw === "closest-side") { rx = nx; ry = ny; if (circle) rx = ry = Math.min(nx, ny); }
        else if (kw === "farthest-side") { rx = fx; ry = fy; if (circle) rx = ry = Math.max(fx, fy); }
        else if (kw === "closest-corner") { if (circle) rx = ry = Math.hypot(nx, ny); else { rx = nx * Math.SQRT2; ry = ny * Math.SQRT2; } }
        else { if (circle) rx = ry = Math.hypot(fx, fy); else { rx = fx * Math.SQRT2; ry = fy * Math.SQRT2; } }
      }
      if (!(rx > 0) || !(ry > 0)) return cssBgCache.set(key, { none: true });
      var rs = resolveStops(L.stops, rx), rhi = Math.max(1, rs[rs.length - 1].p);
      var rg = R.main.createRadialGradient(0, 0, 0, 0, 0, rhi);
      addStops(rg, rs, 0, rhi, R.maskMode);
      out = { g: rg, tf: [rx, 0, 0, ry, px, py], key: key, linear: false, axis: null };
    }
    return cssBgCache.set(key, out || { none: true });
  }
  function paintBg(layersList, w, h, alpha) {
    var ctx = R.ctx;
    for (var i = layersList.length - 1; i >= 0; i--) {
      var L = layersList[i];
      setTf(); setAlpha(alpha);
      if (L.type === "color") { setFill(R.maskMode ? lumAlpha(L.c, 1) : L.c); ctx.fillRect(0, 0, w, h); }
      else {
        var g = bgGradient(L, w, h); if (g.none) continue;
        if (spriteFill(g, g.tf || [1, 0, 0, 1, 0, 0], "box", null, null, [0, 0, w, h], alpha)) continue;
        ctx.beginPath(); ctx.rect(0, 0, w, h);
        if (g.tf) { pushM(g.tf); setTf(); popM(); }
        setFill(g.g); ctx.fill();
      }
    }
    if (R.dirty) dirty(0, 0, w, h, 2);
  }

  function paintHtml(n, cb) {
    if (typeof n === "string") return;  // HTML text is not drawn (JX_CLEAN_HERO hides it all)
    stats.nodes++;
    if (n.t === "svg") { paintSvgRoot(n, cb); return; }
    var a = n.a, st = a.style ? parseStyle(a.style) : null;
    if (st && st.$hidden) return;
    var op = st ? st.$op : 1;
    if (!(op > 0)) return;
    var x = 0, y = 0, w = cb.w, h = 0, abs = st && st.$abs;
    if (abs) {
      var l = st.$l, t = st.$t, r = st.$r, b = st.$b;
      var W = st.width != null && st.width !== "auto" ? cssLen(st.width, cb.w) : null, H = st.height != null && st.height !== "auto" ? cssLen(st.height, cb.h) : null;
      x = l != null && l !== "auto" ? cssLen(l, cb.w) : (r != null && W != null ? cb.w - cssLen(r, cb.w) - W : 0);
      y = t != null && t !== "auto" ? cssLen(t, cb.h) : (b != null && H != null ? cb.h - cssLen(b, cb.h) - H : 0);
      w = W != null ? W : (r != null && r !== "auto" ? cb.w - x - cssLen(r, cb.w) : 0);
      h = H != null ? H : (b != null && b !== "auto" ? cb.h - y - cssLen(b, cb.h) : 0);
    } else if (st && st.height != null) h = cssLen(st.height, cb.h);
    var hasKids = false;
    for (var i = 0; i < n.c.length; i++) if (typeof n.c[i] !== "string") { hasKids = true; break; }
    var hasBg = st && st.$bg && st.$bg.length;
    if (!hasKids && !hasBg) return;
    var M = [1, 0, 0, 1, x, y];
    if (st && st.transform && st.transform !== "none") {
      var o = (st["transform-origin"] || "50% 50%").split(/\s+/), ox = kwPos(o[0], w), oy = kwPos(o[1] || "50%", h);
      mul(M, M, [1, 0, 0, 1, ox, oy]); mul(M, M, cssTransform(st.transform, w, h)); mul(M, M, [1, 0, 0, 1, -ox, -oy]);
    }
    pushM(M);
    var blend = st && st.$blend, isolate = !!((op < 1 && hasKids) || (st && st.$mask) || blend);
    if (isolate) beginScratch();
    var alpha = isolate ? 1 : R.alpha * op;
    if (hasBg) paintBg(st.$bg, w, h, alpha);
    if (hasKids) {
      var clip = st && (st.overflow === "hidden" || st.overflow === "clip");
      if (clip) { ctxSave(); setTf(); R.ctx.beginPath(); R.ctx.rect(0, 0, w, h); R.ctx.clip(); R.cs.tf = null; }
      var keep = R.alpha; R.alpha = alpha;
      var inner = abs || (st && st.transform) ? { w: w, h: abs ? h : cb.h } : cb;
      for (var k = 0; k < n.c.length; k++) paintHtml(n.c[k], inner);
      R.alpha = keep;
      if (clip) ctxRestore();
    }
    if (isolate) {
      if (st.$mask && st.$mask.length) {
        // CSS mask-image: keep the picture only where the mask layer has alpha (outside the box: nothing)
        var D = dirtyRect(R.dirty);
        if (D) {
          var c = R.ctx; c.save(); c.globalCompositeOperation = "destination-in";
          var keepMode = R.maskMode; R.maskMode = true;
          var L = st.$mask[0];
          setTf();
          if (L.type === "color") { c.fillStyle = "rgba(0,0,0," + parseColor(L.c)[3] + ")"; c.beginPath(); c.rect(0, 0, w, h); c.fill(); }
          else { var g = bgGradient(L, w, h); c.beginPath(); c.rect(0, 0, w, h); if (g.tf) { pushM(g.tf); setTf(); popM(); } c.fillStyle = g.none ? "rgba(0,0,0,0)" : g.g; c.globalAlpha = 1; c.fill(); }
          R.maskMode = keepMode;
          c.restore(); ctxRestore0();
        }
      }
      endScratch(R.saved[R.saved.length - 1].alpha * op, blend);
    }
    popM();
  }
  function ctxRestore0() { var cs = R.cs; cs.tf = null; cs.fill = null; cs.stroke = null; cs.alpha = -1; cs.lw = -1; cs.font = null; cs.cap = null; cs.join = null; cs.miter = -1; }

  function paintSvgRoot(n, cb) {
    var a = n.a, st = a.style ? parseStyle(a.style) : null;
    if (st && st.$hidden) return;
    var x = 0, y = 0, w, h;
    w = a.width != null ? cssLen(a.width, cb.w) : cb.w;
    h = a.height != null ? cssLen(a.height, cb.h) : cb.h;
    if (st && st.$abs) {
      if (st.$l != null) x = cssLen(st.$l, cb.w);
      if (st.$t != null) y = cssLen(st.$t, cb.h);
      if (a.width == null && st.$r != null) w = cb.w - x - cssLen(st.$r, cb.w);
      if (a.height == null && st.$b != null) h = cb.h - y - cssLen(st.$b, cb.h);
    }
    if (st && st.width != null) w = cssLen(st.width, cb.w);
    if (st && st.height != null) h = cssLen(st.height, cb.h);
    if (!(w > 0) || !(h > 0)) return;
    var M = [1, 0, 0, 1, x, y];
    if (a.viewBox) {
      var vb = numsOf(a.viewBox);
      if (vb.length === 4 && vb[2] > 0 && vb[3] > 0) {
        var par = (a.preserveAspectRatio || "xMidYMid meet").split(/\s+/), align = par[0], sx = w / vb[2], sy = h / vb[3];
        if (align !== "none") { var s = par[1] === "slice" ? Math.max(sx, sy) : Math.min(sx, sy); sx = sy = s; }
        var ax = /xMid/.test(align) ? 0.5 : /xMax/.test(align) ? 1 : 0, ay = /YMid/.test(align) ? 0.5 : /YMax/.test(align) ? 1 : 0;
        if (align === "none") ax = ay = 0;
        mul(M, M, [sx, 0, 0, sy, (w - vb[2] * sx) * ax - vb[0] * sx, (h - vb[3] * sy) * ay - vb[1] * sy]);
      }
    }
    var clip = !st || (st.overflow !== "visible");
    pushM([1, 0, 0, 1, x, y]);
    if (clip) { ctxSave(); setTf(); R.ctx.beginPath(); R.ctx.rect(0, 0, w, h); R.ctx.clip(); R.cs.tf = null; }
    popM();
    pushM(M);
    var op = (a.opacity != null ? num(a.opacity, 1) : 1) * (st ? st.$op : 1);
    if (op > 0) paintGroup(n, inherit(INH0, a, null), op, st && st.$blend, st);
    popM();
    if (clip) ctxRestore();
  }

  /* -------------------------------------------------------------------- frames */
  function render(ctx, tree, env, opts) {
    var T = ctx.getTransform();
    var cv = ctx.canvas;
    stats.nodes = 0; stats.shapes = 0; stats.groups = 0; stats.cacheHits = 0; stats.cacheMisses = 0;
    renderSeq++;
    R = { main: ctx, ctx: ctx, cs: newCS(), m: mstack[0], md: 0, alpha: 1, dirty: null, level: 0, saved: [], maskMode: false,
      W: cv.width, H: cv.height, res: env && env.res || 1, defs: new Map(), fullScan: false, root: { t: "g", a: {}, c: [] },
      auto: !!(opts && opts.memo) };
    var m0 = mstack[0]; m0[0] = T.a; m0[1] = T.b; m0[2] = T.c; m0[3] = T.d; m0[4] = T.e; m0[5] = T.f;
    for (var i = 1; i < scratch.length; i++) if (scratch[i]) { var s = scratch[i]; s.cs = newCS(); }
    var list = [];
    (function flat(c) { if (c == null || c === false || c === true) return; if (Array.isArray(c)) { for (var j = 0; j < c.length; j++) flat(c[j]); return; } list.push(c); })(tree);
    R.root.c = list;
    var W = env && env.width || 1920, H = env && env.height || 1080;
    ctx.save();
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over"; ctx.setLineDash([]); ctx.lineDashOffset = 0;
    if (HAS_LS) ctx.letterSpacing = "0px";
    ctx.imageSmoothingEnabled = true;
    try { for (var k = 0; k < list.length; k++) paintHtml(list[k], { w: W, h: H }); }
    finally {
      // unwind anything an exception left open so the next frame starts clean
      while (R.level > 0) { var sv = R.saved.pop(); clearScratch(R.level, [0, 0, R.W, R.H]); R.level--; R.ctx = sv.ctx; }
      ctx.restore();
      expireSig();
      stats.pathCache = pathCache.m.size; stats.memoBytes = memoBytes; stats.isoBytes = isoBytes;
      R = null;
    }
  }

  function fontsReady(trees) {
    if (typeof document === "undefined" || !document.fonts || !document.fonts.load) return Promise.resolve();
    // walk the scenes once and ask for every font + text actually used, so canvas text never draws a fallback
    var want = new Map();
    function walk(n, inh) {
      if (n == null || typeof n === "string") return;
      if (Array.isArray(n)) { for (var j = 0; j < n.length; j++) walk(n[j], inh); return; }
      var i2 = inherit(inh, n.a, null);
      if (n.t === "text") {
        var s = n.c.filter(function (c) { return typeof c === "string"; }).join("");
        var f = fontOf(i2, n.a).css.replace(/[\d.]+px/, "20px");
        want.set(f, (want.get(f) || "") + s);
      }
      for (var i = 0; i < n.c.length; i++) walk(n.c[i], i2);
    }
    for (var t = 0; t < trees.length; t++) walk(trees[t], INH0);
    var jobs = [];
    want.forEach(function (text, font) {
      var uniq = Array.from(new Set(Array.from(text))).join("");
      jobs.push(document.fonts.load(font, uniq).catch(function () {}));
    });
    ["400", "700", "800"].forEach(function (w) { jobs.push(document.fonts.load(w + ' 20px "Noto Sans JP"', "三豊運輸物流センター関東新潟Sanpou0123").catch(function () {})); });
    return Promise.all(jobs).then(function () {});
  }

  function create(JP) {
    var S = JP._scenes;
    function scene(name) {
      return function (ctx, frame, time, env) {
        var tree = name === "transit" ? S.transit(frame) : S[name](frame, time);
        render(ctx, tree, env, RENDER_OPTS);
      };
    }
    var RENDER_OPTS = { memo: true };
    return {
      scenes: { world: scene("world"), transit: scene("transit"), network: scene("network") },
      ready: fontsReady(learnMemo(JP)),
      stats: function () { var o = {}; for (var k in stats) o[k] = stats[k]; return o; }
    };
  }

  // a list of the bitmaps kept for memoised / content-keyed groups (for diagnostics)
  function bitmaps() { var out = []; memoLRU.forEach(function (e) { out.push({ w: e.w || e.cv.width, h: e.h || e.cv.height, mb: +(e.bytes / 1048576).toFixed(2), sig: !!e.sig }); }); return out; }
  root.VCanvas = { create: create, render: render, bitmaps: bitmaps, stats: function () { var o = {}; for (var k in stats) o[k] = stats[k]; return o; } };
})(typeof window !== "undefined" ? window : this);
