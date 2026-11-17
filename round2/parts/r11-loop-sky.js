//== INSERT before "  var SUN_R = 42;                         // the sun's disc: the same size and finish in every scene"
  /* ---- The finale's loop (round 11, 2026-11-17) ----
     The finale is what a visitor sits and watches, so it is one loop: the picture LOOP seconds from now is
     this same picture, for as long as anybody stays. Nothing is reset to make that so, so there is no seam
     and no special frame: every moving thing in the finale simply goes round a whole number of times in
     LOOP seconds. The plane's cycle is 26 s and the flocks come round every 52 s, so LOOP is 52.
     A part that other scenes use too is told the loop (`loop`); without it, it moves exactly as it always
     did, so scenes 01 to 04 are untouched.
       loopW  a rate (radians a second), moved to the nearest one that turns a whole number of times in L s
       loopT  a period (seconds), moved to the nearest one that goes into L s a whole number of times
     `node evidence/2026-11-17-finale-loop/check/loop-check.mjs round2` compares every node of the picture
     with the same node one loop later. Anything new that moves in the finale must pass it. */
  var LOOP = 52;
  function loopW(w, L) { return L ? 2 * Math.PI * Math.max(1, Math.round(w * L / (2 * Math.PI))) / L : w; }
  function loopT(T, L) { return L ? L / Math.max(1, Math.round(L / T)) : T; }
//== REPLACE from "  function LightShafts(p) {" to "  /* The sun: a bloom that bleeds into the sky, one flat halo, the disc and a lighter core. */"
  function LightShafts(p) {
    var ox = p.cx, oy = p.cy, time = p.time, k = p.k == null ? 1 : p.k, far = 2600, L = p.loop;
    var sway = (Math.sin(time * loopW(0.29, L)) * 0.012 + Math.sin(time * loopW(0.13, L) + 1.1) * 0.008) * k;
    var wWide = loopW(0.23, L), wFaint = loopW(0.41, L);
    return h("g", null, SHAFTS.map(function (s, i) {
      var a0 = s[0] + sway * (1 + i * 0.22), a1 = a0 + s[1] * (1 + 0.07 * k * Math.sin(time * wWide + s[3]));
      var o = s[2] * (1 - 0.16 * k * (0.5 + 0.5 * Math.sin(time * wFaint + s[3] * 1.7)));
      return h("polygon", { points: ox + "," + oy + " " + (ox + Math.cos(a0) * far).toFixed(1) + "," + (oy + Math.sin(a0) * far).toFixed(1) + " " + (ox + Math.cos(a1) * far).toFixed(1) + "," + (oy + Math.sin(a1) * far).toFixed(1), fill: DAY.shaft, opacity: o.toFixed(3) });
    }));
  }
//== REPLACE from "    var cx = p.cx, cy = p.cy, r = SUN_R, pulse = Math.sin(p.time * 0.5);" to "    return h(\"g\", null,"
    var cx = p.cx, cy = p.cy, r = SUN_R, pulse = Math.sin(p.time * loopW(0.5, p.loop));
//== INSERT before "  // each list knows its own name (w-far, t-near, n-landFar ...), which CloudField writes on its group for the check"
  /* The finale's clouds (round 11). A cloud that drifts one way for ever cannot be part of a loop: it only
     comes back by leaving the picture and coming in again at the other side, which at a cloud's pace takes
     ten minutes (and long before that the sky the owner approved has slid away: the near clouds have left
     by the left edge and nothing has come to take their place). So in the finale the clouds go out and
     come home: from where they were composed they drift left with the wind, as they always did and at
     the pace they always had, slow to a stop half a loop later and drift back, starting and landing at
     rest. One sine a loop, both planes together, the near plane further than the far one.
     SKY_SWAY = how far each plane goes (px): its fastest moment is the old steady drift (3.2 and 7 px/s). */
  var SKY_SWAY = [53, 116];
//== REPLACE from "    var skyT = frame > T_NETWORK.mapRecede[0] ? time : T_NETWORK.mapRecede[0] / fps;" to "    var recede = interpolate(frame, [T_NETWORK.mapRecede[0], T_NETWORK.mapRecede[1]], [0, 1],"
    var skyT = frame > T_NETWORK.mapRecede[0] ? time : T_NETWORK.mapRecede[0] / fps;
    // (round 11) the clouds stand where they were composed (the sky's clock at rest, sky0) less how far they
    // have gone out on the loop's one sine: at rest when the map draws back, at rest again when they are home
    var sky0 = T_NETWORK.mapRecede[0] / fps, skyOut = (1 - Math.cos(2 * Math.PI * (skyT - sky0) / LOOP)) / 2;
//== REPLACE from "          LightShafts({ cx: 1652, cy: 136, time: skyT })," to "        // (30 circles that were never seen stood here: gone, round 7)"
          LightShafts({ cx: 1652, cy: 136, time: skyT, loop: LOOP }),
          SkySun({ cx: 1652, cy: 136, time: skyT, gid: "nSun", loop: LOOP })),
        CloudField(SKY_FINALE.far, 0, sky0, SKY_SWAY[0] * skyOut),
        CloudField(SKY_FINALE.near, 1, sky0, SKY_SWAY[1] * skyOut),
//== REPLACE from "          CloudField(SKY_FINALE.landFar, 0, skyT, 0)," to "          recede > 0 ? DayBirds({ set: \"n\", time: time }) : DayBirdsNone(),"
          CloudField(SKY_FINALE.landFar, 0, sky0, SKY_SWAY[0] * skyOut),
          CloudField(SKY_FINALE.landNear, 1, sky0, SKY_SWAY[1] * skyOut),
