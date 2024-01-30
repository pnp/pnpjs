import { addProp } from "@pnp/queryable";
import { _Group } from "../groups/types.js";
import { Calendar, ICalendar, IEvents, Events, ICalendarView } from "./types.js";
import { calendarView } from "./funcs.js";

declare module "../groups/types" {
    interface _Group {
        readonly calendar: ICalendar;
        readonly attachmentFiles: ICalendar;
        readonly events: IEvents;
        calendarView(start: string, end: string): ICalendarView;
    }
    interface IGroup {
        readonly calendar: ICalendar;
        readonly attachmentFiles: ICalendar;
        readonly events: IEvents;
        calendarView(start: string, end: string): ICalendarView;
    }
}

addProp(_Group, "calendar", Calendar);
addProp(_Group, "events", Events);
_Group.prototype.calendarView = calendarView;