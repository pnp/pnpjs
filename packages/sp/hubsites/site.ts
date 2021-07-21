import { _Site, Site } from "../sites/types.js";
import { spPost } from "../operations.js";

declare module "../sites/types" {
    interface _Site {
        joinHubSite(siteId: string): Promise<void>;
        registerHubSite(): Promise<void>;
        unRegisterHubSite(): Promise<void>;
    }
    interface ISite {

        /**
         * Associates a site collection to a hub site.
         *
         * @param siteId Id of the hub site collection you want to join.
         * If you want to disassociate the site collection from hub site, then
         * pass the siteId as 00000000-0000-0000-0000-000000000000
         */
        joinHubSite(siteId: string): Promise<void>;

        /**
         * Registers the current site collection as hub site collection
         */
        registerHubSite(): Promise<void>;

        /**
         * Unregisters the current site collection as hub site collection.
         */
        unRegisterHubSite(): Promise<void>;
    }
}

_Site.prototype.joinHubSite = async function (this: _Site, siteId: string): Promise<void> {
    await spPost(Site(this, `joinHubSite('${siteId}')`));
};

_Site.prototype.registerHubSite = async function (this: _Site): Promise<void> {
    await spPost(Site(this, "registerHubSite"));
};

_Site.prototype.unRegisterHubSite = async function (this: _Site): Promise<void> {
    await spPost(Site(this, "unRegisterHubSite"));
};
