//== REPLACE from "    hill: \"#dbe8f3\", deep:" to "    frame: \"rgba(22,41,63,0.22)\""
    /* The tiers were too close in value to read as distance: the far tier has been given air and
       the near one weight, so the city has a front and a back instead of one pale wash. */
    hill: "#dbe8f3", deep: "#cfdcea", deepTop: "#dee8f3", deepWin: "rgba(255,255,255,0.45)",
    far: ["#9ab0d2", "#a4b8d8", "#8ea6ca"], farCap: "#8097b8",
    mid: ["#53709f", "#5d7cab", "#486595", "#527da2"], midCap: "#3a5276",

//== REPLACE from "  function makeSkylineTier(seed, span, opt) {" to "  /* Tokyo Tower, redrawn for round 2"
  /* ---- round 2, second pass: the skyline is COMPOSED, not inherited ----
     The first pass kept this function byte for byte, so every building stood at the original's
     x, with the original's width and the original's height: the city's silhouette - the thing
     the eye reads first, from across the room - never changed, and only the texture inside each
     box did. This rebuilds the silhouette.
     The original cycles are now only a starting rhythm. Plots differ far more in width (a sliver
     next to a slab), heights run over a much wider range, every seventh plot is a landmark tower
     that breaks the tier's band, some gaps are negative so neighbours overlap, and each plot sits
     at one of three depths INSIDE its tier. The array comes back sorted back to front, ready to
     draw, carrying its depth so the building can be drawn as a volume at that distance. */
  var TALLER = 1.22;                                               // how much taller the city stands than the original
  function makeSkylineTier(seed, span, opt) {
    var WS = [1, 0.46, 1.3, 0.72, 1.08, 0.56, 1.46, 0.86];        // plot widths: slivers beside slabs
    var HS = [1, 0.38, 0.8, 1.24, 0.52, 0.96, 0.26, 1.12, 0.68, 1.38];
    var GS = [1, 0.22, 1.65, -0.16, 0.9, 0.34, 1.25, -0.08];      // negative = the next plot overlaps
    var DZ = [0, 1, 0, 2, 1, 0, 2, 1, 0, 1];                       // depth inside the tier
    var arr = [], x = -140, i = 0, guard = 0;
    while (x < span && guard++ < 500) {
      var w = Math.max(44, Math.round(opt.w[i % opt.w.length] * WS[i % WS.length]));
      var hf = opt.hf[i % opt.hf.length] * HS[i % HS.length];
      var land = i % 7 === 3;                                      // a landmark, slim and tall
      var lb = opt.base < 150 ? 1.55 : 1.22;                       // the near tier carries the towers
      // the owner asked for a taller city: one factor, so every tier grows together and the skyline
      // keeps its proportions against the Tower and Fuji
      var hgt = Math.round(TALLER * (opt.base * (land ? 1.06 : 0.84) + opt.amp * hf * (land ? lb : 1)));
      if (land) w = Math.max(46, Math.round(w * 0.6));
      if (hgt < 46) hgt = 46;
      if (x + w > span + 110) break;
      arr.push({ x: x, w: w, h: hgt, i: i, dz: DZ[i % DZ.length], land: land });
      x += w + Math.round(opt.g[i % opt.g.length] * GS[i % GS.length]);
      i++;
    }
    arr.sort(function (a, b) { return a.dz - b.dz || a.x - b.x; });
    return arr;
  }

//== REPLACE from "  /* ---- round 2 city: a kit of Tokyo buildings" to "  /* ---- round 2 sky"
  /* ---- round 2 city, second pass: Tokyo as volumes, not cut-outs ----
     Every building is a box standing in space, not a shape cut from paper:
     - ONE OBLIQUE. The sun is top right, so the left return of every volume is the shaded face,
       and it is drawn as a real face receding toward the eye line: a point above the eye line
       falls toward it as it goes back, a point below it rises, so the side tapers with distance.
       The coping runs over the front and the return as one slab, which is what reads as mass.
     - CROWNS DIFFER. parapet, double setback, a chamfered top corner, a sloped slice, a crowned
       mast, a plant deck, water tanks, a pitched roof. The crown is what gives a skyline its
       character, and the original had one (a flat lid) for every building.
     - DEPTH INSIDE A TIER. A plot at dz 1 or 2 stands nearer: its base is a little lower, its
       return is deeper and its tone a step stronger, and it overlaps its neighbours.
     Facades: punched windows with sills, ribbon glazing, balcony rows in shadow, vertical
     glazing strips, a banded curtain wall with one diagonal reflection. Signs carry blocks,
     never lettering. Tones are mixed from the slot's own facade colour, so a building keeps its
     tier's distance and contrast falls with it. Static: each building is drawn once and kept. */
  var CITY_CYCLE = ["office", "glass", "mansion", "stepped", "glass", "block", "office", "glass"];
  var CROWNS = ["parapet", "setback", "chamfer", "mast", "slope", "plant", "tanks", "parapet", "pitch", "setback"];
  var _cbMemo = {};
  function cityKind(fi, w, hgt, detail, land) {
    if (detail < 0) return land ? "crown" : ["flat", "stepped", "flat", "crown"][fi % 4];
    if (land) return fi % 2 ? "stepped" : "glass";
    if (w <= 96) return detail > 0 ? "pencil" : "glass";
    if (w >= 210 && hgt / w < 1.1) return "block";
    return CITY_CYCLE[fi % CITY_CYCLE.length];
  }
  function CityBuilding(p) {
    var detail = p.detail == null ? 1 : p.detail, dz = p.dz || 0, land = !!p.land;
    var _mk = p.seed + "|" + p.x + "|" + p.baseY + "|" + p.w + "|" + p.h + "|" + detail + "|" + dz +
      "|" + (land ? 1 : 0) + "|" + (p.fi == null ? -1 : p.fi) + "|" + (p.kind || "");
    if (_cbMemo[_mk]) return _cbMemo[_mk];
    var x = p.x, w = p.w, hgt = p.h, seed = p.seed;
    var baseY = p.baseY + dz * (detail > 0 ? 13 : detail === 0 ? 7 : 3);   // nearer in the tier = lower
    var top = baseY - hgt;
    var fi = p.fi == null ? Math.floor(random(seed + "-f") * 997) : p.fi;
    var face = p.faces[fi % p.faces.length], kind = p.kind || cityKind(fi, w, hgt, detail, land);
    var crown = CROWNS[(fi * 3 + (land ? 1 : 0)) % CROWNS.length];
    var c = detail > 0 ? 1 : detail === 0 ? 0.62 : 0.5, NAVY = "#1d3156";
    if (dz) face = mix(face, NAVY, dz * 0.055 * c);                        // and a step stronger
    var col = {
      ret: mix(face, NAVY, 0.4 * c + 0.1), body: face, deep: mix(face, NAVY, 0.4 * c),
      glass: detail < 0 ? mix(face, "#ffffff", 0.42) : mix(face, DAY.glass, 0.25 + 0.7 * c),
      warm: DAY.warm, over: face, lite: detail < 0 ? (p.cap || mix(face, "#ffffff", 0.3)) : mix(face, "#ffffff", 0.36 * c),
      board: mix(face, "#ffffff", 0.66), cap: detail < 0 ? face : (p.cap || mix(face, NAVY, 0.36 * c)),
      capRet: detail < 0 ? face : mix(p.cap || mix(face, NAVY, 0.36 * c), NAVY, 0.3)
    };
    col.wall = mix(face, DAY.glass, 0.16 + 0.3 * c); col.sheen = mix(col.wall, "#ffffff", 0.26);
    col.hi = mix(col.glass, "#ffffff", 0.5);
    var ORDER = ["ret", "capRet", "body", "wall", "deep", "glass", "sheen", "hi", "warm", "over", "lite", "board", "cap"], L = {};
    ORDER.forEach(function (k) { L[k] = ""; });
    var r1 = function (v) { return Math.round(v * 10) / 10; };
    var R = function (k, rx, ry, rw, rh) { if (rw > 0.5 && rh > 0.5) L[k] += "M" + r1(rx) + "," + r1(ry) + "h" + r1(rw) + "v" + r1(rh) + "h" + r1(-rw) + "z"; };
    var P = function (k, pts) { var s = "M"; for (var q = 0; q < pts.length; q += 2) s += (q ? "L" : "") + r1(pts[q]) + "," + r1(pts[q + 1]); L[k] += s + "z"; };

    /* the one oblique: the eye line, and how far back the left return goes */
    var HZ = baseY - (detail > 0 ? 210 : detail === 0 ? 150 : 110);        // the eye line for this tier
    var K = detail > 0 ? 0.15 : detail === 0 ? 0.1 : 0.055;                // share of the way to it
    var D = (detail > 0 ? 1 : detail === 0 ? 0.6 : 0.26) * (1 + dz * 0.22) * Math.max(10, Math.min(w * 0.24, 72));
    var bk = function (px, py) { return [px - D, py + (HZ - py) * K]; };   // the same point, one depth back
    /* a volume: its shaded left return, its body, the coping slab over both. Returns the lit front. */
    var volume = function (vx, vy, vw, vh, coping) {
      var t = bk(vx, vy), b = bk(vx, vy + vh);
      if (D > 2.5) P("ret", [vx, vy, t[0], t[1], b[0], b[1], vx, vy + vh]);
      R("body", vx, vy, vw, vh);
      if (coping) {
        R("cap", vx - 2, vy - coping + 2, vw + 4, coping);
        if (D > 2.5) { var t2 = bk(vx - 2, vy - coping + 2); P("capRet", [vx - 2, vy - coping + 2, t2[0], t2[1], t2[0], t2[1] + coping, vx - 2, vy + 2]); }
      }
      R("lite", vx + vw - 3, vy, 3, vh);                                   // the sunlit right arris
      return { x: vx, y: vy, w: vw, h: vh };
    };

    var fp = detail > 0 ? 34 : detail === 0 ? 24 : 40;                     // a storey; smaller with distance
    var rnd = function (k) { return random(seed + "-" + k); };
    var floors = function (y0, y1) { var n = Math.max(1, Math.round((y1 - y0) / fp)); return { n: n, h: (y1 - y0) / n }; };

    // --- facades; each fills the lit front `f` between y0 and y1 ---
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
        R("lite", f.x + 1, ry + rh, f.w - 5, detail > 0 ? 4 : 3);
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

    // --- crowns: what makes one roof different from the next ---
    var mast = function (cx2, y, hh) { R("cap", cx2 - 1.8, y - hh, 3.6, hh); R("cap", cx2 - 7, y - hh * 0.42, 14, 3); R("cap", cx2 - 4.5, y - hh * 0.72, 9, 2.5); };
    var box = function (bx, y, bw, bh) { R("cap", bx, y - bh, bw, bh); if (D > 2.5) { var t = bk(bx, y - bh); P("capRet", [bx, y - bh, t[0], t[1], t[0], t[1] + bh, bx, y]); } };
    var tank = function (tx, y) { R("cap", tx, y - 25, 21, 15); R("cap", tx + 2, y - 10, 3, 10); R("cap", tx + 16, y - 10, 3, 10); };
    var billboard = function (bx, y, bw, bh) {
      R("cap", bx + bw * 0.18, y - 13, 3.4, 13); R("cap", bx + bw * 0.82 - 3.4, y - 13, 3.4, 13);
      R("board", bx, y - 12 - bh, bw, bh); R("cap", bx + 5, y - 12 - bh * 0.5, bw * 0.55, Math.max(4, bh * 0.2));
    };
    var doCrown = function (cx2, cy, cw2) {
      if (detail < 0) return;
      var s = detail > 0 ? 1 : 0.68;
      if (crown === "setback") { box(cx2 + cw2 * 0.14, cy, cw2 * 0.72, 16 * s); box(cx2 + cw2 * 0.3, cy - 16 * s, cw2 * 0.4, 13 * s); }
      else if (crown === "chamfer") { P("cap", [cx2, cy, cx2 + cw2, cy, cx2 + cw2, cy - 10 * s, cx2 + cw2 * 0.6, cy - 24 * s, cx2 + cw2 * 0.16, cy - 24 * s, cx2, cy - 9 * s]); }
      else if (crown === "mast") { box(cx2 + cw2 * 0.2, cy, cw2 * 0.54, 12 * s); mast(cx2 + cw2 * 0.47, cy - 12 * s, 46 * s); }
      else if (crown === "slope") { P("cap", [cx2, cy, cx2 + cw2, cy, cx2 + cw2, cy - 30 * s, cx2, cy - 6 * s]); }
      else if (crown === "plant") { box(cx2 + cw2 * 0.08, cy, cw2 * 0.26, 15 * s); box(cx2 + cw2 * 0.42, cy, cw2 * 0.2, 9 * s); if (detail > 0) tank(cx2 + cw2 * 0.7, cy); }
      else if (crown === "tanks") { if (detail > 0) { tank(cx2 + cw2 * 0.14, cy); tank(cx2 + cw2 * 0.56, cy); } else box(cx2 + cw2 * 0.2, cy, cw2 * 0.5, 10 * s); }
      else if (crown === "pitch") { P("cap", [cx2 - 3, cy, cx2 + cw2 + 3, cy, cx2 + cw2 * 0.5, cy - 26 * s]); }
      else box(cx2 + cw2 * 0.24, cy, cw2 * 0.44, 11 * s);                  // parapet: one low housing
    };

    var f, cx = x + w / 2;
    if (kind === "office") {
      f = volume(x, top, w, hgt, 8);
      var gf = detail > 0 ? Math.min(40, hgt * 0.25) : 0;
      if (gf) { R("deep", f.x + 5, baseY - gf + 9, f.w - 12, gf - 9); R("lite", f.x + 1, baseY - gf + 2, f.w - 5, 5); }
      (fi % 4 < 2 ? punched : ribbons)(f, top + 10, baseY - gf - 4);
      doCrown(x, top - 6, w);
    } else if (kind === "glass") {
      var cr = detail > 0 ? 16 : 10;
      R("cap", x + w * 0.14, top, w * 0.72, cr + 1);
      f = volume(x, top + cr, w, hgt - cr, 0);
      curtain(f, top + cr + 4, baseY);
      R("lite", x, top + cr, w, 3);
      doCrown(x, top, w);
    } else if (kind === "mansion") {
      f = volume(x, top, w, hgt, 7);
      balconies(f, top + 8, baseY - 4);
      doCrown(x, top - 5, w);
    } else if (kind === "stepped") {
      var v1 = volume(x, top + hgt * 0.4, w, hgt * 0.6, detail < 0 ? 0 : 6),
        v2 = volume(x + w * 0.11, top + hgt * 0.15, w * 0.78, hgt * 0.25 + 1, detail < 0 ? 0 : 6),
        v3 = volume(x + w * 0.25, top, w * 0.5, hgt * 0.15 + 1, detail < 0 ? 0 : 6);
      strips(v1, v1.y + 10, baseY - 6); strips(v2, v2.y + 9, v2.y + v2.h - 6); strips(v3, v3.y + 8, v3.y + v3.h - 6);
      if (detail < 0) { R("lite", x, v1.y, w, 4); R("lite", x + w * 0.11, v2.y, w * 0.78, 4); R("lite", x + w * 0.25, top, w * 0.5, 4); }
      else mast(cx, top - 4, detail > 0 ? 50 : 34);
    } else if (kind === "pencil") {
      f = volume(x, top, w, hgt, 7);
      var fl = floors(top + 10, baseY - 6), wh = fl.h * 0.5;
      for (var r = 0; r < fl.n; r++) { var wy = top + 10 + r * fl.h + fl.h * 0.2; R("deep", f.x + 5, wy - 2, f.w - 12, wh + 4); R("glass", f.x + 7, wy, f.w - 16, wh); R("hi", f.x + 7, wy, f.w - 16, wh * 0.38); }
      var sh = Math.min(hgt * 0.5, 150), sy = top + hgt * 0.14;            // the blade sign: blocks, never lettering
      R("board", x + w + 1, sy, 13, sh);
      for (var k = 0; k < 4; k++) R("cap", x + w + 4, sy + 6 + k * (sh - 8) / 4, 7, (sh - 8) / 4 - 7);
      if (fi % 2 === 0) billboard(x + 5, top - 5, w - 10, 26); else doCrown(x, top - 5, w);
    } else if (kind === "block") {
      f = volume(x, top, w, hgt, 8);
      ribbons(f, top + 10, baseY - 4);
      if (detail > 0 && fi % 2 === 0) billboard(x + w * 0.56, top - 6, w * 0.36, 28);
      doCrown(x, top - 6, w * (detail > 0 && fi % 2 === 0 ? 0.5 : 1));
    } else {                                                               // the deep tier: silhouettes
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

