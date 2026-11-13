//== REPLACE from "  function TokyoTower(p) {" to "  /* ---- round 2 city: a kit of Tokyo buildings"
  /* Tokyo Tower, redrawn for round 2 (same place and height). Built as the structure is, bottom to top:
     four legs flaring to the ground with the arch between them and a girder over it; three braced panels
     up to the main deck; the two-storey main deck; five braced panels tapering to the top deck, painted
     in bands of international orange and white; the top deck; the banded mast with its antenna bars; the
     needle. One light, sun top right: the left members and the far face of the lattice are a tone down
     (orange pushed toward navy, white toward periwinkle), the right members carry the light.
     t = height above the ground as a fraction of the whole tower. Static except the beacon at the tip. */
  var _ttMemo = {};
  function TokyoTower(p) {
    var cx = p.cx, baseY = p.baseY, H = p.h, time = p.time || 0, u = H / 770;
    var key = cx + "|" + baseY + "|" + H;
    if (!_ttMemo[key]) {
      var r1 = function (v) { return Math.round(v * 10) / 10; };
      var Y = function (t) { return baseY - t * H; };
      var hwL = function (t) { return 137 * u * Math.exp(-2.72 * t); };                       // the legs: a flare
      var hwU = function (t) { return (40 - (t - 0.455) / 0.265 * 25.5) * u; };               // above the deck: a straight taper
      var RED = "#e4553b", REDS = mix(RED, "#1d3156", 0.3), REDL = mix(RED, "#ffffff", 0.2);
      var WHT = "#f4f7fb", WHTS = "#c9d6e8", GRY = "#b4bfcc", GRYS = "#8793a5", GLS = "#34445e";
      var F = { red: "", reds: "", redl: "", wht: "", whts: "", gry: "", grys: "", gls: "" }, S = { red: "", reds: "", wht: "", whts: "" };
      var poly = function (k, pts) { F[k] += "M" + pts.map(function (q) { return r1(q[0]) + "," + r1(q[1]); }).join("L") + "z"; };
      var rect = function (k, x, y, w, hh) { poly(k, [[x, y], [x + w, y], [x + w, y + hh], [x, y + hh]]); };
      var seg = function (k, x0, y0, x1, y1) { S[k] += "M" + r1(x0) + "," + r1(y0) + "L" + r1(x1) + "," + r1(y1); };

      // legs: two solid members that flare, the left in shade, the right in the sun with a lit edge
      var tl = [0, 0.05, 0.11, 0.2, 0.275, 0.34, 0.4], wl = function (t) { return (22 - 24 * t) * u; };
      [-1, 1].forEach(function (sd) {
        var outer = tl.map(function (t) { return [cx + sd * hwL(t), Y(t)]; }), inner = tl.map(function (t) { return [cx + sd * (hwL(t) - wl(t)), Y(t)]; });
        poly(sd < 0 ? "reds" : "red", outer.concat(inner.reverse()));
        if (sd > 0) poly("redl", tl.map(function (t) { return [cx + hwL(t), Y(t)]; }).concat(tl.slice().reverse().map(function (t) { return [cx + hwL(t) - 4.2 * u, Y(t)]; })));
        rect("reds", cx + sd * 137 * u - (sd < 0 ? 5 : 27) * u, baseY - 7 * u, 32 * u, 7 * u);
      });
      // the arch between the legs, the girder over it, and the struts that hang it from the girder
      var ax = 116 * u, apex = Y(0.185), gy = Y(0.2);
      for (var k = -3; k <= 3; k++) { var dx = k * 26 * u; seg("reds", cx + dx, gy, cx + dx, apex + 0.185 * H * Math.pow(Math.abs(dx) / ax, 2.3)); }
      rect("red", cx - hwL(0.2), gy - 3 * u, hwL(0.2) * 2, 6.4 * u);
      // braced panels from the girder up to the main deck: the far face first, then the near face
      var panel = function (t0, t1, hw, front, back) {
        var a = hw(t0), b = hw(t1), y0 = Y(t0), y1 = Y(t1), ym = (y0 + y1) / 2;
        seg(back, cx, y0, cx, y1); seg(back, cx - (a + b) / 2 + 3 * u, ym, cx + (a + b) / 2 - 3 * u, ym);
        seg(front, cx - a + 3 * u, y0, cx + b - 3 * u, y1); seg(front, cx + a - 3 * u, y0, cx - b + 3 * u, y1);
        seg(front, cx - b, y1, cx + b, y1);
      };
      [[0.2, 0.275], [0.275, 0.34], [0.34, 0.4]].forEach(function (q) { panel(q[0], q[1], hwL, "red", "reds"); });

      // above the main deck: five panels, bottom to top orange, orange, white, white, orange
      var tu = [0.455, 0.508, 0.561, 0.614, 0.667, 0.72], band = ["red", "red", "wht", "wht", "red"];
      for (var i = 0; i < 5; i++) {
        var t0 = tu[i], t1 = tu[i + 1], c = band[i], cs = c + "s", ew = 6.4 * u;
        panel(t0, t1, hwU, c, cs);
        poly(cs, [[cx - hwU(t0), Y(t0)], [cx - hwU(t1), Y(t1)], [cx - hwU(t1) + ew, Y(t1)], [cx - hwU(t0) + ew, Y(t0)]]);
        poly(c, [[cx + hwU(t0), Y(t0)], [cx + hwU(t1), Y(t1)], [cx + hwU(t1) - ew, Y(t1)], [cx + hwU(t0) - ew, Y(t0)]]);
      }

      // main deck: roof, upper windows, a white band, lower windows, the skirt; its left end in shade
      var dT = Y(0.455), dw = 72 * u;
      poly("grys", [[cx - 52 * u, dT + 42 * u], [cx + 52 * u, dT + 42 * u], [cx + 44 * u, dT + 52 * u], [cx - 44 * u, dT + 52 * u]]);
      rect("gry", cx - dw - 2 * u, dT, dw * 2 + 4 * u, 8 * u);
      rect("gls", cx - dw, dT + 8 * u, dw * 2, 13 * u);
      rect("wht", cx - dw, dT + 21 * u, dw * 2, 7 * u);
      rect("gls", cx - dw, dT + 28 * u, dw * 2, 9 * u);
      rect("gry", cx - dw, dT + 37 * u, dw * 2, 6 * u);
      for (var m = 1; m < 9; m++) rect("gry", cx - dw + m * dw * 2 / 9 - 1.7 * u, dT + 8 * u, 3.4 * u, 13 * u);
      rect("grys", cx - dw - 2 * u, dT, 16 * u, 8 * u); rect("whts", cx - dw, dT + 21 * u, 14 * u, 7 * u); rect("grys", cx - dw, dT + 37 * u, 14 * u, 6 * u);

      // top deck, the banded mast with its antenna bars, the needle
      var tdT = Y(0.742);
      rect("gry", cx - 25 * u, tdT, 50 * u, 6 * u); rect("gls", cx - 23 * u, tdT + 6 * u, 46 * u, 6 * u); rect("grys", cx - 20 * u, tdT + 12 * u, 40 * u, 5 * u);
      var tm = [0.742, 0.776, 0.808, 0.84, 0.872], mw = function (t) { return (8.6 - (t - 0.742) / 0.13 * 3.2) * u; }, mc = ["wht", "red", "wht", "red"];
      for (var j = 0; j < 4; j++) {
        var a0 = mw(tm[j]), a1 = mw(tm[j + 1]), y0 = Y(tm[j]), y1 = Y(tm[j + 1]);
        poly(mc[j], [[cx - a0, y0], [cx + a0, y0], [cx + a1, y1], [cx - a1, y1]]);
        poly(mc[j] + "s", [[cx - a0, y0], [cx - a0 * 0.3, y0], [cx - a1 * 0.3, y1], [cx - a1, y1]]);
      }
      [0.79, 0.824, 0.856].forEach(function (t) { rect("gry", cx - 17 * u, Y(t), 34 * u, 3.6 * u); });
      poly("gry", [[cx - 3 * u, Y(0.872)], [cx + 3 * u, Y(0.872)], [cx + 1.5 * u, Y(1)], [cx - 1.5 * u, Y(1)]]);

      var sw = r1(4 * u), kids = [];
      ["reds", "whts"].forEach(function (k2) { kids.push(h("path", { d: S[k2], fill: "none", stroke: k2 === "reds" ? REDS : WHTS, strokeWidth: r1(3.4 * u) })); });
      kids.push(h("path", { d: F.reds, fill: REDS }), h("path", { d: F.whts, fill: WHTS }));
      kids.push(h("path", { d: S.red, fill: "none", stroke: RED, strokeWidth: sw }), h("path", { d: S.wht, fill: "none", stroke: WHT, strokeWidth: sw }));
      kids.push(h("path", { d: "M" + r1(cx - ax) + "," + r1(baseY) + "C" + r1(cx - ax) + "," + r1(Y(0.12)) + " " + r1(cx - 52 * u) + "," + r1(apex) + " " + r1(cx) + "," + r1(apex) + "C" + r1(cx + 52 * u) + "," + r1(apex) + " " + r1(cx + ax) + "," + r1(Y(0.12)) + " " + r1(cx + ax) + "," + r1(baseY), fill: "none", stroke: RED, strokeWidth: r1(7 * u) }));
      kids.push(h("path", { d: F.red, fill: RED }), h("path", { d: F.redl, fill: REDL }), h("path", { d: F.wht, fill: WHT }),
        h("path", { d: F.gls, fill: GLS }), h("path", { d: F.gry, fill: GRY }), h("path", { d: F.grys, fill: GRYS }));
      _ttMemo[key] = h("g", { "data-cache": "tower-" + key, "data-box": r1(cx - 145 * u) + " " + r1(baseY - H - 2) + " " + r1(290 * u) + " " + r1(H + 4) }, kids);
    }
    var blink = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(time * Math.PI));
    return h("g", { opacity: p.opacity == null ? 1 : p.opacity },
      _ttMemo[key],
      h("circle", { cx: cx, cy: baseY - H, r: (3 * u).toFixed(1), fill: "#ffb3a0", opacity: blink.toFixed(3) }));
  }

