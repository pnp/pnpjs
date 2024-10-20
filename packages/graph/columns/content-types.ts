import { addProp, body } from "@pnp/queryable";
import { graphPost } from "../graphqueryable.js";
import { _ContentType } from "../content-types/types.js";
import { Columns, IColumns,IColumn, _Columns } from "./types.js";
import {
    ColumnDefinition as IColumnDefinition,
} from "@microsoft/microsoft-graph-types";

declare module "./types" {
    interface _Columns {
        addRef(siteColumn: IColumn): Promise<IColumnDefinition>;
    }

    interface IColumns {
        addRef(siteColumn: IColumn): Promise<IColumnDefinition>;
    }
}

// TODO: Replace hard coded URL for graph endpoint
/**
 * Create a new booking service as specified in the request body.
 *
 * @param siteColumn the site column to add.
 */
_Columns.prototype.addRef = async function(siteColumn: IColumn): Promise<IColumnDefinition> {
    const postBody = { "sourceColumn@odata.bind": `https://graph.microsoft.com/v1.0/${siteColumn.toUrl()}`};
    return graphPost(this, body(postBody));
};

declare module "../content-types/types" {
    interface _ContentType {
        readonly column: IColumns;
    }
    interface IContentType {
        /**
         * Read the attachment files data for an item
         */
        readonly columns: IColumns;
    }
}
addProp(_ContentType, "columns", Columns);
