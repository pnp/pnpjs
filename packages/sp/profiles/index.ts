import { SPRest2 } from "../rest-2.js";
import { Profiles, IProfiles } from "./types.js";

export {
    IProfiles,
    Profiles,
    IClientPeoplePickerQueryParameters,
    IFollowedContent,
    IHashTag,
    IHashTagCollection,
    IPeoplePickerEntity,
    IPeoplePickerEntityData,
    IPeoplePickerQuerySettings,
    IUserProfile,
    UrlZone,
} from "./types.js";

declare module "../rest" {
    interface SPRest {
        readonly profiles: IProfiles;
    }
}

Reflect.defineProperty(SPRest2.prototype, "profiles", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest2) {
        this.create(Profiles);
    },
});
