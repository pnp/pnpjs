import { addProp } from "@pnp/queryable";
import { _Site } from "../sites/types.js";
import { IPages, Pages } from "./types.js";

declare module "../sites/types" {
    interface _Site {
        readonly pages: IPages;
    }
    interface ISite {
        readonly pages: IPages;
    }
}

addProp(_Site, "pages", Pages);
