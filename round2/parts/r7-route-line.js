//== REPLACE from "  DAY.roadLine = \"#757b82\"; DAY.roadDash = \"#b9bdc1\";" to "  DAY.fgBand = \"#222a37\";"
  DAY.roadLine = "#757b82"; DAY.roadDash = "#b9bdc1";
  /* The route line (round 7): ONE dashed vermilion line runs through the film. It is the centre line of the
     street in scenes 01 and 02, the lane line of the expressway in scene 03, the seven corridors of the map in
     scene 04, the centre line of the road in the finale, and (on the site) the dashed track the little truck
     rides under the picture. On the roads it is road paint, the colour of the corridors: same dashes, same
     places as the pale line it replaces, nothing added. The edge lines of the roads stay pale. */
  DAY.routeLine = COLORS.verm;
//== REPLACE from "      F(D.roadDash, dash)                                                         // the centre line" to "    ];"
      F(D.routeLine, dash)                                                        // the centre line: the route line
//== REPLACE from "        h(\"line\", { x1: -180, y1: ROAD_Y + 51, x2: 2100, y2: ROAD_Y + 51, stroke: DAY.roadDash," to "        [0, 1].map(function (rep) { return h(\"g\", { transform: \"translate(\" + (xg + rep * GTILE).toFixed(2) + \", 0)\" }, XW.back); }),"
        // the lane line is the route line (see DAY.routeLine)
        h("line", { x1: -180, y1: ROAD_Y + 51, x2: 2100, y2: ROAD_Y + 51, stroke: DAY.routeLine, strokeWidth: 6, strokeDasharray: "72 108", strokeDashoffset: (scroll % 180).toFixed(2) }),
//== REPLACE from "    F(rd, D.roadDash, dash);" to "    F(rd, D.roadEdge, R(0, 1054, 1920, 26));"
    F(rd, D.routeLine, dash);                    // the centre line: the route line
