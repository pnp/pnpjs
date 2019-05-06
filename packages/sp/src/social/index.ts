import { SPRest } from "../rest";
import { ISocial, Social } from "./types";

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
} from "./types";

/**
 * Extend rest
 */
declare module "../rest" {
    interface SPRest {
        readonly social: ISocial;
    }
}

Reflect.defineProperty(SPRest.prototype, "social", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest) {
        return Social(this._baseUrl);
    },
});
