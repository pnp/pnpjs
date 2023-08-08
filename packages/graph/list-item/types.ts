import { ListItem as IListItemEntity, ListItemVersion as IListItemVersion } from "@microsoft/microsoft-graph-types";
import { _GraphQueryableCollection, graphInvokableFactory, _GraphQueryableInstance, IGraphQueryableCollection, GraphQueryableCollection } from "../graphqueryable.js";
import { defaultPath, deleteable, IDeleteable, updateable, IUpdateable, getById, IGetById } from "../decorators.js";
import { graphPost } from "../operations.js";
import { body } from "@pnp/queryable";

/**
 * Represents a list item entity
 */
@deleteable()
@updateable()
export class _ListItem extends _GraphQueryableInstance<IListItemEntity> {
    /**
     * Method for retrieving the versions of a list item.
     * @returns IListItemVersion
     */
    public get versions(): IGraphQueryableCollection<IListItemVersion> {
        return <any>GraphQueryableCollection(this, "versions");
    }
}
export interface IListItem extends _ListItem, IDeleteable, IUpdateable { }
export const ListItem = graphInvokableFactory<IListItem>(_ListItem);

/**
 * Describes a collection of list item objects
 *
 */
@defaultPath("items")
@getById(ListItem)
export class _ListItems extends _GraphQueryableCollection<IListItemEntity[]>{
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
 * IListAddResult
 */
export interface IListItemAddResult {
    list: IListItem;
    data: IListItemEntity;
}
