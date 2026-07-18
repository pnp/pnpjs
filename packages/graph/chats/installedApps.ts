import { addProp } from "@pnp/queryable";
import { _InstalledApp } from "../teams/types.js";
import { IChat, Chat } from "./types.js";

declare module "../teams/types" {
    interface _InstalledApp {
        readonly chat: IChat;
    }
    interface IInstalledApp {
        readonly chat: IChat;
    }
}

addProp(_InstalledApp, "chat", Chat);
