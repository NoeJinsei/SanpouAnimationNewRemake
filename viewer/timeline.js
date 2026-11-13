/* The site clock.
 *
 * original/js/hero-glue.js plays the hero in real time: five stops, each with an entrance motion and an
 * idle that runs until the stop's dwell time is over. This file is the same schedule written as a pure
 * function of one number, the time in ms since the hero started playing, so that two renderers can be
 * shown at exactly the same moment and scrubbed back and forth.
 *
 * Nothing here draws. stateAt(ms) says where the player is; layersFor(state) says which scene functions
 * to call with which frame / ambient time (bottom layer first); dissolveAt(ms) is the outgoing picture
 * of the 03 -> 04 dissolve. The numbers are the glue's own (STOPS, AUTO_DWELL, ENTER_RATE, crossfade).
 */
(function (root) {
  "use strict";
  var FPS = 30, ENTER_RATE = 1.2;
  var STOPS = [
    { no: "01", jp: "入荷", lead: "お預かりした荷物を、丁寧に検品します。", eFrom: 0, eTo: 185, iStart: 185 / 30, sec: true, dwell: 7000 },
    { no: "02", jp: "積込", lead: "行き先ごとに仕分けて、車両に積み込みます。", eFrom: 185, eTo: 391, iStart: 391 / 30, sec: true, dwell: 7600 },
    { no: "03", jp: "輸送", lead: "各拠点を出発し、それぞれの納品先へ向かいます。", eFrom: 391, eTo: 475, iStart: 55, sec: false, dwell: 7200 },
    { no: "04", jp: "配送ネットワーク", lead: "配送エリアは、関東1都6県と新潟市方面です。", eFrom: 0, eTo: 80, iStart: 80 / 30, sec: true, dwell: 6000 },
    { no: "05", jp: "地域とともに", lead: "創業以来、地域の物流を支えてきました。", eFrom: 80, eTo: 174, iStart: 174, sec: false, dwell: 18000 }
  ];
  var START = [], TOTAL = 0;
  STOPS.forEach(function (s) { START.push(TOTAL); TOTAL += s.dwell; });

  function enterMs(i) { var s = STOPS[i]; return (s.eTo - s.eFrom) / (FPS * ENTER_RATE) * 1000; }
  // 01's idle ambient time carries on into 02's entrance (glue: ambOff), so the clouds do not jump back
  var AMB_OFF = (STOPS[0].dwell - enterMs(0)) / 1000;
  // master timeline beats of 03's entrance (hero-port-b.js renderMaster): transit fades in over 420..438
  var TRANSIT_START = 420, SLIDE = 18;
  // the 03 -> 04 dissolve (glue crossfade): opacity 1 for two frames, then .85s cubic-bezier(.2,.6,.2,1)
  var DISSOLVE_LEAD = 1000 / 30, DISSOLVE_MS = 850;

  function stopAt(ms) { var i = STOPS.length - 1; while (i > 0 && ms < START[i]) i--; return i; }

  // where the player is inside stop i, tau ms after the stop began
  function stateIn(i, tau) {
    var s = STOPS[i], em = enterMs(i);
    tau = Math.max(0, Math.min(s.dwell, tau));
    if (tau < em) return { idx: i, tau: tau, mode: "enter", clk: s.eFrom + tau / 1000 * FPS * ENTER_RATE, idle: null };
    return { idx: i, tau: tau, mode: "idle", clk: s.eTo, idle: s.iStart + (tau - em) / 1000 * (s.sec ? 1 : FPS) };
  }
  function stateAt(ms) {
    ms = Math.max(0, Math.min(TOTAL, ms));
    var i = stopAt(ms);
    return stateIn(i, ms - START[i]);
  }

  function master(m) {
    if (m < TRANSIT_START) return [{ scene: "world", frame: m }];
    if (m < TRANSIT_START + SLIDE) {
      var s = (m - TRANSIT_START) / SLIDE;
      return [{ scene: "world", frame: m }, { scene: "transit", frame: m - TRANSIT_START, opacity: s * s * (3 - 2 * s) }];
    }
    return [{ scene: "transit", frame: m - TRANSIT_START }];
  }

  // which scene functions draw this moment: [{scene, frame, time?, opacity?}], bottom layer first.
  // `time` is the ambient clock in seconds when it is not simply frame / 30.
  // Where a side's own player differs from the site's, its sides.json entry says so and the frame page passes
  // it here. holdAmbient02: scene 02's hold runs ambient time on (the site stops it, so its 02 hold is frozen).
  var SCHED = { holdAmbient02: false };
  function setSchedule(o) { for (var k in o) SCHED[k] = o[k]; }

  function layersFor(st) {
    var e = st.mode === "enter";
    switch (st.idx) {
      case 0: return e ? [{ scene: "world", frame: st.clk }] : [{ scene: "world", frame: 185, time: st.idle }];
      case 1: return e ? [{ scene: "world", frame: st.clk, time: st.clk / 30 + AMB_OFF * (391 - st.clk) / 206 }] : [{ scene: "world", frame: 391, time: SCHED.holdAmbient02 ? st.idle : undefined }];
      case 2: return e ? master(st.clk) : [{ scene: "transit", frame: st.idle }];
      case 3: return e ? [{ scene: "network", frame: st.clk }] : [{ scene: "network", frame: 80, time: st.idle }];
      default: return e ? [{ scene: "network", frame: st.clk }] : [{ scene: "network", frame: st.idle }];
    }
  }

  function bezier(x1, y1, x2, y2) {
    return function (x) {
      if (x <= 0) return 0; if (x >= 1) return 1;
      var lo = 0, hi = 1, t = x;
      for (var i = 0; i < 30; i++) {
        var cx = 3 * x1 * t * (1 - t) * (1 - t) + 3 * x2 * t * t * (1 - t) + t * t * t;
        if (Math.abs(cx - x) < 1e-6) break;
        if (cx < x) lo = t; else hi = t;
        t = (lo + hi) / 2;
      }
      return 3 * y1 * t * (1 - t) * (1 - t) + 3 * y2 * t * t * (1 - t) + t * t * t;
    };
  }
  var dissolveEase = bezier(0.2, 0.6, 0.2, 1);
  // the picture that fades out above 04 while it enters: 03's last frame, frozen
  function dissolveAt(ms) {
    if (stopAt(ms) !== 3) return null;
    var tau = ms - START[3];
    if (tau < 0 || tau >= DISSOLVE_LEAD + DISSOLVE_MS) return null;
    var k = tau <= DISSOLVE_LEAD ? 0 : dissolveEase((tau - DISSOLVE_LEAD) / DISSOLVE_MS);
    return { layers: layersFor(stateIn(2, STOPS[2].dwell)), opacity: 1 - k };
  }

  // a short description for the read-out under the scrub bar
  function describe(st) {
    var s = STOPS[st.idx];
    if (st.mode === "enter") return s.no + " " + s.jp + " · moving in · frame " + st.clk.toFixed(1);
    return s.no + " " + s.jp + " · holding · " + (st.tau / 1000 - enterMs(st.idx) / 1000).toFixed(2) + " s";
  }

  root.HeroTimeline = {
    FPS: FPS, ENTER_RATE: ENTER_RATE, STOPS: STOPS, START: START, TOTAL: TOTAL, AMB_OFF: AMB_OFF,
    enterMs: enterMs, stopAt: stopAt, stateIn: stateIn, stateAt: stateAt, layersFor: layersFor,
    dissolveAt: dissolveAt, describe: describe, setSchedule: setSchedule
  };
})(typeof window !== "undefined" ? window : globalThis);
