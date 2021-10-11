import "./web.js";
import "./list.js";
import { SPFI } from "../fi.js";
import { ISiteScripts, SiteScripts } from "./types.js";

export {
    SiteScripts,
    ISiteScripts,
    ISiteScriptInfo,
    ISiteScriptUpdateInfo,
    ISiteScriptSerializationInfo,
    ISiteScriptSerializationResult,
} from "./types.js";

declare module "../fi" {
    interface SPFI {
        readonly siteScripts: ISiteScripts;
    }
}

Reflect.defineProperty(SPFI.prototype, "siteScripts", {
    configurable: true,
    enumerable: true,
    get: function (this: SPFI) {
        return this.create(SiteScripts);
    },
});
