//== INSERT before "  /* ---- Scene12World.tsx ---- */"
  /* ---- The seams (round 7, 2026-11-15): every scene change is one camera move ----
     Until now 02 -> 03 was a half-second dissolve between two still cameras and 03 -> 04 a dissolve onto a
     frozen frame. Both are camera moves now, with the change of picture at the move's fastest moment, where
     the eye cannot follow what is in the frame (the reference film does the same).

     02 -> 03   THE CAMERA GOES WITH THE TRUCKS. As the three trucks pull away from the docks the camera
                starts after them along the road, to the right: slowly, then fast. It overtakes them. At its
                fastest (master frame SEAM23.mc) the street gives way to the expressway, which is going by
                at the same speed, over SEAM23.cut (6 frames, 0.17 s); then the camera slows over a long
                landing until it rides with the convoy, as scene 03 always did.
                seam23X(m) is how far the camera has gone beyond its own path at master frame m, in px.
                Its speed rises as the square of the time from m0 to mc (v px a frame at the top) and
                falls as the cube of what is left from mc to m1: a long soft landing, 1.25 s.
                In scene 02 it is added to the camera, so every layer answers at its own depth; in scene 03
                it is added to the road's scroll, and the convoy, which keeps its own steady speed, is
                simply that much further ahead on the road until the camera has caught it up. No truck
                fades in or slides in from nowhere any more.
     03 -> 04   THE CAMERA RISES OFF THE ROAD TO THE MAP. The expressway, still running, goes down out of
                the frame and the map comes down into it from above, edge to edge, as one picture 2160 px
                tall passing a 1080 px window: seam34(f) gives the two layers' places at frame f of scene
                04's entrance (SEAM34.f1 frames, 0.94 s). It gathers speed over the first 0.4 of the move
                (as the cube of the time) and lands over the rest (as the fourth power of what is left);
                the edge between the two pictures crosses the frame at the top speed, 114 px a frame.
     04 -> 05   was already one move inside one scene (the map draws back and the land comes up). */
  var SEAM23 = { m0: 400, mc: 429, m1: 474, v: 118, cut: [426, 432] };
  function seam23X(m) {
    var S = SEAM23, a = S.mc - S.m0, b = S.m1 - S.mc;
    if (m <= S.m0) return 0;
    if (m <= S.mc) { var u = (m - S.m0) / a; return S.v * a * u * u * u / 3; }
    var q = 1 - Math.min(1, (m - S.mc) / b);
    return S.v * a / 3 + S.v * b * (1 - q * q * q * q) / 4;
  }
  var SEAM34 = { f1: 34, rise: 1080, a: 0.4 };
  function seam34(f) {
    var S = SEAM34;
    if (f >= S.f1) return null;
    var u = Math.max(0, f) / S.f1, a = S.a, k = 1 / (a * a * (0.75 + 0.25 * a));
    var e = u < a ? k * u * u * u : 1 - (3 * k * a * a / (4 * Math.pow(1 - a, 3))) * Math.pow(1 - u, 4);
    var y = S.rise * e;
    return { t: "transform:translate3d(0," + y.toFixed(2) + "px,0);will-change:transform;", n: "transform:translate3d(0," + (y - S.rise).toFixed(2) + "px,0);will-change:transform;" };
  }
//== REPLACE from "    var panK = clamp01((frame - T_WORLD.panStart) / (T_WORLD.panEnd - T_WORLD.panStart));" to "    // truck positions as functions of frame, so truckMotion can read their acceleration"
    cam += seam23X(frame);        // the seam into scene 03: the camera goes after the trucks
    var panK = clamp01((frame - T_WORLD.panStart) / (T_WORLD.panEnd - T_WORLD.panStart));
//== REPLACE from "    var SPEED = 9, scroll = frame * SPEED;" to "    var titleEnter = clamp01((frame - 10) / 36);"
    // the seam from scene 02: `lead` is how far the camera has come beyond its steady 9 px a frame since
    // this scene's frame 0, `ahead` how far it still has to come before it rides with the convoy
    var SPEED = 9, lead = seam23X(TRANSIT_START + frame) - seam23X(TRANSIT_START);
    var ahead = seam23X(SEAM23.m1) - seam23X(TRANSIT_START) - lead, scroll = frame * SPEED + lead;
//== REPLACE from "          var ex = c.x - (1 - convoyIn) * 560;" to "}, XW.front); }),"
          var ex = c.x + ahead;
          var drift = Math.sin(time * 0.5 + i * 1.4) * 12;
          // the trucks keep their own steady speed: while the camera is catching them up they are simply
          // ahead of it on the road, and once it rides with them only their slow drift is left to pitch on
          var m = truckMotion(function (f) { return c.x + Math.sin(f / fps * 0.5 + i * 1.4) * 12; }, frame);
          return Truck({ x: ex + drift, y: ROAD_Y + 18, scale: c.scale, distance: scroll, bob: Math.sin((frame - c.lag) * 0.9) * 1.5, opacity: 1, moving: true, pitch: m.pitch, run: 1 });
        }),
//== REPLACE from "    if (frame < TIMELINE.worldDur + SLIDE) {" to "    // NETWORK"
    // the street until the change of picture is over (SEAM23.cut), the expressway from its own frame 0:
    // it is there under the street, unseen, until the change begins
    if (frame < SEAM23.cut[1]) parts.push(layer({}, sceneWorld(frame)));
    // TRANSIT
    if (frame >= TRANSIT_START && frame < NETWORK_START + FADE) {
      var st = {};
      if (frame < SEAM23.cut[1]) { var s2 = clamp01((frame - SEAM23.cut[0]) / (SEAM23.cut[1] - SEAM23.cut[0])); st.opacity = s2 * s2 * (3 - 2 * s2); }
      if (frame >= NETWORK_START) { var f = clamp01((frame - NETWORK_START) / FADE); st.opacity = 1 - f; }
      parts.push(layer(st, sceneTransit(frame - TRANSIT_START)));
    }
//== REPLACE from "  var SCENES = [0, T_WORLD.panEnd, TRANSIT_START + SLIDE, NETWORK_START + 34];" to "  root.JourneyPort._components.city ="
  var SCENES = [0, T_WORLD.panEnd, SEAM23.cut[1], NETWORK_START + 34];
  root.JourneyPort.SEAM23 = SEAM23; root.JourneyPort.SEAM34 = SEAM34; root.JourneyPort.seam34 = seam34;

//== REPLACE from "    var X0 = -400, XW = WORLD_W + 800, dash = \"\", grate = \"\", shade = \"\";" to "    S.GRATES.forEach(function (gx) { grate += R(gx, G + 25.8, 46, 4.4); });"
    // the street runs on 1000 px further than it did, and its centre dashes with it: the seam's camera goes that far
    var X0 = -400, XW = WORLD_W + 1800, dash = "", grate = "", shade = "";
    for (i = -1; i < 21; i++) dash += R(S.DASH_X + i * S.DASH_P, G + S.DASH_Y, S.DASH_W, 5);
