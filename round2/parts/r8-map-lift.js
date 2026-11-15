//== REPLACE from "  // Round 7 (2026-11-15): the box stands 36 px higher than it did (its top was 12). On the desktop framing the" to "  var SWELL = {"
  // The box's top is -77 (it was 12 until round 7, then -24): the map stands 89 px higher than it first did,
  // at full size. On the desktop framing the site lays a dark band over the foot of the hero, from stage y 713
  // down, and the hub, the three name cards and 東京 stood in it; 89 px clears the hub and all three cards
  // (東京 keeps 4 %). A phone has only 46 px above the name 新潟 before it meets the two buttons, so that name
  // moved down into the open part of Niigata's own land (MAP_LABEL.NIIGATA) and clears them by 17 px.
  // The reviewer's answer of 2026-11-16, measured by node tools/map-band.mjs <side>. Not the 13 % smaller map:
  // that would take the map truck's gap, tyres and windscreen back under the 3 stage px floor.
  var MAP_BOX = [535, -77, 850, 1056];
//== REPLACE from "    GUNMA: { x: 411.4," to "  };"
    // 新潟 stands in the open land south west of its place, clear of the phone's buttons now that the map is
    // higher; `at` keeps its wipe aimed from where the name used to stand
    GUNMA: { x: 411.4, y: 665.9, f: 15 }, NIIGATA: { x: 376.0, y: 592.0, f: 15, at: [397.0, 552.7] },
