import { GraphQueryable, graphPost } from "../graphqueryable.js";
import { InjectHeaders, body } from "@pnp/queryable";
import { IWorkbookWithSession, WorkbookWithSession } from "./types.js";
import { _DriveItem } from "../files/types.js";
import {
    WorkbookSessionInfo
} from "@microsoft/microsoft-graph-types";

export async function getWorkbookSession(this: _DriveItem, persistChanges: boolean): Promise<IWorkbookWithSession> {
    const workbook = WorkbookWithSession(this);
    const sessionResult = await graphPost<WorkbookSessionInfo>(
        GraphQueryable(workbook, 'createSession'), body({
            persistChanges
        }));

    if (!sessionResult.id) throw new Error("createSession did not respond with a session ID");

    workbook.using(InjectHeaders({ "workbook-session-id": sessionResult.id }));
    return workbook;
}