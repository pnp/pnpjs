import { SPRest } from "../rest.js";

import "../items/index.js";
import "../lists/index.js";
import "../sites/index.js";
import "../webs/index.js";

export * from "../items/index.js";
export * from "../lists/index.js";
export * from "../sites/index.js";
export * from "../webs/index.js";
export * from "../index.js";

export const sp = new SPRest();
