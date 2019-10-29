import {
    SPRest,
} from "@pnp/sp";

import { Web, IWeb } from "@pnp/sp/webs";
import { Site, ISite } from "@pnp/sp/sites";

import {
    isUrlAbsolute,
    combine,
} from "@pnp/common";

import { ISharePointQueryable } from "@pnp/sp";

export class SPRestAddIn extends SPRest {

    /**
     * Begins a cross-domain, host site scoped REST request, for use in add-in webs
     *
     * @param addInWebUrl The absolute url of the add-in web
     * @param hostWebUrl The absolute url of the host web
     */
    public crossDomainSite(addInWebUrl: string, hostWebUrl: string): ISite {
        return this._cdImpl(Site, addInWebUrl, hostWebUrl, "site");
    }

    /**
     * Begins a cross-domain, host web scoped REST request, for use in add-in webs
     *
     * @param addInWebUrl The absolute url of the add-in web
     * @param hostWebUrl The absolute url of the host web
     */
    public crossDomainWeb(addInWebUrl: string, hostWebUrl: string): IWeb {
        return this._cdImpl(Web, addInWebUrl, hostWebUrl, "web");
    }

    /**
     * Implements the creation of cross domain REST urls
     *
     * @param factory The constructor of the object to create Site | Web
     * @param addInWebUrl The absolute url of the add-in web
     * @param hostWebUrl The absolute url of the host web
     * @param urlPart String part to append to the url "site" | "web"
     */
    private _cdImpl<T extends ISharePointQueryable>(
        factory: (...args: any[]) => T,
        addInWebUrl: string,
        hostWebUrl: string,
        urlPart: string): T {

        if (!isUrlAbsolute(addInWebUrl)) {
            throw Error("The addInWebUrl parameter must be an absolute url.");
        }

        if (!isUrlAbsolute(hostWebUrl)) {
            throw Error("The hostWebUrl parameter must be an absolute url.");
        }

        const url = combine(addInWebUrl, "_api/SP.AppContextSite(@target)");

        const instance = factory(url, urlPart);
        instance.query.set("@target", "'" + encodeURIComponent(hostWebUrl) + "'");
        return instance.configure(this._options);
    }
}

export const sp = new SPRestAddIn();
