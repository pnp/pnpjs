import { GraphRest } from "../rest.js";
import { Subscriptions, ISubscriptions } from "./types.js";

export {
    ISubscription,
    ISubAddResult,
    ISubscriptions,
    Subscription,
    Subscriptions,
} from "./types.js";

declare module "../rest" {
    interface GraphRest {
        readonly subscriptions: ISubscriptions;
    }
}

Reflect.defineProperty(GraphRest.prototype, "subscriptions", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphRest) {
        return this.create(Subscriptions);
    },
});
