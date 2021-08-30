import { ISocial, Social } from "./types.js";
import { SPRest2 } from "../rest-2.js";

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

declare module "../rest-2" {
    interface SPRest2 {
    /**
     * Access to the social instance which allows you to track followed sites, people and docs.
     */
        readonly social: ISocial;
    }
}

Reflect.defineProperty(SPRest2.prototype, "social", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest2) {
        this.create(Social);
    },
});
