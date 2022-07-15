import {
    _SPInstance,
    ISPQueryable,
    SPCollection,
    ISPCollection,
    ISPInstance,
    spInvokableFactory,
    _SPQueryable,
} from "../spqueryable.js";
import { body } from "@pnp/queryable";
import { PrincipalType, PrincipalSource } from "../types.js";
import { defaultPath } from "../decorators.js";
import { spPost } from "../operations.js";
import { AssignFrom } from "@pnp/core";

export class _Profiles extends _SPInstance {

    private clientPeoplePickerQuery: ClientPeoplePickerQuery;
    private profileLoader: ProfileLoader;

    /**
     * Creates a new instance of the UserProfileQuery class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this user profile query
     */
    constructor(baseUrl: string | ISPQueryable, path = "_api/sp.userprofiles.peoplemanager") {
        super(baseUrl, path);

        this.clientPeoplePickerQuery = (new ClientPeoplePickerQuery(baseUrl)).using(AssignFrom(this));
        this.profileLoader = (new ProfileLoader(baseUrl)).using(AssignFrom(this));
    }

    /**
     * The url of the edit profile page for the current user
     */
    public getEditProfileLink(): Promise<string> {
        return Profiles(this, "EditProfileLink")();
    }

    /**
     * A boolean value that indicates whether the current user's "People I'm Following" list is public
     */
    public getIsMyPeopleListPublic(): Promise<boolean> {
        return Profiles(this, "IsMyPeopleListPublic")();
    }

    /**
     * A boolean value that indicates whether the current user is being followed by the specified user
     *
     * @param loginName The account name of the user
     */
    public amIFollowedBy(loginName: string): Promise<boolean> {
        const q = Profiles(this, "amifollowedby(@v)");
        q.query.set("@v", `'${loginName}'`);
        return q();
    }

    /**
     * A boolean value that indicates whether the current user is following the specified user
     *
     * @param loginName The account name of the user
     */
    public amIFollowing(loginName: string): Promise<boolean> {
        const q = Profiles(this, "amifollowing(@v)");
        q.query.set("@v", `'${loginName}'`);
        return q();
    }

    /**
     * Gets tags that the current user is following
     *
     * @param maxCount The maximum number of tags to retrieve (default is 20)
     */
    public getFollowedTags(maxCount = 20): Promise<string[]> {
        return Profiles(this, `getfollowedtags(${maxCount})`)();
    }

    /**
     * Gets the people who are following the specified user
     *
     * @param loginName The account name of the user
     */
    public getFollowersFor(loginName: string): Promise<any[]> {
        const q = Profiles(this, "getfollowersfor(@v)");
        q.query.set("@v", `'${loginName}'`);
        return q();
    }

    /**
     * Gets the people who are following the current user
     *
     */
    public get myFollowers(): ISPCollection {
        return SPCollection(this, "getmyfollowers");
    }

    /**
     * Gets user properties for the current user
     *
     */
    public get myProperties(): ISPInstance {
        return <any>Profiles(this, "getmyproperties");
    }

    /**
     * Gets the people who the specified user is following
     *
     * @param loginName The account name of the user.
     */
    public getPeopleFollowedBy(loginName: string): Promise<any[]> {
        const q = Profiles(this, "getpeoplefollowedby(@v)");
        q.query.set("@v", `'${loginName}'`);
        return q();
    }

    /**
     * Gets user properties for the specified user.
     *
     * @param loginName The account name of the user.
     */
    public getPropertiesFor(loginName: string): Promise<any> {
        const q = Profiles(this, "getpropertiesfor(@v)");
        q.query.set("@v", `'${loginName}'`);
        return q();
    }

    /**
     * Gets the 20 most popular hash tags over the past week, sorted so that the most popular tag appears first
     *
     */
    public get trendingTags(): Promise<IHashTagCollection> {
        const q = Profiles(this, null);
        q.concat(".gettrendingtags");
        return q();
    }

    /**
     * Gets the specified user profile property for the specified user
     *
     * @param loginName The account name of the user
     * @param propertyName The case-sensitive name of the property to get
     */
    public getUserProfilePropertyFor(loginName: string, propertyName: string): Promise<string> {
        const q = Profiles(this, `getuserprofilepropertyfor(accountname=@v, propertyname='${propertyName}')`);
        q.query.set("@v", `'${loginName}'`);
        return q();
    }

    /**
     * Removes the specified user from the user's list of suggested people to follow
     *
     * @param loginName The account name of the user
     */
    public hideSuggestion(loginName: string): Promise<void> {
        const q = Profiles(this, "hidesuggestion(@v)");
        q.query.set("@v", `'${loginName}'`);
        return spPost(q);
    }

    /**
     * A boolean values that indicates whether the first user is following the second user
     *
     * @param follower The account name of the user who might be following the followee
     * @param followee The account name of the user who might be followed by the follower
     */
    public isFollowing(follower: string, followee: string): Promise<boolean> {
        const q = Profiles(this, null);
        q.concat(".isfollowing(possiblefolloweraccountname=@v, possiblefolloweeaccountname=@y)");
        q.query.set("@v", `'${follower}'`);
        q.query.set("@y", `'${followee}'`);
        return q();
    }

    /**
     * Uploads and sets the user profile picture (Users can upload a picture to their own profile only). Not supported for batching.
     *
     * @param profilePicSource Blob data representing the user's picture in BMP, JPEG, or PNG format of up to 4.76MB
     */
    public setMyProfilePic(profilePicSource: Blob): Promise<void> {

        return new Promise<void>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e: any) => {
                const buffer = e.target.result;
                try {
                    await spPost(Profiles(this, "setmyprofilepicture"), { body: buffer });
                    resolve();
                } catch (e) {
                    reject(e);
                }
            };
            reader.readAsArrayBuffer(profilePicSource);
        });
    }

    /**
     * Sets single value User Profile property
     *
     * @param accountName The account name of the user
     * @param propertyName Property name
     * @param propertyValue Property value
     */
    public setSingleValueProfileProperty(accountName: string, propertyName: string, propertyValue: string): Promise<void> {

        return spPost(Profiles(this, "SetSingleValueProfileProperty"), body({
            accountName,
            propertyName,
            propertyValue,
        }));
    }

    /**
     * Sets multi valued User Profile property
     *
     * @param accountName The account name of the user
     * @param propertyName Property name
     * @param propertyValues Property values
     */
    public setMultiValuedProfileProperty(accountName: string, propertyName: string, propertyValues: string[]): Promise<void> {

        return spPost(Profiles(this, "SetMultiValuedProfileProperty"), body({
            accountName,
            propertyName,
            propertyValues,
        }));
    }

    /**
     * Provisions one or more users' personal sites. (My Site administrator on SharePoint Online only)
     *
     * @param emails The email addresses of the users to provision sites for
     */
    public createPersonalSiteEnqueueBulk(...emails: string[]): Promise<void> {
        return this.profileLoader.createPersonalSiteEnqueueBulk(emails);
    }

    /**
     * Gets the user profile of the site owner
     *
     */
    public get ownerUserProfile(): Promise<IUserProfile> {
        return this.profileLoader.ownerUserProfile;
    }

    /**
     * Gets the user profile for the current user
     */
    public get userProfile(): Promise<any> {
        return this.profileLoader.userProfile;
    }

    /**
     * Enqueues creating a personal site for this user, which can be used to share documents, web pages, and other files
     *
     * @param interactiveRequest true if interactively (web) initiated request, or false (default) if non-interactively (client) initiated request
     */
    public createPersonalSite(interactiveRequest = false): Promise<void> {
        return this.profileLoader.createPersonalSite(interactiveRequest);
    }

    /**
     * Sets the privacy settings for this profile
     *
     * @param share true to make all social data public; false to make all social data private
     */
    public shareAllSocialData(share: boolean): Promise<void> {
        return this.profileLoader.shareAllSocialData(share);
    }

    /**
     * Resolves user or group using specified query parameters
     *
     * @param queryParams The query parameters used to perform resolve
     */
    public clientPeoplePickerResolveUser(queryParams: IClientPeoplePickerQueryParameters): Promise<IPeoplePickerEntity> {
        return this.clientPeoplePickerQuery.clientPeoplePickerResolveUser(queryParams);
    }

    /**
     * Searches for users or groups using specified query parameters
     *
     * @param queryParams The query parameters used to perform search
     */
    public clientPeoplePickerSearchUser(queryParams: IClientPeoplePickerQueryParameters): Promise<IPeoplePickerEntity[]> {
        return this.clientPeoplePickerQuery.clientPeoplePickerSearchUser(queryParams);
    }
}
export interface IProfiles extends _Profiles { }
export const Profiles = spInvokableFactory<IProfiles>(_Profiles);

@defaultPath("_api/sp.userprofiles.profileloader.getprofileloader")
class ProfileLoader extends _SPQueryable {

    /**
     * Provisions one or more users' personal sites. (My Site administrator on SharePoint Online only) Doesn't support batching
     *
     * @param emails The email addresses of the users to provision sites for
     */
    public createPersonalSiteEnqueueBulk(emails: string[]): Promise<void> {

        return spPost(ProfileLoaderFactory(this, "createpersonalsiteenqueuebulk"), body({ "emailIDs": emails }));
    }

    /**
     * Gets the user profile of the site owner.
     *
     */
    public get ownerUserProfile(): Promise<IUserProfile> {
        return spPost(this.getParent(<any>ProfileLoaderFactory, "_api/sp.userprofiles.profileloader.getowneruserprofile"));
    }

    /**
     * Gets the user profile of the current user.
     *
     */
    public get userProfile(): Promise<IUserProfile> {
        return spPost(ProfileLoaderFactory(this, "getuserprofile"));
    }

    /**
     * Enqueues creating a personal site for this user, which can be used to share documents, web pages, and other files.
     *
     * @param interactiveRequest true if interactively (web) initiated request, or false (default) if non-interactively (client) initiated request
     */
    public createPersonalSite(interactiveRequest = false): Promise<void> {
        return spPost(ProfileLoaderFactory(this, `getuserprofile/createpersonalsiteenque(${interactiveRequest})`));
    }

    /**
     * Sets the privacy settings for this profile
     *
     * @param share true to make all social data public; false to make all social data private.
     */
    public shareAllSocialData(share: boolean): Promise<void> {
        return spPost(ProfileLoaderFactory(this, `getuserprofile/shareallsocialdata(${share})`));
    }
}

const ProfileLoaderFactory = (baseUrl: string | ISPQueryable, path?: string) => {
    return new ProfileLoader(baseUrl, path);
};

@defaultPath("_api/sp.ui.applicationpages.clientpeoplepickerwebserviceinterface")
class ClientPeoplePickerQuery extends _SPQueryable {

    /**
     * Resolves user or group using specified query parameters
     *
     * @param queryParams The query parameters used to perform resolve
     */
    public async clientPeoplePickerResolveUser(queryParams: IClientPeoplePickerQueryParameters): Promise<IPeoplePickerEntity> {
        const q = ClientPeoplePickerFactory(this, null);
        q.concat(".clientpeoplepickerresolveuser");
        const res = await spPost<string | { ClientPeoplePickerResolveUser: string }>(q, this.getBodyFrom(queryParams));

        return JSON.parse(typeof res === "object" ? res.ClientPeoplePickerResolveUser : res);
    }

    /**
     * Searches for users or groups using specified query parameters
     *
     * @param queryParams The query parameters used to perform search
     */
    public async clientPeoplePickerSearchUser(queryParams: IClientPeoplePickerQueryParameters): Promise<IPeoplePickerEntity[]> {
        const q = ClientPeoplePickerFactory(this, null);
        q.concat(".clientpeoplepickersearchuser");
        const res = await spPost<string | { ClientPeoplePickerSearchUser: string }>(q, this.getBodyFrom(queryParams));

        return JSON.parse(typeof res === "object" ? res.ClientPeoplePickerSearchUser : res);
    }

    /**
     * Creates ClientPeoplePickerQueryParameters request body
     *
     * @param queryParams The query parameters to create request body
     */
    private getBodyFrom(queryParams: IClientPeoplePickerQueryParameters): { body: string } {
        return body({ queryParams });
    }
}

const ClientPeoplePickerFactory = (baseUrl: string | ISPQueryable, path?: string) => {
    return new ClientPeoplePickerQuery(baseUrl, path);
};

/**
 * Client people picker query parameters
 */
export interface IClientPeoplePickerQueryParameters {
    /**
     * Gets or sets a value that specifies whether e-mail addresses can be used to perform search.
     */
    AllowEmailAddresses?: boolean;
    /**
     * Gets or sets a value that specifies whether multiple entities are allowed.
     */
    AllowMultipleEntities?: boolean;
    /**
     * Gets or sets a value that specifies whether only e-mail addresses can be used to perform search.
     */
    AllowOnlyEmailAddresses?: boolean;
    /**
     * Gets or sets a value that specifies whether all URL zones are used to perform search.
     */
    AllUrlZones?: boolean;
    /**
     * Gets or sets a value that specifies claim providers that are used to perform search.
     */
    EnabledClaimProviders?: string;
    /**
     * Gets or sets a value that specifies whether claims are forced (if yes, multiple results for single entity can be returned).
     */
    ForceClaims?: boolean;
    /**
     * Gets or sets a value that specifies limit of results returned.
     */
    MaximumEntitySuggestions: number;
    /**
     * Gets or sets a value that specifies principal sources to perform search.
     */
    PrincipalSource?: PrincipalSource;
    /**
     * Gets or sets a value that specifies principal types to search for.
     */
    PrincipalType?: PrincipalType;
    /**
     * Gets or sets a value that specifies additional query settings.
     */
    QuerySettings?: IPeoplePickerQuerySettings;
    /**
     * Gets or sets a value that specifies the term to search for.
     */
    QueryString: string;
    /**
     * Gets or sets a value that specifies ID of the SharePoint Group that will be used to perform search.
     */
    SharePointGroupID?: number;
    /**
     * Gets or sets a value that specifies URL zones that are used to perform search.
     */
    UrlZone?: UrlZone;
    /**
     * Gets or sets a value that specifies whether search is limited to specific URL zone.
     */
    UrlZoneSpecified?: boolean;
    /**
     * Gets or sets a value that specifies GUID of the Web Application that is used to perform search.
     */
    WebApplicationID?: string;
}

export interface IHashTagCollection {
    Items: IHashTag[];
}

/**
 * People picker query settings
 */
export interface IPeoplePickerQuerySettings {
    ExcludeAllUsersOnTenantClaim?: boolean;
}

/**
 * People picker entity
 */
export interface IPeoplePickerEntity {
    Description: string;
    DisplayText: string;
    EntityData: IPeoplePickerEntityData;
    EntityType: string;
    IsResolved: boolean;
    Key: string;
    MultipleMatches: IPeoplePickerEntityData[];
    ProviderDisplayName: string;
    ProviderName: string;
}

/**
 * People picker entity data
 */
export interface IPeoplePickerEntityData {
    AccountName?: string;
    Department?: string;
    Email?: string;
    IsAltSecIdPresent?: string;
    MobilePhone?: string;
    ObjectId?: string;
    OtherMails?: string;
    PrincipalType?: string;
    SPGroupID?: string;
    SPUserID?: string;
    Title?: string;
}

/**
 * Specifies the originating zone of a request received.
 */
export const enum UrlZone {
    /**
     * Specifies the default zone used for requests unless another zone is specified.
     */
    DefaultZone,
    /**
     * Specifies an intranet zone.
     */
    Intranet,
    /**
     * Specifies an Internet zone.
     */
    Internet,
    /**
     * Specifies a custom zone.
     */
    Custom,
    /**
     * Specifies an extranet zone.
     */
    Extranet,
}

export interface IHashTag {
    /**
     * The hash tag's internal name.
     */
    Name?: string;
    /**
     * The number of times that the hash tag is used.
     */
    UseCount?: number;
}

export interface IFollowedContent {
    FollowedDocumentsUrl: string;
    FollowedSitesUrl: string;
}

export interface IUserProfile {
    /**
     * An object containing the user's FollowedDocumentsUrl and FollowedSitesUrl.
     */
    FollowedContent?: IFollowedContent;
    /**
     * The account name of the user. (SharePoint Online only)
     */
    AccountName?: string;
    /**
     * The display name of the user. (SharePoint Online only)
     */
    DisplayName?: string;
    /**
     * The FirstRun flag of the user. (SharePoint Online only)
     */
    O15FirstRunExperience?: number;
    /**
     * The personal site of the user.
     */
    PersonalSite?: string;
    /**
     * The capabilities of the user's personal site. Represents a bitwise PersonalSiteCapabilities value:
     * None = 0; Profile Value = 1; Social Value = 2; Storage Value = 4; MyTasksDashboard Value = 8; Education Value = 16; Guest Value = 32.
     */
    PersonalSiteCapabilities?: number;
    /**
     * The error thrown when the user's personal site was first created, if any. (SharePoint Online only)
     */
    PersonalSiteFirstCreationError?: string;
    /**
     * The date and time when the user's personal site was first created. (SharePoint Online only)
     */
    PersonalSiteFirstCreationTime?: Date;
    /**
     * The status for the state of the personal site instantiation
     */
    PersonalSiteInstantiationState?: number;
    /**
     * The date and time when the user's personal site was last created. (SharePoint Online only)
     */
    PersonalSiteLastCreationTime?: Date;
    /**
     * The number of attempts made to create the user's personal site. (SharePoint Online only)
     */
    PersonalSiteNumberOfRetries?: number;
    /**
     * Indicates whether the user's picture is imported from Exchange.
     */
    PictureImportEnabled?: boolean;
    /**
     * The public URL of the personal site of the current user. (SharePoint Online only)
     */
    PublicUrl?: string;
    /**
     * The URL used to create the user's personal site.
     */
    UrlToCreatePersonalSite?: string;
}
