import { addProp } from "@pnp/queryable";
import { _List } from "../lists/types.js";
import { addColumn } from "./addColumns.js";
import { Columns, IColumns, _Columns } from "./types.js";
import {
    ColumnDefinition as IColumnDefinition,
} from "@microsoft/microsoft-graph-types";


declare module "./types" {
    interface _Columns {
        add(column: IColumnDefinition): Promise<IColumnDefinition>;
    }

    interface IColumns {
        add(column: IColumnDefinition): Promise<IColumnDefinition>;
    }
}

_Columns.prototype.add = addColumn;

declare module "../lists/types" {
    interface _List {
        readonly column: IColumns;
    }
    interface IList {
        /**
         * Read the attachment files data for an item
         */
        readonly columns: IColumns;
    }
}
addProp(_List, "columns", Columns);
