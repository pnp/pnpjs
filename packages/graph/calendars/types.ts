import { body } from "@pnp/queryable";
import { Event as IEventType, Calendar as ICalendarType, ScheduleInformation as IScheduleInformationType, DateTimeTimeZone as IDateTimeTimeZoneType, Recipient, TimeSlot, } from "@microsoft/microsoft-graph-types";
import {  GraphQueryable, IGraphQueryable, _GraphCollection, _GraphInstance, _GraphQueryable, graphInvokableFactory, graphPost } from "../graphqueryable.js";
import { defaultPath, IDeleteable, deleteable, IUpdateable, updateable, getById, IGetById, IAddable, addable, hasDelta, IHasDelta } from "../decorators.js";
import { calendarView, instances } from "./funcs.js";

/**
 * Calendar
 */
@deleteable()
@updateable()
export class _Calendar extends _GraphInstance<ICalendarType> {

    public get events(): IEvents {
        return Events(this);
    }

    /**
     * Get the free/busy availability information for a collection of users,
     * distributions lists, or resources (rooms or equipment) for a specified time period.
     *
     * @param properties The set of properties used to get the schedule
     */
    public async getSchedule(properties: IScheduleInformationType): Promise<IScheduleInformationType[]> {
        return graphPost(Calendar(this, "getSchedule"), body(properties));
    }

    public calendarView = calendarView;

}
export interface ICalendar extends _Calendar, IUpdateable<ICalendarType>, IDeleteable { }
export const Calendar = graphInvokableFactory<ICalendar>(_Calendar);

/**
 * Calendars
 */
@defaultPath("calendars")
@getById(Calendar)
@addable()
export class _Calendars extends _GraphCollection<ICalendarType[]> { 
    constructor(baseUrl: string | _GraphQueryable, start: string, end: string) {
        debugger;
        super(baseUrl);
        this.query.set("startDateTime", start);
        this.query.set("endDateTime", end);
    }
    
}
export interface ICalendars extends _Calendars, IGetById<ICalendar>, IAddable<ICalendarType> { }
export const Calendars = graphInvokableFactory<ICalendars>(_Calendars);

/**
 * CalendarView
 */
export class _CalendarView extends _GraphCollection<IEventType[]> {
    constructor(baseUrl: string | _GraphQueryable, start: string, end: string) {
        super(baseUrl, "calendarView");
        this.query.set("startDateTime", start);
        this.query.set("endDateTime", end);
    }
    
    public async delta(token?: string): Promise<IEventType[]> {
        return graphPost(GraphQueryable(this, `delta?${this.query}`), body({ token }));
    }
}
export interface ICalendarView extends _CalendarView { }
export const CalendarView = (baseUrl: string | IGraphQueryable, start: string, end: string): _CalendarView =>  new _CalendarView(baseUrl, start, end);
//export const CalendarView = graphInvokableFactory<ICalendarView>(_CalendarView);

/**
 * Event
 */
@deleteable()
@updateable()
export class _Event extends _GraphInstance<IEventType> {

    public async accept(comment?: string, sendResponse?: boolean): Promise<void> {
        return graphPost(Event(this, "accept"), body({ comment, sendResponse }));
    }

    public async cancel(comment?: string): Promise<void> {
        return graphPost(Event(this, "cancel"));
    }

    public async decline(comment?: string, sendResponse?: boolean, proposedNewTime?: TimeSlot): Promise<void> {
        if (proposedNewTime) {
            sendResponse = true;
        }
        return graphPost(Event(this, "decline"), body({ comment, sendResponse, proposedNewTime }));
    }

    public async dismissReminder(): Promise<void> {
        return graphPost(Event(this, "dismissReminder"));
    }

    public async forward(toRecipients: Recipient[], comment?: string): Promise<void> {
        return graphPost(Event(this, "forward"), body({ comment, toRecipients }));
    }

    public async snoozeReminder(newReminderTime: IDateTimeTimeZoneType): Promise<void> {
        return graphPost(Event(this, "snoozeReminder"), body({ newReminderTime }));
    }

    public async tentativelyAccept(comment?: string, sendResponse?: boolean, proposedNewTime?: TimeSlot): Promise<void> {
        if (proposedNewTime) {
            sendResponse = true;
        }
        return graphPost(Event(this, "tentativelyAccept"), body({ comment, sendResponse, proposedNewTime }));
    }

    // TODO:: implement event messages?

    public instances = instances;
}
export interface IEvent extends _Event, IDeleteable, IUpdateable { }
export const Event = graphInvokableFactory<IEvent>(_Event);

/**
 * Events
 */
@defaultPath("events")
@getById(Event)
@addable()
export class _Events extends _GraphCollection<IEventType[]> { }
export interface IEvents extends _Events, IGetById<IEvent>, IAddable<IEventType, IEventType> { }
export const Events = graphInvokableFactory<IEvents>(_Events);

/**
 * EventAddResult
 */
export interface IEventAddResult {
    data: IEventType;
    event: IEvent;
}

export interface IGetScheduleRequest {
    schedules: string[];
    startTime: IDateTimeTimeZoneType;
    endTime: IDateTimeTimeZoneType;
    availabilityViewInterval?: number;
}