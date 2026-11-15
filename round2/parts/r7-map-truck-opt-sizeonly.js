//== REPLACE from "  var MAP_TRUCK = { k: 1.5," to "  /* Each corridor measured for its truck, once."
  // REJECTED OPTION (round 7): size alone. The round 6 drawing, unchanged, at 1.5 times its size: no gap,
  // no tyres, no shadow. Bigger, and still a pill with a dark end.
  var MAP_TRUCK = { k: 1.5, stop: 8.4, from: [2.5, 6.4], north: 3, join: 16, show: [0.5, 8], cast: [0, 0], shade: 0 };
  MAP_TRUCK.hx = 9 * MAP_TRUCK.k; MAP_TRUCK.hy = 4.5 * MAP_TRUCK.k; MAP_TRUCK.axle = 4.5 * MAP_TRUCK.k; MAP_TRUCK.base = 9.5 * MAP_TRUCK.k;
  var _mapTruck = null;
  function MiniTruck() {
    if (_mapTruck) return _mapTruck;
    var C = DAY.map, k = MAP_TRUCK.k, n = function (v) { return mr2(v * k); };
    var pts = [[-9, -4.5], [3, -4.5], [3, -3.75], [7.5, -3.75], [9, -2.25], [9, 2.25], [7.5, 3.75], [3, 3.75], [3, 4.5], [-9, 4.5]];
    var d = "M" + pts.map(function (p) { return n(p[0]) + "," + n(p[1]); }).join("L") + "Z";
    return _mapTruck = { d: d, art: [
      h("path", { d: d, fill: C.ink }),
      h("rect", { x: n(-7.1), y: n(-2.6), width: n(8), height: n(5.2), fill: C.depotLit }),
      h("rect", { x: n(0.9), y: n(-2.6), width: n(2.1), height: n(5.2), fill: C.route }),
      h("rect", { x: n(5), y: n(-1.9), width: n(2), height: n(3.8), fill: C.depotGlassLit }),
    ] };
  }
