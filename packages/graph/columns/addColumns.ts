import { IColumn } from "./types";
import { graphPost } from "../operations.js";
import { body } from "@pnp/queryable";
import {
    ColumnDefinition as IColumnDefinition,
} from "@microsoft/microsoft-graph-types";

/**
 * Create a new booking service as specified in the request body.
 *
 * @param column  a JSON representation of a Column object.
 */
export const addColumn = async function(column: IColumnDefinition): Promise<IColumnAddResult> {
    const data = await graphPost(this, body(column));

    return {
        data,
        column: (<any>this).getById(data.id),
    };
};

/**
* IColumnAddResult
*/
export interface IColumnAddResult {
    column: IColumn;
    data: IColumnDefinition;
}
