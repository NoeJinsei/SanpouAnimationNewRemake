//== REPLACE from "       the answer  what moves on the land. When a corridor's truck reaches its place the whole prefecture" to "     Vermilion is the routes' alone: the dashes, the place dots, the stripe on the trucks that run them"
       the answer  what tells you a truck has arrived. It is on the destination, not on the land: when a
                   corridor's truck stops at its place, the place dot opens into a target (the dot grows
                   and a vermilion ring stands round it), holds while the truck stands there, and closes
                   as the truck goes (MAP_ARRIVE). A prefecture never changes colour: it keeps its own
                   tint from the moment it is wiped in. (Until 2026-11-15 the whole prefecture stepped to
                   white instead. Most of the area is nearly white already, so that step was not read as
                   an arrival: the service area only looked patchy, differently at different moments.)
//== REPLACE from "     Never frozen while it holds: the water travels off both coasts, the prefectures answer their trucks," to "     Engine: the node list is the same shape on every frame; every id is prefixed nm4; the only clips are"
     Never frozen while it holds: the water travels off both coasts, the dashes of all seven corridors
     travel outward, two to five trucks are on the road, and a place dot answers each truck that arrives.
     The depots stand still once they are down, as buildings do.
//== REPLACE from "     nothing behind the map is drawn again while the water moves. A prefecture's answer is a change of" to "  DAY.map = {"
     nothing behind the map is drawn again while the water moves. A place's answer is a change of the two
     circles of its dot, in the map layer that is drawn again every frame anyway for the dashes and the
     trucks: no node is added for it. */
//== REPLACE from "  /* The land answers the trucks. MAP_ANSWER: to = the colour a prefecture steps to when its truck is at its" to "  function CoverageMap(p) {"
  /* The place answers its truck. A place dot is two circles: a white disc (4.8 u) and the vermilion dot on
     it (2.8 u). When the corridor's truck stops, the dot opens into a target:
       the dot    grows to MAP_ARRIVE.dot
       the disc   grows to MAP_ARRIVE.ring and takes a vermilion outline MAP_ARRIVE.line thick, so a ring
                  stands round the dot with a band of white between them (2.6 u; ring 1.9 u: both over
                  the 3 stage px floor). Its outer edge is 7.9 u from the middle: the truck's nose stops
                  at 8.4 u (MAP_TRUCK.stop), so the target never touches the truck.
     Twice the size of the dot at rest (16 u across, about 16 px on a phone), in the route's own colour,
     flat: no glow, nothing that blinks.
     mapArrive(R, time) is how far open the place of corridor R is, 0 to 1, at ambient time `time`. It
     starts to open MAP_ARRIVE.lead seconds before the truck is at rest (the truck is at walking pace by
     then), on the curve the depots arrive on (depotPop: there in 4 frames, one overshoot under 4 %, then
     still), stays open while the truck stands, and closes over the truck's own fade. It is a function of
     the truck's own clock and nothing else, so it repeats with the truck and nothing jumps when that
     clock steps back at scene 05. Tokyo has no corridor and no place dot (the head office is there). */
  var MAP_ARRIVE = { dot: 3.4, ring: 6.95, line: 1.9, lead: 0.1 };
  function mapArrive(R, time) {
    var ph = time - R.dep;
    if (ph < 0) return 0;
    ph = ph % R.every;
    var dn = clamp01((ph - R.run - R.stay) / R.fade);
    return depotPop((ph - R.run + MAP_ARRIVE.lead) * FPS) * (1 - dn * dn * (3 - 2 * dn));
  }
//== REPLACE from "mapAnswerFill(cp, flowTime), stroke: C.seam, strokeWidth: 1.9" to "        routes.map(function (r, i) {"
            h("path", { d: cp.d, fill: mapHeat(cp.heat), stroke: C.seam, strokeWidth: 1.9, strokeLinejoin: "round" }));
        }),
//== REPLACE from "          // casing 4.9 u = 8.0 stage px, dashes 3.2 u = 5.2 px thick, 7.8 u long, 3 u apart: over the 3 px" to "        JRMAP.covered.map(function (cp) {"
          // casing 4.9 u = 8.0 stage px, dashes 3.2 u = 5.2 px thick, 7.8 u long, 3 u apart: over the 3 px
          // floor on a phone. They move outward at laps x pattern / period = 22.9 u a second.
          // The place dot at the corridor's end opens into a target while its truck stands there (ak).
          var ak = mapArrive(mapRuns()[i], flowTime), AR = MAP_ARRIVE;
          return h("g", null,
            h("path", { d: d, fill: "none", stroke: C.routeCase, strokeWidth: 4.9, strokeLinecap: "round", opacity: 0.88 * on }),
            h("path", { d: d, fill: "none", stroke: C.route, strokeWidth: 3.2, strokeLinecap: "round", opacity: on,
              strokeDasharray: MAP_DASH.on + " " + MAP_DASH.off,
              strokeDashoffset: mr2(-((flowTime * MAP_DASH.laps * DP / SWELL.period + i * 3.7) % DP)) }),
            h("circle", { cx: r.end[0], cy: r.end[1], r: mr2((4.8 + (AR.ring - 4.8) * ak) * flow), fill: C.routeCase, stroke: C.route, strokeWidth: mr2(AR.line * ak * flow) }),
            h("circle", { cx: r.end[0], cy: r.end[1], r: mr2((2.8 + (AR.dot - 2.8) * ak) * flow), fill: C.route })
          );
        }),
