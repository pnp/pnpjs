import { IFetchOptions, mergeOptions, objectDefinedNotNull } from "@pnp/common";
import { defaultPipelineBinder, cloneQueryableData, IOperation } from "@pnp/odata";
import { GraphHttpClient } from "./graphhttpclient";
import { IGraphQueryable } from "./graphqueryable";
import { toAbsoluteUrl } from "./utils/toabsoluteurl";

const graphClientBinder = defaultPipelineBinder(() => new GraphHttpClient());

const send = <T>(operation: IOperation): (o: IGraphQueryable<T>, options?: IFetchOptions) => Promise<T> => {

    return async function <R = T>(o: IGraphQueryable<R>, options?: IFetchOptions): Promise<R> {

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

export const graphGet = <T = any>(o: IGraphQueryable<any>, options?: IFetchOptions): Promise<T> => send<T>(graphClientBinder("GET"))(o, options);

export const graphPost = <T = any>(o: IGraphQueryable<any>, options?: IFetchOptions): Promise<T> => send<T>(graphClientBinder("POST"))(o, options);

export const graphDelete = <T = any>(o: IGraphQueryable<any>, options?: IFetchOptions): Promise<T> => send<T>(graphClientBinder("DELETE"))(o, options);

export const graphPatch = <T = any>(o: IGraphQueryable<any>, options?: IFetchOptions): Promise<T> => send<T>(graphClientBinder("PATCH"))(o, options);

export const graphPut = <T = any>(o: IGraphQueryable<any>, options?: IFetchOptions): Promise<T> => send<T>(graphClientBinder("PUT"))(o, options);
