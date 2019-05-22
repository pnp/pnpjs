import { IInvokable, body } from "@pnp/odata";
import { Event as IEventType, Calendar as ICalendarType } from "@microsoft/microsoft-graph-types";
import { _GraphQueryableCollection, _GraphQueryableInstance, IGraphQueryableCollection, IGraphQueryableInstance, graphInvokableFactory } from "../graphqueryable";
import { defaultPath, IDeleteable, deleteable, IUpdateable, updateable, getById, IGetById } from "../decorators";
import { graphPost } from "../operations";

/**
 * Calendars
 */
@defaultPath("calendars")
export class _Calendars extends _GraphQueryableCollection<ICalendarType[]> implements _ICalendars { }
export interface _ICalendars { }
export interface ICalendars<GetType = any> extends IInvokable, IGraphQueryableCollection<GetType> { }
export const Calendars = graphInvokableFactory<ICalendars>(_Calendars);

/**
 * Calendar
 */
export class _Calendar extends _GraphQueryableInstance<ICalendarType> implements _ICalendar {

    public get events(): IEvents {
        return Events(this);
    }
}
export interface _ICalendar {
    readonly events: IEvents;
}

export interface ICalendar extends _ICalendar, IInvokable, IGraphQueryableInstance<ICalendarType> { }

export const Calendar = graphInvokableFactory<ICalendar>(_Calendar);

/**
 * Event
 */
@deleteable()
@updateable()
export class _Event extends _GraphQueryableInstance<IEventType> implements _IEvent { }
export interface _IEvent { }
export interface IEvent extends _IEvent, IInvokable, IDeleteable, IUpdateable, IGraphQueryableInstance<IEventType> { }
export const Event = graphInvokableFactory<IEvent>(_Event);

/**
 * Events
 */
@defaultPath("events")
@getById(Event)
export class _Events extends _GraphQueryableCollection<IEventType[]> implements _IEvents {

    /**
     * Adds a new event to the collection
     * 
     * @param properties The set of properties used to create the event
     */
    public async add(properties: IEventType): Promise<EventAddResult> {

        const data = await graphPost(this, body(properties));

        return {
            data,
            event: (<any>this).getById(data.id),
        };
    }
}
export interface _IEvents {
    add(properties: IEventType): Promise<EventAddResult>;
}

export interface IEvents extends _IEvents, IInvokable, IGetById<IEvent>, IGraphQueryableCollection<IEventType[]> { }

export const Events = graphInvokableFactory<IEvents>(_Events);

/**
 * EventAddResult
 */
export interface EventAddResult {
    data: IEventType;
    event: IEvent;
}
