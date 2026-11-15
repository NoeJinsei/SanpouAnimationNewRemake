//== REPLACE from "  /* Every name sits inside its own shape, clear of the routes, the depots and the other names; the spots" to "  var ROUTE_ORDER = ["
  /* Every name sits inside its own shape, clear of the routes, the depots and the other names; the spots
     were found by searching each polygon for the point furthest from its border that also clears
     everything else (tools/… scratch search, 2026-11-14).
     One size for the two-character names: 15. 東京 and 埼玉, the two prefectures that hold the head office
     and both branch offices, were 11.5 (the smallest type on the map, about 12 px on a phone); they are 15
     like the rest now, each still inside its own shape (searched again, 2026-11-15: at 15 a name box stands
     3.2 units or more from its own border and from everything else; at 16 it does not fit).
       東京  in the wide part of west Tokyo, 3.2 u inside the border above and below; the Kanagawa truck
             passes its lower right corner without touching it
       埼玉  in the open west of Saitama, above the 入間 name card and left of where the Saitama truck stands
     at = the point a prefecture's wipe is aimed from the head office. It is where the name stood when the
     wipe was set, and it stays there when a name moves, so the wipe is exactly what it was. */
  var MAP_LABEL = {
    TOKYO: { x: 463.8, y: 792.8, f: 15, at: [456.4, 791.3] }, SAITAMA: { x: 418.7, y: 743.7, f: 15, at: [425.0, 733.8] },
    KANAGAWA: { x: 451.5, y: 830.6, f: 14 }, CHIBA: { x: 565.7, y: 851.7, f: 15 },
    IBARAKI: { x: 581.4, y: 715.6, f: 15 }, TOCHIGI: { x: 523.7, y: 628.1, f: 15 },
    GUNMA: { x: 411.4, y: 665.9, f: 15 }, NIIGATA: { x: 397.0, y: 552.7, f: 15 },
  };
//== REPLACE from "      info[c.en].deg = Math.atan2(L.y - HUB.y, L.x - HUB.x) * 180 / Math.PI;" to "    });"
      info[c.en].deg = Math.atan2((L.at ? L.at[1] : L.y) - HUB.y, (L.at ? L.at[0] : L.x) - HUB.x) * 180 / Math.PI;
