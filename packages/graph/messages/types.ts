import { Message as IMessageType, MailFolder as IMailFolderType, MailboxSettings as IMailboxSettingsType } from "@microsoft/microsoft-graph-types";
import { _GraphQueryableInstance, _GraphQueryableCollection, graphInvokableFactory } from "../graphqueryable.js";
import { defaultPath, getById, addable, IGetById, IAddable, updateable, IUpdateable } from "../decorators.js";

/**
 * Message
 */
export class _Message extends _GraphQueryableInstance<IMessageType> { }
export interface IMessage extends _Message { }
export const Message = graphInvokableFactory<IMessage>(_Message);

/**
 * Messages
 */
@defaultPath("messages")
@getById(Message)
@addable()
export class _Messages extends _GraphQueryableCollection<IMessageType[]> { }
export interface IMessages extends _Messages, IGetById<IMessage>, IAddable<IMessageType> { }
export const Messages = graphInvokableFactory<IMessages>(_Messages);

/**
 * MailFolder
 */
export class _MailFolder extends _GraphQueryableInstance<IMailFolderType> { }
export interface IMailFolder extends _MailFolder { }
export const MailFolder = graphInvokableFactory<IMailFolder>(_MailFolder);

/**
 * MailFolders
 */
@defaultPath("mailFolders")
@getById(MailFolder)
@addable()
export class _MailFolders extends _GraphQueryableCollection<IMailFolderType[]> { }
export interface IMailFolders extends _MailFolders, IGetById<IMailFolder>, IAddable<IMailFolderType> { }
export const MailFolders = graphInvokableFactory<IMailFolders>(_MailFolders);

/**
 * MailboxSettings
 */
@defaultPath("mailboxSettings")
@updateable()
export class _MailboxSettings extends _GraphQueryableInstance<IMailboxSettingsType> { }
export interface IMailboxSettings extends _MailboxSettings, IUpdateable<IMailboxSettingsType> { }
export const MailboxSettings = graphInvokableFactory<IMailboxSettings>(_MailboxSettings);
