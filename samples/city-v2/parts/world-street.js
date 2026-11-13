//== REPLACE from "          h(\"rect\", { x: -400, y: GROUND, width: WORLD_W + 800, height: 16, fill: DAY.walk })," to "          range(11, function (i) { return Streetlight("
          // paving with its sunlit edge and tactile strip, the kerb, the carriageway and its markings
          h("rect", { x: -400, y: GROUND, width: WORLD_W + 800, height: 16, fill: DAY.walk }),
          h("rect", { x: -400, y: GROUND, width: WORLD_W + 800, height: 3, fill: DAY.walkLit }),
          h("line", { x1: -400, y1: GROUND + 9.5, x2: WORLD_W + 400, y2: GROUND + 9.5, stroke: DAY.tactile, strokeWidth: 4, strokeDasharray: "16 5" }),
          h("rect", { x: -400, y: GROUND + 16, width: WORLD_W + 800, height: 7, fill: DAY.curb }),
          h("rect", { x: -400, y: GROUND + 20, width: WORLD_W + 800, height: 3, fill: DAY.curbShade }),
          h("rect", { x: -400, y: GROUND + 23, width: WORLD_W + 800, height: 83, fill: DAY.road }),
          h("line", { x1: -400, y1: GROUND + 29, x2: WORLD_W + 400, y2: GROUND + 29, stroke: DAY.roadLine, strokeWidth: 3 }),
          h("line", { x1: -400, y1: GROUND + 64, x2: WORLD_W + 400, y2: GROUND + 64, stroke: DAY.roadDash, strokeWidth: 5, strokeDasharray: "30 34" }),
          h("line", { x1: -400, y1: GROUND + 100, x2: WORLD_W + 400, y2: GROUND + 100, stroke: DAY.roadLine, strokeWidth: 3 }),
          h("rect", { x: -400, y: GROUND + 106, width: WORLD_W + 800, height: 194, fill: DAY.roadEdge }),
//== REPLACE from "(-cam * 1.07) + \", 0)\" }," to "      h(\"div\", { style: { opacity: 1 - panK } }"
        // the foreground: a pipe guard rail on the near kerb, the darkest thing in the picture, framing its foot
        h("g", { transform: "translate(" + (-cam * 1.07) + ", 0)" },
          h("rect", { x: -600, y: 1040, width: WORLD_W * 1.1 + 1200, height: 40, fill: DAY.fgBand }),
          h("rect", { x: -600, y: 1040, width: WORLD_W * 1.1 + 1200, height: 4, fill: DAY.fgEdge }),
          h("path", { d: range(30, function (i) { return "M" + (i * 180 - 5) + ",994h10v48h-10z"; }).join(""), fill: DAY.fgRail }),
          h("rect", { x: -600, y: 997, width: WORLD_W * 1.1 + 1200, height: 9, fill: DAY.fgRail }),
          h("rect", { x: -600, y: 997, width: WORLD_W * 1.1 + 1200, height: 3, fill: DAY.fgRailLit }),
          h("rect", { x: -600, y: 1018, width: WORLD_W * 1.1 + 1200, height: 6, fill: DAY.fgRail })
        )
      ),
