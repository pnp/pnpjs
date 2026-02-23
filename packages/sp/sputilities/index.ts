import { SPFI } from "../fi.js";
import { IUtilities, Utilities } from "./types.js";

export {
    IEmailProperties,
    IUtilities,
    IWikiPageCreationInfo,
    Utilities,
} from "./types.js";

declare module "../fi" {
    interface SPFI {
        readonly utility: IUtilities;
    }
}

Reflect.defineProperty(SPFI.prototype, "utility", {
    configurable: true,
    enumerable: true,
    get: function (this: SPFI) {
        return this.create(<any>Utilities, "");
    },
});
