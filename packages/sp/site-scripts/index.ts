import "./web.js";
import "./list.js";
import { SPRest2 } from "../rest-2.js";
import { ISiteScripts, SiteScripts } from "./types.js";

export {
    SiteScripts,
    ISiteScripts,
    ISiteScriptInfo,
    ISiteScriptUpdateInfo,
    ISiteScriptSerializationInfo,
    ISiteScriptSerializationResult,
} from "./types.js";

declare module "../rest-2" {
    interface SPRest2 {
        readonly siteScripts: ISiteScripts;
    }
}

Reflect.defineProperty(SPRest2.prototype, "siteScripts", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest2) {
        return this.create(SiteScripts);
    },
});
