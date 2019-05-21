import { Message as IMessageType, MailFolder as IMailFolderType, MailboxSettings as IMailboxSettingsType } from "@microsoft/microsoft-graph-types";
import { IInvokable } from "@pnp/odata";
import { _GraphQueryableCollection, _GraphQueryableInstance, IGraphQueryableInstance, IGraphQueryableCollection, graphInvokableFactory } from "../graphqueryable";
import { defaultPath, getById, addable, IGetById, IAddable, updateable, IUpdateable } from "../decorators";

/**
 * Message
 */
export class _Message extends _GraphQueryableInstance<IMessageType> implements IMessage { }
export interface IMessage extends IInvokable, IGraphQueryableInstance<IMessageType> { }
export interface _Message extends IInvokable { }
export const Message = graphInvokableFactory<IMessage>(_Message);

/**
 * Messages
 */
@defaultPath("messages")
@getById(Message)
@addable()
export class _Messages extends _GraphQueryableCollection<IMessageType[]> implements IMessages { }
export interface IMessages extends IInvokable, IGetById<IMessage>, IAddable<IMessageType>, IGraphQueryableInstance<IMessageType[]> { }
export interface _Messages extends IInvokable, IGetById<IMessage>, IAddable<IMessageType> { }
export const Messages = graphInvokableFactory<IMessages>(_Messages);

/**
 * MailFolder
 */
export class _MailFolder extends _GraphQueryableInstance<IMailFolderType> implements IMailFolder { }
export interface IMailFolder extends IInvokable, IGraphQueryableInstance<IMailFolderType> { }
export interface _MailFolder extends IInvokable { }
export const MailFolder = graphInvokableFactory<IMailFolder>(_MailFolder);

/**
 * MailFolders
 */
@defaultPath("mailFolders")
@getById(MailFolder)
@addable()
export class _MailFolders extends _GraphQueryableCollection<IMailFolderType[]> implements IMailFolders {}
export interface IMailFolders extends IInvokable, IGetById<IMailFolder>, IAddable<IMailFolderType>, IGraphQueryableCollection<IMailFolderType[]> { }
export interface _MailFolders extends IInvokable, IGetById<IMailFolder>, IAddable<IMailFolderType> { }
export const MailFolders = graphInvokableFactory<IMailFolders>(_MailFolders);

/**
 * MailboxSettings
 */
@defaultPath("mailboxSettings")
@updateable()
export class _MailboxSettings extends _GraphQueryableInstance<IMailboxSettingsType> implements IMailboxSettings {}
export interface IMailboxSettings extends IInvokable, IUpdateable<IMailboxSettingsType>, IGraphQueryableInstance<IMailboxSettingsType> { }
export interface _MailboxSettings extends IInvokable, IUpdateable<IMailboxSettingsType> { }
export const MailboxSettings = graphInvokableFactory<IMailboxSettings>(_MailboxSettings);
