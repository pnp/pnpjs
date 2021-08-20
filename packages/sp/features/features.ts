import { body, IInvokable, IQueryable2, Queryable2, queryableFactory } from "@pnp/queryable";
import {
    _SPInstance,
    _SPCollection,
    ISPQueryable,
} from "../sharepointqueryable.js";

import { IFeatureInfo } from "./types.js";

import * as _Features from "./_Features.js";

const _Features3 = await import ("./_Features.js");

// @defaultPath("features")


export type ISPInvokableFactory2<R> = (baseUrl: string | ISPQueryable, path?: string) => R & IInvokable;

export const spInvokableFactory2 = <T, R = any>(f: T, defaultPath?: string): ISPInvokableFactory2<T & Queryable2<R>> => {

    return <any>queryableFactory<any>(f);
};


// export interface IFeatures extends _Features { }
export const Features = spInvokableFactory2<typeof _Features, IFeatureInfo[]>(_Features, "features");

const u = Features("");

// sp would be extended via module augmentation
// we need to see if things are called how we expect
// 

const sp: { web: { features: ReturnType<typeof Features> } } = {

    web: {

        features: new Proxy(_Features, {
            get: (target: any, p: string) => Object.assign((handler: any) => {

                console.log("invoked");
                return target;

            }, _SPCollection),
        }),
    },
};

const hh = await sp.web.features();





