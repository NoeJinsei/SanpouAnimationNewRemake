/* Scene 04, the routes of the coverage map: dashed corridors and a small truck running each of them.
   Applies on its own to the working copy:  sh tools/build-side.sh trial3 round2/parts/r4-map-routes.js
   What it is: the comment the fourth block puts above MAP_DASH. The corridors' geometry, the order and
   the timing in which they draw, the place dots, the depots and their cards are not touched. */

//== REPLACE from "     Vermilion is the routes' alone (and the depots' fascia line)." to "     Sequence (all inside the timings the player already drives):"
     Vermilion is the routes' alone: the dashes, the place dots, the stripe on the trucks that run them
     (and the depots' fascia line).
//== REPLACE from "       routes  34-78       seven curved corridors draw from the hub" to "       depots  24-80       three miniature Sanpou depots"
       routes  34-78       seven curved corridors draw from the hub with a long soft landing, as dashed
                           lines whose dashes already travel outward; a place dot comes up at the end
                           of each
       trucks  51 on       a small truck comes out from behind the head office on each corridor, one
                           after another, runs to the place dot, stands there a moment and goes
                           (see MAP_RUN)
//== REPLACE from "     Never frozen while it holds: the water travels, and on all seven corridors" to "     Engine: the node list is the same shape on every frame;"
     Never frozen while it holds: the water travels, the dashes of all seven corridors travel outward,
     and two to five trucks are on the road. The depots stand still once they are down, as buildings do.
//== INSERT before "  function CoverageMap(p) {"
  /* ---- the routes: dashed corridors, and a truck running each ----
     The line   a corridor is a row of vermilion dashes with round ends on its white casing. The dashes
                travel outward from the head office, so the way the route goes reads without anything
                else. MAP_DASH: on / off = the dash pattern (with the round ends a dash is on + 3.2 u long
                and the gap off - 3.2 u), laps = how many dashes pass a point in one SWELL.period: a whole
                number, so the dashes are where they were when the ambient clock steps back by that
                period at the start of scene 05.
     The run    MAP_RUN, in seconds of the ambient clock (flowTime):
                  dep   when the corridor's truck first sets off, out of sight behind the head office.
                        It shows above the roof about 0.2 s later (below the building, on the two
                        corridors that run south, about 0.1 s later): never before its corridor has
                        finished drawing
                  run   how long the run takes: a soft start, a longer soft landing (mapRunEase)
                  stay  how long it stands at the place, its nose at the place dot
                  fade  how long it takes to go
                  runs  how many runs it makes in one SWELL.period: the two short corridors (Chiba,
                        Kanagawa) are served twice as often as the others
                  back  (Saitama only) how far short of the dot it stops: the name 埼玉 lies beside the
                        last 21 u of that corridor, and a truck any nearer the dot would stand on it.
                        The others stop where their box clears the dot (11 to 16 u short of it)
                First seen, in order: Chiba, Gunma, Kanagawa, Niigata, Ibaraki, then Tochigi and Saitama,
                which leave late so that their runs fill the end of the hold; two that follow each other
                closely leave in different directions.
                The rule the numbers keep: the state of every truck repeats every SWELL.period from the
                moment the scene starts to hold (flowTime 80/30). A truck that has left by then simply
                cycles (run + stay + fade fits in its cycle); one that leaves later has gone again
                SWELL.period after that moment: dep + run + stay + fade <= 80/30 + SWELL.period.
                So nothing jumps when the player's clock steps back by that period where scene 05 begins. */
  var MAP_DASH = { on: 4.6, off: 6.2, laps: 8 };
  var MAP_RUN = {
    CHIBA:    { dep: 1.62, run: 1.33, stay: 0.25, fade: 0.30, runs: 2 },
    KANAGAWA: { dep: 2.13, run: 1.25, stay: 0.30, fade: 0.30, runs: 2 },
    GUNMA:    { dep: 1.85, run: 1.67, stay: 0.90, fade: 0.40, runs: 1 },
    NIIGATA:  { dep: 2.30, run: 2.42, stay: 0.90, fade: 0.40, runs: 1 },
    IBARAKI:  { dep: 2.65, run: 1.87, stay: 0.90, fade: 0.40, runs: 1 },
    TOCHIGI:  { dep: 3.83, run: 1.77, stay: 0.42, fade: 0.40, runs: 1 },
    SAITAMA:  { dep: 4.26, run: 1.60, stay: 0.20, fade: 0.36, runs: 1, back: 24 },
  };
  /* A run's distance, 0 -> 1 over 0 -> 1 of its time: the speed comes up smoothly over the first 30 %,
     holds, and comes down smoothly over the last 42 % (a longer landing than start). */
  function mapRunEase(u) {
    var a = 0.3, b = 0.42, v = 1 / (1 - (a + b) / 2), x;
    if (u <= 0) return 0;
    if (u >= 1) return 1;
    if (u < a) { x = u / a; return v * a * (x * x * x - x * x * x * x / 2); }
    if (u <= 1 - b) return v * (a / 2 + u - a);
    x = (u - (1 - b)) / b;
    return v * (a / 2 + 1 - b - a + b * (x - x * x * x + x * x * x * x / 2));
  }
  /* The map truck, facing right, drawn about its own centre (17 u long and 11.6 u high, 17.7 u with the
     bumper; 1 u = 1.63 stage px, about 1.1 px on a phone). Designed at this size, in the manner of the
     mini depots: a white box in one navy outline (roof, two walls, the chassis under it), the vermilion
     stripe along its foot, a navy cab one roof-thickness lower than the box with one pane of glass and
     the corner of the windscreen cut, a pale bumper, two navy wheels with pale hubs. No lettering.
     Every part is 1.9 u (3.1 stage px) or more across. Built once; every truck on the map shares it. */
  var MAP_TRUCK = { hx: 8.5, hy: 5.8 };
  var _mapTruck = null;
  function MiniTruck() {
    if (_mapTruck) return _mapTruck;
    var C = DAY.map;
    return _mapTruck = [
      h("rect", { x: -8.5, y: -5.8, width: 11, height: 9.2, fill: C.ink }),
      h("rect", { x: -6.6, y: -3.9, width: 7.2, height: 3.4, fill: C.depotLit }),
      h("rect", { x: -6.6, y: -0.5, width: 7.2, height: 2, fill: C.route }),
      h("polygon", { points: "2.5,-3.9 7.1,-3.9 8.5,-2.5 8.5,3.4 2.5,3.4", fill: C.ink }),
      h("polygon", { points: "3.4,-2 6,-2 6.6,-1.4 6.6,0.6 3.4,0.6", fill: C.depotGlassLit }),
      h("rect", { x: 6.9, y: 1.5, width: 2.3, height: 1.9, fill: C.depotShutter }),
      h("circle", { cx: -4.4, cy: 3.4, r: 2.4, fill: C.ink }),
      h("circle", { cx: 5, cy: 3.4, r: 2.4, fill: C.ink }),
      h("circle", { cx: -4.4, cy: 3.4, r: 0.95, fill: C.depotShutter }),
      h("circle", { cx: 5, cy: 3.4, r: 0.95, fill: C.depotShutter }),
    ];
  }
  /* Each corridor measured for its truck, once. From the numbers the line itself is drawn with:
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
      var q = r.d.match(/-?\d+(\.\d+)?/g).map(Number), X = [q[0], q[2], q[4], q[6]], Y = [q[1], q[3], q[5], q[7]];
      var B = function (P, t) { var m = 1 - t; return m * m * m * P[0] + 3 * m * m * t * P[1] + 3 * m * t * t * P[2] + t * t * t * P[3]; };
      var cum = [0], px = X[0], py = Y[0];
      for (var i = 1; i <= N; i++) {
        var x = B(X, i / N), y = B(Y, i / N);
        cum.push(cum[i - 1] + Math.hypot(x - px, y - py)); px = x; py = y;
      }
      var len = cum[N];
      // the curve's own parameter at s units along it
      var seek = function (s) {
        if (s <= 0) return 0;
        if (s >= len) return 1;
        var lo = 0, hi = N;
        while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (cum[mid] <= s) lo = mid; else hi = mid; }
        return (lo + (s - cum[lo]) / (cum[hi] - cum[lo] || 1)) / N;
      };
      var mix = function (a, b, t) { return a + (b - a) * t; };
      var cut = function (k) {
        var t = seek(len * k);
        var ax = mix(X[0], X[1], t), ay = mix(Y[0], Y[1], t), bx = mix(X[1], X[2], t), by = mix(Y[1], Y[2], t), cx = mix(X[2], X[3], t), cy = mix(Y[2], Y[3], t);
        var dx = mix(ax, bx, t), dy = mix(ay, by, t), ex = mix(bx, cx, t), ey = mix(by, cy, t);
        return "M" + X[0] + "," + Y[0] + " C" + mr2(ax) + "," + mr2(ay) + " " + mr2(dx) + "," + mr2(dy) + " " + mr2(mix(dx, ex, t)) + "," + mr2(mix(dy, ey, t));
      };
      var tt = MAP_RUN[r.en], back = tt.back || 0;
      if (!back) {
        var ux = X[3] - X[2], uy = Y[3] - Y[2], un = Math.hypot(ux, uy) || 1;
        ux = Math.abs(ux / un); uy = Math.abs(uy / un);
        while (Math.hypot(Math.max(0, back * ux - MAP_TRUCK.hx), Math.max(0, back * uy - MAP_TRUCK.hy)) < 4.8 + 0.6) back += 0.25;
      }
      return { en: r.en, len: len, travel: len - back, face: X[3] >= X[0] ? 1 : -1,
        dep: tt.dep, run: tt.run, stay: tt.stay, fade: tt.fade, every: SWELL.period / tt.runs,
        at: function (s) { var t = seek(s); return [B(X, t), B(Y, t)]; }, cut: cut };
    });
  }
  /* Where corridor R's truck is at ambient time `time`: [x, y, opacity], x and y the centre of the truck.
     It starts inside the head office's front (2.5 u right of and 6.4 u below the hub, which lies under the
     roof slab) and is on the line by the time it has run 16 u. Not on the road: at that start, opacity 0. */
  function mapTruckAt(R, time) {
    var ph = time - R.dep, s = 0, op = 0;
    if (ph >= 0) {
      ph = ph % R.every;
      if (ph < R.run) { s = R.travel * mapRunEase(ph / R.run); op = clamp01(ph / 0.1); }
      else if (ph < R.run + R.stay + R.fade) {
        var fk = clamp01((ph - R.run - R.stay) / R.fade);
        s = R.travel; op = 1 - fk * fk * (3 - 2 * fk);
      }
    }
    var at = R.at(s), k0 = clamp01(s / 16), off = 1 - k0 * k0 * (3 - 2 * k0);
    return [at[0] + 2.5 * off, at[1] + 6.4 * off, op];
  }
  // for the close-up picture of the model and for checks
  root.JourneyPort._components.map = { truck: MiniTruck, depot: MiniDepot, runs: mapRuns, truckAt: mapTruckAt, timetable: MAP_RUN, dash: MAP_DASH, swell: SWELL };
//== REPLACE from "        routes.map(function (r, i) {" to "        JRMAP.covered.map(function (cp) {"
        routes.map(function (r, i) {
          var raw = (routeProgress - i * 0.07) * 2.6;
          var draw = easeOutQuart(clamp01(raw)), flow = clamp01((raw - 1) * 2.2);
          var on = Math.min(1, draw * 4), DP = MAP_DASH.on + MAP_DASH.off;
          // while it grows, the corridor is its own curve cut at the growing end
          var d = draw < 1 ? mapRuns()[i].cut(draw) : r.d;
          // casing 4.9 u = 8.0 stage px, dashes 3.2 u = 5.2 px thick, 7.8 u long, 3 u apart: over the 3 px
          // floor on a phone. They move outward at laps x pattern / period = 22.9 u a second.
          return h("g", null,
            h("path", { d: d, fill: "none", stroke: C.routeCase, strokeWidth: 4.9, strokeLinecap: "round", opacity: 0.88 * on }),
            h("path", { d: d, fill: "none", stroke: C.route, strokeWidth: 3.2, strokeLinecap: "round", opacity: on,
              strokeDasharray: MAP_DASH.on + " " + MAP_DASH.off,
              strokeDashoffset: mr2(-((flowTime * MAP_DASH.laps * DP / SWELL.period + i * 3.7) % DP)) }),
            h("circle", { cx: r.end[0], cy: r.end[1], r: 4.8 * flow, fill: C.routeCase }),
            h("circle", { cx: r.end[0], cy: r.end[1], r: 2.8 * flow, fill: C.route })
          );
        }),
//== INSERT before "        // --- the three bases: place dots and stubs first, then the buildings, then the name cards ---"
        // --- the trucks: over the names, under the depots (each comes out from behind the head office).
        // Always seven, in the corridors' order; one that is not on the road waits at the hub with no opacity.
        h("g", null, mapRuns().map(function (R) {
          var q = mapTruckAt(R, flowTime);
          return h("g", { transform: "translate(" + mr2(q[0]) + "," + mr2(q[1]) + ") scale(" + R.face + ",1)", opacity: mr2(q[2]) }, MiniTruck());
        })),
