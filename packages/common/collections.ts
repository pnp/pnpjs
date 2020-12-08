import { isFunc, objectDefinedNotNull } from "./util.js";

/**
 * Interface defining an object with a known property type
 */
export interface ITypedHash<T> {
    [key: string]: T;
}

/**
 * Used to calculate the object properties, with polyfill if needed
 */
const objectEntries: any = isFunc(Object.entries) ? Object.entries : (o: any): [any, any][] => Object.keys(o).map((k: any) => [k, o[k]]);

/**
 * Converts the supplied object to a map
 * 
 * @param o The object to map
 */
export function objectToMap<K, V>(o: any): Map<K, V> {
    if (objectDefinedNotNull(o)) {
        return new Map(objectEntries(o));
    }
    return new Map();
}

/**
 * Merges to Map instances together, overwriting values in target with matching keys, last in wins
 * 
 * @param target map into which the other maps are merged
 * @param maps One or more maps to merge into the target 
 */
export function mergeMaps<K = string, V = any>(target: Map<K, V>, ...maps: Map<K, V>[]): Map<K, V> {
    for (let i = 0; i < maps.length; i++) {
        maps[i].forEach((v: V, k: K) => {

            // let's not run the spfx context through Object.assign :)
            if ((typeof k === "string" && k !== "spfxContext") && Object.prototype.toString.call(v) === "[object Object]") {
                // we only handle one level of deep object merging
                target.set(k, Object.assign({}, target.get(k) || {}, v));
            } else {
                target.set(k, v);
            }
        });
    }

    return target;
}
