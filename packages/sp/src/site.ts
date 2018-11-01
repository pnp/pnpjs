import { SharePointQueryable, SharePointQueryableInstance, defaultPath } from "./sharepointqueryable";
import { Web } from "./webs";
import { UserCustomActions } from "./usercustomactions";
import { ContextInfo, DocumentLibraryInformation } from "./types";
import { SPBatch } from "./batch";
import { Features } from "./features";
import { hOP } from "@pnp/common";

/**
 * Describes a site collection
 *
 */
@defaultPath("_api/site")
export class Site extends SharePointQueryableInstance {

    /**
     * Gets the root web of the site collection
     *
     */
    public get rootWeb(): Web {
        return new Web(this, "rootweb");
    }

    /**
     * Gets the active features for this site collection
     *
     */
    public get features(): Features {
        return new Features(this);
    }

    /**
     * Gets all custom actions for this site collection
     *
     */
    public get userCustomActions(): UserCustomActions {
        return new UserCustomActions(this);
    }

    /**
     * Gets a Web instance representing the root web of the site collection
     * correctly setup for chaining within the library
     */
    public getRootWeb(): Promise<Web> {
        return this.rootWeb.select("Url").get().then(web => new Web(web.Url));
    }

    /**
     * Gets the context information for this site collection
     */
    public getContextInfo(): Promise<ContextInfo> {
        const q = new Site(this.parentUrl, "_api/contextinfo");
        return q.postCore().then(data => {
            if (hOP(data, "GetContextWebInformation")) {
                const info = data.GetContextWebInformation;
                info.SupportedSchemaVersions = info.SupportedSchemaVersions.results;
                return info;
            } else {
                return data;
            }
        });
    }

    /**
     * Gets the document libraries on a site. Static method. (SharePoint Online only)
     *
     * @param absoluteWebUrl The absolute url of the web whose document libraries should be returned
     */
    public getDocumentLibraries(absoluteWebUrl: string): Promise<DocumentLibraryInformation[]> {
        const q = new SharePointQueryable("", "_api/sp.web.getdocumentlibraries(@v)");
        q.query.set("@v", "'" + absoluteWebUrl + "'");
        return q.get().then(data => {
            if (hOP(data, "GetDocumentLibraries")) {
                return data.GetDocumentLibraries;
            } else {
                return data;
            }
        });
    }

    /**
     * Gets the site url from a page url
     *
     * @param absolutePageUrl The absolute url of the page
     */
    public getWebUrlFromPageUrl(absolutePageUrl: string): Promise<string> {
        const q = new SharePointQueryable("", "_api/sp.web.getweburlfrompageurl(@v)");
        q.query.set("@v", `'${absolutePageUrl}'`);
        return q.get().then(data => {
            if (hOP(data, "GetWebUrlFromPageUrl")) {
                return data.GetWebUrlFromPageUrl;
            } else {
                return data;
            }
        });
    }

    /**
     * Creates a new batch for requests within the context of this site collection
     *
     */
    public createBatch(): SPBatch {
        return new SPBatch(this.parentUrl);
    }

    /**
     * Opens a web by id (using POST)
     *
     * @param webId The GUID id of the web to open
     */
    public openWebById(webId: string): Promise<OpenWebByIdResult> {

        return this.clone(Site, `openWebById('${webId}')`).postCore().then(d => ({
            data: d,
            web: Web.fromUrl(d["odata.id"] || d.__metadata.uri),
        }));
    }

    /**
     * Associates a site collection to a hub site.
     * 
     * @param siteId Id of the hub site collection you want to join.
     * If you want to disassociate the site collection from hub site, then
     * pass the siteId as 00000000-0000-0000-0000-000000000000
     */
    public joinHubSite(siteId: string): Promise<void> {
        return this.clone(Site, `joinHubSite('${siteId}')`).postCore();
    }

    /**
     * Registers the current site collection as hub site collection
     */
    public registerHubSite(): Promise<void> {
        return this.clone(Site, `registerHubSite`).postCore();
    }

    /**
     * Unregisters the current site collection as hub site collection.
     */
    public unRegisterHubSite(): Promise<void> {
        return this.clone(Site, `unRegisterHubSite`).postCore();
    }
}

/**
 * The result of opening a web by id: contains the data returned as well as a chainable web instance
 */
export interface OpenWebByIdResult {
    data: any;
    web: Web;
}
