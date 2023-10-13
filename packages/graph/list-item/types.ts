import { ListItem as IListItemEntity, ListItemVersion as IListItemVersion, DocumentSetVersion as IDocumentSetVersionEntity } from "@microsoft/microsoft-graph-types";
import { _GraphCollection, graphInvokableFactory, _GraphInstance, IGraphCollection, GraphCollection, graphPost } from "../graphqueryable.js";
import { defaultPath, deleteable, IDeleteable, updateable, IUpdateable, getById, IGetById } from "../decorators.js";
import { body } from "@pnp/queryable";

/**
 * Represents a list item entity
 */
@deleteable()
@updateable()
export class _ListItem extends _GraphInstance<IListItemEntity> {
    /**
     * Method for retrieving the versions of a list item.
     * @returns IListItemVersion
     */
    public get versions(): IGraphCollection<IListItemVersion> {
        return <any>GraphCollection(this, "versions");
    }
}
export interface IListItem extends _ListItem, IDeleteable, IUpdateable {}
export const ListItem = graphInvokableFactory<IListItem>(_ListItem);

/**
 * Describes a collection of list item objects
 *
 */
@defaultPath("items")
@getById(ListItem)
export class _ListItems extends _GraphCollection<IListItemEntity[]>{
    /**
     * Create a new list item as specified in the request body.
     *
     * @param listItem  a JSON representation of a List object.
     */
    public async add(listItem: IListItemEntity): Promise<IListItemAddResult> {
        const data = await graphPost(this, body(listItem));

        return {
            data,
            list: (<any>this).getById(data.id),
        };
    }
}

export interface IListItems extends _ListItems, IGetById<IListItem> { }
export const ListItems = graphInvokableFactory<IListItems>(_ListItems);

/**
 * Represents a document set version
 */
@deleteable()
export class _DocumentSetVersion extends _GraphInstance<IDocumentSetVersionEntity> {
    /**
     * Restore a document set version
     *
     */
    public async restore(): Promise<void> {
        return graphPost(DocumentSetVersion(this, "restore"));
    }
}
export interface IDocumentSetVersion extends _DocumentSetVersion, IDeleteable { }
export const DocumentSetVersion = graphInvokableFactory<IDocumentSetVersion>(_DocumentSetVersion);

/**
 * Describes a collection of document set versions
 *
 */
@defaultPath("documentSetVersions")
@getById(DocumentSetVersion)
export class _DocumentSetVersions extends _GraphCollection<IDocumentSetVersionEntity[]>{
    /**
    * Create a new document set version as specified in the request body.
    *
    * @param comment a comment about the captured version
    * @param shouldCaptureMinorVersion If true, minor versions of items are also captured; otherwise, only major versions will be captured.
    *
    */
    public async add(comment: string, shouldCaptureMinorVersion = false): Promise<IDocumentSetVersionAddResult> {

        const postBody = {
            comment: comment,
            shouldCaptureMinorVersion: shouldCaptureMinorVersion,
        };
        const data = await graphPost(this, body(postBody));

        return {
            data,
            item: (<any>this).getById(data.id),
        };
    }
}

export interface IDocumentSetVersions extends _DocumentSetVersions, IGetById<IDocumentSetVersion> {}
export const DocumentSetVersions = graphInvokableFactory<IDocumentSetVersions>(_DocumentSetVersions);

/**
 * IListAddResult
 */
export interface IDocumentSetVersionAddResult {
    item: IDocumentSetVersion;
    data: IDocumentSetVersionEntity;
}

/**
 * IListAddResult
 */
export interface IListItemAddResult {
    list: IListItem;
    data: IListItemEntity;
}
