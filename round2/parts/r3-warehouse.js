//== REPLACE from "  var WAREHOUSE_W = 720" to "  /* ---- cards.tsx ---- */"
  /* The Sanpou distribution centre of scene 02, round 3: drawn again from a blank page as a working depot,
     in ONE straight-on elevation (every edge vertical or horizontal, one face).
     Local units (x 1.9 on screen), the ground at y 0, heights going up are negative y. WAREHOUSE_X is local
     x 0. Left to right: a long white hall of insulated panels (three dock doors under one slim canopy, the
     name on a raised band, a strip of high windows), a taller glazed office block, and a low open wing where
     the forklift works. WAREHOUSE_W is the length of the whole front; WAREHOUSE_BAYS are the left jambs of
     the three dock doors, BAY_W x BAY_H the clear opening (BAY_Y is its head). A truck stands with its rear
     15 px right of its door's right jamb (dockRear), so the doors are spaced one truck apart: every truck
     stands clear of the next door, and the last one stands clear of the wing. */
  var WAREHOUSE_W = 1020, WAREHOUSE_BAYS = [0, 276, 546], BAY_W = 74, BAY_H = 112, BAY_Y = -112;
  function bayWorldX(x, scale, i) { return x + WAREHOUSE_BAYS[i] * scale; }
  DAY.whWall = "#f7f9fb"; DAY.whWallShade = "#d7e1f0";                                  // the hall: white insulated panels, and white in shade
  DAY.whJoint = "#e0e7f1"; DAY.whJointShade = "#c2cfe3";                                // panel joints
  DAY.whTrim = "#23344f"; DAY.whTrimLit = "#42598a";                                    // copings and the canopy: navy
  DAY.whBase = "#2f4266"; DAY.whBaseLit = "#4a618c"; DAY.whBaseShade = "#25365a";       // the base course
  DAY.whSign = "#101f36"; DAY.whSignLit = "#33466b"; DAY.whSignRule = "#5b6c8c"; DAY.whSignSub = "#dfe4ec";
  DAY.whFrame = "#3a4f77"; DAY.whFrameShade = "#2c3e63";                                // door portals, window frames, conveyor frames
  DAY.whSteelLit = "#dfe6f0"; DAY.whSteelShade = "#5d6f8d"; DAY.whSteel = "#8496b0";    // rollers, leveller plates, wheel rims
  DAY.whShut = "#e7edf5"; DAY.whShutLine = "#c3cfe1"; DAY.whShutShade = "#cdd8e8"; DAY.whShutBar = "#7b8eab";
  DAY.whGlass = "#bcd6ef"; DAY.whGlassHi = "#e8f2fb"; DAY.whGlassIn = "#9bbbdd"; DAY.whGlassShade = "#a3c1e2";
  DAY.whBlind = "#eef3f9"; DAY.whBlindShade = "#d2dcea";
  DAY.whAlu = "#e6edf6"; DAY.whAluLit = "#ffffff"; DAY.whAluShade = "#c4d0e3";          // sun shades and sills
  DAY.whIn = "#5874a4"; DAY.whInShade = "#48628f";                                      // inside, in cool shade; deeper under the door head
  DAY.whFloor = "#93a8c8"; DAY.whFloorLit = "#e9eef6";                                  // the floor inside: in shade, and where the sun falls in
  DAY.whRack = "#3a5283"; DAY.whRackNear = "#273b66";                                   // racking in silhouette
  DAY.whStock = "#a8bbd8"; DAY.whStockLit = "#cad7ea";                                  // stock on the racks, seen in shade
  DAY.whNearStock = "#dbe4f1";
  DAY.whPallet = "#3f5f9e"; DAY.whPalletFar = "#34508a";
  DAY.whRubber = "#141d2e"; DAY.whSafety = "#f2c14e";
  DAY.whApron = "#d9dde3"; DAY.whApronShade = "#a9b1bc"; DAY.whApronJoint = "#c1c7cf";
  DAY.whFkBody = "#f4f7fb"; DAY.whFkGlass = "#2c416b"; DAY.whFkGlassHi = "#4c6798";     // the forklift: white, navy, dark glass
  DAY.whFkMast = "#44546f"; DAY.whFkMastLit = "#9aabc4"; DAY.whFkFork = "#1c2840";

  var WH_FORK = 1.12;        // the forklift is drawn in its own units, this many of the building's
  var _whArt = null;
  function warehouseArt() {
    if (_whArt) return _whArt;
    var D = DAY, INK = COLORS.ink, back = [], front = [], text = [];
    var X0 = -20, TX0 = 636, TX1 = 812, AX1 = WAREHOUSE_W + X0, HH = 232, TH = 305, AH = 136, BC = 14, FX0 = 818, T = TX0;
    var FW = 1.6, LINE = 1.2, bays = WAREHOUSE_BAYS, BW = BAY_W, BH = BAY_H;
    function r1(v) { return Math.round(v * 10) / 10; }
    // a level rectangle: its left, the height of its foot above the ground, its width, its height -> [x, y, w, h]
    function B(x, foot, w, ht) { return [x, -(foot + ht), w, ht]; }
    function rd(q) { return "M" + r1(q[0]) + "," + r1(q[1]) + "h" + r1(q[2]) + "v" + r1(q[3]) + "h" + r1(-q[2]) + "z"; }
    function rds(list) { var d = ""; for (var k = 0; k < list.length; k++) d += rd(list[k]); return d; }
    function fill(list, d, colour) { if (d) list.push(h("path", { d: d, fill: colour })); }

    // the strips of shade, each a level rectangle straight under (or beside) what throws it
    var SH = [
      B(X0, HH - 8, TX0 - X0, 3), B(TX0, TH - 8, TX1 - TX0, 3), B(TX1, AH - 8, AX1 - TX1, 3),   // under the three copings
      B(10, 165.4, 320, 3.6),                                                                   // under the name band
      B(X0 + 6, 117, TX0 - X0 - 12, 10),                                                        // under the dock canopy
      B(TX0 - 5, BC, 5, HH - BC - 5),                                                           // beside the office block, which stands proud
      B(420, 198.6, 192, 5.4), B(418, 168.8, 196, 2.6),                                         // under the high windows' sun shade and sill
      B(T + 46, 272, 116, 6), B(T + 46, 172, 116, 6),                                           // under the office sun shades
      B(T + 44, 226.8, 120, 2.6), B(T + 44, 126.8, 120, 2.6),                                   // under their sills
      B(T + 76, 50, 64, 6)                                                                      // under the entrance canopy
    ];
    bays.forEach(function (bx) { SH.push(B(bx - 6, 108.4, BW + 12, 3.6), B(bx + BW / 2 - 16, 139.8, 32, 2.2)); });   // under each shutter housing and number plate
    function cast(q) {
      var d = "";
      for (var k = 0; k < SH.length; k++) {
        var s = SH[k], ax = Math.max(q[0], s[0]), ay = Math.max(q[1], s[1]), bx = Math.min(q[0] + q[2], s[0] + s[2]), by = Math.min(q[1] + q[3], s[1] + s[3]);
        if (bx - ax > 0.05 && by - ay > 0.05) d += rd([ax, ay, bx - ax, by - ay]);
      }
      return d;
    }
    // flat surfaces of one material, and whatever shade falls on them (one tone down)
    function tone(list, rects, colour, shade) {
      var s = "";
      rects.forEach(function (q) { s += cast(q); });
      fill(list, rds(rects), colour); fill(list, s, shade);
    }
    /* glazing: n panes in a thin frame. Per pane: hi (sky in the glass, as [where it meets the head, width]),
       inside (what stands behind the glass, as [from, to, height] along the foot), blind (how far a blind is down). */
    function glaze(list, x, foot, w, ht, n, spec) {
      var pw = (w - FW * (n + 1)) / n, y0 = -(foot + ht) + FW, ph = ht - 2 * FW, lean = Math.min(ph * 0.62, pw * 0.55);
      var panes = [], frame = [[x, -(foot + ht), w, FW], [x, -foot - FW, w, FW]], hi = "", inside = "", blind = [], sd = "", k, a;
      for (k = 0; k <= n; k++) frame.push([x + k * (pw + FW), y0, FW, ph]);
      for (k = 0; k < n; k++) {
        var px = x + FW + k * (pw + FW), s = (spec && spec[k]) || {};
        panes.push([px, y0, pw, ph]);
        for (a = 0; s.hi && a < s.hi.length; a++) hi += "M" + r1(px + s.hi[a][0]) + "," + r1(y0) + "h" + r1(s.hi[a][1]) + "l" + r1(-lean) + "," + r1(ph) + "h" + r1(-s.hi[a][1]) + "z";
        for (a = 0; s.inside && a < s.inside.length; a++) inside += rd([px + s.inside[a][0] * pw, y0 + ph - s.inside[a][2], (s.inside[a][1] - s.inside[a][0]) * pw, s.inside[a][2]]);
        if (s.blind) blind.push([px, y0, pw, s.blind]);
        sd += cast([px, y0, pw, ph]);
      }
      fill(list, rds(panes), D.whGlass); fill(list, inside, D.whGlassIn); fill(list, hi, D.whGlassHi); fill(list, sd, D.whGlassShade);
      if (blind.length) tone(list, blind, D.whBlind, D.whBlindShade);
      tone(list, frame, D.whFrame, D.whFrameShade);
    }

    /* ---- the apron: the depot's own concrete in front of the docks, laid in bays, with one level strip of
       contact shade under the building ---- */
    fill(back, rd([X0 - 28, 0, AX1 - X0 + 40, 8.42]), D.whApron);
    (function () {
      var d = rd([X0 - 28, 6.9, AX1 - X0 + 40, 1.52]);
      for (var jx = X0 - 28; jx < AX1; jx += 92) d += rd([jx, 0, 1.6, 8.42]);
      fill(back, d, D.whApronJoint);
    })();
    fill(back, rd([X0 - 6, 0, AX1 - X0 + 12, 3]), D.whApronShade);

    /* ---- the outline: ink behind the whole silhouette (hall, office block, wing) ---- */
    (function () {
      var OL = 2.4, OB = 1.2, p = [[X0 - OL, -HH - OL], [TX0 - OL, -HH - OL], [TX0 - OL, -TH - OL], [TX1 + OL, -TH - OL], [TX1 + OL, -AH - OL], [AX1 + OL, -AH - OL], [AX1 + OL, OB], [X0 - OL, OB]];
      fill(back, "M" + p.map(function (v) { return r1(v[0]) + "," + r1(v[1]); }).join("L") + "Z", INK);
    })();

    /* ---- the fronts: white panels with broad joints; a navy base course, navy copings ---- */
    tone(back, [B(X0, BC, TX0 - X0, HH - 5 - BC), B(TX0, BC, TX1 - TX0, TH - 5 - BC), B(TX1, BH, AX1 - TX1, AH - 5 - BH), B(TX1, BC, FX0 - TX1, BH - BC)], D.whWall, D.whWallShade);
    (function () {
      var j = [B(X0, 51.2, TX0 - X0, 1.6), B(X0, 89.2, TX0 - X0, 1.6), B(X0, 165.2, TX0 - X0, 1.6), B(TX0, 99.2, TX1 - TX0, 1.6), B(TX0, 199.2, TX1 - TX0, 1.6)];
      // upright joints: four panels between one door's centre line and the next
      for (var b = 0; b < 2; b++) for (var k = 0; k < 4; k++) j.push(B(bays[b] + BW / 2 + (bays[b + 1] - bays[b]) * k / 4 - 0.8, BC, 1.6, 213 - BC));
      j.push(B(bays[2] + BW / 2 - 0.8, BC, 1.6, 213 - BC));
      tone(back, j, D.whJoint, D.whJointShade);
    })();
    (function () {
      var seg = [[X0, bays[0] - 3.4], [bays[0] + BW + 3.4, bays[1] - 3.4], [bays[1] + BW + 3.4, bays[2] - 3.4], [bays[2] + BW + 3.4, FX0]], base = [], lit = [];
      seg.forEach(function (s) { base.push(B(s[0], 0, s[1] - s[0], BC)); lit.push(B(s[0], BC - 1.6, s[1] - s[0], 1.6)); });
      tone(back, base, D.whBase, D.whBaseShade);
      fill(back, rds(lit), D.whBaseLit);
    })();
    fill(back, rds([B(X0, HH - 5, TX0 - X0, 5), B(TX0, TH - 5, TX1 - TX0, 5), B(TX1, AH - 5, AX1 - TX1, 5)]), D.whTrim);
    fill(back, rds([B(X0, HH - 1.5, TX0 - X0, 1.5), B(TX0, TH - 1.5, TX1 - TX0, 1.5), B(TX1, AH - 1.5, AX1 - TX1, 1.5)]), D.whTrimLit);
    // the one vermilion line: the hall's fascia, under the coping
    tone(back, [B(X0, 213, TX0 - X0, 5)], COLORS.verm, D.parcelTapeShade);

    /* ---- the name, on a raised band ---- */
    fill(back, rd(B(10, 169, 320, 40)), D.whSign);
    fill(back, rd(B(10, 207.5, 320, 1.5)), D.whSignLit);
    fill(back, rd(B(171, 177, 1.5, 24)), D.whSignRule);
    text.push(h("text", { x: 34, y: -179.6, fontFamily: FONTS.lat, fontSize: 27, fontWeight: 800, fill: COLORS.paper, letterSpacing: 0.6 }, CONTENT.brand.nameLat));
    text.push(h("text", { x: 191, y: -182.6, fontFamily: FONTS.jp, fontSize: 17, fontWeight: 700, fill: D.whSignSub, letterSpacing: 1.5 }, CONTENT.brand.signSub));

    /* ---- a strip of high windows on the hall, under a slim sun shade ---- */
    glaze(back, 420, 174, 192, 30, 6, [{ hi: [[19, 6]] }, { hi: [[22, 3], [28, 1.8]] }, { hi: [[18, 7]] }, {}, { hi: [[21, 5]] }, { hi: [[17.5, 3], [24, 5]] }]);
    tone(back, [B(418, 204, 196, 3), B(418, 171.4, 196, 2.6)], D.whAlu, D.whAluShade);
    fill(back, rd(B(418, 205.8, 196, 1.2)), D.whAluLit);

    /* ---- the office block: a tall stair window, two ribbons of office glazing, the staff entrance ---- */
    fill(back, rd(B(T + 10, 24, 24, 266)), D.whGlass);
    fill(back, "M" + (T + 26) + ",-290h6l-15,60h-6z M" + (T + 30) + ",-196h4v10l-9,36h-6z M" + (T + 24) + ",-110h7l-13,52h-7z", D.whGlassHi);
    fill(back, rds([B(T + 10, 48.8, 24, 2.4), B(T + 10, 98.8, 24, 2.4), B(T + 10, 148.8, 24, 2.4), B(T + 10, 198.8, 24, 2.4), B(T + 10, 248.8, 24, 2.4)]), D.whGlassIn);
    tone(back, [B(T + 8.4, 22.4, 1.6, 269.2), B(T + 34, 22.4, 1.6, 269.2), B(T + 8.4, 22.4, 27.2, 1.6), B(T + 8.4, 290, 27.2, 1.6)], D.whFrame, D.whFrameShade);
    glaze(back, T + 46, 232, 116, 46, 4, [{ hi: [[16, 7]], inside: [[0, 0.6, 12]] }, { blind: 17, hi: [[18, 5]] }, { hi: [[15.5, 3], [21, 4.5]], inside: [[0.35, 1, 16]] }, { blind: 26 }]);
    glaze(back, T + 46, 132, 116, 46, 4, [{ blind: 22 }, { hi: [[17, 6]], inside: [[0.2, 0.9, 14]] }, { hi: [[20, 4]] }, { hi: [[15.5, 6.5]], inside: [[0, 0.5, 18]] }]);
    tone(back, [B(T + 44, 278, 120, 3), B(T + 44, 229.4, 120, 2.6), B(T + 44, 178, 120, 3), B(T + 44, 129.4, 120, 2.6)], D.whAlu, D.whAluShade);
    fill(back, rds([B(T + 44, 279.8, 120, 1.2), B(T + 44, 179.8, 120, 1.2)]), D.whAluLit);
    glaze(back, T + 84, 0, 48, 50, 2, [{ hi: [[10, 4]] }, { hi: [[11, 3]] }]);
    fill(back, rd(B(T + 76, 56, 64, 4.4)), D.whTrim);
    fill(back, rd(B(T + 76, 59, 64, 1.4)), D.whTrimLit);

    /* ---- inside the three docks and the open wing: cool shade, racking in silhouette with stock on it,
       pallets of cartons on the floor, the sun lying on the floor as one flat band ---- */
    (function () {
      var open = bays.map(function (bx) { return [bx, BW, [bx + 3.6, bx + 35.9, bx + 68.2], bx + 70.4]; });
      open.push([FX0, AX1 - FX0, [826, 858.3, 890.6], 892.8]);
      var PAT = [
        [[0.5, 0, 13, 12], [14.5, 0, 12.5, 9], [15.5, 9, 9.5, 8]],
        [[0.5, 0, 9, 15], [10.5, 0, 8.5, 10], [20, 0, 8, 13]],
        [[0.5, 0, 27, 8], [2, 8, 11, 9], [14, 8, 12, 7]],
        [[2, 0, 12, 11], [2, 11, 12, 8], [16.5, 0, 10.5, 14]],
        [[0.5, 0, 12.5, 16], [14, 0, 13.5, 12]],
        [[8, 0, 12, 10]]
      ];
      var LOAD = [
        [[0.6, 0, 13.4, 11.5], [14.6, 0, 13.4, 11.5], [0.6, 11.5, 13.4, 10], [15.6, 11.5, 9, 8]],
        [[0.6, 0, 27.4, 13], [3, 13, 11, 9], [15, 13, 11, 7]],
        [[0.6, 0, 13.4, 11.5], [14.6, 0, 13.4, 11.5], [0.6, 11.5, 13.4, 10], [14.6, 11.5, 13.4, 10]]
      ];
      // which pattern stands where: per opening, per cell, the three beam levels; and the load on each floor pallet
      var SET = [[[0, 3, 1], [2, 4, 5]], [[4, 1, 2], [3, 0, 4]], [[1, 2, 3], [0, 5, 1]], [[3, 4, 0], [1, 2, 4]]], FLOOR = [[0, 1], [2, 0], [1, 2], [0, 2]];
      var wall = [], floor = [], rack = [], pallet = [], stock = [], lit = [], deep = [];
      function put(list, cx, foot) { list.forEach(function (c) { stock.push(B(cx + c[0], foot + c[1], c[2] - 0.8, c[3] - 0.8)); lit.push(B(cx + c[0], foot + c[1] + c[3] - 2.4, c[2] - 0.8, 1.6)); }); }
      open.forEach(function (o, oi) {
        wall.push(B(o[0], 0, o[1], BH)); floor.push(B(o[0], 0, o[1], 4.2)); deep.push(B(o[0], 94, o[1], BH - 94));
        o[2].forEach(function (ux) { rack.push(B(ux, 4.2, 2.2, 96)); });
        [38, 62, 86].forEach(function (lv) { rack.push(B(o[2][0], lv, o[3] - o[2][0], 2)); });
        [0, 1].forEach(function (c) {
          var cx = o[2][c] + 3.2;
          pallet.push(B(cx + 0.4, 4.2, 27.8, 3));
          put(LOAD[FLOOR[oi][c]], cx, 7.2);
          [40, 64, 88].forEach(function (lv, li) { put(PAT[SET[oi][c][li]], cx, lv); });
        });
      });
      fill(back, rds(wall), D.whIn); fill(back, rds(floor), D.whFloorLit);
      fill(back, rds(rack), D.whRack); fill(back, rds(pallet), D.whPalletFar);
      fill(back, rds(stock), D.whStock); fill(back, rds(lit), D.whStockLit);
      back.push(h("path", { d: rds(deep), fill: D.whInShade, opacity: 0.55 }));
    })();
    // the working rack in the wing, seen from its end: two pallets of stock that stay, and between them the slot the forklift serves
    (function () {
      var box = [];
      function crate(x, foot, w, ht) { box.push(h("rect", { x: r1(x), y: r1(-(foot + ht)), width: w, height: ht, rx: 0.6, fill: D.whNearStock, stroke: INK, strokeWidth: 1 })); }
      fill(back, rds([B(918.8, 0.4, 31.4, 4.6), B(918.8, 94.4, 31.4, 4.4)]), D.whPallet);
      crate(919.6, 5, 14.6, 12.6); crate(934.8, 5, 14.6, 12.6); crate(919.6, 17.6, 14.6, 11); crate(934.8, 17.6, 14.6, 11); crate(923.6, 28.6, 17, 10);
      crate(919.6, 98.8, 14.6, 10); crate(934.8, 98.8, 14.6, 8.4);
      back.push(box);
    })();

    /* ---- the dock doors: a navy portal (jamb guides and the shutter housing), a number plate above the canopy ---- */
    (function () {
      var frame = [], plate = "";
      bays.forEach(function (bx, i) {
        frame.push(B(bx - 3.4, 0, 3.4, BH), B(bx + BW, 0, 3.4, BH), B(bx - 6, BH, BW + 12, 9));
        plate += rd(B(bx + BW / 2 - 16, 142, 32, 16));
        text.push(h("text", { x: bx + BW / 2, y: -146, textAnchor: "middle", fontFamily: FONTS.lat, fontSize: 11.5, fontWeight: 800, fill: COLORS.paper, letterSpacing: 1 }, "0" + (i + 1)));
      });
      tone(back, frame, D.whFrame, D.whFrameShade);
      fill(back, plate, D.whSign);
    })();
    // the canopy over the docks: one slim navy slab seen edge on, its top edge in the sun
    fill(back, rd(B(X0 + 6, 127, TX0 - X0 - 12, 7)), D.whTrim);
    fill(back, rd(B(X0 + 6, 132.5, TX0 - X0 - 12, 1.5)), D.whTrimLit);

    /* ---- a roller conveyor in each dock, its rollers at the height of a truck's floor ---- */
    (function () {
      var rail = [], roll = "";
      bays.forEach(function (bx) {
        rail.push(B(bx, 4.4, BW, 4), B(bx + 8, 0, 2.6, 4.4), B(bx + 35.7, 0, 2.6, 4.4), B(bx + 63.4, 0, 2.6, 4.4));
        for (var k = 0; k < 8; k++) { var cx = r1(bx + 4.6 + k * 9.25); roll += "M" + r1(cx - 1.6) + ",-6.4a1.6,1.6 0 1 0 3.2,0a1.6,1.6 0 1 0 -3.2,0"; }
      });
      fill(back, rds(rail), D.whFrame); fill(back, roll, D.whSteelLit);
    })();

    /* ---- in front of what moves: dock bumpers, guide posts, the leveller plate that reaches the truck,
       the working rack's frame ---- */
    (function () {
      var rubber = [], cap = [], post = [], band = "", plate = [], hinge = [];
      bays.forEach(function (bx) {
        [bx - 9.6, bx + BW + 4.2].forEach(function (x) { rubber.push(B(x, 0.6, 5.4, 12)); cap.push(B(x, 11, 5.4, 1.6)); });
        [bx - 15.8, bx + BW + 11].forEach(function (x) {
          post.push(h("rect", { x: r1(x), y: -24, width: 4.6, height: 24, rx: 1.6, fill: D.whSafety, stroke: INK, strokeWidth: LINE }));
          band += rd(B(x, 7, 4.6, 3.8)) + rd(B(x, 15, 4.6, 3.8));
        });
        plate.push(B(bx + BW - 8, 6.6, 15.9, 1.8)); hinge.push(B(bx + BW + 3.4, 3.4, 3, 4.2));
      });
      fill(front, rds(rubber), D.whRubber); fill(front, rds(cap), D.whBaseLit);
      front.push(post); fill(front, band, INK);
      fill(front, rds(hinge), D.whSteelShade); fill(front, rds(plate), D.whSteelLit);
      fill(front, rds([B(915, 0, 3.4, 110), B(950.4, 0, 3.4, 110), B(915, 49.6, 38.8, 2.4), B(915, 91.6, 38.8, 2.4), B(913.6, 0, 6.2, 1.6), B(949, 0, 6.2, 1.6)]), D.whRackNear);
    })();

    /* ---- the sectional shutter, drawn closed with its foot on the ground and its left edge at x 0 ---- */
    var shutter = [], sd = "", k;
    for (k = 1; k < 6; k++) sd += rd([0, -BH + k * BH / 6 - 0.8, BW, 1.6]);
    shutter.push(h("rect", { x: 0, y: -BH, width: BW, height: BH, fill: D.whShut }));
    shutter.push(h("path", { d: sd, fill: D.whShutLine }));
    shutter.push(h("path", { d: rd([0, -BH, BW, 3.6]), fill: D.whShutShade }));
    shutter.push(h("path", { d: rd([10, -BH + 2 * BH / 6 + 5.4, 14, 7]) + rd([30, -BH + 2 * BH / 6 + 5.4, 14, 7]) + rd([50, -BH + 2 * BH / 6 + 5.4, 14, 7]), fill: D.whGlassIn }));
    shutter.push(h("path", { d: rd([0, -6, BW, 6]), fill: D.whShutBar }));
    shutter.push(h("path", { d: rd([0, -1.4, BW, 1.4]) + rd([31, -4.6, 12, 1.8]), fill: D.whRubber }));

    /* ---- the forklift, side-on and facing right: local to its front axle on the ground. A counterbalance
       truck with an enclosed cab (dark glass), a two-stage mast, a fork carriage ---- */
    var BODY = "M-46,-11L-46,-23Q-46,-29 -40,-29L-11,-29L-7,-35L3,-35Q4.6,-35 4.6,-33.4L4.6,-9L-44,-9Q-46,-9 -46,-11Z", fk = {};
    fk.body = [
      h("path", { d: BODY, fill: D.whFkBody }),
      h("path", { d: "M-46,-11L-46,-23Q-46,-29 -40,-29L-34,-29L-34,-9L-44,-9Q-46,-9 -46,-11Z M-34,-13.4h38.6v4.4h-38.6z", fill: D.whTrim }),   // the counterweight and the chassis rail
      h("path", { d: "M-31,-22h23v3.8h-23z", fill: D.whSafety }),
      h("path", { d: BODY, fill: "none", stroke: INK, strokeWidth: LINE, strokeLinejoin: "round" }),
      h("rect", { x: -39, y: -60, width: 33.6, height: 31, rx: 2.4, fill: D.whFkBody, stroke: INK, strokeWidth: LINE }),
      h("rect", { x: -36.2, y: -56.2, width: 28, height: 27.2, rx: 1, fill: D.whFkGlass }),
      h("path", { d: "M-21,-56.2h6.5l-9,27.2h-6.5z M-12,-56.2h2.4l-9,27.2h-2.4z", fill: D.whFkGlassHi }),
      h("rect", { x: -41, y: -62.6, width: 40, height: 4, rx: 1.4, fill: D.whTrim, stroke: INK, strokeWidth: 1 })
    ];
    fk.mast = [
      h("rect", { x: 3.7, y: -68, width: 5.6, height: 65.4, rx: 0.8, fill: INK }),
      h("rect", { x: 4.5, y: -67.2, width: 4, height: 63.8, fill: D.whFkMast }),
      h("rect", { x: 6.6, y: -66.2, width: 1.3, height: 61.8, fill: D.whFkMastLit })
    ];
    fk.carriage = [
      h("rect", { x: 8.5, y: -24, width: 2.8, height: 26, rx: 0.6, fill: D.whTrim, stroke: INK, strokeWidth: 1 }),
      h("path", { d: "M8.5,0H37.6V0.5L35.8,1.5H8.5Z", fill: D.whFkFork })
    ];
    fk.wheel = [7.5, 6].map(function (r) {
      return {
        tyre: [h("circle", { r: r, fill: D.truckTyre }), h("circle", { r: r1(r * 0.56), fill: D.whSteel })],
        bar: h("path", { d: "M" + r1(-r * 0.5) + ",-0.9h" + r1(r) + "v1.8h" + r1(-r) + "z M-0.9," + r1(-r * 0.5) + "h1.8v" + r1(r) + "h-1.8z", fill: D.whSteelShade }),
        hub: h("circle", { r: r1(r * 0.2), fill: D.whSteelLit })
      };
    });
    // what it carries: a pallet (its left end at x 0, its foot at y 0) with four cartons, taped like the ones on the conveyors
    fk.load = [
      h("path", { d: "M0,-0.9h28v0.9h-28z M0,-3.5h3v2.6h-3z M12.5,-3.5h3v2.6h-3z M25,-3.5h3v2.6h-3z M0,-4.8h28v1.3h-28z", fill: D.whPallet }),
      h("rect", { x: 0.8, y: -16.2, width: 13, height: 11.4, rx: 0.6, fill: COLORS.paper, stroke: INK, strokeWidth: 1.1 }),
      h("rect", { x: 14.2, y: -16.2, width: 13, height: 11.4, rx: 0.6, fill: COLORS.paper, stroke: INK, strokeWidth: 1.1 }),
      h("rect", { x: 0.8, y: -26.2, width: 13, height: 10, rx: 0.6, fill: COLORS.paper, stroke: INK, strokeWidth: 1.1 }),
      h("rect", { x: 15, y: -24.2, width: 10, height: 8, rx: 0.6, fill: COLORS.paper, stroke: INK, strokeWidth: 1.1 }),
      h("path", { d: "M6.3,-15.65h2v10.3h-2z M19.7,-15.65h2v10.3h-2z M6.3,-25.65h2v8.9h-2z M19,-23.65h2v6.9h-2z", fill: COLORS.verm })
    ];

    return _whArt = {
      back: h("g", { "data-cache": "wh-back", "data-box": (X0 - 30) + " " + (-TH - 4) + " " + (AX1 - X0 + 46) + " " + (TH + 14) }, back),
      text: text,
      front: h("g", { "data-cache": "wh-front", "data-box": "-18 -112 976 114" }, front),
      shutter: shutter, fk: fk,
      clips: [bays.map(function (bx, i) { return h("clipPath", { id: "wBay" + i }, h("rect", { x: bx, y: -BH, width: BW, height: BH })); }),
        h("clipPath", { id: "wFork" }, h("rect", { x: FX0, y: -BH, width: AX1 - FX0, height: BH }))]
    };
  }

  /* The forklift's round, a loop of 14 s on the ambient clock (t in seconds). It works the rack at the right
     of the wing: it drives in from the hall with a pallet of cartons, raises it, sets it on the rack's middle
     beams, backs off, lowers its forks and reverses away; on its next visit it comes in empty and takes the
     pallet down again. So the rack is back where it began when the loop closes, and nothing ever pops.
     x is its front axle (building units), L the height of the fork tops (its own units); every move starts
     and stops with no jolt. */
  function whForkPose(t) {
    var u = ((t - 9.5) % 14 + 14) % 14;
    var S = function (a, b) { var k = clamp01((u - a) / (b - a)); return k * k * k * (k * (6 * k - 15) + 10); };
    return {
      u: u,
      x: 770.14 + 100 * (S(0, 1.9) - S(5.3, 7) + S(7, 8.9) - S(12.3, 14)) + 36 * (S(2.6, 3.5) - S(3.85, 4.7) + S(9.6, 10.5) - S(10.85, 11.7)),
      L: 8 + 43.3 * S(1.5, 2.8) - 2.5 * S(3.5, 3.9) - 40.8 * S(4.4, 5.6) + 40.8 * S(8.5, 9.8) + 2.5 * S(10.5, 10.9) - 43.3 * S(11.4, 12.6)
    };
  }
  function Warehouse(p) {
    var x = p.x, y = p.y, scale = p.scale == null ? 1.9 : p.scale, shutterOpen = p.shutterOpen, t = p.time || 0, opacity = p.opacity == null ? 1 : p.opacity;
    var art = warehouseArt(), fk = art.fk, K = WH_FORK;
    // the shutters: a sectional door is heavy. It gathers speed, runs, slows into the housing and settles
    var doors = WAREHOUSE_BAYS.map(function (bx, i) {
      var s = clamp01(shutterOpen[i]), u = 1 - Math.pow(1 - s, 1 / 3), k = u / 0.86, f;
      if (k < 0.22) f = 1.3514 * k * k / 0.44;
      else if (k < 0.7) f = 1.3514 * (k - 0.11);
      else if (k < 1) f = 1 - 1.3514 * (1 - k) * (1 - k) / 0.6;
      else { var v = Math.sin(Math.PI * (u - 0.86) / 0.14); f = 1 + 0.014 * v * v; }
      return h("g", { clipPath: "url(#wBay" + i + ")" }, h("g", { transform: "translate(" + bx + ", " + (-(BAY_H - 6) * f).toFixed(2) + ")" }, art.shutter));
    });
    // the forklift: its weight shows as a small pitch from its own acceleration while the forks are low
    var q = whForkPose(t), e = 0.05, acc = (whForkPose(t - e).x - 2 * q.x + whForkPose(t + e).x) / (e * e);
    var tilt = Math.max(-1.3, Math.min(1.3, -acc * 0.0045)) * clamp01((30 - q.L) / 15);
    var at = "translate(" + q.x.toFixed(2) + ", 0) scale(" + K + ")", rot = "rotate(" + tilt.toFixed(3) + " -16 -7)";
    var turn = function (r) { return "rotate(" + ((q.x / (r * K) * 57.2958) % 360).toFixed(1) + ")"; };
    // the pallet rides the forks, except while it stands in the rack (the forks set it down and pick it up at the same point)
    var inRack = q.u >= 3.5 && q.u < 10.85, foot = !inRack ? q.L - 3.5 : (q.u <= 3.9 || q.u >= 10.5) ? Math.max(q.L - 3.5, 46.4) : 46.4;
    var loadAt = inRack ? "translate(918.8, 0) scale(" + K + ") translate(0, " + (-foot).toFixed(2) + ")" : at + " " + rot + " translate(11.3, " + (-foot).toFixed(2) + ")";
    var wheel = function (i, cx) {
      var w = fk.wheel[i], r = i ? 6 : 7.5;
      return h("g", { transform: "translate(" + cx + ", " + (-r) + ")" }, w.tyre, h("g", { transform: turn(r) }, w.bar), w.hub);
    };
    return h("g", { transform: "translate(" + x + ", " + y + ") scale(" + scale + ")", opacity: opacity },
      h("defs", null, art.clips),
      art.back, art.text,
      h("g", { clipPath: "url(#wFork)" },
        h("rect", { x: (q.x - 53).toFixed(2), y: -4.2, width: 63, height: 4.2, fill: DAY.whFloor }),
        h("g", { transform: at },
          h("g", { transform: rot },
            fk.body,
            h("rect", { x: 5.3, y: (-(67.2 + (q.L - 8) * 0.5)).toFixed(2), width: 2.4, height: 54, fill: DAY.whFkMastLit, stroke: COLORS.ink, strokeWidth: 0.8 }),
            fk.mast,
            h("g", { transform: "translate(0, " + (-q.L).toFixed(2) + ")" }, fk.carriage)),
          wheel(0, 0), wheel(1, -33)),
        h("g", { transform: loadAt }, fk.load)),
      doors,
      art.front
    );
  }
  /* Cartons riding the dock conveyors into the three trucks (world coordinates, drawn over the trucks and cut
     at each truck's rear plane, so a carton goes into its truck). One even flow per dock: the line starts from
     rest behind the door's left jamb, runs at V px a frame and comes to rest again; four cartons, evenly spaced,
     cross into the truck, and one more is left standing on the conveyor for the next load. Each dock runs a
     little after the one before it; every crossing falls inside T_WORLD.loadParcels, after the truck's doors
     are open and before they close. */
  function DockCartons(frame) {
    var V = 5.4, A = 10, GAP = 62, T0 = [320, 327, 335], LAG = [0, GAP, 2 * GAP, 3 * GAP, 3 * GAP + 50 + V * A / 2 + 62];
    var ramp = function (tau) { if (tau <= 0) return 0; if (tau >= A) return tau - A / 2; var u = tau / A; return A * (u * u * u - u * u * u * u / 2); };
    var y = (GROUND - 8.4 * B_SCALE).toFixed(2);
    return [0, 1, 2].map(function (bay) {
      var ts = T0[bay] - 36, te = T0[bay] + (3 * GAP + 50) / V;
      var lead = dockRear(bay) - V * (T0[bay] - ts - A / 2) + V * (ramp(frame - ts) - ramp(frame - te));
      return h("g", { clipPath: "url(#clipB" + bay + ")" },
        h("g", { clipPath: "url(#wDock" + bay + ")" },
          LAG.map(function (lag) { return h("g", { transform: "translate(" + (lead - lag - 25).toFixed(2) + ", " + y + ")" }, parcelArt(50)); })));
    });
  }

//== INSERT before "          [0, 1, 2].map(function (i) { return h(\"clipPath\", { id: \"clipB\" + i }"
          // the conveyor cartons show from their dock's left jamb on (clipB then cuts them at the truck's rear)
          [0, 1, 2].map(function (i) { return h("clipPath", { id: "wDock" + i }, h("rect", { x: bayWorldX(WAREHOUSE_X, B_SCALE, i), y: -2000, width: 20000, height: 4000 })); }),

//== REPLACE from "          Warehouse({ x: WAREHOUSE_X" to "          [1, 2].map(function (i) {"
          Warehouse({ x: WAREHOUSE_X, y: GROUND, scale: B_SCALE, shutterOpen: [shutter(0), shutter(1), shutter(2)], time: skyTime }),

//== REPLACE from "          [0, 1, 2].map(function (bay) {" to "        // the foreground:"
          // cartons ride the dock conveyors into the three trucks
          DockCartons(frame)
        ),
