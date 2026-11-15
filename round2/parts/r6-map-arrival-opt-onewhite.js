//== REPLACE from "fill: mapHeat(cp.heat), stroke: C.seam, strokeWidth: 1.9" to "        routes.map(function (r, i) {"
            // OPTION, NOT THE PICK (2026-11-15), for the owner to compare: the whole service area one flat
            // white (the top of the map's own scale), in place of a tint for each prefecture that is
            // whiter the more we deliver there. Applied on top of r6-map-arrival.js; nothing else changes.
            h("path", { d: cp.d, fill: "#ffffff", stroke: C.seam, strokeWidth: 1.9, strokeLinejoin: "round" }));
        }),
