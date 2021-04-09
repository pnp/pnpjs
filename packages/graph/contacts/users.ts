import { addProp } from "@pnp/queryable";
import { _User } from "../users/types.js";
import { IContacts, Contacts, ContactFolders, IContactFolders } from "./types.js";

declare module "../users/types" {
    interface _User {
        readonly contacts: IContacts;
        readonly contactFolders: IContactFolders;
    }
    interface IUser {
        readonly contacts: IContacts;
        readonly contactFolders: IContactFolders;
    }
}

addProp(_User, "contacts", Contacts);
addProp(_User, "contactFolders", ContactFolders);
