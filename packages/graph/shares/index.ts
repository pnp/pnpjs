import { GraphFI } from "../fi.js";
import { Shares, IShares } from "./types.js";

export {
    IShare,
    IShares,
    Share,
    Shares,
} from "./types.js";

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
