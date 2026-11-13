//== REPLACE from "     the routes, the depots' fascia line and the head office's card tab." to "     Sequence (all inside the timings the player already drives):"
     the routes and the depots' fascia line.
//== REPLACE from "depots  60-78" to "     Engine: the node list is the same shape on every frame"
       depots  24-80       three miniature Sanpou depots arrive one at a time, head office first. Each
                           pops in larger than it rests (a quick rise, one overshoot under 4 %, a clean
                           settle), is set down onto its own place as it eases to its resting size, and
                           then its name card comes out of it. All three are down and named by frame 80:
                           the frame the player holds, and the frame scene 05 starts from.
     Never frozen while it holds: on all seven corridors the dashes flow outward and a highlight travels
     the whole way. The depots stand still once they are down, as buildings do.
//== REPLACE from "depot: \"#f8fbfd\"" to "// the four neighbours that touch our area"
    // the mini depots: white lit front, periwinkle return, navy slab / base / outline, vermilion fascia
    depotLit: "#fbfdff", depotShade: "#c1cfea", depotFasciaShade: "#bb5340",
    depotBay: "#2c4469", depotShutter: "#b3c2dc", depotGlass: "#8ebfe8", depotGlassLit: "#d2e7f8",
    depotCast: "rgba(19,38,63,0.24)",
    ink: "#13263f",
    card: "#ffffff",
  };
//== REPLACE from "TOKYO: { x: 456.4, y: 791.3, f: 11.5 }, SAITAMA:" to "KANAGAWA: { x: 451.5, y: 830.6, f: 14 }"
    // 埼玉 moved west (it stood where 入間営業所 really is): now in the open part of west Saitama,
    // clear of the routes, the depots, their cards and the 入間 depot while it is enlarged
    TOKYO: { x: 456.4, y: 791.3, f: 11.5 }, SAITAMA: { x: 425.0, y: 733.8, f: 11.5 },
//== REPLACE from "/* The three bases are only 38 map units apart in reality" to "var _mapInit = null;"
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

//== REPLACE from "/* a miniature Sanpou depot: white body with a navy outline" to "function CoverageMap(p) {"
  /* A miniature Sanpou depot, drawn with its base line on y = 0 and centred on x = 0 so it can be scaled
     about its own place. A small version of the warehouse of scene 02: a white volume with a lit front
     and a shaded left return (the return's far edge is foreshortened: lines above eye level fall, lines
     below it rise), a navy roof slab with nothing on it, the vermilion fascia line carried round the
     corner a tone down, dock bays on a navy base course with their shutters rolled half up, one navy
     outline. The head office is wider, has three bays and carries a glazed office floor at its sunlit
     end. Nothing is thinner than 1.9 u (3.1 stage px) at resting size. No lettering.
     Returns { art: the building, cast: its flat shadow on the map, top: height of the main roof }. */
  var _depotMemo = {};
  function MiniDepot(w, hq) {
    var mk = w + "|" + (hq ? 1 : 0);
    if (_depotMemo[mk]) return _depotMemo[mk];
    var C = DAY.map, hw = w / 2, SW = 1.9, SL = 2.25, T = hq ? 11 : 10.6, OV = SW / 2;
    var rw = hq ? 4.4 : 4.2, fx = -hw + rw, eye = -3.3, drop = 1;
    // y of a horizontal line of the front (height y) where it meets x on the return
    var farY = function (y, x) { return y + drop * ((fx - x) / rw) * (y - eye) / (-T - eye); };
    var P = function (a) { return a.map(function (q) { return mr2(q[0]) + "," + mr2(q[1]); }).join(" "); };
    var R = function (x, y, rwd, rh) { return "M" + mr2(x) + "," + mr2(y) + "h" + mr2(rwd) + "v" + mr2(rh) + "h" + mr2(-rwd) + "z"; };
    var yF0 = -T + (hq ? 2.2 : 2), yF1 = yF0 + 2.2, yB = -2.2;
    var bays = hq ? 3 : 2, inner = hw - SW / 2 - fx, pier = 1.9, bw = (inner - pier * (bays + 1)) / bays;
    var dBay = "", dShut = "";
    for (var i = 0; i < bays; i++) {
      var bx = fx + pier + i * (bw + pier);
      dBay += R(bx, yF1, bw, yB - yF1);
      dShut += R(bx, yF1, bw, 1.9);
    }
    var art = [
      h("polygon", { points: P([[fx, 0], [-hw, farY(0, -hw)], [-hw, farY(-T, -hw)], [fx, -T]]), fill: C.depotShade }),
      h("rect", { x: mr2(fx), y: -T, width: mr2(hw - fx), height: T, fill: C.depotLit }),
      h("rect", { x: mr2(fx), y: mr2(yF0), width: mr2(hw - fx), height: 2.2, fill: C.route }),
      h("polygon", { points: P([[fx, yF0], [-hw, farY(yF0, -hw)], [-hw, farY(yF1, -hw)], [fx, yF1]]), fill: C.depotFasciaShade }),
      h("path", { d: dBay, fill: C.depotBay }),
      h("path", { d: dShut, fill: C.depotShutter }),
      h("polygon", { points: P([[hw, 0], [hw, yB], [fx, yB], [-hw, farY(yB, -hw)], [-hw, farY(0, -hw)], [fx, 0]]), fill: C.ink }),
      // the outline: the two walls. The slab closes the top and the base course the bottom, in the same navy.
      h("path", { d: "M" + hw + "," + (-T) + "V0 M" + (-hw) + "," + mr2(farY(0, -hw)) + "V" + mr2(farY(-T, -hw)), fill: "none", stroke: C.ink, strokeWidth: SW }),
      h("polygon", { points: P([[hw + OV, -T], [hw + OV, -T - SL], [fx, -T - SL], [-hw - OV, farY(-T - SL, -hw - OV)], [-hw - OV, farY(-T, -hw - OV)], [fx, -T]]), fill: C.ink }),
    ];
    if (hq) {   // the office floor: a glazed front split by one diagonal reflection, a shaded return, its own slab
      var ox = hw - 9.4, oy = -T - SL, oh = 3.8, gx = ox + SW / 2 + 1.9;
      art.push(
        h("rect", { x: mr2(ox), y: mr2(oy - oh), width: mr2(gx - ox), height: oh, fill: C.depotShade }),
        h("rect", { x: mr2(gx), y: mr2(oy - oh), width: mr2(hw - gx), height: oh, fill: C.depotGlass }),
        h("polygon", { points: P([[gx, oy - oh], [hw, oy - oh], [gx, oy]]), fill: C.depotGlassLit }),   // the sky, as one diagonal
        h("path", { d: "M" + mr2(ox) + "," + mr2(oy) + "V" + mr2(oy - oh) + " M" + hw + "," + mr2(oy) + "V" + mr2(oy - oh), fill: "none", stroke: C.ink, strokeWidth: SW }),
        h("rect", { x: mr2(ox - OV), y: mr2(oy - oh - 2), width: mr2(hw - ox + 2 * OV), height: 2, fill: C.ink })
      );
    }
    // one flat shadow on the map, falling down-left, hard-edged
    var cast = h("polygon", { points: P([[hw + 0.6, 0], [hw - 1.8, 2.9], [-hw - 2.8, 2.9], [-hw - 0.4, 0]]), fill: C.depotCast });
    return _depotMemo[mk] = { art: art, cast: cast, top: T + SL };
  }

//== REPLACE from "MAP_BASES.map(function (b, j) {" to "/* ============================== SCENES"
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
//== REPLACE from "CoverageMap({ prefProgress: prefK, routeProgress: routeK, pinProgress: pinK" to "recede < 0.96 ? h(\"div\", { style: { opacity: 1 - recede"
        CoverageMap({ prefProgress: prefK, routeProgress: routeK, pinProgress: pinK, depotFrame: frame, flowTime: time, mapIn: mapIn })
      ),
