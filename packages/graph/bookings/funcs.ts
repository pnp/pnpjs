
import { IGraphQueryable, GraphQueryableCollection, IGraphQueryableCollection } from "../graphqueryable.js";
import { BookingAppointment as IBookingAppointmentEntity } from "@microsoft/microsoft-graph-types";

/**
 * Get the collection of bookingAppointment objects for a bookingBusiness, that occurs in the specified date range.
 *
 * @param this IGraphQueryable instance
 * @param start start time
 * @param end end time
 */
export function calendarView(this: IGraphQueryable, start: string, end: string): IGraphQueryableCollection<IBookingAppointmentEntity[]> {

    const query = GraphQueryableCollection(this, "calendarView");
    query.query.set("startDateTime", start);
    query.query.set("endDateTime", end);
    return query;
}
