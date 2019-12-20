import { SPRest } from "../rest";
import { NavigationService, INavigationService } from "./types";

import "./web";

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
} from "./types";

declare module "../rest" {
    interface SPRest {
        readonly navigation: INavigationService;
    }
}

Reflect.defineProperty(SPRest.prototype, "navigation", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest) {
        return NavigationService().configure(this._options);
    },
});
