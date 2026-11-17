//== REPLACE from "     nine seconds before the plane passes it, and they never meet). */" to "  var BIRD_FORM = [[0, 0], [-40, -14], [-48, 17], [-84, -27], [-98, 29], [0, 0], [-42, 16], [-56, -13]];"
     nine seconds before the plane passes it, and they never meet).
     Round 11: a set with `loop` is the same picture every `loop` seconds: its groups' span is their speed
     times the loop, every rate its birds wander and beat at goes round a whole number of times in it, and
     its kite goes round `turns` times, standing at angle `turn0` when the set's clock is 0. The finale's
     kite turns four times a loop, twice in each of the plane's cycles, so it is in the same place at
     both of the plane's passes: the plane's wheels climb straight through the middle of the kite's
     circle 20.4 s into each cycle, with its body and its fin on the upper left of that line, and at that
     moment the kite is at the right-hand end of its circle, on the other side of the line and 59 px from
     it. (With an odd number of turns it is at opposite ends on the two passes, and at the left end the
     plane's body goes over it; before the loop the two simply met now and then.) */
//== REPLACE from "    n: { groups: [[744, 212, 52, 5, 0, 0.06], [-608, 212, 52, 3, 5, 0.06]], kite: [1250, 432, 84, 1.15], span: 52 * 52 }" to "  };"
    n: { groups: [[744, 212, 52, 5, 0, 0.06], [-608, 212, 52, 3, 5, 0.06]], kite: [1250, 432, 84, 1.15], span: 52 * LOOP, loop: LOOP, turns: 4, turn0: 2.984 }
//== REPLACE from "  function DayBirds(p) {" to "  // the same one node with nothing in it, for a moment when a scene's birds cannot be seen (the finale's,"
  function DayBirds(p) {
    var set = BIRD_SETS[p.set], kt = set.kite, time = p.time, back = p.back || 0, span = set.span || 2920, d = "", L = set.loop;
    function wrap(x) { return ((((x - (p.shift || 0) + 500) % span) + span) % span) - 500 + back; }
    // the rates of the group's slow rise and fall, each bird's wander across and up and down, its heading, its
    // bank, and the kite's rise and fall (in a set that loops, each goes round a whole number of times a loop)
    var wLift = loopW(0.27, L), wX = loopW(0.43, L), wY = loopW(0.31, L), wHead = loopW(0.21, L), wBank = loopW(0.37, L), wKite = loopW(0.19, L);
    var G = BIRD_KIND.gull, B = G.beat, lift = Math.sin(time * wLift + 1), liftV = wLift * Math.cos(time * wLift + 1);
    set.groups.forEach(function (g) {
      var dir = g[2] < 0 ? -1 : 1, gx = wrap(g[0] + g[2] * time), v = Math.abs(g[2]), fall = g[5] || 0, gy = g[1] + fall * (gx - 1000);
      for (var i = 0; i < g[3]; i++) {
        var r = random(p.set + "-ba" + (g[4] + i)), r2 = random(p.set + "-bb" + (g[4] + i)), f = BIRD_FORM[g[4] + i];
        var every = loopT(B.every + r * 0.9, L), m = birdBeat(time / every + r2 * 5, B), climb = B.climb + r2 * 3;
        // its own way up and down: the group's slow rise and fall, its own wander, and the climb of its beats
        var vy = fall * g[2] - 9 * liftV - 5 * wY * Math.cos(time * wY + r2 * 9) - climb * m[3] / every;
        d += birdD(G, gx + dir * f[0] + Math.sin(time * wX + r * 9) * 7,
          gy + f[1] - lift * 9 - Math.sin(time * wY + r2 * 9) * 5 - climb * m[2],
          0.95 + r * 0.35, (dir < 0 ? Math.PI : 0) + 0.07 * Math.sin(time * wHead + r * 7),
          0.07 * Math.sin(time * wBank + r2 * 5), Math.atan2(-vy, v) * 0.9, m[0], m[1]);
      }
    });
    // the kite: round a level circle, seen from below, so the circle is a flat oval and the far side of it lies lower
    var Kk = BIRD_KIND.kite, a = L ? time * 2 * Math.PI * set.turns / L + set.turn0 : time * 0.42 + 0.8, far = Math.sin(a);
    var km = birdBeat(time / loopT(Kk.beat.every, L) + 0.3, Kk.beat);
    d += birdD(Kk, wrap(kt[0]) + Math.cos(a) * kt[2], kt[1] + far * kt[2] * Math.sin(Kk.look) + Math.sin(time * wKite) * 5,
      kt[3] * (1 - 0.07 * far), a + Math.PI / 2, -0.44 - 0.05 * Math.sin(a * 2 + 1), 0.03 * Math.sin(time * wKite + 1.4), km[0], km[1]);
    return h("path", { d: d, fill: DAY.bird });
  }
