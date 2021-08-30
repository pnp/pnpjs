import {
    _SPCollection,
    spInvokableFactory,
    _SPInstance,
    ISPQueryable,
    SPCollection,
} from "../sharepointqueryable";
import { spPost } from "../operations.js";
import { odataUrlFrom } from "../utils/odataUrlFrom.js";
import { extractWebUrl } from "../utils/extractweburl.js";
import { File, IFile } from "../files/types.js";
import { FromQueryable } from "@pnp/queryable";


export class _AppCatalog extends _SPCollection {

    constructor(baseUrl: string | ISPQueryable, path = "_api/web/tenantappcatalog/AvailableApps") {
        super(extractWebUrl(typeof baseUrl === "string" ? baseUrl : baseUrl.toUrl()), path);
    }

    /**
     * Get details of specific app from the app catalog
     * @param id - Specify the guid of the app
     */
    public getAppById(id: string): IApp {
        return App(this, `getById('${id}')`);
    }

    /**
     * Synchronize a solution to the Microsoft Teams App Catalog
     * @param id - Specify the guid of the app
     * @param useSharePointItemId (optional) - By default this REST call requires the SP Item id of the app, not the app id.
     *                            PnPjs will try to fetch the item id by default, you can still use this parameter to pass your own item id in the first parameter
     */
    public async syncSolutionToTeams(id: string | number, useSharePointItemId = false): Promise<void> {

        // This REST call requires that you refer the list item id of the solution in the app catalog site.
        let appId = null;
        const webUrl = extractWebUrl(this.toUrl()) + "_api/web";

        if (useSharePointItemId) {

            appId = id;

        } else {

            const listId = (await SPCollection(webUrl, "lists").using(FromQueryable(this)).select("Id").filter("EntityTypeName eq 'AppCatalog'")())[0].Id;
            const listItems = await SPCollection(webUrl, `lists/getById('${listId}')/items`).select("Id").filter("AppProductID eq '${id}'").top(1).using(FromQueryable(this))();

            if (listItems && listItems.length > 0) {

                appId = listItems[0].Id;

            } else {

                throw Error(`Did not find the app with id ${id} in the appcatalog.`);
            }
        }

        const poster = AppCatalog(webUrl, `/tenantappcatalog/SyncSolutionToTeams(id=${appId})`);

        return await spPost(poster, {});
    }

    /**
     * Uploads an app package. Not supported for batching
     *
     * @param filename Filename to create.
     * @param content app package data (eg: the .app or .sppkg file).
     * @param shouldOverWrite Should an app with the same name in the same location be overwritten? (default: true)
     * @returns Promise<IAppAddResult>
     */
    public async add(filename: string, content: string | ArrayBuffer | Blob, shouldOverWrite = true): Promise<IAppAddResult> {

        // you don't add to the availableapps collection
        const adder = AppCatalog(extractWebUrl(this.toUrl()), `_api/web/tenantappcatalog/add(overwrite=${shouldOverWrite},url='${filename}')`);

        const r = await spPost(adder, {
            body: content, headers: {
                "binaryStringRequestBody": "true",
            },
        });

        return {
            data: r,
            file: File(odataUrlFrom(r)),
        };
    }
}
export interface IAppCatalog extends _AppCatalog { }
export const AppCatalog = spInvokableFactory<IAppCatalog>(_AppCatalog);

export class _App extends _SPInstance {

    /**
     * This method deploys an app on the app catalog. It must be called in the context
     * of the tenant app catalog web or it will fail.
     *
     * @param skipFeatureDeployment Deploy the app to the entire tenant
     */
    public deploy(skipFeatureDeployment = false): Promise<void> {
        return this.do(`Deploy(${skipFeatureDeployment})`);
    }

    /**
     * This method retracts a deployed app on the app catalog. It must be called in the context
     * of the tenant app catalog web or it will fail.
     */
    public retract(): Promise<void> {
        return this.do("Retract");
    }

    /**
     * This method allows an app which is already deployed to be installed on a web
     */
    public install(): Promise<void> {
        return this.do("Install");
    }

    /**
     * This method allows an app which is already installed to be uninstalled on a web
     * Note: when you use the REST API to uninstall a solution package from the site, it is not relocated to the recycle bin
     */
    public uninstall(): Promise<void> {
        return this.do("Uninstall");
    }

    /**
     * This method allows an app which is already installed to be upgraded on a web
     */
    public upgrade(): Promise<void> {
        return this.do("Upgrade");
    }

    /**
     * This method removes an app from the app catalog. It must be called in the context
     * of the tenant app catalog web or it will fail.
     */
    public remove(): Promise<void> {
        return this.do("Remove");
    }

    private do(path: string): Promise<void> {
        return spPost(App(this, path));
    }
}
export interface IApp extends _App { }
export const App = spInvokableFactory<IApp>(_App);

/**
 * Result object after adding an app
 */
export interface IAppAddResult {
    /**
     * Contains metadata of the added app
     */
    data: any;
    /**
     * A File instance to the item in SharePoint
     */
    file: IFile;
}
