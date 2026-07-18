import { GraphCollection, GraphQueryable, IGraphCollection } from "../graphqueryable.js";
import { Message as IMessageType } from "@microsoft/microsoft-graph-types";

/**
 * Gets all the messages in a channel.
 * @param model optionally specify the licensing and payment model
 *
 */
export function getAllMessages(this: any, model: "A" | "B" | undefined): IGraphCollection<IMessageType[]> {
    const qString = `getAllMessages${model ? `?model=${model}` : ""}`;
    return GraphCollection(GraphQueryable(this, qString));
}

/**
 * Gets all the retained messages in a channel.
 * @param model optionally specify the licensing and payment model
 *
 */
export function getAllRetainedMessages(this: any, model: "A" | "B" | undefined): IGraphCollection<IMessageType[]> {
    const qString = `getAllRetainedMessages${model ? `?model=${model}` : ""}`;
    return GraphCollection(GraphQueryable(this, qString));
}
