import { hOP } from "@pnp/core";
import { spPost } from "../operations.js";
import { SPQueryable, _SPQueryable } from "../spqueryable.js";
import { extractWebUrl } from "../utils/extract-web-url.js";

declare module "../spqueryable" {
    interface _SPQueryable {
        /**
         * Gets the context info for the specified path
         *
         * @param path Optional. Absolute path to a SharePoint resource [Default: this.parentUrl]
         */
        getContextInfo(path?: string): Promise<IContextInfo>;
    }
}

_SPQueryable.prototype.getContextInfo = async function (path = this.parentUrl): Promise<IContextInfo> {

    const data = await spPost(SPQueryable([this, extractWebUrl(path)], "_api/contextinfo"));

    if (hOP(data, "GetContextWebInformation")) {
        const info = data.GetContextWebInformation;
        info.SupportedSchemaVersions = info.SupportedSchemaVersions.results;
        return info;
    } else {
        return data;
    }
};

/**
 * This is the interface to expose data context information for a site/web
 */
export interface IContextInfo {
    FormDigestTimeoutSeconds: number;
    FormDigestValue: number;
    LibraryVersion: string;
    SiteFullUrl: string;
    SupportedSchemaVersions: string[];
    WebFullUrl: string;
}
