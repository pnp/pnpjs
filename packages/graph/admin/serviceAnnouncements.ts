import { GraphQueryable, _GraphCollection, _GraphInstance, graphGet, graphInvokableFactory, graphPost } from "../graphqueryable.js";
import {
    ServiceAnnouncement as IServiceAnnouncementType,
    ServiceHealth as IServiceHealthType,
    ServiceAnnouncementAttachment as IServiceAccountAttachmentType,
    ServiceHealthIssue as IServiceHealthIssueType,
    ServiceUpdateMessage as IServiceMessageType,
} from "@microsoft/microsoft-graph-types";
import { IGetById, defaultPath, getById, getByName } from "../decorators.js";
import { body } from "@pnp/queryable";

/**
 * Tenant Service Announcements
 */
@defaultPath("serviceAnnouncement")
export class _ServiceAnnouncements extends _GraphInstance<IServiceAnnouncementType> {
    public get healthOverviews(): IHealthOverviews {
        return HealthOverviews(this);
    }
    public get issues(): IHealthIssues {
        return HealthIssues(this);
    }
    public get messages(): IServiceMessages {
        return ServiceMessages(this);
    }
}

export interface IServiceAccouncements extends _ServiceAnnouncements { }
export const ServiceAnnouncements = graphInvokableFactory<IServiceAccouncements>(_ServiceAnnouncements);

/**
 * Service Health Report
 */
export class _ServiceHealth extends _GraphInstance<IServiceHealthType> { }
export interface IServiceHealth extends _ServiceHealth { }
export const ServiceHealth = graphInvokableFactory<IServiceHealth>(_ServiceHealth);

/**
 * Service Health reports
 */
@defaultPath("healthOverviews")
@getByName(ServiceHealth)
export class _HealthOverviews extends _GraphCollection<IServiceHealthType[]> { }
export interface IHealthOverviews extends _HealthOverviews { }
export const HealthOverviews = graphInvokableFactory<IHealthOverviews>(_HealthOverviews);

/**
 * Health Issue
 */
export class _HealthIssue extends _GraphInstance<IServiceHealthIssueType> { }
export interface IHealthIssue extends _HealthIssue { }
export const HealthIssue = graphInvokableFactory<IHealthIssue>(_HealthIssue);

/**
 * Health issues
 */
@defaultPath("issues")
@getById(HealthIssue)
export class _HealthIssues extends _GraphCollection<IServiceHealthIssueType[]> {
    /**
     * Get incident report. The operation returns an error if the specified issue doesn't exist for the tenant or if PIR document does not exist for the issue.
     */
    public get incidentReport(): any {
        return graphGet(GraphQueryable(this, "issueReport"));
    }
}
export interface IHealthIssues extends _HealthIssues { }
export const HealthIssues = graphInvokableFactory<IHealthIssues>(_HealthIssues);


/**
 * Service Announcements Messages
 */
export class _ServiceMessage extends _GraphInstance<IServiceMessageType> {
    /**
    * Get message attachment
    */
    public get attachments(): any {
        return ServiceMessageAttachments(this);
    }
}
export interface IServiceMessage extends _ServiceMessage { }
export const ServiceMessage = graphInvokableFactory<IServiceMessage>(_ServiceMessage);

/**
 * Service Announcements Messages
 */
@defaultPath("messages")
@getById(ServiceMessage)
export class _ServiceMessages extends _GraphCollection<IServiceHealthIssueType[]> {
    /**
     * Archive a list of service messages as read for signed-in user
     *
     * @param messageIds List of message IDs to mark as read.
     */
    public archive(messageIds: string[]): Promise<IServiceMessageUpdate> {
        return graphPost(ServiceMessages(this, "archive"), body({
            messageIds: messageIds,
        }));
    }

    /**
     * Unarchive a list of service messages as read for signed-in user
     *
     * @param messageIds List of message IDs to mark as read.
     */
    public unarchive(messageIds: string[]): Promise<IServiceMessageUpdate> {
        return graphPost(ServiceMessages(this, "unarchive"), body({
            messageIds: messageIds,
        }));
    }

    /**
    * Favorite a list of service messages as read for signed-in user
    *
    * @param messageIds List of message IDs to mark as read.
    */
    public favorite(messageIds: string[]): Promise<IServiceMessageUpdate> {
        return graphPost(ServiceMessages(this, "favorite"), body({
            messageIds: messageIds,
        }));
    }

    /**
    * Unfavorite a list of service messages as read for signed-in user
    *
    * @param messageIds List of message IDs to mark as read.
    */
    public unfavorite(messageIds: string[]): Promise<IServiceMessageUpdate> {
        return graphPost(ServiceMessages(this, "unfavorite"), body({
            messageIds: messageIds,
        }));
    }

    /**
     * Mark a list of service messages as read for signed-in user
     *
     * @param messageIds List of message IDs to mark as read.
     */
    public markRead(messageIds: string[]): Promise<IServiceMessageUpdate> {
        return graphPost(ServiceMessages(this, "markRead"), body({
            messageIds: messageIds,
        }));
    }

    /**
    * Mark a list of service messages as unread for signed-in user
    *
    * @param messageIds List of message IDs to mark as read.
    */
    public markUnread(messageIds: string[]): Promise<IServiceMessageUpdate> {
        return graphPost(ServiceMessages(this, "markUnread"), body({
            messageIds: messageIds,
        }));
    }
}
export interface IServiceMessages extends _ServiceMessages, IGetById<IServiceMessage> { }
export const ServiceMessages = graphInvokableFactory<IServiceMessages>(_ServiceMessages);

/**
 * Service Announcements Message
 */
export class _ServiceMessageAttachment extends _GraphInstance<IServiceAccountAttachmentType> { }
export interface IServiceMessageAttachment extends _ServiceMessageAttachment { }
export const ServiceMessageAttachment = graphInvokableFactory<IServiceMessageAttachment>(_ServiceMessageAttachment);

/**
 * Service Announcements Message
 */
@defaultPath("attachments")
@getById(ServiceMessageAttachment)
export class _ServiceMessageAttachments extends _GraphCollection<IServiceAccountAttachmentType[]> { }
export interface IServiceMessageAttachments extends _ServiceMessageAttachments { }
export const ServiceMessageAttachments = graphInvokableFactory<IServiceMessageAttachments>(_ServiceMessageAttachments);


export interface IServiceMessageUpdate {
    value: boolean;
}
