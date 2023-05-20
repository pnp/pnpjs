import { SPFI, _SPQueryable, spInvokableFactory } from "@pnp/sp";
import { IOffice365Tenant, Office365Tenant } from "./office-tenant.js";
import { ITenantSiteProperties, TenantSiteProperties } from "./site-properties.js";
import { ITenant, Tenant } from "./tenant.js";

export * from "./types.js";
export * from "./office-tenant.js";

declare module "@pnp/sp/fi" {
    interface SPFI {

        /**
         * Access to the admin capabilities
         */
        readonly admin: IAdmin;
    }
}

Reflect.defineProperty(SPFI.prototype, "admin", {
    configurable: true,
    enumerable: true,
    get: function (this: SPFI) {
        return this.create(<any>Admin);
    },
});

class _Admin extends _SPQueryable {

    public get office365Tenant() {
        return Office365Tenant(this);
    }

    public get siteProperties() {
        return TenantSiteProperties(this);
    }

    public get tenant() {
        return Tenant(this);
    }
}
export interface IAdmin {
    readonly office365Tenant: IOffice365Tenant;
    readonly siteProperties: ITenantSiteProperties;
    readonly tenant: ITenant;
}
export const Admin: IAdmin = <any>spInvokableFactory(_Admin);
