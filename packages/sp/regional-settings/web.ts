import { addProp } from "@pnp/queryable";
import { _Web } from "../webs/types.js";
import { RegionalSettings, IRegionalSettings, IUserResources } from "./types.js";
import { getValueForUICultureBinder } from "./funcs.js";

declare module "../webs/types" {
    interface _Web extends IUserResources {
        regionalSettings: IRegionalSettings;
    }
    interface IWeb extends IUserResources {
        /**
         * Regional settings for this web
         */
        regionalSettings: IRegionalSettings;
    }
}

addProp(_Web, "regionalSettings", RegionalSettings);

_Web.prototype.titleResource = getValueForUICultureBinder("titleResource");
_Web.prototype.descriptionResource = getValueForUICultureBinder("descriptionResource");
