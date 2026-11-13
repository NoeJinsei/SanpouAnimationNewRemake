
/* =====================================================================
 * Sanpou Journey — live web port of reference/sanpou-journey-video/
 *
 * This is a FAITHFUL port, not a re-creation. Every scene/component is a pure
 * function of `frame` (master 0..899, 30fps), exactly as the Remotion source.
 * The Remotion stubs (interpolate / spring / random / Easing) are ported
 * verbatim from reference/.../tests/remotion-stub.mjs — the same stub that
 * rendered previews/*.html, so this port matches those reference frames.
 *
 * JSX is transpiled to h(tag, props, ...children) -> HTML/SVG string; all
 * component logic (math, interpolate calls, .map loops) is copied unchanged.
 * mapData (JRMAP) is loaded as a global from mapdata.js.
 * Nothing under reference/ is modified — it is the source of truth.
 * ===================================================================== */
(function (root) {
  "use strict";

  /* ----------------------------------------------------------------- h() */
  // React style props that are unitless (numbers are NOT suffixed with px).
  var UNITLESS = { opacity: 1, zIndex: 1, fontWeight: 1, lineHeight: 1, flex: 1, flexGrow: 1, flexShrink: 1, order: 1, zoom: 1 };
  // camelCase SVG/HTML attribute -> serialized attribute name (only the ones used).
  var ATTR = {
    strokeWidth: "stroke-width", strokeDasharray: "stroke-dasharray", strokeDashoffset: "stroke-dashoffset",
    strokeLinecap: "stroke-linecap", strokeLinejoin: "stroke-linejoin", strokeOpacity: "stroke-opacity",
    fillOpacity: "fill-opacity", textAnchor: "text-anchor", fontFamily: "font-family", fontSize: "font-size",
    fontWeight: "font-weight", letterSpacing: "letter-spacing", clipPath: "clip-path", stopColor: "stop-color",
    stopOpacity: "stop-opacity", textRendering: "text-rendering", className: "class",
  };
  function esc(v) { return String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;"); }
  function kebab(p) { return p.replace(/[A-Z]/g, function (m) { return "-" + m.toLowerCase(); }); }
  function styleStr(o) {
    var out = "";
    for (var k in o) {
      if (o[k] == null) continue;
      var v = o[k];
      if (typeof v === "number" && !UNITLESS[k]) v = v + "px";
      if (k === "backdropFilter") { out += "-webkit-backdrop-filter:" + v + ";backdrop-filter:" + v + ";"; continue; }
      if (k === "maskImage") { out += "-webkit-mask-image:" + v + ";mask-image:" + v + ";"; continue; }
      out += kebab(k) + ":" + v + ";";
    }
    return out;
  }
  // h(tag, props, ...children) -> markup string. String children are treated as
  // RAW markup (components return markup strings); content text has no &<> chars.
  function h(tag, props) {
    var children = [];
    for (var a = 2; a < arguments.length; a++) flat(arguments[a], children);
    var attrs = {};
    if (props) {
      for (var k in props) {
        if (k === "key" || k === "children" || props[k] == null || props[k] === false) continue;
        if (k === "style") { attrs.style = styleStr(props[k]); continue; }
        attrs[ATTR[k] || k] = String(props[k]);
      }
    }
    return { t: tag, a: attrs, c: children };
  }
  /* --------------------------------------------- in-place stage patching */
  // Each frame the scene functions describe the full picture as virtual nodes;
  // mount() walks them against the live DOM and only touches what changed, so
  // static scenery (buildings, windows, map paths) is never rebuilt.
  var SVGNS = "http://www.w3.org/2000/svg";
  function createNode(v, svg) {
    if (typeof v === "string") return document.createTextNode(v);
    var inSvg = svg || v.t === "svg";
    var el = inSvg ? document.createElementNS(SVGNS, v.t) : document.createElement(v.t);
    for (var k in v.a) el.setAttribute(k, v.a[k]);
    el.__t = v.t; el.__a = v.a;
    for (var i = 0; i < v.c.length; i++) el.appendChild(createNode(v.c[i], inSvg));
    return el;
  }
  function patchChildren(parent, list, svg) {
    var kids = parent.childNodes, i = 0;
    for (; i < list.length; i++) {
      var v = list[i], d = kids[i];
      if (!d) { parent.appendChild(createNode(v, svg)); continue; }
      if (typeof v === "string") {
        if (d.nodeType === 3) { if (d.nodeValue !== v) d.nodeValue = v; }
        else parent.replaceChild(document.createTextNode(v), d);
        continue;
      }
      if (d.nodeType !== 1 || d.__t !== v.t) { parent.replaceChild(createNode(v, svg), d); continue; }
      var oa = d.__a, na = v.a, k;
      for (k in na) if (oa[k] !== na[k]) d.setAttribute(k, na[k]);
      for (k in oa) if (!(k in na)) d.removeAttribute(k);
      d.__a = na;
      patchChildren(d, v.c, svg || v.t === "svg");
    }
    while (kids.length > list.length) parent.removeChild(parent.lastChild);
  }
  function mount(host, tree) {
    var list = [];
    flat(tree, list);
    patchChildren(host, list, false);
  }
  function flat(c, out) {
    if (c == null || c === false || c === true) return;
    if (Array.isArray(c)) { for (var i = 0; i < c.length; i++) flat(c[i], out); return; }
    out.push(typeof c === "number" ? String(c) : c);
  }
  // Array.from({length:n}).map((_,i)=>...) helper.
  function range(n, fn) { var a = []; for (var i = 0; i < n; i++) a.push(fn(i)); return a; }

  /* ------------------------------------------- Remotion stubs (verbatim) */
  // from reference/.../tests/remotion-stub.mjs — the renderer that built the previews.
  function interpolate(input, inputRange, outputRange, opts) {
    opts = opts || {};
    var extrapolateLeft = opts.extrapolateLeft, extrapolateRight = opts.extrapolateRight, easing = opts.easing;
    var x = input;
    if (x <= inputRange[0]) { if (extrapolateLeft === "clamp") x = inputRange[0]; }
    if (x >= inputRange[inputRange.length - 1]) { if (extrapolateRight === "clamp") x = inputRange[inputRange.length - 1]; }
    var i = 0;
    while (i < inputRange.length - 2 && x > inputRange[i + 1]) i++;
    var t = (x - inputRange[i]) / (inputRange[i + 1] - inputRange[i] || 1);
    if (easing && t >= 0 && t <= 1) t = easing(t);
    return outputRange[i] + (outputRange[i + 1] - outputRange[i]) * t;
  }
  function spring(o) {
    var frame = o.frame;
    if (frame < 0) return 0;
    var t = frame / 30;
    return 1 - Math.exp(-7 * t) * Math.cos(9 * t);
  }
  function random(seed) {
    var h0 = 0; var s = String(seed);
    for (var i = 0; i < s.length; i++) h0 = (Math.imul(31, h0) + s.charCodeAt(i)) | 0;
    h0 = Math.imul(h0 ^ (h0 >>> 16), 2246822507);
    h0 = Math.imul(h0 ^ (h0 >>> 13), 3266489909);
    return ((h0 ^ (h0 >>> 16)) >>> 0) / 4294967296;
  }
  var Easing = {
    cubic: function (t) { return t * t * t; },
    in: function (fn) { return fn; },
    out: function (fn) { return function (t) { return 1 - fn(1 - t); }; },
    inOut: function (fn) { return function (t) { return t < 0.5 ? fn(2 * t) / 2 : 1 - fn(2 - 2 * t) / 2; }; },
  };

  /* ------------------------------------------------- theme.ts (verbatim) */
  var COLORS = {
    ink: "#101F36", inkSoft: "#23344F", ink2: "#1C2840", inkDeep: "#0A1424",
    paper: "#f7f9fb", white: "#ffffff", verm: "#e16347", vermSoft: "#b26858",
    slate: "#64707F", slateLight: "#9AA4B0",
    cardGlass: "rgba(255,255,255,0.93)", hairline: "rgba(22,41,63,0.12)",
    textDim: "#64707d", textBody: "#4c5a68", textBright: "#233241",
    recessed: "#16243C", greyLand: "#2C3A52", liveGreen: "#1e9e66", liveGreenText: "#1d7a52",
    teal: "#2a7f8c", tealD: "#1a4f57", cardInk: "#16293f", cardMut: "#64707d", cardLine: "rgba(22,41,63,0.1)",
  };
  var FONTS = { jp: '"Noto Sans JP", sans-serif', lat: '"Archivo", sans-serif' };

  /* Daylight palette, after the original July 2026 day look: a clear blue sky with the sun top
   * right, white clouds, glass that reflects the sky, lamps off, and a pale blue haze between
   * the city tiers for depth (things further away sit lighter and bluer). */
  var DAY = {
    sky: "linear-gradient(to bottom, #58abe0 0%, #8fc9ec 38%, #c2e4f6 64%, #e8f5fc 84%, #fdeee5 100%)",
    skyT: "linear-gradient(to bottom, #58abe0 0%, #8fc9ec 42%, #c6e6f6 72%, #ecf7f3 100%)",
    skyN: "linear-gradient(to bottom, #58abe0 0%, #90c6e9 52%, #cfeaf8 100%)",
    sun: "#ffd24d", sunGlow: "255,224,130",
    haze: "232,243,251", hazeK: [0.6, 0.42, 0.22],
    hill: "#dbe8f3", deep: "#cbdaea", deepTop: "#dbe6f2", deepWin: "rgba(255,255,255,0.45)",
    far: ["#8ba2c7", "#95abce", "#7f97bd"], farCap: "#7288ab",
    mid: ["#5f7ba8", "#6a86b2", "#54719e", "#5e88a8"], midCap: "#465e84",
    frame: "rgba(22,41,63,0.22)", glass: "#c6ddf1", lit: "#eef7fe", warm: "#ffd98f", cool: "#dbeaf6",
    warmP: 0.045, litP: 0.13, coolP: 0.1,
    refl: "rgba(255,255,255,0.4)", shade: "rgba(22,41,63,0.1)", rim: "rgba(255,255,255,0.3)",
    cloud: "#eef5fb", cloudTop: "#ffffff", cloudShade: "rgba(176,206,232,0.45)", cloudO: 0.96,
    walk: "#c4c9cf", curb: "#9aa3ad", road: "#3a4149", roadEdge: "#2b313a", fence: "#9aa1a8", fencePost: "#8b93a0",
    pole: "#7d93b0", poleHead: "#5b6b82", utility: "#56688a", wire: "rgba(40,56,84,0.42)",
    truckBox: "#f7f9fb", marker: "#f0a23c",
    fuji: "#5f93c9", fujiCap: "#ffffff", sign: "#1d6a4c", signHead: "#17583e",
    // Fuji under the one sun: the flank away from it one tone down, a crest catching it one tone up, snow shading into periwinkle
    fujiShade: "#4d7db2", fujiLight: "#73a5d7", fujiCapShade: "#d9e4f5",
    cityDeep: "#a9bcd3", cityDeepTop: "#bccbde", cityWin: "rgba(236,243,250,0.5)",
    cityBack: ["#7089b1", "#7b93ba", "#65809f"], cityBackCap: "#57709a",
    cityFront: ["#5c78a5", "#66819f", "#516d9a"], cityFrontCap: "#43608c",
    office: "#eef3f8"
  };
  // the sun's glow as a true radial gradient; ids are per scene (stages coexist in a dissolve)
  function GlowDef(id, rgb, a) {
    return h("radialGradient", { id: id },
      h("stop", { offset: "0", stopColor: "rgba(" + rgb + "," + a.toFixed(3) + ")" }),
      h("stop", { offset: "0.35", stopColor: "rgba(" + rgb + "," + (a * 0.45).toFixed(3) + ")" }),
      h("stop", { offset: "0.7", stopColor: "rgba(" + rgb + "," + (a * 0.12).toFixed(3) + ")" }),
      h("stop", { offset: "1", stopColor: "rgba(" + rgb + ",0)" }));
  }
  // vertical haze rising from a ground line (screen-space; per-scene ids)
  function HazeDef(id, k) {
    return h("linearGradient", { id: id, x1: "0", y1: "0", x2: "0", y2: "1" },
      h("stop", { offset: "0", stopColor: "rgba(" + DAY.haze + ",0)" }),
      h("stop", { offset: "0.7", stopColor: "rgba(" + DAY.haze + "," + (k * 0.55).toFixed(3) + ")" }),
      h("stop", { offset: "1", stopColor: "rgba(" + DAY.haze + "," + k.toFixed(3) + ")" }));
  }
  var FPS = 30, WIDTH = 1920, HEIGHT = 1080, DURATION = 900;
  var TIMELINE = { worldDur: 420, transitDur: 300, networkDur: 180, slide1Dur: 18, fade2Dur: 16 };
  var T_WORLD = {
    camRecvX: -200, camLoadX: 1900, panStart: 200, panEnd: 262,
    truckIn: [8, 62], doorOpen: [62, 80], parcels: [82, 168], recvCardIn: 48, recvDataIn: [78, 192],
    doorClose: [172, 188], truckDepart: [188, 262],
    shutters: [266, 316], loadParcels: [308, 388], loadCardIn: 296, loadDataIn: [314, 392],
    doorsClose2: [382, 393], departs2: [414, 403, 392], departDur2: 50,
  };
  var T_TRANSIT = { convoyIn: [0, 70], cardIn: 40, chartSweep: [62, 210], countUps: [62, 210] };
  var T_NETWORK = {
    mapIn: [0, 26], prefs: [4, 56], routesDraw: [34, 78], pinPop: 60,
    mapRecede: [86, 112], logo: [96, 126], tagline: [116, 140], stats: [128, 174], holdFrom: 174,
  };
  var easeOutCubic = function (t) { return 1 - Math.pow(1 - t, 3); };
  var easeInOutCubic = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var clamp01 = function (v) { return Math.max(0, Math.min(1, v)); };

  /* ----------------------------------------------- content.ts (verbatim) */
  var CONTENT = {
    brand: {
      nameLat: "Sanpou", nameJp: "三豊運輸", signSub: "物流センター", tagline: "大切な荷物を、きょうも確実に。",
      commitEyebrow: "RELIABLE DELIVERY, ACROSS EVERY REGION",
      commitBody: "関東一円から新潟まで。私たちは半世紀にわたり、一つひとつの荷物を確実に、安全に、時間どおりにお届けしてきました。",
    },
    scenes: {
      receiving: { no: "01 / RECEIVING", jp: "入荷", heading: "お預かりした荷物を、ていねいに検品。" },
      loading: { no: "02 / LOADING", jp: "積込", heading: "行き先ごとに仕分け、車両へ積み込む。" },
      transit: { no: "03 / TRANSIT", jp: "輸送", heading: "3拠点から、決まった時間に。" },
      network: { no: "04 / NETWORK", jp: "配送ネットワーク", heading: "1都6県、そして新潟市へ届ける。" },
    },
    receivingCard: {
      titleJp: "入庫品質", titleLat: "INBOUND QUALITY", ringTarget: 100, ringLabel: "全数検品",
      barHeights: [0.55, 0.7, 0.62, 0.85, 0.78, 1.0], barsLabel: "月次入庫量（直近6ヶ月）",
    },
    fleetCard: {
      titleJp: "車両ラインナップ", titleLat: "FLEET & PAYLOAD",
      rows: [{ label: "軽1BOX", fill: 0.35 }, { label: "2t車", fill: 0.6 }, { label: "4t車", fill: 0.82 }, { label: "13t車", fill: 1.0 }],
    },
    transitCard: {
      titleJp: "運行モニター", titleLat: "OPERATIONS MONITOR", livePill: "稼働中", chartLabel: "輸送量の推移（直近12週）",
      trend: [0.3, 0.38, 0.34, 0.46, 0.52, 0.48, 0.6, 0.66, 0.62, 0.74, 0.82, 0.92],
      onTimeLabel: "定時運行率", onTime: 99.8, routesLabel: "稼働ルート", routes: 24,
    },
    commitStats: [
      { to: 50, suffix: "年", label: "信頼の実績", sub: "YEARS OF SERVICE" },
      { to: 99.8, suffix: "%", label: "定時運行率", sub: "ON-TIME RATE", decimals: 1 },
      { to: 7, suffix: "", label: "都県をカバー", sub: "PREFECTURES" },
      { to: 32, suffix: "台", label: "保有車両", sub: "VEHICLES" },
    ],
  };

  /* expose engine internals; components/scenes are attached below */
  root.JourneyPort = {
    h: h, range: range, interpolate: interpolate, spring: spring, random: random, Easing: Easing,
    COLORS: COLORS, FONTS: FONTS, CONTENT: CONTENT, FPS: FPS, WIDTH: WIDTH, HEIGHT: HEIGHT, DURATION: DURATION,
    TIMELINE: TIMELINE, T_WORLD: T_WORLD, T_TRANSIT: T_TRANSIT, T_NETWORK: T_NETWORK,
    easeOutCubic: easeOutCubic, easeInOutCubic: easeInOutCubic, clamp01: clamp01,
    _components: {}, _scenes: {},
  };

  /* ============================ COMPONENTS ============================ */

  /* ---- Truck.tsx (faces right; anchor rear-bottom of cargo box at 0,96) */
  /* Weight for a driven truck. posAt(f) is its x at frame f. The body pitch (degrees) is its acceleration
     through a damped spring (convolution with the spring's impulse response), so it squats as it pulls away,
     dips its nose as it brakes and rocks back once after stopping; run (0..1) is its speed, for the road
     shake and the exhaust, so neither pops on or off when it starts or stops. */
  var PITCH_TAPS = (function () {
    var w = 0.3, z = 0.45, wd = w * Math.sqrt(1 - z * z), taps = [];
    for (var j = 0; j < 40; j++) taps.push(Math.exp(-z * w * j) * Math.sin(wd * j) / wd);
    return taps;
  })();
  function truckMotion(posAt, f) {
    var n = PITCH_TAPS.length, pos = [];
    for (var j = -1; j <= n; j++) pos.push(posAt(f - j));          // pos[j + 1] = x at frame f - j
    var acc = 0;
    for (var k = 0; k < n; k++) acc += (pos[k] - 2 * pos[k + 1] + pos[k + 2]) * PITCH_TAPS[k];
    var speed = Math.abs(pos[0] - pos[2]) / 2;
    var raw = -0.06 * acc, e2 = Math.exp(2 * raw / 1.6);              // soft limit: 1.6 * tanh(raw / 1.6)
    return { pitch: 1.6 * (e2 - 1) / (e2 + 1), run: clamp01(speed / 3) };
  }

  function Truck(p) {
    var x = p.x, y = p.y, scale = p.scale == null ? 1 : p.scale, distance = p.distance || 0,
      doorOpen = p.doorOpen || 0, bob = p.bob || 0, opacity = p.opacity == null ? 1 : p.opacity, moving = !!p.moving;
    var pitch = p.pitch || 0, run = p.run == null ? (moving ? 1 : 0) : p.run;
    var wheelR = 11;
    var rot = ((distance / scale) / wheelR) * (180 / Math.PI);
    var k = Math.max(0, Math.min(1, doorOpen));
    var reveal = Math.max(0, (k - 0.06) / 0.94);
    var r = 1 - Math.pow(1 - reveal, 3);
    var doorW = 17 * r;
    var offset = 5 * (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
    var doorX = -doorW - offset;
    var wheels = [26, 98, 144];
    return h("g", { transform: "translate(" + x + ", " + y + ") scale(" + scale + ") translate(0, -96)", opacity: opacity },
      h("ellipse", { cx: 90, cy: 101.5, rx: 102, ry: 7, fill: "rgba(10,20,36,0.2)" }),
      h("ellipse", { cx: 90, cy: 101, rx: 74, ry: 4.6, fill: "rgba(10,20,36,0.22)" }),
      [26, 98, 144].map(function (wx) { return h("ellipse", { cx: wx, cy: 100.5, rx: 15, ry: 3.2, fill: "rgba(10,20,36,0.3)" }); }),
      h("g", { transform: "translate(0, " + bob + ") rotate(" + pitch.toFixed(3) + " 92 80)" },
        h("rect", { x: 0, y: 8, width: 122, height: 66, rx: 3, fill: DAY.truckBox }),
        h("rect", { x: 1.3, y: 50, width: 119.4, height: 22.7, fill: "rgba(16,31,54,0.06)" }),
        h("rect", { x: 2.4, y: 9.4, width: 117.2, height: 1.8, rx: 0.9, fill: "rgba(255,255,255,0.95)" }),
        range(9, function (i) { return h("line", { x1: 10 + i * 12.5, y1: 12, x2: 10 + i * 12.5, y2: 58, stroke: "rgba(16,31,54,0.07)", strokeWidth: 2.5 }); }),
        h("rect", { x: 0, y: 8, width: 122, height: 5, rx: 2.5, fill: "#f3f1ed" }),
        h("rect", { x: 0, y: 8, width: 122, height: 66, rx: 3, fill: "none", stroke: COLORS.ink, strokeWidth: 2.6 }),
        h("rect", { x: 0, y: 61, width: 122, height: 6, fill: COLORS.verm }),
        h("rect", { x: 0, y: 69.4, width: 122, height: 1.8, fill: COLORS.verm, opacity: 0.55 }),
        h("rect", { x: 9, y: 20, width: 4, height: 15, fill: COLORS.verm }),
        h("text", { x: 19, y: 30, fontFamily: FONTS.lat, fontSize: 12.5, fontWeight: 800, fill: COLORS.ink, letterSpacing: 0.4, style: { textRendering: "geometricPrecision" } }, "Sanpou"),
        h("text", { x: 19, y: 42, fontFamily: FONTS.jp, fontSize: 7.5, fontWeight: 700, fill: "rgba(16,31,54,0.55)", letterSpacing: 1.5, style: { textRendering: "geometricPrecision" } }, "三豊運輸"),
        h("line", { x1: 3.5, y1: 11, x2: 3.5, y2: 71, stroke: "rgba(16,31,54,0.25)", strokeWidth: 1.6 }),
        h("line", { x1: 0, y1: 14, x2: 0, y2: 72, stroke: COLORS.ink, strokeWidth: 2.2, opacity: 0.6 - 0.2 * r }),
        doorW > 0.3 ? h("g", { opacity: r },
          h("rect", { x: doorX, y: 16, width: doorW, height: 54, rx: 1.5, fill: COLORS.ink2, stroke: COLORS.ink, strokeWidth: 1.6 }),
          h("line", { x1: doorX + doorW / 2, y1: 20, x2: doorX + doorW / 2, y2: 66, stroke: "rgba(245, 236, 234,0.22)", strokeWidth: 1.4 }),
          h("line", { x1: 0, y1: 31, x2: doorX + doorW, y2: 31, stroke: COLORS.ink, strokeWidth: 2 }),
          h("line", { x1: 0, y1: 56, x2: doorX + doorW, y2: 56, stroke: COLORS.ink, strokeWidth: 2 }),
          h("rect", { x: 1.5, y: 16, width: 9 * r, height: 54, fill: COLORS.recessed, opacity: 0.9 })
        ) : null,
        h("rect", { x: -4, y: 74, width: 176, height: 9, rx: 2.5, fill: COLORS.ink2 }),
        h("rect", { x: 40, y: 84, width: 44, height: 4, rx: 2, fill: "#33425C" }),
        h("rect", { x: 48, y: 76, width: 26, height: 11, rx: 4, fill: "#3A4A66", stroke: COLORS.ink, strokeWidth: 1.4 }),
        h("rect", { x: 10, y: 84, width: 7, height: 11, rx: 1, fill: "#1A2434" }),
        h("rect", { x: 110, y: 84, width: 7, height: 11, rx: 1, fill: "#1A2434" }),
        h("path", { d: "M122,10 Q138,10 146,22 L146,28 L122,22 Z", fill: COLORS.inkSoft, stroke: COLORS.ink, strokeWidth: 2 }),
        h("path", { d: "M122,24 L152,24 Q161,24 165,33 L173,52 L173,74 L122,74 Z", fill: COLORS.inkSoft, stroke: COLORS.ink, strokeWidth: 2.4 }),
        h("path", { d: "M148,29 L156,29 Q160,29 162,34 L168,48 L148,48 Z", fill: "rgba(160,190,220,0.36)", stroke: COLORS.ink, strokeWidth: 1.4 }),
        h("path", { d: "M152,29 L156,29 L150,48 L148,48 Z", fill: "rgba(245,250,255,0.22)" }),
        h("path", { d: "M128,30 L144,30 L144,46 L128,46 Z", fill: "rgba(160,190,220,0.28)", stroke: COLORS.ink, strokeWidth: 1.4 }),
        h("line", { x1: 146, y1: 28, x2: 146, y2: 72, stroke: "rgba(16,31,54,0.55)", strokeWidth: 1.4 }),
        h("rect", { x: 134, y: 52, width: 9, height: 2.6, rx: 1.3, fill: "rgba(16,31,54,0.6)" }),
        h("line", { x1: 150, y1: 30, x2: 156, y2: 24, stroke: COLORS.ink, strokeWidth: 1.8 }),
        h("rect", { x: 154, y: 19, width: 4.5, height: 8, rx: 1.5, fill: COLORS.ink2, stroke: COLORS.ink, strokeWidth: 1 }),
        h("rect", { x: 166, y: 56, width: 7, height: 10, rx: 1.5, fill: "#2A3850" }),
        range(3, function (i) { return h("line", { x1: 167, y1: 58.5 + i * 2.6, x2: 172, y2: 58.5 + i * 2.6, stroke: "rgba(245, 236, 234,0.2)", strokeWidth: 1 }); }),
        h("rect", { x: 120, y: 68, width: 56, height: 8, rx: 3, fill: "#41506B" }),
        h("rect", { x: 169.5, y: 57, width: 4.5, height: 7, rx: 1.5, fill: COLORS.vermSoft }),
        h("circle", { cx: 166, cy: 72, r: 2.2, fill: "rgba(235,244,252,0.9)", stroke: "rgba(16,31,54,0.4)", strokeWidth: 0.8 }),
        h("rect", { x: -0.5, y: 62, width: 2.6, height: 6, rx: 1.2, fill: "#e16347" }),
        h("ellipse", { cx: -1, cy: 65, rx: 6, ry: 4, fill: "rgba(225, 99, 71,0.22)" }),
        [0, 45].map(function (off) {
          var kk = ((((distance + off) % 90) + 90) % 90) / 90;
          return h("circle", { cx: 118 - kk * 16, cy: 70 - kk * 26, r: 2 + kk * 4.5, fill: "rgba(200,210,225,0.16)", opacity: ((1 - kk) * 0.7 * run).toFixed(3) });
        }),
        h("rect", { x: 150, y: 21.5, width: 5, height: 2.6, rx: 1.3, fill: COLORS.vermSoft }),
        h("rect", { x: 126, y: 5.5, width: 6, height: 2.8, rx: 1.4, fill: COLORS.vermSoft, opacity: 0.8 }),
        // amber side-marker lenses along the rail (standard on Japanese trucks)
        [12, 36, 92, 114].map(function (mx) { return h("rect", { x: mx, y: 76.6, width: 5, height: 3.6, rx: 1.2, fill: DAY.marker }); })
      ),
      wheels.map(function (cx) {
        return h("g", { transform: "translate(" + cx + ", 87)" },
          h("circle", { r: wheelR, fill: COLORS.ink }),
          h("path", { d: "M-11,0 A11,11 0 0 1 0,-11", fill: "none", stroke: "rgba(245, 236, 234,0.18)", strokeWidth: 1.6 }),
          h("circle", { r: 6.6, fill: "#3A475E" }),
          h("g", { transform: "rotate(" + rot + ")" }, [0, 72, 144, 216, 288].map(function (a) {
            var rad = (a * Math.PI) / 180;
            return h("line", { x1: Math.cos(rad) * 2.4, y1: Math.sin(rad) * 2.4, x2: Math.cos(rad) * 5.6, y2: Math.sin(rad) * 5.6, stroke: "#5A6D86", strokeWidth: 1.5 });
          })),
          h("circle", { r: 2.4, fill: "#76829B" }),
          h("circle", { r: 2.4, fill: "none", stroke: "#1A2434", strokeWidth: 0.8 })
        );
      })
    );
  }

  /* ---- Parcel.tsx (bottom-centre anchor; local height renamed h -> hh) */
  function Parcel(p) {
    var x = p.x, y = p.y, size = p.size == null ? 38 : p.size, squash = p.squash == null ? 1 : p.squash,
      stretch = p.stretch == null ? 1 : p.stretch, rotation = p.rotation || 0, opacity = p.opacity == null ? 1 : p.opacity,
      shadow = p.shadow || 0, shadowY = p.shadowY;
    var w = size, hh = size * 0.88, sx = squash / stretch, sy = stretch / squash, gy = shadowY == null ? y : shadowY, flapY = hh * 0.3;
    return h("g", { opacity: opacity },
      shadow > 0.01 ? h("ellipse", { cx: x, cy: gy + 3, rx: (w * 0.62 + (1 - shadow) * 14) * sx, ry: 4.5, fill: "rgba(10,20,36,0.32)", opacity: shadow }) : null,
      h("g", { transform: "translate(" + x + ", " + y + ") rotate(" + rotation + ") scale(" + sx + ", " + sy + ")" },
        h("g", { transform: "translate(" + (-w / 2) + ", " + (-hh) + ")" },
          h("rect", { x: 0, y: 0, width: w, height: hh, rx: 1.8, fill: COLORS.paper }),
          h("rect", { x: 0, y: 0, width: w, height: flapY, rx: 1.8, fill: COLORS.white }),
          h("rect", { x: 0, y: hh * 0.78, width: w, height: hh * 0.22, fill: "rgba(16,31,54,0.05)" }),
          h("line", { x1: 0, y1: flapY, x2: w, y2: flapY, stroke: "rgba(16,31,54,0.18)", strokeWidth: 1.2 }),
          h("line", { x1: w / 2, y1: 0, x2: w * 0.2, y2: flapY, stroke: "rgba(16,31,54,0.1)", strokeWidth: 1 }),
          h("line", { x1: w / 2, y1: 0, x2: w * 0.8, y2: flapY, stroke: "rgba(16,31,54,0.1)", strokeWidth: 1 }),
          h("line", { x1: 1.5, y1: hh - 6, x2: 6, y2: hh - 1.5, stroke: "rgba(16,31,54,0.12)", strokeWidth: 1 }),
          h("line", { x1: w - 1.5, y1: hh - 6, x2: w - 6, y2: hh - 1.5, stroke: "rgba(16,31,54,0.12)", strokeWidth: 1 }),
          h("rect", { x: w / 2 - 2.2, y: 0, width: 4.4, height: hh, fill: COLORS.verm }),
          h("rect", { x: w / 2 - 2.2, y: 0, width: 1.1, height: hh, fill: "rgba(0,0,0,0.14)" }),
          h("rect", { x: 0, y: hh * 0.52 - 1.6, width: w, height: 3.2, fill: COLORS.verm, opacity: 0.88 }),
          h("rect", { x: 0, y: hh * 0.52 - 1.6, width: w, height: 0.9, fill: "rgba(0,0,0,0.12)" }),
          h("rect", { x: w * 0.62, y: hh * 0.62, width: w * 0.26, height: hh * 0.2, rx: 1, fill: "#FFFFFF", stroke: "rgba(16,31,54,0.4)", strokeWidth: 0.9 }),
          h("line", { x1: w * 0.65, y1: hh * 0.68, x2: w * 0.84, y2: hh * 0.68, stroke: COLORS.ink, strokeWidth: 1, opacity: 0.55 }),
          h("line", { x1: w * 0.65, y1: hh * 0.73, x2: w * 0.8, y2: hh * 0.73, stroke: COLORS.ink, strokeWidth: 1, opacity: 0.35 }),
          h("rect", { x: 0, y: 0, width: w, height: hh, rx: 1.8, fill: "none", stroke: COLORS.ink, strokeWidth: 2.2 })
        )
      )
    );
  }

  /* ---- scenery.tsx ---- */
  var SUPPLIER_W = 340, SUPPLIER_DOCK = { x: 252, y: -22 };
  /* The supplier's building, round 2 (same place, width, height and dock point as before).
     Colours: blue-grey for a third party's building; each surface has a light / base / shade set. */
  DAY.supInk = "#26344f"; DAY.supRoof = "#1f2c47"; DAY.supRoofLip = "#3a4d74";
  DAY.supWall = "#9db1ce"; DAY.supWallLight = "#bccbe0"; DAY.supWallShade = "#7a8fb4";
  DAY.supBand = "#5f79a5"; DAY.supBandShade = "#4c6591";
  DAY.supPlinth = "#566b91"; DAY.supPlinthLight = "#6f85aa"; DAY.supPlinthShade = "#465a7f";
  DAY.supFrame = "#4c6187"; DAY.supFrameShade = "#3f5378";
  DAY.supGlass = "#c6dcf1"; DAY.supGlassHi = "#e6f1fb"; DAY.supGlassShade = "#a3bddb";
  DAY.supWarmHi = "#ffeabf"; DAY.supWarmShade = "#f0c275";
  DAY.supBlind = "#f1f5fa"; DAY.supBlindShade = "#d3dde9";
  DAY.supSill = "#c4d1e3"; DAY.supSillShade = "#a5b6cf";
  DAY.supPlate = "#eaf1f9"; DAY.supPlateShade = "#c9d7e9"; DAY.supBar1 = "#60789b"; DAY.supBar1Shade = "#506789"; DAY.supBar2 = "#8ea4bf"; DAY.supBar2Shade = "#7a90ad";
  DAY.supSteel = "#ced8e6"; DAY.supSteelLine = "#b4c1d5"; DAY.supSteelShade = "#aebbd0"; DAY.supSteelLineShade = "#98a8c1";
  DAY.supSteelBar = "#95a6c0"; DAY.supSteelBarShade = "#8091ad";
  DAY.supDoor = "#566c92"; DAY.supDoorShade = "#475b80"; DAY.supDoorKick = "#8799b6";
  DAY.supCanopy = "#2a3a59"; DAY.supCanopyLip = "#44587f"; DAY.supCanopyUnder = "#1f2c47";
  DAY.supDock = "#7388ab"; DAY.supRubber = "#1a2434";
  DAY.supPale = "#e6edf5"; DAY.supPaleShade = "#c6d2e2";
  DAY.supPlant = "#8397b8"; DAY.supPlantLight = "#a3b5cf"; DAY.supPlantShade = "#6c81a5"; DAY.supRail = "#3d4f72"; DAY.supRailPale = "#5a6f95";
  DAY.supSafety = "#f2c14e"; DAY.supSafetyShade = "#d8a53a";
  DAY.supPallet = "#4f73b3"; DAY.supPalletDark = "#3d5b93";
  DAY.supCarton = "#d9dfe8"; DAY.supCartonShade = "#c1cad8"; DAY.supPaperShade = "#dfe6ef";
  DAY.supGroundShade = "#a9b1bc";

  // A cast shadow is one flat polygon. What it covers on a surface is that polygon clipped to the surface and
  // filled with the surface's own shade tone, so every material it crosses steps exactly one tone down.
  function _clipPoly(poly, x0, y0, x1, y1) {
    function cut(pts, inside, isect) {
      var o = [];
      for (var i = 0; i < pts.length; i++) {
        var a = pts[i], b = pts[(i + 1) % pts.length], ia = inside(a), ib = inside(b);
        if (ia) o.push(a);
        if (ia !== ib) o.push(isect(a, b));
      }
      return o;
    }
    function ix(X) { return function (a, b) { return [X, a[1] + (b[1] - a[1]) * (X - a[0]) / (b[0] - a[0])]; }; }
    function iy(Y) { return function (a, b) { return [a[0] + (b[0] - a[0]) * (Y - a[1]) / (b[1] - a[1]), Y]; }; }
    var q = cut(poly, function (v) { return v[0] >= x0; }, ix(x0));
    if (q.length) q = cut(q, function (v) { return v[0] <= x1; }, ix(x1));
    if (q.length) q = cut(q, function (v) { return v[1] >= y0; }, iy(y0));
    if (q.length) q = cut(q, function (v) { return v[1] <= y1; }, iy(y1));
    return q;
  }
  function _polyD(q) {
    if (q.length < 3) return "";
    var d = "";
    for (var i = 0; i < q.length; i++) d += (i ? "L" : "M") + Math.round(q[i][0] * 10) / 10 + "," + Math.round(q[i][1] * 10) / 10;
    return d + "Z";
  }

  /* Local units, ground at y 278, wall 0..340 wide (x 1.9 on screen). A two-storey office-over-dock building:
     three pilasters make two bays (office on the left, dock on the right), a floor band, a plinth, a fascia
     under a dark coping, plant on the roof. One sun, top right: everything proud of the wall throws a flat
     shadow down and to the left. Static, so it is built once. */
  var _supMemo = {};
  function SupplierBuilding(p) {
    var x = p.x, y = p.y, scale = p.scale == null ? 1.9 : p.scale, mk = x + "|" + y + "|" + scale;
    if (_supMemo[mk]) return _supMemo[mk];
    var D = DAY, out = [], last = [];
    var G = 278, W = SUPPLIER_W, TOP = 67, FL = 166, GF = 174, PL = 262;   // ground, width, wall top, floor band top, ground-storey top, plinth top
    var SL = 1;                                                            // a cast shadow runs this far left per unit down
    function R(rx0, ry0, w, hh, fill, rr) { return h("rect", { x: rx0, y: ry0, width: w, height: hh, rx: rr, fill: fill }); }
    function rd(rx0, ry0, w, hh) { return "M" + rx0 + "," + ry0 + "h" + w + "v" + hh + "h" + (-w) + "z"; }
    function band(xa, xb) { return [[xa, TOP], [xb, TOP], [xb - (290 - TOP) * SL, 290], [xa - (290 - TOP) * SL, 290]]; }
    function off(rx0, ry0, w, hh, d) { var dx = d * 0.8 * SL; return [[rx0 - dx, ry0 + d], [rx0 + w - dx, ry0 + d], [rx0 + w - dx, ry0 + hh + d], [rx0 - dx, ry0 + hh + d]]; }

    // windows: [x, y, w, h, lights, per-light { warm, blind }]
    var WINS = [
      [28, 108, 144, 46, 4, [{ blind: 13 }, {}, { blind: 22 }, { warm: 1 }]],     // office ribbon, upper floor
      [28, 190, 66, 26, 2, [{}, {}]],                                                   // high strip over the stores, ground floor
      [229, 100, 54, 46, 2, [{ blind: 16 }, { warm: 1 }]]                            // over the dock
    ];
    var SH = [
      [[0, TOP], [W, TOP], [W, TOP + 7], [0, TOP + 7]],                              // under the coping
      band(122, 180), band(82, 100),                                                 // two bands of cast shadow across the office bay
      [[194, 164], [322, 164], [306, 192], [178, 192]],                              // under the dock canopy
      [[133, 211], [175, 211], [168, 222], [126, 222]],                              // under the door canopy
      [[184, TOP], [184, PL], [179.5, PL], [179.5, TOP + 6]],                        // beside the middle pilaster
      [[330, TOP], [330, PL], [325.5, PL], [325.5, TOP + 6]],                        // beside the corner pilaster
      [[10, GF], [330, GF], [330, GF + 3.5], [10, GF + 3.5]],                        // under the floor band
      [[13, 78], [13, PL], [9.5, PL], [9.5, 82]],                                    // beside the downpipe
      off(30, 87, 120, 16, 3), off(98, 188, 27, 25, 5)                              // behind the name plate and the wall unit
    ];
    WINS.forEach(function (w) { var sy = w[1] + w[3] + 3.5; SH.push([[w[0] - 3, sy], [w[0] + w[2] + 3, sy], [w[0] + w[2] + 0.5, sy + 3], [w[0] - 5.5, sy + 3]]); });
    // one diagonal of sky across the glass, on the same lines through every pane
    var REFL = [];
    for (var k = 0; k < 6; k++) { REFL.push([[58 + k * 62, 60], [76 + k * 62, 60], [76 + k * 62 - 220, 280], [58 + k * 62 - 220, 280]], [[84 + k * 62, 60], [90 + k * 62, 60], [90 + k * 62 - 220, 280], [84 + k * 62 - 220, 280]]); }

    function castD(x0, y0, x1, y1) { var d = ""; for (var i = 0; i < SH.length; i++) d += _polyD(_clipPoly(SH[i], x0, y0, x1, y1)); return d; }
    function surf(sx, sy, w, hh, fill, shade) {                                      // a flat surface and whatever shadow falls on it
      out.push(R(sx, sy, w, hh, fill));
      var d = castD(sx, sy, sx + w, sy + hh);
      if (d) out.push(h("path", { d: d, fill: shade }));
    }
    function glass(gx, gy, w, hh, warm, blind) {                                     // a pane set back in its frame
      var g = warm ? [D.warm, D.supWarmHi, D.supWarmShade] : [D.supGlass, D.supGlassHi, D.supGlassShade], hi = "";
      out.push(R(gx, gy, w, hh, g[0]));
      REFL.forEach(function (q) { hi += _polyD(_clipPoly(q, gx, gy, gx + w, gy + hh)); });
      if (hi) out.push(h("path", { d: hi, fill: g[1] }));
      out.push(h("path", { d: castD(gx, gy, gx + w, gy + hh) + rd(gx, gy, w, 2.6) + rd(gx + w - 2.2, gy, 2.2, hh), fill: g[2] }));
      if (blind) {
        out.push(R(gx, gy, w, blind, D.supBlind));
        out.push(h("path", { d: castD(gx, gy, gx + w, gy + blind) + rd(gx, gy, w, 2.6) + rd(gx + w - 2.2, gy, 2.2, blind) + rd(gx, gy + blind - 2.2, w, 2.2), fill: D.supBlindShade }));
      }
    }
    function carton(cx0, cy0, w, hh, fill, shade, tape) {
      out.push(h("rect", { x: cx0, y: cy0, width: w, height: hh, rx: 1, fill: fill, stroke: COLORS.ink, strokeWidth: 1.6 }));
      out.push(R(cx0 + 0.8, cy0 + 0.8, 3.4, hh - 1.6, shade));
      if (tape) out.push(R(cx0 + w * 0.46, cy0 + 0.8, 3.6, hh - 1.6, COLORS.verm));
    }

    /* ---- ground: one flat contact shadow, falling toward the viewer's left ---- */
    out.push(h("path", { d: "M-14," + G + "L343," + G + "L338," + (G + 7) + "L-22," + (G + 7) + "Z", fill: D.supGroundShade }));

    /* ---- roof plant, standing behind the parapet (the coping is painted over its feet) ---- */
    // stair head
    out.push(R(22, 30, 74, 30, D.supInk, 2), R(24, 32, 70, 28, D.supPlant), R(24, 32, 11, 28, D.supPlantShade), R(20, 27, 78, 5.4, D.supRoof, 1.5), R(20, 27, 78, 2, D.supRoofLip, 1));
    out.push(R(62, 38, 22, 22, D.supFrame), h("path", { d: rd(65, 41.5, 16, 2.4) + rd(65, 47, 16, 2.4) + rd(65, 52.5, 16, 2.4), fill: D.supPlantShade }));
    // handrail along the roof edge
    (function () { var d = rd(100, 45, 114, 2.6); for (var i = 0; i < 6; i++) d += rd(100 + i * 22.3, 45, 2.6, 14); out.push(h("path", { d: d, fill: D.supRailPale })); })();
    // water tank: a cylinder lying on two saddles, lit along its top
    out.push(h("path", { d: rd(135, 50, 7, 9) + rd(162, 50, 7, 9), fill: D.supRail }));
    out.push(R(122, 29, 60, 24, D.supInk, 12), R(124, 31, 56, 20, D.supPale, 10));
    out.push(h("path", { d: "M124.8,45L179.2,45A10,10 0 0 1 170,51L134,51A10,10 0 0 1 124.8,45Z", fill: D.supPaleShade }));
    out.push(h("path", { d: rd(141, 31, 2.6, 20) + rd(160.4, 31, 2.6, 20), fill: D.supPaleShade }), R(147.5, 26.4, 9, 5, D.supRail, 1.2));
    // two condensers, and a vent
    [222, 264].forEach(function (cx0) {
      out.push(R(cx0 - 2, 32, 40, 28, D.supInk, 2), R(cx0, 34, 36, 26, D.supPlant), R(cx0, 34, 36, 2.6, D.supPlantLight), R(cx0, 34, 6, 26, D.supPlantShade));
      out.push(h("circle", { cx: cx0 + 20, cy: 47, r: 9.4, fill: D.supInk }), h("circle", { cx: cx0 + 20, cy: 47, r: 7, fill: D.supPlantShade }));
    });
    out.push(R(310.5, 44, 5, 16, D.supRail), R(306, 40, 14, 5, D.supRail, 2));

    /* ---- the wall: ink behind it for the outline, then panels, structure and plinth ---- */
    out.push(R(-3.2, 60, W + 6.4, G - 60 + 1.8, D.supInk, 3));
    surf(10, TOP, 174, FL - TOP, D.supWall, D.supWallShade); surf(196, TOP, 134, FL - TOP, D.supWall, D.supWallShade);
    surf(10, GF, 174, PL - GF, D.supWall, D.supWallShade); surf(196, GF, 134, PL - GF, D.supWall, D.supWallShade);
    surf(0, FL, W, GF - FL, D.supWallLight, D.supWall);                              // floor band
    surf(0, TOP, 10, PL - TOP, D.supWallLight, D.supWall); surf(184, TOP, 12, PL - TOP, D.supWallLight, D.supWall); surf(330, TOP, 10, PL - TOP, D.supWallLight, D.supWall);   // pilasters
    surf(0, TOP, W, 17, D.supBand, D.supBandShade);                                  // fascia under the coping
    surf(0, PL, W, G - PL, D.supPlinth, D.supPlinthShade);                           // plinth
    out.push(R(0, PL, W, 2.4, D.supPlinthLight));

    /* ---- office bay ---- */
    // downpipe with its head, brackets and shoe
    surf(13, 76, 5, PL - 72, D.supWallLight, D.supWall);
    out.push(R(13, 76, 1.8, PL - 72, D.supWallShade), R(10.5, 70, 10, 9, D.supFrame, 1.5));
    out.push(h("path", { d: rd(11, 120, 9, 2.6) + rd(11, 182, 9, 2.6) + rd(11, 240, 9, 2.6) + rd(13, PL + 4, 12, 3.2), fill: D.supFrame }));
    // name plate: no lettering, two bars stand in for a name
    surf(30, 87, 120, 16, D.supPlate, D.supPlateShade); surf(38, 91.5, 64, 7, D.supBar1, D.supBar1Shade); surf(110, 91.5, 30, 7, D.supBar2, D.supBar2Shade);
    // windows
    WINS.forEach(function (w) {
      surf(w[0], w[1], w[2], w[3], D.supFrame, D.supFrameShade);
      var pw = (w[2] - 3 * (w[4] + 1)) / w[4];
      for (var i = 0; i < w[4]; i++) glass(w[0] + 3 + i * (pw + 3), w[1] + 3, pw, w[3] - 6, w[5][i].warm, w[5][i].blind);
      surf(w[0] - 3, w[1] + w[3], w[2] + 6, 3.5, D.supSill, D.supSillShade);
    });
    // wall unit on its bracket, beside the high strip of windows
    out.push(R(96.5, 213, 30, 2.8, D.supCanopy), R(98, 188, 27, 25, D.supPale, 2), R(98, 188, 5.5, 25, D.supPaleShade));
    out.push(h("circle", { cx: 110, cy: 200.5, r: 8, fill: D.supFrame }), h("circle", { cx: 110, cy: 200.5, r: 2.8, fill: D.supPale }));
    out.push(h("path", { d: rd(119.5, 193, 4, 2.4) + rd(119.5, 199, 4, 2.4) + rd(119.5, 205, 4, 2.4), fill: D.supPaleShade }));
    // staff door under its own small canopy, with a call panel beside it
    surf(136, 216, 34, G - 216, D.supFrame, D.supFrameShade); surf(139, 219, 28, G - 219, D.supDoor, D.supDoorShade);
    glass(143, 224, 20, 22, 0, 0);
    out.push(R(139, 267, 28, 11, D.supDoorKick), R(160.5, 249, 2.8, 10, D.supPale, 1.4));
    out.push(R(133, 206, 42, 6.4, D.supCanopy, 1), R(133, 206, 42, 2.2, D.supCanopyLip, 1), R(149, 212.4, 8, 3, D.supPale, 1));
    out.push(R(174, 238, 7.5, 13, D.supPale, 1), R(175.8, 240.4, 4, 3.4, D.supFrame));

    /* ---- dock bay ---- */
    // roller shutter: hood and guides, the curtain with its slats, the bottom bar
    surf(200, 176, 112, 80, D.supFrame, D.supFrameShade); surf(204, 184, 104, 66, D.supSteel, D.supSteelShade);
    (function () {
      var lit = "", dark = "";
      for (var i = 1; i < 8; i++) { var ly = 184 + i * 8.25 - 0.8; lit += rd(204, ly, 104, 1.6); dark += castD(204, ly, 308, ly + 1.6); }
      out.push(h("path", { d: lit, fill: D.supSteelLine }), h("path", { d: dark, fill: D.supSteelLineShade }));
    })();
    surf(204, 250, 104, 6, D.supSteelBar, D.supSteelBarShade);
    out.push(R(249, 251.6, 14, 2.8, D.supFrame, 1.4));
    // the dock itself: a raised sill with a safety edge, rubber bumpers and a leveller
    out.push(R(196, 256, 120, G - 256, D.supDock), R(196, 256, 5, G - 256, D.supPlinth), R(196, 256, 120, 3.6, D.supSafety));
    out.push(R(208, 263.5, 10, 11.5, D.supRubber, 1.5), R(294, 263.5, 10, 11.5, D.supRubber, 1.5));
    out.push(R(230, 259.6, 52, 7, D.supSteelBar), R(230, 264.6, 52, 2, D.supSteelBarShade));   // the lip of the dock leveller, folded down
    // canopy hung from the wall on two rods
    out.push(h("path", { d: "M210.4,128L213.4,130.4L200.6,161L197.6,161Z M303.6,128L300.6,130.4L313.4,161L316.4,161Z" + rd(207, 124.6, 9.4, 6) + rd(297.6, 124.6, 9.4, 6), fill: D.supCanopy }));
    out.push(R(192, 160, 130, 10.4, D.supCanopy, 1.5), R(192, 160, 130, 3, D.supCanopyLip, 1.5), R(193.5, 168, 127, 2.4, D.supCanopyUnder));

    /* ---- coping: the dark line that closes the building against the sky ---- */
    out.push(R(-7, 56, W + 14, 11.4, D.supRoof, 2), R(-7, 56, W + 14, 3.2, D.supRoofLip, 1.6));

    /* ---- things that say the place works ---- */
    // pallets, three high
    (function () {
      var deck = "", feet = "";
      for (var i = 0; i < 3; i++) { var py = G - 7.2 * (i + 1); deck += rd(26, py, 38, 2.5) + rd(26, py + 4.7, 38, 2.5); feet += rd(27, py + 2.5, 6, 2.2) + rd(42, py + 2.5, 6, 2.2) + rd(57, py + 2.5, 6, 2.2); }
      out.push(h("path", { d: feet, fill: D.supPalletDark }), h("path", { d: deck, fill: D.supPallet }));
    })();
    // roll cage with two cartons in it
    carton(78.5, 250, 21, 19, D.supCarton, D.supCartonShade); carton(80, 234.5, 17, 15.5, COLORS.paper, D.supPaperShade);
    out.push(h("path", { d: rd(74, 226, 2.6, 46) + rd(101.4, 226, 2.6, 46) + rd(74, 226, 30, 2.6) + rd(74, 244, 30, 2.2) + rd(72.5, 269.4, 33, 3), fill: D.supPale }));
    out.push(h("circle", { cx: 78, cy: 275.2, r: 2.8, fill: D.supInk }), h("circle", { cx: 100, cy: 275.2, r: 2.8, fill: D.supInk }));
    // guide posts either side of the dock
    [188.5, 316.5].forEach(function (bx) {
      out.push(R(bx, 239, 7.4, G - 239, D.supSafety, 2), R(bx, 241, 2.4, G - 241, D.supSafetyShade));
      out.push(h("path", { d: rd(bx, 249, 7.4, 7.2) + rd(bx, 263.4, 7.4, 7.2), fill: D.supInk }));
    });
    // cartons waiting on the dock; the middle is left clear, parcels start there
    carton(208, 228, 26, 28, COLORS.paper, D.supPaperShade, true);
    carton(271, 236, 25, 20, D.supCarton, D.supCartonShade); carton(275, 221.4, 18, 14.6, D.supCarton, D.supCartonShade);

    /* ---- kept last and separate: the parts a motion pass may turn or switch (static for now) ---- */
    [222, 264].forEach(function (cx0) {
      last.push(h("g", { transform: "translate(" + (cx0 + 20) + ", 47)" },
        h("path", { d: rd(-7, -1.3, 14, 2.6) + rd(-1.3, -7, 2.6, 14), fill: D.supPlantLight }), h("circle", { cx: 0, cy: 0, r: 2.4, fill: D.supInk })));
    });
    last.push(h("g", null, R(241, 170.4, 30, 4.4, D.supCanopyUnder, 1.5), R(244, 171.6, 24, 3.2, D.supPale, 1.4)));

    return _supMemo[mk] = h("g", { transform: "translate(" + x + ", " + y + ") scale(" + scale + ") translate(0, -278)", "data-cache": "supplier-" + mk, "data-box": "-24 22 376 266" }, out, last);
  }

  function makeSkylineTier(seed, span, opt) {
    // designed rhythm, not randomness: widths, heights and gaps step through
    // repeating cycles (different lengths, so the pattern doesn't visibly
    // tile) - neighbours always contrast and spacing stays deliberate
    var arr = [], x = -80, i = 0;
    while (x < span) {
      var w = opt.w[i % opt.w.length];
      var hgt = Math.round(opt.base + opt.amp * opt.hf[i % opt.hf.length]);
      if (x + w > span + 60) break;
      arr.push({ x: x, w: w, h: hgt, i: i });
      x += w + opt.g[i % opt.g.length];
      i++;
    }
    return arr;
  }

  function TokyoTower(p) {
    // Open-framework Tokyo Tower (same geometry as before) with the lattice
    // BATCHED: all struts/braces merge into a few <path> nodes per colour and
    // stroke weight, so the tower costs ~16 DOM nodes instead of ~140.
    var cx = p.cx, baseY = p.baseY, H = p.h == null ? 620 : p.h, time = p.time, opacity = p.opacity == null ? 0.95 : p.opacity;
    var RED = "#e4553b", WHT = "#f2f6fa", GRAY = "#9aa6b4", GRAYL = "#ccd5df", WIN = "#3a4757";
    var q = function (a, b, c, t) { return (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c; };
    var yG = baseY;
    var yDeckB = baseY - H * 0.278, yDeckT = baseY - H * 0.332;
    var yBodyT = baseY - H * 0.655;
    var yNdl = baseY - H * 0.862, yTip = baseY - H;
    var yArch = baseY - H * 0.19;
    var swE = Math.max(1.6, H * 0.0092);
    var swS = Math.max(1.05, H * 0.0047);
    var SEG = {};
    var seg = function (x1, y1, x2, y2, col, w) { var k = col + "|" + w; SEG[k] = (SEG[k] || "") + "M" + x1 + "," + y1 + "L" + x2 + "," + y2; };
    // mid body
    var midHW = function (t) { return q(H * 0.06, H * 0.034, H * 0.0165, t); };
    var midY = function (t) { return yDeckT - t * (yDeckT - yBodyT); };
    var MB = 7, BAND0 = 0.2, BAND1 = 0.52;
    for (var mi = 0; mi <= MB; mi++) {
      var mt = mi / MB, my = midY(mt), mw = midHW(mt);
      if (mi < MB) {
        var mt1 = (mi + 1) / MB, my1 = midY(mt1), mw1 = midHW(mt1);
        var mc = (mt + mt1) / 2, mcol = (mc > BAND0 && mc < BAND1) ? WHT : RED;
        seg(cx - mw, my, cx + mw1, my1, mcol, swS);
        seg(cx + mw, my, cx - mw1, my1, mcol, swS);
      }
      seg(cx - mw, my, cx + mw, my, (mt >= BAND0 && mt <= BAND1) ? WHT : RED, swS * 1.2);
    }
    var edgePaths = [];
    var edgeSeg = function (t0, t1, col) {
      var pl = "", pr = "";
      for (var k = 0; k <= 6; k++) {
        var tt = t0 + (t1 - t0) * k / 6, cmd = k ? "L" : "M";
        pl += cmd + (cx - midHW(tt)) + "," + midY(tt);
        pr += cmd + (cx + midHW(tt)) + "," + midY(tt);
      }
      edgePaths.push(h("path", { d: pl + pr, stroke: col, strokeWidth: swE * 0.8, fill: "none", strokeLinecap: "round" }));
    };
    edgeSeg(0, BAND0, RED); edgeSeg(BAND0, BAND1, WHT); edgeSeg(BAND1, 1, RED);
    // lower section
    var lowHW = function (t) { return q(H * 0.068, H * 0.085, H * 0.178, t); };
    var lowY = function (t) { return yDeckB + t * (yG - yDeckB); };
    var tArch = (yArch - yDeckB) / (yG - yDeckB);
    var archPts = [];
    for (var ai = 0; ai <= 16; ai++) {
      var ta = ai / 16;
      archPts.push([q(0, H * 0.03, H * 0.098, ta), q(yArch, yArch + (yG - yArch) * 0.55, yG, ta)]);
    }
    var archX = function (y) {
      for (var k2 = 1; k2 < archPts.length; k2++) {
        if (archPts[k2][1] >= y) {
          var p0 = archPts[k2 - 1], p1 = archPts[k2];
          var f2 = (y - p0[1]) / Math.max(0.001, p1[1] - p0[1]);
          return p0[0] + (p1[0] - p0[0]) * f2;
        }
      }
      return archPts[archPts.length - 1][0];
    };
    seg(cx - lowHW(0), yDeckB, cx + lowHW(0), yDeckB, RED, swS * 1.3);
    var FT = [0, tArch * 0.34, tArch * 0.67, tArch];
    for (var fi = 0; fi < FT.length - 1; fi++) {
      var u0 = FT[fi], u1 = FT[fi + 1];
      var fy0 = lowY(u0), fy1 = lowY(u1), fw0 = lowHW(u0), fw1 = lowHW(u1);
      seg(cx - fw0, fy0, cx, fy1, RED, swS);
      seg(cx, fy0, cx - fw1, fy1, RED, swS);
      seg(cx, fy0, cx + fw1, fy1, RED, swS);
      seg(cx + fw0, fy0, cx, fy1, RED, swS);
      seg(cx - fw1, fy1, cx + fw1, fy1, RED, swS * 1.2);
    }
    var LT = [tArch, 0.44, 0.58, 0.72, 0.86, 1];
    [-1, 1].forEach(function (sgn) {
      for (var g = 0; g < LT.length - 1; g++) {
        var v0 = LT[g], v1 = LT[g + 1];
        var gy0 = lowY(v0), gy1 = lowY(v1);
        var o0 = lowHW(v0), o1 = lowHW(v1);
        var in0 = archX(gy0), in1 = archX(gy1);
        seg(cx + sgn * o0, gy0, cx + sgn * in1, gy1, RED, swS);
        seg(cx + sgn * in0, gy0, cx + sgn * o1, gy1, RED, swS);
        if (g < LT.length - 2) seg(cx + sgn * in1, gy1, cx + sgn * o1, gy1, RED, swS * 1.2);
      }
    });
    var dE = "";
    [-1, 1].forEach(function (sgn) { for (var k3 = 0; k3 <= 10; k3++) { var t3 = k3 / 10; dE += (k3 ? "L" : "M") + (cx + sgn * lowHW(t3)) + "," + lowY(t3); } });
    var archD = (function () {
      var d = "M" + (cx - archPts[16][0]) + "," + yG;
      for (var k4 = 15; k4 >= 0; k4--) d += "L" + (cx - archPts[k4][0]) + "," + archPts[k4][1];
      for (var k5 = 1; k5 <= 16; k5++) d += "L" + (cx + archPts[k5][0]) + "," + archPts[k5][1];
      return d;
    })();
    var blink = 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(time * Math.PI));
    var deckHW = H * 0.09, deckH = yDeckB - yDeckT;
    var yA0 = yBodyT - H * 0.018;
    var rp = function (x0, y0, ww, hh) { return "M" + x0 + "," + y0 + "h" + ww + "v" + hh + "h" + (-ww) + "z"; };
    var dWin = "", ww2 = (deckHW * 2 - H * 0.02) / 12;
    for (var wi = 0; wi < 12; wi++) dWin += rp(cx - deckHW + H * 0.01 + wi * ww2 + ww2 * 0.2, yDeckT + deckH * 0.4, ww2 * 0.6, deckH * 0.3);
    var dPost = "";
    for (var ri = 0; ri < 9; ri++) { var px = cx - deckHW * 0.92 + deckHW * 1.84 * ri / 8; dPost += rp(px - H * 0.0016, yDeckT - H * 0.009, H * 0.0032, H * 0.009); }
    seg(cx - deckHW * 0.92, yDeckT - H * 0.009, cx + deckHW * 0.92, yDeckT - H * 0.009, GRAY, swS * 0.9);
    var lattice = [];
    for (var key in SEG) { if (SEG.hasOwnProperty(key)) { var kp = key.split("|"); lattice.push(h("path", { d: SEG[key], stroke: kp[0], strokeWidth: parseFloat(kp[1]), fill: "none", strokeLinecap: "round" })); } }
    return h("g", { opacity: opacity },
      lattice,
      edgePaths,
      h("path", { d: dE, stroke: RED, strokeWidth: swE, fill: "none", strokeLinecap: "round" }),
      h("path", { d: archD, stroke: RED, strokeWidth: swE * 0.9, fill: "none", strokeLinecap: "round" }),
      [-1, 1].map(function (sg) {
        var xi = cx + sg * H * 0.098, xo = cx + sg * H * 0.178;
        return h("rect", { x: Math.min(xi, xo) - 2, y: yG - H * 0.008, width: Math.abs(xo - xi) + 4, height: H * 0.008, rx: 2, fill: RED });
      }),
      h("path", { d: dPost, fill: GRAY }),
      h("rect", { x: cx - deckHW, y: yDeckT, width: deckHW * 2, height: deckH * 0.32, rx: H * 0.006, fill: GRAYL }),
      h("rect", { x: cx - deckHW, y: yDeckT + deckH * 0.32, width: deckHW * 2, height: deckH * 0.46, fill: GRAY }),
      h("path", { d: dWin, fill: WIN }),
      h("rect", { x: cx - deckHW, y: yDeckT + deckH * 0.78, width: deckHW * 2, height: deckH * 0.22, rx: H * 0.004, fill: "#8d99a8" }),
      h("rect", { x: cx - H * 0.026, y: yBodyT - H * 0.008, width: H * 0.052, height: H * 0.008, rx: H * 0.003, fill: GRAYL }),
      h("rect", { x: cx - H * 0.02, y: yA0, width: H * 0.04, height: H * 0.0075, rx: H * 0.003, fill: GRAY }),
      [[0, 0.5, RED], [0.5, 0.75, WHT], [0.75, 1, RED]].map(function (sg2) {
        var f0 = sg2[0], f1 = sg2[1];
        var y0 = yA0 - (yA0 - yNdl) * f0, y1 = yA0 - (yA0 - yNdl) * f1;
        var w0 = H * (0.0095 - 0.0033 * f0), w1 = H * (0.0095 - 0.0033 * f1);
        return h("path", { d: "M" + (cx - w0) + "," + y0 + " L" + (cx - w1) + "," + y1 + " L" + (cx + w1) + "," + y1 + " L" + (cx + w0) + "," + y0 + " Z", fill: sg2[2] });
      }),
      h("path", { d: "M" + (cx - H * 0.0028) + "," + yNdl + " L" + (cx - H * 0.0007) + "," + yTip + " L" + (cx + H * 0.0007) + "," + yTip + " L" + (cx + H * 0.0028) + "," + yNdl + " Z", fill: GRAY }),
      h("circle", { cx: cx, cy: yTip, r: 2.2, fill: "#ffb3a0", opacity: blink })
    );
  }

  /* kurzgesagt-style city building: saturated facade that separates from
     the sky, parapet cap, right-edge shade for depth, a consistent grid of
     framed window panes (light glass + rare warm ones), and small rooftop
     units. `detail` 0 = far/hazy (simple), 1 = mid, 2 = front (richest). */
  var _cbMemo = {};
  function CityBuilding(p) {
    var _mk = p.seed + "|" + p.x + "|" + p.baseY + "|" + p.w + "|" + p.h + "|" + (p.detail == null ? 1 : p.detail) + "|" + (p.fi == null ? -1 : p.fi);
    if (_cbMemo[_mk]) return _cbMemo[_mk];
    var x = p.x, baseY = p.baseY, w = p.w, hgt = p.h, seed = p.seed,
      faces = p.faces, detail = p.detail == null ? 1 : p.detail, cap = p.cap == null ? "#4a6288" : p.cap;
    var top = baseY - hgt;
    // facade colour rotates through the palette by position, so neighbouring
    // buildings are always distinct yet stay within the tier's family
    var fi = p.fi == null ? Math.floor(random(seed + "-f") * faces.length) : p.fi;
    var face = faces[fi % faces.length];
    var mx = 10, myT = 16, myB = 12;
    var pitchX = detail === 0 ? 33 : 27, pitchY = detail === 0 ? 48 : 37;
    var cols = Math.max(1, Math.round((w - mx * 2) / pitchX));
    var rows = Math.max(1, Math.round((hgt - myT - myB) / pitchY));
    var px2 = (w - mx * 2) / cols, py2 = (hgt - myT - myB) / rows;
    var cw = px2 * 0.52, ch = py2 * 0.5;
    // windows batched into <=5 <path> nodes (frames / three glass colours /
    // sky-reflection top) instead of 3 rects per window
    var rp = function (rx, ry, rw, rh) { return "M" + rx + "," + ry + "h" + rw + "v" + rh + "h" + (-rw) + "z"; };
    var dFrame = "", dWarm = "", dBright = "", dGlass = "", dTop = "", dCool = "";
    if (hgt >= 46 && w >= 34) for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var wx = x + mx + c * px2 + (px2 - cw) / 2, wy = top + myT + r * py2 + (py2 - ch) / 2;
        var rv = random(seed + "-w" + r + "-" + c);
        if (detail > 0) dFrame += rp(wx - 1.6, wy - 1.6, cw + 3.2, ch + 3.2);
        if (detail > 0 && rv < DAY.warmP) dWarm += rp(wx, wy, cw, ch);
        else if (rv < DAY.warmP + DAY.litP) dBright += rp(wx, wy, cw, ch);
        else if (rv < DAY.warmP + DAY.litP + DAY.coolP) dCool += rp(wx, wy, cw, ch);
        else dGlass += rp(wx, wy, cw, ch);
        dTop += rp(wx, wy, cw, ch * 0.42);
      }
    }
    var roofBox = p.fi == null ? random(seed + "-roof") > 0.5 : p.fi % 2 === 0;
    var roofMast = p.fi == null ? random(seed + "-roof") > 0.78 : p.fi % 3 === 2;
    var _out = h("g", null,
      h("rect", { x: x, y: top, width: w, height: hgt, fill: face }),
      dFrame ? h("path", { d: dFrame, fill: DAY.frame }) : null,
      dGlass ? h("path", { d: dGlass, fill: DAY.glass }) : null,
      dCool ? h("path", { d: dCool, fill: DAY.cool }) : null,
      dBright ? h("path", { d: dBright, fill: DAY.lit }) : null,
      dWarm ? h("path", { d: dWarm, fill: DAY.warm }) : null,
      dTop ? h("path", { d: dTop, fill: DAY.refl }) : null,
      h("rect", { x: x, y: top, width: w * 0.14, height: hgt, fill: DAY.shade }),
      h("rect", { x: x + w - 3, y: top, width: 3, height: hgt, fill: DAY.rim }),
      h("rect", { x: x - 2, y: top - 7, width: w + 4, height: 9, rx: 2, fill: cap }),
      detail > 0 && roofBox ? h("rect", { x: x + w * 0.3, y: top - 19, width: 20, height: 12, rx: 1.5, fill: cap }) : null,
      detail > 0 && roofMast ? h("rect", { x: x + w * 0.68, y: top - 34, width: 3.4, height: 27, rx: 1.5, fill: cap }) : null
    );
    _cbMemo[_mk] = _out;
    return _out;
  }

  function SkySun(p) {
    var cx = p.cx, cy = p.cy, r = p.r, time = p.time;
    var pulse = 0.5 + 0.5 * Math.sin(time * 0.55);
    var p2 = 0.5 + 0.5 * Math.sin(time * 0.55 + 1.3);
    return h("g", null,
      h("circle", { cx: cx, cy: cy, r: r * 4.6 + pulse * r * 0.15, fill: "url(#" + p.gid + ")" }),
      (function () {
        var d = "";
        for (var i = 0; i < 12; i++) {
          var a = (i * 30 + time * 6) * Math.PI / 180;
          var r0 = r * 1.3, r1 = r * (i % 2 ? 1.52 : 1.74) + pulse * r * 0.07;
          d += "M" + (cx + Math.cos(a) * r0) + "," + (cy + Math.sin(a) * r0) + "L" + (cx + Math.cos(a) * r1) + "," + (cy + Math.sin(a) * r1);
        }
        return null;
      })(),
      h("circle", { cx: cx, cy: cy, r: r * 1.12, fill: "rgba(255,236,170,0.32)" }),
      h("circle", { cx: cx, cy: cy, r: r * 0.78, fill: DAY.sun }),
      h("circle", { cx: cx, cy: cy, r: r * 0.78, fill: "none", stroke: "rgba(255,255,255,0.55)", strokeWidth: 2 })
    );
  }

  function RoofBeacon(p) {
    var x = p.x, y = p.y, time = p.time, phase = p.phase || 0;
    return h("g", null,
      h("rect", { x: x - 1.5, y: y - 7, width: 3, height: 7, fill: "#33425C" }),
      h("circle", { cx: x, cy: y - 9, r: 2.4, fill: "#e16347", opacity: 0 }));
  }

  function FloatingParticles(p) {
    return null;
    var seed = p.seed, count = p.count == null ? 26 : p.count, x = p.x, y = p.y, width = p.width, height = p.height,
      time = p.time, baseOpacity = p.baseOpacity == null ? 0.5 : p.baseOpacity, tint = p.tint == null ? "rgba(245, 236, 234,0.55)" : p.tint;
    return h("g", null, range(count, function (i) {
      var rx = random(seed + "-x" + i), ry = random(seed + "-y" + i), rs = random(seed + "-s" + i), rp = random(seed + "-p" + i);
      var drift = 14 + rs * 26;
      var px = x + rx * width + Math.sin(time * (0.18 + rp * 0.22) + rp * 9) * drift;
      var py = y + ry * height + Math.cos(time * (0.12 + rs * 0.18) + rx * 7) * (drift * 0.55) - time * (2 + rs * 4) * 0.6;
      var wrapped = y + ((((py - y) % height) + height) % height);
      var tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * (0.7 + rp * 1.4) + i * 1.7));
      return h("circle", { cx: px, cy: wrapped, r: 0.9 + rs * 1.8, fill: tint, opacity: baseOpacity * tw });
    }));
  }

  /* puffy flat-bottom day cloud (kurzgesagt-style): round lobes over a pill-shaped base, one flat
     silhouette lit from above. The white lit layer, then the body nudged down (a sunlit crescent stays
     on every lobe), then the shade on the underside, cut to the base's own rounded bottom so it never
     reads as a separate bar. `edge` (0..1) lets callers fade wrap-around entry. */
  function Cloud(p) {
    var w = p.w == null ? 240 : p.w, o = p.o == null ? 0.94 : p.o, edge = p.edge == null ? 1 : p.edge;
    var hgt = w * 0.34, baseTop = -hgt * 0.14, baseH = hgt * 0.44;
    var lobes = [[0.2, -0.16, 0.3], [0.44, -0.36, 0.44], [0.67, -0.2, 0.33], [0.84, -0.06, 0.22]];
    var br = baseH * 0.44, bot = baseTop + baseH, sy = bot - baseH * 0.3;
    var sx = br - Math.sqrt(br * br - (sy - (bot - br)) * (sy - (bot - br)));
    var shadeD = "M" + sx + "," + sy + " L" + (w - sx) + "," + sy + " A" + br + "," + br + " 0 0 1 " + (w - br) + "," + bot +
      " L" + br + "," + bot + " A" + br + "," + br + " 0 0 1 " + sx + "," + sy + " Z";
    return h("g", { opacity: o * DAY.cloudO * clamp01(edge) },
      lobes.map(function (lb) { return h("circle", { cx: w * lb[0], cy: hgt * lb[1], r: hgt * lb[2], fill: DAY.cloudTop }); }),
      h("rect", { x: 0, y: baseTop, width: w, height: baseH, rx: baseH * 0.5, fill: DAY.cloudTop }),
      lobes.map(function (lb) { return h("circle", { cx: w * lb[0] + hgt * lb[2] * 0.05, cy: hgt * lb[1] + hgt * lb[2] * 0.17, r: hgt * lb[2] * 0.95, fill: DAY.cloud }); }),
      h("rect", { x: 0, y: baseTop + baseH * 0.12, width: w, height: baseH * 0.88, rx: baseH * 0.44, fill: DAY.cloud }),
      h("path", { d: shadeD, fill: DAY.cloudShade })
    );
  }

  /* small day-sky birds: two-arc glyphs drifting slowly; flap via time */
  function DayBirds(p) {
    var seed = p.seed, count = p.count == null ? 4 : p.count, time = p.time,
      span = p.span == null ? 2200 : p.span, yBase = p.yBase == null ? 150 : p.yBase;
    return h("g", null, range(count, function (i) {
      var rx = random(seed + "-bx" + i), ry = random(seed + "-by" + i), rs = random(seed + "-bs" + i);
      var x = ((rx * span + time * (14 + rs * 10)) % (span + 280)) - 140;
      var y = yBase + ry * 190 + Math.sin(time * 0.7 + i * 2.2) * 9;
      var flap = Math.sin(time * 7 + i * 1.9) * 3.4;
      var s = 0.85 + rs * 0.5;
      return h("g", { transform: "translate(" + x + ", " + y + ") scale(" + s + ")", opacity: 0.5 },
        h("path", { d: "M-7,0 Q-3.5," + (-3.2 - flap) + " 0,0 Q3.5," + (-3.2 - flap) + " 7,0", fill: "none", stroke: "#2e4159", strokeWidth: 1.7, strokeLinecap: "round" }));
    }));
  }

  /* Mt. Fuji, redrawn for round 2 (same place, width and height as before).
     Built in "cone space": f = -1..1 across the mountain at height v (0 summit, 1 base), so a
     constant f is a gully line and everything drawn along one fans out with the cone.
     - profile: an exponential flank (steep under the summit, flaring to the base), a narrow
       crater rim, and the far wall of the crater seen through the dip in the near rim
     - snow: a hem of fingers lying in the gullies, rock ridges rising between them, a few
       strips of snow left further down
     - one light, sun top right: the flank away from it is one tone down on a single line
       through snow and rock; each ridge on the sunlit side throws one band of shade to its
       left across both, and its crest catches a blade of light
     No outlines. The drawing is static, so it is built once per size. */
  var _fujiMemo = {};
  function FujiMountain(p) {
    var cx = p.cx, baseY = p.baseY, w = p.w == null ? 1100 : p.w, ht = p.ht == null ? 420 : p.ht;
    var key = cx + "|" + baseY + "|" + w + "|" + ht;
    if (_fujiMemo[key]) return _fujiMemo[key];
    var peakY = baseY - ht;
    var S = 0.04, C = 0.46, K = 1.45, EK = Math.exp(K) - 1;
    function hw(v) { return S + C * (Math.exp(K * Math.max(v, 0)) - 1) / EK; }      // half-width at height v
    function P(q) { return [cx + q[0] * hw(q[1]) * w, peakY + q[1] * ht]; }
    function n(x) { return Math.round(x * 10) / 10; }
    function pt(q) { return n(q[0]) + "," + n(q[1]); }
    // Catmull-Rom through pixel points, continuing from pts[0]; a sub-range keeps the full list's tangents
    function curve(pts, i0, i1) {
      var out = "";
      for (var i = i0 || 0; i < (i1 == null ? pts.length - 1 : i1); i++) {
        var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
        out += "C" + pt([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]) + " " + pt([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]) + " " + pt(p2);
      }
      return out;
    }
    // an edge a -> b, straight in cone space (so it bends with the cone); bow > 1 hollows it toward b's gully line
    function edgeFV(a, b, bow, t) { var k = bow ? 1 - Math.pow(1 - t, bow) : t; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * t]; }
    function edgePts(a, b, bow) { var pts = [], N = 5; for (var j = 0; j <= N; j++) pts.push(P(edgeFV(a, b, bow, j / N))); return pts; }
    function edge(a, b, bow) { return curve(edgePts(a, b, bow)); }
    function chain(q) { var d = "M" + pt(P(q[0])); for (var i = 0; i < q.length - 1; i++) d += edge(q[i], q[i + 1]); return d + "Z"; }
    function line(q) { return q.slice(1).map(function (x) { return "L" + pt(P(x)); }).join(""); }

    // profile
    var KL = 0.43, KR = 0.4, SH = 0.024;     // where the snow leaves the left / right profile; the shoulders
    var rimL = [[-1, SH], [-0.8, 0], [-0.52, 0.007], [-0.3, 0.02]];                 // left shoulder -> the shade line
    var rimR = [[-0.3, 0.02], [0.08, 0.026], [0.36, 0.011], [0.64, 0.001], [0.86, 0.008], [1, SH]];
    function upL(v0, v1) { return edge([-1, v0], [-1, v1]); }
    function dnR(v0, v1) { return edge([1, v0], [1, v1]); }
    var body = "M" + pt(P([-1, 1])) + upL(1, 0.5) + upL(0.5, SH) + line(rimL) + line(rimR) + dnR(SH, 0.5) + dnR(0.5, 1) + "Z";
    var crater = "M" + [[-0.52, 0.007], [-0.2, 0.004], [0.2, 0.003], [0.64, 0.001], [0.36, 0.011], [0.08, 0.026], [-0.3, 0.02]].map(function (x) { return pt(P(x)); }).join("L") + "Z";

    // the snow hem, right to left: even = a finger tip in a gully, odd = the notch of a rock ridge
    var hem = [
      [1, KR], [0.78, 0.3], [0.62, 0.5], [0.46, 0.27], [0.33, 0.405], [0.2, 0.31], [0.07, 0.56], [-0.06, 0.285],
      [-0.18, 0.42], [-0.3, 0.245], [-0.44, 0.52], [-0.6, 0.3], [-0.74, 0.435], [-0.88, 0.315], [-1, KL]
    ];
    var MAIN = 9, BOW = 1.35;                // hem[MAIN] is the notch of the ridge the shade line runs down
    function hemFrom(i0) { var d = ""; for (var i = i0; i < hem.length - 1; i++) d += edge(hem[i], hem[i + 1], i % 2 ? BOW : 1 / BOW); return d; }
    var cap = "M" + pt(P([-1, KL])) + upL(KL, SH) + line(rimL) + line(rimR) + dnR(SH, KR) + hemFrom(0) + "Z";

    // the shade line: rim -> main notch -> base, the same line on snow and on rock
    var TB = [-0.225, 1];
    function onLine(v) { var t = (v - hem[MAIN][1]) / (TB[1] - hem[MAIN][1]); return [hem[MAIN][0] + (TB[0] - hem[MAIN][0]) * t, v]; }
    var shade = "M" + pt(P([-1, 1])) + upL(1, 0.5) + upL(0.5, SH) + line(rimL) + edge(rimL[3], hem[MAIN]) + edge(hem[MAIN], TB) + "Z";
    var capShade = "M" + pt(P([-1, KL])) + upL(KL, SH) + line(rimL) + edge(rimL[3], hem[MAIN]) + hemFrom(MAIN) + "Z";

    // a ridge on the sunlit side: one band of shade on the left of its crest. It starts in the snow above
    // the notch hem[i], follows the next finger's edge down to E, and carries on over the rock below.
    function ridge(i, va, df, vL, dfB, vB, vZ) {
      var N = hem[i], T = hem[i + 1], A = [N[0], va], L = [N[0] - df, vL], E = edgeFV(N, T, BOW, 0.6), B = [N[0] - dfB, vB], Z = [N[0], vZ];
      shade += chain([A, Z, B, E, L, A]);
      capShade += "M" + pt(P(A)) + edge(A, N) + curve(edgePts(N, T, BOW), 0, 3) + edge(E, L) + edge(L, A) + "Z";
    }
    ridge(3, 0.06, 0.13, 0.2, 0.105, 0.5, 0.88);
    ridge(7, 0.17, 0.085, 0.235, 0.08, 0.47, 0.7);
    ridge(1, 0.15, 0.1, 0.25, 0.085, 0.53, 0.78);
    // the sunlit face of a crest: a slim blade of light on its right
    function lit(a, b, df) { return chain([a, [a[0] + (b[0] - a[0]) * 0.3 + df, a[1] + (b[1] - a[1]) * 0.3], b, a]); }
    var light = lit(onLine(0.3), onLine(0.84), 0.06) + lit([0.46, 0.34], [0.46, 0.8], 0.055) + lit([0.78, 0.33], [0.78, 0.7], 0.05);
    // snow still lying in the gullies below the hem
    function sliver(fc, v0, v1, df) { var vm = v0 + (v1 - v0) * 0.3; return chain([[fc, v0], [fc + df, vm], [fc, v1], [fc - df, vm], [fc, v0]]); }
    cap += sliver(0.305, 0.44, 0.55, 0.018) + sliver(-0.2, 0.455, 0.585, 0.02) + sliver(0.6, 0.535, 0.65, 0.018);
    capShade += sliver(-0.455, 0.555, 0.665, 0.02) + sliver(-0.755, 0.47, 0.575, 0.02);

    return _fujiMemo[key] = h("g", { "data-cache": "fuji-" + key, "data-box": n(cx - w / 2 - 2) + " " + n(peakY - 4) + " " + n(w + 4) + " " + n(ht + 6) },
      h("path", { d: body, fill: DAY.fuji }),
      h("path", { d: shade, fill: DAY.fujiShade }),
      h("path", { d: light, fill: DAY.fujiLight }),
      h("path", { d: crater, fill: DAY.fujiCapShade }),
      h("path", { d: cap, fill: DAY.fujiCap }),
      h("path", { d: capShade, fill: DAY.fujiCapShade })
    );
  }

  function Vignette(p) {
    var opacity = p && p.opacity != null ? p.opacity : 0.5;
    return h("div", { style: { position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 78% 68% at 50% 46%, rgba(0,0,0,0) 58%, rgba(6,12,24,0.55) 100%)", opacity: opacity } });
  }

  function AnimatedRoute(p) {
    var d = p.d, length = p.length, draw = p.draw, flowOffset = p.flowOffset, stroke = p.stroke == null ? COLORS.verm : p.stroke,
      strokeWidth = p.strokeWidth == null ? 4.2 : p.strokeWidth, opacity = p.opacity == null ? 0.95 : p.opacity;
    var drawn = draw >= 1;
    return h("path", { d: d, fill: "none", stroke: stroke, strokeWidth: strokeWidth, strokeLinecap: "round",
      opacity: opacity * Math.min(1, draw * 3), strokeDasharray: drawn ? "3.5 11" : (length + " " + length), strokeDashoffset: drawn ? -flowOffset : length * (1 - draw) });
  }

  /* ---- Warehouse.tsx ---- */
  var WAREHOUSE_W = 720, WAREHOUSE_BAYS = [80, 320, 560], BAY_W = 100, BAY_H = 112, BAY_Y = 128;
  function bayWorldX(x, scale, i) { return x + WAREHOUSE_BAYS[i] * scale; }
  function Warehouse(p) {
    var x = p.x, y = p.y, scale = p.scale == null ? 1.8 : p.scale, shutterOpen = p.shutterOpen, rayPhase = p.rayPhase || 0, opacity = p.opacity == null ? 1 : p.opacity;
    var W = WAREHOUSE_W;
    return h("g", { transform: "translate(" + x + ", " + y + ") scale(" + scale + ") translate(0, -240)", opacity: opacity },
      h("ellipse", { cx: W / 2, cy: 244, rx: W * 0.56, ry: 9, fill: "rgba(10,20,36,0.28)" }),
      WAREHOUSE_BAYS.map(function (bx, i) {
        return h("g", { opacity: 0.5 },
          h("line", { x1: bx - 2, y1: 241, x2: bx - 2, y2: 252, stroke: COLORS.paper, strokeWidth: 2, opacity: 0.35 }),
          h("line", { x1: bx + BAY_W + 2, y1: 241, x2: bx + BAY_W + 2, y2: 252, stroke: COLORS.paper, strokeWidth: 2, opacity: 0.35 }));
      }),
      h("rect", { x: 0, y: 94, width: W, height: 146, rx: 3, fill: COLORS.paper }),
      range(6, function (i) { return h("line", { x1: 60 + i * 120, y1: 98, x2: 60 + i * 120, y2: 236, stroke: "rgba(16,31,54,0.08)", strokeWidth: 1.5 }); }),
      h("rect", { x: 0, y: 94, width: W, height: 146, rx: 3, fill: "none", stroke: COLORS.ink, strokeWidth: 3 }),
      h("rect", { x: 14, y: 44, width: W - 28, height: 52, rx: 3, fill: "#f7f6f2", stroke: COLORS.ink, strokeWidth: 2.6 }),
      h("rect", { x: 408, y: 55, width: 288, height: 16, rx: 3, fill: "rgba(150,180,215,0.3)", stroke: "rgba(16,31,54,0.35)", strokeWidth: 1.2 }),
      [0, 1, 2, 3, 4, 5, 6].map(function (i) { return h("line", { x1: 444 + i * 36, y1: 55, x2: 444 + i * 36, y2: 71, stroke: "rgba(16,31,54,0.3)", strokeWidth: 1.4 }); }),
      h("rect", { x: 408, y: 55, width: 288, height: 5, fill: "rgba(255,255,255,0.12)" }),
      h("rect", { x: -10, y: 28, width: W + 20, height: 18, rx: 2, fill: COLORS.ink2 }),
      range(15, function (i) { return h("rect", { x: 6 + i * 50, y: 18, width: 3.4, height: 10, fill: "#3D4D6B" }); }),
      h("line", { x1: 4, y1: 19, x2: W - 4, y2: 19, stroke: "#3D4D6B", strokeWidth: 2.4 }),
      h("rect", { x: W - 180, y: 4, width: 104, height: 24, rx: 2, fill: "#3A4A66", stroke: "rgba(245, 236, 234,0.25)", strokeWidth: 1.6 }),
      [0, 1, 2].map(function (i) { return h("line", { x1: W - 168 + i * 32, y1: 9, x2: W - 168 + i * 32, y2: 23, stroke: "rgba(245, 236, 234,0.18)", strokeWidth: 2 }); }),
      h("rect", { x: 64, y: 10, width: 52, height: 18, rx: 2, fill: "#3A4A66", stroke: "rgba(245, 236, 234,0.22)", strokeWidth: 1.6 }),
      h("rect", { x: 0, y: 94, width: W, height: 6, fill: COLORS.verm }),
      h("g", null,
        h("rect", { x: 26, y: 52, width: 344, height: 36, rx: 4, fill: COLORS.ink }),
        h("rect", { x: 26, y: 52, width: 7, height: 36, rx: 3, fill: COLORS.verm }),
        h("text", { x: 50, y: 78, fontFamily: FONTS.lat, fontSize: 23, fontWeight: 800, fill: COLORS.paper, letterSpacing: 0.6 }, CONTENT.brand.nameLat),
        h("line", { x1: 208, y1: 60, x2: 208, y2: 80, stroke: "rgba(245, 236, 234,0.28)", strokeWidth: 1.5 }),
        h("text", { x: 226, y: 76, fontFamily: FONTS.jp, fontSize: 15, fontWeight: 700, fill: "rgba(245, 236, 234,0.85)", letterSpacing: 1.5 }, CONTENT.brand.signSub)
      ),
      WAREHOUSE_BAYS.map(function (bx, i) {
        var open = clamp01(shutterOpen[i]);
        var lift = easeOutCubic(open) * (BAY_H - 6);
        var glow = easeOutCubic(clamp01((open - 0.15) / 0.85));
        return h("g", null,
          glow > 0.02 ? h("g", { opacity: glow },
            h("polygon", { points: (bx + 4) + "," + (BAY_Y + BAY_H - lift) + " " + (bx + BAY_W - 4) + "," + (BAY_Y + BAY_H - lift) + " " + (bx + BAY_W + 82) + ",244 " + (bx - 82) + ",244", fill: "url(#sanpouRay)" }),
            [0.25, 0.55, 0.8].map(function (f, j) {
              return h("line", { x1: bx + BAY_W * f, y1: BAY_Y + BAY_H - lift + 6, x2: bx + BAY_W * f + (f - 0.5) * 100, y2: 240, stroke: "rgba(255,236,200,0.18)", strokeWidth: 2.5, opacity: 0.35 + 0.3 * Math.sin(rayPhase * 1.7 + i * 2.1 + j * 2.6) });
            })
          ) : null,
          h("rect", { x: bx - 4, y: BAY_Y - 4, width: BAY_W + 8, height: BAY_H + 4, rx: 2.5, fill: "none", stroke: "rgba(16,31,54,0.2)", strokeWidth: 2 }),
          h("rect", { x: bx, y: BAY_Y, width: BAY_W, height: BAY_H, rx: 2.5, fill: COLORS.recessed }),
          h("rect", { x: bx, y: BAY_Y, width: BAY_W, height: BAY_H, rx: 2.5, fill: "url(#sanpouInterior)", opacity: glow * 0.95 }),
          h("g", { opacity: glow * 0.55 },
            i === 1 ? h("g", { fill: "#2E3C56" },
              h("rect", { x: bx + 38, y: BAY_Y + BAY_H - 30, width: 26, height: 16, rx: 2.5 }),
              h("path", { d: "M" + (bx + 42) + "," + (BAY_Y + BAY_H - 30) + " L" + (bx + 44) + "," + (BAY_Y + BAY_H - 44) + " L" + (bx + 58) + "," + (BAY_Y + BAY_H - 44) + " L" + (bx + 60) + "," + (BAY_Y + BAY_H - 30) + " Z", fill: "none", stroke: "#2E3C56", strokeWidth: 2.4 }),
              h("rect", { x: bx + 64, y: BAY_Y + BAY_H - 46, width: 3.4, height: 32 }),
              h("rect", { x: bx + 64, y: BAY_Y + BAY_H - 16, width: 14, height: 2.8 }),
              h("circle", { cx: bx + 44, cy: BAY_Y + BAY_H - 11, r: 4.5 }),
              h("circle", { cx: bx + 60, cy: BAY_Y + BAY_H - 11, r: 4.5 })
            ) : null,
            h("rect", { x: bx + 10, y: BAY_Y + BAY_H - 34, width: 24, height: 22, rx: 1, fill: "#3A4A66" }),
            h("rect", { x: bx + 10, y: BAY_Y + BAY_H - 46, width: 24, height: 9, rx: 1, fill: "#33425C" }),
            h("rect", { x: bx + 42, y: BAY_Y + BAY_H - 26, width: 20, height: 14, rx: 1, fill: "#33425C" }),
            h("rect", { x: bx + 70, y: BAY_Y + BAY_H - 38, width: 18, height: 26, rx: 1, fill: "#2E3C56" })
          ),
          h("g", { clipPath: "url(#sanpouBay" + i + ")" },
            h("g", { transform: "translate(0, " + (-lift) + ")" },
              h("rect", { x: bx, y: BAY_Y, width: BAY_W, height: BAY_H, rx: 2.5, fill: COLORS.ink2 }),
              range(9, function (s) { return h("line", { x1: bx + 4, y1: BAY_Y + 10 + s * 12, x2: bx + BAY_W - 4, y2: BAY_Y + 10 + s * 12, stroke: "rgba(245, 236, 234,0.12)", strokeWidth: 2 }); }),
              h("rect", { x: bx + 26, y: BAY_Y + BAY_H - 8, width: BAY_W - 52, height: 4, rx: 2, fill: "rgba(245, 236, 234,0.22)" })
            )
          ),
          h("rect", { x: bx - 5, y: BAY_Y - 9, width: BAY_W + 10, height: 8, rx: 2, fill: "#3A4A66" }),
          h("rect", { x: bx - 3, y: BAY_Y + BAY_H - 12, width: 6, height: 12, rx: 1.5, fill: "#1A2434" }),
          h("rect", { x: bx + BAY_W - 3, y: BAY_Y + BAY_H - 12, width: 6, height: 12, rx: 1.5, fill: "#1A2434" }),
          h("rect", { x: bx + BAY_W / 2 - 10, y: BAY_Y - 40, width: 20, height: 6, rx: 3, fill: "#c9d2dc", opacity: 0.9 }),
          h("rect", { x: bx + BAY_W / 2 - 14, y: BAY_Y - 25, width: 28, height: 14, rx: 2.5, fill: COLORS.ink }),
          h("text", { x: bx + BAY_W / 2, y: BAY_Y - 14.5, textAnchor: "middle", fontFamily: FONTS.lat, fontSize: 10, fontWeight: 800, fill: COLORS.paper, letterSpacing: 1 }, "0" + (i + 1))
        );
      }),

      h("defs", null,
        WAREHOUSE_BAYS.map(function (bx, i) { return h("clipPath", { id: "sanpouBay" + i }, h("rect", { x: bx, y: BAY_Y, width: BAY_W, height: BAY_H, rx: 2.5 })); }),
        h("linearGradient", { id: "sanpouRay", x1: "0", y1: "0", x2: "0", y2: "1" }, h("stop", { offset: "0", stopColor: "rgba(255,236,200,0.34)" }), h("stop", { offset: "1", stopColor: "rgba(255,236,200,0)" })),
        h("linearGradient", { id: "sanpouInterior", x1: "0", y1: "0", x2: "0", y2: "1" }, h("stop", { offset: "0", stopColor: "rgba(255,224,176,0.10)" }), h("stop", { offset: "1", stopColor: "rgba(255,224,176,0.42)" }))
      )
    );
  }

  /* ---- cards.tsx ---- */
  function KpiCard(p) {
    if (typeof window !== "undefined" && window.JX_CLEAN_HERO) return null;
    var x = p.x, y = p.y, width = p.width, title = p.title, eyebrow = p.eyebrow, enter = p.enter, bob = p.bob || 0, children = p.children, rightSlot = p.rightSlot, footer = p.footer;
    return h("div", { style: { position: "absolute", left: x, top: y, width: width, transform: "translateY(" + ((1 - enter) * 36 + bob) + "px) scale(" + (0.94 + 0.06 * enter) + ")", opacity: clamp01(enter * 1.6), transformOrigin: "50% 100%" } },
      h("div", { style: { position: "absolute", inset: -46, background: "radial-gradient(58% 58% at 50% 42%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0) 72%)", pointerEvents: "none" } }),
      h("div", { style: { position: "relative", borderRadius: 16, padding: "26px 34px 30px", background: COLORS.cardGlass, border: "1px solid " + COLORS.hairline, boxShadow: "0 22px 52px rgba(22,41,63,0.22), 0 2px 6px rgba(22,41,63,0.08)", backdropFilter: "blur(9px)" } },
        h("div", { style: { width: 56, height: 4, borderRadius: 2, background: COLORS.teal, marginBottom: 14, transformOrigin: "0 50%", transform: "scaleX(" + clamp01((enter - 0.25) / 0.55) + ")" } }),
        h("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between" } },
          h("div", null,
            h("div", { style: { fontFamily: FONTS.jp, fontSize: 26, fontWeight: 700, color: COLORS.cardInk, lineHeight: 1.2 } }, title),
            h("div", { style: { fontFamily: FONTS.lat, fontSize: 12.5, fontWeight: 700, color: COLORS.teal, letterSpacing: 3.5, marginTop: 6 } }, eyebrow)
          ),
          rightSlot || null
        ),
        h("div", { style: { marginTop: 22 } }, children || null),
        footer ? [h("div", { style: { height: 1, background: COLORS.cardLine, marginTop: 20 } }), h("div", { style: { fontFamily: FONTS.jp, fontSize: 12.5, color: "#7d8895", marginTop: 12, letterSpacing: 0.5 } }, footer)] : null
      )
    );
  }
  function Stat(p) {
    var to = p.to, progress = p.progress, suffix = p.suffix == null ? "" : p.suffix, decimals = p.decimals == null ? 0 : p.decimals, size = p.size == null ? 48 : p.size, color = p.color == null ? COLORS.teal : p.color;
    var e = easeInOutCubic(clamp01(progress));
    var v = to * e;
    var s = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString("en-US");
    return h("span", { style: { fontFamily: FONTS.lat, fontWeight: 900, fontSize: size, color: color, lineHeight: 1 } }, s + suffix);
  }
  function RingGauge(p) {
    var progress = p.progress, target = p.target, label = p.label, size = p.size == null ? 184 : p.size;
    var e = easeInOutCubic(clamp01(progress));
    var R = size / 2 - 15, C = 2 * Math.PI * R, pct = Math.round(target * e);
    return h("svg", { width: size, height: size, viewBox: "0 0 " + size + " " + size },
      h("circle", { cx: size / 2, cy: size / 2, r: R - 9, fill: "rgba(42,127,140,0.05)" }),
      h("circle", { cx: size / 2, cy: size / 2, r: R, fill: "none", stroke: "rgba(22,41,63,0.09)", strokeWidth: 14 }),
      h("circle", { cx: size / 2, cy: size / 2, r: R, fill: "none", stroke: COLORS.teal, strokeWidth: 14, strokeLinecap: "round", strokeDasharray: C, strokeDashoffset: C * (1 - (target / 100) * e), transform: "rotate(-90 " + (size / 2) + " " + (size / 2) + ")" }),
      h("text", { x: size / 2, y: size / 2 + 6, textAnchor: "middle", fontFamily: FONTS.lat, fontSize: 37, fontWeight: 800, fill: COLORS.cardInk }, pct + "%"),
      h("text", { x: size / 2, y: size / 2 + 32, textAnchor: "middle", fontFamily: FONTS.jp, fontSize: 14, fill: COLORS.textDim }, label)
    );
  }
  function BarChart(p) {
    var heights = p.heights, progress = p.progress, width = p.width == null ? 330 : p.width, height = p.height == null ? 150 : p.height;
    var n = heights.length, bw = 34, gap = (width - n * bw) / (n - 1);
    return h("svg", { width: width, height: height + 18, viewBox: "0 -18 " + width + " " + (height + 18), style: { overflow: "visible" } },
      h("defs", null,
        h("linearGradient", { id: "barGrad", x1: "0", y1: "0", x2: "0", y2: "1" },
          h("stop", { offset: "0", stopColor: "#37929e" }),
          h("stop", { offset: "1", stopColor: "#226b76" }))
      ),
      h("rect", { x: -14, y: -16, width: width + 28, height: height + 24, rx: 10, fill: "#f3f8fa", stroke: "rgba(22,41,63,0.08)", strokeWidth: 1 }),
      [0.25, 0.5, 0.75].map(function (g) { return h("line", { x1: 0, y1: height * g, x2: width, y2: height * g, stroke: "rgba(22,41,63,0.09)", strokeWidth: 1, strokeDasharray: "3 6" }); }),
      h("line", { x1: -6, y1: height - 1, x2: width + 6, y2: height - 1, stroke: "rgba(22,41,63,0.22)", strokeWidth: 1.5 }),
      heights.map(function (hf, i) { return h("line", { x1: i * (bw + gap) + bw / 2, y1: height - 1, x2: i * (bw + gap) + bw / 2, y2: height + 4, stroke: "rgba(22,41,63,0.2)", strokeWidth: 1.2 }); }),
      heights.map(function (hf, i) {
        var k = easeInOutCubic(clamp01((progress - i * 0.06) / 0.7));
        var hgt = hf * (height - 26) * k;
        var last = i === n - 1;
        return h("g", null,
          h("rect", { x: i * (bw + gap), y: height - hgt, width: bw, height: hgt, rx: 4.5, fill: last ? "url(#barGrad)" : "#c3dce1", stroke: last ? "none" : "rgba(22,41,63,0.08)", strokeWidth: 1 }),
          hgt > 10 ? h("rect", { x: i * (bw + gap) + 3, y: height - hgt + 3, width: bw - 6, height: 4, rx: 2, fill: "rgba(255,255,255," + (last ? 0.35 : 0.55) + ")" }) : null,
          h("text", { x: i * (bw + gap) + bw / 2, y: height - hgt - 8, textAnchor: "middle", fontFamily: FONTS.lat, fontSize: 13.5, fontWeight: 700, fill: last ? COLORS.cardInk : COLORS.cardMut, opacity: k }, Math.round(hf * 100 * k))
        );
      })
    );
  }
  function FleetBars(p) {
    var rows = p.rows, progress = p.progress, width = p.width == null ? 520 : p.width;
    var trackW = width - 174;
    return h("div", { style: { display: "flex", flexDirection: "column", gap: 19, width: width } },
      rows.map(function (rw, i) {
        var k = easeInOutCubic(clamp01((progress - i * 0.08) / 0.66));
        return h("div", { style: { display: "flex", alignItems: "center", gap: 18 } },
          h("div", { style: { fontFamily: FONTS.jp, fontSize: 18, color: COLORS.textBody, width: 96 } }, rw.label),
          h("div", { style: { position: "relative", width: trackW, height: 24, borderRadius: 8, background: "rgba(22,41,63,0.07)" } },
            h("div", { style: { position: "absolute", left: 0, top: 0, bottom: 0, width: trackW * rw.fill * k, borderRadius: 8, background: i === rows.length - 1 ? COLORS.teal : "rgba(42,127,140,0.38)", boxShadow: i === rows.length - 1 ? "0 0 " + (14 * k) + "px rgba(42,127,140," + (0.35 * k) + ")" : "none" } })
          ),
          h("div", { style: { fontFamily: FONTS.lat, fontSize: 16, fontWeight: 800, color: i === rows.length - 1 ? COLORS.tealD : COLORS.cardMut, width: 56, textAlign: "right" } }, Math.round(rw.fill * 100 * k) + "%")
        );
      })
    );
  }
  function TrendChart(p) {
    var points = p.points, progress = p.progress, width = p.width == null ? 430 : p.width, height = p.height == null ? 160 : p.height, time = p.time == null ? 0 : p.time;
    var e = easeInOutCubic(clamp01(progress));
    var n = points.length, step = width / (n - 1);
    var coords = points.map(function (v, i) { return { x: i * step, y: height - v * height }; });
    // smooth monotone-ish curve (Catmull-Rom -> cubic bezier)
    var dLine = "M" + coords[0].x.toFixed(1) + "," + coords[0].y.toFixed(1);
    for (var ci = 0; ci < n - 1; ci++) {
      var p0 = coords[Math.max(0, ci - 1)], p1 = coords[ci], p2 = coords[ci + 1], p3 = coords[Math.min(n - 1, ci + 2)];
      dLine += " C" + (p1.x + (p2.x - p0.x) / 6).toFixed(1) + "," + (p1.y + (p2.y - p0.y) / 6).toFixed(1) +
        " " + (p2.x - (p3.x - p1.x) / 6).toFixed(1) + "," + (p2.y - (p3.y - p1.y) / 6).toFixed(1) +
        " " + p2.x.toFixed(1) + "," + p2.y.toFixed(1);
    }
    var dArea = dLine + " L" + width + "," + height + " L0," + height + " Z";
    var tipX = width * e;
    var yAt = function (x) {
      if (x <= 0) return coords[0].y;
      if (x >= width) return coords[n - 1].y;
      var i = Math.min(n - 2, Math.floor(x / step));
      var f = (x - coords[i].x) / step;
      return coords[i].y + (coords[i + 1].y - coords[i].y) * f;
    };
    return h("svg", { width: width, height: height + 10, viewBox: "0 -6 " + width + " " + (height + 12), style: { overflow: "visible" } },
      h("defs", null,
        h("clipPath", { id: "trendClip" }, h("rect", { x: 0, y: -6, width: tipX, height: height + 12 })),
        h("linearGradient", { id: "trendFill", x1: "0", y1: "0", x2: "0", y2: "1" },
          h("stop", { offset: "0", stopColor: "rgba(42,127,140,0.24)" }),
          h("stop", { offset: "1", stopColor: "rgba(42,127,140,0.02)" }))
      ),
      h("rect", { x: -12, y: -10, width: width + 24, height: height + 18, rx: 10, fill: "#f3f8fa", stroke: "rgba(22,41,63,0.08)", strokeWidth: 1 }),
      [0.25, 0.5, 0.75].map(function (g) { return h("line", { x1: 0, y1: height * g, x2: width, y2: height * g, stroke: "rgba(22,41,63,0.09)", strokeWidth: 1, strokeDasharray: "3 6" }); }),
      h("line", { x1: -6, y1: height, x2: width + 6, y2: height, stroke: "rgba(22,41,63,0.22)", strokeWidth: 1.5 }),
      range(7, function (i) { return h("line", { x1: (width / 6) * i, y1: height, x2: (width / 6) * i, y2: height + 4, stroke: "rgba(22,41,63,0.18)", strokeWidth: 1.2 }); }),
      h("g", { clipPath: "url(#trendClip)" },
        h("path", { d: dArea, fill: "url(#trendFill)" }),
        h("path", { d: dLine, fill: "none", stroke: COLORS.teal, strokeWidth: 3.5, strokeLinecap: "round", strokeLinejoin: "round" }),
        coords.map(function (pt, pi) { return (pi % 2 === 1 && pi < n - 1) ? h("circle", { cx: pt.x, cy: pt.y, r: 3.4, fill: "#fff", stroke: COLORS.teal, strokeWidth: 2 }) : null; })
      ),
      e >= 0.999 ? h("circle", { cx: tipX, cy: yAt(tipX), r: 8 + ((time * 0.8) % 1) * 16, fill: "none", stroke: COLORS.teal, strokeWidth: 2, opacity: (1 - ((time * 0.8) % 1)) * 0.5 }) : null,
      h("circle", { cx: tipX, cy: yAt(tipX), r: 6 + (e >= 0.999 ? Math.sin(time * 3) * 0.8 : 0), fill: "#fff", stroke: COLORS.teal, strokeWidth: 3, opacity: Math.min(1, e / 0.06) })
    );
  }
  function StatusPill(p) {
    var label = p.label, time = p.time;
    var pulse = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(time * 3));
    return h("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "7px 18px", borderRadius: 999, background: "rgba(30,158,102,0.1)", border: "1px solid rgba(30,158,102,0.4)" } },
      h("div", { style: { width: 10, height: 10, borderRadius: 999, background: COLORS.liveGreen, opacity: pulse } }),
      h("span", { style: { fontFamily: FONTS.jp, fontSize: 16, fontWeight: 700, color: COLORS.liveGreenText } }, label)
    );
  }

  /* ---- SceneTitle.tsx ---- */
  function _merge(a, b) { var o = {}; for (var k in a) o[k] = a[k]; for (var k2 in b) o[k2] = b[k2]; return o; }
  function SceneTitle(p) {
    if (typeof window !== "undefined" && window.JX_CLEAN_HERO) return null;
    var no = p.no, heading = p.heading, enter = p.enter;
    var line = function (k, delay) { var pp = clamp01((k - delay) / (1 - delay)); var e = 1 - Math.pow(1 - pp, 3); return { opacity: e, transform: "translateY(" + ((1 - e) * 18) + "px)" }; };
    return h("div", { style: { position: "absolute", left: 110, top: 84 } },
      h("div", { style: _merge({ display: "flex", alignItems: "center", gap: 12 }, line(enter, 0)) },
        h("div", { style: { width: 10, height: 10, borderRadius: 999, background: COLORS.teal } }),
        h("span", { style: { fontFamily: FONTS.lat, fontSize: 15, fontWeight: 700, letterSpacing: 4, color: "#12314e", textShadow: "0 1px 10px rgba(255,255,255,0.55)" } }, "JOURNEY　輸送のながれ")
      ),
      h("div", { style: _merge({ fontFamily: FONTS.lat, fontSize: 17, fontWeight: 700, letterSpacing: 3.5, color: "rgba(16,31,54,0.6)", marginTop: 22 }, line(enter, 0.18)) }, no),
      h("div", { style: _merge({ fontFamily: FONTS.jp, fontSize: 44, fontWeight: 800, letterSpacing: -0.2, color: "#0d2036", marginTop: 10, maxWidth: 900, lineHeight: 1.4, textShadow: "0 1px 14px rgba(255,255,255,0.5)" }, line(enter, 0.32)) }, heading),
      h("div", { style: { width: 64, height: 4, borderRadius: 2, background: COLORS.teal, marginTop: 16, transformOrigin: "0 50%", transform: "scaleX(" + clamp01((enter - 0.55) / 0.45) + ")" } })
    );
  }

  /* ---- SceneCaption: short designed subline that replaces the data cards ---- */
  function SceneCaption(p) {
    if (typeof window !== "undefined" && window.JX_CLEAN_HERO) return null;
    var e = clamp01((p.enter == null ? 1 : p.enter) * 1.4);
    var rise = 1 - Math.pow(1 - e, 3);
    var bob = p.bob || 0;
    return h("div", { style: { position: "absolute", left: p.x, top: p.y, width: p.width || 660,
        display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right",
        opacity: rise, transform: "translateY(" + ((1 - rise) * 30 + bob) + "px)" } },
      h("div", { style: { display: "flex", alignItems: "center", gap: 12 } },
        h("span", { style: { fontFamily: FONTS.lat, fontSize: 15, fontWeight: 800, letterSpacing: 5, color: COLORS.tealD, textShadow: "0 1px 12px rgba(255,255,255,0.65)" } }, p.eyebrow),
        h("div", { style: { width: 30, height: 3, borderRadius: 2, background: COLORS.teal, opacity: 0.75 } })
      ),
      h("div", { style: { fontFamily: FONTS.jp, fontSize: 39, fontWeight: 800, color: "#0d2036", marginTop: 15, lineHeight: 1.5, letterSpacing: 0.5, textShadow: "0 2px 18px rgba(255,255,255,0.7), 0 0 48px rgba(255,255,255,0.45)" } }, p.text),
      h("div", { style: { width: 60, height: 4, borderRadius: 2, background: COLORS.teal, marginTop: 16, transformOrigin: "100% 50%", transform: "scaleX(" + clamp01((e - 0.35) / 0.5) + ")" } })
    );
  }

  /* ---- LogoReveal.tsx ---- */
  function LogoReveal(p) {
    var enter = p.enter, flash = p.flash;
    var e = clamp01(enter); var N = 14;
    return h("div", { style: { position: "relative", display: "flex", alignItems: "center", justifyContent: "center", gap: 26 } },
      h("svg", { width: 560, height: 300, viewBox: "-280 -150 560 300", style: { position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", overflow: "visible", pointerEvents: "none" } },
        (flash > 0 && flash < 1) ? range(N, function (i) {
          var a = (i / N) * Math.PI * 2 + random("flash-a" + i) * 0.5;
          var dist = (60 + random("flash-d" + i) * 150) * (1 - Math.pow(1 - flash, 3));
          var rr = (1.6 + random("flash-r" + i) * 2.6) * (1 - flash * 0.6);
          return h("circle", { cx: Math.cos(a) * dist, cy: Math.sin(a) * dist * 0.6, r: rr, fill: i % 3 === 0 ? COLORS.vermSoft : "rgba(245, 236, 234,0.8)", opacity: (1 - flash) * 0.9 });
        }) : null,
        (flash > 0 && flash < 1) ? h("circle", { r: 40 + flash * 190, fill: "none", stroke: "rgba(178, 104, 88,0.5)", strokeWidth: 2, opacity: (1 - flash) * 0.7 }) : null
      ),
      h("div", { style: { display: "flex", alignItems: "center", gap: 24, transform: "scale(" + (0.7 + 0.3 * e) + ")", opacity: e } },
        h("img", { src: "assets/logo.png", alt: "", style: { width: 110, height: 110, objectFit: "contain", filter: "drop-shadow(0 10px 26px rgba(16,31,54,0.28))" } }),
        h("div", null,
          h("div", { style: { fontFamily: FONTS.jp, fontSize: 54, fontWeight: 800, color: "#0d2036", textShadow: "0 2px 16px rgba(255,255,255,0.5)", letterSpacing: 2 } }, CONTENT.brand.nameJp),
          h("div", { style: { fontFamily: FONTS.lat, fontSize: 14, fontWeight: 700, color: "rgba(16,31,54,0.55)", letterSpacing: 5, marginTop: 4 } }, "SANPOU UNYU　SINCE 1975")
        )
      )
    );
  }

  /* ---- CoverageMap.tsx (JRMAP is a global from mapdata.js; bounds computed lazily) */
  var _mapInit = null;
  function mapInit() {
    if (_mapInit) return _mapInit;
    var PAD = 38, x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    JRMAP.covered.forEach(function (c) {
      var nums = c.d.match(/-?\d+(\.\d+)?/g) || [];
      for (var i = 0; i + 1 < nums.length; i += 2) { var x = Number(nums[i]), y = Number(nums[i + 1]); if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    });
    var bounds = [x0 - PAD, y0 - PAD, x1 - x0 + PAD * 2, y1 - y0 + PAD * 2];
    var HUB = JRMAP.bases.itabashi;
    var order = JRMAP.covered.slice().sort(function (a, b) { return Math.hypot(a.cx - HUB.x, a.cy - HUB.y) - Math.hypot(b.cx - HUB.x, b.cy - HUB.y); });
    var REVEAL_RANK = {}; order.forEach(function (c, i) { REVEAL_RANK[c.en] = i; });
    _mapInit = { bounds: bounds, HUB: HUB, REVEAL_RANK: REVEAL_RANK };
    return _mapInit;
  }
  var LABEL_NUDGE = { "東京": [0, 16], "埼玉": [-27, -16], "神奈川": [0, 12], "千葉": [4, 2], "茨城": [10, -2], "栃木": [6, -8], "群馬": [-10, -6], "新潟": [-4, -4] };
  var ROUTE_ORDER = ["CHIBA", "IBARAKI", "TOCHIGI", "GUNMA", "NIIGATA", "KANAGAWA", "SAITAMA"];
  var MAP_FONT = 16.5;
  function heatFill(ht) { var a = [0xf0, 0xd9, 0xb8], b = [0xcf, 0x42, 0x26]; var L = function (i) { return Math.round(a[i] + (b[i] - a[i]) * Math.pow(ht, 0.8)); }; return "rgb(" + L(0) + "," + L(1) + "," + L(2) + ")"; }
  function LabelPlate(p) {
    var x = p.x, y = p.y, text = p.text, opacity = p.opacity;
    var w = text.length * MAP_FONT + 20;
    return h("g", { opacity: opacity },
      h("rect", { x: x - w / 2, y: y - 16, width: w, height: 25, rx: 12.5, fill: "rgba(10,20,36,0.82)", stroke: "rgba(245, 236, 234,0.25)", strokeWidth: 1 }),
      h("text", { x: x, y: y + 2.5, textAnchor: "middle", fontFamily: FONTS.jp, fontWeight: 700, fontSize: MAP_FONT, fill: "#fff" }, text)
    );
  }
  function CoverageMap(p) {
    var prefProgress = p.prefProgress, routeProgress = p.routeProgress, pinProgress = p.pinProgress, flowTime = p.flowTime;
    var mi = mapInit(), bounds = mi.bounds, hub = mi.HUB, REVEAL_RANK = mi.REVEAL_RANK;
    var pinE = easeOutCubic(clamp01(pinProgress));
    var pop = pinProgress > 0 ? 1 + 0.22 * Math.sin(Math.min(1, pinProgress) * Math.PI) : 0;
    var legendE = easeOutCubic(clamp01(prefProgress * 1.4 - 0.3));
    return h("svg", { viewBox: bounds.join(" "), width: "100%", height: "100%", style: { overflow: "hidden" } },
      h("defs", null,
        h("radialGradient", { id: "landFadeGrad", cx: "52%", cy: "50%", r: "50%" }, h("stop", { offset: "34%", stopColor: "#fff" }), h("stop", { offset: "62%", stopColor: "#8a8a8a" }), h("stop", { offset: "86%", stopColor: "#000" })),
        h("mask", { id: "landFade" }, h("rect", { x: bounds[0] - 60, y: bounds[1] - 60, width: bounds[2] + 120, height: bounds[3] + 120, fill: "url(#landFadeGrad)" }))
      ),
      h("g", { mask: "url(#landFade)" }, JRMAP.greys.map(function (d) { return h("path", { d: d, fill: COLORS.greyLand, stroke: "rgba(10,20,36,0.35)", strokeWidth: 0.9, opacity: 0.5 }); })),
      JRMAP.covered.map(function (cp) {
        var k = clamp01((prefProgress - REVEAL_RANK[cp.en] * 0.055) * 1.5); var e = easeOutCubic(k);
        return h("g", { transform: "translate(0, " + ((1 - e) * 9) + ")" }, h("path", { d: cp.d, fill: heatFill(cp.heat), stroke: "rgba(245,242,234,0.55)", strokeWidth: 1.2, strokeLinejoin: "round", opacity: e * 0.98 }));
      }),
      ROUTE_ORDER.map(function (en, i) {
        var cp = JRMAP.covered.find(function (c) { return c.en === en; });
        if (!cp) return null;
        var len = Math.hypot(cp.cx - hub.x, cp.cy - hub.y);
        var draw = clamp01((routeProgress - i * 0.07) * 1.7);
        return AnimatedRoute({ d: "M" + hub.x + "," + hub.y + " L" + cp.cx + "," + cp.cy, length: len, draw: draw, flowOffset: flowTime * 22, strokeWidth: 3.2, opacity: 0.8 });
      }),
      JRMAP.covered.map(function (cp) {
        var e = easeOutCubic(clamp01((prefProgress - REVEAL_RANK[cp.en] * 0.055) * 1.5));
        var nd = LABEL_NUDGE[cp.jp] || [0, 0];
        return LabelPlate({ x: cp.cx + nd[0], y: cp.cy + nd[1], text: cp.jp, opacity: e });
      }),
      ["shiki", "iruma"].map(function (id, j) {
        var b = JRMAP.bases[id];
        var e = easeOutCubic(clamp01(pinProgress * 1.3 - 0.25 - j * 0.15));
        var bounce = e * (1 + 0.28 * Math.sin(Math.min(1, e) * Math.PI));
        // spread #2 up-left and #3 down-left so the two circles never touch
        var off = id === "shiki" ? [-27, -21] : [-16, 20];
        var pp = (flowTime * 0.5 + j * 0.4) % 1;
        return h("g", { transform: "translate(" + b.x + ", " + b.y + ")", opacity: e },
          h("line", { x1: 0, y1: 0, x2: off[0] * 0.6, y2: off[1] * 0.6, stroke: COLORS.ink, strokeWidth: 1.6, opacity: 0.55 }),
          h("circle", { r: 3, fill: COLORS.ink, opacity: 0.85 }),
          h("g", { transform: "translate(" + off[0] + ", " + off[1] + ") scale(" + bounce + ")" },
            h("circle", { r: 10 + pp * 7, fill: "none", stroke: COLORS.ink, strokeWidth: 1.4, opacity: (1 - pp) * 0.35 }),
            h("circle", { r: 11.5, fill: "rgba(255,255,255,0.5)" }),
            h("circle", { r: 10, fill: "#fff", stroke: COLORS.ink, strokeWidth: 2.4 }),
            h("text", { y: 4.5, textAnchor: "middle", fontFamily: FONTS.lat, fontWeight: 800, fontSize: 12, fill: COLORS.ink }, j + 2))
        );
      }),
      h("g", { transform: "translate(" + mi.HUB.x + ", " + mi.HUB.y + ")", opacity: pinE },
        [0, 1].map(function (j) { var pp = (flowTime * 0.45 + j * 0.5) % 1; return h("circle", { r: 13 + pp * 30, fill: "none", stroke: COLORS.verm, strokeWidth: 2, opacity: pinE * (1 - pp) * 0.55 }); }),
        h("g", { transform: "scale(" + (pop * 0.82) + ")" },
          h("ellipse", { cy: 3, rx: 9, ry: 3.4, fill: "rgba(10,20,36,0.35)" }),
          h("path", { d: "M0,0 C-13.5,-16.5 -15,-28.5 0,-39 C15,-28.5 13.5,-16.5 0,0 Z", fill: COLORS.verm, stroke: "#fff", strokeWidth: 3 }),
          h("circle", { cy: -23, r: 12, fill: "#fff", stroke: "rgba(10,20,36,0.18)", strokeWidth: 1 }),
          h("text", { y: -18.5, textAnchor: "middle", fontFamily: FONTS.lat, fontWeight: 800, fontSize: 13, fill: COLORS.ink }, "1")
        )
      ),
      window.JX_CLEAN_HERO ? null : h("g", { transform: "translate(" + (bounds[0] + 22) + ", " + (bounds[1] + bounds[3] - 58) + ")", opacity: legendE },
        h("rect", { x: 0, y: 0, width: 172, height: 46, rx: 9, fill: "rgba(10,20,36,0.78)", stroke: "rgba(245, 236, 234,0.22)", strokeWidth: 1 }),
        h("rect", { x: 12, y: 9, width: 13, height: 10, rx: 2.5, fill: heatFill(0.75) }),
        h("text", { x: 32, y: 18.5, fontFamily: FONTS.jp, fontSize: 11.5, fontWeight: 600, fill: "rgba(245, 236, 234,0.9)" }, "配送対応エリア"),
        h("rect", { x: 12, y: 27, width: 13, height: 10, rx: 2.5, fill: COLORS.greyLand }),
        h("text", { x: 32, y: 36.5, fontFamily: FONTS.jp, fontSize: 11.5, fontWeight: 600, fill: "rgba(245, 236, 234,0.6)" }, "営業エリア外")
      )
    );
  }

  /* ============================== SCENES ============================== */
  var GROUND = 880, B_SCALE = 1.9, T_SCALE = 2.0, SUPPLIER_X = 80, TRUCK_PARK_1 = 760, WAREHOUSE_X = 1980, WORLD_W = 4800;
  function dockRear(i) { return bayWorldX(WAREHOUSE_X, B_SCALE, i) + BAY_W * B_SCALE + 15; }

  function parcelPose(t, from, to, groundY) {
    var ANT = 0.13, ARC = 0.56, LAND = 0.66, SET = 0.76;
    var landX = to.x - 46;
    if (t <= 0 || t >= 1) return null;
    if (t < ANT) {
      var k = t / ANT;
      return { x: from.x, y: from.y - 3 * k, squash: 1 + 0.09 * Math.sin(k * Math.PI), stretch: 1, rot: 0, shadow: 0.85, op: 1, gy: from.y };
    }
    if (t < ARC) {
      var k2 = easeInOutCubic((t - ANT) / (ARC - ANT));
      var mx = (from.x + landX) / 2;
      var apex = Math.min(from.y, groundY) - 112;
      var x = (1 - k2) * (1 - k2) * from.x + 2 * (1 - k2) * k2 * mx + k2 * k2 * landX;
      var y = (1 - k2) * (1 - k2) * from.y + 2 * (1 - k2) * k2 * apex + k2 * k2 * groundY;
      return { x: x, y: y, squash: 1, stretch: 1 + 0.05 * Math.sin(k2 * Math.PI), rot: Math.sin(k2 * Math.PI) * 2.5 * Math.sign(landX - from.x), shadow: 0.3, op: 1, gy: groundY };
    }
    if (t < LAND) {
      var k3 = (t - ARC) / (LAND - ARC);
      return { x: landX, y: groundY, squash: 1 + 0.12 * Math.sin(k3 * Math.PI), stretch: 1, rot: 0, shadow: 1, op: 1, gy: groundY };
    }
    if (t < SET) {
      var k4 = (t - LAND) / (SET - LAND);
      return { x: landX, y: groundY, squash: 1 + 0.05 * Math.sin(k4 * Math.PI * 2) * (1 - k4), stretch: 1, rot: 0, shadow: 1, op: 1, gy: groundY };
    }
    var k5 = easeInOutCubic((t - SET) / (1 - SET));
    var hopApex = groundY - 95;
    var mx2 = (landX + to.x + 40) / 2;
    var x2 = (1 - k5) * (1 - k5) * landX + 2 * (1 - k5) * k5 * mx2 + k5 * k5 * (to.x + 40);
    var y2 = (1 - k5) * (1 - k5) * groundY + 2 * (1 - k5) * k5 * hopApex + k5 * k5 * to.y;
    return { x: x2, y: y2, squash: 1, stretch: 1 + 0.04 * Math.sin(k5 * Math.PI), rot: 0, shadow: 0.8 * (1 - k5), op: 1, gy: groundY };
  }

  function Streetlight(x, y) {
    return h("g", { transform: "translate(" + x + ", " + y + ")" },
      h("rect", { x: -4, y: -200, width: 8, height: 200, rx: 3, fill: DAY.pole }),
      h("rect", { x: -4, y: -200, width: 54, height: 7, rx: 3.5, fill: DAY.pole }),
      h("rect", { x: 40, y: -196, width: 19, height: 8, rx: 4, fill: DAY.poleHead }));
  }
  /* 電柱: concrete utility poles with crossarms, a pole transformer every other pole,
     and sagging lines between them (all wires batched into one path) */
  var _upMemo = {};
  function UtilityPoles(x0, n, gap, baseY, ht) {
    var mk = x0 + "|" + n + "|" + gap + "|" + baseY + "|" + ht;
    if (_upMemo[mk]) return _upMemo[mk];
    var dW = "", dC = "", poles = [];
    for (var i = 0; i < n; i++) {
      var px = x0 + i * gap, top = baseY - ht;
      poles.push(h("g", null,
        h("path", { d: "M" + (px - 4.5) + "," + baseY + " L" + (px - 2.6) + "," + top + " L" + (px + 2.6) + "," + top + " L" + (px + 4.5) + "," + baseY + " Z", fill: DAY.utility }),
        h("rect", { x: px - 22, y: top + 14, width: 44, height: 3.6, rx: 1.4, fill: DAY.utility }),
        h("rect", { x: px - 15, y: top + 34, width: 30, height: 3.2, rx: 1.4, fill: DAY.utility }),
        h("path", { d: "M" + (px - 20) + "," + (top + 13) + "v-4 M" + (px - 7) + "," + (top + 13) + "v-4 M" + (px + 7) + "," + (top + 13) + "v-4 M" + (px + 20) + "," + (top + 13) + "v-4", stroke: DAY.utility, strokeWidth: 2.4, strokeLinecap: "round" }),
        i % 2 === 0 ? h("rect", { x: px + 4, y: top + 52, width: 11, height: 18, rx: 3.5, fill: DAY.utility }) : h("rect", { x: px + 3, y: top + 60, width: 6, height: 5, fill: DAY.utility }),
        h("rect", { x: px - 3.5, y: baseY - ht * 0.42, width: 7, height: 10, rx: 1, fill: "#d8c35a", opacity: 0.55 })
      ));
      if (i < n - 1) {
        var nx = px + gap;
        [-20, -7, 7, 20].forEach(function (o, k) { var yy = top + 9, sag = 16 + k * 2; dW += "M" + (px + o) + "," + yy + "Q" + (px + gap / 2 + o) + "," + (yy + sag) + " " + (nx + o) + "," + yy; });
        dC += "M" + px + "," + (top + 40) + "Q" + (px + gap / 2) + "," + (top + 70) + " " + nx + "," + (top + 40);
      }
    }
    return _upMemo[mk] = h("g", null,
      h("path", { d: dW, fill: "none", stroke: DAY.wire, strokeWidth: 1.3 }),
      h("path", { d: dC, fill: "none", stroke: DAY.wire, strokeWidth: 2.6 }),
      poles);
  }
  /* 自販機: a pair of plain (unbranded) vending machines on the pavement */
  var _vmMemo = null;
  function VendingPair(x, baseY) {
    if (_vmMemo && _vmMemo.k === x + "|" + baseY) return _vmMemo.v;
    var units = [{ dx: 0, body: "#f1f4f7", trim: "#c9d3de" }, { dx: 58, body: "#3f78b8", trim: "#2c5a8e" }];
    var cans = ["#e16347", "#2a7f8c", "#f2c14e", "#7aa5d6", "#e9e4d8", "#5d8f4e"];
    var out = h("g", null,
      h("ellipse", { cx: x + 56, cy: baseY + 3, rx: 72, ry: 6, fill: "rgba(10,20,36,0.16)" }),
      units.map(function (u) {
        var ux = x + u.dx, top = baseY - 100;
        var dots = "";
        return h("g", null,
          h("rect", { x: ux, y: top, width: 54, height: 100, rx: 3, fill: u.body }),
          h("rect", { x: ux, y: top, width: 54, height: 100, rx: 3, fill: "none", stroke: u.trim, strokeWidth: 2 }),
          h("rect", { x: ux + 5, y: top + 6, width: 44, height: 50, rx: 2, fill: "#fbfdff" }),
          [0, 1, 2].map(function (r) {
            return h("g", null,
              h("rect", { x: ux + 6, y: top + 18 + r * 15, width: 42, height: 1.6, fill: "rgba(22,41,63,0.18)" }),
              range(6, function (c) { return h("rect", { x: ux + 8 + c * 7, y: top + 9 + r * 15, width: 4.4, height: 8.6, rx: 1.6, fill: cans[(c + r * 2 + u.dx) % cans.length] }); }));
          }),
          h("rect", { x: ux + 6, y: top + 60, width: 30, height: 9, rx: 1.5, fill: "rgba(22,41,63,0.65)" }),
          h("rect", { x: ux + 40, y: top + 60, width: 8, height: 14, rx: 1.5, fill: "rgba(22,41,63,0.35)" }),
          h("rect", { x: ux + 6, y: top + 80, width: 42, height: 13, rx: 2, fill: "rgba(10,20,36,0.75)" }));
      }));
    _vmMemo = { k: x + "|" + baseY, v: out };
    return out;
  }

  /* ---- Scene12World.tsx ---- */
  function sceneWorld(frame, tOverride) {
    // tOverride decouples ambient time from the choreography frame: hold `frame`
    // at a settled value (parcels delivered, KPI at final, truck parked) while
    // ambient (idle bob, particles, god-rays, clouds) keeps breathing — used for
    // the per-scene end-of-scene idle. Default (undefined) = identical to before.
    var fps = FPS, time = (tOverride != null ? tOverride : frame / fps);
    var cam = interpolate(frame, [T_WORLD.panStart, T_WORLD.panEnd], [T_WORLD.camRecvX, T_WORLD.camLoadX], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
    var panK = clamp01((frame - T_WORLD.panStart) / (T_WORLD.panEnd - T_WORLD.panStart));
    // truck positions as functions of frame, so truckMotion can read their acceleration
    var arriveAt = function (f) { return interpolate(f, [T_WORLD.truckIn[0], T_WORLD.truckIn[1]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }); };
    var departAt = function (f) { return interpolate(f, [T_WORLD.truckDepart[0], T_WORLD.truckDepart[1] + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }); };
    var departDeltaAt = function (i, f) { var k = clamp01((f - T_WORLD.departs2[i]) / T_WORLD.departDur2); return Math.pow(k, 2.2) * 1700; };
    var departDelta = function (i) { return departDeltaAt(i, frame); };
    var truck1At = function (f) { return -400 + (TRUCK_PARK_1 + 400) * arriveAt(f) + (dockRear(0) - TRUCK_PARK_1) * departAt(f) + departDeltaAt(0, f); };
    // the same paths for the weight model only: a truck enters already driving and keeps driving once it
    // has left the picture, so neither edge reads as a sudden stop (the drawn positions above are unchanged)
    var arriveRun = function (f) { var a = T_WORLD.truckIn; return f < a[0] ? (f - a[0]) * 3 / (a[1] - a[0]) : arriveAt(f); };
    var departRun = function (i, f) { var k = (f - T_WORLD.departs2[i]) / T_WORLD.departDur2; return k <= 0 ? 0 : k < 1 ? Math.pow(k, 2.2) * 1700 : 1700 + 1700 * 2.2 * (k - 1); };
    var truck1Run = function (f) { return -400 + (TRUCK_PARK_1 + 400) * arriveRun(f) + (dockRear(0) - TRUCK_PARK_1) * departAt(f) + departRun(0, f); };
    var arriveK = arriveAt(frame), departK = departAt(frame);
    var settleT = Math.max(0, frame - T_WORLD.truckIn[1]);
    var settleBob = Math.exp(-settleT / 9) * Math.sin(settleT / 2.2) * 3.4;
    var truck1X = truck1At(frame);
    var truck1Moving = (arriveK > 0.02 && arriveK < 0.98) || (departK > 0.02 && departK < 0.98) || departDelta(0) > 1;
    var truck1M = truckMotion(truck1Run, frame);
    var truck1Bob = truck1M.run * Math.sin(frame * 1.15) * 1.3 + (1 - truck1M.run) * (settleBob + Math.sin(time * 1.4) * 0.35);
    var door1 = interpolate(frame, [T_WORLD.doorOpen[0], T_WORLD.doorOpen[1]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
      interpolate(frame, [T_WORLD.doorClose[0], T_WORLD.doorClose[1]], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) +
      interpolate(frame, [300, 316], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
      interpolate(frame, [T_WORLD.doorsClose2[0], T_WORLD.doorsClose2[1]], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    var dock = { x: SUPPLIER_X + SUPPLIER_DOCK.x * B_SCALE, y: GROUND + SUPPLIER_DOCK.y * B_SCALE };
    var door1Target = { x: TRUCK_PARK_1, y: GROUND + 34 - 27 * T_SCALE };
    var carrySpan = T_WORLD.parcels[1] - T_WORLD.parcels[0];
    var shutter = function (i) { return interpolate(frame, [T_WORLD.shutters[0] + i * 14, T_WORLD.shutters[0] + i * 14 + 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }); };
    var idleBob = function (i) { return Math.sin(time * 1.3 + i * 1.9) * 0.55; };
    var dockTruckDoor = function (i) { return interpolate(frame, [302 + i * 8, 318 + i * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * interpolate(frame, [T_WORLD.doorsClose2[0], T_WORLD.doorsClose2[1]], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); };
    var recvEnter = spring({ frame: frame - T_WORLD.recvCardIn, fps: fps, config: { damping: 13, mass: 0.9 } });
    var recvExit = interpolate(frame, [T_WORLD.panStart - 6, T_WORLD.panStart + 16], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
    var recvData = clamp01((frame - T_WORLD.recvDataIn[0]) / (T_WORLD.recvDataIn[1] - T_WORLD.recvDataIn[0]));
    var loadEnter = spring({ frame: frame - T_WORLD.loadCardIn, fps: fps, config: { damping: 13, mass: 0.9 } });
    var loadData = clamp01((frame - T_WORLD.loadDataIn[0]) / (T_WORLD.loadDataIn[1] - T_WORLD.loadDataIn[0]));
    var cardBob = Math.sin(time * 1.1) * 5;
    var title1 = clamp01((frame - 8) / 34) * (1 - panK);
    var title2 = clamp01((frame - (T_WORLD.panEnd + 6)) / 34);
    var skylineDeep = makeSkylineTier("skd", 2400, { w: [152, 96, 204, 124, 168, 108], base: 236, amp: 214, hf: [0.92, 0.5, 0.74, 0.34, 1, 0.6], g: [22, 30, 16, 34] });
    var skylineFar = makeSkylineTier("skf", 2620, { w: [122, 178, 96, 152, 198, 110], base: 184, amp: 232, hf: [0.82, 0.46, 1, 0.6, 0.72, 0.35], g: [28, 40, 20, 46, 32] });
    var skylineMid = makeSkylineTier("skm", 3000, { w: [188, 132, 224, 148, 112, 206], base: 102, amp: 176, hf: [0.68, 1, 0.42, 0.84, 0.55, 0.9], g: [42, 66, 30, 86, 52] });
    var clouds = range(7, function (i) { var span = (WORLD_W * 0.5) / 7; return { x: i * span + random("cl-x" + i) * span * 0.38, y: 50 + random("cl-y" + i) * 210, w: 220 + random("cl-w" + i) * 280, sp: 4.5 }; });
    return h("div", { style: { position: "absolute", inset: 0, background: "#eaf5fc", overflow: "hidden" } },
      h("div", { style: { position: "absolute", inset: 0, background: DAY.sky } }),
      h("div", { style: { position: "absolute", inset: 0, background: "radial-gradient(38% 32% at 92% 7%, rgba(255,240,200,0.46) 0%, rgba(255,240,200,0) 70%), radial-gradient(56% 40% at 8% 100%, rgba(22,41,63,0.085) 0%, rgba(22,41,63,0) 72%)", pointerEvents: "none" } }),
      h("svg", { width: 1920, height: 1080, viewBox: "0 0 1920 1080", xmlns: "http://www.w3.org/2000/svg", style: { position: "absolute", inset: 0 } },
        h("defs", null,
          h("clipPath", { id: "clipT1" }, h("rect", { x: -20000, y: -2000, width: 20000 + truck1X, height: 4000 })),
          [0, 1, 2].map(function (i) { return h("clipPath", { id: "clipB" + i }, h("rect", { x: -20000, y: -2000, width: 20000 + dockRear(i), height: 4000 })); }),
          HazeDef("wHaze0", DAY.hazeK[0]), HazeDef("wHaze1", DAY.hazeK[1]), HazeDef("wHaze2", DAY.hazeK[2]),
          GlowDef("wSun", DAY.sunGlow, 0.5)
        ),
        // the sun sits clear of Tokyo Tower's antenna while scene 1 holds (tower at screen x ~1624 there)
        SkySun({ cx: 1772, cy: 104, r: 52, time: time, gid: "wSun" }),
        h("g", { transform: "translate(" + (-cam * 0.12) + ", 0)" },
          h("path", { d: "M-300," + GROUND + " C300," + (GROUND - 150) + " 800," + (GROUND - 60) + " 1400," + (GROUND - 130) + " C2000," + (GROUND - 195) + " 2600," + (GROUND - 55) + " 3200," + (GROUND - 120) + " C3800," + (GROUND - 180) + " 4400," + (GROUND - 70) + " 5200," + (GROUND - 140) + " L5200," + GROUND + " Z", fill: DAY.hill })
        ),
        h("g", { transform: "translate(" + (-cam * 0.18) + ", 0)" }, skylineDeep.filter(function (b) { var vx = b.x - cam * 0.18; return vx + b.w > -240 && vx < 2160; }).map(function (b, bi) {
          var top = GROUND - b.h;
          var cols = Math.max(2, Math.round(b.w / 40)), rows = Math.max(2, Math.floor((b.h - 24) / 52));
          var gx = (b.w - 20) / cols, gy2 = (b.h - 30) / rows;
          return h("g", null,
            h("rect", { x: b.x, y: top, width: b.w, height: b.h, fill: DAY.deep }),
            h("rect", { x: b.x, y: top, width: b.w, height: 4, fill: DAY.deepTop }),
            (function () {
              var d = "";
              for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) d += "M" + (b.x + 11 + c * gx) + "," + (top + 14 + r * gy2) + "h" + (gx * 0.42) + "v" + (gy2 * 0.44) + "h" + (-gx * 0.42) + "z";
              return h("path", { d: d, fill: DAY.deepWin });
            })());
        })),
        h("rect", { x: 0, y: GROUND - 470, width: 1920, height: 470, fill: "url(#wHaze0)" }),
        h("g", { transform: "translate(" + (-cam * 0.32) + ", 0)" },
          clouds.map(function (c) { var range2 = WORLD_W * 0.5, wx = (c.x + time * c.sp) % range2; var ed = Math.min(wx / 200, (range2 - wx) / 200, 1); return h("g", { transform: "translate(" + wx + ", " + c.y + ")" }, Cloud({ w: c.w, o: 0.92, edge: ed })); }),
          DayBirds({ seed: "w-birds", count: 4, time: time, span: 2300, yBase: 120 }),
          skylineFar.map(function (b, i) { return { b: b, i: i }; }).filter(function (o) { var vx = o.b.x - cam * 0.32; return vx + o.b.w > -240 && vx < 2160; }).map(function (o) { return CityBuilding({ x: o.b.x, baseY: GROUND, w: o.b.w, h: o.b.h, seed: "skf" + o.i, fi: o.i, faces: DAY.far, detail: 0, cap: DAY.farCap }); }),
          skylineFar.filter(function (b) { return b.h > 340; }).map(function (b, i) { return RoofBeacon({ x: b.x + b.w / 2, y: GROUND - b.h, time: time, phase: i * 1.7 }); }),
          TokyoTower({ cx: 1560, baseY: GROUND, h: 770, time: time, opacity: 0.95 })
        ),
        h("rect", { x: 0, y: GROUND - 430, width: 1920, height: 430, fill: "url(#wHaze1)" }),
        h("g", { transform: "translate(" + (-cam * 0.52) + ", 0)" },
          skylineMid.map(function (b, i) { return { b: b, i: i }; }).filter(function (o) { var vx = o.b.x - cam * 0.52; return vx + o.b.w > -240 && vx < 2160; }).map(function (o) { return CityBuilding({ x: o.b.x, baseY: GROUND, w: o.b.w, h: o.b.h, seed: "skm" + o.i, fi: o.i, faces: DAY.mid, detail: 1, cap: DAY.midCap }); }),
          UtilityPoles(-120, 12, 360, GROUND, 176)
        ),
        h("rect", { x: 0, y: GROUND - 300, width: 1920, height: 300, fill: "url(#wHaze2)" }),
        h("g", { transform: "translate(" + (-cam) + ", 0)" },
          h("rect", { x: -400, y: GROUND, width: WORLD_W + 800, height: 16, fill: DAY.walk }),
          h("line", { x1: -400, y1: GROUND + 3, x2: WORLD_W + 400, y2: GROUND + 3, stroke: "rgba(245, 236, 234,0.16)", strokeWidth: 2 }),
          h("line", { x1: -400, y1: GROUND + 9, x2: WORLD_W + 400, y2: GROUND + 9, stroke: "rgba(226,196,74,0.55)", strokeWidth: 3, strokeDasharray: "14 3" }),
          h("rect", { x: -400, y: GROUND + 16, width: WORLD_W + 800, height: 6, fill: DAY.curb }),
          h("rect", { x: -400, y: GROUND + 22, width: WORLD_W + 800, height: 84, fill: DAY.road }),
          h("line", { x1: -400, y1: GROUND + 27, x2: WORLD_W + 400, y2: GROUND + 27, stroke: "rgba(255,255,255,0.28)", strokeWidth: 2.5 }),
          h("line", { x1: -400, y1: GROUND + 64, x2: WORLD_W + 400, y2: GROUND + 64, stroke: "rgba(255,255,255,0.6)", strokeWidth: 4, strokeDasharray: "26 32" }),
          h("line", { x1: -400, y1: GROUND + 101, x2: WORLD_W + 400, y2: GROUND + 101, stroke: "rgba(255,255,255,0.28)", strokeWidth: 2.5 }),
          h("rect", { x: -400, y: GROUND + 106, width: WORLD_W + 800, height: 194, fill: DAY.roadEdge }),
          range(11, function (i) { return Streetlight(-180 + i * 470, GROUND); }),
          VendingPair(1300, GROUND),
          FloatingParticles({ seed: "world-a", x: 60, y: 240, width: 1700, height: 560, time: time, count: 24, baseOpacity: 0.4 }),
          FloatingParticles({ seed: "world-b", x: 2050, y: 240, width: 1700, height: 560, time: time, count: 24, baseOpacity: 0.4 }),
          SupplierBuilding({ x: SUPPLIER_X, y: GROUND, scale: B_SCALE }),
          Warehouse({ x: WAREHOUSE_X, y: GROUND, scale: B_SCALE, shutterOpen: [shutter(0), shutter(1), shutter(2)], rayPhase: time }),
          [1, 2].map(function (i) {
            var d = departDelta(i), m = truckMotion(function (f) { return departRun(i, f); }, frame);
            return Truck({ x: dockRear(i) + d, y: GROUND + 34, scale: T_SCALE * 0.97, doorOpen: dockTruckDoor(i), distance: d, bob: m.run * Math.sin(frame * 1.15 + i) * 1.3 + (1 - m.run) * idleBob(i), moving: d > 1, pitch: m.pitch, run: m.run });
          }),
          Truck({ x: truck1X, y: GROUND + 34, scale: T_SCALE, doorOpen: door1, distance: truck1X + 400, bob: truck1Bob, moving: truck1Moving, pitch: truck1M.pitch, run: truck1M.run }),
          h("g", { clipPath: "url(#clipT1)" },
            [0, 1, 2].map(function (i) {
              var t0 = T_WORLD.parcels[0] + i * 26, t = clamp01((frame - t0) / (carrySpan - 52));
              var pp = parcelPose(t, { x: dock.x, y: dock.y }, door1Target, GROUND);
              if (!pp) return null;
              return Parcel({ x: pp.x, y: pp.y, size: 52, squash: pp.squash, stretch: pp.stretch, rotation: pp.rot, shadow: pp.shadow, shadowY: pp.gy, opacity: pp.op });
            })
          ),
          [0, 1, 2].map(function (bay) {
            return h("g", { clipPath: "url(#clipB" + bay + ")" },
              [0, 1].map(function (j) {
                var t0 = T_WORLD.loadParcels[0] + bay * 7 + j * 22, t = clamp01((frame - t0) / 46);
                var bx = bayWorldX(WAREHOUSE_X, B_SCALE, bay) + (BAY_W * B_SCALE) / 2;
                var pp = parcelPose(t, { x: bx, y: GROUND - 6 }, { x: dockRear(bay), y: GROUND + 34 - 27 * T_SCALE }, GROUND);
                if (!pp) return null;
                return Parcel({ x: pp.x, y: pp.y, size: 50, squash: pp.squash, stretch: pp.stretch, rotation: pp.rot, shadow: pp.shadow, shadowY: pp.gy, opacity: pp.op });
              })
            );
          })
        ),
        h("g", { transform: "translate(" + (-cam * 1.07) + ", 0)" },
          h("rect", { x: -600, y: 1022, width: WORLD_W * 1.1 + 1200, height: 58, fill: DAY.fence }),
          range(30, function (i) { return h("rect", { x: i * 180, y: 1010, width: 11, height: 22, rx: 2, fill: DAY.fencePost }); })
        )
      ),
      h("div", { style: { opacity: 1 - panK } }, SceneTitle({ no: CONTENT.scenes.receiving.no, heading: CONTENT.scenes.receiving.heading, enter: title1 })),
      title2 > 0 ? SceneTitle({ no: CONTENT.scenes.loading.no, heading: CONTENT.scenes.loading.heading, enter: title2 }) : null,
      recvExit > 0.01 ? h("div", { style: { opacity: recvExit, transform: "translateY(" + ((1 - recvExit) * -28) + "px)" } },
        SceneCaption({ x: 1170, y: 172, width: 680, eyebrow: "INBOUND QUALITY", text: "全数検品で、まちがいなくお預かり。", enter: recvEnter, bob: cardBob })
      ) : null,
      frame > T_WORLD.loadCardIn - 4 ? SceneCaption({ x: 1170, y: 172, width: 680, eyebrow: "FLEET & PAYLOAD", text: "軽1BOXから13t車まで、32台。", enter: loadEnter, bob: cardBob }) : null,
      Vignette({ opacity: 0.26 })
    );
  }

  /* ---- Scene3Transit.tsx ---- */
  var ROAD_Y = 856;
  var _gbMemo = {};
  function GantryBack(x) {
    if (_gbMemo[x]) return _gbMemo[x];
    return _gbMemo[x] = h("g", { transform: "translate(" + x + ", 0)" },
      h("rect", { x: 0, y: 400, width: 26, height: 476, rx: 4, fill: "#1A2A46" }),
      h("rect", { x: 5, y: 400, width: 5, height: 476, fill: "rgba(245, 236, 234,0.06)" }),
      h("rect", { x: -8, y: 862, width: 42, height: 14, rx: 3, fill: "#13233E" }),
      h("rect", { x: -14, y: 398, width: 1234, height: 34, rx: 5, fill: "#22324F" }),
      h("rect", { x: -14, y: 398, width: 1234, height: 6, rx: 3, fill: "#2C3E5E" }),
      range(24, function (i) {
        return h("g", { opacity: 0.5 },
          h("line", { x1: -2 + i * 52, y1: 404, x2: 50 + i * 52, y2: 426, stroke: "rgba(245, 236, 234,0.12)", strokeWidth: 2.5 }),
          h("line", { x1: 50 + i * 52, y1: 404, x2: -2 + i * 52, y2: 426, stroke: "rgba(245, 236, 234,0.12)", strokeWidth: 2.5 }));
      }),
      [140, 480, 820, 1100].map(function (lx) {
        return h("g", null, h("rect", { x: lx, y: 386, width: 22, height: 10, rx: 4, fill: "#33425C" }));
      }),
      h("g", null,
        h("rect", { x: 120, y: 446, width: 560, height: 196, rx: 10, fill: DAY.sign, stroke: "rgba(245, 236, 234,0.55)", strokeWidth: 3 }),
        h("rect", { x: 120, y: 446, width: 560, height: 40, rx: 10, fill: DAY.signHead }),
        h("rect", { x: 120, y: 476, width: 560, height: 10, fill: DAY.signHead }),
        h("text", { x: 144, y: 474, fontFamily: FONTS.jp, fontSize: 21, fontWeight: 700, fill: "rgba(245, 236, 234,0.75)", letterSpacing: 2 }, "関越自動車道"),
        h("text", { x: 400, y: 474, fontFamily: FONTS.lat, fontSize: 15, fontWeight: 700, fill: "rgba(245, 236, 234,0.45)", letterSpacing: 2.5 }, "KAN-ETSU EXPWY"),
        h("text", { x: 144, y: 540, fontFamily: FONTS.jp, fontSize: 37, fontWeight: 800, fill: COLORS.paper, letterSpacing: 4 }, "新潟"),
        h("text", { x: 252, y: 538, fontFamily: FONTS.lat, fontSize: 19, fontWeight: 700, fill: "rgba(245, 236, 234,0.6)", letterSpacing: 2 }, "Niigata"),
        h("text", { x: 144, y: 600, fontFamily: FONTS.jp, fontSize: 37, fontWeight: 800, fill: COLORS.paper, letterSpacing: 4 }, "前橋"),
        h("text", { x: 252, y: 598, fontFamily: FONTS.lat, fontSize: 19, fontWeight: 700, fill: "rgba(245, 236, 234,0.6)", letterSpacing: 2 }, "Maebashi"),
        [520, 590].map(function (ax) { return h("path", { d: "M" + ax + ",614 L" + ax + ",540 M" + (ax - 13) + ",556 L" + ax + ",538 L" + (ax + 13) + ",556", stroke: COLORS.paper, strokeWidth: 7, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }); }),
        h("rect", { x: 134, y: 642, width: 532, height: 7, fill: "rgba(0,0,0,0.25)" })
      ),
      h("g", null,
        h("rect", { x: 720, y: 446, width: 330, height: 120, rx: 10, fill: DAY.sign, stroke: "rgba(245, 236, 234,0.55)", strokeWidth: 3 }),
        h("rect", { x: 720, y: 446, width: 9, height: 120, rx: 4, fill: COLORS.verm }),
        h("text", { x: 752, y: 496, fontFamily: FONTS.jp, fontSize: 27, fontWeight: 800, fill: COLORS.paper, letterSpacing: 2 }, "板橋 出口"),
        h("text", { x: 752, y: 534, fontFamily: FONTS.lat, fontSize: 16, fontWeight: 700, fill: "rgba(245, 236, 234,0.55)", letterSpacing: 2 }, "ITABASHI EXIT"),
        h("rect", { x: 734, y: 566, width: 302, height: 6, fill: "rgba(0,0,0,0.25)" })
      )
    );
  }
  var _gfMemo = {};
  function GantryFront(x) {
    if (_gfMemo[x]) return _gfMemo[x];
    return _gfMemo[x] = h("g", { transform: "translate(" + x + ", 0)" },
      h("rect", { x: 1178, y: 392, width: 36, height: 612, rx: 5, fill: "#13203A" }),
      h("rect", { x: 1185, y: 392, width: 7, height: 612, fill: "rgba(245, 236, 234,0.05)" }),
      range(8, function (i) { return h("line", { x1: 1178, y1: 452 + i * 72, x2: 1214, y2: 452 + i * 72, stroke: "rgba(10,18,32,0.5)", strokeWidth: 2.5 }); }),
      h("rect", { x: 1164, y: 1000, width: 64, height: 20, rx: 4, fill: "#0E1A2E" }),
      h("rect", { x: 1170, y: 994, width: 52, height: 8, rx: 3, fill: "#16243C" })
    );
  }
  function sceneTransit(frame) {
    var fps = FPS, time = frame / fps;
    var SPEED = 9, scroll = frame * SPEED;
    var titleEnter = clamp01((frame - 10) / 36);
    var convoyIn = interpolate(frame, [T_TRANSIT.convoyIn[0], T_TRANSIT.convoyIn[1]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    var cardEnter = spring({ frame: frame - T_TRANSIT.cardIn, fps: fps, config: { damping: 13, mass: 0.9 } });
    var chartK = clamp01((frame - T_TRANSIT.chartSweep[0]) / (T_TRANSIT.chartSweep[1] - T_TRANSIT.chartSweep[0]));
    var cardBob = Math.sin(time * 1.1) * 5;
    var farCity = makeSkylineTier("t-far", 6680, { w: [112, 172, 96, 202, 132, 152], base: 128, amp: 148, hf: [0.85, 0.45, 1, 0.62, 0.75, 0.3], g: [26, 38, 18, 44] });
    var midCity = makeSkylineTier("t-mid", 6620, { w: [142, 182, 122, 232, 152, 192], base: 88, amp: 108, hf: [0.7, 1, 0.4, 0.85, 0.55, 0.92], g: [48, 72, 34, 92, 58] });
    var TILE = 7000, GTILE = 2700;
    var wrap = function (v, tile) { return -(((v % tile) + tile) % tile); };
    var convoy = [{ x: 120, scale: 1.8, lag: 0 }, { x: 620, scale: 1.88, lag: 8 }, { x: 1120, scale: 1.8, lag: 16 }, { x: 1600, scale: 1.72, lag: 24 }];
    return h("div", { style: { position: "absolute", inset: 0, background: "#eaf5fc", overflow: "hidden" } },
      h("div", { style: { position: "absolute", inset: 0, background: DAY.skyT } }),
      h("div", { style: { position: "absolute", inset: 0, background: "radial-gradient(38% 32% at 92% 7%, rgba(255,240,200,0.46) 0%, rgba(255,240,200,0) 70%), radial-gradient(56% 40% at 8% 100%, rgba(22,41,63,0.085) 0%, rgba(22,41,63,0) 72%)", pointerEvents: "none" } }),
      h("svg", { width: 1920, height: 1080, viewBox: "0 0 1920 1080", xmlns: "http://www.w3.org/2000/svg", style: { position: "absolute", inset: 0 } },
        h("defs", null, HazeDef("tHaze0", DAY.hazeK[1]), HazeDef("tHaze1", DAY.hazeK[2]), GlowDef("tSun", DAY.sunGlow, 0.5)),
        SkySun({ cx: 1795, cy: 88, r: 46, time: time, gid: "tSun" }),
        DayBirds({ seed: "t-birds", count: 3, time: time, span: 2200, yBase: 150 }),
        [{ y: 110, w: 280, sp: 9 }, { y: 196, w: 220, sp: 9 }, { y: 70, w: 250, sp: 9 }].map(function (c, i) {
          var wx = ((c.sp * time * 4 + i * 760) % 2420) - 250;
          var ed = Math.min((wx + 250) / 210, (2170 - wx) / 210, 1);
          return h("g", { transform: "translate(" + wx + ", " + c.y + ")" }, Cloud({ w: c.w, o: 0.92, edge: ed }));
        }),
        h("g", null,
          h("path", { d: "M0," + (ROAD_Y - 128) + " C320," + (ROAD_Y - 158) + " 680," + (ROAD_Y - 132) + " 1080," + (ROAD_Y - 156) + " C1420," + (ROAD_Y - 176) + " 1700," + (ROAD_Y - 140) + " 1920," + (ROAD_Y - 154) + " L1920," + ROAD_Y + " L0," + ROAD_Y + " Z", fill: DAY.hill }),
          FujiMountain({ cx: 460, baseY: 742, w: 1240, ht: 470 })
        ),
        [0, 1].map(function (rep) {
          var off = wrap(scroll * 0.18, TILE) + rep * TILE;
          return h("g", { transform: "translate(" + off + ", 0)" },
            farCity.map(function (b, i) { return { b: b, i: i }; }).filter(function (o) { return o.b.x + off + o.b.w > -240 && o.b.x + off < 2160; }).map(function (o) { return CityBuilding({ x: o.b.x, baseY: ROAD_Y, w: o.b.w, h: o.b.h + 110, seed: "tf" + o.i, fi: o.i, faces: DAY.far, detail: 0, cap: DAY.farCap }); }));
        }),
        h("rect", { x: 0, y: ROAD_Y - 420, width: 1920, height: 420, fill: "url(#tHaze0)" }),
        [0, 1].map(function (rep) {
          var off = wrap(scroll * 0.42, TILE) + rep * TILE;
          return h("g", { transform: "translate(" + off + ", 0)" },
            midCity.map(function (b, i) { return { b: b, i: i }; }).filter(function (o) { return o.b.x + off + o.b.w > -240 && o.b.x + off < 2160; }).map(function (o) { return CityBuilding({ x: o.b.x, baseY: ROAD_Y, w: o.b.w, h: o.b.h + 50, seed: "tc" + o.i, fi: o.i, faces: DAY.mid, detail: 1, cap: DAY.midCap }); }));
        }),
        h("rect", { x: 0, y: ROAD_Y - 260, width: 1920, height: 260, fill: "url(#tHaze1)" }),
        DayBirds({ seed: "t-birds", count: 3, time: time, span: 2100, yBase: 105 }),
        (function () {
          var px = ((time * 38) % 2640) - 360;
          var pb = Math.sin(time * 0.85) * 5;
          return h("g", { transform: "translate(" + px + ", " + (148 + pb) + ")", opacity: 0.92 },
            h("line", { x1: -150, y1: -11, x2: -46, y2: -11, stroke: "rgba(255,255,255,0.5)", strokeWidth: 3, strokeLinecap: "round" }),
            h("line", { x1: -196, y1: -8, x2: -142, y2: -8, stroke: "rgba(255,255,255,0.28)", strokeWidth: 2, strokeLinecap: "round" }),
            h("g", { transform: "scale(0.34)" }, JetPlane({ x: 0, y: 0, rot: 0, gear: 0, opacity: 0.96 })));
        })(),
        FloatingParticles({ seed: "transit", x: 60, y: 240, width: 1800, height: 560, time: time, count: 28, baseOpacity: 0.42 }),
        h("rect", { x: 0, y: ROAD_Y - 16, width: 1920, height: 16, fill: DAY.fence }),
        h("rect", { x: 0, y: ROAD_Y, width: 1920, height: 104, fill: "#434b55" }),
        h("rect", { x: 0, y: ROAD_Y + 104, width: 1920, height: 140, fill: "#aeb4bb" }),
        h("line", { x1: 0, y1: ROAD_Y + 5, x2: 1920, y2: ROAD_Y + 5, stroke: "rgba(255,255,255,0.16)", strokeWidth: 3 }),
        h("line", { x1: -100, y1: ROAD_Y + 52, x2: 2020, y2: ROAD_Y + 52, stroke: "rgba(255,255,255,0.65)", strokeWidth: 5, strokeLinecap: "round", strokeDasharray: "26 32", strokeDashoffset: scroll % 58 }),
        range(36, function (i) { return h("circle", { cx: i * 58 + 29 - (scroll % 58), cy: ROAD_Y + 52, r: 1.8, fill: "rgba(255,255,255,0.32)" }); }),
        [0, 1].map(function (rep) {
          return h("g", { transform: "translate(" + (wrap(scroll, GTILE * 2) + rep * GTILE * 2) + ", 0)" },
            [0, 1, 2, 3, 4, 5].map(function (i) {
              return h("g", { transform: "translate(" + (i * 700) + ", " + ROAD_Y + ")" },
                h("rect", { x: -4, y: -210, width: 8, height: 210, rx: 3, fill: DAY.pole }),
                h("rect", { x: -4, y: -210, width: 56, height: 8, rx: 4, fill: DAY.pole }),
                h("rect", { x: 42, y: -206, width: 20, height: 9, rx: 4, fill: DAY.poleHead }));
            }));
        }),
        [0, 1].map(function (rep) { return h("g", { transform: "translate(" + (wrap(scroll + 2030, GTILE) + rep * GTILE) + ", 0)" }, GantryBack(GTILE - 1300)); }),
        convoy.map(function (c, i) {
          var ex = c.x - (1 - convoyIn) * 560;
          var drift = Math.sin(time * 0.5 + i * 1.4) * 12;
          // the camera rides with the convoy, so screen-x acceleration is road acceleration: the trucks
          // brake gently (nose dip) as they ease into formation
          var m = truckMotion(function (f) {
            var a = T_TRANSIT.convoyIn, k = f < a[0] ? (f - a[0]) * 3 / (a[1] - a[0]) : interpolate(f, a, [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
            return c.x - (1 - k) * 560 + Math.sin(f / fps * 0.5 + i * 1.4) * 12;
          }, frame);
          return Truck({ x: ex + drift, y: ROAD_Y + 18, scale: c.scale, distance: scroll, bob: Math.sin((frame - c.lag) * 0.9) * 1.5, opacity: Math.min(1, convoyIn * 1.5), moving: true, pitch: m.pitch, run: 1 });
        }),
        [0, 1].map(function (rep) { return h("g", { transform: "translate(" + (wrap(scroll + 2030, GTILE) + rep * GTILE) + ", 0)" }, GantryFront(GTILE - 1300)); }),
        [0, 1].map(function (rep) {
          return h("g", { transform: "translate(" + (wrap(scroll * 1.25, TILE) + rep * TILE) + ", 0)" },
            h("rect", { x: 0, y: 1022, width: TILE, height: 58, fill: DAY.fence }),
            range(46, function (i) { return h("rect", { x: i * (TILE / 46), y: 1004, width: 13, height: 24, rx: 2, fill: DAY.fencePost }); }),
            h("line", { x1: 0, y1: 1014, x2: TILE, y2: 1014, stroke: DAY.pole, strokeWidth: 5 }));
        })
      ),
      SceneTitle({ no: CONTENT.scenes.transit.no, heading: CONTENT.scenes.transit.heading, enter: titleEnter }),
      SceneCaption({ x: 1170, y: 152, width: 680, eyebrow: "ON-TIME OPERATIONS", text: "関東一円から新潟へ、毎日定時で。", enter: cardEnter, bob: cardBob }),
      Vignette({ opacity: 0.26 })
    );
  }

  /* ---- Airport + jet for the finale: lands from the left, departs to the right ---- */
  function JetPlane(p) {
    var NV = "#33518c";
    var gear = p.gear == null ? 1 : p.gear;
    var gOp = clamp01(gear * 1.5 - 0.25);
    return h("g", { transform: "translate(" + p.x + "," + p.y + ") rotate(" + (p.rot || 0) + ") scale(0.98)", opacity: p.opacity == null ? 1 : p.opacity },
      // far-side wing peeking above the fuselage
      h("path", { d: "M2,-48 L-20,-48 L-54,-70 L-34,-70 Z", fill: "#c7d4e8", stroke: "rgba(22,41,63,0.22)", strokeWidth: 1 }),
      // swept tailplane reaching past the tail cone
      h("path", { d: "M-62,-37 L-92,-26.5 L-77,-22.5 L-50,-32 Z", fill: NV, stroke: "rgba(22,41,63,0.3)", strokeWidth: 1 }),
      // big swept tail fin anchored at the very tail
      h("path", { d: "M-34,-47 L-53,-86 Q-55,-90 -60,-90 L-70,-90 Q-76,-90 -76.6,-84 L-80,-42 Q-60,-47 -34,-47 Z", fill: NV, stroke: "rgba(22,41,63,0.3)", strokeWidth: 1 }),
      // fuselage: round nose, up-swept tapered tail cone
      h("path", { d: "M94,-33 Q94,-28 80,-25.5 Q60,-22 32,-22 L-30,-22 Q-62,-23 -80,-30 Q-90,-34 -90,-38 Q-90,-44 -76,-46 Q-56,-48 -28,-48 L38,-48 Q74,-48 90,-38.5 Q94,-36 94,-33 Z", fill: "#ffffff", stroke: "rgba(22,41,63,0.4)", strokeWidth: 1.5 }),
      // navy lower hull
      h("path", { d: "M76,-24.5 Q56,-22.4 32,-22 L-30,-22 Q-62,-23 -80,-30 Q-86,-32.5 -88,-35.5 L-80.5,-35 Q-63,-27.8 -30,-26.4 L52,-26.4 Q68,-26 76,-24.5 Z", fill: NV }),
      // cockpit windshield
      h("path", { d: "M72,-45 Q83,-43 91,-36.5 Q83,-33.5 75,-34.8 Q72,-40 69,-41.5 Z", fill: "#1e2c3d" }),
      // cabin portholes
      range(12, function (i) { return h("rect", { x: -50 + i * 9.2, y: -42.5, width: 4.6, height: 5.2, rx: 1.3, fill: "#2b3950" }); }),
      // doors
      h("rect", { x: 60, y: -44.5, width: 7, height: 13, rx: 3, fill: "#eef2f8", stroke: "rgba(22,41,63,0.3)", strokeWidth: 1 }),
      h("rect", { x: -38, y: -44.5, width: 7, height: 13, rx: 3, fill: "#eef2f8", stroke: "rgba(22,41,63,0.3)", strokeWidth: 1 }),
      // landing gear
      h("g", { opacity: gOp },
        h("line", { x1: 6, y1: -22, x2: 6, y2: -5.5, stroke: "#3a4553", strokeWidth: 3.2 }),
        h("circle", { cx: 1, cy: -5.5, r: 5.5, fill: "#232a34", stroke: "#5a6673", strokeWidth: 1.4 }),
        h("circle", { cx: 12, cy: -5.5, r: 5.5, fill: "#232a34", stroke: "#5a6673", strokeWidth: 1.4 }),
        h("line", { x1: 70, y1: -21, x2: 70, y2: -5, stroke: "#3a4553", strokeWidth: 2.8 }),
        h("circle", { cx: 70, cy: -5, r: 4.4, fill: "#232a34", stroke: "#5a6673", strokeWidth: 1.2 })),
      // near wing, swept down-back
      h("path", { d: "M38,-26 L8,-26 L-28,-9 L-2,-9 Z", fill: "#f2f5fa", stroke: "rgba(22,41,63,0.35)", strokeWidth: 1.2 }),
      h("path", { d: "M16,-26 L8,-26 L-28,-9 L-19,-9 Z", fill: NV }),
      // engine nacelle slung ahead of the wing
      h("g", null,
        h("line", { x1: 26, y1: -26, x2: 28, y2: -20, stroke: "#4b5563", strokeWidth: 2.6 }),
        h("rect", { x: 16, y: -20.5, width: 26, height: 10, rx: 4.8, fill: "#c3cede", stroke: "rgba(22,41,63,0.4)", strokeWidth: 1 }),
        h("rect", { x: 38.6, y: -20.5, width: 3.4, height: 10, rx: 1.7, fill: "#2b3950" }),
        h("rect", { x: 16, y: -20.5, width: 3.8, height: 10, rx: 1.9, fill: "#2a7f8c", opacity: 0.85 })),
      // beacon on the fin tip
      h("circle", { cx: -64, cy: -91.5, r: 2.2, fill: "#e16347", opacity: p.beacon == null ? 0 : p.beacon })
    );
  }
  function Airport(time) {
    var blink = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * 3.2));
    var radar = (time * 46) % 360;
    return h("g", null,
      // airside ground + apron slab with stand markings
      h("rect", { x: 14, y: 948, width: 700, height: 58, fill: "#9db1c6" }),
      h("rect", { x: 14, y: 948, width: 700, height: 5, fill: "rgba(255,255,255,0.35)" }),
      h("rect", { x: 118, y: 950, width: 240, height: 16, fill: "#8fa3ba" }),
      range(3, function (i) { return h("rect", { x: 138 + i * 74, y: 955, width: 34, height: 2.5, fill: "rgba(255,255,255,0.5)" }); }),
      // control tower: tapered shaft with lit edge and floor lines, brim,
      // dark glass cab with skylight, railing, beacon
      h("path", { d: "M64,950 L70,860 L88,860 L94,950 Z", fill: "#7d92b4" }),
      h("path", { d: "M64,950 L70,860 L76,860 L73,950 Z", fill: "rgba(255,255,255,0.25)" }),
      range(3, function (i) { return h("rect", { x: 71, y: 876 + i * 22, width: 16, height: 3, fill: "rgba(22,41,63,0.18)" }); }),
      h("rect", { x: 48, y: 852, width: 62, height: 9, rx: 4.5, fill: "#57709a" }),
      h("rect", { x: 52, y: 822, width: 54, height: 32, rx: 5, fill: "#16293f" }),
      h("rect", { x: 56, y: 828, width: 46, height: 15, rx: 3, fill: "#9fd0d8", opacity: 0.9 }),
      h("rect", { x: 56, y: 828, width: 46, height: 6, rx: 3, fill: "rgba(255,255,255,0.35)" }),
      h("rect", { x: 46, y: 816, width: 66, height: 7, rx: 3.5, fill: "#57709a" }),
      h("line", { x1: 79, y1: 816, x2: 79, y2: 801, stroke: "#57709a", strokeWidth: 3 }),
      h("circle", { cx: 79, cy: 798, r: 3.4, fill: COLORS.verm, opacity: blink }),
      // terminal: canopy roof, glass curtain wall with mullions, entrance,
      // rooftop plant + rotating radar
      h("rect", { x: 128, y: 900, width: 190, height: 48, rx: 3, fill: "#eef3f8", stroke: "rgba(22,41,63,0.18)", strokeWidth: 1.5 }),
      h("rect", { x: 124, y: 892, width: 198, height: 10, rx: 4, fill: "#d6dfe9", stroke: "rgba(22,41,63,0.15)", strokeWidth: 1 }),
      h("rect", { x: 136, y: 908, width: 174, height: 24, rx: 2, fill: "rgba(120,150,185,0.32)", stroke: "rgba(22,41,63,0.12)", strokeWidth: 1 }),
      h("rect", { x: 136, y: 908, width: 174, height: 9, fill: "rgba(255,255,255,0.5)" }),
      range(7, function (i) { return h("line", { x1: 158 + i * 22, y1: 908, x2: 158 + i * 22, y2: 932, stroke: "rgba(22,41,63,0.2)", strokeWidth: 1.4 }); }),
      h("rect", { x: 213, y: 936, width: 20, height: 12, fill: "rgba(60,84,110,0.55)" }),
      h("rect", { x: 222.2, y: 936, width: 1.6, height: 12, fill: "rgba(255,255,255,0.6)" }),
      h("rect", { x: 128, y: 940, width: 190, height: 4, fill: "rgba(225, 99, 71,0.8)" }),
      h("rect", { x: 146, y: 884, width: 26, height: 9, rx: 1.5, fill: "#c3cedd" }),
      h("rect", { x: 268, y: 884, width: 18, height: 9, rx: 1.5, fill: "#c3cedd" }),
      h("g", { transform: "translate(238, 880)" },
        h("rect", { x: -2, y: 0, width: 4, height: 12, fill: "#57709a" }),
        h("rect", { x: -13, y: -3, width: 26, height: 4.5, rx: 2.2, fill: "#7d92b4", transform: "rotate(" + radar + " 0 -1)" })),
      // runway: lit top edge, threshold piano keys, touchdown-zone marks,
      // centreline dashes, amber edge lights
      h("rect", { x: 22, y: 966, width: 682, height: 26, rx: 3, fill: "#59636f" }),
      h("rect", { x: 24, y: 966, width: 678, height: 3, fill: "rgba(255,255,255,0.16)" }),
      h("line", { x1: 34, y1: 979, x2: 692, y2: 979, stroke: "rgba(255,255,255,0.7)", strokeWidth: 2.6, strokeDasharray: "20 16" }),
      range(4, function (i) { return h("rect", { x: 30 + i * 7, y: 970, width: 3, height: 18, fill: "rgba(255,255,255,0.55)" }); }),
      range(4, function (i) { return h("rect", { x: 676 + i * 7, y: 970, width: 3, height: 18, fill: "rgba(255,255,255,0.55)" }); }),
      [92, 130].map(function (tx) { return h("g", null, h("rect", { x: tx, y: 970.5, width: 14, height: 3.2, fill: "rgba(255,255,255,0.5)" }), h("rect", { x: tx, y: 984.5, width: 14, height: 3.2, fill: "rgba(255,255,255,0.5)" })); }),
      [596, 634].map(function (tx) { return h("g", null, h("rect", { x: tx, y: 970.5, width: 14, height: 3.2, fill: "rgba(255,255,255,0.5)" }), h("rect", { x: tx, y: 984.5, width: 14, height: 3.2, fill: "rgba(255,255,255,0.5)" })); }),
      range(12, function (i) { return h("circle", { cx: 40 + i * 58, cy: 963.5, r: 1.6, fill: "#ffe08a", opacity: 0.9 }); }),
      // striped windsock
      h("line", { x1: 650, y1: 962, x2: 650, y2: 934, stroke: "#57709a", strokeWidth: 3 }),
      h("g", { transform: "rotate(" + (Math.sin(time * 1.7) * 7) + " 650 937)" },
        h("path", { d: "M650,934 L674,937.5 L670,943.5 L650,940 Z", fill: COLORS.verm, opacity: 0.9 }),
        h("path", { d: "M658,935.2 L662,935.8 L661,942 L657,941.4 Z", fill: "#fff", opacity: 0.85 }))
    );
  }
  function AirportPlane(time) {
    // velocity-continuous cycle: glide -> flare -> touchdown bump -> rollout
    // (decelerating) -> hold -> takeoff roll (accelerating) -> climb-out
    var ss = function (a, b, v) { var t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };
    var T = 19, t = time % T, GY = 968;
    var A = 5.1, R = 2.4, HD = 1.6, TO = 2.2, C = 5.4;
    var x, y, rot, gear = 1, k, puff = null;
    if (t < A) {                       // final approach at constant ground speed
      k = t / A;
      x = -282 + 120 * t;
      y = GY - 165 * Math.pow(1 - k, 1.35) + Math.sin(t * 2.1) * 3.2 * (1 - k);
      var fl = ss(0.55, 0.92, k);      // glide pitch (with a gentle float) eases into a nose-up flare
      rot = (6.4 + Math.sin(t * 1.7) * 1.1) * (1 - fl) - 2.6 * fl;
    } else if (t < A + R) {            // rollout: same speed at touchdown, brake to 0
      var t2 = t - A;
      x = 330 + 120 * t2 - 25 * t2 * t2;
      y = GY + 2.6 * Math.exp(-Math.pow((t2 - 0.22) / 0.16, 2));  // suspension bump
      rot = -2.6 * Math.exp(-t2 * 1.9) * Math.cos(t2 * 2.6);   // nose settles with a damped wobble
      if (t2 < 1.05) {                 // tire puffs drifting behind the mains
        var q = t2 / 1.05;
        puff = h("g", { opacity: (1 - q) * 0.55 }, [0, 1, 2].map(function (pi) {
          var qq = clamp01(q * 1.4 - pi * 0.14);
          return h("circle", { cx: x - 4 - pi * 15 - qq * 34, cy: GY - 3 - qq * 9, r: 2.5 + qq * 8, fill: "#eef3f7" });
        }));
      }
    } else if (t < A + R + HD) {       // hold at the stand
      x = 474; y = GY; rot = 0;
    } else if (t < A + R + HD + TO) {  // takeoff roll from standstill, rotate late
      var t3 = t - A - R - HD;
      x = 474 + 30 * t3 * t3;
      y = GY; rot = -4 * ss(1.5, 2.2, t3);
    } else if (t < A + R + HD + TO + C) {  // climb-out, accelerating away
      var t4 = t - A - R - HD - TO;
      x = 619 + 132 * t4 + 32 * t4 * t4;
      var lift = ss(0, 1.15, t4);          // blend from the runway onto the climb line
      y = GY - (x - 619) * 0.5 * lift;     // then a geometrically straight diagonal
      rot = -4 - 23.5 * ss(0.04, 1.2, t4); // pitch settles at the path angle
      gear = 1 - ss(0.3, 1.4, t4);
    } else { return null; }            // off-screen gap before the next cycle
    var beacon = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * 7));
    var shk = clamp01(1 - (GY - y) / 260);
    return h("g", null,
      shk > 0.02 ? h("ellipse", { cx: x, cy: GY + 12, rx: 72 * (0.55 + 0.45 * shk), ry: 5.5, fill: "rgba(22,41,63," + (0.2 * shk) + ")" }) : null,
      puff,
      JetPlane({ x: x, y: y, rot: rot, gear: gear, beacon: beacon })
    );
  }

  /* ---- Scene4Network.tsx ---- */
  function sceneNetwork(frame, tOverride) {
    // tOverride: hold the choreography frame (e.g. map fully drawn, pre-recede) while
    // ambient time runs on (route-flow, pin pulse, city trucks) — for the map / finale idles.
    var fps = FPS, time = (tOverride != null ? tOverride : frame / fps);
    var titleEnter = clamp01((frame - 4) / 32) * (1 - clamp01((frame - T_NETWORK.mapRecede[0]) / 18));
    var mapIn = interpolate(frame, [T_NETWORK.mapIn[0], T_NETWORK.mapIn[1]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    var prefK = clamp01((frame - T_NETWORK.prefs[0]) / (T_NETWORK.prefs[1] - T_NETWORK.prefs[0]));
    var routeK = clamp01((frame - T_NETWORK.routesDraw[0]) / (T_NETWORK.routesDraw[1] - T_NETWORK.routesDraw[0]));
    var pinK = clamp01((frame - T_NETWORK.pinPop) / 18);
    var recede = interpolate(frame, [T_NETWORK.mapRecede[0], T_NETWORK.mapRecede[1]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
    var basesEnter = spring({ frame: frame - 14, fps: fps, config: { damping: 13, mass: 0.9 } });
    var overviewEnter = spring({ frame: frame - 26, fps: fps, config: { damping: 13, mass: 0.9 } });
    var logoEnter = spring({ frame: frame - T_NETWORK.logo[0], fps: fps, config: { damping: 12, mass: 0.9 } });
    var flash = clamp01((frame - T_NETWORK.logo[0]) / (T_NETWORK.logo[1] - T_NETWORK.logo[0]));
    var taglineK = interpolate(frame, [T_NETWORK.tagline[0], T_NETWORK.tagline[1]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    var statsK = clamp01((frame - T_NETWORK.stats[0]) / (T_NETWORK.stats[1] - T_NETWORK.stats[0]));
    // hand-curated skyline: height rhythm frames Fuji (left), the airport,
    // the warehouse, and keeps a clear corridor around Tokyo Tower
    var CITY_DEEP = [
      { x: 34, w: 100, h: 275, k: 0 }, { x: 236, w: 92, h: 330, k: 2 },
      { x: 352, w: 82, h: 238, k: 2 }, { x: 452, w: 78, h: 206, k: 0 },
      { x: 548, w: 104, h: 305, k: 1 }, { x: 688, w: 88, h: 255, k: 0 },
      { x: 790, w: 72, h: 212, k: 1 },
      { x: 936, w: 100, h: 365, k: 3 }, { x: 1072, w: 94, h: 430, k: 2 },
      { x: 1206, w: 88, h: 264, k: 0 }, { x: 1318, w: 96, h: 318, k: 2 },
      { x: 1444, w: 86, h: 284, k: 1 },
      { x: 1548, w: 102, h: 385, k: 1 }, { x: 1700, w: 90, h: 305, k: 0 },
      { x: 1826, w: 96, h: 435, k: 3 }
    ];
    var CITY_BACK = [
      { x: 118, w: 122, h: 305 }, { x: 606, w: 130, h: 345 },
      { x: 856, w: 118, h: 285 }, { x: 998, w: 126, h: 385 },
      { x: 1542, w: 128, h: 365 }, { x: 1732, w: 122, h: 265 }
    ];
    var CITY_FRONT = [
      { x: 678, w: 112, h: 175 }, { x: 986, w: 120, h: 215 },
      { x: 1652, w: 132, h: 195 }, { x: 1794, w: 118, h: 235 }
    ];
    return h("div", { style: { position: "absolute", inset: 0, background: "#eaf5fc", overflow: "hidden" } },
      h("div", { style: { position: "absolute", inset: 0, background: DAY.skyN } }),
      h("svg", { width: 1920, height: 1080, viewBox: "0 0 1920 1080", xmlns: "http://www.w3.org/2000/svg", style: { position: "absolute", inset: 0 } },
        h("defs", null,
          h("radialGradient", { id: "haloSoft" }, h("stop", { offset: "0", stopColor: "rgba(255,255,255,0.22)" }), h("stop", { offset: "0.7", stopColor: "rgba(255,255,255,0.09)" }), h("stop", { offset: "1", stopColor: "rgba(255,255,255,0)" })),
          h("radialGradient", { id: "sunGlow" }, h("stop", { offset: "0", stopColor: "rgba(255,224,130,0.55)" }), h("stop", { offset: "0.55", stopColor: "rgba(255,228,150,0.22)" }), h("stop", { offset: "1", stopColor: "rgba(255,232,170,0)" })),
          HazeDef("horizHaze", DAY.hazeK[0])
        ),
        h("g", { opacity: 0.5 - recede * 0.3 },
          
          
        ),
        h("ellipse", { cx: 960, cy: 520, rx: 940, ry: 500, fill: "url(#haloSoft)" }),
        range(30, function (i) {
          var x = random("n-star-x" + i) * 1920, y = 30 + random("n-star-y" + i) * 900;
          var tw = 0.25 + 0.6 * (0.5 + 0.5 * Math.sin(time * (0.5 + random("n-star-t" + i)) + i));
          return h("circle", { cx: x, cy: y, r: 1.4, fill: "rgba(245, 236, 234,0.7)", opacity: 0 });
        }),
        FloatingParticles({ seed: "network", x: 80, y: 120, width: 1760, height: 840, time: time, count: 28, baseOpacity: 0.4 }),
        h("g", { opacity: recede },
          (function () {
            var pulse = 0.5 + 0.5 * Math.sin(time * 0.55);
            var p2 = 0.5 + 0.5 * Math.sin(time * 0.55 + 1.3);
            return h("g", null,
              h("circle", { cx: 1652, cy: 136, r: 190 + pulse * 24, fill: "url(#sunGlow)", opacity: 0.7 + pulse * 0.3 }),
              (function () {
                var d = "";
                for (var i = 0; i < 12; i++) {
                  var a = (i * 30 + time * 4) * Math.PI / 180;
                  var r0 = 74, r1 = 74 + (i % 2 ? 15 : 25) + pulse * 5;
                  d += "M" + (1652 + Math.cos(a) * r0) + "," + (136 + Math.sin(a) * r0) + "L" + (1652 + Math.cos(a) * r1) + "," + (136 + Math.sin(a) * r1);
                }
                return null;
              })(),
              h("circle", { cx: 1652, cy: 136, r: 60, fill: "rgba(255,236,170,0.32)" }),
              h("circle", { cx: 1652, cy: 136, r: 46, fill: DAY.sun }),
              h("circle", { cx: 1652, cy: 136, r: 46, fill: "none", stroke: "rgba(255,255,255,0.55)", strokeWidth: 2 }));
          })(),
          range(26, function (i) {
            var x = random("n2-star-x" + i) * 1920, y = 24 + random("n2-star-y" + i) * 420;
            var tw = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * (0.6 + random("n2-star-t" + i) * 1.2) + i * 2));
            return h("circle", { cx: x, cy: y, r: 0.9 + random("n2-star-r" + i) * 1.6, fill: "rgba(245, 236, 234,0.8)", opacity: 0 });
          }),
          (function () {
            var k = (time % 9) / 9;
            if (true) return null;
            var p = k / 0.1, sx = 1480 - p * 300, sy = 70 + p * 130;
            return h("g", { opacity: Math.sin(p * Math.PI) * 0.8 },
              h("line", { x1: sx, y1: sy, x2: sx + 64, y2: sy - 28, stroke: "rgba(245, 236, 234,0.5)", strokeWidth: 1.8, strokeLinecap: "round" }),
              h("circle", { cx: sx, cy: sy, r: 2, fill: "#fff" }));
          })(),
          h("ellipse", { cx: 960, cy: 1000, rx: 1150, ry: 150, fill: "url(#haloSoft)" }),
          [{ y: 104, w: 330, sp: 10 }, { y: 226, w: 235, sp: 7 }, { y: 70, w: 265, sp: 12 }, { y: 172, w: 185, sp: 5.5 }, { y: 296, w: 150, sp: 4.2 }].map(function (c, i) {
            var wx = ((c.sp * time * 4 + i * 560) % 2400) - 240;
            var ed = Math.min((wx + 240) / 210, (2160 - wx) / 210, 1);
            var by = Math.sin(time * 0.4 + i * 1.7) * 6;
            return h("g", { transform: "translate(" + wx + ", " + (c.y + by) + ")" }, Cloud({ w: c.w, o: 0.92, edge: ed }));
          }),
          DayBirds({ seed: "n-birds", count: 3, time: time, span: 2300, yBase: 210 }),
          FujiMountain({ cx: 400, baseY: 1008, w: 1700, ht: 560, capT: 0.3 }),
          CITY_DEEP.map(function (b, i) {
            var bx = b.x, bw = b.w, top = 988 - b.h, bh = b.h + 22;
            var kind = b.k;
            var els = [];
            if (kind === 1) {                       // setback crown
              var inset = bw * 0.17, sh = bh * 0.2;
              els.push(h("rect", { x: bx + inset, y: top, width: bw - inset * 2, height: sh + 4, fill: DAY.cityDeep }));
              els.push(h("rect", { x: bx + inset, y: top - 3, width: bw - inset * 2, height: 3, fill: DAY.cityDeepTop }));
              els.push(h("rect", { x: bx, y: top + sh, width: bw, height: bh - sh, fill: DAY.cityDeep }));
              els.push(h("rect", { x: bx, y: top + sh - 3, width: bw, height: 3, fill: DAY.cityDeepTop }));
            } else if (kind === 3) {                // chamfered crown
              els.push(h("path", { d: "M" + bx + "," + (top + bw * 0.34) + " L" + (bx + bw) + "," + top + " L" + (bx + bw) + "," + (top + bh) + " L" + bx + "," + (top + bh) + " Z", fill: DAY.cityDeep }));
            } else {
              els.push(h("rect", { x: bx, y: top, width: bw, height: bh, fill: DAY.cityDeep }));
              els.push(h("rect", { x: bx, y: top - 3, width: bw, height: 3, fill: DAY.cityDeepTop }));
            }
            if (kind === 2) {                       // rooftop mast
              els.push(h("rect", { x: bx + bw / 2 - 1.6, y: top - 28, width: 3.2, height: 28, fill: DAY.cityDeepTop }));
            }
            var gridTop = (kind === 1 ? top + bh * 0.2 : kind === 3 ? top + bw * 0.36 : top) + 10;
            var gridH = top + bh - gridTop - 8;
            var cols = Math.max(2, Math.round(bw / 27)), rows = Math.max(3, Math.floor(gridH / 36));
            var gx = (bw - 16) / cols, gy2 = gridH / rows;
            (function () {
              var d = "";
              for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) d += "M" + (bx + 9 + c * gx) + "," + (gridTop + r * gy2) + "h" + (gx * 0.46) + "v" + (gy2 * 0.48) + "h" + (-gx * 0.46) + "z";
              els.push(h("path", { d: d, fill: DAY.cityWin }));
            })();
            els.push(h("rect", { x: bx, y: top, width: bw * 0.14, height: bh, fill: DAY.shade }));
            els.push(h("rect", { x: bx + bw - 3, y: top, width: 3, height: bh, fill: DAY.rim }));
            return h("g", null, els);
          }),
          h("rect", { x: 0, y: 758, width: 1920, height: 252, fill: "url(#horizHaze)" }),
          TokyoTower({ cx: 1360, baseY: 1008, h: 840, time: time, opacity: 0.97 }),
          CITY_BACK.map(function (b, i) { return CityBuilding({ x: b.x, baseY: 1010, w: b.w, h: b.h, seed: "c4b" + i, fi: i, faces: DAY.cityBack, detail: 1, cap: DAY.cityBackCap }); }),
          CITY_FRONT.map(function (b, i) { return CityBuilding({ x: b.x, baseY: 1010, w: b.w, h: b.h, seed: "c4f" + i, fi: i, faces: DAY.cityFront, detail: 1, cap: DAY.cityFrontCap }); }),
          h("circle", { cx: 1652, cy: 136, r: 980, fill: "url(#sunGlow)", opacity: 0.13 }),
          Airport(time),
          h("rect", { x: 744, y: 922, width: 432, height: 84, rx: 4, fill: DAY.office, stroke: "rgba(22,41,63,0.18)", strokeWidth: 1.5 }),
          h("rect", { x: 744, y: 916, width: 432, height: 9, rx: 4, fill: "#d6dfe9", stroke: "rgba(22,41,63,0.15)", strokeWidth: 1 }),
          h("rect", { x: 762, y: 906, width: 120, height: 14, rx: 3, fill: "#ffffff", stroke: "rgba(22,41,63,0.2)", strokeWidth: 1 }),
          h("rect", { x: 762, y: 906, width: 5, height: 14, fill: COLORS.verm }),
          h("rect", { x: 744, y: 946, width: 432, height: 4.5, fill: "rgba(225, 99, 71,0.8)" }),
          [0, 1, 2, 3].map(function (i) { return h("g", null, h("rect", { x: 774 + i * 96, y: 958, width: 52, height: 48, rx: 2.5, fill: "rgba(120,150,185,0.28)", stroke: "rgba(22,41,63,0.15)", strokeWidth: 1 }), h("rect", { x: 774 + i * 96, y: 958, width: 52, height: 10, fill: "rgba(255,255,255,0.5)" })); }),
          h("rect", { x: 0, y: 1006, width: 1920, height: 8, fill: "#c6cfd9" }),
          h("rect", { x: 0, y: 1014, width: 1920, height: 40, fill: DAY.road }),
          h("line", { x1: 0, y1: 1017.5, x2: 1920, y2: 1017.5, stroke: "rgba(255,255,255,0.3)", strokeWidth: 2 }),
          h("line", { x1: 0, y1: 1034, x2: 1920, y2: 1034, stroke: "rgba(255,255,255,0.75)", strokeWidth: 3.4, strokeDasharray: "26 24" }),
          h("line", { x1: 0, y1: 1051, x2: 1920, y2: 1051, stroke: "rgba(255,255,255,0.3)", strokeWidth: 2 }),
          h("rect", { x: 0, y: 1054, width: 1920, height: 26, fill: DAY.roadEdge }),
          (function () {
            function miniTruck(spin, bob) {
              return h("g", null,
                h("ellipse", { cx: 46, cy: 39.5, rx: 45, ry: 4, fill: "rgba(20,30,45,0.28)" }),
                h("g", { transform: "translate(0," + bob + ")" },
                  h("rect", { x: 0, y: 0, width: 64, height: 30, rx: 3, fill: "#f4f7fa", stroke: "rgba(22,41,63,0.35)", strokeWidth: 1.2 }),
                  h("rect", { x: 0, y: 23, width: 64, height: 4.2, fill: "rgba(225, 99, 71,0.85)" }),
                  h("rect", { x: 6, y: 6, width: 15, height: 3.4, rx: 1.7, fill: "#2a7f8c" }),
                  h("rect", { x: 6, y: 12, width: 9, height: 2.4, rx: 1.2, fill: "rgba(22,41,63,0.3)" }),
                  h("path", { d: "M64,8 L79,8 Q83,8 85,12 L89,20 L90,26 Q90,30 86,30 L64,30 Z", fill: "#3c4a5c", stroke: "rgba(22,41,63,0.4)", strokeWidth: 1 }),
                  h("path", { d: "M78,11 L84.5,11 L87.5,19 L78,19 Z", fill: "#9fc4de" }),
                  h("rect", { x: 87, y: 23, width: 3.5, height: 3, rx: 1, fill: "#ffd24d", opacity: 0.9 })),
                [15, 50, 79].map(function (wx) {
                  return h("g", { transform: "translate(" + wx + ",33) rotate(" + spin + ")" },
                    h("circle", { cx: 0, cy: 0, r: 6, fill: "#232a34" }),
                    h("line", { x1: -3.4, y1: 0, x2: 3.4, y2: 0, stroke: "#8b95a1", strokeWidth: 1.6 }),
                    h("circle", { cx: 0, cy: 0, r: 2.2, fill: "#8b95a1" }));
                }));
            }
            var lanes = [
              { dir: -1, y: 997, sc: 0.9, speed: 54, phase: 620 },
              { dir: 1, y: 1008, sc: 1, speed: 70, phase: 0 },
              { dir: 1, y: 1008, sc: 1, speed: 62, phase: 1360 }
            ];
            return lanes.map(function (L, i) {
              var span = 2560, d = (time * L.speed + L.phase) % span;
              var tx = L.dir === 1 ? d - 300 : 2220 - d;
              var spin = ((time * L.speed) / 37.7) * 360 % 360;
              var bob = Math.sin(time * 6 + i * 2.1) * 0.5;
              return h("g", { transform: "translate(" + tx + "," + L.y + ") scale(" + (L.dir * L.sc) + "," + L.sc + ")" }, miniTruck(spin, bob));
            });
          })(),
          AirportPlane(time)
        )
      ),
      h("div", { style: { position: "absolute", left: 535, top: 12, width: 850, height: 1056, opacity: mapIn * (1 - recede), transform: "scale(" + ((0.95 + 0.05 * mapIn) * (1 - recede * 0.08)) + ") translate(" + (recede * -36) + "px, " + ((1 - mapIn) * 34) + "px)", transformOrigin: "46% 46%", maskImage: "radial-gradient(72% 66% at 48% 50%, rgba(0,0,0,1) 58%, rgba(0,0,0,0.6) 76%, rgba(0,0,0,0) 93%)" } },
        CoverageMap({ prefProgress: prefK, routeProgress: routeK, pinProgress: pinK, flowTime: time })
      ),
      recede < 0.96 ? h("div", { style: { opacity: 1 - recede, transform: "translateX(" + (recede * 60) + "px)" } },
        KpiCard({
          x: 1290, y: 140, width: 540, title: "主要拠点", eyebrow: "OUR BASES", enter: basesEnter, bob: Math.sin(time * 1.1) * 5,
          children: h("div", { style: { display: "flex", flexDirection: "column", gap: 22 } },
            ["itabashi", "shiki", "iruma"].map(function (id, i) {
              var b = JRMAP.bases[id];
              return h("div", { style: { display: "flex", alignItems: "center", gap: 18 } },
                h("div", { style: { width: 34, height: 34, borderRadius: 999, background: i === 0 ? COLORS.teal : "rgba(22,41,63,0.08)", color: i === 0 ? "#fff" : COLORS.cardInk, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONTS.lat, fontWeight: 800, fontSize: 17, flexShrink: 0 } }, i + 1),
                h("div", null,
                  h("div", { style: { fontFamily: FONTS.jp, fontSize: 20, fontWeight: 700, color: COLORS.cardInk } }, b.nm, i === 0 ? h("span", { style: { fontFamily: FONTS.lat, fontSize: 12, fontWeight: 700, color: COLORS.teal, letterSpacing: 2, marginLeft: 12 } }, "HQ") : null),
                  h("div", { style: { fontFamily: FONTS.jp, fontSize: 13.5, color: "#64707d", marginTop: 4 } }, b.ad)
                )
              );
            })
          )
        }),
        KpiCard({
          x: 1290, y: 584, width: 540, title: "ネットワーク概況", eyebrow: "NETWORK OVERVIEW", enter: overviewEnter, bob: Math.sin(time * 1.1 + 1.4) * 5,
          children: h("div", { style: { display: "flex", justifyContent: "space-between", paddingRight: 8 } },
            [{ to: 3, suffix: "", jp: "物流拠点", en: "BASES" }, { to: 7, suffix: "", jp: "対応都県", en: "PREFECTURES" }, { to: 32, suffix: "台", jp: "保有車両", en: "VEHICLES" }].map(function (st) {
              return h("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-start" } },
                Stat({ to: st.to, progress: prefK, suffix: st.suffix, size: 44 }),
                h("div", { style: { fontFamily: FONTS.jp, fontSize: 15, fontWeight: 600, color: "#233241", marginTop: 10 } }, st.jp),
                h("div", { style: { fontFamily: FONTS.lat, fontSize: 10.5, fontWeight: 700, letterSpacing: 2, color: "#8b95a1", marginTop: 4 } }, st.en)
              );
            })
          )
        })
      ) : null,
      SceneTitle({ no: CONTENT.scenes.network.no, heading: CONTENT.scenes.network.heading, enter: titleEnter }),
      frame >= T_NETWORK.logo[0] - 2 && !window.JX_CLEAN_HERO ? h("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 218 } },
        LogoReveal({ enter: logoEnter, flash: flash }),
        h("div", { style: { marginTop: 52, fontFamily: FONTS.jp, fontSize: 76, fontWeight: 800, letterSpacing: 3, color: "#0d2036", textShadow: "0 2px 22px rgba(255,255,255,0.55)", opacity: taglineK, transform: "translateY(" + ((1 - taglineK) * 28) + "px)" } }, CONTENT.brand.tagline),
        h("div", { style: { marginTop: 22, fontFamily: FONTS.lat, fontSize: 17, fontWeight: 700, letterSpacing: 5, color: "#1a4f57", textShadow: "0 1px 10px rgba(255,255,255,0.5)", opacity: taglineK } }, CONTENT.brand.commitEyebrow),
        null
      ) : null,
      Vignette({ opacity: 0.18 })
    );
  }

  /* ============================ MASTER TIMELINE ============================ */
  /* JourneyVideo.tsx: TransitionSeries with slide(18f) then fade(16f). Sequences
   * overlap by the transition duration, so: WORLD [0,438), TRANSIT local0 at
   * master 420 -> [420,736), NETWORK local0 at master 720 -> [720,900). */
  var SLIDE = TIMELINE.slide1Dur, FADE = TIMELINE.fade2Dur;
  var TRANSIT_START = TIMELINE.worldDur + SLIDE - SLIDE; // 420
  var NETWORK_START = TRANSIT_START + (TIMELINE.transitDur + FADE) - FADE; // 720
  function layer(style, inner) { return h("div", { style: _merge({ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }, style) }, inner); }
  function renderMaster(frame) {
    frame = ((frame % DURATION) + DURATION) % DURATION;
    var parts = [];
    // WORLD
    if (frame < TIMELINE.worldDur + SLIDE) {
      var s = frame >= TRANSIT_START ? clamp01((frame - TRANSIT_START) / SLIDE) : 0;
      parts.push(layer({}, sceneWorld(frame)));
    }
    // TRANSIT
    if (frame >= TRANSIT_START && frame < NETWORK_START + FADE) {
      var st = {};
      if (frame < TRANSIT_START + SLIDE) { var s2 = clamp01((frame - TRANSIT_START) / SLIDE); st.opacity = s2 * s2 * (3 - 2 * s2); }
      if (frame >= NETWORK_START) { var f = clamp01((frame - NETWORK_START) / FADE); st.opacity = 1 - f; }
      parts.push(layer(st, sceneTransit(frame - TRANSIT_START)));
    }
    // NETWORK
    if (frame >= NETWORK_START) {
      var sn = {};
      if (frame < NETWORK_START + FADE) { var f2 = clamp01((frame - NETWORK_START) / FADE); sn.opacity = f2; }
      parts.push(layer(sn, sceneNetwork(frame - NETWORK_START)));
    }
    return parts;
  }

  /* scene-index seek beats used by the page scaffold (master frames). */
  var SCENES = [0, T_WORLD.panEnd, TRANSIT_START + SLIDE, NETWORK_START + 34];

  root.JourneyPort.renderMaster = renderMaster;
  root.JourneyPort.mount = mount;
  root.JourneyPort.SCENES = SCENES;
  root.JourneyPort.POSTER_FRAME = DURATION - 1;
  root.JourneyPort._scenes = { world: sceneWorld, transit: sceneTransit, network: sceneNetwork };
})(typeof window !== "undefined" ? window : globalThis);

