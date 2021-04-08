import { GraphRest } from "../rest.js";
import { Communications, ICommunications } from "./types.js";
import "./users.js";

export {
    Presence,
    IPresence,
    Communications,
    ICommunications,
} from "./types.js";

declare module "../rest" {
    interface GraphRest {
        readonly communications: ICommunications;
    }
}

Reflect.defineProperty(GraphRest.prototype, "communications", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphRest) {
        return this.childConfigHook(({ options, baseUrl, runtime }) => {
            return Communications(baseUrl).configure(options).setRuntime(runtime);
        });
    },
});