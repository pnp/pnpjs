import { IODataParser, ODataParser } from "./parsers";
import { IFetchOptions, IRequestClient, getGUID, objectDefinedNotNull } from "@pnp/common";
import { IQueryableData, cloneQueryableData } from "./queryable";
import { PipelineMethod, pipe, getDefaultPipeline } from "./pipeline";

/**
 * Methods which operate on queryables
 */

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

export function pipelineBinder(pipes: PipelineMethod<any>[]): IClientFactoryBinder {

    return function (clientFactory: () => IRequestClient): IMethodBinder {

        return function (method: string): IOperation {

            return function <ReturnType = any>(o: Partial<IQueryableData<ReturnType>>): Promise<ReturnType> {

                // send the IQueryableData down the pipeline
                return pipe(Object.assign({}, {
                    batch: o.batch || null,
                    batchDependency: null,
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
