import { Message as IMessageType, MailFolder as IMailFolderType, MailboxSettings as IMailboxSettingsType } from "@microsoft/microsoft-graph-types";
import { IInvokable } from "@pnp/odata";
import { _GraphQueryableCollection, _GraphQueryableInstance, IGraphQueryableInstance, IGraphQueryableCollection, graphInvokableFactory } from "../graphqueryable";
import { defaultPath, getById, addable, IGetById, IAddable, updateable, IUpdateable } from "../decorators";

/**
 * Message
 */
export class _Message extends _GraphQueryableInstance<IMessageType> implements _IMessage { }
export interface _IMessage { }
export interface IMessage extends _IMessage, IInvokable, IGraphQueryableInstance<IMessageType> { }
export const Message = graphInvokableFactory<IMessage>(_Message);

/**
 * Messages
 */
@defaultPath("messages")
@getById(Message)
@addable()
export class _Messages extends _GraphQueryableCollection<IMessageType[]> implements _IMessages { }
export interface _IMessages { }
export interface IMessages extends _IMessages, IInvokable, IGetById<IMessage>, IAddable<IMessageType>, IGraphQueryableInstance<IMessageType[]> { }
export const Messages = graphInvokableFactory<IMessages>(_Messages);

/**
 * MailFolder
 */
export class _MailFolder extends _GraphQueryableInstance<IMailFolderType> implements _IMailFolder { }
export interface _IMailFolder { }
export interface IMailFolder extends _IMailFolder, IInvokable, IGraphQueryableInstance<IMailFolderType> { }
export const MailFolder = graphInvokableFactory<IMailFolder>(_MailFolder);

/**
 * MailFolders
 */
@defaultPath("mailFolders")
@getById(MailFolder)
@addable()
export class _MailFolders extends _GraphQueryableCollection<IMailFolderType[]> implements _IMailFolders {}
export interface _IMailFolders { }
export interface IMailFolders extends _IMailFolders, IInvokable, IGetById<IMailFolder>, IAddable<IMailFolderType>, IGraphQueryableCollection<IMailFolderType[]> { }
export const MailFolders = graphInvokableFactory<IMailFolders>(_MailFolders);

/**
 * MailboxSettings
 */
@defaultPath("mailboxSettings")
@updateable()
export class _MailboxSettings extends _GraphQueryableInstance<IMailboxSettingsType> implements _IMailboxSettings {}
export interface _IMailboxSettings { }
export interface IMailboxSettings extends _IMailboxSettings, IInvokable, IUpdateable<IMailboxSettingsType>, IGraphQueryableInstance<IMailboxSettingsType> { }
export const MailboxSettings = graphInvokableFactory<IMailboxSettings>(_MailboxSettings);
