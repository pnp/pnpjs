import { SharePointQueryable, _SharePointQueryableInstance, ISharePointQueryableInstance, spInvokableFactory } from "../sharepointqueryable";
import { defaultPath } from "../decorators";
import { Web, IWeb } from "../webs/types";
import { hOP, jsS, extend } from "@pnp/common";
import { SPHttpClient } from "../net/sphttpclient";
import { IGetable, body, headers } from "@pnp/odata";
import { odataUrlFrom } from "../odata";
import { spPost } from "../operations";

/**
 * Describes a site collection
 *
 */
@defaultPath("_api/site")
export class _Site extends _SharePointQueryableInstance {

    /**
     * Gets the root web of the site collection
     *
     */
    public get rootWeb(): IWeb {
        return Web(this, "rootweb");
    }

    /**
     * Gets a Web instance representing the root web of the site collection
     * correctly setup for chaining within the library
     */
    public async getRootWeb(): Promise<IWeb> {
        const web = await this.rootWeb.select("Url")<{ Url: string }>();
        return Web(web.Url);
    }

    /**
     * Gets the context information for this site collection
     */
    public async getContextInfo(): Promise<IContextInfo> {

        const q = Site(this.parentUrl, "_api/contextinfo");
        const data = await spPost(q);

        if (hOP(data, "GetContextWebInformation")) {
            const info = data.GetContextWebInformation;
            info.SupportedSchemaVersions = info.SupportedSchemaVersions.results;
            return info;
        } else {
            return data;
        }
    }

    /**
     * Gets the document libraries on a site. Static method. (SharePoint Online only)
     *
     * @param absoluteWebUrl The absolute url of the web whose document libraries should be returned
     */
    public async getDocumentLibraries(absoluteWebUrl: string): Promise<IDocumentLibraryInformation[]> {

        const q = SharePointQueryable("", "_api/sp.web.getdocumentlibraries(@v)");
        q.query.set("@v", "'" + absoluteWebUrl + "'");
        const data = await q();

        return hOP(data, "GetDocumentLibraries") ? data.GetDocumentLibraries : data;
    }

    /**
     * Gets the site url from a page url
     *
     * @param absolutePageUrl The absolute url of the page
     */
    public async getWebUrlFromPageUrl(absolutePageUrl: string): Promise<string> {
        const q = SharePointQueryable("", "_api/sp.web.getweburlfrompageurl(@v)");
        q.query.set("@v", `'${absolutePageUrl}'`);
        const data = await q();

        return hOP(data, "GetWebUrlFromPageUrl") ? data.GetWebUrlFromPageUrl : data;
    }

    /**
     * Opens a web by id (using POST)
     *
     * @param webId The GUID id of the web to open
     */
    public async openWebById(webId: string): Promise<IOpenWebByIdResult> {

        const data = await spPost(this.clone(Site, `openWebById('${webId}')`));
        return {
            data,
            web: Web(odataUrlFrom(data)),
        };
    }

    /**
     * Creates a Modern communication site.
     * 
     * @param title The title of the site to create
     * @param lcid The language to use for the site. If not specified will default to 1033 (English).
     * @param shareByEmailEnabled If set to true, it will enable sharing files via Email. By default it is set to false
     * @param url The fully qualified URL (e.g. https://yourtenant.sharepoint.com/sites/mysitecollection) of the site.
     * @param description The description of the communication site.
     * @param classification The Site classification to use. For instance 'Contoso Classified'. See https://www.youtube.com/watch?v=E-8Z2ggHcS0 for more information
     * @param siteDesignId The Guid of the site design to be used.
     *                     You can use the below default OOTB GUIDs:
     *                     Topic: 00000000-0000-0000-0000-000000000000
     *                     Showcase: 6142d2a0-63a5-4ba0-aede-d9fefca2c767
     *                     Blank: f6cc5403-0d63-442e-96c0-285923709ffc 
     */

    public async createCommunicationSite(
        title: string,
        lcid = 1033,
        shareByEmailEnabled = false,
        url: string,
        description = "",
        classification = "",
        siteDesignId = "00000000-0000-0000-0000-000000000000",
    ): Promise<void> {

        const props = {
            Classification: classification,
            Description: description,
            Lcid: lcid,
            ShareByEmailEnabled: shareByEmailEnabled,
            SiteDesignId: siteDesignId,
            Title: title,
            Url: url,
            WebTemplate: "SITEPAGEPUBLISHING#0",
            WebTemplateExtensionId: "00000000-0000-0000-0000-000000000000",
        };

        const postBody =
            body({
                "request":
                    extend({
                        "__metadata": { "type": "Microsoft.SharePoint.Portal.SPSiteCreationRequest" },
                    }, props),
            },
                headers({
                    "Accept": "application/json;odata=verbose",
                    "Content-Type": "application/json;odata=verbose;charset=utf-8",
                }));

        const d: any = await this.getRootWeb();
        const client = new SPHttpClient();
        const methodUrl = `${d.parentUrl}/_api/SPSiteManager/Create`;
        const r = await client.post(methodUrl, postBody);
        return await r.json();
    }

    /**
     * Creates a Modern team site backed by Office 365 group. For use in SP Online only. This will not work with App-only tokens
     * 
     * @param displayName The title or display name of the Modern team site to be created
     * @param alias Alias of the underlying Office 365 Group
     * @param isPublic Defines whether the Office 365 Group will be public (default), or private.
     * @param lcid The language to use for the site. If not specified will default to English (1033).
     * @param description The description of the site to be created.
     * @param classification The Site classification to use. For instance 'Contoso Classified'. See https://www.youtube.com/watch?v=E-8Z2ggHcS0 for more information
     * @param owners The Owners of the site to be created     
     */

    public async createModernTeamSite(
        displayName: string,
        alias: string,
        isPublic = true,
        lcid = 1033,
        description = "",
        classification = "",
        owners?: string[],
    ): Promise<void> {

        const postBody = jsS({
            alias: alias,
            displayName: displayName,
            isPublic: isPublic,
            optionalParams: {
                Classification: classification,
                CreationOptions: {
                    "results": [`SPSiteLanguage:${lcid}`],
                },
                Description: description,
                Owners: {
                    "results": owners ? owners : [],
                },
            },
        });

        const d: any = await this.getRootWeb();
        const client = new SPHttpClient();
        const methodUrl = `${d.parentUrl}/_api/GroupSiteManager/CreateGroupEx`;
        const r = await client.post(methodUrl, {
            body: postBody,
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose;charset=utf-8",
            },
        });
        return await r.json();
    }
}

export interface ISite extends IGetable, ISharePointQueryableInstance {
    readonly rootWeb: IWeb;
    getRootWeb(): Promise<IWeb>;
    getContextInfo(): Promise<IContextInfo>;
    getDocumentLibraries(absoluteWebUrl: string): Promise<IDocumentLibraryInformation[]>;
    getWebUrlFromPageUrl(absolutePageUrl: string): Promise<string>;
    openWebById(webId: string): Promise<IOpenWebByIdResult>;
    createCommunicationSite(
        title: string,
        lcid?: number,
        shareByEmailEnabled?: boolean,
        url?: string,
        description?: string,
        classification?: string,
        siteDesignId?: string): Promise<void>;
    createModernTeamSite(
        displayName: string,
        alias: string,
        isPublic?: boolean,
        lcid?: number,
        description?: string,
        classification?: string,
        owners?: string[]): Promise<void>;

}
export interface _Site extends IGetable { }
export const Site = spInvokableFactory<ISite>(_Site);

/**
 * The result of opening a web by id: contains the data returned as well as a chainable web instance
 */
export interface IOpenWebByIdResult {
    data: any;
    web: IWeb;
}

export interface IContextInfo {
    FormDigestTimeoutSeconds?: number;
    FormDigestValue?: number;
    LibraryVersion?: string;
    SiteFullUrl?: string;
    SupportedSchemaVersions?: string[];
    WebFullUrl?: string;
}

export interface IDocumentLibraryInformation {
    AbsoluteUrl?: string;
    Modified?: Date;
    ModifiedFriendlyDisplay?: string;
    ServerRelativeUrl?: string;
    Title?: string;
}
