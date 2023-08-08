import { _DriveItem } from "../drive/types.js";
import { IAnalyticsOptions, analytics } from "./types.js";
import { ItemAnalytics as IItemAnalytics } from "@microsoft/microsoft-graph-types";

declare module "../drive/types" {
    interface _DriveItem {
        analytics(analyticsOptions?: IAnalyticsOptions): Promise<IItemAnalytics>;
    }

    interface DriveItem {
        analytics(analyticsOptions?: IAnalyticsOptions): Promise<IItemAnalytics>;
    }
}

_DriveItem.prototype.analytics = analytics;
