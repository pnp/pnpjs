import { addProp } from "@pnp/queryable";
import { _Web } from "../webs/types.js";
import { Navigation, INavigation } from "./types.js";

declare module "../webs/types" {
    interface _Web {
        navigation: INavigation;
    }
    interface IWeb {

        /**
         * Gets a navigation object that represents navigation on the Web site,
         * including the Quick Launch area and the top navigation bar
         */
        navigation: INavigation;
    }
}

addProp(_Web, "navigation", <any>Navigation);
