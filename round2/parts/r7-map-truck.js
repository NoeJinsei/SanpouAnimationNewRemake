//== REPLACE from "  /* The map truck, SEEN FROM ABOVE, pointing right (+x), drawn about its own centre: 18 u long, 9 u wide" to "  /* Each corridor measured for its truck, once."
  /* The map truck, SEEN FROM ABOVE, pointing right (+x), drawn about its own centre (round 7, 2026-11-15).
     The steering of round 6 stays; the drawing is new, because at 18 x 9 u it read as a pill with a dark
     end, not as a truck. It is the only thing that moves on the map, so it is drawn out of scale, as a map
     icon is: MAP_TRUCK.k times the old length (1.5: 27 u long, 44 stage px, about 29 px on a phone).
     What makes it a truck, each part big enough to be seen on a phone (nothing under 1.9 u = 3 stage px):
       the box      a long white roof inside one navy outline, the vermilion stripe across its front end
       the gap      1.95 u of open ground between the box and the cab, bridged by the narrow chassis
       the cab      navy, 1.9 u narrower than the box on each side, its front corners cut; the pale
                    windscreen sits at its nose, so the short dark end with the light in it is the front
       the wheels   four navy tyres: the rear pair stands 1.9 u out beyond the box, the front pair 1.9 u
                    out beside the narrower cab, behind the windscreen, in line with the box's sides
       the shadow   the same outline in flat navy, a little down and to the left of the truck whichever
                    way the truck points (the sun is top right): it lifts the white box off the white land
     Drawn in the units of the old truck (d: 18 long) and multiplied by k. Four nodes, built once and shared
     by every truck, plus one node each for its shadow.
     MAP_TRUCK: k = its size; hx / hy = half its length and width; axle = its front axle, ahead of its
     centre; base = from that axle back to the rear axle; stop = how far from the middle of the place dot
     its nose stops (the open target's edge is 7.9 u out, so the two never touch); from / north / join =
     where it starts, under the head office (right of and below the hub: `north` is the drop for a corridor
     that leaves upwards), and how far it has run when it is on its corridor's line; show = between which
     distances run it comes up from nothing (it is longer than the head office is wide, so it comes up as
     it pulls out from under the building, not behind it); cast = where its shadow lies, in map units. */
  var MAP_TRUCK = { k: 1.5, stop: 8.4, from: [2.5, 6.4], north: 3, join: 16, show: [0.5, 8], cast: [-1.3, 2.3], shade: 0.24 };
  MAP_TRUCK.hx = 9 * MAP_TRUCK.k; MAP_TRUCK.hy = 4.94 * MAP_TRUCK.k; MAP_TRUCK.axle = 4.55 * MAP_TRUCK.k; MAP_TRUCK.base = 9.95 * MAP_TRUCK.k;
  var _mapTruck = null;
  function MiniTruck() {
    if (_mapTruck) return _mapTruck;
    var C = DAY.map, k = MAP_TRUCK.k, n = function (v) { return mr2(v * k); };
    var R = function (x0, y0, x1, y1) { return "M" + n(x0) + "," + n(y0) + "H" + n(x1) + "V" + n(y1) + "H" + n(x0) + "Z"; };
    // everything navy as one outline: the box, the chassis in the gap, the cab, the two axles' tyres
    var d = R(-9, -3.67, 1.8, 3.67) + R(1.8, -1.3, 3.1, 1.3)
      + "M" + n(3.1) + "," + n(-2.4) + "H" + n(8.3) + "L" + n(9) + "," + n(-1.7) + "V" + n(1.7) + "L" + n(8.3) + "," + n(2.4) + "H" + n(3.1) + "Z"
      + R(-6.85, -4.94, -3.95, 4.94) + R(3.3, -3.67, 5.8, 3.67);
    return _mapTruck = { d: d, art: [
      h("path", { d: d, fill: C.ink }),
      h("rect", { x: n(-7.73), y: n(-2.4), width: n(6.53), height: n(4.8), fill: C.depotLit }),
      h("rect", { x: n(-1.2), y: n(-2.4), width: n(1.73), height: n(4.8), fill: C.route }),
      h("rect", { x: n(6.4), y: n(-1.13), width: n(1.33), height: n(2.26), fill: C.depotGlassLit }),
    ] };
  }
//== REPLACE from "          var q = mapTruckAt(R, flowTime);" to "        // --- the three bases: place dots and stubs first, then the buildings, then the name cards ---"
          var q = mapTruckAt(R, flowTime), a = mr1(q[3]), K = MiniTruck(), T = MAP_TRUCK;
          return h("g", { transform: "translate(" + mr2(q[0]) + "," + mr2(q[1]) + ") rotate(" + a + ")", opacity: mr2(q[2]) },
            // the shadow keeps its place on the map while the truck turns over it
            h("path", { d: K.d, fill: DAY.map.ink, opacity: T.shade, transform: "rotate(" + (-a) + ") translate(" + T.cast[0] + "," + T.cast[1] + ") rotate(" + a + ")" }),
            K.art);
        })),
//== REPLACE from "            MAP_BASES.map(function (b, j) {" to "              var s = st[j], W = b.card[2], x0 = b.card[0], y0 = b.card[1];"
            // (the three empty place marks and the three empty shadow groups that stood here drew nothing:
            // they are gone, 18 nodes fewer)
            MAP_BASES.map(function (b, j) {
              var s = st[j];
              var tf = "translate(" + mr2(b.px + s.ox) + "," + mr2(b.by + s.oy) + ") scale(" + (Math.round(s.s * 1000) / 1000) + ") translate(" + mr2(b.cx - b.px) + ",0)";
              return h("g", { "data-depot": b.id, transform: tf, opacity: mr2(clamp01(s.a / 1.5)) }, s.D.art);
            }),
            MAP_BASES.map(function (b, j) {
