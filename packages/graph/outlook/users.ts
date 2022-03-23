import { addProp } from "@pnp/queryable";
import { _User } from "../users/types.js";
import { Outlook, IOutlook } from "./types.js";

declare module "../users/types" {
    interface _User {
        readonly outlook: IOutlook;
    }
    interface IUser {
        readonly outlook: IOutlook;
    }
}

addProp(_User, "outlook", Outlook);
