//== REPLACE from "  var MAP_BOX = [" to "  var SWELL = {"
  // Round 7 (2026-11-15): the box stands 36 px higher than it did (its top was 12). On the desktop framing the
  // site lays a dark band over the foot of the hero, from stage y 713 down, and the hub, the name cards and
  // 東京 stood in it. 36 px is what a phone leaves: there the name 新潟 comes up under the two buttons and now
  // clears them by 10 px. It takes the darkness over the hub from 25 % to 15 %; clearing the band altogether
  // takes 89 px, which a phone does not have (measured by node tools/map-band.mjs <side>).
  var MAP_BOX = [535, -24, 850, 1056];
