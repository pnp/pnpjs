import {
    FetchOptions,
    combine,
    extend,
    getGUID,
    mergeHeaders,
    mergeOptions,
    objectDefinedNotNull,
    hOP,
    getHashCode,
    stringIsNullOrEmpty,
} from "@pnp/common";
import { CachingOptions, ICachingOptions, ODataParser, Queryable, RequestContext } from "@pnp/odata";
import { SPHttpClient, toAbsoluteUrl } from "@pnp/sp";
import { IObjectPathBatch } from "./batch";
import { ObjectPathQueue } from "./objectpath";
import { methodAction, objectPath, objectProperties, opQuery } from "./opactionbuilders";
import { IMethodParamsBuilder, method, property } from "./opbuilders";
import { ProcessQueryParser } from "./parsers";

export interface IClientSvcQueryable {
    select(...selects: string[]): this;
    usingCaching(options?: ICachingOptions): this;
    inBatch(batch: IObjectPathBatch): this;
}

export interface ClientSvcQueryableConstructor<T> {
    new(baseUrl: string | ClientSvcQueryable, objectPaths?: ObjectPathQueue): T;
}

const ProcessQueryPath = "_vti_bin/client.svc/ProcessQuery";

export class ClientSvcQueryable<GetType = any> extends Queryable<GetType> implements IClientSvcQueryable {

    /**
     * Collection of select fields
     */
    protected _selects: string[];

    /**
     * Tracks the batch of which this query may be part
     */
    protected _batch: IObjectPathBatch | null;

    /**
     * Allows us to properly block batch execution until everything is loaded
     */
    protected _batchDependency: () => void | null;

    constructor(parent: ClientSvcQueryable | string = "", protected _objectPaths: ObjectPathQueue | null = null) {
        super();

        this._selects = [];
        this._batch = null;
        this._batchDependency = null;

        if (typeof parent === "string") {

            // we assume the parent here is an absolute url to a web
            this._parentUrl = parent;
            this._url = combine(parent.replace(ProcessQueryPath, ""), ProcessQueryPath);
            if (!objectDefinedNotNull(this._objectPaths)) {
                this._objectPaths = new ObjectPathQueue();
            }

        } else {
            this._parentUrl = parent._parentUrl;
            this._url = combine(parent._parentUrl, ProcessQueryPath);
            if (!objectDefinedNotNull(_objectPaths)) {
                this._objectPaths = parent._objectPaths.clone();
            }
            this.configureFrom(parent);
        }
    }

    /**
     * Choose which fields to return
     *
     * @param selects One or more fields to return
     */
    public select(...selects: string[]): this {
        [].push.apply(this._selects, <any>selects);
        return this;
    }

    /**
     * Adds this query to the supplied batch
     *
     */
    public inBatch(batch: IObjectPathBatch): this {

        if (this.batch !== null) {
            throw Error("This query is already part of a batch.");
        }

        if (objectDefinedNotNull(batch)) {
            this._batch = batch;
            this._batchDependency = batch.addDependency();
        }

        return this;
    }

    /**
     * Gets the full url with query information
     *
     */
    public toUrlAndQuery(): string {
        return `${super.toUrl()}?${Array.from(this.query).map((v: [string, string]) => v[0] + "=" + v[1]).join("&")}`;
    }

    protected getSelects(): string[] {
        return objectDefinedNotNull(this._selects) ? this._selects : [];
    }

    /**
     * Gets a child object based on this instance's paths and the supplied paramters
     * 
     * @param factory Instance factory of the child type
     * @param methodName Name of the method used to load the child
     * @param params Parameters required by the method to load the child
     */
    protected getChild<T>(factory: ClientSvcQueryableConstructor<T>, methodName: string, params: IMethodParamsBuilder | null): T {

        const objectPaths = this._objectPaths.copy();

        objectPaths.add(method(methodName, params,
            // actions
            objectPath()));

        return new factory(this, objectPaths);
    }

    /**
     * Gets a property of the current instance
     * 
     * @param factory Instance factory of the child type
     * @param propertyName Name of the property to load
     */
    protected getChildProperty<T>(factory: ClientSvcQueryableConstructor<T>, propertyName: string): T {

        const objectPaths = this._objectPaths.copy();

        objectPaths.add(property(propertyName));

        return new factory(this, objectPaths);
    }

    /**
     * Sends a request
     * 
     * @param op 
     * @param options 
     * @param parser 
     */
    protected send<T = any>(objectPaths: ObjectPathQueue, options: FetchOptions = {}, parser: ODataParser<T> = null): Promise<T> {

        // here we need to create a clone because all the string indexes and references
        // will be updated and all need to relate for this operation being sent. The parser
        // and the postCore method need to share an independent value of the objectPaths
        // See for https://github.com/pnp/pnpjs/issues/419 for details
        const clonedOps = objectPaths.clone();

        if (!objectDefinedNotNull(parser)) {
            // we assume here that we want to return for this index path
            parser = new ProcessQueryParser(clonedOps.last);
        }

        if (this.hasBatch) {

            // this is using the options variable to pass some extra information downstream to the batch
            options = extend(options, {
                clientsvc_ObjectPaths: clonedOps,
            });

        } else {

            if (!hOP(options, "body")) {
                options = extend(options, {
                    body: clonedOps.toBody(),
                });
            }
        }

        return super.postCore(options, parser);
    }

    /**
     * Sends the request, merging the result data with a new instance of factory
     */
    protected sendGet<DataType, FactoryType>(factory: ClientSvcQueryableConstructor<FactoryType>): Promise<(DataType & FactoryType)> {

        const ops = this._objectPaths.copy().appendActionToLast(opQuery(this.getSelects()));

        return this.send<DataType>(ops).then(r => extend(new factory(this), r));
    }

    /**
     * Sends the request, merging the result data array with a new instances of factory
     */
    protected sendGetCollection<DataType, FactoryType>(factory: (d: DataType) => FactoryType): Promise<(DataType & FactoryType)[]> {

        const ops = this._objectPaths.copy().appendActionToLast(opQuery([], this.getSelects()));

        return this.send<DataType[]>(ops).then(r => r.map(d => extend(factory(d), d)));
    }

    /**
     * Invokes the specified method on the server and returns the result
     * 
     * @param methodName Name of the method to invoke
     * @param params Method parameters
     * @param actions Any additional actions to execute in addition to the method invocation (set property for example)
     */
    protected invokeMethod<T>(methodName: string, params: IMethodParamsBuilder | null = null, ...actions: string[]): Promise<T> {
        return this.invokeMethodImpl(methodName, params, actions, opQuery([], null));
    }

    /**
     * Invokes a method action that returns a single result and does not have an associated query (ex: GetDescription on Term)
     * 
     * @param methodName Name of the method to invoke
     * @param params Method parameters
     * @param actions Any additional actions to execute in addition to the method invocation (set property for example)
     */
    protected invokeMethodAction<T>(methodName: string, params: IMethodParamsBuilder | null = null, ...actions: string[]): Promise<T> {
        return this.invokeMethodImpl(methodName, params, actions, null, true);
    }

    /**
     * Invokes the specified non-query method on the server
     * 
     * @param methodName Name of the method to invoke
     * @param params Method parameters
     * @param actions Any additional actions to execute in addition to the method invocation (set property for example)
     */
    protected invokeNonQuery(methodName: string, params: IMethodParamsBuilder | null = null, ...actions: string[]): Promise<void> {
        // by definition we are not returning anything from these calls so we should not be caching the results
        this._useCaching = false;
        return this.invokeMethodImpl<void>(methodName, params, actions, null, true);
    }

    /**
     * Invokes the specified method on the server and returns the resulting collection
     * 
     * @param methodName Name of the method to invoke
     * @param params Method parameters
     * @param actions Any additional actions to execute in addition to the method invocation (set property for example)
     */
    protected invokeMethodCollection<T>(methodName: string, params: IMethodParamsBuilder | null = null, ...actions: string[]): Promise<T> {
        return this.invokeMethodImpl(methodName, params, actions, opQuery([], []));
    }

    /**
     * Updates this instance, returning a copy merged with the updated data after the update
     * 
     * @param properties Plain object of the properties and values to update
     * @param factory Factory method use to create a new instance of FactoryType
     */
    protected invokeUpdate<DataType, FactoryType>(properties: any, factory: ClientSvcQueryableConstructor<FactoryType>): Promise<DataType & FactoryType> {

        const ops = this._objectPaths.copy();
        // append setting all the properties to this instance
        objectProperties(properties).map(a => ops.appendActionToLast(a));
        ops.appendActionToLast(opQuery([], null));
        return this.send<DataType>(ops).then(r => extend(new factory(this), r));
    }

    /**
     * Converts the current instance to a request context
     *
     * @param verb The request verb
     * @param options The set of supplied request options
     * @param parser The supplied ODataParser instance
     * @param pipeline Optional request processing pipeline
     */
    protected toRequestContext<T>(
        verb: string,
        options: FetchOptions,
        parser: ODataParser<T>,
        pipeline: Array<(c: RequestContext<T>) => Promise<RequestContext<T>>>): Promise<RequestContext<T>> {

        return toAbsoluteUrl(this.toUrlAndQuery()).then(url => {

            mergeOptions(options, this._options);

            const headers = new Headers();

            mergeHeaders(headers, options.headers);

            mergeHeaders(headers, {
                "accept": "*/*",
                "content-type": "text/xml",
            });

            options = extend(options, { headers });

            // we need to do some special cache handling to ensure we have a good key
            if (this._useCaching) {

                let keyStr = options.body;

                if (stringIsNullOrEmpty(keyStr)) {

                    if (hOP(options, "clientsvc_ObjectPaths")) {
                        // if we are using caching and batching together we need to create our string from the paths stored for the
                        // batching operation (see: https://github.com/pnp/pnpjs/issues/449) but not update the ones passed to
                        // the batch as they will be indexed during the batch creation process
                        keyStr = (<{ clientsvc_ObjectPaths: ObjectPathQueue }>options).clientsvc_ObjectPaths.clone().toBody();
                    } else {
                        // this case shouldn't happen
                        keyStr = "";
                    }
                }

                // because all the requests use the same url they would collide in the cache we use a special key
                const cacheKey = `PnPjs.ProcessQueryClient(${getHashCode(keyStr)})`;

                if (objectDefinedNotNull(this._cachingOptions)) {
                    // if our key ends in the ProcessQuery url we overwrite it
                    if (/\/client\.svc\/ProcessQuery\?$/i.test(this._cachingOptions.key)) {
                        this._cachingOptions.key = cacheKey;
                    }
                } else {
                    this._cachingOptions = new CachingOptions(cacheKey);
                }
            }

            const dependencyDispose = this.hasBatch ? this._batchDependency : () => { return; };

            // build our request context
            const context: RequestContext<T> = {
                batch: this.batch,
                batchDependency: dependencyDispose,
                cachingOptions: this._cachingOptions,
                clientFactory: () => new SPHttpClient(),
                isBatched: this.hasBatch,
                isCached: this._useCaching,
                options: options,
                parser: parser,
                pipeline: pipeline,
                requestAbsoluteUrl: url,
                requestId: getGUID(),
                verb: verb,
            };

            return context;
        });
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
    protected get batch(): IObjectPathBatch {
        return this.hasBatch ? this._batch : null;
    }

    /**
     * Executes the actual invoke method call
     * 
     * @param methodName Name of the method to invoke
     * @param params Method parameters
     * @param queryAction Specifies the query action to take
     */
    private invokeMethodImpl<T>(methodName: string, params: IMethodParamsBuilder | null, actions: string[], queryAction: string, isAction = false): Promise<T> {

        const ops = this._objectPaths.copy();

        if (isAction) {
            ops.appendActionToLast(methodAction(methodName, params));
        } else {
            ops.add(method(methodName, params, ...[objectPath(), ...actions, queryAction]));
        }

        return this.send<T>(ops);
    }
}
