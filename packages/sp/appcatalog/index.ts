import { SPFI } from "../fi.js";
import { IWeb, Web } from "../webs/types.js";
import { AppCatalog, IAppCatalog } from "./types.js";

import "./web.js";

export {
    IAppAddResult,
    IApp,
    IAppCatalog,
    App,
    AppCatalog,
} from "./types.js";

declare module "../fi" {
    interface SPFI {
        tenantAppcatalog: IAppCatalog;
        getTenantAppCatalogWeb(): Promise<IWeb>;
    }
}

Reflect.defineProperty(SPFI.prototype, "tenantAppcatalog", {
    configurable: true,
    enumerable: true,
    get: function (this: SPFI) {
        return this.create(AppCatalog, "_api/web/tenantappcatalog/AvailableApps");
    },
});

SPFI.prototype.getTenantAppCatalogWeb = async function (this: SPFI): Promise<IWeb> {

    const data = await Web(this._root, "_api/SP_TenantSettings_Current")<{ CorporateCatalogUrl: string }>();

    return Web([this._root, data.CorporateCatalogUrl]);
};
