import { addProp } from "@pnp/odata";
import { _Web } from "../webs/types";
import { Features, IFeatures } from "./types";

/**
 * Extend Web
 */
declare module "../webs/types" {
    interface _Web {
        readonly features: IFeatures;
    }
    interface IWeb {

        /**
         * This web's collection of features
         */
        readonly features: IFeatures;
    }
}

addProp(_Web, "features", Features);
