import {
    _SPQueryable,
    ISPQueryable,
    SPQueryable,
    _SPCollection,
    _SPInstance,
    spInvokableFactory,
    SPInstance,
    ISPInstance,
} from "../spqueryable.js";
import { body } from "@pnp/queryable";
import { spPost } from "../operations.js";

export class _LimitedWebPartManager extends _SPQueryable implements ILimitedWebPartManager {

    public get scope(): ISPQueryable {
        return SPQueryable(this, "Scope");
    }

    public get webparts(): IWebPartDefinitions {
        return WebPartDefinitions(this, "webparts");
    }

    public export(id: string): Promise<string> {
        return spPost(LimitedWebPartManagerCloneFactory(this, "ExportWebPart"), body({ webPartId: id }));
    }

    public import(xml: string): Promise<any> {
        return spPost(LimitedWebPartManagerCloneFactory(this, "ImportWebPart"), body({ webPartXml: xml }));
    }
}

export interface ILimitedWebPartManager {

    /**
     * Gets the scope of this web part manager (User = 0 or Shared = 1)
     */
    readonly scope: ISPQueryable;

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

export const LimitedWebPartManager = (baseUrl: string | ISPQueryable, path?: string): ILimitedWebPartManager => new _LimitedWebPartManager(baseUrl, path);

type LimitedWebPartManagerCloneType = ILimitedWebPartManager & ISPQueryable;
const LimitedWebPartManagerCloneFactory = (baseUrl: string | ISPQueryable, path?: string): LimitedWebPartManagerCloneType => <any>LimitedWebPartManager(baseUrl, path);

export class _WebPartDefinitions extends _SPCollection {

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
export interface IWebPartDefinitions extends _WebPartDefinitions {}
export const WebPartDefinitions = spInvokableFactory<IWebPartDefinitions>(_WebPartDefinitions);

export class _WebPartDefinition extends _SPInstance {

    /**
    * Gets the webpart information associated with this definition
    */
    public get webpart(): ISPInstance {
        return SPInstance(this, "webpart");
    }

    /**
     * Saves changes to the Web Part made using other properties and methods on the SPWebPartDefinition object
     */
    public saveChanges(): Promise<any> {
        return spPost(WebPartDefinition(this, "SaveWebPartChanges"));
    }

    /**
     * Moves the Web Part to a different location on a Web Part Page
     *
     * @param zoneId The ID of the Web Part Zone to which to move the Web Part
     * @param zoneIndex A Web Part zone index that specifies the position at which the Web Part is to be moved within the destination Web Part zone
     */
    public moveTo(zoneId: string, zoneIndex: number): Promise<void> {
        return spPost(WebPartDefinition(this, `MoveWebPartTo(zoneID='${zoneId}', zoneIndex=${zoneIndex})`));
    }

    /**
     * Closes the Web Part. If the Web Part is already closed, this method does nothing
     */
    public close(): Promise<void> {
        return spPost(WebPartDefinition(this, "CloseWebPart"));
    }

    /**
     * Opens the Web Part. If the Web Part is already closed, this method does nothing
     */
    public open(): Promise<void> {
        return spPost(WebPartDefinition(this, "OpenWebPart"));
    }

    /**
     * Removes a webpart from a page, all settings will be lost
     */
    public delete(): Promise<void> {
        return spPost(WebPartDefinition(this, "DeleteWebPart"));
    }
}
export interface IWebPartDefinition extends _WebPartDefinition {}
export const WebPartDefinition = spInvokableFactory<IWebPartDefinition>(_WebPartDefinition);

export enum WebPartsPersonalizationScope {
    User = 0,
    Shared = 1,
}
