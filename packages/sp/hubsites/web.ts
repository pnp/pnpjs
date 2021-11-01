import { _Web, Web } from "../webs/types.js";
import { IHubSiteWebData } from "./types.js";
import { spPost } from "../operations.js";

declare module "../webs/types" {
    interface _Web {
        hubSiteData(forceRefresh?: boolean): Promise<Partial<IHubSiteWebData>>;
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
        hubSiteData(forceRefresh?: boolean): Promise<Partial<IHubSiteWebData>>;

        /**
         * Applies theme updates from the parent hub site collection.
         */
        syncHubSiteTheme(): Promise<void>;
    }
}

_Web.prototype.hubSiteData = async function (this: _Web, forceRefresh = false): Promise<IHubSiteWebData> {
    const data = await Web(this, `hubSiteData(${forceRefresh})`)<IHubSiteWebData>();
    if (typeof data === "string") {
        return JSON.parse(data);
    }
    return data;
};

_Web.prototype.syncHubSiteTheme = function (this: _Web): Promise<void> {
    return spPost(Web(this, "syncHubSiteTheme"));
};
