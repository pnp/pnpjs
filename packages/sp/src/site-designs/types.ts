import { _SharePointQueryable, ISharePointQueryable } from "../sharepointqueryable";
import { extractWebUrl } from "../utils/extractweburl";
import { headers, body } from "@pnp/odata";
import { spPost } from "../operations";
import { hOP } from "@pnp/common";

/**
 * Implements the site designs API REST methods
 *
 */
export class _SiteDesigns extends _SharePointQueryable implements _ISiteDesigns {
    /**
     * Creates a new instance of the SiteDesigns method class
     *
     * @param baseUrl The parent url provider
     * @param methodName The static method name to call on the utility class
     */
    constructor(baseUrl: string | ISharePointQueryable, methodName = "") {
        const url = typeof baseUrl === "string" ? baseUrl : baseUrl.toUrl();
        super(extractWebUrl(url), `_api/Microsoft.Sharepoint.Utilities.WebTemplateExtensions.SiteScriptUtility.${methodName}`);
    }

    public execute<T>(props: any): Promise<T> {
        return spPost<T>(this, body(props, headers({ "Content-Type": "application/json;charset=utf-8" })));
    }

    public async createSiteDesign(creationInfo: ISiteDesignCreationInfo): Promise<ISiteDesignInfo> {
        return await this.clone(SiteDesignsCloneFactory, `CreateSiteDesign`).execute<ISiteDesignInfo>({ info: creationInfo });
    }

    public async applySiteDesign(siteDesignId: string, webUrl: string): Promise<void> {
        return await this.clone(SiteDesignsCloneFactory, `ApplySiteDesign`).execute<void>({ siteDesignId: siteDesignId, "webUrl": webUrl });
    }

    public async getSiteDesigns(): Promise<ISiteDesignInfo[]> {
        return await this.clone(SiteDesignsCloneFactory, `GetSiteDesigns`).execute<ISiteDesignInfo[]>({});
    }

    public async getSiteDesignMetadata(id: string): Promise<ISiteDesignInfo> {
        return await this.clone(SiteDesignsCloneFactory, `GetSiteDesignMetadata`).execute<ISiteDesignInfo>({ id: id });
    }

    public async updateSiteDesign(updateInfo: ISiteDesignUpdateInfo): Promise<ISiteDesignInfo> {
        return await this.clone(SiteDesignsCloneFactory, `UpdateSiteDesign`).execute<ISiteDesignInfo>({ updateInfo: updateInfo });
    }

    public async deleteSiteDesign(id: string): Promise<void> {
        return await this.clone(SiteDesignsCloneFactory, `DeleteSiteDesign`).execute<void>({ id: id });
    }

    public async getSiteDesignRights(id: string): Promise<ISiteDesignPrincipals[]> {
        return await this.clone(SiteDesignsCloneFactory, `GetSiteDesignRights`).execute<ISiteDesignPrincipals[]>({ id: id });
    }

    public async grantSiteDesignRights(id: string, principalNames: string[], grantedRights = 1): Promise<void> {
        return await this.clone(SiteDesignsCloneFactory, `GrantSiteDesignRights`)
            .execute<void>({
                "grantedRights": grantedRights.toString(),
                "id": id,
                "principalNames": principalNames,
            });
    }

    public async revokeSiteDesignRights(id: string, principalNames: string[]): Promise<void> {
        return await this.clone(SiteDesignsCloneFactory, `RevokeSiteDesignRights`)
            .execute<void>({
                "id": id,
                "principalNames": principalNames,
            });
    }

    public async addSiteDesignTask(webUrl: string, siteDesignId: string): Promise<ISiteDesignTask> {
        return await this.clone(SiteDesignsCloneFactory, `AddSiteDesignTask`)
            .execute<ISiteDesignTask>({ "webUrl": webUrl, "siteDesignId": siteDesignId });
    }

    public async addSiteDesignTaskToCurrentWeb(siteDesignId: string): Promise<ISiteDesignTask> {
        return await this.clone(SiteDesignsCloneFactory, `AddSiteDesignTaskToCurrentWeb`)
            .execute<ISiteDesignTask>({ "siteDesignId": siteDesignId });
    }

    public async getSiteDesignTask(id: string): Promise<ISiteDesignTask> {
        const task = await this.clone(SiteDesignsCloneFactory, `GetSiteDesignTask`)
            .execute<ISiteDesignTask>({ "taskId": id });

        return hOP(task, "ID") ? task : null;
    }

    public async getSiteDesignRun(webUrl: string, siteDesignId?: string): Promise<ISiteDesignRun[]> {
        return await this.clone(SiteDesignsCloneFactory, `GetSiteDesignRun`)
            .execute<ISiteDesignRun[]>({ "webUrl": webUrl, siteDesignId: siteDesignId });
    }

    public async getSiteDesignRunStatus(webUrl: string, runId: string): Promise<ISiteScriptActionStatus[]> {
        return await this.clone(SiteDesignsCloneFactory, `GetSiteDesignRunStatus`)
            .execute<ISiteScriptActionStatus[]>({ "webUrl": webUrl, runId: runId });
    }
}

export interface _ISiteDesigns {
    getSiteDesigns(): Promise<ISiteDesignInfo[]>;
    /**
     * Creates a new site design available to users when they create a new site from the SharePoint home page.
     * 
     * @param creationInfo A sitedesign creation information object
     */
    createSiteDesign(creationInfo: ISiteDesignCreationInfo): Promise<ISiteDesignInfo>;
    /**
     * Applies a site design to an existing site collection.
     *
     * @param siteDesignId The ID of the site design to apply.
     * @param webUrl The URL of the site collection where you want to apply the site design.
     */
    applySiteDesign(siteDesignId: string, webUrl: string): Promise<void>;
    /**
     * Gets information about a specific site design.
     * @param id The ID of the site design to get information about.
     */
    getSiteDesignMetadata(id: string): Promise<ISiteDesignInfo>;
    /**
     * Updates a site design with new values. In the REST call, all parameters are optional except the site script Id.
     * If you had previously set the IsDefault parameter to TRUE and wish it to remain true, you must pass in this parameter again (otherwise it will be reset to FALSE). 
     * @param updateInfo A sitedesign update information object
     */
    updateSiteDesign(updateInfo: ISiteDesignUpdateInfo): Promise<ISiteDesignInfo>;
    /**
     * Deletes a site design.
     * @param id The ID of the site design to delete.
     */
    deleteSiteDesign(id: string): Promise<void>;
    /**
     * Gets a list of principals that have access to a site design.
     * @param id The ID of the site design to get rights information from.
     */
    getSiteDesignRights(id: string): Promise<ISiteDesignPrincipals[]>;
    /**
     * Grants access to a site design for one or more principals.
     * @param id The ID of the site design to grant rights on.
     * @param principalNames An array of one or more principals to grant view rights. 
     *                       Principals can be users or mail-enabled security groups in the form of "alias" or "alias@<domain name>.com"
     * @param grantedRights Always set to 1. This represents the View right.
     */
    grantSiteDesignRights(id: string, principalNames: string[], grantedRights?: number): Promise<void>;
    /**
     * Revokes access from a site design for one or more principals.
     * @param id The ID of the site design to revoke rights from.
     * @param principalNames An array of one or more principals to revoke view rights from. 
     *                       If all principals have rights revoked on the site design, the site design becomes viewable to everyone.
     */
    revokeSiteDesignRights(id: string, principalNames: string[]): Promise<void>;
    /**
     * Adds a site design task on the specified web url to be invoked asynchronously.
     * @param webUrl The absolute url of the web on where to create the task
     * @param siteDesignId The ID of the site design to create a task for
     */
    addSiteDesignTask(webUrl: string, siteDesignId: string): Promise<ISiteDesignTask>;
    /**
     * Adds a site design task on the current web to be invoked asynchronously.
     * @param siteDesignId The ID of the site design to create a task for
     */
    addSiteDesignTaskToCurrentWeb(siteDesignId: string): Promise<ISiteDesignTask>;
    /**
     * Retrieves the site design task, if the task has finished running null will be returned
     * @param id The ID of the site design task
     */
    getSiteDesignTask(id: string): Promise<ISiteDesignTask>;
    /**
     * Retrieves a list of site design that have run on a specific web
     * @param webUrl The url of the web where the site design was applied
     * @param siteDesignId (Optional) the site design ID, if not provided will return all site design runs
     */
    getSiteDesignRun(webUrl: string, siteDesignId?: string): Promise<ISiteDesignRun[]>;
    /**
     * Retrieves the status of a site design that has been run or is still running
     * @param webUrl The url of the web where the site design was applied
     * @param runId the run ID
     */
    getSiteDesignRunStatus(webUrl: string, runId: string): Promise<ISiteScriptActionStatus[]>;
}

export interface ISiteDesigns extends _ISiteDesigns { }

export const SiteDesigns = (baseUrl: string | ISharePointQueryable, methodName?: string): ISiteDesigns => new _SiteDesigns(baseUrl, methodName);

type SiteDesignsCloneType = ISiteDesigns & ISharePointQueryable & { execute<T>(props: any): Promise<T> };
const SiteDesignsCloneFactory = (baseUrl: string | ISharePointQueryable, methodName = ""): SiteDesignsCloneType => <any>SiteDesigns(baseUrl, methodName);

/**
 * Result from creating or retrieving a site design
 *
 */
export interface ISiteDesignInfo {
    /**
     * The ID of the site design to apply.
     */
    Id: string;
    /**
     * The display name of the site design.
     */
    Title: string;
    /**
     * Identifies which base template to add the design to. Use the value 64 for the Team site template, and the value 68 for the Communication site template.
     */
    WebTemplate: string;
    /**
     * An array of one or more site scripts. Each is identified by an ID. The scripts will run in the order listed.
     */
    SiteScriptIds: string[];
    /**
     * The display description of site design.
     */
    Description: string;
    /**
     * The URL of a preview image. If none is specified, SharePoint uses a generic image.
     */
    PreviewImageUrl: string;
    /**
     * The alt text description of the image for accessibility.
     */
    PreviewImageAltText: string;
    /**
     * True if the site design is applied as the default site design; otherwise, false. 
     * For more information see Customize a default site design https://docs.microsoft.com/en-us/sharepoint/dev/declarative-customization/customize-default-site-design.
     */
    IsDefault: boolean;
    /**
     * The version number of the site design
     */
    Version: string;
}

/**
 * Data for creating a site design
 *
 */
export interface ISiteDesignCreationInfo {
    /**
     * The display name of the site design.
     */
    Title: string;
    /**
     * Identifies which base template to add the design to. Use the value 64 for the Team site template, and the value 68 for the Communication site template.
     */
    WebTemplate: string;
    /**
     * An array of one or more site scripts. Each is identified by an ID. The scripts will run in the order listed.
     */
    SiteScriptIds?: string[];
    /**
     * (Optional) The display description of site design.
     */
    Description?: string;
    /**
     * (Optional) The URL of a preview image. If none is specified, SharePoint uses a generic image.
     */
    PreviewImageUrl?: string;
    /**
     * (Optional) The alt text description of the image for accessibility.
     */
    PreviewImageAltText?: string;
    /**
     * (Optional) True if the site design is applied as the default site design; otherwise, false. 
     * For more information see Customize a default site design https://docs.microsoft.com/en-us/sharepoint/dev/declarative-customization/customize-default-site-design.
     */
    IsDefault?: boolean;
}

/**
 * Data for updating a site design
 *
 */
export interface ISiteDesignUpdateInfo {
    /**
     * The ID of the site design to apply.
     */
    Id: string;
    /**
     * (Optional) The new display name of the updated site design.
     */
    Title?: string;
    /**
     * (Optional) The new template to add the site design to. Use the value 64 for the Team site template, and the value 68 for the Communication site template.
     */
    WebTemplate?: string;
    /**
     * (Optional) A new array of one or more site scripts. Each is identified by an ID. The scripts run in the order listed.
     */
    SiteScriptIds?: string[];
    /**
     * (Optional) The new display description of the updated site design.
     */
    Description?: string;
    /**
     * (Optional) The new URL of a preview image.
     */
    PreviewImageUrl?: string;
    /**
     * (Optional) The new alt text description of the image for accessibility.
     */
    PreviewImageAltText?: string;
    /**
     * (Optional) True if the site design is applied as the default site design; otherwise, false. 
     * For more information see Customize a default site design https://docs.microsoft.com/en-us/sharepoint/dev/declarative-customization/customize-default-site-design. 
     * If you had previously set the IsDefault parameter to TRUE and wish it to remain true, you must pass in this parameter again (otherwise it will be reset to FALSE).
     */
    IsDefault?: boolean;
}

/**
 * Result from retrieving the rights for a site design
 *
 */
export interface ISiteDesignPrincipals {
    /**
     * Display name
     */
    DisplayName: string;
    /**
     * The principal name
     */
    PrincipalName: string;
    /**
     * The principal name
     */
    Rights: number;
}

export interface ISiteDesignTask {
    /**
     * The ID of the site design task
     */
    ID: string;
    /**
     * Logonname of the user who created the task
     */
    LogonName: string;
    /**
     * The ID of the site design the task is running on
     */
    SiteDesignID: string;
    /**
     * The ID of the site collection
     */
    SiteID: string;
    /**
     * The ID of the web
     */
    WebID: string;
}

export interface ISiteScriptActionStatus {
    /**
     * Action index
     */
    ActionIndex: number;
    /**
     * Action key
     */
    ActionKey: string;
    /**
     * Action title
     */
    ActionTitle: string;
    /**
     * Last modified
     */
    LastModified: number;
    /**
     * Ordinal index
     */
    OrdinalIndex: string;
    /**
     * Outcome code
     */
    OutcomeCode: number;
    /**
    * Outcome text
    */
    OutcomeText: string;
    /**
     * Site script id
     */
    SiteScriptID: string;
    /**
     * Site script index
     */
    SiteScriptIndex: number;
    /**
     * Site script title
     */
    SiteScriptTitle: string;
}

export interface ISiteDesignRun {
    /**
     * The ID of the site design run
     */
    ID: string;
    /**
     * The ID of the site design that was applied
     */
    SiteDesignID: string;
    /**
     * The title of the site design that was applied
     */
    SiteDesignTitle: string;
    /**
     * The version of the site design that was applied
     */
    SiteDesignVersion: number;
    /**
     * The site id where the site design was applied
     */
    SiteID: string;
    /**
     * The start time when the site design was applied
     */
    StartTime: number;
    /**
     * The web id where the site design was applied
     */
    WebID: string;
}
