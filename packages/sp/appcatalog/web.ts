import { SPInit } from "../spqueryable.js";
import { _Web } from "../webs/types.js";
import { AppCatalog, IAppCatalog } from "./types.js";

declare module "../webs/types" {
    interface _Web {
        appcatalog: IAppCatalog;
    }
    interface IWeb {
        /**
         * Gets the appcatalog (if it exists associated with this web)
         */
        appcatalog: IAppCatalog;
    }
}

Reflect.defineProperty(_Web.prototype, "appcatalog", {
    configurable: true,
    enumerable: true,
    get: function (this: SPInit) {
        return AppCatalog(this);
    },
});
