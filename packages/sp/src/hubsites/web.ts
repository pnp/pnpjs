import { _Web, Web } from "../webs/types";
import { IHubSiteWebData } from "./types";
import { spPost } from "../operations";

declare module "../webs/types" {
    interface _Web {
        hubSiteData(forceRefresh?: boolean): Promise<IHubSiteWebData>;
        syncHubSiteTheme(): Promise<void>;
    }
    interface IWeb {

        /**
         * Gets hub site data for the current web.
         *
         * @param forceRefresh Default value is false. When false, the data is returned from the server's cache.
         * When true, the cache is refreshed with the latest updates and then returned.
         * Use this if you just made changes and need to see those changes right away.
         */
        hubSiteData(forceRefresh?: boolean): Promise<IHubSiteWebData>;

        /**
         * Applies theme updates from the parent hub site collection.
         */
        syncHubSiteTheme(): Promise<void>;
    }
}

_Web.prototype.hubSiteData = function (this: _Web, forceRefresh = false): Promise<IHubSiteWebData> {
    return this.clone(Web, `hubSiteData(${forceRefresh})`)();
};

_Web.prototype.syncHubSiteTheme = function (this: _Web): Promise<void> {
    return spPost(this.clone(Web, `syncHubSiteTheme`));
};
