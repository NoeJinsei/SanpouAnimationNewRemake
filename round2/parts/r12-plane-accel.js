//== REPLACE from "     circle 20.4 s into each cycle, with its body and its fin on the upper left of that line, and at that" to "     moment the kite is at the right-hand end of its circle, on the other side of the line and 59 px from"
     circle 20.9 s into each cycle, with its body and its fin on the upper left of that line, and at that
//== REPLACE from "    n: { groups: [[744, 212, 52, 5, 0, 0.06], [-608, 212, 52, 3, 5, 0.06]], kite: [1250, 432, 84, 1.15], span: 52 * LOOP, loop: LOOP, turns: 4, turn0: 2.984 }" to "  };"
    n: { groups: [[744, 212, 52, 5, 0, 0.06], [-608, 212, 52, 3, 5, 0.06]], kite: [1250, 432, 84, 1.15], span: 52 * LOOP, loop: LOOP, turns: 4, turn0: 2.747 }
//== REPLACE from "       8.1   .. 9.5   the hold: flaps come up to the take-off setting" to "     x is where the main gear stands; y is the body's origin (see planeArt)."
       8.1   .. 12.34 the hold: flaps come up to the take-off setting, then it stands lined up (round 12:
                      the time the quicker departure saves is spent here, so the cycle is still 26 s and
                      the plane is in front of Tokyo Tower at the moment of the cycle it always was)
       12.34 .. 14.4  the take-off roll: the nose rises, the legs stretch as the wing takes the weight
       14.40          the wheels leave the runway at x 554; the path bends up over PLANE.BLEND px into a
                      straight climb of slope PLANE.SLOPE (42.6 degrees), the pitch leading it a little
       14.8  .. 16.1  the gear folds away; 16.7 .. 18.8 the flaps run in
       14.4  .. 24.8  the climb, gathering speed all the way (see below): 85 px/s over the ground as the
                      wheels leave, 112 to 129 across a phone's open sky (18.4 .. 21.3), 132 in front of
                      Tokyo Tower's mast (x 1360, 21.7), and away: out by the top edge, up and to the
                      left of the sun, at 24.2
       24.2  .. 26    off the picture
//== REPLACE from "     The speed along it, round 6 (2026-11-15). A phone sees only x 955 .. 1553 of this scene, and its" to "     The pitch belongs to the place, not to the clock: it is read at the moment of the old climb at"
     The speed along it, round 12 (2026-11-17). The owner: "it should be sped up based on its acceleration
     when it is departing from the runway, kind of like an actual plane flying". Round 6 had slowed the
     climb for the sake of a phone (a phone sees only x 955 .. 1553 of this scene, and its open sky is the
     band under the two buttons down to the roofs, left of the Tower): the plane reached 95 px/s on the
     runway, then SLOWED to a steady 74 over the ground, held that for nearly nine seconds, and only then
     gathered speed. Now its speed only ever rises, from the brakes coming off to the top of the picture:
       the roll: the thrust of PLANE.ACC px/s2 comes on over half a second, as it always did;
       from PLANE.EASE_AT s on (the nose is coming up) more and more of the push goes into height: over
       PLANE.EASE_IN s the acceleration over the ground eases to PLANE.CLIMB_A px/s2 and stays there
       up the climb, so the wheels leave at 85 px/s and it crosses a phone's sky at 112 to 129;
       from PLANE.SURGE_AT s on (it is in front of Tokyo Tower by then, above a phone's buttons) the
       acceleration rises to PLANE.SURGE_A px/s2 over PLANE.SURGE_IN s and it climbs away, 230 px/s
       as it leaves the picture.
     The fast part comes after a phone's band on purpose (`node tools/plane-visible.mjs round2` says how
     long the plane is seen there). The departure is 2.2 s shorter than it was, and PLANE.HOLD is 2.84 s
     longer (the plane stands lined up): the cycle is 26 s as before and the plane passes the Tower at the
     same moment of it, so a flock still crosses nine seconds ahead of it and the kite is at the far end
     of its circle when it comes by (BIRD_SETS.n.turn0).
//== REPLACE from "  var PLANE = { T: 26, TD: 5.1, ROLL: 3, HOLD: 1.4, LIFT: 2.03, OUT: 14.7, GY: 968, TDX: 330, STAND: 474, SLOPE: 0.92, BLEND: 185, ROT: 3.6, HANG: 5, NOSE_X: 82," to "  PLANE.CLIMB = Math.atan(PLANE.SLOPE) * 180 / Math.PI;                                             // the climb angle, degrees"
  // (LIFT is the old clock's lift-off, 2.03 s into the roll with its thrust held: it fixes where the wheels leave,
  // PLANE.LIFT_X, and the pitch's clock. The wheels now leave PLANE.LIFT_T s after the brakes come off.)
  var PLANE = { T: 26, TD: 5.1, ROLL: 3, HOLD: 4.24, LIFT: 2.03, OUT: 12.5, GY: 968, TDX: 330, STAND: 474, SLOPE: 0.92, BLEND: 185, ROT: 3.6, HANG: 5, NOSE_X: 82,
    ACC: 62, EASE_AT: 1.2, EASE_IN: 1.4, CLIMB_A: 6, SURGE_AT: 9.4, SURGE_IN: 2, SURGE_A: 45 };
//== REPLACE from "  PLANE.LIFT_V = 62 * (PLANE.LIFT - 0.5 + 0.5 * Math.exp(-2 * PLANE.LIFT));                         // its speed and" to "  // the moment of the old climb (the roll's thrust kept all the way up) at which the gear stood at x"
  // an acceleration of 1 px/s2 that comes on over W s (a smooth step): the distance it has added w s after it began
  function planeGain(w, W) { if (w <= 0) return 0; var u = w / W; return w < W ? W * W * (Math.pow(u, 4) / 4 - Math.pow(u, 5) / 10) : 0.15 * W * W + (w - W) * w / 2; }
  // where the main gear is, s seconds after the brakes come off (round 12: its speed only ever rises)
  function planeRun(s) {
    var P = PLANE;
    return P.STAND + P.ACC * (s * s / 2 - 0.5 * s + 0.25 * (1 - Math.exp(-2 * s)))
      - (P.ACC - P.CLIMB_A) * planeGain(s - P.EASE_AT, P.EASE_IN) + (P.SURGE_A - P.CLIMB_A) * planeGain(s - P.SURGE_AT, P.SURGE_IN);
  }
  // the old clock on the runway: the moment of the roll as it was (planeRoll) at which the gear stood at x
  function planeRollS(x) { var lo = 0, hi = PLANE.LIFT; for (var i = 0; i < 44; i++) { var m = (lo + hi) / 2; if (planeRoll(m) < x) lo = m; else hi = m; } return (lo + hi) / 2; }
  // the moment the wheels leave the runway: the gear reaches PLANE.LIFT_X, where the path begins to bend up
  PLANE.LIFT_T = (function () { var lo = 0, hi = 6; for (var i = 0; i < 60; i++) { var m = (lo + hi) / 2; if (planeRun(m) < PLANE.LIFT_X) lo = m; else hi = m; } return (lo + hi) / 2; })();
//== REPLACE from "      q.flap = 1 - 0.55 * ss(P.ROLL + 0.1, P.ROLL + P.HOLD - 0.1, tg);" to "      q.t2 = tg;"
      q.flap = 1 - 0.55 * ss(P.ROLL + 0.1, P.ROLL + 1.3, tg);        // (over the 1.2 s they always took; the plane then stands lined up)
//== REPLACE from "      var se = s < P.LIFT ? s : P.LIFT + planeOldS(q.x) - planeOldS(P.LIFT_X);" to "      // (round 11: the climb's slight weave and the lamp below are read on the plane's own cycle, t, like the rest"
      // (round 12) se, the old clock, is read by the place on the runway too (planeRollS), so the nose comes up and
      // the body rises on its legs over the same stretch of runway as before, whatever the speed along it.
      // sg = the old clock for what follows lift-off by time (gear, flaps).
      var se = s < P.LIFT_T ? planeRollS(q.x) : P.LIFT + planeOldS(q.x) - planeOldS(P.LIFT_X), sg = s - P.LIFT_T + P.LIFT;
//== REPLACE from "      if (s < P.LIFT) {" to "        q.ext = z; q.tilt = 0; q.y = P.GY - z;"
      if (s < P.LIFT_T) {
        z = P.HANG * ss(1.2, 2, se);
//== REPLACE from "        q.tilt = -12 * ss(P.LIFT, P.LIFT + 0.5, s);" to "    } else q = PLANE_AWAY;"
        q.tilt = -12 * ss(P.LIFT, P.LIFT + 0.5, sg);
      }
      q.noseFold = ss(2.4, 3.4, sg); q.mainFold = ss(2.55, 3.7, sg); q.door = 1 - ss(3.3, 3.75, sg);    // positive climb: gear up
      q.flap = 0.45 * (1 - ss(4.3, 6.4, sg));
//== REPLACE from "    // the baggage train: 19 s from edge to edge at the pace it always had, then it waits behind the depot, so it" to "    var tx = -90 + Math.min(919.6, went);"
    // the baggage train: 19 s from edge to edge at the pace it always had, then it waits behind the depot, so it
    // comes in once in each of the plane's cycles and always at the same moment of the flight: after the
    // touchdown, 4.3 s before the brakes come off for the take-off, so it runs along well behind the plane as
    // the plane rolls away (150 px or more from its tail). It is tied to PLANE.HOLD: when round 12 made the
    // plane stand longer, a train on its old time came up to 12 px behind the tail. (Left on a round of its
    // own, 19 s or a third of the loop, it drove along under the plane all through every second landing.)
    var trainRound = 48.4 * LOOP / 2, went = (((48.4 * (time - 4.3149 - PLANE.HOLD)) % trainRound) + trainRound) % trainRound;   // px since it last came in at the left edge
