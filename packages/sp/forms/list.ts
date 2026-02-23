import { addProp } from "@pnp/queryable";
import { _List } from "../lists/types.js";
import { Forms, IForms } from "./types.js";

declare module "../lists/types" {
    interface _List {
        readonly forms: IForms;
    }
    interface IList {
        readonly forms: IForms;
    }
}

addProp(_List, "forms", Forms);
