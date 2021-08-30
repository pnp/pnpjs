import "./web.js";
import { SPRest2 } from "../rest-2.js";
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

declare module "../rest-2" {
    interface SPRest2 {
        readonly siteDesigns: ISiteDesigns;
    }
}

Reflect.defineProperty(SPRest2.prototype, "siteDesigns", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest2) {
        return this.create(SiteDesigns);
    },
});
