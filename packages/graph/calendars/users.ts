import { addProp } from "@pnp/odata";
import { _User } from "../users/types";
import { Calendar, ICalendar, IEvents, Events, Calendars, ICalendars } from "./types";
import { calendarView, ICalendarViewInfo } from "./funcs";
import { IGraphQueryableCollection } from "../graphqueryable";

declare module "../users/types" {
    interface _User {
        readonly calendar: ICalendar;
        readonly calendars: ICalendars;
        readonly attachmentFiles: ICalendar;
        readonly events: IEvents;
        calendarView(start: string, end: string): IGraphQueryableCollection<ICalendarViewInfo[]>;
    }
    interface IUser {
        readonly calendar: ICalendar;
        readonly calendars: ICalendars;
        readonly attachmentFiles: ICalendar;
        readonly events: IEvents;
        calendarView(start: string, end: string): IGraphQueryableCollection<ICalendarViewInfo[]>;
    }
}

addProp(_User, "calendar", Calendar, "calendar");
addProp(_User, "calendars", Calendars, "calendars");
addProp(_User, "events", Events);

_User.prototype.calendarView = calendarView;
