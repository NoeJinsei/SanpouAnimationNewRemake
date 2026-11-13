// Each skyline plot is handed its depth inside the tier (dz) and its land value.
//== REPLACE from "return CityBuilding({ x: o.b.x, baseY: GROUND, w: o.b.w, h: o.b.h, seed: \"skd\" +" to "})),"
          return CityBuilding({ x: o.b.x, baseY: GROUND, w: o.b.w, h: o.b.h, dz: o.b.dz, land: o.b.land, seed: "skd" + o.i, fi: o.i, faces: [DAY.deep], detail: -1, cap: DAY.deepTop });
//== REPLACE from "skylineFar.map(function (b, i)" to "skylineFar.filter(fu"
          skylineFar.map(function (b, i) { return { b: b, i: i }; }).filter(function (o) { var vx = o.b.x - cam * 0.32; return vx + o.b.w > -240 && vx < 2160; }).map(function (o) { return CityBuilding({ x: o.b.x, baseY: GROUND, w: o.b.w, h: o.b.h, dz: o.b.dz, land: o.b.land, seed: "skf" + o.i, fi: o.i, faces: DAY.far, detail: 0, cap: DAY.farCap }); }),
//== REPLACE from "skylineMid.map(function (b, i)" to "UtilityPoles(-120, 1"
          skylineMid.map(function (b, i) { return { b: b, i: i }; }).filter(function (o) { var vx = o.b.x - cam * 0.52; return vx + o.b.w > -240 && vx < 2160; }).map(function (o) { return CityBuilding({ x: o.b.x, baseY: GROUND, w: o.b.w, h: o.b.h, dz: o.b.dz, land: o.b.land, seed: "skm" + o.i, fi: o.i, faces: DAY.mid, detail: 1, cap: DAY.midCap }); }),
//== REPLACE from "farCity.map(function (b, i) { " to "}),"
            farCity.map(function (b, i) { return { b: b, i: i }; }).filter(function (o) { return o.b.x + off + o.b.w > -240 && o.b.x + off < 2160; }).map(function (o) { return CityBuilding({ x: o.b.x, baseY: ROAD_Y, w: o.b.w, h: o.b.h + 110, dz: o.b.dz, land: o.b.land, seed: "tf" + o.i, fi: o.i, faces: DAY.far, detail: 0, cap: DAY.farCap }); }));
//== REPLACE from "midCity.map(function (b, i) { " to "}),"
            midCity.map(function (b, i) { return { b: b, i: i }; }).filter(function (o) { return o.b.x + off + o.b.w > -240 && o.b.x + off < 2160; }).map(function (o) { return CityBuilding({ x: o.b.x, baseY: ROAD_Y, w: o.b.w, h: o.b.h + 50, dz: o.b.dz, land: o.b.land, seed: "tc" + o.i, fi: o.i, faces: DAY.mid, detail: 1, cap: DAY.midCap }); }));
