import { SPRest } from "../rest.js";
import { IWeb, Web } from "../webs/types.js";

import "./web.js";
import { SharePointQueryable } from "../sharepointqueryable.js";

export {
    IAppAddResult,
    IApp,
    IAppCatalog,
    App,
    AppCatalog,
} from "./types.js";

declare module "../rest" {
    interface SPRest {
        getTenantAppCatalogWeb(): Promise<IWeb>;
    }
}

SPRest.prototype.getTenantAppCatalogWeb = async function (this: SPRest): Promise<IWeb> {

    return this.childConfigHook(async ({ options, runtime }) => {
        const data: { CorporateCatalogUrl: string } = await SharePointQueryable("/", "_api/SP_TenantSettings_Current").configure(options).setRuntime(runtime)();
        if (!data?.CorporateCatalogUrl) {
            throw new Error("Failed to get tenant corporate app catalog, its not configured on the tenant.");
        }
        return Web(data.CorporateCatalogUrl).configure(options).setRuntime(runtime);
    });
};
