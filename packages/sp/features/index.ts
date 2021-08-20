import "./site.js";
import "./web.js";

import { Features } from "./types.js";

export {
    Feature,
    IFeature,
    Features,
    // ReturnType<Features> as IFeatures,
    IFeatureAddResult,
    IFeatureInfo,
} from "./types.js";

export type IFeatures = ReturnType<typeof Features>;
