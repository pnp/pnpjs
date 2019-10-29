import { GraphRest } from "../rest";
import { Subscriptions, ISubscriptions } from "./types";

export {
    ISubscription,
    ISubAddResult,
    ISubscriptions,
    Subscription,
    Subscriptions,
} from "./types";

declare module "../rest" {
    interface GraphRest {
        readonly subscriptions: ISubscriptions;
    }
}

Reflect.defineProperty(GraphRest.prototype, "subscriptions", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphRest) {
        return Subscriptions(this);
    },
});
