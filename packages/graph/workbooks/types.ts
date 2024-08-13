import { updateable, IUpdateable, addable, getById, IAddable, IGetById, deleteable, IDeleteable, defaultPath, getItemAt, IGetItemAt } from "../decorators.js";
import { _GraphCollection, graphInvokableFactory, _GraphInstance, GraphQueryable } from "../graphqueryable.js";
import {
    Workbook as WorkbookType, 
    WorkbookWorksheet as WorksheetType,
    WorkbookTable as WorkbookTableType, 
    WorkbookTableRow as WorkbookTableRowType,
    WorkbookTableColumn as WorkbookTableColumnType,
    WorkbookRange as WorkbookRangeType
} from "@microsoft/microsoft-graph-types";
import { graphPost } from "@pnp/graph";
import { getRange, IGetRange } from "./decorators.js";

@defaultPath("workbook")
export class _Workbook extends _GraphInstance<WorkbookType> {
    public get worksheets(): IWorksheets {
        return Worksheets(this);
    }

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
export class _Range extends _GraphInstance<WorkbookRangeType> {
}
export interface IRange extends _Range, IUpdateable, IDeleteable {}
export const Range = graphInvokableFactory<IRange>(_Range);

@updateable()
@deleteable()
export class _Worksheet extends _GraphInstance<WorksheetType> {
    /**
     * Get a range of cells within the worksheet.
     *
     * @param address (Optional) An A1-notation address of a range within this worksheet. 
     * If omitted, a range containing the entire worksheet is returned.
     */
    public getRange(address?: string): IRange {
        if (address) {
            return Range(this, `range(address='${address}')`);
        } else {
            return Range(this, "range");
        }
    }
}
export interface IWorksheet extends _Worksheet, IUpdateable, IDeleteable {}
export const Worksheet = graphInvokableFactory<IWorksheet>(_Worksheet);

@defaultPath("worksheets")
@addable()
@getById(Worksheet)
export class _Worksheets extends _GraphCollection<WorksheetType[]> {
}
export interface IWorksheets extends _Worksheets, IAddable, IGetById<IWorksheet> {}
export const Worksheets = graphInvokableFactory<IWorksheets>(_Worksheets);

@getRange()
@updateable()
@deleteable()
export class _Table extends _GraphInstance<WorkbookTableType> {
    public get rows(): ITableRows {
        return TableRows(this);
    }
    public get columns(): ITableColumns {
        return TableColumns(this);
    }

    public clearFilters() {
        return graphPost(GraphQueryable(this, "clearFilters"));
    }
}
export interface ITable extends _Table, IUpdateable, IDeleteable, IGetRange {}
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

@getRange()
@deleteable()
@updateable()
export class _TableRow extends _GraphInstance<WorkbookTableRowType> {

}
export interface ITableRow extends _TableRow, IUpdateable, IDeleteable, IGetRange {}
export const TableRow = graphInvokableFactory<ITableRow>(_TableRow);

@defaultPath("rows")
@addable()
@getItemAt(TableRow)
export class _TableRows extends _GraphCollection<WorkbookTableRowType[]> {
    public getByIndex(index: number): ITableRow {
        /**
         * NOTE: Although documented, this doesn't work for me.
         * Returns 400 with code ApiNotFound.
         */
        return TableRow(this, `${index}`);
    }
}
export interface ITableRows extends _TableRows, IAddable, IGetItemAt<ITableRow> {}
export const TableRows = graphInvokableFactory<ITableRows>(_TableRows);

@getRange()
@deleteable()
@updateable()
export class _TableColumn extends _GraphInstance<WorkbookTableColumnType> {

}
export interface ITableColumn extends _TableColumn, IUpdateable, IDeleteable, IGetRange {}
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