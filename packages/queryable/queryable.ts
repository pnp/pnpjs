import { combine, getGUID, Timeline, asyncReduce, reduce, broadcast, request, extendable, isArray, TimelinePipe, ObserverCollection } from "@pnp/core";
import { IInvokable, invokable } from "./invokable.js";

export type QueryablePreObserver = (this: IQueryableInternal, url: string, init: RequestInit, result: any) => Promise<[string, RequestInit, any]>;

export type QueryableAuthObserver = (this: IQueryableInternal, url: URL, init: RequestInit) => Promise<[URL, RequestInit]>;

export type QueryableSendObserver = (this: IQueryableInternal, url: URL, init: RequestInit) => Promise<Response>;

export type QueryableParseObserver = (this: IQueryableInternal, url: URL, response: Response, result: any | undefined) => Promise<[URL, Response, any]>;

export type QueryablePostObserver = (this: IQueryableInternal, url: URL, result: any | undefined) => Promise<[URL, any]>;

export type QueryableDataObserver<T = any> = (this: IQueryableInternal, result: T) => void;

type QueryablePromiseObserver = (this: IQueryableInternal, promise: Promise<any>) => Promise<[Promise<any>]>;

const DefaultMoments = {
    pre: asyncReduce<QueryablePreObserver>(),
    auth: asyncReduce<QueryableAuthObserver>(),
    send: request<QueryableSendObserver>(),
    parse: asyncReduce<QueryableParseObserver>(),
    post: asyncReduce<QueryablePostObserver>(),
    data: broadcast<QueryableDataObserver>(),
} as const;

export type QueryableInit = Queryable<any> | string | [Queryable<any>, string];

@extendable()
@invokable()
export class Queryable<R> extends Timeline<typeof DefaultMoments> implements IQueryableInternal<R> {

    // tracks any query paramters which will be appended to the request url
    private _query: Map<string, string>;

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

        // add an intneral moment with specific implementaion for promise creation
        this.moments[this.InternalPromise] = reduce<QueryablePromiseObserver>();

        let url = "";
        let observers: ObserverCollection | undefined = undefined;

        if (typeof init === "string") {

            url = combine(init, path);

        } else if (isArray(init)) {

            if (init.length !== 2) {
                throw Error("When using the tuple first param only two arguments are supported");
            }

            const q: Queryable<any> = init[0];
            const _url: string = init[1];

            url = combine(_url, path);
            observers = q.observers;

        } else {

            const { _url, observers: _observers } = init as Queryable<any>;

            url = combine(_url, path);
            observers = _observers;
        }

        if (typeof observers !== "undefined") {
            this.observers = observers;
            this._inheritingObservers = true;
        }

        this._url = url;
        this._query = new Map<string, string>();
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

        let u = this.toUrl();

        if (this._query.size > 0) {
            u += "?" + Array.from(this._query).map((v: [string, string]) => `${v[0]}=${encodeURIComponent(v[1])}`).join("&");
        }

        return u;
    }

    /**
     * Querystring key, value pairs which will be included in the request
     */
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

    protected execute(userInit: RequestInit): Promise<void> {

        // if there are NO observers registered this is likely either a bug in the library or a user error, direct to docs
        if (Reflect.ownKeys(this.observers).length < 1) {
            throw Error("No observers registered for this request. (https://pnp.github.io/pnpjs/queryable/queryable#No-observers-registered-for-this-request)");
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

                log("Beginning request", 1);

                // eslint-disable-next-line prefer-const
                let [url, init, result] = await this.emit.pre(this.toRequestUrl(), userInit || {}, undefined);

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

                log("Finished request", 1);
            }

        }, 0);

        // this is the promise that the calling code will recieve and await
        let promise = new Promise<void>((resolve, reject) => {

            // we overwrite any pre-existing internal events as a
            // given queryable only processes a single request at a time
            this.on[this.InternalResolve].replace(resolve);
            this.on[this.InternalReject].replace(reject);
        });

        // this allows us to internally hook the promise creation and modify it. This was introduced to allow for
        // cancelable to work as envisioned, but may have other users. Meant for internal use in the library accessed via behaviors.
        [promise] = this.emit[this.InternalPromise](promise);

        return promise;
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
    readonly query: Map<string, string>;
    <T = R>(this: IQueryableInternal, init?: RequestInit): Promise<T>;
    using(...behaviors: TimelinePipe[]): this;
    toRequestUrl(): string;
    toUrl(): string;
}
