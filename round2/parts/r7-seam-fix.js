//== REPLACE from "    // the seam from scene 02: `lead` is how far the camera has come beyond its steady 9 px a frame since" to "    var titleEnter = clamp01((frame - 10) / 36);"
    // the seam from scene 02: `ahead` is how far the camera still has to come before it rides with the convoy.
    // The road's scroll is that much short of its steady 9 px a frame, so once the camera has landed the
    // scene is exactly the picture it always was at that moment (the clouds were composed against it).
    var SPEED = 9, ahead = seam23X(SEAM23.m1) - seam23X(TRANSIT_START + frame), scroll = frame * SPEED - ahead;
//== REPLACE from "    var xFg = \"translate(\" + (-((scroll * 1.25) % 175)).toFixed(2) + \", 0)\";" to "    var convoy = ["
    var xFg = "translate(" + (-((((scroll * 1.25) % 175) + 175) % 175)).toFixed(2) + ", 0)";
