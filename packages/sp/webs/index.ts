import { Web } from "./types.js";
import { SPFI } from "../fi.js";

export {
    IWeb,
    IWebs,
    Web,
    Webs,
    IWebInfo,
    IStorageEntity,
    IWebInfosData,
} from "./types.js";

declare module "../fi" {
    interface SPFI {

        /**
         * Access to the current web instance
         */
        readonly web: ReturnType<typeof Web>;
    }
}

Reflect.defineProperty(SPFI.prototype, "web", {
    configurable: true,
    enumerable: true,
    get: function (this: SPFI) {
        return this.create(Web);
    },
});
