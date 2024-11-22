import { updateable, IUpdateable, addable, getById, IAddable, IGetById, deleteable, IDeleteable, defaultPath, } from "../decorators.js";
import { _GraphCollection, graphInvokableFactory, _GraphInstance, GraphQueryable, IGraphQueryable } from "../graphqueryable.js";
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
    WorkbookRangeSort as WorkbookRangeSortType,
    WorkbookRangeView as WorkbookRangeViewType,
    WorkbookFormatProtection as WorkbookFormatProtectionType,
    WorkbookTableSort as WorkbookTableSortType,
    WorkbookFilter as WorkbookFilterType,
    WorkbookWorksheetProtection as WorkbookWorksheetProtectionType,
    WorkbookPivotTable as WorkbookPivotTableType,
    WorkbookNamedItem as WorkbookNamedItemType,
    WorkbookSortField as WorkbookSortFieldType,
    WorkbookOperation as WorkbookOperationType,
    WorkbookWorksheetProtectionOptions,
    WorkbookIcon as WorkbookIconType,
    WorkbookComment as WorkbookCommentType,
    WorkbookCommentReply as WorkbookCommentReplyType,
    WorkbookApplication as WorkbookApplicationType
} from "@microsoft/microsoft-graph-types";
import { graphPost } from "@pnp/graph";
import { body, JSONParse } from "@pnp/queryable/index.js";

@defaultPath("workbook")
export class _Workbook extends _GraphInstance<WorkbookType> {
    public get worksheets(): IWorksheets {
        return Worksheets(this);
    }

    public get tables(): ITables {
        return Tables(this);
    }

    public get comments(): IComments {
        return Comments(this);
    }

    public get names(): INamedItems {
        return NamedItems(this);
    }
    
    public get operations(): IOperations {
        return Operations(this);
    }

    public get application(): IApplication {
        return Application(this);
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
export class _Range extends _GraphInstance<WorkbookRangeType> {
    public get format(): IRangeFormat {
        return RangeFormat(this);
    }

    public get sort(): IRangeSort {
        return RangeSort(this);
    }

    public cell(row: number, column: number): IRange {
        return Range(this, `cell(row=${row},column=${column})`);
    }

    public column(column: number): IRange {
        return Range(this, `column(column=${column})`);
    }

    public columnsAfter(count: number = 1): IRange {
        return Range(this, `columnsAfter(count=${count})`);
    }

    public columnsBefore(count: number = 1): IRange {
        return Range(this, `columnsBefore(count=${count})`);
    }

    public row(row: number): IRange {
        return Range(this, `row(row=${row})`);
    }

    public rowsAbove(count: number = 1): IRange {
        return Range(this, `rowsAbove(count=${count})`);
    }

    public rowsBelow(count: number = 1): IRange {
        return Range(this, `rowsBelow(count=${count})`);
    }

    public get entireColumn(): IRange {
        return Range(this, `entireColumn`);
    }

    public get entireRow(): IRange {
        return Range(this, `entireRow`);
    }

    // NOTE: A few methods here are documented incorrectly.
    // They're GET methods, but specify that their arguments
    // are supposed to be passed in the request body.
    // The API actually wants them in the query string, so
    // that's what we do here.

    public intersection(anotherRange: string): IRange {
        return Range(this, `intersection(anotherRange='${anotherRange}')`);
    }

    public boundingRect(anotherRange: string): IRange {
        return Range(this, `boundingRect(anotherRange='${anotherRange}')`);
    }

    public get lastCell(): IRange {
        return Range(this, 'lastCell');
    }

    public get lastColumn(): IRange {
        return Range(this, 'lastColumn');
    }

    public get lastRow(): IRange {
        return Range(this, 'lastRow');
    }

    public offsetRange(rowOffset: number, columnOffset: number): IRange {
        return Range(this, `offsetRange(rowOffset=${rowOffset}, columnOffset=${columnOffset})`);
    }

    // NOTE: Docs say this is a POST. It's a GET.
    public resizedRange(deltaRows: number, deltaColumns: number): IRange {
        return Range(this, `resizedRange(deltaRows=${deltaRows}, deltaColumns=${deltaColumns})`);
    }

    public usedRange(valuesOnly: boolean): IRange {
        return Range(this, `usedRange(valuesOnly=${valuesOnly})`);
    }

    public get visibleView(): IRangeView {
        return RangeView(this, 'visibleView');
    }

    public insert(shift: "Down" | "Right"): Promise<WorkbookRangeType> {
        return graphPost(GraphQueryable(this, "insert"), body({ shift }));
    }

    public merge(across: boolean): Promise<void> {
        return graphPost(GraphQueryable(this, "merge"), body({ across }));
    }

    public unmerge(): Promise<void> {
        return graphPost(GraphQueryable(this, "unmerge"));
    }

    public clear(applyTo: "All" | "Formats" | "Contents"): Promise<void> {
        return graphPost(GraphQueryable(this, "clear"), body({ applyTo }));
    }

    public delete(shift: "Up" | "Left"): Promise<void> {
        return graphPost(GraphQueryable(this, "delete"), body({ shift }));
    }
}
export interface IRange extends _Range, IUpdateable<WorkbookRangeType> { }
export const Range = graphInvokableFactory<IRange>(_Range);

export class _RangeView extends _GraphInstance<WorkbookRangeViewType> {
    public get rows(): IRangeViews {
        return RangeViews(this, "rows");
    }

    public get range(): IRange {
        return Range(this, "range");
    }
}
export interface IRangeView extends _RangeView {}
const RangeView = graphInvokableFactory<IRangeView>(_RangeView);

@getItemAt(RangeView)
export class _RangeViews extends _GraphCollection<WorkbookRangeViewType[]> {
}
export interface IRangeViews extends _RangeViews, IGetItemAt<IRangeView> {}
const RangeViews = graphInvokableFactory<IRangeViews>(_RangeViews);

export interface RangeSortParameters {
    fields: WorkbookSortFieldType[],
    matchCase?: boolean,
    hasHeaders?: boolean,
    orientation?: "Rows" | "Columns",
    method?: "PinYin" | "StrokeCount"
}

@defaultPath("sort")
export class _RangeSort extends _GraphInstance<WorkbookRangeSortType> {
    public apply(params: RangeSortParameters): Promise<void> {
        return graphPost(GraphQueryable(this, "apply"), body(params));
    }
}
export interface IRangeSort extends _RangeSort {}
const RangeSort = graphInvokableFactory<IRangeSort>(_RangeSort);

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

export interface IRangeFormat extends _RangeFormat, IUpdateable<WorkbookRangeFormatType> { }
export const RangeFormat = graphInvokableFactory<IRangeFormat>(_RangeFormat);

@defaultPath("font")
@updateable()
export class _RangeFont extends _GraphInstance<WorkbookRangeFontType> { }
export interface IRangeFont extends _RangeFont, IUpdateable<WorkbookRangeFontType> { }
export const RangeFont = graphInvokableFactory<IRangeFont>(_RangeFont);

@defaultPath("fill")
@updateable()
export class _RangeFill extends _GraphInstance<WorkbookRangeFillType> { 
    public clear(): Promise<void> {
        return graphPost(GraphQueryable(this, "clear"));
    }
}
export interface IRangeFill extends _RangeFill, IUpdateable<WorkbookRangeFillType> { }
export const RangeFill = graphInvokableFactory<IRangeFill>(_RangeFill);

@defaultPath("protection")
@updateable()
export class _RangeFormatProtection extends _GraphInstance<WorkbookFormatProtectionType> { }

export interface IRangeFormatProtection extends _RangeFormatProtection, IUpdateable<WorkbookFormatProtectionType> { }
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
export interface IRangeBorder extends _RangeBorder, IUpdateable<WorkbookRangeBorderType> { }
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

    public getUsedRange(valuesOnly?: boolean): IRange {
        if (valuesOnly) {
            return Range(this, `usedRange(valuesOnly=${valuesOnly})`);
        } else {
            return Range(this, "usedRange");
        }
    }

    public get tables(): ITables {
        return Tables(this);
    }

    public get pivotTables(): IPivotTables {
        return PivotTables(this, "pivotTables");
    }

    public get names(): INamedItems {
        return NamedItems(this, "names");
    }

    public get protection(): IWorksheetProtection {
        return WorksheetProtection(this, "protection");
    }
}
export interface IWorksheet extends _Worksheet, IUpdateable<WorksheetType>, IDeleteable { }
export const Worksheet = graphInvokableFactory<IWorksheet>(_Worksheet);

export interface IAddWorksheet {
    name?: string;
}

@defaultPath("worksheets")
@addable()
@getById(Worksheet)
export class _Worksheets extends _GraphCollection<WorksheetType[]> {
}
export interface IWorksheets extends _Worksheets, IAddable<IAddWorksheet, WorksheetType>, IGetById<IWorksheet> { }
export const Worksheets = graphInvokableFactory<IWorksheets>(_Worksheets);

export class _WorksheetProtection extends _GraphInstance<WorkbookWorksheetProtectionType> {
    public protect(options?: WorkbookWorksheetProtectionOptions): Promise<void> {
        return graphPost(GraphQueryable(this, "protect"), body(options))
    }

    public unprotect(): Promise<void> {
        return graphPost(GraphQueryable(this, "unprotect"));
    }
}
export interface IWorksheetProtection extends _WorksheetProtection {}
export const WorksheetProtection = graphInvokableFactory<IWorksheetProtection>(_WorksheetProtection);

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
export interface ITable extends _Table, IUpdateable<WorkbookTableType>, IDeleteable, IGetRange { }
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
export interface ITableRow extends _TableRow, IUpdateable<WorkbookTableRowType>, IDeleteable, IGetRange { }
export const TableRow = graphInvokableFactory<ITableRow>(_TableRow);

export interface IAddRow {
    index?: number,
    values?: any[][]
}

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
export interface ITableRows extends _TableRows, IAddable<IAddRow, WorkbookTableRowType>, IGetItemAt<ITableRow> { }
export const TableRows = graphInvokableFactory<ITableRows>(_TableRows);

@getRange()
@deleteable()
@updateable()
export class _TableColumn extends _GraphInstance<WorkbookTableColumnType> {
    public get filter(): IWorkbookFilter {
        return WorkbookFilter(this);
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
}
export interface ITableColumn extends _TableColumn, IUpdateable<WorkbookTableColumnType>, IDeleteable, IGetRange { }
export const TableColumn = graphInvokableFactory<ITableColumn>(_TableColumn);

export interface IAddColumn {
    name?: string;
    index?: number;
    values?: any[][],
}

@defaultPath("columns")
@addable()
@getById(TableColumn)
export class _TableColumns extends _GraphCollection<WorkbookTableColumnType[]> {
    public getByName(name: string): ITableColumn {
        return TableColumn(this, name);
    }
}
export interface ITableColumns extends _TableColumns, IAddable<IAddColumn, WorkbookTableColumnType> { }
export const TableColumns = graphInvokableFactory<ITableColumns>(_TableColumns);

@defaultPath("filter")
export class _WorkbookFilter extends _GraphInstance<WorkbookFilterType> {
    public apply(filter: WorkbookFilterType): Promise<void> {
        /**
         * NOTE: The "criterion" object you pass here MUST have a
         * "filterOn" property, otherwise you get a 500.
         * The docs aren't clear on what you need to set this to.
         * Excel seems to set it to "Custom", which works in my testing.
         * We could do this for users here, though there could be
         * scenarios in which you might want it to be something else.
         */
        return graphPost(GraphQueryable(this, "apply"), body(filter));
    }

    public clear(): Promise<void> {
        return graphPost(GraphQueryable(this, "clear"));
    }
}
export interface IWorkbookFilter extends _WorkbookFilter {}
export const WorkbookFilter = graphInvokableFactory<IWorkbookFilter>(_WorkbookFilter);

@defaultPath("sort")
export class _TableSort extends _GraphInstance<WorkbookTableSortType> {
    public apply(fields: WorkbookSortFieldType[], matchCase?: boolean, method?: string): Promise<void> {
        return graphPost(GraphQueryable(this, "apply"), body({ fields, matchCase, method }));
    }

    public clear(): Promise<void> {
        return graphPost(GraphQueryable(this, "clear"));
    }

    public reapply(): Promise<void> {
        return graphPost(GraphQueryable(this, "reapply"));
    }

    /**
     * This is documented on the pages for "WorkbookTableSort"
     * and "Icon", but whenever I try to access `table/sort/fields`, 
     * I get "GeneralException" from Graph API.
     * 
     * This means the Icon class is useless, as you can't get
     * to any endpoint that returns it.
     * 
     * IMO, I think the "Icon" page on the docs is a mistake.
     * There's no reason for it to be a separate endpoint. You
     * would simply call clear() and apply() on this sort
     * if you wanted to update its icon.
     * 
     * I have left the Icon class in this file as it's 
     * technically in the docs, but atm there's no API call that uses it.
     */
    // public get fields(): ISortFields {
    //     return SortFields(this, "fields");
    // }
}
export class ITableSort extends _TableSort {}
export const TableSort = graphInvokableFactory<ITableSort>(_TableSort);

// See above
// export class _SortFields extends _GraphInstance<WorkbookSortFieldType[]> {
//     public get icon(): IIcon {
//         return Icon(this, "icon");
//     }
// }
// export interface ISortFields extends _SortFields {}
// export const SortFields = graphInvokableFactory<ISortFields>(_SortFields);

export class _PivotTable extends _GraphInstance<WorkbookPivotTableType> {
    public refresh(): Promise<void> {
        return graphPost(GraphQueryable(this, "refresh"));
    }
}
export interface IPivotTable extends _PivotTable {}
export const PivotTable = graphInvokableFactory<IPivotTable>(_PivotTable);

@getById(PivotTable)
export class _PivotTables extends _GraphCollection<WorkbookPivotTableType[]> {
    public refreshAll(): Promise<void> {
        return graphPost(GraphQueryable(this, "refreshAll"));
    }
}
export interface IPivotTables extends _PivotTables, IGetById<IPivotTable> {}
export const PivotTables = graphInvokableFactory<IPivotTables>(_PivotTables);

interface IUpdateNamedItem {
    comment?: string,
    visible?: boolean
}

@updateable()
export class _NamedItem extends _GraphInstance<WorkbookNamedItemType> {
    public get range(): IRange {
        return Range(this, "range");
    }
}
export interface INamedItem extends _NamedItem, IUpdateable<IUpdateNamedItem> {}
export const NamedItem = graphInvokableFactory<INamedItem>(_NamedItem);

interface IAddNamedItem {
    name: string,
    reference: string,
    comment: string
}

@defaultPath("names")
// @getById(NamedItem)
export class _NamedItems extends _GraphCollection<WorkbookNamedItemType[]> {
    /**
     * The NamedItem object contains string property named "value". 
     * This causes an issue with the DefaultParse
     * parser (namely parseODataJSON), because it's set up to throw away
     * the rest of the object if it contains a field "value".
     * 
     * Below I'm manually replacing the parser with JSONParse. This works,
     * but is unideal because it would replace any custom parser a user
     * may have set up earlier.
     * 
     * I know the docs caution against making changes in the
     * core classes - my suggestion would be to change
     * the check in parseODataJSON from `hasOwnProperty` to something like
     * `typeof json["value"] === "object"`. Thoughts?
     */

    public add(item: IAddNamedItem): Promise<WorkbookNamedItemType> {
        const q = GraphQueryable(this, "add");
        q.using(JSONParse());
        return graphPost(q, body(item));
    }

    public getByName(name: string): INamedItem {
        const q = NamedItem(this, name);
        q.using(JSONParse());
        return q;
    }
}
export interface INamedItems extends _NamedItems {}
export const NamedItems = graphInvokableFactory<INamedItems>(_NamedItems);

export class _Comment extends _GraphInstance<WorkbookCommentType> {
    public get replies(): ICommentReplies {
        return CommentReplies(this);
    }
}
export interface IComment extends _Comment {}
export const Comment = graphInvokableFactory<IComment>(_Comment);

@getById(Comment)
@defaultPath("comments")
export class _Comments extends _GraphCollection<WorkbookCommentType[]> {}
export interface IComments extends _Comments, IGetById<IComment> {}
export const Comments = graphInvokableFactory<IComments>(_Comments);

export class _CommentReply extends _GraphInstance<WorkbookCommentReplyType> {}
export interface ICommentReply extends _CommentReply {}
export const CommentReply = graphInvokableFactory<ICommentReply>(_CommentReply);

@defaultPath("replies")
@getById(CommentReply)
@addable()
export class _CommentReplies extends _GraphInstance<WorkbookCommentReplyType[]> {}
export interface ICommentReplies extends _CommentReplies, IGetById<ICommentReply>, IAddable<WorkbookCommentReplyType, WorkbookCommentReplyType> {}
export const CommentReplies = graphInvokableFactory<ICommentReplies>(_CommentReplies);

@defaultPath("application")
export class _Application extends _GraphInstance<WorkbookApplicationType> {
    public calculate(calculationType: 'Recalculate' | 'Full' | 'FullRebuild'): Promise<void> {
        return graphPost(GraphQueryable(this, "calculate"), body({ calculationType }));
    }
}
export interface IApplication extends _Application {}
export const Application = graphInvokableFactory<IApplication>(_Application);

export class _Operation extends _GraphInstance<WorkbookOperationType> {}
export interface IOperation extends _Operation {}
export const Operation = graphInvokableFactory<IOperation>(_Operation);

@defaultPath("operations")
@getById(Operation)
export class _Operations extends _GraphCollection<WorkbookOperationType[]> {}
export interface IOperations extends _Operations, IGetById<IOperation> {}
export const Operations = graphInvokableFactory<IOperations>(_Operations);

@updateable()
export class _Icon extends _GraphInstance<WorkbookIconType> {}
export interface IIcon extends _Icon, IUpdateable<WorkbookIconType> {}
export const Icon = graphInvokableFactory<IIcon>(_Icon);

export function getItemAt<R>(factory: (...args: any[]) => R) {
    return function <T extends { new(...args: any[]): {} }>(target: T) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        return class extends target {
            public getItemAt(this: IGraphQueryable, index: number): R {
                return factory(this, `itemAt(index=${index})`);
            }
        };
    };
}
export interface IGetItemAt<R = any, T = number> {
    /**
     * Get an item based on its position in the collection.
     * @param index Index of the item to be retrieved. Zero-indexed.
     */
    getItemAt(index: T): R;
}

/**
 * Adds the getRange method to the tagged class
 */
export function getRange() {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function <T extends { new(...args: any[]): {} }>(target: T) {

        return class extends target {
            public getRange(this: IGraphQueryable): IRange {
                return Range(this, "range");
            }
        };
    };
}

export interface IGetRange {
    /**
     * Get the range of cells contained by this element.
     */
    getRange(): IRange;
}