/* The map's plate edge, flattened. The map was drawn as an object with thickness: the same land
   silhouette repeated underneath in a dark slate (#5b7489) and pushed down a few units, which is a
   receding side face and the last place the oblique look survives after the flat pass. Filling it with
   the land's own seam grey leaves the silhouette and its settling animation exactly as they are, but the
   land stops standing up off the sky like a cut-out sticker. The contact shadow and the name cards keep
   using C.rim and C.cast, so nothing else changes.
   Splice AFTER a map colour part, since it only touches the plate's one line. */

//== REPLACE from "      rim: h(\"path\", { d: all, fill: C.rim })," to "      land: h(\"path\", { d: all, fill: C.land,"
      rim: h("path", { d: all, fill: C.landSeam }),
