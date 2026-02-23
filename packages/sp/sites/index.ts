import { SPFI } from "../fi.js";
import { ISite, Site } from "./types.js";

export {
    IOpenWebByIdResult,
    ISite,
    Site,
    IDocumentLibraryInformation,
    SiteLogoAspect,
    SiteLogoType,
    ISiteLogoProperties,
} from "./types.js";

declare module "../fi" {
    interface SPFI {
        readonly site: ISite;
    }
}

Reflect.defineProperty(SPFI.prototype, "site", {
    configurable: true,
    enumerable: true,
    get: function (this: SPFI) {
        return this.create(Site);
    },
});
