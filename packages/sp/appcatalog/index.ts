import { SPFI } from "../fi.js";
import { IWeb, Web } from "../webs/types.js";

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
        getTenantAppCatalogWeb(): Promise<IWeb>;
    }
}

SPFI.prototype.getTenantAppCatalogWeb = async function (this: SPFI): Promise<IWeb> {

    const data = await Web(this._root, "/_api/SP_TenantSettings_Current")<{ CorporateCatalogUrl: string }>();

    return Web([this._root, data.CorporateCatalogUrl]);
};
