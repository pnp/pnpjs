import { addProp } from "@pnp/odata";
import { _Web } from "../webs/types";
import { RegionalSettings, IRegionalSettings } from "./types";

declare module "../webs/types" {
    interface _Web {
        regionalSettings: IRegionalSettings;
    }
    interface IWeb {
        /**
         * Regional settings for this web
         */
        regionalSettings: IRegionalSettings;
    }
}

addProp(_Web, "regionalSettings", RegionalSettings);
