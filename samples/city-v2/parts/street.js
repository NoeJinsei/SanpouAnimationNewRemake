//== REPLACE from "  function Streetlight(x, y) {" to "  /* 自販機:"
  /* ---- round 2 street furniture ---- */
  DAY.poleLit = "#9fb2cb"; DAY.poleDark = "#4d5f7a"; DAY.lampLens = "#e3ebf4";
  DAY.utilityLit = "#7f92b2"; DAY.utilityDark = "#3f5175"; DAY.wireFlat = "#6b7da0"; DAY.guardBand = "#cdb84f";
  DAY.walkLit = "#d6dae0"; DAY.walkShade = "#a3abb6"; DAY.curbShade = "#7f8994"; DAY.tactile = "#dcc152";
  DAY.roadLine = "#757b82"; DAY.roadDash = "#b9bdc1";
  DAY.fgBand = "#222a37"; DAY.fgEdge = "#3b4759"; DAY.fgRail = "#1b2638"; DAY.fgRailLit = "#4b5b76";
  /* A road lamp: a steel pole on a collar, a curved arm, a flat LED head. Off in daylight. */
  var _slMemo = null;
  function Streetlight(x, y) {
    if (!_slMemo) _slMemo = h("g", null,
      h("rect", { x: -4, y: -192, width: 8, height: 192, fill: DAY.pole }),
      h("rect", { x: 1, y: -192, width: 3, height: 180, fill: DAY.poleLit }),
      h("path", { d: "M-4,-188 L-4,-193 Q-4,-205 9,-205 L54,-205 L54,-198 L12,-198 Q4,-198 4,-190 L4,-188 Z", fill: DAY.pole }),
      h("rect", { x: -7, y: -18, width: 14, height: 18, rx: 2, fill: DAY.poleDark }),
      h("rect", { x: -7, y: -18, width: 14, height: 4, rx: 2, fill: DAY.pole }),
      h("rect", { x: 40, y: -200, width: 27, height: 9, rx: 3, fill: DAY.poleDark }),
      h("rect", { x: 44, y: -193, width: 19, height: 3.2, rx: 1.5, fill: DAY.lampLens }));
    return h("g", { transform: "translate(" + x + ", " + y + ")" }, _slMemo);
  }
  /* 電柱: concrete utility poles as they stand in a Tokyo street: two crossarms with insulators, a pole
     transformer on every other pole and a small lamp on the others, a yellow guard band at the foot, and
     four lines sagging between them (three conductors and one heavier cable). Shapes are batched by colour. */
  var _upMemo = {};
  function UtilityPoles(x0, n, gap, baseY, ht) {
    var mk = x0 + "|" + n + "|" + gap + "|" + baseY + "|" + ht;
    if (_upMemo[mk]) return _upMemo[mk];
    var R = function (rx, ry, rw, rh) { return "M" + rx + "," + ry + "h" + rw + "v" + rh + "h" + (-rw) + "z"; };
    var dShaft = "", dLit = "", dDark = "", dBand = "", dW = "", dC = "";
    for (var i = 0; i < n; i++) {
      var px = x0 + i * gap, top = baseY - ht;
      dShaft += "M" + (px - 5) + "," + baseY + "L" + (px - 3) + "," + top + "L" + (px + 3) + "," + top + "L" + (px + 5) + "," + baseY + "z";
      dLit += "M" + (px + 1.6) + "," + baseY + "L" + (px + 0.4) + "," + (top + 2) + "L" + (px + 3) + "," + (top + 2) + "L" + (px + 5) + "," + baseY + "z";
      dDark += R(px - 24, top + 12, 48, 5) + R(px - 17, top + 34, 34, 4.5);
      [-22, -3, 16].forEach(function (o) { dLit += R(px + o, top + 4, 6, 8); });
      if (i % 2 === 0) { dDark += R(px + 5, top + 50, 15, 23) + R(px + 1, top + 58, 5, 4); dLit += R(px + 5, top + 56, 15, 3.4) + R(px + 16, top + 50, 4, 23); }
      else { dDark += R(px + 2, top + 62, 20, 3.6) + R(px + 17, top + 60, 11, 6.5); dLit += R(px + 19, top + 65, 7, 3); }
      dBand += R(px - 5.4, baseY - 74, 10.8, 13);
      if (i < n - 1) {
        var nx = px + gap;
        [-19, 0, 19].forEach(function (o, k) { var yy = top + 4, sag = 16 + k * 3; dW += "M" + (px + o) + "," + yy + "Q" + (px + gap / 2 + o) + "," + (yy + sag) + " " + (nx + o) + "," + yy; });
        dC += "M" + px + "," + (top + 38) + "Q" + (px + gap / 2) + "," + (top + 70) + " " + nx + "," + (top + 38);
      }
    }
    return _upMemo[mk] = h("g", null,
      h("path", { d: dW, fill: "none", stroke: DAY.wireFlat, strokeWidth: 2 }),
      h("path", { d: dC, fill: "none", stroke: DAY.wireFlat, strokeWidth: 3.2 }),
      h("path", { d: dShaft, fill: DAY.utility }),
      h("path", { d: dDark, fill: DAY.utilityDark }),
      h("path", { d: dLit, fill: DAY.utilityLit }),
      h("path", { d: dBand, fill: DAY.guardBand }));
  }
//== REPLACE from "  /* 自販機:" to "  /* ---- Scene12World.tsx ---- */"
  /* 自販機: a pair of plain (unbranded) vending machines on the pavement. Each is a cabinet with a shaded
     left return and a lit top, a display of three shelves of cans, a button strip, a payment panel and a
     delivery flap; one flat shadow on the paving. No lettering. */
  var _vmMemo = null;
  function VendingPair(x, baseY) {
    if (_vmMemo && _vmMemo.k === x + "|" + baseY) return _vmMemo.v;
    var units = [{ dx: 0, body: "#f1f4f7", shade: "#d3dce8", cap: "#ffffff", win: "#e4edf6", dark: "#33425c" }, { dx: 58, body: "#3f78b8", shade: "#2f5f97", cap: "#6297d0", win: "#e4edf6", dark: "#1c2d4a" }];
    var cans = ["#e16347", "#2a7f8c", "#f2c14e", "#7aa5d6", "#5d8f4e"];
    var out = h("g", { "data-cache": "vending-" + x + "|" + baseY, "data-box": (x - 20) + " " + (baseY - 102) + " 136 110" },
      h("path", { d: "M" + (x - 16) + "," + (baseY + 6) + "L" + (x - 8) + "," + baseY + "L" + (x + 112) + "," + baseY + "L" + (x + 108) + "," + (baseY + 6) + "z", fill: DAY.walkShade }),
      units.map(function (u, ui) {
        var ux = x + u.dx, top = baseY - 100, dCans = ["", "", "", "", ""];
        for (var r = 0; r < 3; r++) for (var c = 0; c < 5; c++) dCans[(c + r * 2 + ui * 3) % 5] += "M" + (ux + 11.5 + c * 7.4) + "," + (top + 13 + r * 14) + "h5v9h-5z";
        return h("g", null,
          h("rect", { x: ux, y: top, width: 54, height: 98, rx: 3, fill: u.body }),
          h("rect", { x: ux, y: top + 3, width: 6, height: 95, fill: u.shade }),
          h("rect", { x: ux, y: top, width: 54, height: 6, rx: 3, fill: u.cap }),
          h("rect", { x: ux + 9, y: top + 10, width: 40, height: 45, rx: 2, fill: u.win }),
          h("path", { d: "M" + (ux + 9) + "," + (top + 22) + "h40v3h-40z M" + (ux + 9) + "," + (top + 36) + "h40v3h-40z M" + (ux + 9) + "," + (top + 50) + "h40v3h-40z", fill: u.shade }),
          dCans.map(function (d, k) { return h("path", { d: d, fill: cans[k] }); }),
          h("rect", { x: ux + 9, y: top + 58, width: 40, height: 4.5, rx: 2, fill: u.dark, opacity: 0.55 }),
          h("rect", { x: ux + 34, y: top + 66, width: 14, height: 13, rx: 2, fill: u.dark }),
          h("rect", { x: ux + 38.5, y: top + 70, width: 5, height: 5, rx: 1.5, fill: u.win }),
          h("rect", { x: ux + 9, y: top + 66, width: 21, height: 5, rx: 2, fill: u.shade }),
          h("rect", { x: ux + 9, y: top + 83, width: 38, height: 11, rx: 2, fill: u.dark }),
          h("path", { d: "M" + (ux + 3) + "," + (baseY - 2) + "h9v2h-9z M" + (ux + 42) + "," + (baseY - 2) + "h9v2h-9z", fill: u.dark }));
      }));
    _vmMemo = { k: x + "|" + baseY, v: out };
    return out;
  }

