import { IODataParser, ODataParser } from "./parsers";
import { IFetchOptions, IRequestClient, getGUID, objectDefinedNotNull } from "@pnp/common";
import { IQueryableData, cloneQueryableData } from "./queryable";
import { PipelineMethod, pipe, getDefaultPipeline } from "./pipeline";

export interface IRequestOptions<T> extends IFetchOptions {
    parser: IODataParser<T>;
}

export interface IClientFactoryBinder {
    (clientFactory: () => IRequestClient): IMethodBinder;
}

export interface IPipelineBinder {
    (pipeline: PipelineMethod<any>[]): IClientFactoryBinder;
}

export interface IMethodBinder {
    (method: string): IOperation;
}

export interface IOperation {
    <ReturnType>(o: Partial<IQueryableData<ReturnType>>): Promise<ReturnType>;
}

// first we bind the pipeline we will use for all requests within this closure
export function pipelineBinder(pipes: PipelineMethod<any>[]): IClientFactoryBinder {

    // then we bind the client factory we'll use (typically done in an implementing library such as sp)
    return function (clientFactory: () => IRequestClient): IMethodBinder {

        // then we create a binder we can apply for each type of method (GET, POST, etc.)
        return function (method: string): IOperation {

            // finally we get a function back to which we can pass an IQueryableData instance and execute the request it defines
            return function <ReturnType = any>(o: Partial<IQueryableData<ReturnType>>): Promise<ReturnType> {

                // send the IQueryableData down the pipeline
                return pipe(Object.assign({}, {
                    batch: null,
                    batchDependency: null,
                    batchIndex: -1,
                    cachingOptions: null,
                    clientFactory,
                    cloneParentCacheOptions: null,
                    cloneParentWasCaching: false,
                    hasResult: false,
                    isBatched: objectDefinedNotNull(o.batch),
                    method,
                    options: null,
                    parentUrl: "",
                    parser: new ODataParser<ReturnType>(),
                    pipes: pipes.slice(0),
                    query: new Map<string, string>(),
                    requestId: getGUID(),
                    url: "",
                    useCaching: /^get$/i.test(o.method) && o.useCaching,
                }, cloneQueryableData(o)));
            };
        };
    };
}

export const defaultPipelineBinder: IClientFactoryBinder = pipelineBinder(getDefaultPipeline());
