//== REPLACE from "    // the mini depots: white lit front, periwinkle return" to "    ink: \"#13263f\","
    // the mini depots, flat: one white front, navy roof slab / base course / outline, the vermilion fascia line
    depotLit: "#fbfdff",
    depotBay: "#2c4469", depotShutter: "#b3c2dc", depotGlass: "#8ebfe8", depotGlassLit: "#d2e7f8",
//== REPLACE from "  /* A miniature Sanpou depot, drawn with its base line on y = 0" to "  function CoverageMap(p) {"
  /* A miniature Sanpou depot, drawn with its base line on y = 0 and centred on x = 0 so it can be scaled
     about its own place. A small version of the warehouse of scene 02 as ONE straight-on elevation: a
     white front the full width of the building, a level navy roof slab with nothing on it, the vermilion
     fascia line from wall to wall, dock bays between white piers on a navy base course with their
     shutters rolled half up, one navy outline. The head office is wider, has three bays and carries a
     glazed office floor (two panes, a diagonal of sky in each) at its right end.
     Every edge is vertical or horizontal; the only diagonals are the two sheens inside the glass.
     Nothing is thinner than 1.9 u (3.1 stage px) at resting size. No lettering.
     It throws no shadow on the map: the old one was a translucent parallelogram lying to one side, which is
     what a side face would throw. `cast` is kept in what is returned as a constant empty group, so the
     node list of the map is the same shape as before.
     Returns { art: the building, cast: an empty group, top: height of the main roof }. */
  var _depotMemo = {};
  function MiniDepot(w, hq) {
    var mk = w + "|" + (hq ? 1 : 0);
    if (_depotMemo[mk]) return _depotMemo[mk];
    var C = DAY.map, hw = w / 2, SW = 1.9, SL = 2.25, T = hq ? 11 : 10.6, OV = SW / 2;
    var P = function (a) { return a.map(function (q) { return mr2(q[0]) + "," + mr2(q[1]); }).join(" "); };
    var R = function (x, y, rwd, rh) { return "M" + mr2(x) + "," + mr2(y) + "h" + mr2(rwd) + "v" + mr2(rh) + "h" + mr2(-rwd) + "z"; };
    var yF0 = -T + (hq ? 2.2 : 2), yF1 = yF0 + 2.2, yB = -2.2;
    var bays = hq ? 3 : 2, inner = w - SW, pier = 1.9, bw = (inner - pier * (bays + 1)) / bays;
    var roll = Math.max(1.9, (yB - yF1) / 2);                 // how far down the shutters hang: half the opening
    var dBay = "", dShut = "";
    for (var i = 0; i < bays; i++) {
      var bx = -hw + OV + pier + i * (bw + pier);
      dBay += R(bx, yF1, bw, yB - yF1);
      dShut += R(bx, yF1, bw, roll);
    }
    var art = [
      h("rect", { x: -hw, y: -T, width: w, height: T, fill: C.depotLit }),
      h("rect", { x: -hw, y: mr2(yF0), width: w, height: 2.2, fill: C.route }),
      h("path", { d: dBay, fill: C.depotBay }),
      h("path", { d: dShut, fill: C.depotShutter }),
      h("rect", { x: mr2(-hw - OV), y: yB, width: mr2(w + SW), height: -yB, fill: C.ink }),
      // the outline: the two walls. The slab closes the top and the base course the bottom, in the same navy.
      h("path", { d: "M" + hw + "," + (-T) + "V0 M" + (-hw) + "," + (-T) + "V0", fill: "none", stroke: C.ink, strokeWidth: SW }),
      h("rect", { x: mr2(-hw - OV), y: mr2(-T - SL), width: mr2(w + SW), height: SL, fill: C.ink }),
    ];
    if (hq) {   // the office floor: two panes of glass, the sky in each as one diagonal, its own slab
      var ox = hw - 12, oy = -T - SL, oh = 3.8, g0 = ox + OV, g1 = hw - OV, pn = (g1 - g0 - SW) / 2, mx = (ox + hw) / 2;
      art.push(
        h("rect", { x: mr2(g0), y: mr2(oy - oh), width: mr2(g1 - g0), height: oh, fill: C.depotGlass }),
        h("polygon", { points: P([[g0, oy - oh], [g0 + pn, oy - oh], [g0, oy]]), fill: C.depotGlassLit }),
        h("polygon", { points: P([[g1 - pn, oy - oh], [g1, oy - oh], [g1 - pn, oy]]), fill: C.depotGlassLit }),
        h("path", { d: "M" + mr2(ox) + "," + mr2(oy) + "V" + mr2(oy - oh) + " M" + mr2(mx) + "," + mr2(oy) + "V" + mr2(oy - oh) + " M" + hw + "," + mr2(oy) + "V" + mr2(oy - oh), fill: "none", stroke: C.ink, strokeWidth: SW }),
        h("rect", { x: mr2(ox - OV), y: mr2(oy - oh - 2), width: mr2(hw - ox + 2 * OV), height: 2, fill: C.ink })
      );
    }
    return _depotMemo[mk] = { art: art, cast: h("g", null), top: T + SL };
  }
