import { _Web } from "../webs/types.js";
import { AppCatalog, AppCatalogScope, IAppCatalog } from "./types.js";

declare module "../webs/types" {
    interface _Web {
        getAppCatalog(url?: string | _Web): IAppCatalog;
    }
    interface IWeb {
        /**
         * Gets this web (default) or the web specifed by the optional string case
         * as an IAppCatalog instance
         *
         * @param url [Optional] Url of the web to get (default: current web)
         * @param scope [Optional] The scope of the app catalog (default: tenant)
         */
        getAppCatalog(url?: string | _Web, scope?: AppCatalogScope): IAppCatalog;
    }
}

_Web.prototype.getAppCatalog = function (this: _Web, url?: string | _Web, scope: AppCatalogScope = "tenant"): IAppCatalog {
    return AppCatalog(url || this, `_api/web/${scope}appcatalog/AvailableApps`).configureFrom(this);
};
