//== REPLACE from "  var SUPPLIER_W = 364, SUPPLIER_DOCK = { x: 252, y: -22 };" to "  /* ================= round 3: the city"
  var SUPPLIER_W = 364, SUPPLIER_DOCK = { x: 252, y: -22 };
  /* The supplier's building, round 3, flat: a modern office-and-dock unit drawn as ONE straight-on elevation.
     SUPPLIER_W is the width of the part of its front that is measured from the right end (the dock point,
     the ground line and the right end are where they always were, so the truck and the parcels meet it as
     before); the office front runs 32 units further left, over the width its return face used to take.
     SUPPLIER_DOCK is measured from SUPPLIER_X, as before.
     Colours: blue-grey for a third party's building. Every surface has a base and a shade (the base pushed
     toward navy) for the strip of shade under whatever overhangs it; pale aluminium carries the light. */
  DAY.supInk = "#26344f";                                                              // the outline
  DAY.supWall = "#abbdd9"; DAY.supWallShade = "#889fc4";                               // the hall: metal sandwich panels
  DAY.supJoint = "#96abcd"; DAY.supJointShade = "#768eb6";                             // their joints
  DAY.supBand = "#6d87b3"; DAY.supBandShade = "#59729f";                               // the hall's top band of panels
  DAY.supPod = "#6d87b3"; DAY.supPodShade = "#59729f";                                 // the office part: slate panels
  DAY.supPodJoint = "#5f79a6"; DAY.supPodJointShade = "#4d6692";
  DAY.supPlinth = "#4c628b"; DAY.supPlinthLight = "#677ea6"; DAY.supPlinthShade = "#3f547b";   // base course
  DAY.supAlu = "#e6edf6"; DAY.supAluLit = "#fafcfe"; DAY.supAluShade = "#c4d0e3";              // copings, sills, sun shades, canopies
  DAY.supFrame = "#3f5479"; DAY.supFrameShade = "#34476b";                                    // window and door frames
  DAY.supGlass = "#c9def2"; DAY.supGlassHi = "#ecf5fd"; DAY.supGlassIn = "#b4cce7"; DAY.supGlassShade = "#a3bedd";          // glass, sky in it, what stands behind it, glass in shade
  DAY.supWarmHi = "#ffeabf"; DAY.supWarmIn = "#f6cd84"; DAY.supWarmShade = "#f0c275";
  DAY.supBlind = "#eef3f9"; DAY.supBlindFold = "#dae3ef"; DAY.supBlindShade = "#cdd8e7";
  DAY.supPlate = "#eef3f9"; DAY.supPlateShade = "#ccd8e9"; DAY.supBar1 = "#5a739e"; DAY.supBar1Shade = "#4a628c"; DAY.supBar2 = "#9bafcb"; DAY.supBar2Shade = "#8499b8";
  DAY.supSteel = "#d3dcea"; DAY.supSteelLine = "#b8c5da"; DAY.supSteelShade = "#b1bed4"; DAY.supSteelLineShade = "#9aaac4";
  DAY.supSteelBar = "#8fa1bd"; DAY.supSteelBarShade = "#7a8dab";
  DAY.supDoor = "#566f9b"; DAY.supDoorShade = "#475f8a";
  DAY.supCanopyUnder = "#2c3d5e";
  DAY.supDock = "#7d92b5"; DAY.supRubber = "#1a2434";
  DAY.supInside = "#3a4e75"; DAY.supInsideFloor = "#5b7199"; DAY.supInsideStock = "#6c83aa"; DAY.supInsidePale = "#aebcd2";
  DAY.supSafety = "#f2c14e";
  DAY.supPallet = "#4f73b3"; DAY.supPalletDark = "#35508a";
  DAY.supCarton = "#d9dfe8"; DAY.supCartonTop = "#eef2f7"; DAY.supCartonTape = "#a9b5c8"; DAY.supPaperShade = "#dfe6ef";
  DAY.supGroundShade = "#a9b1bc";

  // A polygon clipped to a box, and a polygon as path data (the glass sheens here and the city's glazing use them).
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

  /* Local units (x 1.9 on screen), ground at y 278. The front runs x -32..W; every edge of the building is
     vertical or horizontal and there is one face.
     Two rectangles under level flat roofs with nothing on them, standing side by side: on the left the
     office part, taller, in tall slate panels set out on the module of its glazing (a ribbon of five panes
     under a slim sun shade, a strip of three below); on the right the dock hall, lower, in broad horizontal
     bands of light metal panel under one darker band, with a slim canopy hung over the dock. A darker base
     course runs under both.
     Light, top right, shows three ways only: the flat tones themselves, a lighter top edge on what catches
     it (copings, sills, the canopies), and a level strip of shade straight under whatever stands proud
     (copings, sun shades, sills, canopies, the name plate); the strip takes each material it crosses exactly
     one tone down.
     Static, so it is built once: one cached group, then the roller shutter as its own node (a motion pass
     can roll it up: the dock's inside is drawn behind it), then the cartons that stand in front of it. */
  var _supMemo = {};
  function SupplierBuilding(p) {
    var x = p.x, y = p.y, scale = p.scale == null ? 1.9 : p.scale, mk = x + "|" + y + "|" + scale;
    if (_supMemo[mk]) return _supMemo[mk];
    var D = DAY, INK = D.supInk, out = [], shut = [], front = [];
    var G = 278, W = SUPPLIER_W, OX = W - 340;             // ground; the front's right end; where SUPPLIER_X falls
    var XL = -32, PW = 150, PT = 22, HT = 56, CAP = 6, BC = 262;   // the front's left end; where the two parts meet; office top; hall top; coping height; base course top
    var WY = 94, WH = 54, FW = 1.6;                        // upper windows: head, height; frame width
    var RX = -20, RW = 158, MOD = (RW - FW) / 5;           // the ribbon: left end, width; one pane plus one frame = the office's panel module
    var BAND = 82;                                         // foot of the hall's top band of darker panels
    var LINE = Math.round(22 / scale) / 10;                // loose objects carry the parcels' ink line (2.2 px on screen)
    function r1(v) { return Math.round(v * 10) / 10; }
    function R(rx0, ry0, w, hh, fill, rr) { return h("rect", { x: r1(rx0), y: r1(ry0), width: r1(w), height: r1(hh), rx: rr, fill: fill }); }
    function rd(rx0, ry0, w, hh) { return "M" + r1(rx0) + "," + r1(ry0) + "h" + r1(w) + "v" + r1(hh) + "h" + r1(-w) + "z"; }
    function fill(list, d, colour) { if (d) list.push(h("path", { d: d, fill: colour })); }

    // the strips of shade, each a level rectangle straight under what throws it: [x, y, width, height]
    var SH = [
      [XL, PT + CAP, PW - XL, 3.4], [PW, HT + CAP, W - PW, 3.4],        // under the two copings
      [RX, WY, RW, 6],                                                  // under the sun shade over the ribbon
      [RX - 2, WY + WH + 3, RW + 4, 2.8],                               // under its sill
      [238, WY, 84, 6], [236, WY + WH + 3, 88, 2.8],                    // the same pair at the window over the dock
      [RX - 1.5, 215, 3 * MOD + FW + 3, 2.8],                           // under the low strip window's sill
      [204, 174, 158, 7],                                               // under the dock canopy
      [158, 209, 46, 5.5],                                              // under the door canopy
      [-16, 66, 88, 2.6],                                               // under the name plate
      [162, 129, 38, 2.6]                                               // under the louvre's sill
    ];
    function castD(x0, y0, x1, y1) {
      var d = "";
      for (var i = 0; i < SH.length; i++) {
        var s = SH[i], ax = Math.max(x0, s[0]), ay = Math.max(y0, s[1]), bx = Math.min(x1, s[0] + s[2]), by = Math.min(y1, s[1] + s[3]);
        if (bx - ax > 0.05 && by - ay > 0.05) d += rd(ax, ay, bx - ax, by - ay);
      }
      return d;
    }
    // flat surfaces of one material, and whatever shade falls on them
    function tone(list, rects, colour, shade) {
      var d = "", s = "";
      rects.forEach(function (q) { d += rd(q[0], q[1], q[2], q[3]); s += castD(q[0], q[1], q[0] + q[2], q[1] + q[3]); });
      fill(list, d, colour); fill(list, s, shade);
    }
    /* glazing: n panes in a thin frame. Per pane: warm (a lit room), inside (what stands behind the glass, as
       [from, to, height] along the foot of the pane), hi (sky in the glass, as [offset, width, lean]: every pane
       gets its own), blind (how far a roller blind is down). The window head shades the top of each pane. */
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
        d = castD(px, y0 + 2.2, px1, y1) + rd(px, y0, pw, 2.2);
        if (s.warm) wshade += d; else shade += d;
        if (s.blind) {
          blind += rd(px, y0, pw, s.blind);
          for (k = 8; k < s.blind - 4; k += 8) fold += rd(px, y0 + k, pw, 1.4);
          fold += rd(px, y0 + s.blind - 2.4, pw, 2.4);
          bshade += castD(px, y0 + 2.2, px1, y0 + s.blind) + rd(px, y0, pw, 2.2);
        }
      }
      list.push(R(gx, gy, w, hh, D.supGlass));
      fill(list, warm, D.warm); fill(list, dark, D.supGlassIn); fill(list, wdark, D.supWarmIn);
      fill(list, hi, D.supGlassHi); fill(list, whi, D.supWarmHi);
      fill(list, shade, D.supGlassShade); fill(list, wshade, D.supWarmShade);
      fill(list, blind, D.supBlind); fill(list, fold, D.supBlindFold); fill(list, bshade, D.supBlindShade);
      tone(list, frame, D.supFrame, D.supFrameShade);
    }
    // the pale aluminium surround of an upper window: a sun shade over it, a sill under it, a slim cheek each side
    function surround(gx, w) {
      fill(out, rd(gx - 2, WY - 4, w + 4, 4) + rd(gx - 2, WY + WH, w + 4, 3) + rd(gx - 2, WY, 2, WH) + rd(gx + w, WY, 2, WH), D.supAlu);
      out.push(R(gx - 2, WY - 4, w + 4, 1.4, D.supAluLit));
    }
    function carton(list, cx0, cy0, w, hh) {                                              // a plain carton: its top edge in the sun, a strip of tape
      list.push(h("rect", { x: cx0, y: cy0, width: w, height: hh, rx: 0.8, fill: D.supCarton, stroke: COLORS.ink, strokeWidth: LINE }));
      list.push(R(cx0 + LINE / 2, cy0 + LINE / 2, w - LINE, 2.4, D.supCartonTop), R(cx0 + w * 0.5 - 1.5, cy0 + LINE / 2, 3, hh - LINE, D.supCartonTape));
    }

    /* ---- the ground: one level strip of contact shade under the whole front ---- */
    out.push(R(XL - 7, G, W - XL + 14, 3.6, D.supGroundShade));

    /* ---- the outline: ink behind the whole silhouette (two rectangles and the step between their roofs) ---- */
    (function () {
      var OL = 2.4, OB = 1.2;
      fill(out, _polyD([[XL - OL, PT - OL], [PW + OL, PT - OL], [PW + OL, HT - OL], [W + OL, HT - OL], [W + OL, G + OB], [XL - OL, G + OB]]), INK);
    })();

    /* ---- the fronts: tall slate panels on the office part, light metal panels in broad bands on the hall ---- */
    tone(out, [[XL, PT + CAP, PW - XL, BC - PT - CAP]], D.supPod, D.supPodShade);
    (function () {
      var j = [[XL, 165.2, PW - XL, 1.6]];
      for (var i = 0; i <= 5; i++) j.push([RX + i * MOD, PT + CAP, FW, WY - 4 - PT - CAP], [RX + i * MOD, WY + WH + 3, FW, BC - WY - WH - 3]);
      tone(out, j, D.supPodJoint, D.supPodJointShade);
    })();
    tone(out, [[PW, BAND, W - PW, BC - BAND]], D.supWall, D.supWallShade);
    tone(out, [[PW, HT + CAP, W - PW, BAND - HT - CAP]], D.supBand, D.supBandShade);
    tone(out, [[PW, 93.2, W - PW, 1.6], [PW, 129.2, W - PW, 1.6], [PW, 165.2, W - PW, 1.6], [PW, 201.2, W - PW, 1.6], [PW, 237.2, W - PW, 1.6]], D.supJoint, D.supJointShade);
    tone(out, [[XL, BC, W - XL, G - BC]], D.supPlinth, D.supPlinthShade);
    out.push(R(XL, BC, W - XL, 1.8, D.supPlinthLight));
    // copings: a thin pale cap on each roof, its top edge in the sun
    fill(out, rd(XL, PT, PW - XL, CAP) + rd(PW, HT, W - PW, CAP), D.supAlu);
    fill(out, rd(XL, PT, PW - XL, 1.6) + rd(PW, HT, W - PW, 1.6), D.supAluLit);

    /* ---- office part ---- */
    // name plate: no lettering, two bars stand in for a name
    tone(out, [[-16, 50, 88, 16]], D.supPlate, D.supPlateShade);
    tone(out, [[-10, 55, 47, 6]], D.supBar1, D.supBar1Shade); tone(out, [[41, 55, 23, 6]], D.supBar2, D.supBar2Shade);
    // the ribbon: five panes across the front, under a slim sun shade
    glaze(out, RX, WY, RW, WH, 5, [
      { blind: 16, hi: [[38, 9]], inside: [[0, 0.55, 12]] },
      { hi: [[27, 4, 0.5], [38, 10, 0.5]], inside: [[0.35, 1, 17]] },
      { blind: 31 },
      { warm: 1, hi: [[43, 7]], inside: [[0, 0.45, 13]] },
      { hi: [[50, 14, 0.9]], inside: [[0.5, 1, 21], [0, 0.5, 10]] }]);
    surround(RX, RW);
    // the low strip of windows over the stores: the ribbon's first three bays again
    glaze(out, RX, 188, 3 * MOD + FW, 24, 3, [{ hi: [[24, 7]] }, { hi: [[11, 3.4, 0.5]] }, { hi: [[18, 5], [28, 3.4]] }]);
    tone(out, [[RX - 1.5, 212, 3 * MOD + FW + 3, 3]], D.supAlu, D.supAluShade);

    /* ---- hall ---- */
    // the window over the dock: the ribbon's little brother, same head and sill
    glaze(out, 238, WY, 84, WH, 3, [
      { blind: 22, hi: [[38, 7]] },
      { hi: [[24, 4, 0.5], [33, 9, 0.5]], inside: [[0.2, 0.85, 14]] },
      { warm: 1, hi: [[42, 7]], inside: [[0.45, 1, 18]] }]);
    surround(238, 84);
    // a ventilation louvre over the staff door: slats in a frame, a sill
    tone(out, [[164, 104, 34, 23]], D.supFrame, D.supFrameShade);
    fill(out, rd(166.4, 106.6, 29.2, 3) + rd(166.4, 111.4, 29.2, 3) + rd(166.4, 116.2, 29.2, 3) + rd(166.4, 121, 29.2, 3), D.supSteelBar);
    tone(out, [[162, 126.6, 38, 2.4]], D.supAlu, D.supAluShade);
    // staff door: a glazed leaf in a thin frame, a pull bar, a step, a slim canopy, a call panel beside it
    tone(out, [[164, 214, 34, G - 214]], D.supFrame, D.supFrameShade);
    tone(out, [[166, 216, 30, G - 216]], D.supDoor, D.supDoorShade);
    glaze(out, 169, 219.4, 24, 36, 1, [{ hi: [[27, 7]] }]);
    out.push(R(166, 268, 30, 10, D.supSteelBar), R(189.4, 257, 2.6, 9, D.supAlu, 1.3), R(161, 275, 40, 3, D.supPlinthLight));
    tone(out, [[158, 205, 46, 4]], D.supAlu, D.supAluShade);
    out.push(R(158, 205, 46, 1.4, D.supAluLit));
    out.push(R(202.4, 236, 6.4, 11, D.supAlu, 1), R(204, 238, 3.2, 3.2, D.supFrame));

    /* ---- the dock ---- */
    // inside, behind the shutter: back wall, floor, a rack of stock either side of a clear lane
    out.push(R(228, 184, 104, 72, D.supInside), R(228, 247, 104, 9, D.supInsideFloor));
    fill(out, rd(232, 196, 30, 3) + rd(232, 220, 30, 3) + rd(232, 196, 3, 51) + rd(259, 196, 3, 51) + rd(298, 204, 30, 3) + rd(298, 226, 30, 3) + rd(298, 204, 3, 43) + rd(325, 204, 3, 43), D.supInsideStock);
    fill(out, rd(237, 206, 11, 14) + rd(249, 210, 8, 10) + rd(237, 232, 20, 15) + rd(303, 212, 9, 14) + rd(313, 216, 10, 10) + rd(303, 233, 20, 14), D.supInsidePale);
    // hood and guides
    tone(out, [[222, 176, 116, 8], [222, 184, 6, 72], [332, 184, 6, 72]], D.supFrame, D.supFrameShade);
    // the dock itself: a raised sill with a safety edge, rubber bumpers and the leveller's lip folded down
    out.push(R(220, 256, 124, G - 256, D.supDock), R(220, 256, 124, 3.6, D.supSafety));
    out.push(R(232, 263.5, 10, 11.5, D.supRubber, 1.5), R(318, 263.5, 10, 11.5, D.supRubber, 1.5));
    out.push(R(254, 259.6, 52, 7, D.supSteelBar), R(254, 264.6, 52, 2, D.supSteelBarShade));
    // the canopy: a slim slab seen edge on, its top edge in the sun, a dark drip edge under it
    out.push(R(202.8, 163.8, 160.4, 11.4, INK));
    out.push(R(204, 165, 158, 7, D.supAlu), R(204, 165, 158, 1.6, D.supAluLit), R(204, 172, 158, 2, D.supCanopyUnder));

    /* ---- the yard: few things, each with the same ink line ---- */
    // empty pallets, three high
    (function () {
      var deck = "", py;
      for (var i = 0; i < 3; i++) { py = G - 7.2 * (i + 1); deck += rd(14, py, 40, 2.4) + rd(14, py + 5, 40, 2.2) + rd(14, py + 2.4, 6, 2.6) + rd(31, py + 2.4, 6, 2.6) + rd(48, py + 2.4, 6, 2.6); }
      out.push(h("rect", { x: 14, y: G - 21.6, width: 40, height: 21.6, fill: D.supPalletDark, stroke: COLORS.ink, strokeWidth: LINE }));
      fill(out, deck, D.supPallet);
    })();
    // a roll cage with two cartons in it, one of them the kind being loaded
    out.push(h("g", { transform: "translate(38, 0)" }, (function () {
      var c = [];
      carton(c, 72, 250.6, 22, 19);
      c.push(h("rect", { x: 74, y: 235.6, width: 18, height: 15, rx: 0.8, fill: COLORS.paper, stroke: COLORS.ink, strokeWidth: LINE }), R(74.6, 236.2, 16.8, 2.2, COLORS.white), R(81.4, 236.2, 3.2, 13.8, COLORS.verm));
      c.push(h("path", { d: "M69.4,226V270.6M96.6,226V270.6M69.4,227.2H96.6M69.4,246H96.6M67.4,270.6H98.6", fill: "none", stroke: COLORS.ink, strokeWidth: r1(2 + 2 * LINE) }));
      c.push(h("path", { d: "M69.4,227.2V270.6M96.6,227.2V270.6M69.4,227.2H96.6M69.4,246H96.6M68.6,270.6H97.4", fill: "none", stroke: D.supAlu, strokeWidth: 2 }));
      c.push(h("circle", { cx: 72.4, cy: 275, r: 2.6, fill: COLORS.ink }), h("circle", { cx: 93.6, cy: 275, r: 2.6, fill: COLORS.ink }));
      return c;
    })()));
    // guide posts either side of the dock
    [212.5, 344.5].forEach(function (bx) {
      out.push(h("rect", { x: bx, y: 239, width: 7.4, height: G - 239, rx: 2, fill: D.supSafety, stroke: COLORS.ink, strokeWidth: LINE }));
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
      h("g", { "data-cache": "supplier-" + mk, "data-box": "-44 14 416 274" }, out),
      h("g", null, shut),
      h("g", null, front));
  }
