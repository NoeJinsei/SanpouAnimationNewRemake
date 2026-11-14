
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
    // one sky for every scene (round 3): deeper overhead, paling through the middle. The pale air low on the
    // horizon is drawn as flat bands by SkyAir(), so the horizon never changes value at a scene change.
    sky: "linear-gradient(to bottom, #3f95d9 0%, #57a9e1 9%, #72b9e6 17%, #92cbed 36%, #a6d5f1 46%, #b3dcf4 100%)",
    sun: "#ffd24d", sunGlow: "255,248,226",
    haze: "232,243,251", hazeK: [0.6, 0.42, 0.22],
    /* The tiers were too close in value to read as distance: the far tier has been given air and
       the near one weight, so the city has a front and a back instead of one pale wash. */
    hill: "#dbe8f3", deep: "#cfdcea", deepTop: "#dee8f3", deepWin: "rgba(255,255,255,0.45)",
    far: ["#9ab0d2", "#a4b8d8", "#8ea6ca"], farCap: "#8097b8",
    mid: ["#53709f", "#5d7cab", "#486595", "#527da2"], midCap: "#3a5276",
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

  /* ---- The truck, round 4 (2026-11-15): drawn again from a blank page ----
     A Japanese medium-duty cab-over dry van in ONE straight-on side elevation, facing right.
     Local units. The rear plane of the cargo box is x 0, the caller's y is local y 96, the tyres stand on
     y 98, the box is 0..122 x 8..74 with its floor at y 71, the front bumper ends at x 177.6.
     Back to front: the contact shadow, the exhaust, the chassis, the two wheels, then the body (under-body
     gear, the box, the rear door leaf, the cab). The body bobs and pitches as one; the wheels never do.
     Two small things ride on the same props: the cab nods a little further than the box on `pitch` (it sits
     on its own mounts, hinged at the front), and the mud flaps trail back with `run`.
     The lettering (owner, 2026-11-14): 三豊運輸 is the big line, the roman name the small line under it.
     Everything static is built once and shared by every truck; the node list has the same shape on every
     frame. No refrigeration unit, no badge, no aerial, no number plate, nobody in the cab. */
  DAY.truckBoxLit = "#ffffff";      // the box: edges that catch the sun
  DAY.truckBoxShade = "#d5dfee";    // the box: white in shade (periwinkle)
  DAY.truckBoxSeam = "#c3cfe3";     // the box: seams between its frame and its panel
  DAY.truckAlu = "#e4eaf3";         // aluminium rails, posts and side guards
  DAY.truckDoor = "#eaeff6";        // rear door panel, seen when it swings open
  DAY.truckSteel = "#8496b0";       // wheels, tank, lock rods
  DAY.truckSteelLit = "#b9c5d6";
  DAY.truckSteelShade = "#55657f";
  DAY.truckCab = "#28395a";         // the cab: navy
  DAY.truckCabLit = "#46608f";
  DAY.truckCabShade = "#1c2a45";
  DAY.truckSeam = "#101b30";        // door seams on the navy
  DAY.truckFrame = "#1c2840";       // chassis, fenders, mirror
  DAY.truckFrameLit = "#2f3e5b";
  DAY.truckTyre = "#151f31";
  DAY.truckTyreLit = "#2b3a52";
  DAY.truckGlass = "#9dbddc";       // glass reflecting the sky
  DAY.truckGlassLit = "#d3e5f5";
  DAY.truckGlassShade = "#6f90b6";  // the seat back seen through it, and glass under the visor
  DAY.truckBumper = "#8a9bb5";      // the bumper: painted steel
  DAY.truckBumperLit = "#bcc8d9";
  DAY.truckBumperShade = "#5a6b87";
  DAY.truckLens = "#f1f5fa";
  DAY.truckExhaust = "#edf2f8";
  DAY.truckShadow = "rgba(10,20,36,0.28)"; // one level shape on the road
  DAY.parcelShade = "#dbe4f1";
  DAY.parcelTapeShade = "#c8523a";

  // a band between two radii, from angle a0 to a1 (degrees, clockwise on screen, 0 = right, -90 = up)
  function arcBand(cx, cy, r0, r1, a0, a1) {
    var q = function (r, a) { var t = a * Math.PI / 180; return (cx + r * Math.cos(t)).toFixed(2) + "," + (cy + r * Math.sin(t)).toFixed(2); };
    var big = a1 - a0 > 180 ? 1 : 0;
    return "M" + q(r1, a0) + " A" + r1 + "," + r1 + " 0 " + big + " 1 " + q(r1, a1) + " L" + q(r0, a1) + " A" + r0 + "," + r0 + " 0 " + big + " 0 " + q(r0, a0) + " Z";
  }
  var TRUCK_WHEELS = [50, 148], TRUCK_WHEEL_R = 11;   // rear (twin tyres: a dished rim), front
  var _truckArt = null;
  function truckArt() {
    if (_truckArt) return _truckArt;
    var ink = COLORS.ink, D = DAY;
    var n2 = function (v) { return Math.round(v * 100) / 100; };
    // a level rectangle as path data, its corners rounded by r
    var rd = function (x, y, w, hh, r) {
      if (!r) return "M" + x + "," + y + "h" + w + "v" + hh + "h" + (-w) + "z";
      var c = "a" + r + "," + r + " 0 0 1 ";
      return "M" + n2(x + r) + "," + y + "h" + n2(w - 2 * r) + c + r + "," + r + "v" + n2(hh - 2 * r) + c + (-r) + "," + r + "h" + n2(2 * r - w) + c + (-r) + "," + (-r) + "v" + n2(2 * r - hh) + c + r + "," + (-r) + "z";
    };
    var F = function (fill, d) { return h("path", { d: d, fill: fill }); };                                  // one colour, many shapes
    var FO = function (fill, d, w) { return h("path", { d: d, fill: fill, stroke: ink, strokeWidth: w, strokeLinejoin: "round" }); };
    var O = function (d, w) { return h("path", { d: d, fill: "none", stroke: ink, strokeWidth: w, strokeLinejoin: "round", strokeLinecap: "round" }); };
    var ring = function (rad, r, n, a0) { var d = ""; for (var i = 0; i < n; i++) { var a = (a0 || 0) + i * 2 * Math.PI / n, cx = Math.cos(a) * rad, cy = Math.sin(a) * rad; d += "M" + (cx - r).toFixed(2) + "," + cy.toFixed(2) + "a" + r + "," + r + " 0 1 0 " + (2 * r) + ",0a" + r + "," + r + " 0 1 0 " + (-2 * r) + ",0"; } return d; };
    var art = {};

    // the contact shadow: one level bar on the road, a little toward the side away from the sun
    art.shadow = F(D.truckShadow, "M-4,96H173a2.4,2.4 0 0 1 0,4.8H-4a2.4,2.4 0 0 1 0,-4.8z");

    // behind the wheels: the chassis rail, the under-run bar's bracket, the gearbox under the cab's back, the exhaust
    art.back = [
      F(D.truckFrame, rd(-1.5, 77, 131, 5.2, 1) + rd(0.8, 81, 2.4, 4.6) + rd(117, 80, 20, 9.4, 2) + "M36.8,87 A13.2,13.2 0 0 1 63.2,87 Z M134.6,87 A13.4,13.4 0 0 1 161.4,87 Z"),   // and the dark of the two wheel housings
      F(D.truckSteelShade, rd(16, 85.6, 21, 3, 1.5)),
      F(D.truckSteel, rd(12.4, 85, 5.6, 4.2, 1.2))
    ];

    // the wheels. Per axle: the tyre with the crescent of light on its shoulder and the rim's lip (shared),
    // the wheel's face, the turning hand holes, the hub. Rear: twin tyres, so the face sits deep in the rim.
    art.tyre = [
      h("circle", { r: TRUCK_WHEEL_R, fill: D.truckTyre }),
      F(D.truckTyreLit, arcBand(0, 0, 8.3, 10.1, -84, 6)),
      h("circle", { r: 7, fill: D.truckSteelLit })
    ];
    art.face = [
      [h("circle", { r: 5.9, fill: D.truckSteelShade }), F(D.truckSteel, arcBand(0, 0, 4.3, 5.9, 80, 190)), h("circle", { r: 4.3, fill: D.truckSteel })],
      [h("circle", { r: 5.9, fill: D.truckSteel })]
    ];
    art.holes = [F(D.truckFrame, ring(3.05, 0.8, 5, 0.3)), F(D.truckFrame, ring(4.2, 1.05, 5, 0))];
    art.hub = [
      [h("circle", { r: 1.9, fill: D.truckSteelLit }), h("circle", { r: 0.9, fill: D.truckSteelShade })],
      [h("circle", { r: 2.8, fill: D.truckSteelShade }), h("circle", { r: 1.9, fill: D.truckSteelLit })]
    ];

    // the mud flaps hang behind each wheel (each in its own group: they trail back at speed)
    art.flap = [F(D.truckTyre, rd(34.2, 85.6, 3.2, 8.8, 0.8)), F(D.truckTyre, rd(133, 79.6, 3.2, 14, 0.8))];

    // the body, part 1: the gear under the floor, then the cargo box
    var box = "M0,10 Q0,8 2,8 L116.5,8 Q122,8 122,13.5 L122,72 Q122,74 120,74 L2,74 Q0,74 0,72 Z";
    art.frontA = [
      F(D.truckFrame, "M34.2,87 A15.8,15.8 0 0 1 65.8,87 L63.2,87 A13.2,13.2 0 0 0 36.8,87 Z" + rd(69.6, 77, 2, 13) + rd(83.4, 77, 2, 13) + rd(122.5, 29.5, 5.2, 48)),   // rear mudguard, side guard stays, the dark gap behind the cab
      F(D.truckAlu, rd(65.5, 80.2, 23.5, 2.7, 1.2) + rd(65.5, 86.4, 23.5, 2.7, 1.2)),                         // side guard rails
      h("rect", { x: 91.4, y: 79.2, width: 11.6, height: 11.6, rx: 1.4, fill: D.truckFrameLit, stroke: ink, strokeWidth: 1.3 }),   // battery box
      F(D.truckSteelLit, rd(95.6, 81.2, 3.2, 2.2, 0.6)),                                                      // its latch
      h("rect", { x: 105.6, y: 78.6, width: 21.6, height: 12.6, rx: 3, fill: D.truckSteel, stroke: ink, strokeWidth: 1.3 }),      // fuel tank
      F(D.truckSteelLit, rd(106.6, 79.3, 19.6, 3.2, 1.6)),                                                    // its top in the sun
      F(D.truckSteelShade, rd(107, 87.6, 18.8, 2.9, 1.4)),
      F(D.truckFrame, rd(110, 78, 2.2, 13.8) + rd(120.2, 78, 2.2, 13.8)),                                     // tank straps
      F(D.truckFrameLit, rd(1.5, 74, 121, 3.2)),                                                              // the body's sub-frame
      F(D.marker, rd(8, 74.5, 5, 2.4, 1) + rd(60, 74.5, 5, 2.4, 1) + rd(110, 74.5, 5, 2.4, 1)),               // side marker lamps
      // the box
      F(D.truckBox, box),
      F(D.truckAlu, "M0,10 Q0,8 2,8 L116.5,8 Q122,8 122,13.5 L122,72 Q122,74 120,74 L117.6,74 L117.6,13.8 Q117.6,11.8 115.6,11.8 L0,11.8 Z" + rd(0, 70.6, 117.6, 3.4)),   // top rail and front corner post in one piece, bottom rail
      F(D.truckBoxShade, rd(4.6, 11.8, 113, 1.8) + rd(1.3, 11.8, 3.3, 58.8)),                                 // shade under the top rail; the rear frame, away from the sun
      F(D.truckBoxLit, rd(2, 9.3, 113.6, 1.4) + rd(119.2, 15.4, 1.5, 55)),                                    // the rail's top and the post's sunny edge
      F(D.truckBoxSeam, rd(4.6, 13.6, 1.3, 57) + rd(116.3, 13.6, 1.3, 57)),                                   // where the panel meets the rear frame and the corner post
      F(COLORS.verm, rd(5.9, 58, 110.4, 7)),                                                                  // the one stripe
      h("text", { x: 14, y: 38.4, fontFamily: FONTS.jp, fontSize: 19, fontWeight: 800, fill: ink, letterSpacing: 1.8, style: { textRendering: "geometricPrecision" } }, CONTENT.brand.nameJp),
      h("text", { x: 14.9, y: 50.4, fontFamily: FONTS.lat, fontSize: 7, fontWeight: 700, fill: D.truckCab, letterSpacing: 3.6, style: { textRendering: "geometricPrecision" } }, CONTENT.brand.nameLat.toUpperCase()),
      O(box, 2.6),
      F(D.truckSteel, rd(-1.7, 16, 3, 5.4, 0.6) + rd(-1.7, 38.3, 3, 5.4, 0.6) + rd(-1.7, 60.6, 3, 5.4, 0.6)),  // rear door hinges, seen edge-on
      // rear end: tail lamp and the end of the under-run bar
      h("rect", { x: -1.9, y: 75.6, width: 3.8, height: 6.6, rx: 1, fill: COLORS.verm, stroke: ink, strokeWidth: 1.2 }),
      F(D.truckBumperShade, rd(-3.2, 83.4, 7.8, 3.4, 1))
    ];

    // the near rear door, drawn fully open (hinge at x 0, reaching 24 to the right) and flipped behind the box by its group
    art.door = [
      h("rect", { x: 0, y: 12.8, width: 24, height: 58.6, rx: 1.2, fill: D.truckDoor, stroke: ink, strokeWidth: 1.6 }),
      F(D.truckBoxShade, rd(0.8, 13.6, 22.4, 2.2) + rd(0.8, 68.4, 22.4, 2.2)),                                 // its top and bottom rails
      F(D.truckSteel, rd(6.6, 13.6, 2, 57) + rd(15.4, 13.6, 2, 57)),                                          // lock rods
      F(D.truckFrame, rd(5.2, 44.6, 5.6, 2.8, 1.3) + rd(14, 44.6, 5.6, 2.8, 1.3) + rd(5.6, 15.4, 4, 2.2) + rd(14.4, 15.4, 4, 2.2) + rd(5.6, 66.6, 4, 2.2) + rd(14.4, 66.6, 4, 2.2)),   // their handles and keepers
      F(D.truckSteelShade, rd(0.8, 17.6, 4.6, 2.4) + rd(0.8, 39.9, 4.6, 2.4) + rd(0.8, 62.2, 4.6, 2.4))        // hinge straps
    ];

    // the body, part 2: the cab and everything on it
    var shell = "M127,80 L127,30.6 Q127,27.5 130.1,27.5 L163.2,27.5 Q165.9,27.5 166.7,29.9 L173.3,51 Q174.9,52 174.9,54.6 L174.9,77.6 Q174.9,80 172.5,80 L159.66,80 A13.6,13.6 0 0 0 136.34,80 Z";
    var glass = "M141.2,34.2 Q141.2,32.6 142.8,32.6 L160.4,32.6 L167.1,54 L157,54 L153.2,50 L142.8,50 Q141.2,50 141.2,48.4 Z";
    var bumper = "M166.8,68.8 Q166.8,67 168.6,67 L175.8,67 Q177.6,67 177.6,68.8 L177.6,78.2 L174.4,83.6 L168.6,83.6 Q166.8,83.6 166.8,81.8 Z";
    art.cab = [
      F(D.truckCab, shell),
      F(D.truckCabLit, rd(129, 28.7, 34.2, 1.5)),                                                             // the roof's edge in the sun
      F(D.truckCabShade, rd(128.2, 30.4, 2.3, 48.4) + "M130.5,66 H173.7 V78.8 H158.85 A13.6,13.6 0 0 0 137.15,78.8 H130.5 Z"),   // the back wall; the lower body, turned under
      F(D.truckFrame, arcBand(148, 87, 13.3, 16.2, -153, -27)),                                               // wheel-arch flare
      F(D.truckGlass, glass + "M163.9,32.4 L167.5,32.4 L173.05,50.2 L169.45,50.2 Z"),                         // door glass; the windscreen, seen from its edge
      F(D.truckGlassLit, "M149.4,32.6 L155.2,32.6 L149.6,50 L143.8,50 Z M165.5,37.6 L169.1,37.6 L171.4,45 L167.8,45 Z"),
      F(D.truckGlassShade, rd(145, 40, 7, 10, 1.6) + "M163.9,32.4 L167.5,32.4 L168.25,34.8 L164.65,34.8 Z"),  // the seat back; glass in the visor's shade
      h("path", { d: glass + "M157,32.6 L157,54", fill: "none", stroke: ink, strokeWidth: 1.5, strokeLinejoin: "round" }),
      h("path", { d: "M138,30.2 L138,72.76 A17.4,17.4 0 0 1 161.2,75.6 L170,75.6 L170,55.6", fill: "none", stroke: D.truckSeam, strokeWidth: 1.5, strokeLinejoin: "round" }),   // door seam
      F(ink, rd(140.3, 56.6, 2.6, 7.6, 1.3) + rd(130.8, 38.2, 3.3, 1.7) + rd(130.8, 50.6, 3.3, 1.7)),         // door handle, grab-handle mounts
      F(D.truckSteelLit, rd(131.5, 37, 1.9, 16.4, 0.95)),                                                     // grab handle
      O(shell, 2.4),
      FO(D.truckCabLit, "M158.2,25.3 L171.8,29.1 Q173,29.5 172.7,30.7 L172.3,32.5 L166,31.5 L158.2,28.7 Z", 1.5),   // the visor
      // lamps, step, bumper
      h("rect", { x: 170.8, y: 56, width: 4.8, height: 10, rx: 1.3, fill: D.truckLens, stroke: ink, strokeWidth: 1.2 }),   // the lamp cluster: head lamp
      F(D.marker, rd(171.4, 56.6, 3.6, 2.8, 0.7)),                                                            // and turn signal
      F(ink, rd(160.2, 77, 7.4, 6.6, 1)),                                                                     // the step
      F(D.truckSteelLit, rd(160.8, 80.6, 6, 1.8)),                                                            // its tread
      FO(D.truckBumper, bumper, 1.6),
      F(D.truckBumperLit, rd(167.6, 67.8, 9.2, 2.3, 1)),
      F(D.truckBumperShade, "M167.6,79.2 H176.2 L174,82.8 H168.6 Q167.6,82.8 167.6,81.8 Z"),
      h("rect", { x: 171.4, y: 72.2, width: 4.2, height: 3.6, rx: 0.9, fill: D.truckLens, stroke: ink, strokeWidth: 1.1 }),   // fog lamp
      // the mirror on its stays, and the small round one under it
      O("M167.9,33.4 L174.6,34 M173.2,50 L174.6,50", 1.5),
      h("rect", { x: 174.2, y: 32, width: 4, height: 14.6, rx: 1.6, fill: D.truckFrame, stroke: ink, strokeWidth: 1.3 }),
      F(D.truckGlass, rd(174.9, 33.6, 1.5, 11.4, 0.7)),
      h("circle", { cx: 176.3, cy: 50.2, r: 2, fill: D.truckFrame, stroke: ink, strokeWidth: 1.2 })
    ];
    return _truckArt = art;
  }
  function Truck(p) {
    var x = p.x, y = p.y, scale = p.scale == null ? 1 : p.scale, distance = p.distance || 0,
      doorOpen = p.doorOpen || 0, bob = p.bob || 0, opacity = p.opacity == null ? 1 : p.opacity, moving = !!p.moving;
    var pitch = p.pitch || 0, run = p.run == null ? (moving ? 1 : 0) : p.run, time = p.time;
    var art = truckArt();
    var rot = (((distance / scale) / TRUCK_WHEEL_R) * (180 / Math.PI)) % 360;
    // the near rear door swings out on its hinge to just past square: what shows is its width seen from the side
    var k = Math.max(0, Math.min(1, doorOpen)), e = k * k * (3 - 2 * k), swing = Math.sin(e * 100 * Math.PI / 180);
    var body = "translate(0, " + bob + ") rotate(" + pitch.toFixed(3) + " 92 80)";
    // the cab sits on its own mounts, hinged at the front: it nods a little further than the box
    var nod = "rotate(" + (pitch * 0.45).toFixed(3) + " 169 80)";
    // the mud flaps hang square when the truck stands and trail back as it runs
    var trail = (run * 6).toFixed(2);
    // exhaust from the pipe under the rear overhang: two puffs paced by the road while driving, two slow
    // wisps paced by the clock while standing; each one swells in and thins out, so none pops on or off
    var idle = time == null ? 0 : 1 - run;
    var puff = function (kk, drive) {
      var a = Math.min(kk * 5, 1) * (1 - kk);
      return drive
        ? h("circle", { cx: (12 - kk * 32).toFixed(2), cy: (87 - kk * 15).toFixed(2), r: (1.8 + kk * 5).toFixed(2), fill: DAY.truckExhaust, opacity: (a * 0.62 * run).toFixed(3) })
        : h("circle", { cx: (12 - kk * 27 - Math.sin(kk * 5) * 1.2).toFixed(2), cy: (87 - kk * kk * 25).toFixed(2), r: (1.4 + kk * 3.8).toFixed(2), fill: DAY.truckExhaust, opacity: (a * 0.7 * idle).toFixed(3) });
    };
    var frac = function (v) { return v - Math.floor(v); };
    return h("g", { transform: "translate(" + x + ", " + y + ") scale(" + scale + ") translate(0, -96)", opacity: opacity },
      art.shadow,
      h("g", null,
        puff(frac(distance / 90), true), puff(frac(distance / 90 + 0.5), true),
        puff(frac((time || 0) * 0.36), false), puff(frac((time || 0) * 0.36 + 0.5), false)),
      h("g", { transform: body }, art.back),
      TRUCK_WHEELS.map(function (cx, i) {
        return h("g", { transform: "translate(" + cx + ", 87)" },
          art.tyre, art.face[i],
          h("g", { transform: "rotate(" + rot.toFixed(2) + ")" }, art.holes[i]),
          art.hub[i]);
      }),
      h("g", { transform: body },
        h("g", { transform: "rotate(" + trail + " 35.8 86)" }, art.flap[0]),
        h("g", { transform: "rotate(" + trail + " 134.6 79.8)" }, art.flap[1]),
        art.frontA,
        h("rect", { x: 1.3, y: 12.6, width: 2.4, height: 58.8, fill: COLORS.recessed, opacity: e.toFixed(3) }),
        h("g", { transform: "scale(" + (-Math.max(swing, 0.001)).toFixed(4) + ", 1)", opacity: Math.min(1, e * 12).toFixed(3) }, art.door),
        h("g", { transform: nod }, art.cab))
    );
  }
  /* ---- Parcel (bottom-centre anchor): a carton with its tape, a hand hole, a label and "this way up" ---- */
  var _parcelArt = {};
  function parcelArt(size) {
    if (_parcelArt[size]) return _parcelArt[size];
    var w = size, hh = size * 0.88, ink = COLORS.ink, tw = Math.max(5, w * 0.115);
    var up = function (ax) { var y0 = hh * 0.9, y1 = hh * 0.62, a = w * 0.05; return "M" + ax + "," + y0 + " L" + ax + "," + y1 + " M" + (ax - a) + "," + (y1 + a) + " L" + ax + "," + y1 + " L" + (ax + a) + "," + (y1 + a); };
    return _parcelArt[size] = h("g", { transform: "translate(" + (-w / 2) + ", " + (-hh) + ")" },
      h("rect", { x: 0, y: 0, width: w, height: hh, rx: 2, fill: COLORS.paper }),
      h("rect", { x: 0, y: 0, width: w, height: hh * 0.14, rx: 2, fill: COLORS.white }),                    // top edge in the sun
      // flat 2D (owner, 2026-11-14): the carton is one face; the shaded strip down its left side is gone
      h("rect", { x: w * 0.19, y: hh * 0.24, width: w * 0.2, height: hh * 0.1, rx: hh * 0.05, fill: COLORS.inkSoft }),   // hand hole
      h("path", { d: up(w * 0.23) + up(w * 0.35), fill: "none", stroke: ink, strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round", opacity: 0.45 }),
      h("rect", { x: w / 2 - tw / 2, y: 0, width: tw, height: hh, fill: COLORS.verm }),                     // tape over the seam
      h("rect", { x: w / 2 - tw / 2, y: 0, width: tw * 0.28, height: hh, fill: DAY.parcelTapeShade }),
      h("rect", { x: w * 0.62, y: hh * 0.5, width: w * 0.3, height: hh * 0.38, rx: 1.5, fill: COLORS.white, stroke: "rgba(16,31,54,0.5)", strokeWidth: 1.2 }),   // label
      h("rect", { x: w * 0.655, y: hh * 0.565, width: w * 0.2, height: 2.6, fill: ink, opacity: 0.6 }),
      h("rect", { x: w * 0.655, y: hh * 0.66, width: w * 0.13, height: 2.6, fill: ink, opacity: 0.35 }),
      h("rect", { x: w * 0.655, y: hh * 0.75, width: w * 0.23, height: hh * 0.08, fill: ink, opacity: 0.8 }),
      h("rect", { x: 0, y: 0, width: w, height: hh, rx: 2, fill: "none", stroke: ink, strokeWidth: 2.2 })
    );
  }

  /* ---- scenery.tsx ---- */
  var SUPPLIER_W = 364;
  /* The supplier's building, round 3, flat: a modern office-and-dock unit drawn as ONE straight-on elevation.
     SUPPLIER_W is the width of the part of its front that is measured from the right end (the ground line
     and the right end are where they always were, so the truck meets it as before); the office front runs
     32 units further left, over the width its return face used to take. A point of the building at local x
     stands in the world at SUPPLIER_X + (x - 24) * scale.
     Colours: blue-grey for a third party's building. Every surface has a base and a shade (the base pushed
     toward navy) for the strip of shade under whatever overhangs it; pale aluminium carries the light. */
  DAY.supInk = "#26344f";                                                              // the outline
  DAY.supWall = "#abbdd9"; DAY.supWallShade = "#889fc4";                               // the hall: metal sandwich panels
  DAY.supJoint = "#96abcd"; DAY.supJointShade = "#768eb6";                             // their joints
  DAY.supBand = "#6d87b3"; DAY.supBandShade = "#59729f";                               // the hall's top band of panels
  DAY.supPod = "#6d87b3"; DAY.supPodShade = "#59729f";                                 // the office part: slate panels
  DAY.supPodJoint = "#5f79a6"; DAY.supPodJointShade = "#4d6692";
  DAY.supPlinth = "#4c628b"; DAY.supPlinthLight = "#677ea6"; DAY.supPlinthShade = "#3f547b";   // base course
  DAY.supAlu = "#e6edf6"; DAY.supAluLit = "#fafcfe"; DAY.supAluShade = "#c4d0e3";              // copings, sills, sun shades, canopies
  DAY.supFrame = "#3f5479"; DAY.supFrameShade = "#34476b";                                    // window and door frames
  DAY.supGlass = "#c9def2"; DAY.supGlassHi = "#ecf5fd"; DAY.supGlassIn = "#b4cce7"; DAY.supGlassShade = "#a3bedd";          // glass, sky in it, what stands behind it, glass in shade
  DAY.supWarmHi = "#ffeabf"; DAY.supWarmIn = "#f6cd84"; DAY.supWarmShade = "#f0c275";
  DAY.supBlind = "#eef3f9"; DAY.supBlindFold = "#dae3ef"; DAY.supBlindShade = "#cdd8e7";
  DAY.supPlate = "#eef3f9"; DAY.supPlateShade = "#ccd8e9"; DAY.supBar1 = "#5a739e"; DAY.supBar1Shade = "#4a628c"; DAY.supBar2 = "#9bafcb"; DAY.supBar2Shade = "#8499b8";
  DAY.supSteel = "#d3dcea"; DAY.supSteelLine = "#b8c5da"; DAY.supSteelShade = "#b1bed4"; DAY.supSteelLineShade = "#9aaac4";
  DAY.supSteelBar = "#8fa1bd"; DAY.supSteelBarShade = "#7a8dab";
  DAY.supDoor = "#566f9b"; DAY.supDoorShade = "#475f8a";
  DAY.supCanopyUnder = "#2c3d5e";
  DAY.supDock = "#7d92b5"; DAY.supRubber = "#1a2434";
  DAY.supInside = "#3a4e75"; DAY.supInsideFloor = "#5b7199"; DAY.supInsideStock = "#6c83aa"; DAY.supInsidePale = "#aebcd2";
  DAY.supSafety = "#f2c14e";
  DAY.supPallet = "#4f73b3"; DAY.supPalletDark = "#35508a";
  DAY.supCarton = "#d9dfe8"; DAY.supCartonTop = "#eef2f7"; DAY.supCartonTape = "#a9b5c8"; DAY.supPaperShade = "#dfe6ef";
  DAY.supGroundShade = "#a9b1bc";

  // the working dock (round 3): inside the open door, and the supplier's own forklift
  DAY.supIn = "#566b93"; DAY.supInDeep = "#3a4e75";                                    // the back wall in cool shade; deeper under the door head
  DAY.supInFloorLit = "#dfe6f0"; DAY.supInFloor = "#93a5c2";                           // the floor: where the sun falls in, and in the forklift's own shade
  DAY.supInRack = "#394b70"; DAY.supInRackNear = "#26344f";                            // racking in silhouette; the working rack by the door
  DAY.supInStock = "#93a5c4"; DAY.supInStockLit = "#b7c5db";                           // stock on the far racks, seen in shade
  DAY.supFkBody = "#b4c4dd"; DAY.supFkTrim = "#3f5479";                                // the forklift: blue-grey, slate
  DAY.supFkGlass = "#26344f"; DAY.supFkGlassHi = "#4c628b";                            // its cab: dark glass
  DAY.supFkMast = "#4c628b"; DAY.supFkMastLit = "#9bafcb"; DAY.supFkFork = "#1c2840";
  // A polygon clipped to a box, and a polygon as path data (the glass sheens here and the city's glazing use them).
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

  /* Local units (x 1.9 on screen), ground at y 278. The front runs x -32..W; every edge of the building is
     vertical or horizontal and there is one face.
     Two rectangles under level flat roofs with nothing on them, standing side by side: on the left the
     office part, taller, in tall slate panels set out on the module of its glazing (a ribbon of five panes
     under a slim sun shade, a strip of three below); on the right the dock hall, lower, in broad horizontal
     bands of light metal panel under one darker band, with a slim canopy hung over the dock. A darker base
     course runs under both.
     Light, top right, shows three ways only: the flat tones themselves, a lighter top edge on what catches
     it (copings, sills, the canopies), and a level strip of shade straight under whatever stands proud
     (copings, sun shades, sills, canopies, the name plate); the strip takes each material it crosses exactly
     one tone down.
     The dock is open and at work. The door stands at street level with its shutter rolled up; the inside is
     drawn behind it (cool shade, racking in silhouette, the sun on the floor as one flat band); the
     supplier's forklift works the rack just inside; a roller conveyor on legs runs out of the door, along
     the front, to where the truck's rear stands, its rollers at the height of the truck's floor.
     Everything that stands still is built once, in two cached groups: what is behind the forklift, and what
     is in front of it (the working rack's frame, the foot of the shutter, the conveyor). SupplierBuilding()
     puts the forklift between the two on the ambient clock. */
  var SUP_FORK = 0.86;       // the forklift is drawn in its own units, this many of the building's (Sanpou's is 1.12: this one stands inside)
  var _supMemo = {};
  function supplierArt(x, y, scale) {
    var mk = x + "|" + y + "|" + scale;
    if (_supMemo[mk]) return _supMemo[mk];
    var D = DAY, INK = D.supInk, out = [], front = [];
    var G = 278, W = SUPPLIER_W, OX = W - 340;             // ground; the front's right end; where SUPPLIER_X falls
    var XL = -32, PW = 150, PT = 22, HT = 56, CAP = 6, BC = 262;   // the front's left end; where the two parts meet; office top; hall top; coping height; base course top
    var WY = 94, WH = 54, FW = 1.6;                        // upper windows: head, height; frame width
    var RX = -20, RW = 158, MOD = (RW - FW) / 5;           // the ribbon: left end, width; one pane plus one frame = the office's panel module
    var BAND = 82;                                         // foot of the hall's top band of darker panels
    var LINE = Math.round(22 / scale) / 10;                // loose objects carry the parcels' ink line (2.2 px on screen)
    function r1(v) { return Math.round(v * 10) / 10; }
    function R(rx0, ry0, w, hh, fill, rr) { return h("rect", { x: r1(rx0), y: r1(ry0), width: r1(w), height: r1(hh), rx: rr, fill: fill }); }
    function rd(rx0, ry0, w, hh) { return "M" + r1(rx0) + "," + r1(ry0) + "h" + r1(w) + "v" + r1(hh) + "h" + r1(-w) + "z"; }
    function fill(list, d, colour) { if (d) list.push(h("path", { d: d, fill: colour })); }

    // the strips of shade, each a level rectangle straight under what throws it: [x, y, width, height]
    var SH = [
      [XL, PT + CAP, PW - XL, 3.4], [PW, HT + CAP, W - PW, 3.4],        // under the two copings
      [RX, WY, RW, 6],                                                  // under the sun shade over the ribbon
      [RX - 2, WY + WH + 3, RW + 4, 2.8],                               // under its sill
      [238, WY, 84, 6], [236, WY + WH + 3, 88, 2.8],                    // the same pair at the window over the dock
      [RX - 1.5, 215, 3 * MOD + FW + 3, 2.8],                           // under the low strip window's sill
      [204, 174, 158, 7],                                               // under the dock canopy
      [158, 209, 46, 5.5],                                              // under the door canopy
      [-16, 66, 88, 2.6],                                               // under the name plate
      [162, 129, 38, 2.6]                                               // under the louvre's sill
    ];
    function castD(x0, y0, x1, y1) {
      var d = "";
      for (var i = 0; i < SH.length; i++) {
        var s = SH[i], ax = Math.max(x0, s[0]), ay = Math.max(y0, s[1]), bx = Math.min(x1, s[0] + s[2]), by = Math.min(y1, s[1] + s[3]);
        if (bx - ax > 0.05 && by - ay > 0.05) d += rd(ax, ay, bx - ax, by - ay);
      }
      return d;
    }
    // flat surfaces of one material, and whatever shade falls on them
    function tone(list, rects, colour, shade) {
      var d = "", s = "";
      rects.forEach(function (q) { d += rd(q[0], q[1], q[2], q[3]); s += castD(q[0], q[1], q[0] + q[2], q[1] + q[3]); });
      fill(list, d, colour); fill(list, s, shade);
    }
    /* glazing: n panes in a thin frame. Per pane: warm (a lit room), inside (what stands behind the glass, as
       [from, to, height] along the foot of the pane), hi (sky in the glass, as [offset, width, lean]: every pane
       gets its own), blind (how far a roller blind is down). The window head shades the top of each pane. */
    function glaze(list, gx, gy, w, hh, n, spec) {
      var pw = (w - FW * (n + 1)) / n, y0 = gy + FW, ph = hh - 2 * FW, y1 = y0 + ph;
      var warm = "", dark = "", wdark = "", hi = "", whi = "", shade = "", wshade = "", blind = "", fold = "", bshade = "", frame = [[gx, gy, w, FW], [gx, gy + hh - FW, w, FW]];
      for (var i = 0; i <= n; i++) frame.push([gx + i * (pw + FW), gy + FW, FW, ph]);
      for (i = 0; i < n; i++) {
        var s = spec[i] || {}, px = gx + FW + i * (pw + FW), px1 = px + pw, k, a, d;
        if (s.warm) warm += rd(px, y0, pw, ph);
        for (k = 0; s.inside && k < s.inside.length; k++) { a = s.inside[k]; d = rd(px + a[0] * pw, y1 - a[2], (a[1] - a[0]) * pw, a[2]); if (s.warm) wdark += d; else dark += d; }
        for (k = 0; s.hi && k < s.hi.length; k++) {
          a = s.hi[k]; var lean = ph * (a[2] == null ? 0.7 : a[2]);
          d = _polyD(_clipPoly([[px + a[0], y0], [px + a[0] + a[1], y0], [px + a[0] + a[1] - lean, y1], [px + a[0] - lean, y1]], px, y0, px1, y1));
          if (s.warm) whi += d; else hi += d;
        }
        d = castD(px, y0 + 2.2, px1, y1) + rd(px, y0, pw, 2.2);
        if (s.warm) wshade += d; else shade += d;
        if (s.blind) {
          blind += rd(px, y0, pw, s.blind);
          for (k = 8; k < s.blind - 4; k += 8) fold += rd(px, y0 + k, pw, 1.4);
          fold += rd(px, y0 + s.blind - 2.4, pw, 2.4);
          bshade += castD(px, y0 + 2.2, px1, y0 + s.blind) + rd(px, y0, pw, 2.2);
        }
      }
      list.push(R(gx, gy, w, hh, D.supGlass));
      fill(list, warm, D.warm); fill(list, dark, D.supGlassIn); fill(list, wdark, D.supWarmIn);
      fill(list, hi, D.supGlassHi); fill(list, whi, D.supWarmHi);
      fill(list, shade, D.supGlassShade); fill(list, wshade, D.supWarmShade);
      fill(list, blind, D.supBlind); fill(list, fold, D.supBlindFold); fill(list, bshade, D.supBlindShade);
      tone(list, frame, D.supFrame, D.supFrameShade);
    }
    // the pale aluminium surround of an upper window: a sun shade over it, a sill under it, a slim cheek each side
    function surround(gx, w) {
      fill(out, rd(gx - 2, WY - 4, w + 4, 4) + rd(gx - 2, WY + WH, w + 4, 3) + rd(gx - 2, WY, 2, WH) + rd(gx + w, WY, 2, WH), D.supAlu);
      out.push(R(gx - 2, WY - 4, w + 4, 1.4, D.supAluLit));
    }
    function carton(list, cx0, cy0, w, hh) {                                              // a plain carton: its top edge in the sun, a strip of tape
      list.push(h("rect", { x: cx0, y: cy0, width: w, height: hh, rx: 0.8, fill: D.supCarton, stroke: COLORS.ink, strokeWidth: LINE }));
      list.push(R(cx0 + LINE / 2, cy0 + LINE / 2, w - LINE, 2.4, D.supCartonTop), R(cx0 + w * 0.5 - 1.5, cy0 + LINE / 2, 3, hh - LINE, D.supCartonTape));
    }

    /* ---- the ground: one level strip of contact shade under the whole front ---- */
    out.push(R(XL - 7, G, W - XL + 14, 3.6, D.supGroundShade));

    /* ---- the outline: ink behind the whole silhouette (two rectangles and the step between their roofs) ---- */
    (function () {
      var OL = 2.4, OB = 1.2;
      fill(out, _polyD([[XL - OL, PT - OL], [PW + OL, PT - OL], [PW + OL, HT - OL], [W + OL, HT - OL], [W + OL, G + OB], [XL - OL, G + OB]]), INK);
    })();

    /* ---- the fronts: tall slate panels on the office part, light metal panels in broad bands on the hall ---- */
    tone(out, [[XL, PT + CAP, PW - XL, BC - PT - CAP]], D.supPod, D.supPodShade);
    (function () {
      var j = [[XL, 165.2, PW - XL, 1.6]];
      for (var i = 0; i <= 5; i++) j.push([RX + i * MOD, PT + CAP, FW, WY - 4 - PT - CAP], [RX + i * MOD, WY + WH + 3, FW, BC - WY - WH - 3]);
      tone(out, j, D.supPodJoint, D.supPodJointShade);
    })();
    tone(out, [[PW, BAND, W - PW, BC - BAND]], D.supWall, D.supWallShade);
    tone(out, [[PW, HT + CAP, W - PW, BAND - HT - CAP]], D.supBand, D.supBandShade);
    tone(out, [[PW, 93.2, W - PW, 1.6], [PW, 129.2, W - PW, 1.6], [PW, 165.2, W - PW, 1.6], [PW, 201.2, W - PW, 1.6], [PW, 237.2, W - PW, 1.6]], D.supJoint, D.supJointShade);
    tone(out, [[XL, BC, W - XL, G - BC]], D.supPlinth, D.supPlinthShade);
    out.push(R(XL, BC, W - XL, 1.8, D.supPlinthLight));
    // copings: a thin pale cap on each roof, its top edge in the sun
    fill(out, rd(XL, PT, PW - XL, CAP) + rd(PW, HT, W - PW, CAP), D.supAlu);
    fill(out, rd(XL, PT, PW - XL, 1.6) + rd(PW, HT, W - PW, 1.6), D.supAluLit);

    /* ---- office part ---- */
    // name plate: no lettering, two bars stand in for a name
    tone(out, [[-16, 50, 88, 16]], D.supPlate, D.supPlateShade);
    tone(out, [[-10, 55, 47, 6]], D.supBar1, D.supBar1Shade); tone(out, [[41, 55, 23, 6]], D.supBar2, D.supBar2Shade);
    // the ribbon: five panes across the front, under a slim sun shade
    glaze(out, RX, WY, RW, WH, 5, [
      { blind: 16, hi: [[38, 9]], inside: [[0, 0.55, 12]] },
      { hi: [[27, 4, 0.5], [38, 10, 0.5]], inside: [[0.35, 1, 17]] },
      { blind: 31 },
      { warm: 1, hi: [[43, 7]], inside: [[0, 0.45, 13]] },
      { hi: [[50, 14, 0.9]], inside: [[0.5, 1, 21], [0, 0.5, 10]] }]);
    surround(RX, RW);
    // the low strip of windows over the stores: the ribbon's first three bays again
    glaze(out, RX, 188, 3 * MOD + FW, 24, 3, [{ hi: [[24, 7]] }, { hi: [[11, 3.4, 0.5]] }, { hi: [[18, 5], [28, 3.4]] }]);
    tone(out, [[RX - 1.5, 212, 3 * MOD + FW + 3, 3]], D.supAlu, D.supAluShade);

    /* ---- hall ---- */
    // the window over the dock: the ribbon's little brother, same head and sill
    glaze(out, 238, WY, 84, WH, 3, [
      { blind: 22, hi: [[38, 7]] },
      { hi: [[24, 4, 0.5], [33, 9, 0.5]], inside: [[0.2, 0.85, 14]] },
      { warm: 1, hi: [[42, 7]], inside: [[0.45, 1, 18]] }]);
    surround(238, 84);
    // a ventilation louvre over the staff door: slats in a frame, a sill
    tone(out, [[164, 104, 34, 23]], D.supFrame, D.supFrameShade);
    fill(out, rd(166.4, 106.6, 29.2, 3) + rd(166.4, 111.4, 29.2, 3) + rd(166.4, 116.2, 29.2, 3) + rd(166.4, 121, 29.2, 3), D.supSteelBar);
    tone(out, [[162, 126.6, 38, 2.4]], D.supAlu, D.supAluShade);
    // staff door: a glazed leaf in a thin frame, a pull bar, a step, a slim canopy, a call panel beside it
    tone(out, [[164, 214, 34, G - 214]], D.supFrame, D.supFrameShade);
    tone(out, [[166, 216, 30, G - 216]], D.supDoor, D.supDoorShade);
    glaze(out, 169, 219.4, 24, 36, 1, [{ hi: [[27, 7]] }]);
    out.push(R(166, 268, 30, 10, D.supSteelBar), R(189.4, 257, 2.6, 9, D.supAlu, 1.3), R(161, 275, 40, 3, D.supPlinthLight));
    tone(out, [[158, 205, 46, 4]], D.supAlu, D.supAluShade);
    out.push(R(158, 205, 46, 1.4, D.supAluLit));
    out.push(R(202.4, 236, 6.4, 11, D.supAlu, 1), R(204, 238, 3.2, 3.2, D.supFrame));

    /* ---- the dock: an open door at street level, and what is inside ---- */
    var DX = 228, DW = 104, DH = 94, DY = G - DH, K = SUP_FORK;          // the clear opening: its left jamb, width and height; its head
    var RKX = 303.6, RKF = 46.4;                                          // the working rack: where a pallet's left end stands (building units); the top of its middle beams (forklift units)
    function B(bx, foot, w, ht) { return [bx, G - foot - ht, w, ht]; }   // a level rectangle, by the height of its foot above the ground
    function rds(list) { var d = ""; for (var k = 0; k < list.length; k++) d += rd(list[k][0], list[k][1], list[k][2], list[k][3]); return d; }
    function n2(v) { return Math.round(v * 100) / 100; }
    // a pallet seen from its end, and plain cartons with a strip of tape (forklift units; x from the pallet's left end, heights above the ground)
    function palletD(f) { return "M0," + n2(-f - 0.9) + "h28v0.9h-28z M0," + n2(-f - 3.5) + "h3v2.6h-3z M12.5," + n2(-f - 3.5) + "h3v2.6h-3z M25," + n2(-f - 3.5) + "h3v2.6h-3z M0," + n2(-f - 4.8) + "h28v1.3h-28z"; }
    function crates(list) {
      var body = "", top = "", tape = "";
      list.forEach(function (c) {
        var y0 = -(c[1] + c[3]);
        body += "M" + c[0] + "," + n2(y0) + "h" + c[2] + "v" + c[3] + "h" + (-c[2]) + "z";
        top += "M" + n2(c[0] + 0.55) + "," + n2(y0 + 0.55) + "h" + n2(c[2] - 1.1) + "v1.3h" + n2(1.1 - c[2]) + "z";
        tape += "M" + n2(c[0] + c[2] / 2 - 1) + "," + n2(y0 + 0.55) + "h2v" + n2(c[3] - 1.1) + "h-2z";
      });
      return [h("path", { d: body, fill: D.supCarton, stroke: COLORS.ink, strokeWidth: 1.1, strokeLinejoin: "round" }), h("path", { d: top, fill: D.supCartonTop }), h("path", { d: tape, fill: D.supCartonTape })];
    }
    // cool shade, and the sun lying on the floor as one flat band
    fill(out, rds([B(DX, 0, DW, DH)]), D.supIn);
    fill(out, rds([B(DX, 0, DW, 4.2)]), D.supInFloorLit);
    // racking along the back wall, in silhouette: stock on three levels of beams, a pallet of cartons on the floor of each bay
    (function () {
      var ux = [233, 262.6, 292.2], S = 0.9, rack = [], pallet = [], stock = [], lit = [];
      var PAT = [
        [[0.5, 0, 13, 12], [14.5, 0, 12.5, 9], [15.5, 9, 9.5, 8]],
        [[0.5, 0, 9, 15], [10.5, 0, 8.5, 10], [20, 0, 8, 13]],
        [[0.5, 0, 27, 8], [2, 8, 11, 9], [14, 8, 12, 7]],
        [[2, 0, 12, 11], [2, 11, 12, 8], [16.5, 0, 10.5, 14]],
        [[0.5, 0, 12.5, 11], [14, 0, 13.5, 8]],
        [[8, 0, 12, 10]]
      ];
      var LOAD = [
        [[0.6, 0, 13.4, 11.5], [14.6, 0, 13.4, 11.5], [0.6, 11.5, 13.4, 10], [15.6, 11.5, 9, 8]],
        [[0.6, 0, 27.4, 13], [3, 13, 11, 9], [15, 13, 11, 7]]
      ];
      var SET = [[0, 3, 4], [2, 1, 5]], FLOOR = [0, 1];     // which pattern stands on which level of each bay; the load on each floor pallet
      function put(list, cx, foot) { list.forEach(function (c) { stock.push(B(cx + c[0] * S, foot + c[1], c[2] * S - 0.8, c[3] - 0.8)); lit.push(B(cx + c[0] * S, foot + c[1] + c[3] - 2.4, c[2] * S - 0.8, 1.6)); }); }
      ux.forEach(function (u) { rack.push(B(u, 4.2, 2.2, DH - 4.2)); });
      [30, 52, 74].forEach(function (lv) { rack.push(B(ux[0], lv, ux[2] + 2.2 - ux[0], 2)); });
      [0, 1].forEach(function (c) {
        var cx = ux[c] + 2.9;
        pallet.push(B(cx + 0.4, 4.2, 24.8, 3));
        put(LOAD[FLOOR[c]], cx, 7.2);
        [32, 54, 76].forEach(function (lv, li) { put(PAT[SET[c][li]], cx, lv); });
      });
      fill(out, rds(rack), D.supInRack); fill(out, rds(pallet), D.supPalletDark);
      fill(out, rds(stock), D.supInStock); fill(out, rds(lit), D.supInStockLit);
    })();
    // the working rack just inside the door, seen from its end: the stock that stays (on the floor and on its
    // top beams); the forklift serves the beams between them
    out.push(h("g", { transform: "translate(" + RKX + ", " + G + ") scale(" + K + ")" },
      h("path", { d: palletD(0.5) + palletD(84.2), fill: D.supPallet }),
      crates([[0.8, 5.3, 13, 12], [14.2, 5.3, 13, 12], [0.8, 17.3, 13, 10.4], [14.2, 17.3, 13, 10.4], [0.8, 89, 13, 10], [15, 89, 11, 8.4]])));
    // deeper shade under the door head
    out.push(h("path", { d: rds([B(DX, DH - 16, DW, 16)]), fill: D.supInDeep, opacity: 0.55 }));
    // the door's portal: hood and jambs, down to the ground
    tone(out, [[DX - 6, DY - 8, DW + 12, 8], [DX - 6, DY, 6, DH], [DX + DW, DY, 6, DH]], D.supFrame, D.supFrameShade);
    // the canopy: a slim slab seen edge on, its top edge in the sun, a dark drip edge under it
    out.push(R(202.8, 163.8, 160.4, 11.4, INK));
    out.push(R(204, 165, 158, 7, D.supAlu), R(204, 165, 158, 1.6, D.supAluLit), R(204, 172, 158, 2, D.supCanopyUnder));
    /* ---- the yard: few things, each with the same ink line ---- */
    // empty pallets, three high
    (function () {
      var deck = "", py;
      for (var i = 0; i < 3; i++) { py = G - 7.2 * (i + 1); deck += rd(14, py, 40, 2.4) + rd(14, py + 5, 40, 2.2) + rd(14, py + 2.4, 6, 2.6) + rd(31, py + 2.4, 6, 2.6) + rd(48, py + 2.4, 6, 2.6); }
      out.push(h("rect", { x: 14, y: G - 21.6, width: 40, height: 21.6, fill: D.supPalletDark, stroke: COLORS.ink, strokeWidth: LINE }));
      fill(out, deck, D.supPallet);
    })();
    // a roll cage with two cartons in it, one of them the kind being loaded
    out.push(h("g", { transform: "translate(38, 0)" }, (function () {
      var c = [];
      carton(c, 72, 250.6, 22, 19);
      c.push(h("rect", { x: 74, y: 235.6, width: 18, height: 15, rx: 0.8, fill: COLORS.paper, stroke: COLORS.ink, strokeWidth: LINE }), R(74.6, 236.2, 16.8, 2.2, COLORS.white), R(81.4, 236.2, 3.2, 13.8, COLORS.verm));
      c.push(h("path", { d: "M69.4,226V270.6M96.6,226V270.6M69.4,227.2H96.6M69.4,246H96.6M67.4,270.6H98.6", fill: "none", stroke: COLORS.ink, strokeWidth: r1(2 + 2 * LINE) }));
      c.push(h("path", { d: "M69.4,227.2V270.6M96.6,227.2V270.6M69.4,227.2H96.6M69.4,246H96.6M68.6,270.6H97.4", fill: "none", stroke: D.supAlu, strokeWidth: 2 }));
      c.push(h("circle", { cx: 72.4, cy: 275, r: 2.6, fill: COLORS.ink }), h("circle", { cx: 93.6, cy: 275, r: 2.6, fill: COLORS.ink }));
      return c;
    })()));
    // a guide post at the door's left jamb (the conveyor line takes the right-hand side)
    [212.5].forEach(function (bx) {
      out.push(h("rect", { x: bx, y: 239, width: 7.4, height: G - 239, rx: 2, fill: D.supSafety, stroke: COLORS.ink, strokeWidth: LINE }));
      fill(out, rd(bx, 248.6, 7.4, 7) + rd(bx, 263, 7.4, 7), COLORS.ink);
    });

    /* ---- in front of the forklift: the working rack's frame, the foot of the rolled-up shutter ---- */
    fill(front, rds([B(RKX - 2.9, 0, 2.6, DH), B(RKX + 24.4, 0, 2.6, DH), B(RKX - 2.9, 37.5, 29.9, 2.4), B(RKX - 2.9, 70, 29.9, 2.4), B(RKX - 4.1, 0, 5, 1.4), B(RKX + 23.2, 0, 5, 1.4)]), D.supInRackNear);
    front.push(R(DX, DY, DW, 6, D.supSteelBar), R(DX, DY, DW, 2, D.supSteelBarShade), R(DX + DW / 2 - 7, DY + 2.4, 14, 2.4, D.supFrame, 1.2));
    /* ---- the roller conveyor: a pale aluminium bed on legs, carrying the ink line of the loose things in the
       yard; it comes out of the door and runs along the front to the truck's rear, its top at the height of
       the truck's floor, and a hinged plate bridges the last step ---- */
    (function () {
      var x0 = DX, x1 = 377, top = 8.4, ht = 4.6, legs = "", dots = "", r = 1.1, cy = r1(G - top + ht / 2 + 0.15), cx;
      [243.5, 272.2, 302, 329.3, 352, 373.4].forEach(function (lx) { legs += rd(lx - 1.1, G - top + ht, 2.2, top - ht) + rd(lx - 2.7, G - 1.2, 5.4, 1.2); });
      for (cx = x0 + 3.6; cx < x1 - 2; cx += 6.05) dots += "M" + r1(cx - r) + "," + cy + "a" + r + "," + r + " 0 1 0 " + (2 * r) + ",0a" + r + "," + r + " 0 1 0 " + (-2 * r) + ",0";
      fill(front, legs, COLORS.ink);
      fill(front, rd(375.6, G - top, 6.3, 1.8), D.supSteelBar);
      front.push(h("rect", { x: x0, y: r1(G - top), width: x1 - x0, height: ht, rx: 0.8, fill: D.supAlu, stroke: COLORS.ink, strokeWidth: LINE }));
      front.push(R(x0 + LINE / 2, G - top + LINE / 2, x1 - x0 - LINE, 0.9, D.supAluLit));
      fill(front, dots, D.supFrame);
    })();

    /* ---- the supplier's forklift: Sanpou's drawing in this building's blue-greys. Side-on and facing right,
       local to its front axle on the ground: a counterbalance truck with an enclosed cab (dark glass, nobody
       in it), a two-stage mast, a fork carriage ---- */
    var CI = COLORS.ink, BODY = "M-46,-11L-46,-23Q-46,-29 -40,-29L-11,-29L-7,-35L3,-35Q4.6,-35 4.6,-33.4L4.6,-9L-44,-9Q-46,-9 -46,-11Z", fk = {};
    fk.body = [
      h("path", { d: BODY, fill: D.supFkBody }),
      h("path", { d: "M-46,-11L-46,-23Q-46,-29 -40,-29L-34,-29L-34,-9L-44,-9Q-46,-9 -46,-11Z M-34,-13.4h38.6v4.4h-38.6z", fill: D.supFkTrim }),   // the counterweight and the chassis rail
      h("path", { d: "M-31,-22h23v3.8h-23z", fill: D.supSafety }),
      h("path", { d: BODY, fill: "none", stroke: CI, strokeWidth: 1.2, strokeLinejoin: "round" }),
      h("rect", { x: -39, y: -60, width: 33.6, height: 31, rx: 2.4, fill: D.supFkBody, stroke: CI, strokeWidth: 1.2 }),
      h("rect", { x: -36.2, y: -56.2, width: 28, height: 27.2, rx: 1, fill: D.supFkGlass }),
      h("path", { d: "M-21,-56.2h6.5l-9,27.2h-6.5z M-12,-56.2h2.4l-9,27.2h-2.4z", fill: D.supFkGlassHi }),
      h("rect", { x: -41, y: -62.6, width: 40, height: 4, rx: 1.4, fill: D.supFkTrim, stroke: CI, strokeWidth: 1 })
    ];
    fk.mast = [
      h("rect", { x: 3.7, y: -68, width: 5.6, height: 65.4, rx: 0.8, fill: CI }),
      h("rect", { x: 4.5, y: -67.2, width: 4, height: 63.8, fill: D.supFkMast }),
      h("rect", { x: 6.6, y: -66.2, width: 1.3, height: 61.8, fill: D.supFkMastLit })
    ];
    fk.carriage = [
      h("rect", { x: 8.5, y: -24, width: 2.8, height: 26, rx: 0.6, fill: D.supFkTrim, stroke: CI, strokeWidth: 1 }),
      h("path", { d: "M8.5,0H37.6V0.5L35.8,1.5H8.5Z", fill: D.supFkFork })
    ];
    fk.wheel = [7.5, 6].map(function (r) {
      return {
        tyre: [h("circle", { r: r, fill: D.truckTyre }), h("circle", { r: r1(r * 0.56), fill: D.supSteelBar })],
        bar: h("path", { d: "M" + r1(-r * 0.5) + ",-0.9h" + r1(r) + "v1.8h" + r1(-r) + "z M-0.9," + r1(-r * 0.5) + "h1.8v" + r1(r) + "h-1.8z", fill: D.supFrame }),
        hub: h("circle", { r: r1(r * 0.2), fill: D.supAlu })
      };
    });
    // what it carries: a pallet (its left end at x 0, its foot at y 0) with four of the supplier's plain cartons
    fk.load = [h("path", { d: palletD(0), fill: D.supPallet }), crates([[0.8, 4.8, 13, 11.4], [14.2, 4.8, 13, 11.4], [0.8, 16.2, 13, 10], [15, 16.2, 10, 8]])];

    return _supMemo[mk] = {
      at: "translate(" + x + ", " + y + ") scale(" + scale + ") translate(" + (-OX) + ", " + (-G) + ")",
      back: h("g", { "data-cache": "supplier-" + mk, "data-box": "-44 14 416 274" }, out),
      front: h("g", { "data-cache": "supdock-" + mk, "data-box": "226 182 158 100" }, front),
      fk: fk, ground: G, rackX: RKX, rackFoot: RKF,
      clip: h("clipPath", { id: "wSupDoor" }, h("rect", { x: DX, y: DY, width: DW, height: DH }))
    };
  }

  /* The supplier's forklift works the rack just inside the door: a round of 24.2 s on the ambient clock (t in
     seconds). It comes in from the hall with a pallet of cartons, raises it, sets it on the rack's middle
     beams, backs off, lowers its forks and reverses away; on its next visit it comes in empty and takes the
     pallet down again. So the rack is back where it began when the loop closes, and nothing ever pops.
     x is its front axle (building units), L the height of the fork tops (its own units); every move starts
     and stops with no jolt.
     The round is set to scene 01: the forklift is on its way in as the scene opens, lifts its pallet behind the
     line of cartons while the truck is loaded, and sets it on the rack and backs off while the scene holds
     (the rack is at the right of the door, which is the part a phone still shows by then). */
  var SUP_ROUND = 24.2;
  function supForkPose(t) {
    var T = SUP_ROUND, H = T / 2, u = ((t + 0.5) % T + T) % T;
    var S = function (a, b) { var k = clamp01((u - a) / (b - a)); return k * k * k * (k * (6 * k - 15) + 10); };
    return {
      u: u,
      x: 190 + 75.38 * (S(0, 3.5) - S(9.7, 12.1) + S(H, H + 3.5) - S(H + 9.7, H + 12.1)) + 28.5 * (S(5.5, 6.9) - S(7.3, 8.5) + S(H + 5.5, H + 6.9) - S(H + 7.3, H + 8.5)),
      L: 8 + 43.3 * S(3.1, 5.7) - 2.5 * S(6.9, 7.4) - 40.8 * S(8.3, 9.9) + 40.8 * S(H + 3.1, H + 5.7) + 2.5 * S(H + 6.9, H + 7.4) - 43.3 * S(H + 8.3, H + 9.9)
    };
  }
  function SupplierBuilding(p) {
    var x = p.x, y = p.y, scale = p.scale == null ? 1.9 : p.scale, t = p.time || 0;
    var art = supplierArt(x, y, scale), fk = art.fk, K = SUP_FORK, G = art.ground, H = SUP_ROUND / 2;
    // the forklift: its weight shows as a small pitch from its own acceleration while the forks are low
    var q = supForkPose(t), e = 0.05, acc = (supForkPose(t - e).x - 2 * q.x + supForkPose(t + e).x) / (e * e);
    var tilt = Math.max(-1.3, Math.min(1.3, -acc * 0.011)) * clamp01((30 - q.L) / 15);
    var at = "translate(" + q.x.toFixed(2) + ", " + G + ") scale(" + K + ")", rot = "rotate(" + tilt.toFixed(3) + " -16 -7)";
    var turn = function (r) { return "rotate(" + ((q.x / (r * K) * 57.2958) % 360).toFixed(1) + ")"; };
    // the pallet rides the forks, except while it stands in the rack (the forks set it down and pick it up at the same point)
    var inRack = q.u >= 6.9 && q.u < H + 7.3, foot = !inRack ? q.L - 3.5 : (q.u <= 7.4 || q.u >= H + 6.9) ? Math.max(q.L - 3.5, art.rackFoot) : art.rackFoot;
    var loadAt = inRack ? "translate(" + art.rackX + ", " + G + ") scale(" + K + ") translate(0, " + (-foot).toFixed(2) + ")" : at + " " + rot + " translate(11.3, " + (-foot).toFixed(2) + ")";
    var wheel = function (i, cx) {
      var w = fk.wheel[i], r = i ? 6 : 7.5;
      return h("g", { transform: "translate(" + cx + ", " + (-r) + ")" }, w.tyre, h("g", { transform: turn(r) }, w.bar), w.hub);
    };
    return h("g", { transform: art.at },
      h("defs", null, art.clip),
      art.back,
      h("g", { clipPath: "url(#wSupDoor)" },
        h("rect", { x: (q.x - 42).toFixed(2), y: G - 4.2, width: 52, height: 4.2, fill: DAY.supInFloor }),
        h("g", { transform: at },
          h("g", { transform: rot },
            fk.body,
            h("rect", { x: 5.3, y: (-(67.2 + (q.L - 8) * 0.5)).toFixed(2), width: 2.4, height: 54, fill: DAY.supFkMastLit, stroke: COLORS.ink, strokeWidth: 0.8 }),
            fk.mast,
            h("g", { transform: "translate(0, " + (-q.L).toFixed(2) + ")" }, fk.carriage)),
          wheel(0, 0), wheel(1, -33)),
        h("g", { transform: loadAt }, fk.load)),
      art.front
    );
  }
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
  var SKYLINE_SIZE = { base: 1.12, amp: 1.15 };   // the owner's pick on the flat frames (2026-11-14): "City B", a step taller
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
  /* ---- scene 05: the finale's city, round 4 (2026-11-15): composed again around the airliner's climb.
     The plane leaves the runway and climbs along the line y = 968 - 0.56 (x - 614) (PLANE.SLOPE, PLANE.BLEND
     below). Everything it flies over stays under that line: between the airport and Tokyo Tower every roof
     is at least 50 px below it, right of the Tower at least 60 px, and nothing on a roof (rods, plant, the
     crane) comes nearer than 25 px. So the skyline is a low belt in front of Mt Fuji in two depths and two
     values (the pale far row shows where the nearer row is low), open sky over the depot where the plane
     climbs out, a few roofs stepping up toward the Tower, the Tower's own corridor kept low, and the knot of
     towers right of the Tower rising to the right, parallel to the climb. Heights are written as the stage
     y of the roof (F, B, N below), because the line is in stage coordinates. ---- */
  var _cityN = null;
  function cityFinale() {
    if (_cityN) return _cityN;
    var S = SKYLINE_SIZE;
    // a building's height in its row's own units, from the stage y its roof should stand at
    var at = function (roofY, baseY, ref) { return (baseY - roofY + ref * (S.amp - 1)) / (S.base + S.amp - 1); };
    var F = function (y) { return at(y, 1008, 300); }, B = function (y) { return at(y, 1010, 300); }, N = function (y) { return at(y, 1010, 220); };
    var c = {
      far: cityRow(CITY_LOOK.far, 1008, 300, 0, [
        ["S", -24, 104, F(838), 1, "c"], ["D", 262, 170, F(810), 1, "c"], ["G", 470, 82, F(826), 1, "g"],
        ["S", 1012, 96, F(812), 1, "c"], ["G", 1168, 82, F(724), 0, "g"], ["M", 1256, 160, F(800), 0, "c"],
        ["S", 1474, 118, F(566), 1, "t"], ["G", 1612, 140, F(492), 0, "g"], ["D", 1772, 190, F(392), 1, "c"]]),
      back: cityRow(CITY_LOOK.nearBack, 1010, 300, 0, [
        ["L", -30, 150, B(900), 0, "c"], ["M", 150, 188, B(862), 1, "t"], ["P", 384, 62, B(838), 0, "d"],
        ["C", 464, 142, B(882), 2, "c"],
        ["P", 1052, 60, B(792), 1, "c"], ["C", 1132, 106, B(756), 2, "d"],
        ["D", 1508, 186, B(610), 0, "d"], ["X", 1712, 190, B(590), 2, "m"]]),
      front: cityRow(CITY_LOOK.near, 1010, 220, 0, [
        ["M", 1494, 200, N(806), 0, "c"], ["L", 1712, 226, N(856), 1, "t"]])
    };
    c.lights = cityLights([c.far, c.back, c.front], 0, {
      sheen: [[1682, 2]],
      glint: [[244, 90, 13, 0.4], [530, 80, 17, 2.6], [1172, 190, 11, 4.4], [1600, 130, 15, 1.2], [1810, 90, 19, 3.3]],
      warm: [[1590, 300, 0.8], [1830, 60, 3.6]]
    });
    return _cityN = c;
  }
  /* Tokyo Tower, round 3: drawn again as ONE straight-on flat elevation, symmetric about its centre line.
     The far face stands exactly behind the near face, so there is one lattice, not two. Depth is shown by
     overlap and value only: what stands inside the tower (the lift shaft, the secondary bracing, the
     podium, the decks' corbels) is drawn behind the lattice and a tone down.
     - The ground: one level slab; a stepped footing under each leg; the low podium building that stands
       under the tower, between the legs, the legs overlapping its ends.
     - Two legs, each an open lattice column (two chords, X bracing, struts) you can see the sky through.
       A trussed arch (two chords and the posts between them) springs from leg to leg and is hung from
       the girder.
     - Above the girder: corner posts, one big X per panel with a gusset where it crosses, a rail closing
       each panel; behind them the lift shaft up the middle and a diamond of secondary bracing.
     - The two-storey main deck and the small top deck are flat boxes with glazing, each carried on a
       stepped corbel, each putting a level band of shade on the lattice just under it; then the antenna
       drum, the banded mast stepping in as it rises, the needle and its lamp.
     - Orange and white bands run over the whole height. Light shows as flat tone, a lighter top edge on
       the girder and the rails, and the shade under the decks; nothing has a lit or a shaded side.
     Coordinates: t = height as a fraction of the tower, a = px right of the centre line.
     Same props, place, height and footprint as before. Two cached groups, with the moving parts between
     and after them, all pure functions of p.time: a reflection crossing the main deck's glass, the lift
     car riding inside the lattice between the podium roof and the main deck, the aviation lamp at the tip. */
  var _ttMemo = {};
  DAY.towerOrange = "#e4553b";        // Tokyo Tower's own red-orange (nothing else uses it)
  DAY.towerOrangeLit = "#f08a6c";     // top edges that catch the sun
  DAY.towerOrangeShade = "#ab4a45";   // orange inside the tower and under the decks: pushed toward navy
  DAY.towerWhite = "#f5f8fc";         // white bands, deck panels, copings, footings
  DAY.towerWhiteShade = "#c6d3e9";    // white inside the tower and under the decks: periwinkle
  DAY.towerStone = "#dde4ed";         // the podium's wall
  DAY.towerSteel = "#b3bfd1";         // roofs, skirts, shade on the stone, the ground slab
  DAY.towerSteelShade = "#8693aa";    // the corbels under the decks
  DAY.towerGlass = "#364b70";         // deck and podium glazing
  DAY.towerGlassSky = "#7c9ac5";      // the sky reflected across the top of a pane
  DAY.towerLamp = "#c23f2f";          // the aviation lamp, resting
  DAY.towerLampLit = "#ffc4b2";       // the aviation lamp, lit
  function TokyoTower(p) {
    var cx = p.cx, baseY = p.baseY, H = p.h, time = p.time || 0, u = H / 770;
    var key = cx + "|" + baseY + "|" + H, m = _ttMemo[key];
    if (!m) {
      var r1 = function (v) { return Math.round(v * 10) / 10; };
      var PLZ = 2 * u, HT = H - PLZ, HW0 = 115 * u;                    // the ground slab; tower height; half width at the ground
      var T_G = 0.2, T_D0 = 0.42, T_D1 = 0.478, T_U1 = 0.737, T_U2 = 0.768;    // girder; main deck; top deck
      var Y = function (t) { return baseY - PLZ - t * HT; };
      var hw = function (t) {                                          // half width: a flare to the main deck, a straight taper above it
        if (t <= T_D0) return HW0 * Math.exp(-2.867 * t);
        if (t <= T_D1) return (34.5 - (t - T_D0) / (T_D1 - T_D0) * 3.5) * u;
        return (31 - Math.min(1, (t - T_D1) / (T_U1 - T_D1)) * 18) * u;
      };
      var both = function (fn) { fn(-1); fn(1); };                     // everything is drawn once each side of the centre line

      var lay = {};
      var add = function (k, q) {                                      // one closed shape into colour layer k, all wound one way so overlaps never cancel
        var n = q.length, ar = 0, s = "", i;
        for (i = 0; i < n; i += 2) ar += q[i] * q[(i + 3) % n] - q[(i + 2) % n] * q[i + 1];
        if (ar < 0) { var rv = []; for (i = n - 2; i >= 0; i -= 2) rv.push(q[i], q[i + 1]); q = rv; }
        for (i = 0; i < n; i += 2) s += (i ? "L" : "M") + r1(q[i]) + "," + r1(q[i + 1]);
        lay[k] = (lay[k] || "") + s + "z";
      };
      var bar = function (k, x0, y0, x1, y1, w) {                      // a straight member of width w
        var dx = x1 - x0, dy = y1 - y0, n = Math.sqrt(dx * dx + dy * dy) || 1, ox = -dy / n * w / 2, oy = dx / n * w / 2;
        var q = [x0 + ox, y0 + oy, x1 + ox, y1 + oy, x1 - ox, y1 - oy, x0 - ox, y0 - oy];
        add(k, q); return q;
      };
      var box = function (k, x, y, w, hh) { add(k, [x, y, x + w, y, x + w, y + hh, x, y + hh]); };
      var cbox = function (k, half, y, hh) { box(k, cx - half, y, 2 * half, hh); };      // a box centred on the tower's axis
      var strip = function (k, fa, fb, t0, t1, n) {                    // the area between two edges a = fa(t), a = fb(t)
        var q = [], i, t;
        for (i = 0; i <= n; i++) { t = t0 + (t1 - t0) * i / n; q.push(cx + fa(t), Y(t)); }
        for (i = n; i >= 0; i--) { t = t0 + (t1 - t0) * i / n; q.push(cx + fb(t), Y(t)); }
        add(k, q); return q;
      };
      var above = function (q, yc) {                                   // the part of a shape above the line y = yc (the level edge of a deck's shade)
        var o = [], n = q.length, i;
        for (i = 0; i < n; i += 2) {
          var x0 = q[i], y0 = q[i + 1], x1 = q[(i + 2) % n], y1 = q[(i + 3) % n], in0 = y0 <= yc, in1 = y1 <= yc;
          if (in0) o.push(x0, y0);
          if (in0 !== in1) o.push(x0 + (x1 - x0) * (yc - y0) / (y1 - y0), yc);
        }
        return o;
      };

      /* ---- the ground under the tower: one level slab; the feet and the podium stand on it ---- */
      cbox("gSh", HW0 + 22 * u, baseY - PLZ, PLZ);

      /* ---- behind the lattice, a tone down: the lift shaft up the middle and the secondary bracing ---- */
      var lw = function (t) { return (40 - 70 * t) * u; }, CO = 8 * u, CI = 6.4 * u, T_F = 0.016;   // a leg: its width, its two chords, the top of its footing
      var LJ = [T_F, 0.08, 0.14, T_G];
      var PW = function (t) { return (12 - 11 * (t - T_G)) * u; };                       // corner posts below the main deck
      var PU = function (t) { return (7.4 - 7 * (t - T_D1)) * u; };                      // and above it
      var JL = [T_G, 0.288, 0.345, T_D0], BL = ["o", "w", "o"];                          // panels and their bands, girder to main deck
      var JU = [T_D1, 0.5425, 0.607, 0.672, T_U1], BU = ["o", "w", "o", "w"];            // main deck to top deck
      strip("oS", function () { return -3 * u; }, function () { return 3 * u; }, 0.07, T_G, 1);
      var j;
      for (j = 0; j < 3; j++) (function (a, b, c) {                    // girder to main deck: the shaft, and a diamond between the posts
        var tm = (a + b) / 2, e = hw(tm) - PW(tm) / 2;
        strip(c + "S", function () { return -3 * u; }, function () { return 3 * u; }, a, b, 1);
        both(function (sd) { bar(c + "S", cx + sd * e, Y(tm), cx, Y(b), 3.2 * u); bar(c + "S", cx + sd * e, Y(tm), cx, Y(a), 3.2 * u); });
      })(JL[j], JL[j + 1], BL[j]);
      for (j = 0; j < 4; j++) (function (a, b, c) {                    // main deck to top deck: the shaft, and one strut across the middle of each panel
        var tm = (a + b) / 2, e = hw(tm) - PU(tm) / 2;
        strip(c + "S", function () { return -2.1 * u; }, function () { return 2.1 * u; }, a, b, 1);
        bar(c + "S", cx - e, Y(tm), cx + e, Y(tm), 2.6 * u);
      })(JU[j], JU[j + 1], BU[j]);
      both(function (sd) {                                             // in each leg: a strut across the middle of every bay
        for (var i = 0; i < 3; i++) { var tm = (LJ[i] + LJ[i + 1]) / 2; bar("oS", cx + sd * (hw(tm) - CO / 2), Y(tm), cx + sd * (hw(tm) - lw(tm) + CI / 2), Y(tm), 3 * u); }
      });

      /* ---- the podium: the low building under the tower, between the legs (no lettering) ---- */
      var PHW = 64 * u, PH = 46 * u, pl = cx - PHW, pr = cx + PHW, pb = Y(0), pt = pb - PH;
      box("wall", pl, pt, pr - pl, PH);
      box("whB", pl - 2.5 * u, pt - 1 * u, pr - pl + 5 * u, 5.5 * u);                                                // coping
      box("stB", pl, pt + 4.5 * u, pr - pl, 2.8 * u);                                                                // and its shade on the wall
      var wy = pt + 12 * u, wh2 = 11.5 * u, wx0 = pl + 8 * u, wx1 = pr - 8 * u;
      box("gl", wx0, wy, wx1 - wx0, wh2); box("sky", wx0, wy, wx1 - wx0, 4.2 * u);                                   // upper floor: one ribbon of glass
      for (j = 1; j < 6; j++) box("whB", wx0 + (wx1 - wx0) * j / 6 - 1.5 * u, wy, 3 * u, wh2);
      var cy2 = pt + 28.5 * u, ex0 = cx - 36 * u;
      box("gl", ex0, cy2, 72 * u, 5.5 * u); box("sky", ex0, cy2 + 5.5 * u, 72 * u, pb - cy2 - 5.5 * u);              // the glazed entrance, the canopy's shade across its top
      for (j = 1; j < 4; j++) box("whB", ex0 + 72 * u * j / 4 - 1.5 * u, cy2, 3 * u, pb - cy2);
      box("whB", pl - 3 * u, cy2 - 3.8 * u, pr - pl + 6 * u, 3.8 * u);                                               // canopy
      box("stB", pl, cy2, ex0 - pl, 2.6 * u); box("stB", ex0 + 72 * u, cy2, pr - ex0 - 72 * u, 2.6 * u);
      var sty = pt - 1 * u - 12 * u;                                                                                 // where the lift shaft meets the roof
      cbox("wall", 10 * u, sty, 12 * u); cbox("stB", 10 * u, sty + 9.4 * u, 2.6 * u); cbox("whB", 11.5 * u, sty - 2.6 * u, 2.6 * u);

      /* ---- the decks: flat boxes on the tower's axis, each on a stepped corbel that comes in to the lattice ---- */
      var glassRows = [];
      var deck = function (tb, tt, half, rows, panes, soffH) {
        var x0 = cx - half, y = Y(tt), tot = Y(tb) - Y(tt), sum = 0, post = 3.2 * u;
        rows.forEach(function (r) { sum += r[0]; });
        rows.forEach(function (r) {
          var hh = r[0] / sum * tot, kd = r[1];
          box(kd === "g" ? "gl" : kd === "w" ? "whB" : "stB", x0, y, 2 * half, hh);
          if (kd === "r") box("whB", x0 - 1.5 * u, y, 2 * half + 3 * u, 2.6 * u);                                    // the roof's coping
          if (kd === "g") {
            box("sky", x0, y, 2 * half, hh * 0.36);
            for (var i = 1; i < panes; i++) box("w", x0 + i * 2 * half / panes - post / 2, y, post, hh);             // mullions: in front of the moving reflection
            box("w", x0, y, post, hh); box("w", x0 + 2 * half - post, y, post, hh);
            glassRows.push([x0 + post, y, x0 + 2 * half - post, hh]);
          }
          y += hh;
        });
        var lat = hw(tb), s1 = lat + (half - lat) * 0.68, s2 = lat + (half - lat) * 0.3;
        cbox("stS", s1, Y(tb), soffH / 2); cbox("stS", s2, Y(tb) + soffH / 2, soffH / 2);
      };
      var SOFF = 10 * u, SOFT = 6 * u;
      deck(T_D0, T_D1, 66 * u, [[6, "r"], [13, "g"], [7, "w"], [11, "g"], [6, "s"]], 8, SOFF);
      deck(T_U1, T_U2, 22 * u, [[4.5, "r"], [10, "g"], [5, "s"]], 4, SOFT);

      /* ---- the lattice ---- */
      both(function (sd) {
        // a leg: two chords from its footing to the girder, three bays of X bracing, a strut at every joint
        strip("o", function (t) { return sd * hw(t); }, function (t) { return sd * (hw(t) - CO); }, T_F, T_G, 6);
        strip("o", function (t) { return sd * (hw(t) - lw(t)); }, function (t) { return sd * (hw(t) - lw(t) + CI); }, T_F, T_G, 6);
        for (var i = 0; i < 3; i++) {
          var a = LJ[i], b = LJ[i + 1];
          var oa = sd * (hw(a) - CO / 2), ob = sd * (hw(b) - CO / 2), ia = sd * (hw(a) - lw(a) + CI / 2), ib = sd * (hw(b) - lw(b) + CI / 2);
          bar("o", cx + oa, Y(a), cx + ib, Y(b), 3.4 * u);
          bar("o", cx + ia, Y(a), cx + ob, Y(b), 3.4 * u);
          bar("o", cx + oa, Y(a), cx + ia, Y(a), 3.6 * u);
        }
        // its footing: two steps of concrete, the lower one wider
        var f0 = hw(T_F) - lw(T_F) - 3 * u, f1 = hw(T_F) + 3 * u, fy = Y(T_F), fh = Y(0) - fy;
        box("w", cx + (sd < 0 ? -f1 : f0), fy, f1 - f0, fh * 0.56);
        box("wA", cx + (sd < 0 ? -f1 - 4 * u : f0 - 4 * u), fy + fh * 0.56, f1 - f0 + 8 * u, fh * 0.44);
      });
      /* the arch between the legs: a truss of two chords and the posts between them */
      var T_A0 = 0.078, T_A1 = 0.168, AD = 12 * u, AC = 3.2 * u;       // springing; crown; the truss's depth; its chords
      var archPt = function (th) { var t = T_A0 + (T_A1 - T_A0) * Math.sin(th), a = -Math.cos(th) * (hw(t) - lw(t)); return [cx + a, Y(t)]; };
      (function () {
        var N = 22, pts = [], i;
        for (i = 0; i <= N; i++) {
          var th = Math.PI * i / N, q = archPt(th), q0 = archPt(Math.max(0, th - 0.02)), q1 = archPt(Math.min(Math.PI, th + 0.02));
          var tx = q1[0] - q0[0], ty = q1[1] - q0[1], n = Math.sqrt(tx * tx + ty * ty) || 1;
          pts.push([q[0], q[1], ty / n, -tx / n]);                     // a point of the inner edge and the way out from it
        }
        var ring = function (o0, o1) {
          var a = [], b = [];
          pts.forEach(function (e) { a.push(e[0] + e[2] * o0, e[1] + e[3] * o0); b.unshift(e[0] + e[2] * o1, e[1] + e[3] * o1); });
          add("o", a.concat(b));
        };
        ring(0, AC); ring(AD - AC, AD);
        for (i = 1; i < N; i++) { var e = pts[i]; bar("o", e[0] + e[2] * AC / 2, e[1] + e[3] * AC / 2, e[0] + e[2] * (AD - AC / 2), e[1] + e[3] * (AD - AC / 2), 2.6 * u); }
      })();
      [-0.64, -0.3, 0.3, 0.64].forEach(function (lam) {                                                              // the hangers that carry the arch
        var q = archPt(Math.acos(-lam));
        bar("o", q[0], q[1] - 6 * u, q[0], Y(T_G), 3.6 * u);
      });
      bar("o", cx - hw(T_G), Y(T_G), cx + hw(T_G), Y(T_G), 7.4 * u);                                                 // the girder over the arch
      cbox("oL", hw(T_G), Y(T_G) - 3.7 * u, 2.2 * u);
      // a panel: two corner posts, one X, the rail that closes it. sh = the height above which a deck puts its shade on it
      var panel = function (a, b, c, pw, xw, rail, sh, gus) {
        var parts = [];
        both(function (sd) { parts.push(strip(c, function (t) { return sd * hw(t); }, function (t) { return sd * (hw(t) - pw(t)); }, a, b, 3)); });
        var ea = hw(a) - pw(a) / 2, eb = hw(b) - pw(b) / 2;
        var P = [[cx - ea, Y(a), cx + eb, Y(b)], [cx + ea, Y(a), cx - eb, Y(b)]];
        P.forEach(function (q) { parts.push(bar(c, q[0], q[1], q[2], q[3], xw)); });
        if (sh) parts.forEach(function (q) { var s = above(q, Y(sh)); if (s.length > 4) add(c + "A", s); });
        if (rail) {
          bar(c, cx - hw(b), Y(b), cx + hw(b), Y(b), rail);
          if (c === "o") cbox("oL", hw(b), Y(b) - rail / 2, 1.6 * u);
        }
        if (gus) {                                                     // the gusset plate where the X crosses
          var A = P[0], B = P[1], d1x = A[2] - A[0], d1y = A[3] - A[1], d2x = B[2] - B[0], d2y = B[3] - B[1];
          var den = d1x * d2y - d1y * d2x, s = ((B[0] - A[0]) * d2y - (B[1] - A[1]) * d2x) / den, gx = A[0] + d1x * s, gy = A[1] + d1y * s;
          var n1 = Math.sqrt(d1x * d1x + d1y * d1y), n2 = Math.sqrt(d2x * d2x + d2y * d2y);
          add(c, [gx + d1x / n1 * gus, gy + d1y / n1 * gus, gx + d2x / n2 * gus, gy + d2y / n2 * gus, gx - d1x / n1 * gus, gy - d1y / n1 * gus, gx - d2x / n2 * gus, gy - d2y / n2 * gus]);
        }
      };
      for (j = 0; j < 3; j++) panel(JL[j], JL[j + 1], BL[j], PW, 4.8 * u, j < 2 ? 5.6 * u : 0, j === 2 ? T_D0 - (SOFF + 15 * u) / HT : 0, 7.5 * u);
      for (j = 0; j < 4; j++) panel(JU[j], JU[j + 1], BU[j], PU, 3.8 * u, j < 3 ? 4.6 * u : 0, j === 3 ? T_U1 - (SOFT + 9 * u) / HT : 0, 0);

      /* ---- above the top deck: the antenna drum, the banded mast stepping in with two collars, the needle, the lamp's lantern ---- */
      var T_M = 0.8, MB = [T_M, 0.823, 0.846, 0.869, 0.892, 0.915], MC = ["o", "w", "o", "w", "o"];
      cbox("w", 8.5 * u, Y(T_M), Y(T_U2) - Y(T_M));
      cbox("wA", 8.5 * u, Y(T_M) + (Y(T_U2) - Y(T_M)) * 0.42, 2.4 * u);
      for (j = 0; j < 5; j++) cbox(MC[j], (6.2 - j * 0.62) * u, Y(MB[j + 1]), Y(MB[j]) - Y(MB[j + 1]));
      [T_M, 0.869].forEach(function (t) { cbox("wA", 11 * u, Y(t) - 2.2 * u, 4.4 * u); });
      cbox("wA", 2.1 * u, Y(0.99), Y(0.915) - Y(0.99));
      cbox("wA", 3.6 * u, Y(0.99) - 1 * u, 3 * u);

      var paint = function (list) { return list.map(function (e) { return h("path", { d: lay[e[0]], fill: e[1] }); }); };
      var bx = r1(cx - 162 * u) + " " + r1(baseY - H - 8 * u) + " " + r1(324 * u) + " " + r1(H + 10 * u);
      m = _ttMemo[key] = {
        back: h("g", { "data-cache": "towerA-" + key, "data-box": bx }, paint([
          ["gSh", DAY.towerSteel], ["oS", DAY.towerOrangeShade], ["wS", DAY.towerWhiteShade],
          ["wall", DAY.towerStone], ["stB", DAY.towerSteel], ["stS", DAY.towerSteelShade],
          ["gl", DAY.towerGlass], ["sky", DAY.towerGlassSky], ["whB", DAY.towerWhite]])),
        front: h("g", { "data-cache": "towerB-" + key, "data-box": bx }, paint([
          ["o", DAY.towerOrange], ["w", DAY.towerWhite], ["oA", DAY.towerOrangeShade], ["wA", DAY.towerWhiteShade], ["oL", DAY.towerOrangeLit]])),
        glass: glassRows[0],                                           // the main deck's upper glazing: x0, y, x1, height
        liftY0: sty - 2.6 * u - 20 * u, liftY1: Y(T_D0) + SOFF + 1 * u, tipY: Y(0.99) - 3 * u
      };
    }
    var n1 = function (v) { return String(Math.round(v * 10) / 10); };
    // the lift, inside the lattice: twenty seconds a round trip, long soft starts and landings, a wait at each end
    var lt = ((time % 20) + 20) % 20, lk = lt < 2 ? 1 : lt < 9 ? 1 - (lt - 2) / 7 : lt < 12 ? 0 : lt < 19 ? (lt - 12) / 7 : 1;
    lk = lk * lk * lk * (lk * (6 * lk - 15) + 10);
    var ly = m.liftY0 + (m.liftY1 - m.liftY0) * lk;
    // the sky's reflection crossing the main deck's upper glazing, then a pause
    var g = m.glass, sk = (((time - 3.5) % 9) + 9) % 9 / 5, sx = g[0] - 26 * u + (g[2] - g[0] + 52 * u) * sk;
    var cl = function (v) { return n1(Math.max(g[0], Math.min(g[2], v))); };
    // the aviation lamp at the tip: a slow swell, never a blink
    var lamp = 0.5 - 0.5 * Math.cos(time * 2.1); lamp *= lamp;
    return h("g", { opacity: p.opacity == null ? 1 : p.opacity },
      m.back,
      h("polygon", { points: cl(sx + 6 * u) + "," + n1(g[1]) + " " + cl(sx + 22 * u) + "," + n1(g[1]) + " " + cl(sx + 16 * u) + "," + n1(g[1] + g[3]) + " " + cl(sx) + "," + n1(g[1] + g[3]), fill: "#ffffff", opacity: 0.34 }),
      h("g", { transform: "translate(" + n1(cx) + "," + n1(ly) + ")" },                      // the lift car: a white cab, its roof, one window
        h("rect", { x: n1(-7.5 * u), y: 0, width: n1(15 * u), height: n1(20 * u), fill: DAY.towerWhite }),
        h("rect", { x: n1(-7.5 * u), y: 0, width: n1(15 * u), height: n1(3.6 * u), fill: DAY.towerWhiteShade }),
        h("rect", { x: n1(-4 * u), y: n1(6.6 * u), width: n1(8 * u), height: n1(9 * u), fill: DAY.towerGlass })),
      m.front,
      h("circle", { cx: n1(cx), cy: n1(m.tipY), r: n1(3.4 * u), fill: DAY.towerLamp }),
      h("circle", { cx: n1(cx), cy: n1(m.tipY), r: n1(3.4 * u), fill: DAY.towerLampLit, opacity: lamp.toFixed(3) }));
  }
  /* (the round 2 building kit stood here; the city is drawn by the round 3 kit above the Tower) */
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
  /* The cloud field: the same maths in every scene. A list is [x at time 0, underside y, width, species];
     plane 0 is the far one, 1 the near one. The wind blows right to left at one speed per plane; `shift` is
     extra travel on top of it (the expressway's scroll times a small parallax). A cloud wraps, and fades,
     only at the ends of the field, which lie outside every camera position. */
  var SKY_WIND = [3.2, 7], SKY_SPAN = 3600, SKY_X0 = -700;
  function CloudField(list, plane, time, shift) {
    return h("g", { "data-sky": list.id || "" }, list.map(function (c) {
      var wx = ((((c[0] - SKY_X0 - time * SKY_WIND[plane] - shift) % SKY_SPAN) + SKY_SPAN) % SKY_SPAN) + SKY_X0;
      var ed = clamp01(Math.min((wx - SKY_X0) / 60, (SKY_X0 + SKY_SPAN - wx) / 60));
      return h("g", { transform: "translate(" + wx.toFixed(2) + ", " + c[1] + ")", opacity: ed.toFixed(3) }, CloudShape(c[3], c[2], plane === 0));
    }));
  }
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
  // each list knows its own name (w-far, t-near, n-landFar ...), which CloudField writes on its group for the check
  [["w", SKY_WORLD], ["t", SKY_TRANSIT], ["n", SKY_FINALE]].forEach(function (e) { for (var k in e[1]) e[1][k].id = e[0] + "-" + k; });
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
    t: { group: [1397, 262, -14, 5], kite: [900, 214, 72, 16, 1.3] },   // the kite circles clear of Fuji's summit
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

  /* AnimatedRoute is gone: the map draws its own corridors (casing, core, flow, travelling highlight). */
  /* ---- Warehouse.tsx ---- */
  /* The Sanpou distribution centre of scene 02, round 3: drawn again from a blank page as a working depot,
     in ONE straight-on elevation (every edge vertical or horizontal, one face).
     Local units (x 1.9 on screen), the ground at y 0, heights going up are negative y. WAREHOUSE_X is local
     x 0. Left to right: a long white hall of insulated panels (three dock doors under one slim canopy, the
     name on a raised band, a strip of high windows), a taller glazed office block, and a low open wing where
     the forklift works. WAREHOUSE_W is the length of the whole front; WAREHOUSE_BAYS are the left jambs of
     the three dock doors, BAY_W x BAY_H the clear opening (BAY_Y is its head). A truck stands with its rear
     15 px right of its door's right jamb (dockRear), so the doors are spaced one truck apart: every truck
     stands clear of the next door, and the last one stands clear of the wing. */
  var WAREHOUSE_W = 1020, WAREHOUSE_BAYS = [0, 276, 546], BAY_W = 74, BAY_H = 112, BAY_Y = -112;
  function bayWorldX(x, scale, i) { return x + WAREHOUSE_BAYS[i] * scale; }
  DAY.whWall = "#f7f9fb"; DAY.whWallShade = "#d7e1f0";                                  // the hall: white insulated panels, and white in shade
  DAY.whJoint = "#e0e7f1"; DAY.whJointShade = "#c2cfe3";                                // panel joints
  DAY.whTrim = "#23344f"; DAY.whTrimLit = "#42598a";                                    // copings and the canopy: navy
  DAY.whBase = "#2f4266"; DAY.whBaseLit = "#4a618c"; DAY.whBaseShade = "#25365a";       // the base course
  DAY.whSign = "#101f36"; DAY.whSignLit = "#33466b"; DAY.whSignRule = "#5b6c8c"; DAY.whSignSub = "#dfe4ec";
  DAY.whFrame = "#3a4f77"; DAY.whFrameShade = "#2c3e63";                                // door portals, window frames, conveyor frames
  DAY.whSteelLit = "#dfe6f0"; DAY.whSteelShade = "#5d6f8d"; DAY.whSteel = "#8496b0";    // rollers, leveller plates, wheel rims
  DAY.whShut = "#e7edf5"; DAY.whShutLine = "#c3cfe1"; DAY.whShutShade = "#cdd8e8"; DAY.whShutBar = "#7b8eab";
  DAY.whGlass = "#bcd6ef"; DAY.whGlassHi = "#e8f2fb"; DAY.whGlassIn = "#9bbbdd"; DAY.whGlassShade = "#a3c1e2";
  DAY.whBlind = "#eef3f9"; DAY.whBlindShade = "#d2dcea";
  DAY.whAlu = "#e6edf6"; DAY.whAluLit = "#ffffff"; DAY.whAluShade = "#c4d0e3";          // sun shades and sills
  DAY.whIn = "#5874a4"; DAY.whInShade = "#48628f";                                      // inside, in cool shade; deeper under the door head
  DAY.whFloor = "#93a8c8"; DAY.whFloorLit = "#e9eef6";                                  // the floor inside: in shade, and where the sun falls in
  DAY.whRack = "#3a5283"; DAY.whRackNear = "#273b66";                                   // racking in silhouette
  DAY.whStock = "#a8bbd8"; DAY.whStockLit = "#cad7ea";                                  // stock on the racks, seen in shade
  DAY.whNearStock = "#dbe4f1";
  DAY.whPallet = "#3f5f9e"; DAY.whPalletFar = "#34508a";
  DAY.whRubber = "#141d2e"; DAY.whSafety = "#f2c14e";
  DAY.whApron = "#d9dde3"; DAY.whApronShade = "#a9b1bc"; DAY.whApronJoint = "#c1c7cf";
  DAY.whFkBody = "#f4f7fb"; DAY.whFkGlass = "#2c416b"; DAY.whFkGlassHi = "#4c6798";     // the forklift: white, navy, dark glass
  DAY.whFkMast = "#44546f"; DAY.whFkMastLit = "#9aabc4"; DAY.whFkFork = "#1c2840";

  var WH_FORK = 1.12;        // the forklift is drawn in its own units, this many of the building's
  var _whArt = null;
  function warehouseArt() {
    if (_whArt) return _whArt;
    var D = DAY, INK = COLORS.ink, back = [], front = [], text = [];
    var X0 = -20, TX0 = 636, TX1 = 812, AX1 = WAREHOUSE_W + X0, HH = 232, TH = 305, AH = 136, BC = 14, FX0 = 818, T = TX0;
    var FW = 1.6, LINE = 1.2, bays = WAREHOUSE_BAYS, BW = BAY_W, BH = BAY_H;
    function r1(v) { return Math.round(v * 10) / 10; }
    // a level rectangle: its left, the height of its foot above the ground, its width, its height -> [x, y, w, h]
    function B(x, foot, w, ht) { return [x, -(foot + ht), w, ht]; }
    function rd(q) { return "M" + r1(q[0]) + "," + r1(q[1]) + "h" + r1(q[2]) + "v" + r1(q[3]) + "h" + r1(-q[2]) + "z"; }
    function rds(list) { var d = ""; for (var k = 0; k < list.length; k++) d += rd(list[k]); return d; }
    function fill(list, d, colour) { if (d) list.push(h("path", { d: d, fill: colour })); }

    // the strips of shade, each a level rectangle straight under (or beside) what throws it
    var SH = [
      B(X0, HH - 8, TX0 - X0, 3), B(TX0, TH - 8, TX1 - TX0, 3), B(TX1, AH - 8, AX1 - TX1, 3),   // under the three copings
      B(10, 165.4, 320, 3.6),                                                                   // under the name band
      B(X0 + 6, 117, TX0 - X0 - 12, 10),                                                        // under the dock canopy
      B(TX0 - 5, BC, 5, HH - BC - 5),                                                           // beside the office block, which stands proud
      B(420, 198.6, 192, 5.4), B(418, 168.8, 196, 2.6),                                         // under the high windows' sun shade and sill
      B(T + 46, 272, 116, 6), B(T + 46, 172, 116, 6),                                           // under the office sun shades
      B(T + 44, 226.8, 120, 2.6), B(T + 44, 126.8, 120, 2.6),                                   // under their sills
      B(T + 76, 50, 64, 6)                                                                      // under the entrance canopy
    ];
    bays.forEach(function (bx) { SH.push(B(bx - 6, 108.4, BW + 12, 3.6), B(bx + BW / 2 - 16, 139.8, 32, 2.2)); });   // under each shutter housing and number plate
    function cast(q) {
      var d = "";
      for (var k = 0; k < SH.length; k++) {
        var s = SH[k], ax = Math.max(q[0], s[0]), ay = Math.max(q[1], s[1]), bx = Math.min(q[0] + q[2], s[0] + s[2]), by = Math.min(q[1] + q[3], s[1] + s[3]);
        if (bx - ax > 0.05 && by - ay > 0.05) d += rd([ax, ay, bx - ax, by - ay]);
      }
      return d;
    }
    // flat surfaces of one material, and whatever shade falls on them (one tone down)
    function tone(list, rects, colour, shade) {
      var s = "";
      rects.forEach(function (q) { s += cast(q); });
      fill(list, rds(rects), colour); fill(list, s, shade);
    }
    /* glazing: n panes in a thin frame. Per pane: hi (sky in the glass, as [where it meets the head, width]),
       inside (what stands behind the glass, as [from, to, height] along the foot), blind (how far a blind is down). */
    function glaze(list, x, foot, w, ht, n, spec) {
      var pw = (w - FW * (n + 1)) / n, y0 = -(foot + ht) + FW, ph = ht - 2 * FW, lean = Math.min(ph * 0.62, pw * 0.55);
      var panes = [], frame = [[x, -(foot + ht), w, FW], [x, -foot - FW, w, FW]], hi = "", inside = "", blind = [], sd = "", k, a;
      for (k = 0; k <= n; k++) frame.push([x + k * (pw + FW), y0, FW, ph]);
      for (k = 0; k < n; k++) {
        var px = x + FW + k * (pw + FW), s = (spec && spec[k]) || {};
        panes.push([px, y0, pw, ph]);
        for (a = 0; s.hi && a < s.hi.length; a++) hi += "M" + r1(px + s.hi[a][0]) + "," + r1(y0) + "h" + r1(s.hi[a][1]) + "l" + r1(-lean) + "," + r1(ph) + "h" + r1(-s.hi[a][1]) + "z";
        for (a = 0; s.inside && a < s.inside.length; a++) inside += rd([px + s.inside[a][0] * pw, y0 + ph - s.inside[a][2], (s.inside[a][1] - s.inside[a][0]) * pw, s.inside[a][2]]);
        if (s.blind) blind.push([px, y0, pw, s.blind]);
        sd += cast([px, y0, pw, ph]);
      }
      fill(list, rds(panes), D.whGlass); fill(list, inside, D.whGlassIn); fill(list, hi, D.whGlassHi); fill(list, sd, D.whGlassShade);
      if (blind.length) tone(list, blind, D.whBlind, D.whBlindShade);
      tone(list, frame, D.whFrame, D.whFrameShade);
    }

    /* ---- the apron: the depot's own concrete in front of the docks, laid in bays, with one level strip of
       contact shade under the building ---- */
    fill(back, rd([X0 - 28, 0, AX1 - X0 + 40, 8.42]), D.whApron);
    (function () {
      var d = rd([X0 - 28, 6.9, AX1 - X0 + 40, 1.52]);
      for (var jx = X0 - 28; jx < AX1; jx += 92) d += rd([jx, 0, 1.6, 8.42]);
      fill(back, d, D.whApronJoint);
    })();
    fill(back, rd([X0 - 6, 0, AX1 - X0 + 12, 3]), D.whApronShade);

    /* ---- the outline: ink behind the whole silhouette (hall, office block, wing) ---- */
    (function () {
      var OL = 2.4, OB = 1.2, p = [[X0 - OL, -HH - OL], [TX0 - OL, -HH - OL], [TX0 - OL, -TH - OL], [TX1 + OL, -TH - OL], [TX1 + OL, -AH - OL], [AX1 + OL, -AH - OL], [AX1 + OL, OB], [X0 - OL, OB]];
      fill(back, "M" + p.map(function (v) { return r1(v[0]) + "," + r1(v[1]); }).join("L") + "Z", INK);
    })();

    /* ---- the fronts: white panels with broad joints; a navy base course, navy copings ---- */
    tone(back, [B(X0, BC, TX0 - X0, HH - 5 - BC), B(TX0, BC, TX1 - TX0, TH - 5 - BC), B(TX1, BH, AX1 - TX1, AH - 5 - BH), B(TX1, BC, FX0 - TX1, BH - BC)], D.whWall, D.whWallShade);
    (function () {
      var j = [B(X0, 51.2, TX0 - X0, 1.6), B(X0, 89.2, TX0 - X0, 1.6), B(X0, 165.2, TX0 - X0, 1.6), B(TX0, 99.2, TX1 - TX0, 1.6), B(TX0, 199.2, TX1 - TX0, 1.6)];
      // upright joints: four panels between one door's centre line and the next
      for (var b = 0; b < 2; b++) for (var k = 0; k < 4; k++) j.push(B(bays[b] + BW / 2 + (bays[b + 1] - bays[b]) * k / 4 - 0.8, BC, 1.6, 213 - BC));
      j.push(B(bays[2] + BW / 2 - 0.8, BC, 1.6, 213 - BC));
      tone(back, j, D.whJoint, D.whJointShade);
    })();
    (function () {
      var seg = [[X0, bays[0] - 3.4], [bays[0] + BW + 3.4, bays[1] - 3.4], [bays[1] + BW + 3.4, bays[2] - 3.4], [bays[2] + BW + 3.4, FX0]], base = [], lit = [];
      seg.forEach(function (s) { base.push(B(s[0], 0, s[1] - s[0], BC)); lit.push(B(s[0], BC - 1.6, s[1] - s[0], 1.6)); });
      tone(back, base, D.whBase, D.whBaseShade);
      fill(back, rds(lit), D.whBaseLit);
    })();
    fill(back, rds([B(X0, HH - 5, TX0 - X0, 5), B(TX0, TH - 5, TX1 - TX0, 5), B(TX1, AH - 5, AX1 - TX1, 5)]), D.whTrim);
    fill(back, rds([B(X0, HH - 1.5, TX0 - X0, 1.5), B(TX0, TH - 1.5, TX1 - TX0, 1.5), B(TX1, AH - 1.5, AX1 - TX1, 1.5)]), D.whTrimLit);
    // the one vermilion line: the hall's fascia, under the coping
    tone(back, [B(X0, 213, TX0 - X0, 5)], COLORS.verm, D.parcelTapeShade);

    /* ---- the name, on a raised band ---- */
    fill(back, rd(B(10, 169, 320, 40)), D.whSign);
    fill(back, rd(B(10, 207.5, 320, 1.5)), D.whSignLit);
    fill(back, rd(B(171, 177, 1.5, 24)), D.whSignRule);
    text.push(h("text", { x: 34, y: -179.6, fontFamily: FONTS.jp, fontSize: 26, fontWeight: 800, fill: COLORS.paper, letterSpacing: 1.5 }, CONTENT.brand.nameJp));
    text.push(h("text", { x: 191, y: -182.6, fontFamily: FONTS.jp, fontSize: 17, fontWeight: 700, fill: D.whSignSub, letterSpacing: 1.5 }, CONTENT.brand.signSub));
    /* ---- a strip of high windows on the hall, under a slim sun shade ---- */
    glaze(back, 420, 174, 192, 30, 6, [{ hi: [[19, 6]] }, { hi: [[22, 3], [28, 1.8]] }, { hi: [[18, 7]] }, {}, { hi: [[21, 5]] }, { hi: [[17.5, 3], [24, 5]] }]);
    tone(back, [B(418, 204, 196, 3), B(418, 171.4, 196, 2.6)], D.whAlu, D.whAluShade);
    fill(back, rd(B(418, 205.8, 196, 1.2)), D.whAluLit);

    /* ---- the office block: a tall stair window, two ribbons of office glazing, the staff entrance ---- */
    fill(back, rd(B(T + 10, 24, 24, 266)), D.whGlass);
    fill(back, "M" + (T + 26) + ",-290h6l-15,60h-6z M" + (T + 30) + ",-196h4v10l-9,36h-6z M" + (T + 24) + ",-110h7l-13,52h-7z", D.whGlassHi);
    fill(back, rds([B(T + 10, 48.8, 24, 2.4), B(T + 10, 98.8, 24, 2.4), B(T + 10, 148.8, 24, 2.4), B(T + 10, 198.8, 24, 2.4), B(T + 10, 248.8, 24, 2.4)]), D.whGlassIn);
    tone(back, [B(T + 8.4, 22.4, 1.6, 269.2), B(T + 34, 22.4, 1.6, 269.2), B(T + 8.4, 22.4, 27.2, 1.6), B(T + 8.4, 290, 27.2, 1.6)], D.whFrame, D.whFrameShade);
    glaze(back, T + 46, 232, 116, 46, 4, [{ hi: [[16, 7]], inside: [[0, 0.6, 12]] }, { blind: 17, hi: [[18, 5]] }, { hi: [[15.5, 3], [21, 4.5]], inside: [[0.35, 1, 16]] }, { blind: 26 }]);
    glaze(back, T + 46, 132, 116, 46, 4, [{ blind: 22 }, { hi: [[17, 6]], inside: [[0.2, 0.9, 14]] }, { hi: [[20, 4]] }, { hi: [[15.5, 6.5]], inside: [[0, 0.5, 18]] }]);
    tone(back, [B(T + 44, 278, 120, 3), B(T + 44, 229.4, 120, 2.6), B(T + 44, 178, 120, 3), B(T + 44, 129.4, 120, 2.6)], D.whAlu, D.whAluShade);
    fill(back, rds([B(T + 44, 279.8, 120, 1.2), B(T + 44, 179.8, 120, 1.2)]), D.whAluLit);
    glaze(back, T + 84, 0, 48, 50, 2, [{ hi: [[10, 4]] }, { hi: [[11, 3]] }]);
    fill(back, rd(B(T + 76, 56, 64, 4.4)), D.whTrim);
    fill(back, rd(B(T + 76, 59, 64, 1.4)), D.whTrimLit);

    /* ---- inside the three docks and the open wing: cool shade, racking in silhouette with stock on it,
       pallets of cartons on the floor, the sun lying on the floor as one flat band ---- */
    (function () {
      var open = bays.map(function (bx) { return [bx, BW, [bx + 3.6, bx + 35.9, bx + 68.2], bx + 70.4]; });
      open.push([FX0, AX1 - FX0, [826, 858.3, 890.6], 892.8]);
      var PAT = [
        [[0.5, 0, 13, 12], [14.5, 0, 12.5, 9], [15.5, 9, 9.5, 8]],
        [[0.5, 0, 9, 15], [10.5, 0, 8.5, 10], [20, 0, 8, 13]],
        [[0.5, 0, 27, 8], [2, 8, 11, 9], [14, 8, 12, 7]],
        [[2, 0, 12, 11], [2, 11, 12, 8], [16.5, 0, 10.5, 14]],
        [[0.5, 0, 12.5, 16], [14, 0, 13.5, 12]],
        [[8, 0, 12, 10]]
      ];
      var LOAD = [
        [[0.6, 0, 13.4, 11.5], [14.6, 0, 13.4, 11.5], [0.6, 11.5, 13.4, 10], [15.6, 11.5, 9, 8]],
        [[0.6, 0, 27.4, 13], [3, 13, 11, 9], [15, 13, 11, 7]],
        [[0.6, 0, 13.4, 11.5], [14.6, 0, 13.4, 11.5], [0.6, 11.5, 13.4, 10], [14.6, 11.5, 13.4, 10]]
      ];
      // which pattern stands where: per opening, per cell, the three beam levels; and the load on each floor pallet
      var SET = [[[0, 3, 1], [2, 4, 5]], [[4, 1, 2], [3, 0, 4]], [[1, 2, 3], [0, 5, 1]], [[3, 4, 0], [1, 2, 4]]], FLOOR = [[0, 1], [2, 0], [1, 2], [0, 2]];
      var wall = [], floor = [], rack = [], pallet = [], stock = [], lit = [], deep = [];
      function put(list, cx, foot) { list.forEach(function (c) { stock.push(B(cx + c[0], foot + c[1], c[2] - 0.8, c[3] - 0.8)); lit.push(B(cx + c[0], foot + c[1] + c[3] - 2.4, c[2] - 0.8, 1.6)); }); }
      open.forEach(function (o, oi) {
        wall.push(B(o[0], 0, o[1], BH)); floor.push(B(o[0], 0, o[1], 4.2)); deep.push(B(o[0], 94, o[1], BH - 94));
        o[2].forEach(function (ux) { rack.push(B(ux, 4.2, 2.2, 96)); });
        [38, 62, 86].forEach(function (lv) { rack.push(B(o[2][0], lv, o[3] - o[2][0], 2)); });
        [0, 1].forEach(function (c) {
          var cx = o[2][c] + 3.2;
          pallet.push(B(cx + 0.4, 4.2, 27.8, 3));
          put(LOAD[FLOOR[oi][c]], cx, 7.2);
          [40, 64, 88].forEach(function (lv, li) { put(PAT[SET[oi][c][li]], cx, lv); });
        });
      });
      fill(back, rds(wall), D.whIn); fill(back, rds(floor), D.whFloorLit);
      fill(back, rds(rack), D.whRack); fill(back, rds(pallet), D.whPalletFar);
      fill(back, rds(stock), D.whStock); fill(back, rds(lit), D.whStockLit);
      back.push(h("path", { d: rds(deep), fill: D.whInShade, opacity: 0.55 }));
    })();
    // the working rack in the wing, seen from its end: two pallets of stock that stay, and between them the slot the forklift serves
    (function () {
      var box = [];
      function crate(x, foot, w, ht) { box.push(h("rect", { x: r1(x), y: r1(-(foot + ht)), width: w, height: ht, rx: 0.6, fill: D.whNearStock, stroke: INK, strokeWidth: 1 })); }
      fill(back, rds([B(918.8, 0.4, 31.4, 4.6), B(918.8, 94.4, 31.4, 4.4)]), D.whPallet);
      crate(919.6, 5, 14.6, 12.6); crate(934.8, 5, 14.6, 12.6); crate(919.6, 17.6, 14.6, 11); crate(934.8, 17.6, 14.6, 11); crate(923.6, 28.6, 17, 10);
      crate(919.6, 98.8, 14.6, 10); crate(934.8, 98.8, 14.6, 8.4);
      back.push(box);
    })();

    /* ---- the dock doors: a navy portal (jamb guides and the shutter housing), a number plate above the canopy ---- */
    (function () {
      var frame = [], plate = "";
      bays.forEach(function (bx, i) {
        frame.push(B(bx - 3.4, 0, 3.4, BH), B(bx + BW, 0, 3.4, BH), B(bx - 6, BH, BW + 12, 9));
        plate += rd(B(bx + BW / 2 - 16, 142, 32, 16));
        text.push(h("text", { x: bx + BW / 2, y: -146, textAnchor: "middle", fontFamily: FONTS.lat, fontSize: 11.5, fontWeight: 800, fill: COLORS.paper, letterSpacing: 1 }, "0" + (i + 1)));
      });
      tone(back, frame, D.whFrame, D.whFrameShade);
      fill(back, plate, D.whSign);
    })();
    // the canopy over the docks: one slim navy slab seen edge on, its top edge in the sun
    fill(back, rd(B(X0 + 6, 127, TX0 - X0 - 12, 7)), D.whTrim);
    fill(back, rd(B(X0 + 6, 132.5, TX0 - X0 - 12, 1.5)), D.whTrimLit);

    /* ---- a roller conveyor in each dock, its rollers at the height of a truck's floor ---- */
    (function () {
      var rail = [], roll = "";
      bays.forEach(function (bx) {
        rail.push(B(bx, 4.4, BW, 4), B(bx + 8, 0, 2.6, 4.4), B(bx + 35.7, 0, 2.6, 4.4), B(bx + 63.4, 0, 2.6, 4.4));
        for (var k = 0; k < 8; k++) { var cx = r1(bx + 4.6 + k * 9.25); roll += "M" + r1(cx - 1.6) + ",-6.4a1.6,1.6 0 1 0 3.2,0a1.6,1.6 0 1 0 -3.2,0"; }
      });
      fill(back, rds(rail), D.whFrame); fill(back, roll, D.whSteelLit);
    })();

    /* ---- in front of what moves: dock bumpers, guide posts, the leveller plate that reaches the truck,
       the working rack's frame ---- */
    (function () {
      var rubber = [], cap = [], post = [], band = "", plate = [], hinge = [];
      bays.forEach(function (bx) {
        [bx - 9.6, bx + BW + 4.2].forEach(function (x) { rubber.push(B(x, 0.6, 5.4, 12)); cap.push(B(x, 11, 5.4, 1.6)); });
        [bx - 15.8, bx + BW + 11].forEach(function (x) {
          post.push(h("rect", { x: r1(x), y: -24, width: 4.6, height: 24, rx: 1.6, fill: D.whSafety, stroke: INK, strokeWidth: LINE }));
          band += rd(B(x, 7, 4.6, 3.8)) + rd(B(x, 15, 4.6, 3.8));
        });
        plate.push(B(bx + BW - 8, 6.6, 15.9, 1.8)); hinge.push(B(bx + BW + 3.4, 3.4, 3, 4.2));
      });
      fill(front, rds(rubber), D.whRubber); fill(front, rds(cap), D.whBaseLit);
      front.push(post); fill(front, band, INK);
      fill(front, rds(hinge), D.whSteelShade); fill(front, rds(plate), D.whSteelLit);
      fill(front, rds([B(915, 0, 3.4, 110), B(950.4, 0, 3.4, 110), B(915, 49.6, 38.8, 2.4), B(915, 91.6, 38.8, 2.4), B(913.6, 0, 6.2, 1.6), B(949, 0, 6.2, 1.6)]), D.whRackNear);
    })();

    /* ---- the sectional shutter, drawn closed with its foot on the ground and its left edge at x 0 ---- */
    var shutter = [], sd = "", k;
    for (k = 1; k < 6; k++) sd += rd([0, -BH + k * BH / 6 - 0.8, BW, 1.6]);
    shutter.push(h("rect", { x: 0, y: -BH, width: BW, height: BH, fill: D.whShut }));
    shutter.push(h("path", { d: sd, fill: D.whShutLine }));
    shutter.push(h("path", { d: rd([0, -BH, BW, 3.6]), fill: D.whShutShade }));
    shutter.push(h("path", { d: rd([10, -BH + 2 * BH / 6 + 5.4, 14, 7]) + rd([30, -BH + 2 * BH / 6 + 5.4, 14, 7]) + rd([50, -BH + 2 * BH / 6 + 5.4, 14, 7]), fill: D.whGlassIn }));
    shutter.push(h("path", { d: rd([0, -6, BW, 6]), fill: D.whShutBar }));
    shutter.push(h("path", { d: rd([0, -1.4, BW, 1.4]) + rd([31, -4.6, 12, 1.8]), fill: D.whRubber }));

    /* ---- the forklift, side-on and facing right: local to its front axle on the ground. A counterbalance
       truck with an enclosed cab (dark glass), a two-stage mast, a fork carriage ---- */
    var BODY = "M-46,-11L-46,-23Q-46,-29 -40,-29L-11,-29L-7,-35L3,-35Q4.6,-35 4.6,-33.4L4.6,-9L-44,-9Q-46,-9 -46,-11Z", fk = {};
    fk.body = [
      h("path", { d: BODY, fill: D.whFkBody }),
      h("path", { d: "M-46,-11L-46,-23Q-46,-29 -40,-29L-34,-29L-34,-9L-44,-9Q-46,-9 -46,-11Z M-34,-13.4h38.6v4.4h-38.6z", fill: D.whTrim }),   // the counterweight and the chassis rail
      h("path", { d: "M-31,-22h23v3.8h-23z", fill: D.whSafety }),
      h("path", { d: BODY, fill: "none", stroke: INK, strokeWidth: LINE, strokeLinejoin: "round" }),
      h("rect", { x: -39, y: -60, width: 33.6, height: 31, rx: 2.4, fill: D.whFkBody, stroke: INK, strokeWidth: LINE }),
      h("rect", { x: -36.2, y: -56.2, width: 28, height: 27.2, rx: 1, fill: D.whFkGlass }),
      h("path", { d: "M-21,-56.2h6.5l-9,27.2h-6.5z M-12,-56.2h2.4l-9,27.2h-2.4z", fill: D.whFkGlassHi }),
      h("rect", { x: -41, y: -62.6, width: 40, height: 4, rx: 1.4, fill: D.whTrim, stroke: INK, strokeWidth: 1 })
    ];
    fk.mast = [
      h("rect", { x: 3.7, y: -68, width: 5.6, height: 65.4, rx: 0.8, fill: INK }),
      h("rect", { x: 4.5, y: -67.2, width: 4, height: 63.8, fill: D.whFkMast }),
      h("rect", { x: 6.6, y: -66.2, width: 1.3, height: 61.8, fill: D.whFkMastLit })
    ];
    fk.carriage = [
      h("rect", { x: 8.5, y: -24, width: 2.8, height: 26, rx: 0.6, fill: D.whTrim, stroke: INK, strokeWidth: 1 }),
      h("path", { d: "M8.5,0H37.6V0.5L35.8,1.5H8.5Z", fill: D.whFkFork })
    ];
    fk.wheel = [7.5, 6].map(function (r) {
      return {
        tyre: [h("circle", { r: r, fill: D.truckTyre }), h("circle", { r: r1(r * 0.56), fill: D.whSteel })],
        bar: h("path", { d: "M" + r1(-r * 0.5) + ",-0.9h" + r1(r) + "v1.8h" + r1(-r) + "z M-0.9," + r1(-r * 0.5) + "h1.8v" + r1(r) + "h-1.8z", fill: D.whSteelShade }),
        hub: h("circle", { r: r1(r * 0.2), fill: D.whSteelLit })
      };
    });
    // what it carries: a pallet (its left end at x 0, its foot at y 0) with four cartons, taped like the ones on the conveyors
    fk.load = [
      h("path", { d: "M0,-0.9h28v0.9h-28z M0,-3.5h3v2.6h-3z M12.5,-3.5h3v2.6h-3z M25,-3.5h3v2.6h-3z M0,-4.8h28v1.3h-28z", fill: D.whPallet }),
      h("rect", { x: 0.8, y: -16.2, width: 13, height: 11.4, rx: 0.6, fill: COLORS.paper, stroke: INK, strokeWidth: 1.1 }),
      h("rect", { x: 14.2, y: -16.2, width: 13, height: 11.4, rx: 0.6, fill: COLORS.paper, stroke: INK, strokeWidth: 1.1 }),
      h("rect", { x: 0.8, y: -26.2, width: 13, height: 10, rx: 0.6, fill: COLORS.paper, stroke: INK, strokeWidth: 1.1 }),
      h("rect", { x: 15, y: -24.2, width: 10, height: 8, rx: 0.6, fill: COLORS.paper, stroke: INK, strokeWidth: 1.1 }),
      h("path", { d: "M6.3,-15.65h2v10.3h-2z M19.7,-15.65h2v10.3h-2z M6.3,-25.65h2v8.9h-2z M19,-23.65h2v6.9h-2z", fill: COLORS.verm })
    ];

    return _whArt = {
      back: h("g", { "data-cache": "wh-back", "data-box": (X0 - 30) + " " + (-TH - 4) + " " + (AX1 - X0 + 46) + " " + (TH + 14) }, back),
      text: text,
      front: h("g", { "data-cache": "wh-front", "data-box": "-18 -112 976 114" }, front),
      shutter: shutter, fk: fk,
      clips: [bays.map(function (bx, i) { return h("clipPath", { id: "wBay" + i }, h("rect", { x: bx, y: -BH, width: BW, height: BH })); }),
        h("clipPath", { id: "wFork" }, h("rect", { x: FX0, y: -BH, width: AX1 - FX0, height: BH }))]
    };
  }

  /* The forklift's round, a loop of 14 s on the ambient clock (t in seconds). It works the rack at the right
     of the wing: it drives in from the hall with a pallet of cartons, raises it, sets it on the rack's middle
     beams, backs off, lowers its forks and reverses away; on its next visit it comes in empty and takes the
     pallet down again. So the rack is back where it began when the loop closes, and nothing ever pops.
     x is its front axle (building units), L the height of the fork tops (its own units); every move starts
     and stops with no jolt. */
  function whForkPose(t) {
    var u = ((t - 9.5) % 14 + 14) % 14;
    var S = function (a, b) { var k = clamp01((u - a) / (b - a)); return k * k * k * (k * (6 * k - 15) + 10); };
    return {
      u: u,
      x: 770.14 + 100 * (S(0, 1.9) - S(5.3, 7) + S(7, 8.9) - S(12.3, 14)) + 36 * (S(2.6, 3.5) - S(3.85, 4.7) + S(9.6, 10.5) - S(10.85, 11.7)),
      L: 8 + 43.3 * S(1.5, 2.8) - 2.5 * S(3.5, 3.9) - 40.8 * S(4.4, 5.6) + 40.8 * S(8.5, 9.8) + 2.5 * S(10.5, 10.9) - 43.3 * S(11.4, 12.6)
    };
  }
  function Warehouse(p) {
    var x = p.x, y = p.y, scale = p.scale == null ? 1.9 : p.scale, shutterOpen = p.shutterOpen, t = p.time || 0, opacity = p.opacity == null ? 1 : p.opacity;
    var art = warehouseArt(), fk = art.fk, K = WH_FORK;
    // the shutters: a sectional door is heavy. It gathers speed, runs, slows into the housing and settles
    var doors = WAREHOUSE_BAYS.map(function (bx, i) {
      var s = clamp01(shutterOpen[i]), u = 1 - Math.pow(1 - s, 1 / 3), k = u / 0.86, f;
      if (k < 0.22) f = 1.3514 * k * k / 0.44;
      else if (k < 0.7) f = 1.3514 * (k - 0.11);
      else if (k < 1) f = 1 - 1.3514 * (1 - k) * (1 - k) / 0.6;
      else { var v = Math.sin(Math.PI * (u - 0.86) / 0.14); f = 1 + 0.014 * v * v; }
      return h("g", { clipPath: "url(#wBay" + i + ")" }, h("g", { transform: "translate(" + bx + ", " + (-(BAY_H - 6) * f).toFixed(2) + ")" }, art.shutter));
    });
    // the forklift: its weight shows as a small pitch from its own acceleration while the forks are low
    var q = whForkPose(t), e = 0.05, acc = (whForkPose(t - e).x - 2 * q.x + whForkPose(t + e).x) / (e * e);
    var tilt = Math.max(-1.3, Math.min(1.3, -acc * 0.0045)) * clamp01((30 - q.L) / 15);
    var at = "translate(" + q.x.toFixed(2) + ", 0) scale(" + K + ")", rot = "rotate(" + tilt.toFixed(3) + " -16 -7)";
    var turn = function (r) { return "rotate(" + ((q.x / (r * K) * 57.2958) % 360).toFixed(1) + ")"; };
    // the pallet rides the forks, except while it stands in the rack (the forks set it down and pick it up at the same point)
    var inRack = q.u >= 3.5 && q.u < 10.85, foot = !inRack ? q.L - 3.5 : (q.u <= 3.9 || q.u >= 10.5) ? Math.max(q.L - 3.5, 46.4) : 46.4;
    var loadAt = inRack ? "translate(918.8, 0) scale(" + K + ") translate(0, " + (-foot).toFixed(2) + ")" : at + " " + rot + " translate(11.3, " + (-foot).toFixed(2) + ")";
    var wheel = function (i, cx) {
      var w = fk.wheel[i], r = i ? 6 : 7.5;
      return h("g", { transform: "translate(" + cx + ", " + (-r) + ")" }, w.tyre, h("g", { transform: turn(r) }, w.bar), w.hub);
    };
    return h("g", { transform: "translate(" + x + ", " + y + ") scale(" + scale + ")", opacity: opacity },
      h("defs", null, art.clips),
      art.back, art.text,
      h("g", { clipPath: "url(#wFork)" },
        h("rect", { x: (q.x - 53).toFixed(2), y: -4.2, width: 63, height: 4.2, fill: DAY.whFloor }),
        h("g", { transform: at },
          h("g", { transform: rot },
            fk.body,
            h("rect", { x: 5.3, y: (-(67.2 + (q.L - 8) * 0.5)).toFixed(2), width: 2.4, height: 54, fill: DAY.whFkMastLit, stroke: COLORS.ink, strokeWidth: 0.8 }),
            fk.mast,
            h("g", { transform: "translate(0, " + (-q.L).toFixed(2) + ")" }, fk.carriage)),
          wheel(0, 0), wheel(1, -33)),
        h("g", { transform: loadAt }, fk.load)),
      doors,
      art.front
    );
  }
  /* Cartons riding the dock conveyors into the three trucks (world coordinates, drawn over the trucks and cut
     at each truck's rear plane, so a carton goes into its truck). One even flow per dock: the line starts from
     rest behind the door's left jamb, runs at V px a frame and comes to rest again; four cartons, evenly spaced,
     cross into the truck, and one more is left standing on the conveyor for the next load. Each dock runs a
     little after the one before it; every crossing falls inside T_WORLD.loadParcels, after the truck's doors
     are open and before they close. */
  function DockCartons(frame) {
    var V = 5.4, A = 10, GAP = 62, T0 = [320, 327, 335], LAG = [0, GAP, 2 * GAP, 3 * GAP, 3 * GAP + 50 + V * A / 2 + 62];
    var ramp = function (tau) { if (tau <= 0) return 0; if (tau >= A) return tau - A / 2; var u = tau / A; return A * (u * u * u - u * u * u * u / 2); };
    var y = (GROUND - 8.4 * B_SCALE).toFixed(2);
    return [0, 1, 2].map(function (bay) {
      var ts = T0[bay] - 36, te = T0[bay] + (3 * GAP + 50) / V;
      var lead = dockRear(bay) - V * (T0[bay] - ts - A / 2) + V * (ramp(frame - ts) - ramp(frame - te));
      return h("g", { clipPath: "url(#clipB" + bay + ")" },
        h("g", { clipPath: "url(#wDock" + bay + ")" },
          LAG.map(function (lag) { return h("g", { transform: "translate(" + (lead - lag - 25).toFixed(2) + ", " + y + ")" }, parcelArt(50)); })));
    });
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

  /* ---- scene 04: the 配送ネットワーク map, "open water" ------------------------------------------
     What it is
       the panel   the sea, flat, in the film's own sky blue. It covers the sky, the sun, the shafts and
                   the clouds while the map is up (scene 04 is a panel, not a view) and fades on the curve
                   the map leaves on, so the sky and the finale's world arrive together.
       the land    Japan as it really lies: every prefecture inside the frame is drawn (the map data always
                   held them; round 2 drew four and let the rest go). Every edge of the land is therefore
                   real coast, and the left of the frame, where the site's copy sits, is quiet land. Flat:
                   no edge copy under the silhouette, no shadow, no mask.
       the area    Sanpou white, the brightest thing on the panel: pure white where we deliver most, a
                   pale cool tint where we deliver least, crisp blue seams, names in a mid navy. The
                   depots' name cards are small navy signs with white lettering, like the warehouse's sign.
       the water   what moves. An apron of shallow water stands off the service area's Pacific coast and
                   narrows away along the neighbours' coast; three broad flat bands of the same water
                   leave it, travel outward and dissolve into the sea: the shape of our coast, carried
                   out. It runs on the ambient clock, so it never stops while the scene holds, and none of
                   it is on the left, under the copy.
     Vermilion is the routes' alone: the dashes, the place dots, the stripe on the trucks that run them
     (and the depots' fascia line).
     Sequence (all inside the timings the player already drives):
       land    mapIn 0-26  the sea is there from the first frame; the land, the water and the map arrive
                           on it as one object (fading in, settling to full size)
       prefs   4-56        each prefecture is wiped in, white, by a band growing outward from the hub, in
                           rank order of distance from Itabashi, so the white spreads from Tokyo
       routes  34-78       seven curved corridors draw from the hub with a long soft landing, as dashed
                           lines whose dashes already travel outward; a place dot comes up at the end
                           of each
       trucks  51 on       a small truck comes out from behind the head office on each corridor, one
                           after another, runs to the place dot, stands there a moment and goes
                           (see MAP_RUN)
       depots  24-80       three miniature Sanpou depots arrive one at a time, head office first. Each
                           pops in larger than it rests (a quick rise, one overshoot under 4 %, a clean
                           settle), is set down onto its own place as it eases to its resting size, and
                           then its name card comes out of it. All three are down and named by frame 80:
                           the frame the player holds, and the frame scene 05 starts from.
     Never frozen while it holds: the water travels, the dashes of all seven corridors travel outward,
     and two to five trucks are on the road. The depots stand still once they are down, as buildings do.
     Engine: the node list is the same shape on every frame; every id is prefixed nm4; the only clips are
     clipPaths with one rect child; no masks, filters, blur or gradients. The water's bands are three
     copies of one still shape, each on its own layer and only ever scaled and faded, and the land is a
     layer of its own, so nothing behind the map is drawn again while the water moves. */
  DAY.map = {
    sea: "#5fabe4",           // the panel: the sea, in the sky's own blue
    shelf: "#b7d9f3",         // shallow water: the apron off our coast, and the bands that leave it
    land: "#a9bbdb",          // the rest of Japan: the blue-grey of the film's city
    landSeam: "#98acd1",      // prefecture lines and the coast line on that land
    heatLo: [214, 229, 247],  // covered, least delivered: a pale cool tint
    heatHi: [255, 255, 255],  // covered, most delivered: Sanpou white
    seam: "#6f97cc",          // the crisp seam round every covered prefecture
    label: "#2f4d78",         // the prefecture names: a mid navy
    route: "#e16347",         // the route line keeps the brand vermilion
    routeCase: "#ffffff",
    flow: "#ffffff",
    // the mini depots, flat: one white front, navy roof slab / base course / outline, the vermilion fascia line
    depotLit: "#fbfdff",
    depotBay: "#2c4469", depotShutter: "#b3c2dc", depotGlass: "#8ebfe8", depotGlassLit: "#d2e7f8",
    ink: "#13263f",
    dot: "#ffffff",           // the ring round a place dot
    card: "#1f3b66",          // the name cards: navy signs
    cardText: "#ffffff",
    cardRim: "#13263f",       // the sign's lower edge
  };
  // the four neighbours that touch our area and still fit inside the map box, so the plate's outline is
  // all real coast and real prefecture border — the other 20 grey shapes are dropped with their 33k of
  // path data (the original faded them out with a mask, which this build is not allowed to use)
  var MAP_NEIGHBOURS = [5, 9, 10, 12];
  var MAP_PAD = 38;
  function mapHeat(ht) {
    var lo = DAY.map.heatLo, hi = DAY.map.heatHi, t = Math.pow(ht, 0.75);
    var L = function (i) { return Math.round(lo[i] + (hi[i] - lo[i]) * t); };
    return "rgb(" + L(0) + "," + L(1) + "," + L(2) + ")";
  }
  var mr1 = function (v) { return Math.round(v * 10) / 10; };
  var easeOutQuart = function (t) { return 1 - Math.pow(1 - t, 4); };
  var easeOutQuint = function (t) { return 1 - Math.pow(1 - t, 5); };
  var bellEase = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2; };

  /* Every name sits inside its own shape, clear of the routes, the depots and the other names; the spots
     were found by searching each polygon for the point furthest from its border that also clears
     everything else (tools/… scratch search, 2026-11-14). */
  var MAP_LABEL = {
    // 埼玉 moved west (it stood where 入間営業所 really is): now in the open part of west Saitama,
    // clear of the routes, the depots, their cards and the 入間 depot while it is enlarged
    TOKYO: { x: 456.4, y: 791.3, f: 11.5 }, SAITAMA: { x: 425.0, y: 733.8, f: 11.5 },
    KANAGAWA: { x: 451.5, y: 830.6, f: 14 }, CHIBA: { x: 565.7, y: 851.7, f: 15 },
    IBARAKI: { x: 581.4, y: 715.6, f: 15 }, TOCHIGI: { x: 523.7, y: 628.1, f: 15 },
    GUNMA: { x: 411.4, y: 665.9, f: 15 }, NIIGATA: { x: 397.0, y: 552.7, f: 15 },
  };
  var ROUTE_ORDER = ["CHIBA", "IBARAKI", "TOCHIGI", "GUNMA", "NIIGATA", "KANAGAWA", "SAITAMA"];
  var ROUTE_END = {
    CHIBA: [551, 833], IBARAKI: [612, 672], TOCHIGI: [523, 657], GUNMA: [432, 684],
    NIIGATA: [403, 577], KANAGAWA: [470, 826], SAITAMA: [430, 718],
  };
  // one corridor per direction: the bearing each route leaves the hub on. Swept for the widest possible
  // fan — the closest two corridors stay 14 map units (23 stage px) apart, so none crowds another.
  var ROUTE_DEP = { CHIBA: 48, IBARAKI: -36, TOCHIGI: -66, NIIGATA: -96, GUNMA: -132, SAITAMA: -170, KANAGAWA: 122 };
  /* The three bases, each standing on its real place (map units; 1 u = 1.63 stage px).
       本社（板橋）   stands on its own point in the north of Tokyo: the point is under its roof, so the
                     seven routes come out from behind the head office (no dot: the building is on it)
       志木営業所    stands on its point in Saitama: the dot shows just under its base line
       入間営業所    stands in Saitama beside its point, its near wall 9 u west of the dot and joined to
                     it by a stub: the Saitama corridor runs over the point's own spot, and Tokyo
                     begins 8 u south of it
     Positions were set against the corridors and the prefecture borders (scratch solver, 2026-11-14):
     every corner of both branch depots is inside Saitama, the head office's base is inside Tokyo.
     The bases are only 16 u and 25 u apart, so a depot can be no wider than 18 u at rest. Each one
     therefore arrives ENLARGED (big) about its own place (px = the pivot on its base line), lifted a
     little (lift) so it clears what is already down, and is set down as it eases to resting size; only
     one is ever enlarged at a time. t0 = the frame its arrival starts.
     Cards: 本社 to the east (the open wedge between the Ibaraki and Chiba corridors), 入間 to the west,
     志木 on a short post above its roof, in the widest gap of the fan (two corridors pass behind it:
     there is no spot in Saitama next to 志木 that clears them all). card = [x, y, width], side = the
     edge it grows from: r = from its left edge rightwards, l = from its right edge leftwards, u = from
     the post outwards. */
  var MAP_BASES = [
    { id: "itabashi", nm: "本社（板橋）", hq: true, w: 23, cx: 508.5, by: 791.5, px: 505.4, big: 2.2, lift: [0, -2], t0: 24,
      card: [522.8, 778.6, 62], side: "r" },
    { id: "shiki", nm: "志木営業所", hq: false, w: 17.6, cx: 489.2, by: 766.5, px: 491.9, big: 2.0, lift: [0, -4], t0: 40,
      card: [460, 731.5, 53], side: "u", post: 489.2 },
    { id: "iruma", nm: "入間営業所", hq: false, w: 17.6, cx: 449.2, by: 768, px: 458, big: 1.9, lift: [-3.5, -0.5], t0: 56,
      card: [384.6, 753.5, 53], side: "l" },
  ];
  var CARD_F = 9, CARD_H = 12.5;
  // one depot's arrival, in frames from its t0: pop 0-9, set down 9-19, card 17-24. The next one starts
  // at 16, and passes its own resting size at 18, when this one is within 1 % of rest.
  var DEPOT_SETTLE = 9, DEPOT_DOWN = 19, DEPOT_CARD = [17, 24];
  /* 0 -> 1 as a well damped spring (damping ratio 0.72): 95 % at 4 frames, ONE overshoot of 3.8 % at 6,
     back within 0.2 % by 10 and exactly 1 from 14. Not a bounce: the second swing is under 0.2 %. */
  function depotPop(a) {
    if (a <= 0) return 0;
    var g = 1 - Math.exp(-0.5432 * a) * (Math.cos(0.5236 * a) + 1.0375 * Math.sin(0.5236 * a));
    return g + (1 - g) * clamp01((a - 10) / 4);
  }
  var mr2 = function (v) { return Math.round(v * 100) / 100; };
  var _mapInit = null;
  function mapInit() {
    if (_mapInit) return _mapInit;
    var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, info = {};
    JRMAP.covered.forEach(function (c) {
      var nums = c.d.match(/-?\d+(\.\d+)?/g) || [], bb = [Infinity, Infinity, -Infinity, -Infinity];
      for (var i = 0; i + 1 < nums.length; i += 2) {
        var x = Number(nums[i]), y = Number(nums[i + 1]);
        if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
        if (x < bb[0]) bb[0] = x; if (x > bb[2]) bb[2] = x; if (y < bb[1]) bb[1] = y; if (y > bb[3]) bb[3] = y;
      }
      info[c.en] = { bb: bb };
    });
    var bounds = [x0 - MAP_PAD, y0 - MAP_PAD, x1 - x0 + MAP_PAD * 2, y1 - y0 + MAP_PAD * 2];
    var HUB = JRMAP.bases.itabashi;
    var order = JRMAP.covered.slice().sort(function (a, b) { return Math.hypot(a.cx - HUB.x, a.cy - HUB.y) - Math.hypot(b.cx - HUB.x, b.cy - HUB.y); });
    order.forEach(function (c, i) { info[c.en].rank = i; });
    JRMAP.covered.forEach(function (c) {
      var b = info[c.en].bb, span = 0, L = MAP_LABEL[c.en];
      [[b[0], b[1]], [b[2], b[1]], [b[0], b[3]], [b[2], b[3]]].forEach(function (q) { span = Math.max(span, Math.hypot(q[0] - HUB.x, q[1] - HUB.y)); });
      info[c.en].span = span + 28;
      info[c.en].deg = Math.atan2(L.y - HUB.y, L.x - HUB.x) * 180 / Math.PI;
    });
    var land = JRMAP.covered.map(function (c) { return c.d; })
      .concat(MAP_NEIGHBOURS.map(function (i) { return JRMAP.greys[i]; }));
    _mapInit = { bounds: bounds, HUB: HUB, info: info, land: land };
    return _mapInit;
  }

  /* the seven corridors: a cubic that leaves the hub on its own bearing and arrives aimed at its target */
  var _mapRoutes = null;
  function mapRoutes() {
    if (_mapRoutes) return _mapRoutes;
    var H = JRMAP.bases.itabashi;
    _mapRoutes = ROUTE_ORDER.map(function (en) {
      var E = ROUTE_END[en], d = Math.hypot(E[0] - H.x, E[1] - H.y), a = ROUTE_DEP[en] * Math.PI / 180;
      var c1x = H.x + Math.cos(a) * d * 0.45, c1y = H.y + Math.sin(a) * d * 0.45;
      var ux = (E[0] - H.x) / d, uy = (E[1] - H.y) / d;
      var c2x = E[0] - ux * d * 0.4, c2y = E[1] - uy * d * 0.4;
      var len = 0, px = H.x, py = H.y;
      for (var i = 1; i <= 48; i++) {
        var t = i / 48, m = 1 - t;
        var x = m * m * m * H.x + 3 * m * m * t * c1x + 3 * m * t * t * c2x + t * t * t * E[0];
        var y = m * m * m * H.y + 3 * m * m * t * c1y + 3 * m * t * t * c2y + t * t * t * E[1];
        len += Math.hypot(x - px, y - py); px = x; py = y;
      }
      return { en: en, end: E, len: len,
        d: "M" + H.x + "," + H.y + " C" + mr1(c1x) + "," + mr1(c1y) + " " + mr1(c2x) + "," + mr1(c2y) + " " + E[0] + "," + E[1] };
    });
    return _mapRoutes;
  }

  /* ---- the land of Japan round the service area, and the water that moves ----
     MAP_BOX is the map's own box on the stage. The land and the water are drawn in boxes laid out from that
     box at the map's own scale, so they are in register with the prefectures by construction.
     SWELL: reach = how far the apron of shallow water stands off our coast (map units; 1 u = 1.63 px),
     far = how many times its own size a band has grown, about the head office, when it has dissolved,
     period = seconds between two bands (the length of the scene's hold: the ambient clock steps back by
     exactly that when scene 05 begins, so the water does not jump there), rise = the part of its life in
     which a band comes up from nothing, fade = how its opacity falls as it travels, tol = how closely the water follows the coast, taperN / taperS = how far along the
     neighbours' coast, north and south, the apron narrows to nothing. */
  var MAP_BOX = [535, 12, 850, 1056];
  var SWELL = { n: 3, reach: 24, far: 1.95, period: 34 / 9, rise: 0.04, fade: 1.25, tol: 2.4, taperN: 285, taperS: 100 };
  var _mapGeo = null;
  function mapGeo() {
    if (_mapGeo) return _mapGeo;
    var M = mapInit(), B = M.bounds, k = Math.min(MAP_BOX[2] / B[2], MAP_BOX[3] / B[3]);
    var ox = (MAP_BOX[2] - B[2] * k) / 2, oy = (MAP_BOX[3] - B[3] * k) / 2;      // where the map's viewBox starts inside its box
    // the stage's edges in map units, with room for the map being a little smaller while it arrives and leaves
    var win = [B[0] - (MAP_BOX[0] + ox) / k - 80, B[1] - (MAP_BOX[1] + oy) / k - 80, B[0] + (1920 - MAP_BOX[0] - ox) / k + 80, B[1] + (1080 - MAP_BOX[1] - oy) / k + 80];
    var rings = JRMAP.covered.map(function (c) { return c.d; }).concat(JRMAP.greys).map(function (d) {
      var n = d.match(/-?\d+(\.\d+)?/g) || [], r = [];
      for (var i = 0; i + 1 < n.length; i += 2) {
        var x = Number(n[i]), y = Number(n[i + 1]);
        if (!r.length || r[r.length - 1][0] !== x || r[r.length - 1][1] !== y) r.push([x, y]);
      }
      if (r.length > 1 && r[0][0] === r[r.length - 1][0] && r[0][1] === r[r.length - 1][1]) r.pop();
      return r;
    });
    // a border between two prefectures is the same edge in both rings; an edge found only once is coast
    var ek = function (a, b) { var ka = a[0] + "," + a[1], kb = b[0] + "," + b[1]; return ka < kb ? ka + "|" + kb : kb + "|" + ka; };
    var used = {};
    rings.forEach(function (r) { for (var i = 0; i < r.length; i++) { var q = ek(r[i], r[(i + 1) % r.length]); used[q] = (used[q] || 0) + 1; } });
    var coast = [];
    rings.forEach(function (r, ri) {
      var n = r.length, isC = function (i) { return used[ek(r[i % n], r[(i + 1) % n])] === 1; }, start = -1, run = null;
      for (var i = 0; i < n; i++) if (!isC(i)) { start = i; break; }
      if (start < 0) { coast.push({ src: ri, pts: r.concat([r[0]]) }); return; }       // an island
      for (var j = 1; j <= n; j++) {
        var at = (start + j) % n;
        if (isC(at)) { if (!run) run = [r[at]]; run.push(r[(at + 1) % n]); }
        else if (run) { coast.push({ src: ri, pts: run }); run = null; }
      }
      if (run) coast.push({ src: ri, pts: run });
    });
    /* a box holding the part rc = [x0, y0, x1, y1] of the map at the map's own scale, as a child of the map's
       box: its place and size in pixels, and the svg that fills it. Nothing is drawn outside its own box. */
    var place = function (rc, kids) {
      return { left: mr2((rc[0] - B[0]) * k + ox), top: mr2((rc[1] - B[1]) * k + oy), width: mr2((rc[2] - rc[0]) * k), height: mr2((rc[3] - rc[1]) * k), k: k, rc: rc,
        svg: h("svg", { viewBox: [rc[0], rc[1], rc[2] - rc[0], rc[3] - rc[1]].join(" "), width: "100%", height: "100%", preserveAspectRatio: "none", style: { display: "block" } }, kids) };
    };
    return _mapGeo = { rings: rings, coast: coast, win: win, place: place };
  }
  // Douglas-Peucker on an open line: both ends stay
  function mapSimplify(pts, tol) {
    var keep = [], stack = [[0, pts.length - 1]];
    keep[0] = keep[pts.length - 1] = 1;
    while (stack.length) {
      var s = stack.pop(), a = pts[s[0]], b = pts[s[1]], worst = 0, at = -1;
      var dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy;
      for (var i = s[0] + 1; i < s[1]; i++) {
        var t = L2 ? Math.max(0, Math.min(1, ((pts[i][0] - a[0]) * dx + (pts[i][1] - a[1]) * dy) / L2)) : 0;
        var d = Math.hypot(pts[i][0] - a[0] - t * dx, pts[i][1] - a[1] - t * dy);
        if (d > worst) { worst = d; at = i; }
      }
      if (worst > tol) { keep[at] = 1; stack.push([s[0], at], [at, s[1]]); }
    }
    return pts.filter(function (_, i) { return keep[i]; });
  }
  var mapLine = function (pts) { return "M" + pts.map(function (p) { return p[0] + "," + p[1]; }).join("L"); };
  /* Everything still, built once.
       water  the one shape that travels, at its own size: our Pacific coast (Ibaraki, Chiba, Tokyo,
              Kanagawa) stroked 2 x reach wide; from each end of it the same reach carried on along the
              neighbours' coast as discs that shrink to nothing, so the water narrows away instead of
              stopping in a round end; and, under both, a fan of triangles from the head office to every
              point of that coast. The fan makes the shape solid as seen from the head office, so a copy
              of it grown about the head office always covers the smaller copies whole (no inner edges),
              and it lays Tokyo Bay under shallow water.
       band   that shape drawn at its largest (far times, about the head office) in a box that holds all
              of it: a layer of it is only ever scaled down
       land   the apron (that shape at its own size: a band starts exactly under it, so it never appears
              at an edge) and, on it, every prefecture that reaches into the frame */
  var _mapShore = null;
  function mapShore() {
    if (_mapShore) return _mapShore;
    var M = mapInit(), G = mapGeo(), C = DAY.map, S = SWELL, HUB = M.HUB, nCov = JRMAP.covered.length, R = S.reach;
    var OWN = { TOKYO: 1, KANAGAWA: 1, CHIBA: 1, IBARAKI: 1 };
    var isOwn = function (c) { return c.src < nCov && OWN[JRMAP.covered[c.src].en]; }, pk = function (p) { return p[0] + "," + p[1]; };
    var own = G.coast.filter(isOwn).map(function (c) { return mapSimplify(c.pts, S.tol); });
    // the two loose ends of our coast: the end points that only one of our runs has
    var seen = {}, ends = [];
    own.forEach(function (r) { [r[0], r[r.length - 1]].forEach(function (p) { seen[pk(p)] = (seen[pk(p)] || 0) + 1; ends.push(p); }); });
    // from each, the neighbours' coast, run after run: a point every 3 units with the reach it carries
    var taken = {};
    var follow = function (from, len) {
      var out = [], d = 0, at = pk(from);
      for (;;) {
        var pts = null;
        for (var i = 0; i < G.coast.length && !pts; i++) {
          var c = G.coast[i], n = c.pts.length;
          if (isOwn(c) || taken[i]) continue;
          if (pk(c.pts[0]) === at) pts = c.pts; else if (pk(c.pts[n - 1]) === at) pts = c.pts.slice().reverse();
          if (pts) taken[i] = 1;
        }
        if (!pts) return out;
        for (var j = 0; j + 1 < pts.length; j++) {
          var a = pts[j], b = pts[j + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]), m = Math.max(1, Math.ceil(L / 3));
          for (var q = 0; q < m; q++) {
            var t = q / m, dd = d + L * t;
            if (dd >= len) return out;
            out.push([mr2(a[0] + (b[0] - a[0]) * t), mr2(a[1] + (b[1] - a[1]) * t), mr2(R * (1 - dd / len))]);
          }
          d += L;
        }
        at = pk(pts[pts.length - 1]);
      }
    };
    // north the water narrows away up the coast to the top of the frame; south it ends at the tip of Izu,
    // at the foot of the frame: so the last line of the fan, which is straight, is never over open water
    var tails = ends.filter(function (p) { return seen[pk(p)] === 1; }).map(function (p) { return follow(p, p[1] < HUB.y ? S.taperN : S.taperS); });
    var fan = "", discs = "", bb = [HUB.x, HUB.y, HUB.x, HUB.y];
    own.concat(tails).forEach(function (r) {
      for (var i = 0; i < r.length; i++) {
        var a = r[i], b = r[i + 1], rr = a.length > 2 ? a[2] : R;
        bb = [Math.min(bb[0], a[0] - rr), Math.min(bb[1], a[1] - rr), Math.max(bb[2], a[0] + rr), Math.max(bb[3], a[1] + rr)];
        if (!b) continue;
        // every triangle the same way round, so two that overlap never cancel
        var cw = (a[0] - HUB.x) * (b[1] - HUB.y) - (a[1] - HUB.y) * (b[0] - HUB.x) > 0;
        fan += "M" + HUB.x + "," + HUB.y + "L" + (cw ? a : b).slice(0, 2).join(",") + "L" + (cw ? b : a).slice(0, 2).join(",") + "Z";
      }
    });
    tails.forEach(function (r) {
      r.forEach(function (p) { if (p[2] > 0.3) discs += "M" + mr2(p[0] - p[2]) + "," + p[1] + "a" + p[2] + "," + p[2] + " 0 1 1 " + mr2(p[2] * 2) + ",0a" + p[2] + "," + p[2] + " 0 1 1 " + mr2(-p[2] * 2) + ",0Z"; });
    });
    var water = [
      h("path", { d: fan, fill: C.shelf }),
      h("path", { d: discs, fill: C.shelf }),
      h("path", { d: own.map(mapLine).join(""), fill: "none", stroke: C.shelf, strokeWidth: R * 2, strokeLinejoin: "round", strokeLinecap: "round" }),
    ];
    var land = [];
    G.rings.forEach(function (r) {
      var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      r.forEach(function (p) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; });
      if (x1 > G.win[0] && x0 < G.win[2] && y1 > G.win[1] && y0 < G.win[3]) land.push(h("path", { d: mapLine(r) + "Z", fill: C.land, stroke: C.landSeam, strokeWidth: 1.1, strokeLinejoin: "round" }));
    });
    // the box of the shape at its largest: its own box grown about the head office, and 2 units to spare
    var far = bb.map(function (v, i) { return mr1((i % 2 ? HUB.y : HUB.x) + (v - (i % 2 ? HUB.y : HUB.x)) * S.far + (i < 2 ? -2 : 2)); });
    var band = G.place(far, h("g", { transform: "translate(" + HUB.x + "," + HUB.y + ") scale(" + S.far + ") translate(" + (-HUB.x) + "," + (-HUB.y) + ")" }, water));
    // the head office inside that box, in pixels: the point the water grows about
    band.pivot = mr2((HUB.x - far[0]) * band.k) + "px " + mr2((HUB.y - far[1]) * band.k) + "px";
    return _mapShore = { band: band, land: G.place(G.win, [h("g", null, water), land]) };
  }
  var mapLayer = function (P, more) {
    var st = { position: "absolute", left: P.left, top: P.top, width: P.width, height: P.height };
    for (var q in more) st[q] = more[q];
    return h("div", { style: st }, P.svg);
  };
  /* The water that moves: n layers of the one still shape, a third of a turn apart. Each lives one turn
     (n x period seconds): it comes up under the apron at the apron's own size, grows about the head office
     to `far` times that and fades to nothing on the way, then starts again unseen. All are one colour, so
     the order they lie in does not matter and no layer ever has to change places with another.
     Only transform and opacity change, so the browser moves finished layers and draws nothing again. */
  function MapSwell(time) {
    var S = SWELL, band = mapShore().band, p = time / (S.period * S.n);
    return range(S.n, function (j) {
      var u = ((p + j / S.n) % 1 + 1) % 1;
      return mapLayer(band, { willChange: "transform, opacity", transformOrigin: band.pivot,
        transform: "scale(" + ((1 + (S.far - 1) * u) / S.far).toFixed(5) + ")", opacity: (Math.min(1, u / S.rise) * Math.pow(1 - u, S.fade)).toFixed(4) });
    });
  }
  /* A miniature Sanpou depot, drawn with its base line on y = 0 and centred on x = 0 so it can be scaled
     about its own place. A small version of the warehouse of scene 02 as ONE straight-on elevation: a
     white front the full width of the building, a level navy roof slab with nothing on it, the vermilion
     fascia line from wall to wall, dock bays between white piers on a navy base course with their
     shutters rolled half up, one navy outline. The head office is wider, has three bays and carries a
     glazed office floor (two panes, a diagonal of sky in each) at its right end.
     Every edge is vertical or horizontal; the only diagonals are the two sheens inside the glass.
     Nothing is thinner than 1.9 u (3.1 stage px) at resting size. No lettering.
     It throws no shadow on the map: the old one was a translucent parallelogram lying to one side, which is
     what a side face would throw. `cast` is kept in what is returned as a constant empty group, so the
     node list of the map is the same shape as before.
     Returns { art: the building, cast: an empty group, top: height of the main roof }. */
  var _depotMemo = {};
  function MiniDepot(w, hq) {
    var mk = w + "|" + (hq ? 1 : 0);
    if (_depotMemo[mk]) return _depotMemo[mk];
    var C = DAY.map, hw = w / 2, SW = 1.9, SL = 2.25, T = hq ? 11 : 10.6, OV = SW / 2;
    var P = function (a) { return a.map(function (q) { return mr2(q[0]) + "," + mr2(q[1]); }).join(" "); };
    var R = function (x, y, rwd, rh) { return "M" + mr2(x) + "," + mr2(y) + "h" + mr2(rwd) + "v" + mr2(rh) + "h" + mr2(-rwd) + "z"; };
    var yF0 = -T + (hq ? 2.2 : 2), yF1 = yF0 + 2.2, yB = -2.2;
    var bays = hq ? 3 : 2, inner = w - SW, pier = 1.9, bw = (inner - pier * (bays + 1)) / bays;
    var roll = Math.max(1.9, (yB - yF1) / 2);                 // how far down the shutters hang: half the opening
    var dBay = "", dShut = "";
    for (var i = 0; i < bays; i++) {
      var bx = -hw + OV + pier + i * (bw + pier);
      dBay += R(bx, yF1, bw, yB - yF1);
      dShut += R(bx, yF1, bw, roll);
    }
    var art = [
      h("rect", { x: -hw, y: -T, width: w, height: T, fill: C.depotLit }),
      h("rect", { x: -hw, y: mr2(yF0), width: w, height: 2.2, fill: C.route }),
      h("path", { d: dBay, fill: C.depotBay }),
      h("path", { d: dShut, fill: C.depotShutter }),
      h("rect", { x: mr2(-hw - OV), y: yB, width: mr2(w + SW), height: -yB, fill: C.ink }),
      // the outline: the two walls. The slab closes the top and the base course the bottom, in the same navy.
      h("path", { d: "M" + hw + "," + (-T) + "V0 M" + (-hw) + "," + (-T) + "V0", fill: "none", stroke: C.ink, strokeWidth: SW }),
      h("rect", { x: mr2(-hw - OV), y: mr2(-T - SL), width: mr2(w + SW), height: SL, fill: C.ink }),
    ];
    if (hq) {   // the office floor: two panes of glass, the sky in each as one diagonal, its own slab
      var ox = hw - 12, oy = -T - SL, oh = 3.8, g0 = ox + OV, g1 = hw - OV, pn = (g1 - g0 - SW) / 2, mx = (ox + hw) / 2;
      art.push(
        h("rect", { x: mr2(g0), y: mr2(oy - oh), width: mr2(g1 - g0), height: oh, fill: C.depotGlass }),
        h("polygon", { points: P([[g0, oy - oh], [g0 + pn, oy - oh], [g0, oy]]), fill: C.depotGlassLit }),
        h("polygon", { points: P([[g1 - pn, oy - oh], [g1, oy - oh], [g1 - pn, oy]]), fill: C.depotGlassLit }),
        h("path", { d: "M" + mr2(ox) + "," + mr2(oy) + "V" + mr2(oy - oh) + " M" + mr2(mx) + "," + mr2(oy) + "V" + mr2(oy - oh) + " M" + hw + "," + mr2(oy) + "V" + mr2(oy - oh), fill: "none", stroke: C.ink, strokeWidth: SW }),
        h("rect", { x: mr2(ox - OV), y: mr2(oy - oh - 2), width: mr2(hw - ox + 2 * OV), height: 2, fill: C.ink })
      );
    }
    return _depotMemo[mk] = { art: art, cast: h("g", null), top: T + SL };
  }
  /* ---- the routes: dashed corridors, and a truck running each ----
     The line   a corridor is a row of vermilion dashes with round ends on its white casing. The dashes
                travel outward from the head office, so the way the route goes reads without anything
                else. MAP_DASH: on / off = the dash pattern (with the round ends a dash is on + 3.2 u long
                and the gap off - 3.2 u), laps = how many dashes pass a point in one SWELL.period: a whole
                number, so the dashes are where they were when the ambient clock steps back by that
                period at the start of scene 05.
     The run    MAP_RUN, in seconds of the ambient clock (flowTime):
                  dep   when the corridor's truck first sets off, out of sight behind the head office.
                        It shows above the roof about 0.2 s later (below the building, on the two
                        corridors that run south, about 0.1 s later): never before its corridor has
                        finished drawing
                  run   how long the run takes: a soft start, a longer soft landing (mapRunEase)
                  stay  how long it stands at the place, its nose at the place dot
                  fade  how long it takes to go
                  runs  how many runs it makes in one SWELL.period: the two short corridors (Chiba,
                        Kanagawa) are served twice as often as the others
                  back  (Saitama only) how far short of the dot it stops: the name 埼玉 lies beside the
                        last 21 u of that corridor, and a truck any nearer the dot would stand on it.
                        The others stop where their box clears the dot (11 to 16 u short of it)
                First seen, in order: Chiba, Gunma, Kanagawa, Niigata, Ibaraki, then Tochigi and Saitama,
                which leave late so that their runs fill the end of the hold; two that follow each other
                closely leave in different directions.
                The rule the numbers keep: the state of every truck repeats every SWELL.period from the
                moment the scene starts to hold (flowTime 80/30). A truck that has left by then simply
                cycles (run + stay + fade fits in its cycle); one that leaves later has gone again
                SWELL.period after that moment: dep + run + stay + fade <= 80/30 + SWELL.period.
                So nothing jumps when the player's clock steps back by that period where scene 05 begins. */
  var MAP_DASH = { on: 4.6, off: 6.2, laps: 8 };
  var MAP_RUN = {
    CHIBA:    { dep: 1.62, run: 1.33, stay: 0.25, fade: 0.30, runs: 2 },
    KANAGAWA: { dep: 2.13, run: 1.25, stay: 0.30, fade: 0.30, runs: 2 },
    GUNMA:    { dep: 1.85, run: 1.67, stay: 0.90, fade: 0.40, runs: 1 },
    NIIGATA:  { dep: 2.30, run: 2.42, stay: 0.90, fade: 0.40, runs: 1 },
    IBARAKI:  { dep: 2.65, run: 1.87, stay: 0.90, fade: 0.40, runs: 1 },
    TOCHIGI:  { dep: 3.83, run: 1.77, stay: 0.42, fade: 0.40, runs: 1 },
    SAITAMA:  { dep: 4.26, run: 1.60, stay: 0.20, fade: 0.36, runs: 1, back: 24 },
  };
  /* A run's distance, 0 -> 1 over 0 -> 1 of its time: the speed comes up smoothly over the first 30 %,
     holds, and comes down smoothly over the last 42 % (a longer landing than start). */
  function mapRunEase(u) {
    var a = 0.3, b = 0.42, v = 1 / (1 - (a + b) / 2), x;
    if (u <= 0) return 0;
    if (u >= 1) return 1;
    if (u < a) { x = u / a; return v * a * (x * x * x - x * x * x * x / 2); }
    if (u <= 1 - b) return v * (a / 2 + u - a);
    x = (u - (1 - b)) / b;
    return v * (a / 2 + 1 - b - a + b * (x - x * x * x + x * x * x * x / 2));
  }
  /* The map truck, facing right, drawn about its own centre (17 u long and 11.6 u high, 17.7 u with the
     bumper; 1 u = 1.63 stage px, about 1.1 px on a phone). Designed at this size, in the manner of the
     mini depots: a white box in one navy outline (roof, two walls, the chassis under it), the vermilion
     stripe along its foot, a navy cab one roof-thickness lower than the box with one pane of glass and
     the corner of the windscreen cut, a pale bumper, two navy wheels with pale hubs. No lettering.
     Every part is 1.9 u (3.1 stage px) or more across. Built once; every truck on the map shares it. */
  var MAP_TRUCK = { hx: 8.5, hy: 5.8 };
  var _mapTruck = null;
  function MiniTruck() {
    if (_mapTruck) return _mapTruck;
    var C = DAY.map;
    return _mapTruck = [
      h("rect", { x: -8.5, y: -5.8, width: 11, height: 9.2, fill: C.ink }),
      h("rect", { x: -6.6, y: -3.9, width: 7.2, height: 3.4, fill: C.depotLit }),
      h("rect", { x: -6.6, y: -0.5, width: 7.2, height: 2, fill: C.route }),
      h("polygon", { points: "2.5,-3.9 7.1,-3.9 8.5,-2.5 8.5,3.4 2.5,3.4", fill: C.ink }),
      h("polygon", { points: "3.4,-2 6,-2 6.6,-1.4 6.6,0.6 3.4,0.6", fill: C.depotGlassLit }),
      h("rect", { x: 6.9, y: 1.5, width: 2.3, height: 1.9, fill: C.depotShutter }),
      h("circle", { cx: -4.4, cy: 3.4, r: 2.4, fill: C.ink }),
      h("circle", { cx: 5, cy: 3.4, r: 2.4, fill: C.ink }),
      h("circle", { cx: -4.4, cy: 3.4, r: 0.95, fill: C.depotShutter }),
      h("circle", { cx: 5, cy: 3.4, r: 0.95, fill: C.depotShutter }),
    ];
  }
  /* Each corridor measured for its truck, once. From the numbers the line itself is drawn with:
       at(s)     the point s map units along the corridor
       cut(k)    the corridor's own curve from the hub to k of its length (0-1), as a path: what is drawn
                 while the corridor is still growing, so its dashes keep their pattern from the hub
       travel    how far the truck runs: it stops with its nose at the place dot, standing back along the
                 line until its box is clear of the dot, so the dot stays in view (or `back`, if given)
       face      1 = it runs to the right, -1 = to the left (the drawing is mirrored, never turned)
     and its timetable from MAP_RUN (every = the seconds between two of its departures). */
  var _mapRuns = null;
  function mapRuns() {
    if (_mapRuns) return _mapRuns;
    var N = 64;
    return _mapRuns = mapRoutes().map(function (r) {
      var q = r.d.match(/-?\d+(\.\d+)?/g).map(Number), X = [q[0], q[2], q[4], q[6]], Y = [q[1], q[3], q[5], q[7]];
      var B = function (P, t) { var m = 1 - t; return m * m * m * P[0] + 3 * m * m * t * P[1] + 3 * m * t * t * P[2] + t * t * t * P[3]; };
      var cum = [0], px = X[0], py = Y[0];
      for (var i = 1; i <= N; i++) {
        var x = B(X, i / N), y = B(Y, i / N);
        cum.push(cum[i - 1] + Math.hypot(x - px, y - py)); px = x; py = y;
      }
      var len = cum[N];
      // the curve's own parameter at s units along it
      var seek = function (s) {
        if (s <= 0) return 0;
        if (s >= len) return 1;
        var lo = 0, hi = N;
        while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (cum[mid] <= s) lo = mid; else hi = mid; }
        return (lo + (s - cum[lo]) / (cum[hi] - cum[lo] || 1)) / N;
      };
      var mix = function (a, b, t) { return a + (b - a) * t; };
      var cut = function (k) {
        var t = seek(len * k);
        var ax = mix(X[0], X[1], t), ay = mix(Y[0], Y[1], t), bx = mix(X[1], X[2], t), by = mix(Y[1], Y[2], t), cx = mix(X[2], X[3], t), cy = mix(Y[2], Y[3], t);
        var dx = mix(ax, bx, t), dy = mix(ay, by, t), ex = mix(bx, cx, t), ey = mix(by, cy, t);
        return "M" + X[0] + "," + Y[0] + " C" + mr2(ax) + "," + mr2(ay) + " " + mr2(dx) + "," + mr2(dy) + " " + mr2(mix(dx, ex, t)) + "," + mr2(mix(dy, ey, t));
      };
      var tt = MAP_RUN[r.en], back = tt.back || 0;
      if (!back) {
        var ux = X[3] - X[2], uy = Y[3] - Y[2], un = Math.hypot(ux, uy) || 1;
        ux = Math.abs(ux / un); uy = Math.abs(uy / un);
        while (Math.hypot(Math.max(0, back * ux - MAP_TRUCK.hx), Math.max(0, back * uy - MAP_TRUCK.hy)) < 4.8 + 0.6) back += 0.25;
      }
      return { en: r.en, len: len, travel: len - back, face: X[3] >= X[0] ? 1 : -1,
        dep: tt.dep, run: tt.run, stay: tt.stay, fade: tt.fade, every: SWELL.period / tt.runs,
        at: function (s) { var t = seek(s); return [B(X, t), B(Y, t)]; }, cut: cut };
    });
  }
  /* Where corridor R's truck is at ambient time `time`: [x, y, opacity], x and y the centre of the truck.
     It starts inside the head office's front (2.5 u right of and 6.4 u below the hub, which lies under the
     roof slab) and is on the line by the time it has run 16 u. Not on the road: at that start, opacity 0. */
  function mapTruckAt(R, time) {
    var ph = time - R.dep, s = 0, op = 0;
    if (ph >= 0) {
      ph = ph % R.every;
      if (ph < R.run) { s = R.travel * mapRunEase(ph / R.run); op = clamp01(ph / 0.1); }
      else if (ph < R.run + R.stay + R.fade) {
        var fk = clamp01((ph - R.run - R.stay) / R.fade);
        s = R.travel; op = 1 - fk * fk * (3 - 2 * fk);
      }
    }
    var at = R.at(s), k0 = clamp01(s / 16), off = 1 - k0 * k0 * (3 - 2 * k0);
    return [at[0] + 2.5 * off, at[1] + 6.4 * off, op];
  }
  // for the close-up picture of the model and for checks
  root.JourneyPort._components.map = { truck: MiniTruck, depot: MiniDepot, runs: mapRuns, truckAt: mapTruckAt, timetable: MAP_RUN, dash: MAP_DASH, swell: SWELL };
  function CoverageMap(p) {
    var prefProgress = p.prefProgress, routeProgress = p.routeProgress, pinProgress = p.pinProgress,
      flowTime = p.flowTime, mapIn = p.mapIn == null ? 1 : p.mapIn;
    var M = mapInit(), C = DAY.map, HUB = M.HUB, routes = mapRoutes();
    // The land is not here any more: it is drawn once, under this, by mapShore(). This is what changes:
    // the covered prefectures as they are wiped in, the routes, the names, the depots and their cards.

    return h("svg", { viewBox: M.bounds.join(" "), width: "100%", height: "100%", style: { overflow: "hidden" } },
      h("defs", null,
        JRMAP.covered.map(function (cp) {
          var nf = M.info[cp.en], k = clamp01((prefProgress - nf.rank * 0.055) * 1.45), grow = bellEase(k) * nf.span;
          return h("clipPath", { id: "nm4w" + nf.rank },
            h("rect", { x: -grow, y: -2400, width: grow * 2, height: 4800,
              transform: "translate(" + HUB.x + "," + HUB.y + ") rotate(" + mr1(nf.deg) + ")" }));
        })
      ),
      h("g", null,
        JRMAP.covered.map(function (cp) {
          var nf = M.info[cp.en];
          return h("g", { clipPath: "url(#nm4w" + nf.rank + ")" },
            h("path", { d: cp.d, fill: mapHeat(cp.heat), stroke: C.seam, strokeWidth: 1.9, strokeLinejoin: "round" }));
        }),
        routes.map(function (r, i) {
          var raw = (routeProgress - i * 0.07) * 2.6;
          var draw = easeOutQuart(clamp01(raw)), flow = clamp01((raw - 1) * 2.2);
          var on = Math.min(1, draw * 4), DP = MAP_DASH.on + MAP_DASH.off;
          // while it grows, the corridor is its own curve cut at the growing end
          var d = draw < 1 ? mapRuns()[i].cut(draw) : r.d;
          // casing 4.9 u = 8.0 stage px, dashes 3.2 u = 5.2 px thick, 7.8 u long, 3 u apart: over the 3 px
          // floor on a phone. They move outward at laps x pattern / period = 22.9 u a second.
          return h("g", null,
            h("path", { d: d, fill: "none", stroke: C.routeCase, strokeWidth: 4.9, strokeLinecap: "round", opacity: 0.88 * on }),
            h("path", { d: d, fill: "none", stroke: C.route, strokeWidth: 3.2, strokeLinecap: "round", opacity: on,
              strokeDasharray: MAP_DASH.on + " " + MAP_DASH.off,
              strokeDashoffset: mr2(-((flowTime * MAP_DASH.laps * DP / SWELL.period + i * 3.7) % DP)) }),
            h("circle", { cx: r.end[0], cy: r.end[1], r: 4.8 * flow, fill: C.routeCase }),
            h("circle", { cx: r.end[0], cy: r.end[1], r: 2.8 * flow, fill: C.route })
          );
        }),
        JRMAP.covered.map(function (cp) {
          var nf = M.info[cp.en], L = MAP_LABEL[cp.en];
          var k = clamp01((prefProgress - nf.rank * 0.055) * 1.45);
          var e = easeOutQuart(clamp01((k - 0.45) / 0.55));
          return h("text", { x: L.x, y: mr1(L.y + L.f * 0.36 + (1 - e) * 4), textAnchor: "middle",
            fontFamily: FONTS.jp, fontWeight: 700, fontSize: L.f, fill: C.label, opacity: e }, cp.jp);
        }),
        // --- the trucks: over the names, under the depots (each comes out from behind the head office).
        // Always seven, in the corridors' order; one that is not on the road waits at the hub with no opacity.
        h("g", null, mapRuns().map(function (R) {
          var q = mapTruckAt(R, flowTime);
          return h("g", { transform: "translate(" + mr2(q[0]) + "," + mr2(q[1]) + ") scale(" + R.face + ",1)", opacity: mr2(q[2]) }, MiniTruck());
        })),
        // --- the three bases: place dots and stubs first, then the buildings, then the name cards ---
        (function () {
          var f = p.depotFrame == null ? 999 : p.depotFrame;
          var st = MAP_BASES.map(function (b) {
            var a = f - b.t0, D = MiniDepot(b.w, b.hq);
            var down = easeInOutCubic(clamp01((a - DEPOT_SETTLE) / (DEPOT_DOWN - DEPOT_SETTLE)));
            var cl = clamp01((a - DEPOT_CARD[0]) / (DEPOT_CARD[1] - DEPOT_CARD[0]));
            return { a: a, D: D, down: down, cl: cl,
              s: Math.max(0.001, depotPop(a) * (b.big - (b.big - 1) * down)),
              ox: b.lift[0] * (1 - down), oy: b.lift[1] * (1 - down) };
          });
          return h("g", null,
            MAP_BASES.map(function (b, j) {
              var B = JRMAP.bases[b.id], s = st[j], hw = b.w / 2;
              var dk = easeOutCubic(clamp01((s.a + 3) / 4));               // the place lights up first
              var lk = clamp01((s.a - 13) / 6);                             // then the stub to the building
              // the stub runs from the place to the nearest point of the resting building's wall
              var wx = Math.max(b.cx - hw, Math.min(b.cx + hw, B.x)), wy = Math.min(b.by - 1.4, B.y);
              return h("g", null,
                h("line", { x1: B.x, y1: B.y, x2: mr2(B.x + (wx - B.x) * lk), y2: mr2(B.y + (wy - B.y) * lk), stroke: C.ink, strokeWidth: 1.9, opacity: lk > 0 ? 1 : 0 }),
                h("circle", { cx: B.x, cy: B.y, r: b.hq ? 0 : mr2(3.9 * dk), fill: C.dot }),
                h("circle", { cx: B.x, cy: B.y, r: b.hq ? 0 : mr2(2 * dk), fill: C.ink }));
            }),
            MAP_BASES.map(function (b, j) {
              var s = st[j];
              var tf = "translate(" + mr2(b.px + s.ox) + "," + mr2(b.by + s.oy) + ") scale(" + (Math.round(s.s * 1000) / 1000) + ") translate(" + mr2(b.cx - b.px) + ",0)";
              var op = mr2(clamp01(s.a / 1.5));
              return h("g", null,
                h("g", { transform: tf, opacity: op }, s.D.cast),
                h("g", { "data-depot": b.id, transform: tf, opacity: op }, s.D.art));
            }),
            MAP_BASES.map(function (b, j) {
              var s = st[j], W = b.card[2], x0 = b.card[0], y0 = b.card[1];
              var pk = b.side === "u" ? easeOutCubic(clamp01(s.cl / 0.4)) : 0;        // the post goes up first
              var r = easeOutQuart(b.side === "u" ? clamp01((s.cl - 0.25) / 0.75) : s.cl);
              // the visible part of the plate: it grows out of the edge that touches its building
              var gx = b.side === "u" ? b.post : b.side === "l" ? x0 + W : x0;
              var vx = mr2(gx - (gx - x0) * r), vw = mr2(W * r);
              var roof = b.by - s.D.top, pb = y0 + CARD_H + 1;
              return h("g", null,
                h("clipPath", { id: "nm4c" + j }, h("rect", { x: vx, y: y0, width: vw, height: CARD_H })),
                h("line", { x1: b.post || 0, y1: mr2(roof + 0.6), x2: b.post || 0, y2: mr2(roof + 0.6 - (roof + 0.6 - pb) * pk), stroke: C.ink, strokeWidth: 1.9, opacity: pk > 0 ? 1 : 0 }),
                // until it starts the card has no size at all (its text would otherwise still have a box):
                // it is folded onto the far end of where it will lie, a spot no depot ever covers
                h("g", { "data-card": b.id, opacity: mr2(clamp01(r * 6)), transform: r > 0 ? "translate(0,0) scale(1)" : "translate(" + mr2(b.side === "u" ? gx : 2 * x0 + W - gx) + "," + y0 + ") scale(0.001)" },
                  h("rect", { x: vx, y: y0 + 1.9, width: vw, height: CARD_H, rx: 2.4, fill: C.cardRim }),
                  h("rect", { x: vx, y: y0, width: vw, height: CARD_H, rx: 2.4, fill: C.card }),
                  h("g", { clipPath: "url(#nm4c" + j + ")" },
                    // textLength pins the name's width (9.3 u a character), so it sits the same in its plate at any zoom
                    h("text", { x: x0 + W / 2, y: mr2(y0 + CARD_H / 2 + CARD_F * 0.36), textAnchor: "middle", textLength: mr2(b.nm.length * 9.3), lengthAdjust: "spacing",
                      fontFamily: FONTS.jp, fontWeight: 700, fontSize: CARD_F, fill: C.cardText }, b.nm))));
            })
          );
        })()
      )
    );
  }
  /* ============================== SCENES ============================== */
  var GROUND = 880, B_SCALE = 1.9, T_SCALE = 2.0, SUPPLIER_X = 80, TRUCK_PARK_1 = 760, WAREHOUSE_X = 1980, WORLD_W = 4800;
  function dockRear(i) { return bayWorldX(WAREHOUSE_X, B_SCALE, i) + BAY_W * B_SCALE + 15; }

  /* Scene 01: cartons riding the supplier's roller conveyor into the truck (world coordinates). One even flow:
     three cartons stand waiting in the open door; the line starts from rest as the truck's rear door swings
     open, runs at V px a frame and comes to rest again. Five cartons, evenly spaced, cross the truck's rear
     plane (every crossing inside T_WORLD.parcels, after the door is open and before it closes), and one more
     comes to rest where the first one stood, ready for the next load.
     The scene draws the list twice: under the truck from the door's left jamb to where the truck's rear
     stands (so the truck drives in over the cartons that wait), and over the truck's open rear door, cut at
     its rear plane (so a carton goes into the truck). */
  function supplierJambX() { return SUPPLIER_X + (228 - 24) * B_SCALE; }
  function SupplierCartons(frame) {
    var V = 4.8, A = 12, GAP = 63, N = 5, ts = 68, rear = TRUCK_PARK_1;
    var X0 = SUPPLIER_X + (280 - 24) * B_SCALE + GAP;                 // the lead carton waits one gap right of the door's centre line
    var te = ts + A / 2 + (rear + 25 + (N - 1) * GAP - X0) / V;       // the line starts to slow when the last carton is inside the truck
    var ramp = function (tau) { if (tau <= 0) return 0; if (tau >= A) return tau - A / 2; var u = tau / A; return A * (u * u * u - u * u * u * u / 2); };
    var lead = X0 + V * (ramp(frame - ts) - ramp(frame - te)), y = (GROUND - 8.4 * B_SCALE).toFixed(2), lags = [];
    for (var i = 0; i < N; i++) lags.push(i * GAP);
    lags.push(V * (te - ts));                                         // the one that stays ends where the lead began
    return lags.map(function (lag) { return h("g", { transform: "translate(" + (lead - lag).toFixed(2) + ", " + y + ")" }, parcelArt(50)); });
  }
  /* ---- round 2 street furniture ---- */
  DAY.poleLit = "#9fb2cb"; DAY.poleDark = "#4d5f7a"; DAY.lampLens = "#e3ebf4";
  DAY.utilityLit = "#7f92b2"; DAY.utilityDark = "#3f5175"; DAY.wireFlat = "#6b7da0"; DAY.guardBand = "#cdb84f";
  DAY.walkLit = "#d6dae0"; DAY.walkShade = "#a3abb6"; DAY.curbShade = "#7f8994"; DAY.tactile = "#dcc152";
  DAY.roadLine = "#757b82"; DAY.roadDash = "#b9bdc1";
  DAY.fgBand = "#222a37"; DAY.fgEdge = "#3b4759"; DAY.fgRail = "#1b2638"; DAY.fgRailLit = "#4b5b76";
  /* A road lamp: a steel pole on a collar, a curved arm, a flat LED head. Off in daylight. */
  var _slMemo = null;
  function Streetlight(x, y) {
    if (!_slMemo) _slMemo = h("g", null,
      h("rect", { x: -4, y: -192, width: 8, height: 192, fill: DAY.pole }),
      h("rect", { x: 1, y: -192, width: 3, height: 180, fill: DAY.poleLit }),
      h("path", { d: "M-4,-188 L-4,-193 Q-4,-205 9,-205 L54,-205 L54,-198 L12,-198 Q4,-198 4,-190 L4,-188 Z", fill: DAY.pole }),
      h("rect", { x: -7, y: -18, width: 14, height: 18, rx: 2, fill: DAY.poleDark }),
      h("rect", { x: -7, y: -18, width: 14, height: 4, rx: 2, fill: DAY.pole }),
      h("rect", { x: 40, y: -200, width: 27, height: 9, rx: 3, fill: DAY.poleDark }),
      h("rect", { x: 44, y: -193, width: 19, height: 3.2, rx: 1.5, fill: DAY.lampLens }));
    return h("g", { transform: "translate(" + x + ", " + y + ")" }, _slMemo);
  }
  /* 電柱: concrete utility poles as they stand in a Tokyo street: two crossarms with insulators, a pole
     transformer on every other pole and a small lamp on the others, a yellow guard band at the foot, and
     four lines sagging between them (three conductors and one heavier cable). Shapes are batched by colour. */
  var _upMemo = {};
  function UtilityPoles(x0, n, gap, baseY, ht) {
    var mk = x0 + "|" + n + "|" + gap + "|" + baseY + "|" + ht;
    if (_upMemo[mk]) return _upMemo[mk];
    var R = function (rx, ry, rw, rh) { return "M" + rx + "," + ry + "h" + rw + "v" + rh + "h" + (-rw) + "z"; };
    var dShaft = "", dLit = "", dDark = "", dBand = "", dW = "", dC = "";
    for (var i = 0; i < n; i++) {
      var px = x0 + i * gap, top = baseY - ht;
      dShaft += "M" + (px - 5) + "," + baseY + "L" + (px - 3) + "," + top + "L" + (px + 3) + "," + top + "L" + (px + 5) + "," + baseY + "z";
      dLit += "M" + (px + 1.6) + "," + baseY + "L" + (px + 0.4) + "," + (top + 2) + "L" + (px + 3) + "," + (top + 2) + "L" + (px + 5) + "," + baseY + "z";
      dDark += R(px - 24, top + 12, 48, 5) + R(px - 17, top + 34, 34, 4.5);
      [-22, -3, 16].forEach(function (o) { dLit += R(px + o, top + 4, 6, 8); });
      if (i % 2 === 0) { dDark += R(px + 5, top + 50, 15, 23) + R(px + 1, top + 58, 5, 4); dLit += R(px + 5, top + 56, 15, 3.4) + R(px + 16, top + 50, 4, 23); }
      else { dDark += R(px + 2, top + 62, 20, 3.6) + R(px + 17, top + 60, 11, 6.5); dLit += R(px + 19, top + 65, 7, 3); }
      dBand += R(px - 5.4, baseY - 74, 10.8, 13);
      if (i < n - 1) {
        var nx = px + gap;
        [-19, 0, 19].forEach(function (o, k) { var yy = top + 4, sag = 16 + k * 3; dW += "M" + (px + o) + "," + yy + "Q" + (px + gap / 2 + o) + "," + (yy + sag) + " " + (nx + o) + "," + yy; });
        dC += "M" + px + "," + (top + 38) + "Q" + (px + gap / 2) + "," + (top + 70) + " " + nx + "," + (top + 38);
      }
    }
    return _upMemo[mk] = h("g", null,
      h("path", { d: dW, fill: "none", stroke: DAY.wireFlat, strokeWidth: 2 }),
      h("path", { d: dC, fill: "none", stroke: DAY.wireFlat, strokeWidth: 3.2 }),
      h("path", { d: dShaft, fill: DAY.utility }),
      h("path", { d: dDark, fill: DAY.utilityDark }),
      h("path", { d: dLit, fill: DAY.utilityLit }),
      h("path", { d: dBand, fill: DAY.guardBand }));
  }
  /* 自販機: a pair of plain (unbranded) vending machines on the pavement. Each is a cabinet with a shaded
     left return and a lit top, a display of three shelves of cans, a button strip, a payment panel and a
     delivery flap; one flat shadow on the paving. No lettering. */
  var _vmMemo = null;
  function VendingPair(x, baseY) {
    if (_vmMemo && _vmMemo.k === x + "|" + baseY) return _vmMemo.v;
    var units = [{ dx: 0, body: "#f1f4f7", shade: "#d3dce8", cap: "#ffffff", win: "#e4edf6", dark: "#33425c" }, { dx: 58, body: "#3f78b8", shade: "#2f5f97", cap: "#6297d0", win: "#e4edf6", dark: "#1c2d4a" }];
    var cans = ["#e16347", "#2a7f8c", "#f2c14e", "#7aa5d6", "#5d8f4e"];
    var out = h("g", { "data-cache": "vending-" + x + "|" + baseY, "data-box": (x - 20) + " " + (baseY - 102) + " 136 110" },
      h("path", { d: "M" + (x - 16) + "," + (baseY + 6) + "L" + (x - 8) + "," + baseY + "L" + (x + 112) + "," + baseY + "L" + (x + 108) + "," + (baseY + 6) + "z", fill: DAY.walkShade }),
      units.map(function (u, ui) {
        var ux = x + u.dx, top = baseY - 100, dCans = ["", "", "", "", ""];
        for (var r = 0; r < 3; r++) for (var c = 0; c < 5; c++) dCans[(c + r * 2 + ui * 3) % 5] += "M" + (ux + 11.5 + c * 7.4) + "," + (top + 13 + r * 14) + "h5v9h-5z";
        return h("g", null,
          h("rect", { x: ux, y: top, width: 54, height: 98, rx: 3, fill: u.body }),
          h("rect", { x: ux, y: top + 3, width: 6, height: 95, fill: u.shade }),
          h("rect", { x: ux, y: top, width: 54, height: 6, rx: 3, fill: u.cap }),
          h("rect", { x: ux + 9, y: top + 10, width: 40, height: 45, rx: 2, fill: u.win }),
          h("path", { d: "M" + (ux + 9) + "," + (top + 22) + "h40v3h-40z M" + (ux + 9) + "," + (top + 36) + "h40v3h-40z M" + (ux + 9) + "," + (top + 50) + "h40v3h-40z", fill: u.shade }),
          dCans.map(function (d, k) { return h("path", { d: d, fill: cans[k] }); }),
          h("rect", { x: ux + 9, y: top + 58, width: 40, height: 4.5, rx: 2, fill: u.dark, opacity: 0.55 }),
          h("rect", { x: ux + 34, y: top + 66, width: 14, height: 13, rx: 2, fill: u.dark }),
          h("rect", { x: ux + 38.5, y: top + 70, width: 5, height: 5, rx: 1.5, fill: u.win }),
          h("rect", { x: ux + 9, y: top + 66, width: 21, height: 5, rx: 2, fill: u.shade }),
          h("rect", { x: ux + 9, y: top + 83, width: 38, height: 11, rx: 2, fill: u.dark }),
          h("path", { d: "M" + (ux + 3) + "," + (baseY - 2) + "h9v2h-9z M" + (ux + 42) + "," + (baseY - 2) + "h9v2h-9z", fill: u.dark }));
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
    // scene 01's cartons on the supplier's conveyor; the strip in which they are drawn again over the truck
    // opens only once the truck has all but stopped (nothing stands there then, so nothing shows)
    var supCartons = SupplierCartons(frame), supOver = 58 * clamp01((frame - 56) / 4);
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
    var city = cityWorld();
    // the sky is composed once for the whole film: SKY_WORLD, drawn by CloudField (see the round 3 sky set).
    // It runs on its own clock. While scene 02 holds, the player lets ambient time run on (1.878 s); when
    // the trucks then leave, it hands this scene frame / 30 again, which is that much earlier, and the whole
    // sky would jump back. So from the departure on the sky adds that time back (eased in over frames the
    // site only ever plays with its own clock): clouds, birds and shafts carry straight through the seam.
    var skyK = clamp01((frame - 300) / 91), skyTime = tOverride != null ? tOverride : frame / fps + 1.878 * skyK * skyK * (3 - 2 * skyK);
    return h("div", { style: { position: "absolute", inset: 0, background: "#eaf5fc", overflow: "hidden" } },
      h("div", { style: { position: "absolute", inset: 0, background: DAY.sky } }),
      h("svg", { width: 1920, height: 1080, viewBox: "0 0 1920 1080", xmlns: "http://www.w3.org/2000/svg", style: { position: "absolute", inset: 0 } },
        h("defs", null,
          // scene 01's cartons: under the truck they show from the supplier's left jamb to where the truck's rear stands; over the truck's open door they are cut at its rear plane
          h("clipPath", { id: "wSupLine" }, h("rect", { x: supplierJambX(), y: -2000, width: TRUCK_PARK_1 - supplierJambX(), height: 4000 })),
          h("clipPath", { id: "clipT1" }, h("rect", { x: (truck1X - supOver).toFixed(2), y: -2000, width: Math.max(0, Math.min(truck1X, TRUCK_PARK_1) - truck1X + supOver).toFixed(2), height: 4000 })),
          // the conveyor cartons show from their dock's left jamb on (clipB then cuts them at the truck's rear)
          [0, 1, 2].map(function (i) { return h("clipPath", { id: "wDock" + i }, h("rect", { x: bayWorldX(WAREHOUSE_X, B_SCALE, i), y: -2000, width: 20000, height: 4000 })); }),
          [0, 1, 2].map(function (i) { return h("clipPath", { id: "clipB" + i }, h("rect", { x: -20000, y: -2000, width: 20000 + dockRear(i), height: 4000 })); }),
          HazeDef("wHazeFar", CITY_HAZE[0][0]), HazeDef("wHazeNear", CITY_HAZE[1][0]),
          GlowDef("wSun", DAY.sunGlow, 0.5)
        ),
        SkyAir(),
        // the shafts fan from the sun; the sun sits clear of Tokyo Tower's antenna while scene 1 holds (tower at screen x ~1624 there)
        LightShafts({ cx: 1772, cy: 104, time: skyTime }),
        SkySun({ cx: 1772, cy: 104, time: skyTime, gid: "wSun" }),
        h("g", { transform: "translate(" + (-cam * 0.08) + ", 0)" }, CloudField(SKY_WORLD.far, 0, skyTime, 0)),
        h("g", { transform: "translate(" + (-cam * 0.12) + ", 0)" }, MountainRange({ x: 194, baseY: GROUND, s: 1.4 })),
        h("g", { transform: "translate(" + (-cam * 0.18) + ", 0)" }, CityRow(city.deep, -cam * 0.18)),
        h("g", { transform: "translate(" + (-cam * 0.32) + ", 0)" },
          CloudField(SKY_WORLD.near, 1, skyTime, 0),
          DayBirds({ set: "w", time: skyTime, shift: cam * 0.1, back: cam * 0.32 }),
          CityRow(city.farBack, -cam * 0.32), CityRow(city.far, -cam * 0.32), CityCranes(city.far, skyTime), CityLights(city.farLights, skyTime),
          TokyoTower({ cx: 1560, baseY: GROUND, h: 770, time: time, opacity: 0.95 })
        ),
        CityHaze("wHazeFar", GROUND, 0),
        h("g", { transform: "translate(" + (-cam * 0.52) + ", 0)" },
          CityRow(city.nearBack, -cam * 0.52), CityCranes(city.nearBack, skyTime), CityRow(city.near, -cam * 0.52), CityLights(city.nearLights, skyTime),
          UtilityPoles(-120, 12, 360, GROUND, 176)
        ),
        CityHaze("wHazeNear", GROUND, 1),
        h("g", { transform: "translate(" + (-cam) + ", 0)" },
          // paving with its sunlit edge and tactile strip, the kerb, the carriageway and its markings
          h("rect", { x: -400, y: GROUND, width: WORLD_W + 800, height: 16, fill: DAY.walk }),
          h("rect", { x: -400, y: GROUND, width: WORLD_W + 800, height: 3, fill: DAY.walkLit }),
          h("line", { x1: -400, y1: GROUND + 9.5, x2: WORLD_W + 400, y2: GROUND + 9.5, stroke: DAY.tactile, strokeWidth: 4, strokeDasharray: "16 5" }),
          h("rect", { x: -400, y: GROUND + 16, width: WORLD_W + 800, height: 7, fill: DAY.curb }),
          h("rect", { x: -400, y: GROUND + 20, width: WORLD_W + 800, height: 3, fill: DAY.curbShade }),
          h("rect", { x: -400, y: GROUND + 23, width: WORLD_W + 800, height: 83, fill: DAY.road }),
          h("line", { x1: -400, y1: GROUND + 29, x2: WORLD_W + 400, y2: GROUND + 29, stroke: DAY.roadLine, strokeWidth: 3 }),
          h("line", { x1: -400, y1: GROUND + 64, x2: WORLD_W + 400, y2: GROUND + 64, stroke: DAY.roadDash, strokeWidth: 5, strokeDasharray: "30 34" }),
          h("line", { x1: -400, y1: GROUND + 100, x2: WORLD_W + 400, y2: GROUND + 100, stroke: DAY.roadLine, strokeWidth: 3 }),
          h("rect", { x: -400, y: GROUND + 106, width: WORLD_W + 800, height: 194, fill: DAY.roadEdge }),
          range(11, function (i) { return Streetlight(-180 + i * 470, GROUND); }),
          VendingPair(1300, GROUND),
          FloatingParticles({ seed: "world-a", x: 60, y: 240, width: 1700, height: 560, time: time, count: 24, baseOpacity: 0.4 }),
          FloatingParticles({ seed: "world-b", x: 2050, y: 240, width: 1700, height: 560, time: time, count: 24, baseOpacity: 0.4 }),
          SupplierBuilding({ x: SUPPLIER_X, y: GROUND, scale: B_SCALE, time: skyTime }),
          h("g", { clipPath: "url(#wSupLine)" }, supCartons),
          Warehouse({ x: WAREHOUSE_X, y: GROUND, scale: B_SCALE, shutterOpen: [shutter(0), shutter(1), shutter(2)], time: skyTime }),
          [1, 2].map(function (i) {
            var d = departDelta(i), m = truckMotion(function (f) { return departRun(i, f); }, frame);
            return Truck({ x: dockRear(i) + d, y: GROUND + 34, scale: T_SCALE * 0.97, doorOpen: dockTruckDoor(i), distance: d, bob: m.run * Math.sin(frame * 1.15 + i) * 1.3 + (1 - m.run) * idleBob(i), moving: d > 1, pitch: m.pitch, run: m.run, time: time + i * 1.7 });
          }),
          Truck({ x: truck1X, y: GROUND + 34, scale: T_SCALE, doorOpen: door1, distance: truck1X + 400, bob: truck1Bob, moving: truck1Moving, pitch: truck1M.pitch, run: truck1M.run, time: time }),
          h("g", { clipPath: "url(#clipT1)" }, supCartons),
          // cartons ride the dock conveyors into the three trucks
          DockCartons(frame)
        ),
        // the foreground: a pipe guard rail on the near kerb, the darkest thing in the picture, framing its foot
        h("g", { transform: "translate(" + (-cam * 1.07) + ", 0)" },
          h("rect", { x: -600, y: 1040, width: WORLD_W * 1.1 + 1200, height: 40, fill: DAY.fgBand }),
          h("rect", { x: -600, y: 1040, width: WORLD_W * 1.1 + 1200, height: 4, fill: DAY.fgEdge }),
          h("path", { d: range(30, function (i) { return "M" + (i * 180 - 5) + ",994h10v48h-10z"; }).join(""), fill: DAY.fgRail }),
          h("rect", { x: -600, y: 997, width: WORLD_W * 1.1 + 1200, height: 9, fill: DAY.fgRail }),
          h("rect", { x: -600, y: 997, width: WORLD_W * 1.1 + 1200, height: 3, fill: DAY.fgRailLit }),
          h("rect", { x: -600, y: 1018, width: WORLD_W * 1.1 + 1200, height: 6, fill: DAY.fgRail })
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
    var city = cityTransit();
    var TILE = 7000, GTILE = 2700;
    var wrap = function (v, tile) { return -(((v % tile) + tile) % tile); };
    var convoy = [{ x: 120, scale: 1.8, lag: 0 }, { x: 620, scale: 1.88, lag: 8 }, { x: 1120, scale: 1.8, lag: 16 }, { x: 1600, scale: 1.72, lag: 24 }];
    return h("div", { style: { position: "absolute", inset: 0, background: "#eaf5fc", overflow: "hidden" } },
      h("div", { style: { position: "absolute", inset: 0, background: DAY.sky } }),
      h("svg", { width: 1920, height: 1080, viewBox: "0 0 1920 1080", xmlns: "http://www.w3.org/2000/svg", style: { position: "absolute", inset: 0 } },
        h("defs", null, HazeDef("tHazeFar", CITY_HAZE[0][0]), HazeDef("tHazeNear", CITY_HAZE[1][0]), GlowDef("tSun", DAY.sunGlow, 0.5)),
        SkyAir(),
        LightShafts({ cx: 1795, cy: 88, time: time }),
        SkySun({ cx: 1795, cy: 88, time: time, gid: "tSun" }),
        // the same sky as scenes 01 and 02: one wind, with the road's scroll on top of it as a small parallax
        CloudField(SKY_TRANSIT.far, 0, time, scroll * 0.012),
        CloudField(SKY_TRANSIT.near, 1, time, scroll * 0.035),
        RangeOver({ x: -200, baseY: ROAD_Y, s: 0.95 },
          FujiMountain({ cx: 440, baseY: 742, w: 1480, ht: 596 })
        ),
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
        DayBirds({ set: "t", time: time, shift: scroll * 0.05 }),
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
  /* The airliner, round 4 (2026-11-15): drawn again from a blank page.
     A twin-engined narrow-body in one side elevation, facing right, about 224 px from nose to tail.
     Local units are stage px: +x toward the nose, y down, the tyres stand on y 0 when the plane rests on
     its gear, x 0 is the main gear. Unbranded, our own livery: a cool white fuselage that shades into
     periwinkle, a quiet blue belly, a blue fin and tail cone with one pale band, blue winglets. No
     lettering, no logo, none of Sanpou's colours.
     Back to front: the nose gear and its door, the main gear, the body (fin, fuselage, livery, windows,
     doors, glazing, the wing root fairing, the tailplane), the flaps and their track fairings (they slide
     out from under the wing), the wing, the spoilers, the pylon and the engine.
     What moves, all on the props (nothing here reads the clock):
       ext, nose   how far each leg hangs below its resting length (5 = hanging free, below 0 = squatting)
       tilt        the main bogie's angle to the ground (it hangs tail-low in the air)
       mainFold    0..1: the main legs swing inward into the belly, so from the side they shorten and the
                   wheels turn flat; noseFold 0..1: the nose leg swings forward into its bay; door: its door
       flap        0..1: the flaps run aft and down; spoil 0..1: the spoilers stand up; lamp: the strobe
     The static art is built once and shared by both slots and by scene 03's far-off jet. */
  DAY.planeBody = "#fbfcfe";        // the fuselage: cool white
  DAY.planeBodyShade = "#cfdaee";   // ... turned under, away from the sun (periwinkle)
  DAY.planeBelly = "#7c99c6";       // the belly and the wing root fairing: quiet blue paint
  DAY.planeTail = "#3d68a6";        // the fin, the tail cone, the winglet: the livery's one blue
  DAY.planeTailShade = "#2f548b";
  DAY.planeTailBand = "#93b8e4";    // the pale band across the fin and the tail cone
  DAY.planeWing = "#e3eaf5";        // the wing's upper surface, the tailplane
  DAY.planeWingLit = "#ffffff";     // leading edges in the sun, a spoiler standing up
  DAY.planeWingShade = "#b2c2dd";   // flaps let down, the wing root under the fuselage, the pylon
  DAY.planeSeam = "#a5b5d1";        // panel seams on white
  DAY.planeMetal = "#a9b7cd";       // the engine's lip and exhaust, gear legs, wheel hubs
  DAY.planeMetalLit = "#e1e8f1";
  DAY.planeMetalShade = "#687a9b";
  DAY.planeGlass = "#27395d";       // cabin windows, cockpit glazing
  DAY.planeGlassSky = "#7ea3d6";    // the sky across the top of the cockpit glazing
  DAY.planeTyre = "#18233a";
  DAY.planeLamp = "#b9cdea";        // the strobe's lens at rest (its flash is white)
  DAY.planeSmoke = "#f3f6fb";       // tyre smoke
  DAY.planeSmokeShade = "#d2dcec";
  DAY.planeShadow = "#0a1424";      // the contact shadow on the runway (drawn at low opacity)

  // the spoilers: each [hinge line x0, y0, x1, y1]; the panel reaches 4.6 px aft of it when it lies flat
  var PLANE_SPOIL = [[2.9, -28.4, 0.9, -24.2], [-1.9, -22.2, -15.9, -15.6]];
  var _planeArt = null;
  function planeArt() {
    if (_planeArt) return _planeArt;
    var D = DAY, ink = COLORS.ink, i, d;
    var n2 = function (v) { return Math.round(v * 100) / 100; };
    var rd = function (x, y, w, hh, r) {
      if (!r) return "M" + x + "," + y + "h" + w + "v" + hh + "h" + (-w) + "z";
      var c = "a" + r + "," + r + " 0 0 1 ";
      return "M" + n2(x + r) + "," + y + "h" + n2(w - 2 * r) + c + r + "," + r + "v" + n2(hh - 2 * r) + c + (-r) + "," + r + "h" + n2(2 * r - w) + c + (-r) + "," + (-r) + "v" + n2(2 * r - hh) + c + r + "," + (-r) + "z";
    };
    var F = function (fill, dd) { return h("path", { d: dd, fill: fill }); };
    var FO = function (fill, dd, w) { return h("path", { d: dd, fill: fill, stroke: ink, strokeWidth: w || 1.8, strokeLinejoin: "round" }); };
    var O = function (dd, w, col) { return h("path", { d: dd, fill: "none", stroke: col || ink, strokeWidth: w || 1.8, strokeLinejoin: "round", strokeLinecap: "round" }); };
    var A = {};

    /* ---- the body ---- */
    var FUS = "M84,-24 C98,-24 112,-26.5 117.2,-33 Q118.6,-35.2 117.4,-37.4 C113,-43 104,-47.8 95,-49.8 C91,-50.6 87,-51 82,-51 L-66,-51 L-99,-47.6 Q-106.5,-46.8 -106.5,-44.6 Q-106.5,-42.6 -101,-41.6 C-84,-38.4 -68,-24 -48,-24 Z";
    var FIN = "M-42,-50 Q-55,-51 -60.5,-55.6 L-91.4,-85.6 Q-93.8,-88 -97.4,-88 L-104,-88 Q-108.4,-88 -107.8,-83.8 L-99.5,-46.5 L-60,-46.5 Z";
    var win = "";
    for (i = 0; i < 11; i++) win += rd(n2(59 - 10.2 * i), -43.7, 5, 6.2, 1.8);
    A.body = h("g", null,
      // the fin: blue, one pale band from its root to its tip, the rudder's hinge line
      F(D.planeTail, FIN),
      F(D.planeTailBand, "M-64.8,-51 L-70.8,-51 L-107.3,-86.5 L-105.5,-87.7 L-102.9,-88 Z"),
      O("M-87.6,-50 L-102.8,-86.8", 1.3, D.planeTailShade),
      O(FIN, 1.8),
      FO(D.planeBodyShade, "M27,-50 L33,-50 L30.4,-55.4 L27.6,-55.4 Z", 1.2),                       // a blade aerial on the crown
      // the fuselage: white, its lower third in shade, the belly painted blue
      F(D.planeBody, FUS),
      F(D.planeBodyShade, "M117.2,-33 C112,-26.5 98,-24 84,-24 L-48,-24 C-58,-24 -67,-27.6 -75.6,-31.6 L-79,-36 C-70,-33.6 -62,-33.2 -54,-33.2 L92,-33.2 C103,-33.2 111,-33.1 117.2,-33 Z"),
      F(D.planeBelly, "M106,-26.4 C100,-24.8 92,-24 84,-24 L-48,-24 C-58,-24 -67,-27.6 -75.6,-31.6 L-77.4,-34 C-68,-29.6 -60,-28.4 -52,-28.4 L88,-28.4 C95,-28.4 101,-27.8 106,-26.4 Z"),
      // the livery: the tail cone in the fin's blue, cut on a slant, one pale band ahead of the cut
      F(D.planeTail, "M-54,-51 L-66,-51 L-99,-47.6 Q-106.5,-46.8 -106.5,-44.6 Q-106.5,-42.6 -101,-41.6 C-92.5,-40 -84.3,-35.6 -75.6,-31.6 Z"),
      F(D.planeTailShade, "M-101,-41.6 C-92.5,-40 -84.3,-35.6 -75.6,-31.6 L-71.8,-35.2 C-80,-39 -89,-42.6 -100,-44.8 Z"),
      F(D.planeTailBand, "M-50,-51 L-44.5,-51 L-68.2,-28.5 L-72.2,-30.1 Z"),
      F(D.planeGlass, win + rd(72.4, -43.6, 3.2, 4.2, 1) + rd(-78.4, -44.4, 3.2, 3.8, 1)),          // cabin windows, the windows in the two doors
      O(rd(70, -46.8, 8, 16.5, 2.4), 1.4, D.planeSeam),                                             // the forward door
      O(rd(-80.5, -46.6, 7.5, 12, 2.2), 1.4, D.planeTailBand),                                      // the aft door, on the blue
      // the cockpit glazing: windscreen and side window, the sky across its top, the post between them
      F(D.planeGlass, "M110.4,-41.4 L104.6,-45.2 L93.6,-45.2 Q92,-45.2 92,-43.6 L92,-41.2 Q92,-39.6 93.6,-39.6 L108.2,-39.6 Q110.9,-39.6 110.4,-41.4 Z"),
      F(D.planeGlassSky, "M104.6,-45.2 L93.6,-45.2 Q92,-45.2 92,-43.6 L92,-43 L107.9,-43 Z"),
      O("M101.2,-45.2 L102.6,-39.6", 1.5, D.planeBody),
      O(FUS, 1.8),
      F(D.planeGlass, rd(-107.8, -46.3, 2.6, 3.4, 1.2)),                                            // the exhaust of the unit in the tail
      FO(D.planeBelly, "M58,-26 C52,-20.8 44,-20 34,-20 L-14,-20 C-22,-20 -28,-21.6 -32,-26 Z", 1.6),   // the wing root fairing: the main gear folds away behind it
      FO(D.planeWing, "M-82,-45 L-98,-45.3 L-113,-42.2 L-106,-40.6 Z", 1.5),                    // the tailplane and its elevator's hinge line
      O("M-93.6,-44.6 L-109,-41.7", 1.2, D.planeSeam),
      h("circle", { cx: -99, cy: -83.6, r: 2.1, fill: D.planeLamp })                                // the strobe on the fin
    );

    /* ---- the gear. Nose leg: its pivot is the group's origin, the leg hangs down +y ---- */
    A.noseLeg = [F(D.planeMetalShade, rd(-2.1, -1, 4.2, 12, 1)), h("circle", { cx: 2.7, cy: 7.4, r: 1.6, fill: D.planeMetalLit })];   // the cylinder; the taxi lamp
    A.noseWheels = [
      h("circle", { cx: 1.9, cy: 0, r: 4.6, fill: D.planeTyre }),                                   // the far wheel of the pair
      h("circle", { cx: 0, cy: 0, r: 4.6, fill: D.planeTyre }),
      h("circle", { cx: 0, cy: 0, r: 2, fill: D.planeMetal }),
      h("circle", { cx: 0, cy: 0, r: 0.9, fill: D.planeMetalShade })];
    A.noseDoor = h("path", { d: rd(76.5, 0, 11.5, 6, 1.2), fill: D.planeBodyShade, stroke: ink, strokeWidth: 1.2, strokeLinejoin: "round" });   // hinged on the belly line
    // main leg: the same (the wing hides its top); the bogie's pivot is its own origin
    A.mainLeg = [F(D.planeMetalShade, rd(-2.3, -1, 4.6, 10.5, 1)),
      h("path", { d: rd(2.3, 1.6, 3.8, 8, 1), fill: D.planeBodyShade, stroke: ink, strokeWidth: 1.1, strokeLinejoin: "round" })];   // the cylinder; the door that rides on the leg
    A.bogie = [
      F(D.planeMetalShade, rd(-8, -1.3, 16, 2.6, 1.3)),
      h("circle", { cx: -6.5, cy: 0, r: 5.6, fill: D.planeTyre }), h("circle", { cx: 6.5, cy: 0, r: 5.6, fill: D.planeTyre }),
      F(D.planeMetal, "M-8.9,0a2.4,2.4 0 1 0 4.8,0a2.4,2.4 0 1 0 -4.8,0M4.1,0a2.4,2.4 0 1 0 4.8,0a2.4,2.4 0 1 0 -4.8,0"),
      F(D.planeMetalShade, "M-7.5,0a1,1 0 1 0 2,0a1,1 0 1 0 -2,0M5.5,0a1,1 0 1 0 2,0a1,1 0 1 0 -2,0")];

    /* ---- the flaps and their track fairings: under the wing, they run aft and down together ---- */
    var pod = function (tx, ty) { return "M" + (tx + 4) + "," + n2(ty - 1.6) + "L" + n2(tx - 2.5) + "," + n2(ty - 1.6) + "Q" + (tx - 6) + "," + n2(ty - 1.1) + " " + n2(tx - 6.8) + "," + n2(ty + 0.5) + "Q" + n2(tx - 3.5) + "," + n2(ty + 1.9) + " " + (tx + 4) + "," + n2(ty + 1.8) + "Z"; };
    A.flaps = [
      F(D.planeMetalShade, pod(-9.5, -26.1) + pod(-17.1, -19.7) + pod(-24.7, -15.8)),
      FO(D.planeWingShade, "M-1,-29.2 L-4,-23.4 L-22.2,-14.8 L-27.7,-14.8 L-11,-23.4 L-8.2,-29.2 Z", 1.3)];

    /* ---- the wing: swept and tapered, its tip nearest to us; the wells the spoilers lie in; the winglet ---- */
    var WING = "M40,-30 L-24,-10.5 L-36,-10.5 L-11,-23.4 L-8,-30 Z";
    d = "";
    for (i = 0; i < PLANE_SPOIL.length; i++) { var s = PLANE_SPOIL[i]; d += "M" + s[0] + "," + s[1] + "L" + s[2] + "," + s[3] + "L" + n2(s[2] - 4.6) + "," + s[3] + "L" + n2(s[0] - 4.6) + "," + s[1] + "Z"; }
    A.wing = h("g", null,
      F(D.planeWing, WING),
      F(D.planeWingLit, "M40,-30 L-24,-10.5 L-28.6,-10.5 L32.5,-30 Z"),                                 // the leading edge in the sun
      F(D.planeWingShade, "M38,-30 L-8,-30 L-8.8,-27 L29.2,-27 Z" + d),                             // the fuselage's shade on the root; the spoiler wells
      O("M-1,-29.4 L-4,-23.4 L-22.2,-14.8 L-27.7,-14.8", 1.2, D.planeSeam),                         // where the flaps begin
      O(WING, 1.6),
      FO(D.planeTail, "M-24.6,-10.7 L-36.2,-10.7 L-46,-23.6 L-41.6,-24.4 Z", 1.5));                   // the winglet

    /* ---- the pylon and the engine, slung ahead of the wing ---- */
    var NAC = "M49.6,-17.6 Q50.2,-21 46,-21 L25,-21 Q17.5,-20.6 15,-18 L15,-8.6 Q17.5,-5.6 25,-5 L45.4,-5 Q49.8,-5 49.6,-8.8 Z";
    A.engine = h("g", { transform: "translate(6,0)" },
      FO(D.planeWingShade, "M42,-21 L25,-21 L18,-25 L30,-28.6 Z", 1.4),                           // the pylon
      F(D.planeMetalShade, "M9.5,-15.4 L4.2,-13.3 L9.5,-11.2 Z"),                                   // the exhaust: plug, then the core's nozzle
      FO(D.planeMetal, "M15.4,-17.8 L9.5,-16.2 L9.5,-10.4 L15.4,-8.8 Z", 1.2),
      F(D.planeBody, NAC),
      F(D.planeBodyShade, "M15,-11.6 L49.6,-11.6 L49.6,-8.8 Q49.8,-5 45.4,-5 L25,-5 Q17.5,-5.6 15,-8.6 Z"),
      F(D.planeMetal, "M45.6,-21 Q50.2,-21 49.6,-17.6 L49.6,-8.8 Q49.8,-5 45.6,-5 Z"),              // the intake lip: bare metal
      F(D.planeMetalLit, "M45.6,-21 Q50.2,-21 49.6,-17.6 L49.6,-15.4 L45.6,-15.4 Z"),
      F(D.planeSeam, rd(31.4, -20.6, 1.4, 15.4)),                                                   // where the cowl opens
      O(NAC, 1.6));

    /* ---- on the runway: the contact shadow, the tyre smoke (a burst, and the streak the wheels drag out) ---- */
    A.clip = h("clipPath", { id: "nPlaneRunway" }, h("rect", { x: 22, y: 960, width: 682, height: 36 }));
    A.shadowD = "M-104,0 H112 a2.6,2.6 0 0 1 0,5.2 H-104 a2.6,2.6 0 0 1 0,-5.2 Z";
    A.puff = [
      F(D.planeSmoke, "M-17,0 Q-19,-7 -12,-9.5 Q-13.5,-17 -5,-18.5 Q0.5,-23.5 6.5,-19 Q13.5,-19 13.5,-12 Q19.5,-9 16.5,0 Z"),
      F(D.planeSmokeShade, "M-17,0 Q-19,-7 -12,-9.5 Q-8.5,-4.6 -1,-5.6 Q5,-1.6 16.5,0 Z")];
    A.streak = [
      F(D.planeSmoke, "M0,0 Q-5,-5.6 -15,-4.8 Q-28,-7.4 -43,-3 Q-53,-2.6 -62,0 Z"),
      F(D.planeSmokeShade, "M0,0 Q-14,-2 -30,-1.8 Q-46,-1.2 -62,0 Z")];
    return _planeArt = A;
  }
  function planeSpoilD(sp) {
    var dx = -4.6 + 1.9 * sp, dy = -5.2 * sp, d = "", i, r = function (v) { return Math.round(v * 100) / 100; };
    for (i = 0; i < PLANE_SPOIL.length; i++) { var s = PLANE_SPOIL[i]; d += "M" + s[0] + "," + s[1] + "L" + s[2] + "," + s[3] + "L" + r(s[2] + dx) + "," + r(s[3] + dy) + "L" + r(s[0] + dx) + "," + r(s[1] + dy) + "Z"; }
    return d;
  }
  var _planeCruise = {};
  function JetPlane(p) {
    // scene 03's far-off jet asks for one fixed pose (gear up, clean): built once per opacity
    var fixed = p.mainFold == null && p.gear === 0 && !p.x && !p.y && !p.rot;
    if (fixed && _planeCruise[p.opacity]) return _planeCruise[p.opacity];
    var A = planeArt(), D = DAY, f = function (v) { return String(Math.round(v * 100) / 100); };
    var mainFold = p.mainFold == null ? 1 - (p.gear == null ? 1 : p.gear) : p.mainFold;
    var noseFold = p.noseFold == null ? mainFold : p.noseFold, door = p.door == null ? 1 - mainFold : p.door;
    var rot = p.rot || 0, ext = p.ext == null ? 5 : p.ext, nose = (p.nose == null ? 5 : p.nose) * (1 - noseFold);
    var flap = p.flap || 0, tilt = (p.tilt || 0) - rot, mc = Math.cos(mainFold * 1.536);            // folded: turned 88 degrees away from us
    var node = h("g", { transform: "translate(" + f(p.x) + "," + f(p.y) + ") rotate(" + f(rot) + ")", opacity: p.opacity == null ? 1 : p.opacity },
      h("g", { transform: "translate(82,-25) rotate(" + f(-108 * noseFold) + ")" },
        h("rect", { x: -1.4, y: 10, width: 2.8, height: f(Math.max(0.5, 10.4 + nose)), fill: D.planeMetalLit }),
        A.noseLeg,
        h("g", { transform: "translate(0," + f(20.4 + nose) + ")" }, A.noseWheels)),
      h("g", { transform: "translate(0,-24.4) scale(1," + f(door) + ")" }, A.noseDoor),
      h("g", { transform: "translate(0,-22.5) scale(1," + f(mc) + ")" },
        h("rect", { x: -1.5, y: 8.5, width: 3, height: f(Math.max(0.5, 8.4 + ext)), fill: D.planeMetalLit }),
        A.mainLeg,
        h("g", { transform: "translate(0," + f(16.9 + ext) + ") rotate(" + f(tilt) + ")" }, A.bogie)),
      A.body,
      h("circle", { cx: -99, cy: -83.6, r: 2.1, fill: "#ffffff", opacity: f(p.lamp || 0) }),
      h("g", { transform: "translate(" + f(-6.5 * flap) + "," + f(3 * flap) + ")" }, A.flaps),
      A.wing,
      h("path", { d: planeSpoilD(p.spoil || 0), fill: D.planeWingLit, stroke: D.planeSeam, strokeWidth: 1.1, strokeLinejoin: "round" }),
      A.engine
    );
    if (fixed) _planeCruise[p.opacity] = node;
    return node;
  }

  /* The flight: one 19 s cycle, every value a pure function of the clock.
       0     .. 5.1   final approach: the sink rate eases off in the flare, the nose comes up
       5.1            the main wheels touch at x 330 (aft pair first): the bogie levels, the legs squat past
                      their resting length and come back; the nose is lowered, not dropped
       5.1   .. 8.1   rollout to the stand at x 474: spoilers up, a long soft stop, the nose dips on the brakes
       8.1   .. 9.5   the hold: flaps come up to the take-off setting
       9.5   .. 11.5  the take-off roll: the nose rises, the legs stretch as the wing takes the weight
       11.53          the wheels leave the runway at x 554; the path bends up over PLANE.BLEND px into a
                      straight climb of slope PLANE.SLOPE (29.2 degrees), the pitch leading it a little
       11.9  .. 13.2  the gear folds away; 13.8 .. 15.9 the flaps run in
       17.3  .. 19    off the picture (it has left by the right edge at 17.1)
     x is where the main gear stands; y is the body's origin (see planeArt). back: the plane has passed
     PLANE.HAND and is drawn by the slot behind Tokyo Tower. */
  var PLANE = { T: 19, TD: 5.1, ROLL: 3, HOLD: 1.4, LIFT: 2.03, OUT: 7.8, GY: 968, TDX: 330, STAND: 474, SLOPE: 0.56, BLEND: 120, HAND: 1170, HANG: 5, NOSE_X: 82 };
  function planeSS(a, b, v) { var t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); }
  function planeRun(s) { return PLANE.STAND + 62 * (s * s / 2 - 0.5 * s + 0.25 * (1 - Math.exp(-2 * s))); }   // thrust comes on over half a second, then holds
  PLANE.LIFT_X = planeRun(PLANE.LIFT);
  var PLANE_AWAY = { on: false, back: false, x: -460, y: 820, rot: 0, ext: 5, tilt: -12, nose: 5, mainFold: 0, noseFold: 0, door: 1, flap: 1, spoil: 0, hgt: 400, t2: -1, lamp: 0, opacity: 0 };
  var _planeAt = { time: null, q: null };
  function planeAt(time) {
    if (_planeAt.time === time) return _planeAt.q;                                                 // the two slots ask for the same moment
    var P = PLANE, ss = planeSS, t = ((time % P.T) + P.T) % P.T, tg = t - P.TD, s = tg - P.ROLL - P.HOLD, z, zn;
    var bump = function (v, c, w) { v = (v - c) / w; return Math.exp(-v * v); };
    var q = { on: true, back: false, x: 0, y: 0, rot: 0, ext: P.HANG, tilt: -12, nose: P.HANG, mainFold: 0, noseFold: 0, door: 1, flap: 1, spoil: 0, hgt: 0, t2: -1, lamp: 0, opacity: 1 };
    var HANG_LOW = P.HANG + 6.5 * Math.sin(12 * Math.PI / 180);                                     // how far the aft tyres hang below the body's resting line
    if (tg < 0) {
      // final approach: constant ground speed; sink 26 px/s far out, 9 px/s at the wheels' touch
      var tau = -tg, w = tau / (tau + 0.8); w *= w;
      q.x = P.TDX - 120 * tau;
      q.hgt = 9 * tau + 17 * (tau - (1 - Math.exp(-tau))) + 2.4 * Math.sin(t * 1.9) * w;
      q.rot = -2.2 - 4.3 * Math.exp(-tau * tau / 0.81) + 0.55 * Math.sin(t * 1.3 + 1) * w;
      q.y = P.GY - q.hgt - HANG_LOW;
    } else if (s < 0) {
      // on the runway: z = how far the body stands above its resting height, a damped spring that starts
      // with the approach's sink rate; first the bogie levels, then the legs take it
      var u = Math.min(1, tg / P.ROLL);
      q.x = P.TDX + (P.STAND - P.TDX) * (1 - Math.pow(1 - u, 2.5));
      z = Math.exp(-2.2 * tg) * (HANG_LOW * Math.cos(8 * tg) + (2.2 * HANG_LOW - 9) / 8 * Math.sin(8 * tg));
      q.ext = Math.min(z, P.HANG);
      q.tilt = z > P.HANG ? -Math.asin(Math.min(1, (z - P.HANG) / 6.5)) * 180 / Math.PI : 0;
      q.y = P.GY - z;
      q.rot = -6.5 * (1 - ss(0.12, 1.3, tg))                                                        // the nose is flown down
        + 0.9 * bump(tg, 1.52, 0.26)                                                                // the nose leg takes the weight and gives
        + 0.42 * ss(1.25, 1.9, tg) * (1 - ss(P.ROLL - 0.55, P.ROLL + 0.05, tg))                     // nose-down on the brakes
        - 0.28 * bump(tg, P.ROLL + 0.22, 0.2);                                                      // and the rebound as it stops
      q.spoil = ss(0.12, 0.5, tg) * (1 - ss(2.4, 3.2, tg));
      q.flap = 1 - 0.55 * ss(P.ROLL + 0.1, P.ROLL + P.HOLD - 0.1, tg);
      q.t2 = tg;
      zn = z + P.NOSE_X * Math.sin(-q.rot * Math.PI / 180);
      q.nose = Math.max(-3, Math.min(P.HANG, zn));
    } else if (s < P.OUT) {
      q.x = planeRun(s);
      // the pitch: thrust lifts the nose a touch, the rotation, then it follows the path up (slowly enough that
      // the tail stays 15 px clear of the runway), overshoots a little and settles on the climb angle
      q.rot = -0.45 * ss(0.1, 0.7, s) - 9.6 * ss(1.2, 2.25, s) - 20.6 * ss(2.05, 3.2, s) + 1.4 * ss(3.2, 4.3, s) + 0.3 * Math.sin(time * 0.9) * ss(4.3, 5.4, s);
      if (s < P.LIFT) {
        z = P.HANG * ss(1.2, 2, s);
        q.ext = z; q.tilt = 0; q.y = P.GY - z;
        zn = z + P.NOSE_X * Math.sin(-q.rot * Math.PI / 180);
        q.nose = Math.max(-3, Math.min(P.HANG, zn));
      } else {
        var dd = q.x - P.LIFT_X;
        q.hgt = dd < P.BLEND ? P.SLOPE * dd * dd / (2 * P.BLEND) : P.SLOPE * (dd - P.BLEND / 2);
        q.y = P.GY - P.HANG - q.hgt;
        q.tilt = -12 * ss(P.LIFT, P.LIFT + 0.5, s);
      }
      q.noseFold = ss(2.4, 3.4, s); q.mainFold = ss(2.55, 3.7, s); q.door = 1 - ss(3.3, 3.75, s);       // positive climb: gear up
      q.flap = 0.45 * (1 - ss(4.3, 6.4, s));
      q.back = q.x >= P.HAND;
    } else q = PLANE_AWAY;
    if (q.on) q.lamp = Math.pow(Math.max(0, Math.sin(time * 5.2)), 8);
    _planeAt.time = time; _planeAt.q = q;
    return q;
  }
  var _planeAway = null;
  function planeAway() { return _planeAway || (_planeAway = JetPlane(PLANE_AWAY)); }
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
    // the front slot: the plane from its approach until it has climbed clear of the depot (x < PLANE.HAND),
    // with what it leaves on the runway: its contact shadow and the smoke of the tyres
    var q = planeAt(time), A = planeArt(), P = PLANE, ss = planeSS, f = function (v) { return String(Math.round(v * 100) / 100); };
    var live = q.on && !q.back;
    // the shadow: far to the left and faint while the plane is high, closing on the wheels and darkening as it comes down
    var k = clamp01(q.hgt / 130), sh = live ? 0.3 * Math.pow(1 - k, 1.7) : 0;
    // the smoke, t2 seconds after the wheels touched
    var t2 = q.t2, smoking = t2 >= 0 && t2 < 1.6, e = smoking ? 1 - Math.pow(1 - clamp01(t2 / 1.5), 2.2) : 0;
    var puffO = smoking ? 0.92 * ss(0, 0.07, t2) * (1 - ss(0.3, 1.5, t2)) : 0;
    var sx = smoking ? Math.min(q.x - 6, P.TDX + 54) : P.TDX, len = clamp01((sx - (P.TDX - 8)) / 62);
    var streakO = smoking ? 0.8 * ss(0.02, 0.14, t2) * (1 - ss(0.45, 1.35, t2)) : 0;
    return h("g", null,
      h("defs", null, A.clip),
      h("g", { clipPath: "url(#nPlaneRunway)" },
        h("path", { d: A.shadowD, fill: DAY.planeShadow, opacity: f(sh), transform: "translate(" + f(q.x - 0.7 * q.hgt - 4) + "," + (P.GY + 1.6) + ") scale(" + f(1 + 0.4 * k) + ",1)" })),
      h("g", { transform: "translate(" + f(sx - 9 * ss(0.5, 1.5, t2)) + "," + (P.GY + 1) + ") scale(" + f(Math.max(0.05, len)) + "," + f(0.7 + 1.5 * ss(0.2, 1.4, t2)) + ")", opacity: f(streakO) }, A.streak),
      h("g", { transform: "translate(" + f(P.TDX - 6 - 20 * e) + "," + f(P.GY + 1 - 3 * e) + ") scale(" + f(0.45 + 1.45 * e) + ")", opacity: f(puffO) }, A.puff),
      live ? JetPlane(q) : planeAway()
    );
  }
  function AirportPlaneBack(time) {
    // the back slot: the same plane once it has passed PLANE.HAND, drawn behind Tokyo Tower and the near rows
    var q = planeAt(time);
    return q.on && q.back ? JetPlane(q) : planeAway();
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
    var city = cityFinale();
    return h("div", { style: { position: "absolute", inset: 0, background: "#eaf5fc", overflow: "hidden" } },
      h("div", { style: { position: "absolute", inset: 0, background: DAY.sky } }),
      h("svg", { width: 1920, height: 1080, viewBox: "0 0 1920 1080", xmlns: "http://www.w3.org/2000/svg", style: { position: "absolute", inset: 0 } },
        h("defs", null,
          h("radialGradient", { id: "nHalo" }, h("stop", { offset: "0", stopColor: "rgba(255,255,255,0.22)" }), h("stop", { offset: "0.7", stopColor: "rgba(255,255,255,0.09)" }), h("stop", { offset: "1", stopColor: "rgba(255,255,255,0)" })),
          GlowDef("nSun", DAY.sunGlow, 0.5),
          HazeDef("nHazeFar", CITY_HAZE[0][0]), HazeDef("nHazeNear", CITY_HAZE[1][0])
        ),
        h("g", { opacity: 0.5 - recede * 0.3 },
          
          
        ),
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
        range(30, function (i) {
          var x = random("n-star-x" + i) * 1920, y = 30 + random("n-star-y" + i) * 900;
          var tw = 0.25 + 0.6 * (0.5 + 0.5 * Math.sin(time * (0.5 + random("n-star-t" + i)) + i));
          return h("circle", { cx: x, cy: y, r: 1.4, fill: "rgba(245, 236, 234,0.7)", opacity: 0 });
        }),
        FloatingParticles({ seed: "network", x: 80, y: 120, width: 1760, height: 840, time: time, count: 28, baseOpacity: 0.4 }),
        h("g", { opacity: recede },
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
          h("ellipse", { cx: 960, cy: 1000, rx: 1150, ry: 150, fill: "url(#nHalo)" }),
          CloudField(SKY_FINALE.landFar, 0, time * recede, 0),
          CloudField(SKY_FINALE.landNear, 1, time * recede, 0),
          DayBirds({ set: "n", time: time }),
          FujiMountain({ cx: 380, baseY: 1008, w: 2020, ht: 706, capT: 0.3 }),
          MountainRange({ x: -60, baseY: 1008, s: 0.78 }),
          CityRow(city.far, 0),
          CityHaze("nHazeFar", 1008, 0),
          AirportPlaneBack(time),
          TokyoTower({ cx: 1360, baseY: 1008, h: 840, time: time, opacity: 0.97 }),
          CityRow(city.back, 0), CityCranes(city.back, time), CityRow(city.front, 0), CityLights(city.lights, time),
          CityHaze("nHazeNear", 1010, 1),
          h("circle", { cx: 1652, cy: 136, r: 980, fill: "url(#nSun)", opacity: 0.13 }),
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
      // Scene 04's panel: the sea, over the sky and everything in it while the map is up. It fades on the
      // curve the map leaves on; once the map has gone it is not drawn at all (and its routes stop running).
      // In it, one object that arrives and leaves as the map always did: the water, the land, the map.
      h("div", { style: { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden", background: DAY.map.sea, opacity: (1 - recede).toFixed(3), display: recede < 1 ? "block" : "none" } },
        h("div", { style: { position: "absolute", left: MAP_BOX[0], top: MAP_BOX[1], width: MAP_BOX[2], height: MAP_BOX[3], opacity: mapIn.toFixed(3), transform: "scale(" + ((0.95 + 0.05 * mapIn) * (1 - recede * 0.08)) + ") translate(" + (recede * -36) + "px, " + ((1 - mapIn) * 34) + "px)", transformOrigin: "46% 46%" } },
          MapSwell(time),
          mapLayer(mapShore().land, { willChange: "transform" }),
          h("div", { style: { position: "absolute", left: 0, top: 0, width: "100%", height: "100%" } },
            CoverageMap({ prefProgress: prefK, routeProgress: routeK, pinProgress: pinK, depotFrame: frame, flowTime: recede < 1 ? time : 0, mapIn: mapIn })))),
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

  root.JourneyPort._components.city = { row: cityRow, draw: CityRow, cranes: CityCranes, look: CITY_LOOK, size: SKYLINE_SIZE, world: cityWorld, transit: cityTransit, finale: cityFinale };
  root.JourneyPort.renderMaster = renderMaster;
  root.JourneyPort.mount = mount;
  root.JourneyPort.SCENES = SCENES;
  root.JourneyPort.POSTER_FRAME = DURATION - 1;
  root.JourneyPort._scenes = { world: sceneWorld, transit: sceneTransit, network: sceneNetwork };
})(typeof window !== "undefined" ? window : globalThis);

