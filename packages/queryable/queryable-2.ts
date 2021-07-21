import { combine, getGUID, Timeline, asyncReduce, broadcast, request, extendable } from "@pnp/core";
import { LogLevel } from "@pnp/logging/logger.js";
import { invokable } from "./invokable.js";

export type QueryablePreObserver = (this: IQueryable2, url: string, init: RequestInit, result: any) => Promise<[string, RequestInit, any]>;

export type QueryableAuthObserver = (this: IQueryable2, url: URL, init: RequestInit) => Promise<[URL, RequestInit]>;

export type QueryableSendObserver = (this: IQueryable2, url: URL, init: RequestInit) => Promise<Response>;

export type QueryableParseObserver = (this: IQueryable2, url: URL, response: Response, result: any | undefined) => Promise<[URL, Response, any]>;

export type QueryablePostObserver = (this: IQueryable2, url: URL, result: any | undefined) => Promise<[URL, any]>;

export type QueryableDataObserver<T = any> = (this: IQueryable2, result: T) => void;

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
export class Queryable2<R> extends Timeline<typeof DefaultMoments> implements IQueryable2<R> {

    private _url: string;
    private _query: Map<string, string>;

    constructor(init: Queryable2<any> | string, path?: string) {

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

        // TODO:: need to maybe filter out some handlers, like on data??
        // need to trace through multiple objects inheriting and not
        // TODO:: do we want state to be inherited?
        super(DefaultMoments, observers, {});

        this._url = url;
        this._query = new Map<string, string>();
        // process this one different
    }

    public using(behavior: (intance: Timeline<any>) => Timeline<any>): this {
        behavior(this);
        return this;
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

                this.log(`[id:${requestId}] Beginning request`, LogLevel.Info);

                // eslint-disable-next-line prefer-const
                let [url, init, result] = await this.emit.pre(this.toRequestUrl(), requestInit, undefined);

                this.log(`[id:${requestId}] Url: ${url}`, LogLevel.Info);

                if (typeof result !== "undefined") {

                    this.log(`[id:${requestId}] Result returned from pre`, LogLevel.Info);
                    this.log(`[id:${requestId}] Emitting data`, LogLevel.Verbose);
                    this.emit.data(result);
                    this.log(`[id:${requestId}] Emitted data`, LogLevel.Verbose);

                    // TODO:: do we still run post tasks here? We did NOT in v2, but different architecture
                    return;
                }

                this.log(`[id:${requestId}] Emitting auth`, LogLevel.Verbose);
                [requestUrl, init] = await this.emit.auth(new URL(url), init);
                this.log(`[id:${requestId}] Emitted auth`, LogLevel.Verbose);

                this.log(`[id:${requestId}] Emitting send`, LogLevel.Verbose);
                let response = await this.emit.send(requestUrl, init);
                this.log(`[id:${requestId}] Emitted send`, LogLevel.Verbose);

                this.log(`[id:${requestId}] Emitting parse`, LogLevel.Verbose);
                [requestUrl, response, result] = await this.emit.parse(requestUrl, response, result);
                this.log(`[id:${requestId}] Emitted parse`, LogLevel.Verbose);

                this.log(`[id:${requestId}] Emitting post`, LogLevel.Verbose);
                [requestUrl, result] = await this.emit.post(requestUrl, result);
                this.log(`[id:${requestId}] Emitted post`, LogLevel.Verbose);

                // TODO:: how do we handle the case where the request pipeline has worked as expected, however
                // the result remains undefined? We shouldn't emit data as we don't have any, but should we have a
                // completed event to signal the request is completed?
                if (typeof result !== "undefined") {
                    this.log(`[id:${requestId}] Emitting data`, LogLevel.Verbose);
                    this.emit.data(result);
                    this.log(`[id:${requestId}] Emitted data`, LogLevel.Verbose);
                }

            } catch (e) {

                this.log(`[id:${requestId}] Emitting error: "${e.message || e}"`, LogLevel.Error);
                // anything that throws we emit and continue
                this.error(e);
                this.log(`[id:${requestId}] Emitted error: "${e.message || e}"`, LogLevel.Error);

            } finally {

                this.log(`[id:${requestId}] Finished request`, LogLevel.Info);
            }

        }, 0);

        return new Promise((resolve, reject) => {
            this.on.data(resolve);
            this.on.error(reject);
        });
    }
}

// eslint-disable-next-line no-redeclare
export interface Queryable2<R = any> {
    <T = R>(init?: RequestInit): Promise<T>;
}

// this interface is required to stop the class from recursively referencing itself through the DefaultBehaviors type
export interface IQueryable2<R = any> extends Timeline<any> {
    readonly query: Map<string, string>;
    <T = R>(this: IQueryable2, init?: RequestInit): Promise<T>;
    using(behavior: (intance: Timeline<any>) => Timeline<any>): this;
    toRequestUrl(): string;
    toUrl(): string;
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

