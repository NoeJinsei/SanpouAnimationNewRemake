//== REPLACE from "      q.rot = -0.45 * ss(0.1, 0.7, s) - 9.6 * ss(1.2, 2.25, se) - (P.CLIMB - 8.65) * ss(2.05, P.ROT, se) + 1.4 * ss(P.ROT, P.ROT + 1.1, se) + 0.3 * Math.sin(time * 0.9) * ss(4.3, 5.4, se);" to "      if (s < P.LIFT) {"
      // (round 11: the climb's slight weave and the lamp below are read on the plane's own cycle, t, like the rest
      // of its flight, so every cycle is the same flight and the finale is a loop; they used to be read on the
      // scene's clock, which made each cycle a little different from the last)
      q.rot = -0.45 * ss(0.1, 0.7, s) - 9.6 * ss(1.2, 2.25, se) - (P.CLIMB - 8.65) * ss(2.05, P.ROT, se) + 1.4 * ss(P.ROT, P.ROT + 1.1, se) + 0.3 * Math.sin(t * 0.9) * ss(4.3, 5.4, se);
//== REPLACE from "    if (q.on) q.lamp = Math.pow(Math.max(0, Math.sin(time * 5.2)), 8);" to "    _planeAt.time = time; _planeAt.q = q;"
    if (q.on) q.lamp = Math.pow(Math.max(0, Math.sin(t * 5.2)), 8);
//== REPLACE from "  /* the little trucks' timetable (seconds on the finale's clock, stage px):" to "  function miniRamp(w) {"
  /* the little trucks' timetable (seconds on the finale's clock, stage px), on the finale's loop (round 11):
     far lane, running right at V px/s; near lane, running left at VN. A truck stands at the depot's second
     dock (its rear at X1), pulls out at T0 and joins the far lane; the next one comes in along the far lane
     and stops there GAP s later, and pulls out in its turn one loop (C s) after the first. Two trucks take
     turns, each on a round of two loops. One through truck runs between them, once a loop: 450 px behind
     the one that left, 450 px ahead of the one coming. The near lane's two trucks come round once a loop.
     (Until round 11 the timetable ran on 38 s, which does not go into the loop's 52. The first round, the
     one in the film as it was approved, is the same as it was: the first truck leaves at T0, the next
     stands there 18 s later, and the through truck and the near lane's first truck are where they were.
     The near lane's second truck is the one that came in at the right edge 41.8 s into the film, on its
     way into a phone's view: it is on that phase now. For the finale's first six seconds it used to be
     another lap of the same truck, down at the left under the caption's dark band and outside a phone's
     view; that lap is gone.) */
  var MINI = { V: 60, VN: 66, X0: 812, X1: 946, YS: 1011, SS: 0.82, YL: 1029, SL: 0.86, YN: 1050, T0: 14.2, C: LOOP, GAP: 18 };
//== REPLACE from "    var M = MINI, u = (((time - M.T0 - 38 * k) % M.P) + M.P) % M.P, d = 0, x = M.X1, pitch = 0, q;" to "    if (u < 20) {                                   // away: it squats as it pulls out, joins the lane and leaves by the right edge"
    var M = MINI, P = 2 * M.C, u = (((time - M.T0 - M.C * k) % P) + P) % P, d = 0, x = M.X1, pitch = 0, q;
//== REPLACE from "      var w = 56 - u;                               // seconds until it stands at the dock again" to "      if (w > 19) { d = 2000; x = -400; }           // waiting off the picture"
      var w = M.C + M.GAP - u;                      // seconds until it stands at the dock again
//== REPLACE from "    var u = (((time - MINI.T0) % 38) + 38) % 38, S = function (a, b) { var k = clamp01((u - a) / (b - a)); return k * k * k * (k * (6 * k - 15) + 10); };" to "  }"
    var C = MINI.C, G = MINI.GAP, u = (((time - MINI.T0) % C) + C) % C, S = function (a, b) { var k = clamp01((u - a) / (b - a)); return k * k * k * (k * (6 * k - 15) + 10); };
    return S(G + 1, G + 3.2) - S(C - 3, C - 0.8);   // it goes up a second after the truck that has come in stands there, and comes down 3 s before that truck leaves
//== REPLACE from "  function windsockD(time) {" to "  function FinaleDepot(time) {"
  // n turns in one loop of the finale, as a rate (radians a second): everything at the airport moves at such a rate
  function loopN(n) { return 2 * Math.PI * n / LOOP; }
  function windsockD(time) {
    var w = 0.74 + 0.16 * Math.sin(time * loopN(5) + 0.4) + 0.08 * Math.sin(time * loopN(14) + 2);
    var droop = (1 - w) * 64, x = 727, y = 949, seg = 7.4, red = "", white = "", top = [], bot = [], i;
    var r = function (v) { return Math.round(v * 10) / 10; };
    for (i = 0; i <= 5; i++) {
      var ang = (droop * (0.5 + 0.12 * i) + (0.8 + 2.3 * i) * (0.45 + 0.55 * w) * Math.sin(time * loopN(59) - i * 0.95)) * Math.PI / 180;
      var ca = Math.cos(ang), sa = Math.sin(ang), hw = 6.4 - 0.62 * i;
      if (i) { x -= seg * ca; y += seg * sa; }
      top.push([x - hw * sa, y - hw * ca]); bot.push([x + hw * sa, y + hw * ca]);
    }
    for (i = 0; i < 5; i++) {
      var d = "M" + r(top[i][0]) + "," + r(top[i][1]) + "L" + r(top[i + 1][0]) + "," + r(top[i + 1][1]) + "L" + r(bot[i + 1][0]) + "," + r(bot[i + 1][1]) + "L" + r(bot[i][0]) + "," + r(bot[i][1]) + "Z";
      if (i % 2) white += d; else red += d;
    }
    return [red, white];
  }
  function Airport(time) {
    var A = finaleGroundArt(), f = function (v) { return String(Math.round(v * 100) / 100); };
    var rw = 5 + 19 * Math.abs(Math.cos(time * loopN(12)));                      // the radar turns: its width is what we see of it
    var lamp = Math.pow(0.5 + 0.5 * Math.sin(time * loopN(19) + 1), 3);
    // the baggage train: 19 s from edge to edge at the pace it always had, then it waits behind the depot, so it
    // comes in once in each of the plane's cycles and always at the same moment of the flight: just after the
    // touchdown, well behind the plane, as in the film as it was approved. (Left on a round of its own, 19 s
    // or a third of the loop, it drove along under the plane all through every second landing.)
    var trainRound = 48.4 * LOOP / 2, went = (((48.4 * time - 276.6) % trainRound) + trainRound) % trainRound;   // px since it last came in at the left edge
    var tx = -90 + Math.min(919.6, went);
    var blink = 0.25 + 0.75 * Math.pow(0.5 + 0.5 * Math.sin(time * loopN(46)), 2);
    var sock = windsockD(time);
    return h("g", null,
      A.airport,
      h("rect", { x: f(104 - rw / 2), y: 707, width: f(rw), height: 7.4, rx: 2, fill: DAY.airRoof }),
      h("circle", { cx: 73, cy: 679, r: 4.2, fill: DAY.towerLampLit, opacity: f(lamp) }),
      h("g", { transform: "translate(" + f(tx) + ",965.4)" },
        A.train,
        h("circle", { cx: 69.2, cy: -20, r: 2, fill: DAY.marker, opacity: f(blink) })),
      h("path", { d: sock[0], fill: DAY.towerOrange }),
      h("path", { d: sock[1], fill: DAY.towerWhite })
    );
  }
//== REPLACE from "      h(\"g\", { transform: \"rotate(\" + (pitch || 0).toFixed(3) + \" 17 34)\" }, T.body));" to "  }"
      h("g", { transform: "rotate(" + (Math.round((pitch || 0) * 1000) / 1000 || 0).toFixed(3) + " 17 34)" }, T.body));   // (never "-0.000": that is a write for nothing)
//== REPLACE from "    var A = finaleGroundArt(), M = MINI, a = depotTruckAt(time, 0), b = depotTruckAt(time, 1);" to "    var through = ((((M.V * time - 247) % 2280) + 2280) % 2280) - 200;"
    // (round 11) the two depot trucks take turns, so each is on a round of two loops; but they are the same
    // drawing, so the picture is the same every loop. The two slots below swap trucks 20 s after each departure,
    // when the one that left is off the picture and the other stands at the dock: the first slot always holds
    // the truck that leaves next. Nothing is seen of the swap, and every node is then the same one loop later.
    var A = finaleGroundArt(), M = MINI, odd = ((Math.floor((time - M.T0 - 20) / M.C) % 2) + 2) % 2;
    var a = depotTruckAt(time, 1 - odd), b = depotTruckAt(time, odd);
//== REPLACE from "    var through = ((((M.V * time - 247) % 2280) + 2280) % 2280) - 200;" to "    return h(\"g\", null,"
    var far = M.V * M.C, near = M.VN * M.C;         // how far each lane's traffic runs in one loop (3120 and 3432 px): every truck comes round once a loop
    var through = ((((M.V * time - 247) % far) + far) % far) - 200;
    var n0 = 2140 - ((((M.VN * time + 300) % near) + near) % near), n1 = 2140 - ((((M.VN * time - 1008) % near) + near) % near);
//== REPLACE from "          MapSwell(time)," to "          mapLayer(mapShore().land, { willChange: \"transform\" }),"
          MapSwell(recede < 1 ? time : T_NETWORK.mapRecede[1] / fps),             // (round 11) once the map has gone its water is not worked out again
