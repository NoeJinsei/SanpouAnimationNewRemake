// Where the map's subject sits against the dark band the site lays over the foot of the hero on a desktop.
//   node tools/map-band.mjs <side> [<side> ...]
// For each side: the stage y of the hub, the three name cards and the name 東京, and how much of the band's
// darkness is over each (the band is the site's: 0 at 68 % of the hero's height, .5 at 96 px from the foot,
// .8 at the foot; a 1440 x 900 desktop shows stage y 60..1020 in a hero 720 px high). Also how far the name
// 新潟 clears the two buttons on a 390 px phone at the end of the scene's hold (stage px and screen px).
import fs from "node:fs";
import vm from "node:vm";
const sides = JSON.parse(fs.readFileSync("sides.json", "utf8")).sides;
for (const id of process.argv.slice(2)) {
  const side = sides.find((s) => s.id === id);
  const ctx = { console }; ctx.window = ctx; ctx.globalThis = ctx; vm.createContext(ctx);
  let src = side.scripts.map((f) => fs.readFileSync(side.base + f, "utf8")).join("\n;\n");
  // the map's numbers are private to the scene file: read them out with one line added at its end
  src = src.replace(/root\.JourneyPort\._scenes = \{/, "root.__map = { box: MAP_BOX, init: mapInit(), bases: MAP_BASES, label: MAP_LABEL, cardH: CARD_H };\n  root.JourneyPort._scenes = {");
  vm.runInContext(src, ctx);
  const { box, init, bases, label, cardH } = ctx.__map, B = init.bounds;
  const k = Math.min(box[2] / B[2], box[3] / B[3]), oy = (box[3] - B[3] * k) / 2;
  const Y = (y) => box[1] + oy + (y - B[1]) * k;
  const band = (y) => { const s = (y - 60) * 0.75, b = 720 - s; return b >= 230.4 ? 0 : b >= 96 ? 0.5 * (230.4 - b) / 134.4 : 0.5 + 0.3 * (96 - b) / 96; };
  const row = (name, y0, y1) => `  ${name.padEnd(14)} stage y ${Y(y0).toFixed(0)}${y1 != null ? ".." + Y(y1).toFixed(0) : ""}`.padEnd(40) + `band ${(100 * band(Y(y1 ?? y0))).toFixed(0)} %`;
  console.log(`${id}: map box ${JSON.stringify(box)}, 1 u = ${k.toFixed(3)} px, band from stage y ${(60 + (720 - 230.4) / 0.75).toFixed(0)}`);
  const hq = bases.find((b) => b.hq);
  console.log(row("hub (HQ foot)", hq.by));
  for (const b of bases) console.log(row("card " + b.id, b.card[1], b.card[1] + cardH));
  console.log(row("name 東京", label.TOKYO.y - label.TOKYO.f * 0.5, label.TOKYO.y + label.TOKYO.f * 0.5));
  // phone, end of the hold: scale 0.6296 x 1.03, the view's top at stage y 550 - 524.3; buttons end at screen y 209
  const top = Y(label.NIIGATA.y - label.NIIGATA.f * 0.5), sc = 0.6296 * 1.03, scr = (top - (550 - 540 / 1.03)) * sc;
  console.log(`  name 新潟       top at stage y ${top.toFixed(0)}: ${(scr - 209).toFixed(0)} px under the buttons on a phone (${((scr - 209) / sc).toFixed(0)} stage px)`);
}
