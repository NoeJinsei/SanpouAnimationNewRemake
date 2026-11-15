//== REPLACE from "       埼玉  in the open west of Saitama, above the 入間 name card and left of where the Saitama truck stands" to "     at = the point a prefecture's wipe is aimed from the head office. It is where the name stood when the"
       埼玉  in the open west of Saitama, 6 u above the 入間 name card and left of where the Saitama truck
             stands (1.5 u lower than before the hub was opened up: the card under it stands lower now)
//== REPLACE from "    TOKYO: { x: 463.8, y: 792.8, f: 15, at: [456.4, 791.3] }, SAITAMA: {" to "    KANAGAWA: { x: 451.5, y: 830.6, f: 14 }, CHIBA: {"
    TOKYO: { x: 463.8, y: 792.8, f: 15, at: [456.4, 791.3] }, SAITAMA: { x: 418.7, y: 745.2, f: 15, at: [425.0, 733.8] },
//== REPLACE from "  /* The three bases, each standing on its real place (map units; 1 u = 1.63 stage px)." to "  var CARD_F = 9, CARD_H = 12.5;"
  /* The three bases, each standing ON its real place (map units; 1 u = 1.63 stage px). No base has a place
     dot or a stub any more: the building is the mark.
       本社（板橋）   stands on its own point in the north of Tokyo: the point is under its roof, so the
                     seven routes come out from behind the head office (unchanged)
       志木営業所    stands on its point in Saitama: the point is at its door, 3 u under its base line
                     (unchanged; only its dot is gone)
       入間営業所    stands on its point in Saitama, the point 1 u right of its middle. It used to stand
                     18 u west of the point, joined to it by a stub, because the Saitama corridor runs over
                     the point; now the corridor simply passes behind the building, in at its lower right
                     corner and out through its roof, as a road passes behind a depot. Its base line is
                     4 u lower than 志木's: just low enough to hide the corridor where it goes in.
     So the two branch depots stand side by side, 5 u apart, with the head office in front of them to the
     right: one group of three buildings instead of three marks, two dots, a stub and a corridor threaded
     between them, and the west of Saitama is left open for its name and for the corridor's last stretch.
     Every corner of both branch depots is inside Saitama, the head office's base is inside Tokyo.
     The bases are only 16 u and 25 u apart, so a depot can be no wider than 18 u at rest. Each one
     therefore arrives ENLARGED (big) about its own place (px = the pivot on its base line; for 入間 its
     right wall, so that it grows away from 志木), lifted a little (lift) so it clears what is already
     down, and is set down as it eases to resting size; only one is ever enlarged at a time. 入間 arrives
     1.8 times its size, not 1.9: at 1.9, where it stands now, its roof would reach the 志木 name card.
     Measured every 10 ms of the arrival: no depot, card or name ever overlaps another. t0 = the frame its
     arrival starts.
     Cards: 本社 to the east (the open wedge between the Ibaraki and Chiba corridors), 入間 to the west,
     志木 on a short post above its roof, in the widest gap of the fan (two corridors pass behind it:
     there is no spot in Saitama next to 志木 that clears them all). card = [x, y, width], side = the edge
     it grows from: r = from its left edge rightwards, l = from its right edge leftwards, u = from the
     post outwards. */
  var MAP_BASES = [
    { id: "itabashi", nm: "本社（板橋）", hq: true, w: 23, cx: 508.5, by: 791.5, px: 505.4, big: 2.2, lift: [0, -2], t0: 24,
      card: [522.8, 778.6, 62], side: "r" },
    { id: "shiki", nm: "志木営業所", hq: false, w: 17.6, cx: 489.2, by: 766.5, px: 491.9, big: 2.0, lift: [0, -4], t0: 40,
      card: [460, 731.5, 53], side: "u", post: 489.2 },
    { id: "iruma", nm: "入間営業所", hq: false, w: 17.6, cx: 466.4, by: 770.6, px: 475.2, big: 1.8, lift: [-3.5, 0], t0: 56,
      card: [404.6, 757.1, 53], side: "l" },
  ];
//== REPLACE from "              var dk = easeOutCubic(clamp01((s.a + 3) / 4));               // the place lights up first" to "            MAP_BASES.map(function (b, j) {"
              // every base stands on its own place, so no place has a dot or a stub: the three nodes stay,
              // empty, so that the node list of the map is the shape it was
              return h("g", null,
                h("line", { x1: B.x, y1: B.y, x2: B.x, y2: B.y, stroke: C.ink, strokeWidth: 1.9, opacity: 0 }),
                h("circle", { cx: B.x, cy: B.y, r: 0, fill: C.dot }),
                h("circle", { cx: B.x, cy: B.y, r: 0, fill: C.ink }));
            }),
//== REPLACE from "                  back  (Saitama only) how far short of the dot it stops: the name 埼玉 lies beside the" to "                First seen, in order: Chiba, Gunma, Kanagawa, Niigata, Ibaraki, then Tochigi and Saitama,"
                  back  how far short of the dot it stops, if given. No corridor gives it now: every truck
                        stops where its box clears the dot (11 to 16 u short of it). Saitama's used to stop
                        24 u short, between the name 埼玉 and the 志木 name card; the name has moved
                        clear of the corridor's end, so the truck runs on to its place like the others.
//== REPLACE from "    SAITAMA:  { dep: 4.26, run: 1.60, stay: 0.20, fade: 0.36, runs: 1, back: 24 }," to "  };"
    SAITAMA:  { dep: 4.26, run: 1.60, stay: 0.20, fade: 0.36, runs: 1 },
