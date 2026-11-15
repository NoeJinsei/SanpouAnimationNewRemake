/* The airliner's climb, slowed (2026-11-15, after the four fixes).
   On a phone the plane was clearly in open sky for about a second: the only open sky a phone has in the
   finale is the band between the two buttons (stage y 356) and the roofs, left of Tokyo Tower, and the
   plane crossed it at 250 to 300 px a second, still gaining speed. The path that clears the Tower is
   kept exactly (the fix of round 5 stays); what changes is how fast the plane travels along it.
   The part replaces the flight's notes, PLANE, planeRun and the two lines of planeAt that read them. */

//== REPLACE from "  /* The flight: one 19 s cycle" to "  var PLANE_AWAY"
  /* The flight: one 26 s cycle, every value a pure function of the clock.
       0     .. 5.1   final approach: the sink rate eases off in the flare, the nose comes up
       5.1            the main wheels touch at x 330 (aft pair first): the bogie levels, the legs squat past
                      their resting length and come back; the nose is lowered, not dropped
       5.1   .. 8.1   rollout to the stand at x 474: spoilers up, a long soft stop, the nose dips on the brakes
       8.1   .. 9.5   the hold: flaps come up to the take-off setting
       9.5   .. 11.5  the take-off roll: the nose rises, the legs stretch as the wing takes the weight
       11.53          the wheels leave the runway at x 554; the path bends up over PLANE.BLEND px into a
                      straight climb of slope PLANE.SLOPE (42.6 degrees), the pitch leading it a little
       11.9  .. 13.2  the gear folds away; 13.8 .. 15.9 the flaps run in
       11.5  .. 20.3  the first climb, at a steady PLANE.CLIMB_V px a second over the ground (see below);
                      a phone has it in its open sky from 15.5 (the nose comes in) to 19.7 (the nose goes
                      up behind the buttons)
       20.3  .. 24.0  it gathers speed again and climbs away: in front of Tokyo Tower's mast (x 1360) at
                      20.8 .. 22.3, out by the top edge, up and to the left of the sun, at 24.0
       24.0  .. 26    off the picture
     x is where the main gear stands; y is the body's origin (see planeArt).

     The path, round 5 (2026-11-15), unchanged. The plane used to climb at slope 0.56, which took it across
     the middle of Tokyo Tower's lattice (y 444 .. 552 at the Tower's x), drawn behind it: the lattice cut
     through the fuselage and the window line, and it read as a crash. No climb an airliner could fly
     from this runway clears the Tower's top (y 168; that takes 48 degrees), so the plane climbs steeply
     enough to pass the Tower where the Tower is thinnest, and it is drawn in FRONT of it (the plane has
     one slot, the last thing drawn in the scene), so nothing is ever drawn across it:
       the climb line is y = 963 - 0.92 (x - 646.5) for the body's origin (the wheels hang 5 px lower);
       at the Tower's axis the fuselage is at y 237 .. 274, the engine's underside at y 300 and the
       fin's tip at y 187: all of it on the banded mast and the needle (y 176 .. 335, 5 to 14 px wide),
       which it covers a piece at a time, the needle's tip showing above it all the while.
       Over the antenna drum (x 1348 .. 1372, its collar's top at y 333) the plane's lowest point is
       y 310, over the top deck (x 1336 .. 1384, roof at y 362) y 322: the drum, the deck and the
       lattice are never touched;
       after the Tower it leaves by the top edge at x 1630 .. 1740, up and to the left of the sun: its
       nearest point (the engine's underside) passes 77 px from the sun's centre, 20 px outside the halo.
     The ground part is as it was up to the wheels' lift-off, and the path is nowhere lower than the
     round 4 one (0.92 / 185 > 0.56 / 120), so everything that was composed under that line (the depot,
     the roofs, the windsock: nothing within 30 px under the wheels) is further below the plane.

     The speed along it, round 6 (2026-11-15). A phone sees only x 955 .. 1553 of this scene, and its
     open sky is the band under the two buttons (stage y 356 down to the roofs), left of the Tower. The
     plane used to keep the thrust of its roll all the way up (62 px/s2: 95 px/s at lift-off, 250 to 300
     across the phone), so it crossed that band in a second. An aircraft does not do that: once it
     rotates, the push goes into height. So from lift-off on:
       the forward acceleration dies away in PLANE.LAG s and, while the path bends up (PLANE.EASE s), the
       speed over the ground settles to PLANE.CLIMB_V. Along the 43 degree path that is 101 px/s, a
       little more than it had on the runway (95) and less than it flies on the approach (120 px/s);
       PLANE.ACC_AT s after lift-off (the flaps are in, the nose is under the buttons on a phone) it
       gathers speed again at PLANE.ACC px/s2 (the thrust of its roll), coming on over PLANE.ACC_IN s,
       and climbs away: it is in front of the Tower's mast for 1.5 s where it was 0.6 s.
     The pitch belongs to the place, not to the clock: it is read at the moment of the old climb at
     which the plane stood at this x (planeOldS), so the nose rises over the same stretch of runway and
     sky as before, the tail is as clear of the runway as it was, and ROT keeps its meaning. */
  var PLANE = { T: 26, TD: 5.1, ROLL: 3, HOLD: 1.4, LIFT: 2.03, OUT: 14.7, GY: 968, TDX: 330, STAND: 474, SLOPE: 0.92, BLEND: 185, ROT: 3.6, HANG: 5, NOSE_X: 82,
    CLIMB_V: 74, EASE: 1.5, LAG: 0.25, ACC_AT: 8.8, ACC: 62, ACC_IN: 1 };
  PLANE.CLIMB = Math.atan(PLANE.SLOPE) * 180 / Math.PI;                                             // the climb angle, degrees
  function planeSS(a, b, v) { var t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); }
  function planeRoll(s) { return PLANE.STAND + 62 * (s * s / 2 - 0.5 * s + 0.25 * (1 - Math.exp(-2 * s))); }   // thrust comes on over half a second, then holds
  PLANE.LIFT_X = planeRoll(PLANE.LIFT);
  PLANE.LIFT_V = 62 * (PLANE.LIFT - 0.5 + 0.5 * Math.exp(-2 * PLANE.LIFT));                         // its speed and
  PLANE.LIFT_A = 62 * (1 - Math.exp(-2 * PLANE.LIFT));                                              // its acceleration as the wheels leave the runway
  // where the main gear is, s seconds after the brakes come off: the roll, then the climb's own speed
  function planeRun(s) {
    var P = PLANE, d = s - P.LIFT;
    if (d <= 0) return planeRoll(s);
    var tau = P.LAG, u = Math.min(1, d / P.EASE), drop = P.LIFT_V + P.LIFT_A * tau - P.CLIMB_V;
    var w = d - P.ACC_AT, W = P.ACC_IN, k = 0;
    if (w > 0) { var uw = w / W; k = w < W ? W * W * (Math.pow(uw, 4) / 4 - Math.pow(uw, 5) / 10) : 0.15 * W * W + (w - W) * w / 2; }
    return P.LIFT_X + P.LIFT_V * d + P.LIFT_A * tau * (d - tau * (1 - Math.exp(-d / tau)))
      - drop * (d < P.EASE ? P.EASE * (u * u * u - u * u * u * u / 2) : d - P.EASE / 2) + P.ACC * k;
  }
  // the moment of the old climb (the roll's thrust kept all the way up) at which the gear stood at x
  function planeOldS(x) { return 0.5 + Math.sqrt(Math.max(0, 2 * (x - PLANE.STAND) / 62 - 0.25)); }

//== REPLACE from "      q.x = planeRun(s);" to "      if (s < P.LIFT) {"
      q.x = planeRun(s);
      // the pitch: thrust lifts the nose a touch, the rotation (both exactly as they were), then it follows
      // the path up (slowly enough that the tail stays 18 px clear of the runway, as it did), overshoots a
      // little and settles on the climb angle. After lift-off it is read by the place (se), not the clock.
      var se = s < P.LIFT ? s : P.LIFT + planeOldS(q.x) - planeOldS(P.LIFT_X);
      q.rot = -0.45 * ss(0.1, 0.7, s) - 9.6 * ss(1.2, 2.25, se) - (P.CLIMB - 8.65) * ss(2.05, P.ROT, se) + 1.4 * ss(P.ROT, P.ROT + 1.1, se) + 0.3 * Math.sin(time * 0.9) * ss(4.3, 5.4, se);
