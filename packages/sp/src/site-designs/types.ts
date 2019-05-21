import { _SharePointQueryable, ISharePointQueryable } from "../sharepointqueryable";
import { extractWebUrl } from "../utils/extractweburl";
import { headers, body } from "@pnp/odata";
import { spPost } from "../operations";

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

    /**
     * Creates a new site design available to users when they create a new site from the SharePoint home page.
     * 
     * @param creationInfo A sitedesign creation information object
     */
    public async createSiteDesign(creationInfo: ISiteDesignCreationInfo): Promise<ISiteDesignInfo> {
        return await this.clone(SiteDesignsCloneFactory, `CreateSiteDesign`).execute<ISiteDesignInfo>({ info: creationInfo });
    }

    /**
     * Applies a site design to an existing site collection.
     *
     * @param siteDesignId The ID of the site design to apply.
     * @param webUrl The URL of the site collection where you want to apply the site design.
     */
    public async applySiteDesign(siteDesignId: string, webUrl: string): Promise<void> {
        return await this.clone(SiteDesignsCloneFactory, `ApplySiteDesign`).execute<void>({ siteDesignId: siteDesignId, "webUrl": webUrl });
    }

    /**
     * Gets a list of information about existing site designs.
     */
    public async getSiteDesigns(): Promise<ISiteDesignInfo[]> {
        return await this.clone(SiteDesignsCloneFactory, `GetSiteDesigns`).execute<ISiteDesignInfo[]>({});
    }

    /**
     * Gets information about a specific site design.
     * @param id The ID of the site design to get information about.
     */
    public async getSiteDesignMetadata(id: string): Promise<ISiteDesignInfo> {
        return await this.clone(SiteDesignsCloneFactory, `GetSiteDesignMetadata`).execute<ISiteDesignInfo>({ id: id });
    }

    /**
     * Updates a site design with new values. In the REST call, all parameters are optional except the site script Id.
     * If you had previously set the IsDefault parameter to TRUE and wish it to remain true, you must pass in this parameter again (otherwise it will be reset to FALSE). 
     * @param updateInfo A sitedesign update information object
     */
    public async updateSiteDesign(updateInfo: ISiteDesignUpdateInfo): Promise<ISiteDesignInfo> {
        return await this.clone(SiteDesignsCloneFactory, `UpdateSiteDesign`).execute<ISiteDesignInfo>({ updateInfo: updateInfo });
    }

    /**
     * Deletes a site design.
     * @param id The ID of the site design to delete.
     */
    public async deleteSiteDesign(id: string): Promise<void> {
        return await this.clone(SiteDesignsCloneFactory, `DeleteSiteDesign`).execute<void>({ id: id });
    }

    /**
     * Gets a list of principals that have access to a site design.
     * @param id The ID of the site design to get rights information from.
     */
    public async getSiteDesignRights(id: string): Promise<ISiteDesignPrincipals[]> {
        return await this.clone(SiteDesignsCloneFactory, `GetSiteDesignRights`).execute<ISiteDesignPrincipals[]>({ id: id });
    }

    /**
     * Grants access to a site design for one or more principals.
     * @param id The ID of the site design to grant rights on.
     * @param principalNames An array of one or more principals to grant view rights. 
     *                       Principals can be users or mail-enabled security groups in the form of "alias" or "alias@<domain name>.com"
     * @param grantedRights Always set to 1. This represents the View right.
     */
    public async grantSiteDesignRights(id: string, principalNames: string[], grantedRights = 1): Promise<void> {
        return await this.clone(SiteDesignsCloneFactory, `GrantSiteDesignRights`)
            .execute<void>({
                "grantedRights": grantedRights.toString(),
                "id": id,
                "principalNames": principalNames,
            });
    }

    /**
     * Revokes access from a site design for one or more principals.
     * @param id The ID of the site design to revoke rights from.
     * @param principalNames An array of one or more principals to revoke view rights from. 
     *                       If all principals have rights revoked on the site design, the site design becomes viewable to everyone.
     */
    public async revokeSiteDesignRights(id: string, principalNames: string[]): Promise<void> {
        return await this.clone(SiteDesignsCloneFactory, `RevokeSiteDesignRights`)
            .execute<void>({
                "id": id,
                "principalNames": principalNames,
            });
    }
}

export interface _ISiteDesigns {
    getSiteDesigns(): Promise<ISiteDesignInfo[]>;
    createSiteDesign(creationInfo: ISiteDesignCreationInfo): Promise<ISiteDesignInfo>;
    applySiteDesign(siteDesignId: string, webUrl: string): Promise<void>;
    getSiteDesignMetadata(id: string): Promise<ISiteDesignInfo>;
    updateSiteDesign(updateInfo: ISiteDesignUpdateInfo): Promise<ISiteDesignInfo>;
    deleteSiteDesign(id: string): Promise<void>;
    getSiteDesignRights(id: string): Promise<ISiteDesignPrincipals[]>;
    grantSiteDesignRights(id: string, principalNames: string[], grantedRights?: number): Promise<void>;
    revokeSiteDesignRights(id: string, principalNames: string[]): Promise<void>;
}

export interface ISiteDesigns extends _ISiteDesigns, ISharePointQueryable {}

export const SiteDesigns = (baseUrl: string | ISharePointQueryable): ISiteDesigns => new _SiteDesigns(baseUrl);

type SiteDesignsCloneType = ISiteDesigns & ISharePointQueryable & { execute<T>(props: any): Promise<T> };
const SiteDesignsCloneFactory = (baseUrl: string | ISharePointQueryable): SiteDesignsCloneType => <any>SiteDesigns(baseUrl);

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
    Version: string;
}

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

export interface ISiteDesignPrincipals {
    DisplayName: string;
    PrincipalName: string;
    Rights: number;
}
