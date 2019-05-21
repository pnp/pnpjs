import { IInvokable, body } from "@pnp/odata";
import {
    _SharePointQueryableInstance,
    ISharePointQueryableCollection,
    ISharePointQueryableInstance,
    _SharePointQueryableCollection,
    spInvokableFactory,
} from "../sharepointqueryable";
import { defaultPath } from "../decorators";
import { spPost } from "../operations";
import { SPBatch } from "../batch";

/**
 * Describes a collection of List objects
 *
 */
@defaultPath("features")
export class _Features extends _SharePointQueryableCollection implements IFeatures {

    /**
     * Adds a new list to the collection
     *
     * @param id The Id of the feature (GUID)
     * @param force If true the feature activation will be forced
     */
    public async add(id: string, force = false): Promise<FeatureAddResult> {

        const data = await spPost(this.clone(Features, "add"), body({
            featdefScope: 0,
            featureId: id,
            force: force,
        }));

        return {
            data: data,
            feature: this.getById(id),
        };
    }

    /**	    
     * Gets a list from the collection by guid id	     
     *	    
     * @param id The Id of the feature (GUID)	    
     */
    public getById(id: string): IFeature {
        const feature = Feature(this);
        feature.concat(`('${id}')`);
        return feature;
    }

    /**
     * Removes (deactivates) a feature from the collection
     *
     * @param id The Id of the feature (GUID)
     * @param force If true the feature deactivation will be forced
     */
    public remove(id: string, force = false): Promise<any> {

        return spPost(this.clone(Features, "remove"), body({
            featureId: id,
            force: force,
        }));
    }
}

export interface IFeatures extends IInvokable, ISharePointQueryableCollection {
    add(id: string, force?: boolean): Promise<FeatureAddResult>;
    getById(id: string): IFeature;
    remove(id: string, force?: boolean): Promise<any>;
}
export interface _Features extends IInvokable { }
export const Features = spInvokableFactory<IFeatures>(_Features);

export class _Feature extends _SharePointQueryableInstance implements IFeature {

    /**
     * Removes (deactivates) a feature from the collection
     *
     * @param force If true the feature deactivation will be forced
     */
    public async deactivate(force = false): Promise<any> {

        const removeDependency = this.addBatchDependency();

        const feature = await Feature(this).select("DefinitionId")<{ DefinitionId: string; }>();

        const promise = this.getParent(_Features, this.parentUrl, "", <SPBatch>this.batch).remove(feature.DefinitionId, force);

        removeDependency();

        return promise;
    }
}

export interface IFeature extends IInvokable, ISharePointQueryableInstance {
    deactivate(force?: boolean): Promise<any>;
}
export interface _Feature extends IInvokable { }
export const Feature = spInvokableFactory<IFeature>(_Feature);

export interface FeatureAddResult {
    data: any;
    feature: IFeature;
}
