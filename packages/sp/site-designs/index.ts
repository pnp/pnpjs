import "./web.js";
import { SPFI } from "../fi.js";
import { ISiteDesigns, SiteDesigns } from "./types.js";

export {
    ISiteDesignCreationInfo,
    ISiteDesignInfo,
    ISiteDesignPrincipals,
    ISiteDesignUpdateInfo,
    ISiteDesigns,
    SiteDesigns,
    ISiteDesignRun,
    ISiteDesignTask,
    ISiteScriptActionStatus,
} from "./types.js";

declare module "../fi" {
    interface SPFI {
        readonly siteDesigns: ISiteDesigns;
    }
}

Reflect.defineProperty(SPFI.prototype, "siteDesigns", {
    configurable: true,
    enumerable: true,
    get: function (this: SPFI) {
        return this.create(SiteDesigns);
    },
});
