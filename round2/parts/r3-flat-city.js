//== REPLACE from "  /* ================= round 3: the city, drawn again from a blank page" to "  /* Tokyo Tower, round 3:"
  /* ================= round 3: the city, drawn again from a blank page =================
     Flat pass. Every building is one straight-on elevation: one face, level top edges, an outline made of
     vertical and horizontal edges only. No side wall, no roof seen from above, no lit arris, no cast
     shadow from one building on another. Depth is overlap (two rows a tier, three tiers), value (every
     row a clear step toward the air colour), scale and the two haze bands.
     Nine Tokyo building types, each with its own silhouette, crown and window system:
       G  a glass curtain-wall tower: glass from edge to edge behind a mullion grid, a brighter band of
          sky across its top, two diagonal sheens one small step lighter than the glass, a plant floor
          with louvres, a plant room and an aerial on the roof
       M  an apartment slab: rows of balconies (sunlit balustrades, dark openings, a sliding door a bay)
          or, seen from its other side, open corridors with a zigzag escape stair in its own bay; a lift
          overrun and a water tank on the roof
       S  a tower that steps back unevenly as it rises: four stages, tall panes between piers, an aerial
       P  a pencil building on a narrow plot: two panes a floor, floors behind blank signs, separate
          blank blade signs on brackets, a stair head and an aerial
       D  a wide podium with an arcade and a railed roof terrace, a tower of two-storey bays standing on it
       C  a corner building: ribbon windows from end to end, a raised parapet with a blank plate over the
          corner entrance and its canopy
       L  a low block of shops under blank awnings; on its roof a fence, water tanks, a stair head
       B  a building carrying a large blank billboard on a braced steel frame, and a blank wall sign
       X  a building site: steel frame, upper floors wrapped in pale mesh, a hoarding (its tower crane is
          drawn by CityCranes)
     What is diagonal is only what is diagonal in a true elevation: stair flights, bracing, the crane's
     jib and ties, and the sheens inside glass.
     A tier is two rows (deep tier: one). Inside a row nothing overlaps, so a row can be drawn in any
     order; overlaps are between rows. Rows are COMPOSED by hand, building by building.
     Every building is drawn once and kept. What moves is drawn outside it, as pure functions of time:
     CityLights (a sheen sliding down one glass tower, single panes catching the sun, a lamp-lit room) and
     CityCranes (the mast, the jib slewing, the trolley and the hook).
     Colour: each wall material gives a face tone; shade is that colour pushed toward navy, light is it
     pushed toward white, and distance mixes everything toward the air colour. No outlines. */

  /* How tall the city stands, for every tier in every scene. base multiplies every height; amp widens
     (or narrows) how far a building stands above or below its row's usual roofline. */
  var SKYLINE_SIZE = { base: 1, amp: 1 };

  DAY.cityAir = "#bcd8ef";          // the air between the tiers: every tone is mixed toward it with distance
  DAY.cityNavy = "#1b2f55";         // what a shaded tone is pushed toward
  DAY.cityWhite = "#ffffff";        // what a lit tone is pushed toward; the sheen that slides down glass
  DAY.cityTile = "#a3b6d8";         // pale tile cladding (apartment slabs, low blocks)
  DAY.cityConcrete = "#7f96bf";     // concrete and panel walls
  DAY.cityDark = "#536c9d";         // dark panel walls
  DAY.cityCurtainFrame = "#3e6fb5"; // a curtain wall that reflects the sky: its frame
  DAY.cityCurtain = "#4f86cf";      // ... its glass
  DAY.cityCurtainSky = "#7fb0e6";   // ... the bright sky across its top
  DAY.cityNavyFrame = "#33507f";    // a dark curtain wall: its frame
  DAY.cityNavyGlass = "#47689f";    // ... its glass
  DAY.cityNavySky = "#6a93cb";      // ... the bright sky across its top
  DAY.cityMesh = "#d3deec";         // the mesh sheet round a building site
  DAY.cityPane = "#cfe2f4";         // window glass against a dark wall: it reflects the sky
  DAY.cityPaneSky = "#eef6fd";      // ... and the brightest part of that reflection
  DAY.cityPaneDark = "#5f7db0";     // window glass against a pale wall: the room behind shows
  DAY.cityPaneDarkSky = "#8fa9d2";  // ... the sky across its top
  DAY.cityBoard = "#e6f1fb";        // blank sign boards
  DAY.citySafety = "#f2c14e";       // safety yellow: the crane's jib tip and hook, the hoarding stripe
  DAY.cityWarmLit = "#fff1cf";      // a lamp-lit room at its brightest (its resting colour is DAY.warm)

  var CITY_MAT = {
    t: { f: DAY.cityTile, g: DAY.cityPaneDark, hi: DAY.cityPaneDarkSky },
    c: { f: DAY.cityConcrete, g: DAY.cityPane, hi: DAY.cityPaneSky },
    d: { f: DAY.cityDark, g: DAY.cityPane, hi: DAY.cityPaneSky },
    g: { f: DAY.cityCurtainFrame, g: DAY.cityCurtain, hi: DAY.cityCurtainSky },
    n: { f: DAY.cityNavyFrame, g: DAY.cityNavyGlass, hi: DAY.cityNavySky },
    m: { f: DAY.cityMesh, g: DAY.cityPaneDark, hi: DAY.cityPaneDarkSky, deep: 0.72 }
  };
  var CITY_MATS = { G: "g", M: "t", S: "c", P: "d", D: "c", C: "t", L: "t", B: "d", X: "m" };
  // a tier's drawing: u = scale of every part, air = how far its tones go toward the air (below zero: toward navy,
  // the nearest row carries the most weight), lod = how much is drawn
  var CITY_LOOK = {
    near: { u: 1, air: -0.08, lod: 2 },
    nearBack: { u: 0.94, air: 0.2, lod: 2 },
    far: { u: 0.78, air: 0.52, lod: 1 },
    farBack: { u: 0.72, air: 0.62, lod: 1 },
    deep: { u: 0.6, air: 0.78, lod: 0 }
  };
  // the two haze bands, the same in every scene: [strength at the ground, height]
  var CITY_HAZE = [[0.4, 430], [0.2, 270]];
  function CityHaze(id, baseY, i) { return h("rect", { x: 0, y: baseY - CITY_HAZE[i][1], width: 1920, height: CITY_HAZE[i][1], fill: "url(#" + id + ")" }); }

  var _cpMemo = {};
  function cityPal(mat, air) {
    var key = mat + "|" + air;
    if (_cpMemo[key]) return _cpMemo[key];
    var m = CITY_MAT[mat], W = DAY.cityWhite, N = DAY.cityNavy, f = m.f, g = m.g;
    var a = function (c) { return air > 0 ? mix(c, DAY.cityAir, air) : air < 0 ? mix(c, N, -air) : c; };
    return _cpMemo[key] = {
      front: a(f), shade: a(mix(f, N, 0.17)), deep: a(mix(f, N, m.deep || 0.6)),
      glass: a(g), hi: a(m.hi), sheen: a(mix(g, m.hi, 0.42)), board: a(DAY.cityBoard),
      lite: a(mix(f, W, 0.6)), trim: a(mix(f, N, 0.26)), safety: a(DAY.citySafety)
    };
  }
  // paint order inside one layer of a building
  var CITY_KEYS = ["front", "shade", "deep", "glass", "hi", "sheen", "board", "lite", "trim", "safety"];

  /* The drawing board for one building: a flat elevation. Local units: x along the front from its left
     edge, y up from the ground. Every shape of one tone goes into one path. */
  function cityCtx(X, baseY, u, lod) {
    var layers = [], cur, c = { u: u, lod: lod, t: Math.max(3, 3.6 * u), cp: Math.max(3, 4 * u), info: {} };
    var bx0 = 1e9, bx1 = -1e9, byT = 1e9;
    function r1(v) { return Math.round(v * 10) / 10; }
    function add(k, d) { cur[k] = (cur[k] || "") + d; }
    function ext(xa, xb, yt) { if (xa < bx0) bx0 = xa; if (xb > bx1) bx1 = xb; if (yt < byT) byT = yt; }
    c.layer = function () { cur = {}; layers.push(cur); };
    c.layer();
    // a rectangle: x, y are its left and its foot
    c.R = function (k, x, y, w, hh) {
      if (w < 0.8 || hh < 0.8) return;
      var xa = r1(X + x), yt = r1(baseY - y - hh);
      add(k, "M" + xa + "," + yt + "h" + r1(w) + "v" + r1(hh) + "h" + r1(-w) + "z");
      ext(xa, xa + w, yt);
    };
    // n rectangles in a row with a gap between them
    c.split = function (k, x, y, w, hh, n, gap) {
      var bw = (w - (n - 1) * gap) / n;
      for (var i = 0; i < n; i++) c.R(k, x + i * (bw + gap), y, bw, hh);
    };
    // a bar with round ends (a tank lying on its side)
    c.cap = function (k, x, y, w, hh) {
      if (w < hh) w = hh;
      var r = r1(hh / 2), xa = X + x, yt = baseY - y - hh;
      add(k, "M" + r1(xa + hh / 2) + "," + r1(yt) + "h" + r1(w - hh) + "a" + r + "," + r + " 0 0 1 0," + r1(hh) + "h" + r1(hh - w) + "a" + r + "," + r + " 0 0 1 0," + r1(-hh) + "z");
      ext(xa, xa + w, yt);
    };
    // a polygon through x, y pairs: only for what is diagonal in a true elevation
    c.P = function (k, p) {
      var d = "";
      for (var i = 0; i < p.length; i += 2) { d += (i ? "L" : "M") + r1(X + p[i]) + "," + r1(baseY - p[i + 1]); ext(X + p[i], X + p[i], baseY - p[i + 1]); }
      add(k, d + "z");
    };
    // a point of the building in the tier's coordinates
    c.at = function (x, y) { return [r1(X + x), r1(baseY - y)]; };
    // a pane the light layer may pick: kept in tier coordinates
    c.pane = function (x, y, w, hh) { (c.info.panes = c.info.panes || []).push([r1(X + x), r1(baseY - y - hh), r1(w), r1(hh)]); };
    c.done = function (pal) {
      var kids = [];
      for (var i = 0; i < layers.length; i++) for (var j = 0; j < CITY_KEYS.length; j++) {
        var k = CITY_KEYS[j];
        if (layers[i][k]) kids.push(h("path", { d: layers[i][k], fill: pal[k] }));
      }
      return kids;
    };
    c.top = function () { return byT; };
    c.box = function () { return Math.floor(bx0 - 1) + " " + Math.floor(byT - 1) + " " + Math.ceil(bx1 - bx0 + 3) + " " + Math.ceil(baseY - byT + 2); };
    return c;
  }
  /* Roof gear: flat silhouettes standing on a level roofline at height y. */
  function cityTank(c, x, y) {                       // a water tank on its legs
    var u = c.u, t = c.t;
    c.R("trim", x + 5 * u, y, t, 19 * u); c.R("trim", x + 25 * u - t, y, t, 19 * u);
    c.cap("lite", x, y + 17 * u, 30 * u, 17 * u);
  }
  function cityAerial(c, x, y, hgt) {                // a television aerial: a pole and two cross arms
    var u = c.u, t = c.t;
    c.R("trim", x - t / 2, y, t, hgt);
    c.R("trim", x - 9 * u, y + hgt * 0.56, 18 * u, t); c.R("trim", x - 5 * u, y + hgt * 0.8, 10 * u, t);
  }
  function cityRod(c, x, y, hgt) {                   // a lightning rod on its base
    var u = c.u, t = c.t;
    c.R("trim", x - 5 * u, y, 10 * u, 5 * u); c.R("trim", x - t / 2, y, t, hgt);
  }
  // the top of a wall: its coping in the sun, and the coping's shade on the wall under it
  function cityCope(c, x, y, w) { c.R("lite", x, y - c.cp, w, c.cp); c.R("shade", x, y - 2 * c.cp, w, c.cp); }
  function cityPlant(c, x, y, w, hh) {               // a plant room: a box, its louvre, its cap
    var u = c.u;
    c.R("shade", x, y, w, hh);
    if (c.lod > 1) c.R("deep", x + 5 * u, y + hh * 0.3, w - 10 * u, hh * 0.32);
    c.R("lite", x - 1.5 * u, y + hh - c.cp, w + 3 * u, c.cp);
  }

  /* G: the glass tower */
  function cityG(c, w, hh, v) {
    var u = c.u, lod = c.lod, t = c.t, FL = 30 * u * (lod ? 1 : 1.5), i, j, y;
    var crown = lod ? Math.min(FL * 1.3, hh * 0.16) : 0, lob = lod ? Math.min(FL * 1.5, hh * 0.2) : 0, top = hh - crown, gh = top - lob;
    if (lod) {
      cityPlant(c, w * (v % 2 ? 0.46 : 0.12), hh, w * 0.4, FL * 0.8);
      if (Math.round(w / u) % 2) cityRod(c, w * (v % 2 ? 0.24 : 0.74), hh, FL * 1.7);             // on about every other tower, so the skyline is not a row of rods
    }
    c.R("front", 0, 0, w, hh);
    c.R("glass", 0, lob, w, gh);                                                                    // glass from edge to edge
    var sky = gh - Math.round(gh * 0.8 / FL) * FL;                                                  // the bright sky across its top, ending on a floor line
    if (sky < gh * 0.1) sky = gh * 0.2;
    c.R("hi", 0, top - sky, w, sky);
    // a sheen: a band on the light's diagonal, one small step lighter than the glass, clipped to the glass
    var sheen = function (yr, th) {
      var q = _clipPoly([[w, yr], [w, yr - th], [0, yr - th - w * 0.85], [0, yr - w * 0.85]], 0, lob, w, top - sky), p = [];
      for (j = 0; j < q.length; j++) p.push(q[j][0], q[j][1]);
      if (p.length > 5) c.P("sheen", p);
    };
    var s0 = lob + (gh - sky) * (v % 2 ? 0.8 : 0.66) + w * 0.42;
    sheen(s0, FL * 3.1);
    if (lod) sheen(s0 - FL * 4, FL * 0.9);
    if (lod) {
      if (v % 2) {                                                                                  // vertical fins, a band every fourth floor
        var nf = Math.max(3, Math.round(w / ((lod > 1 ? 21 : 30) * u)));
        for (i = 1; i < nf; i++) c.R("trim", i * w / nf - t / 2, lob, t, gh);
        for (y = lob + FL * 4; y < top - FL * 2; y += FL * 4) c.R("trim", 0, y - t / 2, w, t);
      } else {                                                                                      // floor bands, a mullion every other bay
        var step = FL * (lod > 1 ? 1 : 2), nv = Math.max(2, Math.round(w / (54 * u)));
        for (y = lob + step; y < top - 2; y += step) c.R("trim", 0, y - t / 2, w, t);
        for (i = 1; i < nv; i++) c.R("trim", i * w / nv - t / 2, lob, t, gh);
      }
      c.R("deep", 6 * u, top + crown * 0.26, w - 12 * u, crown * 0.36);                             // the louvres of the plant floor
      cityCope(c, 0, hh, w);
      c.split("deep", 7 * u, 0, w - 14 * u, lob - 9 * u, Math.max(2, Math.round(w / (42 * u))), 7 * u);   // the lobby between its columns
      c.R("lite", 0, lob - 9 * u, w, c.cp);                                                         // its canopy
    }
    c.info.glass = [c.at(0, top)[0], c.at(0, top)[1], w, gh];
  }
  /* M: the apartment slab. Even v: the balcony side. Odd v: the corridor side, with the escape stair in
     its own open bay. The core (lift, stairs) is a bay inside the front, never at an end. */
  function cityM(c, w, hh, v) {
    var u = c.u, lod = c.lod, t = c.t, corridor = v % 2 === 1, i, b, r;
    var n = Math.max(3, Math.round((hh - 8 * u) / (30 * u * (lod ? 1 : 2)))), fh = (hh - 8 * u) / n;
    var mx = 7 * u, cw = lod ? (corridor ? 36 : 28) * u : 0, cx = Math.round(w * ((v >> 1) % 2 ? 0.24 : 0.6)), ry0 = corridor ? 0.36 : 0.44;
    var runs = lod ? [[mx, cx - 4 * u - mx], [cx + cw + 4 * u, w - mx - cx - cw - 4 * u]] : [[mx, w - 2 * mx]];
    if (lod) {                                                                                      // on the roof: the lift overrun, a water tank, an aerial
      c.R("shade", cx - 3 * u, hh, cw + 6 * u, fh * 0.85); c.R("lite", cx - 4.5 * u, hh + fh * 0.85 - c.cp, cw + 9 * u, c.cp);
      cityTank(c, cx > w * 0.5 ? w * 0.14 : w * 0.7, hh);
      if (lod > 1 && Math.round(w / u) % 3 === 0) cityAerial(c, cx > w * 0.5 ? cx - 22 * u : cx + cw + 22 * u, hh, 42 * u);
    }
    c.R("front", 0, 0, w, hh);
    for (i = 1; i < n; i++) {
      var y0 = i * fh, ry = y0 + fh * ry0, rh = fh * (1 - ry0) - t;                                 // the open part above the balustrade
      for (r = 0; r < runs.length; r++) {
        var rx = runs[r][0], rw = runs[r][1], nb = Math.max(1, Math.round(rw / (46 * u))), bw = (rw + 4 * u) / nb;
        if (lod > 1 && !corridor) {
          c.split("deep", rx, ry, rw, rh, nb, 4 * u);
          for (b = 0; b < nb; b++) {                                                                // the sliding door, its head in the shade of the slab above
            c.R("glass", rx + b * bw + 6 * u, ry, bw - 21 * u, rh * 0.72);
            if ((b + i + r) % 2) c.pane(rx + b * bw + 6 * u, ry, bw - 21 * u, rh * 0.72);
          }
        } else {
          c.R("deep", rx, ry, rw, rh);
          if (lod > 1) for (b = 0; b < nb; b++) c.R("glass", rx + b * bw + bw * 0.3, ry, 11 * u, rh * 0.84);   // a flat's door
        }
        if (lod) c.R("lite", rx - 2 * u, y0 + 3 * u, rw + 4 * u, ry - y0 - 3 * u);                  // the balustrade, in the sun
      }
    }
    if (!lod) return;
    for (r = 0; r < 2; r++) c.split("deep", runs[r][0], 0, runs[r][1], fh * 0.72, Math.max(1, Math.round(runs[r][1] / (62 * u))), 8 * u);   // the open ground floor between its columns
    cityCope(c, 0, hh, w);
    if (corridor) {                                                                                 // the stair bay: flights zigzag up it
      var th = Math.max(t, 5 * u);
      c.R("deep", cx, fh * 0.2, cw, hh - fh * 0.2 - 10 * u);
      for (i = 0; i < n - 1; i++) {
        var a = i % 2 ? cw - 3 * u : 3 * u, e2 = i % 2 ? 3 * u : cw - 3 * u, fy = i * fh + fh * 0.2;
        c.P("lite", [cx + a, fy, cx + e2, fy + fh, cx + e2, fy + fh + th, cx + a, fy + th]);
      }
    } else if (lod > 1) for (i = 1; i < n; i++) c.R("glass", cx + cw / 2 - 6 * u, i * fh + fh * 0.3, 12 * u, fh * 0.44);   // the core's own windows
  }
  /* S: the tower that steps back. Even v: it steps back mostly on its left; odd v: on its right. */
  function cityS(c, w, hh, v) {
    var u = c.u, lod = c.lod, t = c.t, FL = 30 * u, s, b, f;
    var st = v % 2 ? [[0, 1, 0, 0.52], [0, 0.82, 0.52, 0.72], [0.15, 0.82, 0.72, 0.87], [0.15, 0.6, 0.87, 1]]
      : [[0, 1, 0, 0.5], [0.18, 1, 0.5, 0.71], [0.18, 0.8, 0.71, 0.87], [0.36, 0.8, 0.87, 1]];
    if (lod) cityRod(c, (st[3][0] + st[3][1]) / 2 * w, hh, FL * 1.6);
    for (s = 0; s < 4; s++) {
      var x = st[s][0] * w, sw = (st[s][1] - st[s][0]) * w, y0 = st[s][2] * hh, y1 = st[s][3] * hh;
      c.R("front", x, y0, sw, y1 - y0);
      if (!lod) continue;
      var pm = 5 * u, nb = Math.max(1, Math.round((sw - 2 * pm) / (25 * u))), bw = (sw - 2 * pm) / nb, step = FL * (lod > 1 ? 2 : 3), gap = Math.max(t, 5 * u);
      var a = s ? y0 + 9 * u : 40 * u, e = y1 - 11 * u, nfl = Math.max(1, Math.round((e - a) / step)), fl = (e - a + gap) / nfl;
      for (b = 0; b < nb; b++) for (f = 0; f < nfl; f++) {                                          // tall panes between piers
        var sx = x + pm + b * bw + bw * 0.22, hiH = lod > 1 && f === nfl - 1 ? Math.min(15 * u, (fl - gap) * 0.4) : 0;
        c.R("glass", sx, a + f * fl, bw * 0.56, fl - gap - hiH);
        if (hiH) c.R("hi", sx, a + f * fl + fl - gap - hiH, bw * 0.56, hiH);
        if (lod > 1 && s < 2 && (b + f) % 3 === 0) c.pane(sx, a + f * fl, bw * 0.56, fl - gap);
      }
      c.R("lite", x - 1.5 * u, y1 - c.cp, sw + 3 * u, c.cp); c.R("shade", x, y1 - 2 * c.cp, sw, c.cp);
      if (!s) {                                                                                     // the ground floor: tall openings under a fascia
        c.split("deep", pm + 3 * u, 0, sw - 2 * pm - 6 * u, 26 * u, Math.max(2, Math.round(sw / (48 * u))), 8 * u);
        c.R("lite", 0, 29 * u, sw, c.cp);
      }
    }
  }
  /* P: the pencil building */
  function cityP(c, w, hh, v) {
    var u = c.u, lod = c.lod, t = c.t, n = Math.max(4, Math.round((hh - 10 * u) / (31 * u * (lod ? 1 : 2)))), fh = (hh - 10 * u) / n, i, y0;
    if (lod) {                                                                                      // on the roof: the stair head, an aerial
      c.R("shade", w * 0.08, hh, w * 0.5, 21 * u); c.R("lite", w * 0.08 - 1.5 * u, hh + 21 * u - c.cp, w * 0.5 + 3 * u, c.cp);
      if (v % 2 === 0) cityAerial(c, w * 0.78, hh, 46 * u);
    }
    c.R("front", 0, 0, w, hh);
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
    c.R("deep", 5 * u, 0, w - 10 * u, fh * 0.72); c.R("board", 2 * u, fh * 0.72, w - 4 * u, 7 * u);   // the shop at its foot, a blank fascia
    cityCope(c, 0, hh, w);
    if (lod > 1) {                                                                                  // the blade signs: separate blank boards on brackets, sky between them
      var sn = Math.min(4, Math.floor((n - 2) / 1.6)), sh = fh * 0.92;
      for (i = 0; i < sn; i++) {
        var sy = fh * 1.5 + i * fh * 1.6, dark = (i + v) % 2 === 0;
        c.R(dark ? "trim" : "board", w + 3 * u, sy, 14 * u, sh);
        c.R("trim", w, sy + sh * 0.5 - t / 2, 3 * u + 1, t);
        if (!dark) c.R("trim", w + 10 * u - t / 2, sy + 5 * u, t, sh - 10 * u);
      }
    }
  }
  /* D: the podium and the tower standing on it. Odd v: the tower stands toward the left. */
  function cityD(c, w, hh, v) {
    var u = c.u, lod = c.lod, t = c.t, FL = 30 * u, ph = Math.min(hh * 0.42, 122 * u), i, r, y;
    var tw = w * 0.56, tx = v % 2 ? w * 0.07 : w * 0.37;
    if (lod) { cityPlant(c, tx + tw * 0.16, hh, tw * 0.46, FL * 0.75); if (Math.round(w / u) % 2) cityRod(c, tx + tw * 0.82, hh, FL * 1.5); }
    c.R("front", 0, 0, w, ph);
    c.R("front", tx, ph, tw, hh - ph);
    if (lod) {
      var gf = ph * 0.38, nb = Math.max(2, Math.round((w - 16 * u) / (40 * u)));
      c.split("deep", 8 * u, 0, w - 16 * u, gf - 5 * u, nb, 8 * u);                                 // the arcade between its piers
      c.R("lite", 3 * u, gf - 5 * u, w - 6 * u, c.cp);
      c.split("glass", 8 * u, gf + (ph - gf) * 0.22, w - 16 * u, (ph - gf) * 0.5, lod > 1 ? Math.max(3, Math.round((w - 16 * u) / (21 * u))) : nb, lod > 1 ? 4 * u : 7 * u);
      cityCope(c, 0, ph, w);
      if (lod > 1) {                                                                                // the rail of the roof terrace beside the tower
        var rx = v % 2 ? tx + tw + 7 * u : 4 * u, rw = v % 2 ? w - 4 * u - rx : tx - 11 * u, np = Math.max(2, Math.round(rw / (26 * u)));
        c.R("trim", rx, ph + 11 * u, rw, t);
        for (i = 0; i <= np; i++) c.R("trim", rx + i * (rw - t) / np, ph, t, 11 * u);
      }
    }
    var body = hh - ph - (lod ? FL * 1.1 : 0), rows = Math.max(1, Math.round(body / (FL * (lod ? 2 : 3)))), chh = body / rows;
    var nc = Math.max(2, Math.round(tw / (44 * u))), cw = tw / nc;
    for (r = 0; r < rows; r++) {
      y = ph + r * chh;
      if (!lod) { c.R("glass", tx + 5 * u, y + chh * 0.25, tw - 10 * u, chh * 0.5); continue; }
      for (i = 0; i < nc; i++) {                                                                    // one two-storey bay of the frame
        var gx = tx + i * cw + 4 * u, gw2 = cw - 8 * u, hi = (i * 2 + r * 3 + v) % 5 === 0;
        if (lod > 1) {
          var p2 = (chh - 10 * u - t) / 2;
          c.R("glass", gx, y + 5 * u, gw2, p2); c.R(hi ? "hi" : "glass", gx, y + 5 * u + p2 + t, gw2, p2);
          if ((i + r) % 2) c.pane(gx, y + 5 * u + p2 + t, gw2, p2);
        } else c.R("glass", gx, y + 5 * u, gw2, chh - 10 * u);
      }
    }
    if (lod) { if (lod > 1) c.R("deep", tx + 5 * u, hh - FL * 0.9, tw - 10 * u, FL * 0.45); cityCope(c, tx, hh, tw); }
  }
  /* C: the corner building. Its corner entrance is at the left end (v bit 1: at the right). */
  function cityC(c, w, hh, v) {
    var u = c.u, lod = c.lod, t = c.t, cw = Math.min(w * 0.3, 56 * u), cx = (v >> 1) % 2 ? w - cw : 0, ox = cx ? 0 : cw, i;
    var gf = lod ? 40 * u : 0, n = Math.max(2, Math.round((hh - gf - 10 * u) / (30 * u * (lod ? 1 : 2)))), fh = (hh - gf - 10 * u) / n, crest = lod ? 23 * u : 0;
    if (lod) cityPlant(c, ox + (w - cw) * 0.36, hh, (w - cw) * 0.46, 19 * u);
    c.R("front", 0, 0, w, hh);
    if (lod) c.R("front", cx, hh, cw, crest);                                                       // the raised parapet over the corner
    var fw = w - 10 * u, ng = Math.max(2, Math.round(fw / (36 * u)));
    for (i = 0; i < n; i++) {                                                                       // a ribbon window from end to end
      var yb = gf + i * fh + fh * 0.3, bh = fh * 0.46;
      if (lod > 1) {
        c.split("glass", 5 * u, yb, fw, bh * 0.6, ng, t); c.split("hi", 5 * u, yb + bh * 0.6, fw, bh * 0.4, ng, t);
        c.R("lite", 3 * u, yb - t, w - 6 * u, t);
        if (i % 2 === 0) c.pane(5 * u + (i % ng) * (fw + t) / ng, yb, (fw - (ng - 1) * t) / ng, bh);
      } else c.R("glass", 5 * u, yb, fw, bh);
    }
    if (lod) {
      c.R("deep", cx + cw * 0.22, 0, cw * 0.56, gf - 10 * u);                                       // the entrance, on the corner
      c.R("lite", cx + cw * 0.08, gf - 10 * u, cw * 0.84, c.cp);                                    // its canopy
      c.split("deep", ox + 7 * u, 0, w - cw - 14 * u, gf - 12 * u, Math.max(1, Math.round((w - cw) / (46 * u))), 7 * u);
      if (lod > 1) {
        c.R("board", ox + 4 * u, gf - 12 * u, w - cw - 8 * u, 6 * u);
        c.R("board", cx + cw * 0.16, hh - 9 * u, cw * 0.68, crest - u);                               // a blank plate on the parapet
      }
      cityCope(c, ox, hh, w - cw); cityCope(c, cx, hh + crest, cw);
    }
  }
  /* L: the low block. Odd v: its roof gear the other way round. */
  function cityL(c, w, hh, v) {
    var u = c.u, lod = c.lod, t = c.t, n = Math.max(2, Math.round((hh - 6 * u) / (31 * u))), fh = (hh - 6 * u) / n, i, b;
    var nb = Math.max(1, Math.round((w - 12 * u) / (52 * u))), bw = (w - 12 * u) / nb;
    if (lod) {                                                                                      // what stands on the roof
      var hx = w * (v % 2 ? 0.16 : 0.6), tx = w * (v % 2 ? 0.5 : 0.07);
      c.R("shade", hx, hh, 34 * u, 28 * u); c.R("deep", hx + 20 * u, hh, 9 * u, 19 * u);            // the stair head and its door
      c.R("lite", hx - 1.5 * u, hh + 28 * u - c.cp, 37 * u, c.cp);
      for (i = 0; i < (w > 190 * u ? 2 : 1); i++) cityTank(c, tx + i * 40 * u, hh);                 // water tanks on legs
      if (w > 215 * u) c.split("shade", w * (v % 2 ? 0.8 : 0.84) - 20 * u, hh, 38 * u, 12 * u, 2, 5 * u);   // condensers
      c.R("trim", 2 * u, hh + 13 * u, w - 4 * u, t);                                                // the roof fence: a rail on posts
      var np = Math.max(2, Math.round(w / (30 * u)));
      for (i = 0; i <= np; i++) c.R("trim", 2 * u + i * (w - 4 * u - t) / np, hh, t, 13 * u);
    }
    c.R("front", 0, 0, w, hh);
    if (!lod) return;
    c.split("deep", 7 * u, 0, w - 14 * u, fh * 0.74, nb, 8 * u);                                    // shop fronts
    for (b = 0; b < nb; b++) if ((b + v) % 3 !== 1) c.R((b + v) % 2 ? "board" : "trim", 6 * u + b * bw + 2 * u, fh * 0.6, bw - 4 * u, 8 * u);   // blank awnings
    for (i = 1; i < n; i++) for (b = 0; b < nb; b++) {                                              // windows in pairs, on one sill
      var wx = 6 * u + b * bw + bw * 0.13, ww = bw * 0.32, wy = i * fh + fh * 0.3, wh = fh * 0.48;
      c.R("glass", wx, wy, ww, wh); c.R("glass", wx + bw * 0.42, wy, ww, wh);
      if (lod > 1) { c.R("lite", wx - 2 * u, wy - t, bw * 0.74 + 4 * u, t); if ((b + i) % 2 === 0) c.pane(wx, wy, ww, wh); }
    }
    cityCope(c, 0, hh, w);
  }
  /* B: the building under a billboard */
  function cityB(c, w, hh, v) {
    var u = c.u, lod = c.lod, t = c.t, n = Math.max(3, Math.round((hh - 8 * u) / (31 * u * (lod ? 1 : 2)))), fh = (hh - 8 * u) / n, i;
    var bwid = w * 0.92, bx = w * 0.04, bh = Math.min(80 * u, w * 0.5), gap = 25 * u, by = hh + gap;
    // the billboard: a blank board on a braced steel frame, standing on the roof
    var post = [bx + bwid * 0.12, bx + bwid * 0.5, bx + bwid * 0.88];
    for (i = 0; i < 3; i++) c.R("trim", post[i] - t / 2, hh, t, gap + 2);
    if (lod) for (i = 0; i < 2; i++) {
      var xa = post[i * 2] + (i ? -t / 2 : t / 2), xb = post[1] + (i ? t / 2 : -t / 2);
      c.P("trim", [xa, hh, xb, by - t, xb, by, xa, hh + t]);
    }
    c.R("board", bx, by, bwid, bh);
    c.R("trim", bx, by, bwid, t); c.R("trim", bx, by + bh - t, bwid, t); c.R("trim", bx, by, t, bh); c.R("trim", bx + bwid - t, by, t, bh);
    if (lod) {
      c.cap("trim", bx + 11 * u, by + bh * 0.46, bwid * 0.5, bh * 0.24);
      c.R("trim", bx + 11 * u, by + bh * 0.2, bwid * 0.3, Math.max(t, 6 * u)); c.R("trim", bx + 11 * u + bwid * 0.36, by + bh * 0.2, bwid * 0.2, Math.max(t, 6 * u));
    }
    c.R("front", 0, 0, w, hh);
    var sgx = w * 0.6, sgw = lod ? Math.max(17 * u, w * 0.13) : 0, lx = 6 * u, lw = (lod ? sgx - 6 * u : w - 6 * u) - lx, rx = sgx + sgw + 6 * u, rw = w - 6 * u - rx;
    for (i = 1; i < n; i++) {
      var wy = i * fh + fh * 0.26;
      if (lod > 1) {
        c.split("glass", lx, wy, lw, fh * 0.32, 2, 7 * u); c.split("hi", lx, wy + fh * 0.32, lw, fh * 0.2, 2, 7 * u);
        c.R("glass", rx, wy, rw, fh * 0.32); c.R("hi", rx, wy + fh * 0.32, rw, fh * 0.2);
        if (i % 2) c.pane(lx, wy, (lw - 7 * u) / 2, fh * 0.52);
      } else { c.R("glass", lx, wy, lw, fh * 0.5); if (lod) c.R("glass", rx, wy, rw, fh * 0.5); }
    }
    if (!lod) return;
    c.split("deep", 6 * u, 0, w - 12 * u, fh * 0.72, 2, 8 * u);
    c.R("board", sgx, hh * 0.24, sgw, hh * 0.62);                                                   // the wall sign, blank blocks
    var bl = (hh * 0.62 - 8 * u) / 3;
    for (i = 0; i < 3; i++) c.R("trim", sgx + 4.5 * u, hh * 0.24 + 7 * u + i * bl, sgw - 9 * u, bl - 6 * u);
    cityCope(c, 0, hh, w);
  }
  /* X: the building site. v: bit 0 moves the crane's mast, bit 1 turns its jib to the left. */
  var CITY_MAST = 150;                   // how far the crane's mast stands above the roofline, at scale 1
  function cityX(c, w, hh, v) {
    var u = c.u, lod = c.lod, t = c.t, cell = 32 * u * (lod > 1 ? 1 : 1.6), i, y;
    var nx = Math.max(2, Math.round(w / cell)), cwd = w / nx, ny = Math.max(3, Math.round(hh / cell)), chh = hh / ny;
    // the steel frame: dark between the floors, pale columns and beams inside it (none down its two ends), every
    // other column standing a stub above the last floor
    c.R("deep", 0, 0, w, hh);
    if (lod) {
      for (i = 1; i < nx; i++) c.R("lite", i * cwd - t / 2, 0, t, hh + (i % 2 ? 12 * u : 0));
      for (i = 1; i <= ny; i++) c.R("lite", 0, i * chh - t, w, t);
    }
    c.layer();
    // the mesh sheet: the upper floors up to the last one, whose steel is still bare; it steps down toward one end
    var m1 = Math.round(ny * 0.52) * chh, m2 = Math.round(ny * 0.26) * chh, m3 = Math.min(chh * 0.55, 22 * u), x2 = Math.round(nx * 0.4) * cwd, x3 = Math.round(nx * 0.72) * cwd, mtop = hh - (lod ? chh : 0);
    c.R("front", 0, m1, w, mtop - m1); c.R("front", x2, m2, w - x2, m1 - m2 + 1); c.R("front", x3, m3, w - x3, m2 - m3 + 1);
    if (lod) {
      for (i = 1; i < nx; i++) { var sx = i * cwd, sy = sx >= x3 - 1 ? m3 : sx >= x2 - 1 ? m2 : m1; c.R("trim", sx - t / 2, sy, t, mtop - sy); }
      for (y = m1 + 2 * chh; y < mtop - chh * 0.5; y += 2 * chh) c.R("trim", 0, y - t / 2, w, t);
      c.R("board", -3 * u, 0, w + 6 * u, 24 * u); c.R("safety", -3 * u, 15 * u, w + 6 * u, Math.max(t, 4 * u));   // the hoarding
    }
    var top = c.at(w * (v % 2 ? 0.34 : 0.62), hh + CITY_MAST * u);
    c.info.crane = [top[0], top[1], u, v, lod];
  }
  var CITY_TYPES = { G: cityG, M: cityM, S: cityS, P: cityP, D: cityD, C: cityC, L: cityL, B: cityB, X: cityX };

  /* A row, composed by hand: [type, x, width, height, variant, material] from left to right. x is the
     building's left edge, in the coordinates the row was composed in (dx moves them into the tier's own).
     ref is the row's usual roofline, for SKYLINE_SIZE. A building is pushed right if it would touch the
     one before it, so inside a row nothing overlaps and the drawing order cannot matter. */
  function cityRow(look, baseY, ref, dx, spec) {
    var items = [], cur = -1e9, u = look.u, S = SKYLINE_SIZE, i, j;
    for (i = 0; i < spec.length; i++) {
      var e = spec[i], t = e[0], w = e[2], xr = t === "P" ? 17 * u : 0;
      var x = Math.round(Math.max(e[1] + dx, cur + 2)), hh = Math.max(50, Math.round(e[3] * S.base + (e[3] - ref) * (S.amp - 1)));
      items.push({ t: t, x: x, w: w, h: hh, v: e[4] || 0, m: e[5] || CITY_MATS[t], x0: x - 6, x1: x + w + xr + 6, node: null, info: null, top: 0 });
      cur = x + w + xr;
    }
    var N = 1;                                      // the most buildings ever in view at once
    for (i = 0; i < items.length; i++) { var n = 0; for (j = i; j < items.length && items[j].x0 < items[i].x1 + 1985; j++) n++; if (n > N) N = n; }
    return { look: look, baseY: baseY, items: items, N: N + 1, cranes: null };
  }
  // one building: drawn once and kept. data-city names its type (the crane and the light layer are not in it)
  function cityNode(it, row) {
    if (it.node) return it.node;
    var look = row.look, c = cityCtx(it.x, row.baseY, look.u, look.lod);
    CITY_TYPES[it.t](c, it.w, it.h, it.v);
    it.info = c.info; it.top = c.top();
    return it.node = h("g", {
      "data-city": it.t, "data-roof": row.baseY - it.h,
      "data-cache": "city-" + [it.t, it.x, it.w, it.h, it.v, it.m, row.baseY, look.u, look.air].join("_"), "data-box": c.box()
    }, c.done(cityPal(it.m, look.air)));
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
  /* The tower cranes of a row, each standing behind its building site: the mast and the arm (jib,
     counter-jib, ties, counterweight) are drawn once; slewing is the arm's width changing as it turns away
     from us, very slowly. The trolley runs along the jib and the hook rises and falls on their own slow
     phases. */
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
  // the mast from the crane's head down to the roofline: two chords and a zigzag web (one bar when far away)
  function cityCraneMast(u, pal, lod) {
    var t = Math.max(3, 3.6 * u), hw = 6.5 * u, len = CITY_MAST * u, seg = 15 * u, d = "", k = 0, y;
    var n1 = function (v) { return Math.round(v * 10) / 10; };
    var R = function (x, y0, w, hh) { return "M" + n1(x) + "," + n1(y0) + "h" + n1(w) + "v" + n1(hh) + "h" + n1(-w) + "z"; };
    if (lod > 1) {
      d = R(-hw, 0, t, len) + R(hw - t, 0, t, len);
      for (y = len; y > seg * 0.5; y -= seg, k++) {
        var xa = k % 2 ? hw - t : -hw, xb = k % 2 ? -hw : hw - t, y1 = Math.max(0, y - seg);
        d += "M" + n1(xa) + "," + n1(y) + "h" + n1(t) + "L" + n1(xb + t) + "," + n1(y1) + "h" + n1(-t) + "z";
      }
    } else d = R(-Math.max(2.5, 4 * u), 0, Math.max(5, 8 * u), len);
    return h("path", { d: d, fill: pal.lite });
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
        row.cranes.push({ x: k[0], y: k[1], u: k[2], dir: (k[3] >> 1) % 2 ? -1 : 1, ph: i * 1.7 + it.x * 0.003, pal: pal, mast: cityCraneMast(k[2], pal, k[4]), arm: cityArm(k[2], pal), head: cityCraneHead(k[2], pal) });
      });
    }
    return h("g", null, row.cranes.map(function (k) {
      var u = k.u, t = Math.max(3, 3.6 * u), s = (0.76 + 0.2 * Math.sin(time * 0.11 + k.ph)) * k.dir;
      var tr = (0.36 + 0.3 * (0.5 + 0.5 * Math.sin(time * 0.083 + k.ph * 2.1))) * CITY_JIB * u * s;
      var drop = (44 + 22 * Math.sin(time * 0.097 + k.ph * 1.3)) * u;
      return h("g", { transform: "translate(" + cityAt(k.x, off, tile).toFixed(1) + "," + k.y + ")" },
        k.mast,
        h("g", { transform: "scale(" + s.toFixed(4) + ",1)" }, k.arm),
        h("rect", { x: (tr - t / 2).toFixed(1), y: 0, width: t.toFixed(1), height: drop.toFixed(1), fill: k.pal.deep }),
        h("rect", { x: (tr - 4.5 * u).toFixed(1), y: drop.toFixed(1), width: (9 * u).toFixed(1), height: (8 * u).toFixed(1), fill: k.pal.safety }),
        k.head);
    }));
  }
  /* Window light: a thin layer over a tier, a pure function of time. def (in the coordinates the rows were
     composed in, dx as for the rows): sheen [[x, phase]] = the glass tower nearest x; glint [[x, height
     above the ground, period, phase]] and warm [[x, height, phase]] = the pane nearest that point. A row
     later in the list stands in front: nothing is lit behind it, and the sheen stops at its roofs. */
  function cityLights(rows, dx, def) {
    var L = { sheen: [], glint: [], warm: [] }, taken = [];
    rows.forEach(function (row) { row.items.forEach(function (it) { cityNode(it, row); }); });
    // the top of whatever stands in front of the span x0..x1 of row number ri (a row later in the list is in front)
    var cover = function (ri, x0, x1) {
      var top = 1e9;
      for (var j = ri + 1; j < rows.length; j++) rows[j].items.forEach(function (f) { if (f.x - 4 < x1 && f.x + f.w + 4 > x0 && f.top < top) top = f.top; });
      return top;
    };
    var near = function (x, y, glass, room) {
      var best = null, bd = 1e9;
      rows.forEach(function (row, ri) {
        row.items.forEach(function (it) {
          if (Math.abs(it.x + it.w / 2 - x) > 240) return;
          if (glass) {                                 // the glass of a tower, down to the roofs in front of it
            var dg = Math.abs(it.x + it.w / 2 - x), g = it.info.glass;
            if (g && dg < bd) { bd = dg; best = [g[0], g[1], g[2], Math.min(g[3], cover(ri, g[0], g[0] + g[2]) - 3 - g[1])]; }
            return;
          }
          (it.info.panes || []).forEach(function (p) {
            var dd = Math.abs(p[0] + p[2] / 2 - x) + Math.abs(p[1] + p[3] / 2 - (row.baseY - y));
            if (dd < bd && !(room && p[3] > p[2] * 1.6) && taken.indexOf(p) < 0 && cover(ri, p[0], p[0] + p[2]) > p[1] + p[3]) { bd = dd; best = p; }
          });
        });
      });
      if (best && !glass) taken.push(best);            // one light a pane
      return best;
    };
    (def.sheen || []).forEach(function (s) { var g = near(s[0] + dx, 0, true); if (g && g[3] > 40) L.sheen.push({ g: g, ph: s[1] }); });
    (def.glint || []).forEach(function (s) { var p = near(s[0] + dx, s[1]); if (p) L.glint.push({ r: p, T: s[2], ph: s[3] }); });
    (def.warm || []).forEach(function (s) { var p = near(s[0] + dx, s[1], false, true); if (p) L.warm.push({ r: p, ph: s[2] }); });
    return L;
  }
  function CityLights(L, time, off, tile) {
    return h("g", null,
      // the sheen: two bands of sky sliding down the glass on the light's diagonal, 11 s of travel in every 20
      L.sheen.map(function (s) {
        var g = s.g, p = ((((time + s.ph) % 20) + 20) % 20) / 11;
        if (p >= 1) return h("path", { d: "M0,0", fill: DAY.cityWhite, opacity: 0 });
        var xl = cityAt(g[0], off, tile), xr = xl + g[2], sl = g[2] * 0.85, yr = g[1] - 130 - sl + (g[3] + sl + 150) * p;
        var band = function (a, b) { return _polyD(_clipPoly([[xr, yr + a], [xr, yr + b], [xl, yr + b + sl], [xl, yr + a + sl]], xl, g[1], xr, g[1] + g[3])); };
        return h("path", { d: (band(0, 74) + band(92, 108)) || "M0,0", fill: DAY.cityWhite, opacity: (0.24 * Math.pow(Math.sin(Math.PI * p), 0.7)).toFixed(3) });
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
        ["M", -82, 152, 300, 0, "c"], ["G", 85, 99, 400, 0, "n"], ["S", 224, 124, 360, 0, "c"], ["D", 385, 185, 420, 0, "c"],
        ["M", 618, 172, 320, 0, "c"], ["G", 824, 96, 410, 1, "n"], ["S", 974, 118, 400, 0, "c"], ["G", 1099, 105, 500, 0, "n"],
        ["S", 1422, 106, 470, 0, "c"], ["M", 1544, 162, 280, 0, "c"], ["D", 1759, 175, 430, 0, "c"],
        ["G", 1967, 105, 520, 0, "n"], ["S", 2106, 124, 450, 0, "c"], ["M", 2268, 172, 330, 0, "c"],
        ["G", 2458, 96, 400, 1, "n"]]),
      farBack: cityRow(CITY_LOOK.farBack, GROUND, 400, -64, [
        ["G", 114, 132, 380, 1, "n"], ["S", 586, 144, 400, 0, "c"], ["G", 1188, 156, 612, 0, "g"],
        ["S", 1360, 132, 500, 0, "d"], ["S", 2096, 144, 420, 1, "c"]]),
      far: cityRow(CITY_LOOK.far, GROUND, 340, -64, [
        ["S", 3, 155, 400, 1, "c"], ["M", 234, 198, 330, 0, "t"], ["D", 434, 255, 400, 0, "c"], ["C", 726, 154, 330, 0, "t"],
        ["B", 901, 131, 300, 0, "c"], ["D", 1040, 235, 440, 0, "t"], ["M", 1278, 178, 340, 3, "c"],
        ["M", 1488, 208, 270, 0, "t"], ["X", 1737, 171, 420, 0, "m"], ["S", 1938, 157, 500, 1, "c"],
        ["C", 2154, 166, 360, 0, "t"], ["M", 2332, 178, 300, 0, "c"], ["G", 2512, 143, 470, 1, "g"]]),
      nearBack: cityRow(CITY_LOOK.nearBack, GROUND, 340, -104, [
        ["C", -24, 224, 340, 0, "c"], ["S", 376, 194, 380, 0, "d"], ["G", 615, 163, 400, 1, "n"], ["C", 808, 192, 300, 0, "c"],
        ["G", 1209, 171, 400, 0, "n"], ["S", 2016, 194, 390, 1, "c"], ["B", 2263, 157, 300, 0, "d"],
        ["G", 2522, 174, 600, 0, "n"], ["X", 2698, 229, 430, 0, "m"], ["S", 2956, 184, 420, 0, "c"]]),
      near: cityRow(CITY_LOOK.near, GROUND, 260, -104, [
        ["L", -164, 244, 150, 0, "t"], ["P", 156, 70, 310, 0, "d"], ["M", 264, 266, 300, 1, "t"], ["B", 570, 170, 240, 0, "c"],
        ["L", 746, 204, 130, 1, "t"], ["M", 1000, 240, 335, 0, "c"], ["P", 1396, 70, 300, 1, "d"],
        ["D", 1732, 308, 400, 1, "d"], ["L", 2046, 234, 150, 0, "t"], ["C", 2285, 205, 260, 0, "c"],
        ["M", 2546, 246, 300, 1, "t"], ["L", 2794, 244, 140, 1, "c"], ["B", 3040, 170, 250, 1, "d"]])
    };
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
        ["G", 135, 127, 300, 0, "n"], ["S", 668, 132, 330, 0, "c"], ["G", 1096, 124, 320, 1, "g"],
        ["G", 1562, 150, 540, 0, "g"], ["S", 1768, 132, 470, 0, "d"], ["G", 1994, 132, 430, 1, "n"],
        ["S", 2608, 132, 420, 0, "c"], ["G", 3152, 138, 470, 0, "g"], ["S", 3449, 127, 380, 1, "d"]]),
      far: cityRow(CITY_LOOK.far, ROAD_Y, 300, 0, [
        ["M", 32, 198, 280, 0, "c"], ["C", 256, 154, 320, 0, "t"], ["M", 442, 178, 250, 1, "c"], ["D", 625, 225, 340, 0, "t"],
        ["S", 864, 146, 330, 0, "c"], ["C", 1026, 154, 300, 0, "t"], ["M", 1212, 198, 290, 0, "c"],
        ["B", 1449, 131, 290, 0, "t"], ["D", 1655, 245, 470, 0, "c"], ["M", 1922, 188, 370, 0, "t"],
        ["S", 2123, 157, 500, 1, "c"], ["X", 2299, 171, 390, 0, "m"], ["M", 2492, 198, 300, 1, "c"],
        ["C", 2704, 166, 340, 0, "t"], ["B", 2889, 131, 260, 0, "c"], ["D", 3045, 245, 420, 1, "t"],
        ["M", 3312, 208, 280, 0, "c"], ["S", 3534, 146, 350, 0, "t"]]),
      nearBack: cityRow(CITY_LOOK.nearBack, ROAD_Y, 320, 0, [
        ["S", 86, 184, 330, 0, "d"], ["M", 696, 224, 290, 0, "d"], ["G", 1173, 152, 330, 1, "n"],
        ["S", 1458, 172, 330, 1, "d"], ["G", 1993, 171, 450, 0, "n"], ["X", 2201, 229, 380, 0, "m"],
        ["S", 2516, 194, 420, 0, "c"], ["G", 2945, 165, 400, 1, "n"], ["B", 3263, 157, 300, 0, "d"],
        ["S", 3518, 172, 340, 1, "c"]]),
      near: cityRow(CITY_LOOK.near, ROAD_Y, 240, 0, [
        ["L", -14, 244, 160, 0, "t"], ["M", 244, 246, 300, 0, "c"], ["P", 554, 70, 320, 0, "d"], ["L", 643, 224, 150, 1, "c"],
        ["C", 895, 205, 270, 0, "t"], ["L", 1106, 214, 160, 0, "c"], ["M", 1364, 251, 310, 1, "t"],
        ["P", 1684, 68, 310, 1, "d"], ["L", 1776, 224, 150, 0, "t"], ["M", 2074, 236, 290, 0, "c"],
        ["L", 2336, 234, 140, 1, "t"], ["D", 2622, 308, 430, 0, "d"], ["C", 2965, 205, 280, 0, "t"],
        ["M", 3214, 246, 300, 1, "c"], ["P", 3524, 70, 310, 0, "d"], ["L", 3613, 204, 150, 0, "t"]])
    };
    c.lights = cityLights([c.nearBack, c.near], 0, {
      sheen: [[1250, 4]],
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
        ["M", -8, 178, 210, 0, "t"], ["S", 183, 132, 260, 0, "c"], ["M", 332, 198, 200, 1, "t"], ["C", 537, 143, 240, 0, "c"],
        ["B", 696, 125, 200, 0, "t"], ["D", 823, 215, 340, 0, "c"], ["S", 1040, 146, 440, 0, "t"],
        ["M", 1247, 178, 230, 0, "c"], ["S", 1468, 132, 430, 1, "t"], ["G", 1602, 143, 560, 0, "g"],
        ["D", 1747, 195, 470, 1, "c"]]),
      back: cityRow(CITY_LOOK.nearBack, 1010, 300, 0, [
        ["M", 116, 214, 190, 0, "c"], ["B", 361, 144, 170, 0, "d"], ["L", 509, 201, 130, 1, "c"], ["C", 759, 181, 250, 0, "c"],
        ["G", 942, 163, 430, 0, "n"], ["P", 1136, 65, 300, 0, "c"], ["X", 1523, 199, 390, 1, "m"],
        ["S", 1734, 184, 430, 0, "d"]]),
      front: cityRow(CITY_LOOK.near, 1010, 220, 0, [
        ["L", 1536, 219, 150, 0, "c"], ["C", 1771, 194, 240, 0, "t"]])
    };
    c.lights = cityLights([c.back, c.front], 0, {
      sheen: [[1045, 2]],
      glint: [[240, 130, 13, 0.4], [880, 150, 17, 2.6], [1180, 200, 11, 4.4], [1900, 150, 15, 1.2], [1660, 80, 19, 3.3]],
      warm: [[900, 90, 0.8], [1880, 100, 3.6]]
    });
    return _cityN = c;
  }
