import {
    Util,
    Dictionary,
    RuntimeConfig,
    FetchOptions,
    ConfigOptions,
    mergeOptions,
} from "@pnp/common";
import { Logger } from "@pnp/logging";
import { ODataParser } from "./core";
import { ODataDefaultParser } from "./parsers";
import { ICachingOptions } from "./caching";
import { ODataBatch } from "./odatabatch";
import {
    RequestContext,
    getDefaultPipeline,
    pipe,
} from "./pipeline";

export class AlreadyInBatchException extends Error {

    constructor(msg = "This query is already part of a batch.") {
        super(msg);
        this.name = "AlreadyInBatchException";
        Logger.error(this);
    }
}

export abstract class ODataQueryable<BatchType extends ODataBatch, GetType = any> {

    /**
     * Tracks the batch of which this query may be part
     */
    protected _batch: BatchType | null;

    /**
     * Additional options to be set before sending actual http request
     */
    protected _options: ConfigOptions;

    /**
     * Tracks the query parts of the url
     */
    protected _query: Dictionary<string>;

    /**
     * Tracks the url as it is built
     */
    protected _url: string;

    /**
     * Stores the parent url used to create this instance, for recursing back up the tree if needed
     */
    protected _parentUrl: string;

    /**
     * Explicitly tracks if we are using caching for this request
     */
    protected _useCaching: boolean;

    /**
     * Any options that were supplied when caching was enabled
     */
    protected _cachingOptions: ICachingOptions | null;

    constructor() {
        this._batch = null;
        this._query = new Dictionary<string>();
        this._options = {};
        this._url = "";
        this._parentUrl = "";
        this._useCaching = false;
        this._cachingOptions = null;
    }

    /**
     * Directly concatonates the supplied string to the current url, not normalizing "/" chars
     *
     * @param pathPart The string to concatonate to the url
     */
    public concat(pathPart: string): this {
        this._url += pathPart;
        return this;
    }

    /**
     * Provides access to the query builder for this url
     *
     */
    public get query(): Dictionary<string> {
        return this._query;
    }

    /**
     * Sets custom options for current object and all derived objects accessible via chaining
     * 
     * @param options custom options
     */
    public configure(options: ConfigOptions): this {
        mergeOptions(this._options, options);
        return this;
    }

    /**
     * Enables caching for this request
     *
     * @param options Defines the options used when caching this request
     */
    public usingCaching(options?: ICachingOptions): this {
        if (!RuntimeConfig.globalCacheDisable) {
            this._useCaching = true;
            if (typeof options !== "undefined") {
                this._cachingOptions = options;
            }
        }
        return this;
    }

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
    public inBatch(batch: BatchType): this {

        if (this.batch !== null) {
            throw new AlreadyInBatchException();
        }

        this._batch = batch;

        return this;
    }

    /**
     * Gets the currentl url
     *
     */
    public toUrl(): string {
        return this._url;
    }

    /**
     * Gets the full url with query information
     *
     */
    public abstract toUrlAndQuery(): string;

    /**
     * Executes the currently built request
     *
     * @param parser Allows you to specify a parser to handle the result
     * @param getOptions The options used for this request
     */
    public get<T = GetType>(parser: ODataParser<T> = new ODataDefaultParser(), options: FetchOptions = {}): Promise<T> {
        return this.toRequestContext("GET", options, parser, getDefaultPipeline()).then(context => pipe(context));
    }

    protected postCore<T = any>(options: FetchOptions = {}, parser: ODataParser<T> = new ODataDefaultParser()): Promise<T> {
        return this.toRequestContext("POST", options, parser, getDefaultPipeline()).then(context => pipe(context));
    }

    protected patchCore<T = any>(options: FetchOptions = {}, parser: ODataParser<T> = new ODataDefaultParser()): Promise<T> {
        return this.toRequestContext("PATCH", options, parser, getDefaultPipeline()).then(context => pipe(context));
    }

    protected deleteCore<T = any>(options: FetchOptions = {}, parser: ODataParser<T> = new ODataDefaultParser()): Promise<T> {
        return this.toRequestContext("DELETE", options, parser, getDefaultPipeline()).then(context => pipe(context));
    }

    /**
     * Blocks a batch call from occuring, MUST be cleared by calling the returned function
    */
    protected addBatchDependency(): () => void {
        if (this._batch !== null) {
            return this._batch.addDependency();
        }

        return () => null;
    }

    /**
     * Indicates if the current query has a batch associated
     *
     */
    protected get hasBatch(): boolean {
        return Util.objectDefinedNotNull(this._batch);
    }

    /**
     * The batch currently associated with this query or null
     *
     */
    protected get batch(): BatchType | null {
        return this.hasBatch ? this._batch : null;
    }

    /**
     * Appends the given string and normalizes "/" chars
     *
     * @param pathPart The string to append
     */
    protected append(pathPart: string) {
        this._url = Util.combinePaths(this._url, pathPart);
    }

    /**
     * Gets the parent url used when creating this instance
     *
     */
    protected get parentUrl(): string {
        return this._parentUrl;
    }

    /**
     * Converts the current instance to a request context
     *
     * @param verb The request verb
     * @param options The set of supplied request options
     * @param parser The supplied ODataParser instance
     * @param pipeline Optional request processing pipeline
     */
    protected abstract toRequestContext<T>(
        verb: string,
        options: FetchOptions,
        parser: ODataParser<T>,
        pipeline: Array<(c: RequestContext<T>) => Promise<RequestContext<T>>>): Promise<RequestContext<T>>;
}
