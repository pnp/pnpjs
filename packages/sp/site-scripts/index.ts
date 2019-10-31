import "./web";
import "./list";
import { SPRest } from "../rest";
import { ISiteScripts, SiteScripts } from "./types";

export {
    SiteScripts,
    ISiteScripts,
    ISiteScriptInfo,
    ISiteScriptUpdateInfo,
    ISiteScriptSerializationInfo,
    ISiteScriptSerializationResult,
} from "./types";

declare module "../rest" {
    interface SPRest {
        readonly siteScripts: ISiteScripts;
    }
}

Reflect.defineProperty(SPRest.prototype, "siteScripts", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest) {
        return SiteScripts(this._baseUrl);
    },
});
