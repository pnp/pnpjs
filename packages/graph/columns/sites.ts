import { addProp } from "@pnp/queryable";
import { addColumn, IColumnAddResult } from "./addColumns.js";
import { Columns, IColumns, _Columns } from "./types.js";
import {
    ColumnDefinition as IColumnDefinition,
} from "@microsoft/microsoft-graph-types";
import { _Site } from "../sites/types.js";

declare module "./types" {
    interface _Columns {
        add(column: IColumnDefinition): Promise<IColumnAddResult>;
    }

    interface IColumns {
        add(column: IColumnDefinition): Promise<IColumnAddResult>;
    }
}

_Columns.prototype.add = addColumn;

declare module "../sites/types" {
    interface _Site {
        readonly column: IColumns;
    }
    interface ISite {
        /**
         * Read the attachment files data for an item
         */
        readonly columns: IColumns;
    }
}
addProp(_Site, "columns", Columns);
