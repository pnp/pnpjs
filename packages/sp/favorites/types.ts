import { defaultPath } from "../decorators.js";
import { _SPInstance, spInvokableFactory, _SPCollection, SPInit } from "../spqueryable.js";
import { hOP } from "@pnp/core";
import { spPost } from "../operations.js";
import { body } from "@pnp/queryable";
import { SharepointIds, ResourceVisualization } from "@microsoft/microsoft-graph-types";

@defaultPath("_api/v2.1/favorites")
export class _Favorites extends _SPInstance implements IFavorites {
    public get followedSites(): IFollowedSites {
        return FollowedSites(this);
    }

    public get followedListItems(): IFollowedListItems {
        return FollowedListItems(this);
    }
}

export const Favorites = (baseUrl: SPInit): IFavorites => new _Favorites(baseUrl);

@defaultPath("followedSites")
export class _FollowedSites extends _SPCollection<IFollowedSiteInfo[]> {
    /**
    * Adds a site to user's followed sites
    *
    * @param tenantUrl Name of a tenant (e.g. yourtenant.sharepoint.com).
    * @param siteId Id of a site collection.
    * @param webId Id of a site.
    * @param webUrl Absolute URL of a site.
    */
    public async add(tenantUrl: string, siteId: string, webId: string, webUrl: string): Promise<IFollowedSiteInfo[]> {
        const data = await spPost(FollowedListItems(this, "oneDrive.add"), body(
            {
                value: [
                    {
                        id: [tenantUrl,webId,siteId].join(","),
                        webUrl: webUrl,
                    },
                ],
            }
        ));
        return hOP(data, "value") ? data.value : data;
    }

    /**
    * Removes a site from user's followed sites
    *
    * @param tenantUrl Name of a tenant (e.g. yourtenant.sharepoint.com).
    * @param siteId Id of a site collection.
    * @param webId Id of a site.
    * @param webUrl Absolute URL of a site.
    */
    public async remove(tenantUrl: string, siteId: string, webId: string, webUrl: string): Promise<void> {

        await spPost(FollowedListItems(this, "oneDrive.remove"), body(
            {
                value: [
                    {
                        id: [tenantUrl,webId,siteId].join(","),
                        webUrl: webUrl,
                    },
                ],
            }
        ));
    }
}

export interface IFollowedSites extends _FollowedSites { }
export const FollowedSites = spInvokableFactory<IFollowedSites>(_FollowedSites);

@defaultPath("followedListItems")
export class _FollowedListItems extends _SPCollection<IFollowedListItemInfo[]> {
    /**
    * Adds an item to user's _saved for later_ list
    *
    * @param siteId Id of a site collection of an item to add
    * @param webId Id of a site of an item to add
    * @param listId Id of a list of an item to add
    * @param listItemUniqueId Unique id of an item to add
    */
    public async add(siteId: string, webId: string, listId: string, listItemUniqueId: string): Promise<IFollowedListItemInfo> {
        const data = await spPost(FollowedListItems(this, "oneDrive.add"), body(
            {
                value: [
                    <SharepointIds>{
                        siteId: siteId,
                        webId: webId,
                        listId: listId,
                        listItemUniqueId: listItemUniqueId,
                    },
                ],
            }
        ));
        return hOP(data, "value") ? data.value : data;
    }

    /**
    * Removes an item from user's _saved for later_ list
    *
    * @param siteId Id of a site collection of an item to remove
    * @param webId Id of a site of an item to remove
    * @param listId Id of a list of an item to remove
    * @param listItemUniqueId Unique id of an item to remove
    */
    public async remove(siteId: string, webId: string, listId: string, listItemUniqueId: string): Promise<void> {
        await spPost(FollowedListItems(this, "oneDrive.remove"), body(
            {
                value: [
                    <SharepointIds>{
                        siteId: siteId,
                        webId: webId,
                        listId: listId,
                        listItemUniqueId: listItemUniqueId,
                    },
                ],
            }
        ));
    }
}

export interface IFollowedListItems extends _FollowedListItems { }
export const FollowedListItems = spInvokableFactory<IFollowedListItems>(_FollowedListItems);

export interface IFavorites {
    readonly followedSites: IFollowedSites;
    readonly followedListItems: IFollowedListItems;
}

export interface IFollowedSiteInfo {
    id: string;
    webUrl: string;
    title: string;
    sharepointIds: SharepointIds;
    siteCollection: {
        hostName: string;
    };
    template: any;
    exchangeIds: IFollowedExchangeId;
    resourceVisualization: {
        color: string;
    };
}

export interface IFollowedListItemInfo {
    description: string;
    id: string;
    lastModifiedDateTime: string;
    name: string;
    size: number;
    webUrl: string;
    serverRedirectedUrl: string;
    contentClass: string;
    lastModifiedBy: {
        user: IFavoritesUser;
    };
    sharepointIds: SharepointIds;
    contentType: {
        id: string;
    };
    resourceVisualization: IFavoritesResourceVisualization;
    exchangeIds: IFollowedExchangeId;
    followed: {
        followedDateTime: string;
    };
    file: {
        fileExtension: string;
    };
    news: {
        publishedDateTime: string;
        newsType: string;
        author: IFavoritesUser;
    };
}

export interface IFavoritesResourceVisualization extends ResourceVisualization {
    color: string;
}

export interface IFollowedExchangeId {
    id: string;
    documentId: string;
}

export interface IFavoritesUser {
    displayName: string;
    userPrincipalName: string;
}
