import { addProp } from "@pnp/odata";
import { _User } from "../users/types";
import { IContacts, Contacts, ContactFolders, IContactFolders } from "./types";

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
