//== INSERT before "  function SkySun(p) {"
  /* ---- round 2 sky: the sun, its shafts of light, built clouds ---- */
  DAY.cloudLit = "#ffffff"; DAY.cloudShadeFlat = "#cfdff3";   // a cloud is two flat colours: lit, and one shade
  DAY.sunCore = "#ffe27a";
  DAY.hillNear = "#cfdfee";
  // mix two #rrggbb colours (t = 0 gives a, 1 gives b); every derived tone in round 2 comes from this, so
  // shades stay in their colour family instead of being greyed by a translucent black
  function mix(a, b, t) {
    var out = "#";
    for (var i = 1; i < 7; i += 2) {
      var x = parseInt(a.substr(i, 2), 16), y = parseInt(b.substr(i, 2), 16), v = Math.round(x + (y - x) * t);
      out += (v < 16 ? "0" : "") + v.toString(16);
    }
    return out;
  }
  /* Three broad shafts of light fanning from a point beyond the sun's corner of the frame. Plain white,
     hard edges, behind the clouds and every building. They breathe and sway very slowly. */
  function LightShafts(p) {
    var ox = p.ox, oy = p.oy, time = p.time, far = 1500;
    var sway = Math.sin(time * 0.11) * 0.006;
    return h("g", null, [[2.131, 2.282, 0.1, 0], [2.394, 2.556, 0.08, 1.9], [2.657, 2.76, 0.065, 3.7]].map(function (s) {
      var a0 = s[0] + sway, a1 = s[1] + sway * 1.4, o = s[2] * (0.86 + 0.14 * Math.sin(time * 0.17 + s[3]));
      return h("polygon", { points: ox + "," + oy + " " + (ox + Math.cos(a0) * far * 2).toFixed(1) + "," + (oy + Math.sin(a0) * far * 2).toFixed(1) + " " + (ox + Math.cos(a1) * far * 2).toFixed(1) + "," + (oy + Math.sin(a1) * far * 2).toFixed(1), fill: "#ffffff", opacity: o.toFixed(3) });
    }));
  }

//== REPLACE from "  function SkySun(p) {" to "  function RoofBeacon(p) {"
  function SkySun(p) {
    var cx = p.cx, cy = p.cy, r = p.r, time = p.time;
    var pulse = 0.5 + 0.5 * Math.sin(time * 0.55);
    return h("g", null,
      h("circle", { cx: cx, cy: cy, r: r * 4.6 + pulse * r * 0.15, fill: "url(#" + p.gid + ")" }),
      h("circle", { cx: cx, cy: cy, r: r * 1.16 + pulse * r * 0.03, fill: "rgba(255,236,170,0.34)" }),
      h("circle", { cx: cx, cy: cy, r: r * 0.8, fill: DAY.sun }),
      h("circle", { cx: cx, cy: cy, r: r * 0.52, fill: DAY.sunCore })
    );
  }

//== REPLACE from "  /* puffy flat-bottom day cloud" to "  /* small day-sky birds"
  /* A built cumulus (round 2). A cloud is a list of round lobes standing on a flat base, drawn back to
     front. Every lobe is two discs: its shade, then the same disc in white moved up and to the right,
     toward the sun, so each lobe keeps a crisp crescent of shade on the side away from it; where a
     front lobe overlaps a back one, that crescent is what separates them. The base is treated the same
     way, which gives the flat underside its shade. Two flat colours, no gradient.
     Local space: x 0..w, the underside at y = 0, the cloud above it. `kind` picks one of the four builds
     (default: by width, so the scenes that only pass a width still get different clouds). */
  var CLOUD_KINDS = [
    // base [x0, x1, height], then lobes [cx, cy, r] in units of w, back to front
    { base: [0, 1, 0.125], lobes: [[0.5, -0.222, 0.19], [0.3, -0.158, 0.142], [0.71, -0.148, 0.132], [0.135, -0.094, 0.082], [0.87, -0.084, 0.072], [0.43, -0.112, 0.098]] },
    { base: [0, 1, 0.1], lobes: [[0.34, -0.142, 0.128], [0.57, -0.118, 0.104], [0.185, -0.082, 0.07], [0.75, -0.086, 0.074], [0.895, -0.058, 0.046]] },
    { base: [0.06, 0.94, 0.13], lobes: [[0.57, -0.335, 0.165], [0.4, -0.232, 0.16], [0.7, -0.2, 0.15], [0.24, -0.128, 0.112], [0.83, -0.108, 0.094], [0.53, -0.124, 0.108]] },
    { base: [0.08, 0.92, 0.115], lobes: [[0.43, -0.168, 0.152], [0.65, -0.124, 0.11], [0.25, -0.094, 0.08]] }
  ];
  var _cloudMemo = {};
  function CloudShape(kind, w) {
    var key = kind + "|" + w;
    if (_cloudMemo[key]) return _cloudMemo[key];
    var k = CLOUD_KINDS[kind], d = w * 0.024, r1 = function (v) { return Math.round(v * 10) / 10; };
    var bx = k.base[0] * w, bw = (k.base[1] - k.base[0]) * w, bh = k.base[2] * w, kids = [];
    kids.push(h("rect", { x: r1(bx - d * 0.6), y: r1(-bh), width: r1(bw), height: r1(bh), rx: r1(bh / 2), fill: DAY.cloudShadeFlat }));
    kids.push(h("rect", { x: r1(bx), y: r1(-bh - d), width: r1(bw), height: r1(bh), rx: r1(bh / 2), fill: DAY.cloudLit }));
    k.lobes.forEach(function (l) {
      var cx = l[0] * w, cy = l[1] * w - d, r = l[2] * w;
      kids.push(h("circle", { cx: r1(cx - d * 0.62), cy: r1(cy + d * 0.78), r: r1(r), fill: DAY.cloudShadeFlat }));
      kids.push(h("circle", { cx: r1(cx), cy: r1(cy), r: r1(r), fill: DAY.cloudLit }));
    });
    return _cloudMemo[key] = h("g", { "data-cache": "cloud-" + key, "data-box": r1(-d) + " " + r1(-w * 0.56) + " " + r1(w + d * 2) + " " + r1(w * 0.58) }, kids);
  }
  function Cloud(p) {
    var w = p.w == null ? 240 : p.w, o = p.o == null ? 0.94 : p.o, edge = p.edge == null ? 1 : p.edge;
    var kind = p.kind == null ? Math.round(w / 7) % CLOUD_KINDS.length : p.kind;
    // callers anchor a cloud a little above its underside (as the first drawing did)
    return h("g", { opacity: (o * DAY.cloudO * clamp01(edge)).toFixed(3) },
      h("g", { transform: "translate(0, " + (p.kind == null ? Math.round(w * 0.1) : 0) + ")" }, CloudShape(kind, Math.round(w))));
  }

