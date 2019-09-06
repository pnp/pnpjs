import { addProp } from "@pnp/odata";
import { _Site } from "../sites/types";
import { Features, IFeatures } from "./types";

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
