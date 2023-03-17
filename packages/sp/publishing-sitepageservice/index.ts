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
        readonly spPublishingSitePageService: ISitePageService;
    }
}

Reflect.defineProperty(SPFI.prototype, "spPublishingSitePageService", {
    get: function (this: SPFI) {
        return this.create(SitePageService);
    },
});
