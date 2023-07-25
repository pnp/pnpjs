import { addProp } from "@pnp/queryable";
import { _User } from "../users/types.js";
import { Calendar, ICalendar, IEvents, Events, Calendars, ICalendars } from "./types.js";
import { calendarView, ICalendarViewInfo } from "./funcs.js";
import { IGraphCollection } from "../graphqueryable.js";

declare module "../users/types" {
    interface _User {
        readonly calendar: ICalendar;
        readonly calendars: ICalendars;
        readonly attachmentFiles: ICalendar;
        readonly events: IEvents;
        calendarView(start: string, end: string): IGraphCollection<ICalendarViewInfo[]>;
    }
    interface IUser {
        readonly calendar: ICalendar;
        readonly calendars: ICalendars;
        readonly attachmentFiles: ICalendar;
        readonly events: IEvents;
        calendarView(start: string, end: string): IGraphCollection<ICalendarViewInfo[]>;
    }
}

addProp(_User, "calendar", Calendar);
addProp(_User, "calendars", Calendars);
addProp(_User, "events", Events);

_User.prototype.calendarView = calendarView;
