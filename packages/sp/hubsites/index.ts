import { SPRest } from "../rest";
import { HubSites, IHubSites } from "./types";

import "./site";
import "./web";

export {
    HubSite,
    HubSites,
    IHubSite,
    IHubSiteInfo,
    IHubSiteWebData,
    IHubSites,
} from "./types";

declare module "../rest" {
    interface SPRest {
        /**
         * Lists all of the subsites
         */
        readonly hubSites: IHubSites;
    }
}

Reflect.defineProperty(SPRest.prototype, "hubSites", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest) {
        return HubSites(this._baseUrl).configure(this._options);
    },
});
