//== REPLACE from "    POLE_X0: -226, POLE_N: 6, POLE_GAP: 640, POLE_H: 240," to "    DASH_X: 100, DASH_W: 130, DASH_P: 300, DASH_Y: 54,"
    // POLE_OPEN (round 7): no lines are strung from this pole to the next one. That span is the one Tokyo
    // Tower stands behind while scene 01 holds (the pole behind the truck's box to the pole right of the
    // Tower), so the lines end at one pole and start again at the next and the Tower's outline is clean.
    // When the camera pans, the next span only comes in front of the Tower once the warehouse covers it.
    POLE_X0: -226, POLE_N: 6, POLE_GAP: 640, POLE_H: 240, POLE_OPEN: 2,
//== REPLACE from "      if (i < S.POLE_N - 1) {" to "        var nx = px + gp, mx = px + gp / 2;"
      if (i < S.POLE_N - 1 && i !== S.POLE_OPEN) {
