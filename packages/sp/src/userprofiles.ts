import { SharePointQueryable, SharePointQueryableInstance, SharePointQueryableCollection } from "./sharepointqueryable";
import { HashTagCollection, UserProfile } from "./types";
import { readBlobAsArrayBuffer } from "../utils/files";
import { ODataValue } from "../odata/parsers";

export class UserProfileQuery extends SharePointQueryableInstance {

    private profileLoader: ProfileLoader;

    /**
     * Creates a new instance of the UserProfileQuery class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this user profile query
     */
    constructor(baseUrl: string | SharePointQueryable, path = "_api/sp.userprofiles.peoplemanager") {
        super(baseUrl, path);

        this.profileLoader = new ProfileLoader(baseUrl);
    }

    /**
     * The url of the edit profile page for the current user
     */
    public get editProfileLink(): Promise<string> {
        return this.clone(UserProfileQuery, "EditProfileLink").getAs(ODataValue<string>());
    }

    /**
     * A boolean value that indicates whether the current user's "People I'm Following" list is public
     */
    public get isMyPeopleListPublic(): Promise<boolean> {
        return this.clone(UserProfileQuery, "IsMyPeopleListPublic").getAs(ODataValue<boolean>());
    }

    /**
     * A boolean value that indicates whether the current user is being followed by the specified user
     *
     * @param loginName The account name of the user
     */
    public amIFollowedBy(loginName: string): Promise<boolean> {
        const q = this.clone(UserProfileQuery, "amifollowedby(@v)");
        q.query.add("@v", `'${encodeURIComponent(loginName)}'`);
        return q.get();
    }

    /**
     * A boolean value that indicates whether the current user is following the specified user
     *
     * @param loginName The account name of the user
     */
    public amIFollowing(loginName: string): Promise<boolean> {
        const q = this.clone(UserProfileQuery, "amifollowing(@v)");
        q.query.add("@v", `'${encodeURIComponent(loginName)}'`);
        return q.get();
    }

    /**
     * Gets tags that the current user is following
     *
     * @param maxCount The maximum number of tags to retrieve (default is 20)
     */
    public getFollowedTags(maxCount = 20): Promise<string[]> {
        return this.clone(UserProfileQuery, `getfollowedtags(${maxCount})`).get();
    }

    /**
     * Gets the people who are following the specified user
     *
     * @param loginName The account name of the user
     */
    public getFollowersFor(loginName: string): Promise<any[]> {
        const q = this.clone(UserProfileQuery, "getfollowersfor(@v)");
        q.query.add("@v", `'${encodeURIComponent(loginName)}'`);
        return q.get();
    }

    /**
     * Gets the people who are following the current user
     *
     */
    public get myFollowers(): SharePointQueryableCollection {
        return new SharePointQueryableCollection(this, "getmyfollowers");
    }

    /**
     * Gets user properties for the current user
     *
     */
    public get myProperties(): SharePointQueryableInstance {
        return new UserProfileQuery(this, "getmyproperties");
    }

    /**
     * Gets the people who the specified user is following
     *
     * @param loginName The account name of the user.
     */
    public getPeopleFollowedBy(loginName: string): Promise<any[]> {
        const q = this.clone(UserProfileQuery, "getpeoplefollowedby(@v)");
        q.query.add("@v", `'${encodeURIComponent(loginName)}'`);
        return q.get();
    }

    /**
     * Gets user properties for the specified user.
     *
     * @param loginName The account name of the user.
     */
    public getPropertiesFor(loginName: string): Promise<any[]> {
        const q = this.clone(UserProfileQuery, "getpropertiesfor(@v)");
        q.query.add("@v", `'${encodeURIComponent(loginName)}'`);
        return q.get();
    }

    /**
     * Gets the 20 most popular hash tags over the past week, sorted so that the most popular tag appears first
     *
     */
    public get trendingTags(): Promise<HashTagCollection> {
        const q = this.clone(UserProfileQuery, null);
        q.concat(".gettrendingtags");
        return q.get();
    }

    /**
     * Gets the specified user profile property for the specified user
     *
     * @param loginName The account name of the user
     * @param propertyName The case-sensitive name of the property to get
     */
    public getUserProfilePropertyFor(loginName: string, propertyName: string): Promise<string> {
        const q = this.clone(UserProfileQuery, `getuserprofilepropertyfor(accountname=@v, propertyname='${propertyName}')`);
        q.query.add("@v", `'${encodeURIComponent(loginName)}'`);
        return q.get();
    }

    /**
     * Removes the specified user from the user's list of suggested people to follow
     *
     * @param loginName The account name of the user
     */
    public hideSuggestion(loginName: string): Promise<void> {
        const q = this.clone(UserProfileQuery, "hidesuggestion(@v)");
        q.query.add("@v", `'${encodeURIComponent(loginName)}'`);
        return q.postCore();
    }

    /**
     * A boolean values that indicates whether the first user is following the second user
     *
     * @param follower The account name of the user who might be following the followee
     * @param followee The account name of the user who might be followed by the follower
     */
    public isFollowing(follower: string, followee: string): Promise<boolean> {
        const q = this.clone(UserProfileQuery, null);
        q.concat(`.isfollowing(possiblefolloweraccountname=@v, possiblefolloweeaccountname=@y)`);
        q.query.add("@v", `'${encodeURIComponent(follower)}'`);
        q.query.add("@y", `'${encodeURIComponent(followee)}'`);
        return q.get();
    }

    /**
     * Uploads and sets the user profile picture (Users can upload a picture to their own profile only). Not supported for batching.
     *
     * @param profilePicSource Blob data representing the user's picture in BMP, JPEG, or PNG format of up to 4.76MB
     */
    public setMyProfilePic(profilePicSource: Blob): Promise<void> {

        return new Promise<void>((resolve, reject) => {
            readBlobAsArrayBuffer(profilePicSource).then((buffer) => {
                const request = new UserProfileQuery(this, "setmyprofilepicture");
                request.postCore({
                    body: String.fromCharCode.apply(null, new Uint16Array(buffer)),
                }).then(_ => resolve());
            }).catch(e => reject(e));
        });
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
    public get ownerUserProfile(): Promise<UserProfile> {
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
}

class ProfileLoader extends SharePointQueryable {

      /**
     * Creates a new instance of the ProfileLoader class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this profile loader
     */
    constructor(baseUrl: string | SharePointQueryable, path = "_api/sp.userprofiles.profileloader.getprofileloader") {
        super(baseUrl, path);
    }

    /**
     * Provisions one or more users' personal sites. (My Site administrator on SharePoint Online only) Doesn't support batching
     *
     * @param emails The email addresses of the users to provision sites for
     */
    public createPersonalSiteEnqueueBulk(emails: string[]): Promise<void> {

        return this.clone(ProfileLoader, "createpersonalsiteenqueuebulk", false).postCore({
            body: JSON.stringify({ "emailIDs": emails }),
        });
    }

    /**
     * Gets the user profile of the site owner.
     *
     */
    public get ownerUserProfile(): Promise<UserProfile> {
        let q = this.getParent(ProfileLoader, this.parentUrl, "_api/sp.userprofiles.profileloader.getowneruserprofile");

        if (this.hasBatch) {
            q = q.inBatch(this.batch);
        }

        return q.postAsCore<UserProfile>();
    }

    /**
     * Gets the user profile of the current user.
     *
     */
    public get userProfile(): Promise<UserProfile> {
        return this.clone(ProfileLoader, "getuserprofile").postAsCore<UserProfile>();
    }

    /**
     * Enqueues creating a personal site for this user, which can be used to share documents, web pages, and other files.
     *
     * @param interactiveRequest true if interactively (web) initiated request, or false (default) if non-interactively (client) initiated request
     */
    public createPersonalSite(interactiveRequest = false): Promise<void> {
        return this.clone(ProfileLoader, `getuserprofile/createpersonalsiteenque(${interactiveRequest})`).postCore();
    }

    /**
     * Sets the privacy settings for this profile
     *
     * @param share true to make all social data public; false to make all social data private.
     */
    public shareAllSocialData(share: boolean): Promise<void> {
        return this.clone(ProfileLoader, `getuserprofile/shareallsocialdata(${share})`).postCore();
    }
}
