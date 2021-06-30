import { Web } from "./types.js";
import { SPRest2 } from "../rest-2.js";
import { SPBatch } from "../batch.js";

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

declare module "../rest-2" {
    interface SPRest2 {

        /**
         * Access to the current web instance
         */
        readonly web: ReturnType<typeof Web>;

        /**
         * Creates a new batch object for use with the SharePointQueryable.addToBatch method
         *
         */
        createBatch(): SPBatch;
    }
}

Reflect.defineProperty(SPRest2.prototype, "web", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest2) {
        return this.create(Web);
    },
});

SPRest2.prototype.createBatch = function (this: SPRest2): SPBatch {
    return null;
    // return this.web.createBatch();
};

