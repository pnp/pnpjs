import { addProp, body, InjectHeaders } from "@pnp/queryable";
import { _DriveItem } from "../files/types.js";
import { IWorkbook, IWorkbookWithSession, Workbook, WorkbookWithSession } from "./types.js";
import { graphPost, GraphQueryable } from "../graphqueryable.js";
import { WorkbookSessionInfo } from "@microsoft/microsoft-graph-types";

declare module "../files/types.js" {
    interface _DriveItem {
        readonly workbook: IWorkbook;
        getWorkbookSession(persistChanges: boolean): Promise<IWorkbookWithSession>;
    }
    interface DriveItem {
        readonly workbook: IWorkbook;
        getWorkbookSession(persistChanges: boolean): Promise<IWorkbookWithSession>;
    }
}

addProp(_DriveItem, "workbook", Workbook);
_DriveItem.prototype.getWorkbookSession = getWorkbookSession;

export async function getWorkbookSession(this: _DriveItem, persistChanges: boolean): Promise<IWorkbookWithSession> {
    const workbook = WorkbookWithSession(this);
    const sessionResult = await graphPost<WorkbookSessionInfo>(
        GraphQueryable(workbook, "createSession"), body({
            persistChanges,
        }));

    if (!sessionResult.id) {
        throw new Error("createSession did not respond with a session ID");
    }

    workbook.using(InjectHeaders({ "workbook-session-id": sessionResult.id }));
    return workbook;
}
