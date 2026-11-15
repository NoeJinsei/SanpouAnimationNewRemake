//== REPLACE from "    landFar: []," to "    landNear: []"
    // OPTION "cloud" (2026-11-15, not picked): the climb exactly as it was (slope 0.56, behind Tokyo Tower),
    // and a cumulus standing behind the Tower's waist at the moment the plane crosses it, with the plane's
    // back slot moved behind that cloud: the plane goes into the cloud left of the Tower and comes out to
    // the right of it. The cloud is 440 px wide, its underside at y 562 (4 px above the tallest roof it
    // passes, the far tower at x 1474), its dome on the Tower's axis at time 15.4 (40.0 s on the site).
    landFar: [[1125, 562, 440, 1]],
//== REPLACE from "  var PLANE = { T: 19," to "  function planeSS("
  var PLANE = { T: 19, TD: 5.1, ROLL: 3, HOLD: 1.4, LIFT: 2.03, OUT: 7.8, GY: 968, TDX: 330, STAND: 474, SLOPE: 0.56, BLEND: 120, HAND: 1100, HANG: 5, NOSE_X: 82 };   // HAND 1170 -> 1100: handed over before its nose reaches the cloud
//== REPLACE from "          AirportPlaneBack(time)," to "          TokyoTower({ cx: 1360, baseY: 1008, h: 840, time: time, opacity: 0.97 }),"
//== REPLACE from "          CloudField(SKY_FINALE.landFar, 0, time * recede, 0)," to "          CloudField(SKY_FINALE.landNear, 1, time * recede, 0),"
          AirportPlaneBack(time),
          CloudField(SKY_FINALE.landFar, 0, time * recede, 0),
