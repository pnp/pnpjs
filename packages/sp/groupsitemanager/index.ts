import { SPFI } from "../fi.js";
import { GroupSiteManager, IGroupSiteManager } from "./types.js";

export * from "./types.js";

declare module "../fi" {
    interface SPFI {
        readonly groupSiteManager: IGroupSiteManager;
    }
}

Reflect.defineProperty(SPFI.prototype, "groupSiteManager", {
    configurable: true,
    enumerable: true,
    get: function (this: SPFI) {
        return this.create(GroupSiteManager);
    },
});
