import { IRequestClient, assign, isFunc, hOP } from "@pnp/common";
import { LogLevel, Logger } from "@pnp/logging";
import { CachingOptions, CachingParserWrapper } from "./caching";
import { IQueryableData } from "./queryable";

/**
 * Defines the context for a given request to be processed in the pipeline
 */
export interface IRequestContext<ReturnType> extends IQueryableData<ReturnType> {
    result?: ReturnType;
    clientFactory: () => IRequestClient;
    hasResult: boolean;
    isBatched: boolean;
    requestId: string;
    method: string;
}

export type PipelineMethod<ReturnType> = (c: IRequestContext<ReturnType>) => Promise<IRequestContext<ReturnType>>;

/**
 * Resolves the context's result value
 *
 * @param context The current context
 */
function returnResult<T = any>(context: IRequestContext<T>): Promise<T> {

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
export function setResult<T = any>(context: IRequestContext<T>, value: any): Promise<IRequestContext<T>> {

    return new Promise<IRequestContext<T>>((resolve) => {

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
function next<T = any>(c: IRequestContext<T>): Promise<IRequestContext<T>> {

    return c.pipes.length > 0 ? c.pipes.shift()(c) : Promise.resolve(c);
}

/**
 * Executes the current request context's pipeline
 *
 * @param context Current context
 */
export function pipe<T = any>(context: IRequestContext<T>): Promise<T> {

    if (context.pipes.length < 1) {
        Logger.write(`[${context.requestId}] (${(new Date()).getTime()}) Request pipeline contains no methods!`, LogLevel.Error);
        throw Error("Request pipeline contains no methods!");
    }

    const promise = next(context).then(ctx => returnResult(ctx)).catch((e: Error) => {
        Logger.error(e);
        throw e;
    });

    if (context.isBatched) {
        // this will block the batch's execute method from returning until the child requests have been resolved
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
            return method.apply(target, args).then((ctx: IRequestContext<any>) => next(ctx));
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
    public static logStart<T = any>(context: IRequestContext<T>): Promise<IRequestContext<T>> {
        return new Promise<IRequestContext<T>>(resolve => {

            Logger.log({
                data: Logger.activeLogLevel === LogLevel.Info ? {} : context,
                level: LogLevel.Info,
                message: `[${context.requestId}] (${(new Date()).getTime()}) Beginning ${context.method} request (${context.url})`,
            });

            resolve(context);
        });
    }

    /**
     * Handles caching of the request
     */
    @requestPipelineMethod()
    public static caching<T = any>(context: IRequestContext<T>): Promise<IRequestContext<T>> {

        return new Promise<IRequestContext<T>>(resolve => {

            // handle caching, if applicable
            if (context.useCaching) {

                Logger.write(`[${context.requestId}] (${(new Date()).getTime()}) Caching is enabled for request, checking cache...`, LogLevel.Info);

                let cacheOptions = new CachingOptions(context.url.toLowerCase());
                if (context.cachingOptions !== undefined) {
                    cacheOptions = assign(cacheOptions, context.cachingOptions);
                }

                // we may not have a valid store
                if (cacheOptions.store !== null) {

                    // check if we have the data in cache and if so resolve the promise and return
                    let data = cacheOptions.store.get(cacheOptions.key);

                    if (data !== null) {

                        Logger.log({
                            data: Logger.activeLogLevel === LogLevel.Info ? {} : data,
                            level: LogLevel.Info,
                            message: `[${context.requestId}] (${(new Date()).getTime()}) Value returned from cache.`,
                        });

                        // ensure we clear any held batch dependency we are resolving from the cache
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
    public static send<T = any>(context: IRequestContext<T>): Promise<IRequestContext<T>> {

        return new Promise<IRequestContext<T>>((resolve, reject) => {
            // send or batch the request
            if (context.isBatched) {

                const p = context.batch.add(context);

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
                const opts = assign(context.options || {}, { method: context.method });
                client.fetch(context.url, opts)
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
    public static logEnd<T = any>(context: IRequestContext<T>): Promise<IRequestContext<T>> {

        return new Promise<IRequestContext<T>>(resolve => {

            if (context.isBatched) {

                Logger.log({
                    data: Logger.activeLogLevel === LogLevel.Info ? {} : context,
                    level: LogLevel.Info,
                    message: `[${context.requestId}] (${(new Date()).getTime()}) ${context.method} request will complete in batch ${context.batch.batchId}.`,
                });

            } else {

                Logger.log({
                    data: Logger.activeLogLevel === LogLevel.Info ? {} : context,
                    level: LogLevel.Info,
                    message: `[${context.requestId}] (${(new Date()).getTime()}) Completing ${context.method} request.`,
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
