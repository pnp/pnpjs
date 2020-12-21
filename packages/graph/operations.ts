import { Runtime, IFetchOptions, IRequestClient, isFunc, mergeOptions, objectDefinedNotNull } from "@pnp/common";
import { defaultPipelineBinder, cloneQueryableData, IOperation } from "@pnp/odata";
import { GraphHttpClient } from "./graphhttpclient.js";
import { IGraphQueryable } from "./graphqueryable.js";
import { toAbsoluteUrl } from "./utils/toabsoluteurl.js";

export function registerCustomRequestClientFactory(requestClientFactory: () => IRequestClient) {
    httpClientFactory = isFunc(requestClientFactory) ? () => requestClientFactory : defaultFactory;
}

const defaultFactory = (runtime: Runtime) => () => new GraphHttpClient(runtime);
let httpClientFactory: (runtime: Runtime) => () => IRequestClient = defaultFactory;

const send = (method: "GET" | "POST" | "DELETE" | "PATCH" | "PUT"): <T = any>(o: IGraphQueryable<T>, options?: IFetchOptions) => Promise<T> => {

    return async function <T = any>(o: IGraphQueryable, options?: IFetchOptions): Promise<T> {

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

export const graphGet = <T = any>(o: IGraphQueryable<any>, options?: IFetchOptions): Promise<T> => send("GET")(o, options);

export const graphPost = <T = any>(o: IGraphQueryable<any>, options?: IFetchOptions): Promise<T> => send("POST")(o, options);

export const graphDelete = <T = any>(o: IGraphQueryable<any>, options?: IFetchOptions): Promise<T> => send("DELETE")(o, options);

export const graphPatch = <T = any>(o: IGraphQueryable<any>, options?: IFetchOptions): Promise<T> => send("PATCH")(o, options);

export const graphPut = <T = any>(o: IGraphQueryable<any>, options?: IFetchOptions): Promise<T> => send("PUT")(o, options);
