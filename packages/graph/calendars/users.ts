import { addProp } from "@pnp/odata";
import { _User } from "../users/types.js";
import { Calendar, ICalendar, IEvents, Events, Calendars, ICalendars } from "./types.js";
import { calendarView, findRooms, ICalendarViewInfo } from "./funcs.js";
import { IGraphQueryableCollection } from "../graphqueryable.js";
import { EmailAddress } from "@microsoft/microsoft-graph-types";

declare module "../users/types" {
    interface _User {
        readonly calendar: ICalendar;
        readonly calendars: ICalendars;
        readonly attachmentFiles: ICalendar;
        readonly events: IEvents;
        calendarView(start: string, end: string): IGraphQueryableCollection<ICalendarViewInfo[]>;
        findRooms(roomList?: string): IGraphQueryableCollection<EmailAddress[]>;
    }
    interface IUser {
        readonly calendar: ICalendar;
        readonly calendars: ICalendars;
        readonly attachmentFiles: ICalendar;
        readonly events: IEvents;
        calendarView(start: string, end: string): IGraphQueryableCollection<ICalendarViewInfo[]>;
        findRooms(roomList?: string): IGraphQueryableCollection<EmailAddress[]>;
    }
}

addProp(_User, "calendar", Calendar, "calendar");
addProp(_User, "calendars", Calendars, "calendars");
addProp(_User, "events", Events);

_User.prototype.calendarView = calendarView;
_User.prototype.findRooms = findRooms;
