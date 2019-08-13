import { addProp } from "@pnp/odata";
import { _List } from "../lists/types";
import { UserCustomActions, IUserCustomActions } from "./types";

/**
* Extend Item
*/
declare module "../lists/types" {
    interface _List {
        /**
         * Get all custom actions on a list
         */
        readonly userCustomActions: IUserCustomActions;
    }

    interface IList {
        /**
         * Get all custom actions on a list
         */
        readonly userCustomActions: IUserCustomActions;
    }
}

addProp(_List, "userCustomActions", UserCustomActions);
