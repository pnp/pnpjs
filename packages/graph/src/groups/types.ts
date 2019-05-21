import { assign, TypedHash } from "@pnp/common";
import { Event as IEventType, Group as IGroupType } from "@microsoft/microsoft-graph-types";
import { body, IInvokable } from "@pnp/odata";
import { _GraphQueryableInstance, _GraphQueryableCollection, IGraphQueryableCollection, graphInvokableFactory } from "../graphqueryable";
import { defaultPath, deleteable, IDeleteable, updateable, IUpdateable, getById, IGetById } from "../decorators";
import { graphPost } from "../operations";
import { _DirectoryObject, IDirectoryObject, _DirectoryObjects } from "../directory-objects/types";

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
export class _Group extends _DirectoryObject<IGroupType> implements _IGroup {

    public addFavorite(): Promise<void> {
        return graphPost(this.clone(Group, "addFavorite"));
    }

    public removeFavorite(): Promise<void> {
        return graphPost(this.clone(Group, "removeFavorite"));
    }

    public resetUnseenCount(): Promise<void> {
        return graphPost(this.clone(Group, "resetUnseenCount"));
    }

    public subscribeByMail(): Promise<void> {
        return graphPost(this.clone(Group, "subscribeByMail"));
    }

    public unsubscribeByMail(): Promise<void> {
        return graphPost(this.clone(Group, "unsubscribeByMail"));
    }

    public getCalendarView(start: Date, end: Date): Promise<IEventType[]> {

        const view = this.clone(Group, "calendarView");
        view.query.set("startDateTime", start.toISOString());
        view.query.set("endDateTime", end.toISOString());
        return view();
    }
}
export interface _IGroup {
    /**
     * Add the group to the list of the current user's favorite groups. Supported for only Office 365 groups
     */
    addFavorite(): Promise<void>;

    /**
     * Remove the group from the list of the current user's favorite groups. Supported for only Office 365 groups
     */
    removeFavorite(): Promise<void>;

    /**
     * Reset the unseenCount of all the posts that the current user has not seen since their last visit
     */
    resetUnseenCount(): Promise<void>;

    /**
     * Calling this method will enable the current user to receive email notifications for this group,
     * about new posts, events, and files in that group. Supported for only Office 365 groups
     */
    subscribeByMail(): Promise<void>;

    /**
     * Calling this method will prevent the current user from receiving email notifications for this group
     * about new posts, events, and files in that group. Supported for only Office 365 groups
     */
    unsubscribeByMail(): Promise<void>;

    /**
     * Get the occurrences, exceptions, and single instances of events in a calendar view defined by a time range, from the default calendar of a group
     * 
     * @param start Start date and time of the time range
     * @param end End date and time of the time range
     */
    getCalendarView(start: Date, end: Date): Promise<IEventType[]>;
}
export interface IGroup extends _IGroup, IInvokable, IDeleteable, IUpdateable, IDirectoryObject<IGroupType> { }
export const Group = graphInvokableFactory<IGroup>(_Group);

/**
 * Describes a collection of Field objects
 *
 */
@defaultPath("groups")
@getById(Group)
export class _Groups extends _GraphQueryableCollection<IGroupType[]> implements _IGroups {

    /**
     * Create a new group as specified in the request body.
     * 
     * @param name Name to display in the address book for the group
     * @param mailNickname Mail alias for the group
     * @param groupType Type of group being created
     * @param additionalProperties A plain object collection of additional properties you want to set on the new group
     */
    public async add(name: string, mailNickname: string, groupType: GroupType, additionalProperties: TypedHash<any> = {}): Promise<IGroupAddResult> {

        let postBody = assign({
            displayName: name,
            mailEnabled: groupType === GroupType.Office365,
            mailNickname: mailNickname,
            securityEnabled: groupType !== GroupType.Office365,
        }, additionalProperties);

        // include a group type if required
        if (groupType !== GroupType.Security) {

            postBody = assign(postBody, {
                groupTypes: groupType === GroupType.Office365 ? ["Unified"] : ["DynamicMembership"],
            });
        }

        const data = await graphPost(this, body(postBody));

        return {
            data,
            group: (<any>this).getById(data.id),
        };
    }
}
export interface _IGroups { }
export interface IGroups extends _IGroups, IInvokable, IGetById<IGroup>, IGraphQueryableCollection<IGroupType[]> { }
export const Groups = graphInvokableFactory<IGroups>(_Groups);

/**
 * IGroupAddResult
 */
export interface IGroupAddResult {
    group: IGroup;
    data: any;
}
