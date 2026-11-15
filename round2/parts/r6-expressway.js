//== REPLACE from "var _gbMemo = {};" to "function sceneTransit(frame) {"
  /* ---- The expressway of scene 03, round 6 (2026-11-15): drawn again from a blank page ----
     Everything the road is made of, in one straight-on elevation, back to front:
       the far parapet (a concrete wall with a steel rail on short posts, a joint every 150 px),
       the deck (two lanes of asphalt with a solid edge line under the parapet and long expressway dashes
       between them, a hard shoulder of darker asphalt, an expansion seam across the lanes every 900 px),
       the near kerb,
       the lamp columns (two between one gantry and the next, on plinths of the parapet),
       the sign gantry (an open steel truss between two columns; the boards are bolted to its face and
       stand above and below it, each on two rails with a lamp at its foot), the trucks (not ours),
       the gantry's near column, which passes in front of the trucks, and the near guard rail (1.25x).
     The gantry is galvanised steel in daylight with a soft navy outline: it used to be a navy slab.
     The boards are as wide as a phone can show whole (it sees about 548 px of this scene), their
     lettering is solid white and larger than it was, the roman under each name as on the real signs.
     The words are exactly the old ones.

     What repeats: the parapet's joints and posts every 150 px, the dashes every 180, the guard rail's
     posts every 175; lamps, expansion joints and the gantry every 2700 (= GTILE), on the gantry's own
     schedule (its far column's left face is local x 0, as it always was). Static bands are drawn once
     and never move; what scrolls is built once and moved by one transform. The node list has the same
     shape on every frame. */
  DAY.expSteel = "#b3c0d5";        // the gantry: galvanised steel
  DAY.expSteelLit = "#e4eaf2";     // ... the side the sun is on, the tops of its chords
  DAY.expSteelShade = "#8898b4";   // ... the side away from it, the undersides
  DAY.expInk = "#26344f";          // its outline: the softer ink of things that are not Sanpou's (no darker than the old gantry was)
  var _expArt = null;
  function expresswayArt() {
    if (_expArt) return _expArt;
    var D = DAY, ink = D.expInk, RY = ROAD_Y, A = {}, i, d;
    var n1 = function (v) { return Math.round(v * 100) / 100; };
    var R = function (x, y, w, hh) { return "M" + n1(x) + "," + n1(y) + "h" + n1(w) + "v" + n1(hh) + "h" + n1(-w) + "z"; };
    var RR = function (x, y, w, hh, r) {
      var c = "a" + r + "," + r + " 0 0 1 ";
      return "M" + n1(x + r) + "," + n1(y) + "h" + n1(w - 2 * r) + c + r + "," + r + "v" + n1(hh - 2 * r) + c + (-r) + "," + r + "h" + n1(2 * r - w) + c + (-r) + "," + (-r) + "v" + n1(2 * r - hh) + c + r + "," + (-r) + "z";
    };
    var P = function (pts) { return "M" + pts.map(function (p) { return n1(p[0]) + "," + n1(p[1]); }).join("L") + "z"; };
    var F = function (fill, dd) { return h("path", { d: dd, fill: fill }); };
    var FO = function (fill, dd, w) { return h("path", { d: dd, fill: fill, stroke: ink, strokeWidth: w, strokeLinejoin: "round" }); };
    var T = function (x, y, size, weight, font, sp, s, anchor) {
      return h("text", { x: x, y: y, fontFamily: font, fontSize: size, fontWeight: weight, fill: COLORS.white, letterSpacing: sp, textAnchor: anchor || "start", style: { textRendering: "geometricPrecision" } }, s);
    };
    /* Rows (stage y). The site lays its own white text and its progress track over the foot of the picture:
       on a desktop the caption is on y 925..993 and the track on 956..964, on a phone the track is on 971..982
       and the caption on 1020..1055. So nothing pale runs along y 918..995: the paint (the far edge line and
       the lane dashes) is above it, the near lane ends at SY in a step of tone only, where the hard shoulder's
       darker asphalt begins, and the kerb begins at KY. */
    var PT = 826, RT = 806, SY = RY + 96, KY = RY + 140;   // the parapet's top, the rail's top, where the lanes end, where the kerb begins

    // ---- what never moves: the bands that run the whole width
    A.deck = [
      F(D.walk, R(0, PT, 1920, RY - PT) + R(0, KY, 1920, 1080 - KY)),            // the parapet's face; the near kerb
      F(D.poleDark, R(0, RT, 1920, 6)),                                          // the rail on the parapet
      F(D.walkLit, R(0, PT, 1920, 4) + R(0, KY, 1920, 3)),                       // their tops in the sun
      F(D.walkShade, R(0, RY - 6, 1920, 6)),                                     // the parapet's foot
      h("rect", { x: 0, y: RY, width: 1920, height: SY - RY, fill: D.road }),    // the deck: two lanes
      F(D.roadEdge, R(0, RY, 1920, 4) + R(0, SY, 1920, KY - SY)),                // the parapet's contact shade on it; the hard shoulder
      F(D.roadDash, R(0, RY + 4, 1920, 4))                                       // the solid edge line under the parapet
    ];
    // ---- what repeats every 150 px along the parapet: a joint, and half-way to the next a post of the rail
    var dj = "", dp = "";
    for (i = 0; i < 15; i++) { dj += R(i * 150 - 1.5, PT + 4, 3, RY - PT - 4); dp += R(i * 150 + 72, RT + 6, 6, PT - RT - 6); }
    A.parJoints = dj; A.railPosts = dp;
    // ---- the near guard rail (1.25x): its posts every 175 px, and the beam and the band that never move
    d = "";
    for (i = 0; i < 13; i++) d += R(i * 175 - 6, 998, 12, 56);
    A.fgPosts = d;
    A.fg = [
      h("rect", { x: 0, y: 1008, width: 1920, height: 28, fill: D.fgRail }),     // the beam: two ridges, each catching the light along its top
      F(D.fgRailLit, R(0, 1008, 1920, 3.5) + R(0, 1023, 1920, 3)),
      h("rect", { x: 0, y: 1046, width: 1920, height: 34, fill: D.fgBand }),     // the deck's outer edge, framing the foot of the picture
      F(D.fgEdge, R(0, 1046, 1920, 4))
    ];

    // ---- what repeats every 2700 px, behind the trucks (local x: 0 is the left face of the gantry's far column)
    var JOINTS = [-1200, -300, 600], LAMPS = [-1050, -450];
    var jSlit = "", wShade = "", wBody = "", wLit = "", lPole = "", lLit = "", lDark = "", lLens = "";
    JOINTS.forEach(function (x) {
      jSlit += R(x - 2, RY, 4, SY - RY);
      wShade += R(x - 5, PT, 10, RY - PT) + R(x - 1.5, KY + 3, 3, 1080 - KY - 3);   // the joint's cover plate on the parapet, and the joint in the kerb
    });
    var plinth = function (x0, x1, top) {
      wBody += R(x0, top, x1 - x0, PT - top + 4); wLit += R(x0, top, x1 - x0, 4);
      wShade += R(x0 - 1.5, PT + 4, 3, RY - PT - 4) + R(x1 - 1.5, PT + 4, 3, RY - PT - 4);
    };
    plinth(-18, 46, 808);                                                        // under the gantry's far column
    LAMPS.forEach(function (x) {
      plinth(x - 22, x + 22, 814);
      // a lamp column: a tapered steel shaft on a sleeve and a flange, one swept arm, a flat LED head (off: it is day)
      lPole += P([[x - 5.5, 808], [x - 4, 556], [x + 4, 556], [x + 5.5, 808]]) + R(x - 8, 782, 16, 26)
        + "M" + (x - 4) + ",557C" + (x - 4) + ",528 " + (x + 12) + ",509 " + (x + 40) + ",509L" + (x + 86) + ",509L" + (x + 86) + ",517L" + (x + 40) + ",517C" + (x + 19) + ",517 " + (x + 4) + ",534 " + (x + 4) + ",557z";
      lLit += R(x - 8, 782, 16, 4) + R(x + 3, 786, 5, 22);
      lDark += R(x - 10, 808, 20, 6) + P([[x - 5.5, 782], [x - 4.05, 557], [x - 1.05, 557], [x - 2.5, 782]]) + R(x - 8, 786, 3, 22) + "M" + (x + 76) + ",504L" + (x + 128) + ",507Q" + (x + 135) + ",507.5 " + (x + 135) + ",513L" + (x + 135) + ",515L" + (x + 76) + ",520z";
      lLens += P([[x + 86, 519.4], [x + 131, 515.4], [x + 131, 518.6], [x + 86, 522.6]]);
    });

    // the gantry: the truss between its two columns
    var CT = 14, C0 = 468, C1 = C0 + 56, X0 = -12, X1 = 1226, FC1 = 28, NC0 = 1178;   // chord depth, the two chords' tops, the truss's ends, the columns' inner faces
    var hp = (NC0 - FC1) / 24, web = "M" + FC1 + "," + C1;
    for (i = 1; i <= 24; i++) web += "L" + n1(FC1 + i * hp) + "," + (i % 2 ? C0 + CT : C1);
    var BA = { x: 150, y: C0 - 52, w: 450, hh: 218 }, BB = { x: 700, y: C0 - 20, w: 310, hh: 140 };   // the two boards (a phone shows A whole, clear of the site's buttons)
    var rails = [[226, BA], [512, BA], [742, BB], [956, BB]];                    // the rails each board is bolted to; they show above and below it
    var truss = R(X0, C0, X1 - X0, CT) + R(X0, C1, X1 - X0, CT) + R(X0, C0 + CT, 10, C1 - C0 - CT) + R(X1 - 10, C0 + CT, 10, C1 - C0 - CT)
      + P([[FC1, C0 + 146], [FC1, C0 + 160], [118, C1 + CT], [104, C1 + CT]]) + P([[NC0, C0 + 146], [NC0, C0 + 160], [1088, C1 + CT], [1102, C1 + CT]]);   // and the two knee braces
    var lamps = "";
    rails.forEach(function (r) {
      var x = r[0], b = r[1], yb = b.y + b.hh + 12;
      truss += R(x, b.y - 12, 12, b.hh + 24);
      lamps += P([[x - 5, yb], [x + 17, yb], [x + 22, yb + 12], [x - 10, yb + 12]]);   // a floodlight at the rail's foot, seen from behind
    });
    var farCol = R(0, C0 - 8, 28, 808 - C0) + R(-3, C0 - 14, 34, 8) + R(-8, 800, 44, 8) + P([[-8, 800], [0, 800], [0, 772]]) + P([[28, 772], [28, 800], [36, 800]]);
    var chordStrip = function (dy) { return R(X0 + 1.25, C0 + dy, -2.5 - X0, 3.5) + R(29.25, C0 + dy, X1 - 30.5, 3.5) + R(X0 + 1.25, C1 + dy, -2.5 - X0, 3.5) + R(29.25, C1 + dy, X1 - 30.5, 3.5); };
    var arrow = function (cx) { var y = BA.y; return P([[cx, y + 76], [cx + 17, y + 111], [cx + 5.5, y + 105], [cx + 5.5, y + 198], [cx - 5.5, y + 198], [cx - 5.5, y + 105], [cx - 17, y + 111]]); };

    A.back = [
      F(D.roadEdge, jSlit),
      F(D.walk, wBody), F(D.walkLit, wLit), F(D.walkShade, wShade),
      F(D.pole, lPole), F(D.poleLit, lLit), F(D.poleDark, lDark), F(D.lampLens, lLens),
      h("path", { d: web, fill: "none", stroke: ink, strokeWidth: 10.5, strokeLinejoin: "round" }),
      h("path", { d: web, fill: "none", stroke: D.expSteel, strokeWidth: 5.5, strokeLinejoin: "round" }),
      FO(D.expSteel, truss, 2.5),
      FO(D.expSteel, farCol, 2.5),
      F(D.expSteelLit, chordStrip(1.25) + R(20.75, C0 - 4.75, 6, 803.5 - C0)),
      F(D.expSteelShade, chordStrip(CT - 4.75) + R(1.25, C0 - 4.75, 7, 803.5 - C0)),
      FO(D.expSteelShade, lamps, 2.2),
      // the boards: green, a white line inside the edge, white lettering
      FO(D.sign, RR(BA.x, BA.y, BA.w, BA.hh, 12) + RR(BB.x, BB.y, BB.w, BB.hh, 12), 3),
      h("path", { d: RR(BA.x + 8, BA.y + 8, BA.w - 16, BA.hh - 16, 6) + RR(BB.x + 8, BB.y + 8, BB.w - 16, BB.hh - 16, 6), fill: "none", stroke: COLORS.white, strokeWidth: 3.5 }),
      F(COLORS.white, R(174, BA.y + 55, 402, 3.5) + arrow(510) + arrow(558)),
      h("rect", { x: 722, y: BB.y + 22, width: 9, height: 96, rx: 4.5, fill: COLORS.verm }),
      T(176, BA.y + 43, 28, 800, FONTS.jp, 2, "関越自動車道"),
      T(575, BA.y + 42, 17, 700, FONTS.lat, 2.2, "KAN-ETSU EXPWY", "end"),
      T(177, BA.y + 135, 58, 800, FONTS.jp, 6, "新潟"),
      T(180, BA.y + 177, 23, 700, FONTS.lat, 1, "Niigata"),
      T(335, BA.y + 135, 58, 800, FONTS.jp, 6, "前橋"),
      T(338, BA.y + 177, 23, 700, FONTS.lat, 1, "Maebashi"),
      T(746, BB.y + 75, 50, 800, FONTS.jp, 2, "板橋 出口"),
      T(748, BB.y + 113, 20, 700, FONTS.lat, 2.6, "ITABASHI EXIT")
    ];

    /* ---- in front of the trucks: the gantry's near column, on the kerb. Below the trucks' wheels it wears a
       dark painted jacket with a flared foot (the same dark steel as the guard rail): the site's white caption
       and its progress track lie over that stretch, and a pale column passing behind them made them hard to read. */
    var seg = function (x, w) { return R(x, C0 - 4.75, w, 703.5 - C0) + R(x, 713.25, w, 195); };
    A.front = [
      FO(D.expSteel, R(1178, C0 - 8, 36, 922 - C0) + R(1175, C0 - 14, 42, 8) + R(1173, 700, 46, 12), 2.5),
      F(D.expSteelLit, seg(1205.75, 7)),
      F(D.expSteelShade, seg(1179.25, 9)),
      FO(D.fgRail, P([[1173, 908], [1219, 908], [1219, 958], [1230, 994], [1230, 1004], [1162, 1004], [1162, 994], [1173, 958]]), 2.5),
      F(D.fgRailLit, R(1174.25, 909.25, 43.5, 4) + R(1210, 913.25, 5, 43) + RR(1189, 926, 13, 28, 2))   // its top edge and sunny side; the hand-hole cover
    ];
    return _expArt = A;
  }
//== INSERT before "var convoy = [{ x: 120, scale: 1.8, lag: 0 }"
    // the expressway: where the gantry's local x 0 stands on the stage (the first of its two copies), and the
    // phases of what repeats on a short period
    var XW = expresswayArt(), xg = wrap(scroll + 2030, GTILE) + GTILE - 1300;
    var xPar = "translate(" + ((((xg % 150) + 150) % 150) - 150).toFixed(2) + ", 0)";
    var xFg = "translate(" + (-((scroll * 1.25) % 175)).toFixed(2) + ", 0)";
//== REPLACE from "y: ROAD_Y - 16, width: 1920, height: 16, fill: DAY.fence" to "convoy.map(function (c, i) {"
        XW.deck,
        h("path", { d: XW.parJoints, fill: DAY.walkShade, transform: xPar }),
        h("path", { d: XW.railPosts, fill: DAY.poleDark, transform: xPar }),
        h("line", { x1: -180, y1: ROAD_Y + 51, x2: 2100, y2: ROAD_Y + 51, stroke: DAY.roadDash, strokeWidth: 6, strokeDasharray: "72 108", strokeDashoffset: (scroll % 180).toFixed(2) }),
        [0, 1].map(function (rep) { return h("g", { transform: "translate(" + (xg + rep * GTILE).toFixed(2) + ", 0)" }, XW.back); }),
//== REPLACE from "GantryFront(GTILE - 1300)" to "SceneTitle({ no: CONTENT.scenes.transit.no"
        [0, 1].map(function (rep) { return h("g", { transform: "translate(" + (xg + rep * GTILE).toFixed(2) + ", 0)" }, XW.front); }),
        h("path", { d: XW.fgPosts, fill: DAY.fgRail, transform: xFg }),
        XW.fg
      ),
