import { ItemAnalytics as IItemAnalytics } from "@microsoft/microsoft-graph-types";
import { GraphQueryable, graphGet } from "../graphqueryable.js";

export interface IAnalyticsOptions {
    timeRange: "allTime" | "lastSevenDays";
}

export function analytics(analyticsOptions?: IAnalyticsOptions): Promise<IItemAnalytics> {
    const query = `analytics/${analyticsOptions ? analyticsOptions.timeRange : "lastSevenDays"}`;
    return graphGet(GraphQueryable(this, query));
}
