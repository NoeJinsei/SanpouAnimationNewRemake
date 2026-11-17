//== INSERT before "  var easeOutCubic = function (t) { return 1 - Math.pow(1 - t, 3); };"
  /* The player's two paces (round 11). hero-glue.js plays every entrance ENTER_RATE (1.2) times as fast as a
     hold, and a scene's clock was simply its frame: so a scene ran a fifth faster while it entered and
     dropped to its own speed in the one frame its hold began. Where fast things are moving at that moment
     it showed as a lurch: in scene 03 the whole road went from 324 to 270 px/s in one frame, in scene 05
     the trucks from 72 to 60 and the plane, rolling out, from 100 to 78.
     (`node evidence/2026-11-17-finale-loop/check/handover-check.mjs round2` measures every scene's.)
     ENTER_PACE is the player's ENTER_RATE: keep the two the same.
     holdSettle: a hold's clock that sets off at the entrance's pace and settles to its own over n frames
     (hold = the frame the hold begins at). After that it is the frame plus a constant. */
  var ENTER_PACE = 1.2;
  function holdSettle(frame, hold, n) {
    var x = frame - hold; if (x <= 0) return frame;
    var u = x / n; return frame + (ENTER_PACE - 1) * (u < 1 ? x - n * (u * u * u - u * u * u * u / 2) : n / 2);
  }
//== REPLACE from "  function sceneTransit(frame) {" to "    // the seam from scene 02: `ahead` is how far the camera still has to come before it rides with the convoy."
  function sceneTransit(frame) {
    // (round 11) The hold begins at this scene's frame 55 (the player's entrance ends at master frame 475, and this
    // scene starts at 420). It sets off at the entrance's pace and settles to its own in a second and a half, so
    // the road, the skyline, the wheels and the sky no longer lose a sixth of their speed in one frame.
    frame = holdSettle(frame, 55, 45);
    var fps = FPS, time = frame / fps;
//== REPLACE from "    // the finale's sky clock: it stands still under the map's panel and runs, at its own even pace, from the" to "    var recede = interpolate(frame, [T_NETWORK.mapRecede[0], T_NETWORK.mapRecede[1]], [0, 1],"
    // (round 11) `now`, the finale's own clock: one second a second. It stands still under the map (the finale
    // cannot be seen then, so nothing in it is worked out again while the map is up) and starts with the frame
    // the map begins to draw back. Through the rest of the entrance, which the player plays 1.2 times as fast as
    // a hold, it counts back from the hold's first frame at that pace, so the finale's world moves at its own
    // speed from the moment it is seen and nothing in it slows in one frame as the hold begins. From the hold's
    // first frame on it is the frame, as it always was: the hold and its loop are untouched.
    var HOLD = T_NETWORK.holdFrom, seen = Math.max(frame, T_NETWORK.mapRecede[0]);
    // ... and the map's clock, mapT (its water, its dashes, its trucks). The map's hold (frame 80, with its own
    // clock tOverride) sets off at the entrance's pace and settles to its own in a second and a half, so the
    // trucks, arriving just then, no longer lose two fifths of their speed in one frame. That leaves the clock
    // 0.15 s ahead; the finale's entrance (frame 80 on, no clock of its own) goes on from there at the hold's
    // pace, one second a second, so the water, the dashes and any truck still on its road go on unbroken and
    // at the same speed while the map draws back (the frame alone would run them a fifth faster from 27.8 s).
    var MAP_HOLD = T_NETWORK.pinPop + 20, MAP_SETTLE = 1.5;
    var mapT = tOverride != null ? holdSettle(time, MAP_HOLD / fps, MAP_SETTLE) : frame >= MAP_HOLD ? MAP_HOLD / fps + (ENTER_PACE - 1) * MAP_SETTLE / 2 + (frame - MAP_HOLD) / (fps * ENTER_PACE) : time;
    var now = seen >= HOLD ? seen / fps : HOLD / fps - (HOLD - seen) / (fps * ENTER_PACE);
    // the sky runs on that clock (skyStart = the clock at the frame the map begins to go). The clouds stand where
    // they were composed (sky0, the moment the sky was composed at) less how far they have gone out on the
    // loop's one sine: at rest when the map begins to draw back, at rest again when they are home
    var skyT = now, skyStart = HOLD / fps - (HOLD - T_NETWORK.mapRecede[0]) / (fps * ENTER_PACE);
    var sky0 = T_NETWORK.mapRecede[0] / fps, skyOut = (1 - Math.cos(2 * Math.PI * (skyT - skyStart) / LOOP)) / 2;
//== REPLACE from "          recede > 0 ? DayBirds({ set: \"n\", time: time }) : DayBirdsNone()," to "          FujiMountain({ cx: 380, baseY: 1008, w: 2020, ht: 706, capT: 0.3 }),"
          recede > 0 ? DayBirds({ set: "n", time: now }) : DayBirdsNone(),
//== REPLACE from "          TokyoTower({ cx: 1360, baseY: 1008, h: 840, time: time, opacity: 0.97, loop: LOOP })," to "          CityHaze(\"nHazeNear\", 1010, 1),"
          TokyoTower({ cx: 1360, baseY: 1008, h: 840, time: now, opacity: 0.97, loop: LOOP }),
          CityRow(city.back, 0), CityCranes(city.back, now, 0, 0, LOOP), CityRow(city.front, 0), CityLights(city.lights, now, 0, 0, LOOP),
//== REPLACE from "          Airport(time)," to "        )"
          Airport(now),
          FinaleDepot(now),
          FinaleRoad(now),
          AirportPlane(now)
//== REPLACE from "          MapSwell(recede < 1 ? time : T_NETWORK.mapRecede[1] / fps)," to "          mapLayer(mapShore().land, { willChange: \"transform\" }),"
          MapSwell(recede < 1 ? mapT : T_NETWORK.mapRecede[1] / fps),             // (round 11) once the map has gone its water is not worked out again
//== REPLACE from "            CoverageMap({ prefProgress: prefK, routeProgress: routeK, pinProgress: pinK, depotFrame: frame, flowTime: recede < 1 ? time : 0, mapIn: mapIn }))))," to "      recede < 0.96 ? h(\"div\", { style: { opacity: 1 - recede, transform: \"translateX(\" + (recede * 60) + \"px)\" } },"
            CoverageMap({ prefProgress: prefK, routeProgress: routeK, pinProgress: pinK, depotFrame: frame, flowTime: recede < 1 ? mapT : 0, mapIn: mapIn })))),
