import {
    ContentType as IContentTypeEntity,
    ItemReference as IItemReference,
} from "@microsoft/microsoft-graph-types";
import { _GraphQueryableCollection, graphInvokableFactory, _GraphQueryableInstance } from "../graphqueryable.js";
import { defaultPath, deleteable, IDeleteable, updateable, IUpdateable, getById, IGetById } from "../decorators.js";
import { graphGet, graphPost } from "../operations.js";
import { body } from "@pnp/queryable";
import { JSONHeaderParse } from "@pnp/queryable";

/**
 * Represents a content type entity
 */
@deleteable()
@updateable()
export class _ContentType extends _GraphQueryableInstance<IContentTypeEntity> {

    /**
      * Check the publishing status of a contentType in a content type hub site.
      */
    public isPublished(): Promise<boolean> {
        return graphGet(ContentType(this, "isPublished"));
    }

    /**
     * Publishes a contentType present in the content type hub site.
     */
    public publish(): Promise<void> {
        return graphPost(ContentType(this, "publish"));
    }

    /**
     * Unpublish a contentType from a content type hub site.
     */
    public unpublish(): Promise<void> {
        return graphPost(ContentType(this, "unpublish"));
    }

    /**
     * Associate a published content type present in a content type hub with a list of hub sites.
     *
     * @param hubSiteUrls List of canonical URLs to the hub sites where the content type needs to be enforced.
     * @param propagateToExistingLists (optional) If true, content types will be enforced on existing lists in the hub sites;
     * otherwise, it'll be applied only to newly created lists.
     */
    public associateWithHubSites(hubSiteUrls: string[], propagateToExistingLists?: boolean): Promise<void> {
        const postBody = {
            hubSiteUrls: hubSiteUrls,
            propagateToExistingLists: propagateToExistingLists || false,
        };
        return graphPost(ContentType(this, "associateWithHubSites"), body(postBody));
    }

    /**
     * Copy a file to a default content location in a content type. The file can then be added as a default file or template via a POST operation.
     *
     * @param sourceFile Metadata about the source file that needs to be copied to the default content location. Required.
     * @param destinationFileName Destination filename.
     */
    public copyToDefaultContentLocation(sourceFile: IItemReference, destinationFileName: string): Promise<void> {
        const postBody = {
            sourceFile,
            destinationFileName,
        };
        return graphPost(ContentType(this, "copyToDefaultContentLocation"), body(postBody));
    }
}
export interface IContentType extends _ContentType, IDeleteable, IUpdateable { }
export const ContentType = graphInvokableFactory<IContentType>(_ContentType);

/**
 * Describes a collection of content type objects
 *
 */
@defaultPath("contenttypes")
@getById(ContentType)
export class _ContentTypes extends _GraphQueryableCollection<IContentTypeEntity[]>{
    /**
     * Add or sync a copy of a published content type from the content type hub to a target site or a list.
     *
     * @param contentTypeId The ID of the content type in the content type hub that will be added to a target site or a list.
     */
    public async addCopyFromContentTypeHub(contentTypeId: string): Promise<IContentTypeAddResult> {
        const creator = ContentType(this, "addCopyFromContentTypeHub").using(JSONHeaderParse());
        const data = await graphPost(creator, body({ contentTypeId }));
        const pendingLocation = data.headers.location || null;
        return {
            data: data.data,
            contentType: (<any>this).getById(data.id),
            pendingLocation,
        };
    }

    /**
     * Get a list of compatible content types from the content type hub that can be added to a target site or a list.
     *
     */
    public async getCompatibleHubContentTypes(): Promise<IContentTypeEntity[]> {
        return graphGet(ContentTypes(this, "getCompatibleHubContentTypes"));
    }
}
export interface IContentTypes extends _ContentTypes, IGetById<IContentType> { }
export const ContentTypes = graphInvokableFactory<IContentTypes>(_ContentTypes);

/**
 * IContentTypeAddResult
 */
export interface IContentTypeAddResult {
    contentType: IContentType;
    data: IContentTypeEntity;
    pendingLocation?: string;
}
