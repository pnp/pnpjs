import { SPFI, _SPQueryable, spInvokableFactory } from "@pnp/sp";
import { IOffice365Tenant, Office365Tenant } from "./Office365Tenant.js";

export * from "./types.js";
export * from "./Office365Tenant.js";


declare module "@pnp/sp/fi" {
    interface SPFI {

        /**
         * Access to the current web instance
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

}
export interface IAdmin {
    office365Tenant: IOffice365Tenant;
}
export const Admin: IAdmin = <any>spInvokableFactory(_Admin);














