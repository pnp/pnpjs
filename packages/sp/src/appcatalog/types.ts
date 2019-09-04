import { IInvokable } from "@pnp/odata";
import {
    ISharePointQueryable,
    _SharePointQueryableInstance,
    ISharePointQueryableInstance,
    ISharePointQueryableCollection,
    _SharePointQueryableCollection,
    spInvokableFactory,
} from "../sharepointqueryable";
import { spPost } from "../operations";
import { odataUrlFrom } from "../odata";
import { extractWebUrl } from "../utils/extractweburl";
import { File, IFile } from "../files/types";
import { clientTagMethod } from "../decorators";
import { Web } from "../webs";
import "../items";

export class _AppCatalog extends _SharePointQueryableCollection implements _IAppCatalog {

    constructor(baseUrl: string | ISharePointQueryable, path = "_api/web/tenantappcatalog/AvailableApps") {
        super(extractWebUrl(typeof baseUrl === "string" ? baseUrl : baseUrl.toUrl()), path);
    }

    public getAppById(id: string): IApp {
        return clientTagMethod.configure(App(this, `getById('${id}')`), "ac.getAppById");
    }

    public async syncSolutionToTeams(id: string | number, useSharePointItemId = false): Promise<void> {
        // This REST call requires that you refer the list item id of the solution in the app catalog site.
        let appId = null;
        const webUrl = extractWebUrl(this.toUrl());

        if (useSharePointItemId === true) {
            appId = id;
        } else {
            const web = Web(webUrl);
            const listId = (await web.lists.select("Id").filter(`EntityTypeName eq 'AppCatalog'`).get())[0].Id;
            const listItems = await web.lists.getById(listId).items.filter(`AppProductID eq '${id}'`).top(1).get();
            if (listItems && listItems.length > 0) {
                appId = listItems[0].Id;
            } else {
                throw Error(`Did not find the app with id ${id} in the appcatalog (╯°□°）╯︵ ┻━┻`);
            }
        }

        const poster = clientTagMethod.configure(AppCatalog(webUrl, `_api/web/tenantappcatalog/SyncSolutionToTeams(id=${appId})`), "ac.syncSolutionToTeams");
        return await spPost(poster, {});
    }

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

/**
 * Represents an app catalog
 */
export interface _IAppCatalog {
    /**
     * Uploads an app package. Not supported for batching
     *
     * @param filename Filename to create.
     * @param content app package data (eg: the .app or .sppkg file).
     * @param shouldOverWrite Should an app with the same name in the same location be overwritten? (default: true)
     * @returns Promise<IAppAddResult>
     */
    add(filename: string, content: string | ArrayBuffer | Blob, shouldOverWrite?: boolean): Promise<IAppAddResult>;
    /**
     * Get details of specific app from the app catalog
     * @param id - Specify the guid of the app
     */
    getAppById(id: string): IApp;
    /**
     * Synchronize a solution to the Microsoft Teams App Catalog
     * @param id - Specify the guid of the app
     * @param useSharePointItemId (optional) - By default this REST call requires the SP Item id of the app, not the app id.
     *                            PnPjs will try to fetch the item id by default, you can still use this parameter to pass your own item id in the first parameter 
     */
    syncSolutionToTeams(id: string | number, useSharePointItemId?: boolean): Promise<void>;
}

export interface IAppCatalog extends _IAppCatalog, IInvokable, ISharePointQueryableCollection { }

/**
 * Invokable factory for IAppCatalog instances
 */
export const AppCatalog = spInvokableFactory<IAppCatalog>(_AppCatalog);

export class _App extends _SharePointQueryableInstance implements _IApp {

    @clientTagMethod("app.deploy")
    public deploy(skipFeatureDeployment = false): Promise<void> {
        return spPost(this.clone(App, `Deploy(${skipFeatureDeployment})`));
    }

    @clientTagMethod("app.retract")
    public retract(): Promise<void> {
        return spPost(this.clone(App, "Retract"));
    }

    @clientTagMethod("app.install")
    public install(): Promise<void> {
        return spPost(this.clone(App, "Install"));
    }

    @clientTagMethod("app.uninstall")
    public uninstall(): Promise<void> {
        return spPost(this.clone(App, "Uninstall"));
    }

    @clientTagMethod("app.upgrade")
    public upgrade(): Promise<void> {
        return spPost(this.clone(App, "Upgrade"));
    }

    @clientTagMethod("app.remove")
    public remove(): Promise<void> {
        return spPost(this.clone(App, "Remove"));
    }
}

export interface _IApp {
    /**
     * This method deploys an app on the app catalog. It must be called in the context
     * of the tenant app catalog web or it will fail.
     * 
     * @param skipFeatureDeployment Deploy the app to the entire tenant
     */
    deploy(skipFeatureDeployment?: boolean): Promise<void>;
    /**
     * This method retracts a deployed app on the app catalog. It must be called in the context
     * of the tenant app catalog web or it will fail.
     */
    retract(): Promise<void>;
    /**
     * This method allows an app which is already deployed to be installed on a web
     */
    install(): Promise<void>;
    /**
     * This method allows an app which is already installed to be uninstalled on a web
     * Note: when you use the REST API to uninstall a solution package from the site, it is not relocated to the recycle bin
     */
    uninstall(): Promise<void>;
    /**
     * This method allows an app which is already installed to be upgraded on a web
     */
    upgrade(): Promise<void>;
    /**
     * This method removes an app from the app catalog. It must be called in the context
     * of the tenant app catalog web or it will fail.
     */
    remove(): Promise<void>;
}

/**
 * Represents the actions you can preform on a given app within the catalog
 */
export interface IApp extends _IApp, IInvokable, ISharePointQueryableInstance { }

/**
 * Invokable factory for IApp instances
 */
export const App = spInvokableFactory<IApp>(_App);

/**
 * Result object after adding an app
 */
export interface IAppAddResult {
    // Contains metadata of the added app
    data: any;
    // A File instance to the item in SharePoint
    file: IFile;
}
