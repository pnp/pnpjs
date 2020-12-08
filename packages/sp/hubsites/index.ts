import { SPRest } from "../rest.js";
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

Reflect.defineProperty(SPRest.prototype, "hubSites", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest) {
        return this.childConfigHook(({ options, baseUrl, runtime }) => {
            return HubSites(baseUrl).configure(options).setRuntime(runtime);
        });
    },
});
