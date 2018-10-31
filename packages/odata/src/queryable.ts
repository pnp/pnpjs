import {
    combine,
    RuntimeConfig,
    FetchOptions,
    ConfigOptions,
    mergeOptions,
    objectDefinedNotNull,
} from "@pnp/common";
import { ODataParser, ODataDefaultParser, JSONParser } from "./parsers";
import { ICachingOptions } from "./caching";
import { ODataBatch } from "./odatabatch";
import {
    RequestContext,
    getDefaultPipeline,
    pipe,
} from "./pipeline";

export abstract class Queryable<GetType> {

    /**
     * Additional options to be set before sending actual http request
     */
    protected _options: ConfigOptions;

    /**
     * Tracks the query parts of the url
     */
    protected _query: Map<string, string>;

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

    /**
     * Flag used to indicate if the object from which this was cloned's _usingCaching flag was true
     */
    protected _cloneParentWasCaching: boolean;

    /**
     * The cache options from the clone parent if it was caching
     */
    protected _cloneParentCacheOptions: ICachingOptions | null;

    constructor() {
        this._query = new Map<string, string>();
        this._options = {};
        this._url = "";
        this._parentUrl = "";
        this._useCaching = false;
        this._cachingOptions = null;
        this._cloneParentWasCaching = false;
        this._cloneParentCacheOptions = null;
    }

    /**
     * Gets the full url with query information
     *
     */
    public abstract toUrlAndQuery(): string;

    /**
    * Gets the currentl url
    *
    */
    public toUrl(): string {
        return this._url;
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
    public get query(): Map<string, string> {
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
     * Configures this instance from the configure options of the supplied instance
     * 
     * @param o Instance from which options should be taken
     */
    public configureFrom(o: Queryable<any>): this {
        mergeOptions(this._options, o._options);
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
            if (options !== undefined) {
                this._cachingOptions = options;
            }
        }
        return this;
    }

    protected getCore<T = GetType>(parser: ODataParser<T> = new JSONParser(), options: FetchOptions = {}): Promise<T> {
        // Fix for #304 - when we clone objects we in some cases then execute a get request
        // in these cases the caching settings were getting dropped from the request
        // this tracks if the object from which this was clones was caching and applies that to an immediate get request
        // does not affect objects cloned from this as we are using different fields to track the settings so it won't
        // be triggered
        if (this._cloneParentWasCaching) {
            this.usingCaching(this._cloneParentCacheOptions);
        }
        return this.toRequestContext<T>("GET", options, parser, getDefaultPipeline()).then(context => pipe(context));
    }

    protected postCore<T = any>(options: FetchOptions = {}, parser: ODataParser<T> = new JSONParser()): Promise<T> {
        return this.toRequestContext<T>("POST", options, parser, getDefaultPipeline()).then(context => pipe(context));
    }

    protected patchCore<T = any>(options: FetchOptions = {}, parser: ODataParser<T> = new JSONParser()): Promise<T> {
        return this.toRequestContext<T>("PATCH", options, parser, getDefaultPipeline()).then(context => pipe(context));
    }

    protected deleteCore<T = any>(options: FetchOptions = {}, parser: ODataParser<T> = new JSONParser()): Promise<T> {
        return this.toRequestContext<T>("DELETE", options, parser, getDefaultPipeline()).then(context => pipe(context));
    }

    protected putCore<T = any>(options: FetchOptions = {}, parser: ODataParser<T> = new JSONParser()): Promise<T> {
        return this.toRequestContext<T>("PUT", options, parser, getDefaultPipeline()).then(context => pipe(context));
    }

    /**
     * Appends the given string and normalizes "/" chars
     *
     * @param pathPart The string to append
     */
    protected append(pathPart: string) {
        this._url = combine(this._url, pathPart);
    }

    /**
     * Gets the parent url used when creating this instance
     *
     */
    protected get parentUrl(): string {
        return this._parentUrl;
    }

    /**
     * Extends this queryable from the provided parent 
     * 
     * @param parent Parent queryable from which we will derive a base url
     * @param path Additional path
     */
    protected extend(parent: Queryable<any>, path?: string) {
        this._parentUrl = parent._url;
        this._url = combine(this._parentUrl, path || "");
        this.configureFrom(parent);
    }

    /**
     * Configures a cloned object from this instance
     * 
     * @param clone
     */
    protected _clone(clone: Queryable<any>, _0: any): any {

        clone.configureFrom(this);

        if (this._useCaching) {
            clone._cloneParentWasCaching = true;
            clone._cloneParentCacheOptions = this._cachingOptions;
        }

        return clone;
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

export abstract class ODataQueryable<BatchType extends ODataBatch, GetType = any> extends Queryable<GetType> {

    /**
     * Tracks the batch of which this query may be part
     */
    protected _batch: BatchType | null;

    constructor() {
        super();
        this._batch = null;
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
            throw Error("This query is already part of a batch.");
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
     * Executes the currently built request
     *
     * @param parser Allows you to specify a parser to handle the result
     * @param getOptions The options used for this request
     */
    public get<T = GetType>(parser: ODataParser<T> = new ODataDefaultParser(), options: FetchOptions = {}): Promise<T> {
        return this.getCore(parser, options);
    }

    protected getCore<T = GetType>(parser: ODataParser<T> = new ODataDefaultParser(), options: FetchOptions = {}): Promise<T> {
        return super.getCore<T>(parser, options);
    }

    protected postCore<T = any>(options: FetchOptions = {}, parser: ODataParser<T> = new ODataDefaultParser()): Promise<T> {
        return super.postCore<T>(options, parser);
    }

    protected patchCore<T = any>(options: FetchOptions = {}, parser: ODataParser<T> = new ODataDefaultParser()): Promise<T> {
        return super.patchCore<T>(options, parser);
    }

    protected deleteCore<T = any>(options: FetchOptions = {}, parser: ODataParser<T> = new ODataDefaultParser()): Promise<T> {
        return super.deleteCore<T>(options, parser);
    }

    protected putCore<T = any>(options: FetchOptions = {}, parser: ODataParser<T> = new ODataDefaultParser()): Promise<T> {
        return super.putCore<T>(options, parser);
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
        return objectDefinedNotNull(this._batch);
    }

    /**
     * The batch currently associated with this query or null
     *
     */
    protected get batch(): BatchType | null {
        return this.hasBatch ? this._batch : null;
    }

    /**
     * Configures a cloned object from this instance
     * 
     * @param clone 
     */
    protected _clone(clone: ODataQueryable<any, any>, cloneSettings: { includeBatch: boolean}): any {

        clone = super._clone(clone, cloneSettings);

        if (cloneSettings.includeBatch) {
            clone = clone.inBatch(this._batch);
        }

        return clone;
    }
}
