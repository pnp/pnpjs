import { SPRest } from "../rest";
import { IUtilities, Utilities } from "./types";

export {
    ICreateWikiPageResult,
    IEmailProperties,
    IUtilities,
    IWikiPageCreationInfo,
    Utilities,
} from "./types";

declare module "../rest" {
    interface SPRest {
        readonly utility: IUtilities;
    }
}

Reflect.defineProperty(SPRest.prototype, "utility", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest) {
        return Utilities(this._baseUrl, "");
    },
});
