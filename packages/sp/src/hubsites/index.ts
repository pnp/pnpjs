import { SPRest } from "../rest";
import { HubSites, IHubSites } from "./types";

// extend everything if they include the root
import "./site";
import "./web";

export {
    HubSite,
    HubSites,
    IHubSite,
    IHubSiteData,
    IHubSiteWebData,
    IHubSites,
} from "./types";

/**
 * Extend rest
 */
declare module "../rest" {
    interface SPRest {
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
