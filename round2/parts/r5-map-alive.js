//== REPLACE from "       the water   what moves. An apron of shallow water stands off the service area's Pacific coast and" to "     Vermilion is the routes' alone: the dashes, the place dots, the stripe on the trucks that run them"
       the water   what moves round the land. An apron of shallow water stands off both coasts of the
                   service area: the Pacific coast (Ibaraki round to Kanagawa) and the Sea of Japan coast
                   (Niigata), and narrows away along the neighbours' coast. Broad flat bands of the same
                   water leave it, travel outward and dissolve into the sea: the shape of our coast,
                   carried out. It runs on the ambient clock, so it never stops while the scene holds.
                   The Pacific water is the bold one; the water off Niigata is slower and travels a
                   third as far, because the site's copy and its pale wash lie over that side.
       the answer  what moves on the land. When a corridor's truck reaches its place the whole prefecture
                   steps, softly, from its own tint to the full white of the home ground ("delivered"),
                   holds it while the truck stands there, and goes back as the truck goes (MAP_ANSWER).
                   One to four prefectures at a time, each a big flat area: this is what a phone sees
                   move, since the map fills it. The further a prefecture is from Tokyo the paler its own
                   tint, so the further the truck has come the more the land answers.
//== REPLACE from "     Never frozen while it holds: the water travels, the dashes of all seven corridors travel outward," to "  DAY.map = {"
     Never frozen while it holds: the water travels off both coasts, the prefectures answer their trucks,
     the dashes of all seven corridors travel outward, and two to five trucks are on the road. The depots
     stand still once they are down, as buildings do.
     Engine: the node list is the same shape on every frame; every id is prefixed nm4; the only clips are
     clipPaths with one rect child; no masks, filters, blur or gradients. Each water is ONE path (its fan,
     its reach and its tails together), drawn once in the land layer as the apron and once in each of its
     band layers; a band layer is only ever scaled and faded, and the land is a layer of its own, so
     nothing behind the map is drawn again while the water moves. A prefecture's answer is a change of
     its fill, in the map layer that is drawn again every frame anyway for the dashes and the trucks. */
//== REPLACE from "  var SWELL = { n: 3, reach: 24, far: 1.95" to "  var _mapGeo = null;"
  var SWELL = { n: 3, reach: 24, far: 1.95, period: 34 / 9, rise: 0.04, fade: 1.25, tol: 2.4, taperN: 285, taperS: 100 };
  /* The same water off our other coast, Niigata's, on the Sea of Japan. It cannot grow about the head
     office: seen from there the sea lies beyond every line through that coast, so the straight side of
     the shape would show on open water. It grows about `piv`, a point far inland to the east (map units),
     found by search: seen from there every part of the coast moves out to sea (28 to 45 units at `far`,
     about a third of what the Pacific water travels), the straight west side of the shape lies over
     Toyama's land at every size (land to 1.20 times; `far` is 1.18) and the north side leaves the frame
     at the top. taperW / taperN = how far along Toyama's and Yamagata's coast the apron narrows to nothing
     (the first ends on a point of the coast in Toyama Bay, the second above the frame), lead = where in
     its turn the first band is when the scene starts, in turns, so that these bands never leave together
     with the Pacific ones. Two bands, not three: three would lie 10 units apart and read as stripes.
     The period is SWELL.period. */
  var SWELL_J = { n: 2, reach: 24, far: 1.18, piv: [630, 570], rise: 0.04, fade: 1.25, tol: 2.4, taperW: 58, taperN: 103, lead: 0.25 };
//== REPLACE from "  /* Everything still, built once." to "  /* A miniature Sanpou depot, drawn with its base line on y = 0"
  /* Everything still, built once.
       a water  one coast of ours and the one shape that travels from it, at its own size: that coast with
                `reach` of water all along it; from each end of it the same reach carried on along the
                neighbours' coast as discs that shrink to nothing, so the water narrows away instead of
                stopping in a round end; and a fan of triangles from the point the water grows about to
                every point of that coast. The fan makes the shape solid as seen from that point, so a
                copy of it grown about the point always covers the smaller copies whole (no inner edges);
                on the Pacific it also lays Tokyo Bay under shallow water.
                All of it is ONE path: every triangle, every disc and every piece of the reach (a
                rectangle along each stretch of coast and a disc at each corner, which together are the
                coast stroked 2 x reach wide with round joins) is drawn the same way round, so where two
                overlap they add and never cancel.
       band     that shape drawn at its largest (far times, about its point) in a box that holds all of
                it: a layer of it is only ever scaled down
       land     both aprons as one path (each water at its own size: a band starts exactly under it, so
                it never appears at an edge) and, on it, every prefecture that reaches into the frame */
  var _mapShore = null;
  function mapShore() {
    if (_mapShore) return _mapShore;
    var M = mapInit(), G = mapGeo(), C = DAY.map, HUB = M.HUB, nCov = JRMAP.covered.length;
    var pk = function (p) { return p[0] + "," + p[1]; };
    var disc = function (x, y, r) { return "M" + mr2(x - r) + "," + y + "a" + r + "," + r + " 0 1 1 " + mr2(r * 2) + ",0a" + r + "," + r + " 0 1 1 " + mr2(-r * 2) + ",0Z"; };
    // OWN = the prefectures whose coast it is, S = its numbers, piv = the point it grows about,
    // taper(p) = how far along the neighbours' coast the reach is carried on from the loose end p
    var water = function (OWN, S, piv, taper) {
      var R = S.reach, isOwn = function (c) { return c.src < nCov && OWN[JRMAP.covered[c.src].en]; };
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
      var tails = ends.filter(function (p) { return seen[pk(p)] === 1; }).map(function (p) { return follow(p, taper(p)); });
      var d = "", bb = [piv[0], piv[1], piv[0], piv[1]];
      own.concat(tails).forEach(function (r) {
        for (var i = 0; i < r.length; i++) {
          var a = r[i], b = r[i + 1], rr = a.length > 2 ? a[2] : R;
          bb = [Math.min(bb[0], a[0] - rr), Math.min(bb[1], a[1] - rr), Math.max(bb[2], a[0] + rr), Math.max(bb[3], a[1] + rr)];
          if (!b) continue;
          // every triangle the same way round (clockwise on the screen), so two that overlap never cancel
          var cw = (a[0] - piv[0]) * (b[1] - piv[1]) - (a[1] - piv[1]) * (b[0] - piv[0]) > 0;
          d += "M" + piv[0] + "," + piv[1] + "L" + (cw ? a : b).slice(0, 2).join(",") + "L" + (cw ? b : a).slice(0, 2).join(",") + "Z";
        }
      });
      tails.forEach(function (r) { r.forEach(function (p) { if (p[2] > 0.3) d += disc(p[0], p[1], p[2]); }); });
      // the reach along our own coast: a disc at every point of it and a rectangle along every stretch,
      // each clockwise like the triangles and the discs
      own.forEach(function (r) {
        for (var i = 0; i < r.length; i++) {
          var a = r[i], b = r[i + 1];
          d += disc(a[0], a[1], R);
          if (!b) continue;
          var L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, nx = (a[1] - b[1]) / L * R, ny = (b[0] - a[0]) / L * R;
          d += "M" + mr2(a[0] - nx) + "," + mr2(a[1] - ny) + "L" + mr2(b[0] - nx) + "," + mr2(b[1] - ny) + "L" + mr2(b[0] + nx) + "," + mr2(b[1] + ny) + "L" + mr2(a[0] + nx) + "," + mr2(a[1] + ny) + "Z";
        }
      });
      // the box of the shape at its largest: its own box grown about its point, and 2 units to spare
      var far = bb.map(function (v, i) { return mr1(piv[i % 2] + (v - piv[i % 2]) * S.far + (i < 2 ? -2 : 2)); });
      var band = G.place(far, h("path", { d: d, fill: C.shelf, transform: "translate(" + piv[0] + "," + piv[1] + ") scale(" + S.far + ") translate(" + (-piv[0]) + "," + (-piv[1]) + ")" }));
      // its point inside that box, in pixels: the point the water grows about
      band.pivot = mr2((piv[0] - far[0]) * band.k) + "px " + mr2((piv[1] - far[1]) * band.k) + "px";
      return { d: d, band: band };
    };
    // the Pacific: north the water narrows away up the coast to the top of the frame; south it ends at the
    // tip of Izu, at the foot of the frame: so the last line of the fan, which is straight, is never over
    // open water
    var pacific = water({ TOKYO: 1, KANAGAWA: 1, CHIBA: 1, IBARAKI: 1 }, SWELL, [HUB.x, HUB.y], function (p) { return p[1] < HUB.y ? SWELL.taperN : SWELL.taperS; });
    // the Sea of Japan: west it narrows away into Toyama Bay, north up Yamagata's coast past the top
    var japan = water({ NIIGATA: 1 }, SWELL_J, SWELL_J.piv, function (p) { return p[0] < SWELL_J.piv[0] - 200 ? SWELL_J.taperW : SWELL_J.taperN; });
    var land = [];
    G.rings.forEach(function (r) {
      var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      r.forEach(function (p) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; });
      if (x1 > G.win[0] && x0 < G.win[2] && y1 > G.win[1] && y0 < G.win[3]) land.push(h("path", { d: mapLine(r) + "Z", fill: C.land, stroke: C.landSeam, strokeWidth: 1.1, strokeLinejoin: "round" }));
    });
    return _mapShore = { pacific: pacific.band, japan: japan.band, land: G.place(G.win, [h("path", { d: pacific.d + japan.d, fill: C.shelf }), land]) };
  }
  var mapLayer = function (P, more) {
    var st = { position: "absolute", left: P.left, top: P.top, width: P.width, height: P.height };
    for (var q in more) st[q] = more[q];
    return h("div", { style: st }, P.svg);
  };
  /* The water that moves: for each coast, n layers of its one still shape, 1/n of a turn apart. Each lives
     one turn (n x period seconds): it comes up under the apron at the apron's own size, grows about its
     point to `far` times that and fades to nothing on the way, then starts again unseen. All are one colour,
     so the order they lie in does not matter and no layer ever has to change places with another. The
     picture as a whole repeats every SWELL.period, on both coasts.
     Only transform and opacity change, so the browser moves finished layers and draws nothing again. */
  function MapSwell(time) {
    var sh = mapShore();
    var turn = function (S, band) {
      var p = time / (SWELL.period * S.n) + (S.lead || 0);
      return range(S.n, function (j) {
        var u = ((p + j / S.n) % 1 + 1) % 1;
        return mapLayer(band, { willChange: "transform, opacity", transformOrigin: band.pivot,
          transform: "scale(" + ((1 + (S.far - 1) * u) / S.far).toFixed(5) + ")", opacity: (Math.min(1, u / S.rise) * Math.pow(1 - u, S.fade)).toFixed(4) });
      });
    };
    return turn(SWELL, sh.pacific).concat(turn(SWELL_J, sh.japan));
  }
//== INSERT before "  function CoverageMap(p) {"
  /* The land answers the trucks. MAP_ANSWER: to = the colour a prefecture steps to when its truck is at its
     place (the white of the home ground: the top of the map's own scale, where white is where we deliver
     most), lead = seconds before the truck stops in which the step comes up (the truck is slowing into
     the place). It holds while the truck stands and goes back over the truck's own fade, so it is a
     function of the same clock as the truck and repeats with it: nothing jumps when that clock steps back
     at scene 05. The step is 41 levels for Niigata, 20 to 24 for Ibaraki, Tochigi and Gunma, 6 to 13 for
     the three nearest. Tokyo has no corridor (the head office is there) and never changes. */
  var MAP_ANSWER = { to: [255, 255, 255], lead: 0.5 };
  var _mapAnswer = null;
  function mapAnswerFill(cp, time) {
    if (!_mapAnswer) {
      _mapAnswer = {};
      var runs = mapRuns(), lo = DAY.map.heatLo, hi = DAY.map.heatHi;
      JRMAP.covered.forEach(function (c) {
        var t = Math.pow(c.heat, 0.75), R = null;
        runs.forEach(function (q) { if (q.en === c.en) R = q; });
        _mapAnswer[c.en] = { rest: [0, 1, 2].map(function (i) { return Math.round(lo[i] + (hi[i] - lo[i]) * t); }), run: R, still: mapHeat(c.heat) };
      });
    }
    var A = _mapAnswer[cp.en], R = A.run, ph = R ? time - R.dep : -1;
    if (ph < 0) return A.still;
    ph = ph % R.every;
    var up = clamp01((ph - R.run + MAP_ANSWER.lead) / MAP_ANSWER.lead), dn = clamp01((ph - R.run - R.stay) / R.fade);
    var k = up * up * (3 - 2 * up) * (1 - dn * dn * (3 - 2 * dn));
    if (k <= 0) return A.still;
    var to = MAP_ANSWER.to, mx = function (i) { return Math.round(A.rest[i] + (to[i] - A.rest[i]) * k); };
    return "rgb(" + mx(0) + "," + mx(1) + "," + mx(2) + ")";
  }
//== REPLACE from "          var nf = M.info[cp.en];" to "        routes.map(function (r, i) {"
          var nf = M.info[cp.en];
          return h("g", { clipPath: "url(#nm4w" + nf.rank + ")" },
            h("path", { d: cp.d, fill: mapAnswerFill(cp, flowTime), stroke: C.seam, strokeWidth: 1.9, strokeLinejoin: "round" }));
        }),
