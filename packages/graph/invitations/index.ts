import { GraphFI } from "../fi.js";
import { IInvitations, Invitations } from "./types.js";

export {
    IInvitationAddResult,
    IInvitations,
    Invitations,
} from "./types.js";

declare module "../fi" {
    interface GraphFI {
        readonly invitations: IInvitations;
    }
}

Reflect.defineProperty(GraphFI.prototype, "invitations", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphFI) {
        return this.create(Invitations);
    },
});
