import { Event as IEventType,
    Group as IGroupType,
    AssignedLicense as IAssignedLicense,
    DirectoryObject as IDirectoryObjectType,
    GroupLifecyclePolicy as IGroupLifecyclePolicyType } from "@microsoft/microsoft-graph-types";
import { body } from "@pnp/queryable";
import { graphGet, graphInvokableFactory, graphPost } from "../graphqueryable.js";
import { defaultPath, deleteable, IDeleteable, updateable, IUpdateable, getById, IGetById } from "../decorators.js";
import { _DirectoryObject, _DirectoryObjects } from "../directory-objects/types.js";

export enum GroupType {
    /**
     * Microsoft 365 (aka unified group)
     */
    Microsoft365,
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
     * Add the group to the list of the current user's favorite groups. Supported for only Microsoft 365 groups
     */
    public addFavorite(): Promise<void> {
        return graphPost(Group(this, "addFavorite"));
    }
    /**
     * Remove the group from the list of the current user's favorite groups. Supported for only Microsoft 365 groups
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
     * about new posts, events, and files in that group. Supported for only Microsoft 365 groups
     */
    public subscribeByMail(): Promise<void> {
        return graphPost(Group(this, "subscribeByMail"));
    }
    /**
     * Calling this method will prevent the current user from receiving email notifications for this group
     * about new posts, events, and files in that group. Supported for only Microsoft 365 groups
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
    /**
     * Retrieves a list of groupLifecyclePolicy objects to which a group belongs.
     */
    public groupLifecyclePolicies(): Promise<IGroupLifecyclePolicyType[]> {
        return graphGet(Group(this, "groupLifecyclePolicies"));
    }
    /**
     * Retrieves a list of group members.
     */
    public transitiveMembers(): Promise<IDirectoryObjectType[]> {
        return graphGet(Group(this, "transitiveMembers"));
    }
    /**
     * Retrieves a list of group members.
     */
    public transitiveMemberOf(): Promise<IDirectoryObjectType[]> {
        return graphGet(Group(this, "transitiveMemberOf"));
    }
    /**
     * Add or remove licenses on a group. Licenses assigned to the group will be assigned to all users in the group.
     * Group-based licensing is an alternative to direct user licensing.
     * @param addLicenses The licenses to add to the group. Each license is represented by an AssignedLicense object.
     * @param removeLicenses The SKUs to remove from the group. Each SKU is represented by its unique SKU ID (GUID).
     */
    public assignLicense(addLicenses: IAssignedLicense[] = [], removeLicenses: string[] = []): Promise<IGroupType> {
        const postBody = {
            addLicenses: addLicenses,
            removeLicenses: removeLicenses,
        };
        return graphPost(Group(this, "assignLicense"), body(postBody));
    }
    /**
     * Renew a group's expiration. When a group is renewed, the group expiration is extended by the number of days defined in the policy.
     */
    public renew(): Promise<void> {
        return graphPost(Group(this, "renew"));
    }
    /**
     * Validate that a Microsoft 365 group's display name or mail nickname complies with naming policies.
     */
    public validateProperties(validatePropObj: IValidatePropObj): Promise<void> {
        return graphPost(Group(this, "validateProperties"), body(validatePropObj));
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
    public async add(name: string, mailNickname: string, groupType: GroupType, additionalProperties: Record<string, any> = {}): Promise<IGroupType> {

        let postBody = {
            displayName: name,
            mailEnabled: groupType === GroupType.Microsoft365,
            mailNickname: mailNickname,
            securityEnabled: groupType !== GroupType.Microsoft365,
            ...additionalProperties,
        };

        // include a group type if required
        if (groupType !== GroupType.Security) {

            postBody = <any>{
                ...postBody,
                groupTypes: groupType === GroupType.Microsoft365 ? ["Unified"] : ["DynamicMembership"],
            };
        }

        return graphPost(this, body(postBody));

    }
}
export interface IGroups extends _Groups, IGetById<IGroup> { }
export const Groups = graphInvokableFactory<IGroups>(_Groups);

export interface IValidatePropObj {
    /**
     * The display name of the group to validate
     */
    displayName?: string;
    /**
     * The mail nickname of the group to validate
     */
    mailNickname?: string;
    /**
    * The ID (GUID) of the user on whose behalf the request is made
    */
    onBehalfOfUserId?: string;
}
