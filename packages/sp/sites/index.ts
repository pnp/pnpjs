import { SPRest } from "../rest";
import { ISite, Site } from "./types.js";

export {
    IOpenWebByIdResult,
    ISite,
    Site,
    IContextInfo,
    IDocumentLibraryInformation,
} from "./types.js";

declare module "../rest" {
    interface SPRest2 {
        readonly site: ISite;
    }
}

Reflect.defineProperty(SPRest.prototype, "site", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest) {
        return this.create(Site);
    },
});
