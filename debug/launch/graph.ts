import { Logger, LogLevel } from "@pnp/logging";
import { graphSetup } from "./setup.js";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import "@pnp/graph/users";
import "@pnp/graph/files";
import { IDriveItemAdd, IDriveItemAddFolder, IFileUploadOptions, IItemOptions, IBundleDef } from "@pnp/graph/files";

declare var process: { exit(code?: number): void };

export async function Example(settings: any) {

    const graph = graphSetup(settings);

    const fileOptions: IFileUploadOptions = {
        content: "This is some test content",
        filePathName: "pnpTest.txt",
        contentType: "text/plain;charset=utf-8",
    };

    const testUserName = settings.testing.testUser.substring(settings.testing.testUser.lastIndexOf("|") + 1);
    const drives = await graph.users.getById(testUserName).drives();
    let driveId = "";
    if (drives.length > 0) {
        driveId = drives[0].id;
    }

    // Create sample files
    let folderId = "";
    let child1Id = "";
    let child2Id = "";
    const testFolderName = `TestFolder_${getRandomString(4)}`;
    const driveItemAdd: IDriveItemAddFolder = {
        name: testFolderName,
    };
    const folder = await graph.users.getById(testUserName).drives.getById(driveId).root.children.addFolder(driveItemAdd);
    if (folder != null) {
        folderId = folder.id;
        const testFileName = `TestFile_${getRandomString(4)}.json`;
        const fo = JSON.parse(JSON.stringify(fileOptions));
        fo.filePathName = testFileName;
        const child1 = await graph.users.getById(testUserName).drives.getById(driveId).getItemById(folderId).upload(fo);
        child1Id = child1.id;
        fo.filePathName = `TestFile_${getRandomString(4)}.json`;
        const child2 = await graph.users.getById(testUserName).drives.getById(driveId).getItemById(folderId).upload(fo);
        child2Id = child2.id;
    }
 
    Logger.log({
      data: folder,
      level: LogLevel.Info,
      message: "List of Users Data",
    });
  
    process.exit(0);
}