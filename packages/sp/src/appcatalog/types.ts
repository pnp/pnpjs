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

/**
 * Represents an app catalog
 */
export class _AppCatalog extends _SharePointQueryableCollection implements IAppCatalog {

    constructor(baseUrl: string | ISharePointQueryable, path = "_api/web/tenantappcatalog/AvailableApps") {
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
     * Uploads an app package. Not supported for batching
     *
     * @param filename Filename to create.
     * @param content app package data (eg: the .app or .sppkg file).
     * @param shouldOverWrite Should an app with the same name in the same location be overwritten? (default: true)
     * @returns Promise<AppAddResult>
     */
    public async add(filename: string, content: string | ArrayBuffer | Blob, shouldOverWrite = true): Promise<AppAddResult> {

        // you don't add to the availableapps collection
        const adder = AppCatalog(extractWebUrl(this.toUrl()), `_api/web/tenantappcatalog/add(overwrite=${shouldOverWrite},url='${filename}')`);

        const r = await spPost(adder, { body: content });

        return {
            data: r,
            file: File(odataUrlFrom(r)),
        };
    }
}

export interface IAppCatalog extends IInvokable, ISharePointQueryableCollection {
    add(filename: string, content: string | ArrayBuffer | Blob, shouldOverWrite?: boolean): Promise<AppAddResult>;
    getAppById(id: string): IApp;
}
export interface _AppCatalog extends IInvokable { }
export const AppCatalog = spInvokableFactory<IAppCatalog>(_AppCatalog);

/**
 * Represents the actions you can preform on a given app within the catalog
 */
export class _App extends _SharePointQueryableInstance implements IApp {

    /**
     * This method deploys an app on the app catalog.  It must be called in the context
     * of the tenant app catalog web or it will fail.
     * 
     * @param skipFeatureDeployment Deploy the app to the entire tenant
     */
    public deploy(skipFeatureDeployment = false): Promise<void> {
        return spPost(this.clone(App, `Deploy(${skipFeatureDeployment})`));
    }

    /**
     * This method retracts a deployed app on the app catalog.  It must be called in the context
     * of the tenant app catalog web or it will fail.
     */
    public retract(): Promise<void> {
        return spPost(this.clone(App, "Retract"));
    }

    /**
     * This method allows an app which is already deployed to be installed on a web
     */
    public install(): Promise<void> {
        return spPost(this.clone(App, "Install"));
    }

    /**
     * This method allows an app which is already insatlled to be uninstalled on a web
     */
    public uninstall(): Promise<void> {
        return spPost(this.clone(App, "Uninstall"));
    }

    /**
     * This method allows an app which is already insatlled to be upgraded on a web
     */
    public upgrade(): Promise<void> {
        return spPost(this.clone(App, "Upgrade"));
    }

    /**
     * This method removes an app from the app catalog.  It must be called in the context
     * of the tenant app catalog web or it will fail.
     */
    public remove(): Promise<void> {
        return spPost(this.clone(App, "Remove"));
    }
}

export interface _App extends IInvokable { }
export interface IApp extends IInvokable, ISharePointQueryableInstance {
    deploy(skipFeatureDeployment?: boolean): Promise<void>;
    retract(): Promise<void>;
    install(): Promise<void>;
    uninstall(): Promise<void>;
    upgrade(): Promise<void>;
    remove(): Promise<void>;
}
export const App = spInvokableFactory<IApp>(_App);

export interface AppAddResult {
    data: any;
    file: IFile;
}
