import { addProp } from "@pnp/queryable";
import { _Site } from "../sites/types.js";
import { IPermissions, Permissions } from "./types.js";

declare module "../sites/types" {
    interface _Site {
        readonly permissions: IPermissions;
    }
    interface ISite {
        readonly permissions: IPermissions;
    }
}

addProp(_Site, "permissions", Permissions);
