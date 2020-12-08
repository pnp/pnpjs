import { SPRest } from "../rest.js";
import { ISite, Site } from "./types.js";

export {
    IOpenWebByIdResult,
    ISite,
    Site,
    IContextInfo,
    IDocumentLibraryInformation,
} from "./types.js";

declare module "../rest" {
    interface SPRest {
        readonly site: ISite;
    }
}

Reflect.defineProperty(SPRest.prototype, "site", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest) {
        return this.childConfigHook(({ options, baseUrl, runtime }) => {
            return Site(baseUrl).configure(options).setRuntime(runtime);
        });
    },
});
