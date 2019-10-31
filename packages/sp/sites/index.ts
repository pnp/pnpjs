import { SPRest } from "../rest";
import { ISite, Site } from "./types";

export {
    IOpenWebByIdResult,
    ISite,
    Site,
    IContextInfo,
    IDocumentLibraryInformation,
} from "./types";

declare module "../rest" {
    interface SPRest {
        readonly site: ISite;
    }
}

Reflect.defineProperty(SPRest.prototype, "site", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest) {
        return Site(this._baseUrl).configure(this._options);
    },
});
