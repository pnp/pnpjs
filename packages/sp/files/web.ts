import { _Web } from "../webs/types";
import { File, IFile } from "./types";
import { escapeQueryStrValue } from "../utils/escapeQueryStrValue";

declare module "../webs/types" {
    interface _Web {
        getFileByServerRelativeUrl(fileRelativeUrl: string): IFile;
        getFileByServerRelativePath(fileRelativeUrl: string): IFile;
        getFileById(uniqueId: string): IFile;
    }
    interface IWeb {

        /**
         * Gets a file by server relative url
         *
         * @param fileRelativeUrl The server relative path to the file (including /sites/ if applicable)
         */
        getFileByServerRelativeUrl(fileRelativeUrl: string): IFile;

        /**
         * Gets a file by server relative url if your file name contains # and % characters
         *
         * @param fileRelativeUrl The server relative path to the file (including /sites/ if applicable)
         */
        getFileByServerRelativePath(fileRelativeUrl: string): IFile;

        /**
         * Gets a file by id
         *
         * @param uniqueId The UniqueId of the file
         */
        getFileById(uniqueId: string): IFile;
    }
}

_Web.prototype.getFileByServerRelativeUrl = function (this: _Web, fileRelativeUrl: string): IFile {
    return File(this, `getFileByServerRelativeUrl('${escapeQueryStrValue(fileRelativeUrl)}')`);
};

_Web.prototype.getFileByServerRelativePath = function (this: _Web, fileRelativeUrl: string): IFile {
    return File(this, `getFileByServerRelativePath(decodedUrl='${escapeQueryStrValue(fileRelativeUrl)}')`);
};

_Web.prototype.getFileById = function (this: _Web, uniqueId: string): IFile {
    return File(this, `getFileById('${uniqueId}')`);
};
