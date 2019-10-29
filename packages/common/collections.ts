import { isFunc } from "./util";

declare var Object: {
    entries?: any;
    keys(o: any): any;
};

/**
 * Interface defining an object with a known property type
 */
export interface TypedHash<T> {
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
    if (o !== undefined && o !== null) {
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
export function mergeMaps<K, V>(target: Map<K, V>, ...maps: Map<K, V>[]): Map<K, V> {
    for (let i = 0; i < maps.length; i++) {
        maps[i].forEach((v: V, k: K) => {
            target.set(k, v);
        });
    }

    return target;
}
