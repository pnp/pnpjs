import { GraphFI } from "../fi.js";
import { IGroups, Groups } from "./types.js";

export {
    Group,
    GroupType,
    Groups,
    IGroup,
    IGroupAddResult,
    IGroups,
} from "./types.js";

declare module "../fi" {
    interface GraphFI {
        readonly groups: IGroups;
    }
}

Reflect.defineProperty(GraphFI.prototype, "groups", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphFI) {
        return this.create(Groups);
    },
});
