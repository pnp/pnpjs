// import {
//     combine,
//     IFetchOptions,
//     IConfigOptions,
//     mergeOptions,
//     objectDefinedNotNull,
//     IRequestClient,
//     assign,
//     ILibraryConfiguration,
//     ITypedHash,
//     Runtime,
//     DefaultRuntime,
//     dateAdd,
//     stringIsNullOrEmpty,
// } from "@pnp/common";
import {
    combine,
    getGUID,
} from "@pnp/common";
import { LogLevel } from "@pnp/logging/logger.js";
import { NoEmitOnErrorsPlugin } from "webpack";
import { asyncReduce, broadcast, request } from "./moments.js";
import { Timeline } from "./timeline.js";

export type QueryableRequestInit = Pick<RequestInit, "method" | "referrer" | "referrerPolicy" | "mode" | "credentials" | "cache" | "redirect" | "integrity"> & {
    headers?: Record<string, string>;
};

export type QueryablePreObserver = (this: IQueryable2, url: URL, init: RequestInit, result: any) => Promise<[URL, RequestInit, any]>;

export type QueryableAuthObserver = (this: IQueryable2, url: URL, init: RequestInit) => Promise<[URL, RequestInit]>;

export type QueryableSendObserver = (this: IQueryable2, url: URL, init: RequestInit) => Promise<Response>;

export type QueryableParseObserver = (this: IQueryable2, url: URL, response: Response, result: any | undefined) => Promise<[URL, Response, any]>;

export type QueryablePostObserver = (this: IQueryable2, url: URL, result: any | undefined) => Promise<[URL, any]>;

export type QueryableDataObserver<T = any> = (this: IQueryable2, result: T) => void;

export type QueryableNewObserver = (this: IQueryable2, s: string) => void;

const DefaultBehaviors = {
    pre: asyncReduce<QueryablePreObserver>(),
    auth: asyncReduce<QueryableAuthObserver>(),
    send: request<QueryableSendObserver>(),
    parse: asyncReduce<QueryableParseObserver>(),
    post: asyncReduce<QueryablePostObserver>(),
    data: broadcast<QueryableDataObserver>(),
} as const;

// export interface IQueryableData<DefaultActionType = any> {

//     batch: Batch | null;
//     batchIndex: number;
//     batchDependency: () => void | null;

//     cachingOptions: ICachingOptions | null;

//     cloneParentCacheOptions: ICachingOptions | null;
//     cloneParentWasCaching: boolean;

//     query: Map<string, string>;


//     options: IFetchOptions | null;
//     url: string;
//     parentUrl: string;

//     useCaching: boolean;
//     pipes?: PipelineMethod<DefaultActionType>[];
//     parser?: IODataParser<DefaultActionType>;

//     clientFactory?: () => IRequestClient;

//     method?: string;

// }

export interface IQueryable2 extends Timeline<any> {
    // data: Partial<IQueryableData<DefaultActionType>>;
    // query: Map<string, string>;
    // append(pathPart: string): void;
    // inBatch(batch: Batch): this;
    // addBatchDependency(): () => void;
    // toUrlAndQuery(): string;
    toUrl(): string;
    // concat(pathPart: string): this;
    // configure(options: IConfigOptions): this;
    // configureFrom(o: IQueryable<DefaultActionType>): this;
    // usingCaching(options?: ICachingOptions): this;
    // usingParser(parser: IODataParser<any>): this;
    // withPipeline(pipeline: PipelineMethod<DefaultActionType>[]): this;
    // defaultAction(options?: IFetchOptions): Promise<DefaultActionType>;
    // getRuntime(): Runtime;
    // setRuntime(runtime: Runtime): this;
    // setRuntime(cloneGlobal: boolean, additionalConfig?: ITypedHash<any>): this;
}

export class Queryable2 extends Timeline<typeof DefaultBehaviors> {

    private _parent: Queryable2;
    private _url: string;
    private _query: Map<string, string>;

    constructor(init: Queryable2 | string, path?: string) {

        let url = "";
        let parent = null;
        let observers;

        if (typeof init === "string") {

            url = combine(init, path);

        } else {

            const { _url, _parent } = init;

            url = combine(_url, path);
            parent = _parent || null;
            observers = init.observers;
        }

        super(DefaultBehaviors, observers);

        this._url = url;
        this._parent = parent;
        this._query = new Map<string, string>();
    }

    public using(behavior: (intance: this) => this): this {
        return behavior(this);
    }

    /**
     * Gets the full url with query information
     *
     */
    public toRequestUrl(): URL {

        const u = new URL(this.toUrl());

        if (this._query.size > 0) {
            u.search = Array.from(this._query).map((v: [string, string]) => `${v[0]}=${encodeURIComponent(v[1])}`).join("&");
        }

        return u;
    }

    public get query(): Map<string, string> {
        return this._query;
    }

    /**
     * Gets the current url
     *
     */
    public toUrl(): string {
        return this._url;
    }
}

// TODO:: do you like the idea that the pipeline logic is contained in functions with this signature
// then anyone can write any pipeline that can be applied to a Queryable2 - making it super easy to add moments to the timeline and then use them
// in your application
export async function queryableDefaultRequest(this: Queryable2, requestInit: RequestInit = { method: "GET", headers: {} }): Promise<any> {

    setTimeout(async () => {

        const requestId = getGUID();

        try {

            this.emit.log(`[id:${requestId}] Beginning request`, LogLevel.Info);

            let [url, init, result] = await this.emit.pre(this.toRequestUrl(), requestInit, undefined);

            this.emit.log(`[id:${requestId}] Url: ${url}`, LogLevel.Info);

            if (typeof result !== "undefined") {
                this.emit.data(result);

                // TODO:: do we still run post tasks here? We did NOT in v2, but different architecture
                return;
            }

            this.emit.log(`[id:${requestId}] Emitting auth`, LogLevel.Verbose);
            [url, init] = await this.emit.auth(url, init);
            this.emit.log(`[id:${requestId}] Emitted auth`, LogLevel.Verbose);

            this.emit.log(`[id:${requestId}] Emitting send`, LogLevel.Verbose);
            let response = await this.emit.send(url, init);
            this.emit.log(`[id:${requestId}] Emitted send`, LogLevel.Verbose);

            this.emit.log(`[id:${requestId}] Emitting parse`, LogLevel.Verbose);
            [url, response, result] = await this.emit.parse(url, response, result);
            this.emit.log(`[id:${requestId}] Emitted parse`, LogLevel.Verbose);

            this.emit.log(`[id:${requestId}] Emitting post`, LogLevel.Verbose);
            [url, result] = await this.emit.post(url, result);
            this.emit.log(`[id:${requestId}] Emitted post`, LogLevel.Verbose);

            // TODO:: how do we handle the case where the request pipeline has worked as expected, however
            // the result remains undefined? We shouldn't emit data as we don't have any, but should we have a
            // completed event to signal the request is completed?
            if (typeof result !== "undefined") {
                this.emit.log(`[id:${requestId}] Emitting data`, LogLevel.Verbose);
                this.emit.data(result);
                this.emit.log(`[id:${requestId}] Emitted data`, LogLevel.Verbose);
            }

        } catch (e) {

            this.emit.log(`[id:${requestId}] Emitting error: "${e.message || e}"`, LogLevel.Error);
            // anything that throws we emit and continue
            this.emit.error(e);
            this.emit.log(`[id:${requestId}] Emitted error: "${e.message || e}"`, LogLevel.Error);

        } finally {

            this.emit.log(`[id:${requestId}] Finished request`, LogLevel.Info);
        }

    }, 0);

    return new Promise((resolve, reject) => {
        this.on.data(resolve);
        this.on.error(reject);
    });
}

export async function queryableDefaultRequest2(this: Queryable2, requestInit: RequestInit = { method: "GET", headers: {} }): Promise<any> {
    setTimeout(async () => {
        const requestId = getGUID();

        const emitError = (e) => {
            this.emit.log(`[id:${requestId}] Emitting error: "${e.message || e}"`, LogLevel.Error);
            this.emit.error(e);
            this.emit.log(`[id:${requestId}] Emitted error: "${e.message || e}"`, LogLevel.Error);
        }

        try {
            let retVal: any = undefined;

            const emitSend = async (): Promise<any> => {
                this.emit.log(`[id:${requestId}] Emitting auth`, LogLevel.Verbose);
                [url, init] = await this.emit.auth(url, init);
                this.emit.log(`[id:${requestId}] Emitted auth`, LogLevel.Verbose);

                this.emit.log(`[id:${requestId}] Emitting send`, LogLevel.Verbose);
                let response = await this.emit.send(url, init);
                this.emit.log(`[id:${requestId}] Emitted send`, LogLevel.Verbose);

                this.emit.log(`[id:${requestId}] Emitting parse`, LogLevel.Verbose);
                [url, response, result] = await this.emit.parse(url, response, result);
                this.emit.log(`[id:${requestId}] Emitted parse`, LogLevel.Verbose);

                this.emit.log(`[id:${requestId}] Emitting post`, LogLevel.Verbose);
                [url, result] = await this.emit.post(url, result);
                this.emit.log(`[id:${requestId}] Emitted post`, LogLevel.Verbose)

                return result;
            }

            const emitData = () => {
                this.emit.log(`[id:${requestId}] Emitting data`, LogLevel.Verbose);
                this.emit.data(retVal);
                this.emit.log(`[id:${requestId}] Emitted data`, LogLevel.Verbose);
            }

            this.emit.log(`[id:${requestId}] Beginning request`, LogLevel.Info);

            let [url, init, result] = await this.emit.pre(this.toRequestUrl(), requestInit, undefined);

            this.emit.log(`[id:${requestId}] Url: ${url}`, LogLevel.Info);

            if (typeof result !== "undefined") {
                retVal = result;
            }

            // Waiting is false by default, result is undefined by default, unless cached value is returned
            if (this.AsyncOverride || retVal != undefined) {
                //AsyncOverride is true, and a return value exists -> assume lazy cache update pipeline execution.
                setTimeout(async () => {
                    try {
                        await emitSend();
                    } catch (e) {
                        emitError(e);
                    }
                }, 0);

                emitData();
            } else if (retVal == undefined) {
                //If retVal is undefined then regardless of AsyncOverride execute pipeline
                retVal = await emitSend();

                // TODO:: how do we handle the case where the request pipeline has worked as expected, however
                // the result remains undefined? We shouldn't emit data as we don't have any, but should we have a
                // completed event to signal the request is completed?
                if (typeof retVal !== "undefined") {
                    emitData();
                }
            } else {
                // Return cached value
                emitData();
            }
        } catch (e) {
            emitError(e);
        } finally {
            this.emit.log(`[id:${requestId}] Finished request`, LogLevel.Info);
        }
    }, 0);

    return new Promise((resolve, reject) => {
        this.on.data(resolve);
        this.on.error(reject);
    });
}

/**
* Directly concatenates the supplied string to the current url, not normalizing "/" chars
*
* @param pathPart The string to concatenate to the url
*/
// public concat(pathPart: string): this {
//     this.data.url += pathPart;
//     return this;
// }

/**
* Provides access to the query builder for this url
*
*/
// public get query(): Map<string, string> {
//     return this.data.query;
// }

/**
* Sets custom options for current object and all derived objects accessible via chaining
*
* @param options custom options
*/
// public configure(options: QueryableRequestInit): this {
//     mergeRequestInit(this._request, options);
//     return this;
// }

/**
* Configures this instance from the configure options of the supplied instance
*
* @param o Instance from which options should be taken
*/
// public configureFrom(o: IQueryable<any>): this {

//     mergeOptions(this.data.options, o.data.options);

//     const sourceRuntime = o.getRuntime();
//     if (!sourceRuntime.get<{ "__isDefault__": boolean }, boolean>("__isDefault__")) {
//         this.setRuntime(sourceRuntime);
//     }
//     return this;
// }

/**
* Enables caching for this request
*
* @param options Defines the options used when caching this request
*/
// public usingCaching(options?: string | ICachingOptions): this {

//     const runtime = this.getRuntime();

//     if (!runtime.get<ILibraryConfiguration, boolean>("globalCacheDisable")) {

//         this.data.useCaching = true;

//         // handle getting just the key
//         if (typeof options === "string") {
//             if (stringIsNullOrEmpty(options)) {
//                 throw Error("Cache key cannot be empty.");
//             }
//             options = <ICachingOptions>{ key: options };
//         }

//         // this uses our local options if they are defined as defaults
//         const defaultOpts: Partial<ICachingOptions> = {
//             expiration: dateAdd(new Date(), "second", runtime.get<ILibraryConfiguration, number>("defaultCachingTimeoutSeconds")),
//             storeName: runtime.get<ILibraryConfiguration, "session" | "local">("defaultCachingStore"),
//         };

//         this.data.cachingOptions = assign(defaultOpts, options);
//     }

//     return this;
// }

// public usingParser(parser: IODataParser<any>): this {
//     this.data.parser = parser;
//     return this;
// }

/**
* Allows you to set a request specific processing pipeline
*
* @param pipeline The set of methods, in order, to execute a given request
*/
// public withPipeline(pipeline: PipelineMethod<DefaultActionType>[]): this {
//     this.data.pipes = pipeline.slice(0);
//     return this;
// }

/**
* Appends the given string and normalizes "/" chars
*
* @param pathPart The string to append
*/
// public append(pathPart: string): void {
//     this.data.url = combine(this.data.url, pathPart);
// }

/**
* Adds this query to the supplied batch
*
* @example
* ```
*
* let b = pnp.sp.createBatch();
* pnp.sp.web.inBatch(b).get().then(...);
* b.execute().then(...)
* ```
*/
// public inBatch(batch: Batch): this {

//     if (this.hasBatch) {
//         throw Error("This query is already part of a batch.");
//     }

//     if (objectDefinedNotNull(batch)) {
//         batch.track(this);
//     }

//     return this;
// }

/**
* Blocks a batch call from occuring, MUST be cleared by calling the returned function
*/
// public addBatchDependency(): () => void {
//     if (objectDefinedNotNull(this.data.batch)) {
//         return this.data.batch.addDependency();
//     }

//     return () => null;
// }

/**
* Indicates if the current query has a batch associated
*
*/
//     protected get hasBatch(): boolean {
//         return objectDefinedNotNull(this.data.batch);
//     }

//     /**
//    * The batch currently associated with this query or null
//    *
//    */
//     protected get batch(): Batch | null {
//         return this.hasBatch ? this.data.batch : null;
//     }

//     /**
//    * Gets the parent url used when creating this instance
//    *
//    */
//     protected get parentUrl(): string {
//         return this.data.parentUrl;
//     }

/**
* Clones this instance's data to target
*
* @param target Instance to which data is written
* @param settings [Optional] Settings controlling how clone is applied
*/
// protected cloneTo<T extends IQueryable<any>>(target: T, settings: { includeBatch?: boolean; includeQuery?: boolean } = {}): T {

//     // default values for settings
//     settings = assign({
//         includeBatch: true,
//         includeQuery: false,
//     }, settings);

//     target.data = Object.assign({}, cloneQueryableData(this.data), <Partial<IQueryableData<DefaultActionType>>>{
//         batch: null,
//         cloneParentCacheOptions: null,
//         cloneParentWasCaching: false,
//     }, cloneQueryableData(target.data));

//     target.configureFrom(this);

//     if (settings.includeBatch) {
//         target.inBatch(this.batch);
//     }

//     if (settings.includeQuery && this.query.size > 0) {
//         this.query.forEach((v, k) => target.query.set(k, v));
//     }

//     if (this.data.useCaching) {
//         target.data.cloneParentWasCaching = true;
//         target.data.cloneParentCacheOptions = this.data.cachingOptions;
//     }

//     return target;
// }

