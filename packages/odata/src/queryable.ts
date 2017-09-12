import {
    Util,
    Dictionary,
    RuntimeConfig,
    FetchOptions,
    ConfigOptions,
    mergeOptions,
} from "@pnp/common";
import { ODataParser } from "./core";
import { ODataDefaultParser } from "./parsers";
import { ICachingOptions } from "./caching";
import {
    RequestContext,
    PipelineMethods,
    pipe,
} from "./pipeline";

export abstract class ODataQueryable {

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
    protected _cachingOptions: ICachingOptions;

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
     * Gets the currentl url, made absolute based on the availability of the _spPageContextInfo object
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
    public get(parser: ODataParser<any> = new ODataDefaultParser(), options: FetchOptions = {}): Promise<any> {
        return this.toRequestContext("GET", options, parser, PipelineMethods.default).then(context => pipe(context));
    }

    public getAs<T>(parser: ODataParser<T> = new ODataDefaultParser(), options: FetchOptions = {}): Promise<T> {
        return this.toRequestContext("GET", options, parser, PipelineMethods.default).then(context => pipe(context));
    }

    protected postCore(options: FetchOptions = {}, parser: ODataParser<any> = new ODataDefaultParser()): Promise<any> {
        return this.toRequestContext("POST", options, parser, PipelineMethods.default).then(context => pipe(context));
    }

    protected postAsCore<T>(options: FetchOptions = {}, parser: ODataParser<T> = new ODataDefaultParser()): Promise<T> {
        return this.toRequestContext("POST", options, parser, PipelineMethods.default).then(context => pipe(context));
    }

    protected patchCore(options: FetchOptions = {}, parser: ODataParser<any> = new ODataDefaultParser()): Promise<any> {
        return this.toRequestContext("PATCH", options, parser, PipelineMethods.default).then(context => pipe(context));
    }

    protected deleteCore(options: FetchOptions = {}, parser: ODataParser<any> = new ODataDefaultParser()): Promise<any> {
        return this.toRequestContext("DELETE", options, parser, PipelineMethods.default).then(context => pipe(context));
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
