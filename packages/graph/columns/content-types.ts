import { addProp, body } from "@pnp/queryable";
import { graphPost } from "../operations.js";
import { _ContentType } from "../content-types/types.js";
import { Columns, IColumns,IColumn, _Columns } from "./types.js";
import { IColumnAddResult } from "./addColumns.js";

declare module "./types" {
    interface _Columns {
        addRef(siteColumn: IColumn): Promise<IColumnAddResult>;
    }

    interface IColumns {
        addRef(siteColumn: IColumn): Promise<IColumnAddResult>;
    }
}

// TODO: Replace hard coded URL for graph endpoint
/**
 * Create a new booking service as specified in the request body.
 *
 * @param siteColumn the site column to add.
 */
_Columns.prototype.addRef = async function(siteColumn: IColumn): Promise<IColumnAddResult> {
    const postBody = { "sourceColumn@odata.bind": `https://graph.microsoft.com/v1.0/${siteColumn.toUrl()}`};
    const data = await graphPost(this, body(postBody));

    return {
        data,
        column: (<any>this).getById(data.id),
    };
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
