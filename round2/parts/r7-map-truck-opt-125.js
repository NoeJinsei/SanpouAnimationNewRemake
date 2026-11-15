//== REPLACE from "  var MAP_TRUCK = { k: 1.5," to "  MAP_TRUCK.hx = 9 * MAP_TRUCK.k;"
  // REJECTED OPTION (round 7): the new drawing at 1.25 times the old length, not 1.5 (22.5 u, about 24 px
  // on a phone). At this size the tyres stand 1.6 u out and the gap is 1.6 u: under the 3 stage px floor.
  var MAP_TRUCK = { k: 1.25, stop: 8.4, from: [2.5, 6.4], north: 3, join: 16, show: [0.5, 8], cast: [-1.3, 2.3], shade: 0.24 };
