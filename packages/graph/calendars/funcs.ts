import { IGraphQueryable, GraphQueryableCollection, IGraphQueryableCollection } from "../graphqueryable";
import { Event as IEvent } from "@microsoft/microsoft-graph-types";

/**
 * Get the occurrences, exceptions, and single instances of events in a calendar view defined by a time range,
 * from the user's default calendar, or from some other calendar of the user's
 * 
 * @param this IGraphQueryable instance
 * @param start start time
 * @param end end time
 */
export function calendarView(this: IGraphQueryable, start: string, end: string): IGraphQueryableCollection<ICalendarViewInfo[]> {

    const query = this.clone(GraphQueryableCollection, "calendarView");
    query.query.set("startDateTime", encodeURIComponent(start));
    query.query.set("endDateTime", encodeURIComponent(end));
    return query;
}

/**
 * Temporary until graph types include this type
 */
export interface ICalendarViewInfo extends IEvent {
    "@odata.etag": string;
}
