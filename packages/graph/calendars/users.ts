import { addProp } from "@pnp/queryable";
import { MeetingTimeSuggestionsResult } from "@microsoft/microsoft-graph-types";
import { _User } from "../users/types.js";
import { Calendar, ICalendar, IEvents, Events, Calendars, ICalendars, ICalendarView} from "./types.js";
import { reminderView, IReminderInfo, findMeetingTimes, IFindMeetingTimesRequest, calendarView} from "./funcs.js";
import { IGraphCollection, IGraphInstance } from "../graphqueryable.js";

declare module "../users/types" {
    interface _User {
        readonly calendar: ICalendar;
        readonly calendars: ICalendars;
        readonly attachmentFiles: ICalendar;
        readonly events: IEvents;
        calendarView(start: string, end: string): ICalendarView;
        findMeetingTimes(properties?: IFindMeetingTimesRequest): Promise<IGraphInstance<MeetingTimeSuggestionsResult>>;
        reminderView(start: string, end: string): IGraphCollection<IReminderInfo[]>;
    }
    interface IUser {
        readonly calendar: ICalendar;
        readonly calendars: ICalendars;
        readonly attachmentFiles: ICalendar;
        readonly events: IEvents;
        calendarView(start: string, end: string): ICalendarView;
        reminderView(start: string, end: string): IGraphCollection<IReminderInfo[]>;
    }
}

addProp(_User, "calendar", Calendar);
addProp(_User, "calendars", Calendars);
addProp(_User, "events", Events);
_User.prototype.calendarView = calendarView;
_User.prototype.findMeetingTimes = findMeetingTimes;
_User.prototype.reminderView = reminderView;
