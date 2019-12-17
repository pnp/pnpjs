import { GraphQueryableInstance, GraphQueryableCollection, defaultPath } from "./graphqueryable";
import { Members, Owners } from "./members";
import { extend, TypedHash, jsS } from "@pnp/common";
import { Calendar, Events } from "./calendars";
import { Conversations, Senders } from "./conversations";
import { Event as IEvent, Group as IGroup } from "@microsoft/microsoft-graph-types";
import { Plans } from "./planner";
import { Photo } from "./photos";
import { Team } from "./teams";
import { TeamProperties } from "./types";

export enum GroupType {
    /**
     * Office 365 (aka unified group)
     */
    Office365,
    /**
     * Dynamic membership
     */
    Dynamic,
    /**
     * Security
     */
    Security,
}

/**
 * Describes a collection of Field objects
 *
 */
@defaultPath("groups")
export class Groups extends GraphQueryableCollection<IGroup[]> {

    /**
     * Gets a group from the collection using the specified id
     * 
     * @param id Id of the group to get from this collection
     */
    public getById(id: string): Group {
        return new Group(this, id);
    }

    /**
     * Create a new group as specified in the request body.
     * 
     * @param name Name to display in the address book for the group
     * @param mailNickname Mail alias for the group
     * @param groupType Type of group being created
     * @param additionalProperties A plain object collection of additional properties you want to set on the new group
     */
    public add(name: string, mailNickname: string, groupType: GroupType, additionalProperties: TypedHash<any> = {}): Promise<GroupAddResult> {

        let postBody = extend({
            displayName: name,
            mailEnabled: groupType === GroupType.Office365,
            mailNickname: mailNickname,
            securityEnabled: groupType !== GroupType.Office365,
        }, additionalProperties);

        // include a group type if required
        if (groupType !== GroupType.Security) {

            postBody = extend(postBody, {
                groupTypes: groupType === GroupType.Office365 ? ["Unified"] : ["DynamicMembership"],
            });
        }

        return this.postCore({
            body: jsS(postBody),
        }).then(r => {
            return {
                data: r,
                group: this.getById(r.id),
            };
        });
    }
}

/**
 * Represents a group entity
 */
export class Group extends GraphQueryableInstance<IGroup> {

    /**
     * The calendar associated with this group
     */
    public get calendar(): Calendar {
        return new Calendar(this, "calendar");
    }

    /**
     * Retrieve a list of event objects
     */
    public get events(): Events {
        return new Events(this);
    }

    /**
     * Gets the collection of owners for this group
     */
    public get owners(): Owners {
        return new Owners(this);
    }

    /**
     * The collection of plans for this group
     */
    public get plans(): Plans {
        return new Plans(this, "planner/plans");
    }

    /**
     * Gets the collection of members for this group
     */
    public get members(): Members {
        return new Members(this);
    }

    /**
     * Gets the conversations collection for this group
     */
    public get conversations(): Conversations {
        return new Conversations(this);
    }

    /**
     * Gets the collection of accepted senders for this group
     */
    public get acceptedSenders(): Senders {
        return new Senders(this, "acceptedsenders");
    }

    /**
     * Gets the collection of rejected senders for this group
     */
    public get rejectedSenders(): Senders {
        return new Senders(this, "rejectedsenders");
    }

    /**
     * The photo associated with the group
     */
    public get photo(): Photo {
        return new Photo(this);
    }

    /**
     * Gets the team associated with this group, if it exists
     */
    public get team(): Team {
        return new Team(this);
    }

    /**
     * Add the group to the list of the current user's favorite groups. Supported for only Office 365 groups
     */
    public addFavorite(): Promise<void> {
        return this.clone(Group, "addFavorite").postCore();
    }

    /**
     * Creates a Microsoft Team associated with this group
     * 
     * @param properties Initial properties for the new Team
     */
    public createTeam(properties: TeamProperties): Promise<any> {

        return this.clone(Group, "team").putCore({
            body: jsS(properties),
        });
    }

    /**
     * Returns all the groups and directory roles that the specified group is a member of. The check is transitive
     * 
     * @param securityEnabledOnly 
     */
    public getMemberObjects(securityEnabledOnly = false): Promise<{ value: string[] }> {
        return this.clone(Group, "getMemberObjects").postCore({
            body: jsS({
                securityEnabledOnly: securityEnabledOnly,
            }),
        });
    }

    /**
     * Return all the groups that the specified group is a member of. The check is transitive
     * 
     * @param securityEnabledOnly 
     */
    public getMemberGroups(securityEnabledOnly = false): Promise<{ value: string[] }> {

        return this.clone(Group, "getMemberGroups").postCore({
            body: jsS({
                securityEnabledOnly: securityEnabledOnly,
            }),
        });
    }

    /**
     * Check for membership in a specified list of groups, and returns from that list those groups of which the specified user, group, or directory object is a member. 
     * This function is transitive.
     * @param groupIds A collection that contains the object IDs of the groups in which to check membership. Up to 20 groups may be specified.
     */
    public checkMemberGroups(groupIds: String[]): Promise<{ value: string[] }> {
        return this.clone(Group, "checkMemberGroups").postCore({
            body: jsS({
                groupIds: groupIds,
            }),
        });
    }

    /**
     * Deletes this group
     */
    public delete(): Promise<void> {
        return this.deleteCore();
    }

    /**
     * Update the properties of a group object
     * 
     * @param properties Set of properties of this group to update
     */
    public update(properties: IGroup): Promise<void> {

        return this.patchCore({
            body: jsS(properties),
        });
    }

    /**
     * Remove the group from the list of the current user's favorite groups. Supported for only Office 365 groups
     */
    public removeFavorite(): Promise<void> {

        return this.clone(Group, "removeFavorite").postCore();
    }

    /**
     * Reset the unseenCount of all the posts that the current user has not seen since their last visit
     */
    public resetUnseenCount(): Promise<void> {
        return this.clone(Group, "resetUnseenCount").postCore();
    }

    /**
     * Calling this method will enable the current user to receive email notifications for this group,
     * about new posts, events, and files in that group. Supported for only Office 365 groups
     */
    public subscribeByMail(): Promise<void> {
        return this.clone(Group, "subscribeByMail").postCore();
    }

    /**
     * Calling this method will prevent the current user from receiving email notifications for this group
     * about new posts, events, and files in that group. Supported for only Office 365 groups
     */
    public unsubscribeByMail(): Promise<void> {
        return this.clone(Group, "unsubscribeByMail").postCore();
    }

    /**
     * Get the occurrences, exceptions, and single instances of events in a calendar view defined by a time range, from the default calendar of a group
     * 
     * @param start Start date and time of the time range
     * @param end End date and time of the time range
     */
    public getCalendarView(start: Date, end: Date): Promise<IEvent[]> {

        const view = this.clone(Group, "calendarView");
        view.query.set("startDateTime", start.toISOString());
        view.query.set("endDateTime", end.toISOString());
        return view.get();
    }
}

export interface GroupAddResult {
    group: Group;
    data: any;
}
