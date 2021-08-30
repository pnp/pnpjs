import { SPRest } from "../rest.js";
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

declare module "../rest" {
    interface SPRest {
        readonly navigation: INavigationService;
    }
}

Reflect.defineProperty(SPRest.prototype, "navigation", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest) {
        this.create(<any>NavigationService);
    },
});
