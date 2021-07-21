import { SPRest2 } from "../rest-2";
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

Reflect.defineProperty(SPRest2.prototype, "site", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest2) {
        return this.create(Site);
    },
});
