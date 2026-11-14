/* Map background B — LIGHT FROM THE TOP RIGHT. No objects at all: the panel carries the film's one
   light direction, brightening toward the top right exactly where the sun stands in every other scene,
   and cooling into the bottom left where every shadow in this film falls. It ties the chart to the rest
   of the film without putting a landscape back.
   Splice AFTER round2/parts/map-nosky.js. */

//== REPLACE from "          HazeDef(\"nHazeFar\", CITY_HAZE[0][0]), HazeDef(\"nHazeNear\", CITY_HAZE[1][0])" to "        ),"
          HazeDef("nHazeFar", CITY_HAZE[0][0]), HazeDef("nHazeNear", CITY_HAZE[1][0]),
          h("linearGradient", { id: "nMapLight", x1: "1", y1: "0", x2: "0.05", y2: "1" },
            h("stop", { offset: "0", stopColor: "rgba(255,255,255,0.95)" }),
            h("stop", { offset: "0.42", stopColor: "rgba(255,255,255,0.42)" }),
            h("stop", { offset: "1", stopColor: "rgba(120,146,176,0.18)" }))
//== REPLACE from "        h(\"rect\", { x: 0, y: 0, width: 1920, height: 1080, fill: DAY.map.panel, opacity: (1 - recede).toFixed(3) })," to "        h(\"g\", { opacity: recede },"
        h("g", { opacity: (1 - recede).toFixed(3) },
          h("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: DAY.map.panel }),
          h("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: "url(#nMapLight)" })),
