/* Scene 04 is an infographic panel, not a landscape.
   Scenes 04 and 05 are one function: the sky, the sun, its shafts and the finale's clouds are drawn
   for both, and only the finale's world (Fuji, the city, the Tower, the airport) is gated by `recede`.
   So the map has always floated in the finale's sky.
   One flat pale rect, inserted directly under the finale's world and above everything sky, at opacity
   (1 - recede): while the map is up it covers the sky, the sun, the shafts, the clouds, the halo, the
   birds and the particles completely, and it fades out on exactly the curve the finale's world fades in
   on, so the sky arrives with scene 05 and the two never cross. The map itself is drawn later in the
   node list, so it sits on the panel.
   Nothing is removed, no timing moves, and the node list keeps its shape — one constant node is added.
   It needs a colour part spliced too: the colour comes from DAY.map.panel. */

//== INSERT before "        h(\"g\", { opacity: recede },"
        h("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: DAY.map.panel, opacity: (1 - recede).toFixed(3) }),
