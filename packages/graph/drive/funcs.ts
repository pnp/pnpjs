import { combine } from "@pnp/core";
import { body, InjectHeaders } from "@pnp/queryable";
import { graphPost, graphPut } from "../operations.js";
import { DriveItem, IDriveItemAddResult, IFileOptions } from "./types.js";

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

export async function driveItemUpload(fileOptions: IFileOptions): Promise<IDriveItemAddResult> {
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

    const data = await graphPut(q, { body: fileOptions.content });

    return {
        data,
        driveItem: DriveItem([this, `${combine("drives", data.parentReference.driveId, "items", data.id)}`]),
    };
}
