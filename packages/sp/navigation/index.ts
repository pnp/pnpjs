import { SPRest2 } from "../rest-2.js";
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

Reflect.defineProperty(SPRest2.prototype, "navigation", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest2) {
        this.create(<any>NavigationService);
    },
});
