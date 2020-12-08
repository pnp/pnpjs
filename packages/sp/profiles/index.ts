import { SPRest } from "../rest.js";
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

Reflect.defineProperty(SPRest.prototype, "profiles", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest) {
        return this.childConfigHook(({ options, baseUrl, runtime }) => {
            return Profiles(baseUrl).configure(options).setRuntime(runtime);
        });
    },
});
