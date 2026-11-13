//== REPLACE from "  function CityBuilding(p) {" to "  /* ---- round 2 sky"
  /* ---- round 2 city: a kit of Tokyo buildings, chosen per slot (not one box at every size) ----
     office   concrete frame, punched windows with sills (or ribbon glazing), a shopfront, roof box / mast
     glass    curtain-wall tower: banded glass, one diagonal reflection, a set-back crown
     mansion  apartment block: rows of balconies in shadow, stair head and water tank on the roof
     stepped  a tower that sets back twice as it rises, vertical glazing, a mast
     pencil   a slim building on a narrow plot: one wide window a floor, a blade sign, a roof board
     block    a low wide block: ribbon glazing, rooftop plant, a billboard frame
     The far tier (detail 0) draws the same kinds with fewer, broader marks; the deep tier (detail -1) is
     silhouettes with a few bands. Every tone is mixed from the slot's own facade colour, so a building
     keeps its tier's distance: contrast falls with it. One light: the left return of every volume is in
     shade, the right edge catches the sun, windows reflect the sky at their top. Signs carry blocks, never
     lettering. Static, so each building is built once. */
  var CITY_CYCLE = ["office", "glass", "mansion", "stepped", "glass"];
  var _cbMemo = {};   // one drawing per building
  function cityKind(fi, w, hgt, detail) {
    if (detail < 0) return ["flat", "stepped", "flat", "crown"][fi % 4];
    if (w <= 118) return detail > 0 ? "pencil" : (fi % 2 ? "glass" : "stepped");
    if (w >= 196 && hgt / w < 1.25) return "block";
    return CITY_CYCLE[fi % CITY_CYCLE.length];
  }
  function CityBuilding(p) {
    var detail = p.detail == null ? 1 : p.detail;
    var _mk = p.seed + "|" + p.x + "|" + p.baseY + "|" + p.w + "|" + p.h + "|" + detail + "|" + (p.fi == null ? -1 : p.fi) + "|" + (p.kind || "");
    if (_cbMemo[_mk]) return _cbMemo[_mk];
    var x = p.x, baseY = p.baseY, w = p.w, hgt = p.h, seed = p.seed, top = baseY - hgt;
    var fi = p.fi == null ? Math.floor(random(seed + "-f") * 997) : p.fi;
    var face = p.faces[fi % p.faces.length], kind = p.kind || cityKind(fi, w, hgt, detail);
    var c = detail > 0 ? 1 : detail === 0 ? 0.62 : 0.5, NAVY = "#1d3156";
    var col = {
      body: face, side: mix(face, NAVY, 0.2 * c), deep: mix(face, NAVY, 0.42 * c),
      glass: detail < 0 ? mix(face, "#ffffff", 0.42) : mix(face, DAY.glass, 0.25 + 0.7 * c), warm: DAY.warm,
      over: face, lite: detail < 0 ? (p.cap || mix(face, "#ffffff", 0.3)) : mix(face, "#ffffff", 0.34 * c),
      board: mix(face, "#ffffff", 0.66), cap: detail < 0 ? face : (p.cap || mix(face, NAVY, 0.36 * c))
    };
    col.wall = mix(face, DAY.glass, 0.16 + 0.3 * c); col.sheen = mix(col.wall, "#ffffff", 0.26); col.hi = mix(col.glass, "#ffffff", 0.5);
    var ORDER = ["body", "side", "deep", "wall", "glass", "sheen", "hi", "warm", "over", "lite", "board", "cap"], L = {};
    ORDER.forEach(function (k) { L[k] = ""; });
    var r1 = function (v) { return Math.round(v * 10) / 10; };
    var R = function (k, rx, ry, rw, rh) { if (rw > 0.5 && rh > 0.5) L[k] += "M" + r1(rx) + "," + r1(ry) + "h" + r1(rw) + "v" + r1(rh) + "h" + r1(-rw) + "z"; };
    var fp = detail > 0 ? 34 : detail === 0 ? 24 : 40;                 // a storey; smaller with distance
    var sw = detail > 0 ? Math.max(8, Math.min(18, w * 0.1)) : detail === 0 ? Math.max(5, Math.min(10, w * 0.07)) : 0;
    var rnd = function (k) { return random(seed + "-" + k); };
    var floors = function (y0, y1) { var n = Math.max(1, Math.round((y1 - y0) / fp)); return { n: n, h: (y1 - y0) / n }; };

    // one volume: its body, its shaded return on the left, the sunlit edge on the right, its coping
    var volume = function (vx, vy, vw, vh, coping) {
      R("body", vx, vy, vw, vh);
      if (sw) { R("side", vx, vy, Math.min(sw, vw * 0.2), vh); R("lite", vx + vw - 3, vy, 3, vh); }
      if (coping) R("cap", vx - 2, vy - coping + 2, vw + 4, coping);
      var s = sw ? Math.min(sw, vw * 0.2) : 0;
      return { x: vx + s, y: vy, w: vw - s, h: vh };
    };
    // --- window logics; each fills the lit front `f` between y0 and y1 ---
    var punched = function (f, y0, y1) {
      var fl = floors(y0, y1), cols = Math.max(1, Math.round((f.w - 10) / (fp * 0.94))), cw = (f.w - 10) / cols, ww = cw * 0.6, wh = fl.h * 0.5;
      for (var r = 0; r < fl.n; r++) {
        var wy = y0 + r * fl.h + fl.h * 0.2;
        if (detail > 0) {
          for (var q = 0; q < cols; q++) {
            var wx = f.x + 5 + q * cw + (cw - ww) / 2;
            R("deep", wx - 2, wy - 2, ww + 4, wh + 4);
            if (rnd("w" + r + "-" + q) < DAY.warmP) R("warm", wx, wy, ww, wh); else { R("glass", wx, wy, ww, wh); R("hi", wx, wy, ww, wh * 0.4); }
          }
          R("lite", f.x + 3, wy + wh + 4, f.w - 8, 3);
        } else {
          var segs = Math.max(1, Math.round(f.w / 58)), sg = (f.w - 8) / segs;
          for (var s2 = 0; s2 < segs; s2++) R("glass", f.x + 4 + s2 * sg + 3, wy, sg - 6, wh);
        }
      }
    };
    var ribbons = function (f, y0, y1) {
      var fl = floors(y0, y1), rh = fl.h * 0.44;
      for (var r = 0; r < fl.n; r++) {
        var wy = y0 + r * fl.h + fl.h * 0.22;
        R("glass", f.x + 5, wy, f.w - 12, rh);
        if (detail > 0) {
          R("hi", f.x + 5, wy, f.w - 12, rh * 0.38);
          var nm = Math.max(1, Math.round((f.w - 12) / 30));
          for (var m = 1; m < nm; m++) R("over", f.x + 5 + m * (f.w - 12) / nm - 1.5, wy, 3, rh);
        }
      }
    };
    var balconies = function (f, y0, y1) {
      var fl = floors(y0, y1), bays = Math.max(1, Math.round((f.w - 8) / 48)), bw = (f.w - 8) / bays, rh = fl.h * 0.5;
      for (var r = 0; r < fl.n; r++) {
        var ry = y0 + r * fl.h + fl.h * 0.08;
        R("deep", f.x + 4, ry, f.w - 10, rh);
        if (detail > 0) for (var b = 0; b < bays; b++) {
          var gx = f.x + 4 + b * bw + bw * 0.16;
          if (rnd("b" + r + "-" + b) < DAY.warmP) R("warm", gx, ry + 3, bw * 0.66, rh - 3); else { R("glass", gx, ry + 3, bw * 0.66, rh - 3); R("hi", gx, ry + 3, bw * 0.66, (rh - 3) * 0.34); }
          if (b) R("over", f.x + 4 + b * bw - 2, ry, 4, rh);
        }
        R("lite", f.x + 1, ry + rh, f.w - 5, detail > 0 ? 4 : 3);                  // the balcony rail, in the sun
      }
    };
    var strips = function (f, y0, y1) {
      if (y1 - y0 < 16 || f.w < 22) return;
      var cols = Math.max(2, Math.round((f.w - 8) / (detail > 0 ? 26 : 30))), cw = (f.w - 8) / cols;
      for (var q = 0; q < cols; q++) { R("glass", f.x + 4 + q * cw + cw * 0.22, y0, cw * 0.56, y1 - y0); if (detail > 0) R("hi", f.x + 4 + q * cw + cw * 0.22, y0, cw * 0.56, Math.min(14, (y1 - y0) * 0.2)); }
      if (detail >= 0) for (var yy = y0 + fp * (detail > 0 ? 1 : 2); yy < y1 - 6; yy += fp * (detail > 0 ? 1 : 2)) R("over", f.x + 3, yy, f.w - 8, 3);
    };
    var curtain = function (f, y0, y1) {
      R("wall", f.x, y0, f.w - 3, y1 - y0);
      var H = y1 - y0, x1 = f.x + f.w - 3;
      L.sheen += "M" + r1(f.x + f.w * 0.46) + "," + r1(y0) + "L" + r1(x1) + "," + r1(y0) + "L" + r1(x1) + "," + r1(y0 + H * 0.3) + "L" + r1(f.x) + "," + r1(y0 + H * 0.8) + "L" + r1(f.x) + "," + r1(y0 + H * 0.52) + "z";
      var stepY = fp * (detail > 0 ? 1 : 2);
      for (var yy = y0 + stepY - 3; yy < y1 - 4; yy += stepY) R("over", f.x, yy, f.w - 3, 3);
      var nm = Math.max(2, Math.round(f.w / (detail > 0 ? 34 : 56)));
      for (var m = 1; m < nm; m++) R("over", f.x + m * (f.w - 3) / nm - 1.5, y0, 3, H);
    };
    // --- roof furniture ---
    var mast = function (cx, y, hh) { R("cap", cx - 1.8, y - hh, 3.6, hh); R("cap", cx - 7, y - hh * 0.42, 14, 3); };
    var box = function (bx, y, bw, bh) { R("cap", bx, y - bh, bw, bh); };
    var tank = function (tx, y) { R("cap", tx, y - 25, 21, 15); R("cap", tx + 2, y - 10, 3, 10); R("cap", tx + 16, y - 10, 3, 10); };
    var billboard = function (bx, y, bw, bh) {
      R("cap", bx + bw * 0.18, y - 13, 3.4, 13); R("cap", bx + bw * 0.82 - 3.4, y - 13, 3.4, 13);
      R("board", bx, y - 12 - bh, bw, bh); R("cap", bx + 5, y - 12 - bh * 0.5, bw * 0.55, Math.max(4, bh * 0.2));
    };

    var f, cx = x + w / 2;
    if (kind === "office") {
      f = volume(x, top, w, hgt, 8);
      var gf = detail > 0 ? Math.min(40, hgt * 0.25) : 0;
      if (gf) { R("deep", f.x + 5, baseY - gf + 9, f.w - 12, gf - 9); R("lite", f.x + 1, baseY - gf + 2, f.w - 5, 5); }
      (fi % 4 < 2 ? punched : ribbons)(f, top + 10, baseY - gf - 4);
      if (detail > 0 && fi % 2 === 0) box(x + w * 0.26, top - 6, 24, 12);
      if (detail > 0 && fi % 3 === 2) mast(x + w * 0.7, top - 6, 30);
    } else if (kind === "glass") {
      var cr = detail > 0 ? 16 : 10;
      R("cap", x + w * 0.14, top, w * 0.72, cr + 1);
      f = volume(x, top + cr, w, hgt - cr, 0);
      curtain(f, top + cr + 4, baseY);
      R("lite", x, top + cr, w, 3);
      if (fi % 3 === 1) mast(cx, top, detail > 0 ? 34 : 24);
    } else if (kind === "mansion") {
      f = volume(x, top, w, hgt, 7);
      balconies(f, top + 8, baseY - 4);
      box(x + w * 0.6, top - 5, w * 0.22, detail > 0 ? 16 : 10);
      if (detail > 0) tank(x + w * 0.2, top - 5);
    } else if (kind === "stepped") {
      var v1 = volume(x, top + hgt * 0.4, w, hgt * 0.6, detail < 0 ? 0 : 6), v2 = volume(x + w * 0.11, top + hgt * 0.15, w * 0.78, hgt * 0.25 + 1, detail < 0 ? 0 : 6),
        v3 = volume(x + w * 0.25, top, w * 0.5, hgt * 0.15 + 1, detail < 0 ? 0 : 6);
      strips(v1, v1.y + 10, baseY - 6); strips(v2, v2.y + 9, v2.y + v2.h - 6); strips(v3, v3.y + 8, v3.y + v3.h - 6);
      if (detail < 0) { R("lite", x, v1.y, w, 4); R("lite", x + w * 0.11, v2.y, w * 0.78, 4); R("lite", x + w * 0.25, top, w * 0.5, 4); }
      else mast(cx, top - 4, detail > 0 ? 44 : 30);
    } else if (kind === "pencil") {
      f = volume(x, top, w, hgt, 7);
      var fl = floors(top + 10, baseY - 6), wh = fl.h * 0.5;
      for (var r = 0; r < fl.n; r++) { var wy = top + 10 + r * fl.h + fl.h * 0.2; R("deep", f.x + 5, wy - 2, f.w - 12, wh + 4); R("glass", f.x + 7, wy, f.w - 16, wh); R("hi", f.x + 7, wy, f.w - 16, wh * 0.38); }
      var sh = Math.min(hgt * 0.5, 150), sy = top + hgt * 0.14;                       // the blade sign: blocks, never lettering
      R("board", x + w + 1, sy, 13, sh);
      for (var k = 0; k < 4; k++) R("cap", x + w + 4, sy + 6 + k * (sh - 8) / 4, 7, (sh - 8) / 4 - 7);
      if (fi % 2 === 0) billboard(x + 5, top - 5, w - 10, 26); else box(x + w * 0.3, top - 5, 22, 12);
    } else if (kind === "block") {
      f = volume(x, top, w, hgt, 8);
      ribbons(f, top + 10, baseY - 4);
      box(x + w * 0.1, top - 6, w * 0.2, detail > 0 ? 13 : 9);
      if (detail > 0) { box(x + w * 0.34, top - 6, w * 0.1, 8); if (fi % 2 === 0) billboard(x + w * 0.6, top - 6, w * 0.32, 28); else tank(x + w * 0.7, top - 6); }
    } else {                                                                         // the deep tier: flat or crowned silhouettes
      f = volume(x, top, w, hgt, 0);
      R("lite", x, top, w, 4);
      if (kind === "crown") { R("body", x + w * 0.2, top - 14, w * 0.6, 15); R("lite", x + w * 0.2, top - 14, w * 0.6, 4); R("body", cx - 2, top - 46, 4, 32); }
      var fl2 = floors(top + 16, baseY - 10);
      for (var r2 = 0; r2 < fl2.n; r2++) { var by = top + 16 + r2 * fl2.h + fl2.h * 0.25, half = (w - 22) / 2; R("glass", x + 10, by, kind === "crown" ? w - 20 : half - 5, fl2.h * 0.32); if (kind !== "crown") R("glass", x + 16 + half, by, half - 5, fl2.h * 0.32); }
    }
    var kids = [];
    ORDER.forEach(function (k2) { if (L[k2]) kids.push(h("path", { d: L[k2], fill: col[k2] })); });
    return _cbMemo[_mk] = h("g", null, kids);
  }

