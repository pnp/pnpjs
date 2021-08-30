import { IWeb, Web, _Web } from "../webs/types.js";
import { FromQueryable } from "@pnp/queryable/index.js";

import "./web.js";
import { AppCatalog, IAppCatalog } from "./types.js";

export {
    IAppAddResult,
    IApp,
    IAppCatalog,
    App,
    AppCatalog,
} from "./types.js";

declare module "../webs/types" {
    interface IWeb {
        getTenantAppCatalog(): Promise<IAppCatalog>;
    }
    interface _Web {
        getTenantAppCatalog(): Promise<IAppCatalog>;
    }
}

_Web.prototype.getTenantAppCatalog = async function (this: IWeb): Promise<IAppCatalog> {
    const data: { CorporateCatalogUrl: string } = await Web(this.toUrl().replace(/\/_api\/.*$/i, ""), "/_api/SP_TenantSettings_Current").using(FromQueryable(this))();
    return AppCatalog(data.CorporateCatalogUrl).using(FromQueryable(this));
};
