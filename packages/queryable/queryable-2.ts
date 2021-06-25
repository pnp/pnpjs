import { combine, getGUID } from "@pnp/core";
import { LogLevel } from "@pnp/logging/logger.js";
import { IHybrid2 } from "./invokable-binder2.js";
import { asyncReduce, broadcast, request } from "./moments.js";
import { Timeline } from "./timeline.js";

export type QueryablePreObserver = (this: IQueryable2, url: string, init: RequestInit, result: any) => Promise<[string, RequestInit, any]>;

export type QueryableAuthObserver = (this: IQueryable2, url: URL, init: RequestInit) => Promise<[URL, RequestInit]>;

export type QueryableSendObserver = (this: IQueryable2, url: URL, init: RequestInit) => Promise<Response>;

export type QueryableParseObserver = (this: IQueryable2, url: URL, response: Response, result: any | undefined) => Promise<[URL, Response, any]>;

export type QueryablePostObserver = (this: IQueryable2, url: URL, result: any | undefined) => Promise<[URL, any]>;

export type QueryableDataObserver<T = any> = (this: IQueryable2, result: T) => void;

const DefaultBehaviors = {
    pre: asyncReduce<QueryablePreObserver>(),
    auth: asyncReduce<QueryableAuthObserver>(),
    send: request<QueryableSendObserver>(),
    parse: asyncReduce<QueryableParseObserver>(),
    post: asyncReduce<QueryablePostObserver>(),
    data: broadcast<QueryableDataObserver>(),
} as const;

export interface Queryable2<R = any> {
    (init?: RequestInit): Promise<R>;
}
// eslint-disable-next-line no-redeclare
export class Queryable2<R> extends Timeline<typeof DefaultBehaviors> implements IQueryable2<R> {

    private _parent: Queryable2<any>;
    private _url: string;
    private _query: Map<string, string>;

    constructor(init: Queryable2<any> | string, path?: string) {

        let url = "";
        let parent = null;
        let observers;

        if (typeof init === "string") {

            url = combine(init, path);

        } else {

            const { _url, _parent } = init;

            url = (new URL(path, _url)).toString();
            parent = _parent || null;
            // TODO:: doesn't work due to data event (maybe others)
            // pre, post, send, auth, error, log
            // data
            observers = init.observers;
        }

        // TODO:: need to maybe filter out some handlers, like on data??
        // need to trace through multiple objects inheriting and not
        super(DefaultBehaviors, observers);

        this._url = url;
        this._parent = parent;
        this._query = new Map<string, string>();
    }

    public using(behavior: (intance: this) => this): this {
        return behavior(this);
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

    protected clone<T extends IQueryable2>(factory: (init: IQueryable2<any>, path?: string) => T, path?: string): T {

        const o = factory(this, path);
        return o;
    }

    protected execute(requestInit: RequestInit = { method: "GET", headers: {} }): Promise<any> {

        setTimeout(async () => {

            const requestId = getGUID();
            let requestUrl: URL;

            try {

                this.emit.log(`[id:${requestId}] Beginning request`, LogLevel.Info);

                // eslint-disable-next-line prefer-const
                let [url, init, result] = await this.emit.pre(this.toRequestUrl(), requestInit, undefined);

                this.emit.log(`[id:${requestId}] Url: ${url}`, LogLevel.Info);

                if (typeof result !== "undefined") {
                    this.emit.data(result);

                    // TODO:: do we still run post tasks here? We did NOT in v2, but different architecture
                    return;
                }

                this.emit.log(`[id:${requestId}] Emitting auth`, LogLevel.Verbose);
                [requestUrl, init] = await this.emit.auth(new URL(url), init);
                this.emit.log(`[id:${requestId}] Emitted auth`, LogLevel.Verbose);

                this.emit.log(`[id:${requestId}] Emitting send`, LogLevel.Verbose);
                let response = await this.emit.send(requestUrl, init);
                this.emit.log(`[id:${requestId}] Emitted send`, LogLevel.Verbose);

                this.emit.log(`[id:${requestId}] Emitting parse`, LogLevel.Verbose);
                [requestUrl, response, result] = await this.emit.parse(requestUrl, response, result);
                this.emit.log(`[id:${requestId}] Emitted parse`, LogLevel.Verbose);

                this.emit.log(`[id:${requestId}] Emitting post`, LogLevel.Verbose);
                [requestUrl, result] = await this.emit.post(requestUrl, result);
                this.emit.log(`[id:${requestId}] Emitted post`, LogLevel.Verbose);

                // TODO:: how do we handle the case where the request pipeline has worked as expected, however
                // the result remains undefined? We shouldn't emit data as we don't have any, but should we have a
                // completed event to signal the request is completed?
                if (typeof result !== "undefined") {
                    this.emit.log(`[id:${requestId}] Emitting data`, LogLevel.Verbose);
                    this.emit.data(result);
                    this.emit.log(`[id:${requestId}] Emitted data`, LogLevel.Verbose);
                }

            } catch (e) {

                this.emit.log(`[id:${requestId}] Emitting error: "${e.message || e}"`, LogLevel.Error);
                // anything that throws we emit and continue
                this.emit.error(e);
                this.emit.log(`[id:${requestId}] Emitted error: "${e.message || e}"`, LogLevel.Error);

            } finally {

                this.emit.log(`[id:${requestId}] Finished request`, LogLevel.Info);
            }

        }, 0);

        return new Promise((resolve, reject) => {
            this.on.data(resolve);
            this.on.error(reject);
        });
    }
}
// this interface is required to stop the class from recursively referencing itself through the DefaultBehaviors type
export interface IQueryable2<R = any> extends Timeline<any>, IHybrid2<any, R> {
    readonly query: Map<string, string>;
    (this: any, init?: RequestInit): Promise<R>;
    using(behavior: (intance: this) => this): this;
    toRequestUrl(): string;
    toUrl(): string;
}

// TODO:: do you like the idea that the pipeline logic is contained in functions with this signature
// then anyone can write any pipeline that can be applied to a Queryable2 - making it super easy to add moments to the timeline and then use them
// in your application
export async function queryableDefaultRequest(this: Queryable2, requestInit: RequestInit = { method: "GET", headers: {} }): Promise<any> {

    setTimeout(async () => {

        const requestId = getGUID();
        let requestUrl: URL;

        try {

            this.emit.log(`[id:${requestId}] Beginning request`, LogLevel.Info);

            // eslint-disable-next-line prefer-const
            let [url, init, result] = await this.emit.pre(this.toRequestUrl(), requestInit, undefined);

            this.emit.log(`[id:${requestId}] Url: ${url}`, LogLevel.Info);

            if (typeof result !== "undefined") {
                this.emit.data(result);

                // TODO:: do we still run post tasks here? We did NOT in v2, but different architecture
                return;
            }

            this.emit.log(`[id:${requestId}] Emitting auth`, LogLevel.Verbose);
            [requestUrl, init] = await this.emit.auth(new URL(url), init);
            this.emit.log(`[id:${requestId}] Emitted auth`, LogLevel.Verbose);

            this.emit.log(`[id:${requestId}] Emitting send`, LogLevel.Verbose);
            let response = await this.emit.send(requestUrl, init);
            this.emit.log(`[id:${requestId}] Emitted send`, LogLevel.Verbose);

            this.emit.log(`[id:${requestId}] Emitting parse`, LogLevel.Verbose);
            [requestUrl, response, result] = await this.emit.parse(requestUrl, response, result);
            this.emit.log(`[id:${requestId}] Emitted parse`, LogLevel.Verbose);

            this.emit.log(`[id:${requestId}] Emitting post`, LogLevel.Verbose);
            [requestUrl, result] = await this.emit.post(requestUrl, result);
            this.emit.log(`[id:${requestId}] Emitted post`, LogLevel.Verbose);

            // TODO:: how do we handle the case where the request pipeline has worked as expected, however
            // the result remains undefined? We shouldn't emit data as we don't have any, but should we have a
            // completed event to signal the request is completed?
            if (typeof result !== "undefined") {
                this.emit.log(`[id:${requestId}] Emitting data`, LogLevel.Verbose);
                this.emit.data(result);
                this.emit.log(`[id:${requestId}] Emitted data`, LogLevel.Verbose);
            }

        } catch (e) {

            this.emit.log(`[id:${requestId}] Emitting error: "${e.message || e}"`, LogLevel.Error);
            // anything that throws we emit and continue
            this.emit.error(e);
            this.emit.log(`[id:${requestId}] Emitted error: "${e.message || e}"`, LogLevel.Error);

        } finally {

            this.emit.log(`[id:${requestId}] Finished request`, LogLevel.Info);
        }

    }, 0);

    return new Promise((resolve, reject) => {
        this.on.data(resolve);
        this.on.error(reject);
    });
}

// export async function queryableDefaultRequest2(this: Queryable2, requestInit: RequestInit = { method: "GET", headers: {} }): Promise<any> {

//     setTimeout(async () => {
//         const requestId = getGUID();
//         let requestUrl: URL;

//         const emitError = (e) => {
//             this.emit.log(`[id:${requestId}] Emitting error: "${e.message || e}"`, LogLevel.Error);
//             this.emit.error(e);
//             this.emit.log(`[id:${requestId}] Emitted error: "${e.message || e}"`, LogLevel.Error);
//         };

//         try {
//             let retVal: any = undefined;

//             const emitSend = async (): Promise<any> => {
//                 this.emit.log(`[id:${requestId}] Emitting auth`, LogLevel.Verbose);
//                 [url, init] = await this.emit.auth(url, init);
//                 this.emit.log(`[id:${requestId}] Emitted auth`, LogLevel.Verbose);

//                 this.emit.log(`[id:${requestId}] Emitting send`, LogLevel.Verbose);
//                 let response = await this.emit.send(url, init);
//                 this.emit.log(`[id:${requestId}] Emitted send`, LogLevel.Verbose);

//                 this.emit.log(`[id:${requestId}] Emitting parse`, LogLevel.Verbose);
//                 [url, response, result] = await this.emit.parse(url, response, result);
//                 this.emit.log(`[id:${requestId}] Emitted parse`, LogLevel.Verbose);

//                 this.emit.log(`[id:${requestId}] Emitting post`, LogLevel.Verbose);
//                 [url, result] = await this.emit.post(url, result);
//                 this.emit.log(`[id:${requestId}] Emitted post`, LogLevel.Verbose)

//                 return result;
//             };

//             const emitData = () => {
//                 this.emit.log(`[id:${requestId}] Emitting data`, LogLevel.Verbose);
//                 this.emit.data(retVal);
//                 this.emit.log(`[id:${requestId}] Emitted data`, LogLevel.Verbose);
//             };

//             this.emit.log(`[id:${requestId}] Beginning request`, LogLevel.Info);

//             let [url, init, result] = await this.emit.pre(this.toRequestUrl(), requestInit, undefined);

//             this.emit.log(`[id:${requestId}] Url: ${url}`, LogLevel.Info);

//             if (typeof result !== "undefined") {
//                 retVal = result;
//             }

//             // Waiting is false by default, result is undefined by default, unless cached value is returned
//             if (this.AsyncOverride || retVal !== undefined) {
//                 // AsyncOverride is true, and a return value exists -> assume lazy cache update pipeline execution.
//                 setTimeout(async () => {
//                     try {
//                         await emitSend();
//                     } catch (e) {
//                         emitError(e);
//                     }
//                 }, 0);

//                 emitData();
//             } else if (retVal === undefined) {
//                 // If retVal is undefined then regardless of AsyncOverride execute pipeline
//                 retVal = await emitSend();

//                 // TODO:: how do we handle the case where the request pipeline has worked as expected, however
//                 // the result remains undefined? We shouldn't emit data as we don't have any, but should we have a
//                 // completed event to signal the request is completed?
//                 if (typeof retVal !== "undefined") {
//                     emitData();
//                 }
//             } else {
//                 // Return cached value
//                 emitData();
//             }
//         } catch (e) {
//             emitError(e);
//         } finally {
//             this.emit.log(`[id:${requestId}] Finished request`, LogLevel.Info);
//         }
//     }, 0);

//     return new Promise((resolve, reject) => {
//         this.on.data(resolve);
//         this.on.error(reject);
//     });
// }

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

