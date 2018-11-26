import { GraphQueryableInstance, GraphQueryableCollection, defaultPath } from "./graphqueryable";
import { TypedHash, jsS } from "@pnp/common";
import { Event as IEvent, Calendar as ICalendar } from "@microsoft/microsoft-graph-types";
// import { Attachments } from "./attachments";

@defaultPath("calendars")
export class Calendars extends GraphQueryableCollection<ICalendar[]> {}

export class Calendar extends GraphQueryableInstance<ICalendar> {

    public get events(): Events {
        return new Events(this);
    }
}

@defaultPath("events")
export class Events extends GraphQueryableCollection<IEvent[]> {

    public getById(id: string): Event {
        return new Event(this, id);
    }

    /**
     * Adds a new event to the collection
     * 
     * @param properties The set of properties used to create the event
     */
    public add(properties: Event): Promise<EventAddResult> {

        return this.postCore({
            body: jsS(properties),
        }).then(r => {
            return {
                data: r,
                event: this.getById(r.id),
            };
        });
    }
}

export interface EventAddResult {
    data: IEvent;
    event: Event;
}

export class Event extends GraphQueryableInstance<IEvent> {

    // TODO:: when supported
    // /**
    //  * Gets the collection of attachments for this event
    //  */
    // public get attachments(): Attachments {
    //     return new Attachments(this);
    // }

    /**
     * Update the properties of an event object
     * 
     * @param properties Set of properties of this event to update
     */
    public update(properties: TypedHash<any>): Promise<void> {

        return this.patchCore({
            body: jsS(properties),
        });
    }

    /**
     * Deletes this event
     */
    public delete(): Promise<void> {
        return this.deleteCore();
    }
}
