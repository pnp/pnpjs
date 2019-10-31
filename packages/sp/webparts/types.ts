import {
    _SharePointQueryableInstance,
    _SharePointQueryableCollection,
    ISharePointQueryableInstance,
    _SharePointQueryable,
    ISharePointQueryable,
    spInvokableFactory,
    SharePointQueryable,
    SharePointQueryableInstance,
} from "../sharepointqueryable";
import { body } from "@pnp/odata";
import { spPost } from "../operations";
import { tag } from "../telemetry";

export class _LimitedWebPartManager extends _SharePointQueryable implements ILimitedWebPartManager {

    public get scope(): ISharePointQueryable {
        return tag.configure(SharePointQueryable(this, "Scope"), "f.scope");
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
export interface IWebPartDefinitions extends _WebPartDefinitions { }
export const WebPartDefinitions = spInvokableFactory<IWebPartDefinitions>(_WebPartDefinitions);

export class _WebPartDefinition extends _SharePointQueryableInstance {

    /**
    * Gets the webpart information associated with this definition
    */
    public get webpart(): ISharePointQueryableInstance {
        return SharePointQueryableInstance(this, "webpart");
    }

    /**
     * Saves changes to the Web Part made using other properties and methods on the SPWebPartDefinition object
     */
    public saveChanges(): Promise<any> {
        return spPost(this.clone(WebPartDefinition, "SaveWebPartChanges"));
    }

    /**
     * Moves the Web Part to a different location on a Web Part Page
     *
     * @param zoneId The ID of the Web Part Zone to which to move the Web Part
     * @param zoneIndex A Web Part zone index that specifies the position at which the Web Part is to be moved within the destination Web Part zone
     */
    public moveTo(zoneId: string, zoneIndex: number): Promise<void> {
        return spPost(this.clone(WebPartDefinition, `MoveWebPartTo(zoneID='${zoneId}', zoneIndex=${zoneIndex})`));
    }

    /**
     * Closes the Web Part. If the Web Part is already closed, this method does nothing
     */
    public close(): Promise<void> {
        return spPost(this.clone(WebPartDefinition, "CloseWebPart"));
    }

    /**
     * Opens the Web Part. If the Web Part is already closed, this method does nothing
     */
    public open(): Promise<void> {
        return spPost(this.clone(WebPartDefinition, "OpenWebPart"));
    }

    /**
     * Removes a webpart from a page, all settings will be lost
     */
    public delete(): Promise<void> {
        return spPost(this.clone(WebPartDefinition, "DeleteWebPart"));
    }
}
export interface IWebPartDefinition extends _WebPartDefinition { }
export const WebPartDefinition = spInvokableFactory<IWebPartDefinition>(_WebPartDefinition);

export enum WebPartsPersonalizationScope {
    User = 0,
    Shared = 1,
}
