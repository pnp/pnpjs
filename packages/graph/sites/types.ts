import { defaultPath } from "../decorators";
import { graphInvokableFactory, _GraphQueryableCollection, _GraphQueryableInstance } from "../graphqueryable";
import { Site as ISiteType } from "@microsoft/microsoft-graph-types";

/**
 * Sites
 */
@defaultPath("sites")
export class _Sites extends _GraphQueryableCollection<ISiteType[]> {
    /**
     * Gets the team site for the group
     */
    public get root(): ISite {
        return this.clone(Site, "root");
    }
}
export interface ISites extends _Sites { }
export const Sites = graphInvokableFactory<ISites>(_Sites);

/**
 * Site
 */
export class _Site extends _GraphQueryableInstance<ISiteType> {

    public get sites(): ISites {
        return this.clone(Sites);
    }
}
export interface ISite extends _Site { }
export const Site = graphInvokableFactory<ISite>(_Site);

