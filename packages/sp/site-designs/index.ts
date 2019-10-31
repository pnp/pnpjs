import "./web";
import { SPRest } from "../rest";
import { ISiteDesigns, SiteDesigns } from "./types";

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
} from "./types";

declare module "../rest" {
    interface SPRest {
        readonly siteDesigns: ISiteDesigns;
    }
}

Reflect.defineProperty(SPRest.prototype, "siteDesigns", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest) {
        return SiteDesigns(this._baseUrl);
    },
});
