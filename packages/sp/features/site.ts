import { addProp } from "@pnp/queryable";
import { _Site } from "../sites/types.js";
import { Features, IFeatures } from "./types.js";

declare module "../sites/types" {
    interface _Site {
        readonly features: IFeatures;
    }
    interface ISite {
        /**
         * Access the features activated in this site
         */
        readonly features: IFeatures;
    }
}

addProp(_Site, "features", Features);
