import { GraphFI } from "../fi.js";
import { Shares, IShares } from "./types.js";
import "./drive-item.js";

export {
    IShare,
    IShares,
    Share,
    Shares,
    IShareLinkInfo,
    IShareLinkAccessInfo,
} from "./types.js";

export {
    ICreateShareLinkInfo,
} from "./drive-item.js";

declare module "../fi" {
    interface GraphFI {
        readonly shares: IShares;
    }
}

Reflect.defineProperty(GraphFI.prototype, "shares", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphFI) {
        return this.create(Shares);
    },
});
