import { addProp } from "@pnp/queryable";
import { graphPost } from "../operations.js";
import { _List } from "../lists/types.js";
import { ContentTypes, IContentType, IContentTypeAddResult, IContentTypes, _ContentTypes } from "./types.js";
import { body } from "@pnp/queryable";

declare module "../lists/types" {
    interface _List {
        readonly contentTypes: IContentTypes;
    }
    interface IList {
        /**
         * Read the attachment files data for an item
         */
        readonly contentTypes: IContentTypes;
    }
}
addProp(_List, "contentTypes", ContentTypes);

declare module "./types" {
    interface _ContentTypes {
        addCopy(contentType: IContentType): Promise<IContentTypeAddResult>;
    }
    interface IContentTypes {
        addCopy(contentType: IContentType): Promise<IContentTypeAddResult>;
    }
}

// TODO: Replace hard coded URL for graph endpoint
/**
 * Add a copy of a content type from a site to a list.
 *
 * @param contentType The site content type that will be copied to the list. Required.
 */
_ContentTypes.prototype.addCopy = async function (contentType: IContentType): Promise<IContentTypeAddResult> {
    const query = ContentTypes(this, "addCopy");
    const postBody = { contentType: `https://graph.microsoft.com/v1.0/${contentType.toUrl()}`};
    const data = await graphPost(query, body(postBody));

    return {
        data,
        contentType: (<any>this).getById(data.id),
    };
};
