import "./web.js";
import { SPRest } from "../rest.js";
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

declare module "../rest" {
    interface SPRest {
        readonly siteDesigns: ISiteDesigns;
    }
}

Reflect.defineProperty(SPRest.prototype, "siteDesigns", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest) {
        return this.childConfigHook(({ options, baseUrl, runtime }) => {
            return SiteDesigns(baseUrl).configure(options).setRuntime(runtime);
        });
    },
});
