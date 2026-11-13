//== REPLACE from "(-cam * 0.18) + \", 0)\" }, skylineDeep" to "        h(\"rect\", { x: 0, y: GROUND - 470"
        h("g", { transform: "translate(" + (-cam * 0.18) + ", 0)" }, skylineDeep.map(function (b, i) { return { b: b, i: i }; }).filter(function (o) { var vx = o.b.x - cam * 0.18; return vx + o.b.w > -240 && vx < 2160; }).map(function (o) {
          return CityBuilding({ x: o.b.x, baseY: GROUND, w: o.b.w, h: o.b.h, seed: "skd" + o.i, fi: o.i, faces: [DAY.deep], detail: -1, cap: DAY.deepTop });
        })),
