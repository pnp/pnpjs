import { body } from "@pnp/queryable";
import { _SPInstance, defaultPath, spPost, spInvokableFactory } from "@pnp/sp";
import { ITenantSitePropertiesInfo } from "./types.js";

@defaultPath("_api/Microsoft.Online.SharePoint.TenantAdministration.SiteProperties")
class _TenantSiteProperties extends _SPInstance<ITenantSitePropertiesInfo> {

    /**
    * Choose which fields to return
    *
    * @param selects One or more fields to return
    * @description we limit the selects here because there are so many values possible and it improves discoverability.
    * Unfortunately this doesn't work as a general solution due to expands
    */
    public select(...selects: ("*" | keyof ITenantSitePropertiesInfo)[]): this {
        return super.select(...selects);
    }

    /**
     * Clears the Lockdown placed due to Sharing-Lockdown Policy
     */
    public clearSharingLockDown(siteUrl: string): Promise<void> {
        return spPost(TenantSiteProperties(this, "ClearSharingLockDown"), body({
            siteUrl,
        }));
    }
}
export interface ITenantSiteProperties extends _TenantSiteProperties { }
export const TenantSiteProperties = spInvokableFactory<ITenantSiteProperties>(_TenantSiteProperties);
