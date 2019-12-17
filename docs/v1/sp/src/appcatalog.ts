import { SharePointQueryable, SharePointQueryableInstance, SharePointQueryableCollection } from "./sharepointqueryable";
import { File } from "./files";
import { odataUrlFrom } from "./odata";
import { extractWebUrl } from "./utils/extractweburl";

/**
 * Represents an app catalog
 */
export class AppCatalog extends SharePointQueryableCollection {

    constructor(baseUrl: string | SharePointQueryable, path = "_api/web/tenantappcatalog/AvailableApps") {
        super(extractWebUrl(typeof baseUrl === "string" ? baseUrl : baseUrl.toUrl()), path);
    }

    /**
     * Get details of specific app from the app catalog
     * @param id - Specify the guid of the app
     */
    public getAppById(id: string): App {
        return new App(this, `getById('${id}')`);
    }

    /**
     * Uploads an app package. Not supported for batching
     *
     * @param filename Filename to create.
     * @param content app package data (eg: the .app or .sppkg file).
     * @param shouldOverWrite Should an app with the same name in the same location be overwritten? (default: true)
     * @returns Promise<AppAddResult>
     */
    public add(filename: string, content: string | ArrayBuffer | Blob, shouldOverWrite = true): Promise<AppAddResult> {

        const catalog = this.toUrl().indexOf("tenantappcatalog") > 0 ? "tenantappcatalog" : "sitecollectionappcatalog";

        // you don't add to the availableapps collection
        const adder = new AppCatalog(extractWebUrl(this.toUrl()), `_api/web/${catalog}/add(overwrite=${shouldOverWrite},url='${filename}')`);

        return adder.postCore({
            body: content,
        }).then(r => {
            return {
                data: r,
                file: new File(odataUrlFrom(r)),
            };
        });
    }
}

/**
 * Represents the actions you can preform on a given app within the catalog
 */
export class App extends SharePointQueryableInstance {

    /**
     * This method deploys an app on the app catalog.  It must be called in the context
     * of the tenant app catalog web or it will fail.
     * 
     * @param skipFeatureDeployment Deploy the app to the entire tenant
     */
    public deploy(skipFeatureDeployment = false): Promise<void> {
        return this.clone(App, `Deploy(${skipFeatureDeployment})`).postCore();
    }

    /**
     * This method retracts a deployed app on the app catalog.  It must be called in the context
     * of the tenant app catalog web or it will fail.
     */
    public retract(): Promise<void> {
        return this.clone(App, "Retract").postCore();
    }

    /**
     * This method allows an app which is already deployed to be installed on a web
     */
    public install(): Promise<void> {
        return this.clone(App, "Install").postCore();
    }

    /**
     * This method allows an app which is already insatlled to be uninstalled on a web
     */
    public uninstall(): Promise<void> {
        return this.clone(App, "Uninstall").postCore();
    }

    /**
     * This method allows an app which is already insatlled to be upgraded on a web
     */
    public upgrade(): Promise<void> {
        return this.clone(App, "Upgrade").postCore();
    }

    /**
     * This method removes an app from the app catalog.  It must be called in the context
     * of the tenant app catalog web or it will fail.
     */
    public remove(): Promise<void> {
        return this.clone(App, "Remove").postCore();
    }
}

export interface AppAddResult {
    data: any;
    file: File;
}
