//== REPLACE from "  /* The map truck, SEEN FROM ABOVE, pointing right (+x), drawn about its own centre (round 7, 2026-11-15)." to "  /* Each corridor measured for its truck, once."
  /* The map truck: THE FILM'S OWN TRUCK, SEEN FROM ABOVE, pointing right (+x), drawn about its own centre
     (round 8, 2026-11-16; the steering, the wheelbase model, the shadow and the size are round 7's and stay).
     Every Sanpou truck in the film is a white box with a navy cab and one vermilion stripe along its side.
     From above that is, from the tail to the nose:
       the box      long and white: 13.55 of the truck's 18 units. Its two long edges are the vermilion stripe,
                    seen from above along both sides (1.25 wide each); its tail end is navy
       the cab      one navy block joined to the box, as wide as the box: its roof, then the pale windscreen
                    across it (1.6 long, 4.7 wide), then the bumper with its two corners cut: the nose
       the wheels   four short navy marks (1.9 long) standing 1.25 out at the corners: the rear pair near
                    the tail, the front pair beside the cab's roof
       the shadow   the same outline in flat navy, a little down and to the left of the truck whichever
                    way it points (the sun is top right)
     Few parts, mostly white. Round 7's drawing was an armature of dark parts: tyre blocks that read as two
     crossbeams, a dark nib of a cab, the stripe as a bar across the middle of the box.
     Drawn in d (18 long) and multiplied by k; 1 d = 2.45 stage px, so nothing is under 1.23 d (3 stage px).
     Four nodes, built once and shared by every truck, plus one node each for its shadow: as before.
     MAP_TRUCK: k = its size; hx / hy = half its length and width; axle = its front axle, ahead of its
     centre; base = from that axle back to the rear axle; stop = how far from the middle of the place dot
     its nose stops (the open target's edge is 7.9 u out); from / north / join = where it starts, under the
     head office, and how far it has run when it is on its corridor's line; show = between which distances
     run it comes up from nothing; cast / shade = where its shadow lies, in map units, and how dark it is. */
  var MAP_TRUCK = { k: 1.5, stop: 8.4, from: [2.5, 6.4], north: 3, join: 16, show: [0.5, 8], cast: [-1.3, 2.3], shade: 0.24 };
  MAP_TRUCK.hx = 9 * MAP_TRUCK.k; MAP_TRUCK.hy = 4.85 * MAP_TRUCK.k; MAP_TRUCK.axle = 5.65 * MAP_TRUCK.k; MAP_TRUCK.base = 12.1 * MAP_TRUCK.k;
  var _mapTruck = null;
  function MiniTruck() {
    if (_mapTruck) return _mapTruck;
    var C = DAY.map, k = MAP_TRUCK.k, n = function (v) { return mr2(v * k); };
    var R = function (x0, y0, x1, y1) { return "M" + n(x0) + "," + n(y0) + "H" + n(x1) + "V" + n(y1) + "H" + n(x0) + "Z"; };
    var Q = function (x0, y0, x1, y1, fill) { return h("rect", { x: n(x0), y: n(y0), width: n(x1 - x0), height: n(y1 - y0), fill: fill }); };
    // everything navy as one outline: the box, the cab with its cut corners, the four wheel marks
    var d = R(-9, -3.6, 4.55, 3.6)
      + "M" + n(4.55) + "," + n(-3.6) + "H" + n(7.8) + "L" + n(9) + "," + n(-2.4) + "V" + n(2.4) + "L" + n(7.8) + "," + n(3.6) + "H" + n(4.55) + "Z"
      + R(-7.4, -4.85, -5.5, -3.6) + R(-7.4, 3.6, -5.5, 4.85) + R(4.7, -4.85, 6.6, -3.6) + R(4.7, 3.6, 6.6, 4.85);
    return _mapTruck = { d: d, art: [
      h("path", { d: d, fill: C.ink }),
      Q(-7.75, -3.6, 3.3, 3.6, C.route),            // the stripe along both sides: the box's two long edges
      Q(-7.75, -2.35, 3.3, 2.35, C.depotLit),       // the roof
      Q(6.15, -2.35, 7.75, 2.35, C.depotGlassLit)   // the windscreen
    ] };
  }
