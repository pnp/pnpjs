import { GraphRest } from "../rest.js";
import { IGroups, Groups } from "./types.js";

export {
    Group,
    GroupType,
    Groups,
    IGroup,
    IGroupAddResult,
    IGroups,
} from "./types.js";

declare module "../rest" {
    interface GraphRest {
        readonly groups: IGroups;
    }
}

Reflect.defineProperty(GraphRest.prototype, "groups", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphRest) {
        return this.childConfigHook(({ options, baseUrl, runtime }) => {
            return Groups(baseUrl).configure(options).setRuntime(runtime);
        });
    },
});
