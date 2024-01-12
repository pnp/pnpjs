import {
    Message as IMessageType,
    MessageRule as IMessageRuleType,
    TimeZoneInformation,
} from "@microsoft/microsoft-graph-types";
import { _GraphInstance, _GraphCollection, graphInvokableFactory, graphGet, GraphQueryable, graphPost } from "../graphqueryable.js";
import { defaultPath, getById, addable, IGetById, IAddable, updateable, IUpdateable, IDeleteable, deleteable } from "../decorators.js";
import { body, InjectHeaders } from "@pnp/queryable/index.js";
import { mailResponse } from "./funcs.js";
import { IPagedResult, Paged } from "../behaviors/paged.js";

/**
 * Message
 */
@updateable()
@deleteable()
export class _Message extends _GraphInstance<IMessageType> {

    /**
     * Sends the message
     *
     */
    public async send(): Promise<void> {
        return await graphPost(Message(this, "send"));
    }

    /**
     * Copy the message
     *
     * @param destinationFolderId The id of the destination folder to copy the message to
     */
    public async copy(destinationFolderId: string): Promise<IMessageType> {
        return await graphPost(Message(this, "copy"), body({ destinationId: destinationFolderId }));
    }

    /**
     * Move the message
     *
     * @param destinationFolderId The id of the destination folder to copy the message to
     */
    public async move(destinationFolderId: string): Promise<IMessageType> {
        return await graphPost(Message(this, "move"), body({ destinationId: destinationFolderId }));
    }

    /**
     * Create a draft response
     *
     * @param response (optional) The body of the response message
     *   If using JSON provide either comment: string or message: IMessageType.
     *   If using MIME format, provide the MIME content with the applicable Internet message headers, all encoded in base64 format.
     * @param timeZone (optional) The time zone to use when creating the draft.
     *   Only use when providing a JSON message.
     */
    public async createReply(response?: any, timeZone?: TimeZoneInformation): Promise<IMessageType> {
        return (await mailResponse(this, "createReply", response, timeZone)) as IMessageType;
    }

    /**
     * Send a message response
     *
     * @param response (optional) The body of the response message
     *   If using JSON provide either comment: string or message: IMessageType.
     *   If using MIME format, provide the MIME content with the applicable Internet message headers, all encoded in base64 format.
     * @param timeZone (optional) The time zone to use when creating the draft.
     *   Only use when providing a JSON message.
     */
    public async reply(response?: any, timeZone?: TimeZoneInformation): Promise<void> {
        return (await mailResponse(this, "reply", response, timeZone)) as void;
    }

    /**
     * Create a draft response message to all
     *
     * @param response (optional) The body of the response message
     *   If using JSON provide either comment: string or message: IMessageType.
     *   If using MIME format, provide the MIME content with the applicable Internet message headers, all encoded in base64 format.
     * @param timeZone (optional) The time zone to use when creating the draft.
     *   Only use when providing a JSON message.
     */
    public async createReplyAll(response?: any, timeZone?: TimeZoneInformation): Promise<IMessageType> {
        return (await mailResponse(this, "createReplyAll", response, timeZone)) as IMessageType;
    }

    /**
    * Send a message response to all
    *
    * @param response (optional) The body of the response message
    *   If using JSON provide either comment: string or message: IMessageType.
    *   If using MIME format, provide the MIME content with the applicable Internet message headers, all encoded in base64 format.
    * @param timeZone (optional) The time zone to use when creating the draft.
    *   Only use when providing a JSON message.
    */
    public async replyAll(response?: any, timeZone?: TimeZoneInformation): Promise<void> {
        return (await mailResponse(this, "replyAll", response, timeZone)) as void;
    }

    /**
     * Create a draft forward message
     *
     * @param forward (optional) The body of the forward message
     *   If using JSON provide either comment: string or message: IMessageType.
     *   If using MIME format, provide the MIME content with the applicable Internet message headers, all encoded in base64 format.
     * @param timeZone (optional) The time zone to use when creating the draft.
     *   Only use when providing a JSON message.
     */
    public async createForward(forward?: any, timeZone?: TimeZoneInformation): Promise<IMessageType> {
        return (await mailResponse(this, "createForward", forward, timeZone)) as IMessageType;
    }

    /**
    * Forward a message
    *
    * @param forward (optional) The body of the forward message
    *   If using JSON provide either comment: string or message: IMessageType.
    *   If using MIME format, provide the MIME content with the applicable Internet message headers, all encoded in base64 format.
    * @param timeZone (optional) The time zone to use when creating the draft.
    *   Only use when providing a JSON message.
    */
    public async forward(forward?: any, timeZone?: TimeZoneInformation): Promise<void> {
        return (await mailResponse(this, "forward", forward, timeZone)) as void;
    }
}
export interface IMessage extends _Message, IUpdateable<IMessageType>, IDeleteable { }
export const Message = graphInvokableFactory<IMessage>(_Message);

/**
 * Messages
 */
@defaultPath("messages")
@getById(Message)
@addable()
export class _Messages extends _GraphCollection<IMessageType[]> {
    /**
     * Gets the delta for the current set of messages
     *
     * @param properties The set of properties used to retrieve specific types of messages
     */
    public async delta(properties?: IMessageDelta, maxPageSize?: number): Promise<IPagedResult<IMessage[]>> {
        properties = properties || {};
        const querystring = Object.keys(properties)?.map(key => `${key}=${properties[key]}`).join("&") || "";
        const path = (querystring.length > 0) ? `delta?${querystring}` : "delta";
        const q = GraphQueryable(this, path);
        if (maxPageSize) {
            q.using(InjectHeaders({
                "Prefer": `odata.maxpagesize=${maxPageSize}`,
            }));
        }
        return await graphGet(q.using(Paged()));
    }
}
export interface IMessages extends _Messages, IGetById<IMessage>, IAddable<IMessageType>, IDeleteable { }
export const Messages = graphInvokableFactory<IMessages>(_Messages);


/**
 * Message Rule
 */
@updateable()
@deleteable()
export class _MessageRule extends _GraphInstance<IMessageRuleType> {}
export interface IMessageRule extends _MessageRule, IUpdateable<IMessageRuleType>, IDeleteable { }
export const MessageRule = graphInvokableFactory<IMessageRule>(_MessageRule);

/**
 * Message Rules
 */
@defaultPath("messageRules")
@getById(MessageRule)
@addable()
export class _MessageRules extends _GraphCollection<IMessageRuleType[]> {}
export interface IMessageRules extends _MessageRules, IGetById<IMessageRule>, IAddable<IMessageRuleType> { }
export const MessageRules = graphInvokableFactory<IMessageRules>(_MessageRules);

export interface IMessageDelta {
    "$skiptoken"?: string;
    "$deltatoken"?: string;
    changeType?: string;
}
