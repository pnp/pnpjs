import { defaultPipelineBinder, IOperation, cloneQueryableData, headers } from "@pnp/odata";
import { SPHttpClient } from "./sphttpclient";
import { ISharePointQueryable } from "./sharepointqueryable";
import { IFetchOptions, mergeOptions, objectDefinedNotNull, IRequestClient, isFunc } from "@pnp/common";
import { toAbsoluteUrl } from "./utils/toabsoluteurl";

export function registerCustomRequestClientFactory(requestClientFactory: () => IRequestClient) {
    factory = isFunc(requestClientFactory) ? requestClientFactory : () => new SPHttpClient();
}

let factory: () => IRequestClient = () => new SPHttpClient();

const send = (method: "GET" | "POST" | "DELETE" | "PATCH" | "PUT"): <T = any>(o: ISharePointQueryable, options?: IFetchOptions) => Promise<T> => {

    const operation: IOperation = defaultPipelineBinder(factory)(method);

    return async function <T = any>(o: ISharePointQueryable, options?: IFetchOptions): Promise<T> {

        const data = cloneQueryableData(o.data);
        const batchDependency = objectDefinedNotNull(data.batch) ? data.batch.addDependency() : () => { return; };
        const url = await toAbsoluteUrl(o.toUrlAndQuery());

        mergeOptions(data.options, options);

        return operation(Object.assign({}, data, {
            batchDependency,
            url,
        }));
    };
};

export const spGet = <T = any>(o: ISharePointQueryable<any>, options?: IFetchOptions): Promise<T> => {
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

export const spPost = <T = any>(o: ISharePointQueryable<any>, options?: IFetchOptions): Promise<T> => send("POST")(o, options);

export const spDelete = <T = any>(o: ISharePointQueryable<any>, options?: IFetchOptions): Promise<T> => send("DELETE")(o, options);

export const spPatch = <T = any>(o: ISharePointQueryable<any>, options?: IFetchOptions): Promise<T> => send("PATCH")(o, options);

export const spPostDelete = <T = any>(o: ISharePointQueryable<any>, options?: IFetchOptions): Promise<T> => {
    const opts = Object.assign(headers({ "X-HTTP-Method": "DELETE" }), options);
    return spPost<T>(o, opts);
};

export const spPostDeleteETag = <T = any>(o: ISharePointQueryable<any>, options?: IFetchOptions, eTag = "*"): Promise<T> => {
    const opts = Object.assign(headers({ "X-HTTP-Method": "DELETE", "IF-Match": eTag }), options);
    return spPost<T>(o, opts);
};
