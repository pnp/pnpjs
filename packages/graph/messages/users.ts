import { addProp, body } from "@pnp/odata";
import { _User, User } from "../users/types";
import { IMessages, Messages, IMailboxSettings, MailboxSettings, IMailFolders, MailFolders, IMessage } from "./types";
import { graphPost } from "../operations";

declare module "../users/types" {
    interface _User {
        readonly messages: IMessages;
        readonly mailboxSettings: IMailboxSettings;
        readonly mailFolders: IMailFolders;
        sendMail(message: IMessage): Promise<void>;
    }
    interface IUser {
        readonly messages: IMessages;
        readonly mailboxSettings: IMailboxSettings;
        readonly mailFolders: IMailFolders;
        sendMail(message: IMessage): Promise<void>;
    }
}

addProp(_User, "messages", Messages);
addProp(_User, "mailboxSettings", MailboxSettings);
addProp(_User, "mailFolders", MailFolders);

_User.prototype.sendMail = function (this: _User, message: IMessage): Promise<void> {
    return graphPost(this.clone(User, "sendMail"), body(message));
};
