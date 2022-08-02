import {
    _SPInstance,
    ISPQueryable,
    SPInit,
} from "../spqueryable.js";
import { defaultPath } from "../decorators.js";
import { hOP } from "@pnp/core";
import { body } from "@pnp/queryable";
import { spPost } from "../operations.js";

@defaultPath("_api/social.following")
export class _Social extends _SPInstance implements ISocial {

    public get my(): IMySocial {
        return MySocial(this);
    }

    public async getFollowedSitesUri(): Promise<string> {
        const r = await SocialCloneFactory(this, "FollowedSitesUri")();
        return r.FollowedSitesUri || r;
    }

    public async getFollowedDocumentsUri(): Promise<string> {
        const r = await SocialCloneFactory(this, "FollowedDocumentsUri")();
        return r.FollowedDocumentsUri || r;
    }

    public async follow(actorInfo: ISocialActorInfo): Promise<SocialFollowResult> {
        return spPost(SocialCloneFactory(this, "follow"), this.createSocialActorInfoRequestBody(actorInfo));
    }

    public async isFollowed(actorInfo: ISocialActorInfo): Promise<boolean> {
        return spPost(SocialCloneFactory(this, "isfollowed"), this.createSocialActorInfoRequestBody(actorInfo));
    }

    public async stopFollowing(actorInfo: ISocialActorInfo): Promise<void> {
        return spPost(SocialCloneFactory(this, "stopfollowing"), this.createSocialActorInfoRequestBody(actorInfo));
    }

    private createSocialActorInfoRequestBody(actorInfo: ISocialActorInfo) {
        return body({
            "actor": {
                Id: null,
                ...actorInfo,
            },
        });
    }
}

/**
 * Get a new Social instance for the particular Url
 */
export const Social = (baseUrl: SPInit): ISocial => new _Social(baseUrl);
const SocialCloneFactory = (baseUrl: SPInit, paths?: string): ISocial & ISPQueryable => new _Social(baseUrl, paths);

/**
 * Current user's Social instance
 */
@defaultPath("my")
export class _MySocial extends _SPInstance {


    public async followed(types: SocialActorTypes): Promise<ISocialActor[]> {
        const r = await MySocialCloneFactory(this, `followed(types=${types})`)();
        return hOP(r, "Followed") ? r.Followed.results : r;
    }


    public async followedCount(types: SocialActorTypes): Promise<number> {
        const r = await MySocialCloneFactory(this, `followedcount(types=${types})`)();
        return r.FollowedCount || r;
    }


    public async followers(): Promise<ISocialActor[]> {
        const r = await MySocialCloneFactory(this, "followers")();
        return hOP(r, "Followers") ? r.Followers.results : r;
    }


    public async suggestions(): Promise<ISocialActor[]> {
        const r = await MySocialCloneFactory(this, "suggestions")();
        return hOP(r, "Suggestions") ? r.Suggestions.results : r;
    }
}

/**
 * Invokable factory for IMySocial instances
 */
export const MySocial = (baseUrl: string | ISPQueryable, path?: string): IMySocial => new _MySocial(baseUrl, path);
const MySocialCloneFactory = (baseUrl: string | ISPQueryable, path?: string): IMySocial & ISPQueryable => new _MySocial(baseUrl, path);

/**
 * Describes the public methods for the Social interface
 */
export interface ISocial {
    /**
   * Access to the curren't user's social data
   */
    readonly my: IMySocial;
    /**
   * Get a list of followed sites for the current user.
   */
    getFollowedSitesUri(): Promise<string>;
    /**
   * Get a list of followed documents for the current user.
   */
    getFollowedDocumentsUri(): Promise<string>;
    /**
   * Follow an actor for the current user.
   *
   * @param actorInfo Provide the actor to follow.
   */
    follow(actorInfo: ISocialActorInfo): Promise<SocialFollowResult>;
    /**
   * Check if the current user is following the actor.
   *
   * @param actorInfo Provide the actor to check.
   */
    isFollowed(actorInfo: ISocialActorInfo): Promise<boolean>;
    /**
   * Stop following an actor for the current user.
   *
   * @param actorInfo Provide the actor to stop following.
   */
    stopFollowing(actorInfo: ISocialActorInfo): Promise<void>;
}

/**
 * Defines the public methods exposed by the my endpoint
 */
export interface IMySocial {

    /**
     * Allow access to the v2 invokable
     */
    (this: IMySocial): Promise<IMySocialData>;

    /**
     * Gets users, documents, sites, and tags that the current user is following.
     *
     * @param types Bitwise set of SocialActorTypes to retrieve
     */
    followed(types: SocialActorTypes): Promise<ISocialActor[]>;
    /**
     * Gets the count of users, documents, sites, and tags that the current user is following.
     *
     * @param types Bitwise set of SocialActorTypes to retrieve
     */
    followedCount(types: SocialActorTypes): Promise<number>;
    /**
     * Gets the users who are following the current user.
     */
    followers(): Promise<ISocialActor[]>;
    /**
     * Gets users who the current user might want to follow.
     */
    suggestions(): Promise<ISocialActor[]>;
}

/**
 * Social actor info
 *
 */
export interface ISocialActorInfo {
    AccountName?: string;
    ActorType: SocialActorType;
    ContentUri?: string;
    Id?: string;
    TagGuid?: string;
}

/**
 * Social actor type
 *
 */
export const enum SocialActorType {
    User,
    Document,
    Site,
    Tag,
}

/**
 * Social actor type
 *
 */
/* eslint-disable no-bitwise */
export const enum SocialActorTypes {
    None = 0,
    User = 1 << SocialActorType.User,
    Document = 1 << SocialActorType.Document,
    Site = 1 << SocialActorType.Site,
    Tag = 1 << SocialActorType.Tag,
    /**
   * The set excludes documents and sites that do not have feeds.
   */
    ExcludeContentWithoutFeeds = 268435456,
    /**
   * The set includes group sites
   */
    IncludeGroupsSites = 536870912,
    /**
   * The set includes only items created within the last 24 hours
   */
    WithinLast24Hours = 1073741824,
}
/* eslint-enable no-bitwise */

/**
 * Result from following
 *
 */
export const enum SocialFollowResult {
    Ok = 0,
    AlreadyFollowing = 1,
    LimitReached = 2,
    InternalError = 3,
}

/**
 * Specifies an exception or status code.
 */
export const enum SocialStatusCode {
    /**
   * The operation completed successfully
   */
    OK,
    /**
   * The request is invalid.
   */
    InvalidRequest,
    /**
   *  The current user is not authorized to perform the operation.
   */
    AccessDenied,
    /**
   * The target of the operation was not found.
   */
    ItemNotFound,
    /**
   * The operation is invalid for the target's current state.
   */
    InvalidOperation,
    /**
   * The operation completed without modifying the target.
   */
    ItemNotModified,
    /**
   * The operation failed because an internal error occurred.
   */
    InternalError,
    /**
   * The operation failed because the server could not access the distributed cache.
   */
    CacheReadError,
    /**
   * The operation succeeded but the server could not update the distributed cache.
   */
    CacheUpdateError,
    /**
   * No personal site exists for the current user, and no further information is available.
   */
    PersonalSiteNotFound,
    /**
   * No personal site exists for the current user, and a previous attempt to create one failed.
   */
    FailedToCreatePersonalSite,
    /**
   * No personal site exists for the current user, and a previous attempt to create one was not authorized.
   */
    NotAuthorizedToCreatePersonalSite,
    /**
   * No personal site exists for the current user, and no attempt should be made to create one.
   */
    CannotCreatePersonalSite,
    /**
   * The operation was rejected because an internal limit had been reached.
   */
    LimitReached,
    /**
   * The operation failed because an error occurred during the processing of the specified attachment.
   */
    AttachmentError,
    /**
   * The operation succeeded with recoverable errors; the returned data is incomplete.
   */
    PartialData,
    /**
   * A required SharePoint feature is not enabled.
   */
    FeatureDisabled,
    /**
   * The site's storage quota has been exceeded.
   */
    StorageQuotaExceeded,
    /**
   * The operation failed because the server could not access the database.
   */
    DatabaseError,
}

export interface ISocialActor {
    /**
   * Gets the actor type.
   */
    ActorType: SocialActorType;
    /**
   * Gets the actor's unique identifier.
   */
    Id: string;
    /**
   * Gets the actor's canonical URI.
   */
    Uri: string;
    /**
   * Gets the actor's display name.
   */
    Name: string;
    /**
   * Returns true if the current user is following the actor, false otherwise.
   */
    IsFollowed: boolean;
    /**
   * Gets a code that indicates recoverable errors that occurred during actor retrieval
   */
    Status: SocialStatusCode;
    /**
   * Returns true if the Actor can potentially be followed, false otherwise.
   */
    CanFollow: boolean;
    /**
   * Gets the actor's image URI. Only valid when ActorType is User, Document, or Site
   */
    ImageUri: string;
    /**
   * Gets the actor's account name. Only valid when ActorType is User
   */
    AccountName: string;
    /**
   * Gets the actor's email address. Only valid when ActorType is User
   */
    EmailAddress: string;
    /**
   * Gets the actor's title. Only valid when ActorType is User
   */
    Title: string;
    /**
   * Gets the text of the actor's most recent post. Only valid when ActorType is User
   */
    StatusText: string;
    /**
   * Gets the URI of the actor's personal site. Only valid when ActorType is User
   */
    PersonalSiteUri: string;
    /**
   * Gets the URI of the actor's followed content folder. Only valid when this represents the current user
   */
    FollowedContentUri: string;
    /**
   * Gets the actor's content URI. Only valid when ActorType is Document, or Site
   */
    ContentUri: string;
    /**
   * Gets the actor's library URI. Only valid when ActorType is Document
   */
    LibraryUri: string;
    /**
   * Gets the actor's tag GUID. Only valid when ActorType is Tag
   */
    TagGuid: string;
}

/**
 * Defines the properties returned from the my endpoint
 */
export interface IMySocialData {
    SocialActor: ISocialActor;
    MyFollowedDocumentsUri: string;
    MyFollowedSitesUri: string;
}
