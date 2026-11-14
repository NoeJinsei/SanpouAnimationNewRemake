//== REPLACE from "  /* ---- scene 05: the finale's city, nothing moving but its light." to "  /* Tokyo Tower, round 3:"
  /* ---- scene 05: the finale's city, round 4 (2026-11-15): composed again around the airliner's climb.
     The plane leaves the runway and climbs along the line y = 968 - 0.56 (x - 614) (PLANE.SLOPE, PLANE.BLEND
     below). Everything it flies over stays under that line: between the airport and Tokyo Tower every roof
     is at least 50 px below it, right of the Tower at least 60 px, and nothing on a roof (rods, plant, the
     crane) comes nearer than 25 px. So the skyline is a low belt in front of Mt Fuji in two depths and two
     values (the pale far row shows where the nearer row is low), open sky over the depot where the plane
     climbs out, a few roofs stepping up toward the Tower, the Tower's own corridor kept low, and the knot of
     towers right of the Tower rising to the right, parallel to the climb. Heights are written as the stage
     y of the roof (F, B, N below), because the line is in stage coordinates. ---- */
  var _cityN = null;
  function cityFinale() {
    if (_cityN) return _cityN;
    var S = SKYLINE_SIZE;
    // a building's height in its row's own units, from the stage y its roof should stand at
    var at = function (roofY, baseY, ref) { return (baseY - roofY + ref * (S.amp - 1)) / (S.base + S.amp - 1); };
    var F = function (y) { return at(y, 1008, 300); }, B = function (y) { return at(y, 1010, 300); }, N = function (y) { return at(y, 1010, 220); };
    var c = {
      far: cityRow(CITY_LOOK.far, 1008, 300, 0, [
        ["S", -24, 104, F(838), 1, "c"], ["D", 262, 170, F(810), 1, "c"], ["G", 470, 82, F(826), 1, "g"],
        ["S", 1012, 96, F(812), 1, "c"], ["G", 1168, 82, F(724), 0, "g"], ["M", 1256, 160, F(800), 0, "c"],
        ["S", 1474, 118, F(566), 1, "t"], ["G", 1612, 140, F(492), 0, "g"], ["D", 1772, 190, F(392), 1, "c"]]),
      back: cityRow(CITY_LOOK.nearBack, 1010, 300, 0, [
        ["L", -30, 150, B(900), 0, "c"], ["M", 150, 188, B(862), 1, "t"], ["P", 384, 62, B(838), 0, "d"],
        ["C", 464, 142, B(882), 2, "c"],
        ["P", 1052, 60, B(792), 1, "c"], ["C", 1132, 106, B(756), 2, "d"],
        ["D", 1508, 186, B(610), 0, "d"], ["X", 1712, 190, B(590), 2, "m"]]),
      front: cityRow(CITY_LOOK.near, 1010, 220, 0, [
        ["M", 1494, 200, N(806), 0, "c"], ["L", 1712, 226, N(856), 1, "t"]])
    };
    c.lights = cityLights([c.far, c.back, c.front], 0, {
      sheen: [[1682, 2]],
      glint: [[244, 90, 13, 0.4], [530, 80, 17, 2.6], [1172, 190, 11, 4.4], [1600, 130, 15, 1.2], [1810, 90, 19, 3.3]],
      warm: [[1590, 300, 0.8], [1830, 60, 3.6]]
    });
    return _cityN = c;
  }
//== REPLACE from "  function JetPlane(p) {" to "  function Airport(time) {"
  /* The airliner, round 4 (2026-11-15): drawn again from a blank page.
     A twin-engined narrow-body in one side elevation, facing right, about 224 px from nose to tail.
     Local units are stage px: +x toward the nose, y down, the tyres stand on y 0 when the plane rests on
     its gear, x 0 is the main gear. Unbranded, our own livery: a cool white fuselage that shades into
     periwinkle, a quiet blue belly, a blue fin and tail cone with one pale band, blue winglets. No
     lettering, no logo, none of Sanpou's colours.
     Back to front: the nose gear and its door, the main gear, the body (fin, fuselage, livery, windows,
     doors, glazing, the wing root fairing, the tailplane), the flaps and their track fairings (they slide
     out from under the wing), the wing, the spoilers, the pylon and the engine.
     What moves, all on the props (nothing here reads the clock):
       ext, nose   how far each leg hangs below its resting length (5 = hanging free, below 0 = squatting)
       tilt        the main bogie's angle to the ground (it hangs tail-low in the air)
       mainFold    0..1: the main legs swing inward into the belly, so from the side they shorten and the
                   wheels turn flat; noseFold 0..1: the nose leg swings forward into its bay; door: its door
       flap        0..1: the flaps run aft and down; spoil 0..1: the spoilers stand up; lamp: the strobe
     The static art is built once and shared by both slots and by scene 03's far-off jet. */
  DAY.planeBody = "#fbfcfe";        // the fuselage: cool white
  DAY.planeBodyShade = "#cfdaee";   // ... turned under, away from the sun (periwinkle)
  DAY.planeBelly = "#7c99c6";       // the belly and the wing root fairing: quiet blue paint
  DAY.planeTail = "#3d68a6";        // the fin, the tail cone, the winglet: the livery's one blue
  DAY.planeTailShade = "#2f548b";
  DAY.planeTailBand = "#93b8e4";    // the pale band across the fin and the tail cone
  DAY.planeWing = "#e3eaf5";        // the wing's upper surface, the tailplane
  DAY.planeWingLit = "#ffffff";     // leading edges in the sun, a spoiler standing up
  DAY.planeWingShade = "#b2c2dd";   // flaps let down, the wing root under the fuselage, the pylon
  DAY.planeSeam = "#a5b5d1";        // panel seams on white
  DAY.planeMetal = "#a9b7cd";       // the engine's lip and exhaust, gear legs, wheel hubs
  DAY.planeMetalLit = "#e1e8f1";
  DAY.planeMetalShade = "#687a9b";
  DAY.planeGlass = "#27395d";       // cabin windows, cockpit glazing
  DAY.planeGlassSky = "#7ea3d6";    // the sky across the top of the cockpit glazing
  DAY.planeTyre = "#18233a";
  DAY.planeLamp = "#b9cdea";        // the strobe's lens at rest (its flash is white)
  DAY.planeSmoke = "#f3f6fb";       // tyre smoke
  DAY.planeSmokeShade = "#d2dcec";
  DAY.planeShadow = "#0a1424";      // the contact shadow on the runway (drawn at low opacity)

  // the spoilers: each [hinge line x0, y0, x1, y1]; the panel reaches 4.6 px aft of it when it lies flat
  var PLANE_SPOIL = [[2.9, -28.4, 0.9, -24.2], [-1.9, -22.2, -15.9, -15.6]];
  var _planeArt = null;
  function planeArt() {
    if (_planeArt) return _planeArt;
    var D = DAY, ink = COLORS.ink, i, d;
    var n2 = function (v) { return Math.round(v * 100) / 100; };
    var rd = function (x, y, w, hh, r) {
      if (!r) return "M" + x + "," + y + "h" + w + "v" + hh + "h" + (-w) + "z";
      var c = "a" + r + "," + r + " 0 0 1 ";
      return "M" + n2(x + r) + "," + y + "h" + n2(w - 2 * r) + c + r + "," + r + "v" + n2(hh - 2 * r) + c + (-r) + "," + r + "h" + n2(2 * r - w) + c + (-r) + "," + (-r) + "v" + n2(2 * r - hh) + c + r + "," + (-r) + "z";
    };
    var F = function (fill, dd) { return h("path", { d: dd, fill: fill }); };
    var FO = function (fill, dd, w) { return h("path", { d: dd, fill: fill, stroke: ink, strokeWidth: w || 1.8, strokeLinejoin: "round" }); };
    var O = function (dd, w, col) { return h("path", { d: dd, fill: "none", stroke: col || ink, strokeWidth: w || 1.8, strokeLinejoin: "round", strokeLinecap: "round" }); };
    var A = {};

    /* ---- the body ---- */
    var FUS = "M84,-24 C98,-24 112,-26.5 117.2,-33 Q118.6,-35.2 117.4,-37.4 C113,-43 104,-47.8 95,-49.8 C91,-50.6 87,-51 82,-51 L-66,-51 L-99,-47.6 Q-106.5,-46.8 -106.5,-44.6 Q-106.5,-42.6 -101,-41.6 C-84,-38.4 -68,-24 -48,-24 Z";
    var FIN = "M-42,-50 Q-55,-51 -60.5,-55.6 L-91.4,-85.6 Q-93.8,-88 -97.4,-88 L-104,-88 Q-108.4,-88 -107.8,-83.8 L-99.5,-46.5 L-60,-46.5 Z";
    var win = "";
    for (i = 0; i < 11; i++) win += rd(n2(59 - 10.2 * i), -43.7, 5, 6.2, 1.8);
    A.body = h("g", null,
      // the fin: blue, one pale band from its root to its tip, the rudder's hinge line
      F(D.planeTail, FIN),
      F(D.planeTailBand, "M-64.8,-51 L-70.8,-51 L-107.3,-86.5 L-105.5,-87.7 L-102.9,-88 Z"),
      O("M-87.6,-50 L-102.8,-86.8", 1.3, D.planeTailShade),
      O(FIN, 1.8),
      FO(D.planeBodyShade, "M27,-50 L33,-50 L30.4,-55.4 L27.6,-55.4 Z", 1.2),                       // a blade aerial on the crown
      // the fuselage: white, its lower third in shade, the belly painted blue
      F(D.planeBody, FUS),
      F(D.planeBodyShade, "M117.2,-33 C112,-26.5 98,-24 84,-24 L-48,-24 C-58,-24 -67,-27.6 -75.6,-31.6 L-79,-36 C-70,-33.6 -62,-33.2 -54,-33.2 L92,-33.2 C103,-33.2 111,-33.1 117.2,-33 Z"),
      F(D.planeBelly, "M106,-26.4 C100,-24.8 92,-24 84,-24 L-48,-24 C-58,-24 -67,-27.6 -75.6,-31.6 L-77.4,-34 C-68,-29.6 -60,-28.4 -52,-28.4 L88,-28.4 C95,-28.4 101,-27.8 106,-26.4 Z"),
      // the livery: the tail cone in the fin's blue, cut on a slant, one pale band ahead of the cut
      F(D.planeTail, "M-54,-51 L-66,-51 L-99,-47.6 Q-106.5,-46.8 -106.5,-44.6 Q-106.5,-42.6 -101,-41.6 C-92.5,-40 -84.3,-35.6 -75.6,-31.6 Z"),
      F(D.planeTailShade, "M-101,-41.6 C-92.5,-40 -84.3,-35.6 -75.6,-31.6 L-71.8,-35.2 C-80,-39 -89,-42.6 -100,-44.8 Z"),
      F(D.planeTailBand, "M-50,-51 L-44.5,-51 L-68.2,-28.5 L-72.2,-30.1 Z"),
      F(D.planeGlass, win + rd(72.4, -43.6, 3.2, 4.2, 1) + rd(-78.4, -44.4, 3.2, 3.8, 1)),          // cabin windows, the windows in the two doors
      O(rd(70, -46.8, 8, 16.5, 2.4), 1.4, D.planeSeam),                                             // the forward door
      O(rd(-80.5, -46.6, 7.5, 12, 2.2), 1.4, D.planeTailBand),                                      // the aft door, on the blue
      // the cockpit glazing: windscreen and side window, the sky across its top, the post between them
      F(D.planeGlass, "M110.4,-41.4 L104.6,-45.2 L93.6,-45.2 Q92,-45.2 92,-43.6 L92,-41.2 Q92,-39.6 93.6,-39.6 L108.2,-39.6 Q110.9,-39.6 110.4,-41.4 Z"),
      F(D.planeGlassSky, "M104.6,-45.2 L93.6,-45.2 Q92,-45.2 92,-43.6 L92,-43 L107.9,-43 Z"),
      O("M101.2,-45.2 L102.6,-39.6", 1.5, D.planeBody),
      O(FUS, 1.8),
      F(D.planeGlass, rd(-107.8, -46.3, 2.6, 3.4, 1.2)),                                            // the exhaust of the unit in the tail
      FO(D.planeBelly, "M58,-26 C52,-20.8 44,-20 34,-20 L-14,-20 C-22,-20 -28,-21.6 -32,-26 Z", 1.6),   // the wing root fairing: the main gear folds away behind it
      FO(D.planeWing, "M-82,-45 L-98,-45.3 L-113,-42.2 L-106,-40.6 Z", 1.5),                    // the tailplane and its elevator's hinge line
      O("M-93.6,-44.6 L-109,-41.7", 1.2, D.planeSeam),
      h("circle", { cx: -99, cy: -83.6, r: 2.1, fill: D.planeLamp })                                // the strobe on the fin
    );

    /* ---- the gear. Nose leg: its pivot is the group's origin, the leg hangs down +y ---- */
    A.noseLeg = [F(D.planeMetalShade, rd(-2.1, -1, 4.2, 12, 1)), h("circle", { cx: 2.7, cy: 7.4, r: 1.6, fill: D.planeMetalLit })];   // the cylinder; the taxi lamp
    A.noseWheels = [
      h("circle", { cx: 1.9, cy: 0, r: 4.6, fill: D.planeTyre }),                                   // the far wheel of the pair
      h("circle", { cx: 0, cy: 0, r: 4.6, fill: D.planeTyre }),
      h("circle", { cx: 0, cy: 0, r: 2, fill: D.planeMetal }),
      h("circle", { cx: 0, cy: 0, r: 0.9, fill: D.planeMetalShade })];
    A.noseDoor = h("path", { d: rd(76.5, 0, 11.5, 6, 1.2), fill: D.planeBodyShade, stroke: ink, strokeWidth: 1.2, strokeLinejoin: "round" });   // hinged on the belly line
    // main leg: the same (the wing hides its top); the bogie's pivot is its own origin
    A.mainLeg = [F(D.planeMetalShade, rd(-2.3, -1, 4.6, 10.5, 1)),
      h("path", { d: rd(2.3, 1.6, 3.8, 8, 1), fill: D.planeBodyShade, stroke: ink, strokeWidth: 1.1, strokeLinejoin: "round" })];   // the cylinder; the door that rides on the leg
    A.bogie = [
      F(D.planeMetalShade, rd(-8, -1.3, 16, 2.6, 1.3)),
      h("circle", { cx: -6.5, cy: 0, r: 5.6, fill: D.planeTyre }), h("circle", { cx: 6.5, cy: 0, r: 5.6, fill: D.planeTyre }),
      F(D.planeMetal, "M-8.9,0a2.4,2.4 0 1 0 4.8,0a2.4,2.4 0 1 0 -4.8,0M4.1,0a2.4,2.4 0 1 0 4.8,0a2.4,2.4 0 1 0 -4.8,0"),
      F(D.planeMetalShade, "M-7.5,0a1,1 0 1 0 2,0a1,1 0 1 0 -2,0M5.5,0a1,1 0 1 0 2,0a1,1 0 1 0 -2,0")];

    /* ---- the flaps and their track fairings: under the wing, they run aft and down together ---- */
    var pod = function (tx, ty) { return "M" + (tx + 4) + "," + n2(ty - 1.6) + "L" + n2(tx - 2.5) + "," + n2(ty - 1.6) + "Q" + (tx - 6) + "," + n2(ty - 1.1) + " " + n2(tx - 6.8) + "," + n2(ty + 0.5) + "Q" + n2(tx - 3.5) + "," + n2(ty + 1.9) + " " + (tx + 4) + "," + n2(ty + 1.8) + "Z"; };
    A.flaps = [
      F(D.planeMetalShade, pod(-9.5, -26.1) + pod(-17.1, -19.7) + pod(-24.7, -15.8)),
      FO(D.planeWingShade, "M-1,-29.2 L-4,-23.4 L-22.2,-14.8 L-27.7,-14.8 L-11,-23.4 L-8.2,-29.2 Z", 1.3)];

    /* ---- the wing: swept and tapered, its tip nearest to us; the wells the spoilers lie in; the winglet ---- */
    var WING = "M40,-30 L-24,-10.5 L-36,-10.5 L-11,-23.4 L-8,-30 Z";
    d = "";
    for (i = 0; i < PLANE_SPOIL.length; i++) { var s = PLANE_SPOIL[i]; d += "M" + s[0] + "," + s[1] + "L" + s[2] + "," + s[3] + "L" + n2(s[2] - 4.6) + "," + s[3] + "L" + n2(s[0] - 4.6) + "," + s[1] + "Z"; }
    A.wing = h("g", null,
      F(D.planeWing, WING),
      F(D.planeWingLit, "M40,-30 L-24,-10.5 L-28.6,-10.5 L32.5,-30 Z"),                                 // the leading edge in the sun
      F(D.planeWingShade, "M38,-30 L-8,-30 L-8.8,-27 L29.2,-27 Z" + d),                             // the fuselage's shade on the root; the spoiler wells
      O("M-1,-29.4 L-4,-23.4 L-22.2,-14.8 L-27.7,-14.8", 1.2, D.planeSeam),                         // where the flaps begin
      O(WING, 1.6),
      FO(D.planeTail, "M-24.6,-10.7 L-36.2,-10.7 L-46,-23.6 L-41.6,-24.4 Z", 1.5));                   // the winglet

    /* ---- the pylon and the engine, slung ahead of the wing ---- */
    var NAC = "M49.6,-17.6 Q50.2,-21 46,-21 L25,-21 Q17.5,-20.6 15,-18 L15,-8.6 Q17.5,-5.6 25,-5 L45.4,-5 Q49.8,-5 49.6,-8.8 Z";
    A.engine = h("g", { transform: "translate(6,0)" },
      FO(D.planeWingShade, "M42,-21 L25,-21 L18,-25 L30,-28.6 Z", 1.4),                           // the pylon
      F(D.planeMetalShade, "M9.5,-15.4 L4.2,-13.3 L9.5,-11.2 Z"),                                   // the exhaust: plug, then the core's nozzle
      FO(D.planeMetal, "M15.4,-17.8 L9.5,-16.2 L9.5,-10.4 L15.4,-8.8 Z", 1.2),
      F(D.planeBody, NAC),
      F(D.planeBodyShade, "M15,-11.6 L49.6,-11.6 L49.6,-8.8 Q49.8,-5 45.4,-5 L25,-5 Q17.5,-5.6 15,-8.6 Z"),
      F(D.planeMetal, "M45.6,-21 Q50.2,-21 49.6,-17.6 L49.6,-8.8 Q49.8,-5 45.6,-5 Z"),              // the intake lip: bare metal
      F(D.planeMetalLit, "M45.6,-21 Q50.2,-21 49.6,-17.6 L49.6,-15.4 L45.6,-15.4 Z"),
      F(D.planeSeam, rd(31.4, -20.6, 1.4, 15.4)),                                                   // where the cowl opens
      O(NAC, 1.6));

    /* ---- on the runway: the contact shadow, the tyre smoke (a burst, and the streak the wheels drag out) ---- */
    A.clip = h("clipPath", { id: "nPlaneRunway" }, h("rect", { x: 22, y: 960, width: 682, height: 36 }));
    A.shadowD = "M-104,0 H112 a2.6,2.6 0 0 1 0,5.2 H-104 a2.6,2.6 0 0 1 0,-5.2 Z";
    A.puff = [
      F(D.planeSmoke, "M-17,0 Q-19,-7 -12,-9.5 Q-13.5,-17 -5,-18.5 Q0.5,-23.5 6.5,-19 Q13.5,-19 13.5,-12 Q19.5,-9 16.5,0 Z"),
      F(D.planeSmokeShade, "M-17,0 Q-19,-7 -12,-9.5 Q-8.5,-4.6 -1,-5.6 Q5,-1.6 16.5,0 Z")];
    A.streak = [
      F(D.planeSmoke, "M0,0 Q-5,-5.6 -15,-4.8 Q-28,-7.4 -43,-3 Q-53,-2.6 -62,0 Z"),
      F(D.planeSmokeShade, "M0,0 Q-14,-2 -30,-1.8 Q-46,-1.2 -62,0 Z")];
    return _planeArt = A;
  }
  function planeSpoilD(sp) {
    var dx = -4.6 + 1.9 * sp, dy = -5.2 * sp, d = "", i, r = function (v) { return Math.round(v * 100) / 100; };
    for (i = 0; i < PLANE_SPOIL.length; i++) { var s = PLANE_SPOIL[i]; d += "M" + s[0] + "," + s[1] + "L" + s[2] + "," + s[3] + "L" + r(s[2] + dx) + "," + r(s[3] + dy) + "L" + r(s[0] + dx) + "," + r(s[1] + dy) + "Z"; }
    return d;
  }
  var _planeCruise = {};
  function JetPlane(p) {
    // scene 03's far-off jet asks for one fixed pose (gear up, clean): built once per opacity
    var fixed = p.mainFold == null && p.gear === 0 && !p.x && !p.y && !p.rot;
    if (fixed && _planeCruise[p.opacity]) return _planeCruise[p.opacity];
    var A = planeArt(), D = DAY, f = function (v) { return String(Math.round(v * 100) / 100); };
    var mainFold = p.mainFold == null ? 1 - (p.gear == null ? 1 : p.gear) : p.mainFold;
    var noseFold = p.noseFold == null ? mainFold : p.noseFold, door = p.door == null ? 1 - mainFold : p.door;
    var rot = p.rot || 0, ext = p.ext == null ? 5 : p.ext, nose = (p.nose == null ? 5 : p.nose) * (1 - noseFold);
    var flap = p.flap || 0, tilt = (p.tilt || 0) - rot, mc = Math.cos(mainFold * 1.536);            // folded: turned 88 degrees away from us
    var node = h("g", { transform: "translate(" + f(p.x) + "," + f(p.y) + ") rotate(" + f(rot) + ")", opacity: p.opacity == null ? 1 : p.opacity },
      h("g", { transform: "translate(82,-25) rotate(" + f(-108 * noseFold) + ")" },
        h("rect", { x: -1.4, y: 10, width: 2.8, height: f(Math.max(0.5, 10.4 + nose)), fill: D.planeMetalLit }),
        A.noseLeg,
        h("g", { transform: "translate(0," + f(20.4 + nose) + ")" }, A.noseWheels)),
      h("g", { transform: "translate(0,-24.4) scale(1," + f(door) + ")" }, A.noseDoor),
      h("g", { transform: "translate(0,-22.5) scale(1," + f(mc) + ")" },
        h("rect", { x: -1.5, y: 8.5, width: 3, height: f(Math.max(0.5, 8.4 + ext)), fill: D.planeMetalLit }),
        A.mainLeg,
        h("g", { transform: "translate(0," + f(16.9 + ext) + ") rotate(" + f(tilt) + ")" }, A.bogie)),
      A.body,
      h("circle", { cx: -99, cy: -83.6, r: 2.1, fill: "#ffffff", opacity: f(p.lamp || 0) }),
      h("g", { transform: "translate(" + f(-6.5 * flap) + "," + f(3 * flap) + ")" }, A.flaps),
      A.wing,
      h("path", { d: planeSpoilD(p.spoil || 0), fill: D.planeWingLit, stroke: D.planeSeam, strokeWidth: 1.1, strokeLinejoin: "round" }),
      A.engine
    );
    if (fixed) _planeCruise[p.opacity] = node;
    return node;
  }

  /* The flight: one 19 s cycle, every value a pure function of the clock.
       0     .. 5.1   final approach: the sink rate eases off in the flare, the nose comes up
       5.1            the main wheels touch at x 330 (aft pair first): the bogie levels, the legs squat past
                      their resting length and come back; the nose is lowered, not dropped
       5.1   .. 8.1   rollout to the stand at x 474: spoilers up, a long soft stop, the nose dips on the brakes
       8.1   .. 9.5   the hold: flaps come up to the take-off setting
       9.5   .. 11.5  the take-off roll: the nose rises, the legs stretch as the wing takes the weight
       11.53          the wheels leave the runway at x 554; the path bends up over PLANE.BLEND px into a
                      straight climb of slope PLANE.SLOPE (29.2 degrees), the pitch leading it a little
       11.9  .. 13.2  the gear folds away; 13.8 .. 15.9 the flaps run in
       17.3  .. 19    off the picture (it has left by the right edge at 17.1)
     x is where the main gear stands; y is the body's origin (see planeArt). back: the plane has passed
     PLANE.HAND and is drawn by the slot behind Tokyo Tower. */
  var PLANE = { T: 19, TD: 5.1, ROLL: 3, HOLD: 1.4, LIFT: 2.03, OUT: 7.8, GY: 968, TDX: 330, STAND: 474, SLOPE: 0.56, BLEND: 120, HAND: 1170, HANG: 5, NOSE_X: 82 };
  function planeSS(a, b, v) { var t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); }
  function planeRun(s) { return PLANE.STAND + 62 * (s * s / 2 - 0.5 * s + 0.25 * (1 - Math.exp(-2 * s))); }   // thrust comes on over half a second, then holds
  PLANE.LIFT_X = planeRun(PLANE.LIFT);
  var PLANE_AWAY = { on: false, back: false, x: -460, y: 820, rot: 0, ext: 5, tilt: -12, nose: 5, mainFold: 0, noseFold: 0, door: 1, flap: 1, spoil: 0, hgt: 400, t2: -1, lamp: 0, opacity: 0 };
  var _planeAt = { time: null, q: null };
  function planeAt(time) {
    if (_planeAt.time === time) return _planeAt.q;                                                 // the two slots ask for the same moment
    var P = PLANE, ss = planeSS, t = ((time % P.T) + P.T) % P.T, tg = t - P.TD, s = tg - P.ROLL - P.HOLD, z, zn;
    var bump = function (v, c, w) { v = (v - c) / w; return Math.exp(-v * v); };
    var q = { on: true, back: false, x: 0, y: 0, rot: 0, ext: P.HANG, tilt: -12, nose: P.HANG, mainFold: 0, noseFold: 0, door: 1, flap: 1, spoil: 0, hgt: 0, t2: -1, lamp: 0, opacity: 1 };
    var HANG_LOW = P.HANG + 6.5 * Math.sin(12 * Math.PI / 180);                                     // how far the aft tyres hang below the body's resting line
    if (tg < 0) {
      // final approach: constant ground speed; sink 26 px/s far out, 9 px/s at the wheels' touch
      var tau = -tg, w = tau / (tau + 0.8); w *= w;
      q.x = P.TDX - 120 * tau;
      q.hgt = 9 * tau + 17 * (tau - (1 - Math.exp(-tau))) + 2.4 * Math.sin(t * 1.9) * w;
      q.rot = -2.2 - 4.3 * Math.exp(-tau * tau / 0.81) + 0.55 * Math.sin(t * 1.3 + 1) * w;
      q.y = P.GY - q.hgt - HANG_LOW;
    } else if (s < 0) {
      // on the runway: z = how far the body stands above its resting height, a damped spring that starts
      // with the approach's sink rate; first the bogie levels, then the legs take it
      var u = Math.min(1, tg / P.ROLL);
      q.x = P.TDX + (P.STAND - P.TDX) * (1 - Math.pow(1 - u, 2.5));
      z = Math.exp(-2.2 * tg) * (HANG_LOW * Math.cos(8 * tg) + (2.2 * HANG_LOW - 9) / 8 * Math.sin(8 * tg));
      q.ext = Math.min(z, P.HANG);
      q.tilt = z > P.HANG ? -Math.asin(Math.min(1, (z - P.HANG) / 6.5)) * 180 / Math.PI : 0;
      q.y = P.GY - z;
      q.rot = -6.5 * (1 - ss(0.12, 1.3, tg))                                                        // the nose is flown down
        + 0.9 * bump(tg, 1.52, 0.26)                                                                // the nose leg takes the weight and gives
        + 0.42 * ss(1.25, 1.9, tg) * (1 - ss(P.ROLL - 0.55, P.ROLL + 0.05, tg))                     // nose-down on the brakes
        - 0.28 * bump(tg, P.ROLL + 0.22, 0.2);                                                      // and the rebound as it stops
      q.spoil = ss(0.12, 0.5, tg) * (1 - ss(2.4, 3.2, tg));
      q.flap = 1 - 0.55 * ss(P.ROLL + 0.1, P.ROLL + P.HOLD - 0.1, tg);
      q.t2 = tg;
      zn = z + P.NOSE_X * Math.sin(-q.rot * Math.PI / 180);
      q.nose = Math.max(-3, Math.min(P.HANG, zn));
    } else if (s < P.OUT) {
      q.x = planeRun(s);
      // the pitch: thrust lifts the nose a touch, the rotation, then it follows the path up (slowly enough that
      // the tail stays 15 px clear of the runway), overshoots a little and settles on the climb angle
      q.rot = -0.45 * ss(0.1, 0.7, s) - 9.6 * ss(1.2, 2.25, s) - 20.6 * ss(2.05, 3.2, s) + 1.4 * ss(3.2, 4.3, s) + 0.3 * Math.sin(time * 0.9) * ss(4.3, 5.4, s);
      if (s < P.LIFT) {
        z = P.HANG * ss(1.2, 2, s);
        q.ext = z; q.tilt = 0; q.y = P.GY - z;
        zn = z + P.NOSE_X * Math.sin(-q.rot * Math.PI / 180);
        q.nose = Math.max(-3, Math.min(P.HANG, zn));
      } else {
        var dd = q.x - P.LIFT_X;
        q.hgt = dd < P.BLEND ? P.SLOPE * dd * dd / (2 * P.BLEND) : P.SLOPE * (dd - P.BLEND / 2);
        q.y = P.GY - P.HANG - q.hgt;
        q.tilt = -12 * ss(P.LIFT, P.LIFT + 0.5, s);
      }
      q.noseFold = ss(2.4, 3.4, s); q.mainFold = ss(2.55, 3.7, s); q.door = 1 - ss(3.3, 3.75, s);       // positive climb: gear up
      q.flap = 0.45 * (1 - ss(4.3, 6.4, s));
      q.back = q.x >= P.HAND;
    } else q = PLANE_AWAY;
    if (q.on) q.lamp = Math.pow(Math.max(0, Math.sin(time * 5.2)), 8);
    _planeAt.time = time; _planeAt.q = q;
    return q;
  }
  var _planeAway = null;
  function planeAway() { return _planeAway || (_planeAway = JetPlane(PLANE_AWAY)); }
//== REPLACE from "  function AirportPlane(time) {" to "  /* ---- Scene4Network.tsx ---- */"
  function AirportPlane(time) {
    // the front slot: the plane from its approach until it has climbed clear of the depot (x < PLANE.HAND),
    // with what it leaves on the runway: its contact shadow and the smoke of the tyres
    var q = planeAt(time), A = planeArt(), P = PLANE, ss = planeSS, f = function (v) { return String(Math.round(v * 100) / 100); };
    var live = q.on && !q.back;
    // the shadow: far to the left and faint while the plane is high, closing on the wheels and darkening as it comes down
    var k = clamp01(q.hgt / 130), sh = live ? 0.3 * Math.pow(1 - k, 1.7) : 0;
    // the smoke, t2 seconds after the wheels touched
    var t2 = q.t2, smoking = t2 >= 0 && t2 < 1.6, e = smoking ? 1 - Math.pow(1 - clamp01(t2 / 1.5), 2.2) : 0;
    var puffO = smoking ? 0.92 * ss(0, 0.07, t2) * (1 - ss(0.3, 1.5, t2)) : 0;
    var sx = smoking ? Math.min(q.x - 6, P.TDX + 54) : P.TDX, len = clamp01((sx - (P.TDX - 8)) / 62);
    var streakO = smoking ? 0.8 * ss(0.02, 0.14, t2) * (1 - ss(0.45, 1.35, t2)) : 0;
    return h("g", null,
      h("defs", null, A.clip),
      h("g", { clipPath: "url(#nPlaneRunway)" },
        h("path", { d: A.shadowD, fill: DAY.planeShadow, opacity: f(sh), transform: "translate(" + f(q.x - 0.7 * q.hgt - 4) + "," + (P.GY + 1.6) + ") scale(" + f(1 + 0.4 * k) + ",1)" })),
      h("g", { transform: "translate(" + f(sx - 9 * ss(0.5, 1.5, t2)) + "," + (P.GY + 1) + ") scale(" + f(Math.max(0.05, len)) + "," + f(0.7 + 1.5 * ss(0.2, 1.4, t2)) + ")", opacity: f(streakO) }, A.streak),
      h("g", { transform: "translate(" + f(P.TDX - 6 - 20 * e) + "," + f(P.GY + 1 - 3 * e) + ") scale(" + f(0.45 + 1.45 * e) + ")", opacity: f(puffO) }, A.puff),
      live ? JetPlane(q) : planeAway()
    );
  }
  function AirportPlaneBack(time) {
    // the back slot: the same plane once it has passed PLANE.HAND, drawn behind Tokyo Tower and the near rows
    var q = planeAt(time);
    return q.on && q.back ? JetPlane(q) : planeAway();
  }

//== INSERT before "          TokyoTower({ cx: 1360"
          AirportPlaneBack(time),
