import { updateable, IUpdateable, addable, getById, IAddable, IGetById, deleteable, IDeleteable, defaultPath, getItemAt, IGetItemAt } from "../decorators.js";
import { _GraphCollection, graphInvokableFactory, _GraphInstance, GraphQueryable } from "../graphqueryable.js";
import {
    Workbook as WorkbookType,
    WorkbookWorksheet as WorksheetType,
    WorkbookTable as WorkbookTableType,
    WorkbookTableRow as WorkbookTableRowType,
    WorkbookTableColumn as WorkbookTableColumnType,
    WorkbookRange as WorkbookRangeType,
    WorkbookRangeFormat as WorkbookRangeFormatType,
    WorkbookRangeBorder as WorkbookRangeBorderType,
    WorkbookRangeFont as WorkbookRangeFontType,
    WorkbookRangeFill as WorkbookRangeFillType,
    WorkbookFormatProtection as WorkbookFormatProtectionType,
    WorkbookTableSort as WorkbookTableSortType,
    WorkbookSortField
} from "@microsoft/microsoft-graph-types";
import { graphPost } from "@pnp/graph";
import { getRange, IGetRange } from "./decorators.js";
import { body } from "@pnp/queryable/index.js";

@defaultPath("workbook")
export class _Workbook extends _GraphInstance<WorkbookType> {
    public get worksheets(): IWorksheets {
        return Worksheets(this);
    }

    public get tables(): ITables {
        return Tables(this);
    }
}
export interface IWorkbook extends _Workbook { }
export const Workbook = graphInvokableFactory<IWorkbook>(_Workbook);

export class _WorkbookWithSession extends _Workbook {
    public closeSession(): Promise<void> {
        return graphPost(GraphQueryable(this, "closeSession"));
    }

    public refreshSession(): Promise<void> {
        return graphPost(GraphQueryable(this, "refreshSession"));
    }
}
export interface IWorkbookWithSession extends _WorkbookWithSession { }
export const WorkbookWithSession = graphInvokableFactory<IWorkbookWithSession>(_WorkbookWithSession);

@updateable()
@deleteable()
export class _Range extends _GraphInstance<WorkbookRangeType> {
    public get format(): IRangeFormat {
        return RangeFormat(this);
    }
}
export interface IRange extends _Range, IUpdateable, IDeleteable { }
export const Range = graphInvokableFactory<IRange>(_Range);

@updateable()
@defaultPath("format")
export class _RangeFormat extends _GraphInstance<WorkbookRangeFormatType> {
    public get borders(): IRangeBorders {
        return RangeBorders(this);
    }

    public get font(): IRangeFont {
        return RangeFont(this);
    }

    public get fill(): IRangeFill {
        return RangeFill(this);
    }

    public get protection(): IRangeFormatProtection {
        return RangeFormatProtection(this);
    }

    public autofitColumns(): Promise<void> {
        return graphPost(GraphQueryable(this, "autofitColumns"));
    }

    public autofitRows(): Promise<void> {
        return graphPost(GraphQueryable(this, "autofitRows"));
    }
}

export interface IRangeFormat extends _RangeFormat, IUpdateable { }
export const RangeFormat = graphInvokableFactory<IRangeFormat>(_RangeFormat);

@defaultPath("font")
@updateable()
export class _RangeFont extends _GraphInstance<WorkbookRangeFontType> { }
export interface IRangeFont extends _RangeFont, IUpdateable { }
export const RangeFont = graphInvokableFactory<IRangeFont>(_RangeFont);

@defaultPath("fill")
@updateable()
export class _RangeFill extends _GraphInstance<WorkbookRangeFillType> { 
    public clear(): Promise<void> {
        return graphPost(GraphQueryable(this, "clear"));
    }
}
export interface IRangeFill extends _RangeFill, IUpdateable { }
export const RangeFill = graphInvokableFactory<IRangeFill>(_RangeFill);

@defaultPath("protection")
@updateable()
export class _RangeFormatProtection extends _GraphInstance<WorkbookFormatProtectionType> { }

export interface IRangeFormatProtection extends _RangeFormatProtection, IUpdateable { }
export const RangeFormatProtection = graphInvokableFactory<IRangeFormatProtection>(_RangeFormatProtection);

@updateable()
export class _RangeBorder extends _GraphInstance<WorkbookRangeBorderType> { }
/**
 * NOTE: When updating RangeBorder, there are some combinations of style 
 * and weight that silently fail.
 * For example, setting "Dash - Thick" always sets "Continuous - Thick".
 * This isn't documented, but it's also not really a bug. When you
 * try to manually set border styles in Excel, it's not possible to select
 * a thick dashed line.
 */
export interface IRangeBorder extends _RangeBorder, IUpdateable { }
export const RangeBorder = graphInvokableFactory<IRangeBorder>(_RangeBorder);

@defaultPath("borders")
// @addable()
/**
 * NOTE: According the docs at https://learn.microsoft.com/en-us/graph/api/rangeformat-post-borders,
 * you should be able to POST new border styles. In my testing, this fails with MethodNotAllowed
 * Using `RangeBorder.update()` works instead, even for borders that haven't been "created" yet.
 */
@getItemAt(RangeBorder)
export class _RangeBorders extends _GraphCollection<WorkbookRangeBorderType[]> {
    public getBySideIndex(sideIndex: RangeBorderSideIndex) {
        return RangeBorder(this, sideIndex);
    }
}
export interface IRangeBorders extends _RangeBorders, IGetItemAt<IRangeBorder> { }
export const RangeBorders = graphInvokableFactory<IRangeBorders>(_RangeBorders);
export type RangeBorderSideIndex = 'EdgeTop' | 'EdgeBottom' | 'EdgeLeft' | 'EdgeRight' |
    'InsideVertical' | 'InsideHorizontal' | 'DiagonalDown' |
    'DiagonalUp';



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

    public get tables(): ITables {
        return Tables(this);
    }
}
export interface IWorksheet extends _Worksheet, IUpdateable, IDeleteable { }
export const Worksheet = graphInvokableFactory<IWorksheet>(_Worksheet);

@defaultPath("worksheets")
@addable()
@getById(Worksheet)
export class _Worksheets extends _GraphCollection<WorksheetType[]> {
}
export interface IWorksheets extends _Worksheets, IAddable, IGetById<IWorksheet> { }
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

    public get worksheet(): IWorksheet {
        return Worksheet(this, "worksheet");
    }

    public get range(): IRange {
        return Range(this, "range");
    }

    public get headerRowRange(): IRange {
        return Range(this, "headerRowRange");
    }

    public get dataBodyRange(): IRange {
        return Range(this, "dataBodyRange");
    }

    public get totalRowRange(): IRange {
        return Range(this, "totalRowRange");
    }

    public get sort(): ITableSort {
        return TableSort(this);
    }

    public clearFilters() {
        return graphPost(GraphQueryable(this, "clearFilters"));
    }

    public reapplyFilters() {
        return graphPost(GraphQueryable(this, "reapplyFilters"));
    }

    public convertToRange(): Promise<WorkbookRangeType> {
        return graphPost(GraphQueryable(this, "convertToRange"));
    }
}
export interface ITable extends _Table, IUpdateable, IDeleteable, IGetRange { }
export const Table = graphInvokableFactory<ITable>(_Table);

@defaultPath("tables")
@getById(Table)
export class _Tables extends _GraphCollection<WorkbookTableType[]> {
    public getByName(name: string): ITable {
        return Table(this, name);
    }

    public async add(address: string, hasHeaders: boolean): Promise<WorkbookTableType> {
        return graphPost(GraphQueryable(this, "add"), body({ address, hasHeaders }));
    }
}
export interface ITables extends _Tables, IGetById<ITable> { }
export const Tables = graphInvokableFactory<ITables>(_Tables);

@getRange()
@deleteable()
@updateable()
export class _TableRow extends _GraphInstance<WorkbookTableRowType> {

}
export interface ITableRow extends _TableRow, IUpdateable, IDeleteable, IGetRange { }
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
export interface ITableRows extends _TableRows, IAddable, IGetItemAt<ITableRow> { }
export const TableRows = graphInvokableFactory<ITableRows>(_TableRows);

@getRange()
@deleteable()
@updateable()
export class _TableColumn extends _GraphInstance<WorkbookTableColumnType> {

}
export interface ITableColumn extends _TableColumn, IUpdateable, IDeleteable, IGetRange { }
export const TableColumn = graphInvokableFactory<ITableColumn>(_TableColumn);

@defaultPath("columns")
@addable()
@getById(TableColumn)
export class _TableColumns extends _GraphCollection<WorkbookTableColumnType[]> {
    public getByName(name: string): ITableColumn {
        return TableColumn(this, name);
    }
}
export interface ITableColumns extends _TableColumns, IAddable { }
export const TableColumns = graphInvokableFactory<ITableColumns>(_TableColumns);

@defaultPath("sort")
export class _TableSort extends _GraphInstance<WorkbookTableSortType> {
    public apply(fields: WorkbookSortField[], matchCase?: boolean, method?: string): Promise<void> {
        return graphPost(GraphQueryable(this, "apply"), body({ fields, matchCase, method }));
    }

    public clear(): Promise<void> {
        return graphPost(GraphQueryable(this, "clear"));
    }

    public reapply(): Promise<void> {
        return graphPost(GraphQueryable(this, "reapply"));
    }
}

export interface ITableSort extends _TableSort {}
export const TableSort = graphInvokableFactory<ITableSort>(_TableSort);
