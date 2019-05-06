import { addProp } from "@pnp/odata";
import { _List } from "../lists/types";
import { Subscriptions, ISubscriptions } from "./types";

/**
* Extend List
*/
declare module "../lists/types" {
    interface _List {
        readonly subscriptions: ISubscriptions;
    }
    interface IList {
        readonly subscriptions: ISubscriptions;
    }
}

addProp(_List, "subscriptions", Subscriptions);
