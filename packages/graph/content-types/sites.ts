import { addProp } from "@pnp/queryable";
import {
    ContentType as IContentTypeEntity,
} from "@microsoft/microsoft-graph-types";
import { graphGet, graphPost } from "../operations.js";
import { body } from "@pnp/queryable";
import { Site, _Site } from "../sites/types.js";
import { ContentTypes, IContentType, IContentTypeAddResult, IContentTypes, _ContentTypes } from "./types.js";

declare module "./types" {
    interface _ContentTypes {
        add(contentType: IContentTypeEntity): Promise<IContentTypeAddResult>;
        associateWithHubSites(hubSiteUrls: string[], propagateToExistingLists?: boolean): Promise<void>;
    }

    interface IContentType {
        add(contentType: IContentTypeEntity): Promise<IContentTypeAddResult>;
        associateWithHubSites(hubSiteUrls: string[], propagateToExistingLists?: boolean): Promise<void>;
    }
}

/**
     * Create a new  content type as specified in the request body.
     *
     * @param contentType  a JSON representation of a ContentType object.
     */
_ContentTypes.prototype.add = async function (contentType: IContentTypeEntity): Promise<IContentTypeAddResult> {
    const data = await graphPost(this, body(contentType));

    return {
        data,
        contentType: (<any>this).getById(data.id),
    };
};
/**
     * Associate a published content type present in a content type hub with a list of hub sites.
     * NOTE: the site MUST be the content type hub
     * @param hubSiteUrls  an array of hub site urls to associate the content type with.
     * @param propagateToExistingLists (Optional: Default False) If true, content types will be enforced on existing lists in the hub sites;
     *   otherwise, it'll be applied only to newly created lists.
     */
_ContentTypes.prototype.associateWithHubSites = function associateWithHubSites(hubSiteUrls: string[], propagateToExistingLists = false): Promise<void> {
    const postBody = {
        hubSiteUrls,
        propagateToExistingLists,
    };
    return graphPost(Site(this, "associateWithHubSites"), body(postBody));
};

declare module "../sites/types" {
    interface _Site {
        readonly contentTypes: IContentTypes;
        getApplicableContentTypesForList(listId: string): Promise<IContentType[]>;
    }
    interface ISite {
        /**
         * Read the attachment files data for an item
         */
        readonly contentTypes: IContentTypes;
        getApplicableContentTypesForList(listId: string): Promise<IContentType[]>;
    }
}
addProp(_Site, "contentTypes", ContentTypes);
/**
 * Get site contentTypes that can be added to a list.
 */
_Site.prototype.getApplicableContentTypesForList = function getApplicableContentTypesForList(listId: string): Promise<IContentType[]> {
    return graphGet(Site(this, `getApplicableContentTypesForList(listId='${listId}')`));
};

