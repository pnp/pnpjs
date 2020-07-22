import { body } from "@pnp/odata";
import { Event as IEventType, Calendar as ICalendarType } from "@microsoft/microsoft-graph-types";
import { _GraphQueryableCollection, _GraphQueryableInstance, graphInvokableFactory } from "../graphqueryable";
import { defaultPath, IDeleteable, deleteable, IUpdateable, updateable, getById, IGetById } from "../decorators";
import { graphPost } from "../operations";
import { calendarView } from "./funcs";

/**
 * Calendar
 */
export class _Calendar extends _GraphQueryableInstance<ICalendarType> {

    public get events(): IEvents {
        return Events(this);
    }

    public calendarView = calendarView;
}
export interface ICalendar extends _Calendar { }
export const Calendar = graphInvokableFactory<ICalendar>(_Calendar);

/**
 * Calendars
 */
@defaultPath("calendars")
@getById(Calendar)
export class _Calendars extends _GraphQueryableCollection<ICalendarType[]> { }
export interface ICalendars<GetType = any> extends _Calendars, IGetById<ICalendar> { }
export const Calendars = graphInvokableFactory<ICalendars>(_Calendars);

/**
 * Event
 */
@deleteable()
@updateable()
export class _Event extends _GraphQueryableInstance<IEventType> { }
export interface IEvent extends _Event, IDeleteable, IUpdateable { }
export const Event = graphInvokableFactory<IEvent>(_Event);

/**
 * Events
 */
@defaultPath("events")
@getById(Event)
export class _Events extends _GraphQueryableCollection<IEventType[]> {

    /**
     * Adds a new event to the collection
     * 
     * @param properties The set of properties used to create the event
     */
    public async add(properties: IEventType): Promise<IEventAddResult> {

        const data = await graphPost(this, body(properties));

        return {
            data,
            event: (<any>this).getById(data.id),
        };
    }
}
export interface IEvents extends _Events, IGetById<IEvent> { }
export const Events = graphInvokableFactory<IEvents>(_Events);

/**
 * EventAddResult
 */
export interface IEventAddResult {
    data: IEventType;
    event: IEvent;
}
