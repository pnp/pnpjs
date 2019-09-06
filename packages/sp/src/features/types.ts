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

@defaultPath("features")
export class _Features extends _SharePointQueryableCollection implements _IFeatures {

    public async add(id: string, force = false): Promise<IFeatureAddResult> {

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

    public getById(id: string): IFeature {
        const feature = Feature(this);
        feature.concat(`('${id}')`);
        return feature;
    }

    public remove(id: string, force = false): Promise<any> {

        return spPost(this.clone(Features, "remove"), body({
            featureId: id,
            force: force,
        }));
    }
}

/**
 * Describes a collection of features
 *
 */
export interface _IFeatures {
    /**
     * Adds (activates) the specified feature
     *
     * @param id The Id of the feature (GUID)
     * @param force If true the feature activation will be forced
     */
    add(id: string, force?: boolean): Promise<IFeatureAddResult>;

    /**	    
     * Gets a feature from the collection with the specified guid
     *	    
     * @param id The Id of the feature (GUID)	    
     */
    getById(id: string): IFeature;
    /**
     * Removes (deactivates) a feature from the collection
     *
     * @param id The Id of the feature (GUID)
     * @param force If true the feature deactivation will be forced
     */
    remove(id: string, force?: boolean): Promise<any>;
}

export interface IFeatures extends _IFeatures, IInvokable, ISharePointQueryableCollection {}

/**
 * Invokable factory for IFeatures instances
 */
export const Features = spInvokableFactory<IFeatures>(_Features);

export class _Feature extends _SharePointQueryableInstance implements _IFeature {

    public async deactivate(force = false): Promise<any> {

        const removeDependency = this.addBatchDependency();

        const feature = await Feature(this).select("DefinitionId")<{ DefinitionId: string; }>();

        const promise = this.getParent<IFeatures>(_Features, this.parentUrl, "", <SPBatch>this.batch).remove(feature.DefinitionId, force);

        removeDependency();

        return promise;
    }
}

/**
 * Describes a feature
 */
export interface _IFeature {
     /**
     * Removes (deactivates) the feature
     *
     * @param force If true the feature deactivation will be forced
     */
    deactivate(force?: boolean): Promise<any>;
}

export interface IFeature extends _IFeature, IInvokable, ISharePointQueryableInstance {}

/**
 * Invokable factory for IFeature instances
 */
export const Feature = spInvokableFactory<IFeature>(_Feature);

/**
 * Result from adding (activating) a feature to the collection
 */
export interface IFeatureAddResult {
    data: any;
    feature: IFeature;
}
