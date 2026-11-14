/* Map colour, option C: the ramp kept, but light and narrow.
   Same idea as today — deepest where we deliver most — except both ends move up: the pale end is nearly
   white mint and the deep end stops at a mid teal instead of the near-black #17636f. The gamma is eased
   from 0.75 to 0.68 so the middle prefectures sit a little higher and the steps between neighbours stay
   even. The grey land is lifted and the names move off the near-black navy onto a teal-slate, as in
   option A. Only the fills, the land and the name colour change: the plate, the routes, the depots,
   the cards, the animation and the timings are untouched. */

//== REPLACE from "  DAY.map = {" to "  // the four neighbours that touch our area"
  DAY.map = {
    land: "#e3e8ed",        // the country that is not our service area: light, so the service area leads
    landSeam: "#ccd5dd",    // prefecture lines on that land
    rim: "#5b7489",         // the plate's shaded edge, seen under the silhouette
    cast: "rgba(32,58,90,0.13)", // the one flat contact shadow
    heatLo: [216, 239, 237],// option C: a light, narrow ramp — nearly white mint to a mid teal
    heatHi: [100, 175, 181],
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
  function mapHeat(ht) {
    var lo = DAY.map.heatLo, hi = DAY.map.heatHi, t = Math.pow(ht, 0.68);
    var L = function (i) { return Math.round(lo[i] + (hi[i] - lo[i]) * t); };
    return "rgb(" + L(0) + "," + L(1) + "," + L(2) + ")";
  }
//== REPLACE from "            fontFamily: FONTS.jp, fontWeight: 700, fontSize: L.f, fill: C.ink, opacity: e * 0.92 }, cp.jp);" to "        }),"
            fontFamily: FONTS.jp, fontWeight: 700, fontSize: L.f, fill: C.label, opacity: e * 0.92 }, cp.jp);
