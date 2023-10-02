import { GraphFI } from "../fi.js";
import { AppCatalogs, IAppCatalogs} from "./types.js";


export {
    AppCatalogs,
    IAppCatalogs,
} from "./types.js";

declare module "../fi" {
    interface GraphFI {
        readonly appCatalogs: IAppCatalogs;
    }
}

Reflect.defineProperty(GraphFI.prototype, "appCatalogs", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphFI) {
        return this.create(AppCatalogs);
    },
});
