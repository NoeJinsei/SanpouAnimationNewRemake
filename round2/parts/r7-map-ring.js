//== REPLACE from "  var MAP_ARRIVE = { dot: 3.4, ring: 6.95, line: 1.9, lead: 0.1 };" to "  function mapArrive(R, time) {"
  /* open (round 7): a place whose dot stands on its own name gets an OPEN ring: [where it starts, how far
     round it goes], in degrees, clockwise from east. Kanagawa's dot is on the last stroke of 川 (the dot's
     place and the name's place are both closed), so its ring is drawn from ten o'clock round by the top
     and the right to five o'clock, the side the truck arrives on, and left out where it would cross the
     name: no line of the ring crosses a stroke of a character. Every other place has a whole ring. */
  var MAP_ARRIVE = { dot: 3.4, ring: 6.95, line: 1.9, lead: 0.1, open: { KANAGAWA: [208, 214] } };
//== REPLACE from "          var ak = mapArrive(mapRuns()[i], flowTime), AR = MAP_ARRIVE;" to "          var nf = M.info[cp.en], L = MAP_LABEL[cp.en];"
          var ak = mapArrive(mapRuns()[i], flowTime), AR = MAP_ARRIVE, rr = (4.8 + (AR.ring - 4.8) * ak) * flow;
          var gap = AR.open[r.en], round = 2 * Math.PI * rr;
          return h("g", null,
            h("path", { d: d, fill: "none", stroke: C.routeCase, strokeWidth: 4.9, strokeLinecap: "round", opacity: 0.88 * on }),
            h("path", { d: d, fill: "none", stroke: C.route, strokeWidth: 3.2, strokeLinecap: "round", opacity: on,
              strokeDasharray: MAP_DASH.on + " " + MAP_DASH.off,
              strokeDashoffset: mr2(-((flowTime * MAP_DASH.laps * DP / SWELL.period + i * 3.7) % DP)) }),
            h("circle", { cx: r.end[0], cy: r.end[1], r: mr2(rr), fill: C.routeCase, stroke: C.route, strokeWidth: mr2(AR.line * ak * flow),
              strokeDasharray: gap ? mr2(round * gap[1] / 360) + " " + mr2(round + 1) : null,
              transform: gap ? "rotate(" + gap[0] + " " + r.end[0] + " " + r.end[1] + ")" : null }),
            h("circle", { cx: r.end[0], cy: r.end[1], r: mr2((2.8 + (AR.dot - 2.8) * ak) * flow), fill: C.route })
          );
        }),
        JRMAP.covered.map(function (cp) {
