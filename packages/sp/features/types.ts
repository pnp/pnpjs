import { body, FromQueryable } from "@pnp/queryable";
import {
    _SharePointQueryableInstance,
    _SharePointQueryableCollection,
    spInvokableFactory,
} from "../sharepointqueryable.js";
import { defaultPath } from "../decorators.js";
import { spPost } from "../operations.js";
import { tag } from "../telemetry.js";

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

        const data = await spPost(Features(this, "add"), body({
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
        const feature = Feature(this).concat(`('${id}')`);
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

        return spPost(Features(this, "remove"), body({
            featureId: id,
            force: force,
        }));
    }
}
export interface IFeatures extends _Features { }
export const Features = spInvokableFactory<IFeatures>(_Features);

export class _Feature extends _SharePointQueryableInstance<IFeatureInfo> {

    /**
     * Removes (deactivates) the feature
     *
     * @param force If true the feature deactivation will be forced
     */
    @tag("fe.deactivate")
    public async deactivate(force = false): Promise<any> {

        // TODO:: test if this works with batching?
        // problems:
        // - If the request is batched then the initial request is batched and things are wrong
        // - we have at this point lost the non-batch .on.send, whatever it was, we need a way to recover?
        // - perhaps we need a way really to indicate local
        return Feature(this).using(FromQueryable(this)).select("DefinitionId")<{ DefinitionId: string }>().then(feature => {

            return Features(this.parentUrl, "").remove(feature.DefinitionId, force);
        });
    }
}
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
