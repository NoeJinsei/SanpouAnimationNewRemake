//== REPLACE from "  function TokyoTower(p) {" to "  /* ---- round 2 city, second pass: Tokyo as volumes, not cut-outs ----"
  DAY.towerOrange = "#e4553b";        // Tokyo Tower's own red-orange: the face toward the sun (nothing else uses it)
  DAY.towerOrangeLit = "#f08a6c";     // its sunlit edges
  DAY.towerOrangeShade = "#ab4a45";   // the faces away from the sun: orange pushed toward navy
  DAY.towerWhite = "#f5f8fc";         // white bands, deck panels, copings, footings
  DAY.towerWhiteShade = "#c6d3e9";    // white away from the sun: periwinkle
  DAY.towerStone = "#dde4ed";         // the podium's wall
  DAY.towerSteel = "#b3bfd1";         // roofs, skirts, the stone's shaded side, the contact shadow on the ground
  DAY.towerSteelShade = "#8693aa";    // soffits and undersides
  DAY.towerGlass = "#364b70";         // deck and podium glazing
  DAY.towerGlassSky = "#7c9ac5";      // the sky reflected across the top of a pane
  DAY.towerGlassShade = "#2a3b5b";    // glazing on a shaded face
  DAY.towerLamp = "#c23f2f";          // the aviation lamp, resting
  DAY.towerLampLit = "#ffc4b2";       // the aviation lamp, lit
  function TokyoTower(p) {
    var cx = p.cx, baseY = p.baseY, H = p.h, time = p.time || 0, u = H / 770;
    var key = cx + "|" + baseY + "|" + H, m = _ttMemo[key];
    if (!m) {
      var r1 = function (v) { return Math.round(v * 10) / 10; };
      var PLZ = 2 * u, HT = H - PLZ, HW0 = 115 * u, DEP = 0.2;         // ground in front of the feet; tower height; half width at the ground; the oblique
      var T_G = 0.2, T_D0 = 0.42, T_D1 = 0.478, T_U1 = 0.737, T_U2 = 0.768;    // girder; main deck; top deck
      var Y = function (t) { return baseY - PLZ - t * HT; };
      var hw = function (t) {                                          // half width of a face: a flare to the main deck, a straight taper above it
        if (t <= T_D0) return HW0 * Math.exp(-2.867 * t);
        if (t <= T_D1) return (34.5 - (t - T_D0) / (T_D1 - T_D0) * 3.5) * u;
        return (31 - Math.min(1, (t - T_D1) / (T_U1 - T_D1)) * 18) * u;
      };
      var sOf = function (t) { return 2 * DEP * hw(t); };              // how far left the far face sits
      var rise = function (t) { return 0.065 * (0.26 - t) * HT * hw(t) / HW0; };   // and how far toward the eye line (t = 0.26)
      var X = function (a, t, d) { return cx + sOf(t) * (0.5 - d) + a; };
      var Yd = function (t, d) { return Y(t) - rise(t) * d; };

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
      var strip = function (k, fa, fb, t0, t1, d, n) {                 // the area between two edges a = fa(t), a = fb(t) of a face
        var q = [], i, t;
        for (i = 0; i <= n; i++) { t = t0 + (t1 - t0) * i / n; q.push(X(fa(t), t, d), Yd(t, d)); }
        for (i = n; i >= 0; i--) { t = t0 + (t1 - t0) * i / n; q.push(X(fb(t), t, d), Yd(t, d)); }
        add(k, q); return q;
      };
      var above = function (q, yc) {                                   // the part of a shape above the line y = yc (a shadow's straight edge)
        var o = [], n = q.length, i;
        for (i = 0; i < n; i += 2) {
          var x0 = q[i], y0 = q[i + 1], x1 = q[(i + 2) % n], y1 = q[(i + 3) % n], in0 = y0 <= yc, in1 = y1 <= yc;
          if (in0) o.push(x0, y0);
          if (in0 !== in1) o.push(x0 + (x1 - x0) * (yc - y0) / (y1 - y0), yc);
        }
        return o;
      };

      /* ---- the ground under the tower: one flat contact shadow, falling a little to the left; the feet and the podium stand on it ---- */
      var GA = HW0 + 10 * u, gL = X(-GA, 0, 1) - 12 * u;
      add("gSh", [gL, baseY, X(GA, 0, -0.14), baseY, X(GA, 0, 1.1), Yd(0, 1.1), gL, Yd(0, 1.1)]);

      /* ---- a leg: a lattice column from its footing to the girder (X bracing on the near pair, a quieter zigzag on the far pair) ---- */
      var lw = function (t) { return (40 - 70 * t) * u; }, CO = 8 * u, CI = 6.4 * u, T_F = 0.016;
      var LJ = [T_F, 0.08, 0.14, T_G];
      var leg = function (k, sd, d, zig) {
        strip(k, function (t) { return sd * hw(t); }, function (t) { return sd * (hw(t) - CO); }, T_F, T_G, d, 6);
        strip(k, function (t) { return sd * (hw(t) - lw(t)); }, function (t) { return sd * (hw(t) - lw(t) + CI); }, T_F, T_G, d, 6);
        for (var j = 0; j < 3; j++) {
          var a = LJ[j], b = LJ[j + 1];
          var oa = sd * (hw(a) - CO / 2), ob = sd * (hw(b) - CO / 2), ia = sd * (hw(a) - lw(a) + CI / 2), ib = sd * (hw(b) - lw(b) + CI / 2);
          if (!zig || j % 2 === 0) bar(k, X(oa, a, d), Yd(a, d), X(ib, b, d), Yd(b, d), zig ? 3.6 * u : 3.4 * u);
          if (!zig || j % 2 === 1) bar(k, X(ia, a, d), Yd(a, d), X(ob, b, d), Yd(b, d), zig ? 3.6 * u : 3.4 * u);
          bar(k, X(oa, a, d), Yd(a, d), X(ia, a, d), Yd(a, d), 3.6 * u);
        }
      };
      var footing = function (kb, ks, sd, d) {                         // splayed concrete under a leg, its left side in shade
        var o0 = sd * (hw(0) + 8 * u), i0 = sd * (hw(0) - lw(0) - 8 * u), o1 = sd * (hw(T_F) + 2.5 * u), i1 = sd * (hw(T_F) - lw(T_F) - 2.5 * u);
        var l0 = Math.min(o0, i0), r0 = Math.max(o0, i0), l1 = Math.min(o1, i1), r1b = Math.max(o1, i1);
        add(kb, [X(l0, 0, d), Yd(0, d), X(r0, 0, d), Yd(0, d), X(r1b, T_F, d), Yd(T_F, d), X(l1, T_F, d), Yd(T_F, d)]);
        if (ks) add(ks, [X(l0, 0, d), Yd(0, d), X(l0 + 10 * u, 0, d), Yd(0, d), X(l1 + 6 * u, T_F, d), Yd(T_F, d), X(l1, T_F, d), Yd(T_F, d)]);
      };
      /* ---- an arch framed between two legs: a band with thickness, its soffit a tone down, its sunward top edge lit ---- */
      var T_A0 = 0.078, T_A1 = 0.168;
      var archPt = function (th, d) { var t = T_A0 + (T_A1 - T_A0) * Math.sin(th), a = -Math.cos(th) * (hw(t) - lw(t)); return [X(a, t, d), Yd(t, d)]; };
      var arch = function (k, ks, d, thick, soff, kl) {
        var N = 26, inn = [], out = [], sof = [], lit = [], i, i0 = 14, i1 = 21;
        for (i = 0; i <= N; i++) {
          var th = Math.PI * i / N, q = archPt(th, d), q0 = archPt(Math.max(0, th - 0.02), d), q1 = archPt(Math.min(Math.PI, th + 0.02), d);
          var tx = q1[0] - q0[0], ty = q1[1] - q0[1], n = Math.sqrt(tx * tx + ty * ty) || 1, nx = ty / n, ny = -tx / n;
          inn.push(q[0], q[1]); out.unshift(q[0] + nx * thick, q[1] + ny * thick); sof.unshift(q[0] + nx * soff, q[1] + ny * soff);
          if (i >= i0 && i <= i1) lit.push(q[0] + nx * (thick - 2.4 * u), q[1] + ny * (thick - 2.4 * u));
        }
        add(k, inn.concat(out));
        if (ks) add(ks, inn.concat(sof));
        if (kl) add(kl, lit.concat(out.slice(2 * (N - i1), 2 * (N - i0 + 1))));
      };

      /* ---- the far face and what is seen through the near one: all one tone down ---- */
      [-1, 1].forEach(function (sd) { leg("oS", sd, 1, true); footing("wall", sd < 0 ? "stS" : null, sd, 1); });
      arch("oS", null, 1, 6.5 * u, 0);
      bar("oS", X(-hw(T_G), T_G, 1), Yd(T_G, 1), X(hw(T_G), T_G, 1), Yd(T_G, 1), 7 * u);
      var PW = function (t) { return (12 - 11 * (t - T_G)) * u; };                       // corner posts below the main deck
      var PU = function (t) { return (7.4 - 7 * (t - T_D1)) * u; };                      // and above it
      var JL = [T_G, 0.288, 0.345, T_D0], BL = ["o", "w", "o"];                          // panels and their bands, girder to main deck
      var JU = [T_D1, 0.5425, 0.607, 0.672, T_U1], BU = ["o", "w", "o", "w"];            // main deck to top deck
      var farPanel = function (a, b, c, pw, core, rung) {              // far corner posts, the rung that shows on the left face, the lift shaft
        [-1, 1].forEach(function (sd) { strip(c + "S", function (t) { return sd * hw(t); }, function (t) { return sd * (hw(t) - pw(t) * 0.82); }, a, b, 1, 3); });
        if (rung) bar(c + "S", X(-hw(b), b, 1), Yd(b, 1), X(hw(b), b, 1), Yd(b, 1), rung);
        strip(c + "S", function () { return -core; }, function () { return core; }, a, b, 0.5, 1);
      };
      for (var j = 0; j < 3; j++) farPanel(JL[j], JL[j + 1], BL[j], PW, 3 * u, j < 2 ? 4.4 * u : 0);
      for (j = 0; j < 4; j++) farPanel(JU[j], JU[j + 1], BU[j], PU, 2.1 * u, j < 3 ? 3.8 * u : 0);
      strip("oS", function () { return -3 * u; }, function () { return 3 * u; }, 0.07, T_G, 0.5, 1);                // the lift shaft, below the girder

      /* ---- the podium: the low building under the tower, between the legs (no lettering) ---- */
      var S0 = sOf(0), R0 = rise(0), PHW = 66 * u, PH = 46 * u, PD0 = 0.26, PD1 = 0.78;
      var px = function (d) { return cx + S0 * (0.5 - d) - PHW; };                                                   // its left wall, at depth d
      var py = function (hh, d) { return Y(0) - hh - R0 * d * (1 - hh / (0.26 * HT)); };
      var pl = px(PD0), pr = pl + 2 * PHW, pb = py(0, PD0), pt = py(PH, PD0);
      add("stB", [px(PD1), py(PH, PD1), pl, pt, pl, pb, px(PD1), py(0, PD1)]);                                       // left return
      box("wall", pl, pt, pr - pl, pb - pt);
      box("whB", pl - 2.5 * u, pt - 1 * u, pr - pl + 5 * u, 5.5 * u);                                                // coping
      box("stB", pl, pt + 4.5 * u, pr - pl, 2.8 * u);                                                                // and its shade on the wall
      var wy = pt + 12 * u, wh2 = 11.5 * u, wx0 = pl + 8 * u, wx1 = pr - 8 * u;
      box("gl", wx0, wy, wx1 - wx0, wh2); box("sky", wx0, wy, wx1 - wx0, 4.2 * u);                                   // upper floor: one ribbon of glass
      for (j = 1; j < 6; j++) box("whB", wx0 + (wx1 - wx0) * j / 6 - 1.5 * u, wy, 3 * u, wh2);
      var cy2 = pt + 28.5 * u, ex0 = (pl + pr) / 2 - 36 * u;
      box("gl", ex0, cy2, 72 * u, 5.5 * u); box("sky", ex0, cy2 + 5.5 * u, 72 * u, pb - cy2 - 5.5 * u);              // the glazed entrance, the canopy's shade across its top
      for (j = 1; j < 4; j++) box("whB", ex0 + 72 * u * j / 4 - 1.5 * u, cy2, 3 * u, pb - cy2);
      box("whB", pl - 3 * u, cy2 - 3.8 * u, pr - pl + 6 * u, 3.8 * u);                                               // canopy
      box("stB", pl, cy2, ex0 - pl, 2.6 * u); box("stB", ex0 + 72 * u, cy2, pr - ex0 - 72 * u, 2.6 * u);
      var stx = cx - 10 * u, sty = pt - 1 * u - 12 * u;                                                              // where the lift shaft meets the roof
      box("wall", stx, sty, 20 * u, 12 * u); box("stB", stx, sty, 6 * u, 12 * u); box("whB", stx - 1.5 * u, sty - 2.6 * u, 23 * u, 2.6 * u);

      /* ---- the decks: square boxes on the tower's axis. Front face, left return a tone down, soffit tapering in to the lattice ---- */
      var glassRows = [];
      var deck = function (tb, tt, half, rows, panes, soffH) {
        var dep = 2 * DEP * half, fall = dep * 0.2, x0 = cx + dep / 2 - half, x1 = x0 + 2 * half, xb = x0 - dep;
        var y = Y(tt), tot = Y(tb) - Y(tt), sum = 0;
        rows.forEach(function (r) { sum += r[0]; });
        rows.forEach(function (r) {
          var hh = r[0] / sum * tot, kd = r[1];
          var kf = kd === "g" ? "gl" : kd === "w" ? "whB" : "stB", kr = kd === "g" ? "glS" : kd === "w" ? "wS" : "stS";
          box(kf, x0, y, 2 * half, hh);
          add(kr, [xb, y + fall, x0, y, x0, y + hh, xb, y + hh + fall]);
          if (kd === "r") { box("whB", x0 - 1.5 * u, y, 2 * half + 3 * u, 2.6 * u); add("wS", [xb - 1.5 * u, y + fall, x0 - 1.5 * u, y, x0 - 1.5 * u, y + 2.6 * u, xb - 1.5 * u, y + 2.6 * u + fall]); }
          if (kd === "g") {
            box("sky", x0, y, 2 * half, hh * 0.36);
            for (var i = 1; i < panes; i++) box("w", x0 + i * 2 * half / panes - 1.6 * u, y, 3.2 * u, hh);          // mullions: in front of the moving reflection
            box("w", x1 - 4 * u, y, 4 * u, hh); box("w", x0, y, 3.2 * u, hh);
            box("wS", xb + dep / 2 - 1.5 * u, y + fall / 2, 3 * u, hh);
            glassRows.push([x0 + 3.2 * u, y, x1 - 4 * u, hh]);
          }
          y += hh;
        });
        var tS = tb - soffH / HT;
        add("stS", [xb + dep * 0.55, Y(tb) + fall * 0.45, x1 - 8 * u, Y(tb), X(hw(tS), tS, 0) + 2 * u, Y(tS), X(-hw(tS), tS, 1) - 2 * u, Y(tS)]);
      };
      var SOFF = 10 * u, SOFT = 6 * u;
      deck(T_D0, T_D1, 60 * u, [[6, "r"], [13, "g"], [7, "w"], [11, "g"], [6, "s"]], 8, SOFF);
      deck(T_U1, T_U2, 20 * u, [[4.5, "r"], [10, "g"], [5, "s"]], 4, SOFT);

      /* ---- the near face: the base colour, its right edges lit ---- */
      [-1, 1].forEach(function (sd) { leg("o", sd, 0, false); footing("w", "wA", sd, 0); });
      strip("oL", function (t) { return hw(t) - 2.4 * u; }, function (t) { return hw(t); }, T_F, T_G, 0, 6);
      strip("oL", function (t) { return -(hw(t) - lw(t)) - 2.2 * u; }, function (t) { return -(hw(t) - lw(t)); }, T_F, T_A0, 0, 3);
      arch("o", "oA", 0, 11 * u, 4 * u, "oL");
      [-0.64, -0.3, 0.3, 0.64].forEach(function (lam) {                                                              // the hangers that carry the arch
        var q = archPt(Math.acos(-lam), 0);
        bar("o", q[0], q[1] - 6 * u, q[0], Y(T_G), 3.6 * u);
      });
      bar("o", X(-hw(T_G), T_G, 0), Y(T_G), X(hw(T_G), T_G, 0), Y(T_G), 7.4 * u);                                    // the girder over the arch
      box("oL", X(-hw(T_G), T_G, 0), Y(T_G) - 3.7 * u, 2 * hw(T_G), 2.2 * u);
      // a panel: two corner posts, one X, the rail that closes it. sh = the height above which a deck throws its shadow on it
      var nearPanel = function (a, b, c, pw, xw, rail, sh, gus) {
        var parts = [];
        [-1, 1].forEach(function (sd) { parts.push(strip(c, function (t) { return sd * hw(t); }, function (t) { return sd * (hw(t) - pw(t)); }, a, b, 0, 3)); });
        if (c === "o") strip("oL", function (t) { return hw(t) - 2.4 * u; }, function (t) { return hw(t); }, a, sh || b, 0, 3);
        var ea = hw(a) - pw(a) / 2, eb = hw(b) - pw(b) / 2;
        var P = [[X(-ea, a, 0), Y(a), X(eb, b, 0), Y(b)], [X(ea, a, 0), Y(a), X(-eb, b, 0), Y(b)]];
        P.forEach(function (q) { parts.push(bar(c, q[0], q[1], q[2], q[3], xw)); });
        if (sh) parts.forEach(function (q) { var s = above(q, Y(sh)); if (s.length > 4) add(c + "A", s); });
        if (rail) bar(c, X(-hw(b), b, 0), Y(b), X(hw(b), b, 0), Y(b), rail);
        if (gus) {                                                     // the gusset plate where the X crosses
          var A = P[0], B = P[1], d1x = A[2] - A[0], d1y = A[3] - A[1], d2x = B[2] - B[0], d2y = B[3] - B[1];
          var den = d1x * d2y - d1y * d2x, s = ((B[0] - A[0]) * d2y - (B[1] - A[1]) * d2x) / den, gx = A[0] + d1x * s, gy = A[1] + d1y * s;
          var n1 = Math.sqrt(d1x * d1x + d1y * d1y), n2 = Math.sqrt(d2x * d2x + d2y * d2y);
          add(c, [gx + d1x / n1 * gus, gy + d1y / n1 * gus, gx + d2x / n2 * gus, gy + d2y / n2 * gus, gx - d1x / n1 * gus, gy - d1y / n1 * gus, gx - d2x / n2 * gus, gy - d2y / n2 * gus]);
        }
      };
      for (j = 0; j < 3; j++) nearPanel(JL[j], JL[j + 1], BL[j], PW, 4.8 * u, j < 2 ? 5.6 * u : 0, j === 2 ? T_D0 - (SOFF + 15 * u) / HT : 0, 7.5 * u);
      for (j = 0; j < 4; j++) nearPanel(JU[j], JU[j + 1], BU[j], PU, 3.8 * u, j < 3 ? 4.6 * u : 0, j === 3 ? T_U1 - (SOFT + 9 * u) / HT : 0, 0);

      /* ---- above the top deck: the antenna drum, the banded mast with two collars, the needle, the lamp's lantern ---- */
      var T_M = 0.8, MB = [T_M, 0.823, 0.846, 0.869, 0.892, 0.915], MC = ["o", "w", "o", "w", "o"];
      var mh = function (t) { return (6.4 - (t - T_M) / 0.115 * 2.8) * u; };
      box("w", cx - 8.5 * u, Y(T_M), 17 * u, Y(T_U2) - Y(T_M)); box("wA", cx - 8.5 * u, Y(T_M), 5.6 * u, Y(T_U2) - Y(T_M));
      for (j = 0; j < 5; j++) {
        var ma = MB[j], mb = MB[j + 1];
        add(MC[j], [cx - mh(ma), Y(ma), cx + mh(ma), Y(ma), cx + mh(mb), Y(mb), cx - mh(mb), Y(mb)]);
        add(MC[j] + "A", [cx - mh(ma), Y(ma), cx - mh(ma) * 0.3, Y(ma), cx - mh(mb) * 0.3, Y(mb), cx - mh(mb), Y(mb)]);
      }
      [T_M, 0.869].forEach(function (t) { box("wA", cx - 11 * u, Y(t) - 2.2 * u, 22 * u, 4.4 * u); });
      add("wA", [cx - 2.5 * u, Y(0.915), cx + 2.5 * u, Y(0.915), cx + 1.7 * u, Y(0.99), cx - 1.7 * u, Y(0.99)]);
      box("wA", cx - 3.6 * u, Y(0.99) - 1 * u, 7.2 * u, 3 * u);

      var paint = function (list) { return list.map(function (e) { return h("path", { d: lay[e[0]], fill: e[1] }); }); };
      var bx = r1(cx - 162 * u) + " " + r1(baseY - H - 8 * u) + " " + r1(324 * u) + " " + r1(H + 10 * u);
      m = _ttMemo[key] = {
        back: h("g", { "data-cache": "towerA-" + key, "data-box": bx }, paint([
          ["gSh", DAY.towerSteel], ["oS", DAY.towerOrangeShade], ["wS", DAY.towerWhiteShade],
          ["wall", DAY.towerStone], ["stB", DAY.towerSteel], ["stS", DAY.towerSteelShade],
          ["glS", DAY.towerGlassShade], ["gl", DAY.towerGlass], ["sky", DAY.towerGlassSky], ["whB", DAY.towerWhite]])),
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
      h("g", { transform: "translate(" + n1(cx) + "," + n1(ly) + ")" },
        h("rect", { x: n1(-7.5 * u), y: 0, width: n1(15 * u), height: n1(20 * u), fill: DAY.towerWhite }),
        h("rect", { x: n1(-7.5 * u), y: 0, width: n1(4 * u), height: n1(20 * u), fill: DAY.towerWhiteShade }),
        h("rect", { x: n1(-2 * u), y: n1(4 * u), width: n1(7.4 * u), height: n1(9 * u), fill: DAY.towerGlass })),
      m.front,
      h("circle", { cx: n1(cx), cy: n1(m.tipY), r: n1(3.4 * u), fill: DAY.towerLamp }),
      h("circle", { cx: n1(cx), cy: n1(m.tipY), r: n1(3.4 * u), fill: DAY.towerLampLit, opacity: lamp.toFixed(3) }));
  }
//== REPLACE from "  /* Tokyo Tower, redrawn for round 2 (same place and height)." to "  var _ttMemo = {};"
  /* Tokyo Tower, round 3: drawn again from a blank page as the structure it is, in the city's one oblique
     (the near face square to the picture, the far face behind it to the left and a tone down).
     - The ground: one flat contact shadow; four splayed footings; the low podium building that stands
       under the tower, between the legs.
     - FOUR legs, each an open lattice column (two chords, bracing, struts). The near pair stands in
       front of the podium, the far pair rises behind it. An arch with thickness, a shaded soffit and a
       lit top edge is framed between the near legs and hung from the girder; the far arch shows behind.
     - Above the girder: corner posts, one big X per panel with a gusset where it crosses, the lift
       shaft up the middle.
     - The two-storey main deck and the small top deck are boxes with glazing, a lit end, a shaded
       return, and a shadow thrown on the lattice under them; then the antenna drum, the banded mast,
       the needle and its lamp.
     - Orange and white bands run over the whole height. Light is per FACE: everything on the near face
       is the base colour (its right edges lit), everything on the far and left faces is one tone down
       (orange pushed toward navy, white toward periwinkle).
     Coordinates: t = height as a fraction of the tower, a = px right of a face's centre line,
     d = depth (0 the near face, 1 the far face). Same props, place, height and footprint as before.
     Two cached groups, with the moving parts between and after them, all pure functions of p.time:
     a reflection crossing the main deck's glass, the lift car riding inside the lattice between the
     podium roof and the main deck, the aviation lamp at the tip. */
