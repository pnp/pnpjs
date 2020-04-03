import { addProp } from "@pnp/odata";
import { _Web } from "../webs/types";
import { RegionalSettings, IRegionalSettings, IUserResources } from "./types";
import { getValueForUICultureBinder } from "./funcs";

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
