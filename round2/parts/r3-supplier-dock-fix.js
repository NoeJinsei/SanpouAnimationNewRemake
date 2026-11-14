/* Scene 01, the supplier's cartons: the window that draws them over the truck's open rear door followed the
   truck when it pulled away, so the cartons already loaded (they rest in world coordinates beyond the rear
   plane) showed in mid-air behind the departing truck. The window now ends where the truck's rear stands
   while it is parked, so it closes as the truck leaves and nothing inside the truck is ever drawn again. */

//== REPLACE from "          h(\"clipPath\", { id: \"clipT1\" }" to "          // the conveyor cartons show from their dock's left jamb on"
          h("clipPath", { id: "clipT1" }, h("rect", { x: (truck1X - supOver).toFixed(2), y: -2000, width: Math.max(0, Math.min(truck1X, TRUCK_PARK_1) - truck1X + supOver).toFixed(2), height: 4000 })),
