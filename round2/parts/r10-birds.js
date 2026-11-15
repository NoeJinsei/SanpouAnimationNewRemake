//== REPLACE from "  /* Birds (round 3): small filled silhouettes, a body and two wings, nothing thinner than 3 px. One loose" to "  /* The distant mountain range (round 3; it replaces the two soft hill curves). A jagged far ridge and a"
  /* Birds (round 10, 2026-11-16). The owner's verdict on the round 3 birds: "the way the birds are flying is
     a bit odd". They were drawn head-on, wings out to both sides, and slid sideways at a walking pace, so
     they hung in the air; their wings beat up into a deep V; and the kite went round its circle without
     ever turning. The result to hold to: A BIRD GOES WHERE IT POINTS, at a pace its wings could give it.
     Each bird is one small solid thing (a body, a tail, two wings of two panels each) in its own axes,
     turned to its heading, banked and pitched, and seen from the ground: a little from below, so the wing
     nearer the viewer stands a little higher than the far one. Flying across, that is a side view: both
     wings rise above the body and fall below it together, and on set wings the near one stands up like a
     fin. Flying away or toward the viewer, the wings spread to both sides. The kite shows each of these
     in turn as it circles, because it really turns.
       the flock   flies across the sky the way the trucks drive. A few beats, then a glide on set wings:
                   it climbs a little while it beats and sinks while it glides, and its nose follows that
                   path. The downstroke is quicker than the upstroke and the hand trails the arm. Every
                   bird keeps its own time, so the group never beats together.
       the kite    soars in a slow circle, banked into the turn, and beats twice in a long while.
     All of them are one path. They are the only dark things in the sky, so each scene keeps them to the
     right of the headline or above it. */
  DAY.bird = "#34496b";
  /* The two kinds, at size 1, in the bird's own axes (a = forward, b = to its right, c = up).
     sh = where the wing is hinged [b, c]; root, wrist = the wing's leading and trailing edge there (a);
     tip = the wingtip (a); arm, hand = the lengths of the two panels; plan and side = the body from above
     and from the side, as [a, b] and [a, c] (a pair of pairs is a curve: [control, point]).
     look = how far above the horizon the viewer looks to see it (radians).
     beat: every = seconds for one beat-and-glide, flap = the share of it spent beating, beats = how many,
     mid, swing = the arm's and the hand's middle angle and swing while beating, set = the angles they are
     held at in the glide, lag = how far the hand trails the arm, climb = px gained while beating. */
  var BIRD_KIND = {
    gull: { sh: [1.5, 0.5], root: [3.4, -3], wrist: [3.6, -4.6], tip: -2.6, arm: 8, hand: 12, look: 0.3,
      plan: [[7.4, 0], [[5.6, 2.2], [1.6, 2.3]], [-4.6, 1.5], [-10.6, 3.3], [-9.4, 0], [-10.6, -3.3], [-4.6, -1.5], [1.6, -2.3], [[5.6, -2.2], [7.4, 0]]],
      side: [[7.4, 0], [[5.6, 2], [1.6, 2]], [-4.6, 1.1], [-10, 0.6], [-10, -0.4], [-4.6, -1.3], [1.6, -2.2], [[5.6, -2.1], [7.4, 0]]],
      beat: { every: 2.5, flap: 0.6, beats: 3, mid: [0.14, 0.02], swing: [0.52, 0.74], set: [0.3, 0.12], lag: 0.95, climb: 6 } },
    kite: { sh: [1.7, 0.5], root: [4, -3.6], wrist: [4.6, -5.6], tip: -1.6, arm: 9.5, hand: 12.5, look: 0.27,
      plan: [[8, 0], [[6, 2.4], [1.8, 2.5]], [-5, 1.7], [-13.4, 4.4], [-11.6, 0], [-13.4, -4.4], [-5, -1.7], [1.8, -2.5], [[6, -2.4], [8, 0]]],
      side: [[8, 0], [[6, 2.1], [1.8, 2.1]], [-5, 1.2], [-12.4, 0.6], [-12.4, -0.4], [-5, -1.4], [1.8, -2.3], [[6, -2.2], [8, 0]]],
      beat: { every: 9, flap: 0.2, beats: 2, mid: [0.14, 0.04], swing: [0.42, 0.5], set: [0.19, 0.03], lag: 0.9, climb: 0 } }
  };
  // one beat-and-glide (u in cycles): [arm angle, hand angle, how high it has climbed 0..1, its climb rate (a cycle)]
  function birdBeat(u, B) {
    var c = u - Math.floor(u), F = B.flap;
    if (c >= F) { var q = Math.PI * (c - F) / (1 - F); return [B.set[0], B.set[1], (1 + Math.cos(q)) / 2, -Math.PI / 2 * Math.sin(q) / (1 - F)]; }
    // the beats swell from the held wing and die back into it (no step in the wing's speed at either end)
    var s = Math.sin(Math.PI * c / F), E = s * s * (3 - 2 * s), ph = 2 * Math.PI * B.beats * c / F, p2 = ph - B.lag;
    var w1 = Math.sin(ph - 0.32 * Math.sin(ph)), w2 = Math.sin(p2 - 0.32 * Math.sin(p2));     // up first; the way down is the quicker
    return [B.set[0] + E * (B.mid[0] - B.set[0] + B.swing[0] * w1), B.set[1] + E * (B.mid[1] - B.set[1] + B.swing[1] * w2),
      (1 - Math.cos(Math.PI * c / F)) / 2, Math.PI / 2 * s / F];
  }
  // one bird at (x, y): s = size, al = heading (0 = flying to the right, a quarter turn = away from the viewer),
  // be = bank (right wing down), ga = pitch (nose up), t1 and t2 = the arm's and the hand's angle above level
  function birdD(K, x, y, s, al, be, ga, t1, t2) {
    var ca = Math.cos(al), sa = Math.sin(al), cb = Math.cos(be), sb = Math.sin(be), cg = Math.cos(ga), sg = Math.sin(ga);
    var se = Math.sin(K.look), ce = Math.cos(K.look);
    // forward, right and up in the world (x to the right, y away from the viewer, z up) ...
    var fx = ca * cg, fy = sa * cg, fz = sg, vx = -ca * sg, vy = -sa * sg, vz = cg;
    var rx = sa * cb - vx * sb, ry = -ca * cb - vy * sb, rz = -vz * sb;
    var ux = sa * sb + vx * cb, uy = -ca * sb + vy * cb, uz = vz * cb;
    // ... and on the screen: across = x, down = what lies further away, less what lies higher
    var Xa = fx * s, Xb = rx * s, Xc = ux * s, Ya = (fy * se - fz * ce) * s, Yb = (ry * se - rz * ce) * s, Yc = (uy * se - uz * ce) * s;
    function at(a, b, c) { return [x + a * Xa + b * Xb + c * Xc, y + a * Ya + b * Yb + c * Yc]; }
    // an outline: [point] = a straight edge to it, [control, point] = a curve. Every piece is written the same
    // way round on the screen, so where two of them overlap they add up and never cut a hole.
    function piece(pts) {
      var n = pts.length, area = 0, i, p, q, d;
      for (i = 0; i < n; i++) { p = pts[i][pts[i].length - 1]; q = pts[(i + 1) % n][pts[(i + 1) % n].length - 1]; area += p[0] * q[1] - q[0] * p[1]; }
      if (area < 0) {                                     // the other way round: the same edges, read backwards
        var rev = [[pts[n - 1][pts[n - 1].length - 1]]];
        for (i = n - 1; i > 0; i--) rev.push(pts[i].length > 1 ? [pts[i][0], pts[i - 1][pts[i - 1].length - 1]] : [pts[i - 1][pts[i - 1].length - 1]]);
        pts = rev;
      }
      d = "M" + skyR(pts[0][0][0]) + "," + skyR(pts[0][0][1]);
      for (i = 1; i < pts.length; i++) {
        p = pts[i];
        d += p.length > 1 ? "Q" + skyR(p[0][0]) + "," + skyR(p[0][1]) + " " + skyR(p[1][0]) + "," + skyR(p[1][1]) : "L" + skyR(p[0][0]) + "," + skyR(p[0][1]);
      }
      return d + "Z";
    }
    function body(list, flat) {
      return piece(list.map(function (e) {
        return typeof e[0] === "number" ? [flat ? at(e[0], e[1], 0) : at(e[0], 0, e[1])] :
          [flat ? at(e[0][0], e[0][1], 0) : at(e[0][0], 0, e[0][1]), flat ? at(e[1][0], e[1][1], 0) : at(e[1][0], 0, e[1][1])];
      }));
    }
    function wing(side) {
      var b0 = side * K.sh[0], c0 = K.sh[1], wb = b0 + side * K.arm * Math.cos(t1), wc = c0 + K.arm * Math.sin(t1);
      var tb = wb + side * K.hand * Math.cos(t2), tc = wc + K.hand * Math.sin(t2);
      return piece([[at(K.root[0], b0, c0)], [at(K.wrist[0], wb, wc), at(K.tip, tb, tc)], [at(K.wrist[1], wb, wc), at(K.root[1], b0, c0)]]);
    }
    return wing(-1) + body(K.plan, true) + body(K.side, false) + wing(1);
  }
  /* Where they fly. A group is [x at time 0, y, speed (px a second, + = flying right), birds, first bird,
     fall]: fall = how far it comes down for every px it travels (then y is its height where x = 1000).
     A kite is [centre x, y, radius, size]. On a desktop the headline stands over stage x 160 to 1075 from
     y 264 down, so a group keeps above that while it is left of 1075; the finale's two come down a little
     as they go, to pass under the sun's ring as well. `span` is the width a group flies before it comes round again
     (the finale's is two of the plane's cycles at the birds' speed, so a group always crosses Tokyo Tower
     nine seconds before the plane passes it, and they never meet). */
  var BIRD_FORM = [[0, 0], [-40, -14], [-48, 17], [-84, -27], [-98, 29], [0, 0], [-42, 16], [-56, -13]];
  var BIRD_SETS = {
    w: { groups: [[985, 126, 40, 5, 0]], kite: [1730, 290, 76, 1.15] },
    t: { groups: [[1150, 250, 44, 5, 0]], kite: [900, 214, 70, 1.15] },
    n: { groups: [[744, 212, 52, 5, 0, 0.06], [-608, 212, 52, 3, 5, 0.06]], kite: [1250, 432, 84, 1.15], span: 52 * 52 }
  };
  function DayBirds(p) {
    var set = BIRD_SETS[p.set], kt = set.kite, time = p.time, back = p.back || 0, span = set.span || 2920, d = "";
    function wrap(x) { return ((((x - (p.shift || 0) + 500) % span) + span) % span) - 500 + back; }
    var G = BIRD_KIND.gull, B = G.beat, lift = Math.sin(time * 0.27 + 1), liftV = 0.27 * Math.cos(time * 0.27 + 1);
    set.groups.forEach(function (g) {
      var dir = g[2] < 0 ? -1 : 1, gx = wrap(g[0] + g[2] * time), v = Math.abs(g[2]), fall = g[5] || 0, gy = g[1] + fall * (gx - 1000);
      for (var i = 0; i < g[3]; i++) {
        var r = random(p.set + "-ba" + (g[4] + i)), r2 = random(p.set + "-bb" + (g[4] + i)), f = BIRD_FORM[g[4] + i];
        var every = B.every + r * 0.9, m = birdBeat(time / every + r2 * 5, B), climb = B.climb + r2 * 3;
        // its own way up and down: the group's slow rise and fall, its own wander, and the climb of its beats
        var vy = fall * g[2] - 9 * liftV - 5 * 0.31 * Math.cos(time * 0.31 + r2 * 9) - climb * m[3] / every;
        d += birdD(G, gx + dir * f[0] + Math.sin(time * 0.43 + r * 9) * 7,
          gy + f[1] - lift * 9 - Math.sin(time * 0.31 + r2 * 9) * 5 - climb * m[2],
          0.95 + r * 0.35, (dir < 0 ? Math.PI : 0) + 0.07 * Math.sin(time * 0.21 + r * 7),
          0.07 * Math.sin(time * 0.37 + r2 * 5), Math.atan2(-vy, v) * 0.9, m[0], m[1]);
      }
    });
    // the kite: round a level circle, seen from below, so the circle is a flat oval and the far side of it lies lower
    var Kk = BIRD_KIND.kite, a = time * 0.42 + 0.8, far = Math.sin(a), km = birdBeat(time / Kk.beat.every + 0.3, Kk.beat);
    d += birdD(Kk, wrap(kt[0]) + Math.cos(a) * kt[2], kt[1] + far * kt[2] * Math.sin(Kk.look) + Math.sin(time * 0.19) * 5,
      kt[3] * (1 - 0.07 * far), a + Math.PI / 2, -0.44 - 0.05 * Math.sin(a * 2 + 1), 0.03 * Math.sin(time * 0.19 + 1.4), km[0], km[1]);
    return h("path", { d: d, fill: DAY.bird });
  }
  // the same one node with nothing in it, for a moment when a scene's birds cannot be seen (the finale's,
  // under the map's panel): they are then not worked out at all
  var _noBirds = null;
  function DayBirdsNone() { return _noBirds || (_noBirds = h("path", { d: "", fill: DAY.bird })); }

//== REPLACE from "          DayBirds({ set: \"n\", time: time })," to "          FujiMountain({ cx: 380, baseY: 1008, w: 2020, ht: 706, capT: 0.3 }),"
          recede > 0 ? DayBirds({ set: "n", time: time }) : DayBirdsNone(),
