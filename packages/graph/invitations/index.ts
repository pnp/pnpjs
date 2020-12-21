import { GraphRest } from "../rest.js";
import { IInvitations, Invitations } from "./types.js";

export {
    IInvitationAddResult,
    IInvitations,
    Invitations,
} from "./types.js";

declare module "../rest" {
    interface GraphRest {
        readonly invitations: IInvitations;
    }
}

Reflect.defineProperty(GraphRest.prototype, "invitations", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphRest) {
        return this.childConfigHook(({ options, baseUrl, runtime }) => {
            return Invitations(baseUrl).configure(options).setRuntime(runtime);
        });
    },
});
