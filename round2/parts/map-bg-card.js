/* Map background C — CARD. The map stands on one large white panel with a single flat contact shadow,
   on a slightly deeper ground: the scene becomes a sheet of the company's reporting rather than a view.
   The shadow obeys the film's one shadow rule — hard-edged, flat, down and to the left of the light.
   No gradient and no new def.
   Splice AFTER round2/parts/map-nosky.js. */

//== REPLACE from "        h(\"rect\", { x: 0, y: 0, width: 1920, height: 1080, fill: DAY.map.panel, opacity: (1 - recede).toFixed(3) })," to "        h(\"g\", { opacity: recede },"
        h("g", { opacity: (1 - recede).toFixed(3) },
          h("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: "#e4ebf3" }),
          h("rect", { x: 112, y: 62, width: 1696, height: 972, rx: 26, fill: "rgba(32,58,90,0.10)" }),
          h("rect", { x: 118, y: 54, width: 1696, height: 972, rx: 26, fill: "#fbfdff" })),
