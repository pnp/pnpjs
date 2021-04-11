import {
    combine,
    IFetchOptions,
    IConfigOptions,
    mergeOptions,
    objectDefinedNotNull,
    IRequestClient,
    assign,
    ILibraryConfiguration,
    ITypedHash,
    Runtime,
    DefaultRuntime,
    dateAdd,
    stringIsNullOrEmpty,
} from "@pnp/common";
import { Moments, Timeline } from "./timeline.js";
import { LogLevel } from "@pnp/logging";
import { Queryable } from "./queryable.js";

interface QueryableInit {
    parent?: Queryable2;
    url: string;
    requestInit: QueryableRequestInit;
}

export type QueryableRequestInit = Pick<RequestInit, "method" | "referrer" | "referrerPolicy" | "mode" | "credentials" | "cache" | "redirect" | "integrity"> & {
    headers?: Record<string, string>;
};

function mergeRequestInit(target: QueryableRequestInit, source: QueryableRequestInit): QueryableRequestInit {
    if (!objectDefinedNotNull(target)) {
        target = {};
    }
    const headers = assign(target.headers || {}, source.headers);
    target = Object.assign(target, source);
    target.headers = headers;

    return target;
}

// const DefaultBehavior = {
//     pre: function (handlers: ((this: Queryable2) => Promise<void>)[]) {
//         console.log(handlers.length);
//     },
// };

export class Queryable2 {

    private _runtime: Runtime;
    private _request: QueryableRequestInit;
    private _parent: Queryable2;
    private _url: string;
    // private _events: Timeline;

    constructor(init: QueryableInit) {

        const { requestInit, url, parent } = init;

        this._request = mergeRequestInit({
            method: "GET",
        }, requestInit);

        this._url = url;

        this._parent = parent || null;

        // this._events = new Timeline();


        // this._data = Object.assign({}, {
        //     cloneParentWasCaching: false,
        //     options: {},
        //     parentUrl: "",
        //     parser: new ODataParser<DefaultActionType>(),
        //     query: new Map<string, string>(),
        //     url: "",
        //     useCaching: false,
        // }, cloneQueryableData(dataSeed));

        this._runtime = null;
    }

    // public on(args: ["log", (message: string, level: LogLevel) => void] |
    // ["error", (err?: Error) => void] |
    // ["pre", (query: Queryable2) => Promise<boolean>] |
    // ["send", (query: Queryable2) => Promise<boolean>] |
    // ["post", (query: Queryable2, resp: Response) => Promise<boolean>]) {

    //     this._events.on(args[0], args[1]);
    // }

    // public on(e: "error", handler: (err?: Error | string) => void): this;
    // public on(e: "log", handler: (message: string, level: LogLevel) => void): this;
    // public on(e: "pre", handler: (query: Queryable2) => Promise<boolean>): this;
    // public on(e: "send", handler: <T = any>(query: Queryable2) => Promise<boolean>): this;
    // public on(e: "data", handler: (query: Queryable2, response: Response) => void): this;
    // public on(e: "post", handler: (ctx: any, query: Queryable2, response: Response) => Promise<boolean>): this;
    // public on(e: string, handler: (...args: any[]) => any): this {
    //     this._events.on(e, handler);
    //     return this;
    // }

    // interface IRequestContext {
    //     events: Timeline;
    //     query: Queryable;
    //     response: null;
    //     resolve: null;
    //     reject: null;
    // }

    // public async execute(): Promise<any> {

    //     const events = this._events;
    //     let ctx = {
    //         events,
    //         query: this, // TODO:: clone
    //         response: null,
    //     };

    //     const promise = new Promise((resolve, reject) => {
    //         ctx = Object.assign(ctx, { resolve, reject });
    //     });

    //     try {

    //         // we register how we handle data event, this event should emit only once per-execution
    //         // data my come from web request, cache, or other
    //         events.on("data", async (query: Queryable2, response: Response) => {

    //             events.emit("log", `Emitting "post" event for: ${this.toUrl()}`, LogLevel.Verbose);
    //             await events.emitAsync("post", query, response);
    //             events.emit("log", `Emitted "post" event for: ${this.toUrl()}`, LogLevel.Verbose);
    //         });

    //         events.emit("log", `Beginning request: ${this.toUrl()}`, LogLevel.Info);

    //         events.emit("log", `Emitting "pre" event for: ${this.toUrl()}`, LogLevel.Verbose);
    //         ctx = await events.emitAsync("pre", ctx);
    //         events.emit("log", `Emitted "pre" event for: ${this.toUrl()}`, LogLevel.Verbose);

    //         events.emit("log", `Emitting "send" event for: ${this.toUrl()}`, LogLevel.Verbose);
    //         await events.emitAsync("send", ctx);
    //         events.emit("log", `Emitted "send" event for: ${this.toUrl()}`, LogLevel.Verbose);

    //     } catch (e) {

    //         events.emit("error", e);
    //     }

    //     return promise;
    // }




    // [runtime: Runtime] | [cloneGlobal: boolean, additionalConfig?: ITypedHash<any>]







    // public get data(): Partial<IQueryableData<DefaultActionType>> {
    //     return this._data;
    // }

    // public set data(value: Partial<IQueryableData<DefaultActionType>>) {
    //     this._data = Object.assign({}, this.data, cloneQueryableData(value));
    // }

    public getRuntime(): Runtime {

        if (this._runtime === null) {
            return DefaultRuntime;
        }

        return this._runtime;
    }

    public setRuntime(runtime: Runtime): this;
    public setRuntime(cloneGlobal: boolean, additionalConfig?: ITypedHash<any>): this;
    public setRuntime(...args: any[]): this {

        // need to wait for ts update in spfx: [runtime: Runtime] | [cloneGlobal: boolean, additionalConfig?: ITypedHash<any>]

        if (args[0] instanceof Runtime) {

            this._runtime = args[0];

        } else {

            this._runtime = args[0] ? new Runtime(DefaultRuntime.export()) : new Runtime();

            if (args.length > 1 && objectDefinedNotNull(args[1])) {
                this._runtime.assign(args[1]);
            }
        }

        return this;
    }

    /**
   * Gets the full url with query information
   *
   */
    // public abstract toUrlAndQuery(): string;

    /**
   * The default action for this
   */
    // public abstract defaultAction(options?: IFetchOptions): Promise<DefaultActionType>;

    /**
  * Gets the current url
  *
  */
    public toUrl(): string {
        return this._url;
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
    public configure(options: QueryableRequestInit): this {
        mergeRequestInit(this._request, options);
        return this;
    }

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
}
