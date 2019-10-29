import { addProp } from "@pnp/odata";
import { _Web } from "../webs/types";
import { UserCustomActions, IUserCustomActions } from "./types";

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
