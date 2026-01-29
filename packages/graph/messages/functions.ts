import { graphGet, GraphQueryable } from "../graphqueryable.js";
import { Message as IMessageType } from "@microsoft/microsoft-graph-types";

/**
 * Gets all the messages in a channel.
 * @param model optionally specify the licensing and payment model
 *
 */
export async function getAllMessages(model: "A" | "B" | undefined): Promise<IMessageType[]> {
    const qString = `getAllMessages${model ? `?model=${model}` : ""}`;
    return graphGet(GraphQueryable(this, qString));
}

/**
 * Gets all the retained messages in a channel.
 * @param model optionally specify the licensing and payment model
 *
 */
export async function getAllRetainedMessages(model: "A" | "B" | undefined): Promise<IMessageType[]> {
    const qString = `getAllRetainedMessages${model ? `?model=${model}` : ""}`;
    return graphGet(GraphQueryable(this, qString));
}
