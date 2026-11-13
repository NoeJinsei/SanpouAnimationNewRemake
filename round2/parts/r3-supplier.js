//== REPLACE from "  var SUPPLIER_W = 340, SUPPLIER_DOCK" to "  /* ================= round 3: the city, drawn again from a blank page"
  var SUPPLIER_W = 364, SUPPLIER_DOCK = { x: 252, y: -22 };
  /* The supplier's building, round 3: drawn again from a blank page as a modern office-over-dock unit.
     SUPPLIER_W is the width of its front. The front's right end, the ground line and the dock point are
     where they were (so the truck and the parcels meet it as before); it has grown to the left and up.
     SUPPLIER_DOCK is measured from SUPPLIER_X, as before.
     Colours: blue-grey for a third party's building. Every surface has a base and a shade (the base pushed
     toward navy); the return face is one tone below the shade; pale aluminium carries the light. */
  DAY.supInk = "#26344f";                                                              // the outline
  DAY.supWall = "#abbdd9"; DAY.supWallLight = "#cfdbec"; DAY.supWallShade = "#889fc4"; // the hall: metal sandwich panels
  DAY.supJoint = "#96abcd"; DAY.supJointShade = "#768eb6";                             // their joints
  DAY.supPod = "#6d87b3"; DAY.supPodLight = "#8ba3c8"; DAY.supPodShade = "#59729f";    // the office corner: slate panels
  DAY.supPodJoint = "#5f79a6"; DAY.supPodJointShade = "#4d6692";
  DAY.supPodSide = "#4e6792"; DAY.supPodSideJoint = "#445b85";                         // its return face, away from the sun
  DAY.supPlinth = "#4c628b"; DAY.supPlinthLight = "#677ea6"; DAY.supPlinthShade = "#3f547b"; DAY.supPlinthSide = "#384b70";   // base course
  DAY.supAlu = "#e6edf6"; DAY.supAluLit = "#fafcfe"; DAY.supAluShade = "#c4d0e3"; DAY.supAluSide = "#aebdd5";                // copings, sills, sun shades, canopy edges
  DAY.supFrame = "#3f5479"; DAY.supFrameShade = "#34476b"; DAY.supFrameSide = "#33456a";                                    // window and door frames
  DAY.supGlass = "#c9def2"; DAY.supGlassHi = "#ecf5fd"; DAY.supGlassIn = "#b4cce7"; DAY.supGlassShade = "#a3bedd";          // glass, sky in it, what stands behind it, glass in shade
  DAY.supGlassSide = "#89a7cc"; DAY.supGlassSideHi = "#a8c1e0";
  DAY.supWarmHi = "#ffeabf"; DAY.supWarmIn = "#f6cd84"; DAY.supWarmShade = "#f0c275";
  DAY.supBlind = "#eef3f9"; DAY.supBlindFold = "#dae3ef"; DAY.supBlindShade = "#cdd8e7";
  DAY.supPlate = "#eef3f9"; DAY.supPlateShade = "#ccd8e9"; DAY.supBar1 = "#5a739e"; DAY.supBar1Shade = "#4a628c"; DAY.supBar2 = "#9bafcb"; DAY.supBar2Shade = "#8499b8";
  DAY.supSteel = "#d3dcea"; DAY.supSteelLine = "#b8c5da"; DAY.supSteelShade = "#b1bed4"; DAY.supSteelLineShade = "#9aaac4";
  DAY.supSteelBar = "#8fa1bd"; DAY.supSteelBarShade = "#7a8dab";
  DAY.supDoor = "#566f9b"; DAY.supDoorShade = "#475f8a";
  DAY.supCanopyUnder = "#2c3d5e";
  DAY.supDock = "#7d92b5"; DAY.supDockShade = "#62789e"; DAY.supRubber = "#1a2434";
  DAY.supInside = "#3a4e75"; DAY.supInsideFloor = "#5b7199"; DAY.supInsideStock = "#6c83aa"; DAY.supInsidePale = "#aebcd2";
  DAY.supSafety = "#f2c14e"; DAY.supSafetyShade = "#d8a53a";
  DAY.supPallet = "#4f73b3"; DAY.supPalletDark = "#35508a";
  DAY.supCarton = "#d9dfe8"; DAY.supCartonShade = "#bfc9d8"; DAY.supCartonTape = "#a9b5c8"; DAY.supPaperShade = "#dfe6ef";
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

  /* Local units (x 1.9 on screen), ground at y 278, the front runs x 0..W.
     Two volumes under flat roofs with nothing on them: on the left the office corner, taller, in slate
     panels, its ribbon of glazing wrapping onto the return face; on the right the dock hall, lower, in broad
     horizontal bands of light metal panel, with a slim canopy over the dock. A darker base course runs under
     both. The same oblique as the city: the left return recedes and tapers toward the eye line.
     One sun, top right: whatever stands proud throws a flat shadow down and to the left, and two bands of
     shadow from across the street lie over the wall; each takes what it crosses one tone down.
     Static, so it is built once: one cached group, then the roller shutter as its own node (a motion pass
     can roll it up: the dock's inside is drawn behind it), then the cartons that stand in front of it. */
  var _supMemo = {};
  function SupplierBuilding(p) {
    var x = p.x, y = p.y, scale = p.scale == null ? 1.9 : p.scale, mk = x + "|" + y + "|" + scale;
    if (_supMemo[mk]) return _supMemo[mk];
    var D = DAY, INK = D.supInk, out = [], shut = [], front = [];
    var G = 278, W = SUPPLIER_W, OX = W - 340;             // ground; width of the front; how far it has grown to the left
    var PW = 150, PT = 22, HT = 56, CAP = 6, BC = 262;     // office corner: width and top; hall top; coping height; base course top
    var DP = 32, HZ = 236, PK = 0.1;                       // the return: its depth, the eye line, how fast it tapers
    var WY = 94, WH = 54, FW = 1.6;                        // upper windows: head, height; frame width
    var LINE = Math.round(22 / scale) / 10;                // loose objects carry the parcels' ink line (2.2 px on screen)
    function r1(v) { return Math.round(v * 10) / 10; }
    function R(rx0, ry0, w, hh, fill, rr) { return h("rect", { x: r1(rx0), y: r1(ry0), width: r1(w), height: r1(hh), rx: rr, fill: fill }); }
    function rd(rx0, ry0, w, hh) { return "M" + r1(rx0) + "," + r1(ry0) + "h" + r1(w) + "v" + r1(hh) + "h" + r1(-w) + "z"; }
    function fill(list, d, colour) { if (d) list.push(h("path", { d: d, fill: colour })); }
    function S(u, sy) { return [-DP * u, sy + (HZ - sy) * PK * u]; }                       // a point on the return: u 0 at the corner, 1 at the back
    function side(u0, u1, ya, yb) { return _polyD([S(u0, ya), S(u1, ya), S(u1, yb), S(u0, yb)]); }
    function band(a, b) { return [[a - 18, 18], [b - 18, 18], [b - 284, 284], [a - 284, 284]]; }   // a band of shadow lying across the front
    function drop(rx0, ry0, w, hh, d) { return [[rx0 - d, ry0 + d], [rx0 + w - d, ry0 + d], [rx0 + w - d, ry0 + hh + d], [rx0 - d, ry0 + hh + d]]; }

    var SH = [
      [[0, PT + CAP], [PW, PT + CAP], [PW, PT + CAP + 3.4], [0, PT + CAP + 3.4]],        // under the two copings
      [[PW, HT + CAP], [W, HT + CAP], [W, HT + CAP + 3.4], [PW, HT + CAP + 3.4]],
      band(262, 312), band(170, 184),                                                    // from across the street
      [[0, WY], [133, WY], [127, WY + 6.5], [0, WY + 6.5]],                              // under the sun shade over the ribbon
      [[0, WY + WH + 3], [133, WY + WH + 3], [130, WY + WH + 6], [0, WY + WH + 6]],      // under its sill
      [[236.5, WY], [323.5, WY], [317.5, WY + 6.5], [230.5, WY + 6.5]],                  // the same pair at the window over the dock
      [[236.5, WY + WH + 3], [323.5, WY + WH + 3], [320.5, WY + WH + 6], [233.5, WY + WH + 6]],
      [[20.5, 215], [95.5, 215], [92.5, 218], [17.5, 218]],                              // under the low strip window's sill
      [[190, 174], [362, 174], [338, 198], [166, 198]],                                  // under the dock canopy
      [[158, 209], [204, 209], [196, 217], [150, 217]],                                  // under the door canopy
      drop(14, 50, 86, 16, 2.4),                                                         // behind the name plate
      [[8, 263], [14, 263], [14, G], [8, G]],                                            // beside the pallets
      [[227, 238], [232.3, 238], [232.3, 256], [227, 256]],                              // beside the cartons on the dock
      [[289.5, 242], [296, 242], [296, 256], [289.5, 256]], [[294.5, 228], [301, 228], [301, 236], [294.5, 236]]
    ];
    function castD(x0, y0, x1, y1) { var d = ""; for (var i = 0; i < SH.length; i++) d += _polyD(_clipPoly(SH[i], x0, y0, x1, y1)); return d; }
    // flat surfaces of one material, and whatever shadow falls on them
    function tone(list, rects, colour, shade) {
      var d = "", s = "";
      rects.forEach(function (q) { d += rd(q[0], q[1], q[2], q[3]); s += castD(q[0], q[1], q[0] + q[2], q[1] + q[3]); });
      fill(list, d, colour); fill(list, s, shade);
    }
    /* glazing: n panes in a thin frame. Per pane: warm (a lit room), inside (what stands behind the glass, as
       [from, to, height] along the foot of the pane), hi (sky in the glass, as [offset, width, lean]: every pane
       gets its own), blind (how far a roller blind is down). The reveal shades the head and the sun side. */
    function glaze(list, gx, gy, w, hh, n, spec) {
      var pw = (w - FW * (n + 1)) / n, y0 = gy + FW, ph = hh - 2 * FW, y1 = y0 + ph;
      var warm = "", dark = "", wdark = "", hi = "", whi = "", shade = "", wshade = "", blind = "", fold = "", bshade = "", frame = [[gx, gy, w, FW], [gx, gy + hh - FW, w, FW]];
      for (var i = 0; i <= n; i++) frame.push([gx + i * (pw + FW), gy + FW, FW, ph]);
      for (i = 0; i < n; i++) {
        var s = spec[i] || {}, px = gx + FW + i * (pw + FW), px1 = px + pw, k, a, d;
        if (s.warm) warm += rd(px, y0, pw, ph);
        for (k = 0; s.inside && k < s.inside.length; k++) { a = s.inside[k]; d = rd(px + a[0] * pw, y1 - a[2], (a[1] - a[0]) * pw, a[2]); if (s.warm) wdark += d; else dark += d; }
        for (k = 0; s.hi && k < s.hi.length; k++) {
          a = s.hi[k]; var lean = ph * (a[2] == null ? 0.7 : a[2]);
          d = _polyD(_clipPoly([[px + a[0], y0], [px + a[0] + a[1], y0], [px + a[0] + a[1] - lean, y1], [px + a[0] - lean, y1]], px, y0, px1, y1));
          if (s.warm) whi += d; else hi += d;
        }
        d = castD(px, y0, px1, y1) + rd(px, y0, pw, 2.2) + rd(px1 - 1.8, y0 + 2.2, 1.8, ph - 2.2);
        if (s.warm) wshade += d; else shade += d;
        if (s.blind) {
          blind += rd(px, y0, pw, s.blind);
          for (k = 8; k < s.blind - 4; k += 8) fold += rd(px, y0 + k, pw, 1.4);
          fold += rd(px, y0 + s.blind - 2.4, pw, 2.4);
          bshade += castD(px, y0, px1, y0 + s.blind) + rd(px, y0, pw, 2.2) + rd(px1 - 1.8, y0 + 2.2, 1.8, s.blind - 2.2);
        }
      }
      list.push(R(gx, gy, w, hh, D.supGlass));
      fill(list, warm, D.warm); fill(list, dark, D.supGlassIn); fill(list, wdark, D.supWarmIn);
      fill(list, hi, D.supGlassHi); fill(list, whi, D.supWarmHi);
      fill(list, shade, D.supGlassShade); fill(list, wshade, D.supWarmShade);
      fill(list, blind, D.supBlind); fill(list, fold, D.supBlindFold); fill(list, bshade, D.supBlindShade);
      tone(list, frame, D.supFrame, D.supFrameShade);
    }
    function carton(list, cx0, cy0, w, hh) {                                              // a plain carton: shaded left side, a strip of tape
      list.push(h("rect", { x: cx0, y: cy0, width: w, height: hh, rx: 0.8, fill: D.supCarton, stroke: COLORS.ink, strokeWidth: LINE }));
      list.push(R(cx0 + LINE / 2, cy0 + LINE / 2, 3.2, hh - LINE, D.supCartonShade), R(cx0 + w * 0.5 - 1.5, cy0 + LINE / 2, 3, hh - LINE, D.supCartonTape));
    }

    /* ---- the ground: one flat contact shadow, lying to the left ---- */
    fill(out, _polyD([[W + 3, G], [W, G + 3.6], [-80, G + 3.6], [-71, S(1, G)[1]], [-DP, S(1, G)[1]], [0, G]]), D.supGroundShade);

    /* ---- the outline: ink behind the whole silhouette (front, return, the step in the roof) ---- */
    (function () {
      var OL = 2.4, OB = 1.2, st = (PT - S(1, PT)[1]) / DP, sb = (G - S(1, G)[1]) / DP, xl = -DP - OL;
      var vt = OL * Math.sqrt(1 + st * st), vb = OB * Math.sqrt(1 + sb * sb);
      fill(out, _polyD([[xl, PT + st * xl - vt], [(vt - OL) / st, PT - OL], [PW + OL, PT - OL], [PW + OL, HT - OL], [W + OL, HT - OL],
        [W + OL, G + OB], [(OB - vb) / sb, G + OB], [xl, G + sb * xl + vb]]), INK);
    })();

    /* ---- the return face of the office corner: in shade, the glazing carried round onto it ---- */
    fill(out, side(0, 1, PT + CAP, BC), D.supPodSide);
    fill(out, side(0, 1, 165.2, 166.8) + side(0.5, 0.55, PT + CAP, WY - 4) + side(0.5, 0.55, WY + WH + 3, BC), D.supPodSideJoint);
    fill(out, side(0, 1, BC, G), D.supPlinthSide);
    fill(out, side(0, 1, PT, PT + CAP) + side(0, 0.95, WY - 4, WY) + side(0, 0.95, WY + WH, WY + WH + 3), D.supAluSide);
    fill(out, side(0, 0.9, WY, WY + WH), D.supFrameSide);
    fill(out, side(0.06, 0.44, WY + FW, WY + WH - FW) + side(0.5, 0.85, WY + FW, WY + WH - FW), D.supGlassSide);
    fill(out, _polyD([S(0.2, WY + FW), S(0.38, WY + FW), S(0.06, WY + 34), S(0.06, WY + 20)]) + _polyD([S(0.85, WY + 22), S(0.85, WY + 34), S(0.5, WY + WH - FW), S(0.5, WY + 44)]), D.supGlassSideHi);

    /* ---- the fronts: slate panels on the office corner, light metal panels in broad bands on the hall ---- */
    tone(out, [[0, PT + CAP, PW, BC - PT - CAP]], D.supPod, D.supPodShade);
    tone(out, [[52, PT + CAP, 1.6, WY - 4 - PT - CAP], [104, PT + CAP, 1.6, WY - 4 - PT - CAP], [52, WY + WH + 3, 1.6, BC - WY - WH - 3], [104, WY + WH + 3, 1.6, BC - WY - WH - 3], [0, 165.2, PW, 1.6]], D.supPodJoint, D.supPodJointShade);
    tone(out, [[PW, HT + CAP, W - PW, BC - HT - CAP]], D.supWall, D.supWallShade);
    tone(out, [[PW, 93.2, W - PW, 1.6], [PW, 129.2, W - PW, 1.6], [PW, 165.2, W - PW, 1.6], [PW, 201.2, W - PW, 1.6], [PW, 237.2, W - PW, 1.6]], D.supJoint, D.supJointShade);
    out.push(R(W - 3, HT + CAP, 3, BC - HT - CAP, D.supWallLight), R(PW - 3, PT + CAP, 3, HT - PT - CAP, D.supPodLight));   // the edges that face the sun
    tone(out, [[0, BC, W, G - BC]], D.supPlinth, D.supPlinthShade);
    out.push(R(0, BC, W, 1.8, D.supPlinthLight));
    // copings: a thin pale cap on each roof, its top edge in the sun
    fill(out, rd(0, PT, PW, CAP) + rd(PW, HT, W - PW, CAP), D.supAlu);
    fill(out, rd(0, PT, PW, 1.6) + rd(PW, HT, W - PW, 1.6), D.supAluLit);

    /* ---- office corner ---- */
    // name plate: no lettering, two bars stand in for a name
    tone(out, [[14, 50, 86, 16]], D.supPlate, D.supPlateShade);
    tone(out, [[20, 55, 46, 6]], D.supBar1, D.supBar1Shade); tone(out, [[70, 55, 22, 6]], D.supBar2, D.supBar2Shade);
    // the ribbon: five panes from the corner, under a slim sun shade
    glaze(out, 0, WY, 131.6, WH, 5, [
      { blind: 16, hi: [[32, 8]], inside: [[0, 0.55, 12]] },
      { hi: [[22, 3.4, 0.5], [31, 9, 0.5]], inside: [[0.35, 1, 17]] },
      { blind: 31 },
      { warm: 1, hi: [[36, 6]], inside: [[0, 0.45, 13]] },
      { hi: [[44, 13, 0.9]], inside: [[0.5, 1, 21], [0, 0.5, 10]] }]);
    tone(out, [[0, WY - 4, 133, 4], [0, WY + WH, 133, 3]], D.supAlu, D.supAluShade);
    out.push(R(0, WY - 4, 133, 1.4, D.supAluLit));
    // the low strip of windows over the stores
    glaze(out, 22, 188, 72, 24, 3, [{ hi: [[20, 6]] }, { hi: [[9, 3, 0.5]] }, { hi: [[15, 4], [23, 3]] }]);
    tone(out, [[20.5, 212, 75, 3]], D.supAlu, D.supAluShade);

    /* ---- hall ---- */
    // the window over the dock: the ribbon's little brother, same head and sill
    glaze(out, 238, WY, 84, WH, 3, [
      { blind: 22, hi: [[38, 7]] },
      { hi: [[24, 4, 0.5], [33, 9, 0.5]], inside: [[0.2, 0.85, 14]] },
      { warm: 1, hi: [[42, 7]], inside: [[0.45, 1, 18]] }]);
    tone(out, [[236.5, WY - 4, 87, 4], [236.5, WY + WH, 87, 3]], D.supAlu, D.supAluShade);
    out.push(R(236.5, WY - 4, 87, 1.4, D.supAluLit));
    // staff door: a glazed leaf in a thin frame, a pull bar, a step, a slim canopy, a call panel beside it
    tone(out, [[164, 214, 34, G - 214]], D.supFrame, D.supFrameShade);
    tone(out, [[166, 216, 30, G - 216]], D.supDoor, D.supDoorShade);
    glaze(out, 169, 219.4, 24, 36, 1, [{ hi: [[27, 7]] }]);
    out.push(R(166, 268, 30, 10, D.supSteelBar), R(189.4, 257, 2.6, 9, D.supAlu, 1.3), R(161, 275, 40, 3, D.supPlinthLight));
    tone(out, [[158, 205, 46, 4]], D.supAlu, D.supAluShade);
    out.push(R(158, 205, 46, 1.4, D.supAluLit), R(159.5, 209, 43, 1.8, D.supCanopyUnder));
    out.push(R(202.4, 236, 6.4, 11, D.supAlu, 1), R(204, 238, 3.2, 3.2, D.supFrame));

    /* ---- the dock ---- */
    // inside, behind the shutter: back wall, floor, a rack of stock either side of a clear lane
    out.push(R(228, 184, 104, 72, D.supInside), R(228, 247, 104, 9, D.supInsideFloor));
    fill(out, rd(232, 196, 30, 3) + rd(232, 220, 30, 3) + rd(232, 196, 3, 51) + rd(259, 196, 3, 51) + rd(298, 204, 30, 3) + rd(298, 226, 30, 3) + rd(298, 204, 3, 43) + rd(325, 204, 3, 43), D.supInsideStock);
    fill(out, rd(237, 206, 11, 14) + rd(249, 210, 8, 10) + rd(237, 232, 20, 15) + rd(303, 212, 9, 14) + rd(313, 216, 10, 10) + rd(303, 233, 20, 14), D.supInsidePale);
    // hood and guides
    tone(out, [[222, 176, 116, 8], [222, 184, 6, 72], [332, 184, 6, 72]], D.supFrame, D.supFrameShade);
    // the dock itself: a raised sill with a safety edge, rubber bumpers and the leveller's lip folded down
    out.push(R(220, 256, 124, G - 256, D.supDock), R(220, 256, 4.6, G - 256, D.supDockShade), R(220, 256, 124, 3.6, D.supSafety));
    out.push(R(232, 263.5, 10, 11.5, D.supRubber, 1.5), R(318, 263.5, 10, 11.5, D.supRubber, 1.5));
    out.push(R(254, 259.6, 52, 7, D.supSteelBar), R(254, 264.6, 52, 2, D.supSteelBarShade));
    // the canopy: a slim slab cantilevered from the wall; its end and its underside show how far it stands out
    fill(out, _polyD([[202.8, 164.8], [363.2, 164.8], [363.2, 173], [347.4, 176.5], [186.8, 176.5], [186.8, 168.6]]), INK);
    fill(out, _polyD([[204, 172], [362, 172], [346, 175.3], [188, 175.3]]), D.supCanopyUnder);
    fill(out, _polyD([[204, 166], [204, 172], [188, 175.3], [188, 169.5]]), D.supAluSide);
    out.push(R(204, 166, 158, 6, D.supAlu), R(204, 166, 158, 1.6, D.supAluLit), R(264, 172.6, 32, 2.4, D.supAlu, 1.2));

    /* ---- the yard: few things, each with the same ink line ---- */
    // empty pallets, three high
    (function () {
      var deck = "", py;
      for (var i = 0; i < 3; i++) { py = G - 7.2 * (i + 1); deck += rd(14, py, 40, 2.4) + rd(14, py + 5, 40, 2.2) + rd(14, py + 2.4, 6, 2.6) + rd(31, py + 2.4, 6, 2.6) + rd(48, py + 2.4, 6, 2.6); }
      out.push(h("rect", { x: 14, y: G - 21.6, width: 40, height: 21.6, fill: D.supPalletDark, stroke: COLORS.ink, strokeWidth: LINE }));
      fill(out, deck, D.supPallet);
    })();
    // a roll cage with two cartons in it, one of them the kind being loaded
    carton(out, 72, 250.6, 22, 19);
    out.push(h("rect", { x: 74, y: 235.6, width: 18, height: 15, rx: 0.8, fill: COLORS.paper, stroke: COLORS.ink, strokeWidth: LINE }), R(74.6, 236.2, 3, 13.8, D.supPaperShade), R(81.4, 236.2, 3.2, 13.8, COLORS.verm));
    out.push(h("path", { d: "M69.4,226V270.6M96.6,226V270.6M69.4,227.2H96.6M69.4,246H96.6M67.4,270.6H98.6", fill: "none", stroke: COLORS.ink, strokeWidth: r1(2 + 2 * LINE) }));
    out.push(h("path", { d: "M69.4,227.2V270.6M96.6,227.2V270.6M69.4,227.2H96.6M69.4,246H96.6M68.6,270.6H97.4", fill: "none", stroke: D.supAlu, strokeWidth: 2 }));
    out.push(h("circle", { cx: 72.4, cy: 275, r: 2.6, fill: COLORS.ink }), h("circle", { cx: 93.6, cy: 275, r: 2.6, fill: COLORS.ink }));
    // guide posts either side of the dock
    [212.5, 344.5].forEach(function (bx) {
      out.push(h("rect", { x: bx, y: 239, width: 7.4, height: G - 239, rx: 2, fill: D.supSafety, stroke: COLORS.ink, strokeWidth: LINE }), R(bx + LINE / 2, 241, 2.2, G - 241 - LINE / 2, D.supSafetyShade));
      fill(out, rd(bx, 248.6, 7.4, 7) + rd(bx, 263, 7.4, 7), COLORS.ink);
    });

    /* ---- its own node: the roller shutter (closed), so a motion pass can roll it up ---- */
    tone(shut, [[228, 184, 104, 66]], D.supSteel, D.supSteelShade);
    (function () {
      var lines = [];
      for (var i = 1; i < 8; i++) lines.push([228, 184 + i * 8.25 - 0.8, 104, 1.6]);
      tone(shut, lines, D.supSteelLine, D.supSteelLineShade);
    })();
    tone(shut, [[228, 250, 104, 6]], D.supSteelBar, D.supSteelBarShade);
    shut.push(R(273, 251.6, 14, 2.8, D.supFrame, 1.4));

    /* ---- in front of it: cartons waiting on the dock; the middle stays clear, the parcels start there ---- */
    front.push(h("g", { transform: "translate(246, 256) scale(" + (1 / scale).toFixed(4) + ")" }, parcelArt(52)));
    carton(front, 296, 236, 26, 20); carton(front, 301, 222, 18, 14);

    return _supMemo[mk] = h("g", { transform: "translate(" + x + ", " + y + ") scale(" + scale + ") translate(" + (-OX) + ", " + (-G) + ")" },
      h("g", { "data-cache": "supplier-" + mk, "data-box": "-84 14 456 274" }, out),
      h("g", null, shut),
      h("g", null, front));
  }
