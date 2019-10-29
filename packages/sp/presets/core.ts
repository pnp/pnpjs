import { SPRest } from "../rest";

import "../items";
import "../lists";
import "../sites";
import "../webs";

export * from "../items";
export * from "../lists";
export * from "../sites";
export * from "../webs";
export * from "../index";

export const sp = new SPRest();
