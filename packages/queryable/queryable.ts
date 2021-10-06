import { combine, getGUID, Timeline, asyncReduce, broadcast, request, extendable } from "@pnp/core";
import { IInvokable, invokable } from "./invokable.js";

export type QueryablePreObserver = (this: IQueryableInternal, url: string, init: RequestInit, result: any) => Promise<[string, RequestInit, any]>;

export type QueryableAuthObserver = (this: IQueryableInternal, url: URL, init: RequestInit) => Promise<[URL, RequestInit]>;

export type QueryableSendObserver = (this: IQueryableInternal, url: URL, init: RequestInit) => Promise<Response>;

export type QueryableParseObserver = (this: IQueryableInternal, url: URL, response: Response, result: any | undefined) => Promise<[URL, Response, any]>;

export type QueryablePostObserver = (this: IQueryableInternal, url: URL, result: any | undefined) => Promise<[URL, any]>;

export type QueryableDataObserver<T = any> = (this: IQueryableInternal, result: T) => void;

const DefaultMoments = {
    pre: asyncReduce<QueryablePreObserver>(),
    auth: asyncReduce<QueryableAuthObserver>(),
    send: request<QueryableSendObserver>(),
    parse: asyncReduce<QueryableParseObserver>(),
    post: asyncReduce<QueryablePostObserver>(),
    data: broadcast<QueryableDataObserver>(),
} as const;

@extendable()
@invokable()
export class Queryable<R> extends Timeline<typeof DefaultMoments> implements IQueryableInternal<R> {

    protected _url: string;
    private _query: Map<string, string>;

    constructor(init: Queryable<any> | string, path?: string) {

        let url = "";
        let observers;

        if (typeof init === "string") {

            url = combine(init, path);

        } else {

            const { _url } = init;

            url = combine(_url, path);
            // TODO:: doesn't work due to data event (maybe others)
            // pre, post, send, auth, error, log
            // data
            observers = init.observers;
        }

        super(DefaultMoments, observers);

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

    protected execute(requestInit: RequestInit = { method: "GET", headers: {} }): Promise<void> {

        setTimeout(async () => {

            const requestId = getGUID();
            let requestUrl: URL;

            try {

                this.log(`[request:${requestId}] Beginning request`, 1);

                // eslint-disable-next-line prefer-const
                let [url, init, result] = await this.emit.pre(this.toRequestUrl(), requestInit, undefined);

                this.log(`[request:${requestId}] Url: ${url}`, 1);

                if (typeof result !== "undefined") {

                    this.log(`[request:${requestId}] Result returned from pre`, 1);
                    this.log(`[request:${requestId}] Emitting data`, 0);
                    this.emit.data(result);
                    this.log(`[request:${requestId}] Emitted data`, 0);

                    return;
                }

                this.log(`[request:${requestId}] Emitting auth`, 0);
                [requestUrl, init] = await this.emit.auth(new URL(url), init);
                this.log(`[request:${requestId}] Emitted auth`, 0);

                this.log(`[request:${requestId}] Emitting send`, 0);
                let response = await this.emit.send(requestUrl, init);
                this.log(`[request:${requestId}] Emitted send`, 0);

                this.log(`[request:${requestId}] Emitting parse`, 0);
                [requestUrl, response, result] = await this.emit.parse(requestUrl, response, result);
                this.log(`[request:${requestId}] Emitted parse`, 0);

                this.log(`[request:${requestId}] Emitting post`, 0);
                [requestUrl, result] = await this.emit.post(requestUrl, result);
                this.log(`[request:${requestId}] Emitted post`, 0);

                // TODO:: how do we handle the case where the request pipeline has worked as expected, however
                // the result remains undefined? We shouldn't emit data as we don't have any, but should we have a
                // completed event to signal the request is completed?
                if (typeof result !== "undefined") {
                    this.log(`[request:${requestId}] Emitting data`, 0);
                    this.emit.data(result);
                    this.log(`[request:${requestId}] Emitted data`, 0);
                }

            } catch (e) {

                this.log(`[request:${requestId}] Emitting error: "${e.message || e}"`, 3);
                // anything that throws we emit and continue
                this.error(e);
                this.log(`[request:${requestId}] Emitted error: "${e.message || e}"`, 3);

            } finally {

                this.log(`[request:${requestId}] Finished request`, 1);
            }

        }, 0);

        return new Promise((resolve, reject) => {
            this.on.data(resolve);
            this.on.error(reject);
        });
    }
}

/**
 * This interface adds the invokable method to Queryable allowing obj() to be called correctly
 * The code is contained in invokable decorator
 */
// eslint-disable-next-line no-redeclare
export interface Queryable<R = any> extends IInvokable<R> {}

// this interface is required to stop the class from recursively referencing itself through the DefaultBehaviors type
export interface IQueryableInternal<R = any> extends Timeline<any>, IInvokable {
    readonly query: Map<string, string>;
    <T = R>(this: IQueryableInternal, init?: RequestInit): Promise<T>;
    using(behavior: (intance: Timeline<any>) => Timeline<any>): this;
    toRequestUrl(): string;
    toUrl(): string;
}
