/* The film's value range, widened (the batch of 2026-11-15, last element).
   The whole film sat in one pale blue-grey band: the road was the only dark thing anywhere, and the
   nearest row of the city was barely a step from the row behind it. The city is where the middle of the
   range lives, so that is where it is widened: the nearest row goes decisively toward navy (it carries
   the weight of the picture, just above the road), the row behind it stops being washed toward the air,
   and the far rows go a little further into the air, so the rows read as five clear steps from navy to
   sky instead of three steps of the same grey-blue. The haze over the near rows is thinner for the same
   reason. Whites (clouds, the trucks, the warehouse, Fuji's cap) and the sky are untouched: daylight
   stays daylight, and nothing above the roofs gets darker, so the copy's ground does not change. */

//== REPLACE from "  var CITY_LOOK = {" to "  function CityHaze(id, baseY, i) {"
  var CITY_LOOK = {
    near: { u: 1, air: -0.3, lod: 2 },
    nearBack: { u: 0.94, air: 0.04, lod: 2 },
    far: { u: 0.78, air: 0.5, lod: 1 },
    farBack: { u: 0.72, air: 0.66, lod: 1 },
    deep: { u: 0.6, air: 0.82, lod: 0 }
  };
  // the two haze bands, the same in every scene: [strength at the ground, height]
  var CITY_HAZE = [[0.4, 430], [0.13, 270]];
