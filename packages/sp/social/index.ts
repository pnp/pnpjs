import { ISocial, Social } from "./types.js";
import { SPFI } from "../fi.js";

export {
    IMySocial,
    ISocial,
    IMySocialData,
    ISocialActor,
    ISocialActorInfo,
    MySocial,
    Social,
    SocialActorType,
    SocialActorTypes,
    SocialFollowResult,
    SocialStatusCode,
} from "./types.js";

declare module "../fi" {
    interface SPFI {
        /**
         * Access to the social instance which allows you to track followed sites, people and docs.
         */
        readonly social: ISocial;
    }
}

Reflect.defineProperty(SPFI.prototype, "social", {
    configurable: true,
    enumerable: true,
    get: function (this: SPFI) {
        return this.create(<any>Social);
    },
});
