# How the map should sit against the desktop band (Opus, 2026-11-16)

The owner was offered two answers: keep the 36 px lift, or make the map 13 % smaller. I built both
again from the current `round2/js`, measured them, and built a third that neither of them is.

| | A  keep 36 px | B  13 % smaller | C  89 px up | **E  89 px up + 新潟 moved** |
|---|---|---|---|---|
| band over the hub | 15 % | 0 % | 0 % | **0 %** |
| band over 東京 | 19 % | 3 % | 4 % | **4 %** |
| 新潟 clears the phone's buttons by | 10 px | 10 px | **behind them** | **17 px** |
| map at full size | yes | **no** | yes | **yes** |

- A = `round2` (the working copy). B = `r7-map-lift-opt-shrink.js`. C = `r7-map-lift-opt-high.js`.
- E = C plus `MAP_LABEL.NIIGATA` moved from (397.0, 552.7) to (376.0, 592.0) with
  `at: [397.0, 552.7]` so its wipe is unchanged. Trial parts are in the session scratchpad; the
  change is two lines.

## Why B (13 % smaller) is the wrong one

The map truck was just redrawn at 1.5x *because* its parts were under 3 stage px and it read as a
pill. Shrinking the map 13 % is the same as putting the truck back to 1.30x — next door to the
1.25x version that was rejected one commit earlier for exactly this. At 1 u = 1.417 px instead of
1.632:

| | now | 13 % smaller | floor |
|---|---|---|---|
| gap between box and cab | 3.18 px | **2.76 px** | 3 |
| tyre showing past the body | 3.11 px | **2.70 px** | 3 |
| windscreen | 3.26 px | **2.83 px** | 3 |
| depot card text (`CARD_F` 9 u) | 14.7 px | 12.8 px | — |

The depot card text goes from 9.3 to 8.1 screen px on a phone.

## Why E works

新潟's name moves down into the open part of Niigata's own land, west of its place dot, so it sits
beside the dot and the truck instead of floating far above them (`e-niigata-zoom.jpg`). It never
meets the truck or the corridor at any moment of the scene (`E-through-the-scene.jpg`), and
`check-viewer` on it is 0 console errors.

## Pictures

| file | what |
|---|---|
| `desktop.jpg` | A, B, C at the desktop crop |
| `phone.jpg` | A, B, C at the phone crop |
| `moved-name.jpg`, `moved-name-desktop.jpg` | the two placements of 新潟 tried (D and E) |
| `A-vs-E-phone.jpg` | the recommendation against what is in the working copy |
| `e-niigata-zoom.jpg` | 新潟 in its new place, magnified |
| `E-through-the-scene.jpg` | option E at 22.4 to 27.2 s on a phone |
