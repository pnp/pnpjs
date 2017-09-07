import { SharePointQueryable, SharePointQueryableInstance } from "./sharepointqueryable";
import { Web } from "./webs";
import { UserCustomActions } from "./usercustomactions";
import { ContextInfo, DocumentLibraryInformation } from "./types";
import { spExtractODataId } from "./odata";
import { ODataBatch } from "./batch";
import { Features } from "./features";

/**
 * Describes a site collection
 *
 */
export class Site extends SharePointQueryableInstance {

    /**
     * Creates a new instance of the Site class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this site collection
     */
    constructor(baseUrl: string | SharePointQueryable, path = "_api/site") {
        super(baseUrl, path);
    }

    /**
     * Gets the root web of the site collection
     *
     */
    public get rootWeb(): Web {
        return new Web(this, "rootweb");
    }

    /**
     * Gets the active features for this site collection
     *
     */
    public get features(): Features {
        return new Features(this);
    }

    /**
     * Gets all custom actions for this site collection
     *
     */
    public get userCustomActions(): UserCustomActions {
        return new UserCustomActions(this);
    }

    /**
     * Gets the context information for this site collection
     */
    public getContextInfo(): Promise<ContextInfo> {
        const q = new Site(this.parentUrl, "_api/contextinfo");
        return q.postCore().then(data => {
            if (data.hasOwnProperty("GetContextWebInformation")) {
                const info = data.GetContextWebInformation;
                info.SupportedSchemaVersions = info.SupportedSchemaVersions.results;
                return info;
            } else {
                return data;
            }
        });
    }

    /**
     * Gets the document libraries on a site. Static method. (SharePoint Online only)
     *
     * @param absoluteWebUrl The absolute url of the web whose document libraries should be returned
     */
    public getDocumentLibraries(absoluteWebUrl: string): Promise<DocumentLibraryInformation[]> {
        const q = new SharePointQueryable("", "_api/sp.web.getdocumentlibraries(@v)");
        q.query.add("@v", "'" + absoluteWebUrl + "'");
        return q.get().then(data => {
            if (data.hasOwnProperty("GetDocumentLibraries")) {
                return data.GetDocumentLibraries;
            } else {
                return data;
            }
        });
    }

    /**
     * Gets the site url from a page url
     *
     * @param absolutePageUrl The absolute url of the page
     */
    public getWebUrlFromPageUrl(absolutePageUrl: string): Promise<string> {
        const q = new SharePointQueryable("", "_api/sp.web.getweburlfrompageurl(@v)");
        q.query.add("@v", "'" + absolutePageUrl + "'");
        return q.get().then(data => {
            if (data.hasOwnProperty("GetWebUrlFromPageUrl")) {
                return data.GetWebUrlFromPageUrl;
            } else {
                return data;
            }
        });
    }

    /**
     * Creates a new batch for requests within the context of this site collection
     *
     */
    public createBatch(): ODataBatch {
        return new ODataBatch(this.parentUrl);
    }

    /**
     * Opens a web by id (using POST)
     *
     * @param webId The GUID id of the web to open
     */
    public openWebById(webId: string): Promise<OpenWebByIdResult> {

        return this.clone(Site, `openWebById('${webId}')`).postCore().then(d => {

            return {
                data: d,
                web: Web.fromUrl(spExtractODataId(d)),
            };
        });
    }
}

/**
 * The result of opening a web by id: contains the data returned as well as a chainable web instance
 */
export interface OpenWebByIdResult {
    data: any;
    web: Web;
}
