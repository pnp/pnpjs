import { GraphQueryableInstance, GraphQueryableCollection, defaultPath } from "./graphqueryable";
import {
    Message as IMessage,
    MailFolder as IMailFolder,
    MailboxSettings as IMailboxSettings,
} from "@microsoft/microsoft-graph-types";
import { jsS } from "@pnp/common";

@defaultPath("messages")
export class Messages extends GraphQueryableCollection<IMessage[]> {

    /**
     * Gets a member of the group by id
     * 
     * @param id Attachment id
     */
    public getById(id: string): Message {
        return new Message(this, id);
    }

    /**
     * Add a message to this collection
     * 
     * @param message The message details
     */
    public add(message: IMessage): Promise<IMessage> {

        return this.postCore({
            body: jsS(message),
        });
    }
}

export class Message extends GraphQueryableInstance<IMessage> { }

@defaultPath("mailFolders")
export class MailFolders extends GraphQueryableCollection<IMailFolder[]> {

    /**
     * Gets a member of the group by id
     * 
     * @param id Attachment id
     */
    public getById(id: string): MailFolder {
        return new MailFolder(this, id);
    }

    /**
     * Add a mail folder to this collection
     * 
     * @param message The message details
     */
    public add(mailFolder: IMailFolder): Promise<IMailFolder> {

        return this.postCore({
            body: jsS(mailFolder),
        });
    }
}

export class MailFolder extends GraphQueryableInstance<IMailFolder> { }

@defaultPath("mailboxSettings")
export class MailboxSettings extends GraphQueryableInstance<IMailboxSettings> {

    public update(settings: IMailboxSettings): Promise<void> {
        return this.patchCore({
            body: jsS(settings),
        });
    }
}
