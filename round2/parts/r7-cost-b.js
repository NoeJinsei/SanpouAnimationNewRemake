//== INSERT before "  /* ---- Scene12World.tsx ---- */"
  /* ---- A scene is a stack of pictures (round 7) ----
     A scene used to be ONE svg. The browser walks the whole of an svg to paint it whenever anything in it has
     changed, and something always has (a cloud, a truck's idle, a lit window): so every frame it walked the
     rows of buildings too, which never change. Now a scene is a short stack of pictures, back to front in the
     same order as before, so the picture is the same:
       a LIVE picture   an svg of its own with what moves or changes in it (PIC);
       a STILL picture  stillPic(x, ...): finished drawings (the rows of the city) in an svg of their own, in a
                        layer of its own. It is drawn once. The camera moves it by moving the layer (x px), which
                        costs nothing; a frame in which only other pictures change does not touch it at all.
     Rows in a still picture are marked with stillRows() where they are made, before any building of theirs is
     drawn: their buildings then get no layer each (the picture has one). ids are the document's, so a clip or a gradient defined in the first
     picture's defs serves the others too. */
  var PIC = { width: 1920, height: 1080, viewBox: "0 0 1920 1080", xmlns: "http://www.w3.org/2000/svg", style: { position: "absolute", left: 0, top: 0 } };
  var PIC_STILL = { width: 1920, height: 1080, viewBox: "0 0 1920 1080", xmlns: "http://www.w3.org/2000/svg", style: { position: "absolute", left: 0, top: 0, overflow: "visible" } };
  function stillPic(x, a, b) {
    return h("div", { style: { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, willChange: "transform", transform: "translate3d(" + x.toFixed(2) + "px,0,0)" } },
      h("svg", PIC_STILL, a, b));
  }
  function stillRows(rows) { for (var i = 0; i < rows.length; i++) rows[i].still = true; }
  // the street's paving, kerb, road and lamps: one finished drawing with a layer of its own
  function streetBase() { var A = streetArt(); return A.base || (A.base = h("g", { "data-cache": "street-base", "data-box": "-400 600 6600 400" }, A.ground, A.lamps)); }
//== REPLACE from "      \"data-city\": it.t, \"data-roof\": row.baseY - it.h," to "      \"data-cache\": \"city-\" + [it.t, it.x, it.w, it.h, it.v, it.m, row.baseY, look.u, look.air].join(\"_\"), \"data-box\": c.box()"
      "data-city": it.t, "data-roof": row.baseY - it.h, "data-layer": row.still ? "row" : null,
//== REPLACE from "    A.poles = h(\"g\", null," to "      h(\"path\", { d: dW, fill: \"none\", stroke: D.wireFlat, strokeWidth: 2 }),"
    A.poles = h("g", { "data-cache": "street-poles", "data-box": (S.POLE_X0 - 30) + " " + (G - S.POLE_H - 12) + " " + ((S.POLE_N - 1) * S.POLE_GAP + 60) + " " + (S.POLE_H + 14) },
//== REPLACE from "    c.farLights = cityLights([c.farBack, c.far], -64, { sheen: [[1285, 0]] });" to "    c.nearLights = cityLights([c.nearBack, c.near], -104, {"
    stillRows([c.farBack, c.far, c.nearBack, c.near]);       // scenes 01 and 02 draw these four rows as still pictures
    c.farLights = cityLights([c.farBack, c.far], -64, { sheen: [[1285, 0]] });
//== REPLACE from "        h(\"g\", { transform: \"translate(\" + (-cam * 0.32) + \", 0)\" }," to "        h(\"g\", { transform: \"translate(\" + (-cam) + \", 0)\" },"
        h("g", { transform: "translate(" + (-cam * 0.32) + ", 0)" },
          CloudField(SKY_WORLD.near, 1, skyTime, 0),
          DayBirds({ set: "w", time: skyTime, shift: cam * 0.1, back: cam * 0.32 }))
      ),
      // the stack goes on (see "A scene is a stack of pictures"): the two far rows, still; what moves in front
      // of them and the far haze, live; the two near rows, still, with the cranes that stand between them
      stillPic(-cam * 0.32, CityRow(city.farBack, -cam * 0.32), CityRow(city.far, -cam * 0.32)),
      h("svg", PIC,
        h("g", { transform: "translate(" + (-cam * 0.32) + ", 0)" },
          CityCranes(city.far, skyTime), CityLights(city.farLights, skyTime),
          TokyoTower({ cx: 1560, baseY: GROUND, h: 770, time: time, opacity: 0.95 })),
        CityHaze("wHazeFar", GROUND, 0)),
      stillPic(-cam * 0.52, CityRow(city.nearBack, -cam * 0.52)),
      h("svg", PIC, h("g", { transform: "translate(" + (-cam * 0.52) + ", 0)" }, CityCranes(city.nearBack, skyTime))),
      stillPic(-cam * 0.52, CityRow(city.near, -cam * 0.52)),
      // the last live picture: the near row's lit windows, the poles, the near haze, the street and all that works on it
      h("svg", PIC,
        h("g", { transform: "translate(" + (-cam * 0.52) + ", 0)" }, CityLights(city.nearLights, skyTime), streetArt().poles),
        CityHaze("wHazeNear", GROUND, 1),
//== REPLACE from "          streetArt().ground, streetArt().lamps, streetArt().vending," to "          FloatingParticles({ seed: \"world-a\""
          streetBase(), streetArt().vending,
//== REPLACE from "        h(\"g\", { transform: \"translate(\" + (-cam * 1.07) + \", 0)\" }, streetArt().fence)" to "      ),"
        h("g", { "data-cache": "street-fence", transform: "translate(" + (-cam * 1.07) + ", 0)" }, streetArt().fence)
