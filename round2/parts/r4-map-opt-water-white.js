/* Scene 04 look, OPTION 1 "open water, white area" (option frame, not polished).
   The panel is the sea in the film's own blue. Japan lies in it as it really does: every prefecture that
   falls inside the frame is drawn (the map data always had them), so every edge of the land is real coast
   and the left of the frame, where the site's copy sits, is quiet land. The service area is Sanpou white.
   What moves: the water. A still shelf of shallow water follows every coast; off the service area's own
   Pacific coast three broad flat bands travel outward from the land and fade into the sea.
   Build: sh tools/build-side.sh trial3 round2/parts/r4-map-opt-water-white.js */

//== REPLACE from "  DAY.map = {" to "  // the four neighbours that touch our area"
  DAY.map = {
    sea: "#5fabe4",           // the panel: the sea, in the sky's own blue
    shelf: [191, 223, 245],   // shallow water along every coast (still)
    deep: [95, 171, 228],     // = sea: what the travelling bands fade into
    land: "#a9bbdb",          // the rest of Japan: the city's blue-grey
    landSeam: "#98acd1",      // prefecture lines on that land
    heatLo: [219, 232, 247],  // covered, least delivered: a pale cool tint
    heatHi: [255, 255, 255],  // covered, most delivered: Sanpou white
    heatPow: 0.75,
    seam: "#7fa3d1",          // the crisp seam between two covered prefectures
    label: "#3b5b85",         // the prefecture names
    labelK: 1,
    route: "#e16347",         // the route line keeps the brand vermilion
    routeCase: "#ffffff",
    flow: "#ffffff",
    depotLit: "#fbfdff",
    depotBay: "#2c4469", depotShutter: "#b3c2dc", depotGlass: "#8ebfe8", depotGlassLit: "#d2e7f8",
    ink: "#13263f",
    dot: "#ffffff",           // the ring round a place dot
    card: "#1f3b66",          // the name cards: small navy signs, white lettering
    cardText: "#ffffff",
    cardRim: "#13263f",
  };
//== REPLACE from "  function mapHeat(ht) {" to "  var mr1 = function (v)"
  function mapHeat(ht) {
    var lo = DAY.map.heatLo, hi = DAY.map.heatHi, t = Math.pow(ht, DAY.map.heatPow);
    var L = function (i) { return Math.round(lo[i] + (hi[i] - lo[i]) * t); };
    return "rgb(" + L(0) + "," + L(1) + "," + L(2) + ")";
  }
//== REPLACE from "  /* the plate: silhouette, its shaded edge and its one contact shadow" to "  /* A miniature Sanpou depot,"
  /* ---- the sea the map lies in, and the land of Japan around the service area ----
     The map's own box on the stage; the land and the water are drawn in the same box with the same viewBox,
     so they are in register with the prefectures by construction. */
  var MAP_BOX = [535, 12, 850, 1056];
  var SWELL = { n: 3, d0: 13, d1: 190, period: 34 / 9, tol: 2.2 };
  var _mapGeo = null;
  function mapGeo() {
    if (_mapGeo) return _mapGeo;
    var M = mapInit(), B = M.bounds, k = Math.min(MAP_BOX[2] / B[2], MAP_BOX[3] / B[3]);
    var mx = B[0] + B[2] / 2, my = B[1] + B[3] / 2, sx = MAP_BOX[0] + MAP_BOX[2] / 2, sy = MAP_BOX[1] + MAP_BOX[3] / 2;
    // the stage's edges in map units, with room for the map being a little smaller while it arrives and leaves
    var win = [mx - sx / k - 80, my - sy / k - 80, mx + (1920 - sx) / k + 80, my + (1080 - sy) / k + 80];
    var ds = JRMAP.covered.map(function (c) { return c.d; }).concat(JRMAP.greys);
    var rings = ds.map(function (d) {
      var n = d.match(/-?\d+(\.\d+)?/g) || [], r = [];
      for (var i = 0; i + 1 < n.length; i += 2) {
        var x = Number(n[i]), y = Number(n[i + 1]);
        if (!r.length || r[r.length - 1][0] !== x || r[r.length - 1][1] !== y) r.push([x, y]);
      }
      if (r.length > 1 && r[0][0] === r[r.length - 1][0] && r[0][1] === r[r.length - 1][1]) r.pop();
      return r;
    });
    var bbOf = function (r) {
      var b = [Infinity, Infinity, -Infinity, -Infinity];
      r.forEach(function (p) { if (p[0] < b[0]) b[0] = p[0]; if (p[0] > b[2]) b[2] = p[0]; if (p[1] < b[1]) b[1] = p[1]; if (p[1] > b[3]) b[3] = p[1]; });
      return b;
    };
    var inWin = function (b, pad) { return b[2] > win[0] - pad && b[0] < win[2] + pad && b[3] > win[1] - pad && b[1] < win[3] + pad; };
    // a border between two prefectures is the same edge in both rings; an edge found once is coast
    var ek = function (a, b) { var ka = a[0] + "," + a[1], kb = b[0] + "," + b[1]; return ka < kb ? ka + "|" + kb : kb + "|" + ka; };
    var used = {};
    rings.forEach(function (r) { for (var i = 0; i < r.length; i++) { var q = ek(r[i], r[(i + 1) % r.length]); used[q] = (used[q] || 0) + 1; } });
    var coast = [];
    rings.forEach(function (r, ri) {
      var n = r.length, isC = function (i) { return used[ek(r[(i + n) % n], r[(i + 1) % n])] === 1; };
      var start = -1;
      for (var i = 0; i < n; i++) if (!isC(i)) { start = i; break; }
      if (start < 0) { coast.push({ src: ri, pts: r.concat([r[0]]) }); return; }       // an island
      var run = null;
      for (var j = 1; j <= n; j++) {
        var i2 = (start + j) % n;
        if (isC(i2)) { if (!run) run = [r[i2]]; run.push(r[(i2 + 1) % n]); }
        else if (run) { coast.push({ src: ri, pts: run }); run = null; }
      }
      if (run) coast.push({ src: ri, pts: run });
    });
    coast.forEach(function (c) { c.bb = bbOf(c.pts); });
    return _mapGeo = { win: win, rings: rings, bbs: rings.map(bbOf), coast: coast, inWin: inWin };
  }
  // Douglas-Peucker on an open line: both ends stay
  function mapSimplify(pts, tol) {
    var keep = [], stack = [[0, pts.length - 1]];
    keep[0] = keep[pts.length - 1] = 1;
    while (stack.length) {
      var s = stack.pop(), a = pts[s[0]], b = pts[s[1]], worst = 0, at = -1;
      var dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy;
      for (var i = s[0] + 1; i < s[1]; i++) {
        var t = L2 ? Math.max(0, Math.min(1, ((pts[i][0] - a[0]) * dx + (pts[i][1] - a[1]) * dy) / L2)) : 0;
        var d = Math.hypot(pts[i][0] - a[0] - t * dx, pts[i][1] - a[1] - t * dy);
        if (d > worst) { worst = d; at = i; }
      }
      if (worst > tol) { keep[at] = 1; stack.push([s[0], at], [at, s[1]]); }
    }
    return pts.filter(function (_, i) { return keep[i]; });
  }
  var mapLine = function (pts) { return "M" + pts.map(function (p) { return p[0] + "," + p[1]; }).join("L"); };
  /* the still part: the shelf of shallow water along every coast, and the land of Japan on it */
  var _mapShore = null;
  function mapShore() {
    if (_mapShore) return _mapShore;
    var G = mapGeo(), C = DAY.map, S = SWELL;
    var shelf = G.coast.filter(function (c) { return G.inWin(c.bb, S.d0); })
      .map(function (c) { return mapLine(mapSimplify(c.pts, 0.8)); }).join("");
    // the service area's own Pacific coast: Tokyo, Kanagawa, Chiba, Ibaraki (the first four and the fifth ring)
    var own = { TOKYO: 1, KANAGAWA: 1, CHIBA: 1, IBARAKI: 1 };
    var swell = G.coast.filter(function (c) { return c.src < JRMAP.covered.length && own[JRMAP.covered[c.src].en]; })
      .map(function (c) { return mapLine(mapSimplify(c.pts, S.tol)); }).join("");
    var land = [];
    G.rings.forEach(function (r, i) {
      if (!G.inWin(G.bbs[i], 0)) return;
      land.push(h("path", { d: mapLine(r) + "Z", fill: C.land, stroke: C.landSeam, strokeWidth: 1.1, strokeLinejoin: "round" }));
    });
    return _mapShore = {
      swell: swell,
      shelf: h("path", { d: shelf, fill: "none", stroke: "rgb(" + C.shelf.join(",") + ")", strokeWidth: S.d0 * 2, strokeLinejoin: "round", strokeLinecap: "round" }),
      land: land,
    };
  }
  /* the water that moves: n bands, the furthest drawn first. Each is the coast line stroked 2 x its reach
     wide, so its outer edge is an exact offset of the coast; it leaves the shelf in the shelf's colour and
     reaches d1 in the sea's colour, so a band is never born and never ends at a visible edge. When the
     furthest has dissolved, every node takes over the band of the node after it: the picture is continuous. */
  function MapSwell(time) {
    var S = SWELL, C = DAY.map, shore = mapShore(), p = ((time / S.period) % 1 + 1) % 1;
    return range(S.n, function (j) {
      var u = (p + (S.n - 1 - j)) / S.n, reach = S.d0 + (S.d1 - S.d0) * u;
      var col = "rgb(" + [0, 1, 2].map(function (i) { return Math.round(C.shelf[i] + (C.deep[i] - C.shelf[i]) * u); }).join(",") + ")";
      return h("path", { d: shore.swell, fill: "none", stroke: col, strokeWidth: (reach * 2).toFixed(2), strokeLinejoin: "round", strokeLinecap: "round" });
    });
  }
  function MapSea(time) {
    var M = mapInit(), shore = mapShore();
    var box = { position: "absolute", left: 0, top: 0, width: "100%", height: "100%" };
    return [
      h("div", { style: box },
        h("svg", { viewBox: M.bounds.join(" "), width: "100%", height: "100%", style: { overflow: "visible" } }, MapSwell(time), shore.shelf)),
      h("div", { style: box },
        h("svg", { viewBox: M.bounds.join(" "), width: "100%", height: "100%", style: { overflow: "visible" } }, shore.land)),
    ];
  }

//== REPLACE from "    var M = mapInit(), C = DAY.map, HUB = M.HUB, plate = mapPlate(), routes = mapRoutes();" to "        routes.map(function (r, i) {"
    var M = mapInit(), C = DAY.map, HUB = M.HUB, routes = mapRoutes();

    return h("svg", { viewBox: M.bounds.join(" "), width: "100%", height: "100%", style: { overflow: "hidden" } },
      h("defs", null,
        JRMAP.covered.map(function (cp) {
          var nf = M.info[cp.en], k = clamp01((prefProgress - nf.rank * 0.055) * 1.45), grow = bellEase(k) * nf.span;
          return h("clipPath", { id: "nm4w" + nf.rank },
            h("rect", { x: -grow, y: -2400, width: grow * 2, height: 4800,
              transform: "translate(" + HUB.x + "," + HUB.y + ") rotate(" + mr1(nf.deg) + ")" }));
        })
      ),
      h("g", null,
        JRMAP.covered.map(function (cp) {
          var nf = M.info[cp.en];
          return h("g", { clipPath: "url(#nm4w" + nf.rank + ")" },
            h("path", { d: cp.d, fill: mapHeat(cp.heat), stroke: C.seam, strokeWidth: 1.9, strokeLinejoin: "round" }));
        }),
//== REPLACE from "            fontFamily: FONTS.jp, fontWeight: 700, fontSize: L.f, fill: C.ink, opacity: e * 0.92 }, cp.jp);" to "        }),"
            fontFamily: FONTS.jp, fontWeight: 700, fontSize: L.f, fill: C.label, opacity: e * C.labelK }, cp.jp);
//== REPLACE from "                h(\"circle\", { cx: B.x, cy: B.y, r: b.hq ? 0 : mr2(3.9 * dk), fill: C.card })," to "                h(\"circle\", { cx: B.x, cy: B.y, r: b.hq ? 0 : mr2(2 * dk), fill: C.ink }));"
                h("circle", { cx: B.x, cy: B.y, r: b.hq ? 0 : mr2(3.9 * dk), fill: C.dot }),
//== REPLACE from "                  h(\"rect\", { x: vx, y: y0 + 1.9, width: vw, height: CARD_H, rx: 2.4, fill: C.rim })," to "                  h(\"g\", { clipPath: \"url(#nm4c\" + j + \")\" },"
                  h("rect", { x: vx, y: y0 + 1.9, width: vw, height: CARD_H, rx: 2.4, fill: C.cardRim }),
                  h("rect", { x: vx, y: y0, width: vw, height: CARD_H, rx: 2.4, fill: C.card }),
//== REPLACE from "                      fontFamily: FONTS.jp, fontWeight: 700, fontSize: CARD_F, fill: C.ink }, b.nm))));" to "            })"
                      fontFamily: FONTS.jp, fontWeight: 700, fontSize: CARD_F, fill: C.cardText }, b.nm))));
//== REPLACE from "      h(\"div\", { style: { position: \"absolute\", left: 535, top: 12, width: 850, height: 1056," to "      recede < 0.96 ? h(\"div\", { style: { opacity: 1 - recede,"
      // the panel: the sea, over the sky while the map is up. It fades on the curve the map leaves on, so the
      // sky and the finale's world arrive together; once the map is gone it is not drawn at all.
      h("div", { style: { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: DAY.map.sea, opacity: (1 - recede).toFixed(3), display: recede < 1 ? "block" : "none" } },
        h("div", { style: { position: "absolute", left: MAP_BOX[0], top: MAP_BOX[1], width: MAP_BOX[2], height: MAP_BOX[3], opacity: mapIn.toFixed(3), transform: "scale(" + ((0.95 + 0.05 * mapIn) * (1 - recede * 0.08)) + ") translate(" + (recede * -36) + "px, " + ((1 - mapIn) * 34) + "px)", transformOrigin: "46% 46%" } },
          MapSea(time),
          h("div", { style: { position: "absolute", left: 0, top: 0, width: "100%", height: "100%" } },
            CoverageMap({ prefProgress: prefK, routeProgress: routeK, pinProgress: pinK, depotFrame: frame, flowTime: time, mapIn: mapIn })))),
