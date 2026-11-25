import { GraphFI } from "../fi.js";
import { IChats, Chats } from "./types.js";

import "./installedApps.js";
import "./users.js";

export {
    IChat,
    IChats,
    Chat,
    Chats,
} from "./types.js";

declare module "../fi" {
    interface GraphFI {
        readonly chats: IChats;
    }
}

Reflect.defineProperty(GraphFI.prototype, "chats", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphFI) {
        return this.create(Chats);
    },
});
