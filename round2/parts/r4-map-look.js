/* Scene 04, the look of the coverage map: "open water".
   Applies on its own to the working copy:  sh tools/build-side.sh trial3 round2/parts/r4-map-look.js
   It folds in what the floor parts map-nosky.js and map-flat-plate.js did (no sky in scene 04, no plate
   thickness) and replaces the colour and background floor parts; none of them is needed with it.
   The description of the look is the comment the first block puts above DAY.map. */

//== REPLACE from "  /* ---- round 2, scene 04: the" to "  // the four neighbours that touch our area"
  /* ---- scene 04: the 配送ネットワーク map, "open water" ------------------------------------------
     What it is
       the panel   the sea, flat, in the film's own sky blue. It covers the sky, the sun, the shafts and
                   the clouds while the map is up (scene 04 is a panel, not a view) and fades on the curve
                   the map leaves on, so the sky and the finale's world arrive together.
       the land    Japan as it really lies: every prefecture inside the frame is drawn (the map data always
                   held them; round 2 drew four and let the rest go). Every edge of the land is therefore
                   real coast, and the left of the frame, where the site's copy sits, is quiet land. Flat:
                   no edge copy under the silhouette, no shadow, no mask.
       the area    Sanpou white, the brightest thing on the panel: pure white where we deliver most, a
                   pale cool tint where we deliver least, crisp blue seams, names in a mid navy. The
                   depots' name cards are small navy signs with white lettering, like the warehouse's sign.
       the water   what moves. An apron of shallow water stands off the service area's Pacific coast and
                   narrows away along the neighbours' coast; three broad flat bands of the same water
                   leave it, travel outward and dissolve into the sea: the shape of our coast, carried
                   out. It runs on the ambient clock, so it never stops while the scene holds, and none of
                   it is on the left, under the copy.
     Vermilion is the routes' alone (and the depots' fascia line).
     Sequence (all inside the timings the player already drives):
       land    mapIn 0-26  the sea is there from the first frame; the land, the water and the map arrive
                           on it as one object (fading in, settling to full size)
       prefs   4-56        each prefecture is wiped in, white, by a band growing outward from the hub, in
                           rank order of distance from Itabashi, so the white spreads from Tokyo
       routes  34-78       seven curved corridors draw from the hub with a long soft landing, then light
                           up with flowing dashes and one travelling highlight each
       depots  24-80       three miniature Sanpou depots arrive one at a time, head office first. Each
                           pops in larger than it rests (a quick rise, one overshoot under 4 %, a clean
                           settle), is set down onto its own place as it eases to its resting size, and
                           then its name card comes out of it. All three are down and named by frame 80:
                           the frame the player holds, and the frame scene 05 starts from.
     Never frozen while it holds: the water travels, and on all seven corridors the dashes flow outward
     and a highlight travels the whole way. The depots stand still once they are down, as buildings do.
     Engine: the node list is the same shape on every frame; every id is prefixed nm4; the only clips are
     clipPaths with one rect child; no masks, filters, blur or gradients. The water's bands are three
     copies of one still shape, each on its own layer and only ever scaled and faded, and the land is a
     layer of its own, so nothing behind the map is drawn again while the water moves. */
  DAY.map = {
    sea: "#5fabe4",           // the panel: the sea, in the sky's own blue
    shelf: "#b7d9f3",         // shallow water: the apron off our coast, and the bands that leave it
    land: "#a9bbdb",          // the rest of Japan: the blue-grey of the film's city
    landSeam: "#98acd1",      // prefecture lines and the coast line on that land
    heatLo: [214, 229, 247],  // covered, least delivered: a pale cool tint
    heatHi: [255, 255, 255],  // covered, most delivered: Sanpou white
    seam: "#6f97cc",          // the crisp seam round every covered prefecture
    label: "#2f4d78",         // the prefecture names: a mid navy
    route: "#e16347",         // the route line keeps the brand vermilion
    routeCase: "#ffffff",
    flow: "#ffffff",
    // the mini depots, flat: one white front, navy roof slab / base course / outline, the vermilion fascia line
    depotLit: "#fbfdff",
    depotBay: "#2c4469", depotShutter: "#b3c2dc", depotGlass: "#8ebfe8", depotGlassLit: "#d2e7f8",
    ink: "#13263f",
    dot: "#ffffff",           // the ring round a place dot
    card: "#1f3b66",          // the name cards: navy signs
    cardText: "#ffffff",
    cardRim: "#13263f",       // the sign's lower edge
  };
//== REPLACE from "  /* the plate: silhouette, its shaded edge and its one contact shadow" to "  /* A miniature Sanpou depot,"
  /* ---- the land of Japan round the service area, and the water that moves ----
     MAP_BOX is the map's own box on the stage. The land and the water are drawn in boxes laid out from that
     box at the map's own scale, so they are in register with the prefectures by construction.
     SWELL: reach = how far the apron of shallow water stands off our coast (map units; 1 u = 1.63 px),
     far = how many times its own size a band has grown, about the head office, when it has dissolved,
     period = seconds between two bands (the length of the scene's hold: the ambient clock steps back by
     exactly that when scene 05 begins, so the water does not jump there), rise = the part of its life in
     which a band comes up from nothing, fade = how its opacity falls as it travels, tol = how closely the water follows the coast, taperN / taperS = how far along the
     neighbours' coast, north and south, the apron narrows to nothing. */
  var MAP_BOX = [535, 12, 850, 1056];
  var SWELL = { n: 3, reach: 24, far: 1.95, period: 34 / 9, rise: 0.04, fade: 1.25, tol: 2.4, taperN: 285, taperS: 100 };
  var _mapGeo = null;
  function mapGeo() {
    if (_mapGeo) return _mapGeo;
    var M = mapInit(), B = M.bounds, k = Math.min(MAP_BOX[2] / B[2], MAP_BOX[3] / B[3]);
    var ox = (MAP_BOX[2] - B[2] * k) / 2, oy = (MAP_BOX[3] - B[3] * k) / 2;      // where the map's viewBox starts inside its box
    // the stage's edges in map units, with room for the map being a little smaller while it arrives and leaves
    var win = [B[0] - (MAP_BOX[0] + ox) / k - 80, B[1] - (MAP_BOX[1] + oy) / k - 80, B[0] + (1920 - MAP_BOX[0] - ox) / k + 80, B[1] + (1080 - MAP_BOX[1] - oy) / k + 80];
    var rings = JRMAP.covered.map(function (c) { return c.d; }).concat(JRMAP.greys).map(function (d) {
      var n = d.match(/-?\d+(\.\d+)?/g) || [], r = [];
      for (var i = 0; i + 1 < n.length; i += 2) {
        var x = Number(n[i]), y = Number(n[i + 1]);
        if (!r.length || r[r.length - 1][0] !== x || r[r.length - 1][1] !== y) r.push([x, y]);
      }
      if (r.length > 1 && r[0][0] === r[r.length - 1][0] && r[0][1] === r[r.length - 1][1]) r.pop();
      return r;
    });
    // a border between two prefectures is the same edge in both rings; an edge found only once is coast
    var ek = function (a, b) { var ka = a[0] + "," + a[1], kb = b[0] + "," + b[1]; return ka < kb ? ka + "|" + kb : kb + "|" + ka; };
    var used = {};
    rings.forEach(function (r) { for (var i = 0; i < r.length; i++) { var q = ek(r[i], r[(i + 1) % r.length]); used[q] = (used[q] || 0) + 1; } });
    var coast = [];
    rings.forEach(function (r, ri) {
      var n = r.length, isC = function (i) { return used[ek(r[i % n], r[(i + 1) % n])] === 1; }, start = -1, run = null;
      for (var i = 0; i < n; i++) if (!isC(i)) { start = i; break; }
      if (start < 0) { coast.push({ src: ri, pts: r.concat([r[0]]) }); return; }       // an island
      for (var j = 1; j <= n; j++) {
        var at = (start + j) % n;
        if (isC(at)) { if (!run) run = [r[at]]; run.push(r[(at + 1) % n]); }
        else if (run) { coast.push({ src: ri, pts: run }); run = null; }
      }
      if (run) coast.push({ src: ri, pts: run });
    });
    /* a box holding the part rc = [x0, y0, x1, y1] of the map at the map's own scale, as a child of the map's
       box: its place and size in pixels, and the svg that fills it. Nothing is drawn outside its own box. */
    var place = function (rc, kids) {
      return { left: mr2((rc[0] - B[0]) * k + ox), top: mr2((rc[1] - B[1]) * k + oy), width: mr2((rc[2] - rc[0]) * k), height: mr2((rc[3] - rc[1]) * k), k: k, rc: rc,
        svg: h("svg", { viewBox: [rc[0], rc[1], rc[2] - rc[0], rc[3] - rc[1]].join(" "), width: "100%", height: "100%", preserveAspectRatio: "none", style: { display: "block" } }, kids) };
    };
    return _mapGeo = { rings: rings, coast: coast, win: win, place: place };
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
  /* Everything still, built once.
       water  the one shape that travels, at its own size: our Pacific coast (Ibaraki, Chiba, Tokyo,
              Kanagawa) stroked 2 x reach wide; from each end of it the same reach carried on along the
              neighbours' coast as discs that shrink to nothing, so the water narrows away instead of
              stopping in a round end; and, under both, a fan of triangles from the head office to every
              point of that coast. The fan makes the shape solid as seen from the head office, so a copy
              of it grown about the head office always covers the smaller copies whole (no inner edges),
              and it lays Tokyo Bay under shallow water.
       band   that shape drawn at its largest (far times, about the head office) in a box that holds all
              of it: a layer of it is only ever scaled down
       land   the apron (that shape at its own size: a band starts exactly under it, so it never appears
              at an edge) and, on it, every prefecture that reaches into the frame */
  var _mapShore = null;
  function mapShore() {
    if (_mapShore) return _mapShore;
    var M = mapInit(), G = mapGeo(), C = DAY.map, S = SWELL, HUB = M.HUB, nCov = JRMAP.covered.length, R = S.reach;
    var OWN = { TOKYO: 1, KANAGAWA: 1, CHIBA: 1, IBARAKI: 1 };
    var isOwn = function (c) { return c.src < nCov && OWN[JRMAP.covered[c.src].en]; }, pk = function (p) { return p[0] + "," + p[1]; };
    var own = G.coast.filter(isOwn).map(function (c) { return mapSimplify(c.pts, S.tol); });
    // the two loose ends of our coast: the end points that only one of our runs has
    var seen = {}, ends = [];
    own.forEach(function (r) { [r[0], r[r.length - 1]].forEach(function (p) { seen[pk(p)] = (seen[pk(p)] || 0) + 1; ends.push(p); }); });
    // from each, the neighbours' coast, run after run: a point every 3 units with the reach it carries
    var taken = {};
    var follow = function (from, len) {
      var out = [], d = 0, at = pk(from);
      for (;;) {
        var pts = null;
        for (var i = 0; i < G.coast.length && !pts; i++) {
          var c = G.coast[i], n = c.pts.length;
          if (isOwn(c) || taken[i]) continue;
          if (pk(c.pts[0]) === at) pts = c.pts; else if (pk(c.pts[n - 1]) === at) pts = c.pts.slice().reverse();
          if (pts) taken[i] = 1;
        }
        if (!pts) return out;
        for (var j = 0; j + 1 < pts.length; j++) {
          var a = pts[j], b = pts[j + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]), m = Math.max(1, Math.ceil(L / 3));
          for (var q = 0; q < m; q++) {
            var t = q / m, dd = d + L * t;
            if (dd >= len) return out;
            out.push([mr2(a[0] + (b[0] - a[0]) * t), mr2(a[1] + (b[1] - a[1]) * t), mr2(R * (1 - dd / len))]);
          }
          d += L;
        }
        at = pk(pts[pts.length - 1]);
      }
    };
    // north the water narrows away up the coast to the top of the frame; south it ends at the tip of Izu,
    // at the foot of the frame: so the last line of the fan, which is straight, is never over open water
    var tails = ends.filter(function (p) { return seen[pk(p)] === 1; }).map(function (p) { return follow(p, p[1] < HUB.y ? S.taperN : S.taperS); });
    var fan = "", discs = "", bb = [HUB.x, HUB.y, HUB.x, HUB.y];
    own.concat(tails).forEach(function (r) {
      for (var i = 0; i < r.length; i++) {
        var a = r[i], b = r[i + 1], rr = a.length > 2 ? a[2] : R;
        bb = [Math.min(bb[0], a[0] - rr), Math.min(bb[1], a[1] - rr), Math.max(bb[2], a[0] + rr), Math.max(bb[3], a[1] + rr)];
        if (!b) continue;
        // every triangle the same way round, so two that overlap never cancel
        var cw = (a[0] - HUB.x) * (b[1] - HUB.y) - (a[1] - HUB.y) * (b[0] - HUB.x) > 0;
        fan += "M" + HUB.x + "," + HUB.y + "L" + (cw ? a : b).slice(0, 2).join(",") + "L" + (cw ? b : a).slice(0, 2).join(",") + "Z";
      }
    });
    tails.forEach(function (r) {
      r.forEach(function (p) { if (p[2] > 0.3) discs += "M" + mr2(p[0] - p[2]) + "," + p[1] + "a" + p[2] + "," + p[2] + " 0 1 1 " + mr2(p[2] * 2) + ",0a" + p[2] + "," + p[2] + " 0 1 1 " + mr2(-p[2] * 2) + ",0Z"; });
    });
    var water = [
      h("path", { d: fan, fill: C.shelf }),
      h("path", { d: discs, fill: C.shelf }),
      h("path", { d: own.map(mapLine).join(""), fill: "none", stroke: C.shelf, strokeWidth: R * 2, strokeLinejoin: "round", strokeLinecap: "round" }),
    ];
    var land = [];
    G.rings.forEach(function (r) {
      var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      r.forEach(function (p) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; });
      if (x1 > G.win[0] && x0 < G.win[2] && y1 > G.win[1] && y0 < G.win[3]) land.push(h("path", { d: mapLine(r) + "Z", fill: C.land, stroke: C.landSeam, strokeWidth: 1.1, strokeLinejoin: "round" }));
    });
    // the box of the shape at its largest: its own box grown about the head office, and 2 units to spare
    var far = bb.map(function (v, i) { return mr1((i % 2 ? HUB.y : HUB.x) + (v - (i % 2 ? HUB.y : HUB.x)) * S.far + (i < 2 ? -2 : 2)); });
    var band = G.place(far, h("g", { transform: "translate(" + HUB.x + "," + HUB.y + ") scale(" + S.far + ") translate(" + (-HUB.x) + "," + (-HUB.y) + ")" }, water));
    // the head office inside that box, in pixels: the point the water grows about
    band.pivot = mr2((HUB.x - far[0]) * band.k) + "px " + mr2((HUB.y - far[1]) * band.k) + "px";
    return _mapShore = { band: band, land: G.place(G.win, [h("g", null, water), land]) };
  }
  var mapLayer = function (P, more) {
    var st = { position: "absolute", left: P.left, top: P.top, width: P.width, height: P.height };
    for (var q in more) st[q] = more[q];
    return h("div", { style: st }, P.svg);
  };
  /* The water that moves: n layers of the one still shape, a third of a turn apart. Each lives one turn
     (n x period seconds): it comes up under the apron at the apron's own size, grows about the head office
     to `far` times that and fades to nothing on the way, then starts again unseen. All are one colour, so
     the order they lie in does not matter and no layer ever has to change places with another.
     Only transform and opacity change, so the browser moves finished layers and draws nothing again. */
  function MapSwell(time) {
    var S = SWELL, band = mapShore().band, p = time / (S.period * S.n);
    return range(S.n, function (j) {
      var u = ((p + j / S.n) % 1 + 1) % 1;
      return mapLayer(band, { willChange: "transform, opacity", transformOrigin: band.pivot,
        transform: "scale(" + ((1 + (S.far - 1) * u) / S.far).toFixed(5) + ")", opacity: (Math.min(1, u / S.rise) * Math.pow(1 - u, S.fade)).toFixed(4) });
    });
  }

//== REPLACE from "    var M = mapInit(), C = DAY.map, HUB = M.HUB, plate = mapPlate(), routes = mapRoutes();" to "        routes.map(function (r, i) {"
    var M = mapInit(), C = DAY.map, HUB = M.HUB, routes = mapRoutes();
    // The land is not here any more: it is drawn once, under this, by mapShore(). This is what changes:
    // the covered prefectures as they are wiped in, the routes, the names, the depots and their cards.

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
            fontFamily: FONTS.jp, fontWeight: 700, fontSize: L.f, fill: C.label, opacity: e }, cp.jp);
//== REPLACE from "                h(\"circle\", { cx: B.x, cy: B.y, r: b.hq ? 0 : mr2(3.9 * dk), fill: C.card })," to "                h(\"circle\", { cx: B.x, cy: B.y, r: b.hq ? 0 : mr2(2 * dk), fill: C.ink }));"
                h("circle", { cx: B.x, cy: B.y, r: b.hq ? 0 : mr2(3.9 * dk), fill: C.dot }),
//== REPLACE from "                  h(\"rect\", { x: vx, y: y0 + 1.9, width: vw, height: CARD_H, rx: 2.4, fill: C.rim })," to "                  h(\"g\", { clipPath: \"url(#nm4c\" + j + \")\" },"
                  h("rect", { x: vx, y: y0 + 1.9, width: vw, height: CARD_H, rx: 2.4, fill: C.cardRim }),
                  h("rect", { x: vx, y: y0, width: vw, height: CARD_H, rx: 2.4, fill: C.card }),
//== REPLACE from "                      fontFamily: FONTS.jp, fontWeight: 700, fontSize: CARD_F, fill: C.ink }, b.nm))));" to "            })"
                      fontFamily: FONTS.jp, fontWeight: 700, fontSize: CARD_F, fill: C.cardText }, b.nm))));
//== REPLACE from "      h(\"div\", { style: { position: \"absolute\", left: 535, top: 12, width: 850, height: 1056," to "      recede < 0.96 ? h(\"div\", { style: { opacity: 1 - recede,"
      // Scene 04's panel: the sea, over the sky and everything in it while the map is up. It fades on the
      // curve the map leaves on; once the map has gone it is not drawn at all (and its routes stop running).
      // In it, one object that arrives and leaves as the map always did: the water, the land, the map.
      h("div", { style: { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden", background: DAY.map.sea, opacity: (1 - recede).toFixed(3), display: recede < 1 ? "block" : "none" } },
        h("div", { style: { position: "absolute", left: MAP_BOX[0], top: MAP_BOX[1], width: MAP_BOX[2], height: MAP_BOX[3], opacity: mapIn.toFixed(3), transform: "scale(" + ((0.95 + 0.05 * mapIn) * (1 - recede * 0.08)) + ") translate(" + (recede * -36) + "px, " + ((1 - mapIn) * 34) + "px)", transformOrigin: "46% 46%" } },
          MapSwell(time),
          mapLayer(mapShore().land, { willChange: "transform" }),
          h("div", { style: { position: "absolute", left: 0, top: 0, width: "100%", height: "100%" } },
            CoverageMap({ prefProgress: prefK, routeProgress: routeK, pinProgress: pinK, depotFrame: frame, flowTime: recede < 1 ? time : 0, mapIn: mapIn })))),
