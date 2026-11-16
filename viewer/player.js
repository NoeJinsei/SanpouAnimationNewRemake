/* The deterministic player: draws the hero at a given time on the site clock (timeline.js).
 *
 * It is the scrub-able twin of original/js/hero-glue.js: the same layer slots, the same art-directed
 * camera (desktop recentre, phone pan / punch-in) and the same 03 -> 04 dissolve, but every one of them
 * is computed from the time alone, so two players given the same time show the same moment.
 *
 * A renderer is reached through an adapter:
 *   DomAdapter     the original engine (window.JourneyPort: scene functions return virtual nodes,
 *                  JourneyPort.mount patches them into the stage)
 *   CanvasAdapter  a canvas renderer (window.HeroCanvas.scenes.world|transit|network(ctx, frame, time, env)
 *                  paints one 1920x1080 frame in stage units)
 */
(function (root) {
  "use strict";
  var TL = root.HeroTimeline;
  var BASE = "position:absolute;left:0px;top:0px;width:1920px;height:1080px;", HIDE = "display:none";
  var FAM = ["world", "transit", "network"];

  /* ---------------------------------------------------------------- DOM renderer */
  function DomAdapter(JP, fit, stage) {
    var S = JP._scenes;
    // a second stage above the live one holds the outgoing picture of a dissolve
    var over = stage.cloneNode(false); over.removeAttribute("id"); over.style.visibility = "hidden"; fit.appendChild(over);
    function slotted(el) {
      el.style.position = "absolute"; el.style.left = "0"; el.style.top = "0"; el.__slot = {};
      FAM.forEach(function (f) { var s = document.createElement("div"); s.setAttribute("style", HIDE); s.__s = HIDE; el.appendChild(s); el.__slot[f] = s; });
    }
    slotted(stage); slotted(over);
    function setStyle(sl, s) { if (sl.__s !== s) { sl.setAttribute("style", s); sl.__s = s; } }
    function clear(sl) { setStyle(sl, HIDE); if (sl.firstChild) sl.textContent = ""; }
    function put(el, layers) {
      FAM.forEach(function (f) {
        var sl = el.__slot[f], L = null;
        for (var i = 0; i < layers.length; i++) if (layers[i].scene === f) L = layers[i];
        if (!L) { clear(sl); return; }
        setStyle(sl, BASE + (L.opacity != null ? "opacity:" + L.opacity + ";" : "") + (L.style || ""));
        JP.mount(sl, S[f](L.frame, L.time));
      });
    }
    var overOn = false;
    return {
      kind: "dom",
      draw: function (layers, dis) {
        put(stage, layers);
        if (dis) { overOn = true; over.style.visibility = ""; over.style.zIndex = "1"; over.style.opacity = String(dis.opacity); put(over, dis.layers); }
        else if (overOn) { overOn = false; over.style.visibility = "hidden"; over.style.zIndex = ""; over.style.opacity = ""; put(over, []); }
      },
      setTransform: function (tf) { stage.style.transform = tf; over.style.transform = tf; },
      setScale: function () {},
      nodeCount: function () { return stage.getElementsByTagName("*").length; }
    };
  }

  /* ------------------------------------------------------------- canvas renderer */
  function CanvasAdapter(HC, fit, stage) {
    var cv = document.createElement("canvas");
    cv.style.cssText = "position:absolute;left:0;top:0;width:1920px;height:1080px;display:block";
    stage.appendChild(cv);
    var ctx = cv.getContext("2d"), res = 0, tmp = null, tctx = null, env = { width: 1920, height: 1080, res: 1 };
    function setRes(r) {
      r = Math.max(0.5, Math.min(2, Math.round(r * 4) / 4));
      if (r === res) return; res = r; env.res = r;
      cv.width = Math.round(1920 * r); cv.height = Math.round(1080 * r);
      tmp = null;
    }
    function paint(c, L) {
      var fn = HC.scenes && HC.scenes[L.scene];
      c.save(); c.setTransform(res, 0, 0, res, 0, 0);
      if (fn) fn(c, L.frame, L.time == null ? L.frame / 30 : L.time, env);
      else {
        c.fillStyle = "#dfe7ee"; c.fillRect(0, 0, 1920, 1080);
        c.fillStyle = "#56657a"; c.font = "600 34px 'Noto Sans JP', sans-serif"; c.textAlign = "center";
        c.fillText("このシーンはまだ作られていません (" + L.scene + ")", 960, 548);
      }
      c.restore();
    }
    // a layer that is not fully opaque is painted to a scratch canvas first, then laid over as one picture
    function layer(L, alpha) {
      if (alpha >= 1) { paint(ctx, L); return; }
      if (alpha <= 0) return;
      if (!tmp) { tmp = document.createElement("canvas"); tmp.width = cv.width; tmp.height = cv.height; tctx = tmp.getContext("2d"); }
      tctx.setTransform(1, 0, 0, 1, 0, 0); tctx.clearRect(0, 0, tmp.width, tmp.height);
      paint(tctx, L);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = alpha; ctx.drawImage(tmp, 0, 0); ctx.restore();
    }
    setRes(root.devicePixelRatio || 1);
    return {
      kind: "canvas",
      draw: function (layers, dis) {
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
        layers.forEach(function (L) { layer(L, L.opacity == null ? 1 : L.opacity); });
        if (dis) dis.layers.forEach(function (L) { layer(L, (L.opacity == null ? 1 : L.opacity) * dis.opacity); });
      },
      setTransform: function (tf) { stage.style.transform = tf; },
      // sc: css px per stage px. The backing store follows it so the picture stays sharp, within 0.5x..2x.
      setScale: function (sc) { setRes(sc * (root.devicePixelRatio || 1)); },
      nodeCount: function () { return 1; }
    };
  }

  /* ---------------------------------------------------------------------- player */
  // camera numbers from hero-glue.js
  var FOCUS_X = [780, 960, 960, 960, 1250];
  var CAM_M = [
    { x0: 840, y0: 660, z0: 1.10, x1: 1030, y1: 680, z1: 1.18 },
    { x0: 960, y0: 690, z0: 1.12, x1: 1180, y1: 700, z1: 1.16 },
    { x0: 700, y0: 640, z0: 1.10, x1: 1280, y1: 660, z1: 1.14 },
    { x0: 1015, y0: 560, z0: 1.00, x1: 1015, y1: 550, z1: 1.03 },
    { x0: 1300, y0: 600, z0: 1.02, x1: 1240, y1: 610, z1: 1.04 }];
  var CAM_HZ = 60;
  function ease2(p) { return p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }

  var TRUCK_SVG = '<svg width="30" height="16" viewBox="0 0 30 16" fill="none" aria-hidden="true" focusable="false">'
    + '<rect x="0.5" y="0.5" width="18" height="10" rx="1.5" fill="#f7f9fb" stroke="rgba(8,15,22,0.65)"/>'
    + '<rect x="1.5" y="8" width="16" height="2" fill="#e16347"/>'
    + '<path d="M19 3.5h4.6l4.4 4.2v2.8H19Z" fill="#1d2d47"/>'
    + '<path d="M20.4 4.8h2.8l2.4 2.4h-5.2Z" fill="#9fb4cc"/>'
    + '<circle cx="6.5" cy="12.6" r="2.6" fill="#0c1626"/><circle cx="6.5" cy="12.6" r="1" fill="#55657e"/>'
    + '<circle cx="23" cy="12.6" r="2.6" fill="#0c1626"/><circle cx="23" cy="12.6" r="1" fill="#55657e"/>'
    + '</svg>';

  function createPlayer(o) {
    var adapter = o.adapter, host = o.host, fit = o.fit, box = fit.parentElement;
    var boxW = 0, boxH = 0, sc0 = 1, mobT = 0, path = null, lastTf = "", lastSc = "", lastMs = 0, cost = 0;

    // the camera eases toward a target that moves over the dwell (glue camTick). Its position at a time is
    // the result of that easing since the hero started, so the whole path is worked out once per box size.
    function target(idx, dwellMs) {
      var k = CAM_M[idx], p = ease2(Math.max(0, Math.min(1, dwellMs / TL.STOPS[idx].dwell)));
      var mx = k.x0 + (k.x1 - k.x0) * p, my = k.y0 + (k.y1 - k.y0) * p, mz = k.z0 + (k.z1 - k.z0) * p;
      return { x: FOCUS_X[idx] + (mx - FOCUS_X[idx]) * mobT, y: 540 + (my - 540) * mobT, z: 1 + (mz - 1) * mobT };
    }
    // A side whose player moves the camera from scene to scene on a designed ease (round 7: sides.json
    // schedule.camEase = the move's length in ms) is a closed form: from the last framing of the scene before
    // to this scene's own path, eased (the glue's camEase).
    var CAM_MS = o.camEase || 0;
    function camEase(u) {
      var a = 0.3, k = 1 / (a * a * (0.75 + 0.25 * a)); if (u <= 0) return 0; if (u >= 1) return 1;
      return u < a ? k * u * u * u : 1 - (3 * k * a * a / (4 * Math.pow(1 - a, 3))) * Math.pow(1 - u, 4);
    }
    function camEased(ms) {
      ms = Math.max(0, ms);
      var idx = TL.stopAt(ms), tau = ms - TL.START[idx], t = target(idx, tau);
      if (!idx || tau >= CAM_MS) return t;
      var p = target(idx - 1, TL.STOPS[idx - 1].dwell), k = camEase(tau / CAM_MS);
      return { x: p.x + (t.x - p.x) * k, y: p.y + (t.y - p.y) * k, z: p.z + (t.z - p.z) * k };
    }
    function buildPath() {
      var n = Math.ceil(TL.TOTAL / 1000 * CAM_HZ) + 2, dt = 1000 / CAM_HZ, k = Math.min(1, dt / 1000 * 2.6);
      path = new Float32Array(n * 3);
      var c = target(0, 0);
      for (var i = 0; i < n; i++) {
        var ms = Math.min(TL.TOTAL, i * dt), idx = TL.stopAt(ms), t = target(idx, ms - TL.START[idx]);
        if (i) { c.x += (t.x - c.x) * k; c.y += (t.y - c.y) * k; c.z += (t.z - c.z) * k; }
        path[i * 3] = c.x; path[i * 3 + 1] = c.y; path[i * 3 + 2] = c.z;
      }
    }
    function camAt(ms) {
      if (CAM_MS) return camEased(ms);
      var f = Math.max(0, Math.min(TL.TOTAL, ms)) / 1000 * CAM_HZ, i = Math.floor(f), u = f - i, n = path.length / 3;
      var a = Math.min(i, n - 1) * 3, b = Math.min(i + 1, n - 1) * 3;
      return { x: path[a] + (path[b] - path[a]) * u, y: path[a + 1] + (path[b + 1] - path[a + 1]) * u, z: path[a + 2] + (path[b + 2] - path[a + 2]) * u };
    }
    function applyCam(ms) {
      if (!boxW || !path) return;
      var c = camAt(ms), sc = sc0 * c.z;
      var tx = -Math.min(Math.max(c.x * sc - boxW / 2, 0), 1920 * sc - boxW);
      var ty = -Math.min(Math.max(c.y * sc - boxH / 2, 0), 1080 * sc - boxH);
      var tf = "translate(" + tx + "px, " + ty + "px) scale(" + sc + ")";
      if (String(sc) !== lastSc) { lastSc = String(sc); fit.setAttribute("data-scale", sc); adapter.setScale(sc); }
      if (tf !== lastTf) { lastTf = tf; adapter.setTransform(tf); }
    }
    function fitStage() {
      boxW = box.clientWidth || 0; boxH = box.clientHeight || 0; if (!boxW || !boxH) return;
      sc0 = Math.max(boxW / 1920, boxH / 1080);
      mobT = Math.max(0, Math.min(1, (1500 - boxW / sc0) / 880));
      fit.style.width = boxW + "px"; fit.style.height = boxH + "px";
      idxW = idxEl ? idxEl.clientWidth : 0;
      buildPath(); lastTf = ""; lastSc = "";
      seek(lastMs);
    }

    // the site's own controls, shown as they would be at this moment (they do nothing here)
    var items = Array.prototype.slice.call(host.querySelectorAll("#sjxIndex button"));
    var fills = items.map(function (b) { return b.querySelector(".hc-fill"); });
    var idxEl = host.querySelector("#sjxIndex"), truckEl = null, idxW = 0, shown = -1;
    var noEl = host.querySelector("#hcNo"), scEl = host.querySelector("#hcScene"), ldEl = host.querySelector("#hcLead");
    if (idxEl) { truckEl = document.createElement("span"); truckEl.className = "sjx-truck"; truckEl.setAttribute("aria-hidden", "true"); truckEl.innerHTML = o.truckSvg || TRUCK_SVG; idxEl.appendChild(truckEl); }
    var COPY_UNTIL = 0;   // the last scene that still shows the hero copy; same constant as hero-glue.js
    function controls(st) {
      var i = st.idx, frac = Math.min(1, st.tau / TL.STOPS[i].dwell);
      if (i !== shown) {
        shown = i;
        items.forEach(function (b, k) { b.setAttribute("aria-current", k === i ? "true" : "false"); });
        host.classList.toggle("on-map", i === 3);
        host.classList.toggle("on-sign", i === 1 || i === 2);
        host.classList.toggle("copy-out", i > COPY_UNTIL);   // matches hero-glue.js mark()
        var s = TL.STOPS[i];
        if (noEl) noEl.textContent = s.no; if (scEl) scEl.textContent = s.jp; if (ldEl) ldEl.textContent = s.lead;
      }
      fills.forEach(function (f, k) { if (f) f.style.width = k < i ? "100%" : (k === i ? (frac * 100) + "%" : "0%"); });
      if (truckEl && idxW) {
        var liW = (idxW - 32) / 5, x = i * (liW + 8) + liW * frac;
        truckEl.style.transform = "translateX(" + Math.max(0, Math.min(idxW - 30, x)).toFixed(1) + "px)";
      }
    }

    function seek(ms) {
      lastMs = ms;
      var st = TL.stateAt(ms), t0 = performance.now();
      adapter.draw(TL.layersFor(st), TL.dissolveAt(ms));
      cost = performance.now() - t0;
      applyCam(ms); controls(st);
      return cost;
    }

    if (root.ResizeObserver) new ResizeObserver(fitStage).observe(box);
    else root.addEventListener("resize", fitStage);
    fitStage();
    return {
      seek: seek,
      cost: function () { return cost; },
      kind: adapter.kind,
      nodeCount: function () { return adapter.nodeCount(); },
      heroHeight: function () { return host.getBoundingClientRect().height; },
      refit: fitStage
    };
  }

  root.HeroPlayer = { create: createPlayer, DomAdapter: DomAdapter, CanvasAdapter: CanvasAdapter };
})(window);
