import { body } from "@pnp/odata";
import { spPost } from "../operations";
import { ISharePointQueryable, _SharePointQueryable } from "../sharepointqueryable";
import { extractWebUrl } from "../utils/extractweburl";
import { tag } from "../telemetry";
import { escapeQueryStrValue } from "../utils/escapeQueryStrValue";

export class _SiteScripts extends _SharePointQueryable {

    constructor(baseUrl: string | ISharePointQueryable, methodName = "") {
        const url = typeof baseUrl === "string" ? baseUrl : baseUrl.toUrl();
        super(extractWebUrl(url), `_api/Microsoft.Sharepoint.Utilities.WebTemplateExtensions.SiteScriptUtility.${methodName}`);
    }

    public execute<T>(props: any): Promise<T> {
        return spPost<T>(this, body(props));
    }

    /**
     * Gets a list of information on all existing site scripts.
     */
    @tag("ss.getSiteScripts")
    public getSiteScripts(): Promise<ISiteScriptInfo[]> {
        return this.clone(SiteScriptsCloneFactory, "GetSiteScripts", true).execute<ISiteScriptInfo[]>({});
    }

    /**
     * Creates a new site script.
     * 
     * @param title The display name of the site script.
     * @param content JSON value that describes the script. For more information, see JSON reference.
     */
    @tag("ss.createSiteScript")
    public createSiteScript(title: string, description: string, content: any): Promise<ISiteScriptInfo> {
        return this.clone(SiteScriptsCloneFactory,
            `CreateSiteScript(Title=@title,Description=@desc)?@title='${escapeQueryStrValue(title)}'&@desc='${escapeQueryStrValue(description)}'`)
            .execute<ISiteScriptInfo>(content);
    }

    /**
     * Gets information about a specific site script. It also returns the JSON of the script.
     * 
     * @param id The ID of the site script to get information about.
     */
    @tag("ss.getSiteScriptMetadata")
    public getSiteScriptMetadata(id: string): Promise<ISiteScriptInfo> {
        return this.clone(SiteScriptsCloneFactory, "GetSiteScriptMetadata").execute<ISiteScriptInfo>({ id });
    }

    /**
     * Deletes a site script.
     * 
     * @param id The ID of the site script to delete.
     */
    @tag("ss.deleteSiteScript")
    public deleteSiteScript(id: string): Promise<void> {
        return this.clone(SiteScriptsCloneFactory, "DeleteSiteScript").execute<void>({ id });
    }

    /**
     * Updates a site script with new values. In the REST call, all parameters are optional except the site script Id.
     * 
     * @param siteScriptUpdateInfo Object that contains the information to update a site script. 
     *                             Make sure you stringify the content object or pass it in the second 'content' parameter
     * @param content (Optional) A new JSON script defining the script actions. For more information, see Site design JSON schema.
     */
    @tag("ss.updateSiteScript")
    public updateSiteScript(updateInfo: ISiteScriptUpdateInfo, content?: any): Promise<ISiteScriptInfo> {

        if (content) {
            updateInfo.Content = JSON.stringify(content);
        }

        return this.clone(SiteScriptsCloneFactory, "UpdateSiteScript").execute<ISiteScriptInfo>({ updateInfo });
    }

    /**
     * Gets the site script syntax (JSON) for a specific list
     * @param listUrl The absolute url of the list to retrieve site script
     */
    @tag("ss.getSiteScriptFromList")
    public getSiteScriptFromList(listUrl: string): Promise<string> {
        return this.clone(SiteScriptsCloneFactory, `GetSiteScriptFromList`).execute<string>({ listUrl });
    }

    /**
     * Gets the site script syntax (JSON) for a specific web
     * @param webUrl The absolute url of the web to retrieve site script
     * @param extractInfo configuration object to specify what to extract
     */
    @tag("ss.getSiteScriptFromWeb")
    public getSiteScriptFromWeb(webUrl: string, info: ISiteScriptSerializationInfo): Promise<ISiteScriptSerializationResult> {
        return this.clone(SiteScriptsCloneFactory, `getSiteScriptFromWeb`).execute<ISiteScriptSerializationResult>({ webUrl, info });
    }

    /**
     * Executes the indicated site design action on the indicated web.
     * 
     * @param webUrl The absolute url of the web to retrieve site script
     * @param extractInfo configuration object to specify what to extract
     */
    @tag("ss.executeSiteScriptAction")
    public executeSiteScriptAction(actionDefinition: string): Promise<ISiteScriptActionResult> {
        return this.clone(SiteScriptsCloneFactory, `executeSiteScriptAction`).execute<ISiteScriptActionResult>({ actionDefinition });
    }
}
export interface ISiteScripts extends _SiteScripts { }
export const SiteScripts = (baseUrl: string | ISharePointQueryable, methodName?: string): ISiteScripts => new _SiteScripts(baseUrl, methodName);

type SiteScriptsCloneType = ISiteScripts & ISharePointQueryable & { execute<T>(props: any): Promise<T> };
const SiteScriptsCloneFactory = (baseUrl: string | ISharePointQueryable, methodName = ""): SiteScriptsCloneType => <any>SiteScripts(baseUrl, methodName);

/**
 * Result from creating or retrieving a site script
 *
 */
export interface ISiteScriptInfo {
    /**
     * The ID of the site script to apply
     */
    Id: string;
    /**
     * The display name of the site script
     */
    Title: string;
    /**
     * The description for the site script
     */
    Description: string;
    /**
     * The JSON data/definition for the site script
     */
    Content: string;
    /**
     * The version number of the site script
     */
    Version: string;
}

/**
 * Data for updating a site script
 *
 */
export interface ISiteScriptUpdateInfo {
    /**
     * The ID of the site script to update
     */
    Id: string;
    /**
     * (Optional) The new display name for the updated site script
     */
    Title?: string;
    /**
     * (Optional) The new description for the updated site script
     */
    Description?: string;
    /**
     * (Optional) The new JSON data/definition for the updated site script
     */
    Content?: string;
    /**
     * (Optional) The new version for the updated site script
     */
    Version?: string;
}

export interface ISiteScriptSerializationInfo {
    /**
     * (Optional) Include branding
     */
    IncludeBranding?: boolean;
    /**
     * (Optional) Lists to include e.g. ["Lists/MyList"]
     */
    IncludedLists?: string[];
    /**
     * (Optional) Include links to exported items
     */
    IncludeLinksToExportedItems?: boolean;
    /**
     * (Optional) Include regional settings
     */
    IncludeRegionalSettings?: boolean;
    /**
     * (Optional) Include site external sharing capability
     */
    IncludeSiteExternalSharingCapability?: boolean;
    /**
     * (Optional) Include theme
     */
    IncludeTheme?: boolean;
}

export interface ISiteScriptSerializationResult {
    /**
     * The site script in JSON format
     */
    JSON: string;
    /**
    * A collection of warnings
    */
    Warnings: string[];
}

export interface ISiteScriptActionResult {

    /**
     * The title of the action.
     */
    Title: string;

    /**
     * Text associated with the outcome of the action. If this is present, it is usually an error message.
     */
    OutcomeText: string;

    /**
     * Indicates the outcome of the action.
     */
    Outcome: SiteScriptActionOutcome;

    /**
     * Indicates the target of the action.
     */
    Target: string;
}

export enum SiteScriptActionOutcome {

    /**
     * The stage was deemed to have completed successfully.
     */
    Success = 0,

    /**
     * The stage was deemed to have failed to complete successfully (non-blocking, rest of recipe
     * execution should still be able to proceed).
     */
    Failure = 1,

    /**
     * No action was taken for this stage / this stage was skipped.
     */
    NoOp = 2,

    /**
     * There was an exception but the operation succeeded. This is analagous to the operation completing
     * in a "yellow" state.
     */
    SucceededWithException = 3,
}
