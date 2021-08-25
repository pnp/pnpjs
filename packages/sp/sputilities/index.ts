import { SPRest2 } from "../rest-2.js";
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

Reflect.defineProperty(SPRest2.prototype, "utility", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest2) {
        this.create(Utilities, "");
    },
});
