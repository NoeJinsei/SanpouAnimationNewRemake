//== REPLACE from "    var clouds = range(7, function (i) {" to "    return h(\"div\", { style: { position: \"absolute\", inset: 0, background: \"#eaf5fc\", overflow: \"hidden\" } },"
    // the sky is composed, not scattered: [x at t = 0, underside y, width, build]. Near clouds drift at one
    // speed, the small distant ones at another, behind the whole skyline. The field is wider than both
    // camera positions together, so a cloud wraps (and fades) only where it cannot be seen, and none of
    // them crosses the sun while scenes 01 and 02 hold.
    var CLOUD_SPAN = 3600, CLOUD_X0 = -700;
    var cloudsNear = [[110, 215, 470, 2], [760, 330, 380, 0], [1160, 160, 390, 1], [1930, 350, 480, 0], [2380, 300, 340, 1], [-520, 262, 420, 3]];
    var cloudsFar = [[-30, 480, 240, 3], [940, 455, 210, 1], [1590, 470, 230, 3], [2300, 462, 250, 0]];
    var cloudAt = function (c, sp) {
      var wx = ((((c[0] - CLOUD_X0 + time * sp) % CLOUD_SPAN) + CLOUD_SPAN) % CLOUD_SPAN) + CLOUD_X0;
      var ed = Math.min((wx - CLOUD_X0) / 60, (CLOUD_X0 + CLOUD_SPAN - wx) / 60, 1);
      return h("g", { transform: "translate(" + wx.toFixed(2) + ", " + c[1] + ")" }, Cloud({ w: c[2], kind: c[3], o: sp < 4 ? 0.82 : 1.04, edge: ed }));
    };
//== REPLACE from "        SkySun({ cx: 1772, cy: 104, r: 52, time: time, gid: \"wSun\" })," to "        h(\"g\", { transform: \"translate(\" + (-cam * 0.18) + \", 0)\" }, skylineDeep"
        LightShafts({ ox: 2060, oy: -120, time: time }),
        SkySun({ cx: 1772, cy: 104, r: 52, time: time, gid: "wSun" }),
        h("g", { transform: "translate(" + (-cam * 0.08) + ", 0)" }, cloudsFar.map(function (c) { return cloudAt(c, 2.6); })),
        h("g", { transform: "translate(" + (-cam * 0.12) + ", 0)" },
          h("path", { d: "M-300," + GROUND + " C300," + (GROUND - 150) + " 800," + (GROUND - 60) + " 1400," + (GROUND - 130) + " C2000," + (GROUND - 195) + " 2600," + (GROUND - 55) + " 3200," + (GROUND - 120) + " C3800," + (GROUND - 180) + " 4400," + (GROUND - 70) + " 5200," + (GROUND - 140) + " L5200," + GROUND + " Z", fill: DAY.hill }),
          h("path", { d: "M-300," + GROUND + " C200," + (GROUND - 62) + " 700," + (GROUND - 112) + " 1300," + (GROUND - 60) + " C1900," + (GROUND - 26) + " 2500," + (GROUND - 118) + " 3100," + (GROUND - 66) + " C3700," + (GROUND - 34) + " 4400," + (GROUND - 108) + " 5200," + (GROUND - 56) + " L5200," + GROUND + " Z", fill: DAY.hillNear })
        ),
//== REPLACE from "          clouds.map(function (c) { var range2 = WORLD_W * 0.5" to "          DayBirds({ seed: \"w-birds\", count: 4"
          cloudsNear.map(function (c) { return cloudAt(c, 4.5); }),
