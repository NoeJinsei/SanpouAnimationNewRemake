/* Scene 04 look, OPTION 3 "working line" (option frame, not polished).
   A pale neutral panel in place of the sky, the map in the company's navy family as the floor had it
   (map-col-navy + map-flat-plate + map-nosky, folded in here), and behind the map, on the clean
   right-hand side only, two long roller conveyors in side elevation carrying a spaced line of plain
   cartons outward. Pale two-tone, no vermilion, no rollers drawn as rows of dots.
   Build: sh tools/build-side.sh trial3 round2/parts/r4-map-opt-working-line.js */

//== REPLACE from "  DAY.map = {" to "  // the four neighbours that touch our area"
  DAY.map = {
    panel: "#f1f5fa",     // the flat panel scene 04 sits on, in place of the sky
    land: "#e0e8f1",      // the country that is not our service area
    landSeam: "#c9d5e2",  // prefecture lines on that land
    rim: "#5b7489",       // kept for the name cards' shadow only
    cast: "rgba(32,58,90,0.10)", // the one flat contact shadow
    heatLo: [205, 224, 244],// covered, least delivered
    heatHi: [84, 134, 190], // covered, most delivered: a mid tone, never a dark one
    seam: "#ffffff",        // the crisp seam between two covered prefectures
    route: "#e16347",       // the route line keeps the brand vermilion
    routeCase: "#ffffff",   // white casing so a route reads over any prefecture tone
    flow: "#ffffff",
    label: "#27476a",     // the prefecture names
    depotLit: "#fbfdff",
    depotBay: "#2c4469", depotShutter: "#b3c2dc", depotGlass: "#8ebfe8", depotGlassLit: "#d2e7f8",
    ink: "#13263f",
    card: "#ffffff",
    // the working line
    lineBed: "#d3deeb", lineBedLit: "#e9f0f7", lineLeg: "#bccadc",
    box: "#ffffff", boxShade: "#dce6f2", boxTape: "#bccadc", boxEdge: "#aebdd2",
  };
//== REPLACE from "  function mapHeat(ht) {" to "  var mr1 = function (v)"
  function mapHeat(ht) {
    var lo = DAY.map.heatLo, hi = DAY.map.heatHi, t = Math.pow(ht, 0.68);
    var L = function (i) { return Math.round(lo[i] + (hi[i] - lo[i]) * t); };
    return "rgb(" + L(0) + "," + L(1) + "," + L(2) + ")";
  }
//== REPLACE from "      rim: h(\"path\", { d: all, fill: C.rim })," to "      land: h(\"path\", { d: all, fill: C.land,"
      rim: h("path", { d: all, fill: C.landSeam }),
//== REPLACE from "            fontFamily: FONTS.jp, fontWeight: 700, fontSize: L.f, fill: C.ink, opacity: e * 0.92 }, cp.jp);" to "        }),"
            fontFamily: FONTS.jp, fontWeight: 700, fontSize: L.f, fill: C.label, opacity: e * 0.92 }, cp.jp);
//== INSERT before "  /* ============================== SCENES ============================== */"
  /* one roller conveyor in side elevation, from x0 off the right edge, its top at y; plain cartons ride
     it outward. The bed and its legs are built once; only the cartons' group moves. */
  var _mapLine = {};
  function MapLine(time, x0, y, speed, phase) {
    var C = DAY.map, key = x0 + "|" + y, GAP = 236, BW = 58, BH = 46;
    if (!_mapLine[key]) {
      var legs = "";
      for (var lx = x0 + 70; lx < 1940; lx += 210) legs += "M" + (lx - 5) + "," + (y + 16) + "h10v74h-10z M" + (lx - 16) + "," + (y + 86) + "h32v8h-32z";
      _mapLine[key] = {
        bed: h("g", null,
          h("path", { d: legs, fill: C.lineLeg }),
          h("rect", { x: x0, y: y, width: 1960 - x0, height: 18, rx: 4, fill: C.lineBed }),
          h("rect", { x: x0 + 3, y: y + 3, width: 1954 - x0, height: 5, rx: 2.5, fill: C.lineBedLit })),
        box: h("g", null,
          h("rect", { x: 0, y: -BH, width: BW, height: BH, rx: 3, fill: C.box, stroke: C.boxEdge, strokeWidth: 2 }),
          h("rect", { x: BW - 15, y: -BH + 1, width: 14, height: BH - 2, fill: C.boxShade }),
          h("rect", { x: 20, y: -BH + 1, width: 9, height: BH - 2, fill: C.boxTape })),
      };
    }
    var L = _mapLine[key], n = Math.ceil((1960 - x0) / GAP) + 1, off = ((time * speed + phase) % GAP + GAP) % GAP;
    return h("g", null,
      L.bed,
      h("g", { transform: "translate(" + (x0 + off).toFixed(2) + "," + y + ")" },
        range(n, function (i) { return h("g", { transform: "translate(" + (i * GAP) + ",0)" }, L.box); })));
  }
//== INSERT before "        h(\"g\", { opacity: recede },"
        h("g", { opacity: (1 - recede).toFixed(3) },
          h("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: DAY.map.panel }),
          MapLine(time, 1180, 392, 64, 0),
          MapLine(time, 1196, 706, 64, 118)),
