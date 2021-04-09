import { addProp } from "@pnp/queryable";
import { _Web } from "../webs/types.js";
import { Features, IFeatures } from "./types.js";

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
