/* Rejected option for the plane's climb (2026-11-15): the plane simply keeps the speed it had at lift-off
   (95 px/s over the ground) and gathers speed again once its nose is behind the phone's buttons.
   On a phone half or more of it is in open sky for about 3 s: short of the 4 s that was asked for. */

//== REPLACE from "    CLIMB_V: 74, EASE: 1.5" to "  PLANE.CLIMB = Math.atan"
    CLIMB_V: 95, EASE: 1.5, LAG: 0.25, ACC_AT: 6.5, ACC: 62, ACC_IN: 1 };
