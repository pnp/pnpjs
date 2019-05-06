import { addProp } from "@pnp/odata";
import { _Site } from "../sites/types";
import { Features, IFeatures } from "./types";

/**
 * Extend Site
 */
declare module "../sites/types" {
    interface _Site {
        readonly features: IFeatures;
    }
    interface ISite {
        readonly features: IFeatures;
    }
}

addProp(_Site, "features", Features);
