import { Web, IWeb } from "./types";
import { SPRest } from "../rest";
import { SPBatch } from "../batch";

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
} from "./types";

declare module "../rest" {
    interface SPRest {

        /**
         * Access to the current web instance
         */
        readonly web: IWeb;

        /**
         * Creates a new batch object for use with the SharePointQueryable.addToBatch method
         *
         */
        createBatch(): SPBatch;
    }
}

Reflect.defineProperty(SPRest.prototype, "web", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest) {
        return Web(this._baseUrl).configure(this._options);
    },
});

SPRest.prototype.createBatch = function (this: SPRest): SPBatch {
    return this.web.createBatch();
};
