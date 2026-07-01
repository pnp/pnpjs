import { GraphFI } from "../fi.js";
import { Contacts, IContacts } from "./types.js";
import "./users.js";

export {
    Contact,
    ContactFolder,
    ContactFolders,
    Contacts,
    IContact,
    IContactFolder,
    IContactFolders,
    IContacts,
} from "./types.js";

declare module "../fi" {
    interface GraphFI {
        readonly contacts: IContacts;
    }
}

Reflect.defineProperty(GraphFI.prototype, "contacts", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphFI) {
        return this.create(Contacts);
    },
});
