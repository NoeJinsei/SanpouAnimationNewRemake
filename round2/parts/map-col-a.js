/* Map colour, option A: ONE flat tone for the whole service area.
   No ramp at all — every covered prefecture is the same light teal, told apart only by the white seam
   between them, the way most company service-area maps are drawn. The grey land is lifted too, so it
   stops out-weighing the teal now that the teal is light. Prefecture names move off the near-black navy
   (#13263f) onto a teal-slate (#2a525e), light enough to sit on the map and dark enough to read on the
   palest prefecture. Only the fills, the land and the name colour change: the plate, the routes, the
   depots, the cards, the animation and the timings are untouched. */

//== REPLACE from "  DAY.map = {" to "  // the four neighbours that touch our area"
  DAY.map = {
    land: "#e3e8ed",        // the country that is not our service area: light, so the service area leads
    landSeam: "#ccd5dd",    // prefecture lines on that land
    rim: "#5b7489",         // the plate's shaded edge, seen under the silhouette
    cast: "rgba(32,58,90,0.13)", // the one flat contact shadow
    heatLo: [141, 200, 202],// option A: lo and hi are the same, so every covered prefecture is one tone
    heatHi: [141, 200, 202],
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
//== REPLACE from "            fontFamily: FONTS.jp, fontWeight: 700, fontSize: L.f, fill: C.ink, opacity: e * 0.92 }, cp.jp);" to "        }),"
            fontFamily: FONTS.jp, fontWeight: 700, fontSize: L.f, fill: C.label, opacity: e * 0.92 }, cp.jp);
