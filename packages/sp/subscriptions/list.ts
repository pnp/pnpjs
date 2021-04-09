import { addProp } from "@pnp/queryable";
import { _List } from "../lists/types.js";
import { Subscriptions, ISubscriptions } from "./types.js";

declare module "../lists/types" {
    interface _List {
        readonly subscriptions: ISubscriptions;
    }
    interface IList {
        /**
         * Gets the collection of webhooks created for this list
         *
         */
        readonly subscriptions: ISubscriptions;
    }
}

addProp(_List, "subscriptions", Subscriptions);
