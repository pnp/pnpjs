import { IGraphQueryable, GraphQueryableCollection, IGraphQueryableCollection } from "../graphqueryable.js";
import { EmailAddress, Event as IEvent } from "@microsoft/microsoft-graph-types";
import { Endpoint } from "../behaviors/endpoint.js";

interface IEventWithTag extends IEvent {
    "@odata.etag": string;
}

/**
 * Get the occurrences, exceptions, and single instances of events in a calendar view defined by a time range,
 * from the user's default calendar, or from some other calendar of the user's
 *
 * @param this IGraphQueryable instance
 * @param start start time
 * @param end end time
 */
export function calendarView(this: IGraphQueryable, start: string, end: string): IGraphQueryableCollection<ICalendarViewInfo[]> {

    const query = GraphQueryableCollection(this, "calendarView");
    query.query.set("startDateTime", start);
    query.query.set("endDateTime", end);
    return query;
}

export type ICalendarViewInfo = IEventWithTag;

/**
 * Get the emailAddress objects that represent all the meeting rooms in the user's tenant or in a specific room list.
 *  - This is a beta graph feature and uses the beta endpoint.
 *
 * @param this IGraphQueryable instance
 * @param roomList The SMTP address associated with the room list.
 */
export function findRooms(this: IGraphQueryable, roomList?: string): IGraphQueryableCollection<EmailAddress[]> {
    const query = GraphQueryableCollection(this, roomList ? "findRooms(RoomList=@roomList)" : "findRooms");
    query.using(Endpoint("beta"));
    if (roomList) {
        query.query.set("@roomList", `'${roomList}'`);
    }
    return query;
}

/**
 * Get the instances (occurrences) of an event for a specified time range.
 * If the event is a seriesMaster type, this returns the occurrences and exceptions of the event in the specified time range.
 *
 * @param this IGraphQueryable instance
 * @param start start time
 * @param end end time
 */
export function instances(this: IGraphQueryable, start: string, end: string): IGraphQueryableCollection<IInstance[]> {
    const query = GraphQueryableCollection(this, "instances");
    query.query.set("startDateTime", start);
    query.query.set("endDateTime", end);
    return query;
}

export type IInstance = IEventWithTag;
