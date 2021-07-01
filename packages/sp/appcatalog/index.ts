import { SPRest } from "../rest.js";
import { IWeb, Web } from "../webs/types.js";

import "./web.js";
import { OLD_SharePointQueryable } from "../sharepointqueryable.js";

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

// SPRest.prototype.getTenantAppCatalogWeb = async function (this: SPRest): Promise<IWeb> {

//     return this.childConfigHook(async ({ options, runtime }) => {
//         const data: { CorporateCatalogUrl: string } = await OLD_SharePointQueryable("/", "_api/SP_TenantSettings_Current").configure(options).setRuntime(runtime)();
//         return Web(data.CorporateCatalogUrl).configure(options).setRuntime(runtime);
//     });
// };
