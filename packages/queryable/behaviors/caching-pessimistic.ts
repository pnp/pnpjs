import { Queryable } from "../queryable.js";
import { isFunc, getHashCode, PnPClientStorage, getGUID, extend } from "@pnp/core";

/**
 * Pessimistic Caching Behavior
 * Always returns the cached value if one exists but asynchronously executes the call and updates the cache.
 * If a expireFunc is included then the cache update only happens if the cache has expired.
 *
 * @param store Use local or session storage
 * @param keyFactory: a function that returns the key for the cache value, if not provided a default hash of the url will be used
 * @param expireFunc: a function that returns a date of expiration for the cache value, if not provided the cache never expires but is always updated.
 */
export function CachingPessimisticRefresh(
    type: "local" | "session" = "session",
    keyFactory?: (url: string) => string,
    expireFunc?: () => Date): (instance: Queryable) => Queryable {

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
                // TODO:: Think about making PnPClientStorage handle no expiration date.
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
    };

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
                if (cache !== undefined) {
                    retVal = JSON.parse(cache);
                }
            }
        } catch (err) {
            console.log(`CachingPessimistic(getStorage): ${err}.`);
        }
        return retVal;
    };

    let refreshCache = true;

    return (instance: Queryable) => {

        instance.on.init(function (this: Queryable) {

            const newExecute = extend(this, {

                async execute(userInit: RequestInit = { method: "GET", headers: {} }): Promise<any> {
                    setTimeout(async () => {
                        const requestId = getGUID();

                        const emitError = (e) => {
                            this.log(`[id:${requestId}] Emitting error: "${e.message || e}"`, 3);
                            this.emit.error(e);
                            this.log(`[id:${requestId}] Emitted error: "${e.message || e}"`, 3);
                        };

                        try {
                            let retVal: any = undefined;

                            const emitSend = async (): Promise<any> => {

                                this.log(`[id:${requestId}] Emitting auth`, 0);
                                [requestUrl, init] = await this.emit.auth(requestUrl, init);
                                this.log(`[id:${requestId}] Emitted auth`, 0);

                                // we always resepect user supplied init over observer modified init
                                init = { ...init, ...userInit, headers: { ...init.headers, ...userInit.headers } };

                                this.log(`[id:${requestId}] Emitting send`, 0);
                                let response = await this.emit.send(requestUrl, init);
                                this.log(`[id:${requestId}] Emitted send`, 0);

                                this.log(`[id:${requestId}] Emitting parse`, 0);
                                [requestUrl, response, result] = await this.emit.parse(requestUrl, response, result);
                                this.log(`[id:${requestId}] Emitted parse`, 0);

                                this.log(`[id:${requestId}] Emitting post`, 0);
                                [requestUrl, result] = await this.emit.post(requestUrl, result);
                                this.log(`[id:${requestId}] Emitted post`, 0);

                                return result;
                            };

                            const emitData = () => {
                                this.log(`[id:${requestId}] Emitting data`, 0);
                                this.emit.data(retVal);
                                this.log(`[id:${requestId}] Emitted data`, 0);
                            };

                            this.log(`[id:${requestId}] Beginning request`, 1);

                            let [requestUrl, init, result] = await this.emit.pre(this.toRequestUrl(), {}, undefined);

                            this.log(`[id:${requestId}] Url: ${requestUrl}`, 1);

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

                                this.log(`[id:${requestId}] Returning cached results and updating cache async`, 1);

                                emitData();
                            } else {
                                retVal = await emitSend();

                                this.log(`[id:${requestId}] Returning results`, 1);

                                emitData();
                            }
                        } catch (e) {
                            emitError(e);
                        } finally {
                            this.log(`[id:${requestId}] Finished request`, 1);
                        }
                    }, 0);

                    return new Promise((resolve, reject) => {
                        this.on[this.InternalResolveEvent].replace(resolve);
                        this.on[this.InternalRejectEvent].replace(reject);
                    });
                },
            });

            return newExecute;
        });

        instance.on.pre(async function (this: Queryable, url: string, init: RequestInit, result: any): Promise<[string, RequestInit, any]> {

            // Reset refreshCache
            refreshCache = true;

            const key = keyFactory(url.toString());

            const cached = getStorage(key);

            if (cached !== undefined) {

                // Return value
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
