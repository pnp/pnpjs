import { SharePointQueryable } from "./sharepointqueryable";

export interface SiteScriptInfo {
    Id: string;
    Title: string;
    Description: string;
    Content: string;
    Version: string;
}

export interface SiteScriptUpdateInfo {
    Id: string;
    Title?: string;
    Description?: string;
    Content?: string;
    Version?: string;
}

export interface SiteScriptUtilityMethods {
    getSiteScripts(): Promise<SiteScriptInfo[]>;
    createSiteScript(title: string, description: string, content: any): Promise<SiteScriptInfo>;
    getSiteScriptMetadata(id: string): Promise<SiteScriptInfo>;
    deleteSiteScript(id: string): Promise<void>;
    updateSiteScript(siteScriptUpdateInfo: SiteScriptUpdateInfo, content?: any): Promise<SiteScriptInfo>;
    getSiteScriptFromList(listUrl: string): Promise<string>;
    getSiteScriptFromWeb(webUrl: string, info: ISiteScriptSerializationInfo): Promise<ISiteScriptSerializationResult>;
}

export interface ISiteScriptSerializationInfo {
    IncludeBranding?: boolean;
    IncludedLists?: string[];
    IncludeLinksToExportedItems?: boolean;
    IncludeRegionalSettings?: boolean;
    IncludeSiteExternalSharingCapability?: boolean;
    IncludeTheme?: boolean;
}

export interface ISiteScriptSerializationResult {
    JSON: string;
    Warnings: string[];
}

/**
 * Implements the site script API REST methods
 *
 */
export class SiteScripts extends SharePointQueryable implements SiteScriptUtilityMethods {
    /**
     * Creates a new instance of the SiteScripts method class
     *
     * @param baseUrl The parent url provider
     * @param methodName The static method name to call on the utility class
     */
    constructor(baseUrl: string | SharePointQueryable, methodName: string) {
        super(SiteScripts.getBaseUrl(baseUrl), `_api/Microsoft.Sharepoint.Utilities.WebTemplateExtensions.SiteScriptUtility.${methodName}`);
    }

    private static getBaseUrl(candidate: string | SharePointQueryable) {
        if (typeof candidate === "string") {
            return candidate;
        }

        const c = candidate as SharePointQueryable;
        const url = c.toUrl();
        const index = url.indexOf("_api/");
        if (index < 0) {
            return url;
        }

        return url.substr(0, index);
    }

    public execute<T>(props: any): Promise<T> {
        return this.postCore<T>({
            body: JSON.stringify(props),
        });
    }

    /**
     * Gets a list of information on all existing site scripts.
     */
    public getSiteScripts(): Promise<SiteScriptInfo[]> {
        return this.clone(SiteScripts, "GetSiteScripts", true).execute<SiteScriptInfo[]>({});
    }

    /**
     * Creates a new site script.
     * 
     * @param title The display name of the site design.
     * @param content JSON value that describes the script. For more information, see JSON reference.
     */
    public async createSiteScript(title: string, description: string, content: any): Promise<SiteScriptInfo> {
        return await this.clone(SiteScripts,
            `CreateSiteScript(Title=@title,Description=@desc)?@title='${encodeURIComponent(title)}'&@desc='${encodeURIComponent(description)}'`)
            .execute<SiteScriptInfo>(content);
    }

    /**
     * Gets information about a specific site script. It also returns the JSON of the script.
     * 
     * @param id The ID of the site script to get information about.
     */
    public async getSiteScriptMetadata(id: string): Promise<SiteScriptInfo> {
        return await this.clone(SiteScripts, "GetSiteScriptMetadata").execute<SiteScriptInfo>({ id: id });
    }

    /**
     * Deletes a site script.
     * 
     * @param id The ID of the site script to delete.
     */
    public async deleteSiteScript(id: string): Promise<void> {
        await this.clone(SiteScripts, "DeleteSiteScript").execute<void>({ id: id });
    }

    /**
     * Updates a site script with new values. In the REST call, all parameters are optional except the site script Id.
     * 
     * @param siteScriptUpdateInfo Object that contains the information to update a site script. 
     *                             Make sure you stringify the content object or pass it in the second 'content' parameter
     * @param content (Optional) A new JSON script defining the script actions. For more information, see Site design JSON schema.
     */
    public async updateSiteScript(siteScriptUpdateInfo: SiteScriptUpdateInfo, content?: any): Promise<SiteScriptInfo> {
        if (content) {
            siteScriptUpdateInfo.Content = JSON.stringify(content);
        }

        return await this.clone(SiteScripts, "UpdateSiteScript").execute<SiteScriptInfo>({ updateInfo: siteScriptUpdateInfo });
    }

    /**
     * Gets the site script syntax (JSON) for a specific list
     * @param listUrl The absolute url of the list to retrieve site script
     */
    public async getSiteScriptFromList(listUrl: string): Promise<string> {
        return await this.clone(SiteScripts, `GetSiteScriptFromList`)
            .execute<string>({ "listUrl": listUrl });
    }

    /**
     * Gets the site script syntax (JSON) for a specific web
     * @param webUrl The absolute url of the web to retrieve site script
     * @param extractInfo configuration object to specify what to extract
     */
    public async getSiteScriptFromWeb(webUrl: string, extractInfo: ISiteScriptSerializationInfo): Promise<ISiteScriptSerializationResult> {
        return await this.clone(SiteScripts, `getSiteScriptFromWeb`)
            .execute<ISiteScriptSerializationResult>({ "webUrl": webUrl, info: extractInfo });
    }

}
