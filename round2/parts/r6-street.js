//== REPLACE from "  /* ---- round 2 street furniture ---- */" to "  /* ---- Scene12World.tsx ---- */"
  /* ---- The street of scenes 01 and 02, round 6 (2026-11-15): drawn again from a blank page ----
     One straight-on elevation of a Tokyo back street, back to front:
       the utility poles and their lines (in the near city layer, 0.52x),
       the pavement (its far edge in the sun, one unbroken yellow tactile strip), the kerb stone, the
       concrete gutter with a drain grate here and there, the carriageway (asphalt, long centre dashes, the
       near lane one tone down: the film's dark anchor),
       the road lamps at the kerb, the vending corner at the back of the pavement (all with the camera, 1x),
       and the pedestrian guard fence on the near pavement (1.07x), a row of pipe hoops.

     What is seen, and so where things stand (the buildings and the trucks stand in front of all of it):
       scene 01 shows world x -200..1720; the supplier covers -30..730 and the parked truck 760..1114.
       A 390 px phone sees only 444..991 there: the dock and the truck's box. Scene 02 shows 1900..3820
       and the warehouse covers all of it. So the furniture is composed for the open stretch between the
       two buildings (the right of scene 01 on a desktop, and the pan), one of each and none behind a
       building: truck | lamp | vending corner | Tokyo Tower | pole, then one more lamp before the
       warehouse, and one at the far left of scene 01. The round 2 street had 11 lamps, 7 of them
       never seen.
       The poles are 640 apart, so one stands behind the truck's box where a phone sees its head and the
       lines above the truck (screen x 1158 in scene 01), the next right of the Tower (1798), and the one
       before it is hidden by the supplier; in scene 02 they are all behind the warehouse.
     What the site lays over the foot of the picture: a desktop has its caption on stage y 925..993 (x 160..575)
       and its progress track on 956..964; a phone has the track on 972..982 and the caption on 1027..1055.
       So the only pale paint on the road, the centre dashes, is on y 934..939, above both tracks, and the
       dashes repeat every 300 px: the camera travels 2100 px between the two scenes, a whole number of
       dashes, so in both scenes the caption's number and name (world x -40..56 and 2060..2156) stand
       over a gap. Everything under y 940 is dark and plain.
     Heights: a lamp is 277 px (the old one 192) and ends at y 617, under the site's sub-copy (it ends at
       610); a pole is 240 (the old one 176). Nothing here reaches a roofline.
     Everything is static: built once, the node list never changes shape. */
  // colours the other scenes read too (the expressway, the finale's road): unchanged
  DAY.poleLit = "#9fb2cb"; DAY.poleDark = "#4d5f7a"; DAY.lampLens = "#e3ebf4";
  DAY.utilityLit = "#7f92b2"; DAY.utilityDark = "#3f5175"; DAY.wireFlat = "#6b7da0"; DAY.guardBand = "#cdb84f";
  DAY.walkLit = "#d6dae0"; DAY.walkShade = "#a3abb6"; DAY.curbShade = "#7f8994"; DAY.tactile = "#dcc152";
  DAY.roadLine = "#757b82"; DAY.roadDash = "#b9bdc1";
  DAY.fgBand = "#222a37"; DAY.fgEdge = "#3b4759"; DAY.fgRail = "#1b2638"; DAY.fgRailLit = "#4b5b76";
  // the street's own
  DAY.stSteel = "#b3c0d5";         // lamp columns: galvanised steel (the expressway's gantry is the same metal)
  DAY.stSteelLit = "#e4eaf2";      // ... the side the sun is on
  DAY.stSteelShade = "#8898b4";    // ... the side away from it
  DAY.stSteelDark = "#4d5f7a";     // clamps, straps, the lens seen from the side
  DAY.stInk = "#26344f";           // the outline of things that are not Sanpou's
  DAY.vendWhite = "#f4f7fb";       // the white vending machine
  DAY.vendWhiteShade = "#d5dfee";  // ... white in shade (periwinkle)
  DAY.vendBlue = "#3d6fb0";        // the blue one
  DAY.vendBlueLit = "#6f9bd2";
  DAY.vendBlueShade = "#2b5690";
  DAY.vendGlass = "#c4d9ef";       // the display windows
  DAY.vendShelf = "#eef3f9";       // shelf strips, the small displays, the flaps' push plates
  DAY.vendDark = "#26344f";        // payment panels, flaps, feet, the bin's holes
  DAY.vendBin = "#c3cfe1";         // the bin for empties
  DAY.vendBottle = ["#2f4a7c", "#4f86c6", "#8dbbe6", "#f0b440", "#f7f9fb"];   // navy, blue, sky, amber, white: no vermilion on the street

  /* where things stand (world x, except the poles: near-city layer x) */
  var STREET = {
    LAMPS: [-176, 1150, 1770], LAMP_Y: 14,      // lamps stand at the kerb, 14 px in front of the building line
    VEND_X: 1178, VEND_Y: 2,                    // the vending corner: at the back of the pavement
    POLE_X0: -226, POLE_N: 6, POLE_GAP: 640, POLE_H: 240,
    DASH_X: 100, DASH_W: 130, DASH_P: 300, DASH_Y: 54,
    GRATES: [-350, 130, 640, 1420, 1960, 2550, 3070, 3600, 4100]   // drain grates: clear of where the trucks stand in both scenes
  };
  var _stArt = null;
  function streetArt() {
    if (_stArt) return _stArt;
    var D = DAY, G = GROUND, S = STREET, A = {}, i;
    var n1 = function (v) { return Math.round(v * 10) / 10; };
    var R = function (x, y, w, hh) { return "M" + n1(x) + "," + n1(y) + "h" + n1(w) + "v" + n1(hh) + "h" + n1(-w) + "z"; };
    var RR = function (x, y, w, hh, r) {
      var c = "a" + r + "," + r + " 0 0 1 ";
      return "M" + n1(x + r) + "," + n1(y) + "h" + n1(w - 2 * r) + c + r + "," + r + "v" + n1(hh - 2 * r) + c + (-r) + "," + r + "h" + n1(2 * r - w) + c + (-r) + "," + (-r) + "v" + n1(2 * r - hh) + c + r + "," + (-r) + "z";
    };
    var C = function (cx, cy, r) { return "M" + n1(cx - r) + "," + n1(cy) + "a" + r + "," + r + " 0 1 0 " + n1(2 * r) + ",0a" + r + "," + r + " 0 1 0 " + n1(-2 * r) + ",0z"; };
    // a polygon, moved by (ox, oy)
    var P = function (pts, ox, oy) { return "M" + pts.map(function (p) { return n1(p[0] + (ox || 0)) + "," + n1(p[1] + (oy || 0)); }).join("L") + "z"; };
    var F = function (fill, d) { return h("path", { d: d, fill: fill }); };
    var FO = function (fill, d, w) { return h("path", { d: d, fill: fill, stroke: D.stInk, strokeWidth: w, strokeLinejoin: "round" }); };

    /* =================================== the ground =================================== */
    var X0 = -400, XW = WORLD_W + 800, dash = "", grate = "", shade = "";
    for (i = -1; i < 17; i++) dash += R(S.DASH_X + i * S.DASH_P, G + S.DASH_Y, S.DASH_W, 5);
    S.GRATES.forEach(function (gx) { grate += R(gx, G + 25.8, 46, 4.4); });
    // flat contact shadows on the paving, falling down and to the left: the lamps' feet, the vending corner
    S.LAMPS.forEach(function (lx) { shade += P([[-9, 0], [9, 0], [3, 3], [-17, 3]], lx, G + S.LAMP_Y); });
    shade += P([[-2, 0], [150, 0], [143, 5], [-11, 5]], S.VEND_X, G + S.VEND_Y);
    A.ground = [
      h("rect", { x: X0, y: G, width: XW, height: 17, fill: D.walk }),            // the paving
      F(D.walkLit, R(X0, G, XW, 2.5) + R(X0, G + 17, XW, 3)),                     // its far edge in the sun; the kerb stone's top
      h("rect", { x: X0, y: G + 7, width: XW, height: 5, fill: D.tactile }),      // the tactile strip, unbroken
      F(D.walkShade, shade),
      h("rect", { x: X0, y: G + 20, width: XW, height: 5, fill: D.curbShade }),   // the kerb's face
      h("rect", { x: X0, y: G + 25, width: XW, height: 6, fill: D.curb }),        // the concrete gutter
      h("rect", { x: X0, y: G + 31, width: XW, height: 73, fill: D.road }),       // the carriageway
      F(D.roadEdge, R(X0, G + 104, XW, 196) + grate),                             // the near lane, one tone down; the drain grates
      F(D.roadDash, dash)                                                         // the centre line
    ];

    /* =================================== the road lamps ===================================
       A tapered column on a bolted skirt, a straight arm raked up toward the road, a slim LED head that
       levels out, the lamp's switch box strapped to the column at hand height. Off in daylight.
       Local: x 0 is the column's axis, y 0 the paving it stands on. */
    var lampA = "", lampB = "", lampLit = "", lampShade = "", lampDark = "";
    S.LAMPS.forEach(function (lx) {
      var ly = G + S.LAMP_Y, Q = function (pts) { return P(pts, lx, ly); };
      lampA += Q([[-9, 0], [9, 0], [9, -6], [6, -11], [6, -24], [-6, -24], [-6, -11], [-9, -6]])                    // the skirt
        + Q([[-4.8, -24], [-3.2, -240], [3.2, -240], [4.8, -24]])                                                   // the column
        + Q([[-1.3, -245.3], [64.9, -269.9], [67.1, -264.1], [1.3, -238.7]]);                                       // the arm
      lampB += Q([[57.6, -273.4], [113.9, -279.2], [114.9, -274], [59.6, -261.6]])                                  // the head
        + RR(lx - 5.2, ly - 252, 10.4, 20, 2.4)                                                                     // the sleeve the arm is clamped in
        + RR(lx - 8.5, ly - 114, 17, 36, 2);                                                                        // the switch box
      lampLit += Q([[1.2, -25], [0.8, -239], [2.2, -239], [3.8, -25]])                                              // the column's sunny side
        + Q([[-0.6, -243.4], [65, -267.8], [65.7, -266], [0.1, -241.6]])                                            // the arm's top
        + Q([[58.6, -272.3], [113.5, -278], [113.8, -276.1], [58.9, -270.2]])                                       // the head's top
        + R(lx + 1, ly - 251, 3, 18)                                                                                // the sleeve's sunny side
        + R(lx - 7.5, ly - 113, 15, 2.6) + R(lx - 5, ly - 23, 10, 2.2);                                             // the box's top, the skirt's shoulder
      lampShade += Q([[-3.8, -25], [-2.2, -239], [-0.8, -239], [-1.4, -25]])                                        // the column's far side
        + R(lx - 7.5, ly - 110.4, 3.2, 31.4) + R(lx - 7.5, ly - 82.4, 15, 3.4)                                      // the box: its far side and foot
        + Q([[-8, -1], [8, -1], [8, -5.6], [-8, -5.6]]);                                                            // the skirt's flange
      lampDark += R(lx - 5.8, ly - 235.4, 11.6, 3.4)                                                                // the sleeve's clamp ring
        + R(lx - 6.4, ly - 119, 12.8, 3.4) + R(lx - 6.4, ly - 76.4, 12.8, 3.4)                                      // the box's two straps
        + R(lx + 2.6, ly - 100, 3, 7)                                                                               // its latch
        + Q([[72, -264.2], [111.6, -272.8], [111.1, -275.6], [71.5, -267]]);                                        // the lens, seen from the side
    });
    A.lamps = [FO(D.stSteel, lampA, 2), FO(D.stSteel, lampB, 2), F(D.stSteelShade, lampShade), F(D.stSteelLit, lampLit), F(D.stSteelDark, lampDark)];

    /* =================================== the vending corner ===================================
       Two plain machines seen square on (a wide white one, a narrower blue one a head lower) and the bin
       for empties. Each: a display window with three shelves of sample bottles and one diagonal of sky
       across the glass, a payment panel with its small display, the delivery flap with its push plate,
       feet. No lettering. Local: x 0 is the white machine's left side, y 0 the paving. */
    var vx = S.VEND_X, vy = G + S.VEND_Y, bot = ["", "", "", "", ""], shelf = "";
    var wins = [{ x: 5, y: -106, w: 56, hh: 56, n: 5, p: 10.4, o: 3.4, k: 0 }, { x: 75, y: -98, w: 40, hh: 52, n: 4, p: 9.5, o: 2.25, k: 2 }];
    wins.forEach(function (w) {
      var rh = w.hh / 3;
      for (var r = 0; r < 3; r++) {
        var top = w.y + r * rh;
        shelf += R(vx + w.x, vy + top + rh - 3.4, w.w, 3.4);
        for (var c = 0; c < w.n; c++) {
          var bx = vx + w.x + w.o + c * w.p, by = vy + top + 2.4, k = (c * 2 + r * 3 + w.k) % 5;
          bot[k] += R(bx + 2, by, 3, 3.2) + R(bx, by + 3, 7, rh - 8.8);       // a cap and a body
        }
      }
    });
    A.vending = h("g", { "data-cache": "street-vending", "data-box": (vx - 14) + " " + (vy - 116) + " 170 126" },
      FO(D.vendWhite, RR(vx, vy - 112, 66, 110, 3), 2),
      FO(D.vendBlue, RR(vx + 70, vy - 104, 50, 102, 3), 2),
      FO(D.vendBin, RR(vx + 126, vy - 46, 24, 44, 2.5), 2),
      F(D.vendWhiteShade, R(vx + 1, vy - 7, 64, 4) + R(vx + 5, vy - 46, 30, 2.2) + R(vx + 127, vy - 8, 22, 5)),          // the kick plate, the ledge under the window; the bin's foot
      F(D.vendBlueLit, R(vx + 72, vy - 102.6, 46, 2.2) + R(vx + 75, vy - 42, 16, 14)),                                   // the top edge in the sun; a plain panel
      F(D.vendBlueShade, R(vx + 71, vy - 8, 48, 5)),
      FO(D.vendGlass, R(vx + 5, vy - 106, 56, 56) + R(vx + 75, vy - 98, 40, 52), 1.5),                                   // the two windows
      bot.map(function (d, k) { return F(D.vendBottle[k], d); }),
      F(D.vendDark, RR(vx + 40, vy - 45, 20, 18, 2) + RR(vx + 8, vy - 23, 50, 15, 2.5) + R(vx + 5, vy - 2, 9, 2) + R(vx + 52, vy - 2, 9, 2)   // payment panel, flap, feet
        + RR(vx + 96, vy - 41, 16, 17, 2) + RR(vx + 76, vy - 21.4, 38, 14, 2.5) + R(vx + 74, vy - 2, 8, 2) + R(vx + 108, vy - 2, 8, 2)
        + C(vx + 133, vy - 31, 3.4) + C(vx + 143, vy - 31, 3.4)),                                                         // the bin's two holes
      F(D.vendShelf, shelf + R(vx + 43, vy - 42, 11, 5) + R(vx + 44, vy - 33.4, 12, 2) + R(vx + 11, vy - 20.6, 44, 2.6)   // shelf strips; a small display, the coin slot, the flap's push plate
        + R(vx + 99, vy - 38, 10, 4.6) + R(vx + 99, vy - 30, 10, 2) + R(vx + 79, vy - 19, 32, 2.6) + R(vx + 128, vy - 44.8, 20, 2.4)),
      h("path", { d: P([[38, -105.2], [50, -105.2], [27.4, -50.8], [15.4, -50.8]], vx, vy) + P([[97, -97.2], [105, -97.2], [85.6, -46.8], [77.6, -46.8]], vx, vy), fill: "rgba(255,255,255,0.36)" })   // one diagonal of sky on each glass
    );

    /* =================================== the utility poles (near city layer) ===================================
       電柱: a tapered concrete pole, one crossarm on two braces with an insulator at each end and one on the
       pole's tip, three conductors; a pole transformer on every other pole, a second short arm on the
       others; under that the heavier communication cable with its splice case; a yellow guard sleeve at
       the foot. Local: x 0 the pole's axis, y 0 the ground. */
    var T = -S.POLE_H, gp = S.POLE_GAP, dShaft = "", dLit = "", dDark = "", dBand = "", dW = "", dC = "";
    for (i = 0; i < S.POLE_N; i++) {
      var px = S.POLE_X0 + i * gp, Qp = function (pts) { return P(pts, px, G); };
      dShaft += Qp([[-5.5, 0], [-3.2, T], [3.2, T], [5.5, 0]]);
      dLit += Qp([[1.8, 0], [1, T + 2], [3.2, T + 2], [5.5, 0]])
        + R(px - 2.5, G + T - 8, 5, 8) + R(px - 21.5, G + T + 3, 5, 9) + R(px + 16.5, G + T + 3, 5, 9);             // three insulators
      dDark += R(px - 23, G + T + 12, 46, 5)                                                                        // the crossarm
        + Qp([[-17.5, T + 17], [-14, T + 17], [-3, T + 31], [-3, T + 35.4]]) + Qp([[17.5, T + 17], [14, T + 17], [3, T + 31], [3, T + 35.4]]);   // its braces
      if (i % 2 === 0) {
        dDark += RR(px - 11, G + T + 42, 22, 32, 3);                                                                // the transformer's tank
        dLit += R(px - 8.5, G + T + 39, 17, 3.4) + R(px - 7, G + T + 32.6, 4, 6.4) + R(px + 3, G + T + 32.6, 4, 6.4)   // its lid and two bushings
          + R(px + 6.4, G + T + 45.4, 2.8, 25.6);                                                                   // the tank's sunny side
        dShaft += R(px - 11, G + T + 55, 17.4, 3.2);                                                                // its hanger band
      } else {
        dDark += R(px - 14, G + T + 46, 28, 4.4);                                                                   // the low-voltage arm
        dLit += R(px - 13, G + T + 39, 4.4, 7) + R(px + 8.6, G + T + 39, 4.4, 7);
      }
      dBand += R(px - 6.2, G - 46, 12.4, 13) + R(px - 6.2, G - 27, 12.4, 13);                                       // the guard sleeve: yellow, a dark band, yellow
      dDark += R(px - 6.2, G - 33, 12.4, 6);
      if (i < S.POLE_N - 1) {
        var nx = px + gp, mx = px + gp / 2;
        [[-19, 3, 40], [0, -8, 30], [19, 3, 40]].forEach(function (w) { dW += "M" + (px + w[0]) + "," + (G + T + w[1]) + "Q" + (mx + w[0]) + "," + (G + T + w[1] + w[2]) + " " + (nx + w[0]) + "," + (G + T + w[1]); });
        dC += "M" + px + "," + (G + T + 80) + "Q" + mx + "," + (G + T + 80 + 44) + " " + nx + "," + (G + T + 80);
        // the splice case hangs on the cable 46 px along (the cable has dropped 2*t*(1-t)*44 there)
        var tt = 46 / gp;
        dDark += RR(px + 33, n1(G + T + 80 + 2 * tt * (1 - tt) * 44 - 1), 26, 8, 3);
      }
    }
    A.poles = h("g", null,
      h("path", { d: dW, fill: "none", stroke: D.wireFlat, strokeWidth: 2 }),
      h("path", { d: dC, fill: "none", stroke: D.wireFlat, strokeWidth: 3.4 }),
      F(D.utility, dShaft), F(D.utilityDark, dDark), F(D.utilityLit, dLit), F(D.guardBand, dBand));

    /* =================================== the guard fence (foreground, 1.07x) ===================================
       横断防止柵: pipe hoops on the near pavement, each with one mid rail, a gap between one hoop and the
       next. The darkest thing in the picture; only the sun along each hoop's top is lighter. A desktop
       sees it down to y 1020 (the hoops' tops and shoulders), a phone all of it, under its caption: the
       mid rail (y 1021..1027) ends where that caption begins and the near kerb (1056) starts under it, so
       only the hoops' dark legs pass behind the words. */
    var FX0 = -600, FW = WORLD_W * 1.1 + 1200, hoop = "", mid = "", hi = "";
    for (i = 0; i < 34; i++) {
      var xl = FX0 + i * 192 + 16.5, xr = xl + 159;
      hoop += "M" + xl + ",1062V1020Q" + xl + ",1006 " + (xl + 14) + ",1006H" + (xr - 14) + "Q" + xr + ",1006 " + xr + ",1020V1062";
      mid += R(xl, 1021, 159, 6);
      hi += R(xl + 16, 1001.5, 127, 3);
    }
    A.fence = [
      h("path", { d: hoop, fill: "none", stroke: D.fgRail, strokeWidth: 9 }),
      F(D.fgRail, mid),
      F(D.fgRailLit, hi),
      h("rect", { x: FX0, y: 1056, width: FW, height: 24, fill: D.fgBand }),      // the near pavement, in shade
      h("rect", { x: FX0, y: 1056, width: FW, height: 4, fill: D.fgEdge })        // its kerb's top
    ];
    return _stArt = A;
  }
//== REPLACE from "          UtilityPoles(-120, 12, 360, GROUND, 176)" to "        CityHaze(\"wHazeNear\", GROUND, 1),"
          streetArt().poles
        ),
//== REPLACE from "          // paving with its sunlit edge and tactile strip, the kerb, the carriageway and its markings" to "          FloatingParticles({ seed: \"world-a\""
          // the street, round 6: the paving, the kerb and its gutter, the carriageway; the lamps at the kerb; the vending corner
          streetArt().ground, streetArt().lamps, streetArt().vending,
//== REPLACE from "        // the foreground: a pipe guard rail on the near kerb" to "      h(\"div\", { style: { opacity: 1 - panK } }, SceneTitle("
        // the foreground: the pedestrian guard fence on the near pavement, the darkest thing in the picture, framing its foot
        h("g", { transform: "translate(" + (-cam * 1.07) + ", 0)" }, streetArt().fence)
      ),
