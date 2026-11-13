//== REPLACE from "  function Truck(p) {" to "  /* ---- scenery.tsx ---- */"
  /* ---- Truck and Parcel, redrawn for round 2 ----
     A Japanese medium-duty cab-over box truck in side elevation, facing right. Same props, anchor and
     footprint as before: the rear of the cargo box is local x 0, the box is 0..122 x 8..74, the front
     bumper ends near x 177, the tyres stand on local y 98 and the caller's y is local y 96.
     One optional new prop: `time` (seconds). With it a parked truck shows a faint exhaust wisp (the
     engines run at the dock); without it the truck draws exactly the same, minus the wisp.
     Draw order: ground shadow, exhaust, what sits behind the wheels, the wheels, the body. Body bob and
     pitch move the two body groups together and never the wheels. Everything static is built once and
     shared by every truck; the node list has the same shape on every frame. */
  DAY.truckBoxLit = "#ffffff";      // the box: sunlit sheen
  DAY.truckBoxShade = "#dbe4f1";    // the box: white in shade (periwinkle)
  DAY.truckAlu = "#e2e8f1";         // aluminium rails, posts and side guards
  DAY.truckDoor = "#e9eef6";        // rear door panel, seen when it swings open
  DAY.truckSteel = "#8496b0";       // wheels, tank, lock rods
  DAY.truckSteelLit = "#b6c2d3";
  DAY.truckSteelShade = "#55657f";
  DAY.truckCab = "#23344f";         // the cab: navy
  DAY.truckCabLit = "#3d5580";
  DAY.truckCabShade = "#192740";
  DAY.truckFrame = "#1c2840";       // chassis, fenders, mirror
  DAY.truckFrameLit = "#2c3a55";
  DAY.truckTyre = "#151f31";
  DAY.truckTyreLit = "#2b3a52";
  DAY.truckGlass = "#9dbddc";       // glass reflecting the sky
  DAY.truckGlassLit = "#d3e5f5";
  DAY.truckGlassShade = "#6f90b6";  // the seat seen through it
  DAY.truckBumper = "#44546f";
  DAY.truckBumperLit = "#5d6f8d";
  DAY.truckLens = "#f1f5fa";
  DAY.truckStripe2 = "#eda898";     // the thin second stripe (vermilion, paler)
  DAY.truckExhaust = "#edf2f8";
  DAY.truckShadow = "rgba(10,20,36,0.28)"; // one flat shape on the road
  DAY.parcelShade = "#dbe4f1";
  DAY.parcelTapeShade = "#c8523a";

  // a band between two radii, from angle a0 to a1 (degrees, clockwise on screen, 0 = right, -90 = up)
  function arcBand(cx, cy, r0, r1, a0, a1) {
    var q = function (r, a) { var t = a * Math.PI / 180; return (cx + r * Math.cos(t)).toFixed(2) + "," + (cy + r * Math.sin(t)).toFixed(2); };
    var big = a1 - a0 > 180 ? 1 : 0;
    return "M" + q(r1, a0) + " A" + r1 + "," + r1 + " 0 " + big + " 1 " + q(r1, a1) + " L" + q(r0, a1) + " A" + r0 + "," + r0 + " 0 " + big + " 0 " + q(r0, a0) + " Z";
  }
  var TRUCK_WHEELS = [50, 150], TRUCK_WHEEL_R = 11;   // rear (twin tyres: a dished rim), front
  var _truckArt = null;
  function truckArt() {
    if (_truckArt) return _truckArt;
    var ink = COLORS.ink, D = DAY, R = function (x, y, w, hh, fill, rx) { return h("rect", { x: x, y: y, width: w, height: hh, rx: rx || 0, fill: fill }); };
    var holes = function (rad, r) { var d = ""; for (var i = 0; i < 6; i++) { var a = i * Math.PI / 3, cx = Math.cos(a) * rad, cy = Math.sin(a) * rad; d += "M" + (cx - r).toFixed(2) + "," + cy.toFixed(2) + "a" + r + "," + r + " 0 1 0 " + (2 * r) + ",0a" + r + "," + r + " 0 1 0 " + (-2 * r) + ",0"; } return d; };
    var art = {};
    // the ground shadow falls away from the sun: down and to the left
    art.shadow = h("path", { d: "M-13,95.6 L177,95.6 L169,102.2 L-25,102.2 Z", fill: D.truckShadow });
    // behind the wheels: chassis rail, rear bumper bracket, exhaust pipe
    art.back = [
      R(-2.5, 77, 129.5, 5.5, D.truckFrame, 1),
      R(1, 80, 2.2, 4.4, D.truckFrame),
      R(17, 85.6, 20, 3, D.truckSteelShade, 1.5),
      R(14, 85, 5, 4.2, D.truckSteel, 1.2)
    ];
    // wheels: tyre with a lit crescent toward the sun, rim lip; then per axle the face, the turning hand holes, the hub
    art.tyre = [
      h("circle", { r: TRUCK_WHEEL_R, fill: D.truckTyre }),
      h("path", { d: arcBand(0, 0, 8.4, 10.2, -80, 4), fill: D.truckTyreLit }),
      h("circle", { r: 7, fill: D.truckSteelLit })
    ];
    art.face = [h("circle", { r: 5.9, fill: D.truckSteelShade }), h("circle", { r: 5.9, fill: D.truckSteel })];
    art.holes = [h("path", { d: holes(4.5, 0.95), fill: D.truckFrame }), h("path", { d: holes(4.3, 0.95), fill: D.truckSteelShade })];
    art.hub = [
      [h("circle", { r: 2.9, fill: D.truckSteel }), h("circle", { r: 1.35, fill: D.truckSteelLit })],      // rear: dished
      [h("circle", { r: 2.8, fill: D.truckSteelLit }), h("circle", { r: 1.35, fill: D.truckSteelShade })]  // front: proud hub
    ];
    // the body, part 1: under-body gear and the cargo box
    art.frontA = [
      h("path", { d: arcBand(50, 87, 13, 15, -165, -15), fill: D.truckFrame }),           // rear mudguard
      R(34.6, 77, 3.4, 16.4, D.truckTyre, 0.8),                                          // mud flap
      R(69, 77, 1.8, 12, D.truckFrame), R(86, 77, 1.8, 12, D.truckFrame),                 // side guard stays
      R(66, 80.8, 25, 2.3, D.truckAlu, 1), R(66, 86.4, 25, 2.3, D.truckAlu, 1),          // side guard rails
      R(95, 78.6, 24, 12.4, D.truckSteel, 2.6),                                          // fuel tank
      R(95, 78.6, 24, 3.6, D.truckSteelLit, 2.2),
      R(95.6, 87.4, 22.8, 3.2, D.truckSteelShade, 1.6),
      R(99, 78, 2.2, 13.6, D.truckFrame), R(111.6, 78, 2.2, 13.6, D.truckFrame),          // tank straps
      h("rect", { x: 95, y: 78.6, width: 24, height: 12.4, rx: 2.6, fill: "none", stroke: ink, strokeWidth: 1.3 }),
      R(1.5, 74, 121, 3.2, D.truckFrameLit),                                             // body sub-frame
      R(8, 74.3, 5, 2.6, D.marker, 1), R(61, 74.3, 5, 2.6, D.marker, 1), R(111, 74.3, 5, 2.6, D.marker, 1),
      // the box
      R(0, 8, 122, 66, D.truckBox, 2),
      h("path", { d: "M84,12.9 L103,12.9 L87,61 L68,61 Z M108,12.9 L113,12.9 L97,61 L92,61 Z", fill: D.truckBoxLit }),
      R(0, 8, 122, 3.4, D.truckAlu, 2),                                                  // top rail
      R(1.3, 11.4, 119.4, 1.5, D.truckBoxShade),                                         // its shadow
      R(1.3, 12.9, 2.5, 58.3, D.truckBoxShade),                                          // rear post, away from the sun
      R(118.2, 12.9, 2.5, 58.3, D.truckAlu),                                             // front post
      R(0, 61, 122, 6, COLORS.verm),
      R(0, 69.4, 122, 1.8, D.truckStripe2),
      R(1.3, 71.2, 119.4, 1.6, D.truckAlu),                                              // bottom rail
      R(0.6, 8.6, 3.6, 3.6, D.truckSteelLit, 0.6), R(117.8, 8.6, 3.6, 3.6, D.truckSteelLit, 0.6),   // corner castings
      R(0.6, 69.8, 3.6, 3.6, D.truckSteelLit, 0.6), R(117.8, 69.8, 3.6, 3.6, D.truckSteelLit, 0.6),
      R(9, 20, 4, 15, COLORS.verm),
      h("text", { x: 19, y: 30, fontFamily: FONTS.lat, fontSize: 12.5, fontWeight: 800, fill: ink, letterSpacing: 0.4, style: { textRendering: "geometricPrecision" } }, "Sanpou"),
      h("text", { x: 19, y: 42, fontFamily: FONTS.jp, fontSize: 7.5, fontWeight: 700, fill: "rgba(16,31,54,0.55)", letterSpacing: 1.5, style: { textRendering: "geometricPrecision" } }, "三豊運輸"),
      h("rect", { x: 0, y: 8, width: 122, height: 66, rx: 2, fill: "none", stroke: ink, strokeWidth: 2.6 }),
      R(-1.4, 15.5, 2.8, 5.2, D.truckSteel, 0.6), R(-1.4, 36.5, 2.8, 5.2, D.truckSteel, 0.6), R(-1.4, 54, 2.8, 5.2, D.truckSteel, 0.6)   // door hinges
    ];
    // the near rear door, drawn fully open (hinge at x 0, reaching 24 to the right) and flipped behind the box by its group
    art.door = [
      R(0, 13, 24, 58, D.truckBoxShade, 1.2),
      R(2, 15, 20, 54, D.truckDoor),
      R(7.4, 13, 1.8, 58, D.truckSteel), R(16, 13, 1.8, 58, D.truckSteel),               // lock rods
      R(5.8, 45, 5, 2.6, D.truckFrame, 1.2), R(14.4, 45, 5, 2.6, D.truckFrame, 1.2),     // their handles
      R(0, 16.6, 6, 2.2, D.truckSteelShade), R(0, 38.2, 6, 2.2, D.truckSteelShade), R(0, 57.2, 6, 2.2, D.truckSteelShade),
      h("rect", { x: 0, y: 13, width: 24, height: 58, rx: 1.2, fill: "none", stroke: ink, strokeWidth: 1.6 })
    ];
    // the body, part 2: the cab and everything on it
    var shell = "M126,80 L126,26.6 Q126,24.6 128,24.6 L160,24 Q165.4,24 167.2,27.6 L173.4,45.2 Q174.8,46.4 174.8,48.4 L174.8,78 Q174.8,80 172.8,80 L161.2,80 A13.2,13.2 0 0 0 138.8,80 Z";
    art.frontB = [
      R(122.8, 29, 2.6, 48, D.truckFrame),                                               // engine air intake behind the cab
      R(122, 25.4, 4.2, 4.8, D.truckSteelShade, 1.4),
      h("path", { d: shell, fill: D.truckCab }),
      h("path", { d: "M127.3,27.6 L127.3,26.6 Q127.3,25.9 128.2,25.9 L160,25.3 Q163.9,25.3 165.5,27.6 Z", fill: D.truckCabLit }),   // roof edge in the sun
      R(127.3, 27.6, 2.2, 33.4, D.truckCabShade),                                        // back wall, away from the sun
      h("path", { d: "M127.3,61 L173.5,61 L173.5,78.7 L160.3,78.7 A13.2,13.2 0 0 0 139.7,78.7 L127.3,78.7 Z", fill: D.truckCabShade }),   // lower body, turned under
      R(172.2, 48.6, 1.4, 12.4, D.truckCabLit),                                          // front corner catching the sun
      h("path", { d: arcBand(150, 87, 13.2, 15, -148, -32), fill: D.truckFrame }),        // wheel-arch lip
      h("path", { d: "M164.7,28.7 L167.1,28.1 L173,45 L169.7,45 Z", fill: D.truckGlass }),      // the windscreen, seen from its edge
      h("path", { d: "M139.5,29.2 L161.6,29.2 L167.2,45 L139.5,45 Z", fill: D.truckGlass }),    // door window
      h("path", { d: "M146.5,29.2 L154,29.2 L149,45 L141.5,45 Z", fill: D.truckGlassLit }),
      h("path", { d: "M139.5,29.2 L161.6,29.2 L167.2,45 L139.5,45 Z", fill: "none", stroke: ink, strokeWidth: 1.4, strokeLinejoin: "round" }),
      h("path", { d: "M137.4,27.4 L137.4,70.8 L168.8,70.8 L168.8,47.6", fill: "none", stroke: ink, strokeWidth: 1.4, strokeLinejoin: "round", opacity: 0.75 }),   // door seam
      R(140, 50.6, 6.4, 2.4, ink, 1.2),                                                  // door handle
      h("rect", { x: 156.6, y: 51.6, width: 8.6, height: 7.4, rx: 1.2, fill: D.truckGlass, stroke: ink, strokeWidth: 1.3 }),   // safety window, kerb side
      h("path", { d: "M159.4,52.3 L162.4,52.3 L160.4,58.3 L157.4,58.3 Z", fill: D.truckGlassLit }),
      R(131.4, 38, 1.8, 14, D.truckSteelLit, 0.9),                                       // grab handle
      h("path", { d: shell, fill: "none", stroke: ink, strokeWidth: 2.4, strokeLinejoin: "round" }),
      h("line", { x1: 173.9, y1: 46.2, x2: 171.4, y2: 38.6, stroke: ink, strokeWidth: 1.5, strokeLinecap: "round" }),   // wiper at rest
      // roof air deflector
      h("path", { d: "M128.4,24.6 L128.4,11 Q128.4,9.4 130.2,9.5 C146,10.6 158.5,15.4 164.6,24.2 Z", fill: D.truckCab }),
      h("path", { d: "M130.6,10.9 C145.6,12 157.4,16.2 163,23.4 L160.2,23.4 C154.8,17.8 144.8,14.3 130.6,13.4 Z", fill: D.truckCabLit }),
      h("path", { d: "M129.7,23.5 L129.7,16.6 L147,23.5 Z", fill: D.truckCabShade }),
      h("path", { d: "M128.4,24.6 L128.4,11 Q128.4,9.4 130.2,9.5 C146,10.6 158.5,15.4 164.6,24.2 Z", fill: "none", stroke: ink, strokeWidth: 2, strokeLinejoin: "round" }),
      // lamps and bumper
      R(170.6, 56.8, 4.8, 3.2, D.marker, 1),                                             // turn signal
      h("rect", { x: 170.6, y: 60.6, width: 4.8, height: 5.6, rx: 1.2, fill: D.truckLens, stroke: ink, strokeWidth: 1.2 }),   // headlamp
      R(163.4, 66.6, 14.2, 10.4, D.truckBumper, 2.4),
      R(164.4, 67.4, 12.2, 2.2, D.truckBumperLit, 1.1),
      R(164.8, 71.2, 6.4, 3, ink, 1),                                                    // cab step
      h("circle", { cx: 174.2, cy: 73, r: 1.6, fill: D.truckLens }),                       // fog lamp
      h("rect", { x: 163.4, y: 66.6, width: 14.2, height: 10.4, rx: 2.4, fill: "none", stroke: ink, strokeWidth: 1.6 }),
      // mirrors: the tall one on its stays, and the small round one over the front corner
      h("path", { d: "M165.6,31.6 L173,30 M168.2,43 L173,41.6 M168.2,26.6 L175.6,21.8", fill: "none", stroke: ink, strokeWidth: 1.5, strokeLinecap: "round" }),
      h("rect", { x: 172.6, y: 27.6, width: 4.4, height: 15.4, rx: 1.8, fill: D.truckFrame, stroke: ink, strokeWidth: 1.3 }),
      R(173.4, 29.2, 1.5, 12.2, D.truckCabLit, 0.75),
      h("circle", { cx: 176.6, cy: 21, r: 2.3, fill: D.truckFrame, stroke: ink, strokeWidth: 1.3 }),
      // rear end: tail lamp and the end of the under-run bar
      h("rect", { x: -1.8, y: 75.6, width: 3.6, height: 6.4, rx: 1, fill: COLORS.verm, stroke: ink, strokeWidth: 1.2 }),
      R(-3.4, 83.4, 8, 3.4, D.truckBumper, 1)
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
        art.frontA,
        h("rect", { x: 0.4, y: 12.6, width: 2.2, height: 58.8, fill: COLORS.recessed, opacity: e.toFixed(3) }),
        h("g", { transform: "scale(" + (-Math.max(swing, 0.001)).toFixed(4) + ", 1)", opacity: Math.min(1, e * 12).toFixed(3) }, art.door),
        art.frontB)
    );
  }

  /* ---- Parcel (bottom-centre anchor): a carton with its tape, a hand hole, a label and "this way up" ---- */
  var _parcelArt = {};
  function parcelArt(size) {
    if (_parcelArt[size]) return _parcelArt[size];
    var w = size, hh = size * 0.88, ink = COLORS.ink, tw = Math.max(5, w * 0.115);
    var up = function (ax) { var y0 = hh * 0.9, y1 = hh * 0.62, a = w * 0.05; return "M" + ax + "," + y0 + " L" + ax + "," + y1 + " M" + (ax - a) + "," + (y1 + a) + " L" + ax + "," + y1 + " L" + (ax + a) + "," + (y1 + a); };
    return _parcelArt[size] = h("g", { transform: "translate(" + (-w / 2) + ", " + (-hh) + ")" },
      h("rect", { x: 0, y: 0, width: w, height: hh, rx: 2, fill: COLORS.paper }),
      h("rect", { x: 0, y: 0, width: w, height: hh * 0.14, rx: 2, fill: COLORS.white }),                    // top edge in the sun
      h("rect", { x: 0, y: 0, width: w * 0.12, height: hh, rx: 2, fill: DAY.parcelShade }),                 // the side away from it
      h("rect", { x: w * 0.19, y: hh * 0.24, width: w * 0.2, height: hh * 0.1, rx: hh * 0.05, fill: COLORS.inkSoft }),   // hand hole
      h("path", { d: up(w * 0.23) + up(w * 0.35), fill: "none", stroke: ink, strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round", opacity: 0.45 }),
      h("rect", { x: w / 2 - tw / 2, y: 0, width: tw, height: hh, fill: COLORS.verm }),                     // tape over the seam
      h("rect", { x: w / 2 - tw / 2, y: 0, width: tw * 0.28, height: hh, fill: DAY.parcelTapeShade }),
      h("rect", { x: w * 0.62, y: hh * 0.5, width: w * 0.3, height: hh * 0.38, rx: 1.5, fill: COLORS.white, stroke: "rgba(16,31,54,0.5)", strokeWidth: 1.2 }),   // label
      h("rect", { x: w * 0.655, y: hh * 0.565, width: w * 0.2, height: 2.6, fill: ink, opacity: 0.6 }),
      h("rect", { x: w * 0.655, y: hh * 0.66, width: w * 0.13, height: 2.6, fill: ink, opacity: 0.35 }),
      h("rect", { x: w * 0.655, y: hh * 0.75, width: w * 0.23, height: hh * 0.08, fill: ink, opacity: 0.8 }),
      h("rect", { x: 0, y: 0, width: w, height: hh, rx: 2, fill: "none", stroke: ink, strokeWidth: 2.2 })
    );
  }
  function Parcel(p) {
    var x = p.x, y = p.y, size = p.size == null ? 38 : p.size, squash = p.squash == null ? 1 : p.squash,
      stretch = p.stretch == null ? 1 : p.stretch, rotation = p.rotation || 0, opacity = p.opacity == null ? 1 : p.opacity,
      shadow = p.shadow || 0, shadowY = p.shadowY;
    var w = size, sx = squash / stretch, sy = stretch / squash, gy = shadowY == null ? y : shadowY;
    return h("g", { opacity: opacity },
      h("ellipse", { cx: x, cy: gy + 2.5, rx: (w * 0.6 + (1 - shadow) * 14) * sx, ry: 4.2, fill: DAY.truckShadow, opacity: shadow.toFixed(3) }),
      h("g", { transform: "translate(" + x + ", " + y + ") rotate(" + rotation + ") scale(" + sx + ", " + sy + ")" }, parcelArt(size))
    );
  }

