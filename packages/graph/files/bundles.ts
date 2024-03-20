import {
    _GraphInstance,
    _GraphCollection,
    graphInvokableFactory,
    GraphQueryable,
    graphPost,
    graphDelete,
} from "../graphqueryable.js";
import {
    Bundle as IBundleType,
    DriveItem as IDriveItemType,
} from "@microsoft/microsoft-graph-types";
import { defaultPath, getById, IGetById, deleteable, IDeleteable, updateable, IUpdateable } from "../decorators.js";
import { body } from "@pnp/queryable";


/**
 * Describes a Bundle instance
 * ONLY SUPPORTED IN PERSONAL ONEDRIVE
 */
@deleteable()
@updateable()
export class _Bundle extends _GraphInstance<IBundleType> {

    /**
     * Method for adding a drive item to a bundle.
     * @param id - The Id of a DriveItem object to add to the bundle
     * @returns void - 204 if successful
     */
    public async addItem(id: string): Promise<void> {
        return graphPost(this, body({ id }));
    }

    /**
     * Method for removing a drive item from a bundle.
     * @param id - The Id of a DriveItem object to remove from the bundle
     * @returns void - 204 if successful
     */
    public async removeItem(id: string): Promise<void> {
        return graphDelete(GraphQueryable(this,`/children/${id}`));
    }
}

export interface IBundle extends _Bundle, IDeleteable, IUpdateable { }
export const Bundle = graphInvokableFactory<IBundle>(_Bundle);

/**
 * Describes a collection of Bundle objects
 * ONLY SUPPORTED IN PERSONAL ONEDRIVE
 */
@defaultPath("bundles")
@getById(Bundle)
export class _Bundles extends _GraphCollection<IBundleType[]> {

    /**
     * Method for creating a new bundle.
     * @param bundleDef - IBundleDef object
     * @returns Microsoft Graph - DriveItem
     */
    public async create(bundleDef: IBundleDef): Promise<IDriveItemType> {
        return graphPost(this, body(bundleDef));
    }
}
export interface IBundles extends _Bundles, IGetById<IBundle> { }
export const Bundles = graphInvokableFactory<IBundles>(_Bundles);

export interface IBundleDef {
    name: string;
    "@microsoft.graph.conflictBehavior": "rename";
    bundle: IBundleType;
    children: {id: string}[];
}
