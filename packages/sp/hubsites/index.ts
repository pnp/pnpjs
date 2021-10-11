import { SPFI } from "../fi.js";
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

declare module "../fi" {
    interface SPFI {
        /**
         * Lists all of the subsites
         */
        readonly hubSites: IHubSites;
    }
}

Reflect.defineProperty(SPFI.prototype, "hubSites", {
    configurable: true,
    enumerable: true,
    get: function (this: SPFI) {
        return this.create(HubSites);
    },
});
