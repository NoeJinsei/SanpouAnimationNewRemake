// Playwright lives in another project on this machine (see CLAUDE.md, "How to verify").
// launch() tries the bundled Chromium first and falls back to the installed Chrome.
import { createRequire } from "node:module";
const require = createRequire("C:/Users/RTX4070TI/Desktop/Logistics-Website-Animation/journey/verify/");
export const { chromium } = require("playwright");
export const { PNG } = require("pngjs");
export const pixelmatch = (() => { const m = require("pixelmatch"); return m.default || m; })();

export async function launch(opts = {}) {
  try { return await chromium.launch(opts); }
  catch (e) { return await chromium.launch({ ...opts, channel: "chrome" }); }
}
export const BASE = process.env.HERO_BASE || "http://127.0.0.1:8791";
