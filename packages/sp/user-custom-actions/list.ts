import { addProp } from "@pnp/odata";
import { _List } from "../lists/types";
import { UserCustomActions, IUserCustomActions } from "./types";

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
