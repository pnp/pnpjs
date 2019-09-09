import { addProp } from "@pnp/odata";
import { _List } from "../lists/types";
import { Fields, IFields } from "./types";

/**
* Extend List
*/
declare module "../lists/types" {
  interface _List {
    /**
   * This list's collection of fields
   */
    readonly fields: IFields;
  }
  interface IList {
    /**
   * This list's collection of fields
   */
    readonly fields: IFields;
  }
}

addProp(_List, "fields", Fields);
