import { Event as IEventType, Group as IGroupType } from "@microsoft/microsoft-graph-types";
import { body } from "@pnp/queryable";
import { graphInvokableFactory } from "../graphqueryable.js";
import { defaultPath, deleteable, IDeleteable, updateable, IUpdateable, getById, IGetById } from "../decorators.js";
import { graphPost } from "../operations.js";
import { _DirectoryObject, _DirectoryObjects } from "../directory-objects/types.js";

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
 * Represents a group entity
 */
@deleteable()
@updateable()
export class _Group extends _DirectoryObject<IGroupType> {
    /**
     * Add the group to the list of the current user's favorite groups. Supported for only Office 365 groups
     */
    public addFavorite(): Promise<void> {
        return graphPost(Group(this, "addFavorite"));
    }
    /**
     * Remove the group from the list of the current user's favorite groups. Supported for only Office 365 groups
     */
    public removeFavorite(): Promise<void> {
        return graphPost(Group(this, "removeFavorite"));
    }
    /**
     * Reset the unseenCount of all the posts that the current user has not seen since their last visit
     */
    public resetUnseenCount(): Promise<void> {
        return graphPost(Group(this, "resetUnseenCount"));
    }
    /**
     * Calling this method will enable the current user to receive email notifications for this group,
     * about new posts, events, and files in that group. Supported for only Office 365 groups
     */
    public subscribeByMail(): Promise<void> {
        return graphPost(Group(this, "subscribeByMail"));
    }
    /**
     * Calling this method will prevent the current user from receiving email notifications for this group
     * about new posts, events, and files in that group. Supported for only Office 365 groups
     */
    public unsubscribeByMail(): Promise<void> {
        return graphPost(Group(this, "unsubscribeByMail"));
    }
    /**
     * Get the occurrences, exceptions, and single instances of events in a calendar view defined by a time range, from the default calendar of a group
     *
     * @param start Start date and time of the time range
     * @param end End date and time of the time range
     */
    public getCalendarView(start: Date, end: Date): Promise<IEventType[]> {

        const view = Group(this, "calendarView");
        view.query.set("startDateTime", start.toISOString());
        view.query.set("endDateTime", end.toISOString());
        return view();
    }
}
export interface IGroup extends _Group, IDeleteable, IUpdateable { }
export const Group = graphInvokableFactory<IGroup>(_Group);

/**
 * Describes a collection of Group objects
 *
 */
@defaultPath("groups")
@getById(Group)
export class _Groups extends _DirectoryObjects<IGroupType[]> {

    /**
     * Create a new group as specified in the request body.
     *
     * @param name Name to display in the address book for the group
     * @param mailNickname Mail alias for the group
     * @param groupType Type of group being created
     * @param additionalProperties A plain object collection of additional properties you want to set on the new group
     */
    public async add(name: string, mailNickname: string, groupType: GroupType, additionalProperties: Record<string, any> = {}): Promise<IGroupAddResult> {

        let postBody = {
            displayName: name,
            mailEnabled: groupType === GroupType.Office365,
            mailNickname: mailNickname,
            securityEnabled: groupType !== GroupType.Office365,
            ...additionalProperties,
        };

        // include a group type if required
        if (groupType !== GroupType.Security) {

            postBody = <any>{
                ...postBody,
                groupTypes: groupType === GroupType.Office365 ? ["Unified"] : ["DynamicMembership"],
            };
        }

        const data = await graphPost(this, body(postBody));

        return {
            data,
            group: (<any>this).getById(data.id),
        };
    }
}
export interface IGroups extends _Groups, IGetById<IGroup> { }
export const Groups = graphInvokableFactory<IGroups>(_Groups);

/**
 * IGroupAddResult
 */
export interface IGroupAddResult {
    group: IGroup;
    data: any;
}
