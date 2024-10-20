import { addProp } from "@pnp/queryable";
import { _Site } from "../sites/types.js";
import { ITermStore, TermStore } from "./types.js";

declare module "../sites/types" {
    interface _Site {
        readonly termStore: ITermStore;
    }
    interface ISite {
        readonly termStore: ITermStore;
    }
}
addProp(_Site, "termStore", TermStore);
