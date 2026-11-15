//== REPLACE from "  // one corridor per direction: the bearing each route leaves the hub on. Swept for the widest possible" to "  /* The three bases, each standing ON its real place (map units; 1 u = 1.63 stage px). No base has a place"
  /* The corridors and the three name cards (2026-11-15). No corridor passes under a name card any more.
     The 志木営業所 card stands 33 to 48 u above the hub and is 53 u wide, so it lies across every bearing
     from -77 to -144 degrees: the two corridors that used to leave inside that arc, Niigata's and Gunma's,
     ran under it. A corridor can get past the card on two sides only:
       to the east   between the card's right edge and the Ibaraki corridor. Niigata's corridor goes there:
                     it leaves the hub on the bearing Tochigi's used to have, rounds the card's upper right
                     corner 4.4 u clear of it and sweeps on to the north west in one curve (no radius under
                     90 u). Tochigi's corridor moves over to make room: it leaves 16 degrees further east
                     and comes back to its place in one curve (no radius under 67 u).
       to the west   through the one gap between the 志木 card and the 入間 card, 11.4 u wide: room for one
                     corridor, and Saitama's is in it. So Gunma's corridor IS Saitama's as far as that gap
                     (the same curve exactly, so the two rows of dashes lie on each other: their patterns
                     are 0.3 u apart) and leaves it there as a road leaves a road, turning north along the
                     card's left edge and then on to its own place (no radius under 23 u).
     Chiba's, Ibaraki's, Kanagawa's and Saitama's corridors are what they were.
     ROUTE_DEP: the bearing an unchanged corridor leaves the hub on.
     ROUTE_BEND: dep / arr = the bearings a bent corridor leaves the hub and arrives at its place on,
     out / into = how far its two handles reach (map units); along / upto = the corridor it shares and how
     far along that corridor's own curve (0-1) it stays on it, after which out / arr / into shape its own
     branch. Measured on the drawn paths every 0.25 u: every corridor's centre line stays 3.4 u or more
     from every name card (its casing is 2.45 u to a side). */
  var ROUTE_DEP = { CHIBA: 48, IBARAKI: -36, SAITAMA: -170, KANAGAWA: 122 };
  var ROUTE_BEND = {
    NIIGATA: { dep: -62, out: 96, arr: -142, into: 94 },
    TOCHIGI: { dep: -50, out: 74, arr: -119, into: 39 },
    GUNMA: { along: "SAITAMA", upto: 0.62, out: 18, arr: -128, into: 40 },
  };
//== REPLACE from "     Cards: 本社 to the east (the open wedge between the Ibaraki and Chiba corridors), 入間 to the west," to "  var MAP_BASES = ["
     Cards: 本社 to the east (the open wedge between the Ibaraki and Chiba corridors), 入間 to the west,
     志木 on a short post above its roof. No corridor passes behind a card: the corridors go round the 志木
     card on both sides (see ROUTE_BEND). card = [x, y, width], side = the edge it grows from: r = from
     its left edge rightwards, l = from its right edge leftwards, u = from the post outwards. */
//== REPLACE from "  /* the seven corridors: a cubic that leaves the hub on its own bearing and arrives aimed at its target */" to "  /* ---- the land of Japan round the service area, and the water that moves ----"
  /* the seven corridors: one cubic each that leaves the hub on its own bearing and arrives at its place
     (aimed at it, or on the bearing ROUTE_BEND gives), except Gunma's, which is two cubics: Saitama's own
     curve as far as the gap between the two name cards, then its own branch, leaving on that curve's
     tangent. `d` is the path, `len` its length. */
  var _mapRoutes = null;
  function mapRoutes() {
    if (_mapRoutes) return _mapRoutes;
    var H = JRMAP.bases.itabashi, rad = Math.PI / 180;
    // the eight numbers of one cubic from the hub: as it always was, or bent
    var cubic = function (en) {
      var E = ROUTE_END[en], d = Math.hypot(E[0] - H.x, E[1] - H.y), b = ROUTE_BEND[en];
      if (b) return [H.x, H.y, mr1(H.x + Math.cos(b.dep * rad) * b.out), mr1(H.y + Math.sin(b.dep * rad) * b.out),
        mr1(E[0] - Math.cos(b.arr * rad) * b.into), mr1(E[1] - Math.sin(b.arr * rad) * b.into), E[0], E[1]];
      var a = ROUTE_DEP[en] * rad, ux = (E[0] - H.x) / d, uy = (E[1] - H.y) / d;
      return [H.x, H.y, mr1(H.x + Math.cos(a) * d * 0.45), mr1(H.y + Math.sin(a) * d * 0.45), mr1(E[0] - ux * d * 0.4), mr1(E[1] - uy * d * 0.4), E[0], E[1]];
    };
    var mr3 = function (v) { return Math.round(v * 1000) / 1000; };
    var measure = function (q) {
      var len = 0, px = q[0], py = q[1];
      for (var i = 1; i <= 48; i++) {
        var t = i / 48, m = 1 - t;
        var x = m * m * m * q[0] + 3 * m * m * t * q[2] + 3 * m * t * t * q[4] + t * t * t * q[6];
        var y = m * m * m * q[1] + 3 * m * m * t * q[3] + 3 * m * t * t * q[5] + t * t * t * q[7];
        len += Math.hypot(x - px, y - py); px = x; py = y;
      }
      return len;
    };
    var C = function (q) { return " C" + q[2] + "," + q[3] + " " + q[4] + "," + q[5] + " " + q[6] + "," + q[7]; };
    _mapRoutes = ROUTE_ORDER.map(function (en) {
      var E = ROUTE_END[en], b = ROUTE_BEND[en], segs;
      if (b && b.along) {
        // the shared corridor's curve cut at `upto` (de Casteljau: the same curve, not a copy of it)
        var q = cubic(b.along), t = b.upto, mix = function (u, v) { return u + (v - u) * t; };
        var ax = mix(q[0], q[2]), ay = mix(q[1], q[3]), bx = mix(q[2], q[4]), by = mix(q[3], q[5]), cx = mix(q[4], q[6]), cy = mix(q[5], q[7]);
        var dx = mix(ax, bx), dy = mix(ay, by), ex = mix(bx, cx), ey = mix(by, cy), fx = mr3(mix(dx, ex)), fy = mr3(mix(dy, ey));
        var tn = Math.hypot(ex - dx, ey - dy) || 1, tx = (ex - dx) / tn, ty = (ey - dy) / tn;
        segs = [[q[0], q[1], mr3(ax), mr3(ay), mr3(dx), mr3(dy), fx, fy],
          [fx, fy, mr2(fx + tx * b.out), mr2(fy + ty * b.out), mr2(E[0] - Math.cos(b.arr * rad) * b.into), mr2(E[1] - Math.sin(b.arr * rad) * b.into), E[0], E[1]]];
      } else segs = [cubic(en)];
      return { en: en, end: E, len: segs.reduce(function (s, q) { return s + measure(q); }, 0),
        d: "M" + H.x + "," + H.y + segs.map(C).join("") };
    });
    return _mapRoutes;
  }

//== REPLACE from "  /* Each corridor measured for its truck, once. From the numbers the line itself is drawn with:" to "  /* Where corridor R's truck is at ambient time `time`: [x, y, opacity], x and y the centre of the truck."
  /* Each corridor measured for its truck, once. From the numbers the line itself is drawn with (one cubic,
     or two for a corridor that shares another's road at first):
       at(s)     the point s map units along the corridor
       cut(k)    the corridor's own curve from the hub to k of its length (0-1), as a path: what is drawn
                 while the corridor is still growing, so its dashes keep their pattern from the hub
       travel    how far the truck runs: it stops with its nose at the place dot, standing back along the
                 line until its box is clear of the dot, so the dot stays in view (or `back`, if given)
       face      1 = it runs to the right, -1 = to the left (the drawing is mirrored, never turned)
     and its timetable from MAP_RUN (every = the seconds between two of its departures). */
  var _mapRuns = null;
  function mapRuns() {
    if (_mapRuns) return _mapRuns;
    var N = 64;
    return _mapRuns = mapRoutes().map(function (r) {
      var q = r.d.match(/-?\d+(\.\d+)?/g).map(Number), S = (q.length - 2) / 6, X = [], Y = [];
      for (var k = 0; k < S; k++) { X.push([q[6 * k], q[6 * k + 2], q[6 * k + 4], q[6 * k + 6]]); Y.push([q[6 * k + 1], q[6 * k + 3], q[6 * k + 5], q[6 * k + 7]]); }
      var B = function (P, t) { var m = 1 - t; return m * m * m * P[0] + 3 * m * m * t * P[1] + 3 * m * t * t * P[2] + t * t * t * P[3]; };
      // g = the place on the corridor as one number: the cubic it is on plus that cubic's own parameter
      var XY = function (g) { var k = Math.min(S - 1, Math.floor(g)); return [B(X[k], g - k), B(Y[k], g - k)]; };
      var cum = [0], p0 = XY(0);
      for (var i = 1; i <= N * S; i++) {
        var p1 = XY(i / N);
        cum.push(cum[i - 1] + Math.hypot(p1[0] - p0[0], p1[1] - p0[1])); p0 = p1;
      }
      var len = cum[N * S];
      var seek = function (s) {
        if (s <= 0) return 0;
        if (s >= len) return S;
        var lo = 0, hi = N * S;
        while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (cum[mid] <= s) lo = mid; else hi = mid; }
        return (lo + (s - cum[lo]) / (cum[hi] - cum[lo] || 1)) / N;
      };
      var mix = function (a, b, t) { return a + (b - a) * t; };
      var whole = function (k) { return " C" + X[k][1] + "," + Y[k][1] + " " + X[k][2] + "," + Y[k][2] + " " + X[k][3] + "," + Y[k][3]; };
      var cut = function (c) {
        var g = seek(len * c), k = Math.min(S - 1, Math.floor(g)), t = g - k, x = X[k], y = Y[k], d = "M" + X[0][0] + "," + Y[0][0];
        for (var j = 0; j < k; j++) d += whole(j);
        var ax = mix(x[0], x[1], t), ay = mix(y[0], y[1], t), bx = mix(x[1], x[2], t), by = mix(y[1], y[2], t), cx = mix(x[2], x[3], t), cy = mix(y[2], y[3], t);
        var dx = mix(ax, bx, t), dy = mix(ay, by, t), ex = mix(bx, cx, t), ey = mix(by, cy, t);
        return d + " C" + mr2(ax) + "," + mr2(ay) + " " + mr2(dx) + "," + mr2(dy) + " " + mr2(mix(dx, ex, t)) + "," + mr2(mix(dy, ey, t));
      };
      var tt = MAP_RUN[r.en], back = tt.back || 0, xe = X[S - 1], ye = Y[S - 1];
      if (!back) {
        var ux = xe[3] - xe[2], uy = ye[3] - ye[2], un = Math.hypot(ux, uy) || 1;
        ux = Math.abs(ux / un); uy = Math.abs(uy / un);
        while (Math.hypot(Math.max(0, back * ux - MAP_TRUCK.hx), Math.max(0, back * uy - MAP_TRUCK.hy)) < 4.8 + 0.6) back += 0.25;
      }
      return { en: r.en, len: len, travel: len - back, face: xe[3] >= X[0][0] ? 1 : -1,
        dep: tt.dep, run: tt.run, stay: tt.stay, fade: tt.fade, every: SWELL.period / tt.runs,
        at: function (s) { return XY(seek(s)); }, cut: cut };
    });
  }
