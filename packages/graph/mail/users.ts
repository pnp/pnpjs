// import { addProp } from "@pnp/queryable";
import { _User } from "../users/types.js";
// import { Calendar, ICalendar, IEvents, Events, Calendars, ICalendars } from "./types.js";
import { mailSend } from "./funcs.js";
// import { IGraphQueryableCollection } from "../graphqueryable.js";

declare module "../users/types" {
    interface _User {
        mailSend(message: any): void;
    }
    interface IUser {
        mailSend(message: any): void;
    }
}

// addProp(_User, "calendar", Calendar);
// addProp(_User, "calendars", Calendars);
// addProp(_User, "events", Events);

_User.prototype.mailSend = mailSend;
