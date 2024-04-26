import { updateable, IUpdateable, addable, getById, IAddable, IGetById, deleteable, IDeleteable, defaultPath } from "../decorators.js";
import { _GraphCollection, graphInvokableFactory, _GraphInstance, GraphQueryable } from "../graphqueryable.js";
import {
    Workbook as WorkbookType, 
    WorkbookTable as WorkbookTableType, 
    WorkbookTableRow as WorkbookTableRowType,
    WorkbookTableColumn as WorkbookTableColumnType
} from "@microsoft/microsoft-graph-types";
import { graphPost } from "@pnp/graph";

@defaultPath("workbook")
export class _Workbook extends _GraphInstance<WorkbookType> {
    public get tables(): ITables {
        return Tables(this);
    }
}
export interface IWorkbook  extends _Workbook {}
export const Workbook = graphInvokableFactory<IWorkbook>(_Workbook);

export class _WorkbookWithSession extends _Workbook {
    public closeSession(): Promise<void> {
        return graphPost(GraphQueryable(this, "closeSession"));
    }

    public refreshSession(): Promise<void> {
        return graphPost(GraphQueryable(this, "refreshSession"));
    }
}
export interface IWorkbookWithSession extends _WorkbookWithSession {}
export const WorkbookWithSession = graphInvokableFactory<IWorkbookWithSession>(_WorkbookWithSession);

@updateable()
@deleteable()
export class _Table extends _GraphInstance<WorkbookTableType> {
    public get rows(): ITableRows {
        return TableRows(this);
    }
    public get columns(): ITableColumns {
        return TableColumns(this);
    }
}
export interface ITable extends _Table, IUpdateable, IDeleteable {}
export const Table = graphInvokableFactory<ITable>(_Table);

@defaultPath("tables")
@addable()
@getById(Table)
export class _Tables extends _GraphCollection<WorkbookTableType[]> {
    public getByName(name: string): ITable {
        return Table(this, name);
    }
}
export interface ITables extends _Tables, IAddable, IGetById<ITable> {}
export const Tables = graphInvokableFactory<ITables>(_Tables);

@deleteable()
@updateable()
export class _TableRow extends _GraphInstance<WorkbookTableRowType> {

}
export interface ITableRow extends _TableRow, IUpdateable, IDeleteable {}
export const TableRow = graphInvokableFactory<ITableRow>(_TableRow);

@defaultPath("rows")
@addable()
export class _TableRows extends _GraphCollection<WorkbookTableRowType[]> {
    public getByIndex(index: number): ITableRow {
        return TableRow(this, `${index}`);
    }
}
export interface ITableRows extends _TableRows, IAddable {}
export const TableRows = graphInvokableFactory<ITableRows>(_TableRows);

@deleteable()
@updateable()
export class _TableColumn extends _GraphInstance<WorkbookTableColumnType> {

}
export interface ITableColumn extends _TableColumn, IUpdateable, IDeleteable {}
export const TableColumn = graphInvokableFactory<ITableColumn>(_TableColumn);

@defaultPath("columns")
@addable()
@getById(TableColumn)
export class _TableColumns extends _GraphCollection<WorkbookTableColumnType[]> {
    public getByName(name: string): ITableColumn {
        return TableColumn(this, name);
    }
}
export interface ITableColumns extends _TableColumns, IAddable {}
export const TableColumns = graphInvokableFactory<ITableColumns>(_TableColumns);