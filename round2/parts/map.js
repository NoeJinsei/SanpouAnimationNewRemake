//== REPLACE from "  /* ---- CoverageMap.tsx (JRMAP is a global from mapdata.js; bounds computed lazily) */" to "  /* ============================== SCENES ============================== */"
  /* ---- round 2, scene 04: the 配送ネットワーク map redrawn from a blank page -----------------------
     The map is an OBJECT, not a flat fill: one land silhouette lifted off the sky, with a shaded edge
     under it (the plate's thickness) and a single flat contact shadow down-left of it. Land is one cool
     grey tone; the covered prefectures sit on it in the film's teal family (deepest where we deliver
     most), each separated from its neighbour by a crisp pale seam, so the service area reads as a set of
     real prefecture shapes instead of one orange blob with lines on it. Vermilion is kept scarce: only
     the routes, the depots' fascia line and the head office's card tab.
     Sequence (all inside the timings the player already drives):
       plate   mapIn 0-26  the silhouette settles, its edge and shadow opening out under it
       prefs   4-56        each prefecture is wiped in by a band growing outward from the hub, in rank
                           order of distance from Itabashi, so the colour spreads like ink from Tokyo
       routes  34-78       seven curved corridors draw from the hub with a long soft landing, then light
                           up with flowing dashes and one travelling highlight each
       depots  60-78       three miniature Sanpou depots land with weight, overshoot and settle, their
                           name cards sliding out on a leader afterwards
     Never frozen while it holds: on all seven corridors the dashes flow outward and a highlight travels
     the whole way, and the three anchor rings breathe, each on its own phase.
     Engine: the node list is the same shape on every frame; every id is prefixed nm4; the only clip is a
     clipPath with one rect child; no masks, filters or blur. */
  DAY.map = {
    land: "#bfcad4",        // the country that is not our service area: one cool grey tone, kept
                            // light so it never competes with the teal of the area we cover
    landSeam: "#a5b2bf",    // prefecture lines on that land
    rim: "#5b7489",         // the plate's shaded edge, seen under the silhouette
    cast: "rgba(32,58,90,0.13)", // the one flat contact shadow
    heatLo: [183, 222, 216],// covered, least delivered: pale sea-foam
    heatHi: [23, 99, 111],  // covered, most delivered: deep teal
    seam: "#eef8f7",        // the crisp seam between two covered prefectures
    route: "#e16347",       // the route line keeps the brand vermilion
    routeCase: "#ffffff",   // white casing so a route reads over any prefecture tone
    flow: "#ffffff",
    depot: "#f8fbfd", depotShade: "#d7e5f0", depotRoof: "#e5eef5", depotDock: "#9fbdd4",
    ink: "#13263f",
    card: "#ffffff", cardLine: "rgba(19,38,63,0.20)",
  };
  // the four neighbours that touch our area and still fit inside the map box, so the plate's outline is
  // all real coast and real prefecture border — the other 20 grey shapes are dropped with their 33k of
  // path data (the original faded them out with a mask, which this build is not allowed to use)
  var MAP_NEIGHBOURS = [5, 9, 10, 12];
  var MAP_PAD = 38;
  function mapHeat(ht) {
    var lo = DAY.map.heatLo, hi = DAY.map.heatHi, t = Math.pow(ht, 0.75);
    var L = function (i) { return Math.round(lo[i] + (hi[i] - lo[i]) * t); };
    return "rgb(" + L(0) + "," + L(1) + "," + L(2) + ")";
  }
  var mr1 = function (v) { return Math.round(v * 10) / 10; };
  var easeOutQuart = function (t) { return 1 - Math.pow(1 - t, 4); };
  var easeOutQuint = function (t) { return 1 - Math.pow(1 - t, 5); };
  var bellEase = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2; };

  /* Every name sits inside its own shape, clear of the routes, the depots and the other names; the spots
     were found by searching each polygon for the point furthest from its border that also clears
     everything else (tools/… scratch search, 2026-11-14). */
  var MAP_LABEL = {
    TOKYO: { x: 456.4, y: 791.3, f: 11.5 }, SAITAMA: { x: 461.4, y: 756.5, f: 11.5 },
    KANAGAWA: { x: 451.5, y: 830.6, f: 14 }, CHIBA: { x: 565.7, y: 851.7, f: 15 },
    IBARAKI: { x: 581.4, y: 715.6, f: 15 }, TOCHIGI: { x: 523.7, y: 628.1, f: 15 },
    GUNMA: { x: 411.4, y: 665.9, f: 15 }, NIIGATA: { x: 397.0, y: 552.7, f: 15 },
  };
  var ROUTE_ORDER = ["CHIBA", "IBARAKI", "TOCHIGI", "GUNMA", "NIIGATA", "KANAGAWA", "SAITAMA"];
  var ROUTE_END = {
    CHIBA: [551, 833], IBARAKI: [612, 672], TOCHIGI: [523, 657], GUNMA: [432, 684],
    NIIGATA: [403, 577], KANAGAWA: [470, 826], SAITAMA: [430, 718],
  };
  // one corridor per direction: the bearing each route leaves the hub on. Swept for the widest possible
  // fan — the closest two corridors stay 14 map units (23 stage px) apart, so none crowds another.
  var ROUTE_DEP = { CHIBA: 48, IBARAKI: -36, TOCHIGI: -66, NIIGATA: -96, GUNMA: -132, SAITAMA: -170, KANAGAWA: 122 };
  /* The three bases are only 38 map units apart in reality, so the three depots cannot stand on their own
     spots without becoming one clump. Each keeps a dot where it really is and its building is lifted off
     that dot on a stem of its own length and direction — 48 u east, 44 u north, 40 u west — which leaves
     43.7 map units (71 stage px) of clear air between the three illustrations. Each card sits against its
     own building (4.8-7.5 u from it), fully on covered land, never on the grey, never over another depot's
     dot or stem, and 22 u from the next card. Measured by the scratch layout solver, 2026-11-14. */
  var MAP_BASES = [
    { id: "itabashi", nm: "本社（板橋）", bld: [552, 768], w: 22, hq: true, card: [572, 786], t0: 0 },
    { id: "shiki", nm: "志木営業所", bld: [487, 726], w: 19, hq: false, card: [487, 696], t0: 0.17 },
    { id: "iruma", nm: "入間営業所", bld: [428, 766], w: 19, hq: false, card: [428, 736], t0: 0.32 },
  ];
  var CARD_F = 10, CARD_H = 18;

  var _mapInit = null;
  function mapInit() {
    if (_mapInit) return _mapInit;
    var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, info = {};
    JRMAP.covered.forEach(function (c) {
      var nums = c.d.match(/-?\d+(\.\d+)?/g) || [], bb = [Infinity, Infinity, -Infinity, -Infinity];
      for (var i = 0; i + 1 < nums.length; i += 2) {
        var x = Number(nums[i]), y = Number(nums[i + 1]);
        if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
        if (x < bb[0]) bb[0] = x; if (x > bb[2]) bb[2] = x; if (y < bb[1]) bb[1] = y; if (y > bb[3]) bb[3] = y;
      }
      info[c.en] = { bb: bb };
    });
    var bounds = [x0 - MAP_PAD, y0 - MAP_PAD, x1 - x0 + MAP_PAD * 2, y1 - y0 + MAP_PAD * 2];
    var HUB = JRMAP.bases.itabashi;
    var order = JRMAP.covered.slice().sort(function (a, b) { return Math.hypot(a.cx - HUB.x, a.cy - HUB.y) - Math.hypot(b.cx - HUB.x, b.cy - HUB.y); });
    order.forEach(function (c, i) { info[c.en].rank = i; });
    JRMAP.covered.forEach(function (c) {
      var b = info[c.en].bb, span = 0, L = MAP_LABEL[c.en];
      [[b[0], b[1]], [b[2], b[1]], [b[0], b[3]], [b[2], b[3]]].forEach(function (q) { span = Math.max(span, Math.hypot(q[0] - HUB.x, q[1] - HUB.y)); });
      info[c.en].span = span + 28;
      info[c.en].deg = Math.atan2(L.y - HUB.y, L.x - HUB.x) * 180 / Math.PI;
    });
    var land = JRMAP.covered.map(function (c) { return c.d; })
      .concat(MAP_NEIGHBOURS.map(function (i) { return JRMAP.greys[i]; }));
    _mapInit = { bounds: bounds, HUB: HUB, info: info, land: land };
    return _mapInit;
  }

  /* the seven corridors: a cubic that leaves the hub on its own bearing and arrives aimed at its target */
  var _mapRoutes = null;
  function mapRoutes() {
    if (_mapRoutes) return _mapRoutes;
    var H = JRMAP.bases.itabashi;
    _mapRoutes = ROUTE_ORDER.map(function (en) {
      var E = ROUTE_END[en], d = Math.hypot(E[0] - H.x, E[1] - H.y), a = ROUTE_DEP[en] * Math.PI / 180;
      var c1x = H.x + Math.cos(a) * d * 0.45, c1y = H.y + Math.sin(a) * d * 0.45;
      var ux = (E[0] - H.x) / d, uy = (E[1] - H.y) / d;
      var c2x = E[0] - ux * d * 0.4, c2y = E[1] - uy * d * 0.4;
      var len = 0, px = H.x, py = H.y;
      for (var i = 1; i <= 48; i++) {
        var t = i / 48, m = 1 - t;
        var x = m * m * m * H.x + 3 * m * m * t * c1x + 3 * m * t * t * c2x + t * t * t * E[0];
        var y = m * m * m * H.y + 3 * m * m * t * c1y + 3 * m * t * t * c2y + t * t * t * E[1];
        len += Math.hypot(x - px, y - py); px = x; py = y;
      }
      return { en: en, end: E, len: len,
        d: "M" + H.x + "," + H.y + " C" + mr1(c1x) + "," + mr1(c1y) + " " + mr1(c2x) + "," + mr1(c2y) + " " + E[0] + "," + E[1] };
    });
    return _mapRoutes;
  }

  /* the plate: silhouette, its shaded edge and its one contact shadow — built once, moved by transform */
  var _mapPlate = null;
  function mapPlate() {
    if (_mapPlate) return _mapPlate;
    var M = mapInit(), C = DAY.map;
    // the eleven land polygons are disjoint, so each layer is ONE path: a third of the nodes to patch
    var all = M.land.join(" ");
    _mapPlate = {
      cast: h("path", { d: all, fill: C.cast }),
      rim: h("path", { d: all, fill: C.rim }),
      land: h("path", { d: all, fill: C.land, stroke: C.landSeam, strokeWidth: 1.1, strokeLinejoin: "round" }),
    };
    return _mapPlate;
  }

  /* a miniature Sanpou depot: white body with a navy outline, a shaded left return, a parapet roof, the
     house vermilion fascia line and dock shutters under a canopy. Drawn with its base on (0,0) so it can
     be scaled about the ground as it lands. */
  var _depotMemo = {};
  function MiniDepot(w, hq) {
    var mk = w + "|" + (hq ? 1 : 0);
    if (_depotMemo[mk]) return _depotMemo[mk];
    var C = DAY.map, H = w * 0.64, R = w * 0.15, SW = w * 0.08, hw = w / 2;
    var ink = C.ink, bays = hq ? 3 : 2, bw = w * 0.21, gap = (w * 0.84 - bays * bw) / (bays + 1);
    var dockY = -H * 0.44, kids = [
      h("rect", { x: -hw, y: -H, width: w, height: H, fill: C.depot, stroke: ink, strokeWidth: SW, strokeLinejoin: "round" }),
      h("rect", { x: -hw + SW * 0.5, y: -H + SW * 0.5, width: w * 0.19, height: H - SW, fill: C.depotShade }),
      h("rect", { x: -hw, y: -H + SW * 0.4, width: w, height: w * 0.11, fill: C.route }),
      h("polygon", { points: (-hw - R * 0.45) + "," + (-H) + " " + (hw + R * 0.45) + "," + (-H) + " " + (hw * 0.84) + "," + (-H - R) + " " + (-hw * 0.84) + "," + (-H - R), fill: C.depotRoof, stroke: ink, strokeWidth: SW, strokeLinejoin: "round" }),
      h("rect", { x: -hw * 0.94, y: dockY - w * 0.07, width: w * 0.94, height: w * 0.07, fill: C.depotShade }),
    ];
    for (var i = 0; i < bays; i++) {
      var bx = -w * 0.42 + gap + i * (bw + gap);
      kids.push(h("rect", { x: bx, y: dockY, width: bw, height: -dockY - SW * 0.5, fill: C.depotDock }));
      kids.push(h("rect", { x: bx, y: dockY, width: bw, height: w * 0.04, fill: ink, opacity: 0.4 }));
    }
    kids.push(h("rect", { x: -hw, y: -SW * 0.7, width: w, height: SW * 0.7, fill: ink, opacity: 0.6 }));
    if (hq) {   // the head office: a taller block on the sunlit right end
      kids.push(h("rect", { x: hw - w * 0.34, y: -H * 1.46, width: w * 0.34, height: H * 0.5, fill: C.depot, stroke: ink, strokeWidth: SW, strokeLinejoin: "round" }));
      kids.push(h("rect", { x: hw - w * 0.29, y: -H * 1.33, width: w * 0.24, height: H * 0.17, fill: C.depotDock }));
    }
    _depotMemo[mk] = kids;
    return kids;
  }

  function CoverageMap(p) {
    var prefProgress = p.prefProgress, routeProgress = p.routeProgress, pinProgress = p.pinProgress,
      flowTime = p.flowTime, mapIn = p.mapIn == null ? 1 : p.mapIn;
    var M = mapInit(), C = DAY.map, HUB = M.HUB, plate = mapPlate(), routes = mapRoutes();
    var lift = easeOutQuart(clamp01(mapIn));                 // the plate settling into the air
    // No float on the plate: a bob repaints all eleven land polygons every frame and cost 5 fps of the
    // scene's budget when measured, for a 2 px move. The scene is kept alive by the seven corridors
    // (flowing dashes plus a travelling highlight on each) and the three breathing anchor rings instead.
    var rim = 7.2 * lift, castX = -5 * lift, castY = 12 * lift;

    return h("svg", { viewBox: M.bounds.join(" "), width: "100%", height: "100%", style: { overflow: "hidden" } },
      h("defs", null,
        JRMAP.covered.map(function (cp) {
          var nf = M.info[cp.en], k = clamp01((prefProgress - nf.rank * 0.055) * 1.45), grow = bellEase(k) * nf.span;
          return h("clipPath", { id: "nm4w" + nf.rank },
            h("rect", { x: -grow, y: -2400, width: grow * 2, height: 4800,
              transform: "translate(" + HUB.x + "," + HUB.y + ") rotate(" + mr1(nf.deg) + ")" }));
        })
      ),
      h("g", { transform: "translate(" + mr1(castX) + "," + mr1(castY) + ")" }, plate.cast),
      h("g", null,
        h("g", { transform: "translate(0," + mr1(rim) + ")" }, plate.rim),
        h("g", null, plate.land),
        JRMAP.covered.map(function (cp) {
          var nf = M.info[cp.en];
          return h("g", { clipPath: "url(#nm4w" + nf.rank + ")" },
            h("path", { d: cp.d, fill: mapHeat(cp.heat), stroke: C.seam, strokeWidth: 1.9, strokeLinejoin: "round" }));
        }),
        routes.map(function (r, i) {
          var raw = (routeProgress - i * 0.07) * 2.6;
          var draw = easeOutQuart(clamp01(raw)), flow = clamp01((raw - 1) * 2.2);
          var on = Math.min(1, draw * 4), len = r.len;
          var dash = len * (1 - draw);
          var comet = ((flowTime * 0.28 + i * 0.37) % 1) * (len + 34);
          // casing 4.9 u = 8.0 stage px, line 3.2 u = 5.2 px: slim enough to read as one streamline, still
          // over the 3 px floor on a phone. The flow is long soft dashes, not stripes.
          return h("g", null,
            h("path", { d: r.d, fill: "none", stroke: C.routeCase, strokeWidth: 4.9, strokeLinecap: "round",
              opacity: 0.88 * on, strokeDasharray: len + " " + len, strokeDashoffset: dash }),
            h("path", { d: r.d, fill: "none", stroke: C.route, strokeWidth: 3.2, strokeLinecap: "round",
              opacity: on, strokeDasharray: len + " " + len, strokeDashoffset: dash }),
            h("path", { d: r.d, fill: "none", stroke: C.flow, strokeWidth: 3.2, strokeLinecap: "round",
              opacity: flow * 0.26, strokeDasharray: "17 13", strokeDashoffset: -(flowTime * 20 + i * 6) }),
            h("path", { d: r.d, fill: "none", stroke: C.flow, strokeWidth: 3.2, strokeLinecap: "round",
              opacity: flow * 0.6, strokeDasharray: "32 " + mr1(len), strokeDashoffset: mr1(-comet) }),
            h("circle", { cx: r.end[0], cy: r.end[1], r: 4.8 * flow, fill: C.routeCase }),
            h("circle", { cx: r.end[0], cy: r.end[1], r: 2.8 * flow, fill: C.route })
          );
        }),
        JRMAP.covered.map(function (cp) {
          var nf = M.info[cp.en], L = MAP_LABEL[cp.en];
          var k = clamp01((prefProgress - nf.rank * 0.055) * 1.45);
          var e = easeOutQuart(clamp01((k - 0.45) / 0.55));
          return h("text", { x: L.x, y: mr1(L.y + L.f * 0.36 + (1 - e) * 4), textAnchor: "middle",
            fontFamily: FONTS.jp, fontWeight: 700, fontSize: L.f, fill: C.ink, opacity: e * 0.92 }, cp.jp);
        }),
        MAP_BASES.map(function (b, j) {
          var B = JRMAP.bases[b.id], k = clamp01((pinProgress - b.t0) * 1.55);
          // lands with weight: a damped spring about the ground, a small overshoot, then settles
          var s = k <= 0 ? 0 : 1 - Math.exp(-5 * k) * Math.cos(7.8 * k);
          var sy = Math.max(0.001, s), sx = 1 + (1 - s) * 0.45;
          var cE = easeOutQuart(clamp01((k - 0.5) / 0.5));
          var pp = (flowTime * 0.46 + j * 0.33) % 1;
          var ring = b.hq ? C.route : C.ink;
          var cw = b.nm.length * CARD_F + 18, cx = b.card[0], cy = b.card[1];
          // the connector leaves the card at whichever edge faces its own building
          var vx = b.bld[0] - cx, vy = b.bld[1] - cy;
          var tt = Math.min(vx ? (cw / 2) / Math.abs(vx) : 1e9, vy ? (CARD_H / 2) / Math.abs(vy) : 1e9);
          var lx1 = cx + vx * tt, ly1 = cy + vy * tt, lx2 = b.bld[0], ly2 = b.bld[1];
          var llen = Math.max(0.1, Math.hypot(lx2 - lx1, ly2 - ly1));
          return h("g", null,
            h("circle", { cx: B.x, cy: B.y, r: 4 + pp * 13, fill: "none", stroke: ring, strokeWidth: 1.8, opacity: cE * (1 - pp) * 0.4 }),
            h("line", { x1: B.x, y1: B.y, x2: b.bld[0], y2: b.bld[1], stroke: C.ink, strokeWidth: 1.9, opacity: cE * 0.55 }),
            h("circle", { cx: B.x, cy: B.y, r: 2.6, fill: C.ink, opacity: cE }),
            h("ellipse", { cx: b.bld[0], cy: b.bld[1] + 1.5, rx: b.w * 0.62 * sx, ry: b.w * 0.11, fill: "rgba(24,46,72,0.3)", opacity: Math.min(1, s * 1.4) }),
            h("g", { transform: "translate(" + b.bld[0] + "," + b.bld[1] + ") scale(" + mr1(sx) + "," + mr1(sy) + ")" }, MiniDepot(b.w, b.hq)),
            h("path", { d: "M" + mr1(lx1) + "," + mr1(ly1) + " L" + mr1(lx2) + "," + mr1(ly2), fill: "none", stroke: C.ink, strokeWidth: 1.7,
              opacity: cE * 0.58, strokeDasharray: mr1(llen) + " " + mr1(llen), strokeDashoffset: mr1(llen * (1 - cE)) }),
            h("g", { transform: "translate(0," + mr1((1 - cE) * -7) + ")", opacity: cE },
              h("rect", { x: cx - cw / 2, y: cy - CARD_H / 2, width: cw, height: CARD_H, rx: 4, fill: C.card, stroke: C.cardLine, strokeWidth: 1 }),
              h("rect", { x: cx - cw / 2 + 3.5, y: cy - 5.5, width: 3.4, height: 11, rx: 1.7, fill: b.hq ? C.route : "#7d92a8" }),
              h("text", { x: cx - cw / 2 + 11, y: cy + 3.6, fontFamily: FONTS.jp, fontWeight: 700, fontSize: CARD_F, fill: C.ink }, b.nm))
          );
        })
      )
    );
  }

//== REPLACE from "        CoverageMap({ prefProgress: prefK, routeProgress: routeK" to "      ),"
        CoverageMap({ prefProgress: prefK, routeProgress: routeK, pinProgress: pinK, flowTime: time, mapIn: mapIn })

//== REPLACE from "  function AnimatedRoute(p) {" to "  /* ---- Warehouse.tsx ---- */"
  /* AnimatedRoute is gone: the map draws its own corridors (casing, core, flow, travelling highlight). */

