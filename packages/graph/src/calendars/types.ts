import { IInvokable, body } from "@pnp/odata";
import { Event as IEventType, Calendar as ICalendarType } from "@microsoft/microsoft-graph-types";
import { _GraphQueryableCollection, _GraphQueryableInstance, IGraphQueryableCollection, IGraphQueryableInstance, graphInvokableFactory } from "../graphqueryable";
import { defaultPath, IDeleteable, deleteable, IUpdateable, updateable, getById, IGetById } from "../decorators";
import { graphPost } from "../operations";

/**
 * Calendars
 */
@defaultPath("calendars")
export class _Calendars extends _GraphQueryableCollection<ICalendarType[]> implements ICalendars { }
export interface ICalendars<GetType = any> extends IInvokable, IGraphQueryableCollection<GetType> { }
export interface _Calendars extends IInvokable { }
export const Calendars = graphInvokableFactory<ICalendars>(_Calendars);

/**
 * Calendar
 */
export class _Calendar extends _GraphQueryableInstance<ICalendarType> implements ICalendar {

    public get events(): IEvents {
        return Events(this);
    }
}
export interface ICalendar extends IInvokable, IGraphQueryableInstance<ICalendarType> {
    readonly events: IEvents;
}
export interface _Calendar extends IInvokable { }
export const Calendar = graphInvokableFactory<ICalendar>(_Calendar);

/**
 * Event
 */
@deleteable()
@updateable()
export class _Event extends _GraphQueryableInstance<IEventType> implements IEvent { }
export interface IEvent extends IInvokable, IDeleteable, IUpdateable, IGraphQueryableInstance<IEventType> { }
export interface _Event extends IInvokable, IDeleteable, IUpdateable { }
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
    public async add(properties: IEventType): Promise<EventAddResult> {

        const data = await graphPost(this, body(properties));

        return {
            data,
            event: this.getById(data.id),
        };
    }
}
export interface IEvents extends IInvokable, IGetById<IEvent>, IGraphQueryableCollection<IEventType[]> {
    getById(id: string): IEvent;
    add(properties: IEventType): Promise<EventAddResult>;
}
export interface _Events extends IInvokable, IGetById<IEvent> { }
export const Events = graphInvokableFactory<IEvents>(_Events);

/**
 * EventAddResult
 */
export interface EventAddResult {
    data: IEventType;
    event: IEvent;
}
