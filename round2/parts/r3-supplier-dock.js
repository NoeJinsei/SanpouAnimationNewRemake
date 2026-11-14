/* Round 3: the supplier building's dock in scene 01, as a working dock (the Sanpou warehouse's vocabulary,
   in the supplier's blue-greys).
   What changes: the dock zone of SupplierBuilding (the door now stands open at street level with its shutter
   rolled up; a real inside: cool shade, racking and stock, the sun on the floor; a working rack just inside;
   a roller conveyor that runs out of the door to where the truck's rear stands; the guide posts), a forklift
   on the ambient clock seen through the door, and the three hopping parcels of scene 01, which become one
   even line of cartons riding the conveyor into the truck.
   What does not change: the building's outline and footprint, the office part, every window, the louvre,
   the staff door, the canopy, the pallets and the roll cage in the yard; the truck and where it parks
   (TRUCK_PARK_1), T_WORLD, scene 02.
   The cartons are drawn twice by the scene: under the truck (so the truck drives in over the ones that
   stand waiting) and over the truck's open rear door, cut at its rear plane. */

//== REPLACE from "  var SUPPLIER_W = 364, SUPPLIER_DOCK" to "  DAY.supInk = "
  var SUPPLIER_W = 364;
  /* The supplier's building, round 3, flat: a modern office-and-dock unit drawn as ONE straight-on elevation.
     SUPPLIER_W is the width of the part of its front that is measured from the right end (the ground line
     and the right end are where they always were, so the truck meets it as before); the office front runs
     32 units further left, over the width its return face used to take. A point of the building at local x
     stands in the world at SUPPLIER_X + (x - 24) * scale.
     Colours: blue-grey for a third party's building. Every surface has a base and a shade (the base pushed
     toward navy) for the strip of shade under whatever overhangs it; pale aluminium carries the light. */
//== INSERT before "  // A polygon clipped to a box, and a polygon as path data"
  // the working dock (round 3): inside the open door, and the supplier's own forklift
  DAY.supIn = "#566b93"; DAY.supInDeep = "#3a4e75";                                    // the back wall in cool shade; deeper under the door head
  DAY.supInFloorLit = "#dfe6f0"; DAY.supInFloor = "#93a5c2";                           // the floor: where the sun falls in, and in the forklift's own shade
  DAY.supInRack = "#394b70"; DAY.supInRackNear = "#26344f";                            // racking in silhouette; the working rack by the door
  DAY.supInStock = "#93a5c4"; DAY.supInStockLit = "#b7c5db";                           // stock on the far racks, seen in shade
  DAY.supFkBody = "#b4c4dd"; DAY.supFkTrim = "#3f5479";                                // the forklift: blue-grey, slate
  DAY.supFkGlass = "#26344f"; DAY.supFkGlassHi = "#4c628b";                            // its cab: dark glass
  DAY.supFkMast = "#4c628b"; DAY.supFkMastLit = "#9bafcb"; DAY.supFkFork = "#1c2840";
//== REPLACE from "     Static, so it is built once: one cached group" to "    var G = 278, W = SUPPLIER_W, OX = W - 340;"
     The dock is open and at work. The door stands at street level with its shutter rolled up; the inside is
     drawn behind it (cool shade, racking in silhouette, the sun on the floor as one flat band); the
     supplier's forklift works the rack just inside; a roller conveyor on legs runs out of the door, along
     the front, to where the truck's rear stands, its rollers at the height of the truck's floor.
     Everything that stands still is built once, in two cached groups: what is behind the forklift, and what
     is in front of it (the working rack's frame, the foot of the shutter, the conveyor). SupplierBuilding()
     puts the forklift between the two on the ambient clock. */
  var SUP_FORK = 0.86;       // the forklift is drawn in its own units, this many of the building's (Sanpou's is 1.12: this one stands inside)
  var _supMemo = {};
  function supplierArt(x, y, scale) {
    var mk = x + "|" + y + "|" + scale;
    if (_supMemo[mk]) return _supMemo[mk];
    var D = DAY, INK = D.supInk, out = [], front = [];
//== REPLACE from "    /* ---- the dock ---- */" to "    /* ---- the yard: few things"
    /* ---- the dock: an open door at street level, and what is inside ---- */
    var DX = 228, DW = 104, DH = 94, DY = G - DH, K = SUP_FORK;          // the clear opening: its left jamb, width and height; its head
    var RKX = 303.6, RKF = 46.4;                                          // the working rack: where a pallet's left end stands (building units); the top of its middle beams (forklift units)
    function B(bx, foot, w, ht) { return [bx, G - foot - ht, w, ht]; }   // a level rectangle, by the height of its foot above the ground
    function rds(list) { var d = ""; for (var k = 0; k < list.length; k++) d += rd(list[k][0], list[k][1], list[k][2], list[k][3]); return d; }
    function n2(v) { return Math.round(v * 100) / 100; }
    // a pallet seen from its end, and plain cartons with a strip of tape (forklift units; x from the pallet's left end, heights above the ground)
    function palletD(f) { return "M0," + n2(-f - 0.9) + "h28v0.9h-28z M0," + n2(-f - 3.5) + "h3v2.6h-3z M12.5," + n2(-f - 3.5) + "h3v2.6h-3z M25," + n2(-f - 3.5) + "h3v2.6h-3z M0," + n2(-f - 4.8) + "h28v1.3h-28z"; }
    function crates(list) {
      var body = "", top = "", tape = "";
      list.forEach(function (c) {
        var y0 = -(c[1] + c[3]);
        body += "M" + c[0] + "," + n2(y0) + "h" + c[2] + "v" + c[3] + "h" + (-c[2]) + "z";
        top += "M" + n2(c[0] + 0.55) + "," + n2(y0 + 0.55) + "h" + n2(c[2] - 1.1) + "v1.3h" + n2(1.1 - c[2]) + "z";
        tape += "M" + n2(c[0] + c[2] / 2 - 1) + "," + n2(y0 + 0.55) + "h2v" + n2(c[3] - 1.1) + "h-2z";
      });
      return [h("path", { d: body, fill: D.supCarton, stroke: COLORS.ink, strokeWidth: 1.1, strokeLinejoin: "round" }), h("path", { d: top, fill: D.supCartonTop }), h("path", { d: tape, fill: D.supCartonTape })];
    }
    // cool shade, and the sun lying on the floor as one flat band
    fill(out, rds([B(DX, 0, DW, DH)]), D.supIn);
    fill(out, rds([B(DX, 0, DW, 4.2)]), D.supInFloorLit);
    // racking along the back wall, in silhouette: stock on three levels of beams, a pallet of cartons on the floor of each bay
    (function () {
      var ux = [233, 262.6, 292.2], S = 0.9, rack = [], pallet = [], stock = [], lit = [];
      var PAT = [
        [[0.5, 0, 13, 12], [14.5, 0, 12.5, 9], [15.5, 9, 9.5, 8]],
        [[0.5, 0, 9, 15], [10.5, 0, 8.5, 10], [20, 0, 8, 13]],
        [[0.5, 0, 27, 8], [2, 8, 11, 9], [14, 8, 12, 7]],
        [[2, 0, 12, 11], [2, 11, 12, 8], [16.5, 0, 10.5, 14]],
        [[0.5, 0, 12.5, 11], [14, 0, 13.5, 8]],
        [[8, 0, 12, 10]]
      ];
      var LOAD = [
        [[0.6, 0, 13.4, 11.5], [14.6, 0, 13.4, 11.5], [0.6, 11.5, 13.4, 10], [15.6, 11.5, 9, 8]],
        [[0.6, 0, 27.4, 13], [3, 13, 11, 9], [15, 13, 11, 7]]
      ];
      var SET = [[0, 3, 4], [2, 1, 5]], FLOOR = [0, 1];     // which pattern stands on which level of each bay; the load on each floor pallet
      function put(list, cx, foot) { list.forEach(function (c) { stock.push(B(cx + c[0] * S, foot + c[1], c[2] * S - 0.8, c[3] - 0.8)); lit.push(B(cx + c[0] * S, foot + c[1] + c[3] - 2.4, c[2] * S - 0.8, 1.6)); }); }
      ux.forEach(function (u) { rack.push(B(u, 4.2, 2.2, DH - 4.2)); });
      [30, 52, 74].forEach(function (lv) { rack.push(B(ux[0], lv, ux[2] + 2.2 - ux[0], 2)); });
      [0, 1].forEach(function (c) {
        var cx = ux[c] + 2.9;
        pallet.push(B(cx + 0.4, 4.2, 24.8, 3));
        put(LOAD[FLOOR[c]], cx, 7.2);
        [32, 54, 76].forEach(function (lv, li) { put(PAT[SET[c][li]], cx, lv); });
      });
      fill(out, rds(rack), D.supInRack); fill(out, rds(pallet), D.supPalletDark);
      fill(out, rds(stock), D.supInStock); fill(out, rds(lit), D.supInStockLit);
    })();
    // the working rack just inside the door, seen from its end: the stock that stays (on the floor and on its
    // top beams); the forklift serves the beams between them
    out.push(h("g", { transform: "translate(" + RKX + ", " + G + ") scale(" + K + ")" },
      h("path", { d: palletD(0.5) + palletD(84.2), fill: D.supPallet }),
      crates([[0.8, 5.3, 13, 12], [14.2, 5.3, 13, 12], [0.8, 17.3, 13, 10.4], [14.2, 17.3, 13, 10.4], [0.8, 89, 13, 10], [15, 89, 11, 8.4]])));
    // deeper shade under the door head
    out.push(h("path", { d: rds([B(DX, DH - 16, DW, 16)]), fill: D.supInDeep, opacity: 0.55 }));
    // the door's portal: hood and jambs, down to the ground
    tone(out, [[DX - 6, DY - 8, DW + 12, 8], [DX - 6, DY, 6, DH], [DX + DW, DY, 6, DH]], D.supFrame, D.supFrameShade);
    // the canopy: a slim slab seen edge on, its top edge in the sun, a dark drip edge under it
    out.push(R(202.8, 163.8, 160.4, 11.4, INK));
    out.push(R(204, 165, 158, 7, D.supAlu), R(204, 165, 158, 1.6, D.supAluLit), R(204, 172, 158, 2, D.supCanopyUnder));

//== REPLACE from "    // guide posts either side of the dock" to "  /* ================= round 3: the city"
    // a guide post at the door's left jamb (the conveyor line takes the right-hand side)
    [212.5].forEach(function (bx) {
      out.push(h("rect", { x: bx, y: 239, width: 7.4, height: G - 239, rx: 2, fill: D.supSafety, stroke: COLORS.ink, strokeWidth: LINE }));
      fill(out, rd(bx, 248.6, 7.4, 7) + rd(bx, 263, 7.4, 7), COLORS.ink);
    });

    /* ---- in front of the forklift: the working rack's frame, the foot of the rolled-up shutter ---- */
    fill(front, rds([B(RKX - 2.9, 0, 2.6, DH), B(RKX + 24.4, 0, 2.6, DH), B(RKX - 2.9, 37.5, 29.9, 2.4), B(RKX - 2.9, 70, 29.9, 2.4), B(RKX - 4.1, 0, 5, 1.4), B(RKX + 23.2, 0, 5, 1.4)]), D.supInRackNear);
    front.push(R(DX, DY, DW, 6, D.supSteelBar), R(DX, DY, DW, 2, D.supSteelBarShade), R(DX + DW / 2 - 7, DY + 2.4, 14, 2.4, D.supFrame, 1.2));
    /* ---- the roller conveyor: a pale aluminium bed on legs, carrying the ink line of the loose things in the
       yard; it comes out of the door and runs along the front to the truck's rear, its top at the height of
       the truck's floor, and a hinged plate bridges the last step ---- */
    (function () {
      var x0 = DX, x1 = 377, top = 8.4, ht = 4.6, legs = "", dots = "", r = 1.1, cy = r1(G - top + ht / 2 + 0.15), cx;
      [243.5, 272.2, 302, 329.3, 352, 373.4].forEach(function (lx) { legs += rd(lx - 1.1, G - top + ht, 2.2, top - ht) + rd(lx - 2.7, G - 1.2, 5.4, 1.2); });
      for (cx = x0 + 3.6; cx < x1 - 2; cx += 6.05) dots += "M" + r1(cx - r) + "," + cy + "a" + r + "," + r + " 0 1 0 " + (2 * r) + ",0a" + r + "," + r + " 0 1 0 " + (-2 * r) + ",0";
      fill(front, legs, COLORS.ink);
      fill(front, rd(375.6, G - top, 6.3, 1.8), D.supSteelBar);
      front.push(h("rect", { x: x0, y: r1(G - top), width: x1 - x0, height: ht, rx: 0.8, fill: D.supAlu, stroke: COLORS.ink, strokeWidth: LINE }));
      front.push(R(x0 + LINE / 2, G - top + LINE / 2, x1 - x0 - LINE, 0.9, D.supAluLit));
      fill(front, dots, D.supFrame);
    })();

    /* ---- the supplier's forklift: Sanpou's drawing in this building's blue-greys. Side-on and facing right,
       local to its front axle on the ground: a counterbalance truck with an enclosed cab (dark glass, nobody
       in it), a two-stage mast, a fork carriage ---- */
    var CI = COLORS.ink, BODY = "M-46,-11L-46,-23Q-46,-29 -40,-29L-11,-29L-7,-35L3,-35Q4.6,-35 4.6,-33.4L4.6,-9L-44,-9Q-46,-9 -46,-11Z", fk = {};
    fk.body = [
      h("path", { d: BODY, fill: D.supFkBody }),
      h("path", { d: "M-46,-11L-46,-23Q-46,-29 -40,-29L-34,-29L-34,-9L-44,-9Q-46,-9 -46,-11Z M-34,-13.4h38.6v4.4h-38.6z", fill: D.supFkTrim }),   // the counterweight and the chassis rail
      h("path", { d: "M-31,-22h23v3.8h-23z", fill: D.supSafety }),
      h("path", { d: BODY, fill: "none", stroke: CI, strokeWidth: 1.2, strokeLinejoin: "round" }),
      h("rect", { x: -39, y: -60, width: 33.6, height: 31, rx: 2.4, fill: D.supFkBody, stroke: CI, strokeWidth: 1.2 }),
      h("rect", { x: -36.2, y: -56.2, width: 28, height: 27.2, rx: 1, fill: D.supFkGlass }),
      h("path", { d: "M-21,-56.2h6.5l-9,27.2h-6.5z M-12,-56.2h2.4l-9,27.2h-2.4z", fill: D.supFkGlassHi }),
      h("rect", { x: -41, y: -62.6, width: 40, height: 4, rx: 1.4, fill: D.supFkTrim, stroke: CI, strokeWidth: 1 })
    ];
    fk.mast = [
      h("rect", { x: 3.7, y: -68, width: 5.6, height: 65.4, rx: 0.8, fill: CI }),
      h("rect", { x: 4.5, y: -67.2, width: 4, height: 63.8, fill: D.supFkMast }),
      h("rect", { x: 6.6, y: -66.2, width: 1.3, height: 61.8, fill: D.supFkMastLit })
    ];
    fk.carriage = [
      h("rect", { x: 8.5, y: -24, width: 2.8, height: 26, rx: 0.6, fill: D.supFkTrim, stroke: CI, strokeWidth: 1 }),
      h("path", { d: "M8.5,0H37.6V0.5L35.8,1.5H8.5Z", fill: D.supFkFork })
    ];
    fk.wheel = [7.5, 6].map(function (r) {
      return {
        tyre: [h("circle", { r: r, fill: D.truckTyre }), h("circle", { r: r1(r * 0.56), fill: D.supSteelBar })],
        bar: h("path", { d: "M" + r1(-r * 0.5) + ",-0.9h" + r1(r) + "v1.8h" + r1(-r) + "z M-0.9," + r1(-r * 0.5) + "h1.8v" + r1(r) + "h-1.8z", fill: D.supFrame }),
        hub: h("circle", { r: r1(r * 0.2), fill: D.supAlu })
      };
    });
    // what it carries: a pallet (its left end at x 0, its foot at y 0) with four of the supplier's plain cartons
    fk.load = [h("path", { d: palletD(0), fill: D.supPallet }), crates([[0.8, 4.8, 13, 11.4], [14.2, 4.8, 13, 11.4], [0.8, 16.2, 13, 10], [15, 16.2, 10, 8]])];

    return _supMemo[mk] = {
      at: "translate(" + x + ", " + y + ") scale(" + scale + ") translate(" + (-OX) + ", " + (-G) + ")",
      back: h("g", { "data-cache": "supplier-" + mk, "data-box": "-44 14 416 274" }, out),
      front: h("g", { "data-cache": "supdock-" + mk, "data-box": "226 182 158 100" }, front),
      fk: fk, ground: G, rackX: RKX, rackFoot: RKF,
      clip: h("clipPath", { id: "wSupDoor" }, h("rect", { x: DX, y: DY, width: DW, height: DH }))
    };
  }

  /* The supplier's forklift works the rack just inside the door: a round of 24.2 s on the ambient clock (t in
     seconds). It comes in from the hall with a pallet of cartons, raises it, sets it on the rack's middle
     beams, backs off, lowers its forks and reverses away; on its next visit it comes in empty and takes the
     pallet down again. So the rack is back where it began when the loop closes, and nothing ever pops.
     x is its front axle (building units), L the height of the fork tops (its own units); every move starts
     and stops with no jolt.
     The round is set to scene 01: the forklift is on its way in as the scene opens, lifts its pallet behind the
     line of cartons while the truck is loaded, and sets it on the rack and backs off while the scene holds
     (the rack is at the right of the door, which is the part a phone still shows by then). */
  var SUP_ROUND = 24.2;
  function supForkPose(t) {
    var T = SUP_ROUND, H = T / 2, u = ((t + 0.5) % T + T) % T;
    var S = function (a, b) { var k = clamp01((u - a) / (b - a)); return k * k * k * (k * (6 * k - 15) + 10); };
    return {
      u: u,
      x: 190 + 75.38 * (S(0, 3.5) - S(9.7, 12.1) + S(H, H + 3.5) - S(H + 9.7, H + 12.1)) + 28.5 * (S(5.5, 6.9) - S(7.3, 8.5) + S(H + 5.5, H + 6.9) - S(H + 7.3, H + 8.5)),
      L: 8 + 43.3 * S(3.1, 5.7) - 2.5 * S(6.9, 7.4) - 40.8 * S(8.3, 9.9) + 40.8 * S(H + 3.1, H + 5.7) + 2.5 * S(H + 6.9, H + 7.4) - 43.3 * S(H + 8.3, H + 9.9)
    };
  }
  function SupplierBuilding(p) {
    var x = p.x, y = p.y, scale = p.scale == null ? 1.9 : p.scale, t = p.time || 0;
    var art = supplierArt(x, y, scale), fk = art.fk, K = SUP_FORK, G = art.ground, H = SUP_ROUND / 2;
    // the forklift: its weight shows as a small pitch from its own acceleration while the forks are low
    var q = supForkPose(t), e = 0.05, acc = (supForkPose(t - e).x - 2 * q.x + supForkPose(t + e).x) / (e * e);
    var tilt = Math.max(-1.3, Math.min(1.3, -acc * 0.011)) * clamp01((30 - q.L) / 15);
    var at = "translate(" + q.x.toFixed(2) + ", " + G + ") scale(" + K + ")", rot = "rotate(" + tilt.toFixed(3) + " -16 -7)";
    var turn = function (r) { return "rotate(" + ((q.x / (r * K) * 57.2958) % 360).toFixed(1) + ")"; };
    // the pallet rides the forks, except while it stands in the rack (the forks set it down and pick it up at the same point)
    var inRack = q.u >= 6.9 && q.u < H + 7.3, foot = !inRack ? q.L - 3.5 : (q.u <= 7.4 || q.u >= H + 6.9) ? Math.max(q.L - 3.5, art.rackFoot) : art.rackFoot;
    var loadAt = inRack ? "translate(" + art.rackX + ", " + G + ") scale(" + K + ") translate(0, " + (-foot).toFixed(2) + ")" : at + " " + rot + " translate(11.3, " + (-foot).toFixed(2) + ")";
    var wheel = function (i, cx) {
      var w = fk.wheel[i], r = i ? 6 : 7.5;
      return h("g", { transform: "translate(" + cx + ", " + (-r) + ")" }, w.tyre, h("g", { transform: turn(r) }, w.bar), w.hub);
    };
    return h("g", { transform: art.at },
      h("defs", null, art.clip),
      art.back,
      h("g", { clipPath: "url(#wSupDoor)" },
        h("rect", { x: (q.x - 42).toFixed(2), y: G - 4.2, width: 52, height: 4.2, fill: DAY.supInFloor }),
        h("g", { transform: at },
          h("g", { transform: rot },
            fk.body,
            h("rect", { x: 5.3, y: (-(67.2 + (q.L - 8) * 0.5)).toFixed(2), width: 2.4, height: 54, fill: DAY.supFkMastLit, stroke: COLORS.ink, strokeWidth: 0.8 }),
            fk.mast,
            h("g", { transform: "translate(0, " + (-q.L).toFixed(2) + ")" }, fk.carriage)),
          wheel(0, 0), wheel(1, -33)),
        h("g", { transform: loadAt }, fk.load)),
      art.front
    );
  }
//== REPLACE from "  function Parcel(p) {" to "  /* ---- scenery.tsx ---- */"
//== REPLACE from "  function parcelPose(t, from, to, groundY) {" to "  /* ---- round 2 street furniture ---- */"
  /* Scene 01: cartons riding the supplier's roller conveyor into the truck (world coordinates). One even flow:
     three cartons stand waiting in the open door; the line starts from rest as the truck's rear door swings
     open, runs at V px a frame and comes to rest again. Five cartons, evenly spaced, cross the truck's rear
     plane (every crossing inside T_WORLD.parcels, after the door is open and before it closes), and one more
     comes to rest where the first one stood, ready for the next load.
     The scene draws the list twice: under the truck from the door's left jamb to where the truck's rear
     stands (so the truck drives in over the cartons that wait), and over the truck's open rear door, cut at
     its rear plane (so a carton goes into the truck). */
  function supplierJambX() { return SUPPLIER_X + (228 - 24) * B_SCALE; }
  function SupplierCartons(frame) {
    var V = 4.8, A = 12, GAP = 63, N = 5, ts = 68, rear = TRUCK_PARK_1;
    var X0 = SUPPLIER_X + (280 - 24) * B_SCALE + GAP;                 // the lead carton waits one gap right of the door's centre line
    var te = ts + A / 2 + (rear + 25 + (N - 1) * GAP - X0) / V;       // the line starts to slow when the last carton is inside the truck
    var ramp = function (tau) { if (tau <= 0) return 0; if (tau >= A) return tau - A / 2; var u = tau / A; return A * (u * u * u - u * u * u * u / 2); };
    var lead = X0 + V * (ramp(frame - ts) - ramp(frame - te)), y = (GROUND - 8.4 * B_SCALE).toFixed(2), lags = [];
    for (var i = 0; i < N; i++) lags.push(i * GAP);
    lags.push(V * (te - ts));                                         // the one that stays ends where the lead began
    return lags.map(function (lag) { return h("g", { transform: "translate(" + (lead - lag).toFixed(2) + ", " + y + ")" }, parcelArt(50)); });
  }

//== REPLACE from "    var dock = { x: SUPPLIER_X" to "    var shutter = function (i)"
    // scene 01's cartons on the supplier's conveyor; the strip in which they are drawn again over the truck
    // opens only once the truck has all but stopped (nothing stands there then, so nothing shows)
    var supCartons = SupplierCartons(frame), supOver = 58 * clamp01((frame - 56) / 4);
//== REPLACE from "          h(\"clipPath\", { id: \"clipT1\" }" to "          // the conveyor cartons show from their dock's left jamb on"
          // scene 01's cartons: under the truck they show from the supplier's left jamb to where the truck's rear stands; over the truck's open door they are cut at its rear plane
          h("clipPath", { id: "wSupLine" }, h("rect", { x: supplierJambX(), y: -2000, width: TRUCK_PARK_1 - supplierJambX(), height: 4000 })),
          h("clipPath", { id: "clipT1" }, h("rect", { x: (truck1X - supOver).toFixed(2), y: -2000, width: supOver.toFixed(2), height: 4000 })),
//== REPLACE from "          SupplierBuilding({ x: SUPPLIER_X" to "          Warehouse({ x: WAREHOUSE_X"
          SupplierBuilding({ x: SUPPLIER_X, y: GROUND, scale: B_SCALE, time: skyTime }),
          h("g", { clipPath: "url(#wSupLine)" }, supCartons),
//== REPLACE from "          h(\"g\", { clipPath: \"url(#clipT1)\" }," to "          // cartons ride the dock conveyors into the three trucks"
          h("g", { clipPath: "url(#clipT1)" }, supCartons),
