
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

  /* ---- Truck and Parcel, redrawn for round 2 ----
     A Japanese medium-duty cab-over box truck in side elevation, facing right. Same props, anchor and
     footprint as before: the rear of the cargo box is local x 0, the box is 0..122 x 8..74, the front
     bumper ends near x 177, the tyres stand on local y 98 and the caller's y is local y 96.
     One optional new prop: `time` (seconds). With it a parked truck shows a faint exhaust wisp (the
     engines run at the dock); without it the truck draws exactly the same, minus the wisp.
     Draw order: ground shadow, exhaust, what sits behind the wheels, the wheels, the body. Body bob and
     pitch move the two body groups together and never the wheels. Everything static is built once and
     shared by every truck; the node list has the same shape on every frame. */
  DAY.truckBoxLit = "#ffffff";      // the box: sunlit sheen
  DAY.truckBoxShade = "#dbe4f1";    // the box: white in shade (periwinkle)
  DAY.truckAlu = "#e2e8f1";         // aluminium rails, posts and side guards
  DAY.truckDoor = "#e9eef6";        // rear door panel, seen when it swings open
  DAY.truckSteel = "#8496b0";       // wheels, tank, lock rods
  DAY.truckSteelLit = "#b6c2d3";
  DAY.truckSteelShade = "#55657f";
  DAY.truckCab = "#23344f";         // the cab: navy
  DAY.truckCabLit = "#3d5580";
  DAY.truckCabShade = "#192740";
  DAY.truckFrame = "#1c2840";       // chassis, fenders, mirror
  DAY.truckFrameLit = "#2c3a55";
  DAY.truckTyre = "#151f31";
  DAY.truckTyreLit = "#2b3a52";
  DAY.truckGlass = "#9dbddc";       // glass reflecting the sky
  DAY.truckGlassLit = "#d3e5f5";
  DAY.truckGlassShade = "#6f90b6";  // the seat seen through it
  DAY.truckBumper = "#44546f";
  DAY.truckBumperLit = "#5d6f8d";
  DAY.truckLens = "#f1f5fa";
  DAY.truckStripe2 = "#eda898";     // the thin second stripe (vermilion, paler)
  DAY.truckExhaust = "#edf2f8";
  DAY.truckShadow = "rgba(10,20,36,0.28)"; // one flat shape on the road
  DAY.parcelShade = "#dbe4f1";
  DAY.parcelTapeShade = "#c8523a";

  // a band between two radii, from angle a0 to a1 (degrees, clockwise on screen, 0 = right, -90 = up)
  function arcBand(cx, cy, r0, r1, a0, a1) {
    var q = function (r, a) { var t = a * Math.PI / 180; return (cx + r * Math.cos(t)).toFixed(2) + "," + (cy + r * Math.sin(t)).toFixed(2); };
    var big = a1 - a0 > 180 ? 1 : 0;
    return "M" + q(r1, a0) + " A" + r1 + "," + r1 + " 0 " + big + " 1 " + q(r1, a1) + " L" + q(r0, a1) + " A" + r0 + "," + r0 + " 0 " + big + " 0 " + q(r0, a0) + " Z";
  }
  var TRUCK_WHEELS = [50, 150], TRUCK_WHEEL_R = 11;   // rear (twin tyres: a dished rim), front
  var _truckArt = null;
  function truckArt() {
    if (_truckArt) return _truckArt;
    var ink = COLORS.ink, D = DAY, R = function (x, y, w, hh, fill, rx) { return h("rect", { x: x, y: y, width: w, height: hh, rx: rx || 0, fill: fill }); };
    var holes = function (rad, r) { var d = ""; for (var i = 0; i < 6; i++) { var a = i * Math.PI / 3, cx = Math.cos(a) * rad, cy = Math.sin(a) * rad; d += "M" + (cx - r).toFixed(2) + "," + cy.toFixed(2) + "a" + r + "," + r + " 0 1 0 " + (2 * r) + ",0a" + r + "," + r + " 0 1 0 " + (-2 * r) + ",0"; } return d; };
    var art = {};
    // the ground shadow falls away from the sun: down and to the left
    art.shadow = h("path", { d: "M-13,95.6 L177,95.6 L169,102.2 L-25,102.2 Z", fill: D.truckShadow });
    // behind the wheels: chassis rail, rear bumper bracket, exhaust pipe
    art.back = [
      R(-2.5, 77, 129.5, 5.5, D.truckFrame, 1),
      R(1, 80, 2.2, 4.4, D.truckFrame),
      R(17, 85.6, 20, 3, D.truckSteelShade, 1.5),
      R(14, 85, 5, 4.2, D.truckSteel, 1.2)
    ];
    // wheels: tyre with a lit crescent toward the sun, rim lip; then per axle the face, the turning hand holes, the hub
    art.tyre = [
      h("circle", { r: TRUCK_WHEEL_R, fill: D.truckTyre }),
      h("path", { d: arcBand(0, 0, 8.4, 10.2, -80, 4), fill: D.truckTyreLit }),
      h("circle", { r: 7, fill: D.truckSteelLit })
    ];
    art.face = [h("circle", { r: 5.9, fill: D.truckSteelShade }), h("circle", { r: 5.9, fill: D.truckSteel })];
    art.holes = [h("path", { d: holes(4.5, 0.95), fill: D.truckFrame }), h("path", { d: holes(4.3, 0.95), fill: D.truckSteelShade })];
    art.hub = [
      [h("circle", { r: 2.9, fill: D.truckSteel }), h("circle", { r: 1.35, fill: D.truckSteelLit })],      // rear: dished
      [h("circle", { r: 2.8, fill: D.truckSteelLit }), h("circle", { r: 1.35, fill: D.truckSteelShade })]  // front: proud hub
    ];
    // the body, part 1: under-body gear and the cargo box
    art.frontA = [
      h("path", { d: arcBand(50, 87, 13, 15, -165, -15), fill: D.truckFrame }),           // rear mudguard
      R(34.6, 77, 3.4, 16.4, D.truckTyre, 0.8),                                          // mud flap
      R(69, 77, 1.8, 12, D.truckFrame), R(86, 77, 1.8, 12, D.truckFrame),                 // side guard stays
      R(66, 80.8, 25, 2.3, D.truckAlu, 1), R(66, 86.4, 25, 2.3, D.truckAlu, 1),          // side guard rails
      R(95, 78.6, 24, 12.4, D.truckSteel, 2.6),                                          // fuel tank
      R(95, 78.6, 24, 3.6, D.truckSteelLit, 2.2),
      R(95.6, 87.4, 22.8, 3.2, D.truckSteelShade, 1.6),
      R(99, 78, 2.2, 13.6, D.truckFrame), R(111.6, 78, 2.2, 13.6, D.truckFrame),          // tank straps
      h("rect", { x: 95, y: 78.6, width: 24, height: 12.4, rx: 2.6, fill: "none", stroke: ink, strokeWidth: 1.3 }),
      R(1.5, 74, 121, 3.2, D.truckFrameLit),                                             // body sub-frame
      R(8, 74.3, 5, 2.6, D.marker, 1), R(61, 74.3, 5, 2.6, D.marker, 1), R(111, 74.3, 5, 2.6, D.marker, 1),
      // the box
      R(0, 8, 122, 66, D.truckBox, 2),
      h("path", { d: "M84,12.9 L103,12.9 L87,61 L68,61 Z M108,12.9 L113,12.9 L97,61 L92,61 Z", fill: D.truckBoxLit }),
      R(0, 8, 122, 3.4, D.truckAlu, 2),                                                  // top rail
      R(1.3, 11.4, 119.4, 1.5, D.truckBoxShade),                                         // its shadow
      R(1.3, 12.9, 2.5, 58.3, D.truckBoxShade),                                          // rear post, away from the sun
      R(118.2, 12.9, 2.5, 58.3, D.truckAlu),                                             // front post
      R(0, 61, 122, 6, COLORS.verm),
      R(0, 69.4, 122, 1.8, D.truckStripe2),
      R(1.3, 71.2, 119.4, 1.6, D.truckAlu),                                              // bottom rail
      R(0.6, 8.6, 3.6, 3.6, D.truckSteelLit, 0.6), R(117.8, 8.6, 3.6, 3.6, D.truckSteelLit, 0.6),   // corner castings
      R(0.6, 69.8, 3.6, 3.6, D.truckSteelLit, 0.6), R(117.8, 69.8, 3.6, 3.6, D.truckSteelLit, 0.6),
      R(9, 20, 4, 15, COLORS.verm),
      h("text", { x: 19, y: 30, fontFamily: FONTS.lat, fontSize: 12.5, fontWeight: 800, fill: ink, letterSpacing: 0.4, style: { textRendering: "geometricPrecision" } }, "Sanpou"),
      h("text", { x: 19, y: 42, fontFamily: FONTS.jp, fontSize: 7.5, fontWeight: 700, fill: "rgba(16,31,54,0.55)", letterSpacing: 1.5, style: { textRendering: "geometricPrecision" } }, "三豊運輸"),
      h("rect", { x: 0, y: 8, width: 122, height: 66, rx: 2, fill: "none", stroke: ink, strokeWidth: 2.6 }),
      R(-1.4, 15.5, 2.8, 5.2, D.truckSteel, 0.6), R(-1.4, 36.5, 2.8, 5.2, D.truckSteel, 0.6), R(-1.4, 54, 2.8, 5.2, D.truckSteel, 0.6)   // door hinges
    ];
    // the near rear door, drawn fully open (hinge at x 0, reaching 24 to the right) and flipped behind the box by its group
    art.door = [
      R(0, 13, 24, 58, D.truckBoxShade, 1.2),
      R(2, 15, 20, 54, D.truckDoor),
      R(7.4, 13, 1.8, 58, D.truckSteel), R(16, 13, 1.8, 58, D.truckSteel),               // lock rods
      R(5.8, 45, 5, 2.6, D.truckFrame, 1.2), R(14.4, 45, 5, 2.6, D.truckFrame, 1.2),     // their handles
      R(0, 16.6, 6, 2.2, D.truckSteelShade), R(0, 38.2, 6, 2.2, D.truckSteelShade), R(0, 57.2, 6, 2.2, D.truckSteelShade),
      h("rect", { x: 0, y: 13, width: 24, height: 58, rx: 1.2, fill: "none", stroke: ink, strokeWidth: 1.6 })
    ];
    // the body, part 2: the cab and everything on it
    var shell = "M126,80 L126,26.6 Q126,24.6 128,24.6 L160,24 Q165.4,24 167.2,27.6 L173.4,45.2 Q174.8,46.4 174.8,48.4 L174.8,78 Q174.8,80 172.8,80 L161.2,80 A13.2,13.2 0 0 0 138.8,80 Z";
    art.frontB = [
      R(122.8, 29, 2.6, 48, D.truckFrame),                                               // engine air intake behind the cab
      R(122, 25.4, 4.2, 4.8, D.truckSteelShade, 1.4),
      h("path", { d: shell, fill: D.truckCab }),
      h("path", { d: "M127.3,27.6 L127.3,26.6 Q127.3,25.9 128.2,25.9 L160,25.3 Q163.9,25.3 165.5,27.6 Z", fill: D.truckCabLit }),   // roof edge in the sun
      R(127.3, 27.6, 2.2, 33.4, D.truckCabShade),                                        // back wall, away from the sun
      h("path", { d: "M127.3,61 L173.5,61 L173.5,78.7 L160.3,78.7 A13.2,13.2 0 0 0 139.7,78.7 L127.3,78.7 Z", fill: D.truckCabShade }),   // lower body, turned under
      R(172.2, 48.6, 1.4, 12.4, D.truckCabLit),                                          // front corner catching the sun
      h("path", { d: arcBand(150, 87, 13.2, 15, -148, -32), fill: D.truckFrame }),        // wheel-arch lip
      h("path", { d: "M164.7,28.7 L167.1,28.1 L173,45 L169.7,45 Z", fill: D.truckGlass }),      // the windscreen, seen from its edge
      h("path", { d: "M139.5,29.2 L161.6,29.2 L167.2,45 L139.5,45 Z", fill: D.truckGlass }),    // door window
      h("path", { d: "M146.5,29.2 L154,29.2 L149,45 L141.5,45 Z", fill: D.truckGlassLit }),
      h("path", { d: "M139.5,29.2 L161.6,29.2 L167.2,45 L139.5,45 Z", fill: "none", stroke: ink, strokeWidth: 1.4, strokeLinejoin: "round" }),
      h("path", { d: "M137.4,27.4 L137.4,70.8 L168.8,70.8 L168.8,47.6", fill: "none", stroke: ink, strokeWidth: 1.4, strokeLinejoin: "round", opacity: 0.75 }),   // door seam
      R(140, 50.6, 6.4, 2.4, ink, 1.2),                                                  // door handle
      h("rect", { x: 156.6, y: 51.6, width: 8.6, height: 7.4, rx: 1.2, fill: D.truckGlass, stroke: ink, strokeWidth: 1.3 }),   // safety window, kerb side
      h("path", { d: "M159.4,52.3 L162.4,52.3 L160.4,58.3 L157.4,58.3 Z", fill: D.truckGlassLit }),
      R(131.4, 38, 1.8, 14, D.truckSteelLit, 0.9),                                       // grab handle
      h("path", { d: shell, fill: "none", stroke: ink, strokeWidth: 2.4, strokeLinejoin: "round" }),
      h("line", { x1: 173.9, y1: 46.2, x2: 171.4, y2: 38.6, stroke: ink, strokeWidth: 1.5, strokeLinecap: "round" }),   // wiper at rest
      // roof air deflector
      h("path", { d: "M128.4,24.6 L128.4,11 Q128.4,9.4 130.2,9.5 C146,10.6 158.5,15.4 164.6,24.2 Z", fill: D.truckCab }),
      h("path", { d: "M130.6,10.9 C145.6,12 157.4,16.2 163,23.4 L160.2,23.4 C154.8,17.8 144.8,14.3 130.6,13.4 Z", fill: D.truckCabLit }),
      h("path", { d: "M129.7,23.5 L129.7,16.6 L147,23.5 Z", fill: D.truckCabShade }),
      h("path", { d: "M128.4,24.6 L128.4,11 Q128.4,9.4 130.2,9.5 C146,10.6 158.5,15.4 164.6,24.2 Z", fill: "none", stroke: ink, strokeWidth: 2, strokeLinejoin: "round" }),
      // lamps and bumper
      R(170.6, 56.8, 4.8, 3.2, D.marker, 1),                                             // turn signal
      h("rect", { x: 170.6, y: 60.6, width: 4.8, height: 5.6, rx: 1.2, fill: D.truckLens, stroke: ink, strokeWidth: 1.2 }),   // headlamp
      R(163.4, 66.6, 14.2, 10.4, D.truckBumper, 2.4),
      R(164.4, 67.4, 12.2, 2.2, D.truckBumperLit, 1.1),
      R(164.8, 71.2, 6.4, 3, ink, 1),                                                    // cab step
      h("circle", { cx: 174.2, cy: 73, r: 1.6, fill: D.truckLens }),                       // fog lamp
      h("rect", { x: 163.4, y: 66.6, width: 14.2, height: 10.4, rx: 2.4, fill: "none", stroke: ink, strokeWidth: 1.6 }),
      // mirrors: the tall one on its stays, and the small round one over the front corner
      h("path", { d: "M165.6,31.6 L173,30 M168.2,43 L173,41.6 M168.2,26.6 L175.6,21.8", fill: "none", stroke: ink, strokeWidth: 1.5, strokeLinecap: "round" }),
      h("rect", { x: 172.6, y: 27.6, width: 4.4, height: 15.4, rx: 1.8, fill: D.truckFrame, stroke: ink, strokeWidth: 1.3 }),
      R(173.4, 29.2, 1.5, 12.2, D.truckCabLit, 0.75),
      h("circle", { cx: 176.6, cy: 21, r: 2.3, fill: D.truckFrame, stroke: ink, strokeWidth: 1.3 }),
      // rear end: tail lamp and the end of the under-run bar
      h("rect", { x: -1.8, y: 75.6, width: 3.6, height: 6.4, rx: 1, fill: COLORS.verm, stroke: ink, strokeWidth: 1.2 }),
      R(-3.4, 83.4, 8, 3.4, D.truckBumper, 1)
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
        art.frontA,
        h("rect", { x: 0.4, y: 12.6, width: 2.2, height: 58.8, fill: COLORS.recessed, opacity: e.toFixed(3) }),
        h("g", { transform: "scale(" + (-Math.max(swing, 0.001)).toFixed(4) + ", 1)", opacity: Math.min(1, e * 12).toFixed(3) }, art.door),
        art.frontB)
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
  function Parcel(p) {
    var x = p.x, y = p.y, size = p.size == null ? 38 : p.size, squash = p.squash == null ? 1 : p.squash,
      stretch = p.stretch == null ? 1 : p.stretch, rotation = p.rotation || 0, opacity = p.opacity == null ? 1 : p.opacity,
      shadow = p.shadow || 0, shadowY = p.shadowY;
    var w = size, sx = squash / stretch, sy = stretch / squash, gy = shadowY == null ? y : shadowY;
    return h("g", { opacity: opacity },
      h("ellipse", { cx: x, cy: gy + 2.5, rx: (w * 0.6 + (1 - shadow) * 14) * sx, ry: 4.2, fill: DAY.truckShadow, opacity: shadow.toFixed(3) }),
      h("g", { transform: "translate(" + x + ", " + y + ") rotate(" + rotation + ") scale(" + sx + ", " + sy + ")" }, parcelArt(size))
    );
  }
  /* ---- scenery.tsx ---- */
  var SUPPLIER_W = 364, SUPPLIER_DOCK = { x: 252, y: -22 };
  /* The supplier's building, round 3, flat: a modern office-and-dock unit drawn as ONE straight-on elevation.
     SUPPLIER_W is the width of the part of its front that is measured from the right end (the dock point,
     the ground line and the right end are where they always were, so the truck and the parcels meet it as
     before); the office front runs 32 units further left, over the width its return face used to take.
     SUPPLIER_DOCK is measured from SUPPLIER_X, as before.
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
     Static, so it is built once: one cached group, then the roller shutter as its own node (a motion pass
     can roll it up: the dock's inside is drawn behind it), then the cartons that stand in front of it. */
  var _supMemo = {};
  function SupplierBuilding(p) {
    var x = p.x, y = p.y, scale = p.scale == null ? 1.9 : p.scale, mk = x + "|" + y + "|" + scale;
    if (_supMemo[mk]) return _supMemo[mk];
    var D = DAY, INK = D.supInk, out = [], shut = [], front = [];
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

    /* ---- the dock ---- */
    // inside, behind the shutter: back wall, floor, a rack of stock either side of a clear lane
    out.push(R(228, 184, 104, 72, D.supInside), R(228, 247, 104, 9, D.supInsideFloor));
    fill(out, rd(232, 196, 30, 3) + rd(232, 220, 30, 3) + rd(232, 196, 3, 51) + rd(259, 196, 3, 51) + rd(298, 204, 30, 3) + rd(298, 226, 30, 3) + rd(298, 204, 3, 43) + rd(325, 204, 3, 43), D.supInsideStock);
    fill(out, rd(237, 206, 11, 14) + rd(249, 210, 8, 10) + rd(237, 232, 20, 15) + rd(303, 212, 9, 14) + rd(313, 216, 10, 10) + rd(303, 233, 20, 14), D.supInsidePale);
    // hood and guides
    tone(out, [[222, 176, 116, 8], [222, 184, 6, 72], [332, 184, 6, 72]], D.supFrame, D.supFrameShade);
    // the dock itself: a raised sill with a safety edge, rubber bumpers and the leveller's lip folded down
    out.push(R(220, 256, 124, G - 256, D.supDock), R(220, 256, 124, 3.6, D.supSafety));
    out.push(R(232, 263.5, 10, 11.5, D.supRubber, 1.5), R(318, 263.5, 10, 11.5, D.supRubber, 1.5));
    out.push(R(254, 259.6, 52, 7, D.supSteelBar), R(254, 264.6, 52, 2, D.supSteelBarShade));
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
    // guide posts either side of the dock
    [212.5, 344.5].forEach(function (bx) {
      out.push(h("rect", { x: bx, y: 239, width: 7.4, height: G - 239, rx: 2, fill: D.supSafety, stroke: COLORS.ink, strokeWidth: LINE }));
      fill(out, rd(bx, 248.6, 7.4, 7) + rd(bx, 263, 7.4, 7), COLORS.ink);
    });

    /* ---- its own node: the roller shutter (closed), so a motion pass can roll it up ---- */
    tone(shut, [[228, 184, 104, 66]], D.supSteel, D.supSteelShade);
    (function () {
      var lines = [];
      for (var i = 1; i < 8; i++) lines.push([228, 184 + i * 8.25 - 0.8, 104, 1.6]);
      tone(shut, lines, D.supSteelLine, D.supSteelLineShade);
    })();
    tone(shut, [[228, 250, 104, 6]], D.supSteelBar, D.supSteelBarShade);
    shut.push(R(273, 251.6, 14, 2.8, D.supFrame, 1.4));

    /* ---- in front of it: cartons waiting on the dock; the middle stays clear, the parcels start there ---- */
    front.push(h("g", { transform: "translate(246, 256) scale(" + (1 / scale).toFixed(4) + ")" }, parcelArt(52)));
    carton(front, 296, 236, 26, 20); carton(front, 301, 222, 18, 14);

    return _supMemo[mk] = h("g", { transform: "translate(" + x + ", " + y + ") scale(" + scale + ") translate(" + (-OX) + ", " + (-G) + ")" },
      h("g", { "data-cache": "supplier-" + mk, "data-box": "-44 14 416 274" }, out),
      h("g", null, shut),
      h("g", null, front));
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
    return h("g", { "data-sky": list.id || "" }, list.map(function (c) {
      var wx = ((((c[0] - SKY_X0 - time * SKY_WIND[plane] - shift) % SKY_SPAN) + SKY_SPAN) % SKY_SPAN) + SKY_X0;
      var ed = clamp01(Math.min((wx - SKY_X0) / 60, (SKY_X0 + SKY_SPAN - wx) / 60));
      return h("g", { transform: "translate(" + wx.toFixed(2) + ", " + c[1] + ")", opacity: ed.toFixed(3) }, CloudShape(c[3], c[2], plane === 0));
    }));
  }
  /* Each scene's sky, composed. The owner's rule (2026-11-14): clouds stay in the sky. Every cloud's
     underside clears the roofs standing under it for as long as the scene rests on it, and nothing sits
     down behind the skyline; `node tools/cloud-check.mjs <side>` measures it. So the cumulus that used to
     stand behind the city is gone: each scene has one tall cloud high in a gap between the towers, one or
     two fair-weather clouds, a high streak (it may pass behind Mt Fuji), a thin streak lying across the
     foot of the sun, a scrap or two. No cumulus covers the sun while a scene holds. The lists keep their
     layout (one per line, numbers only): tools/cloud-lift.py rewrites the undersides for a taller city. */
  // composed by hand for the city height the owner picked ("City B"): the towers now reach y 121-126 in
  // scenes 01 and 02, so the tall cloud stands over the low roofs left of them and the streaks keep clear
  var SKY_WORLD = {
    far: [[60, 215, 620, 3], [1560, 90, 560, 4], [66, 330, 96, 6]],
    // (the small cloud that stood by Tokyo Tower in scene 02 is gone: behind the deck it read as a cloud stuck on the tower)
    near: [[696, 345, 230, 0], [135, 262, 450, 1], [1010, 230, 92, 5], [1840, 300, 84, 6]]
  };
  var SKY_TRANSIT = {
    far: [[85, 212, 700, 3], [1585, 112, 560, 4]],
    near: [[930, 370, 250, 0], [-26, 318, 420, 1], [1464, 190, 290, 2], [664, 120, 88, 5]]
  };
  var SKY_FINALE = {
    far: [[78, 372, 680, 3], [1478, 160, 560, 4]],
    near: [[154, 236, 430, 1], [960, 425, 260, 0], [1895, 372, 220, 2], [1500, 262, 88, 6], [644, 250, 92, 5]],
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
    text.push(h("text", { x: 34, y: -179.6, fontFamily: FONTS.lat, fontSize: 27, fontWeight: 800, fill: COLORS.paper, letterSpacing: 0.6 }, CONTENT.brand.nameLat));
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

  /* ---- round 2, scene 04: the 配送ネットワーク map redrawn from a blank page -----------------------
     The map is an OBJECT, not a flat fill: one land silhouette lifted off the sky, with a shaded edge
     under it (the plate's thickness) and a single flat contact shadow down-left of it. Land is one cool
     grey tone; the covered prefectures sit on it in the film's teal family (deepest where we deliver
     most), each separated from its neighbour by a crisp pale seam, so the service area reads as a set of
     real prefecture shapes instead of one orange blob with lines on it. Vermilion is kept scarce: only
     the routes and the depots' fascia line.
     Sequence (all inside the timings the player already drives):
       plate   mapIn 0-26  the silhouette settles, its edge and shadow opening out under it
       prefs   4-56        each prefecture is wiped in by a band growing outward from the hub, in rank
                           order of distance from Itabashi, so the colour spreads like ink from Tokyo
       routes  34-78       seven curved corridors draw from the hub with a long soft landing, then light
                           up with flowing dashes and one travelling highlight each
       depots  24-80       three miniature Sanpou depots arrive one at a time, head office first. Each
                           pops in larger than it rests (a quick rise, one overshoot under 4 %, a clean
                           settle), is set down onto its own place as it eases to its resting size, and
                           then its name card comes out of it. All three are down and named by frame 80:
                           the frame the player holds, and the frame scene 05 starts from.
     Never frozen while it holds: on all seven corridors the dashes flow outward and a highlight travels
     the whole way. The depots stand still once they are down, as buildings do.
     Engine: the node list is the same shape on every frame; every id is prefixed nm4; the only clip is a
     clipPath with one rect child; no masks, filters or blur. */
  DAY.map = {
    land: "#bfcad4",        // the country that is not our service area: one cool grey tone, kept
                            // light so it never competes with the teal of the area we cover
    landSeam: "#a5b2bf",    // prefecture lines on that land
    rim: "#5b7489",         // the plate's shaded edge, seen under the silhouette
    cast: "rgba(32,58,90,0.13)", // the one flat contact shadow
    heatLo: [183, 222, 216],// covered, least delivered: pale sea-foam
    heatHi: [23, 99, 111],  // covered, most delivered: deep teal
    seam: "#eef8f7",        // the crisp seam between two covered prefectures
    route: "#e16347",       // the route line keeps the brand vermilion
    routeCase: "#ffffff",   // white casing so a route reads over any prefecture tone
    flow: "#ffffff",
    // the mini depots, flat: one white front, navy roof slab / base course / outline, the vermilion fascia line
    depotLit: "#fbfdff",
    depotBay: "#2c4469", depotShutter: "#b3c2dc", depotGlass: "#8ebfe8", depotGlassLit: "#d2e7f8",
    ink: "#13263f",
    card: "#ffffff",
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

  /* the plate: silhouette, its shaded edge and its one contact shadow — built once, moved by transform */
  var _mapPlate = null;
  function mapPlate() {
    if (_mapPlate) return _mapPlate;
    var M = mapInit(), C = DAY.map;
    // the eleven land polygons are disjoint, so each layer is ONE path: a third of the nodes to patch
    var all = M.land.join(" ");
    _mapPlate = {
      cast: h("path", { d: all, fill: C.cast }),
      rim: h("path", { d: all, fill: C.rim }),
      land: h("path", { d: all, fill: C.land, stroke: C.landSeam, strokeWidth: 1.1, strokeLinejoin: "round" }),
    };
    return _mapPlate;
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
  function CoverageMap(p) {
    var prefProgress = p.prefProgress, routeProgress = p.routeProgress, pinProgress = p.pinProgress,
      flowTime = p.flowTime, mapIn = p.mapIn == null ? 1 : p.mapIn;
    var M = mapInit(), C = DAY.map, HUB = M.HUB, plate = mapPlate(), routes = mapRoutes();
    var lift = easeOutQuart(clamp01(mapIn));                 // the plate settling into the air
    // No float on the plate: a bob repaints all eleven land polygons every frame and cost 5 fps of the
    // scene's budget when measured, for a 2 px move. The scene is kept alive by the seven corridors
    // (flowing dashes plus a travelling highlight on each) and the three breathing anchor rings instead.
    var rim = 7.2 * lift, castX = -5 * lift, castY = 12 * lift;

    return h("svg", { viewBox: M.bounds.join(" "), width: "100%", height: "100%", style: { overflow: "hidden" } },
      h("defs", null,
        JRMAP.covered.map(function (cp) {
          var nf = M.info[cp.en], k = clamp01((prefProgress - nf.rank * 0.055) * 1.45), grow = bellEase(k) * nf.span;
          return h("clipPath", { id: "nm4w" + nf.rank },
            h("rect", { x: -grow, y: -2400, width: grow * 2, height: 4800,
              transform: "translate(" + HUB.x + "," + HUB.y + ") rotate(" + mr1(nf.deg) + ")" }));
        })
      ),
      h("g", { transform: "translate(" + mr1(castX) + "," + mr1(castY) + ")" }, plate.cast),
      h("g", null,
        h("g", { transform: "translate(0," + mr1(rim) + ")" }, plate.rim),
        h("g", null, plate.land),
        JRMAP.covered.map(function (cp) {
          var nf = M.info[cp.en];
          return h("g", { clipPath: "url(#nm4w" + nf.rank + ")" },
            h("path", { d: cp.d, fill: mapHeat(cp.heat), stroke: C.seam, strokeWidth: 1.9, strokeLinejoin: "round" }));
        }),
        routes.map(function (r, i) {
          var raw = (routeProgress - i * 0.07) * 2.6;
          var draw = easeOutQuart(clamp01(raw)), flow = clamp01((raw - 1) * 2.2);
          var on = Math.min(1, draw * 4), len = r.len;
          var dash = len * (1 - draw);
          var comet = ((flowTime * 0.28 + i * 0.37) % 1) * (len + 34);
          // casing 4.9 u = 8.0 stage px, line 3.2 u = 5.2 px: slim enough to read as one streamline, still
          // over the 3 px floor on a phone. The flow is long soft dashes, not stripes.
          return h("g", null,
            h("path", { d: r.d, fill: "none", stroke: C.routeCase, strokeWidth: 4.9, strokeLinecap: "round",
              opacity: 0.88 * on, strokeDasharray: len + " " + len, strokeDashoffset: dash }),
            h("path", { d: r.d, fill: "none", stroke: C.route, strokeWidth: 3.2, strokeLinecap: "round",
              opacity: on, strokeDasharray: len + " " + len, strokeDashoffset: dash }),
            h("path", { d: r.d, fill: "none", stroke: C.flow, strokeWidth: 3.2, strokeLinecap: "round",
              opacity: flow * 0.26, strokeDasharray: "17 13", strokeDashoffset: -(flowTime * 20 + i * 6) }),
            h("path", { d: r.d, fill: "none", stroke: C.flow, strokeWidth: 3.2, strokeLinecap: "round",
              opacity: flow * 0.6, strokeDasharray: "32 " + mr1(len), strokeDashoffset: mr1(-comet) }),
            h("circle", { cx: r.end[0], cy: r.end[1], r: 4.8 * flow, fill: C.routeCase }),
            h("circle", { cx: r.end[0], cy: r.end[1], r: 2.8 * flow, fill: C.route })
          );
        }),
        JRMAP.covered.map(function (cp) {
          var nf = M.info[cp.en], L = MAP_LABEL[cp.en];
          var k = clamp01((prefProgress - nf.rank * 0.055) * 1.45);
          var e = easeOutQuart(clamp01((k - 0.45) / 0.55));
          return h("text", { x: L.x, y: mr1(L.y + L.f * 0.36 + (1 - e) * 4), textAnchor: "middle",
            fontFamily: FONTS.jp, fontWeight: 700, fontSize: L.f, fill: C.ink, opacity: e * 0.92 }, cp.jp);
        }),
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
                h("circle", { cx: B.x, cy: B.y, r: b.hq ? 0 : mr2(3.9 * dk), fill: C.card }),
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
                  h("rect", { x: vx, y: y0 + 1.9, width: vw, height: CARD_H, rx: 2.4, fill: C.rim }),
                  h("rect", { x: vx, y: y0, width: vw, height: CARD_H, rx: 2.4, fill: C.card }),
                  h("g", { clipPath: "url(#nm4c" + j + ")" },
                    // textLength pins the name's width (9.3 u a character), so it sits the same in its plate at any zoom
                    h("text", { x: x0 + W / 2, y: mr2(y0 + CARD_H / 2 + CARD_F * 0.36), textAnchor: "middle", textLength: mr2(b.nm.length * 9.3), lengthAdjust: "spacing",
                      fontFamily: FONTS.jp, fontWeight: 700, fontSize: CARD_F, fill: C.ink }, b.nm))));
            })
          );
        })()
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
          h("clipPath", { id: "clipT1" }, h("rect", { x: -20000, y: -2000, width: 20000 + truck1X, height: 4000 })),
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
          SupplierBuilding({ x: SUPPLIER_X, y: GROUND, scale: B_SCALE }),
          Warehouse({ x: WAREHOUSE_X, y: GROUND, scale: B_SCALE, shutterOpen: [shutter(0), shutter(1), shutter(2)], time: skyTime }),
          [1, 2].map(function (i) {
            var d = departDelta(i), m = truckMotion(function (f) { return departRun(i, f); }, frame);
            return Truck({ x: dockRear(i) + d, y: GROUND + 34, scale: T_SCALE * 0.97, doorOpen: dockTruckDoor(i), distance: d, bob: m.run * Math.sin(frame * 1.15 + i) * 1.3 + (1 - m.run) * idleBob(i), moving: d > 1, pitch: m.pitch, run: m.run, time: time + i * 1.7 });
          }),
          Truck({ x: truck1X, y: GROUND + 34, scale: T_SCALE, doorOpen: door1, distance: truck1X + 400, bob: truck1Bob, moving: truck1Moving, pitch: truck1M.pitch, run: truck1M.run, time: time }),
          h("g", { clipPath: "url(#clipT1)" },
            [0, 1, 2].map(function (i) {
              var t0 = T_WORLD.parcels[0] + i * 26, t = clamp01((frame - t0) / (carrySpan - 52));
              var pp = parcelPose(t, { x: dock.x, y: dock.y }, door1Target, GROUND);
              if (!pp) return null;
              return Parcel({ x: pp.x, y: pp.y, size: 52, squash: pp.squash, stretch: pp.stretch, rotation: pp.rot, shadow: pp.shadow, shadowY: pp.gy, opacity: pp.op });
            })
          ),
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
      h("div", { style: { position: "absolute", left: 535, top: 12, width: 850, height: 1056, opacity: mapIn * (1 - recede), transform: "scale(" + ((0.95 + 0.05 * mapIn) * (1 - recede * 0.08)) + ") translate(" + (recede * -36) + "px, " + ((1 - mapIn) * 34) + "px)", transformOrigin: "46% 46%", maskImage: "radial-gradient(72% 66% at 48% 50%, rgba(0,0,0,1) 58%, rgba(0,0,0,0.6) 76%, rgba(0,0,0,0) 93%)" } },
        CoverageMap({ prefProgress: prefK, routeProgress: routeK, pinProgress: pinK, depotFrame: frame, flowTime: time, mapIn: mapIn })
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

  root.JourneyPort._components.city = { row: cityRow, draw: CityRow, cranes: CityCranes, look: CITY_LOOK, size: SKYLINE_SIZE, world: cityWorld, transit: cityTransit, finale: cityFinale };
  root.JourneyPort.renderMaster = renderMaster;
  root.JourneyPort.mount = mount;
  root.JourneyPort.SCENES = SCENES;
  root.JourneyPort.POSTER_FRAME = DURATION - 1;
  root.JourneyPort._scenes = { world: sceneWorld, transit: sceneTransit, network: sceneNetwork };
})(typeof window !== "undefined" ? window : globalThis);

