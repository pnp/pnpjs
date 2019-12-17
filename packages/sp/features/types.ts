import { body } from "@pnp/odata";
import {
    _SharePointQueryableInstance,
    _SharePointQueryableCollection,
    spInvokableFactory,
} from "../sharepointqueryable";
import { defaultPath } from "../decorators";
import { spPost } from "../operations";
import { SPBatch } from "../batch";
import { tag } from "../telemetry";

@defaultPath("features")
export class _Features extends _SharePointQueryableCollection<IFeatureInfo[]> {

    /**
     * Adds (activates) the specified feature
     *
     * @param id The Id of the feature (GUID)
     * @param force If true the feature activation will be forced
     */
    @tag("fes.add")
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

    /**	    
     * Gets a feature from the collection with the specified guid
     *	    
     * @param id The Id of the feature (GUID)	    
     */
    public getById(id: string): IFeature {
        const feature = Feature(this);
        feature.concat(`('${id}')`);
        return tag.configure(feature, "fes.getById");
    }

    /**
     * Removes (deactivates) a feature from the collection
     *
     * @param id The Id of the feature (GUID)
     * @param force If true the feature deactivation will be forced
     */
    @tag("fes.remove")
    public remove(id: string, force = false): Promise<any> {

        return spPost(this.clone(Features, "remove"), body({
            featureId: id,
            force: force,
        }));
    }
}
export interface IFeatures extends _Features {}
export const Features = spInvokableFactory<IFeatures>(_Features);

export class _Feature extends _SharePointQueryableInstance<IFeatureInfo> {

    /**
     * Removes (deactivates) the feature
     *
     * @param force If true the feature deactivation will be forced
     */
    @tag("fe.deactivate")
    public async deactivate(force = false): Promise<any> {

        const removeDependency = this.addBatchDependency();

        const feature = await Feature(this).select("DefinitionId")<{ DefinitionId: string; }>();

        const promise = this.getParent<IFeatures>(Features, this.parentUrl, "", <SPBatch>this.batch).remove(feature.DefinitionId, force);

        removeDependency();

        return promise;
    }
}
export interface IFeature extends _Feature {}
export const Feature = spInvokableFactory<IFeature>(_Feature);

/**
 * Result from adding (activating) a feature to the collection
 */
export interface IFeatureAddResult {
    data: IFeatureInfo;
    feature: IFeature;
}

export interface IFeatureInfo {
    DefinitionId: string;
}
