import { _SharePointQueryable, ISharePointQueryable } from "../sharepointqueryable";
import { extractWebUrl } from "../utils/extractweburl";
import { spPost } from "../operations";
import { body } from "@pnp/odata";

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

    /**
     * Gets a list of information on all existing site scripts.
     */
    public getSiteScripts(): Promise<ISiteScriptInfo[]> {
        return this.clone(SiteScriptsCloneFactory, "GetSiteScripts", true).execute<ISiteScriptInfo[]>({});
    }

    /**
     * Creates a new site script.
     * 
     * @param title The display name of the site design.
     * @param content JSON value that describes the script. For more information, see JSON reference.
     */
    public async createSiteScript(title: string, description: string, content: any): Promise<ISiteScriptInfo> {
        return await this.clone(SiteScriptsCloneFactory,
            `CreateSiteScript(Title=@title,Description=@desc)?@title='${encodeURIComponent(title)}'&@desc='${encodeURIComponent(description)}'`)
            .execute<ISiteScriptInfo>(content);
    }

    /**
     * Gets information about a specific site script. It also returns the JSON of the script.
     * 
     * @param id The ID of the site script to get information about.
     */
    public async getSiteScriptMetadata(id: string): Promise<ISiteScriptInfo> {
        return await this.clone(SiteScriptsCloneFactory, "GetSiteScriptMetadata").execute<ISiteScriptInfo>({ id: id });
    }

    /**
     * Deletes a site script.
     * 
     * @param id The ID of the site script to delete.
     */
    public async deleteSiteScript(id: string): Promise<void> {
        await this.clone(SiteScriptsCloneFactory, "DeleteSiteScript").execute<void>({ id: id });
    }

    /**
     * Updates a site script with new values. In the REST call, all parameters are optional except the site script Id.
     * 
     * @param siteScriptUpdateInfo Object that contains the information to update a site script. 
     *                             Make sure you stringify the content object or pass it in the second 'content' parameter
     * @param content (Optional) A new JSON script defining the script actions. For more information, see Site design JSON schema.
     */
    public async updateSiteScript(siteScriptUpdateInfo: ISiteScriptUpdateInfo, content?: any): Promise<ISiteScriptInfo> {
        if (content) {
            siteScriptUpdateInfo.Content = JSON.stringify(content);
        }

        return await this.clone(SiteScriptsCloneFactory, "UpdateSiteScript").execute<ISiteScriptInfo>({ updateInfo: siteScriptUpdateInfo });
    }
}

export interface _ISiteScripts {
    getSiteScripts(): Promise<ISiteScriptInfo[]>;
    createSiteScript(title: string, description: string, content: any): Promise<ISiteScriptInfo>;
    getSiteScriptMetadata(id: string): Promise<ISiteScriptInfo>;
    deleteSiteScript(id: string): Promise<void>;
    updateSiteScript(siteScriptUpdateInfo: ISiteScriptUpdateInfo, content?: any): Promise<ISiteScriptInfo>;
}

export interface ISiteScripts extends _ISiteScripts { }

export const SiteScripts = (baseUrl: string | ISharePointQueryable): ISiteScripts => new _SiteScripts(baseUrl);

type SiteScriptsCloneType = ISiteScripts & ISharePointQueryable & { execute<T>(props: any): Promise<T> };
const SiteScriptsCloneFactory = (baseUrl: string | ISharePointQueryable): SiteScriptsCloneType => <any>SiteScripts(baseUrl);

export interface ISiteScriptInfo {
    Id: string;
    Title: string;
    Description: string;
    Content: string;
    Version: string;
}

export interface ISiteScriptUpdateInfo {
    Id: string;
    Title?: string;
    Description?: string;
    Content?: string;
    Version?: string;
}
