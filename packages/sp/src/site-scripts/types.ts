import { body } from "@pnp/odata";
import { spPost } from "../operations";
import { ISharePointQueryable, _SharePointQueryable } from "../sharepointqueryable";
import { extractWebUrl } from "../utils/extractweburl";

/**
 * Implements the site script API REST methods
 *
 */
export class _SiteScripts extends _SharePointQueryable implements _ISiteScripts {
    /**
     * Creates a new instance of the SiteScripts method class
     *
     * @param baseUrl The parent url provider
     * @param methodName The static method name to call on the utility class
     */
    constructor(baseUrl: string | ISharePointQueryable, methodName = "") {
        const url = typeof baseUrl === "string" ? baseUrl : baseUrl.toUrl();
        super(extractWebUrl(url), `_api/Microsoft.Sharepoint.Utilities.WebTemplateExtensions.SiteScriptUtility.${methodName}`);
    }

    public execute<T>(props: any): Promise<T> {
        return spPost<T>(this, body(props));
    }

    public getSiteScripts(): Promise<ISiteScriptInfo[]> {
        return this.clone(SiteScriptsCloneFactory, "GetSiteScripts", true).execute<ISiteScriptInfo[]>({});
    }

    public async createSiteScript(title: string, description: string, content: any): Promise<ISiteScriptInfo> {
        return await this.clone(SiteScriptsCloneFactory,
            `CreateSiteScript(Title=@title,Description=@desc)?@title='${encodeURIComponent(title)}'&@desc='${encodeURIComponent(description)}'`)
            .execute<ISiteScriptInfo>(content);
    }

    public async getSiteScriptMetadata(id: string): Promise<ISiteScriptInfo> {
        return await this.clone(SiteScriptsCloneFactory, "GetSiteScriptMetadata").execute<ISiteScriptInfo>({ id: id });
    }

    public async deleteSiteScript(id: string): Promise<void> {
        await this.clone(SiteScriptsCloneFactory, "DeleteSiteScript").execute<void>({ id: id });
    }

    public async updateSiteScript(siteScriptUpdateInfo: ISiteScriptUpdateInfo, content?: any): Promise<ISiteScriptInfo> {
        if (content) {
            siteScriptUpdateInfo.Content = JSON.stringify(content);
        }

        return await this.clone(SiteScriptsCloneFactory, "UpdateSiteScript").execute<ISiteScriptInfo>({ updateInfo: siteScriptUpdateInfo });
    }
}

export interface _ISiteScripts {
    /**
     * Gets a list of information on all existing site scripts.
     */
    getSiteScripts(): Promise<ISiteScriptInfo[]>;
    /**
     * Creates a new site script.
     * 
     * @param title The display name of the site script.
     * @param content JSON value that describes the script. For more information, see JSON reference.
     */
    createSiteScript(title: string, description: string, content: any): Promise<ISiteScriptInfo>;
    /**
     * Gets information about a specific site script. It also returns the JSON of the script.
     * 
     * @param id The ID of the site script to get information about.
     */
    getSiteScriptMetadata(id: string): Promise<ISiteScriptInfo>;
    /**
     * Deletes a site script.
     * 
     * @param id The ID of the site script to delete.
     */
    deleteSiteScript(id: string): Promise<void>;
    /**
     * Updates a site script with new values. In the REST call, all parameters are optional except the site script Id.
     * 
     * @param siteScriptUpdateInfo Object that contains the information to update a site script. 
     *                             Make sure you stringify the content object or pass it in the second 'content' parameter
     * @param content (Optional) A new JSON script defining the script actions. For more information, see Site design JSON schema.
     */
    updateSiteScript(siteScriptUpdateInfo: ISiteScriptUpdateInfo, content?: any): Promise<ISiteScriptInfo>;
}

export interface ISiteScripts extends _ISiteScripts { }

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
