import { body, InjectHeaders } from "@pnp/queryable";
import { graphPost, graphPut } from "../graphqueryable.js";
import { DriveItem, IFileUploadOptions } from "./types.js";
import { DriveItem as IDriveItemType } from "@microsoft/microsoft-graph-types";


export interface ICheckInOptions {
    checkInAs?: string;
    comment?: string;
}

export function checkIn(checkInOptions?: ICheckInOptions): Promise<void> {
    return graphPost(DriveItem(this, "checkin"), body(checkInOptions));
}

export function checkOut(): Promise<void> {
    return graphPost(DriveItem(this, "checkout"));
}

export function encodeSharingUrl(url: string): string {
    return "u!" + Buffer.from(url, "utf8").toString("base64").replace(/=$/i, "").replace("/", "_").replace("+", "-");
}

export async function driveItemUpload(fileOptions: IFileUploadOptions): Promise<IDriveItemType> {
    let path = "/content";
    if (fileOptions.filePathName) {
        path = `:/${fileOptions.filePathName}:/content`;
    }
    const q = DriveItem(this, null);

    // This assumes that `this` url doesn't have a trailing '/' which is should not, we'll revisit this if people are reporting issues.
    q.concat(path);
    if (fileOptions.contentType) {
        q.using(InjectHeaders({
            "Content-Type": fileOptions.contentType,
        }));
    }
    if(fileOptions.eTag) {
        const header = {};
        header[fileOptions.eTagMatch || "If-Match"] = fileOptions.eTag;
        q.using(InjectHeaders(header));
    }

    return await graphPut(q, { body: fileOptions.content });
}

