import { addProp } from "@pnp/odata";
import { _Web } from "../webs/types";
import { Navigation, INavigation } from "./types";

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

addProp(_Web, "navigation", Navigation);
