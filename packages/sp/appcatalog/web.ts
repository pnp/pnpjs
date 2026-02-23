import { addProp } from "@pnp/queryable";
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

// we use this function to wrap the AppCatalog as we want to ignore any path values addProp
// will pass and use the defaultPath defined for AppCatalog
addProp(_Web, "appcatalog", (s: _Web) => AppCatalog(s, "_api/web/sitecollectionappcatalog/AvailableApps"));
