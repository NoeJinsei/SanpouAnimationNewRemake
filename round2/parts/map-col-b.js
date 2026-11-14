/* Map colour, option B: THREE flat steps instead of a ramp.
   The continuous heat ramp is quantised to three tones — light / mid / deep — so the map reads as a
   designed key (where we deliver most, where we deliver, where we reach) rather than as a gradient.
   The deepest tone is held light enough for one name colour to read on every prefecture. The grey land
   is lifted and the names move off the near-black navy onto a teal-slate, as in option A. Only the
   fills, the land and the name colour change: the plate, the routes, the depots, the cards, the
   animation and the timings are untouched. */

//== REPLACE from "  DAY.map = {" to "  // the four neighbours that touch our area"
  DAY.map = {
    land: "#e3e8ed",        // the country that is not our service area: light, so the service area leads
    landSeam: "#ccd5dd",    // prefecture lines on that land
    rim: "#5b7489",         // the plate's shaded edge, seen under the silhouette
    cast: "rgba(32,58,90,0.13)", // the one flat contact shadow
    heatLo: [210, 236, 234],// option B: the two ends of three steps, quantised in mapHeat below
    heatHi: [88, 163, 171],
    seam: "#ffffff",        // the crisp seam between two covered prefectures
    route: "#e16347",       // the route line keeps the brand vermilion
    routeCase: "#ffffff",   // white casing so a route reads over any prefecture tone
    flow: "#ffffff",
    label: "#2a525e",       // the prefecture names: teal-slate, not the near-black navy
    // the mini depots, flat: one white front, navy roof slab / base course / outline, the vermilion fascia line
    depotLit: "#fbfdff",
    depotBay: "#2c4469", depotShutter: "#b3c2dc", depotGlass: "#8ebfe8", depotGlassLit: "#d2e7f8",
    ink: "#13263f",
    card: "#ffffff",
  };
//== REPLACE from "  function mapHeat(ht) {" to "  var mr1 = function (v)"
  // option B: three steps. 0.00-0.33 light, 0.34-0.66 mid, 0.67-1 deep.
  // On today's data that puts 新潟 light; 茨城 栃木 群馬 千葉 mid; 神奈川 埼玉 東京 deep.
  function mapHeat(ht) {
    var lo = DAY.map.heatLo, hi = DAY.map.heatHi;
    var t = ht >= 0.67 ? 1 : ht >= 0.34 ? 0.5 : 0;
    var L = function (i) { return Math.round(lo[i] + (hi[i] - lo[i]) * t); };
    return "rgb(" + L(0) + "," + L(1) + "," + L(2) + ")";
  }
//== REPLACE from "            fontFamily: FONTS.jp, fontWeight: 700, fontSize: L.f, fill: C.ink, opacity: e * 0.92 }, cp.jp);" to "        }),"
            fontFamily: FONTS.jp, fontWeight: 700, fontSize: L.f, fill: C.label, opacity: e * 0.92 }, cp.jp);
