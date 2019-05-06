import { SPRest } from "../rest";
import { IWeb, Web } from "../webs/types";

import "./web";
import { SharePointQueryable } from "@pnp/sp/presets/all";

export {
    AppAddResult,
    IApp,
    IAppCatalog,
    App,
    AppCatalog,
} from "./types";

/**
 * Extend rest
 */
declare module "../rest" {
    interface SPRest {
        getTenantAppCatalogWeb(): Promise<IWeb>;
    }
}

SPRest.prototype.getTenantAppCatalogWeb = async function (this: SPRest): Promise<IWeb> {
    const data: { CorporateCatalogUrl: string } = await SharePointQueryable("/", "_api/SP_TenantSettings_Current")();
    return Web(data.CorporateCatalogUrl);
};
