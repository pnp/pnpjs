import { body } from "@pnp/queryable";
import { Extension as ExtensionType } from "@microsoft/microsoft-graph-types";
import { _GraphCollection, graphInvokableFactory, graphPatch, graphPost } from "../graphqueryable.js";
import { getById, IGetById, deleteable, IDeleteable, defaultPath } from "../decorators.js";

export interface IBaseExtensionData {
    extensionName: string;
}

/**
 * Open Extension
 */
@deleteable()
export class _OpenExtension extends _GraphCollection<ExtensionType> {

    public update<T extends IBaseExtensionData>(extension: T): Promise<any> {
        return graphPatch(this, body(extension));
    }
}
export interface IOpenExtension extends _OpenExtension, IDeleteable { }
export const OpenExtension = graphInvokableFactory<IOpenExtension>(_OpenExtension);

/**
 * Open Extensions
 */
@defaultPath("extensions")
@getById(OpenExtension)
export class _OpenExtensions extends _GraphCollection<ExtensionType> {

    public create<T extends IBaseExtensionData>(extension: T): Promise<any> {

        if (extension.extensionName.length > 30) {
            throw Error("Extension id length should be less than or equal to 30 characters.");
        }

        return graphPost(this, body(extension));
    }
}
export interface IOpenExtensions extends _OpenExtensions, IGetById<IOpenExtension> { }
export const OpenExtensions = graphInvokableFactory<IOpenExtensions>(_OpenExtensions);
