import { addProp } from "@pnp/queryable";
import { _Web } from "../webs/types.js";
import { UserCustomActions, IUserCustomActions } from "./types.js";

declare module "../webs/types" {
    interface _Web {
        /**
         * Gets a newly refreshed collection of the SPWeb's SPUserCustomActionCollection
         */
        readonly userCustomActions: IUserCustomActions;
    }

    interface IWeb {
        /**
         * Gets a newly refreshed collection of the SPWeb's SPUserCustomActionCollection
         */
        readonly userCustomActions: IUserCustomActions;
    }
}

addProp(_Web, "userCustomActions", UserCustomActions);
