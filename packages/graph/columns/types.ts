import {
    ColumnDefinition as IColumnDefinition,
} from "@microsoft/microsoft-graph-types";
import { _GraphCollection, graphInvokableFactory, _GraphInstance } from "../graphqueryable.js";
import { defaultPath, deleteable, IDeleteable, getById, IGetById, IUpdateable, updateable } from "../decorators.js";

/**
 * Represents a columns entity
 */
@deleteable()
@updateable()
export class _Column extends _GraphInstance<IColumnDefinition> {}
export interface IColumn extends _Column, IDeleteable, IUpdateable<IColumnDefinition> { }
export const Column = graphInvokableFactory<IColumn>(_Column);

/**
 * Describes a collection of column objects
 */
@defaultPath("columns")
@getById(Column)
export class _Columns extends _GraphCollection<IColumnDefinition[]>{}
export interface IColumns extends _Columns, IGetById<IColumn> { }
export const Columns = graphInvokableFactory<IColumns>(_Columns);

