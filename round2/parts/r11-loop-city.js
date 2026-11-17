//== REPLACE from "  function CityCranes(row, time, off, tile) {" to "  /* Window light: a thin layer over a tier, a pure function of time. def (in the coordinates the rows were"
  // (round 11) L = the loop the scene runs on, if it has one: the slewing, the trolley and the hook then each
  // go round a whole number of times in it (in the finale: once each, on their own phases)
  function CityCranes(row, time, off, tile, L) {
    if (!row.cranes) {
      row.cranes = [];
      row.items.forEach(function (it, i) {
        if (it.t !== "X") return;
        cityNode(it, row);
        var k = it.info.crane, pal = cityPal(it.m, row.look.air);
        row.cranes.push({ x: k[0], y: k[1], u: k[2], dir: (k[3] >> 1) % 2 ? -1 : 1, ph: i * 1.7 + it.x * 0.003, pal: pal, mast: cityCraneMast(k[2], pal, k[4]), arm: cityArm(k[2], pal), head: cityCraneHead(k[2], pal) });
      });
    }
    var wSlew = loopW(0.11, L), wTrolley = loopW(0.083, L), wHook = loopW(0.097, L);
    return h("g", null, row.cranes.map(function (k) {
      var u = k.u, t = Math.max(3, 3.6 * u), s = (0.76 + 0.2 * Math.sin(time * wSlew + k.ph)) * k.dir;
      var tr = (0.36 + 0.3 * (0.5 + 0.5 * Math.sin(time * wTrolley + k.ph * 2.1))) * CITY_JIB * u * s;
      var drop = (44 + 22 * Math.sin(time * wHook + k.ph * 1.3)) * u;
      return h("g", { transform: "translate(" + cityAt(k.x, off, tile).toFixed(1) + "," + k.y + ")" },
        k.mast,
        h("g", { transform: "scale(" + s.toFixed(4) + ",1)" }, k.arm),
        h("rect", { x: (tr - t / 2).toFixed(1), y: 0, width: t.toFixed(1), height: drop.toFixed(1), fill: k.pal.deep }),
        h("rect", { x: (tr - 4.5 * u).toFixed(1), y: drop.toFixed(1), width: (9 * u).toFixed(1), height: (8 * u).toFixed(1), fill: k.pal.safety }),
        k.head);
    }));
  }
//== REPLACE from "  function CityLights(L, time, off, tile) {" to "  /* ---- scenes 01 and 02: the street's skyline, three tiers. Composed in scene 01's screen coordinates"
  // (round 11) loop = the loop the scene runs on, if it has one: the sheen's round, every glint's period and the
  // lamps' slow breath then each go into it a whole number of times
  function CityLights(L, time, off, tile, loop) {
    var sheenT = loopT(20, loop), warmT = loopT(31, loop), turn = loop ? 2 * Math.PI : 6.2832;
    return h("g", null,
      // the sheen: two bands of sky sliding down the glass on the light's diagonal, 11 s of travel in every 20
      L.sheen.map(function (s) {
        var g = s.g, p = ((((time + s.ph) % sheenT) + sheenT) % sheenT) / 11;
        if (p >= 1) return h("path", { d: "M0,0", fill: DAY.cityWhite, opacity: 0 });
        var xl = cityAt(g[0], off, tile), xr = xl + g[2], sl = g[2] * 0.85, yr = g[1] - 130 - sl + (g[3] + sl + 150) * p;
        var band = function (a, b) { return _polyD(_clipPoly([[xr, yr + a], [xr, yr + b], [xl, yr + b + sl], [xl, yr + a + sl]], xl, g[1], xr, g[1] + g[3])); };
        return h("path", { d: (band(0, 74) + band(92, 108)) || "M0,0", fill: DAY.cityWhite, opacity: (0.24 * Math.pow(Math.sin(Math.PI * p), 0.7)).toFixed(3) });
      }),
      // single panes that catch the sun and let it go, each on its own slow phase
      L.glint.map(function (s) {
        var k = Math.max(0, Math.sin(time * turn / loopT(s.T, loop) + s.ph));
        return h("rect", { x: cityAt(s.r[0], off, tile).toFixed(1), y: s.r[1], width: s.r[2], height: s.r[3], fill: DAY.lit, opacity: (0.92 * k * k * k).toFixed(3) });
      }),
      // a room with its lamp on: always warm, brightening and settling very slowly
      L.warm.map(function (s) {
        var k = 0.5 - 0.5 * Math.cos(time * turn / warmT + s.ph), wx = cityAt(s.r[0], off, tile).toFixed(1);
        return h("g", null,
          h("rect", { x: wx, y: s.r[1], width: s.r[2], height: s.r[3], fill: DAY.warm }),
          h("rect", { x: wx, y: s.r[1], width: s.r[2], height: s.r[3], fill: DAY.cityWarmLit, opacity: (0.8 * k).toFixed(3) }));
      }));
  }

//== REPLACE from "    // the lift, inside the lattice: twenty seconds a round trip, long soft starts and landings, a wait at each end" to "    lk = lk * lk * lk * (lk * (6 * lk - 15) + 10);"
    // the lift, inside the lattice: twenty seconds a round trip, long soft starts and landings, a wait at each end
    // (round 11: where the scene runs on a loop, p.loop, the round trip is half of it: the lift rides at the pace
    // it always had, seven seconds each way, and waits longer at each end; the reflection's round and the lamp's
    // swell go into the loop a whole number of times)
    var liftT = p.loop ? p.loop / 2 : 20, liftWait = (liftT - 14) / 2;
    var lt = ((time % liftT) + liftT) % liftT, lk = lt < 2 ? 1 : lt < 9 ? 1 - (lt - 2) / 7 : lt < 9 + liftWait ? 0 : lt < 16 + liftWait ? (lt - 9 - liftWait) / 7 : 1;
//== REPLACE from "    var g = m.glass, sk = (((time - 3.5) % 9) + 9) % 9 / 5, sx = g[0] - 26 * u + (g[2] - g[0] + 52 * u) * sk;" to "    var cl = function (v) { return n1(Math.max(g[0], Math.min(g[2], v))); };"
    var skyT9 = loopT(9, p.loop);
    var g = m.glass, sk = (((time - 3.5) % skyT9) + skyT9) % skyT9 / 5, sx = g[0] - 26 * u + (g[2] - g[0] + 52 * u) * sk;
//== REPLACE from "    var lamp = 0.5 - 0.5 * Math.cos(time * 2.1); lamp *= lamp;" to "    return h(\"g\", { opacity: p.opacity == null ? 1 : p.opacity },"
    var lamp = 0.5 - 0.5 * Math.cos(time * loopW(2.1, p.loop)); lamp *= lamp;
//== REPLACE from "          TokyoTower({ cx: 1360, baseY: 1008, h: 840, time: time, opacity: 0.97 })," to "          CityHaze(\"nHazeNear\", 1010, 1),"
          TokyoTower({ cx: 1360, baseY: 1008, h: 840, time: time, opacity: 0.97, loop: LOOP }),
          CityRow(city.back, 0), CityCranes(city.back, time, 0, 0, LOOP), CityRow(city.front, 0), CityLights(city.lights, time, 0, 0, LOOP),
