import { addProp } from "@pnp/odata";
import { _User } from "../users/types";
import { Calendar, ICalendar, IEvents, Events, Calendars, ICalendars } from "./types";

declare module "../users/types" {
    interface _User {
        readonly calendar: ICalendar;
        readonly calendars: ICalendars;
        readonly attachmentFiles: ICalendar;
        readonly events: IEvents;
    }
    interface IUser {
        readonly calendar: ICalendar;
        readonly calendars: ICalendars;
        readonly attachmentFiles: ICalendar;
        readonly events: IEvents;
    }
}

addProp(_User, "calendar", Calendar, "calendar");
addProp(_User, "calendars", Calendars, "calendars");
addProp(_User, "events", Events);
