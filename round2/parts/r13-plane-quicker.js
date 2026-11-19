//== REPLACE from "     circle 20.9 s into each cycle, with its body and its fin on the upper left of that line, and at that" to "     moment the kite is at the right-hand end of its circle, on the other side of the line and 59 px from"
     circle 21.0 s into each cycle, with its body and its fin on the upper left of that line, and at that
//== REPLACE from "    n: { groups: [[744, 212, 52, 5, 0, 0.06], [-608, 212, 52, 3, 5, 0.06]], kite: [1250, 432, 84, 1.15], span: 52 * LOOP, loop: LOOP, turns: 4, turn0: 2.747 }" to "  };"
    n: { groups: [[744, 212, 52, 5, 0, 0.06], [-608, 212, 52, 3, 5, 0.06]], kite: [1250, 432, 84, 1.15], span: 52 * LOOP, loop: LOOP, turns: 4, turn0: 2.684 }
//== REPLACE from "       8.1   .. 12.34 the hold: flaps come up to the take-off setting, then it stands lined up (round 12:" to "     x is where the main gear stands; y is the body's origin (see planeArt)."
       8.1   .. 13.45 the hold: flaps come up to the take-off setting, then it stands lined up (rounds 12
                      and 13: the time the quicker departure saves is spent here, so the cycle is still
                      26 s and the plane is in front of Tokyo Tower at the moment of the cycle it always was)
       13.45 .. 15.5  the take-off roll: the nose rises, the legs stretch as the wing takes the weight
       15.49          the wheels leave the runway at x 554; the path bends up over PLANE.BLEND px into a
                      straight climb of slope PLANE.SLOPE (42.6 degrees), the pitch leading it a little
       15.9  .. 17.2  the gear folds away; 17.8 .. 19.9 the flaps run in
       15.5  .. 23.9  the climb, gathering speed all the way (see below): 92 px/s over the ground as the
                      wheels leave, 131 to 151 across a phone's open sky (18.9 .. 21.4), 154 in front of
                      Tokyo Tower's mast (x 1360, 21.7), and away: out by the top edge, up and to the
                      left of the sun, at 23.9
       23.9  .. 26    off the picture
//== REPLACE from "       up the climb, so the wheels leave at 85 px/s and it crosses a phone's sky at 112 to 129;" to "     The pitch belongs to the place, not to the clock: it is read at the moment of the old climb at"
       up the climb, so the wheels leave at 92 px/s and it crosses a phone's sky at 131 to 151;
       from PLANE.SURGE_AT s on (it is in front of Tokyo Tower by then, above a phone's buttons) the
       acceleration rises to PLANE.SURGE_A px/s2 over PLANE.SURGE_IN s and it climbs away: 220 px/s
       as the last of it leaves the picture (23.9 s into the cycle), 252 when it is switched off, well
       above the top edge.
     Round 13 (2026-11-19), the owner on round 12: "the plane could accelerate just a bit faster than what
     we have". The push now eases a little later (EASE_AT 1.5, it was 1.2) and to more (CLIMB_A 8, it was
     6; SURGE_A 50, it was 45): 92 px/s as the wheels leave (85 in round 12), 131 to 151 across a phone's
     sky (112 to 129), 154 at the Tower (131).
     The fast part comes after a phone's band on purpose (`node tools/plane-visible.mjs round2` says how
     long the plane is seen there). The quicker the departure, the longer PLANE.HOLD (the plane stands
     lined up): the cycle is 26 s as before and the plane passes the Tower at the same moment of it, so a
     flock still crosses nine seconds ahead of it and the kite is at the far end of its circle when it
     comes by (BIRD_SETS.n.turn0).
//== REPLACE from "  var PLANE = { T: 26, TD: 5.1, ROLL: 3, HOLD: 4.24, LIFT: 2.03, OUT: 12.5, GY: 968, TDX: 330, STAND: 474, SLOPE: 0.92, BLEND: 185, ROT: 3.6, HANG: 5, NOSE_X: 82," to "  PLANE.CLIMB = Math.atan(PLANE.SLOPE) * 180 / Math.PI;                                             // the climb angle, degrees"
  var PLANE = { T: 26, TD: 5.1, ROLL: 3, HOLD: 5.35, LIFT: 2.03, OUT: 11.1, GY: 968, TDX: 330, STAND: 474, SLOPE: 0.92, BLEND: 185, ROT: 3.6, HANG: 5, NOSE_X: 82,
    ACC: 62, EASE_AT: 1.5, EASE_IN: 1.4, CLIMB_A: 8, SURGE_AT: 8.3, SURGE_IN: 2, SURGE_A: 50 };
//== REPLACE from "    // touchdown, 4.3 s before the brakes come off for the take-off, so it runs along well behind the plane as" to "    // the plane rolls away (150 px or more from its tail). It is tied to PLANE.HOLD: when round 12 made the"
    // touchdown, 3.8 s before the brakes come off for the take-off, so it runs along well behind the plane as
