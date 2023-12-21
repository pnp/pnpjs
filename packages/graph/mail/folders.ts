import {
    MailFolder as IMailFolderType,
    MailSearchFolder as IMailSearchFolderType,
} from "@microsoft/microsoft-graph-types";
import { _GraphInstance, _GraphCollection, graphInvokableFactory, graphGet, GraphQueryable, graphPost } from "../graphqueryable.js";
import { defaultPath, getById, addable, IGetById, IAddable, updateable, IUpdateable, IDeleteable, deleteable } from "../decorators.js";
import { body, InjectHeaders } from "@pnp/queryable/index.js";
import { IMessageRules, IMessages, MessageRules, Messages } from "./messages.js";
import { IPagedResult, Paged } from "../behaviors/paged.js";

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
export class _MailFolders extends _GraphCollection<IMailFolderType[] | IMailSearchFolderType[]> {
    public get includeHidden() {
        const q = GraphQueryable(this);
        q.query.set("includeHiddenFolders", "true");
        return q;
    }

    /**
     * Gets the delta for the current set of mail folders
     *
     * @param properties The set of properties used to retrieve specific types of messages
     */
    public async delta(properties?: IMailFolderDelta, maxPageSize?: number): Promise<IPagedResult<IMailFolderType[]>> {
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
export interface IMailFolders extends _MailFolders, IGetById<IMailFolder>, IAddable<IMailFolderType | IMailSearchFolderType> { }
export const MailFolders = graphInvokableFactory<IMailFolders>(_MailFolders);

// export interface IDelta<T> {
//     nextLink: string;
//     deltaLink: string;
//     values: T[];
//     valuesCollection: IGraphQueryableCollection<T>;
// }


export interface IMailFolderDelta {
    "$skiptoken"?: string;
    "$deltatoken"?: string;
}
