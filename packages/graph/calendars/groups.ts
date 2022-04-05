import { addProp } from "@pnp/queryable";
import { _Group } from "../groups/types.js";
import { Calendar, ICalendar, IEvents, Events } from "./types.js";

declare module "../groups/types" {
    interface _Group {
        readonly calendar: ICalendar;
        readonly attachmentFiles: ICalendar;
        readonly events: IEvents;
    }
    interface IGroup {
        readonly calendar: ICalendar;
        readonly attachmentFiles: ICalendar;
        readonly events: IEvents;
    }
}

addProp(_Group, "calendar", Calendar);
addProp(_Group, "events", Events);
