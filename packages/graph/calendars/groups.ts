import { addProp } from "@pnp/odata";
import { _Group } from "../groups/types";
import { Calendar, ICalendar, IEvents, Events } from "./types";

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

addProp(_Group, "calendar", Calendar, "calendar");
addProp(_Group, "events", Events);
