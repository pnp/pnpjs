import { _SPInstance, spInvokableFactory, SPInit, SPQueryable } from "../spqueryable.js";
import { defaultPath } from "../decorators.js";
import { Web, IWeb } from "../webs/types.js";
import { combine, hOP, isArray } from "@pnp/core";
import { body, TextParse } from "@pnp/queryable";
import { odataUrlFrom } from "../utils/odata-url-from.js";
import { spPatch, spPost } from "../operations.js";
import { IChangeQuery } from "../types.js";
import { extractWebUrl } from "../utils/extract-web-url.js";
import { emptyGuid } from "../types.js";

/**
 * Ensures that whatever url is passed to the constructor we can correctly rebase it to a site url
 *
 * @param candidate The candidate site url
 * @param path The caller supplied path, which may contain _api, meaning we don't append _api/site
 */
function rebaseSiteUrl(candidate: string, path: string | undefined): string {

    let replace = "_api/site";

    // this allows us to both:
    // - test if `candidate` already has an api path
    // - ensure that we append the correct one as sometimes a web is not defined
    //   by _api/web, in the case of _api/site/rootweb for example
    const matches = /(_api[/|\\](site|web))/i.exec(candidate);
    if (matches?.length > 0) {

        // we want just the base url part (before the _api)
        candidate = extractWebUrl(candidate);

        // we want to ensure we put back the correct string
        replace = matches[1];
    }

    // we only need to append the _api part IF `path` doesn't already include it.
    if (path?.indexOf("_api") < 0) {
        candidate = combine(candidate, replace);
    }

    return candidate;
}

@defaultPath("_api/site")
export class _Site extends _SPInstance<ISiteInfo> {

    constructor(base: SPInit, path?: string) {

        if (typeof base === "string") {
            base = rebaseSiteUrl(base, path);
        } else if (isArray(base)) {
            base = [base[0], rebaseSiteUrl(base[1], path)];
        } else {
            base = [base, rebaseSiteUrl(base.toUrl(), path)];
        }

        super(base, path);
    }

    /**
     * Gets the root web of the site collection
     *
     */
    public get rootWeb(): IWeb {
        return Web(this, "rootweb");
    }

    /**
     * Returns the collection of changes from the change log that have occurred within the list, based on the specified query
     *
     * @param query The change query
     */
    public getChanges(query: IChangeQuery): Promise<any> {

        const postBody = body({ query });
        return spPost(Web(this, "getchanges"), postBody);
    }

    /**
     * Opens a web by id (using POST)
     *
     * @param webId The GUID id of the web to open
     */
    public async openWebById(webId: string): Promise<IOpenWebByIdResult> {
        const data = await spPost(Site(this, `openWebById('${webId}')`));
        return {
            data,
            web: Web([this, extractWebUrl(odataUrlFrom(data))]),
        };
    }

    /**
     * Gets a Web instance representing the root web of the site collection
     * correctly setup for chaining within the library
     */
    public async getRootWeb(): Promise<IWeb> {
        const web = await this.rootWeb.select("Url")<{ Url: string }>();
        return Web([this, web.Url]);
    }

    /**
     * Deletes the current site
     *
     */
    public async delete(): Promise<void> {

        const site = await Site(this, "").select("Id")<{ Id: string }>();
        const q = Site([this, this.parentUrl], "_api/SPSiteManager/Delete");
        await spPost(q, body({ siteId: site.Id }));
    }

    /**
     * Gets the document libraries on a site. Static method. (SharePoint Online only)
     *
     * @param absoluteWebUrl The absolute url of the web whose document libraries should be returned
     */
    public async getDocumentLibraries(absoluteWebUrl: string): Promise<IDocumentLibraryInformation[]> {
        const q = Site([this, this.parentUrl], "_api/sp.web.getdocumentlibraries(@v)");
        q.query.set("@v", `'${absoluteWebUrl}'`);
        const data = await q<any>();
        return hOP(data, "GetDocumentLibraries") ? data.GetDocumentLibraries : data;
    }

    /**
     * Gets the site url from a page url
     *
     * @param absolutePageUrl The absolute url of the page
     */
    public async getWebUrlFromPageUrl(absolutePageUrl: string): Promise<string> {

        const q = Site([this, this.parentUrl], "_api/sp.web.getweburlfrompageurl(@v)");
        q.query.set("@v", `'${absolutePageUrl}'`);
        const data = await q<any>();
        return hOP(data, "GetWebUrlFromPageUrl") ? data.GetWebUrlFromPageUrl : data;
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
     * @param hubSiteId The id of the hub site to which the new site should be associated
     * @param owner Optional owner value, required if executing the method in app only mode
     */
    public async createCommunicationSite(
        title: string,
        lcid = 1033,
        shareByEmailEnabled = false,
        url: string,
        description?: string,
        classification?: string,
        siteDesignId?: string,
        hubSiteId?: string,
        owner?: string,
    ): Promise<ISiteCreationResponse> {

        return this.createCommunicationSiteFromProps({
            Classification: classification,
            Description: description,
            HubSiteId: hubSiteId,
            Lcid: lcid,
            Owner: owner,
            ShareByEmailEnabled: shareByEmailEnabled,
            SiteDesignId: siteDesignId,
            Title: title,
            Url: url,
        });
    }

    public async createCommunicationSiteFromProps(props: ICreateCommSiteProps): Promise<ISiteCreationResponse> {

        // handle defaults
        const request = {
            Classification: "",
            Description: "",
            HubSiteId: emptyGuid,
            Lcid: 1033,
            ShareByEmailEnabled: false,
            SiteDesignId: emptyGuid,
            WebTemplate: "SITEPAGEPUBLISHING#0",
            WebTemplateExtensionId: emptyGuid,
            ...props,
        };

        return spPost(Site([this, extractWebUrl(this.toUrl())], "/_api/SPSiteManager/Create"), body({ request }));
    }

    /**
     *
     * @param url Site Url that you want to check if exists
     */
    public async exists(url: string): Promise<boolean> {

        return spPost(Site([this, extractWebUrl(this.toUrl())], "/_api/SP.Site.Exists"), body({ url }));
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
        isPublic?: boolean,
        lcid?: number,
        description?: string,
        classification?: string,
        owners?: string[],
        hubSiteId?: string,
        siteDesignId?: string,
    ): Promise<ISiteCreationResponse> {

        return this.createModernTeamSiteFromProps({
            alias,
            classification,
            description,
            displayName,
            hubSiteId,
            isPublic,
            lcid,
            owners,
            siteDesignId,
        });
    }

    public async createModernTeamSiteFromProps(props: ICreateTeamSiteProps): Promise<ISiteCreationResponse> {

        // handle defaults
        const p = Object.assign({}, {
            classification: "",
            description: "",
            hubSiteId: emptyGuid,
            isPublic: true,
            lcid: 1033,
            owners: [],
        }, props);

        const postBody = {
            alias: p.alias,
            displayName: p.displayName,
            isPublic: p.isPublic,
            optionalParams: {
                Classification: p.classification,
                CreationOptions: [`SPSiteLanguage:${p.lcid}`, `HubSiteId:${p.hubSiteId}`],

                Description: p.description,
                Owners: p.owners,
            },
        };

        if (p.siteDesignId) {
            postBody.optionalParams.CreationOptions.push(`implicit_formula_292aa8a00786498a87a5ca52d9f4214a_${p.siteDesignId}`);
        }

        return spPost(Site([this, extractWebUrl(this.toUrl())], "/_api/GroupSiteManager/CreateGroupEx").using(TextParse()), body(postBody));
    }

    public update(props: ISiteInfo): Promise<any> {

        return spPatch(this, body(props));
    }

    /**
     * Set's the site's `Site Logo` property, vs the Site Icon property available on the web's properties
     *
     * @param logoProperties An instance of ISiteLogoProperties which sets the new site logo.
     */
    public setSiteLogo(logoProperties: ISiteLogoProperties): Promise<void> {
        return spPost(SPQueryable([this, extractWebUrl(this.toUrl())], "_api/siteiconmanager/setsitelogo"), body(logoProperties) );
    }
}
export interface ISite extends _Site { }
export const Site = spInvokableFactory<ISite>(_Site);

/**
 * The result of opening a web by id: contains the data returned as well as a chainable web instance
 */
export interface IOpenWebByIdResult {
    data: any;
    web: IWeb;
}

/**
 * This is the interface to expose data for Document Library
 */
export interface IDocumentLibraryInformation {
    AbsoluteUrl: string;
    DriveId: string;
    FromCrossFarm: boolean;
    Id: string;
    IsDefaultDocumentLibrary: boolean;
    Modified: string;
    ModifiedFriendlyDisplay: string;
    ServerRelativeUrl: string;
    Title: string;
}

export interface ICreateCommSiteProps {
    Classification?: string;
    Description?: string;
    HubSiteId?: string;
    Lcid?: number;
    Owner?: string;
    ShareByEmailEnabled?: boolean;
    SiteDesignId?: string;
    Title: string;
    Url: string;
    WebTemplate?: "SITEPAGEPUBLISHING#0" | "STS#3";
    WebTemplateExtensionId?: string;
}

export interface ICreateTeamSiteProps {
    displayName: string;
    alias: string;
    isPublic?: boolean;
    lcid?: number;
    description?: string;
    classification?: string;
    owners?: string[];
    hubSiteId?: string;
    siteDesignId?: string;
}

export interface ISiteCreationResponse {
    "SiteId": string;
    "SiteStatus": 0 | 1 | 2 | 3;
    "SiteUrl": string;
}

export interface ISiteInfo {
    AllowCreateDeclarativeWorkflow: boolean;
    AllowDesigner: boolean;
    AllowMasterPageEditing: boolean;
    AllowRevertFromTemplate: boolean;
    AllowSaveDeclarativeWorkflowAsTemplate: boolean;
    AllowSavePublishDeclarativeWorkflow: boolean;
    AllowSelfServiceUpgrade: boolean;
    AllowSelfServiceUpgradeEvaluation: boolean;
    AuditLogTrimmingRetention: number;
    ChannelGroupId: string;
    Classification: string;
    CompatibilityLevel: number;
    CurrentChangeToken: { StringValue: string };
    DisableAppViews: boolean;
    DisableCompanyWideSharingLinks: boolean;
    DisableFlows: boolean;
    ExternalSharingTipsEnabled: boolean;
    GeoLocation: string;
    GroupId: string;
    HubSiteId: string;
    Id: string;
    IsHubSite: boolean;
    LockIssue: string | null;
    MaxItemsPerThrottledOperation: number;
    MediaTranscriptionDisabled: boolean;
    NeedsB2BUpgrade: boolean;
    PrimaryUri: string;
    ReadOnly: boolean;
    RequiredDesignerVersion: string;
    ResourcePath: { DecodedUrl: string };
    SandboxedCodeActivationCapability: number;
    SensitivityLabel: string;
    SensitivityLabelId: string | null;
    ServerRelativeUrl: string;
    ShareByEmailEnabled: boolean;
    ShareByLinkEnabled: boolean;
    ShowUrlStructure: boolean;
    TrimAuditLog: boolean;
    UIVersionConfigurationEnabled: boolean;
    UpgradeReminderDate: string;
    UpgradeScheduled: boolean;
    UpgradeScheduledDate: string;
    Upgrading: boolean;
    Url: string;
    WriteLocked: boolean;
}

export const enum SiteLogoType {
    /**
     * Site header logo
     */
    WebLogo = 0,
    /**
     * Hub site logo
     */
    HubLogo = 1,
    /**
     * Header background image
     */
    HeaderBackground = 2,
    /**
     * Global navigation logo
     */
    GlobalNavLogo = 3
}

export const enum SiteLogoAspect {
    Square = 0,
    Rectangular = 1,
}

export interface ISiteLogoProperties {
    relativeLogoUrl: string;
    type: SiteLogoType;
    aspect: SiteLogoAspect;
}
