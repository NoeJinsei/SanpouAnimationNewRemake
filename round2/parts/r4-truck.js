//== REPLACE from "  /* ---- Truck and Parcel, redrawn for round 2 ----" to "  /* ---- Parcel (bottom-centre anchor)"
  /* ---- The truck, round 4 (2026-11-15): drawn again from a blank page ----
     A Japanese medium-duty cab-over dry van in ONE straight-on side elevation, facing right.
     Local units. The rear plane of the cargo box is x 0, the caller's y is local y 96, the tyres stand on
     y 98, the box is 0..122 x 8..74 with its floor at y 71, the front bumper ends at x 177.6.
     Back to front: the contact shadow, the exhaust, the chassis, the two wheels, then the body (under-body
     gear, the box, the rear door leaf, the cab). The body bobs and pitches as one; the wheels never do.
     Two small things ride on the same props: the cab nods a little further than the box on `pitch` (it sits
     on its own mounts, hinged at the front), and the mud flaps trail back with `run`.
     The lettering (owner, 2026-11-14): 三豊運輸 is the big line, the roman name the small line under it.
     Everything static is built once and shared by every truck; the node list has the same shape on every
     frame. No refrigeration unit, no badge, no aerial, no number plate, nobody in the cab. */
  DAY.truckBoxLit = "#ffffff";      // the box: edges that catch the sun
  DAY.truckBoxShade = "#d5dfee";    // the box: white in shade (periwinkle)
  DAY.truckBoxSeam = "#c3cfe3";     // the box: seams between its frame and its panel
  DAY.truckAlu = "#e4eaf3";         // aluminium rails, posts and side guards
  DAY.truckDoor = "#eaeff6";        // rear door panel, seen when it swings open
  DAY.truckSteel = "#8496b0";       // wheels, tank, lock rods
  DAY.truckSteelLit = "#b9c5d6";
  DAY.truckSteelShade = "#55657f";
  DAY.truckCab = "#28395a";         // the cab: navy
  DAY.truckCabLit = "#46608f";
  DAY.truckCabShade = "#1c2a45";
  DAY.truckSeam = "#101b30";        // door seams on the navy
  DAY.truckFrame = "#1c2840";       // chassis, fenders, mirror
  DAY.truckFrameLit = "#2f3e5b";
  DAY.truckTyre = "#151f31";
  DAY.truckTyreLit = "#2b3a52";
  DAY.truckGlass = "#9dbddc";       // glass reflecting the sky
  DAY.truckGlassLit = "#d3e5f5";
  DAY.truckGlassShade = "#6f90b6";  // the seat back seen through it, and glass under the visor
  DAY.truckBumper = "#8a9bb5";      // the bumper: painted steel
  DAY.truckBumperLit = "#bcc8d9";
  DAY.truckBumperShade = "#5a6b87";
  DAY.truckLens = "#f1f5fa";
  DAY.truckExhaust = "#edf2f8";
  DAY.truckShadow = "rgba(10,20,36,0.28)"; // one level shape on the road
  DAY.parcelShade = "#dbe4f1";
  DAY.parcelTapeShade = "#c8523a";

  // a band between two radii, from angle a0 to a1 (degrees, clockwise on screen, 0 = right, -90 = up)
  function arcBand(cx, cy, r0, r1, a0, a1) {
    var q = function (r, a) { var t = a * Math.PI / 180; return (cx + r * Math.cos(t)).toFixed(2) + "," + (cy + r * Math.sin(t)).toFixed(2); };
    var big = a1 - a0 > 180 ? 1 : 0;
    return "M" + q(r1, a0) + " A" + r1 + "," + r1 + " 0 " + big + " 1 " + q(r1, a1) + " L" + q(r0, a1) + " A" + r0 + "," + r0 + " 0 " + big + " 0 " + q(r0, a0) + " Z";
  }
  var TRUCK_WHEELS = [50, 148], TRUCK_WHEEL_R = 11;   // rear (twin tyres: a dished rim), front
  var _truckArt = null;
  function truckArt() {
    if (_truckArt) return _truckArt;
    var ink = COLORS.ink, D = DAY;
    var n2 = function (v) { return Math.round(v * 100) / 100; };
    // a level rectangle as path data, its corners rounded by r
    var rd = function (x, y, w, hh, r) {
      if (!r) return "M" + x + "," + y + "h" + w + "v" + hh + "h" + (-w) + "z";
      var c = "a" + r + "," + r + " 0 0 1 ";
      return "M" + n2(x + r) + "," + y + "h" + n2(w - 2 * r) + c + r + "," + r + "v" + n2(hh - 2 * r) + c + (-r) + "," + r + "h" + n2(2 * r - w) + c + (-r) + "," + (-r) + "v" + n2(2 * r - hh) + c + r + "," + (-r) + "z";
    };
    var F = function (fill, d) { return h("path", { d: d, fill: fill }); };                                  // one colour, many shapes
    var FO = function (fill, d, w) { return h("path", { d: d, fill: fill, stroke: ink, strokeWidth: w, strokeLinejoin: "round" }); };
    var O = function (d, w) { return h("path", { d: d, fill: "none", stroke: ink, strokeWidth: w, strokeLinejoin: "round", strokeLinecap: "round" }); };
    var ring = function (rad, r, n, a0) { var d = ""; for (var i = 0; i < n; i++) { var a = (a0 || 0) + i * 2 * Math.PI / n, cx = Math.cos(a) * rad, cy = Math.sin(a) * rad; d += "M" + (cx - r).toFixed(2) + "," + cy.toFixed(2) + "a" + r + "," + r + " 0 1 0 " + (2 * r) + ",0a" + r + "," + r + " 0 1 0 " + (-2 * r) + ",0"; } return d; };
    var art = {};

    // the contact shadow: one level bar on the road, a little toward the side away from the sun
    art.shadow = F(D.truckShadow, "M-4,96H173a2.4,2.4 0 0 1 0,4.8H-4a2.4,2.4 0 0 1 0,-4.8z");

    // behind the wheels: the chassis rail, the under-run bar's bracket, the gearbox under the cab's back, the exhaust
    art.back = [
      F(D.truckFrame, rd(-1.5, 77, 131, 5.2, 1) + rd(0.8, 81, 2.4, 4.6) + rd(117, 80, 20, 9.4, 2) + "M36.8,87 A13.2,13.2 0 0 1 63.2,87 Z M134.6,87 A13.4,13.4 0 0 1 161.4,87 Z"),   // and the dark of the two wheel housings
      F(D.truckSteelShade, rd(16, 85.6, 21, 3, 1.5)),
      F(D.truckSteel, rd(12.4, 85, 5.6, 4.2, 1.2))
    ];

    // the wheels. Per axle: the tyre with the crescent of light on its shoulder and the rim's lip (shared),
    // the wheel's face, the turning hand holes, the hub. Rear: twin tyres, so the face sits deep in the rim.
    art.tyre = [
      h("circle", { r: TRUCK_WHEEL_R, fill: D.truckTyre }),
      F(D.truckTyreLit, arcBand(0, 0, 8.3, 10.1, -84, 6)),
      h("circle", { r: 7, fill: D.truckSteelLit })
    ];
    art.face = [
      [h("circle", { r: 5.9, fill: D.truckSteelShade }), F(D.truckSteel, arcBand(0, 0, 4.3, 5.9, 80, 190)), h("circle", { r: 4.3, fill: D.truckSteel })],
      [h("circle", { r: 5.9, fill: D.truckSteel })]
    ];
    art.holes = [F(D.truckFrame, ring(3.05, 0.8, 5, 0.3)), F(D.truckFrame, ring(4.2, 1.05, 5, 0))];
    art.hub = [
      [h("circle", { r: 1.9, fill: D.truckSteelLit }), h("circle", { r: 0.9, fill: D.truckSteelShade })],
      [h("circle", { r: 2.8, fill: D.truckSteelShade }), h("circle", { r: 1.9, fill: D.truckSteelLit })]
    ];

    // the mud flaps hang behind each wheel (each in its own group: they trail back at speed)
    art.flap = [F(D.truckTyre, rd(34.2, 85.6, 3.2, 8.8, 0.8)), F(D.truckTyre, rd(133, 79.6, 3.2, 14, 0.8))];

    // the body, part 1: the gear under the floor, then the cargo box
    var box = "M0,10 Q0,8 2,8 L116.5,8 Q122,8 122,13.5 L122,72 Q122,74 120,74 L2,74 Q0,74 0,72 Z";
    art.frontA = [
      F(D.truckFrame, "M34.2,87 A15.8,15.8 0 0 1 65.8,87 L63.2,87 A13.2,13.2 0 0 0 36.8,87 Z" + rd(69.6, 77, 2, 13) + rd(83.4, 77, 2, 13) + rd(122.5, 29.5, 5.2, 48)),   // rear mudguard, side guard stays, the dark gap behind the cab
      F(D.truckAlu, rd(65.5, 80.2, 23.5, 2.7, 1.2) + rd(65.5, 86.4, 23.5, 2.7, 1.2)),                         // side guard rails
      h("rect", { x: 91.4, y: 79.2, width: 11.6, height: 11.6, rx: 1.4, fill: D.truckFrameLit, stroke: ink, strokeWidth: 1.3 }),   // battery box
      F(D.truckSteelLit, rd(95.6, 81.2, 3.2, 2.2, 0.6)),                                                      // its latch
      h("rect", { x: 105.6, y: 78.6, width: 21.6, height: 12.6, rx: 3, fill: D.truckSteel, stroke: ink, strokeWidth: 1.3 }),      // fuel tank
      F(D.truckSteelLit, rd(106.6, 79.3, 19.6, 3.2, 1.6)),                                                    // its top in the sun
      F(D.truckSteelShade, rd(107, 87.6, 18.8, 2.9, 1.4)),
      F(D.truckFrame, rd(110, 78, 2.2, 13.8) + rd(120.2, 78, 2.2, 13.8)),                                     // tank straps
      F(D.truckFrameLit, rd(1.5, 74, 121, 3.2)),                                                              // the body's sub-frame
      F(D.marker, rd(8, 74.5, 5, 2.4, 1) + rd(60, 74.5, 5, 2.4, 1) + rd(110, 74.5, 5, 2.4, 1)),               // side marker lamps
      // the box
      F(D.truckBox, box),
      F(D.truckAlu, "M0,10 Q0,8 2,8 L116.5,8 Q122,8 122,13.5 L122,72 Q122,74 120,74 L117.6,74 L117.6,13.8 Q117.6,11.8 115.6,11.8 L0,11.8 Z" + rd(0, 70.6, 117.6, 3.4)),   // top rail and front corner post in one piece, bottom rail
      F(D.truckBoxShade, rd(4.6, 11.8, 113, 1.8) + rd(1.3, 11.8, 3.3, 58.8)),                                 // shade under the top rail; the rear frame, away from the sun
      F(D.truckBoxLit, rd(2, 9.3, 113.6, 1.4) + rd(119.2, 15.4, 1.5, 55)),                                    // the rail's top and the post's sunny edge
      F(D.truckBoxSeam, rd(4.6, 13.6, 1.3, 57) + rd(116.3, 13.6, 1.3, 57)),                                   // where the panel meets the rear frame and the corner post
      F(COLORS.verm, rd(5.9, 58, 110.4, 7)),                                                                  // the one stripe
      h("text", { x: 14, y: 38.4, fontFamily: FONTS.jp, fontSize: 19, fontWeight: 800, fill: ink, letterSpacing: 1.8, style: { textRendering: "geometricPrecision" } }, CONTENT.brand.nameJp),
      h("text", { x: 14.9, y: 50.4, fontFamily: FONTS.lat, fontSize: 7, fontWeight: 700, fill: D.truckCab, letterSpacing: 3.6, style: { textRendering: "geometricPrecision" } }, CONTENT.brand.nameLat.toUpperCase()),
      O(box, 2.6),
      F(D.truckSteel, rd(-1.7, 16, 3, 5.4, 0.6) + rd(-1.7, 38.3, 3, 5.4, 0.6) + rd(-1.7, 60.6, 3, 5.4, 0.6)),  // rear door hinges, seen edge-on
      // rear end: tail lamp and the end of the under-run bar
      h("rect", { x: -1.9, y: 75.6, width: 3.8, height: 6.6, rx: 1, fill: COLORS.verm, stroke: ink, strokeWidth: 1.2 }),
      F(D.truckBumperShade, rd(-3.2, 83.4, 7.8, 3.4, 1))
    ];

    // the near rear door, drawn fully open (hinge at x 0, reaching 24 to the right) and flipped behind the box by its group
    art.door = [
      h("rect", { x: 0, y: 12.8, width: 24, height: 58.6, rx: 1.2, fill: D.truckDoor, stroke: ink, strokeWidth: 1.6 }),
      F(D.truckBoxShade, rd(0.8, 13.6, 22.4, 2.2) + rd(0.8, 68.4, 22.4, 2.2)),                                 // its top and bottom rails
      F(D.truckSteel, rd(6.6, 13.6, 2, 57) + rd(15.4, 13.6, 2, 57)),                                          // lock rods
      F(D.truckFrame, rd(5.2, 44.6, 5.6, 2.8, 1.3) + rd(14, 44.6, 5.6, 2.8, 1.3) + rd(5.6, 15.4, 4, 2.2) + rd(14.4, 15.4, 4, 2.2) + rd(5.6, 66.6, 4, 2.2) + rd(14.4, 66.6, 4, 2.2)),   // their handles and keepers
      F(D.truckSteelShade, rd(0.8, 17.6, 4.6, 2.4) + rd(0.8, 39.9, 4.6, 2.4) + rd(0.8, 62.2, 4.6, 2.4))        // hinge straps
    ];

    // the body, part 2: the cab and everything on it
    var shell = "M127,80 L127,30.6 Q127,27.5 130.1,27.5 L163.2,27.5 Q165.9,27.5 166.7,29.9 L173.3,51 Q174.9,52 174.9,54.6 L174.9,77.6 Q174.9,80 172.5,80 L159.66,80 A13.6,13.6 0 0 0 136.34,80 Z";
    var glass = "M141.2,34.2 Q141.2,32.6 142.8,32.6 L160.4,32.6 L167.1,54 L157,54 L153.2,50 L142.8,50 Q141.2,50 141.2,48.4 Z";
    var bumper = "M166.8,68.8 Q166.8,67 168.6,67 L175.8,67 Q177.6,67 177.6,68.8 L177.6,78.2 L174.4,83.6 L168.6,83.6 Q166.8,83.6 166.8,81.8 Z";
    art.cab = [
      F(D.truckCab, shell),
      F(D.truckCabLit, rd(129, 28.7, 34.2, 1.5)),                                                             // the roof's edge in the sun
      F(D.truckCabShade, rd(128.2, 30.4, 2.3, 48.4) + "M130.5,66 H173.7 V78.8 H158.85 A13.6,13.6 0 0 0 137.15,78.8 H130.5 Z"),   // the back wall; the lower body, turned under
      F(D.truckFrame, arcBand(148, 87, 13.3, 16.2, -153, -27)),                                               // wheel-arch flare
      F(D.truckGlass, glass + "M163.9,32.4 L167.5,32.4 L173.05,50.2 L169.45,50.2 Z"),                         // door glass; the windscreen, seen from its edge
      F(D.truckGlassLit, "M149.4,32.6 L155.2,32.6 L149.6,50 L143.8,50 Z M165.5,37.6 L169.1,37.6 L171.4,45 L167.8,45 Z"),
      F(D.truckGlassShade, rd(145, 40, 7, 10, 1.6) + "M163.9,32.4 L167.5,32.4 L168.25,34.8 L164.65,34.8 Z"),  // the seat back; glass in the visor's shade
      h("path", { d: glass + "M157,32.6 L157,54", fill: "none", stroke: ink, strokeWidth: 1.5, strokeLinejoin: "round" }),
      h("path", { d: "M138,30.2 L138,72.76 A17.4,17.4 0 0 1 161.2,75.6 L170,75.6 L170,55.6", fill: "none", stroke: D.truckSeam, strokeWidth: 1.5, strokeLinejoin: "round" }),   // door seam
      F(ink, rd(140.3, 56.6, 2.6, 7.6, 1.3) + rd(130.8, 38.2, 3.3, 1.7) + rd(130.8, 50.6, 3.3, 1.7)),         // door handle, grab-handle mounts
      F(D.truckSteelLit, rd(131.5, 37, 1.9, 16.4, 0.95)),                                                     // grab handle
      O(shell, 2.4),
      FO(D.truckCabLit, "M158.2,25.3 L171.8,29.1 Q173,29.5 172.7,30.7 L172.3,32.5 L166,31.5 L158.2,28.7 Z", 1.5),   // the visor
      // lamps, step, bumper
      h("rect", { x: 170.8, y: 56, width: 4.8, height: 10, rx: 1.3, fill: D.truckLens, stroke: ink, strokeWidth: 1.2 }),   // the lamp cluster: head lamp
      F(D.marker, rd(171.4, 56.6, 3.6, 2.8, 0.7)),                                                            // and turn signal
      F(ink, rd(160.2, 77, 7.4, 6.6, 1)),                                                                     // the step
      F(D.truckSteelLit, rd(160.8, 80.6, 6, 1.8)),                                                            // its tread
      FO(D.truckBumper, bumper, 1.6),
      F(D.truckBumperLit, rd(167.6, 67.8, 9.2, 2.3, 1)),
      F(D.truckBumperShade, "M167.6,79.2 H176.2 L174,82.8 H168.6 Q167.6,82.8 167.6,81.8 Z"),
      h("rect", { x: 171.4, y: 72.2, width: 4.2, height: 3.6, rx: 0.9, fill: D.truckLens, stroke: ink, strokeWidth: 1.1 }),   // fog lamp
      // the mirror on its stays, and the small round one under it
      O("M167.9,33.4 L174.6,34 M173.2,50 L174.6,50", 1.5),
      h("rect", { x: 174.2, y: 32, width: 4, height: 14.6, rx: 1.6, fill: D.truckFrame, stroke: ink, strokeWidth: 1.3 }),
      F(D.truckGlass, rd(174.9, 33.6, 1.5, 11.4, 0.7)),
      h("circle", { cx: 176.3, cy: 50.2, r: 2, fill: D.truckFrame, stroke: ink, strokeWidth: 1.2 })
    ];
    return _truckArt = art;
  }
  function Truck(p) {
    var x = p.x, y = p.y, scale = p.scale == null ? 1 : p.scale, distance = p.distance || 0,
      doorOpen = p.doorOpen || 0, bob = p.bob || 0, opacity = p.opacity == null ? 1 : p.opacity, moving = !!p.moving;
    var pitch = p.pitch || 0, run = p.run == null ? (moving ? 1 : 0) : p.run, time = p.time;
    var art = truckArt();
    var rot = (((distance / scale) / TRUCK_WHEEL_R) * (180 / Math.PI)) % 360;
    // the near rear door swings out on its hinge to just past square: what shows is its width seen from the side
    var k = Math.max(0, Math.min(1, doorOpen)), e = k * k * (3 - 2 * k), swing = Math.sin(e * 100 * Math.PI / 180);
    var body = "translate(0, " + bob + ") rotate(" + pitch.toFixed(3) + " 92 80)";
    // the cab sits on its own mounts, hinged at the front: it nods a little further than the box
    var nod = "rotate(" + (pitch * 0.45).toFixed(3) + " 169 80)";
    // the mud flaps hang square when the truck stands and trail back as it runs
    var trail = (run * 6).toFixed(2);
    // exhaust from the pipe under the rear overhang: two puffs paced by the road while driving, two slow
    // wisps paced by the clock while standing; each one swells in and thins out, so none pops on or off
    var idle = time == null ? 0 : 1 - run;
    var puff = function (kk, drive) {
      var a = Math.min(kk * 5, 1) * (1 - kk);
      return drive
        ? h("circle", { cx: (12 - kk * 32).toFixed(2), cy: (87 - kk * 15).toFixed(2), r: (1.8 + kk * 5).toFixed(2), fill: DAY.truckExhaust, opacity: (a * 0.62 * run).toFixed(3) })
        : h("circle", { cx: (12 - kk * 27 - Math.sin(kk * 5) * 1.2).toFixed(2), cy: (87 - kk * kk * 25).toFixed(2), r: (1.4 + kk * 3.8).toFixed(2), fill: DAY.truckExhaust, opacity: (a * 0.7 * idle).toFixed(3) });
    };
    var frac = function (v) { return v - Math.floor(v); };
    return h("g", { transform: "translate(" + x + ", " + y + ") scale(" + scale + ") translate(0, -96)", opacity: opacity },
      art.shadow,
      h("g", null,
        puff(frac(distance / 90), true), puff(frac(distance / 90 + 0.5), true),
        puff(frac((time || 0) * 0.36), false), puff(frac((time || 0) * 0.36 + 0.5), false)),
      h("g", { transform: body }, art.back),
      TRUCK_WHEELS.map(function (cx, i) {
        return h("g", { transform: "translate(" + cx + ", 87)" },
          art.tyre, art.face[i],
          h("g", { transform: "rotate(" + rot.toFixed(2) + ")" }, art.holes[i]),
          art.hub[i]);
      }),
      h("g", { transform: body },
        h("g", { transform: "rotate(" + trail + " 35.8 86)" }, art.flap[0]),
        h("g", { transform: "rotate(" + trail + " 134.6 79.8)" }, art.flap[1]),
        art.frontA,
        h("rect", { x: 1.3, y: 12.6, width: 2.4, height: 58.8, fill: COLORS.recessed, opacity: e.toFixed(3) }),
        h("g", { transform: "scale(" + (-Math.max(swing, 0.001)).toFixed(4) + ", 1)", opacity: Math.min(1, e * 12).toFixed(3) }, art.door),
        h("g", { transform: nod }, art.cab))
    );
  }

