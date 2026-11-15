//== REPLACE from "  function MiniTruck() {" to "  /* Each corridor measured for its truck, once."
  // REJECTED OPTION (round 8): the picked drawing with a gap between the box and the cab, bridged by the chassis.
  // One part more: the corridor's dashes show through the gap and the cab reads as a separate dark piece.
  function MiniTruck() {
    if (_mapTruck) return _mapTruck;
    var C = DAY.map, k = MAP_TRUCK.k, n = function (v) { return mr2(v * k); };
    var R = function (x0, y0, x1, y1) { return "M" + n(x0) + "," + n(y0) + "H" + n(x1) + "V" + n(y1) + "H" + n(x0) + "Z"; };
    var Q = function (x0, y0, x1, y1, fill) { return h("rect", { x: n(x0), y: n(y0), width: n(x1 - x0), height: n(y1 - y0), fill: fill }); };
    var d = R(-9, -3.6, 3.25, 3.6) + R(3.25, -1.3, 4.55, 1.3)
      + "M" + n(4.55) + "," + n(-3.6) + "H" + n(7.8) + "L" + n(9) + "," + n(-2.4) + "V" + n(2.4) + "L" + n(7.8) + "," + n(3.6) + "H" + n(4.55) + "Z"
      + R(-7.4, -4.85, -5.5, -3.6) + R(-7.4, 3.6, -5.5, 4.85) + R(4.7, -4.85, 6.6, -3.6) + R(4.7, 3.6, 6.6, 4.85);
    return _mapTruck = { d: d, art: [
      h("path", { d: d, fill: C.ink }),
      Q(-7.75, -3.6, 2, 3.6, C.route),              // the stripe along both sides
      Q(-7.75, -2.35, 2, 2.35, C.depotLit),         // the roof
      Q(6.15, -2.35, 7.75, 2.35, C.depotGlassLit)   // the windscreen
    ] };
  }
