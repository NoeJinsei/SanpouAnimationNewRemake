//== REPLACE from "     The plane leaves the runway and climbs along the line y = 968 - 0.56 (x - 614) (PLANE.SLOPE, PLANE.BLEND" to "     is at least 50 px below it, right of the Tower at least 60 px"
     When this was composed the plane left the runway along the line y = 968 - 0.56 (x - 614). (Round 5 made
     its climb steeper, see PLANE below: the plane is above that line everywhere now, so all of this holds
     with room to spare.) Everything it flies over stays under that line: between the airport and Tokyo Tower every roof
//== REPLACE from "  /* The flight: one 19 s cycle, every value a pure function of the clock." to "  var _planeAway = null;"
  /* The flight: one 19 s cycle, every value a pure function of the clock.
       0     .. 5.1   final approach: the sink rate eases off in the flare, the nose comes up
       5.1            the main wheels touch at x 330 (aft pair first): the bogie levels, the legs squat past
                      their resting length and come back; the nose is lowered, not dropped
       5.1   .. 8.1   rollout to the stand at x 474: spoilers up, a long soft stop, the nose dips on the brakes
       8.1   .. 9.5   the hold: flaps come up to the take-off setting
       9.5   .. 11.5  the take-off roll: the nose rises, the legs stretch as the wing takes the weight
       11.53          the wheels leave the runway at x 554; the path bends up over PLANE.BLEND px into a
                      straight climb of slope PLANE.SLOPE (42.6 degrees), the pitch leading it a little
       11.9  .. 13.2  the gear folds away; 13.8 .. 15.9 the flaps run in
       15.1  .. 15.7  it passes in front of Tokyo Tower's mast (x 1360), above the top deck and the drum
       16.4  .. 19    off the picture (it has left by the top edge, up and to the left of the sun)
     x is where the main gear stands; y is the body's origin (see planeArt).

     The climb, round 5 (2026-11-15). The plane used to climb at slope 0.56, which took it across the
     middle of Tokyo Tower's lattice (y 444 .. 552 at the Tower's x), drawn behind it: the lattice cut
     through the fuselage and the window line, and it read as a crash. No climb an airliner could fly
     from this runway clears the Tower's top (y 168; that takes 48 degrees), so the plane now climbs
     steeply enough to pass the Tower where the Tower is thinnest, and it is drawn in FRONT of it (the
     plane has one slot now, the last thing drawn in the scene), so nothing is ever drawn across it:
       the climb line is y = 963 - 0.92 (x - 646.5) for the body's origin (the wheels hang 5 px lower);
       at the Tower's axis the fuselage is at y 237 .. 274, the engine's underside at y 300 and the
       fin's tip at y 187: all of it on the banded mast and the needle (y 176 .. 335, 5 to 14 px wide),
       which it covers a piece at a time for 0.6 s, the needle's tip showing above it all the while.
       Over the antenna drum (x 1348 .. 1372, its collar's top at y 333) the plane's lowest point is
       y 310, over the top deck (x 1336 .. 1384, roof at y 362) y 322: the drum, the deck and the
       lattice are never touched;
       after the Tower it leaves by the top edge at x 1630 .. 1740, up and to the left of the sun: its
       nearest point (the engine's underside) passes 77 px from the sun's centre, 20 px outside the halo.
     The ground part is as it was up to the wheels' lift-off, and the path is nowhere lower than the old
     one (0.92 / 185 > 0.56 / 120), so everything that was composed under the old line (the depot, the
     roofs, the windsock: nothing within 30 px under the wheels) is further below the plane than before.
     The rotation is about as quick as it was: 43 degrees over 185 px (1.35 s) where it was 29 degrees
     over 120 px (0.95 s). SLOPE, BLEND and ROT (when the pitch reaches the climb angle) go together. */
  var PLANE = { T: 19, TD: 5.1, ROLL: 3, HOLD: 1.4, LIFT: 2.03, OUT: 7.8, GY: 968, TDX: 330, STAND: 474, SLOPE: 0.92, BLEND: 185, ROT: 3.6, HANG: 5, NOSE_X: 82 };
  PLANE.CLIMB = Math.atan(PLANE.SLOPE) * 180 / Math.PI;                                             // the climb angle, degrees
  function planeSS(a, b, v) { var t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); }
  function planeRun(s) { return PLANE.STAND + 62 * (s * s / 2 - 0.5 * s + 0.25 * (1 - Math.exp(-2 * s))); }   // thrust comes on over half a second, then holds
  PLANE.LIFT_X = planeRun(PLANE.LIFT);
  var PLANE_AWAY = { on: false, x: -460, y: 820, rot: 0, ext: 5, tilt: -12, nose: 5, mainFold: 0, noseFold: 0, door: 1, flap: 1, spoil: 0, hgt: 400, t2: -1, lamp: 0, opacity: 0 };
  var _planeAt = { time: null, q: null };
  function planeAt(time) {
    if (_planeAt.time === time) return _planeAt.q;
    var P = PLANE, ss = planeSS, t = ((time % P.T) + P.T) % P.T, tg = t - P.TD, s = tg - P.ROLL - P.HOLD, z, zn;
    var bump = function (v, c, w) { v = (v - c) / w; return Math.exp(-v * v); };
    var q = { on: true, x: 0, y: 0, rot: 0, ext: P.HANG, tilt: -12, nose: P.HANG, mainFold: 0, noseFold: 0, door: 1, flap: 1, spoil: 0, hgt: 0, t2: -1, lamp: 0, opacity: 1 };
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
      // the pitch: thrust lifts the nose a touch, the rotation (both exactly as they were), then it follows
      // the path up (slowly enough that the tail stays 18 px clear of the runway, as it did), overshoots a
      // little and settles on the climb angle
      q.rot = -0.45 * ss(0.1, 0.7, s) - 9.6 * ss(1.2, 2.25, s) - (P.CLIMB - 8.65) * ss(2.05, P.ROT, s) + 1.4 * ss(P.ROT, P.ROT + 1.1, s) + 0.3 * Math.sin(time * 0.9) * ss(4.3, 5.4, s);
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
    } else q = PLANE_AWAY;
    if (q.on) q.lamp = Math.pow(Math.max(0, Math.sin(time * 5.2)), 8);
    _planeAt.time = time; _planeAt.q = q;
    return q;
  }
//== REPLACE from "  function AirportPlane(time) {" to "  /* ---- Scene4Network.tsx ---- */"
  function AirportPlane(time) {
    // the plane's one slot, the last thing drawn in the scene: the plane through its whole cycle (it is in
    // front of everything, Tokyo Tower's mast included), with what it leaves on the runway: its contact
    // shadow and the smoke of the tyres
    var q = planeAt(time), A = planeArt(), P = PLANE, ss = planeSS, f = function (v) { return String(Math.round(v * 100) / 100); };
    var live = q.on;
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
//== REPLACE from "          AirportPlaneBack(time)," to "          TokyoTower({ cx: 1360, baseY: 1008, h: 840, time: time, opacity: 0.97 }),"
