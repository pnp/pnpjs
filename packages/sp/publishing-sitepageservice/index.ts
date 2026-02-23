import { SPFI } from "../fi.js";
import { SitePageService, ISitePageService } from "./types.js";

export {
    ISitePageService,
    SitePageService,
} from "./types.js";

declare module "../fi" {
    interface SPFI {
        /**
         * Access to SP.Publishing.SitePageService API which allows you to get your current unified group memberships
         */
        readonly publishingSitePageService: ISitePageService;
    }
}

Reflect.defineProperty(SPFI.prototype, "publishingSitePageService", {
    get: function (this: SPFI) {
        return this.create(SitePageService);
    },
});
