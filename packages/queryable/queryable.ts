import { combine, getGUID, Timeline, asyncReduce, reduce, broadcast, request, isArray, TimelinePipe, lifecycle, stringIsNullOrEmpty, isFunc } from "@pnp/core";

export type QueryableConstructObserver = (this: IQueryableInternal, init: QueryableInit, path?: string) => void;

export type QueryablePreObserver = (this: IQueryableInternal, url: string, init: RequestInit, result: any) => Promise<[string, RequestInit, any]>;

export type QueryableAuthObserver = (this: IQueryableInternal, url: URL, init: RequestInit) => Promise<[URL, RequestInit]>;

export type QueryableSendObserver = (this: IQueryableInternal, url: URL, init: RequestInit) => Promise<Response>;

export type QueryableParseObserver = (this: IQueryableInternal, url: URL, response: Response, result: any | undefined) => Promise<[URL, Response, any]>;

export type QueryablePostObserver = (this: IQueryableInternal, url: URL, result: any | undefined) => Promise<[URL, any]>;

export type QueryableDataObserver<T = any> = (this: IQueryableInternal, result: T) => void;

type QueryablePromiseObserver = (this: IQueryableInternal, promise: Promise<any>) => [Promise<any>];

const DefaultMoments = {
    construct: lifecycle<QueryableConstructObserver>(),
    pre: asyncReduce<QueryablePreObserver>(),
    auth: asyncReduce<QueryableAuthObserver>(),
    send: request<QueryableSendObserver>(),
    parse: asyncReduce<QueryableParseObserver>(),
    post: asyncReduce<QueryablePostObserver>(),
    data: broadcast<QueryableDataObserver>(),
} as const;

export type QueryableInit = Queryable<any> | string | [Queryable<any>, string];

export type QueryParams = {
    /**
     * Sets the value associated to a given search parameter to the given value. If there were several values, delete the others.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/URLSearchParams/set)
     */
    set(name: string, value: string): void;

    /**
     * Returns the first value associated to the given search parameter.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/URLSearchParams/get)
     */
    get(name: string): string | null;

    /**
    * Returns a Boolean indicating if such a search parameter exists.
    *
    * [MDN Reference](https://developer.mozilla.org/docs/Web/API/URLSearchParams/has)
    */
    has(name: string, value?: string): boolean;

    /** Returns a string containing a query string suitable for use in a URL. Does not include the question mark. */
    toString(): string;

    /**
     * Iterator accessor
     */
    [Symbol.iterator](): Iterator<[string, string]>;
};

@invokable()
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class Queryable<R> extends Timeline<typeof DefaultMoments> implements IQueryableInternal<R> {

    // tracks any query parameters which will be appended to the request url
    protected _query: QueryParams;

    // tracks the current url for a given Queryable
    protected _url: string;

    // these keys represent internal events for Queryable, users are not expected to
    // subscribe directly to these, rather they enable functionality within Queryable
    // they are Symbols such that there are NOT cloned between queryables as we only grab string keys (by design)
    protected InternalResolve = Symbol.for("Queryable_Resolve");
    protected InternalReject = Symbol.for("Queryable_Reject");
    protected InternalPromise = Symbol.for("Queryable_Promise");

    constructor(init: QueryableInit, path?: string) {

        super(DefaultMoments);

        // default to use the included URL search params to parse the query string
        this._query = new URLSearchParams();

        // add an internal moment with specific implementation for promise creation
        this.moments[this.InternalPromise] = reduce<QueryablePromiseObserver>();

        let parent: Queryable<any>;

        if (typeof init === "string") {

            this._url = combine(init, path);

        } else if (isArray(init)) {

            if (init.length !== 2) {
                throw Error("When using the tuple param exactly two arguments are expected.");
            }

            if (typeof init[1] !== "string") {
                throw Error("Expected second tuple param to be a string.");
            }

            parent = init[0];
            this._url = combine(init[1], path);

        } else {

            parent = init as Queryable<any>;
            this._url = combine(parent._url, path);
        }

        if (typeof parent !== "undefined") {
            this.observers = parent.observers;
            this._inheritingObservers = true;
        }
    }

    /**
     * Directly concatenates the supplied string to the current url, not normalizing "/" chars
     *
     * @param pathPart The string to concatenate to the url
     */
    public concat(pathPart: string): this {
        this._url += pathPart;
        return this;
    }

    /**
     * Gets the full url with query information
     *
     */
    public toRequestUrl(): string {

        let url = this.toUrl();

        const query = this.query.toString();
        if (!stringIsNullOrEmpty(query)) {
            url += `${url.indexOf("?") > -1 ? "&" : "?"}${query}`;
        }

        return url;
    }

    /**
     * Querystring key, value pairs which will be included in the request
     */
    public get query(): QueryParams {
        return this._query;
    }

    /**
     * Gets the current url
     *
     */
    public toUrl(): string {
        return this._url;
    }

    protected execute(userInit: RequestInit): Promise<void> {

        // if there are NO observers registered this is likely either a bug in the library or a user error, direct to docs
        if (Reflect.ownKeys(this.observers).length < 1) {
            throw Error("No observers registered for this request. (https://pnp.github.io/pnpjs/queryable/queryable#no-observers-registered-for-this-request)");
        }

        // schedule the execution after we return the promise below in the next event loop
        setTimeout(async () => {

            const requestId = getGUID();
            let requestUrl: URL;

            const log = (msg: string, level?: number) => {
                // this allows us to easily and consistently format our messages
                this.log(`[${requestId}] ${msg}`, level);
            };

            try {

                log("Beginning request", 0);

                // include the request id in the headers to assist with debugging against logs
                const initSeed = {
                    ...userInit,
                    headers: { ...userInit.headers, "X-PnPjs-RequestId": requestId },
                };

                // eslint-disable-next-line prefer-const
                let [url, init, result] = await this.emit.pre(this.toRequestUrl(), initSeed, undefined);

                log(`Url: ${url}`, 1);

                if (typeof result !== "undefined") {

                    log("Result returned from pre, Emitting data");
                    this.emit.data(result);
                    log("Emitted data");
                    return;
                }

                log("Emitting auth");
                [requestUrl, init] = await this.emit.auth(new URL(url), init);
                log("Emitted auth");

                // we always resepect user supplied init over observer modified init
                init = { ...init, ...userInit, headers: { ...init.headers, ...userInit.headers } };

                log("Emitting send");
                let response = await this.emit.send(requestUrl, init);
                log("Emitted send");

                log("Emitting parse");
                [requestUrl, response, result] = await this.emit.parse(requestUrl, response, result);
                log("Emitted parse");

                log("Emitting post");
                [requestUrl, result] = await this.emit.post(requestUrl, result);
                log("Emitted post");

                log("Emitting data");
                this.emit.data(result);
                log("Emitted data");

            } catch (e) {

                log(`Emitting error: "${e.message || e}"`, 3);
                // anything that throws we emit and continue
                this.error(e);
                log("Emitted error", 3);

            } finally {

                log("Finished request", 0);
            }

        }, 0);

        // this allows us to internally hook the promise creation and modify it. This was introduced to allow for
        // cancelable to work as envisioned, but may have other users. Meant for internal use in the library accessed via behaviors.
        return this.emit[this.InternalPromise](new Promise<void>((resolve, reject) => {

            // we overwrite any pre-existing internal events as a
            // given queryable only processes a single request at a time
            this.on[this.InternalResolve].replace(resolve);
            this.on[this.InternalReject].replace(reject);
        }))[0];
    }
}

/**
 * This interface adds the invokable method to Queryable allowing obj() to be called correctly
 * The code is contained in invokable decorator
 */
// eslint-disable-next-line no-redeclare
export interface Queryable<R = any> extends IInvokable<R> { }

// this interface is required to stop the class from recursively referencing itself through the DefaultBehaviors type
export interface IQueryableInternal<R = any> extends Timeline<any>, IInvokable {
    readonly query: QueryParams;
    <T = R>(this: IQueryableInternal, init?: RequestInit): Promise<T>;
    using(...behaviors: TimelinePipe[]): this;
    toRequestUrl(): string;
    toUrl(): string;
}

function ensureInit(method: string, init: RequestInit = { headers: {} }): RequestInit {

    return { method, ...init, headers: { ...init.headers } };
}

export type Operation = <T = any>(this: IQueryableInternal, init?: RequestInit) => Promise<T>;

export function get<T = any>(this: IQueryableInternal, init?: RequestInit): Promise<T> {
    return this.start(ensureInit("GET", init));
}

export function post<T = any>(this: IQueryableInternal, init?: RequestInit): Promise<T> {
    return this.start(ensureInit("POST", init));
}

export function put<T = any>(this: IQueryableInternal, init?: RequestInit): Promise<T> {
    return this.start(ensureInit("PUT", init));
}

export function patch<T = any>(this: IQueryableInternal, init?: RequestInit): Promise<T> {
    return this.start(ensureInit("PATCH", init));
}

export function del<T = any>(this: IQueryableInternal, init?: RequestInit): Promise<T> {
    return this.start(ensureInit("DELETE", init));
}

export function op<T>(q: IQueryableInternal, operation: Operation, init?: RequestInit): Promise<T> {
    return Reflect.apply(operation, q, [init]);
}

export function queryableFactory<InstanceType>(
    constructor: { new(init: QueryableInit, path?: string): InstanceType },
): (init: QueryableInit, path?: string) => InstanceType {

    return (init: QueryableInit, path?: string) => {

        // construct the concrete instance
        const instance = new constructor(init, path);

        // we emit the construct event from the factory because we need all of the decorators and constructors
        // to have fully finished before we emit, which is now true. We type the instance to any to get around
        // the protected nature of emit
        (<any>instance).emit.construct(init, path);

        return instance;
    };
}

/**
 * Allows a decorated object to be invoked as a function, optionally providing an implementation for that action
 *
 * @param invokeableAction Optional. The logic to execute upon invoking the object as a function.
 * @returns Decorator which applies the invokable logic to the tagged class
 */
export function invokable(invokeableAction?: (this: any, init?: RequestInit) => Promise<any>) {

    return (target: any) => {

        return new Proxy(target, {

            construct(clz, args, newTarget: any) {

                const invokableInstance = Object.assign(function (init?: RequestInit) {

                    if (!isFunc(invokeableAction)) {
                        invokeableAction = function (this: any, init?: RequestInit) {
                            return op(this, get, init);
                        };
                    }

                    return Reflect.apply(invokeableAction, invokableInstance, [init]);

                }, Reflect.construct(clz, args, newTarget));

                Reflect.setPrototypeOf(invokableInstance, newTarget.prototype);

                return invokableInstance;
            },
        });
    };
}

export interface IInvokable<R = any> {
    <T = R>(init?: RequestInit): Promise<T>;
}
