import { addProp } from "@pnp/odata";
import { _Site } from "../sites/types";
import { UserCustomActions, IUserCustomActions } from "./types";

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
