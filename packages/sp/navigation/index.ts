import { SPRest } from "../rest";
import { Navigation, INavigation } from "./types";
import { addProp } from "@pnp/odata";

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
} from "./types";

declare module "../rest" {
    interface SPRest {
        readonly navigation: INavigation;
    }
}

addProp(SPRest, "navigation", Navigation);
