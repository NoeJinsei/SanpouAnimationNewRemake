//== REPLACE from "    return { t: tag, a: attrs, c: children };" to "  /* --------------------------------------------- in-place stage patching */"
    // Round 7: a group marked data-cache is a finished drawing that only ever moves as a whole (a building, a
    // cloud, Mt Fuji, a depot). It is given its own layer, so the browser draws it once and afterwards only
    // moves it or leaves it alone. Before, every frame in which anything moved was drawn again in full, still
    // scenery included, and that redrawing, not the script, was what the remake cost over the original
    // (measured with tools/trace-side.mjs: 13.6 ms a frame of raster work in scene 02 against 0.4 ms).
    // (a drawing that stands in a picture which already has its own layer says so with data-layer, and gets none)
    if (attrs["data-cache"] != null && attrs.style == null && attrs["data-layer"] == null) attrs.style = "will-change:transform";
    // A single filled shape's own opacity is written as fill-opacity: the picture is the same, and the browser
    // then needs no effect of its own for the shape (each one was a separate step in its paint and layer work:
    // scenes 01 and 02 had 150 of them, lit windows mostly). Shapes with a stroke, groups and text keep opacity.
    if (attrs.opacity != null && attrs.stroke == null && attrs["fill-opacity"] == null && (tag === "rect" || tag === "circle" || tag === "polygon" || tag === "path" || tag === "ellipse")) { attrs["fill-opacity"] = attrs.opacity; delete attrs.opacity; }
    return { t: tag, a: attrs, c: children };
  }
//== REPLACE from "    el.__t = v.t; el.__a = v.a;" to "    for (var i = 0; i < v.c.length; i++) el.appendChild(createNode(v.c[i], inSvg));"
    el.__t = v.t; el.__a = v.a; el.__v = v;
//== REPLACE from "      if (d.nodeType !== 1 || d.__t !== v.t) { parent.replaceChild(createNode(v, svg), d); continue; }" to "      var oa = d.__a, na = v.a, k;"
      if (d.nodeType !== 1 || d.__t !== v.t) { parent.replaceChild(createNode(v, svg), d); continue; }
      // the very same description as the one this node was last patched to (a drawing built once and kept):
      // nothing in it or under it can differ, so it is not walked again (round 7)
      if (d.__v === v) continue;
      d.__v = v;
//== REPLACE from "        h(\"g\", { opacity: 0.5 - recede * 0.3 }," to "        SkyAir(),"
//== REPLACE from "        range(30, function (i) {" to "        FloatingParticles({ seed: \"network\""
        // (30 circles that were never seen stood here: gone, round 7)
//== REPLACE from "          range(26, function (i) {" to "          h(\"ellipse\", { cx: 960, cy: 1000, rx: 1150, ry: 150, fill: \"url(#nHalo)\" }),"
          // (26 more unseen circles and a block that drew nothing stood here: gone, round 7)
