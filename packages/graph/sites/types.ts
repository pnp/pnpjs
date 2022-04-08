import { defaultPath } from "../decorators.js";
import { graphInvokableFactory, _GraphQueryableCollection, _GraphQueryableInstance } from "../graphqueryable.js";
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
        return Site(this, "root");
    }

    public getById(id: string): ISite {
        return Site(this, id);
    }
}
export interface ISites extends _Sites { }
export const Sites = graphInvokableFactory<ISites>(_Sites);

/**
 * Site
 */
export class _Site extends _GraphQueryableInstance<ISiteType> {

    public get sites(): ISites {
        return Sites(this);
    }
}
export interface ISite extends _Site { }
export const Site = graphInvokableFactory<ISite>(_Site);

