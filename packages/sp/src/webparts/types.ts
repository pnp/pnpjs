import {
    _SharePointQueryableInstance,
    _SharePointQueryableCollection,
    ISharePointQueryableCollection,
    ISharePointQueryableInstance,
    _SharePointQueryable,
    ISharePointQueryable,
    spInvokableFactory,
} from "../sharepointqueryable";
import { IInvokable, body } from "@pnp/odata";
import { SharePointQueryableInstance } from "../sp";
import { spPost } from "../operations";

export class _LimitedWebPartManager extends _SharePointQueryable implements ILimitedWebPartManager {

    /**
     * Gets the set of web part definitions contained by this web part manager
     *
     */
    public get webparts(): IWebPartDefinitions {
        return WebPartDefinitions(this, "webparts");
    }

    /**
     * Exports a webpart definition
     *
     * @param id the GUID id of the definition to export
     */
    public export(id: string): Promise<string> {

        return spPost(this.clone(LimitedWebPartManagerCloneFactory, "ExportWebPart"), body({ webPartId: id }));
    }

    /**
     * Imports a webpart
     *
     * @param xml webpart definition which must be valid XML in the .dwp or .webpart format
     */
    public import(xml: string): Promise<any> {

        return spPost(this.clone(LimitedWebPartManagerCloneFactory, "ImportWebPart"), body({ webPartXml: xml }));
    }
}

export interface ILimitedWebPartManager {
    readonly webparts: IWebPartDefinitions;
    export(id: string): Promise<string>;
    import(xml: string): Promise<any>;
}

export const LimitedWebPartManager = (baseUrl: string | ISharePointQueryable, path?: string): ILimitedWebPartManager => new _LimitedWebPartManager(baseUrl, path);

type LimitedWebPartManagerCloneType = ILimitedWebPartManager & ISharePointQueryable;
const LimitedWebPartManagerCloneFactory = (baseUrl: string | ISharePointQueryable, path?: string): LimitedWebPartManagerCloneType => <any>LimitedWebPartManager(baseUrl, path);

export class _WebPartDefinitions extends _SharePointQueryableCollection {

    /**
     * Gets a web part definition from the collection by id
     *
     * @param id The storage ID of the SPWebPartDefinition to retrieve
     */
    public getById(id: string): IWebPartDefinition {
        return WebPartDefinition(this, `getbyid('${id}')`);
    }

    /**
     * Gets a web part definition from the collection by storage id
     *
     * @param id The WebPart.ID of the SPWebPartDefinition to retrieve
     */
    public getByControlId(id: string): IWebPartDefinition {
        return WebPartDefinition(this, `getByControlId('${id}')`);
    }
}

export interface IWebPartDefinitions extends IInvokable, ISharePointQueryableCollection {
    getById(id: string): IWebPartDefinition;
    getByControlId(id: string): IWebPartDefinition;
}
export interface _WebPartDefinitions extends IInvokable { }
export const WebPartDefinitions = spInvokableFactory<IWebPartDefinitions>(_WebPartDefinitions);


export class _WebPartDefinition extends _SharePointQueryableInstance implements IWebPartDefinition {

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

export interface IWebPartDefinition extends IInvokable, ISharePointQueryableInstance {
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
export interface IWebPartDefinition extends IInvokable { }
export const WebPartDefinition = spInvokableFactory<IWebPartDefinition>(_WebPartDefinition);

export enum WebPartsPersonalizationScope {
    User = 0,
    Shared = 1,
}
