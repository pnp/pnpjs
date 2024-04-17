import { graphPost } from "../graphqueryable.js";
import { body } from "@pnp/queryable";
import {
    ColumnDefinition as IColumnDefinition,
} from "@microsoft/microsoft-graph-types";

/**
 * Create a new booking service as specified in the request body.
 *
 * @param column  a JSON representation of a Column object.
 */
export const addColumn = async function(column: IColumnDefinition): Promise<IColumnDefinition> {
    return graphPost(this, body(column));
};
