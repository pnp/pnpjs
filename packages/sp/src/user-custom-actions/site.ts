import { addProp } from "@pnp/odata";
import { _Site } from "../sites/types";
import { UserCustomActions, IUserCustomActions } from "./types";

/**
* Extend Web
*/
declare module "../sites/types" {
    interface _Site {
        readonly userCustomActions: IUserCustomActions;
    }
    interface ISite {
        readonly userCustomActions: IUserCustomActions;
    }
}

addProp(_Site, "userCustomActions", UserCustomActions);
