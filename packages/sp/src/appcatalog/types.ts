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

export class _AppCatalog extends _SharePointQueryableCollection implements _IAppCatalog {

    constructor(baseUrl: string | ISharePointQueryable, path = "_api/web/tenantappcatalog/AvailableApps") {
        super(extractWebUrl(typeof baseUrl === "string" ? baseUrl : baseUrl.toUrl()), path);
    }

    public getAppById(id: string): IApp {
        return App(this, `getById('${id}')`);
    }

    public async add(filename: string, content: string | ArrayBuffer | Blob, shouldOverWrite = true): Promise<IAppAddResult> {
        // you don't add to the availableapps collection
        const adder = AppCatalog(extractWebUrl(this.toUrl()), `_api/web/tenantappcatalog/add(overwrite=${shouldOverWrite},url='${filename}')`);

        const r = await spPost(adder, { body: content });

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
     * @returns Promise<AppAddResult>
     */
    add(filename: string, content: string | ArrayBuffer | Blob, shouldOverWrite?: boolean): Promise<IAppAddResult>;
    /**
     * Get details of specific app from the app catalog
     * @param id - Specify the guid of the app
     */
    getAppById(id: string): IApp;
}

export interface IAppCatalog extends _IAppCatalog, IInvokable, ISharePointQueryableCollection { }

/**
 * Invokable factory for IAppCatalog instances
 */
export const AppCatalog = spInvokableFactory<IAppCatalog>(_AppCatalog);

export class _App extends _SharePointQueryableInstance implements _IApp {

    public deploy(skipFeatureDeployment = false): Promise<void> {
        return spPost(this.clone(App, `Deploy(${skipFeatureDeployment})`));
    }

    public retract(): Promise<void> {
        return spPost(this.clone(App, "Retract"));
    }

    public install(): Promise<void> {
        return spPost(this.clone(App, "Install"));
    }

    public uninstall(): Promise<void> {
        return spPost(this.clone(App, "Uninstall"));
    }

    public upgrade(): Promise<void> {
        return spPost(this.clone(App, "Upgrade"));
    }

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

export interface IAppAddResult {
    data: any;
    file: IFile;
}
