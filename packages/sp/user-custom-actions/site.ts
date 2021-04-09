import { addProp } from "@pnp/queryable";
import { _Site } from "../sites/types.js";
import { UserCustomActions, IUserCustomActions } from "./types.js";

declare module "../sites/types" {
    interface _Site {
        readonly userCustomActions: IUserCustomActions;
    }

    interface ISite {
        /**
         * Get all custom actions on a site collection
         */
        readonly userCustomActions: IUserCustomActions;
    }
}

addProp(_Site, "userCustomActions", UserCustomActions);
