import { _Site, Site } from "../sites/types";
import { spPost } from "../operations";

/**
 * Extend Site
 */
declare module "../sites/types" {
    interface _Site {
        joinHubSite(siteId: string): Promise<void>;
        registerHubSite(): Promise<void>;
        unRegisterHubSite(): Promise<void>;
    }
    interface ISite {
        joinHubSite(siteId: string): Promise<void>;
        registerHubSite(): Promise<void>;
        unRegisterHubSite(): Promise<void>;
    }
}

/**
 * Associates a site collection to a hub site.
 * 
 * @param siteId Id of the hub site collection you want to join.
 * If you want to disassociate the site collection from hub site, then
 * pass the siteId as 00000000-0000-0000-0000-000000000000
 */
_Site.prototype.joinHubSite = function (this: _Site, siteId: string): Promise<void> {
    return spPost(this.clone(Site, `joinHubSite('${siteId}')`));
};

/**
 * Registers the current site collection as hub site collection
 */
_Site.prototype.registerHubSite = function (this: _Site): Promise<void> {
    return spPost(this.clone(Site, `registerHubSite`));
};

/**
 * Unregisters the current site collection as hub site collection.
 */
_Site.prototype.unRegisterHubSite = function (this: _Site): Promise<void> {
    return spPost(this.clone(Site, `unRegisterHubSite`));
};
