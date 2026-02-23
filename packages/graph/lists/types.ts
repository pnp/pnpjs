import { List as IListEntity } from "@microsoft/microsoft-graph-types";
import { _GraphCollection, graphInvokableFactory, _GraphInstance } from "../graphqueryable.js";
import { defaultPath, deleteable, IDeleteable, updateable, IUpdateable, getById, IGetById, addable, IAddable } from "../decorators.js";

/**
 * Represents a list entity
 */
@deleteable()
@updateable()
export class _List extends _GraphInstance<IListEntity> { }
export interface IList extends _List, IDeleteable, IUpdateable { }
export const List = graphInvokableFactory<IList>(_List);

/**
 * Describes a collection of list objects
 *
 */
@defaultPath("lists")
@getById(List)
@addable()
export class _Lists extends _GraphCollection<IListEntity[]>{ }

export interface ILists extends _Lists, IGetById<IList>, IAddable<IListEntity, IListEntity> { }
export const Lists = graphInvokableFactory<ILists>(_Lists);
