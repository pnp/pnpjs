import { addProp } from "@pnp/queryable";
import { _List } from "../lists/types.js";
import { UserCustomActions, IUserCustomActions } from "./types.js";

declare module "../lists/types" {
    interface _List {
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
