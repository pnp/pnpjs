import { SPFI } from "../fi.js";
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

declare module "../fi" {
    interface SPFI {
        readonly profiles: IProfiles;
    }
}

Reflect.defineProperty(SPFI.prototype, "profiles", {
    configurable: true,
    enumerable: true,
    get: function (this: SPFI) {
        return this.create(Profiles);
    },
});
