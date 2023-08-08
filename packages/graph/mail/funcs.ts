import { IGraphQueryable, GraphQueryableCollection, IGraphQueryableCollection } from "../graphqueryable.js";
import { graphPost } from "../operations.js";
import { body } from "@pnp/queryable";
import { Message } from "@microsoft/microsoft-graph-types";

// export interface IMessage extends Message {
//     attachments:
// }
/**
 * Get the occurrences, exceptions, and single instances of events in a calendar view defined by a time range,
 * from the user's default calendar, or from some other calendar of the user's
 *
 * @param this IGraphQueryable instance
 * @param message - should roughly match Message type in @microsoft/microsoft-graph-types.
 * Am not typing the property because attaching a file require the property "@odata.type": "#microsoft.graph.fileAttachment"
 * which is not included the typing and therefore will make the function unusable in that scenario.
 */
export function mailSend(this: IGraphQueryable, message: any): Promise<void> {
    return graphPost(GraphQueryableCollection(this, "mailSend"), body(message));
}
