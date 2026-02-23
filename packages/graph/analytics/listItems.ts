import { _ListItem } from "../list-item/types.js";
import { IAnalyticsOptions, analytics } from "./types.js";
import { ItemAnalytics as IItemAnalytics } from "@microsoft/microsoft-graph-types";

declare module "../list-item/types" {
    interface _ListItem {
        analytics(analyticsOptions?: IAnalyticsOptions): Promise<IItemAnalytics>;
    }

    interface ListItem {
        analytics(analyticsOptions?: IAnalyticsOptions): Promise<IItemAnalytics>;
    }
}

_ListItem.prototype.analytics = analytics;
