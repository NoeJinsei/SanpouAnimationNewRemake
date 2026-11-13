//== REPLACE from "  /* ---- round 2, second pass: the skyline is COMPOSED, not inherited ----" to "  /* Tokyo Tower, round 3: drawn again from a blank page"
  /* ================= round 3: the city, drawn again from a blank page =================
     Nine Tokyo building types, each built from several volumes in the film's one oblique (the lit front
     square to the picture, the shaded side going back to the left, the roof where the eye is above it),
     each with its own window system:
       G  a glass curtain-wall tower: chamfered shaded corner, banded glass, the sky and two clouds
          reflected in it, a plant room behind the parapet
       M  an apartment slab: rows of balconies in shadow (or, seen from its other side, open corridors
          with a zigzag escape stair), a lift overrun and a water tank on the roof, a steel stair on
          the end wall
       S  a tower that steps back unevenly as it rises, with vertical window strips between piers
       P  a pencil building on a narrow plot: one window a floor, a stack of blank blade signs, a blank
          party wall with a pipe and an outside stair
       D  a wide podium with an arcade, and a tower set back on it with a frame of two-storey bays
       C  a corner building: a chamfered face, ribbon windows wrapping all three faces
       L  a low block whose roof you look down on: tanks, a stair head, condensers, a fence
       B  a building carrying a large blank billboard on a steel frame, and a blank wall sign
       X  a building site: steel frame, half wrapped in pale mesh, a hoarding, a tower crane
     A tier is two rows (deep tier: one). Inside a row nothing overlaps, so a row can be drawn in any
     order; overlaps are between rows, and a front-row building throws one flat shadow, down and to the
     left, on whatever stands behind it. Rows are COMPOSED by hand, building by building.
     Every building is drawn once and kept. What moves is drawn outside it, as pure functions of time:
     CityLights (a sheen sliding down one glass tower, single panes catching the sun, a lamp-lit room) and
     CityCranes (the jib slewing, the trolley and the hook).
     Colour: each wall material gives a lit front; shade is that colour pushed toward navy, light is it
     pushed toward white, and distance mixes everything toward the air colour. No outlines. */

  /* How tall the city stands, for every tier in every scene. base multiplies every height; amp widens
     (or narrows) how far a building stands above or below its row's usual roofline. */
  var SKYLINE_SIZE = { base: 1, amp: 1 };

  DAY.cityAir = "#bcd8ef";          // the air between the tiers: every tone is mixed toward it with distance
  DAY.cityNavy = "#1b2f55";         // what a shaded tone is pushed toward
  DAY.cityTile = "#abbdda";         // pale tile cladding (apartment slabs, low blocks)
  DAY.cityConcrete = "#7f96bf";     // concrete and panel walls
  DAY.cityDark = "#536c9d";         // dark panel walls
  DAY.cityCurtainFrame = "#3e6fb5"; // a curtain wall that reflects the sky: its frame
  DAY.cityCurtain = "#4f86cf";      // ... its glass
  DAY.cityCurtainSky = "#7fb0e6";   // ... the bright sky across its top
  DAY.cityNavyFrame = "#33507f";    // a dark curtain wall: its frame
  DAY.cityNavyGlass = "#47689f";    // ... its glass
  DAY.cityNavySky = "#6a93cb";      // ... the bright sky across its top
  DAY.cityNavyCloud = "#b4d0ee";    // ... a cloud reflected in it
  DAY.cityMesh = "#d3deec";         // the mesh sheet round a building site
  DAY.cityPane = "#cfe2f4";         // window glass against a dark wall: it reflects the sky
  DAY.cityPaneSky = "#eef6fd";      // ... and the brightest part of that reflection
  DAY.cityPaneDark = "#5f7db0";     // window glass against a pale wall: the room behind shows
  DAY.cityPaneDarkSky = "#8fa9d2";  // ... the sky across its top
  DAY.cityCloud = "#e6f1fb";        // a cloud reflected in glass; blank sign boards
  DAY.citySafety = "#f2c14e";       // safety yellow: the crane's jib tip and hook, the hoarding stripe
  DAY.cityWarmLit = "#fff1cf";      // a lamp-lit room at its brightest (its resting colour is DAY.warm)
  DAY.cityCast = "24,42,86";        // a cast shadow (r,g,b), laid over a wall at the tier's own strength

  var CITY_MAT = {
    t: { f: DAY.cityTile, g: DAY.cityPaneDark, hi: DAY.cityPaneDarkSky },
    c: { f: DAY.cityConcrete, g: DAY.cityPane, hi: DAY.cityPaneSky },
    d: { f: DAY.cityDark, g: DAY.cityPane, hi: DAY.cityPaneSky },
    g: { f: DAY.cityCurtainFrame, g: DAY.cityCurtain, hi: DAY.cityCurtainSky, cloud: DAY.cityCloud },
    n: { f: DAY.cityNavyFrame, g: DAY.cityNavyGlass, hi: DAY.cityNavySky, cloud: DAY.cityNavyCloud },
    m: { f: DAY.cityMesh, g: DAY.cityPaneDark, hi: DAY.cityPaneDarkSky, deep: 0.72 }
  };
  var CITY_MATS = { G: "g", M: "t", S: "c", P: "d", D: "c", C: "t", L: "t", B: "d", X: "m" };
  // a tier's drawing: u = scale of every part, air = how far its tones go toward the air, lod = how much is drawn
  var CITY_LOOK = {
    near: { u: 1, air: 0, lod: 2 },
    nearBack: { u: 0.94, air: 0.14, lod: 2 },
    far: { u: 0.78, air: 0.4, lod: 1 },
    farBack: { u: 0.72, air: 0.5, lod: 1 },
    deep: { u: 0.6, air: 0.7, lod: 0 }
  };
  // the two haze bands, the same in every scene: [strength at the ground, height]
  var CITY_HAZE = [[0.4, 430], [0.2, 270]];
  function CityHaze(id, baseY, i) { return h("rect", { x: 0, y: baseY - CITY_HAZE[i][1], width: 1920, height: CITY_HAZE[i][1], fill: "url(#" + id + ")" }); }

  var _cpMemo = {};
  function cityPal(mat, air) {
    var key = mat + "|" + air;
    if (_cpMemo[key]) return _cpMemo[key];
    var m = CITY_MAT[mat], W = "#ffffff", N = DAY.cityNavy, f = m.f, g = m.g;
    var a = function (c) { return air ? mix(c, DAY.cityAir, air) : c; };
    return _cpMemo[key] = {
      side: a(mix(f, N, 0.42)), sideGlass: a(mix(g, N, 0.45)), sideLite: a(mix(mix(f, N, 0.42), W, 0.5)),
      mid: a(mix(f, N, 0.2)), midGlass: a(mix(g, N, 0.22)),
      front: a(f), top: a(mix(f, W, 0.42)), deep: a(mix(f, N, m.deep || 0.6)),
      glass: a(g), hi: a(m.hi), cloud: a(m.cloud || DAY.cityCloud), board: a(DAY.cityCloud),
      trim: a(mix(f, N, 0.24)), lite: a(mix(f, W, 0.6)), safety: a(DAY.citySafety),
      cast: "rgba(" + DAY.cityCast + "," + (0.24 * (1 - air)).toFixed(3) + ")"
    };
  }
  // paint order inside one layer of a building
  var CITY_KEYS = ["side", "sideGlass", "sideLite", "mid", "midGlass", "front", "top", "deep", "glass", "hi", "cloud", "board", "trim", "lite", "safety", "cast"];

  /* The drawing board for one building. Local units: x along the front from its left corner, y up from
     the ground, z back from the front. Depth goes left, and toward the eye line (E above the ground). */
  function cityCtx(X, baseY, u, lod) {
    var E = 260 * u, KZ = 0.0016 / u, layers = [], cur, c = { u: u, lod: lod, E: E, t: Math.max(3, 3.6 * u), info: {} };
    function r1(v) { return Math.round(v * 10) / 10; }
    function px(x, z) { return X + x - (z || 0) * 0.9; }
    function py(y, z) { return baseY - y - (z ? z * (y < E ? KZ * 1.75 * (E - y) : KZ * Math.max(E - y, -300 * u)) : 0); }
    function add(k, d) { cur[k] = (cur[k] || "") + d; }
    c.px = px; c.py = py;
    c.layer = function () { cur = {}; layers.push(cur); };
    c.layer();
    // a rectangle square to the picture, at depth z: x, y are its left and its foot
    c.R = function (k, x, y, w, hh, z) {
      if (w < 0.8 || hh < 0.8) return;
      var yt = py(y + hh, z), yb = y <= 0 ? baseY : py(y, z);
      add(k, "M" + r1(px(x, z)) + "," + r1(yt) + "h" + r1(w) + "v" + r1(yb - yt) + "h" + r1(-w) + "z");
    };
    // n rectangles in a row with a gap between them
    c.split = function (k, x, y, w, hh, n, gap, z) {
      var bw = (w - (n - 1) * gap) / n;
      for (var i = 0; i < n; i++) c.R(k, x + i * (bw + gap), y, bw, hh, z);
    };
    // a bar with round ends
    c.cap = function (k, x, y, w, hh, z) {
      if (w < hh) w = hh;
      var r = r1(hh / 2);
      add(k, "M" + r1(px(x, z) + hh / 2) + "," + r1(py(y + hh, z)) + "h" + r1(w - hh) + "a" + r + "," + r + " 0 0 1 0," + r1(hh) + "h" + r1(hh - w) + "a" + r + "," + r + " 0 0 1 0," + r1(-hh) + "z");
    };
    // a disc; y is its centre
    c.disc = function (k, x, y, r) {
      r = r1(r);
      add(k, "M" + r1(px(x, 0) - r) + "," + r1(py(y, 0)) + "a" + r + "," + r + " 0 1 1 " + r1(2 * r) + ",0a" + r + "," + r + " 0 1 1 " + r1(-2 * r) + ",0z");
    };
    // a polygon through [x, y, z] triples
    c.P = function (k, p) {
      var d = "";
      for (var i = 0; i < p.length; i += 3) d += (i ? "L" : "M") + r1(px(p[i], p[i + 2])) + "," + r1(py(p[i + 1], p[i + 2]));
      add(k, d + "z");
    };
    // a wall standing on the plan line (xa, za) -> (xb, zb), from y0 up to y1
    c.W = function (k, xa, za, xb, zb, y0, y1) {
      var ax = r1(px(xa, za)), bx = r1(px(xb, zb));
      add(k, "M" + ax + "," + r1(py(y1, za)) + "L" + bx + "," + r1(py(y1, zb)) + "L" + bx + "," + r1(y0 <= 0 ? baseY : py(y0, zb)) + "L" + ax + "," + r1(y0 <= 0 ? baseY : py(y0, za)) + "z");
    };
    // a volume: its shaded side, its lit front, and its roof when the eye is above it
    c.box = function (x, w, y0, y1, z, d, o) {
      o = o || {}; z = z || 0;
      c.W(o.side || "side", x, z + d, x, z, y0, y1);
      c.R(o.front || "front", x, y0, w, y1 - y0, z);
      if (y1 < E - 6 * u && !o.noTop) c.P("top", [x, y1, z, x + w, y1, z, x + w, y1, z + d, x, y1, z + d]);
    };
    // the arris that catches the sun: the right edge of a lit front
    c.edge = function (x, y0, y1, z) { c.R("lite", x - c.t, y0, c.t, y1 - y0, z); };
    // a pane the light layer may pick: kept in tier coordinates
    c.pane = function (x, y, w, hh, z) { (c.info.panes = c.info.panes || []).push([r1(px(x, z)), r1(py(y + hh, z)), r1(w), r1(hh)]); };
    c.done = function (pal) {
      var kids = [];
      for (var i = 0; i < layers.length; i++) for (var j = 0; j < CITY_KEYS.length; j++) {
        var k = CITY_KEYS[j];
        if (layers[i][k]) kids.push(h("path", { d: layers[i][k], fill: pal[k] }));
      }
      return kids;
    };
    return c;
  }
  // how far back each type's shaded side runs, so a row can keep neighbours clear of each other
  var CITY_DEPTH = {
    G: function (w, u) { return Math.min(w * 0.42, 58 * u); },
    M: function (w, u) { return 30 * u; },
    S: function (w, u) { return Math.min(w * 0.36, 52 * u); },
    P: function (w, u) { return 42 * u; },
    D: function (w, u) { return 64 * u; },
    C: function (w, u) { return Math.max(Math.min(w * 0.22, 40 * u) * 0.8 + 22 * u, w * 0.3); },
    L: function (w, u) { return 60 * u; },
    B: function (w, u) { return Math.min(w * 0.34, 46 * u); },
    X: function (w, u) { return Math.min(w * 0.38, 58 * u); }
  };

  /* G: the glass tower */
  function cityG(c, w, hh, v) {
    var u = c.u, lod = c.lod, t = c.t, FL = 30 * u * (lod ? 1 : 1.5), d = CITY_DEPTH.G(w, u), ch = Math.min(13 * u, w * 0.14);
    var crown = lod ? FL * 1.15 : 0, top = hh - crown, lob = lod ? FL * 1.4 : 0, e = lod ? 6 * u : 0, i, y;
    if (lod) c.box(w * (v % 2 ? 0.44 : 0.18), w * 0.4, hh - FL, hh + FL * 0.7, 16 * u, d * 0.4);     // plant room, behind the parapet
    c.W("side", 0, d, 0, ch, 0, hh);
    c.W("mid", 0, ch, ch, 0, 0, hh);                                                                // the chamfered corner
    c.R("front", ch, 0, w - ch, hh);
    var gx = ch + (lod ? 2 * u : 0), gw = w - gx - e, gh = top - lob;
    c.R("glass", gx, lob, gw, gh);
    // the bright sky across the top of the glass, its lower edge on the light's diagonal
    c.P("hi", [gx, top, 0, gx + gw, top, 0, gx + gw, top - gh * 0.26, 0, gx, Math.max(lob, top - gh * 0.26 - gw * 0.85), 0]);
    // clouds reflected in it, built like the sky's own (round lobes on a flat base); the floor bands cut them
    var cloud = function (cx, k, sz) {
      var yb = lob + Math.round(gh * k / FL) * FL + t / 2;
      if (yb + sz * 0.54 > top - 2 * u) return;
      c.cap("cloud", cx - sz / 2, yb, sz, sz * 0.2);
      c.disc("cloud", cx - sz * 0.2, yb + sz * 0.2, sz * 0.19); c.disc("cloud", cx + sz * 0.06, yb + sz * 0.27, sz * 0.25); c.disc("cloud", cx + sz * 0.3, yb + sz * 0.17, sz * 0.15);
    };
    cloud(gx + gw * 0.53, v % 2 ? 0.6 : 0.68, gw * 0.8);
    if (lod) cloud(gx + gw * 0.34, v % 2 ? 0.22 : 0.3, gw * 0.5);
    if (lod) {
      var step = FL * (lod > 1 ? 1 : 2);
      if (v % 2) {                                                                                  // vertical fins
        var nf = Math.max(3, Math.round(gw / ((lod > 1 ? 21 : 30) * u)));
        for (i = 1; i < nf; i++) c.R("trim", gx + i * gw / nf - t / 2, lob, t, gh);
        for (y = lob + FL * 4; y < top - FL * 2; y += FL * 4) c.R("trim", gx, y - t / 2, gw, t);
      } else for (y = lob + step; y < top - 2; y += step) c.R("trim", gx, y - t / 2, gw, t);        // floor bands
      c.W("sideGlass", 0, d - 4 * u, 0, ch + 4 * u, lob, top);
      c.R("deep", gx, top + crown * 0.22, gw, crown * 0.42);                                        // louvres of the plant floor
      c.R("lite", w - e, lob, e, hh - lob);                                                         // the corner that catches the sun
      c.R("lite", ch, hh - 4 * u, w - ch, 4 * u);
      c.split("deep", gx + 3 * u, 0, gw - 6 * u, lob - 8 * u, Math.max(2, Math.round(gw / (34 * u))), 6 * u);
      c.R("lite", ch, lob - 8 * u, w - ch, 4 * u);
      if (lod > 1) for (i = 0; i < 4; i++) c.pane(gx + (i % 3) * gw / 3 + 2 * u, lob + Math.round(gh * (0.3 + i * 0.14) / FL) * FL + t / 2, gw / 3 - 4 * u, FL - t);
    }
    c.info.glass = [c.px(gx, 0), c.py(top, 0), gw, gh];
  }
  // an outside steel stair seen from its side, on the plane x: flights zigzag between depths za and zb, a
  // landing at every turn, one post at the back
  function cityStair(c, x, za, zb, n, fh, th) {
    var u = c.u, l = 5 * u;
    for (var i = 0; i < n; i++) {
      var z0 = i % 2 ? zb : za, z1 = i % 2 ? za : zb, sy = i * fh + 3 * u, o = i % 2 ? -l : l;
      c.P("sideLite", [x, sy, z0, x, sy + fh, z1, x, sy + fh + th, z1, x, sy + th, z0]);
      c.P("sideLite", [x, sy + fh, z1 - o, x, sy + fh, z1 + o, x, sy + fh + th, z1 + o, x, sy + fh + th, z1 - o]);
    }
    c.R("sideLite", x - c.t / 2, 0, c.t, n * fh + 3 * u + th, zb + l);
  }
  /* M: the apartment slab. Even v: the balcony side, with the steel stair on the end wall. Odd v: the
     corridor side, with the escape stair in its own bay at the lit end. */
  function cityM(c, w, hh, v) {
    var u = c.u, lod = c.lod, t = c.t, d = CITY_DEPTH.M(w, u), corridor = v % 2 === 1, core = lod ? 36 * u : 0;
    var n = Math.max(3, Math.round((hh - 8 * u) / (30 * u * (lod ? 1 : 2)))), fh = (hh - 8 * u) / n, i, b, y0;
    var zx = 6 * u, zw = w - core - 11 * u, nb = Math.max(1, Math.round(zw / (46 * u))), bw = zw / nb, ry0 = corridor ? 0.36 : 0.44;
    if (lod) {                                                                                      // on the roof: lift overrun, water tank on legs
      c.box(w - core + 3 * u, core - 7 * u, hh - fh, hh + fh * 0.8, 8 * u, 24 * u);
      var tx = w - core - 46 * u;
      if (tx > 10 * u) {
        c.R("side", tx + 4 * u, hh - 8 * u, t, 20 * u, 12 * u); c.R("side", tx + 23 * u, hh - 8 * u, t, 20 * u, 12 * u);
        c.box(tx, 31 * u, hh + 10 * u, hh + 27 * u, 12 * u, 14 * u, { front: "lite" });
      }
    }
    c.box(0, w, 0, hh, 0, d);
    if (lod) c.edge(w, 0, hh);
    for (i = 1; i < n; i++) {
      y0 = i * fh;
      var ry = y0 + fh * ry0, rh = fh * (1 - ry0) - t;                                              // the open part above the balustrade
      if (lod > 1) {
        c.split("deep", zx, ry, zw, rh, nb, 4 * u);
        for (b = 0; b < nb; b++) {
          if (corridor) c.R("glass", zx + b * bw + bw * 0.34, ry, 11 * u, rh * 0.8);                // a flat's door
          else { c.R("glass", zx + b * bw + 6 * u, ry, bw - 17 * u, rh * 0.7); if ((b + i) % 2) c.pane(zx + b * bw + 6 * u, ry, bw - 17 * u, rh * 0.7); }   // the sliding door, its head in the shade of the slab above
        }
      } else c.R("deep", zx, ry, zw, rh);
      if (lod) c.R("lite", zx - 2 * u, y0 + 3 * u, zw + 4 * u, ry - y0 - 3 * u);                    // the balustrade, in the sun
    }
    if (!lod) return;
    c.split("deep", zx, 0, zw, fh * 0.72, Math.max(2, nb), 7 * u);                                  // the open ground floor between its columns
    c.R("lite", 0, hh - 4 * u, w, 4 * u);
    var th = Math.max(t, 5 * u);
    if (corridor) {
      var sx = w - core + 2 * u, sw = core - 6 * u;                                                 // the stair bay: flights zigzag up it
      c.R("deep", sx, fh * 0.2, sw, hh - fh * 0.2 - 9 * u);
      for (i = 0; i < n - 1; i++) {
        var a = i % 2 ? sw - 2 * u : 2 * u, e2 = i % 2 ? 2 * u : sw - 2 * u, fy = i * fh + fh * 0.2;
        c.P("lite", [sx + a, fy, 0, sx + e2, fy + fh, 0, sx + e2, fy + fh + th, 0, sx + a, fy + th, 0]);
      }
    } else {
      c.R("trim", w - core - t / 2, 0, t, hh - 4 * u);                                              // the stair and lift core
      if (lod > 1) for (i = 1; i < n; i++) c.R("glass", w - core + 12 * u, i * fh + fh * 0.3, 12 * u, fh * 0.44);
      cityStair(c, -7 * u, d * 0.16, d * 0.9, n - 1, fh, Math.max(t, 6.5 * u));                                   // the steel stair standing off the end wall
      if (lod > 1 && nb > 2 && n > 4) {                                                             // bedding aired over two balconies
        c.R("board", zx + ((v >> 1) % nb) * bw + 12 * u, 2 * fh + 3 * u, 19 * u, fh * 0.44);
        c.R("board", zx + ((v >> 1) + 2) % nb * bw + 9 * u, (n - 2) * fh + 3 * u, 19 * u, fh * 0.44);
      }
    }
  }
  /* S: the tower that steps back. Even v: the steps are on its shaded side, so each stage shows its
     own shaded face; odd v: on its lit side. */
  function cityS(c, w, hh, v) {
    var u = c.u, lod = c.lod, t = c.t, FL = 30 * u, d = CITY_DEPTH.S(w, u);
    var st = v % 2 ? [[0, 1, 0, 0.52], [0, 0.82, 0.52, 0.72], [0.15, 0.82, 0.72, 0.87], [0.15, 0.6, 0.87, 1]]
      : [[0, 1, 0, 0.5], [0.18, 1, 0.5, 0.71], [0.18, 0.8, 0.71, 0.87], [0.36, 0.8, 0.87, 1]];
    for (var s = 0; s < 4; s++) {
      var x = st[s][0] * w, sw = (st[s][1] - st[s][0]) * w, y0 = st[s][2] * hh, y1 = st[s][3] * hh, z = s * 5 * u;
      c.box(x, sw, s ? y0 - FL : 0, y1, z, d * (1 - s * 0.15));
      if (!lod) continue;
      c.edge(x + sw, y0, y1, z);
      var nb = Math.max(1, Math.round((sw - 8 * u) / (25 * u))), bw = (sw - 8 * u) / nb, step = FL * (lod > 1 ? 2 : 3), gap = Math.max(t, 5 * u);
      var a = y0 + 9 * u, e = y1 - 11 * u, nfl = Math.max(1, Math.round((e - a) / step)), fl = (e - a + gap) / nfl;
      for (var b = 0; b < nb; b++) for (var f = 0; f < nfl; f++) {                                  // tall panes between piers
        var sx = x + 4 * u + b * bw + bw * 0.22, hiH = lod > 1 && f === nfl - 1 ? Math.min(15 * u, (fl - gap) * 0.4) : 0;
        c.R("glass", sx, a + f * fl, bw * 0.56, fl - gap - hiH, z);
        if (hiH) c.R("hi", sx, a + f * fl + fl - gap - hiH, bw * 0.56, hiH, z);
        if (lod > 1 && s < 2 && (b + f) % 3 === 0) c.pane(sx, a + f * fl, bw * 0.56, fl - gap, z);
      }
      c.R("lite", x - 1.5 * u, y1 - 4 * u, sw + 3 * u, 4 * u, z);
    }
    c.info.castTop = st[0][3] * hh;
  }
  /* P: the pencil building */
  function cityP(c, w, hh, v) {
    var u = c.u, lod = c.lod, t = c.t, d = CITY_DEPTH.P(w, u), n = Math.max(4, Math.round((hh - 10 * u) / (31 * u * (lod ? 1 : 2)))), fh = (hh - 10 * u) / n, i, y0;
    if (lod) c.box(w * 0.4, w * 0.52, hh - fh * 0.5, hh + 22 * u, 18 * u, 24 * u);                 // stair head
    c.box(0, w, 0, hh, 0, d);
    for (i = 1; i < n; i++) {
      y0 = i * fh;
      if (lod > 1 && (i + v) % 4 === 2) {                                                           // a floor behind a blank sign
        c.R("board", 4 * u, y0 + fh * 0.22, w - 8 * u, fh * 0.6);
        c.R("trim", 9 * u, y0 + fh * 0.42, (w - 18 * u) * 0.64, Math.max(t, 5 * u));
      } else if (lod) {
        c.split("glass", 5 * u, y0 + fh * 0.28, w - 10 * u, fh * 0.3, 2, t); c.split("hi", 5 * u, y0 + fh * 0.58, w - 10 * u, fh * 0.2, 2, t);
        if (lod > 1) c.pane(5 * u, y0 + fh * 0.28, (w - 10 * u - t) / 2, fh * 0.5);
      } else c.R("glass", 5 * u, y0 + fh * 0.3, w - 10 * u, fh * 0.4);
    }
    if (!lod) return;
    c.edge(w, 0, hh);
    c.R("deep", 5 * u, 0, w - 10 * u, fh * 0.72); c.R("board", 2 * u, fh * 0.72, w - 4 * u, 7 * u);
    var sn = Math.min(6, n - 2), sh = fh * 0.84;                                                    // the blade signs, blank
    for (i = 0; i < sn; i++) {
      var dark = (i * 2 + v) % 3 === 0;
      c.R(dark ? "trim" : "board", w + 1.5 * u, fh * 1.3 + i * fh, 13.5 * u, sh);
      c.R(dark ? "lite" : "trim", w + 8.2 * u - t / 2, fh * 1.3 + i * fh + 5 * u, t, sh - 10 * u);
    }
    c.R("lite", 0, hh - 4 * u, w, 4 * u);
    c.R("sideLite", -t / 2, 0, t, hh - 9 * u, d * 0.26);                                            // a pipe down the party wall
    cityStair(c, -6 * u, d * 0.42, d * 0.94, n - 1, fh, Math.max(t, 6 * u));                        // the outside stair at the back
  }
  /* D: the podium and the tower set back on it */
  function cityD(c, w, hh, v) {
    var u = c.u, lod = c.lod, t = c.t, FL = 30 * u, ph = Math.min(hh * 0.42, 122 * u), pd = CITY_DEPTH.D(w, u);
    var tw = w * 0.54, tx = v % 2 ? w * 0.05 : w * 0.41, tz = 18 * u, td = 40 * u, i, r, y;
    c.box(0, w, 0, ph, 0, pd);
    if (lod) {
      var gf = ph * 0.38, nb = Math.max(2, Math.round((w - 16 * u) / (40 * u)));
      c.split("deep", 8 * u, 0, w - 16 * u, gf - 5 * u, nb, 8 * u);                                 // the arcade between its piers
      c.R("lite", 3 * u, gf - 5 * u, w - 6 * u, 5 * u);
      c.split("glass", 8 * u, gf + (ph - gf) * 0.22, w - 16 * u, (ph - gf) * 0.5, lod > 1 ? Math.max(3, Math.round((w - 16 * u) / (21 * u))) : nb, lod > 1 ? 4 * u : 7 * u);
      c.R("lite", 0, ph - 4 * u, w, 4 * u); c.edge(w, 0, ph);
      if (lod > 1 && tx > 20 * u) { var sx = Math.max(3 * u, tx - 52 * u); c.P("cast", [tx, ph, tz, tx, ph, pd - 3 * u, sx, ph, pd - 3 * u, sx, ph, tz + 10 * u]); }   // the tower's shadow on the podium roof
    }
    c.info.castTop = ph;
    c.layer();
    if (lod) c.box(tx + tw * 0.22, tw * 0.5, hh - FL, hh + FL * 0.6, tz + 14 * u, td * 0.4);
    c.box(tx, tw, ph, hh, tz, td);
    var body = hh - ph - (lod ? FL * 1.1 : 0), rows = Math.max(1, Math.round(body / (FL * (lod ? 2 : 3)))), chh = body / rows;
    var nc = Math.max(2, Math.round(tw / (44 * u))), cw = tw / nc;
    for (r = 0; r < rows; r++) {
      y = ph + r * chh;
      if (!lod) { c.R("glass", tx + 5 * u, y + chh * 0.25, tw - 10 * u, chh * 0.5, tz); continue; }
      for (i = 0; i < nc; i++) {                                                                    // one two-storey bay of the frame
        var gx = tx + i * cw + 4 * u, gw2 = cw - 8 * u, hi = (i * 2 + r * 3 + v) % 5 === 0;
        if (lod > 1) {
          var p2 = (chh - 10 * u - t) / 2;
          c.R("glass", gx, y + 5 * u, gw2, p2, tz); c.R(hi ? "hi" : "glass", gx, y + 5 * u + p2 + t, gw2, p2, tz);
          if ((i + r) % 2) c.pane(gx, y + 5 * u + p2 + t, gw2, p2, tz);
        } else c.R("glass", gx, y + 5 * u, gw2, chh - 10 * u, tz);
      }
      c.W("sideGlass", tx, tz + td - 6 * u, tx, tz + 6 * u, y + 5 * u, y + chh - 5 * u);
    }
    if (lod) { if (lod > 1) c.R("deep", tx + 5 * u, hh - FL * 0.9, tw - 10 * u, FL * 0.45, tz); c.R("lite", tx - u, hh - 4 * u, tw + 2 * u, 4 * u, tz); c.edge(tx + tw, ph, hh, tz); }
  }
  /* C: the corner building */
  function cityC(c, w, hh, v) {
    var u = c.u, lod = c.lod, t = c.t, cw = Math.min(w * 0.22, 40 * u), cz = cw * 0.8, d = CITY_DEPTH.C(w, u);
    var gf = lod ? 40 * u : 0, n = Math.max(2, Math.round((hh - gf - 10 * u) / (30 * u * (lod ? 1 : 2)))), fh = (hh - gf - 10 * u) / n, crest = lod ? 16 * u : 0, i;
    if (lod) c.box(w * 0.52, w * 0.34, hh - fh, hh + 19 * u, 16 * u, 24 * u);
    c.W("side", 0, d, 0, cz, 0, hh);
    c.W("mid", 0, cz, cw, 0, 0, hh + crest);                                                        // the chamfered face, with its raised parapet
    c.R("front", cw, 0, w - cw, hh);
    var fw = w - cw - 9 * u, ng = Math.max(1, Math.round(fw / (36 * u)));
    for (i = 0; i < n; i++) {                                                                       // a ribbon window round all three faces
      var yb = gf + i * fh + fh * 0.3, bh = fh * 0.46;
      c.W("sideGlass", 0, d - 5 * u, 0, cz + 3 * u, yb, yb + bh);
      c.W("midGlass", cw * 0.08, cz * 0.92, cw * 0.92, cz * 0.08, yb, yb + bh);
      if (lod > 1) {
        c.split("glass", cw + 3 * u, yb, fw, bh * 0.6, ng, t); c.split("hi", cw + 3 * u, yb + bh * 0.6, fw, bh * 0.4, ng, t);
        if (i % 2 === 0) c.pane(cw + 3 * u + (i % ng) * (fw + t) / ng, yb, (fw - (ng - 1) * t) / ng, bh);
      } else c.R("glass", cw + 3 * u, yb, fw, bh);
    }
    if (lod) {
      c.W("deep", cw * 0.24, cz * 0.76, cw * 0.76, cz * 0.24, 0, gf - 10 * u);                      // the entrance, on the corner
      c.W("lite", cw * 0.1, cz * 0.9, cw * 0.9, cz * 0.1, gf - 10 * u, gf - 5 * u);
      c.split("deep", cw + 7 * u, 0, w - cw - 14 * u, gf - 12 * u, Math.max(1, ng), 7 * u);
      if (lod > 1) {
        c.R("board", cw + 4 * u, gf - 12 * u, w - cw - 8 * u, 6 * u);
        c.W("board", cw * 0.22, cz * 0.78, cw * 0.78, cz * 0.22, hh - 13 * u, hh + crest - 4 * u);  // a blank plate on the parapet
      }
      c.R("lite", cw, hh - 4 * u, w - cw, 4 * u); c.edge(w, 0, hh);
    }
    c.info.castLeft = cw;
  }
  /* L: the low block, seen from above its roof */
  function cityL(c, w, hh, v) {
    var u = c.u, lod = c.lod, t = c.t, d = CITY_DEPTH.L(w, u), n = Math.max(2, Math.round((hh - 6 * u) / (31 * u))), fh = (hh - 6 * u) / n, i, b;
    var nb = Math.max(1, Math.round((w - 12 * u) / (52 * u))), bw = (w - 12 * u) / nb;
    c.box(0, w, 0, hh, 0, d);
    if (!lod) return;
    c.split("deep", 7 * u, 0, w - 14 * u, fh * 0.74, nb, 8 * u);                                    // shop fronts
    for (b = 0; b < nb; b++) if ((b + v) % 3 !== 1) c.R((b + v) % 2 ? "board" : "trim", 6 * u + b * bw + 2 * u, fh * 0.6, bw - 4 * u, 8 * u);   // blank awnings
    for (i = 1; i < n; i++) for (b = 0; b < nb; b++) {                                              // windows in pairs, on one sill
      var wx = 6 * u + b * bw + bw * 0.13, ww = bw * 0.32, wy = i * fh + fh * 0.3, wh = fh * 0.48;
      c.R("glass", wx, wy, ww, wh); c.R("glass", wx + bw * 0.42, wy, ww, wh);
      if (lod > 1) { c.R("lite", wx - 2 * u, wy - t, bw * 0.74 + 4 * u, t); if ((b + i) % 2 === 0) c.pane(wx, wy, ww, wh); }
    }
    c.R("trim", w - 9 * u, 0, t, hh - 5 * u);                                                       // a downpipe
    c.R("lite", 0, hh - 4 * u, w, 4 * u); c.edge(w, 0, hh);
    if (hh >= c.E - 6 * u) return;
    c.layer();                                                                                      // what stands on the roof
    c.box(w * 0.6, 34 * u, hh, hh + 28 * u, 28 * u, 30 * u);                                        // stair head and its door
    c.R("deep", w * 0.6 + 19 * u, hh, 10 * u, 20 * u, 28 * u);
    for (i = 0; i < (w > 150 * u ? 2 : 1); i++) {                                                   // water tanks on legs
      var tx = w * 0.1 + i * 45 * u;
      c.R("side", tx + 6 * u, hh, t, 11 * u, 36 * u); c.R("side", tx + 25 * u, hh, t, 11 * u, 36 * u);
      c.cap("lite", tx, hh + 9 * u, 36 * u, 19 * u, 36 * u); c.R("trim", tx + 16 * u, hh + 9 * u, t, 19 * u, 36 * u);
    }
    if (w > 180 * u) { c.box(w * 0.82, 22 * u, hh, hh + 13 * u, 46 * u, 12 * u); }                  // a condenser
    c.R("trim", 2 * u, hh + 14 * u, w - 4 * u, t, 3 * u);                                           // the roof fence: a rail on posts
    var np = Math.max(2, Math.round(w / (30 * u)));
    for (i = 0; i <= np; i++) c.R("trim", 2 * u + i * (w - 4 * u - t) / np, hh, t, 14 * u, 3 * u);
  }
  /* B: the building under a billboard */
  function cityB(c, w, hh, v) {
    var u = c.u, lod = c.lod, t = c.t, d = CITY_DEPTH.B(w, u), n = Math.max(3, Math.round((hh - 8 * u) / (31 * u * (lod ? 1 : 2)))), fh = (hh - 8 * u) / n, i;
    var sg = lod ? 30 * u : 0, bwid = w * 0.94, bx = w * 0.03, bh = Math.min(78 * u, w * 0.56), by = hh + 15 * u;
    c.box(0, w, 0, hh, 0, d);
    for (i = 1; i < n; i++) {
      if (lod > 1) {
        c.split("glass", 6 * u, i * fh + fh * 0.26, w - sg - 10 * u, fh * 0.32, 2, 7 * u); c.split("hi", 6 * u, i * fh + fh * 0.58, w - sg - 10 * u, fh * 0.2, 2, 7 * u);
        if (i % 2) c.pane(6 * u, i * fh + fh * 0.26, (w - sg - 17 * u) / 2, fh * 0.52);
      } else c.R("glass", 6 * u, i * fh + fh * 0.28, w - sg - 10 * u, fh * 0.48);
    }
    if (!lod) return;
    c.split("deep", 6 * u, 0, w - 12 * u, fh * 0.72, 2, 8 * u); c.edge(w, 0, hh);
    c.R("board", w - sg + 3 * u, hh * 0.24, sg - 9 * u, hh * 0.64);                                 // the wall sign, blank blocks
    var bl = (hh * 0.64 - 8 * u) / 3;
    for (i = 0; i < 3; i++) c.R("trim", w - sg + 8 * u, hh * 0.24 + 7 * u + i * bl, sg - 19 * u, bl - 6 * u);
    c.R("lite", 0, hh - 4 * u, w, 4 * u);
    // the billboard: a blank board on a steel frame, standing on the roof's edge
    c.R("trim", bx + bwid * 0.14, hh - 2 * u, t + 1, 19 * u); c.R("trim", bx + bwid * 0.5 - t / 2, hh - 2 * u, t + 1, 19 * u); c.R("trim", bx + bwid * 0.86 - t, hh - 2 * u, t + 1, 19 * u);
    c.W("side", bx, 9 * u, bx, 0, by, by + bh);
    c.R("board", bx, by, bwid, bh);
    c.R("trim", bx, by, bwid, t); c.R("trim", bx, by + bh - t, bwid, t);
    c.cap("trim", bx + 9 * u, by + bh * 0.44, bwid * 0.52, bh * 0.26);
    c.R("trim", bx + 9 * u, by + bh * 0.2, bwid * 0.3, Math.max(t, 6 * u)); c.R("trim", bx + 9 * u + bwid * 0.36, by + bh * 0.2, bwid * 0.2, Math.max(t, 6 * u));
  }
  /* X: the building site. v: bit 0 moves the crane's mast, bit 1 turns its jib to the left. */
  function cityX(c, w, hh, v) {
    var u = c.u, lod = c.lod, t = c.t, d = CITY_DEPTH.X(w, u), cell = 32 * u * (lod > 1 ? 1 : 1.6);
    var nx = Math.max(2, Math.round(w / cell)), cwd = w / nx, ny = Math.max(3, Math.round(hh / cell)), chh = hh / ny, i, y;
    var mz = d * 0.5, mx = w * (v % 2 ? 0.34 : 0.62), mt = hh + 165 * u, mb = hh - 24 * u, hw = 6.5 * u;
    // the crane's mast, standing inside the frame: two chords and a zigzag web
    if (lod > 1) {
      c.R("lite", mx - hw, mb, t, mt - mb, mz); c.R("lite", mx + hw - t, mb, t, mt - mb, mz);
      var seg = 15 * u, k = 0;
      for (y = mb; y < mt - seg * 0.5; y += seg, k++) {
        var xa = k % 2 ? mx + hw - t : mx - hw, xb = k % 2 ? mx - hw : mx + hw - t;
        c.P("lite", [xa, y, mz, xa + t, y, mz, xb + t, y + seg, mz, xb, y + seg, mz]);
      }
    } else c.R("lite", mx - Math.max(2.5, 4 * u), mb, Math.max(5, 8 * u), mt - mb, mz);
    c.layer();
    // the steel frame: dark between floors, pale columns and beams
    c.box(0, w, 0, hh, 0, d, { side: "deep", front: "deep", noTop: 1 });
    if (lod) {
      for (i = 0; i <= nx; i++) c.R("lite", Math.min(w - t, Math.max(0, i * cwd - t / 2)), 0, t, hh + (i % 2 ? 10 * u : 0));
      for (i = 1; i <= ny; i++) c.R("lite", 0, i * chh - t, w, t);
    }
    c.layer();
    // the mesh sheet: all of the upper floors, stepping down toward the lit corner
    var m1 = Math.round(ny * 0.52) * chh, m2 = Math.round(ny * 0.26) * chh, m3 = chh * 0.55, x2 = Math.round(nx * 0.4) * cwd, x3 = Math.round(nx * 0.72) * cwd, mtop = hh + 7 * u;
    c.R("front", 0, m1, w, mtop - m1); c.R("front", x2, m2, w - x2, m1 - m2 + 1); c.R("front", x3, m3, w - x3, m2 - m3 + 1);
    c.W("side", 0, d, 0, 0, m1, mtop);
    if (lod) {
      for (i = 1; i < nx; i++) { var sx = i * cwd, sy = sx >= x3 - 1 ? m3 : sx >= x2 - 1 ? m2 : m1; c.R("trim", sx - t / 2, sy, t, mtop - sy); }
      for (y = m1 + 2 * chh; y < hh - chh * 0.5; y += 2 * chh) c.R("trim", 0, y - t / 2, w, t);
      c.R("board", -3 * u, 0, w + 6 * u, 24 * u); c.R("safety", -3 * u, 15 * u, w + 6 * u, Math.max(t, 4 * u));   // the hoarding
    }
    c.info.crane = [c.px(mx, mz), c.py(mt, mz), u, v];
  }
  var CITY_TYPES = { G: cityG, M: cityM, S: cityS, P: cityP, D: cityD, C: cityC, L: cityL, B: cityB, X: cityX };

  /* A row, composed by hand: [type, x, width, height, variant, material] from left to right. x is where the
     lit front starts, in the coordinates the row was composed in (dx moves them into the tier's own).
     ref is the row's usual roofline, for SKYLINE_SIZE. A building is pushed right if it would touch the
     one before it, so inside a row nothing overlaps and the drawing order cannot matter. */
  function cityRow(look, baseY, ref, dx, spec) {
    var items = [], cur = -1e9, u = look.u, S = SKYLINE_SIZE, i, j;
    for (i = 0; i < spec.length; i++) {
      var e = spec[i], t = e[0], w = e[2];
      var xl = CITY_DEPTH[t](w, u) * 0.9 + (t === "M" || t === "P" ? 9 * u : 0), xr = t === "P" ? 17 * u : 0;
      var x = Math.round(Math.max(e[1] + dx, cur + xl + 2)), hh = Math.max(50, Math.round(e[3] * S.base + (e[3] - ref) * (S.amp - 1)));
      items.push({ t: t, x: x, w: w, h: hh, v: e[4] || 0, m: e[5] || CITY_MATS[t], xl: xl, x0: x - xl - 3, x1: x + w + xr + 3, cast: [], node: null, info: null });
      cur = x + w + xr;
    }
    var N = 1;                                      // the most buildings ever in view at once
    for (i = 0; i < items.length; i++) { var n = 0; for (j = i; j < items.length && items[j].x0 < items[i].x1 + 1985; j++) n++; if (n > N) N = n; }
    return { look: look, baseY: baseY, items: items, N: N + 1, cranes: null };
  }
  // a building in the front row throws a shadow on the one behind it: recorded on the back row before anything is drawn
  function cityShade(back, front) {
    back.items.forEach(function (B) {
      front.items.forEach(function (F) {
        var u = front.look.u, lx = F.x - B.x, a = F.xl + 26 * u, hh = F.h;
        if (F.t === "D") {                                         // the tower first, then the podium's own corner
          var tl = lx + (F.v % 2 ? 0.05 : 0.41) * F.w - 16 * u;
          if (tl > 14 && tl - 60 * u < B.w - 6) B.cast.push([tl, hh, 60 * u]);
          hh = Math.min(hh * 0.42, 122 * u);
        } else if (F.t === "S") hh *= F.v % 2 ? 0.52 : 0.5;        // a stepped tower's corner is its lowest stage
        if (lx > 14 && lx - a < B.w - 6 && hh > 60) B.cast.push([lx, hh + 2, a]);
      });
    });
  }
  function cityNode(it, row) {
    if (it.node) return it.node;
    var look = row.look, c = cityCtx(it.x, row.baseY, look.u, look.lod), pal = cityPal(it.m, look.air), i, j;
    CITY_TYPES[it.t](c, it.w, it.h, it.v);
    if (it.cast.length && look.lod) {
      var x0 = c.info.castLeft || 0, yT = c.info.castTop || it.h;
      for (i = 0; i < it.cast.length; i++) {
        var s = it.cast[i], q = _clipPoly([[s[0], 0], [s[0], s[1]], [s[0] - s[2], s[1] - s[2] * 0.85], [s[0] - s[2], 0]], x0, 0, it.w, yT);
        if (q.length > 2) { var p = []; for (j = 0; j < q.length; j++) p.push(q[j][0], q[j][1], 0); c.P("cast", p); }
      }
    }
    it.info = c.info;
    return it.node = h("g", null, c.done(pal));
  }
  /* Draw a row. off is the tier's x offset on screen. Each building keeps its own slot in the list (its
     index modulo the slot count), so one entering or leaving the picture touches only its own slot and the
     list never changes length. */
  var CITY_EMPTY = h("g", null);
  function CityRow(row, off) {
    var it = row.items, N = row.N, out = null, i, j;
    for (i = 0; i < it.length; i++) if (it[i].x1 + off > -30 && it[i].x0 + off < 1950) {
      if (!out) { out = []; for (j = 0; j < N; j++) out.push(CITY_EMPTY); }
      out[i % N] = cityNode(it[i], row);
    }
    return out ? h("g", null, out) : CITY_EMPTY;      // a row wholly out of view (the far copy of scene 03's loop) is one empty group
  }
  /* The tower cranes of a row: the arm (jib, counter-jib, ties, counterweight) is drawn once; slewing is
     the arm's width changing as it turns away from us, very slowly. The trolley runs along the jib and the
     hook rises and falls on its own slow phases. */
  var CITY_JIB = 185;                    // the jib's length at scale 1
  function cityArm(u, pal) {
    var t = Math.max(3, 3.6 * u), JL = CITY_JIB * u, CL = 54 * u, AP = 34 * u, steel = "", i;
    var n1 = function (v) { return Math.round(v * 10) / 10; };
    var R = function (x, y, w, hh) { return "M" + n1(x) + "," + n1(y) + "h" + n1(w) + "v" + n1(hh) + "h" + n1(-w) + "z"; };
    var Q = function (p) { var d = ""; for (var q = 0; q < p.length; q += 2) d += (q ? "L" : "M") + n1(p[q]) + "," + n1(p[q + 1]); return d + "z"; };
    var topY = function (x) { return -14 * u + (x / JL) * 9 * u; };                    // the jib's top chord, falling toward the tip
    steel += R(0, -t, JL - 15 * u, t + 1);
    steel += Q([2 * u, topY(0), JL - 15 * u, topY(JL - 15 * u), JL - 15 * u, topY(JL - 15 * u) + t, 2 * u, topY(0) + t]);
    var ns = 10, sg = (JL - 19 * u) / ns;
    for (i = 0; i < ns; i++) {
      var xa = 2 * u + i * sg, xb = xa + sg, up = i % 2 === 0;
      steel += Q([xa, up ? -t : topY(xa) + t, xa + t, up ? -t : topY(xa) + t, xb + t, up ? topY(xb) + t : -t, xb, up ? topY(xb) + t : -t]);
    }
    steel += Q([0, -AP, JL * 0.6, topY(JL * 0.6), JL * 0.6, topY(JL * 0.6) + t, 0, -AP + t]);        // tie to the jib
    steel += Q([0, -AP, -CL + 8 * u, -t - 2, -CL + 8 * u, -2, 0, -AP + t]);                          // tie to the counter-jib
    steel += R(-CL, -t - 1, CL, t + 2);
    return h("g", null,
      h("path", { d: steel, fill: pal.lite }),
      h("path", { d: R(-CL, 0, 15 * u, 15 * u), fill: pal.deep }),
      h("path", { d: R(JL - 15 * u, -t - 3 * u, 15 * u, t + 4 * u), fill: pal.safety }));
  }
  function cityCraneHead(u, pal) {
    var t = Math.max(3, 3.6 * u);
    return h("g", null,
      h("rect", { x: (-t / 2).toFixed(1), y: (-34 * u).toFixed(1), width: t.toFixed(1), height: (34 * u).toFixed(1), fill: pal.lite }),
      h("rect", { x: (-8.5 * u).toFixed(1), y: 0, width: (17 * u).toFixed(1), height: (6 * u).toFixed(1), fill: pal.deep }),
      h("rect", { x: (3 * u).toFixed(1), y: (5 * u).toFixed(1), width: (14 * u).toFixed(1), height: (13 * u).toFixed(1), fill: pal.board }),
      h("rect", { x: (9 * u).toFixed(1), y: (7 * u).toFixed(1), width: (8 * u).toFixed(1), height: (6 * u).toFixed(1), fill: pal.deep }));
  }
  // where something at x in a tier stands when the tier has moved by off; on a loop of length tile, its nearest copy
  function cityAt(x, off, tile) { x += off || 0; return tile ? ((x + 960) % tile + tile) % tile - 960 : x; }
  function CityCranes(row, time, off, tile) {
    if (!row.cranes) {
      row.cranes = [];
      row.items.forEach(function (it, i) {
        if (it.t !== "X") return;
        cityNode(it, row);
        var k = it.info.crane, pal = cityPal(it.m, row.look.air);
        row.cranes.push({ x: k[0], y: k[1], u: k[2], dir: (k[3] >> 1) % 2 ? -1 : 1, ph: i * 1.7 + it.x * 0.003, pal: pal, arm: cityArm(k[2], pal), head: cityCraneHead(k[2], pal) });
      });
    }
    return h("g", null, row.cranes.map(function (k) {
      var u = k.u, t = Math.max(3, 3.6 * u), s = (0.76 + 0.2 * Math.sin(time * 0.11 + k.ph)) * k.dir;
      var tr = (0.36 + 0.3 * (0.5 + 0.5 * Math.sin(time * 0.083 + k.ph * 2.1))) * CITY_JIB * u * s;
      var drop = (44 + 22 * Math.sin(time * 0.097 + k.ph * 1.3)) * u;
      return h("g", { transform: "translate(" + cityAt(k.x, off, tile).toFixed(1) + "," + k.y + ")" },
        h("g", { transform: "scale(" + s.toFixed(4) + ",1)" }, k.arm),
        h("rect", { x: (tr - t / 2).toFixed(1), y: 0, width: t.toFixed(1), height: drop.toFixed(1), fill: k.pal.deep }),
        h("rect", { x: (tr - 4.5 * u).toFixed(1), y: drop.toFixed(1), width: (9 * u).toFixed(1), height: (8 * u).toFixed(1), fill: k.pal.safety }),
        k.head);
    }));
  }
  /* Window light: a thin layer over a tier, a pure function of time. def (in the coordinates the rows were
     composed in, dx as for the rows): sheen [[x, phase]] = the glass tower nearest x; glint [[x, height
     above the ground, period, phase]] and warm [[x, height, phase]] = the pane nearest that point. */
  function cityLights(rows, dx, def) {
    var L = { sheen: [], glint: [], warm: [] };
    var near = function (x, y, glass, room) {
      var best = null, bd = 1e9;
      rows.forEach(function (row) {
        row.items.forEach(function (it) {
          if (Math.abs(it.x + it.w / 2 - x) > 240) return;
          cityNode(it, row);
          if (glass) { var dg = Math.abs(it.x + it.w / 2 - x); if (it.info.glass && dg < bd) { bd = dg; best = it.info.glass; } return; }
          (it.info.panes || []).forEach(function (p) {
            var dd = Math.abs(p[0] + p[2] / 2 - x) + Math.abs(p[1] + p[3] / 2 - (row.baseY - y));
            if (dd < bd && !(room && p[3] > p[2] * 1.6)) { bd = dd; best = p; }
          });
        });
      });
      return best;
    };
    (def.sheen || []).forEach(function (s) { var g = near(s[0] + dx, 0, true); if (g) L.sheen.push({ g: g, ph: s[1] }); });
    (def.glint || []).forEach(function (s) { var p = near(s[0] + dx, s[1]); if (p) L.glint.push({ r: p, T: s[2], ph: s[3] }); });
    (def.warm || []).forEach(function (s) { var p = near(s[0] + dx, s[1], false, true); if (p) L.warm.push({ r: p, ph: s[2] }); });
    return L;
  }
  function CityLights(L, time, off, tile) {
    return h("g", null,
      // the sheen: two bands of sky sliding down the glass on the light's diagonal, 11 s of travel in every 20
      L.sheen.map(function (s) {
        var g = s.g, p = ((((time + s.ph) % 20) + 20) % 20) / 11;
        if (p >= 1) return h("path", { d: "M0,0", fill: "#ffffff", opacity: 0 });
        var xl = cityAt(g[0], off, tile), xr = xl + g[2], sl = g[2] * 0.85, yr = g[1] - 130 - sl + (g[3] + sl + 150) * p;
        var band = function (a, b) { return _polyD(_clipPoly([[xr, yr + a], [xr, yr + b], [xl, yr + b + sl], [xl, yr + a + sl]], xl, g[1], xr, g[1] + g[3])); };
        return h("path", { d: (band(0, 74) + band(92, 108)) || "M0,0", fill: "#ffffff", opacity: (0.3 * Math.pow(Math.sin(Math.PI * p), 0.7)).toFixed(3) });
      }),
      // single panes that catch the sun and let it go, each on its own slow phase
      L.glint.map(function (s) {
        var k = Math.max(0, Math.sin(time * 6.2832 / s.T + s.ph));
        return h("rect", { x: cityAt(s.r[0], off, tile).toFixed(1), y: s.r[1], width: s.r[2], height: s.r[3], fill: DAY.lit, opacity: (0.92 * k * k * k).toFixed(3) });
      }),
      // a room with its lamp on: always warm, brightening and settling very slowly
      L.warm.map(function (s) {
        var k = 0.5 - 0.5 * Math.cos(time * 6.2832 / 31 + s.ph), wx = cityAt(s.r[0], off, tile).toFixed(1);
        return h("g", null,
          h("rect", { x: wx, y: s.r[1], width: s.r[2], height: s.r[3], fill: DAY.warm }),
          h("rect", { x: wx, y: s.r[1], width: s.r[2], height: s.r[3], fill: DAY.cityWarmLit, opacity: (0.8 * k).toFixed(3) }));
      }));
  }

  /* ---- scenes 01 and 02: the street's skyline, three tiers. Composed in scene 01's screen coordinates
     (scene 02 shows the same rows 1092 px further on for the near tier, 672 for the far, 378 for the deep).
     The tallest and strongest stand right of x 1150; left of it nothing rises into the headline; round
     Tokyo Tower (x 1500 to 1750) the near tier is left open and the far tier kept low. In scene 02 the
     glass tower and the building site frame the warehouse on the right. ---- */
  var _cityW = null;
  function cityWorld() {
    if (_cityW) return _cityW;
    var c = {
      deep: cityRow(CITY_LOOK.deep, GROUND, 320, -36, [
        ["M", -60, 130, 300, 0, "c"], ["G", 112, 72, 400, 0, "n"], ["S", 252, 96, 360, 0, "c"], ["D", 420, 150, 420, 0, "c"],
        ["M", 640, 150, 320, 0, "c"], ["G", 850, 70, 410, 1, "n"], ["S", 1002, 90, 400, 0, "c"], ["G", 1128, 76, 500, 0, "n"],
        ["S", 1448, 80, 470, 0, "c"], ["M", 1566, 140, 280, 0, "c"], ["D", 1794, 140, 430, 0, "c"], ["G", 1996, 76, 520, 0, "n"],
        ["S", 2134, 96, 450, 0, "c"], ["M", 2290, 150, 330, 0, "c"], ["G", 2484, 70, 400, 1, "n"]]),
      farBack: cityRow(CITY_LOOK.farBack, GROUND, 400, -64, [
        ["G", 150, 96, 380, 1, "n"], ["S", 620, 110, 400, 0, "c"], ["G", 1226, 118, 612, 0, "g"], ["S", 1392, 100, 500, 0, "d"],
        ["S", 2130, 110, 420, 1, "c"]]),
      far: cityRow(CITY_LOOK.far, GROUND, 340, -64, [
        ["S", 40, 118, 400, 1, "c"], ["M", 262, 170, 330, 0, "t"], ["D", 470, 210, 400, 0, "c"], ["C", 760, 120, 330, 0, "t"],
        ["B", 932, 100, 300, 0, "d"], ["D", 1085, 190, 440, 0, "d"], ["M", 1306, 150, 340, 1, "t"], ["M", 1516, 180, 270, 0, "c"],
        ["X", 1778, 130, 420, 0, "m"], ["S", 1975, 120, 500, 1, "d"], ["C", 2190, 130, 360, 0, "t"], ["M", 2360, 150, 300, 0, "c"],
        ["G", 2524, 104, 470, 1, "g"]]),
      nearBack: cityRow(CITY_LOOK.nearBack, GROUND, 340, -104, [
        ["C", 24, 176, 340, 0, "t"], ["S", 420, 150, 380, 0, "d"], ["G", 660, 118, 400, 1, "n"], ["C", 850, 150, 300, 0, "c"],
        ["G", 1256, 124, 400, 0, "n"], ["S", 2060, 150, 390, 1, "c"], ["B", 2300, 120, 300, 0, "d"], ["G", 2570, 126, 600, 0, "n"],
        ["X", 2747, 180, 430, 0, "m"], ["S", 3000, 140, 420, 0, "d"]]),
      near: cityRow(CITY_LOOK.near, GROUND, 260, -104, [
        ["L", -110, 190, 150, 0, "t"], ["P", 172, 54, 310, 0, "d"], ["M", 300, 230, 300, 1, "c"], ["B", 610, 130, 240, 0, "d"],
        ["L", 800, 150, 130, 1, "t"], ["M", 1036, 204, 335, 0, "t"], ["P", 1412, 54, 300, 1, "c"], ["D", 1790, 250, 400, 1, "d"],
        ["L", 2100, 180, 150, 0, "c"], ["C", 2330, 160, 260, 0, "t"], ["M", 2582, 210, 300, 1, "t"], ["L", 2826, 190, 140, 1, "c"],
        ["B", 3060, 130, 250, 1, "d"]])
    };
    cityShade(c.farBack, c.far); cityShade(c.nearBack, c.near);
    c.farLights = cityLights([c.farBack, c.far], -64, { sheen: [[1285, 0]] });
    c.nearLights = cityLights([c.nearBack, c.near], -104, {
      sheen: [[2633, 10]],
      glint: [[1110, 250, 13, 0.4], [1436, 190, 17, 2.6], [1870, 300, 11, 4.4], [2620, 430, 15, 1.2], [2960, 110, 19, 3.3]],
      warm: [[1905, 262, 0.8], [2870, 75, 3.6]]
    });
    return _cityW = c;
  }
  /* ---- scene 03: the city along the expressway, two tiers on a 3840 px loop (the scene only ever
     travels about 330 px of the far tier and 760 of the near one). Low where Mt Fuji stands behind it
     (the first 1500 px of the far tier, 1950 of the near), so the mountain reads whole above the roofs;
     the towers stand to the right of it. ---- */
  var CITY_TILE = 3840, _cityT = null;
  function cityTransit() {
    if (_cityT) return _cityT;
    var c = {
      farBack: cityRow(CITY_LOOK.farBack, ROAD_Y, 380, 0, [
        ["G", 170, 92, 300, 0, "n"], ["S", 700, 100, 330, 0, "c"], ["G", 1130, 90, 320, 1, "g"], ["G", 1600, 112, 540, 0, "g"],
        ["S", 1800, 100, 470, 0, "d"], ["G", 2030, 96, 430, 1, "n"], ["S", 2640, 100, 420, 0, "c"], ["G", 3190, 100, 470, 0, "g"],
        ["S", 3480, 96, 380, 1, "d"]]),
      far: cityRow(CITY_LOOK.far, ROAD_Y, 300, 0, [
        ["M", 60, 170, 280, 0, "t"], ["C", 290, 120, 320, 0, "c"], ["M", 470, 150, 250, 1, "c"], ["D", 670, 180, 340, 0, "c"],
        ["S", 900, 110, 330, 0, "d"], ["C", 1060, 120, 300, 0, "t"], ["M", 1240, 170, 290, 0, "t"], ["B", 1480, 100, 290, 0, "d"],
        ["D", 1700, 200, 470, 0, "d"], ["M", 1950, 160, 370, 0, "t"], ["S", 2160, 120, 500, 1, "c"], ["X", 2340, 130, 390, 0, "m"],
        ["M", 2520, 170, 300, 1, "c"], ["C", 2740, 130, 340, 0, "t"], ["B", 2920, 100, 260, 0, "d"], ["D", 3090, 200, 420, 1, "c"],
        ["M", 3340, 180, 280, 0, "t"], ["S", 3570, 110, 350, 0, "d"]]),
      nearBack: cityRow(CITY_LOOK.nearBack, ROAD_Y, 320, 0, [
        ["S", 130, 140, 330, 0, "d"], ["M", 730, 190, 290, 0, "c"], ["G", 1215, 110, 330, 1, "n"], ["S", 1500, 130, 330, 1, "c"],
        ["G", 2040, 124, 450, 0, "n"], ["X", 2250, 180, 380, 0, "m"], ["S", 2560, 150, 420, 0, "d"], ["G", 2990, 120, 400, 1, "n"],
        ["B", 3300, 120, 300, 0, "d"], ["S", 3560, 130, 340, 1, "c"]]),
      near: cityRow(CITY_LOOK.near, ROAD_Y, 240, 0, [
        ["L", 40, 190, 160, 0, "t"], ["M", 280, 210, 300, 0, "t"], ["P", 570, 54, 320, 0, "d"], ["L", 690, 170, 150, 1, "c"],
        ["C", 940, 160, 270, 0, "t"], ["L", 1160, 160, 160, 0, "c"], ["M", 1400, 215, 310, 1, "t"], ["P", 1700, 52, 310, 1, "c"],
        ["L", 1830, 170, 150, 0, "t"], ["M", 2110, 200, 290, 0, "t"], ["L", 2390, 180, 140, 1, "c"], ["D", 2680, 250, 430, 0, "d"],
        ["C", 3010, 160, 280, 0, "t"], ["M", 3250, 210, 300, 1, "c"], ["P", 3540, 54, 310, 0, "d"], ["L", 3640, 150, 150, 0, "t"]])
    };
    cityShade(c.farBack, c.far); cityShade(c.nearBack, c.near);
    c.lights = cityLights([c.nearBack, c.near], 0, {
      sheen: [[2100, 4]],
      glint: [[385, 200, 13, 0.4], [597, 180, 17, 2.6], [1020, 170, 11, 4.4], [2790, 300, 15, 1.2], [2200, 210, 19, 3.3]],
      warm: [[1726, 200, 0.8], [2470, 80, 3.6]]
    });
    return _cityT = c;
  }
  /* ---- scene 05: the finale's city, nothing moving but its light. A low belt in front of Mt Fuji so the
     mountain stands whole above it, a knot of towers between the mountain and Tokyo Tower, a second knot
     right of the Tower, the Tower's own corridor kept low. ---- */
  var _cityN = null;
  function cityFinale() {
    if (_cityN) return _cityN;
    var c = {
      far: cityRow(CITY_LOOK.far, 1008, 300, 0, [
        ["M", 20, 150, 210, 0, "t"], ["S", 215, 100, 260, 0, "c"], ["M", 360, 170, 200, 1, "c"], ["C", 570, 110, 240, 0, "t"],
        ["B", 725, 96, 200, 0, "d"], ["D", 860, 170, 340, 0, "c"], ["S", 1075, 110, 440, 0, "d"], ["M", 1275, 150, 230, 0, "t"],
        ["S", 1500, 100, 430, 1, "c"], ["G", 1625, 104, 560, 0, "g"], ["D", 1775, 150, 470, 1, "d"]]),
      back: cityRow(CITY_LOOK.nearBack, 1010, 300, 0, [
        ["M", 150, 180, 190, 0, "t"], ["B", 395, 110, 170, 0, "d"], ["L", 560, 150, 130, 1, "c"], ["C", 800, 140, 250, 0, "t"],
        ["G", 986, 118, 430, 0, "n"], ["P", 1150, 50, 300, 0, "d"], ["X", 1572, 150, 390, 1, "m"], ["S", 1778, 140, 430, 0, "d"]]),
      front: cityRow(CITY_LOOK.near, 1010, 220, 0, [
        ["L", 1590, 165, 150, 0, "c"], ["C", 1815, 150, 240, 0, "t"]])
    };
    cityShade(c.back, c.front);
    c.lights = cityLights([c.back, c.front], 0, {
      sheen: [[1045, 2]],
      glint: [[240, 130, 13, 0.4], [880, 150, 17, 2.6], [1180, 200, 11, 4.4], [1900, 150, 15, 1.2], [1660, 80, 19, 3.3]],
      warm: [[900, 90, 0.8], [1880, 100, 3.6]]
    });
    return _cityN = c;
  }

//== REPLACE from "  /* ---- round 2 city, second pass: Tokyo as volumes, not cut-outs ----" to "  /* ---- round 2 sky: the sun, its shafts of light, built clouds ---- */"
  /* (the round 2 building kit stood here; the city is drawn by the round 3 kit above the Tower) */

//== REPLACE from "  function RoofBeacon(p) {" to "  function FloatingParticles(p) {"

//== REPLACE from "var skylineDeep = makeSkylineTier(\"skd\"" to "// the sky is composed once for the whole film: SKY_WORLD"
    var city = cityWorld();

//== REPLACE from "HazeDef(\"wHaze0\", DAY.hazeK[0]), HazeDef(\"wHaze1\"" to "GlowDef(\"wSun\", DAY.sunGlow, 0.5)"
          HazeDef("wHazeFar", CITY_HAZE[0][0]), HazeDef("wHazeNear", CITY_HAZE[1][0]),

//== REPLACE from "h(\"g\", { transform: \"translate(\" + (-cam * 0.18) + \", 0)\" }, skylineDeep.map(" to "h(\"g\", { transform: \"translate(\" + (-cam * 0.32) + \", 0)\" },"
        h("g", { transform: "translate(" + (-cam * 0.18) + ", 0)" }, CityRow(city.deep, -cam * 0.18)),

//== REPLACE from "skylineFar.map(function (b, i) { return { b: b, i: i }; })" to "TokyoTower({ cx: 1560, baseY: GROUND, h: 770"
          CityRow(city.farBack, -cam * 0.32), CityRow(city.far, -cam * 0.32), CityCranes(city.far, skyTime), CityLights(city.farLights, skyTime),

//== REPLACE from "h(\"rect\", { x: 0, y: GROUND - 430, width: 1920, height: 430, fill: \"url(#wHaze1)\" })," to "UtilityPoles(-120, 12, 360, GROUND, 176)"
        CityHaze("wHazeFar", GROUND, 0),
        h("g", { transform: "translate(" + (-cam * 0.52) + ", 0)" },
          CityRow(city.nearBack, -cam * 0.52), CityCranes(city.nearBack, skyTime), CityRow(city.near, -cam * 0.52), CityLights(city.nearLights, skyTime),

//== REPLACE from "h(\"rect\", { x: 0, y: GROUND - 300, width: 1920, height: 300, fill: \"url(#wHaze2)\" })," to "h(\"g\", { transform: \"translate(\" + (-cam) + \", 0)\" },"
        CityHaze("wHazeNear", GROUND, 1),

//== REPLACE from "var farCity = makeSkylineTier(\"t-far\"" to "var TILE = 7000, GTILE = 2700;"
    var city = cityTransit();

//== REPLACE from "h(\"defs\", null, HazeDef(\"tHaze0\", DAY.hazeK[1])" to "SkyAir(),"
        h("defs", null, HazeDef("tHazeFar", CITY_HAZE[0][0]), HazeDef("tHazeNear", CITY_HAZE[1][0]), GlowDef("tSun", DAY.sunGlow, 0.5)),

//== REPLACE from "[0, 1].map(function (rep) {" to "DayBirds({ set: \"t\", time: time, shift: scroll * 0.05 }),"
        [0, 1].map(function (rep) {
          var off = wrap(scroll * 0.18, CITY_TILE) + rep * CITY_TILE;
          return h("g", { transform: "translate(" + off + ", 0)" }, CityRow(city.farBack, off), CityRow(city.far, off));
        }),
        CityCranes(city.far, time, -scroll * 0.18, CITY_TILE),
        CityHaze("tHazeFar", ROAD_Y, 0),
        [0, 1].map(function (rep) {
          var off = wrap(scroll * 0.42, CITY_TILE) + rep * CITY_TILE;
          return h("g", { transform: "translate(" + off + ", 0)" }, CityRow(city.nearBack, off), CityRow(city.near, off));
        }),
        CityCranes(city.nearBack, time, -scroll * 0.42, CITY_TILE), CityLights(city.lights, time, -scroll * 0.42, CITY_TILE),
        CityHaze("tHazeNear", ROAD_Y, 1),

//== REPLACE from "// hand-curated skyline: height rhythm frames Fuji (left), the airport," to "return h(\"div\", { style: { position: \"absolute\", inset: 0, background: \"#eaf5fc\", overflow: \"hidden\" } },"
    var city = cityFinale();

//== REPLACE from "HazeDef(\"horizHaze\", DAY.hazeK[0])" to "),"
          HazeDef("nHazeFar", CITY_HAZE[0][0]), HazeDef("nHazeNear", CITY_HAZE[1][0])

//== REPLACE from "CITY_DEEP.map(function (b, i) {" to "TokyoTower({ cx: 1360, baseY: 1008, h: 840"
          CityRow(city.far, 0),
          CityHaze("nHazeFar", 1008, 0),

//== REPLACE from "CITY_BACK.map(function (b, i) { return CityBuilding(" to "h(\"circle\", { cx: 1652, cy: 136, r: 980, fill: \"url(#nSun)\", opacity: 0.13 }),"
          CityRow(city.back, 0), CityCranes(city.back, time), CityRow(city.front, 0), CityLights(city.lights, time),
          CityHaze("nHazeNear", 1010, 1),

//== INSERT before "  root.JourneyPort.renderMaster = renderMaster;"
  root.JourneyPort._components.city = { row: cityRow, draw: CityRow, cranes: CityCranes, look: CITY_LOOK, size: SKYLINE_SIZE, world: cityWorld, transit: cityTransit, finale: cityFinale };
