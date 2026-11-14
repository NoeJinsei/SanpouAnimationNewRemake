//== REPLACE from "  function CloudField(list, plane, time, shift) {" to "  /* Birds (round 3): small filled silhouettes"
  function CloudField(list, plane, time, shift) {
    return h("g", { "data-sky": list.id || "" }, list.map(function (c) {
      var wx = ((((c[0] - SKY_X0 - time * SKY_WIND[plane] - shift) % SKY_SPAN) + SKY_SPAN) % SKY_SPAN) + SKY_X0;
      var ed = clamp01(Math.min((wx - SKY_X0) / 60, (SKY_X0 + SKY_SPAN - wx) / 60));
      return h("g", { transform: "translate(" + wx.toFixed(2) + ", " + c[1] + ")", opacity: ed.toFixed(3) }, CloudShape(c[3], c[2], plane === 0));
    }));
  }
  /* Each scene's sky, composed. The owner's rule (2026-11-14): clouds stay in the sky. Every cloud's
     underside clears the roofs standing under it for as long as the scene rests on it, and nothing sits
     down behind the skyline; `node tools/cloud-check.mjs <side>` measures it. So the cumulus that used to
     stand behind the city is gone: each scene has one tall cloud high in a gap between the towers, one or
     two fair-weather clouds, a high streak (it may pass behind Mt Fuji), a thin streak lying across the
     foot of the sun, a scrap or two. No cumulus covers the sun while a scene holds. The lists keep their
     layout (one per line, numbers only): tools/cloud-lift.py rewrites the undersides for a taller city. */
  var SKY_WORLD = {
    far: [[706, 180, 620, 3], [1560, 128, 560, 4], [66, 330, 96, 6]],
    near: [[886, 350, 230, 0], [135, 262, 450, 1], [625, 300, 92, 5], [1595, 380, 300, 1], [1879, 300, 84, 6]]
  };
  var SKY_TRANSIT = {
    far: [[85, 212, 700, 3], [1585, 112, 560, 4]],
    near: [[930, 370, 250, 0], [-26, 318, 420, 1], [1464, 190, 290, 2], [664, 120, 88, 5]]
  };
  var SKY_FINALE = {
    far: [[78, 372, 680, 3], [1478, 160, 560, 4]],
    near: [[154, 236, 430, 1], [960, 470, 260, 0], [1845, 372, 220, 2], [1500, 262, 88, 6], [644, 250, 92, 5]],
    landFar: [],
    landNear: []
  };
  // each list knows its own name (w-far, t-near, n-landFar ...), which CloudField writes on its group for the check
  [["w", SKY_WORLD], ["t", SKY_TRANSIT], ["n", SKY_FINALE]].forEach(function (e) { for (var k in e[1]) e[1][k].id = e[0] + "-" + k; });

