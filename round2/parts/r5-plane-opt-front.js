//== REPLACE from "      q.back = q.x >= P.HAND;" to "    } else q = PLANE_AWAY;"
      // OPTION "front" (2026-11-15, not picked): the climb exactly as it was (slope 0.56), but the plane is
      // never handed to the slot behind Tokyo Tower: it stays in the front slot and crosses in front of the
      // Tower's lattice (y about 440 .. 560 at the Tower's x) instead of behind it.
