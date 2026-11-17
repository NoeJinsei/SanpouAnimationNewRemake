//== REPLACE from "    doorClose: [172, 188], truckDepart: [188, 262]," to "    shutters: [266, 316], loadParcels: [308, 388], loadCardIn: 296, loadDataIn: [314, 392],"
    // (round 11) the rear doors are shut by the frame each scene holds on (185 and 391). Their closing used to run
    // three and two frames past it (doorClose [172, 188], doorsClose2 [382, 393]), so the hold stopped every door
    // dead a sixth open, left it ajar for the whole hold, and it shut as the truck drove off.
    doorClose: [169, 185], truckDepart: [188, 262],
//== REPLACE from "    doorsClose2: [382, 393], departs2: [414, 403, 392], departDur2: 50," to "  };"
    doorsClose2: [380, 391], departs2: [414, 403, 392], departDur2: 50,
//== REPLACE from "    var truck1X = truck1At(frame);" to "    var truck1M = truckMotion(truck1Run, frame);"
    // (round 11) the first truck comes in already driving. For the film's first eight frames (0.22 s) it used to
    // stand still with its cab inside the left edge of a desktop's picture, and then set off at full speed in one
    // frame. Before its arrival begins it is now drawn where the weight model always had it: running on at the
    // arrival's opening speed, so at frame 0 it is off the picture, and from frame 8 on nothing has changed.
    var truck1Early = frame < T_WORLD.truckIn[0], truck1X = truck1Early ? truck1Run(frame) : truck1At(frame);
    var truck1Moving = truck1Early || (arriveK > 0.02 && arriveK < 0.98) || (departK > 0.02 && departK < 0.98) || departDelta(0) > 1;
