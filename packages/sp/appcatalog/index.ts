import { SPFI } from "../fi";
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

    return this.create(async (q) => {

        const data = await Web([q, q.toUrl().replace(/\/_api\/.*$/i, "")], "/_api/SP_TenantSettings_Current")<{ CorporateCatalogUrl: string }>();

        return Web([q, data.CorporateCatalogUrl]);
    });
};
