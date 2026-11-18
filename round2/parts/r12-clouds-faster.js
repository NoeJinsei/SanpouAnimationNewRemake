//== REPLACE from "     SKY_SWAY = how far each plane goes (px): its fastest moment is the old steady drift (3.2 and 7 px/s). */" to "  // each list knows its own name (w-far, t-near, n-landFar ...), which CloudField writes on its group for the check"
     SKY_SWAY = how far each plane goes (px). Its fastest moment is SKY_SWAY x pi / LOOP px a second.
     Round 12 (the owner: "Cloud, a bit faster"): 75 and 165 px, which is 4.5 and 10 px/s at their fastest,
     1.4 times the steady drift they had before the loop (round 11 had 53 and 116 px: 3.2 and 7 px/s).
     Still one sine a loop. Two would double the speed with no more travel, but the clouds would turn back
     twice as often, and the turn is the one thing about them that is not real: further is better than
     more often. At the far end the big cloud on the left stands 71 px over the picture's edge (it was 22),
     every cloud is 184 px or more above the roofs under it at every second of the loop, the small one comes to
     rest 20 px to the right of Tokyo Tower's top deck (it was 65), and all of them move away from the sun. */
  var SKY_SWAY = [75, 165];
