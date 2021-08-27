import { Queryable2 } from "../queryable-2.js";
import { isFunc, getHashCode, PnPClientStorage, dateAdd, getGUID, extend } from "@pnp/core";
import { LogLevel } from "@pnp/logging";

/**
 * Pessimistic Caching Behavior
 * Always returns the cached value if one exists but asynchronously executes the call and updates the cache.
 * If a expireFunc is included then the cache update only happens if the cache has expired.
 *
 * @param store Use local or session storage
 * @param keyFactory: a function that returns the key for the cache value, if not provided a default hash of the url will be used
 * @param expireFunc: a function that returns a date of expiration for the cache value, if not provided the cache never expires but is always updated.
 */
export function CachingPessimisticRefresh(type: "local" | "session" = "session", keyFactory?: (url: string) => string, expireFunc?: () => Date): (instance: Queryable2) => Queryable2 {

    let store: Storage;
    if (type === "session") {
        store = (typeof sessionStorage === "undefined") ? new MemoryStorage() : sessionStorage;
    } else {
        store = (typeof localStorage === "undefined") ? new MemoryStorage() : localStorage;
    }


    if (!isFunc(keyFactory)) {
        keyFactory = (url: string) => getHashCode(url.toLowerCase()).toString();
    }

    const putStorage = (key: string, o: string) => {
        try {
            if (isFunc(expireFunc)) {
                //TODO:: Think about making PnPClientStorage handle no expiration date.
                const storage = new PnPClientStorage();
                const s = type === "session" ? storage.session : storage.local;
                s.put(key, o, expireFunc());
            } else {
                const cache = JSON.stringify({ pnp: 1, expiration: undefined, value: o });
                store.setItem(key, cache);
            }
        } catch (err) {
            console.log(`CachingPessimistic(putStorage): ${err}.`);
        }
    }

    const getStorage = (key: string): any => {
        let retVal: any = undefined;
        try {
            if (isFunc(expireFunc)) {
                const storage = new PnPClientStorage();
                const s = type === "session" ? storage.session : storage.local;
                retVal = s.get(key);
            } else {
                let cache = undefined;
                cache = store.getItem(key);
                if (cache != undefined)
                    retVal = JSON.parse(cache);
            }
        } catch (err) {
            console.log(`CachingPessimistic(getStorage): ${err}.`);
        }
        return retVal;
    }

    let refreshCache: boolean = true;

    return (instance: Queryable2) => {

        instance.on.init(function (this: Queryable2) {

            const newExecute = extend(this, {

                async execute(requestInit: RequestInit = { method: "GET", headers: {} }): Promise<any> {
                    setTimeout(async () => {
                        const requestId = getGUID();
                        let requestUrl: URL;

                        const emitError = (e) => {
                            this.emit.log(`[id:${requestId}] Emitting error: "${e.message || e}"`, LogLevel.Error);
                            this.emit.error(e);
                            this.emit.log(`[id:${requestId}] Emitted error: "${e.message || e}"`, LogLevel.Error);
                        };

                        try {
                            let retVal: any = undefined;

                            const emitSend = async (): Promise<any> => {

                                this.emit.log(`[id:${requestId}] Emitting auth`, LogLevel.Verbose);
                                [requestUrl, init] = await this.emit.auth(requestUrl, init);
                                this.emit.log(`[id:${requestId}] Emitted auth`, LogLevel.Verbose);

                                this.emit.log(`[id:${requestId}] Emitting send`, LogLevel.Verbose);
                                let response = await this.emit.send(requestUrl, init);
                                this.emit.log(`[id:${requestId}] Emitted send`, LogLevel.Verbose);

                                this.emit.log(`[id:${requestId}] Emitting parse`, LogLevel.Verbose);
                                [requestUrl, response, result] = await this.emit.parse(requestUrl, response, result);
                                this.emit.log(`[id:${requestId}] Emitted parse`, LogLevel.Verbose);

                                this.emit.log(`[id:${requestId}] Emitting post`, LogLevel.Verbose);
                                [requestUrl, result] = await this.emit.post(requestUrl, result);
                                this.emit.log(`[id:${requestId}] Emitted post`, LogLevel.Verbose)

                                return result;
                            };

                            const emitData = () => {
                                this.emit.log(`[id:${requestId}] Emitting data`, LogLevel.Verbose);
                                this.emit.data(retVal);
                                this.emit.log(`[id:${requestId}] Emitted data`, LogLevel.Verbose);
                            };

                            this.emit.log(`[id:${requestId}] Beginning request`, LogLevel.Info);

                            let [requestUrl, init, result] = await this.emit.pre(this.toRequestUrl(), requestInit, undefined);

                            this.emit.log(`[id:${requestId}] Url: ${requestUrl}`, LogLevel.Info);

                            if (typeof result !== "undefined") {
                                retVal = result;
                            }

                            // Waiting is false by default, result is undefined by default, unless cached value is returned
                            if (retVal !== undefined) {

                                if (refreshCache) {
                                    // Return value exists -> assume lazy cache update pipeline execution.
                                    setTimeout(async () => {
                                        try {
                                            await emitSend();
                                        } catch (e) {
                                            emitError(e);
                                        }
                                    }, 0);
                                }

                                this.emit.log(`[id:${requestId}] Returning cached results and updating cache async`, LogLevel.Info);

                                emitData();
                            } else {
                                retVal = await emitSend();

                                // TODO:: how do we handle the case where the request pipeline has worked as expected, however
                                // the result remains undefined? We shouldn't emit data as we don't have any, but should we have a
                                // completed event to signal the request is completed?
                                if (typeof retVal !== "undefined") {

                                    this.emit.log(`[id:${requestId}] Returning results`, LogLevel.Info);

                                    emitData();
                                }
                            }
                        } catch (e) {
                            emitError(e);
                        } finally {
                            this.emit.log(`[id:${requestId}] Finished request`, LogLevel.Info);
                        }
                    }, 0);

                    return new Promise((resolve, reject) => {
                        this.on.data(resolve);
                        this.on.error(reject);
                    });
                },
            });

            return newExecute;
        });

        instance.on.pre(async function (this: Queryable2, url: string, init: RequestInit, result: any): Promise<[string, RequestInit, any]> {

            //Reset refreshCache
            refreshCache = true;

            const key = keyFactory(url.toString());

            const cached = getStorage(key);

            if (cached !== undefined) {

                //Return value
                result = cached.value;

                if (cached.expiration !== undefined) {
                    if (new Date(cached.expiration) > new Date()) {
                        refreshCache = false;
                    }
                }
            }

            // in these instances make sure we update cache after retrieving result
            if (refreshCache) {

                // if we don't have a cached result we need to get it after the request is sent and parsed
                this.on.post(async function (url: URL, result: any) {

                    putStorage(key, result);

                    return [url, result];
                });

            }

            return [url, init, result];
        });

        return instance;
    };
}

class MemoryStorage {

    constructor(private _store = new Map<string, any>()) { }

    [key: string]: any;
    [index: number]: string;

    public get length(): number {
        return this._store.size;
    }

    public clear(): void {
        this._store.clear();
    }

    public getItem(key: string): any {
        return this._store.get(key);
    }

    public key(index: number): string {
        return Array.from(this._store)[index][0];
    }

    public removeItem(key: string): void {
        this._store.delete(key);
    }

    public setItem(key: string, data: string): void {
        this._store.set(key, data);
    }
}