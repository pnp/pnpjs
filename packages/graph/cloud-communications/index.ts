import { GraphFI } from "../fi.js";
import { Communications, ICommunications } from "./types.js";
import "./users.js";

export {
    Presence,
    IPresence,
    Communications,
    ICommunications,
} from "./types.js";

declare module "../fi" {
    interface GraphFI {
        readonly communications: ICommunications;
    }
}

Reflect.defineProperty(GraphFI.prototype, "communications", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphFI) {
        return this.create(Communications);
    },
});
