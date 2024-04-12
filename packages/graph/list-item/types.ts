import { ListItem as IListItemEntity, ListItemVersion as IListItemVersion, DocumentSetVersion as IDocumentSetVersionEntity } from "@microsoft/microsoft-graph-types";
import { _GraphCollection, graphInvokableFactory, _GraphInstance, IGraphCollection, GraphCollection, graphPost } from "../graphqueryable.js";
import { defaultPath, deleteable, IDeleteable, updateable, IUpdateable, getById, IGetById, addable, IAddable } from "../decorators.js";

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
@addable()
export class _ListItems extends _GraphCollection<IListItemEntity[]>{}

export interface IListItems extends _ListItems, IGetById<IListItem>, IAddable<IListItemEntity> { }
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
@addable()
export class _DocumentSetVersions extends _GraphCollection<IDocumentSetVersionEntity[]>{}
export interface IDocumentSetVersions extends _DocumentSetVersions, IGetById<IDocumentSetVersion>, IAddable<IDocumentSetVersionEntity>  {}
export const DocumentSetVersions = graphInvokableFactory<IDocumentSetVersions>(_DocumentSetVersions);