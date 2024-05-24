import { addProp } from "@pnp/queryable";
import { _DriveItem } from "../files/types.js";
import { IWorkbook, IWorkbookWithSession, Workbook } from "./types.js";
import { getWorkbookSession } from "./session.js";

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