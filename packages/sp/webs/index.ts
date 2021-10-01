import { Web } from "./types.js";
import { SPRest } from "../rest.js";

export {
    IWeb,
    IWebs,
    Web,
    IWebAddResult,
    IWebUpdateResult,
    Webs,
    IWebInfo,
    IStorageEntity,
    IWebInfosData,
} from "./types.js";

declare module "../rest" {
    interface SPRest {

        /**
         * Access to the current web instance
         */
        readonly web: ReturnType<typeof Web>;
    }
}

Reflect.defineProperty(SPRest.prototype, "web", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest) {
        return this.create(Web);
    },
});
