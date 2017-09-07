import { GraphQueryable, GraphQueryableInstance, GraphQueryableCollection } from "./graphqueryable";
import { TypedHash } from "@pnp/common";
import { Event as IEvent } from "@microsoft/microsoft-graph-types";
// import { Attachments } from "./attachments";

export class Calendars extends GraphQueryableCollection {

    constructor(baseUrl: string | GraphQueryable, path = "calendars") {
        super(baseUrl, path);
    }
}

export class Calendar extends GraphQueryableInstance {

    public get events(): Events {
        return new Events(this);
    }
}

export class Events extends GraphQueryableCollection {

    constructor(baseUrl: string | GraphQueryable, path = "events") {
        super(baseUrl, path);
    }

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
            body: JSON.stringify(properties),
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

export class Event extends GraphQueryableInstance {

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
            body: JSON.stringify(properties),
        });
    }

    /**
     * Deletes this event
     */
    public delete(): Promise<void> {
        return this.deleteCore();
    }
}

