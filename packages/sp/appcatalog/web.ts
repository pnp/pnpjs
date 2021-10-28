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

addProp(_Web, "appcatalog", AppCatalog);
