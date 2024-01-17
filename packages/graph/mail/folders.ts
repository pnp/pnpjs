import {
    MailFolder as IMailFolderType,
    MailSearchFolder as IMailSearchFolderType,
} from "@microsoft/microsoft-graph-types";
import { _GraphInstance, _GraphCollection, graphInvokableFactory, GraphQueryable, graphPost } from "../graphqueryable.js";
import { defaultPath, getById, addable, IGetById, IAddable, updateable, IUpdateable, IDeleteable, deleteable, hasDelta, IHasDelta, IDeltaProps } from "../decorators.js";
import { body } from "@pnp/queryable/index.js";
import { IMessageRules, IMessages, MessageRules, Messages } from "./messages.js";

/**
 * Mail Folder or Mail Search Folder
 */
@updateable()
@deleteable()
export class _MailFolder extends _GraphInstance<IMailFolderType | IMailSearchFolderType> {
    /**
     * Gets the child folders in this mail folder
     *
     */
    public get childFolders(): IMailFolders {
        return MailFolders(this, "childFolders");
    }

    /**
     * Gets the messages in this mail folder
     *
     */
    public get messages(): IMessages {
        return Messages(this);
    }

    /**
     * Gets the child folders in this mail folder
     *
     */
    public get messageRules(): IMessageRules {
        return MessageRules(this);
    }

    /**
     * Copy the mail folder
     *
     * @param destinationFolderId The id of the destination folder to copy the message to
     */
    public async copy(destinationFolderId: string): Promise<IMailFolderType> {
        return await graphPost(MailFolder(this, "copy"), body({ destinationId: destinationFolderId }));
    }

    /**
     * Move the mail folder
     *
     * @param destinationFolderId The id of the destination folder to copy the message to
     */
    public async move(destinationFolderId: string): Promise<IMailFolderType> {
        return await graphPost(MailFolder(this, "move"), body({ destinationId: destinationFolderId }));
    }
}
export interface IMailFolder extends _MailFolder, IUpdateable<IMailFolderType | IMailSearchFolderType>, IDeleteable  { }
export const MailFolder = graphInvokableFactory<IMailFolder>(_MailFolder);

/**
 * Mail Folders or Mail Search Folders
 */
@defaultPath("mailFolders")
@getById(MailFolder)
@addable()
@hasDelta()
export class _MailFolders extends _GraphCollection<IMailFolderType[] | IMailSearchFolderType[]> {
    public get includeHidden() {
        const q = GraphQueryable(this);
        q.query.set("includeHiddenFolders", "true");
        return q;
    }
}
export interface IMailFolders extends _MailFolders, IGetById<IMailFolder>, IAddable<IMailFolderType | IMailSearchFolderType>, IHasDelta<IMailFolderDelta, IMailFolderType> { }
export const MailFolders = graphInvokableFactory<IMailFolders>(_MailFolders);

export interface IMailFolderDelta extends Omit<IDeltaProps, "token"> {
    changeType?: string;
}
