import { SPRest } from "../src/rest";

import "../src/items";
import "../src/lists";
import "../src/sites";
import "../src/webs";

export * from "../src/items";
export * from "../src/lists";
export * from "../src/sites";
export * from "../src/webs";
export * from "../src/sp";

export const sp = new SPRest();
