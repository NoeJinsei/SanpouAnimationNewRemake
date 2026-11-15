//== INSERT before "  var SEAM23 = { m0: 400, mc: 429, m1: 474, v: 118, cut: [426, 432] };"
  /* ---- Nothing pops, and moves land softly (round 7) ----
     landEase(u, a): 0 -> 1 over 0 -> 1 as a camera moves: it gathers speed over the first `a` of the move
     (as the cube of the time) and lands over the rest (as the fourth power of what is left), so the
     landing is longer and softer than the start. It is the curve of the rise to the map (seam34) and of
     the player's camera between scenes; here it also carries the pan from scene 01 to scene 02 and the
     map's retreat before the finale, which were symmetric (in-out cubic): same frames, same distance.
     The two pops the motion check kept reporting:
       14600 ms  the three trucks at the docks moved a pixel in one step. Their idle bob and exhaust ran on
                 the frame clock while the sky ran on its own (which carries the 1.878 s the hold lets
                 pass): the scene has ONE ambient clock now, the sky's, so nothing steps when the hold ends.
       28700 ms  the finale was faded in as one group over the whole stage, and on the step its opacity
                 reached 1 the browser stopped drawing it through a buffer: every gradient shifted by one
                 level at once. The finale is not faded any more. It stands finished under the map's
                 panel, which is opaque, and is seen as the panel goes: one dissolve, not two, and nothing
                 for the browser to switch. While the map is up the finale is not drawn at all. */
  function landEase(u, a) {
    a = a || 0.35;
    if (u <= 0) return 0;
    if (u >= 1) return 1;
    var k = 1 / (a * a * (0.75 + 0.25 * a));
    return u < a ? k * u * u * u : 1 - (3 * k * a * a / (4 * Math.pow(1 - a, 3))) * Math.pow(1 - u, 4);
  }
//== REPLACE from "    var fps = FPS, time = (tOverride != null ? tOverride : frame / fps);" to "    cam += seam23X(frame);        // the seam into scene 03: the camera goes after the trucks"
    // one ambient clock for the whole scene: the player's when it gives one, else the frame clock plus the
    // time scene 02's hold let pass (1.878 s, eased in over frames the site only plays with its own clock)
    var fps = FPS, skyK = clamp01((frame - 300) / 91);
    var time = tOverride != null ? tOverride : frame / fps + 1.878 * skyK * skyK * (3 - 2 * skyK), skyTime = time;
    var cam = interpolate(frame, [T_WORLD.panStart, T_WORLD.panEnd], [T_WORLD.camRecvX, T_WORLD.camLoadX], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: function (u) { return landEase(u, 0.4); } });
//== REPLACE from "    var skyK = clamp01((frame - 300) / 91), skyTime = tOverride != null ? tOverride : frame / fps + 1.878 * skyK * skyK * (3 - 2 * skyK);" to "    return h(\"div\", { style: { position: \"absolute\", inset: 0, background: \"#eaf5fc\", overflow: \"hidden\" } },"
    // (skyTime is the scene's one clock: see the top of this function)
//== REPLACE from "    var recede = interpolate(frame, [T_NETWORK.mapRecede[0], T_NETWORK.mapRecede[1]], [0, 1]," to "    var basesEnter = spring("
    var recede = interpolate(frame, [T_NETWORK.mapRecede[0], T_NETWORK.mapRecede[1]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: function (u) { return landEase(u, 0.35); } });
//== REPLACE from "        h(\"g\", { opacity: recede }," to "          range(26, function (i) {"
        // the finale stands finished under the map's opaque panel and is seen as the panel goes; while the
        // map is up it is not drawn
        h("g", { display: recede > 0 ? "inline" : "none" },
