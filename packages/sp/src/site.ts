import { SharePointQueryable, SharePointQueryableInstance, defaultPath } from "./sharepointqueryable";
import { Web } from "./webs";
import { UserCustomActions } from "./usercustomactions";
import { ContextInfo, DocumentLibraryInformation } from "./types";
import { SPBatch } from "./batch";
import { Features } from "./features";
import { hOP, jsS, extend } from "@pnp/common";
import { SPHttpClient } from "./net/sphttpclient";

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
     * Deletes the current site
     *
     */
    public async delete(): Promise<void> {
        const site = await this.clone(Site, "").select("Id").get<{ Id: string }>();

        const q = new Site(this.parentUrl, "_api/SPSiteManager/Delete");
        await q.postCore({
            body: jsS({
                siteId: site.Id,
            }),
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
     * @param hubSiteId The Guid of the already existing Hub site
     * @param owner Required when creating the site using app-only context
     */

    public createCommunicationSite(
        title: string,
        lcid = 1033,
        shareByEmailEnabled = false,
        url: string,
        description = "",
        classification = "",
        siteDesignId = "00000000-0000-0000-0000-000000000000",
        hubSiteId = "00000000-0000-0000-0000-000000000000",
        owner?: string,
    ): Promise<ISPSiteCreationResponse> {

        const props = {
            Classification: classification,
            Description: description,
            HubSiteId: hubSiteId,
            Lcid: lcid,
            Owner: owner,
            ShareByEmailEnabled: shareByEmailEnabled,
            SiteDesignId: siteDesignId,
            Title: title,
            Url: url,
            WebTemplate: "SITEPAGEPUBLISHING#0",
            WebTemplateExtensionId: "00000000-0000-0000-0000-000000000000",
        };

        const postBody = jsS({
            "request":
                extend({
                    "__metadata": { "type": "Microsoft.SharePoint.Portal.SPSiteCreationRequest" },
                }, props),
        });

        return this.getRootWeb().then(async (d: any) => {

            const client = new SPHttpClient();
            const methodUrl = `${d.parentUrl}/_api/SPSiteManager/Create`;
            return client.post(methodUrl, {
                body: postBody,
                headers: {
                    "Accept": "application/json;odata=verbose",
                    "Content-Type": "application/json;odata=verbose;charset=utf-8",
                },
            }).then(r => r.json()).then((n: any) => {

                if (hOP(n, "error")) {
                    throw n;
                }

                if (hOP(n, "d") && hOP(n.d, "Create")) {
                    return n.d.Create;
                }

                return n;
            });
        });
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
     * @param siteDesignId The ID of the site design to apply to the new site 
     */

    public createModernTeamSite(
        displayName: string,
        alias: string,
        isPublic = true,
        lcid = 1033,
        description = "",
        classification = "",
        owners?: string[],
        hubSiteId = "00000000-0000-0000-0000-000000000000",
        siteDesignId?: string,
    ): Promise<void> {

        const postBody = {
            alias: alias,
            displayName: displayName,
            isPublic: isPublic,
            optionalParams: {
                Classification: classification,
                CreationOptions: {
                    "results": [`SPSiteLanguage:${lcid}`, `HubSiteId:${hubSiteId}`],
                },
                Description: description,
                Owners: {
                    "results": owners ? owners : [],
                },
            },
        };

        if (siteDesignId) {
            postBody.optionalParams.CreationOptions.results.push(`implicit_formula_292aa8a00786498a87a5ca52d9f4214a_${siteDesignId}`);
        }

        return this.getRootWeb().then(async (d: any) => {

            const client = new SPHttpClient();
            const methodUrl = `${d.parentUrl}/_api/GroupSiteManager/CreateGroupEx`;
            return client.post(methodUrl, {
                body: jsS(postBody),
                headers: {
                    "Accept": "application/json;odata=verbose",
                    "Content-Type": "application/json;odata=verbose;charset=utf-8",
                },
            }).then(r => r.json());
        });
    }
}

/**
 * The result of opening a web by id: contains the data returned as well as a chainable web instance
 */
export interface OpenWebByIdResult {
    data: any;
    web: Web;
}

/**
 * The result of creating a site collection
 */
export interface ISPSiteCreationResponse {
    SiteId: string;
    SiteStatus: number;
    SiteUrl: string;
}
