import { addProp } from "@pnp/queryable";
import { _Site } from "../sites/types.js";
import { IOpenExtensions, OpenExtensions } from "./types.js";

declare module "../sites/types" {
    interface _Site {
        readonly extensions: IOpenExtensions;
    }
    interface ISite {
        readonly extensions: IOpenExtensions;
    }
}
addProp(_Site, "extensions", OpenExtensions);
