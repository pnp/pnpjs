import {
    _SharePointQueryableInstance,
    ISharePointQueryable,
    spInvokableFactory,
    _SharePointQueryable,
} from "../sharepointqueryable";

import { defaultPath } from "../decorators";
import { hOP, IFetchOptions } from "@pnp/common";
import { metadata } from "../utils/metadata";
import { body } from "@pnp/odata";
import { spPost } from "../operations";

/**
 * Exposes social following methods
 */
@defaultPath("_api/social.following")
export class _Social extends _SharePointQueryableInstance implements ISocial {

    public get my(): IMySocial {
        return MySocial(this);
    }

    /**
     * Gets a URI to a site that lists the current user's followed sites.
     */
    public getFollowedSitesUri(): Promise<string> {
        return this.clone(SocialCloneFactory, "FollowedSitesUri").get().then(r => {
            return r.FollowedSitesUri || r;
        });
    }

    /**
     * Gets a URI to a site that lists the current user's followed documents.
     */
    public getFollowedDocumentsUri(): Promise<string> {
        return this.clone(SocialCloneFactory, "FollowedDocumentsUri").get().then(r => {
            return r.FollowedDocumentsUri || r;
        });
    }

    /**
     * Makes the current user start following a user, document, site, or tag
     *
     * @param actorInfo The actor to start following
     */
    public follow(actorInfo: ISocialActorInfo): Promise<SocialFollowResult> {
        return spPost(this.clone(SocialCloneFactory, "follow"), this.createSocialActorInfoRequestBody(actorInfo));
    }

    /**
     * Indicates whether the current user is following a specified user, document, site, or tag
     *
     * @param actorInfo The actor to find the following status for
     */
    public isFollowed(actorInfo: ISocialActorInfo): Promise<boolean> {
        return spPost(this.clone(SocialCloneFactory, "isfollowed"), this.createSocialActorInfoRequestBody(actorInfo));
    }

    /**
     * Makes the current user stop following a user, document, site, or tag
     *
     * @param actorInfo The actor to stop following
     */
    public stopFollowing(actorInfo: ISocialActorInfo): Promise<void> {
        return spPost(this.clone(SocialCloneFactory, "stopfollowing"), this.createSocialActorInfoRequestBody(actorInfo));
    }

    /**
     * Creates SocialActorInfo request body
     *
     * @param actorInfo The actor to create request body
     */
    private createSocialActorInfoRequestBody(actorInfo: ISocialActorInfo): IFetchOptions {
        return body({
            "actor":
                Object.assign(metadata("SP.Social.SocialActorInfo"), {
                    Id: null,
                }, actorInfo),
        });
    }
}

export interface ISocial {
    readonly my: IMySocial;
    getFollowedSitesUri(): Promise<string>;
    getFollowedDocumentsUri(): Promise<string>;
    follow(actorInfo: ISocialActorInfo): Promise<SocialFollowResult>;
    isFollowed(actorInfo: ISocialActorInfo): Promise<boolean>;
    stopFollowing(actorInfo: ISocialActorInfo): Promise<void>;
}
export const Social = (baseUrl: string | ISharePointQueryable): ISocial => new _Social(baseUrl);

const SocialCloneFactory = (baseUrl: string | ISharePointQueryable): ISocial & ISharePointQueryable => <any>Social(baseUrl);

@defaultPath("my")
export class _MySocial extends _SharePointQueryableInstance implements IMySocial {

    /**
     * Gets users, documents, sites, and tags that the current user is following.
     * 
     * @param types Bitwise set of SocialActorTypes to retrieve
     */
    public followed(types: SocialActorTypes): Promise<ISocialActor[]> {
        return this.clone(MySocialCloneFactory, `followed(types=${types})`)().then(r => {
            return hOP(r, "Followed") ? r.Followed.results : r;
        });
    }

    /**
     * Gets the count of users, documents, sites, and tags that the current user is following.
     * 
     * @param types Bitwise set of SocialActorTypes to retrieve
     */
    public followedCount(types: SocialActorTypes): Promise<number> {
        return this.clone(MySocialCloneFactory, `followedcount(types=${types})`)().then(r => {
            return r.FollowedCount || r;
        });
    }

    /**
     * Gets the users who are following the current user.
     */
    public followers(): Promise<ISocialActor[]> {
        return this.clone(MySocialCloneFactory, "followers")().then(r => {
            return hOP(r, "Followers") ? r.Followers.results : r;
        });
    }

    /**
     * Gets users who the current user might want to follow.
     */
    public suggestions(): Promise<ISocialActor[]> {
        return this.clone(MySocialCloneFactory, "suggestions")().then(r => {
            return hOP(r, "Suggestions") ? r.Suggestions.results : r;
        });
    }
}
/**
 * Defines the public methods exposed by the my endpoint
 */
export interface IMySocial {
    /**
     * Gets this user's data
     */
    get(): Promise<IMySocialData>;
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

export const MySocial = spInvokableFactory<IMySocial>(_MySocial);

const MySocialCloneFactory = (baseUrl: string | ISharePointQueryable, path?: string): IMySocial & ISharePointQueryable => <any>MySocial(baseUrl, path);

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
/* tslint:disable:no-bitwise */
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
/* tslint:enable */

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
 * Defines the properties retrurned from the my endpoint
 */
export interface IMySocialData {
    SocialActor: ISocialActor;
    MyFollowedDocumentsUri: string;
    MyFollowedSitesUri: string;
}
