//== REPLACE from "  function Airport(time) {" to "  function AirportPlane(time) {"
  /* ---- The ground of scene 05, round 4 (2026-11-15): drawn again from a blank page ----
     Everything here is one straight-on side elevation in stage coordinates, standing in layers behind one
     another, back to front: the airport (the tower and its wing, the terminal, the apron and what stands on
     it, the runway seen edge-on, the verge), the Sanpou depot, the pavement and the road, the trucks. The
     airliner is drawn after all of it and is not ours to change; its wheels run on y 968 (PLANE.GY).

     What the plane decides (its body's swept envelope, measured from planeAt over a whole cycle):
       on approach it comes in over the left edge with its top at y 832 (x 0) to 880 (x 300) and rolls with
       its fin at y 880; after x 554 it climbs, its tail lowest. So the terminal's whole roofline and the
       tower's cab stand ABOVE the plane (the plane always passes in front of the terminal's glass, never
       across its roofline), the apron right of the terminal is kept low, the windsock stands right of the
       runway's end and under the climb, and the depot steps up to the right under the line
       y = 998 - 0.56 (x - 614), 30 px under the wheels.
     What a phone sees is only x 942..1601 (its camera drifts, so the left edge is anywhere from 942 to
     994), so the depot's name stands on the stair core at the depot's right end, written downward as a
     Japanese building sign is, in 46 px type (the shortest character, 三, is 36 px of ink).

     What moves, each a pure function of the clock (nothing pops, the node list never changes shape):
       the windsock (fills and flaps with the wind's strength), the radar on the tower's roof (seen from the
       side: it narrows and widens), the tower's lamp, a baggage train crossing the apron (one way, it comes
       in off the left edge and leaves behind the depot), the shutter of the depot's second dock, the truck
       that stands there and pulls out onto the road (the next one comes in along the far lane to take its
       place), and the through traffic: the far lane runs right, the near lane left, one speed per lane. */
  DAY.airApron = "#aebdd3";        // the airport's concrete, seen edge-on: the apron
  DAY.airApronLit = "#cbd6e6";     // ... its far edge in the sun
  DAY.airApronShade = "#94a6c2";   // ... the contact shade under the terminal and the vehicles
  DAY.airVerge = "#8ea2bf";        // the strip between the runway and the public pavement
  DAY.airRunway = "#4f5d74";       // the runway: asphalt, cooler and paler than the road
  DAY.airRunwayLit = "#6c7b93";    // ... its far edge
  DAY.airMark = "#dde5f0";         // runway paint (a worn white: the site's caption is read over it)
  DAY.airLamp = "#ffe6a3";         // runway edge lights
  DAY.airSteel = "#6f84a6";        // masts, stems, the legs of the jet bridges
  DAY.airWall = "#d9e1ee";         // the control tower and its wing: pale concrete
  DAY.airWallLit = "#f3f6fa";      // ... the side the sun is on
  DAY.airWallShade = "#b1bfd7";    // ... the side away from it, and under the cab
  DAY.airDeck = "#566d96";         // the cab's deck, window bands of the wing
  DAY.airDeckLit = "#8da3c6";
  DAY.airCab = "#2b406c";          // the control cab's tinted glass
  DAY.airCabSky = "#5c84bf";       // ... the sky across its upper half
  DAY.airCabHi = "#b3cdee";        // ... one reflection
  DAY.airCabShade = "#1f3157";     // ... under the roof's overhang
  DAY.airRoof = "#e9eef6";         // roofs: pale aluminium
  DAY.airRoofLit = "#ffffff";
  DAY.airRoofShade = "#b7c5dc";    // soffits
  DAY.airGlass = "#b0caec";        // the terminal's curtain wall, reflecting the sky
  DAY.airGlassHi = "#dce9f8";
  DAY.airGlassDeep = "#7f9fcc";    // the lower storey, where one sees in
  DAY.airGlassShade = "#90aed8";   // glass under the eave
  DAY.airPier = "#dfe6f1";         // piers and transoms: pale aluminium
  DAY.airPierShade = "#b4c2d9";
  DAY.airBase = "#7a8fb3";         // the terminal's base course
  DAY.airBaseLit = "#a0b3cf";
  DAY.airBaseDark = "#4a5f86";     // doors, openings, dark trim
  DAY.airGse = "#f1f4f9";          // ground vehicles: white
  DAY.airGseShade = "#c9d4e4";
  DAY.airGseDark = "#40506c";      // their chassis

  /* the little trucks' timetable (seconds on the finale's clock, stage px):
     far lane, running right at V px/s; near lane, running left at VN. A truck stands at the depot's second
     dock (its rear at X1), pulls out at T0 and joins the far lane; the next one comes in along the far lane
     and stops there 56 s later. Two trucks take turns, each on a 76 s round, 38 s apart. One through truck
     runs between them on a 38 s round: 450 px behind the one that left, 450 px ahead of the one coming. */
  var MINI = { V: 60, VN: 66, X0: 812, X1: 946, YS: 1011, SS: 0.82, YL: 1029, SL: 0.86, YN: 1050, T0: 14.2, P: 76 };
  function miniRamp(w) { var k = Math.min(1, w / 3); return w < 3 ? MINI.V * 3 * (k * k * k - k * k * k * k / 2) : MINI.V * (w - 1.5); }   // px covered w seconds after a standing start
  function depotTruckAt(time, k) {
    var M = MINI, u = (((time - M.T0 - 38 * k) % M.P) + M.P) % M.P, d = 0, x = M.X1, pitch = 0, q;
    if (u < 20) {                                   // away: it squats as it pulls out, joins the lane and leaves by the right edge
      d = miniRamp(u); x = M.X1 + d;
      if (u < 3) { q = u / 3; pitch = -1.1 * 4 * q * (1 - q); }
    } else {
      var w = 56 - u;                               // seconds until it stands at the dock again
      if (w > 19) { d = 2000; x = -400; }           // waiting off the picture
      else if (w > 0) { d = miniRamp(w); x = M.X1 - d; if (w < 3) { q = w / 3; pitch = 0.9 * 4 * q * (1 - q); } }
      else pitch = -0.3 * Math.exp(3.2 * w) * Math.sin(-9 * w);   // it rocks back once and is still
    }
    var m = clamp01((d - 12) / 150); m = m * m * (3 - 2 * m);
    return { x: x, y: M.YS + (M.YL - M.YS) * m, s: M.SS + (M.SL - M.SS) * m, pitch: pitch };
  }
  // the shutter of the second dock: open while a truck stands there, down before it leaves
  function depotShutterAt(time) {
    var u = (((time - MINI.T0) % 38) + 38) % 38, S = function (a, b) { var k = clamp01((u - a) / (b - a)); return k * k * k * (k * (6 * k - 15) + 10); };
    return S(19, 21.2) - S(35, 37.2);               // u 19..21.2: it goes up for the truck that has come in; u 35..37.2: it comes down, 3 s before that truck leaves
  }

  var _fgArt = null;
  function finaleGroundArt() {
    if (_fgArt) return _fgArt;
    var D = DAY, INK = COLORS.ink, A = {};
    function r1(v) { return Math.round(v * 10) / 10; }
    function R(x, y, w, hh) { return "M" + r1(x) + "," + r1(y) + "h" + r1(w) + "v" + r1(hh) + "h" + r1(-w) + "z"; }
    function RR(x, y, w, hh, r) {
      var c = "a" + r + "," + r + " 0 0 1 ";
      return "M" + r1(x + r) + "," + r1(y) + "h" + r1(w - 2 * r) + c + r + "," + r + "v" + r1(hh - 2 * r) + c + (-r) + "," + r + "h" + r1(2 * r - w) + c + (-r) + "," + (-r) + "v" + r1(2 * r - hh) + c + r + "," + (-r) + "z";
    }
    function C(cx, cy, r) { return "M" + r1(cx - r) + "," + r1(cy) + "a" + r + "," + r + " 0 1 0 " + r1(2 * r) + ",0a" + r + "," + r + " 0 1 0 " + r1(-2 * r) + ",0"; }
    function PG(pts) { return "M" + pts.map(function (p) { return r1(p[0]) + "," + r1(p[1]); }).join("L") + "Z"; }
    function F(list, fill, d) { list.push(h("path", { d: d, fill: fill })); }
    function FO(list, fill, d, w) { list.push(h("path", { d: d, fill: fill, stroke: INK, strokeWidth: w, strokeLinejoin: "round" })); }

    /* =================================== the airport =================================== */
    var a = [], AY = 946, RY = 968, VY = 982, GY = 1006;

    // ---- the ground, edge-on: apron, runway, verge
    F(a, D.airApron, R(0, AY, 760, VY - AY));
    F(a, D.airApronLit, R(0, AY, 760, 2.2));
    F(a, D.airVerge, R(0, VY, 760, GY - VY));

    // ---- the control tower's wing (it runs off the picture), then the shaft, the cab and what stands on its roof
    F(a, D.airWall, R(-4, 898, 128, 48) + R(62, 800, 28, 98));
    F(a, D.airWallLit, R(-4, 898, 66, 2.4) + R(90, 898, 34, 2.4) + R(84, 805, 6, 93));           // the wing's roof edge; the shaft's sunny side
    F(a, D.airWallShade, R(62, 800, 5.5, 98) + R(67.5, 800, 22.5, 5) + R(-4, 940, 128, 6));      // the shaft's far side, the shade under the collar; the wing's plinth
    F(a, D.airDeck, R(6, 910, 44, 13) + R(102, 910, 16, 13) + R(73, 824, 6, 13) + R(73, 853, 6, 13) + R(73, 880, 6, 13) + R(100, 928, 14, 18));   // the wing's windows, the stair slits, a door
    F(a, D.airDeckLit, PG([[20, 910], [27, 910], [22, 923], [15, 923]]) + PG([[40, 910], [43.5, 910], [38.5, 923], [35, 923]]));
    F(a, D.airWall, R(27.2, 910, 3.2, 13));                                                      // the window band's one mullion
    F(a, D.airWallShade, PG([[62, 800], [90, 800], [106, 782], [46, 782]]));                     // the collar under the deck, in its shade
    F(a, D.airDeck, R(30, 774, 92, 8.5));
    F(a, D.airDeckLit, R(30, 774, 92, 2.2));
    F(a, D.airCab, PG([[41, 774], [111, 774], [119, 738], [33, 738]]));                          // the cab: glass leaning out
    F(a, D.airCabSky, PG([[33, 738], [119, 738], [115.4, 754], [36.6, 754]]));
    F(a, D.airCabHi, PG([[102.5, 738], [112.5, 738], [107, 774], [97, 774]]) + PG([[62, 738], [66, 738], [62.4, 754], [58.4, 754]]));
    F(a, D.airCabShade, PG([[33, 738], [119, 738], [118.1, 742], [33.9, 742]]));
    F(a, D.airPier, PG([[52.9, 738], [56.1, 738], [60.1, 774], [56.9, 774]]) + PG([[74.4, 738], [77.6, 738], [77.6, 774], [74.4, 774]]) + PG([[95.9, 738], [99.1, 738], [95.1, 774], [91.9, 774]]));
    F(a, D.airRoof, R(26, 729, 100, 9));
    F(a, D.airRoofLit, R(26, 729, 100, 2.6));
    F(a, D.airRoofShade, R(26, 735.6, 100, 2.4) + R(58, 719, 30, 10));
    F(a, D.airRoof, R(58, 719, 30, 2.2));
    F(a, D.airSteel, R(71.4, 682, 3.2, 37) + R(102.4, 714, 3.2, 15) + R(67.5, 694, 11, 2.6));    // the mast and its yard, the radar's post
    a.push(h("circle", { cx: 73, cy: 679, r: 4.2, fill: D.towerLamp }));

    // ---- the terminal: one long roof rising to the right, the way the plane leaves; under it a curtain wall
    // of seven bold bays between piers, a transom, a base course; two jet bridges
    var TOP = [116, 828, 216, 772, 440, 750, 590, 766], BOT = [120, 832, 218, 784, 440, 762, 586, 771];
    function bz(P, t) { var u = 1 - t; return [u * u * u * P[0] + 3 * u * u * t * P[2] + 3 * u * t * t * P[4] + t * t * t * P[6], u * u * u * P[1] + 3 * u * u * t * P[3] + 3 * u * t * t * P[5] + t * t * t * P[7]]; }
    function yAt(P, x) { var lo = 0, hi = 1, m; for (var i = 0; i < 26; i++) { m = (lo + hi) / 2; if (bz(P, m)[0] < x) lo = m; else hi = m; } return bz(P, (lo + hi) / 2)[1]; }
    function line(P, x0, x1, dy) {      // the curve from x0 to x1 (either way) as points, moved down by dy
      var n = Math.max(2, Math.ceil(Math.abs(x1 - x0) / 9)), out = [];
      for (var i = 0; i <= n; i++) { var x = x0 + (x1 - x0) * i / n; out.push([x, yAt(P, x) + dy]); }
      return out;
    }
    var WX0 = 146, WX1 = 560, TR = 878, BASE = 922, NB = 7, BW = (WX1 - WX0) / NB, i, k;
    F(a, D.airPier, R(127, yAt(BOT, 129) - 2, 4, AY - yAt(BOT, 129) + 2) + R(577, yAt(BOT, 579) - 2, 4, AY - yAt(BOT, 579) + 2));   // the posts under the roof's two ends
    F(a, D.airGlass, PG([[WX0, TR]].concat(line(BOT, WX0, WX1, -3), [[WX1, TR]])));
    F(a, D.airGlassDeep, R(WX0, TR, WX1 - WX0, BASE - TR));
    (function () {
      // the sky in the glass: a few bold streaks, each inside its own bay
      var SPEC = [[], [[34, 12]], [], [[34, 6], [44, 11]], [], [[39, 10]], [[35, 15]]], d = "";
      SPEC.forEach(function (list, b) {
        list.forEach(function (s) {
          var xa = WX0 + b * BW, x0 = xa + s[0], x1 = x0 + s[1], y0 = yAt(BOT, x0), y1 = yAt(BOT, x1), lean = 0.27 * (TR - y0);
          d += PG([[x0, y0], [x1, y1], [x1 - lean, TR], [x0 - lean, TR]]);
        });
      });
      F(a, D.airGlassHi, d);
      F(a, D.airGlass, R(WX0, 900, WX1 - WX0, 3.2));                                             // the gallery's rail, seen through the lower glass
    })();
    F(a, D.airGlassShade, PG(line(BOT, WX0, WX1, 0).concat(line(BOT, WX1, WX0, 10))));           // the eave's shade on the glass
    (function () {
      var d = "", s = "";
      for (i = 0; i <= NB; i++) {
        var px = i === 0 ? WX0 : i === NB ? WX1 - 6 : WX0 + i * BW - 3, py = yAt(BOT, px + 3);
        d += R(px, py - 3, 6, BASE - py + 3); s += R(px, py, 6, 10);
      }
      F(a, D.airPier, d + R(WX0, TR, WX1 - WX0, 6));
      F(a, D.airPierShade, s + R(WX0, TR + 6, WX1 - WX0, 2.4));
    })();
    F(a, D.airBase, R(140, BASE, 426, AY - BASE));
    F(a, D.airBaseLit, R(140, BASE, 426, 2.4));
    F(a, D.airBaseDark, R(166, 929, 15, 17) + R(296, 927, 26, 19) + R(526, 929, 15, 17));        // doors onto the apron
    F(a, D.airApronShade, R(140, AY, 426, 3));
    F(a, D.airRoof, PG(line(TOP, 116, 590, 0).concat(line(BOT, 586, 120, 0))));
    F(a, D.airRoofLit, PG(line(TOP, 116, 590, 0).concat(line(TOP, 590, 116, 3.2))));
    F(a, D.airRoofShade, PG(line(BOT, 120, 586, -3).concat(line(BOT, 586, 120, 0))));
    [200, 404].forEach(function (rx) {
      // a jet bridge: the rotunda at the wall, the tunnel, the cab at its end, a leg on a wheeled bogie
      F(a, D.airGse, R(rx, 900, 14, 46) + R(rx + 14, 905, 50, 16) + RR(rx + 62, 901, 18, 25, 2));
      F(a, D.airRoofLit, R(rx + 14, 905, 48, 2));
      F(a, D.airGseShade, R(rx, 900, 3.6, 46) + R(rx + 14, 918.6, 48, 2.4) + R(rx - 2, 897, 18, 3.4));
      F(a, D.airDeck, R(rx + 19, 910, 40, 5) + R(rx + 66, 906, 10, 7));
      F(a, D.airGseDark, R(rx + 80, 904, 4, 20) + R(rx + 41, 939, 18, 3.6));
      F(a, D.airSteel, R(rx + 48, 921, 4, 18));
      F(a, D.truckTyre, C(rx + 45, 942.8, 3.1) + C(rx + 55, 942.8, 3.1));
    });

    // ---- the runway, seen edge-on like everything else: a strip, the paint as the camera sees it (the
    // threshold at each end, two touchdown marks, the aiming point where the wheels come down), its side line
    F(a, D.airRunway, R(22, RY, 682, VY - RY));
    F(a, D.airRunwayLit, R(22, RY, 682, 2));
    F(a, D.airMark, R(30, 971.2, 20, 4.6) + R(676, 971.2, 20, 4.6) + R(150, 971.2, 12, 4.6) + R(232, 971.2, 12, 4.6) + R(314, 971.2, 30, 4.6) + R(26, 977.6, 674, 3));
    (function () {
      var stem = "", lamp = "";
      for (i = 0; i < 8; i++) { var lx = 62 + i * 84; stem += R(lx - 1.5, 985, 3, 6); lamp += RR(lx - 3.6, 980, 7.2, 5.4, 2); }
      F(a, D.airSteel, stem); F(a, D.airLamp, lamp);                                            // edge lights on their stems, on the near side
    })();

    // ---- on the apron: a stair truck and a fuel bowser, parked (unbranded), in a row nearer the terminal
    // than the lane the baggage train runs in
    (function () {
      var Y = -4.6, sh = function (pts) { return pts.map(function (p) { return [p[0], p[1] + Y]; }); };
      F(a, D.airApronShade, R(310, 957.4 + Y, 46, 2.4) + R(596, 957.4 + Y, 50, 2.4));
      F(a, D.airGseDark, R(312, 950.6 + Y, 42, 3.6) + R(598, 950.6 + Y, 46, 3.6) + R(335.4, 931 + Y, 3.2, 20));
      F(a, D.airGse, RR(341, 938.6 + Y, 13, 12, 2) + PG(sh([[312, 950.6], [312, 946.4], [337, 926], [354, 926], [354, 930.6], [340, 930.6], [318.4, 950.6]])));
      F(a, D.airGseShade, PG(sh([[315.6, 950.6], [340.4, 930.6], [343.6, 930.6], [318.8, 950.6]])));
      F(a, D.airDeck, R(345, 941 + Y, 7, 4.6) + RR(631, 938.6 + Y, 13, 12, 2));
      F(a, D.airGse, RR(599, 936.6 + Y, 31, 14, 5));
      F(a, D.airRoofLit, R(604, 936.6 + Y, 21, 2.2));
      F(a, D.airGseShade, R(599, 943.6 + Y, 31, 3));
      F(a, D.airGlass, R(636, 941 + Y, 6.4, 4.6));
      F(a, D.truckTyre, C(320, 955.2 + Y, 3.5) + C(346, 955.2 + Y, 3.5) + C(606.5, 955.2 + Y, 3.5) + C(638, 955.2 + Y, 3.5));
    })();

    // ---- the windsock's mast, right of the runway's end and under the plane's climb
    F(a, D.airGseDark, R(723, 1002, 12, 4));
    F(a, D.airSteel, R(727.4, 942, 3.2, 61) + R(725, 942, 5.6, 14));
    A.airport = h("g", { "data-cache": "nAirport", "data-roof": "airport", "data-box": "0 672 762 336" }, a);

    // the baggage train, facing right: three carts and the tug. Local: its rear on the ground at 0,0
    (function () {
      var t = [], tyre = "", deck = "", white = "", blue = "";
      for (k = 0; k < 3; k++) {
        var cx = k * 20;
        deck += R(cx, -7.4, 16, 2.6) + R(cx + 16, -6.4, 4, 1.6);
        tyre += C(cx + 3.6, -2.4, 2.4) + C(cx + 12.4, -2.4, 2.4);
        if (k === 1) blue += RR(cx + 1, -15.4, 14, 8, 1.4); else white += RR(cx + 1, -15.4, 14, 8, 1.4);
      }
      F(t, D.airApronShade, R(-1, -1.2, 82, 2.4));
      F(t, D.airGseDark, deck + R(64, -16.6, 2.2, 7.4) + R(72.4, -16.6, 2.2, 7.4) + R(62.4, -18.4, 13.6, 2.4));
      F(t, D.airGse, white); F(t, D.airDeckLit, blue);
      F(t, D.whSafety, RR(60, -10, 20, 7.4, 2));
      F(t, D.truckTyre, tyre + C(65, -3, 3) + C(76, -3, 3));
      A.train = h("g", { "data-cache": "nBagTrain", "data-box": "-2 -20 84 22" }, t);
    })();

    /* =================================== the Sanpou depot ===================================
       Left to right: the dock hall (two docks under one slim canopy, the one vermilion fascia line), the
       office (three ribbons of glazing, the staff entrance), its roof plant, and the stair core with the name. */
    var dp = [], HX0 = 752, HX1 = 956, HT = 928, OX1 = 1092, OT = 812, PX0 = 1040, PT = 772, CX1 = 1166, CT = 734;
    F(dp, INK, PG([[HX0 - 2, HT - 2], [HX1 - 2, HT - 2], [HX1 - 2, OT - 2], [PX0 - 2, OT - 2], [PX0 - 2, PT - 2], [OX1 - 2, PT - 2], [OX1 - 2, CT - 2], [CX1 + 2, CT - 2], [CX1 + 2, GY + 1.2], [HX0 - 2, GY + 1.2]]));
    F(dp, D.whWall, R(HX0, HT, HX1 - HX0, GY - HT) + R(HX1, OT, OX1 - HX1, GY - OT) + R(PX0, PT, OX1 - PX0, OT - PT) + R(OX1, CT, CX1 - OX1, GY - CT));
    F(dp, D.whJoint, R(HX1, 873, OX1 - HX1 - 6, 2) + R(HX1, 917, OX1 - HX1 - 6, 2) + R(HX1, 961, OX1 - HX1 - 6, 2));     // the office's floor lines
    F(dp, D.whWallShade,
      R(HX0, HT + 5, HX1 - HX0, 3) + R(HX1, OT + 5, PX0 - HX1, 3) + R(PX0, PT + 5, OX1 - PX0, 3) + R(OX1, CT + 5, CX1 - OX1, 3)      // under the four copings
      + R(HX1 - 6, HT + 8, 6, GY - HT - 14) + R(OX1 - 6, PT + 8, 6, GY - PT - 14)                                                  // beside what stands proud: the office, the core
      + R(760, 967.5, 188, 4.5)                                                                                                  // under the dock canopy
      + R(1100, 941, 58, 3) + R(1040, 967, 46, 3) + R(1112, 965.5, 34, 3));                                                      // under the name band, the entrance canopies
    F(dp, D.whTrim, R(HX0, HT, HX1 - HX0, 5) + R(HX1, OT, PX0 - HX1, 5) + R(PX0, PT, OX1 - PX0, 5) + R(OX1, CT, CX1 - OX1, 5)
      + R(758, 963, 192, 4.5) + R(1038, 963, 50, 4) + R(1110, 962, 38, 3.5));                                                    // copings; the canopies, seen edge-on
    F(dp, D.whTrimLit, R(HX0, HT, HX1 - HX0, 1.8) + R(HX1, OT, PX0 - HX1, 1.8) + R(PX0, PT, OX1 - PX0, 1.8) + R(OX1, CT, CX1 - OX1, 1.8) + R(758, 963, 192, 1.5) + R(1038, 963, 50, 1.4));
    F(dp, COLORS.verm, R(HX0, 937.5, HX1 - HX0, 4.5));                                                                             // the one vermilion line: the hall's fascia
    F(dp, D.parcelTapeShade, R(HX1 - 6, 937.5, 6, 4.5));                                                                           // ... where the office's shade falls on it
    F(dp, D.whBase, R(HX0, 1000, 770 - 3 - HX0, 6) + R(805, 1000, 96, 6) + R(939, 1000, 107, 6) + R(1080, 1000, 34, 6) + R(1144, 1000, CX1 - 1144, 6));
    F(dp, D.whBaseLit, R(HX0, 1000, 770 - 3 - HX0, 1.6) + R(805, 1000, 96, 1.6) + R(939, 1000, 107, 1.6) + R(1080, 1000, 34, 1.6) + R(1144, 1000, CX1 - 1144, 1.6));
    // the two docks: cool shade inside, stock on the floor, the sun lying on the floor; a navy portal, bumpers
    var DOCKS = [770, 904], DW = 32, DH = 32, DY = GY - DH;
    (function () {
      var inn = "", floor = "", stock = "", lit = "", deep = "", frame = "", rubber = "";
      DOCKS.forEach(function (dx, di) {
        inn += R(dx, DY, DW, DH); floor += R(dx, GY - 3.4, DW, 3.4); deep += R(dx, DY, DW, 6);
        var st = di ? [[3, 13, 12], [17, 12, 17], [18, 9, 8, 17]] : [[4, 12, 16], [18, 11, 11]];
        st.forEach(function (b) { var top = GY - 3.4 - b[2] - (b[3] || 0); stock += R(dx + b[0], top, b[1], b[2]); lit += R(dx + b[0], top, b[1], 2); });
        frame += R(dx - 3, DY - 2, 3, DH + 2) + R(dx + DW, DY - 2, 3, DH + 2) + R(dx - 5, DY - 6.5, DW + 10, 6.5);
        rubber += R(dx - 8, GY - 9.6, 4.4, 9) + R(dx + DW + 3.6, GY - 9.6, 4.4, 9);
      });
      F(dp, D.whIn, inn); F(dp, D.whFloorLit, floor); F(dp, D.whStock, stock); F(dp, D.whStockLit, lit);
      dp.push(h("path", { d: deep, fill: D.whInShade, opacity: 0.6 }));
      F(dp, D.whFrame, frame); F(dp, D.whRubber, rubber);
    })();
    // the office: three ribbons of glazing under slim sun shades, a ground floor window, the staff entrance
    (function () {
      var frame = "", glass = "", hi = "", blind = "", alu = "", aluLit = "", shade = "", inside = "";
      var HI = [[[1, 9, 5]], [[0, 12, 4], [3, 8, 6]], [[1, 13, 3], [2, 6, 7]]], BL = [[2, 9], [1, 13], [3, 7]], IN = [[0, 3, 7], [2, 14, 9], [1, 2, 6]];
      [838, 882, 926].forEach(function (y, fi) {
        frame += R(964, y, 118, 24);
        for (k = 0; k < 4; k++) {
          var px = 967 + k * 28.75;
          glass += R(px, y + 3, 25.75, 18);
          HI[fi].forEach(function (s) { if (s[0] === k) hi += PG([[px + s[1], y + 3], [px + s[1] + s[2], y + 3], [px + s[1] + s[2] - 7, y + 21], [px + s[1] - 7, y + 21]]); });
          if (BL[fi][0] === k) blind += R(px, y + 3, 25.75, BL[fi][1]);
          if (IN[fi][0] === k) inside += R(px + IN[fi][1], y + 21 - IN[fi][2], 9, IN[fi][2]);
        }
        alu += R(961, y - 6, 124, 3.2) + R(961, y + 24, 124, 2.8);
        aluLit += R(961, y - 6, 124, 1.3);
        shade += R(963, y - 2.8, 120, 2.8) + R(963, y + 26.8, 120, 2.2);
      });
      frame += R(964, 973, 64, 24) + R(1046, 970, 34, 36) + R(1114, 968, 30, 38) + R(1048, 784, 36, 20);          // ground floor window, the two entrances, the roof plant's louvre
      glass += R(967, 976, 28, 18) + R(998, 976, 27, 18) + R(1049, 973, 13, 33) + R(1064, 973, 13, 33) + R(1117, 971, 24, 35);
      hi += PG([[979, 976], [985, 976], [978, 994], [972, 994]]) + PG([[1055, 973], [1059, 973], [1052, 1006], [1049, 1006], [1049, 989]]) + PG([[1130, 971], [1136, 971], [1124, 1006], [1118, 1006]]);
      F(dp, D.whFrame, frame); F(dp, D.whGlass, glass); F(dp, D.whGlassIn, inside); F(dp, D.whGlassHi, hi);
      F(dp, D.whBlind, blind);
      F(dp, D.whWallShade, shade);
      F(dp, D.whAlu, alu + R(1051, 787.4, 30, 3.2) + R(1051, 793.4, 30, 3.2) + R(1051, 799.4, 30, 3.2));
      F(dp, D.whAluLit, aluLit);
    })();
    // the name band on the stair core: navy, mounted proud of the wall
    F(dp, D.whSign, R(1100, 745, 58, 196));
    F(dp, D.whSignLit, R(1100, 745, 58, 2));
    A.depot = h("g", { "data-cache": "nDepot", "data-roof": "depot", "data-box": "748 730 422 280" }, dp);
    A.name = [0, 1, 2, 3].map(function (n) {
      return h("text", { x: 1129, y: 788.5 + 47 * n, textAnchor: "middle", fontFamily: FONTS.jp, fontSize: 46, fontWeight: 800, fill: COLORS.paper, style: { textRendering: "geometricPrecision" } }, CONTENT.brand.nameJp.charAt(n));
    });
    // the second dock's shutter, drawn closed with its top left corner at 0,0
    A.shutter = [
      h("path", { d: R(0, 0, DW, DH), fill: D.whShut }),
      h("path", { d: R(0, 8, DW, 2) + R(0, 16.5, DW, 2) + R(0, 25, DW, 2), fill: D.whShutLine }),
      h("path", { d: R(0, 0, DW, 3), fill: D.whShutShade }),
      h("path", { d: R(0, DH - 4.4, DW, 4.4), fill: D.whShutBar })
    ];
    A.clip = h("clipPath", { id: "nDepotDock" }, h("rect", { x: DOCKS[1], y: DY, width: DW, height: DH }));
    A.dock = { x: DOCKS[1], y: DY, lift: DH - 5 };

    /* =================================== the pavement and the road =================================== */
    var rd = [], dash = "";
    for (i = 0; i < 39; i++) dash += R(12 + i * 50, 1032.2, 26, 3.4);
    F(rd, D.walk, R(0, GY, 1920, 8));
    F(rd, D.walkLit, R(0, GY, 1920, 2));
    F(rd, D.curb, R(0, 1011.4, 1920, 2.6));
    F(rd, D.road, R(0, 1014, 1920, 40));
    F(rd, D.roadLine, R(0, 1016.6, 1920, 3) + R(0, 1049.4, 1920, 3));
    F(rd, D.roadDash, dash);
    F(rd, D.roadEdge, R(0, 1054, 1920, 26));
    A.road = h("g", { "data-cache": "nRoad", "data-box": "0 1006 1920 74" }, rd);

    /* ---- the little truck: the truck of scenes 01-03 at a twentieth of the detail. A white box with the one
       vermilion stripe, a navy cab, two axles. No lettering at this size. Local: the box's rear top corner is
       0,0, the tyres stand on y 40, it is 90 long and faces right. ---- */
    var box = "M0,2 Q0,0 2,0 L58,0 Q60,0 60,2 L60,28 Q60,30 58,30 L2,30 Q0,30 0,28 Z";
    var shell = "M63.2,31 L63.2,9.4 Q63.2,7.2 65.4,7.2 L78.6,7.2 Q80.9,7.2 81.9,9.3 L86.2,18.4 Q88,19.4 88,21.6 L88,29 Q88,31 86,31 Z";
    var tw = [], tb = [];
    F(tw, D.truckFrame, R(1, 29.4, 85, 4.4));
    F(tw, D.truckTyre, C(17, 34, 6) + C(74, 34, 6));
    F(tw, D.truckSteelLit, C(17, 34, 3.3) + C(74, 34, 3.3));
    F(tw, D.truckSteelShade, C(17, 34, 1.4) + C(74, 34, 1.4));
    F(tb, D.truckAlu, R(27, 31.4, 36, 2.8));
    F(tb, D.truckFrame, R(60, 9, 3.6, 21));
    F(tb, D.truckBox, box);
    F(tb, D.truckAlu, R(0.8, 0.8, 58.4, 2.8));
    F(tb, D.truckBoxLit, R(1.6, 0.8, 56.8, 1.2));
    F(tb, D.truckBoxShade, R(0.8, 3.6, 2.6, 25.6));
    F(tb, COLORS.verm, R(3.4, 20.2, 55.8, 4.8));
    tb.push(h("path", { d: box, fill: "none", stroke: INK, strokeWidth: 1.7, strokeLinejoin: "round" }));
    F(tb, D.truckCab, shell);
    F(tb, D.truckCabLit, R(65.2, 8, 13.6, 1.3));
    F(tb, D.truckCabShade, "M64,24.8 H87.2 V29 Q87.2,30.2 86,30.2 H64 Z");
    F(tb, D.truckGlass, "M69,10.6 L79.4,10.6 L83.4,19.2 L69,19.2 Z");
    F(tb, D.truckGlassLit, "M73.8,10.6 L77.2,10.6 L74,19.2 L70.6,19.2 Z");
    tb.push(h("path", { d: shell, fill: "none", stroke: INK, strokeWidth: 1.6, strokeLinejoin: "round" }));
    F(tb, D.truckLens, R(85.6, 21, 2.8, 3.4));
    FO(tb, D.truckBumper, RR(84.6, 26.2, 5.4, 5.4, 1), 1.1);
    A.truck = {
      shadow: h("path", { d: "M-3,38.6H91a1.6,1.6 0 0 1 0,3.2H-3a1.6,1.6 0 0 1 0,-3.2z", fill: D.truckShadow }),
      wheels: h("g", { "data-cache": "nMiniWheels", "data-box": "0 27 90 14" }, tw),
      body: h("g", { "data-cache": "nMiniBody", "data-box": "-1 -1 92 35" }, tb)
    };
    return _fgArt = A;
  }
  // one little truck: x is its rear on the road, y the line its tyres stand on; dir -1 faces left
  function MiniRoadTruck(x, y, s, dir, pitch) {
    var T = finaleGroundArt().truck;
    return h("g", { transform: "translate(" + x.toFixed(2) + "," + y.toFixed(2) + ") scale(" + (dir * s).toFixed(4) + "," + s.toFixed(4) + ") translate(0,-40)" },
      T.shadow, T.wheels,
      h("g", { transform: "rotate(" + (pitch || 0).toFixed(3) + " 17 34)" }, T.body));
  }

  // the windsock: five rings of cloth from the mast's hoop at 727,949, streaming left (the plane takes off
  // into the wind). The wind's strength lifts it or lets it hang; a wave runs down it from the hoop to the tip
  function windsockD(time) {
    var w = 0.74 + 0.16 * Math.sin(time * 0.62 + 0.4) + 0.08 * Math.sin(time * 1.7 + 2);
    var droop = (1 - w) * 64, x = 727, y = 949, seg = 7.4, red = "", white = "", top = [], bot = [], i;
    var r = function (v) { return Math.round(v * 10) / 10; };
    for (i = 0; i <= 5; i++) {
      var ang = (droop * (0.5 + 0.12 * i) + (0.8 + 2.3 * i) * (0.45 + 0.55 * w) * Math.sin(time * 7.1 - i * 0.95)) * Math.PI / 180;
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
    var rw = 5 + 19 * Math.abs(Math.cos(time * 1.45));                           // the radar turns: its width is what we see of it
    var lamp = Math.pow(0.5 + 0.5 * Math.sin(time * 2.3 + 1), 3);
    var tx = -90 + (((48.4 * time + 643) % 919.6) + 919.6) % 919.6;              // the baggage train: 19 s from edge to edge
    var blink = 0.25 + 0.75 * Math.pow(0.5 + 0.5 * Math.sin(time * 5.5), 2);
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
  function FinaleDepot(time) {
    var A = finaleGroundArt(), open = depotShutterAt(time);
    return h("g", null,
      h("defs", null, A.clip),
      A.depot,
      A.name,
      h("g", { clipPath: "url(#nDepotDock)" },
        h("g", { transform: "translate(" + A.dock.x + "," + (A.dock.y - A.dock.lift * open).toFixed(2) + ")" }, A.shutter))
    );
  }
  function FinaleRoad(time) {
    var A = finaleGroundArt(), M = MINI, a = depotTruckAt(time, 0), b = depotTruckAt(time, 1);
    var through = ((((M.V * time - 247) % 2280) + 2280) % 2280) - 200;
    var n0 = 2140 - ((((M.VN * time + 300) % 2508) + 2508) % 2508), n1 = 2140 - ((((M.VN * time + 1500) % 2508) + 2508) % 2508);
    return h("g", null,
      A.road,
      MiniRoadTruck(M.X0, M.YS, M.SS, 1, 0),
      MiniRoadTruck(a.x, a.y, a.s, 1, a.pitch),
      MiniRoadTruck(b.x, b.y, b.s, 1, b.pitch),
      MiniRoadTruck(through, M.YL, M.SL, 1, 0),
      MiniRoadTruck(n0, M.YN, 1, -1, 0),
      MiniRoadTruck(n1, M.YN, 1, -1, 0)
    );
  }
//== REPLACE from "          Airport(time)," to "          AirportPlane(time)"
          Airport(time),
          FinaleDepot(time),
          FinaleRoad(time),
