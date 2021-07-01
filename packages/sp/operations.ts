import { op, get, post, patch, del } from "@pnp/queryable";
import { OLD_ISharePointQueryable } from "./sharepointqueryable.js";
import { ensureHeaders } from "@pnp/core";
import { defaultPipelineBinder, IOperation, cloneQueryableData, headers } from "@pnp/queryable";
import { SPHttpClient } from "./sphttpclient.js";
import { ISharePointQueryable } from "./sharepointqueryable.js";
import { IFetchOptions, mergeOptions, objectDefinedNotNull, IRequestClient, isFunc, Runtime } from "@pnp/core";
import { toAbsoluteUrl } from "./utils/toabsoluteurl.js";

// TODO:: do we need any of this??
// export function registerCustomRequestClientFactory(requestClientFactory: () => IRequestClient) {
//     httpClientFactory = isFunc(requestClientFactory) ? () => requestClientFactory : defaultFactory;
// }

// const defaultFactory = (runtime: Runtime) => () => new SPHttpClient(runtime);
// let httpClientFactory: (runtime: Runtime) => () => IRequestClient = defaultFactory;

// const send = (method: "GET" | "POST" | "DELETE" | "PATCH" | "PUT"): <T = any>(o: ISharePointQueryable, options?: IFetchOptions) => Promise<T> => {

//     return async function <T = any>(o: ISharePointQueryable, init?: IFetchOptions): Promise<T> {

//         // use the current runtime
//         const runtime = o.getRuntime();

//         const operation: IOperation = defaultPipelineBinder(httpClientFactory(runtime))(method);

//         const data = cloneQueryableData(o.data);
//         const batchDependency = objectDefinedNotNull(data.batch) ? data.batch.addDependency() : () => {
//             return;
//         };
//         const url = await toAbsoluteUrl(o.toUrlAndQuery(), runtime);

//         mergeOptions(data.options, options);

//         return operation(Object.assign({}, data, {
//             batchDependency,
//             url,
//         }));
//     };
// };

export const spGet = <T = any>(o: ISharePointQueryable<any>, init?: RequestInit): Promise<T> => {
    // TODO:: review this
    // Fix for #304 - when we clone objects we in some cases then execute a get request
    // in these cases the caching settings were getting dropped from the request
    // this tracks if the object from which this was cloned was caching and applies that to an immediate get request
    // does not affect objects cloned from this as we are using different fields to track the settings so it won't
    // be triggered
    // if (o.data.cloneParentWasCaching) {
    //     o.usingCaching(o.data.cloneParentCacheOptions);
    // }

    // // if we are forcing caching set that in the data here
    // if ((<any>o)._forceCaching) {
    //     o.data.useCaching = true;
    // }

    return op(o, get, init);
};

export const spPost = <T = any>(o: ISharePointQueryable<any>, init?: RequestInit): Promise<T> => op(o, post, init);

export const spDelete = <T = any>(o: ISharePointQueryable<any>, init?: RequestInit): Promise<T> => op(o, del, init);

export const spPatch = <T = any>(o: ISharePointQueryable<any>, init?: RequestInit): Promise<T> => op(o, patch, init);

export const spPostDelete = <T = any>(o: ISharePointQueryable<any>, init?: RequestInit): Promise<T> => {

    init = ensureHeaders(init, {
        "X-HTTP-Method": "DELETE",
    });

    return spPost<T>(o, init);
};

export const spPostDeleteETag = <T = any>(o: ISharePointQueryable<any>, init?: RequestInit, eTag = "*"): Promise<T> => {

    init = ensureHeaders(init, {
        "IF-Match": eTag,
    });

    return spPostDelete<T>(o, init);
};

export function registerCustomRequestClientFactory(requestClientFactory: () => IRequestClient) {
    httpClientFactory = isFunc(requestClientFactory) ? () => requestClientFactory : defaultFactory;
}

const defaultFactory = (runtime: Runtime) => () => new SPHttpClient(runtime);
let httpClientFactory: (runtime: Runtime) => () => IRequestClient = defaultFactory;

const send = (method: "GET" | "POST" | "DELETE" | "PATCH" | "PUT"): <T = any>(o: OLD_ISharePointQueryable, options?: IFetchOptions) => Promise<T> => {

    return async function <T = any>(o: OLD_ISharePointQueryable, options?: IFetchOptions): Promise<T> {

        // use the current runtime
        const runtime = o.getRuntime();

        const operation: IOperation = defaultPipelineBinder(httpClientFactory(runtime))(method);

        const data = cloneQueryableData(o.data);
        const batchDependency = objectDefinedNotNull(data.batch) ? data.batch.addDependency() : () => {
            return;
        };
        const url = await toAbsoluteUrl(o.toUrlAndQuery(), runtime);

        mergeOptions(data.options, options);

        return operation(Object.assign({}, data, {
            batchDependency,
            url,
        }));
    };
};

export const OLD_spGet = <T = any>(o: OLD_ISharePointQueryable<any>, options?: IFetchOptions): Promise<T> => {
    // Fix for #304 - when we clone objects we in some cases then execute a get request
    // in these cases the caching settings were getting dropped from the request
    // this tracks if the object from which this was cloned was caching and applies that to an immediate get request
    // does not affect objects cloned from this as we are using different fields to track the settings so it won't
    // be triggered
    if (o.data.cloneParentWasCaching) {
        o.usingCaching(o.data.cloneParentCacheOptions);
    }

    // if we are forcing caching set that in the data here
    if ((<any>o)._forceCaching) {
        o.data.useCaching = true;
    }

    return send("GET")(o, options);
};

export const OLD_spPost = <T = any>(o: OLD_ISharePointQueryable<any>, options?: IFetchOptions): Promise<T> => send("POST")(o, options);

export const OLD_spDelete = <T = any>(o: OLD_ISharePointQueryable<any>, options?: IFetchOptions): Promise<T> => send("DELETE")(o, options);

export const OLD_spPatch = <T = any>(o: OLD_ISharePointQueryable<any>, options?: IFetchOptions): Promise<T> => send("PATCH")(o, options);

export const OLD_spPostDelete = <T = any>(o: OLD_ISharePointQueryable<any>, options?: IFetchOptions): Promise<T> => {
    const opts = Object.assign(headers({ "X-HTTP-Method": "DELETE" }), options);
    return OLD_spPost<T>(o, opts);
};

export const OLD_spPostDeleteETag = <T = any>(o: OLD_ISharePointQueryable<any>, options?: IFetchOptions, eTag = "*"): Promise<T> => {
    const opts = Object.assign(headers({ "X-HTTP-Method": "DELETE", "IF-Match": eTag }), options);
    return OLD_spPost<T>(o, opts);
};

