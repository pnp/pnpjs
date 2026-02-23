import { body } from "@pnp/queryable";
import {
    Event as IEventType,
    Calendar as ICalendarType,
    CalendarGroup as ICalendarGroupType,
    CalendarPermission as ICalendarPermissionType,
    ScheduleInformation as IScheduleInformationType,
    DateTimeTimeZone as IDateTimeTimeZoneType,
    Recipient,
    TimeSlot,
} from "@microsoft/microsoft-graph-types";
import {  GraphQueryable, IGraphQueryable, _GraphCollection, _GraphInstance, _GraphQueryable, graphInvokableFactory, graphPost } from "../graphqueryable.js";
import { defaultPath, IDeleteable, deleteable, IUpdateable, updateable, getById, IGetById, IAddable, addable } from "../decorators.js";
import { calendarView, instances } from "./funcs.js";

/**
 * Calendar
 */
@deleteable()
@updateable()
export class _Calendar extends _GraphInstance<ICalendarType> {

    public calendarView = calendarView;

    public get calendarPermissions(): ICalendarPermissions {
        return CalendarPermissions(this);
    }
    public get events(): IEvents {
        return Events(this);
    }
    /**
     * Get the free/busy availability information for a collection of users,
     * distributions lists, or resources (rooms or equipment) for a specified time period.
     *
     * @param properties The set of properties used to get the schedule
     */
    public async getSchedule(properties: IGetScheduleRequest): Promise<IScheduleInformationType[]> {
        return graphPost(Calendar(this, "getSchedule"), body(properties));
    }
}
export interface ICalendar extends _Calendar, IUpdateable<ICalendarType>, IDeleteable { }
export const Calendar = graphInvokableFactory<ICalendar>(_Calendar);

/**
 * Calendars
 */
@defaultPath("calendars")
@getById(Calendar)
@addable()
export class _Calendars extends _GraphCollection<ICalendarType[]> {}
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

/**
 * Event
 */
@deleteable()
@updateable()
export class _Event extends _GraphInstance<IEventType> {
    public instances = instances;

    public async accept(comment?: string, sendResponse?: boolean): Promise<void> {
        return graphPost(Event(this, "accept"), body({ comment, sendResponse }));
    }

    public async cancel(comment?: string): Promise<void> {
        return graphPost(Event(this, "cancel"), body({ comment }));
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

    public async forward(fowardEventInfo: IForwardEvent): Promise<void> {
        return graphPost(Event(this, "forward"), body(fowardEventInfo));
    }

    public async snoozeReminder(reminderTime: IDateTimeTimeZoneType): Promise<void> {
        return graphPost(Event(this, "snoozeReminder"), body({ newReminderTime: reminderTime }));
    }

    public async tentativelyAccept(comment?: string, sendResponse?: boolean, proposedNewTime?: TimeSlot): Promise<void> {
        if (proposedNewTime) {
            sendResponse = true;
        }
        return graphPost(Event(this, "tentativelyAccept"), body({ comment, sendResponse, proposedNewTime }));
    }

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
 * Event
 */
@deleteable()
@updateable()
export class _CalendarGroup extends _GraphInstance<ICalendarGroupType> {

    public get calendars(): ICalendars {
        return Calendars(this);
    }
}
export interface ICalendarGroup extends _CalendarGroup, IDeleteable, IUpdateable { }
export const CalendarGroup = graphInvokableFactory<ICalendarGroup>(_CalendarGroup);

/**
 * CalendarGroups
 */
@defaultPath("calendarGroups")
@getById(CalendarGroup)
@addable()
export class _CalendarGroups extends _GraphCollection<ICalendarGroupType[]> { }
export interface ICalendarGroups extends _Events, IGetById<ICalendarGroup>, IAddable<ICalendarGroupType, ICalendarGroupType> { }
export const CalendarGroups = graphInvokableFactory<ICalendarGroups>(_CalendarGroups);

/**
 * CalendarPermission
 */
@updateable()
@deleteable()
export class _CalendarPermission extends _GraphInstance<ICalendarPermissionType> { }
export interface ICalendarPermission extends _CalendarPermission, IUpdateable, IDeleteable { }
export const CalendarPermission = graphInvokableFactory<ICalendarPermission>(_CalendarPermission);

/**
 * CalendarPermissions
 */
@defaultPath("calendarPermissions")
@getById(CalendarPermission)
@addable()
export class _CalendarPermissions extends _GraphCollection<ICalendarPermissionType[]> { }
export interface ICalendarPermissions extends _CalendarPermissions, IGetById<ICalendarPermission>, IAddable<ICalendarPermissionType, ICalendarPermissionType> { }
export const CalendarPermissions = graphInvokableFactory<ICalendarPermissions>(_CalendarPermissions);

export interface IForwardEvent {
    Comment?: string;
    ToRecipients: Recipient[];
}

export interface IGetScheduleRequest {
    schedules: string[];
    startTime: IDateTimeTimeZoneType;
    endTime: IDateTimeTimeZoneType;
    availabilityViewInterval?: number;
}
