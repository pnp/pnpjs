import { FetchOptions, RequestClient, extend, isFunc, hOP } from "@pnp/common";
import { LogLevel, Logger } from "@pnp/logging";
import { CachingOptions, CachingParserWrapper, ICachingOptions } from "./caching";
import { ODataBatch } from "./odatabatch";
import { ODataParser } from "./parsers";

export type PipelineMethod<T> = (c: RequestContext<T>) => Promise<RequestContext<T>>;

/**
 * Defines the context for a given request to be processed in the pipeline
 */
export interface RequestContext<T> {
    batch: ODataBatch;
    batchDependency: () => void;
    cachingOptions: ICachingOptions;
    hasResult?: boolean;
    isBatched: boolean;
    isCached: boolean;
    options: FetchOptions;
    parser: ODataParser<T>;
    pipeline: PipelineMethod<T>[];
    requestAbsoluteUrl: string;
    requestId: string;
    result?: T;
    verb: string;
    clientFactory: () => RequestClient;
}

/**
 * Resolves the context's result value
 *
 * @param context The current context
 */
function returnResult<T>(context: RequestContext<T>): Promise<T> {

    Logger.log({
        data: Logger.activeLogLevel === LogLevel.Verbose ? context.result : {},
        level: LogLevel.Info,
        message: `[${context.requestId}] (${(new Date()).getTime()}) Returning result from pipeline. Set logging to verbose to see data.`,
    });

    return Promise.resolve(context.result!);
}

/**
 * Sets the result on the context
 */
export function setResult<T>(context: RequestContext<T>, value: any): Promise<RequestContext<T>> {

    return new Promise<RequestContext<T>>((resolve) => {

        context.result = value;
        context.hasResult = true;
        resolve(context);
    });
}

/**
 * Invokes the next method in the provided context's pipeline
 *
 * @param c The current request context
 */
function next<T>(c: RequestContext<T>): Promise<RequestContext<T>> {

    if (c.pipeline.length > 0) {
        return c.pipeline.shift()!(c);
    } else {
        return Promise.resolve(c);
    }
}

/**
 * Executes the current request context's pipeline
 *
 * @param context Current context
 */
export function pipe<T>(context: RequestContext<T>): Promise<T> {

    if (context.pipeline.length < 1) {
        Logger.write(`[${context.requestId}] (${(new Date()).getTime()}) Request pipeline contains no methods!`, LogLevel.Warning);
    }

    const promise = next(context).then(ctx => returnResult(ctx)).catch((e: Error) => {
        Logger.error(e);
        throw e;
    });

    if (context.isBatched) {
        // this will block the batch's execute method from returning until the child requets have been resolved
        context.batch.addResolveBatchDependency(promise);
    }

    return promise;
}

/**
 * decorator factory applied to methods in the pipeline to control behavior
 */
export function requestPipelineMethod(alwaysRun = false) {

    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

        const method = descriptor.value;

        descriptor.value = function (...args: any[]) {

            // if we have a result already in the pipeline, pass it along and don't call the tagged method
            if (!alwaysRun && args.length > 0 && hOP(args[0], "hasResult") && args[0].hasResult) {
                Logger.write(`[${args[0].requestId}] (${(new Date()).getTime()}) Skipping request pipeline method ${propertyKey}, existing result in pipeline.`, LogLevel.Verbose);
                return Promise.resolve(args[0]);
            }

            // apply the tagged method
            Logger.write(`[${args[0].requestId}] (${(new Date()).getTime()}) Calling request pipeline method ${propertyKey}.`, LogLevel.Verbose);

            // then chain the next method in the context's pipeline - allows for dynamic pipeline
            return method.apply(target, args).then((ctx: RequestContext<any>) => next(ctx));
        };
    };
}

/**
 * Contains the methods used within the request pipeline
 */
export class PipelineMethods {

    /**
     * Logs the start of the request
     */
    @requestPipelineMethod(true)
    public static logStart<T>(context: RequestContext<T>): Promise<RequestContext<T>> {
        return new Promise<RequestContext<T>>(resolve => {

            Logger.log({
                data: Logger.activeLogLevel === LogLevel.Info ? {} : context,
                level: LogLevel.Info,
                message: `[${context.requestId}] (${(new Date()).getTime()}) Beginning ${context.verb} request (${context.requestAbsoluteUrl})`,
            });

            resolve(context);
        });
    }

    /**
     * Handles caching of the request
     */
    @requestPipelineMethod()
    public static caching<T>(context: RequestContext<T>): Promise<RequestContext<T>> {

        return new Promise<RequestContext<T>>(resolve => {

            // handle caching, if applicable
            if (context.isCached) {

                Logger.write(`[${context.requestId}] (${(new Date()).getTime()}) Caching is enabled for request, checking cache...`, LogLevel.Info);

                let cacheOptions = new CachingOptions(context.requestAbsoluteUrl.toLowerCase());
                if (context.cachingOptions !== undefined) {
                    cacheOptions = extend(cacheOptions, context.cachingOptions);
                }

                // we may not have a valid store
                if (cacheOptions.store !== null) {
                    // check if we have the data in cache and if so resolve the promise and return
                    let data = cacheOptions.store.get(cacheOptions.key);
                    if (data !== null) {
                        // ensure we clear any held batch dependency we are resolving from the cache
                        Logger.log({
                            data: Logger.activeLogLevel === LogLevel.Info ? {} : data,
                            level: LogLevel.Info,
                            message: `[${context.requestId}] (${(new Date()).getTime()}) Value returned from cache.`,
                        });
                        if (isFunc(context.batchDependency)) {
                            context.batchDependency();
                        }
                        // handle the case where a parser needs to take special actions with a cached result
                        if (hOP(context.parser, "hydrate")) {
                            data = context.parser.hydrate(data);
                        }
                        return setResult(context, data).then(ctx => resolve(ctx));
                    }
                }

                Logger.write(`[${context.requestId}] (${(new Date()).getTime()}) Value not found in cache.`, LogLevel.Info);

                // if we don't then wrap the supplied parser in the caching parser wrapper
                // and send things on their way
                context.parser = new CachingParserWrapper(context.parser, cacheOptions);
            }

            return resolve(context);
        });
    }

    /**
     * Sends the request
     */
    @requestPipelineMethod()
    public static send<T>(context: RequestContext<T>): Promise<RequestContext<T>> {

        return new Promise<RequestContext<T>>((resolve, reject) => {
            // send or batch the request
            if (context.isBatched) {

                // we are in a batch, so add to batch, remove dependency, and resolve with the batch's promise
                const p = context.batch.add(context.requestAbsoluteUrl, context.verb, context.options, context.parser, context.requestId);

                // we release the dependency here to ensure the batch does not execute until the request is added to the batch
                if (isFunc(context.batchDependency)) {
                    context.batchDependency();
                }

                Logger.write(`[${context.requestId}] (${(new Date()).getTime()}) Batching request in batch ${context.batch.batchId}.`, LogLevel.Info);

                // we set the result as the promise which will be resolved by the batch's execution
                resolve(setResult(context, p));

            } else {

                Logger.write(`[${context.requestId}] (${(new Date()).getTime()}) Sending request.`, LogLevel.Info);

                // we are not part of a batch, so proceed as normal
                const client = context.clientFactory();
                const opts = extend(context.options || {}, { method: context.verb });
                client.fetch(context.requestAbsoluteUrl, opts)
                    .then(response => context.parser.parse(response))
                    .then(result => setResult(context, result))
                    .then(ctx => resolve(ctx))
                    .catch(e => reject(e));
            }
        });
    }

    /**
     * Logs the end of the request
     */
    @requestPipelineMethod(true)
    public static logEnd<T>(context: RequestContext<T>): Promise<RequestContext<T>> {

        return new Promise<RequestContext<T>>(resolve => {

            if (context.isBatched) {

                Logger.log({
                    data: Logger.activeLogLevel === LogLevel.Info ? {} : context,
                    level: LogLevel.Info,
                    message: `[${context.requestId}] (${(new Date()).getTime()}) ${context.verb} request will complete in batch ${context.batch.batchId}.`,
                });

            } else {

                Logger.log({
                    data: Logger.activeLogLevel === LogLevel.Info ? {} : context,
                    level: LogLevel.Info,
                    message: `[${context.requestId}] (${(new Date()).getTime()}) Completing ${context.verb} request.`,
                });
            }

            resolve(context);
        });
    }
}

export function getDefaultPipeline() {
    return [
        PipelineMethods.logStart,
        PipelineMethods.caching,
        PipelineMethods.send,
        PipelineMethods.logEnd,
    ].slice(0);
}
