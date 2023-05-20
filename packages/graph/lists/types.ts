import { List as IListEntity } from "@microsoft/microsoft-graph-types";
import { _GraphQueryableCollection, graphInvokableFactory, _GraphQueryableInstance } from "../graphqueryable.js";
import { defaultPath, deleteable, IDeleteable, updateable, IUpdateable, getById, IGetById } from "../decorators.js";
import { graphPost } from "../operations.js";
import { body } from "@pnp/queryable";

/**
 * Represents a booking service entity
 */
@deleteable()
@updateable()
export class _List extends _GraphQueryableInstance<IListEntity> { }
export interface IList extends _List, IDeleteable, IUpdateable { }
export const List = graphInvokableFactory<IList>(_List);

/**
 * Describes a collection of booking service objects
 *
 */
@defaultPath("services")
@getById(List)
export class _Lists extends _GraphQueryableCollection<IListEntity[]>{
    /**
     * Create a new booking service as specified in the request body.
     *
     * @param list  a JSON representation of a List object.
     */
    public async add(list: IListEntity): Promise<IListAddResult> {
        const data = await graphPost(this, body(list));

        return {
            data,
            list: (<any>this).getById(data.id),
        };
    }
}

export interface ILists extends _Lists, IGetById<IList> { }
export const Lists = graphInvokableFactory<ILists>(_Lists);

/**
 * IListAddResult
 */
export interface IListAddResult {
    list: IList;
    data: IListEntity;
}
