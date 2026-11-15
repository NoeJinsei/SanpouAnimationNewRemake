//== REPLACE from "  /* The map truck, facing right, drawn about its own centre (17 u long and 11.6 u high, 17.7 u with the" to "  // for the close-up picture of the model and for checks"
  /* The map truck, SEEN FROM ABOVE, pointing right (+x), drawn about its own centre: 18 u long, 9 u wide
     (1 u = 1.63 stage px, about 1 px on a phone). The map is a plan, so a truck on it is a plan too, and it
     is turned to its road: a side elevation can only slide along a road that runs up the map.
     Designed at this size, in the manner of the mini depots: white, one navy outline, the vermilion line.
     From the tail to the nose:
       1.9  the navy outline of the box (it runs round three sides of it)
       8.0  the roof of the box, white
       2.1  the vermilion stripe, across the box, closing its front end
       2.0  the roof of the cab, navy; the cab is 1.5 u narrower than the box, so the truck has shoulders
       2.0  the windscreen, pale glass, one bar across the cab
       2.0  the bumper, navy, its two corners cut: the nose
     so the dark end is the front and the long white end the back: it reads which way it is going with no
     wheels to see. Nothing is under 1.85 u (3 stage px) across. No lettering.
     Four nodes, built once; every truck on the map shares them (the old side view was ten).
     MAP_TRUCK: hx / hy = half its length and width; axle = its front axle, ahead of its centre; base = from
     that axle back to the rear axle; stop = how far from the middle of the place dot its nose stops (the
     dot's ring is 4.8 u: it stands 3.6 u short of it, room for the dot to answer); from / north / join =
     where it starts, inside the head office's front (right of and below the hub: `north` is the drop for
     a corridor that leaves upwards, so that the whole truck is behind the building), and how far it has
     run when it is on its corridor's line; show = between which distances run it comes up from nothing
     (at the first it is still behind the head office, by the second its nose is out). */
  var MAP_TRUCK = { hx: 9, hy: 4.5, axle: 4.5, base: 9.5, stop: 8.4, from: [2.5, 6.4], north: 3, join: 16, show: [0.5, 3.5] };
  var _mapTruck = null;
  function MiniTruck() {
    if (_mapTruck) return _mapTruck;
    var C = DAY.map;
    return _mapTruck = [
      h("polygon", { points: "-9,-4.5 3,-4.5 3,-3.75 7.5,-3.75 9,-2.25 9,2.25 7.5,3.75 3,3.75 3,4.5 -9,4.5", fill: C.ink }),
      h("rect", { x: -7.1, y: -2.6, width: 8, height: 5.2, fill: C.depotLit }),
      h("rect", { x: 0.9, y: -2.6, width: 2.1, height: 5.2, fill: C.route }),
      h("rect", { x: 5, y: -1.9, width: 2, height: 3.8, fill: C.depotGlassLit }),
    ];
  }
  /* Each corridor measured for its truck, once. From the numbers the line itself is drawn with (one cubic,
     or two for a corridor that shares another's road at first):
       at(s)     the point s map units along the corridor
       cut(k)    the corridor's own curve from the hub to k of its length (0-1), as a path: what is drawn
                 while the corridor is still growing, so its dashes keep their pattern from the hub
       travel    how far the truck runs: it stops MAP_TRUCK.stop short of the middle of the place dot
                 (or `back` short of the corridor's end, if MAP_RUN gives it)
       pose(s)   the truck when it has run s: [x, y, heading in degrees], x and y its centre.
                 It is steered, not turned to the tangent. Its front axle is on its track (the corridor,
                 joined from the point inside the head office where it starts), and its rear axle is
                 pulled along behind at the length of its wheelbase, as a real one's is: so it swings into
                 a bend a little after its nose has entered it, cuts the inside of it with its tail, and
                 straightens up a truck's length after the bend is over. Worked out once per corridor,
                 every 0.5 u, and looked up: the heading is a function of the distance run alone, so it
                 is continuous for as long as the truck is seen and it stands still when the truck does.
     and its timetable from MAP_RUN (every = the seconds between two of its departures). */
  var _mapRuns = null;
  function mapRuns() {
    if (_mapRuns) return _mapRuns;
    var N = 64, T = MAP_TRUCK, STEP = 0.5;
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
      // the truck's track: its corridor, joined over the first `join` units from where it starts
      var up = (Y[0][1] - Y[0][0]) / (Math.hypot(X[0][1] - X[0][0], Y[0][1] - Y[0][0]) || 1) < -0.5;
      var fx = T.from[0], fy = up ? T.north : T.from[1];
      var track = function (s) {
        var p = XY(seek(s)), j = clamp01(s / T.join), off = 1 - j * j * (3 - 2 * j);
        return [p[0] + fx * off, p[1] + fy * off];
      };
      // its heading every STEP along the track: the rear axle dragged after the front one
      var n = Math.ceil(len / STEP), f0 = track(0), f1 = track(STEP), th = [Math.atan2(f1[1] - f0[1], f1[0] - f0[0])];
      var rx = f0[0] - Math.cos(th[0]) * T.base, ry = f0[1] - Math.sin(th[0]) * T.base;
      for (var m = 1; m <= n; m++) {
        var f = track(Math.min(len, m * STEP)), a = Math.atan2(f[1] - ry, f[0] - rx);
        rx = f[0] - Math.cos(a) * T.base; ry = f[1] - Math.sin(a) * T.base;
        while (a - th[m - 1] > Math.PI) a -= 2 * Math.PI;
        while (a - th[m - 1] < -Math.PI) a += 2 * Math.PI;
        th.push(a);
      }
      var pose = function (s) {
        var sf = Math.min(len, Math.max(0, s) + T.axle), u = sf / STEP, i = Math.min(n - 1, Math.floor(u));
        var a = th[i] + (th[i + 1] - th[i]) * Math.min(1, u - i), f = track(sf);
        return [f[0] - Math.cos(a) * T.axle, f[1] - Math.sin(a) * T.axle, a * 180 / Math.PI];
      };
      var tt = MAP_RUN[r.en];
      return { en: r.en, len: len, travel: len - (tt.back || T.hx + T.stop),
        dep: tt.dep, run: tt.run, stay: tt.stay, fade: tt.fade, every: SWELL.period / tt.runs,
        at: function (s) { return XY(seek(s)); }, cut: cut, pose: pose };
    });
  }
  /* Where corridor R's truck is at ambient time `time`: [x, y, opacity, heading in degrees], x and y the
     centre of the truck. One lookup: the place and the heading both come from R.pose. It starts wholly
     behind the head office, comes up from nothing as its nose comes out (MAP_TRUCK.show: by distance run,
     not by the clock), runs, stands with its nose short of the place dot, and goes where it stands.
     Not on the road: at its start, opacity 0. */
  function mapTruckAt(R, time) {
    var ph = time - R.dep, s = 0, gone = 0, T = MAP_TRUCK;
    if (ph >= 0) {
      ph = ph % R.every;
      if (ph < R.run) s = R.travel * mapRunEase(ph / R.run);
      else if (ph < R.run + R.stay + R.fade) {
        var fk = clamp01((ph - R.run - R.stay) / R.fade);
        s = R.travel; gone = fk * fk * (3 - 2 * fk);
      }
    }
    var p = R.pose(s), k = clamp01((s - T.show[0]) / (T.show[1] - T.show[0]));
    return [p[0], p[1], k * k * (3 - 2 * k) * (1 - gone), p[2]];
  }
//== REPLACE from "        // --- the trucks: over the names, under the depots (each comes out from behind the head office)." to "        // --- the three bases: place dots and stubs first, then the buildings, then the name cards ---"
        // --- the trucks: over the names, under the depots (each comes out from behind the head office),
        // each turned to where it is going. Always seven, in the corridors' order; one that is not on the
        // road waits behind the head office with no opacity.
        h("g", null, mapRuns().map(function (R) {
          var q = mapTruckAt(R, flowTime);
          return h("g", { transform: "translate(" + mr2(q[0]) + "," + mr2(q[1]) + ") rotate(" + mr1(q[3]) + ")", opacity: mr2(q[2]) }, MiniTruck());
        })),
