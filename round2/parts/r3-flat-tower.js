//== REPLACE from "  /* Tokyo Tower, round 3:" to "  /* (the round 2 building kit stood here"
  /* Tokyo Tower, round 3: drawn again as ONE straight-on flat elevation, symmetric about its centre line.
     The far face stands exactly behind the near face, so there is one lattice, not two. Depth is shown by
     overlap and value only: what stands inside the tower (the lift shaft, the secondary bracing, the
     podium, the decks' corbels) is drawn behind the lattice and a tone down.
     - The ground: one level slab; a stepped footing under each leg; the low podium building that stands
       under the tower, between the legs, the legs overlapping its ends.
     - Two legs, each an open lattice column (two chords, X bracing, struts) you can see the sky through.
       A trussed arch (two chords and the posts between them) springs from leg to leg and is hung from
       the girder.
     - Above the girder: corner posts, one big X per panel with a gusset where it crosses, a rail closing
       each panel; behind them the lift shaft up the middle and a diamond of secondary bracing.
     - The two-storey main deck and the small top deck are flat boxes with glazing, each carried on a
       stepped corbel, each putting a level band of shade on the lattice just under it; then the antenna
       drum, the banded mast stepping in as it rises, the needle and its lamp.
     - Orange and white bands run over the whole height. Light shows as flat tone, a lighter top edge on
       the girder and the rails, and the shade under the decks; nothing has a lit or a shaded side.
     Coordinates: t = height as a fraction of the tower, a = px right of the centre line.
     Same props, place, height and footprint as before. Two cached groups, with the moving parts between
     and after them, all pure functions of p.time: a reflection crossing the main deck's glass, the lift
     car riding inside the lattice between the podium roof and the main deck, the aviation lamp at the tip. */
  var _ttMemo = {};
  DAY.towerOrange = "#e4553b";        // Tokyo Tower's own red-orange (nothing else uses it)
  DAY.towerOrangeLit = "#f08a6c";     // top edges that catch the sun
  DAY.towerOrangeShade = "#ab4a45";   // orange inside the tower and under the decks: pushed toward navy
  DAY.towerWhite = "#f5f8fc";         // white bands, deck panels, copings, footings
  DAY.towerWhiteShade = "#c6d3e9";    // white inside the tower and under the decks: periwinkle
  DAY.towerStone = "#dde4ed";         // the podium's wall
  DAY.towerSteel = "#b3bfd1";         // roofs, skirts, shade on the stone, the ground slab
  DAY.towerSteelShade = "#8693aa";    // the corbels under the decks
  DAY.towerGlass = "#364b70";         // deck and podium glazing
  DAY.towerGlassSky = "#7c9ac5";      // the sky reflected across the top of a pane
  DAY.towerLamp = "#c23f2f";          // the aviation lamp, resting
  DAY.towerLampLit = "#ffc4b2";       // the aviation lamp, lit
  function TokyoTower(p) {
    var cx = p.cx, baseY = p.baseY, H = p.h, time = p.time || 0, u = H / 770;
    var key = cx + "|" + baseY + "|" + H, m = _ttMemo[key];
    if (!m) {
      var r1 = function (v) { return Math.round(v * 10) / 10; };
      var PLZ = 2 * u, HT = H - PLZ, HW0 = 115 * u;                    // the ground slab; tower height; half width at the ground
      var T_G = 0.2, T_D0 = 0.42, T_D1 = 0.478, T_U1 = 0.737, T_U2 = 0.768;    // girder; main deck; top deck
      var Y = function (t) { return baseY - PLZ - t * HT; };
      var hw = function (t) {                                          // half width: a flare to the main deck, a straight taper above it
        if (t <= T_D0) return HW0 * Math.exp(-2.867 * t);
        if (t <= T_D1) return (34.5 - (t - T_D0) / (T_D1 - T_D0) * 3.5) * u;
        return (31 - Math.min(1, (t - T_D1) / (T_U1 - T_D1)) * 18) * u;
      };
      var both = function (fn) { fn(-1); fn(1); };                     // everything is drawn once each side of the centre line

      var lay = {};
      var add = function (k, q) {                                      // one closed shape into colour layer k, all wound one way so overlaps never cancel
        var n = q.length, ar = 0, s = "", i;
        for (i = 0; i < n; i += 2) ar += q[i] * q[(i + 3) % n] - q[(i + 2) % n] * q[i + 1];
        if (ar < 0) { var rv = []; for (i = n - 2; i >= 0; i -= 2) rv.push(q[i], q[i + 1]); q = rv; }
        for (i = 0; i < n; i += 2) s += (i ? "L" : "M") + r1(q[i]) + "," + r1(q[i + 1]);
        lay[k] = (lay[k] || "") + s + "z";
      };
      var bar = function (k, x0, y0, x1, y1, w) {                      // a straight member of width w
        var dx = x1 - x0, dy = y1 - y0, n = Math.sqrt(dx * dx + dy * dy) || 1, ox = -dy / n * w / 2, oy = dx / n * w / 2;
        var q = [x0 + ox, y0 + oy, x1 + ox, y1 + oy, x1 - ox, y1 - oy, x0 - ox, y0 - oy];
        add(k, q); return q;
      };
      var box = function (k, x, y, w, hh) { add(k, [x, y, x + w, y, x + w, y + hh, x, y + hh]); };
      var cbox = function (k, half, y, hh) { box(k, cx - half, y, 2 * half, hh); };      // a box centred on the tower's axis
      var strip = function (k, fa, fb, t0, t1, n) {                    // the area between two edges a = fa(t), a = fb(t)
        var q = [], i, t;
        for (i = 0; i <= n; i++) { t = t0 + (t1 - t0) * i / n; q.push(cx + fa(t), Y(t)); }
        for (i = n; i >= 0; i--) { t = t0 + (t1 - t0) * i / n; q.push(cx + fb(t), Y(t)); }
        add(k, q); return q;
      };
      var above = function (q, yc) {                                   // the part of a shape above the line y = yc (the level edge of a deck's shade)
        var o = [], n = q.length, i;
        for (i = 0; i < n; i += 2) {
          var x0 = q[i], y0 = q[i + 1], x1 = q[(i + 2) % n], y1 = q[(i + 3) % n], in0 = y0 <= yc, in1 = y1 <= yc;
          if (in0) o.push(x0, y0);
          if (in0 !== in1) o.push(x0 + (x1 - x0) * (yc - y0) / (y1 - y0), yc);
        }
        return o;
      };

      /* ---- the ground under the tower: one level slab; the feet and the podium stand on it ---- */
      cbox("gSh", HW0 + 22 * u, baseY - PLZ, PLZ);

      /* ---- behind the lattice, a tone down: the lift shaft up the middle and the secondary bracing ---- */
      var lw = function (t) { return (40 - 70 * t) * u; }, CO = 8 * u, CI = 6.4 * u, T_F = 0.016;   // a leg: its width, its two chords, the top of its footing
      var LJ = [T_F, 0.08, 0.14, T_G];
      var PW = function (t) { return (12 - 11 * (t - T_G)) * u; };                       // corner posts below the main deck
      var PU = function (t) { return (7.4 - 7 * (t - T_D1)) * u; };                      // and above it
      var JL = [T_G, 0.288, 0.345, T_D0], BL = ["o", "w", "o"];                          // panels and their bands, girder to main deck
      var JU = [T_D1, 0.5425, 0.607, 0.672, T_U1], BU = ["o", "w", "o", "w"];            // main deck to top deck
      strip("oS", function () { return -3 * u; }, function () { return 3 * u; }, 0.07, T_G, 1);
      var j;
      for (j = 0; j < 3; j++) (function (a, b, c) {                    // girder to main deck: the shaft, and a diamond between the posts
        var tm = (a + b) / 2, e = hw(tm) - PW(tm) / 2;
        strip(c + "S", function () { return -3 * u; }, function () { return 3 * u; }, a, b, 1);
        both(function (sd) { bar(c + "S", cx + sd * e, Y(tm), cx, Y(b), 3.2 * u); bar(c + "S", cx + sd * e, Y(tm), cx, Y(a), 3.2 * u); });
      })(JL[j], JL[j + 1], BL[j]);
      for (j = 0; j < 4; j++) (function (a, b, c) {                    // main deck to top deck: the shaft, and one strut across the middle of each panel
        var tm = (a + b) / 2, e = hw(tm) - PU(tm) / 2;
        strip(c + "S", function () { return -2.1 * u; }, function () { return 2.1 * u; }, a, b, 1);
        bar(c + "S", cx - e, Y(tm), cx + e, Y(tm), 2.6 * u);
      })(JU[j], JU[j + 1], BU[j]);
      both(function (sd) {                                             // in each leg: a strut across the middle of every bay
        for (var i = 0; i < 3; i++) { var tm = (LJ[i] + LJ[i + 1]) / 2; bar("oS", cx + sd * (hw(tm) - CO / 2), Y(tm), cx + sd * (hw(tm) - lw(tm) + CI / 2), Y(tm), 3 * u); }
      });

      /* ---- the podium: the low building under the tower, between the legs (no lettering) ---- */
      var PHW = 64 * u, PH = 46 * u, pl = cx - PHW, pr = cx + PHW, pb = Y(0), pt = pb - PH;
      box("wall", pl, pt, pr - pl, PH);
      box("whB", pl - 2.5 * u, pt - 1 * u, pr - pl + 5 * u, 5.5 * u);                                                // coping
      box("stB", pl, pt + 4.5 * u, pr - pl, 2.8 * u);                                                                // and its shade on the wall
      var wy = pt + 12 * u, wh2 = 11.5 * u, wx0 = pl + 8 * u, wx1 = pr - 8 * u;
      box("gl", wx0, wy, wx1 - wx0, wh2); box("sky", wx0, wy, wx1 - wx0, 4.2 * u);                                   // upper floor: one ribbon of glass
      for (j = 1; j < 6; j++) box("whB", wx0 + (wx1 - wx0) * j / 6 - 1.5 * u, wy, 3 * u, wh2);
      var cy2 = pt + 28.5 * u, ex0 = cx - 36 * u;
      box("gl", ex0, cy2, 72 * u, 5.5 * u); box("sky", ex0, cy2 + 5.5 * u, 72 * u, pb - cy2 - 5.5 * u);              // the glazed entrance, the canopy's shade across its top
      for (j = 1; j < 4; j++) box("whB", ex0 + 72 * u * j / 4 - 1.5 * u, cy2, 3 * u, pb - cy2);
      box("whB", pl - 3 * u, cy2 - 3.8 * u, pr - pl + 6 * u, 3.8 * u);                                               // canopy
      box("stB", pl, cy2, ex0 - pl, 2.6 * u); box("stB", ex0 + 72 * u, cy2, pr - ex0 - 72 * u, 2.6 * u);
      var sty = pt - 1 * u - 12 * u;                                                                                 // where the lift shaft meets the roof
      cbox("wall", 10 * u, sty, 12 * u); cbox("stB", 10 * u, sty + 9.4 * u, 2.6 * u); cbox("whB", 11.5 * u, sty - 2.6 * u, 2.6 * u);

      /* ---- the decks: flat boxes on the tower's axis, each on a stepped corbel that comes in to the lattice ---- */
      var glassRows = [];
      var deck = function (tb, tt, half, rows, panes, soffH) {
        var x0 = cx - half, y = Y(tt), tot = Y(tb) - Y(tt), sum = 0, post = 3.2 * u;
        rows.forEach(function (r) { sum += r[0]; });
        rows.forEach(function (r) {
          var hh = r[0] / sum * tot, kd = r[1];
          box(kd === "g" ? "gl" : kd === "w" ? "whB" : "stB", x0, y, 2 * half, hh);
          if (kd === "r") box("whB", x0 - 1.5 * u, y, 2 * half + 3 * u, 2.6 * u);                                    // the roof's coping
          if (kd === "g") {
            box("sky", x0, y, 2 * half, hh * 0.36);
            for (var i = 1; i < panes; i++) box("w", x0 + i * 2 * half / panes - post / 2, y, post, hh);             // mullions: in front of the moving reflection
            box("w", x0, y, post, hh); box("w", x0 + 2 * half - post, y, post, hh);
            glassRows.push([x0 + post, y, x0 + 2 * half - post, hh]);
          }
          y += hh;
        });
        var lat = hw(tb), s1 = lat + (half - lat) * 0.68, s2 = lat + (half - lat) * 0.3;
        cbox("stS", s1, Y(tb), soffH / 2); cbox("stS", s2, Y(tb) + soffH / 2, soffH / 2);
      };
      var SOFF = 10 * u, SOFT = 6 * u;
      deck(T_D0, T_D1, 66 * u, [[6, "r"], [13, "g"], [7, "w"], [11, "g"], [6, "s"]], 8, SOFF);
      deck(T_U1, T_U2, 22 * u, [[4.5, "r"], [10, "g"], [5, "s"]], 4, SOFT);

      /* ---- the lattice ---- */
      both(function (sd) {
        // a leg: two chords from its footing to the girder, three bays of X bracing, a strut at every joint
        strip("o", function (t) { return sd * hw(t); }, function (t) { return sd * (hw(t) - CO); }, T_F, T_G, 6);
        strip("o", function (t) { return sd * (hw(t) - lw(t)); }, function (t) { return sd * (hw(t) - lw(t) + CI); }, T_F, T_G, 6);
        for (var i = 0; i < 3; i++) {
          var a = LJ[i], b = LJ[i + 1];
          var oa = sd * (hw(a) - CO / 2), ob = sd * (hw(b) - CO / 2), ia = sd * (hw(a) - lw(a) + CI / 2), ib = sd * (hw(b) - lw(b) + CI / 2);
          bar("o", cx + oa, Y(a), cx + ib, Y(b), 3.4 * u);
          bar("o", cx + ia, Y(a), cx + ob, Y(b), 3.4 * u);
          bar("o", cx + oa, Y(a), cx + ia, Y(a), 3.6 * u);
        }
        // its footing: two steps of concrete, the lower one wider
        var f0 = hw(T_F) - lw(T_F) - 3 * u, f1 = hw(T_F) + 3 * u, fy = Y(T_F), fh = Y(0) - fy;
        box("w", cx + (sd < 0 ? -f1 : f0), fy, f1 - f0, fh * 0.56);
        box("wA", cx + (sd < 0 ? -f1 - 4 * u : f0 - 4 * u), fy + fh * 0.56, f1 - f0 + 8 * u, fh * 0.44);
      });
      /* the arch between the legs: a truss of two chords and the posts between them */
      var T_A0 = 0.078, T_A1 = 0.168, AD = 12 * u, AC = 3.2 * u;       // springing; crown; the truss's depth; its chords
      var archPt = function (th) { var t = T_A0 + (T_A1 - T_A0) * Math.sin(th), a = -Math.cos(th) * (hw(t) - lw(t)); return [cx + a, Y(t)]; };
      (function () {
        var N = 22, pts = [], i;
        for (i = 0; i <= N; i++) {
          var th = Math.PI * i / N, q = archPt(th), q0 = archPt(Math.max(0, th - 0.02)), q1 = archPt(Math.min(Math.PI, th + 0.02));
          var tx = q1[0] - q0[0], ty = q1[1] - q0[1], n = Math.sqrt(tx * tx + ty * ty) || 1;
          pts.push([q[0], q[1], ty / n, -tx / n]);                     // a point of the inner edge and the way out from it
        }
        var ring = function (o0, o1) {
          var a = [], b = [];
          pts.forEach(function (e) { a.push(e[0] + e[2] * o0, e[1] + e[3] * o0); b.unshift(e[0] + e[2] * o1, e[1] + e[3] * o1); });
          add("o", a.concat(b));
        };
        ring(0, AC); ring(AD - AC, AD);
        for (i = 1; i < N; i++) { var e = pts[i]; bar("o", e[0] + e[2] * AC / 2, e[1] + e[3] * AC / 2, e[0] + e[2] * (AD - AC / 2), e[1] + e[3] * (AD - AC / 2), 2.6 * u); }
      })();
      [-0.64, -0.3, 0.3, 0.64].forEach(function (lam) {                                                              // the hangers that carry the arch
        var q = archPt(Math.acos(-lam));
        bar("o", q[0], q[1] - 6 * u, q[0], Y(T_G), 3.6 * u);
      });
      bar("o", cx - hw(T_G), Y(T_G), cx + hw(T_G), Y(T_G), 7.4 * u);                                                 // the girder over the arch
      cbox("oL", hw(T_G), Y(T_G) - 3.7 * u, 2.2 * u);
      // a panel: two corner posts, one X, the rail that closes it. sh = the height above which a deck puts its shade on it
      var panel = function (a, b, c, pw, xw, rail, sh, gus) {
        var parts = [];
        both(function (sd) { parts.push(strip(c, function (t) { return sd * hw(t); }, function (t) { return sd * (hw(t) - pw(t)); }, a, b, 3)); });
        var ea = hw(a) - pw(a) / 2, eb = hw(b) - pw(b) / 2;
        var P = [[cx - ea, Y(a), cx + eb, Y(b)], [cx + ea, Y(a), cx - eb, Y(b)]];
        P.forEach(function (q) { parts.push(bar(c, q[0], q[1], q[2], q[3], xw)); });
        if (sh) parts.forEach(function (q) { var s = above(q, Y(sh)); if (s.length > 4) add(c + "A", s); });
        if (rail) {
          bar(c, cx - hw(b), Y(b), cx + hw(b), Y(b), rail);
          if (c === "o") cbox("oL", hw(b), Y(b) - rail / 2, 1.6 * u);
        }
        if (gus) {                                                     // the gusset plate where the X crosses
          var A = P[0], B = P[1], d1x = A[2] - A[0], d1y = A[3] - A[1], d2x = B[2] - B[0], d2y = B[3] - B[1];
          var den = d1x * d2y - d1y * d2x, s = ((B[0] - A[0]) * d2y - (B[1] - A[1]) * d2x) / den, gx = A[0] + d1x * s, gy = A[1] + d1y * s;
          var n1 = Math.sqrt(d1x * d1x + d1y * d1y), n2 = Math.sqrt(d2x * d2x + d2y * d2y);
          add(c, [gx + d1x / n1 * gus, gy + d1y / n1 * gus, gx + d2x / n2 * gus, gy + d2y / n2 * gus, gx - d1x / n1 * gus, gy - d1y / n1 * gus, gx - d2x / n2 * gus, gy - d2y / n2 * gus]);
        }
      };
      for (j = 0; j < 3; j++) panel(JL[j], JL[j + 1], BL[j], PW, 4.8 * u, j < 2 ? 5.6 * u : 0, j === 2 ? T_D0 - (SOFF + 15 * u) / HT : 0, 7.5 * u);
      for (j = 0; j < 4; j++) panel(JU[j], JU[j + 1], BU[j], PU, 3.8 * u, j < 3 ? 4.6 * u : 0, j === 3 ? T_U1 - (SOFT + 9 * u) / HT : 0, 0);

      /* ---- above the top deck: the antenna drum, the banded mast stepping in with two collars, the needle, the lamp's lantern ---- */
      var T_M = 0.8, MB = [T_M, 0.823, 0.846, 0.869, 0.892, 0.915], MC = ["o", "w", "o", "w", "o"];
      cbox("w", 8.5 * u, Y(T_M), Y(T_U2) - Y(T_M));
      cbox("wA", 8.5 * u, Y(T_M) + (Y(T_U2) - Y(T_M)) * 0.42, 2.4 * u);
      for (j = 0; j < 5; j++) cbox(MC[j], (6.2 - j * 0.62) * u, Y(MB[j + 1]), Y(MB[j]) - Y(MB[j + 1]));
      [T_M, 0.869].forEach(function (t) { cbox("wA", 11 * u, Y(t) - 2.2 * u, 4.4 * u); });
      cbox("wA", 2.1 * u, Y(0.99), Y(0.915) - Y(0.99));
      cbox("wA", 3.6 * u, Y(0.99) - 1 * u, 3 * u);

      var paint = function (list) { return list.map(function (e) { return h("path", { d: lay[e[0]], fill: e[1] }); }); };
      var bx = r1(cx - 162 * u) + " " + r1(baseY - H - 8 * u) + " " + r1(324 * u) + " " + r1(H + 10 * u);
      m = _ttMemo[key] = {
        back: h("g", { "data-cache": "towerA-" + key, "data-box": bx }, paint([
          ["gSh", DAY.towerSteel], ["oS", DAY.towerOrangeShade], ["wS", DAY.towerWhiteShade],
          ["wall", DAY.towerStone], ["stB", DAY.towerSteel], ["stS", DAY.towerSteelShade],
          ["gl", DAY.towerGlass], ["sky", DAY.towerGlassSky], ["whB", DAY.towerWhite]])),
        front: h("g", { "data-cache": "towerB-" + key, "data-box": bx }, paint([
          ["o", DAY.towerOrange], ["w", DAY.towerWhite], ["oA", DAY.towerOrangeShade], ["wA", DAY.towerWhiteShade], ["oL", DAY.towerOrangeLit]])),
        glass: glassRows[0],                                           // the main deck's upper glazing: x0, y, x1, height
        liftY0: sty - 2.6 * u - 20 * u, liftY1: Y(T_D0) + SOFF + 1 * u, tipY: Y(0.99) - 3 * u
      };
    }
    var n1 = function (v) { return String(Math.round(v * 10) / 10); };
    // the lift, inside the lattice: twenty seconds a round trip, long soft starts and landings, a wait at each end
    var lt = ((time % 20) + 20) % 20, lk = lt < 2 ? 1 : lt < 9 ? 1 - (lt - 2) / 7 : lt < 12 ? 0 : lt < 19 ? (lt - 12) / 7 : 1;
    lk = lk * lk * lk * (lk * (6 * lk - 15) + 10);
    var ly = m.liftY0 + (m.liftY1 - m.liftY0) * lk;
    // the sky's reflection crossing the main deck's upper glazing, then a pause
    var g = m.glass, sk = (((time - 3.5) % 9) + 9) % 9 / 5, sx = g[0] - 26 * u + (g[2] - g[0] + 52 * u) * sk;
    var cl = function (v) { return n1(Math.max(g[0], Math.min(g[2], v))); };
    // the aviation lamp at the tip: a slow swell, never a blink
    var lamp = 0.5 - 0.5 * Math.cos(time * 2.1); lamp *= lamp;
    return h("g", { opacity: p.opacity == null ? 1 : p.opacity },
      m.back,
      h("polygon", { points: cl(sx + 6 * u) + "," + n1(g[1]) + " " + cl(sx + 22 * u) + "," + n1(g[1]) + " " + cl(sx + 16 * u) + "," + n1(g[1] + g[3]) + " " + cl(sx) + "," + n1(g[1] + g[3]), fill: "#ffffff", opacity: 0.34 }),
      h("g", { transform: "translate(" + n1(cx) + "," + n1(ly) + ")" },                      // the lift car: a white cab, its roof, one window
        h("rect", { x: n1(-7.5 * u), y: 0, width: n1(15 * u), height: n1(20 * u), fill: DAY.towerWhite }),
        h("rect", { x: n1(-7.5 * u), y: 0, width: n1(15 * u), height: n1(3.6 * u), fill: DAY.towerWhiteShade }),
        h("rect", { x: n1(-4 * u), y: n1(6.6 * u), width: n1(8 * u), height: n1(9 * u), fill: DAY.towerGlass })),
      m.front,
      h("circle", { cx: n1(cx), cy: n1(m.tipY), r: n1(3.4 * u), fill: DAY.towerLamp }),
      h("circle", { cx: n1(cx), cy: n1(m.tipY), r: n1(3.4 * u), fill: DAY.towerLampLit, opacity: lamp.toFixed(3) }));
  }
