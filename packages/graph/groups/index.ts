import { GraphRest } from "../rest";
import { IGroups, Groups } from "./types";

export {
    Group,
    GroupType,
    Groups,
    IGroup,
    IGroupAddResult,
    IGroups,
} from "./types";

declare module "../rest" {
    interface GraphRest {
        readonly groups: IGroups;
    }
}

Reflect.defineProperty(GraphRest.prototype, "groups", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphRest) {
        return Groups(this);
    },
});
