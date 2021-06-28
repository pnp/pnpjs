import { Queryable2 } from "../queryable-2.js";
import { extendObj } from "@pnp/queryable";
import { isFunc, getHashCode, PnPClientStorage, dateAdd, getGUID } from "@pnp/core";
import { LogLevel } from "@pnp/logging";

export function CachingPessimisticRefresh(store: "local" | "session" = "session", keyFactory?: (url: string) => string, expireFunc?: (url: string) => Date): (instance: Queryable2) => Queryable2 {

    const storage = new PnPClientStorage();
    const s = store === "session" ? storage.session : storage.local;

    if (!isFunc(keyFactory)) {
        keyFactory = (url: string) => getHashCode(url.toLowerCase()).toString();
    }

    if (!isFunc(expireFunc)) {
        // TODO:: tie this default timeline to config? or the config is having to create the function
        expireFunc = () => dateAdd(new Date(), "minute", 5);
    }

    return (instance: Queryable2) => {

        instance.on.pre(async function (this: Queryable2, url: string, init: RequestInit, result: any): Promise<[string, RequestInit, any]> {

            const key = keyFactory(url.toString());

            const cached = s.get(key);

            // we need to ensure that result stays "undefined" unless we mean to set null as the result
            if (cached === null) {

                // if we don't have a cached result we need to get it after the request is sent and parsed
                this.on.post(async function (url: URL, result: any) {

                    s.put(key, result, expireFunc(url.toString()));

                    return [url, result];
                });

            } else {

                result = cached;
            }

            //TODO::Cannot extend instance of execute here, as it's already running.
            extendObj(instance, {
                execute: (requestInit: RequestInit = { method: "GET", headers: {} }): Promise<any> => {

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

                            let [url, init, result] = await this.emit.pre(this.toRequestUrl(), requestInit, undefined);

                            this.emit.log(`[id:${requestId}] Url: ${url}`, LogLevel.Info);

                            if (typeof result !== "undefined") {
                                retVal = result;
                            }

                            // Waiting is false by default, result is undefined by default, unless cached value is returned
                            if (retVal !== undefined) {
                                // Return value exists -> assume lazy cache update pipeline execution.
                                setTimeout(async () => {
                                    try {
                                        await emitSend();
                                    } catch (e) {
                                        emitError(e);
                                    }
                                }, 0);

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
                }
            });

            return [url, init, result];
        });

        return instance;
    };
}