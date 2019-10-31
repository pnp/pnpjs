import { addProp } from "@pnp/odata";
import { _Web } from "../webs/types";
import { Features, IFeatures } from "./types";

declare module "../webs/types" {
    interface _Web {
        readonly features: IFeatures;
    }
    interface IWeb {
        /**
         * Access the features activated in this web
         */
        readonly features: IFeatures;
    }
}

addProp(_Web, "features", Features);
