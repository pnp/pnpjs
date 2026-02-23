import { _Site } from "../sites/types.js";
import { IAnalyticsOptions, analytics } from "./types.js";
import { ItemAnalytics as IItemAnalytics } from "@microsoft/microsoft-graph-types";


declare module "../sites/types" {
    interface _Site {
        analytics(analyticsOptions?: IAnalyticsOptions): Promise<IItemAnalytics>;
    }

    interface ISite {
        analytics(analyticsOptions?: IAnalyticsOptions): Promise<IItemAnalytics>;
    }
}

_Site.prototype.analytics = analytics;
