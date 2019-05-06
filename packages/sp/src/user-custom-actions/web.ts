import { addProp } from "@pnp/odata";
import { _Web } from "../webs/types";
import { UserCustomActions, IUserCustomActions } from "./types";

/**
* Extend Web
*/
declare module "../webs/types" {
    interface _Web {
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
