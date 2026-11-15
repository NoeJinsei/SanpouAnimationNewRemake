//== REPLACE from "  function MiniTruck() {" to "  /* Each corridor measured for its truck, once."
  // REJECTED OPTION (round 8): a navy outline all round the box and the stripe as a band across its tail.
  // The strongest outline of the three, but the stripe is a mark on the roof again, not the truck's side stripe.
  function MiniTruck() {
    if (_mapTruck) return _mapTruck;
    var C = DAY.map, k = MAP_TRUCK.k, n = function (v) { return mr2(v * k); };
    var R = function (x0, y0, x1, y1) { return "M" + n(x0) + "," + n(y0) + "H" + n(x1) + "V" + n(y1) + "H" + n(x0) + "Z"; };
    var Q = function (x0, y0, x1, y1, fill) { return h("rect", { x: n(x0), y: n(y0), width: n(x1 - x0), height: n(y1 - y0), fill: fill }); };
    var d = R(-9, -3.6, 4.55, 3.6)
      + "M" + n(4.55) + "," + n(-3.6) + "H" + n(7.8) + "L" + n(9) + "," + n(-2.4) + "V" + n(2.4) + "L" + n(7.8) + "," + n(3.6) + "H" + n(4.55) + "Z"
      + R(-7.4, -4.85, -5.5, -3.6) + R(-7.4, 3.6, -5.5, 4.85) + R(4.7, -4.85, 6.6, -3.6) + R(4.7, 3.6, 6.6, 4.85);
    return _mapTruck = { d: d, art: [
      h("path", { d: d, fill: C.ink }),
      Q(-7.75, -2.35, 3.3, 2.35, C.depotLit),       // the roof, inside a navy outline all round
      Q(-7.75, -2.35, -6, 2.35, C.route),           // the stripe: a band across the tail
      Q(6.15, -2.35, 7.75, 2.35, C.depotGlassLit)   // the windscreen
    ] };
  }
