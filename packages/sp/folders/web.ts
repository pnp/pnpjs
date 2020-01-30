import { addProp } from "@pnp/odata";
import { _Web } from "../webs/types";
import { Folders, IFolders, Folder, IFolder } from "./types";
import { escapeQueryStrValue } from "../utils/escapeQueryStrValue";

declare module "../webs/types" {
    interface _Web {
        readonly folders: IFolders;
        readonly rootFolder: IFolder;
        getFolderByServerRelativeUrl(folderRelativeUrl: string): IFolder;
        getFolderByServerRelativePath(folderRelativeUrl: string): IFolder;
        getFolderById(uniqueId: string): IFolder;
    }
    interface IWeb {

        /**
         * Gets the collection of folders in this web
         */
        readonly folders: IFolders;

        /**
         * Gets the root folder of the web
         */
        readonly rootFolder: IFolder;

        /**
         * Gets a folder by server relative url
         *
         * @param folderRelativeUrl The server relative path to the folder (including /sites/ if applicable)
         */
        getFolderByServerRelativeUrl(folderRelativeUrl: string): IFolder;

        /**
         * Gets a folder by server relative path if your folder name contains # and % characters
         * This works only in SharePoint online.
         *
         * @param folderRelativeUrl The server relative path to the folder (including /sites/ if applicable)
         */
        getFolderByServerRelativePath(folderRelativeUrl: string): IFolder;

        /**
         * Gets a folder by id
         *
         * @param uniqueId The UniqueId of the folder
         */
        getFolderById(uniqueId: string): IFolder;
    }
}

addProp(_Web, "folders", Folders);
addProp(_Web, "rootFolder", Folder, "rootFolder");

_Web.prototype.getFolderByServerRelativeUrl = function (this: _Web, folderRelativeUrl: string): IFolder {
    return Folder(this, `getFolderByServerRelativeUrl('${escapeQueryStrValue(folderRelativeUrl)}')`);
};

_Web.prototype.getFolderByServerRelativePath = function (this: _Web, folderRelativeUrl: string): IFolder {
    return Folder(this, `getFolderByServerRelativePath(decodedUrl='${escapeQueryStrValue(folderRelativeUrl)}')`);
};

_Web.prototype.getFolderById = function (this: _Web, uniqueId: string): IFolder {
    return Folder(this, `getFolderById('${uniqueId}')`);
};
