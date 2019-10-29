import { SPRest } from "../rest";
import { Profiles, IProfiles } from "./types";

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
} from "./types";

declare module "../rest" {
    interface SPRest {
        readonly profiles: IProfiles;
    }
}

Reflect.defineProperty(SPRest.prototype, "profiles", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest) {
        return Profiles(this._baseUrl);
    },
});
