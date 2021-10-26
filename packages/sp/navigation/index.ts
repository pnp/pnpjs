import { SPFI } from "../fi.js";
import { NavigationService, INavigationService } from "./types.js";

import "./web.js";

export {
    INavNodeUpdateResult,
    INavigation,
    INavigationNode,
    INavigationNodeAddResult,
    INavigationNodes,
    INavigationService,
    Navigation,
    NavigationNode,
    NavigationNodes,
    NavigationService,
    IMenuNode,
    IMenuNodeCollection,
    ISerializableNavigationNode,
    INavNodeInfo,
} from "./types.js";

declare module "../fi" {
    interface SPFI {
        readonly navigation: INavigationService;
    }
}

Reflect.defineProperty(SPFI.prototype, "navigation", {
    configurable: true,
    enumerable: true,
    get: function (this: SPFI) {
        return this.create(NavigationService);
    },
});
