//== REPLACE from "sky: \"linear-gradient(to bottom, #58abe0 0%, #8fc9ec 38%" to "haze: \"232,243,251\""
    // one sky for every scene (round 3): deeper overhead, paling through the middle. The pale air low on the
    // horizon is drawn as flat bands by SkyAir(), so the horizon never changes value at a scene change.
    sky: "linear-gradient(to bottom, #3f95d9 0%, #57a9e1 9%, #72b9e6 17%, #92cbed 36%, #a6d5f1 46%, #b3dcf4 100%)",
    sun: "#ffd24d", sunGlow: "255,248,226",
//== REPLACE from "// the sun's glow as a true radial gradient" to "// vertical haze rising from a ground line"
  // the sun's bloom as a true radial gradient: strong at the disc, bleeding a long way into the sky; ids are
  // per scene (stages coexist in a dissolve)
  function GlowDef(id, rgb, a) {
    return h("radialGradient", { id: id },
      h("stop", { offset: "0", stopColor: "rgba(" + rgb + "," + (a * 1.5).toFixed(3) + ")" }),
      h("stop", { offset: "0.14", stopColor: "rgba(" + rgb + "," + (a * 1.1).toFixed(3) + ")" }),
      h("stop", { offset: "0.34", stopColor: "rgba(" + rgb + "," + (a * 0.5).toFixed(3) + ")" }),
      h("stop", { offset: "0.62", stopColor: "rgba(" + rgb + "," + (a * 0.16).toFixed(3) + ")" }),
      h("stop", { offset: "1", stopColor: "rgba(" + rgb + ",0)" }));
  }
//== REPLACE from "/* Three broad shafts of light fanning from a point beyond" to "function RoofBeacon(p) {"
  /* ---- round 3 sky set: one sun, one fan of shafts, one cloud field, one flock and one mountain range,
     used by every scene ---- */
  DAY.shaft = "#ffffff"; DAY.sunHalo = "#ffedb2";
  var SUN_R = 42;                         // the sun's disc: the same size and finish in every scene
  /* Four shafts of light that fan from the sun itself (the sun is drawn over the point where they meet):
     clearly unequal widths, uneven gaps, steep to shallow. [start angle, width (radians), strength, phase].
     Plain white, hard edges, behind the clouds and every building. They sway and breathe very slowly;
     `k` (0..1) scales that motion (the map scene holds its sky still). */
  var SHAFTS = [[1.84, 0.12, 0.115, 0], [2.15, 0.27, 0.098, 1.9], [2.49, 0.13, 0.09, 3.7], [2.79, 0.2, 0.084, 5.2]];
  function LightShafts(p) {
    var ox = p.cx, oy = p.cy, time = p.time, k = p.k == null ? 1 : p.k, far = 2600;
    var sway = (Math.sin(time * 0.29) * 0.012 + Math.sin(time * 0.13 + 1.1) * 0.008) * k;
    return h("g", null, SHAFTS.map(function (s, i) {
      var a0 = s[0] + sway * (1 + i * 0.22), a1 = a0 + s[1] * (1 + 0.07 * k * Math.sin(time * 0.23 + s[3]));
      var o = s[2] * (1 - 0.16 * k * (0.5 + 0.5 * Math.sin(time * 0.41 + s[3] * 1.7)));
      return h("polygon", { points: ox + "," + oy + " " + (ox + Math.cos(a0) * far).toFixed(1) + "," + (oy + Math.sin(a0) * far).toFixed(1) + " " + (ox + Math.cos(a1) * far).toFixed(1) + "," + (oy + Math.sin(a1) * far).toFixed(1), fill: DAY.shaft, opacity: o.toFixed(3) });
    }));
  }
  /* The sun: a bloom that bleeds into the sky, one flat halo, the disc and a lighter core. */
  function SkySun(p) {
    var cx = p.cx, cy = p.cy, r = SUN_R, pulse = Math.sin(p.time * 0.5);
    return h("g", null,
      h("circle", { cx: cx, cy: cy, r: (r * 7.4 + pulse * 7).toFixed(1), fill: "url(#" + p.gid + ")" }),
      h("circle", { cx: cx, cy: cy, r: (r * 1.34 + pulse * 1.2).toFixed(1), fill: DAY.sunHalo, opacity: 0.78 }),
      h("circle", { cx: cx, cy: cy, r: r, fill: DAY.sun }),
      h("circle", { cx: cx, cy: cy, r: r * 0.7, fill: DAY.sunCore })
    );
  }
//== REPLACE from "/* A built cumulus (round 2). A cloud is a list of round lobes" to "/* Mt. Fuji, redrawn for round 2"
  /* The air low on the horizon: three broad flat bands, each paler than the one above it, with long slow
     edges. The same shapes at the same height in every scene. */
  DAY.skyAir = ["#b4dcf4", "#c1e3f6", "#cfeaf9"];
  var _skyAir = null;
  function SkyAir() {
    if (_skyAir) return _skyAir;
    return _skyAir = h("g", { "data-cache": "sky-air", "data-box": "0 480 1920 600" },
      h("path", { d: "M-10,514C420,492 900,522 1300,506S1750,498 1930,510V1090H-10Z", fill: DAY.skyAir[0] }),
      h("path", { d: "M-10,630C380,642 760,614 1180,630S1700,642 1930,624V1090H-10Z", fill: DAY.skyAir[1] }),
      h("path", { d: "M-10,744C500,730 980,754 1400,740S1800,732 1930,746V1090H-10Z", fill: DAY.skyAir[2] }));
  }

  /* Clouds (round 3). Four species, seven builds:
       0  a towering cumulus, taller than it is wide
       1  the broad flat-based fair-weather cumulus      2  a smaller humped one
       3  a long thin high streak (cirrus)               4  the streak that lies across the sun
       5, 6  scraps
     A lobed cloud is built in tiers from the bottom up. Every lobe is a disc; its shade is the same disc moved
     down and to the left, away from the sun, by an amount that grows with the lobe (and with its own factor),
     so no two crescents are alike. A tier's shade is drawn first and its white on top, so a crescent only
     shows where a puff really turns away from the light: on the cloud's left flank, and where a higher puff
     hangs over the one below it. The cloud stands on a flat slab in shade, its underside. Two flat colours.
     Streaks are tapered flat shapes with no lobes and no shade. Local space: x 0..w, the underside at y = 0. */
  DAY.cloudLit3 = "#ffffff"; DAY.cloudShade3 = "#b9caef";       // near plane: white and the one flat periwinkle
  DAY.cloudFar = "#f1f7fd"; DAY.cloudFarShade = "#c6d6f2";      // far plane: both a step toward the sky
  var CLOUDS = [
    { ht: 1.2, base: [0.02, 0.98, 0.075], tiers: [
      [[0.12, -0.13, 0.1, 1.4], [0.26, -0.17, 0.14], [0.44, -0.18, 0.15], [0.62, -0.18, 0.15], [0.78, -0.15, 0.125, 0.6], [0.9, -0.105, 0.08, 0.6]],
      [[0.2, -0.33, 0.165, 1.3]],
      [[0.5, -0.36, 0.215]],
      [[0.8, -0.31, 0.15, 0.9], [0.9, -0.4, 0.075, 0.8]],
      [[0.1, -0.46, 0.075, 1.4], [0.27, -0.58, 0.17, 1.3]],
      [[0.58, -0.62, 0.205, 1.1]],
      [[0.22, -0.8, 0.085, 1.4], [0.37, -0.85, 0.17, 1.2], [0.45, -0.98, 0.145]],
      [[0.73, -0.74, 0.095, 0.9], [0.58, -0.88, 0.135]]
    ] },
    { ht: 0.6, base: [0.03, 0.97, 0.08], tiers: [
      [[0.115, -0.115, 0.085, 1.4], [0.22, -0.15, 0.115, 1.2], [0.36, -0.165, 0.13], [0.52, -0.175, 0.14], [0.67, -0.155, 0.125, 0.7], [0.79, -0.125, 0.095, 0.6], [0.895, -0.09, 0.062, 0.6]],
      [[0.27, -0.25, 0.125, 1.3]],
      [[0.47, -0.335, 0.195, 1.1], [0.555, -0.47, 0.085], [0.385, -0.435, 0.1]],
      [[0.68, -0.26, 0.135, 0.9]]
    ] },
    { ht: 0.68, base: [0.04, 0.96, 0.09], tiers: [
      [[0.14, -0.13, 0.1, 1.4], [0.28, -0.17, 0.135, 1.1], [0.45, -0.185, 0.15], [0.62, -0.17, 0.14, 0.7], [0.77, -0.135, 0.11, 0.6], [0.885, -0.095, 0.068, 0.6]],
      [[0.33, -0.31, 0.135, 1.3]],
      [[0.54, -0.39, 0.185, 1.1], [0.43, -0.5, 0.1]],
      [[0.73, -0.28, 0.115, 0.9]]
    ] },
    { ht: 0.08, streaks: [[0, 0, 1, 0.026, -0.008], [0.1, -0.024, 0.5, 0.02, 0.006], [0.46, 0.02, 0.5, 0.018, 0.004]] },
    { ht: 0.08, streaks: [[0, 0, 1, 0.03, 0], [0.28, 0.03, 0.62, 0.02, -0.006], [0.08, -0.026, 0.4, 0.016, 0.004]] },
    { ht: 0.56, base: [0.05, 0.95, 0.14], tiers: [
      [[0.2, -0.17, 0.14, 1.3], [0.42, -0.2, 0.17], [0.63, -0.19, 0.16, 0.7], [0.82, -0.15, 0.115, 0.6]],
      [[0.5, -0.34, 0.16, 1.2]]
    ] },
    { ht: 0.56, base: [0.08, 0.92, 0.16], tiers: [
      [[0.25, -0.19, 0.16, 1.3], [0.5, -0.21, 0.18], [0.73, -0.17, 0.14, 0.6]],
      [[0.42, -0.36, 0.14, 1.2]]
    ] }
  ];
  function skyR(v) { return Math.round(v * 10) / 10; }
  function skyDisc(cx, cy, r) {
    r = skyR(r);
    return "M" + skyR(cx - r) + "," + skyR(cy) + "a" + r + "," + r + " 0 1,1 " + skyR(r * 2) + ",0a" + r + "," + r + " 0 1,1 " + skyR(-r * 2) + ",0z";
  }
  var _cloud3Memo = {};
  function CloudShape(kind, w, far) {
    var key = kind + "|" + w + "|" + (far ? 1 : 0);
    if (_cloud3Memo[key]) return _cloud3Memo[key];
    var k = CLOUDS[kind], lit = far ? DAY.cloudFar : DAY.cloudLit3, shade = far ? DAY.cloudFarShade : DAY.cloudShade3, kids = [];
    if (k.streaks) {
      var ds = "";
      k.streaks.forEach(function (s) {
        var x = s[0] * w, y = s[1] * w, L = s[2] * w, t = s[3] * w, dy = s[4] * w;
        ds += "M" + skyR(x) + "," + skyR(y) + "C" + skyR(x + L * 0.22) + "," + skyR(y - t) + " " + skyR(x + L * 0.62) + "," + skyR(y - t * 1.15) + " " + skyR(x + L) + "," + skyR(y + dy) +
          "C" + skyR(x + L * 0.7) + "," + skyR(y + dy + t * 0.3) + " " + skyR(x + L * 0.3) + "," + skyR(y + t * 0.5) + " " + skyR(x) + "," + skyR(y) + "Z";
      });
      kids.push(h("path", { d: ds, fill: lit, fillOpacity: 0.82 }));
    } else {
      k.tiers.forEach(function (tier, ti) {
        var sh = "", li = "";
        if (ti === 0) {                     // the flat underside the cloud stands on, and the white that closes the gaps between the lowest puffs
          var x0 = k.base[0] * w, x1 = k.base[1] * w, bh = k.base[2] * w, br = skyR(bh / 2), fr = skyR(bh * 0.45);
          sh += "M" + skyR(x0 + bh / 2) + "," + skyR(-bh) + "H" + skyR(x1 - bh / 2) + "a" + br + "," + br + " 0 0,1 0," + skyR(bh) + "H" + skyR(x0 + bh / 2) + "a" + br + "," + br + " 0 0,1 0," + skyR(-bh) + "z";
          li += "M" + skyR(x0 + bh * 1.1) + "," + skyR(-bh * 1.5) + "H" + skyR(x1 - bh * 1.1) + "a" + fr + "," + fr + " 0 0,1 0," + skyR(bh * 0.9) + "H" + skyR(x0 + bh * 1.1) + "a" + fr + "," + fr + " 0 0,1 0," + skyR(-bh * 0.9) + "z";
        }
        tier.forEach(function (l) {
          var cx = l[0] * w, cy = l[1] * w, r = l[2] * w, off = r * 0.23 * (l[3] == null ? 1 : l[3]);
          sh += skyDisc(cx - off * 0.66, cy + Math.min(off * 0.75, Math.max(0, -(cy + r))), r);
          li += skyDisc(cx, cy, r);
        });
        kids.push(h("path", { d: sh, fill: shade }), h("path", { d: li, fill: lit }));
      });
    }
    return _cloud3Memo[key] = h("g", { "data-cache": "cloud3-" + key, "data-box": skyR(-w * 0.08) + " " + skyR(-(k.ht + 0.06) * w) + " " + skyR(w * 1.16) + " " + skyR((k.ht + 0.12) * w) }, kids);
  }
  /* The cloud field: the same maths in every scene. A list is [x at time 0, underside y, width, species];
     plane 0 is the far one, 1 the near one. The wind blows right to left at one speed per plane; `shift` is
     extra travel on top of it (the expressway's scroll times a small parallax). A cloud wraps, and fades,
     only at the ends of the field, which lie outside every camera position. */
  var SKY_WIND = [3.2, 7], SKY_SPAN = 3600, SKY_X0 = -700;
  function CloudField(list, plane, time, shift) {
    return h("g", null, list.map(function (c) {
      var wx = ((((c[0] - SKY_X0 - time * SKY_WIND[plane] - shift) % SKY_SPAN) + SKY_SPAN) % SKY_SPAN) + SKY_X0;
      var ed = clamp01(Math.min((wx - SKY_X0) / 60, (SKY_X0 + SKY_SPAN - wx) / 60));
      return h("g", { transform: "translate(" + wx.toFixed(2) + ", " + c[1] + ")", opacity: ed.toFixed(3) }, CloudShape(c[3], c[2], plane === 0));
    }));
  }
  /* Each scene's sky, composed: a tower of cumulus standing behind the skyline, one or two fair-weather
     clouds, a high streak passing behind them (and behind Mt Fuji), a thin streak lying across the foot of
     the sun, a scrap or two. No cumulus covers the sun while a scene holds. */
  var SKY_WORLD = {
    far: [[706, 250, 620, 3], [1560, 128, 560, 4], [1336, 505, 200, 2], [1754, 520, 250, 1], [66, 420, 96, 6]],
    near: [[950, 590, 340, 0], [135, 262, 450, 1], [625, 300, 92, 5], [1989, 388, 420, 1], [1879, 300, 84, 6]]
  };
  var SKY_TRANSIT = {
    far: [[85, 212, 700, 3], [1585, 112, 560, 4], [1585, 432, 210, 2]],
    near: [[1128, 575, 320, 0], [-26, 318, 420, 1], [1464, 190, 290, 2], [664, 120, 88, 5]]
  };
  var SKY_FINALE = {
    far: [[78, 372, 680, 3], [1478, 160, 560, 4]],
    near: [[154, 236, 430, 1], [1610, 418, 280, 2], [1894, 300, 88, 6], [644, 250, 92, 5]],
    landFar: [[1728, 560, 220, 2]], landNear: [[974, 640, 340, 0]]     // these two rise with the land
  };

  /* Birds (round 3): small filled silhouettes, a body and two wings, nothing thinner than 3 px. One loose
     group that flaps three beats and then glides, every bird on its own phase, and one kite that soars in
     slow circles and rarely flaps. They tilt as they rise, fall and turn. All of them are one path. They
     are the only dark things in the sky, so each scene keeps them to the right of the headline or above it. */
  DAY.bird = "#34496b";
  // wing swing through one flap-then-glide cycle (u in cycles): three beats that swell and die away, then held
  function birdWing(u, lag) {
    var c = u - Math.floor(u), F = 0.56;
    if (c >= F) return 0;
    var e = Math.sin(Math.PI * c / F);
    return e * e * Math.sin(c / F * Math.PI * 6 - lag);
  }
  // one bird at (x, y): a1 = how far the arm is raised, a2 = the hand beyond the wrist, tilt = bank
  function birdD(x, y, s, a1, a2, tilt) {
    var co = Math.cos(tilt) * s, si = Math.sin(tilt) * s;
    function P(px, py) { return skyR(x + px * co - py * si) + "," + skyR(y + px * si + py * co); }
    var wx = 1.6 + 9 * Math.cos(a1), wy = -0.6 - 9 * Math.sin(a1), tx = wx + 11 * Math.cos(a2), ty = wy - 11 * Math.sin(a2);
    return "M" + P(1.3, -2.7) + "Q" + P(wx, wy - 3.3) + " " + P(tx, ty) + "Q" + P(wx - 0.8, wy + 3) + " " + P(1.3, 2.4) + "Z" +
      "M" + P(-1.3, 2.4) + "Q" + P(0.8 - wx, wy + 3) + " " + P(-tx, ty) + "Q" + P(-wx, wy - 3.3) + " " + P(-1.3, -2.7) + "Z" +
      "M" + P(0, -5.4) + "Q" + P(3.6, -1.6) + " " + P(2, 2.8) + "L" + P(2.6, 7) + "L" + P(0, 5.6) + "L" + P(-2.6, 7) + "L" + P(-2, 2.8) + "Q" + P(-3.6, -1.6) + " " + P(0, -5.4) + "Z";
  }
  var BIRD_FORM = [[0, 0], [-48, 24], [40, 32], [-96, -12], [88, -6], [-22, 60]];
  // per scene: the group [x at time 0, y, speed (px a second, + = flying right), birds], the kite [centre x, y, radius x, y, size]
  var BIRD_SETS = {
    w: { group: [1315, 225, 14, 5], kite: [1730, 290, 78, 18, 1.3] },
    t: { group: [1397, 262, -14, 5], kite: [553, 170, 72, 16, 1.3] },
    n: { group: [1156, 205, 14, 5], kite: [1250, 430, 86, 20, 1.3] }
  };
  function DayBirds(p) {
    var set = BIRD_SETS[p.set], g = set.group, kt = set.kite, time = p.time, back = p.back || 0, d = "";
    function wrap(x) { return ((((x - (p.shift || 0) + 500) % 2920) + 2920) % 2920) - 500 + back; }
    var gx = wrap(g[0] + g[2] * time), gy = g[1] + Math.sin(time * 0.27 + 1) * 16;
    for (var i = 0; i < g[3]; i++) {
      var r = random(p.set + "-ba" + i), r2 = random(p.set + "-bb" + i), f = BIRD_FORM[i];
      var u = time / (2.7 + r * 1.3) + r2 * 5, c = u - Math.floor(u);
      d += birdD(gx + f[0] + Math.sin(time * 0.43 + r * 9) * 9,
        gy + f[1] + Math.sin(time * 0.31 + r2 * 9) * 6 + Math.cos(c * 2 * Math.PI) * 2.4,
        0.74 + r * 0.34, 0.26 + 0.78 * birdWing(u, 0), -0.16 + 0.95 * birdWing(u, 0.85),
        Math.cos(time * 0.27 + 1) * 0.2 + Math.cos(time * 0.43 + r * 9) * 0.1);
    }
    var a = time * 0.42 + 0.8, dep = Math.sin(a), ku = time / 7.4 + 0.3;
    d += birdD(wrap(kt[0]) + Math.cos(a) * kt[2], kt[1] + dep * kt[3], kt[4] * (1 + dep * 0.1),
      0.2 + 0.45 * birdWing(ku, 0), -0.14 + 0.55 * birdWing(ku, 0.85), Math.sin(a + 0.5) * 0.4);
    return h("path", { d: d, fill: DAY.bird });
  }

  /* The distant mountain range (round 3; it replaces the two soft hill curves). A jagged far ridge and a
     lower, longer near ridge, pale and cool, each in two flat tones: the sun is top right, so every left
     face is one tone down. Far ridge: [x, height] corners; a summit shades everything from the valley on
     its left to a broken line running down from its top. Near ridge: a smooth line through its points.
     The same range stands low in scenes 03 and 05, where Mt Fuji rises behind it. Static, built once. */
  DAY.rangeFar = "#a9c2e6"; DAY.rangeFarShade = "#93b1dc"; DAY.rangeNear = "#9ab6e0"; DAY.rangeNearShade = "#84a4d4";
  var RANGE_FAR = [
    [-640, 30], [-560, 84], [-490, 140], [-430, 112], [-350, 190], [-290, 160], [-230, 206], [-170, 150],
    [-120, 118], [-40, 96], [30, 150], [78, 132], [150, 214], [205, 188], [262, 236], [330, 168], [392, 122], [450, 146],
    [520, 104], [600, 172], [668, 150], [742, 258], [800, 226], [846, 244], [930, 300], [1004, 232], [1052, 252], [1118, 198],
    [1160, 236], [1210, 276], [1290, 128], [1372, 164], [1440, 118], [1530, 206], [1590, 182], [1660, 270], [1730, 214], [1790, 232], [1880, 150],
    [1950, 110], [2030, 178], [2100, 146], [2190, 226], [2260, 196], [2330, 246], [2420, 160], [2500, 120], [2600, 60]
  ];
  var RANGE_NEAR = [[-660, 60], [-480, 84], [-300, 110], [-140, 70], [20, 112], [190, 78], [380, 128], [560, 92], [700, 60], [900, 104], [1090, 138], [1280, 86], [1470, 66], [1640, 118], [1830, 96], [2010, 132], [2200, 84], [2390, 110], [2620, 64]];
  var _rangeMemo = {};
  function MountainRange(p) {
    var key = p.x + "|" + p.baseY + "|" + p.s;
    if (_rangeMemo[key]) return _rangeMemo[key];
    var s = p.s, by = p.baseY, F = RANGE_FAR, N = RANGE_NEAR, i, j, a, b;
    function X(v) { return skyR(p.x + v * s); }
    function Y(v) { return skyR(by - v * s); }
    var fb = "M" + X(F[0][0]) + "," + by, fs = "";
    for (i = 0; i < F.length; i++) fb += "L" + X(F[i][0]) + "," + Y(F[i][1]);
    fb += "L" + X(F[F.length - 1][0]) + "," + by + "Z";
    for (i = 1; i < F.length - 1; i++) {
      if (!(F[i][1] > F[i - 1][1] && F[i][1] >= F[i + 1][1])) continue;            // a summit
      a = i - 1; while (a > 0 && F[a - 1][1] < F[a][1]) a--;                         // the valley on its left
      b = i + 1; while (b < F.length - 1 && F[b + 1][1] < F[b][1]) b++;              // and on its right
      var px = F[i][0], ph = F[i][1], lx = F[a][0], rw = F[b][0] - px;
      fs += "M" + X(lx + (px - lx) * 0.3) + "," + by + "L" + X(lx) + "," + Y(F[a][1]);
      for (j = a + 1; j <= i; j++) fs += "L" + X(F[j][0]) + "," + Y(F[j][1]);
      fs += "L" + X(px + rw * 0.2) + "," + Y(ph * 0.66) + "L" + X(px + rw * 0.04) + "," + Y(ph * 0.5) + "L" + X(px + rw * 0.34) + "," + by + "Z";
    }
    var P = N.map(function (q) { return [p.x + q[0] * s, by - q[1] * s]; });
    function seg(n) {                       // the smooth line from point n to point n + 1
      var p0 = P[n - 1] || P[n], p1 = P[n], p2 = P[n + 1], p3 = P[n + 2] || p2;
      return "C" + skyR(p1[0] + (p2[0] - p0[0]) / 6) + "," + skyR(p1[1] + (p2[1] - p0[1]) / 6) + " " + skyR(p2[0] - (p3[0] - p1[0]) / 6) + "," + skyR(p2[1] - (p3[1] - p1[1]) / 6) + " " + skyR(p2[0]) + "," + skyR(p2[1]);
    }
    var nb = "M" + skyR(P[0][0]) + "," + by + "L" + skyR(P[0][0]) + "," + skyR(P[0][1]), ns = "";
    for (i = 0; i < P.length - 1; i++) nb += seg(i);
    nb += "L" + skyR(P[P.length - 1][0]) + "," + by + "Z";
    for (i = 1; i < N.length - 1; i++) {
      if (!(N[i][1] > N[i - 1][1] && N[i][1] > N[i + 1][1])) continue;
      a = i - 1; while (a > 0 && N[a - 1][1] < N[a][1]) a--;
      var wl = P[i][0] - P[a][0];
      ns += "M" + skyR(P[a][0] + wl * 0.2) + "," + by + "L" + skyR(P[a][0]) + "," + skyR(P[a][1]);
      for (j = a; j < i; j++) ns += seg(j);
      ns += "Q" + skyR(P[i][0] - wl * 0.02) + "," + skyR((P[i][1] + by) / 2) + " " + skyR(P[i][0] + wl * 0.22) + "," + by + "Z";
    }
    return _rangeMemo[key] = h("g", { "data-cache": "range-" + key, "data-box": X(-670) + " " + Y(310) + " " + skyR(3300 * s) + " " + skyR(312 * s) },
      h("path", { d: fb, fill: DAY.rangeFar }), h("path", { d: fs, fill: DAY.rangeFarShade }),
      h("path", { d: nb, fill: DAY.rangeNear }), h("path", { d: ns, fill: DAY.rangeNearShade }));
  }
  // the range stands in front of whatever is handed in (Mt Fuji), in one group
  function RangeOver(p, behind) { return h("g", null, behind, MountainRange(p)); }

//== REPLACE from "// the sky is composed, not scattered:" to "return h(\"div\", { style: { position: \"absolute\", inset: 0, background: \"#eaf5fc\""
    // the sky is composed once for the whole film: SKY_WORLD, drawn by CloudField (see the round 3 sky set).
    // It runs on its own clock. While scene 02 holds, the player lets ambient time run on (1.878 s); when
    // the trucks then leave, it hands this scene frame / 30 again, which is that much earlier, and the whole
    // sky would jump back. So from the departure on the sky adds that time back (eased in over frames the
    // site only ever plays with its own clock): clouds, birds and shafts carry straight through the seam.
    var skyK = clamp01((frame - 300) / 91), skyTime = tOverride != null ? tOverride : frame / fps + 1.878 * skyK * skyK * (3 - 2 * skyK);
//== REPLACE from "h(\"div\", { style: { position: \"absolute\", inset: 0, background: DAY.sky } })," to "h(\"svg\", { width: 1920"
      h("div", { style: { position: "absolute", inset: 0, background: DAY.sky } }),
//== REPLACE from "// the sun sits clear of Tokyo Tower's antenna while scene 1 holds" to "h(\"g\", { transform: \"translate(\" + (-cam * 0.18) + \", 0)\" }"
        SkyAir(),
        // the shafts fan from the sun; the sun sits clear of Tokyo Tower's antenna while scene 1 holds (tower at screen x ~1624 there)
        LightShafts({ cx: 1772, cy: 104, time: skyTime }),
        SkySun({ cx: 1772, cy: 104, time: skyTime, gid: "wSun" }),
        h("g", { transform: "translate(" + (-cam * 0.08) + ", 0)" }, CloudField(SKY_WORLD.far, 0, skyTime, 0)),
        h("g", { transform: "translate(" + (-cam * 0.12) + ", 0)" }, MountainRange({ x: 194, baseY: GROUND, s: 1.4 })),
//== REPLACE from "cloudsNear.map(function (c) { return cloudAt(c, 4.5); })," to "skylineFar.map("
          CloudField(SKY_WORLD.near, 1, skyTime, 0),
          DayBirds({ set: "w", time: skyTime, shift: cam * 0.1, back: cam * 0.32 }),
//== REPLACE from "h(\"div\", { style: { position: \"absolute\", inset: 0, background: DAY.skyT } })," to "h(\"svg\", { width: 1920"
      h("div", { style: { position: "absolute", inset: 0, background: DAY.sky } }),
//== REPLACE from "SkySun({ cx: 1795, cy: 88, r: 46, time: time, gid: \"tSun\" })," to "FujiMountain({ cx: 440, baseY: 742"
        SkyAir(),
        LightShafts({ cx: 1795, cy: 88, time: time }),
        SkySun({ cx: 1795, cy: 88, time: time, gid: "tSun" }),
        // the same sky as scenes 01 and 02: one wind, with the road's scroll on top of it as a small parallax
        CloudField(SKY_TRANSIT.far, 0, time, scroll * 0.012),
        CloudField(SKY_TRANSIT.near, 1, time, scroll * 0.035),
        RangeOver({ x: -200, baseY: ROAD_Y, s: 0.95 },
//== REPLACE from "DayBirds({ seed: \"t-birds\", count: 3, time: time, span: 2100, yBase: 105 })," to "(function () {"
        DayBirds({ set: "t", time: time, shift: scroll * 0.05 }),
//== REPLACE from "h(\"div\", { style: { position: \"absolute\", inset: 0, background: DAY.skyN } })," to "HazeDef(\"horizHaze\", DAY.hazeK[0])"
      h("div", { style: { position: "absolute", inset: 0, background: DAY.sky } }),
      h("svg", { width: 1920, height: 1080, viewBox: "0 0 1920 1080", xmlns: "http://www.w3.org/2000/svg", style: { position: "absolute", inset: 0 } },
        h("defs", null,
          h("radialGradient", { id: "nHalo" }, h("stop", { offset: "0", stopColor: "rgba(255,255,255,0.22)" }), h("stop", { offset: "0.7", stopColor: "rgba(255,255,255,0.09)" }), h("stop", { offset: "1", stopColor: "rgba(255,255,255,0)" })),
          GlowDef("nSun", DAY.sunGlow, 0.5),
//== REPLACE from "h(\"ellipse\", { cx: 960, cy: 520, rx: 940, ry: 500, fill: \"url(#haloSoft)\" })," to "range(30, function (i) {"
        SkyAir(),
        h("ellipse", { cx: 960, cy: 520, rx: 940, ry: 500, fill: "url(#nHalo)" }),
        // the sky the map floats in is the finale's sky. It holds still while the map is up (the player's
        // clock steps back when scene 05 begins) and starts to move as the land comes in. The sun and its
        // shafts come out once the dissolve from the expressway is over, so two suns are never seen at once.
        h("g", { opacity: clamp01((frame - 24) / 12).toFixed(3) },
          LightShafts({ cx: 1652, cy: 136, time: time, k: recede }),
          SkySun({ cx: 1652, cy: 136, time: time * recede, gid: "nSun" })),
        CloudField(SKY_FINALE.far, 0, time * recede, 0),
        CloudField(SKY_FINALE.near, 1, time * recede, 0),
//== REPLACE from "h(\"g\", { opacity: recede }," to "range(26, function (i) {"
        h("g", { opacity: recede },
//== REPLACE from "h(\"ellipse\", { cx: 960, cy: 1000, rx: 1150, ry: 150, fill: \"url(#haloSoft)\" })," to "FujiMountain({ cx: 380, baseY: 1008"
          h("ellipse", { cx: 960, cy: 1000, rx: 1150, ry: 150, fill: "url(#nHalo)" }),
          CloudField(SKY_FINALE.landFar, 0, time * recede, 0),
          CloudField(SKY_FINALE.landNear, 1, time * recede, 0),
          DayBirds({ set: "n", time: time }),
//== INSERT before "CITY_DEEP.map(function (b, i) {"
          MountainRange({ x: -60, baseY: 1008, s: 0.78 }),
//== REPLACE from "h(\"circle\", { cx: 1652, cy: 136, r: 980, fill: \"url(#sunGlow)\", opacity: 0.13 })," to "Airport(time),"
          h("circle", { cx: 1652, cy: 136, r: 980, fill: "url(#nSun)", opacity: 0.13 }),
