/* Rejected option for the plane's climb (2026-11-15): slower still, 60 px/s over the ground.
   On a phone it stays in open sky longer (about 5 s), but it moves less than half its own length a
   second up a 43 degree path, slower than it rolled on the runway: it hangs. */

//== REPLACE from "    CLIMB_V: 74, EASE: 1.5" to "  PLANE.CLIMB = Math.atan"
    CLIMB_V: 60, EASE: 1.5, LAG: 0.25, ACC_AT: 10.2, ACC: 62, ACC_IN: 1 };
