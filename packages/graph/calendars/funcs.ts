import { body } from "@pnp/queryable/index.js";
import { IGraphQueryable, GraphCollection, IGraphCollection, IGraphInstance, graphPost } from "../graphqueryable.js";
import {
    EmailAddress,
    Event as IEvent,
    Reminder as IReminder,
    MeetingTimeSuggestionsResult,
    LocationConstraint, TimeConstraint,
    AttendeeBase,
} from "@microsoft/microsoft-graph-types";
import { CalendarView, ICalendarView } from "./types.js";

interface IEventWithTag extends IEvent {
    "@odata.etag": string;
}

export interface IFindMeetingTimesRequest{
    attendees?: AttendeeBase[];
    locationConstraint?: LocationConstraint;
    timeConstraint?: TimeConstraint;
    meetingDuration?: string;
    maxCandidates?: number;
    isOrganizerOptional?: boolean;
    returnSuggestionReasons?: boolean;
    minimumAttendeePercentage?: number;
}

/**
 * Get the occurrences, exceptions, and single instances of events in a calendar view defined by a time range,
 * from the user's default calendar, or from some other calendar of the user's
 *
 * @param this IGraphQueryable instance
 * @param start start time
 * @param end end time
 */
export function calendarView(this: IGraphQueryable, start: string, end: string): ICalendarView {
    return CalendarView(this, start, end);
}

export type ICalendarViewInfo = IEventWithTag;

/**
 * Suggest meeting times and locations based on organizer and attendee availability, and time or location constraints specified as parameters.

 * @param this IGraphQueryable instance
 * @param properties The body of the meetingTimeSuggestionsRequest resource that contains the parameters for the operation.
 */
export async function findMeetingTimes(this: IGraphQueryable, properties?: IFindMeetingTimesRequest): Promise<IGraphInstance<MeetingTimeSuggestionsResult>> {
    return graphPost(GraphCollection(this,"findMeetingTimes"), body(properties));
}

/**
 * Get the emailAddress objects that represent all the meeting rooms in the user's tenant or in a specific room list.
 *
 * @param this IGraphQueryable instance
 * @param roomList The SMTP address associated with the room list.
 */
export function findRooms(this: IGraphQueryable, roomList?: string): IGraphCollection<EmailAddress[]> {
    const query = GraphCollection(this, roomList ? "findRooms(RoomList=@roomList)" : "findRooms");
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
export function instances(this: IGraphQueryable, start: string, end: string): IGraphCollection<IInstance[]> {
    const query = GraphCollection(this, "instances");
    query.query.set("startDateTime", start);
    query.query.set("endDateTime", end);
    return query;
}

export type IInstance = IEventWithTag;

/**
 * Get the list of event remindres defined by a time range,
 *
 * @param this IGraphQueryable instance
 * @param start start time
 * @param end end time
 */
export function reminderView(this: IGraphQueryable, start: string, end: string): IGraphCollection<IReminderInfo[]> {

    const query = GraphCollection(this, `reminderView(startDateTime='${start}',endDateTime='${end}')`);
    return query;
}

export type IReminderInfo = IReminder;
