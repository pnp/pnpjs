import { GraphFI } from "../fi.js";
import { Subscriptions, ISubscriptions } from "./types.js";

export {
    ISubscription,
    ISubAddResult,
    ISubscriptions,
    Subscription,
    Subscriptions,
} from "./types.js";

declare module "../fi" {
    interface GraphFI {
        readonly subscriptions: ISubscriptions;
    }
}

Reflect.defineProperty(GraphFI.prototype, "subscriptions", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphFI) {
        return this.create(Subscriptions);
    },
});
