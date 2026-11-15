//== REPLACE from "     A streak is the same construction pressed flat: a long low bank of shallow lobes on a level base, one" to "     Species are written in thousandths of the cloud's width; local space x 0..w, the underside at y = 0. */"
     A streak (round 10, 2026-11-16) is one long lens: a low back with one hump left of the middle and a
     slighter one toward the right, a nearly level underside, and both ends drawn out to a point, in one
     pale colour with no shade. It is written out whole as a path (3 has a second, shorter lens lying on
     its back; 4 is plain). The round 4 streaks were a row of low lobes on
     a level base with round ends, which read as a bar, and 3 carried a detached dash above it.
//== REPLACE from "    { lobes: [[80, -12, 80, 14], [250, -22, 140, 30], [440, -28, 150, 40], [660, -20, 150, 28], [850, -14, 120, 18], [960, -8, 40, 10]]," to "    { lobes: [[140, -70, 120, 85], [430, -170, 200, 170], [730, -105, 190, 120], [905, -50, 85, 62]],"
    { path: "M0 -12C110 -24 240 -40 380 -46C520 -52 640 -44 760 -40C860 -36 940 -24 1000 -12C880 -4 700 0 500 0C300 0 120 -3 0 -12Z" +
        "M280 -38C380 -62 520 -76 660 -70C760 -66 830 -52 870 -34C740 -32 500 -30 280 -38Z", box: [0, -76, 1000, 0] },
    { path: "M0 -8C90 -18 200 -34 330 -44C430 -52 520 -50 600 -42C700 -36 760 -40 830 -34C900 -28 960 -18 1000 -10C900 -3 760 0 600 0C400 0 180 -1 0 -8Z", box: [0, -52, 1000, 0] },
//== INSERT before "    var k = CLOUDS[kind], L = k.lobes, n = L.length, from = [], to = [], i, j, a, lo, hi, mid, RAD = Math.PI / 180;"
    if (CLOUDS[kind].path) return _cloudForm[kind] = { sil: CLOUDS[kind].path, lit: "", box: CLOUDS[kind].box };   // a streak is written out whole
//== REPLACE from "     right; a far streak lies across the sun; in scenes 03 and 05 a far bank passes behind Mt Fuji's" to "     shoulders and a cumulus stands low between Fuji and the city. One scrap at most."
     right; a far streak lies high in the sky to the left of the sun, and THE SUN STANDS CLEAR: no cloud
     crosses its disc or its ring while a scene rests (round 10: the streak used to lie across the sun,
     which read as a pale bar over it). In scenes 03 and 05 a far bank passes behind Mt Fuji's
//== REPLACE from "     (that is why scene 02's middle is left to the birds), and the streak across the sun must clear the" to "  var SKY_WORLD = {"
     (that is why scene 02's middle is left to the birds). Its far streak stands above Tokyo Tower's tip
     in both scenes and stops short of the tower block of scene 02 (roof at y 121). */
//== REPLACE from "    far: [[1690, 106, 580, 4]]," to "    near: [[100, 250, 480, 0], [640, 280, 380, 1], [1450, 200, 100, 5]]"
    far: [[1180, 100, 500, 4]],
//== REPLACE from "    far: [[130, 262, 600, 3], [1660, 128, 560, 4]]," to "    near: [[845, 372, 500, 0], [-40, 268, 420, 1], [1380, 196, 240, 2]]"
    far: [[130, 262, 600, 3], [820, 108, 500, 4]],
//== REPLACE from "    far: [[40, 392, 700, 3], [1470, 172, 560, 4]]," to "    near: [[110, 245, 480, 0], [820, 425, 500, 1], [1570, 268, 96, 6]],"
    far: [[40, 392, 700, 3], [1040, 150, 480, 4]],
//== INSERT before "    var recede = interpolate(frame, [T_NETWORK.mapRecede[0], T_NETWORK.mapRecede[1]], [0, 1], { extrapolateLeft: \"clamp\", extrapolateRight: \"clamp\", easing: function (u) { return landEase(u, 0.35); } });"
    // the finale's sky clock: it stands still under the map's panel and runs, at its own even pace, from the
    // frame the map starts to draw back. From then on it is the scene's clock, so every cloud is where it was composed.
    var skyT = frame > T_NETWORK.mapRecede[0] ? time : T_NETWORK.mapRecede[0] / fps;
//== REPLACE from "        // the sky the map floats in is the finale's sky. It holds still while the map is up (the player's" to "        // (30 circles that were never seen stood here: gone, round 7)"
        // the finale's sky, on its own clock (skyT, above). Round 10: its clock used to be the scene's clock
        // times how far the map had drawn back, so as the map left, the clouds ran through three seconds of
        // drift in well under one (23 px in 0.4 s) and the shafts swung into place.
        h("g", { opacity: clamp01((frame - 24) / 12).toFixed(3) },
          LightShafts({ cx: 1652, cy: 136, time: skyT }),
          SkySun({ cx: 1652, cy: 136, time: skyT, gid: "nSun" })),
        CloudField(SKY_FINALE.far, 0, skyT, 0),
        CloudField(SKY_FINALE.near, 1, skyT, 0),
//== REPLACE from "          CloudField(SKY_FINALE.landFar, 0, time * recede, 0)," to "          recede > 0 ? DayBirds({ set: \"n\", time: time }) : DayBirdsNone(),"
          CloudField(SKY_FINALE.landFar, 0, skyT, 0),
          CloudField(SKY_FINALE.landNear, 1, skyT, 0),
