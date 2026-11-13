//== REPLACE from "  var SUPPLIER_W = 340, SUPPLIER_DOCK" to "  function makeSkylineTier(seed, span, opt) {"
  var SUPPLIER_W = 340, SUPPLIER_DOCK = { x: 252, y: -22 };
  /* The supplier's building, round 2 (same place, width, height and dock point as before).
     Colours: blue-grey for a third party's building; each surface has a light / base / shade set. */
  DAY.supInk = "#26344f"; DAY.supRoof = "#1f2c47"; DAY.supRoofLip = "#3a4d74";
  DAY.supWall = "#9db1ce"; DAY.supWallLight = "#bccbe0"; DAY.supWallShade = "#7a8fb4";
  DAY.supBand = "#5f79a5"; DAY.supBandShade = "#4c6591";
  DAY.supPlinth = "#566b91"; DAY.supPlinthLight = "#6f85aa"; DAY.supPlinthShade = "#465a7f";
  DAY.supFrame = "#4c6187"; DAY.supFrameShade = "#3f5378";
  DAY.supGlass = "#c6dcf1"; DAY.supGlassHi = "#e6f1fb"; DAY.supGlassShade = "#a3bddb";
  DAY.supWarmHi = "#ffeabf"; DAY.supWarmShade = "#f0c275";
  DAY.supBlind = "#f1f5fa"; DAY.supBlindShade = "#d3dde9";
  DAY.supSill = "#c4d1e3"; DAY.supSillShade = "#a5b6cf";
  DAY.supPlate = "#eaf1f9"; DAY.supPlateShade = "#c9d7e9"; DAY.supBar1 = "#60789b"; DAY.supBar1Shade = "#506789"; DAY.supBar2 = "#8ea4bf"; DAY.supBar2Shade = "#7a90ad";
  DAY.supSteel = "#ced8e6"; DAY.supSteelLine = "#b4c1d5"; DAY.supSteelShade = "#aebbd0"; DAY.supSteelLineShade = "#98a8c1";
  DAY.supSteelBar = "#95a6c0"; DAY.supSteelBarShade = "#8091ad";
  DAY.supDoor = "#566c92"; DAY.supDoorShade = "#475b80"; DAY.supDoorKick = "#8799b6";
  DAY.supCanopy = "#2a3a59"; DAY.supCanopyLip = "#44587f"; DAY.supCanopyUnder = "#1f2c47";
  DAY.supDock = "#7388ab"; DAY.supRubber = "#1a2434";
  DAY.supPale = "#e6edf5"; DAY.supPaleShade = "#c6d2e2";
  DAY.supPlant = "#8397b8"; DAY.supPlantLight = "#a3b5cf"; DAY.supPlantShade = "#6c81a5"; DAY.supRail = "#3d4f72"; DAY.supRailPale = "#5a6f95";
  DAY.supSafety = "#f2c14e"; DAY.supSafetyShade = "#d8a53a";
  DAY.supPallet = "#4f73b3"; DAY.supPalletDark = "#3d5b93";
  DAY.supCarton = "#d9dfe8"; DAY.supCartonShade = "#c1cad8"; DAY.supPaperShade = "#dfe6ef";
  DAY.supGroundShade = "#a9b1bc";

  // A cast shadow is one flat polygon. What it covers on a surface is that polygon clipped to the surface and
  // filled with the surface's own shade tone, so every material it crosses steps exactly one tone down.
  function _clipPoly(poly, x0, y0, x1, y1) {
    function cut(pts, inside, isect) {
      var o = [];
      for (var i = 0; i < pts.length; i++) {
        var a = pts[i], b = pts[(i + 1) % pts.length], ia = inside(a), ib = inside(b);
        if (ia) o.push(a);
        if (ia !== ib) o.push(isect(a, b));
      }
      return o;
    }
    function ix(X) { return function (a, b) { return [X, a[1] + (b[1] - a[1]) * (X - a[0]) / (b[0] - a[0])]; }; }
    function iy(Y) { return function (a, b) { return [a[0] + (b[0] - a[0]) * (Y - a[1]) / (b[1] - a[1]), Y]; }; }
    var q = cut(poly, function (v) { return v[0] >= x0; }, ix(x0));
    if (q.length) q = cut(q, function (v) { return v[0] <= x1; }, ix(x1));
    if (q.length) q = cut(q, function (v) { return v[1] >= y0; }, iy(y0));
    if (q.length) q = cut(q, function (v) { return v[1] <= y1; }, iy(y1));
    return q;
  }
  function _polyD(q) {
    if (q.length < 3) return "";
    var d = "";
    for (var i = 0; i < q.length; i++) d += (i ? "L" : "M") + Math.round(q[i][0] * 10) / 10 + "," + Math.round(q[i][1] * 10) / 10;
    return d + "Z";
  }

  /* Local units, ground at y 278, wall 0..340 wide (x 1.9 on screen). A two-storey office-over-dock building:
     three pilasters make two bays (office on the left, dock on the right), a floor band, a plinth, a fascia
     under a dark coping, plant on the roof. One sun, top right: everything proud of the wall throws a flat
     shadow down and to the left. Static, so it is built once. */
  var _supMemo = {};
  function SupplierBuilding(p) {
    var x = p.x, y = p.y, scale = p.scale == null ? 1.9 : p.scale, mk = x + "|" + y + "|" + scale;
    if (_supMemo[mk]) return _supMemo[mk];
    var D = DAY, out = [], last = [];
    var G = 278, W = SUPPLIER_W, TOP = 67, FL = 166, GF = 174, PL = 262;   // ground, width, wall top, floor band top, ground-storey top, plinth top
    var SL = 1;                                                            // a cast shadow runs this far left per unit down
    function R(rx0, ry0, w, hh, fill, rr) { return h("rect", { x: rx0, y: ry0, width: w, height: hh, rx: rr, fill: fill }); }
    function rd(rx0, ry0, w, hh) { return "M" + rx0 + "," + ry0 + "h" + w + "v" + hh + "h" + (-w) + "z"; }
    function band(xa, xb) { return [[xa, TOP], [xb, TOP], [xb - (290 - TOP) * SL, 290], [xa - (290 - TOP) * SL, 290]]; }
    function off(rx0, ry0, w, hh, d) { var dx = d * 0.8 * SL; return [[rx0 - dx, ry0 + d], [rx0 + w - dx, ry0 + d], [rx0 + w - dx, ry0 + hh + d], [rx0 - dx, ry0 + hh + d]]; }

    // windows: [x, y, w, h, lights, per-light { warm, blind }]
    var WINS = [
      [28, 108, 144, 46, 4, [{ blind: 13 }, {}, { blind: 22 }, { warm: 1 }]],     // office ribbon, upper floor
      [28, 190, 66, 26, 2, [{}, {}]],                                                   // high strip over the stores, ground floor
      [229, 100, 54, 46, 2, [{ blind: 16 }, { warm: 1 }]]                            // over the dock
    ];
    var SH = [
      [[0, TOP], [W, TOP], [W, TOP + 7], [0, TOP + 7]],                              // under the coping
      band(122, 180), band(82, 100),                                                 // two bands of cast shadow across the office bay
      [[194, 164], [322, 164], [306, 192], [178, 192]],                              // under the dock canopy
      [[133, 211], [175, 211], [168, 222], [126, 222]],                              // under the door canopy
      [[184, TOP], [184, PL], [179.5, PL], [179.5, TOP + 6]],                        // beside the middle pilaster
      [[330, TOP], [330, PL], [325.5, PL], [325.5, TOP + 6]],                        // beside the corner pilaster
      [[10, GF], [330, GF], [330, GF + 3.5], [10, GF + 3.5]],                        // under the floor band
      [[13, 78], [13, PL], [9.5, PL], [9.5, 82]],                                    // beside the downpipe
      off(30, 87, 120, 16, 3), off(98, 188, 27, 25, 5)                              // behind the name plate and the wall unit
    ];
    WINS.forEach(function (w) { var sy = w[1] + w[3] + 3.5; SH.push([[w[0] - 3, sy], [w[0] + w[2] + 3, sy], [w[0] + w[2] + 0.5, sy + 3], [w[0] - 5.5, sy + 3]]); });
    // one diagonal of sky across the glass, on the same lines through every pane
    var REFL = [];
    for (var k = 0; k < 6; k++) { REFL.push([[58 + k * 62, 60], [76 + k * 62, 60], [76 + k * 62 - 220, 280], [58 + k * 62 - 220, 280]], [[84 + k * 62, 60], [90 + k * 62, 60], [90 + k * 62 - 220, 280], [84 + k * 62 - 220, 280]]); }

    function castD(x0, y0, x1, y1) { var d = ""; for (var i = 0; i < SH.length; i++) d += _polyD(_clipPoly(SH[i], x0, y0, x1, y1)); return d; }
    function surf(sx, sy, w, hh, fill, shade) {                                      // a flat surface and whatever shadow falls on it
      out.push(R(sx, sy, w, hh, fill));
      var d = castD(sx, sy, sx + w, sy + hh);
      if (d) out.push(h("path", { d: d, fill: shade }));
    }
    function glass(gx, gy, w, hh, warm, blind) {                                     // a pane set back in its frame
      var g = warm ? [D.warm, D.supWarmHi, D.supWarmShade] : [D.supGlass, D.supGlassHi, D.supGlassShade], hi = "";
      out.push(R(gx, gy, w, hh, g[0]));
      REFL.forEach(function (q) { hi += _polyD(_clipPoly(q, gx, gy, gx + w, gy + hh)); });
      if (hi) out.push(h("path", { d: hi, fill: g[1] }));
      out.push(h("path", { d: castD(gx, gy, gx + w, gy + hh) + rd(gx, gy, w, 2.6) + rd(gx + w - 2.2, gy, 2.2, hh), fill: g[2] }));
      if (blind) {
        out.push(R(gx, gy, w, blind, D.supBlind));
        out.push(h("path", { d: castD(gx, gy, gx + w, gy + blind) + rd(gx, gy, w, 2.6) + rd(gx + w - 2.2, gy, 2.2, blind) + rd(gx, gy + blind - 2.2, w, 2.2), fill: D.supBlindShade }));
      }
    }
    function carton(cx0, cy0, w, hh, fill, shade, tape) {
      out.push(h("rect", { x: cx0, y: cy0, width: w, height: hh, rx: 1, fill: fill, stroke: COLORS.ink, strokeWidth: 1.6 }));
      out.push(R(cx0 + 0.8, cy0 + 0.8, 3.4, hh - 1.6, shade));
      if (tape) out.push(R(cx0 + w * 0.46, cy0 + 0.8, 3.6, hh - 1.6, COLORS.verm));
    }

    /* ---- ground: one flat contact shadow, falling toward the viewer's left ---- */
    out.push(h("path", { d: "M-14," + G + "L343," + G + "L338," + (G + 7) + "L-22," + (G + 7) + "Z", fill: D.supGroundShade }));

    /* ---- roof plant, standing behind the parapet (the coping is painted over its feet) ---- */
    // stair head
    out.push(R(22, 30, 74, 30, D.supInk, 2), R(24, 32, 70, 28, D.supPlant), R(24, 32, 11, 28, D.supPlantShade), R(20, 27, 78, 5.4, D.supRoof, 1.5), R(20, 27, 78, 2, D.supRoofLip, 1));
    out.push(R(62, 38, 22, 22, D.supFrame), h("path", { d: rd(65, 41.5, 16, 2.4) + rd(65, 47, 16, 2.4) + rd(65, 52.5, 16, 2.4), fill: D.supPlantShade }));
    // handrail along the roof edge
    (function () { var d = rd(100, 45, 114, 2.6); for (var i = 0; i < 6; i++) d += rd(100 + i * 22.3, 45, 2.6, 14); out.push(h("path", { d: d, fill: D.supRailPale })); })();
    // water tank: a cylinder lying on two saddles, lit along its top
    out.push(h("path", { d: rd(135, 50, 7, 9) + rd(162, 50, 7, 9), fill: D.supRail }));
    out.push(R(122, 29, 60, 24, D.supInk, 12), R(124, 31, 56, 20, D.supPale, 10));
    out.push(h("path", { d: "M124.8,45L179.2,45A10,10 0 0 1 170,51L134,51A10,10 0 0 1 124.8,45Z", fill: D.supPaleShade }));
    out.push(h("path", { d: rd(141, 31, 2.6, 20) + rd(160.4, 31, 2.6, 20), fill: D.supPaleShade }), R(147.5, 26.4, 9, 5, D.supRail, 1.2));
    // two condensers, and a vent
    [222, 264].forEach(function (cx0) {
      out.push(R(cx0 - 2, 32, 40, 28, D.supInk, 2), R(cx0, 34, 36, 26, D.supPlant), R(cx0, 34, 36, 2.6, D.supPlantLight), R(cx0, 34, 6, 26, D.supPlantShade));
      out.push(h("circle", { cx: cx0 + 20, cy: 47, r: 9.4, fill: D.supInk }), h("circle", { cx: cx0 + 20, cy: 47, r: 7, fill: D.supPlantShade }));
    });
    out.push(R(310.5, 44, 5, 16, D.supRail), R(306, 40, 14, 5, D.supRail, 2));

    /* ---- the wall: ink behind it for the outline, then panels, structure and plinth ---- */
    out.push(R(-3.2, 60, W + 6.4, G - 60 + 1.8, D.supInk, 3));
    surf(10, TOP, 174, FL - TOP, D.supWall, D.supWallShade); surf(196, TOP, 134, FL - TOP, D.supWall, D.supWallShade);
    surf(10, GF, 174, PL - GF, D.supWall, D.supWallShade); surf(196, GF, 134, PL - GF, D.supWall, D.supWallShade);
    surf(0, FL, W, GF - FL, D.supWallLight, D.supWall);                              // floor band
    surf(0, TOP, 10, PL - TOP, D.supWallLight, D.supWall); surf(184, TOP, 12, PL - TOP, D.supWallLight, D.supWall); surf(330, TOP, 10, PL - TOP, D.supWallLight, D.supWall);   // pilasters
    surf(0, TOP, W, 17, D.supBand, D.supBandShade);                                  // fascia under the coping
    surf(0, PL, W, G - PL, D.supPlinth, D.supPlinthShade);                           // plinth
    out.push(R(0, PL, W, 2.4, D.supPlinthLight));

    /* ---- office bay ---- */
    // downpipe with its head, brackets and shoe
    surf(13, 76, 5, PL - 72, D.supWallLight, D.supWall);
    out.push(R(13, 76, 1.8, PL - 72, D.supWallShade), R(10.5, 70, 10, 9, D.supFrame, 1.5));
    out.push(h("path", { d: rd(11, 120, 9, 2.6) + rd(11, 182, 9, 2.6) + rd(11, 240, 9, 2.6) + rd(13, PL + 4, 12, 3.2), fill: D.supFrame }));
    // name plate: no lettering, two bars stand in for a name
    surf(30, 87, 120, 16, D.supPlate, D.supPlateShade); surf(38, 91.5, 64, 7, D.supBar1, D.supBar1Shade); surf(110, 91.5, 30, 7, D.supBar2, D.supBar2Shade);
    // windows
    WINS.forEach(function (w) {
      surf(w[0], w[1], w[2], w[3], D.supFrame, D.supFrameShade);
      var pw = (w[2] - 3 * (w[4] + 1)) / w[4];
      for (var i = 0; i < w[4]; i++) glass(w[0] + 3 + i * (pw + 3), w[1] + 3, pw, w[3] - 6, w[5][i].warm, w[5][i].blind);
      surf(w[0] - 3, w[1] + w[3], w[2] + 6, 3.5, D.supSill, D.supSillShade);
    });
    // wall unit on its bracket, beside the high strip of windows
    out.push(R(96.5, 213, 30, 2.8, D.supCanopy), R(98, 188, 27, 25, D.supPale, 2), R(98, 188, 5.5, 25, D.supPaleShade));
    out.push(h("circle", { cx: 110, cy: 200.5, r: 8, fill: D.supFrame }), h("circle", { cx: 110, cy: 200.5, r: 2.8, fill: D.supPale }));
    out.push(h("path", { d: rd(119.5, 193, 4, 2.4) + rd(119.5, 199, 4, 2.4) + rd(119.5, 205, 4, 2.4), fill: D.supPaleShade }));
    // staff door under its own small canopy, with a call panel beside it
    surf(136, 216, 34, G - 216, D.supFrame, D.supFrameShade); surf(139, 219, 28, G - 219, D.supDoor, D.supDoorShade);
    glass(143, 224, 20, 22, 0, 0);
    out.push(R(139, 267, 28, 11, D.supDoorKick), R(160.5, 249, 2.8, 10, D.supPale, 1.4));
    out.push(R(133, 206, 42, 6.4, D.supCanopy, 1), R(133, 206, 42, 2.2, D.supCanopyLip, 1), R(149, 212.4, 8, 3, D.supPale, 1));
    out.push(R(174, 238, 7.5, 13, D.supPale, 1), R(175.8, 240.4, 4, 3.4, D.supFrame));

    /* ---- dock bay ---- */
    // roller shutter: hood and guides, the curtain with its slats, the bottom bar
    surf(200, 176, 112, 80, D.supFrame, D.supFrameShade); surf(204, 184, 104, 66, D.supSteel, D.supSteelShade);
    (function () {
      var lit = "", dark = "";
      for (var i = 1; i < 8; i++) { var ly = 184 + i * 8.25 - 0.8; lit += rd(204, ly, 104, 1.6); dark += castD(204, ly, 308, ly + 1.6); }
      out.push(h("path", { d: lit, fill: D.supSteelLine }), h("path", { d: dark, fill: D.supSteelLineShade }));
    })();
    surf(204, 250, 104, 6, D.supSteelBar, D.supSteelBarShade);
    out.push(R(249, 251.6, 14, 2.8, D.supFrame, 1.4));
    // the dock itself: a raised sill with a safety edge, rubber bumpers and a leveller
    out.push(R(196, 256, 120, G - 256, D.supDock), R(196, 256, 5, G - 256, D.supPlinth), R(196, 256, 120, 3.6, D.supSafety));
    out.push(R(208, 263.5, 10, 11.5, D.supRubber, 1.5), R(294, 263.5, 10, 11.5, D.supRubber, 1.5));
    out.push(R(230, 259.6, 52, 7, D.supSteelBar), R(230, 264.6, 52, 2, D.supSteelBarShade));   // the lip of the dock leveller, folded down
    // canopy hung from the wall on two rods
    out.push(h("path", { d: "M210.4,128L213.4,130.4L200.6,161L197.6,161Z M303.6,128L300.6,130.4L313.4,161L316.4,161Z" + rd(207, 124.6, 9.4, 6) + rd(297.6, 124.6, 9.4, 6), fill: D.supCanopy }));
    out.push(R(192, 160, 130, 10.4, D.supCanopy, 1.5), R(192, 160, 130, 3, D.supCanopyLip, 1.5), R(193.5, 168, 127, 2.4, D.supCanopyUnder));

    /* ---- coping: the dark line that closes the building against the sky ---- */
    out.push(R(-7, 56, W + 14, 11.4, D.supRoof, 2), R(-7, 56, W + 14, 3.2, D.supRoofLip, 1.6));

    /* ---- things that say the place works ---- */
    // pallets, three high
    (function () {
      var deck = "", feet = "";
      for (var i = 0; i < 3; i++) { var py = G - 7.2 * (i + 1); deck += rd(26, py, 38, 2.5) + rd(26, py + 4.7, 38, 2.5); feet += rd(27, py + 2.5, 6, 2.2) + rd(42, py + 2.5, 6, 2.2) + rd(57, py + 2.5, 6, 2.2); }
      out.push(h("path", { d: feet, fill: D.supPalletDark }), h("path", { d: deck, fill: D.supPallet }));
    })();
    // roll cage with two cartons in it
    carton(78.5, 250, 21, 19, D.supCarton, D.supCartonShade); carton(80, 234.5, 17, 15.5, COLORS.paper, D.supPaperShade);
    out.push(h("path", { d: rd(74, 226, 2.6, 46) + rd(101.4, 226, 2.6, 46) + rd(74, 226, 30, 2.6) + rd(74, 244, 30, 2.2) + rd(72.5, 269.4, 33, 3), fill: D.supPale }));
    out.push(h("circle", { cx: 78, cy: 275.2, r: 2.8, fill: D.supInk }), h("circle", { cx: 100, cy: 275.2, r: 2.8, fill: D.supInk }));
    // guide posts either side of the dock
    [188.5, 316.5].forEach(function (bx) {
      out.push(R(bx, 239, 7.4, G - 239, D.supSafety, 2), R(bx, 241, 2.4, G - 241, D.supSafetyShade));
      out.push(h("path", { d: rd(bx, 249, 7.4, 7.2) + rd(bx, 263.4, 7.4, 7.2), fill: D.supInk }));
    });
    // cartons waiting on the dock; the middle is left clear, parcels start there
    carton(208, 228, 26, 28, COLORS.paper, D.supPaperShade, true);
    carton(271, 236, 25, 20, D.supCarton, D.supCartonShade); carton(275, 221.4, 18, 14.6, D.supCarton, D.supCartonShade);

    /* ---- kept last and separate: the parts a motion pass may turn or switch (static for now) ---- */
    [222, 264].forEach(function (cx0) {
      last.push(h("g", { transform: "translate(" + (cx0 + 20) + ", 47)" },
        h("path", { d: rd(-7, -1.3, 14, 2.6) + rd(-1.3, -7, 2.6, 14), fill: D.supPlantLight }), h("circle", { cx: 0, cy: 0, r: 2.4, fill: D.supInk })));
    });
    last.push(h("g", null, R(241, 170.4, 30, 4.4, D.supCanopyUnder, 1.5), R(244, 171.6, 24, 3.2, D.supPale, 1.4)));

    return _supMemo[mk] = h("g", { transform: "translate(" + x + ", " + y + ") scale(" + scale + ") translate(0, -278)", "data-cache": "supplier-" + mk, "data-box": "-24 22 376 266" }, out, last);
  }

