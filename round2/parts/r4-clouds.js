//== REPLACE from "  /* Clouds (round 3). Four species, seven builds:" to "  /* The cloud field: the same maths in every scene."
  /* Clouds (round 4, 2026-11-15). The owner's verdict on the round 3 clouds: "a bit odd … not that natural /
     professionally designed". They were piles of near-equal discs, each ringed with its own crescent, on a
     pill that stuck out underneath, and the big one stood as tall as it was wide. Every species is drawn
     again as ONE silhouette, two and a half to three times wider than tall:
       0  the large cumulus: one broad dome left of centre, a knuckle and a second, lower dome trailing right
       1  a fair-weather cumulus: a long low lobe on the left, the dome right of centre
       2  a smaller humped fair-weather cumulus: the dome left of centre, three steps down to the right
       3  a high streak                         4  the streak that lies across the foot of the sun
       5, 6  scraps: two small low clouds
     A cumulus is a row of lobes (ellipses; the big ones wider than tall, no two neighbours alike, the
     largest at the shoulder and the smallest at the ends) standing on a flat base that cuts through the end
     lobes. Its outline is the upper edge of the lobes taken together, so no lobe has an edge of its own.
     The whole silhouette is filled with the shade colour and ONE white shape lies on it: it shares the upper
     outline exactly and ends below in a line of three or four broad low swells. So the shade is a single
     flat area along the base, the cloud's own shaded lower forms, deep on the left (away from the sun) and
     thinning to nothing at the right end. Two paths per cloud, no crescents.
     The underside is the cloud's own base: level, with one shallow belly under the dome.
     A streak is the same construction pressed flat: a long low bank of shallow lobes on a level base, one
     pale colour and no shade (3 has a thin wisp lying above it; 4 is plain, so nothing scratches the sun).
     Species are written in thousandths of the cloud's width; local space x 0..w, the underside at y = 0. */
  DAY.cloudLit3 = "#ffffff"; DAY.cloudShade3 = "#d1e4f6";       // near plane: white, and one cool shade close to white
  DAY.cloudFar = "#f3f8fd"; DAY.cloudFarShade = "#d4e6f6";      // far plane: the white a step toward the sky
  var CLOUDS = [
    // lobes [cx, cy, rx, ry], left to right. base [y where it cuts the first lobe, y where it cuts the last,
    // the underside drawn from right to left]. lit [lobe, angle, lobe, angle]: where the shade line leaves the
    // outline on the left and on the right (degrees on that lobe: 0 its right, -90 its top, -180 its left;
    // null = at the notch where the lobe begins). term: the shade line from right to left, as arcs that swell upward.
    { lobes: [[70, -52, 62, 58], [200, -130, 115, 105], [400, -175, 215, 185], [650, -190, 80, 76], [745, -120, 160, 128], [925, -55, 68, 58]],
      base: [-10, -10, "H720C680 -10 660 0 620 0H260C220 0 200 -10 160 -10"], lit: [1, null, 5, 30],
      term: "A72 20 0 0 0 855 -28A125 55 0 0 0 630 -55A175 82 0 0 0 320 -78A135 75 0 0 0" },
    { lobes: [[72, -46, 60, 52], [250, -92, 172, 98], [440, -150, 72, 68], [645, -150, 215, 180], [890, -85, 88, 80], [950, -38, 46, 40]],
      base: [-10, -10, "H910C870 -10 860 0 820 0H480C440 0 420 -10 380 -10"], lit: [1, null, 5, 20],
      term: "A165 37 0 0 0 705 -38A205 73 0 0 0 340 -58A150 58 0 0 0" },
    { lobes: [[110, -80, 98, 100], [330, -160, 200, 185], [600, -120, 140, 110], [800, -72, 105, 76], [935, -38, 55, 42]],
      base: [-10, -10, "H600C560 -10 550 0 510 0H190C150 0 140 -10 100 -10"], lit: [0, -160, 4, 25],
      term: "A215 39 0 0 0 615 -45A185 69 0 0 0 290 -72A160 74 0 0 0" },
    { lobes: [[80, -12, 80, 14], [250, -22, 140, 30], [440, -28, 150, 40], [660, -20, 150, 28], [850, -14, 120, 18], [960, -8, 40, 10]],
      base: [0, 0, ""], more: "M690 -84A120 7 0 1 1 930 -84A120 7 0 1 1 690 -84Z", top: -91 },
    { lobes: [[70, -8, 70, 10], [260, -12, 150, 18], [520, -18, 170, 30], [740, -14, 120, 22], [900, -9, 100, 12]],
      base: [0, 0, ""] },
    { lobes: [[140, -70, 120, 85], [430, -170, 200, 170], [730, -105, 190, 120], [905, -50, 85, 62]],
      base: [0, 0, ""], lit: [0, -180, 3, 20], term: "A270 35 0 0 0 520 -48A290 53 0 0 0" },
    { lobes: [[160, -80, 140, 92], [500, -162, 230, 172], [820, -70, 160, 85]],
      base: [0, 0, ""], lit: [0, -175, 2, 20], term: "A220 33 0 0 0 590 -55A330 53 0 0 0" }
  ];
  function skyR(v) { return Math.round(v * 10) / 10; }
  // a path written in thousandths of the width, at width w (an arc's flags and rotation are not lengths)
  function skyScale(d, s) {
    return d.replace(/([MLHVCQAZ])([^MLHVCQAZ]*)/g, function (m, c, rest) {
      var n = rest.split(/[\s,]+/).filter(function (x) { return x !== ""; });
      return c + n.map(function (v, i) { return c === "A" && i % 7 > 1 && i % 7 < 5 ? v : skyR(v * s); }).join(" ");
    });
  }
  // a cumulus species as two paths in thousandths: the whole silhouette, and the lit shape that lies on it.
  // Where the two share the outline they are made of the very same arcs, so the edges agree at any size.
  var _cloudForm = [];
  function cloudForm(kind) {
    if (_cloudForm[kind]) return _cloudForm[kind];
    var k = CLOUDS[kind], L = k.lobes, n = L.length, from = [], to = [], i, j, a, lo, hi, mid, RAD = Math.PI / 180;
    function at(l, t) { return [l[0] + l[2] * Math.cos(t), l[1] + l[3] * Math.sin(t)]; }
    function ang(l, p) { var t = Math.atan2((p[1] - l[1]) / l[3], (p[0] - l[0]) / l[2]); return t > Math.PI / 2 ? t - 2 * Math.PI : t; }
    function inside(l, p) { var u = (p[0] - l[0]) / l[2], v = (p[1] - l[1]) / l[3]; return u * u + v * v < 1; }
    function P(p) { return (Math.round(p[0] * 100) / 100) + " " + (Math.round(p[1] * 100) / 100); }
    function arc(l, t0, t1) { return "A" + l[2] + " " + l[3] + " 0 " + (t1 - t0 > Math.PI ? 1 : 0) + " 1 " + P(at(l, t1)); }
    function cut(l, y, side) { var v = (y - l[1]) / l[3]; return ang(l, [l[0] + side * l[2] * Math.sqrt(Math.max(0, 1 - v * v)), y]); }
    from[0] = cut(L[0], k.base[0], -1);                        // the base cuts the first lobe
    for (i = 0; i < n - 1; i++) {                              // a lobe's outline runs clockwise until it meets the next lobe
      a = from[i] + RAD;
      while (inside(L[i + 1], at(L[i], a)) && a < Math.PI / 2) a += RAD;
      while (!inside(L[i + 1], at(L[i], a)) && a < Math.PI / 2) a += RAD;
      lo = a - RAD; hi = a;
      for (j = 0; j < 24; j++) { mid = (lo + hi) / 2; if (inside(L[i + 1], at(L[i], mid))) hi = mid; else lo = mid; }
      to[i] = lo; from[i + 1] = ang(L[i + 1], at(L[i], lo));
    }
    to[n - 1] = cut(L[n - 1], k.base[1], 1);                   // and the base cuts the last one
    var lt = k.lit || [0, null, n - 1, 0], iL = lt[0], aL = lt[1] == null ? from[iL] : lt[1] * RAD, iR = lt[2], aR = lt[3] * RAD;
    var sil = "M" + P(at(L[0], from[0])), lit = "M" + P(at(L[iL], aL)), x0 = 1e9, x1 = -1e9, y0 = 1e9;
    for (i = 0; i < n; i++) {
      var ts = [from[i]];
      if (i === iL && aL > from[i] + 1e-6) ts.push(aL);
      if (i === iR) ts.push(aR);
      ts.push(to[i]);
      for (j = 0; j < ts.length - 1; j++) {
        // (a long arc is drawn in pieces of 100 degrees at most: rounded to a tenth of a pixel, a near half-ellipse would wander)
        var m = Math.ceil((ts[j + 1] - ts[j]) / (100 * RAD)) || 1, seg = "";
        for (a = 1; a <= m; a++) seg += arc(L[i], ts[j] + (ts[j + 1] - ts[j]) * (a - 1) / m, ts[j] + (ts[j + 1] - ts[j]) * a / m);
        sil += seg;
        if ((i > iL || (i === iL && ts[j] > aL - 1e-6)) && (i < iR || (i === iR && ts[j + 1] < aR + 1e-6))) lit += seg;
      }
      x0 = Math.min(x0, L[i][0] - L[i][2]); x1 = Math.max(x1, L[i][0] + L[i][2]); y0 = Math.min(y0, L[i][1] - L[i][3]);
    }
    return _cloudForm[kind] = { sil: sil + k.base[2] + "Z" + (k.more || ""), lit: k.lit ? lit + k.term + " " + P(at(L[iL], aL)) + "Z" : "", box: [x0, Math.min(y0, k.top || 0), x1, 0] };
  }
  var _cloud3Memo = {};
  function CloudShape(kind, w, far) {
    var key = kind + "|" + w + "|" + (far ? 1 : 0);
    if (_cloud3Memo[key]) return _cloud3Memo[key];
    var s = w / 1000, lit = far ? DAY.cloudFar : DAY.cloudLit3, shade = far ? DAY.cloudFarShade : DAY.cloudShade3, f = cloudForm(kind), b = f.box;
    var kids = f.lit ? [h("path", { d: skyScale(f.sil, s), fill: shade }), h("path", { d: skyScale(f.lit, s), fill: lit })] :
      [h("path", { d: skyScale(f.sil, s), fill: lit, fillOpacity: 0.86 })];
    // the box: the drawing with a pixel to spare at the sides and on top; its bottom is the cloud's underside
    return _cloud3Memo[key] = h("g", { "data-cache": "cloud3-" + key, "data-box": skyR(b[0] * s - 1) + " " + skyR(b[1] * s - 1) + " " + skyR((b[2] - b[0]) * s + 2) + " " + skyR((b[3] - b[1]) * s + 1.5) }, kids);
  }
//== REPLACE from "  /* Each scene's sky, composed." to "  // each list knows its own name"
  /* Each scene's sky, composed (round 4: for the long low clouds). The owner's rule (2026-11-14): clouds
     stay in the sky. Every cloud's underside clears the roofs standing under it for as long as the scene
     rests on it, and nothing sits down behind the skyline; `node tools/cloud-check.mjs <side>` measures it.
     No cumulus covers the sun while a scene holds. The lists keep their layout (one cloud per entry,
     numbers only): tools/cloud-lift.py rewrites the undersides.
     How each sky is built: a few clouds, each a different species. The two big ones sit in the band above
     the site's headline (stage y 75 to 280), the larger one high on the left and the next one lower to its
     right; a far streak lies across the sun; in scenes 03 and 05 a far bank passes behind Mt Fuji's
     shoulders and a cumulus stands low between Fuji and the city. One scrap at most.
     SKY_WORLD serves scenes 01 and 02: after the pan the near plane stands about 690 px further left and
     the far plane about 190, so whatever is near the middle of scene 02's sky sits on the sun in scene 01
     (that is why scene 02's middle is left to the birds), and the streak across the sun must clear the
     tower that stands under it in scene 02 (roof at y 121). */
  var SKY_WORLD = {
    far: [[1690, 106, 580, 4]],
    near: [[100, 250, 480, 0], [640, 280, 380, 1], [1450, 200, 100, 5]]
  };
  var SKY_TRANSIT = {
    far: [[130, 262, 600, 3], [1660, 128, 560, 4]],
    near: [[845, 372, 500, 0], [-40, 268, 420, 1], [1380, 196, 240, 2]]
  };
  var SKY_FINALE = {
    far: [[40, 392, 700, 3], [1470, 172, 560, 4]],
    near: [[110, 245, 480, 0], [820, 425, 500, 1], [1570, 268, 96, 6]],
    landFar: [],
    landNear: []
  };
