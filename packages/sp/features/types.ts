import { body } from "@pnp/queryable";
import {
    _SPInstance,
    _SPCollection,
    spInvokableFactory,
} from "../spqueryable.js";
import { defaultPath } from "../decorators.js";
import { spPost } from "../operations.js";

@defaultPath("features")
export class _Features extends _SPCollection<IFeatureInfo[]> {

    /**
     * Adds (activates) the specified feature
     *
     * @param id The Id of the feature (GUID)
     * @param force If true the feature activation will be forced
     */
    public async add(featureId: string, force = false): Promise<IFeatureAddResult> {

        const data = await spPost(Features(this, "add"), body({
            featdefScope: 0,
            featureId,
            force,
        }));

        return {
            data: data,
            feature: this.getById(featureId),
        };
    }

    /**
     * Gets a feature from the collection with the specified guid
     *
     * @param id The Id of the feature (GUID)
     */
    public getById(id: string): IFeature {
        return Feature(this).concat(`('${id}')`);
    }

    /**
     * Removes (deactivates) a feature from the collection
     *
     * @param id The Id of the feature (GUID)
     * @param force If true the feature deactivation will be forced
     */
    public remove(featureId: string, force = false): Promise<any> {

        return spPost(Features(this, "remove"), body({
            featureId,
            force,
        }));
    }
}
export interface IFeatures extends _Features { }
export const Features = spInvokableFactory<IFeatures>(_Features);

export class _Feature extends _SPInstance<IFeatureInfo> { }
export interface IFeature extends _Feature { }
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
