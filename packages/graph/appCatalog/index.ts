import { GraphFI } from "../fi.js";
import { AppCatalog, IAppCatalog} from "./types.js";


export {
    AppCatalog,
    IAppCatalog,
} from "./types.js";

declare module "../fi" {
    interface GraphFI {
        readonly appCatalog: IAppCatalog;
    }
}

Reflect.defineProperty(GraphFI.prototype, "appCatalog", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphFI) {
        return this.create(AppCatalog);
    },
});
