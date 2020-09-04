import {
  combine,
  RuntimeConfig,
  IFetchOptions,
  IConfigOptions,
  mergeOptions,
  objectDefinedNotNull,
  IRequestClient,
  assign,
} from "@pnp/common";
import { ICachingOptions } from "./caching";
import { Batch } from "./batch";
import { PipelineMethod } from "./pipeline";
import { IODataParser, ODataParser } from "./parsers";

export function cloneQueryableData(source: Partial<IQueryableData>): Partial<IQueryableData> {
  let body;
  // this handles bodies that cannot be JSON encoded (Blob, etc)
  // Note however, even bodies that can be serialized will not be cloned.
  if (source.options && source.options.body) {
    body = source.options.body;
    source.options.body = "-";
  }

  const s = JSON.stringify(source, (key: string, value: any) => {

    switch (key) {
      case "query":
        return JSON.stringify([...(<Map<string, string>>value)]);
      case "batch":
        return "-";
      case "batchDependency":
        return "-";
      case "cachingOptions":
        return "-";
      case "clientFactory":
        return "-";
      case "parser":
        return "-";
      default:
        return value;
    }
  }, 0);

  const parsed = JSON.parse(s, (key: any, value: any) => {
    switch (key) {
      case "query":
        return new Map(JSON.parse(value));
      case "batch":
        return source.batch;
      case "batchDependency":
        return source.batchDependency;
      case "cachingOptions":
        return source.cachingOptions;
      case "clientFactory":
        return source.clientFactory;
      case "parser":
        return source.parser;
      default:
        return value;
    }
  });

  if (body) {
    parsed.options.body = body;
    source.options.body = body;
  }

  return parsed;
}

export interface IQueryableData<DefaultActionType = any> {
  batch: Batch | null;
  batchIndex: number;
  batchDependency: () => void | null;
  cachingOptions: ICachingOptions | null;
  cloneParentCacheOptions: ICachingOptions | null;
  cloneParentWasCaching: boolean;
  query: Map<string, string>;
  options: IFetchOptions | null;
  url: string;
  parentUrl: string;
  useCaching: boolean;
  pipes?: PipelineMethod<DefaultActionType>[];
  parser?: IODataParser<DefaultActionType>;
  clientFactory?: () => IRequestClient;
  method?: string;
}

export interface IQueryable<DefaultActionType> {
  data: Partial<IQueryableData<DefaultActionType>>;
  query: Map<string, string>;
  append(pathPart: string): void;
  inBatch(batch: Batch): this;
  addBatchDependency(): () => void;
  toUrlAndQuery(): string;
  toUrl(): string;
  concat(pathPart: string): this;
  configure(options: IConfigOptions): this;
  configureFrom(o: IQueryable<DefaultActionType>): this;
  usingCaching(options?: ICachingOptions): this;
  usingParser(parser: IODataParser<any>): this;
  withPipeline(pipeline: PipelineMethod<DefaultActionType>[]): this;
  defaultAction(options?: IFetchOptions): Promise<DefaultActionType>;
}

export abstract class Queryable<DefaultActionType = any> implements IQueryable<DefaultActionType> {

  private _data: Partial<IQueryableData<DefaultActionType>>;

  constructor(dataSeed: Partial<IQueryableData<DefaultActionType>> = {}) {

    this._data = Object.assign({}, {
      cloneParentWasCaching: false,
      options: {},
      parentUrl: "",
      parser: new ODataParser<DefaultActionType>(),
      query: new Map<string, string>(),
      url: "",
      useCaching: false,
    }, cloneQueryableData(dataSeed));
  }

  public get data(): Partial<IQueryableData<DefaultActionType>> {
    return this._data;
  }

  public set data(value: Partial<IQueryableData<DefaultActionType>>) {
    this._data = Object.assign({}, this.data, cloneQueryableData(value));
  }

  /**
   * Gets the full url with query information
   *
   */
  public abstract toUrlAndQuery(): string;

  /**
   * The default action for this 
   */
  public abstract defaultAction(options?: IFetchOptions): Promise<DefaultActionType>;

  /**
  * Gets the current url
  *
  */
  public toUrl(): string {
    return this.data.url;
  }

  /**
   * Directly concatenates the supplied string to the current url, not normalizing "/" chars
   *
   * @param pathPart The string to concatenate to the url
   */
  public concat(pathPart: string): this {
    this.data.url += pathPart;
    return this;
  }

  /**
   * Provides access to the query builder for this url
   *
   */
  public get query(): Map<string, string> {
    return this.data.query;
  }

  /**
   * Sets custom options for current object and all derived objects accessible via chaining
   * 
   * @param options custom options
   */
  public configure(options: IConfigOptions): this {
    mergeOptions(this.data.options, options);
    return this;
  }

  /**
   * Configures this instance from the configure options of the supplied instance
   * 
   * @param o Instance from which options should be taken
   */
  public configureFrom(o: IQueryable<any>): this {
    mergeOptions(this.data.options, o.data.options);
    return this;
  }

  /**
   * Enables caching for this request
   *
   * @param options Defines the options used when caching this request
   */
  public usingCaching(options?: ICachingOptions): this {
    if (!RuntimeConfig.globalCacheDisable) {
      this.data.useCaching = true;
      if (options !== undefined) {
        this.data.cachingOptions = options;
      }
    }
    return this;
  }

  public usingParser(parser: IODataParser<any>): this {
    this.data.parser = parser;
    return this;
  }

  /**
   * Allows you to set a request specific processing pipeline
   * 
   * @param pipeline The set of methods, in order, to execute a given request
   */
  public withPipeline(pipeline: PipelineMethod<DefaultActionType>[]): this {
    this.data.pipes = pipeline.slice(0);
    return this;
  }

  /**
   * Appends the given string and normalizes "/" chars
   *
   * @param pathPart The string to append
   */
  public append(pathPart: string): void {
    this.data.url = combine(this.data.url, pathPart);
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
  public inBatch(batch: Batch): this {

    if (this.hasBatch) {
      throw Error("This query is already part of a batch.");
    }

    if (objectDefinedNotNull(batch)) {
      batch.track(this);
    }

    return this;
  }

  /**
   * Blocks a batch call from occuring, MUST be cleared by calling the returned function
  */
  public addBatchDependency(): () => void {
    if (objectDefinedNotNull(this.data.batch)) {
      return this.data.batch.addDependency();
    }

    return () => null;
  }

  /**
   * Indicates if the current query has a batch associated
   *
   */
  protected get hasBatch(): boolean {
    return objectDefinedNotNull(this.data.batch);
  }

  /**
   * The batch currently associated with this query or null
   *
   */
  protected get batch(): Batch | null {
    return this.hasBatch ? this.data.batch : null;
  }

  /**
   * Gets the parent url used when creating this instance
   *
   */
  protected get parentUrl(): string {
    return this.data.parentUrl;
  }

  /**
   * Clones this instance's data to target
   * 
   * @param target Instance to which data is written
   * @param settings [Optional] Settings controlling how clone is applied
   */
  protected cloneTo<T extends IQueryable<any>>(target: T, settings: { includeBatch?: boolean, includeQuery?: boolean } = {}): T {

    // default values for settings
    settings = assign({
      includeBatch: true,
      includeQuery: false,
    }, settings);

    target.data = Object.assign({}, cloneQueryableData(this.data), <Partial<IQueryableData<DefaultActionType>>>{
      batch: null,
      cloneParentCacheOptions: null,
      cloneParentWasCaching: false,
    }, cloneQueryableData(target.data));

    target.configureFrom(this);

    if (settings.includeBatch) {
      target.inBatch(this.batch);
    }

    if (settings.includeQuery && this.query.size > 0) {
      this.query.forEach((v, k) => target.query.set(k, v));
    }

    if (this.data.useCaching) {
      target.data.cloneParentWasCaching = true;
      target.data.cloneParentCacheOptions = this.data.cachingOptions;
    }

    return target;
  }
}
