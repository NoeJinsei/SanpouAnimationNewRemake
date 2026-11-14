/* Map background A — SOFT LIFT. The panel keeps one wide pale halo centred behind the map and a gentle
   cool vignette at the edges, so the scene has a middle and a frame without putting any object in it.
   STYLE.md allows a soft gradient as "one pale halo in the sky behind a scene's main subject"; the map
   is that subject. No grid: the owner ruled grid lines behind the map out long ago.
   Splice AFTER round2/parts/map-nosky.js. */

//== REPLACE from "          HazeDef(\"nHazeFar\", CITY_HAZE[0][0]), HazeDef(\"nHazeNear\", CITY_HAZE[1][0])" to "        ),"
          HazeDef("nHazeFar", CITY_HAZE[0][0]), HazeDef("nHazeNear", CITY_HAZE[1][0]),
          h("radialGradient", { id: "nMapLift" },
            h("stop", { offset: "0", stopColor: "rgba(255,255,255,0.95)" }),
            h("stop", { offset: "0.55", stopColor: "rgba(255,255,255,0.55)" }),
            h("stop", { offset: "1", stopColor: "rgba(255,255,255,0)" })),
          h("radialGradient", { id: "nMapVig" },
            h("stop", { offset: "0.52", stopColor: "rgba(126,150,178,0)" }),
            h("stop", { offset: "1", stopColor: "rgba(126,150,178,0.20)" }))
//== REPLACE from "        h(\"rect\", { x: 0, y: 0, width: 1920, height: 1080, fill: DAY.map.panel, opacity: (1 - recede).toFixed(3) })," to "        h(\"g\", { opacity: recede },"
        h("g", { opacity: (1 - recede).toFixed(3) },
          h("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: DAY.map.panel }),
          h("ellipse", { cx: 960, cy: 524, rx: 1040, ry: 600, fill: "url(#nMapLift)" }),
          h("ellipse", { cx: 960, cy: 540, rx: 1340, ry: 820, fill: "url(#nMapVig)" })),
