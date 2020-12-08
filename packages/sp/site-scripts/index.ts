import "./web.js";
import "./list.js";
import { SPRest } from "../rest.js";
import { ISiteScripts, SiteScripts } from "./types.js";

export {
    SiteScripts,
    ISiteScripts,
    ISiteScriptInfo,
    ISiteScriptUpdateInfo,
    ISiteScriptSerializationInfo,
    ISiteScriptSerializationResult,
} from "./types.js";

declare module "../rest" {
    interface SPRest {
        readonly siteScripts: ISiteScripts;
    }
}

Reflect.defineProperty(SPRest.prototype, "siteScripts", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest) {
        return this.childConfigHook(({ options, baseUrl, runtime }) => {
            return SiteScripts(baseUrl).configure(options).setRuntime(runtime);
        });
    },
});
