import { body } from "@pnp/queryable";
import {
    _SPInstance,
    _SPCollection,
} from "../sharepointqueryable.js";
import { defaultPath } from "../decorators.js";
import { spPost } from "../operations.js";
import { tag } from "../telemetry.js";
import { IFeatureAddResult } from "./types.js";


/**
 * Adds (activates) the specified feature
 *
 * @param id The Id of the feature (GUID)
 * @param force If true the feature activation will be forced
 */
// @tag("fes.add")
export async function add(featureId: string, force = false): Promise<IFeatureAddResult> {

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
export function getById(id: string): IFeature {
    const feature = Feature(this).concat(`('${id}')`);
    return tag.configure(feature, "fes.getById");
}

/**
 * Removes (deactivates) a feature from the collection
 *
 * @param id The Id of the feature (GUID)
 * @param force If true the feature deactivation will be forced
 */
// @tag("fes.remove")
export async function remove(featureId: string, force = false): Promise<any> {

    return spPost(Features(this, "remove"), body({
        featureId,
        force,
    }));
}
