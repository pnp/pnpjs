import { SPRest } from "../rest.js";
import { IUtilities, Utilities } from "./types.js";

export {
    IEmailProperties,
    IUtilities,
    IWikiPageCreationInfo,
    Utilities,
} from "./types.js";

declare module "../rest" {
    interface SPRest {
        readonly utility: IUtilities;
    }
}

Reflect.defineProperty(SPRest.prototype, "utility", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest) {
        this.create(Utilities, "");
    },
});
