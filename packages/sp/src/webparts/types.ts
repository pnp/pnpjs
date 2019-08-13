import {
    _SharePointQueryableInstance,
    _SharePointQueryableCollection,
    ISharePointQueryableCollection,
    ISharePointQueryableInstance,
    _SharePointQueryable,
    ISharePointQueryable,
    spInvokableFactory,
    SharePointQueryable,
} from "../sharepointqueryable";
import { IInvokable, body } from "@pnp/odata";
import { SharePointQueryableInstance, clientTagMethod } from "../sp";
import { spPost } from "../operations";

export class _LimitedWebPartManager extends _SharePointQueryable implements ILimitedWebPartManager {

    public get scope(): ISharePointQueryable {
        return clientTagMethod.configure(SharePointQueryable(this, "Scope"), "f.scope");
    }

    public get webparts(): IWebPartDefinitions {
        return WebPartDefinitions(this, "webparts");
    }

    public export(id: string): Promise<string> {
        return spPost(this.clone(LimitedWebPartManagerCloneFactory, "ExportWebPart"), body({ webPartId: id }));
    }

    public import(xml: string): Promise<any> {
        return spPost(this.clone(LimitedWebPartManagerCloneFactory, "ImportWebPart"), body({ webPartXml: xml }));
    }
}

export interface ILimitedWebPartManager {

    /**
     * Gets the scope of this web part manager (User = 0 or Shared = 1)
     */
    readonly scope: ISharePointQueryable;

    /**
     * Gets the set of web part definitions contained by this web part manager
     */
    readonly webparts: IWebPartDefinitions;

    /**
     * Exports a webpart definition
     *
     * @param id the GUID id of the definition to export
     */
    export(id: string): Promise<string>;

    /**
     * Imports a webpart
     *
     * @param xml webpart definition which must be valid XML in the .dwp or .webpart format
     */
    import(xml: string): Promise<any>;
}

export const LimitedWebPartManager = (baseUrl: string | ISharePointQueryable, path?: string): ILimitedWebPartManager => new _LimitedWebPartManager(baseUrl, path);

type LimitedWebPartManagerCloneType = ILimitedWebPartManager & ISharePointQueryable;
const LimitedWebPartManagerCloneFactory = (baseUrl: string | ISharePointQueryable, path?: string): LimitedWebPartManagerCloneType => <any>LimitedWebPartManager(baseUrl, path);

export class _WebPartDefinitions extends _SharePointQueryableCollection implements _IWebPartDefinitions {

    public getById(id: string): IWebPartDefinition {
        return WebPartDefinition(this, `getbyid('${id}')`);
    }

    public getByControlId(id: string): IWebPartDefinition {
        return WebPartDefinition(this, `getByControlId('${id}')`);
    }
}

export interface _IWebPartDefinitions {
    /**
     * Gets a web part definition from the collection by id
     *
     * @param id The storage ID of the SPWebPartDefinition to retrieve
     */
    getById(id: string): IWebPartDefinition;

    /**
     * Gets a web part definition from the collection by storage id
     *
     * @param id The WebPart.ID of the SPWebPartDefinition to retrieve
     */
    getByControlId(id: string): IWebPartDefinition;
}

export interface IWebPartDefinitions extends _IWebPartDefinitions, IInvokable, ISharePointQueryableCollection { }

export const WebPartDefinitions = spInvokableFactory<IWebPartDefinitions>(_WebPartDefinitions);

export class _WebPartDefinition extends _SharePointQueryableInstance implements _IWebPartDefinition {

    public get webpart(): ISharePointQueryableInstance {
        return SharePointQueryableInstance(this, "webpart");
    }

    public saveChanges(): Promise<any> {
        return spPost(this.clone(WebPartDefinition, "SaveWebPartChanges"));
    }

    public moveTo(zoneId: string, zoneIndex: number): Promise<void> {
        return spPost(this.clone(WebPartDefinition, `MoveWebPartTo(zoneID='${zoneId}', zoneIndex=${zoneIndex})`));
    }

    public close(): Promise<void> {
        return spPost(this.clone(WebPartDefinition, "CloseWebPart"));
    }

    public open(): Promise<void> {
        return spPost(this.clone(WebPartDefinition, "OpenWebPart"));
    }

    public delete(): Promise<void> {
        return spPost(this.clone(WebPartDefinition, "DeleteWebPart"));
    }
}

export interface _IWebPartDefinition {
    /**
    * Gets the webpart information associated with this definition
    */
    readonly webpart: ISharePointQueryableInstance;

    /**
     * Saves changes to the Web Part made using other properties and methods on the SPWebPartDefinition object
     */
    saveChanges(): Promise<any>;

    /**
     * Moves the Web Part to a different location on a Web Part Page
     *
     * @param zoneId The ID of the Web Part Zone to which to move the Web Part
     * @param zoneIndex A Web Part zone index that specifies the position at which the Web Part is to be moved within the destination Web Part zone
     */
    moveTo(zoneId: string, zoneIndex: number): Promise<void>;

    /**
     * Closes the Web Part. If the Web Part is already closed, this method does nothing
     */
    close(): Promise<void>;

    /**
     * Opens the Web Part. If the Web Part is already closed, this method does nothing
     */
    open(): Promise<void>;

    /**
     * Removes a webpart from a page, all settings will be lost
     */
    delete(): Promise<void>;
}

export interface IWebPartDefinition extends _IWebPartDefinition, IInvokable, ISharePointQueryableInstance { }

export const WebPartDefinition = spInvokableFactory<IWebPartDefinition>(_WebPartDefinition);

export enum WebPartsPersonalizationScope {
    User = 0,
    Shared = 1,
}
