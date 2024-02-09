import { Logger, LogLevel } from "@pnp/logging";
import { graphSetup } from "./setup.js";
import "@pnp/graph/users";
import "@pnp/graph/groups";
import "@pnp/graph/sites";
import "@pnp/graph/files";
import { IDriveItemAdd, IDriveItemAddFolder } from "@pnp/graph/files";
import * as fs from "fs";
import { IResumableUploadOptions } from "@pnp/graph/files";
import { graphPut } from "@pnp/graph";
import { InjectHeaders } from "@pnp/queryable/index.js";
import { DriveItemUploadableProperties } from "@microsoft/microsoft-graph-types";
import { ISensitivityLabel } from "@pnp/graph/files";

declare var process: { exit(code?: number): void };

export async function Example(settings: any) {
    const userId = "julie@sympjulie.onmicrosoft.com";
    const graph = graphSetup(settings);

      const folderInfo: IDriveItemAddFolder = {
        name: "Sub Folder",
        conflictBehavior: "replace",
      };

      const fileInfo: IDriveItemAdd = {
        filename: "Test File.txt",
        content: "Contents of test file",
        contentType: "text/plain",
        conflictBehavior: "replace",
      };

    //const users = await graph.users.getById(userId).drive.root.children.addFolder(folderInfo);
    //const folder = await graph.users.getById(userId).drive.getItemByPath("/Test Folder")();
    //const folder = await graph.users.getById(userId).drive.root.getItemByPath("/Test Folder")();

    //const file = await graph.users.getById(userId).drive.root.children.add(fileInfo);

    //   const moveItem = {
    //     parentReference: {
    //       id: folder.id,
    //     },
    //     name: "Moved File.txt",
    //   }
    //   const move = await graph.users.getById(userId).drive.getItemById(file.id).moveItem(moveItem);
    //const thumbnails = await graph.users.getById(userId).drive.getItemById(folder.id).thumbnails();
    //const versions = await graph.users.getById(userId).drive.getItemById(folder.id).versions();
    //const users = await graph.sites.getById(settings.testing.graph.id).drive.list();

    const fileBuff = fs.readFileSync("C:\\Users\\jturner.BMA\\Desktop\\TestDocument.docx");

    const fileUploadOptions: IResumableUploadOptions<DriveItemUploadableProperties> = {
        item: {
            name: "TestDocument2.docx",
            fileSize: fileBuff.byteLength,
        },
    };

    const label: ISensitivityLabel = {
        sensitivityLabelId: "b7a3c3d5-7b6d-4e6c-8e0c-3f5c7b1d0e3d",
        assignmentMethod: "standard",
        justificationText: "Just because",
    };

    const driveRoot = await graph.sites.getById(settings.testing.graph.id).drive.root();
    const driveItems = await graph.sites.getById(settings.testing.graph.id).drive.root.children();
    const driveItem = await graph.sites.getById(settings.testing.graph.id).drive.getItemById(driveItems[1].id)();
    const retentionLabelStatusUrl = await graph.sites.getById(settings.testing.graph.id).drive.getItemById(driveItems[1].id).assignSensitivityLabel(label);
    //const retentionLabel = await graph.users.getById(userId).drive.getItemById(driveItems[0].id).extractSensitivityLabels();
    const uploadSession = await graph.users.getById(userId).drive.getItemById(driveRoot.id).createUploadSession(fileUploadOptions);
    const status = await uploadSession.resumableUpload.status();

    const upload = await uploadSession.resumableUpload.upload(fileBuff.length, fileBuff);

    // Upload a chunk of the file to the upload session
    // Using a fragment size that doesn't divide evenly by 320 KiB results in errors committing some files.
    const chunkSize = 327680;
    let startFrom = 0;
    while (startFrom < fileBuff.length) {
        const fileChunk = fileBuff.slice(startFrom, startFrom + chunkSize);    
        const contentLength = `bytes ${startFrom}-${startFrom + chunkSize}/${fileBuff.length}`
        const uploadChunk = await uploadSession.resumableUpload.upload(chunkSize, fileChunk, contentLength);
        startFrom += chunkSize;
    }
    Logger.log({
        data: retentionLabelStatusUrl,
        level: LogLevel.Info,
        message: "List of Users Data",
    });

    process.exit(0);
}
