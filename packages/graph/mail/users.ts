import { _User, User } from "../users/types.js";
import { IMessages, Messages, IMessage } from "./messages.js";
import { IMailFolders, MailFolders } from "./folders.js";
import { IOutlook, Outlook } from "./categories.js";
import { FocusedInboxOverrides, IFocusedInboxOverrides, IMailboxSettings, MailboxSettings } from "./mailbox.js";
import { addProp, body } from "@pnp/queryable";
import { graphPost } from "../graphqueryable.js";

declare module "../users/types" {
    interface _User {
        readonly messages: IMessages;
        readonly mailboxSettings: IMailboxSettings;
        readonly mailFolders: IMailFolders;
        readonly outlook: IOutlook;
        readonly focusedInboxOverrides: IFocusedInboxOverrides;
        sendMail(message: IMessage): Promise<void>;
        translateExchangeIds(translateExchangeIds: ITranslateExchangeIds): Promise<ITranslateExchangeIdsResponse[]>;
    }
    interface IUser {
        readonly messages: IMessages;
        readonly mailboxSettings: IMailboxSettings;
        readonly mailFolders: IMailFolders;
        readonly outlook: IOutlook;
        readonly focusedInboxOverrides: IFocusedInboxOverrides;
        sendMail(message: IMessage): Promise<void>;
        translateExchangeIds(translateExchangeIds: ITranslateExchangeIds): Promise<ITranslateExchangeIdsResponse[]>;
    }
}

addProp(_User, "messages", Messages);
addProp(_User, "mailboxSettings", MailboxSettings);
addProp(_User, "mailFolders", MailFolders);
addProp(_User, "outlook", Outlook);
addProp(_User, "focusedInboxOverrides", FocusedInboxOverrides, "inferenceClassification/overrides");

_User.prototype.sendMail = function (this: _User, message: IMessage): Promise<void> {
    return graphPost(User(this, "sendMail"), body(message));
};

/**
 * Translate identifiers of Outlook-related resources between formats.
 *
 */
_User.prototype.translateExchangeIds = function (this: _User, translateExchangeIds: ITranslateExchangeIds): Promise<ITranslateExchangeIdsResponse[]> {
    return graphPost(User(this, "translateExchangeIds"), body(translateExchangeIds));
};

export interface IExchangeIdFormat {
    entryId: string;
    ewsId: string;
    immutableEntryId: string;
    restId: string;
    restImmutableEntryId: string;
}

export interface ITranslateExchangeIds {
    inputIds: string[];
    sourceIdType: IExchangeIdFormat;
    targetIdType: IExchangeIdFormat;
}

export interface ITranslateExchangeIdsResponse {
    sourceId: string;
    targetId: string;
}
