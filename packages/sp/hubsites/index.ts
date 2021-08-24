import { SPRest2 } from "../rest-2.js";
import { HubSites, IHubSites } from "./types.js";

import "./site.js";
import "./web.js";

export {
    HubSite,
    HubSites,
    IHubSite,
    IHubSiteInfo,
    IHubSiteWebData,
    IHubSites,
} from "./types.js";

declare module "../rest" {
    interface SPRest {
        /**
         * Lists all of the subsites
         */
        readonly hubSites: IHubSites;
    }
}

Reflect.defineProperty(SPRest2.prototype, "hubSites", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest2) {
        return this.create(HubSites);
    },
});
