import { addProp, body } from "@pnp/queryable";
import { _User, User } from "../users/types.js";
import { IMessages, Messages, IMailboxSettings, MailboxSettings, IMailFolders, MailFolders, IMessage } from "./types.js";
import { graphPost } from "../operations.js";
import { Message } from "@microsoft/microsoft-graph-types";

declare module "../users/types" {
    interface _User {
        readonly messages: IMessages;
        readonly mailboxSettings: IMailboxSettings;
        readonly mailFolders: IMailFolders;
        sendMail(message: Message): Promise<void>;
    }
    interface IUser {
        readonly messages: IMessages;
        readonly mailboxSettings: IMailboxSettings;
        readonly mailFolders: IMailFolders;
        sendMail(message: Message): Promise<void>;
    }
}

addProp(_User, "messages", Messages);
addProp(_User, "mailboxSettings", MailboxSettings);
addProp(_User, "mailFolders", MailFolders);

_User.prototype.sendMail = function (message: Message): Promise<void> {
    return graphPost(User(this, "sendMail"), body(message));
};
