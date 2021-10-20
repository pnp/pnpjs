import { ISPQueryable, _SPQueryable } from "../spqueryable.js";
import { extractWebUrl } from "../utils/extract-web-url.js";
import { headers, body } from "@pnp/queryable";
import { spPost } from "../operations.js";
import { hOP } from "@pnp/core";


export class _SiteDesigns extends _SPQueryable {

    constructor(baseUrl: string | ISPQueryable, methodName = "") {
        const url = typeof baseUrl === "string" ? baseUrl : baseUrl.toUrl();
        super(extractWebUrl(url), `_api/Microsoft.Sharepoint.Utilities.WebTemplateExtensions.SiteScriptUtility.${methodName}`);
    }

    public run<T>(props: any): Promise<T> {
        return spPost<T>(this, body(props, headers({ "Content-Type": "application/json;charset=utf-8" })));
    }

    /**
     * Creates a new site design available to users when they create a new site from the SharePoint home page.
     *
     * @param creationInfo A sitedesign creation information object
     */
    public createSiteDesign(creationInfo: ISiteDesignCreationInfo): Promise<ISiteDesignInfo> {
        return SiteDesignsCloneFactory(this, "CreateSiteDesign").run<ISiteDesignInfo>({ info: creationInfo });
    }

    /**
     * Applies a site design to an existing site collection.
     *
     * @param siteDesignId The ID of the site design to apply.
     * @param webUrl The URL of the site collection where you want to apply the site design.
     */
    public applySiteDesign(siteDesignId: string, webUrl: string): Promise<void> {
        return SiteDesignsCloneFactory(this, "ApplySiteDesign").run<void>({ siteDesignId: siteDesignId, "webUrl": webUrl });
    }

    /**
     * Gets the list of available site designs
     */
    public getSiteDesigns(): Promise<ISiteDesignInfo[]> {
        return SiteDesignsCloneFactory(this, "GetSiteDesigns").run<ISiteDesignInfo[]>({});
    }

    /**
     * Gets information about a specific site design.
     * @param id The ID of the site design to get information about.
     */
    public getSiteDesignMetadata(id: string): Promise<ISiteDesignInfo> {
        return SiteDesignsCloneFactory(this, "GetSiteDesignMetadata").run<ISiteDesignInfo>({ id: id });
    }

    /**
     * Updates a site design with new values. In the REST call, all parameters are optional except the site script Id.
     * If you had previously set the IsDefault parameter to TRUE and wish it to remain true, you must pass in this parameter again (otherwise it will be reset to FALSE).
     * @param updateInfo A sitedesign update information object
     */
    public updateSiteDesign(updateInfo: ISiteDesignUpdateInfo): Promise<ISiteDesignInfo> {
        return SiteDesignsCloneFactory(this, "UpdateSiteDesign").run<ISiteDesignInfo>({ updateInfo: updateInfo });
    }

    /**
     * Deletes a site design.
     * @param id The ID of the site design to delete.
     */
    public deleteSiteDesign(id: string): Promise<void> {
        return SiteDesignsCloneFactory(this, "DeleteSiteDesign").run<void>({ id: id });
    }

    /**
     * Gets a list of principals that have access to a site design.
     * @param id The ID of the site design to get rights information from.
     */
    public getSiteDesignRights(id: string): Promise<ISiteDesignPrincipals[]> {
        return SiteDesignsCloneFactory(this, "GetSiteDesignRights").run<ISiteDesignPrincipals[]>({ id: id });
    }

    /**
     * Grants access to a site design for one or more principals.
     * @param id The ID of the site design to grant rights on.
     * @param principalNames An array of one or more principals to grant view rights.
     *                       Principals can be users or mail-enabled security groups in the form of "alias" or "alias@<domain name>.com"
     * @param grantedRights Always set to 1. This represents the View right.
     */
    public grantSiteDesignRights(id: string, principalNames: string[], grantedRights = 1): Promise<void> {
        return SiteDesignsCloneFactory(this, "GrantSiteDesignRights").run<void>({
            "grantedRights": grantedRights.toString(),
            id,
            principalNames,
        });
    }

    /**
     * Revokes access from a site design for one or more principals.
     * @param id The ID of the site design to revoke rights from.
     * @param principalNames An array of one or more principals to revoke view rights from.
     *                       If all principals have rights revoked on the site design, the site design becomes viewable to everyone.
     */
    public revokeSiteDesignRights(id: string, principalNames: string[]): Promise<void> {
        return SiteDesignsCloneFactory(this, "RevokeSiteDesignRights").run<void>({
            id,
            principalNames,
        });
    }

    /**
     * Adds a site design task on the specified web url to be invoked asynchronously.
     * @param webUrl The absolute url of the web on where to create the task
     * @param siteDesignId The ID of the site design to create a task for
     */
    public addSiteDesignTask(webUrl: string, siteDesignId: string): Promise<ISiteDesignTask> {
        return SiteDesignsCloneFactory(this, "AddSiteDesignTask").run<ISiteDesignTask>({ webUrl, siteDesignId });
    }

    /**
     * Adds a site design task on the current web to be invoked asynchronously.
     * @param siteDesignId The ID of the site design to create a task for
     */
    public addSiteDesignTaskToCurrentWeb(siteDesignId: string): Promise<ISiteDesignTask> {
        return SiteDesignsCloneFactory(this, "AddSiteDesignTaskToCurrentWeb").run<ISiteDesignTask>({ siteDesignId });
    }

    /**
     * Retrieves the site design task, if the task has finished running null will be returned
     * @param id The ID of the site design task
     */
    public async getSiteDesignTask(id: string): Promise<ISiteDesignTask> {
        const task = await SiteDesignsCloneFactory(this, "GetSiteDesignTask").run<ISiteDesignTask>({ "taskId": id });
        return hOP(task, "ID") ? task : null;
    }

    /**
     * Retrieves a list of site design that have run on a specific web
     * @param webUrl The url of the web where the site design was applied
     * @param siteDesignId (Optional) the site design ID, if not provided will return all site design runs
     */
    public getSiteDesignRun(webUrl: string, siteDesignId?: string): Promise<ISiteDesignRun[]> {
        return SiteDesignsCloneFactory(this, "GetSiteDesignRun").run<ISiteDesignRun[]>({ webUrl, siteDesignId });
    }

    /**
     * Retrieves the status of a site design that has been run or is still running
     * @param webUrl The url of the web where the site design was applied
     * @param runId the run ID
     */
    public getSiteDesignRunStatus(webUrl: string, runId: string): Promise<ISiteScriptActionStatus[]> {
        return SiteDesignsCloneFactory(this, "GetSiteDesignRunStatus").run<ISiteScriptActionStatus[]>({ webUrl, runId });
    }
}
export interface ISiteDesigns extends _SiteDesigns { }
export const SiteDesigns = (baseUrl: string | ISPQueryable, methodName?: string): ISiteDesigns => new _SiteDesigns(baseUrl, methodName);

type SiteDesignsCloneType = ISiteDesigns & ISPQueryable & { run<T>(props: any): Promise<T> };
const SiteDesignsCloneFactory = (baseUrl: string | ISPQueryable, methodName = ""): SiteDesignsCloneType => <any>SiteDesigns(baseUrl, methodName);

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
