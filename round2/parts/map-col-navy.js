/* Map colour, navy: the company's own blue: the navy of the trucks, the ink and the city, lightened.
   The green is gone. The covered prefectures run from a near-white tint to a mid tone of this family,
   light enough that one name colour reads on every one of them; the names leave the near-black navy
   #13263f for #2a4a66. The grey land is lifted so the covered area leads, the seam between two covered
   prefectures is pure white, and `panel` is the flat colour the map scene sits on once map-nosky.js
   takes the sky away. Vermilion stays the route's alone.
   Splice with round2/parts/map-flat-plate.js and round2/parts/map-nosky.js. Palette only: no shape,
   no timing and no animation changes. */

//== REPLACE from "  DAY.map = {" to "  // the four neighbours that touch our area"
  DAY.map = {
    panel: "#f3f7fb",     // the flat panel scene 04 sits on, in place of the sky
    land: "#e2e9f1",      // the country that is not our service area
    landSeam: "#ccd7e3",  // prefecture lines on that land
    rim: "#5b7489",         // kept for the name cards' shadow; the plate's own edge is flattened
                            // by map-flat-plate.js
    cast: "rgba(32,58,90,0.13)", // the one flat contact shadow
    heatLo: [216, 232, 247],// covered, least delivered
    heatHi: [104, 152, 199],// covered, most delivered: a mid tone, never a dark one
    seam: "#ffffff",        // the crisp seam between two covered prefectures
    route: "#e16347",       // the route line keeps the brand vermilion
    routeCase: "#ffffff",   // white casing so a route reads over any prefecture tone
    flow: "#ffffff",
    label: "#2a4a66",     // the prefecture names
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
