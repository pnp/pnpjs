import { SPFI } from "../fi";
import { IWeb, Web } from "../webs/types.js";
import { AssignFrom } from "@pnp/core";

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

        const data: { CorporateCatalogUrl: string } = await Web(q.toUrl().replace(/\/_api\/.*$/i, ""), "/_api/SP_TenantSettings_Current").using(AssignFrom(q))();

        console.log(data);

        return Web(data.CorporateCatalogUrl).using(AssignFrom(q));

    });

    return null;
};
