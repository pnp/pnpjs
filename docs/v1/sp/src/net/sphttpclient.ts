import { DigestCache } from "./digestcache";
import {
    extend,
    mergeHeaders,
    FetchOptions,
    RequestClient,
    getCtxCallback,
    HttpClientImpl,
} from "@pnp/common";
import { SPRuntimeConfig } from "../config/splibconfig";
import { extractWebUrl } from "../utils/extractweburl";

export class SPHttpClient implements RequestClient {

    private _digestCache: DigestCache;

    constructor(private _impl: HttpClientImpl = SPRuntimeConfig.fetchClientFactory()) {
        this._digestCache = new DigestCache(this);
    }

    public fetch(url: string, options: FetchOptions = {}): Promise<Response> {

        let opts = extend(options, { cache: "no-cache", credentials: "same-origin" }, true);

        const headers = new Headers();

        // first we add the global headers so they can be overwritten by any passed in locally to this call
        mergeHeaders(headers, SPRuntimeConfig.headers);

        // second we add the local options so we can overwrite the globals
        mergeHeaders(headers, options.headers);

        // lastly we apply any default headers we need that may not exist
        if (!headers.has("Accept")) {
            headers.append("Accept", "application/json");
        }

        if (!headers.has("Content-Type")) {
            headers.append("Content-Type", "application/json;odata=verbose;charset=utf-8");
        }

        if (!headers.has("X-ClientService-ClientTag")) {
            headers.append("X-ClientService-ClientTag", "PnPCoreJS:@pnp-$$Version$$");
        }

        if (!headers.has("User-Agent")) {
            // this marks the requests for understanding by the service
            headers.append("User-Agent", "NONISV|SharePointPnP|PnPCoreJS/$$Version$$");
        }

        opts = extend(opts, { headers: headers });

        if (opts.method && opts.method.toUpperCase() !== "GET") {

            // if we have either a request digest or an authorization header we don't need a digest
            if (!headers.has("X-RequestDigest") && !headers.has("Authorization")) {
                return this._digestCache.getDigest(extractWebUrl(url))
                    .then((digest) => {
                        headers.append("X-RequestDigest", digest);
                        return this.fetchRaw(url, opts);
                    });
            }
        }

        return this.fetchRaw(url, opts);
    }

    public fetchRaw(url: string, options: FetchOptions = {}): Promise<Response> {

        // here we need to normalize the headers
        const rawHeaders = new Headers();
        mergeHeaders(rawHeaders, options.headers);
        options = extend(options, { headers: rawHeaders });

        const retry = (ctx: RetryContext): void => {

            // handles setting the proper timeout for a retry
            const setRetry = (response: Response) => {
                let delay;

                if (response.headers.has("Retry-After")) {
                    // if we have gotten a header, use that value as the delay value
                    delay = parseInt(response.headers.get("Retry-After"), 10);
                } else {
                    // grab our current delay
                    delay = ctx.delay;

                    // Increment our counters.
                    ctx.delay *= 2;
                }

                ctx.attempts++;

                // If we have exceeded the retry count, reject.
                if (ctx.retryCount <= ctx.attempts) {
                    ctx.reject(Error(`Retry count exceeded (${ctx.retryCount}) for request. Response status: [${response.status}] ${response.statusText}`));
                } else {
                    // Set our retry timeout for {delay} milliseconds.
                    setTimeout(getCtxCallback(this, retry, ctx), delay);
                }
            };

            // send the actual request
            this._impl.fetch(url, options).then((response) => {

                if (response.status === 429) {
                    // we have been throttled
                    setRetry(response);
                } else {
                    ctx.resolve(response);
                }

            }).catch((response: Response) => {

                if (response.status === 503) {
                    // http status code 503, we can retry this
                    setRetry(response);
                } else {
                    ctx.reject(response);
                }
            });
        };

        return new Promise((resolve, reject) => {

            const retryContext: RetryContext = {
                attempts: 0,
                delay: 100,
                reject: reject,
                resolve: resolve,
                retryCount: 7,
            };

            retry.call(this, retryContext);
        });
    }

    public get(url: string, options: FetchOptions = {}): Promise<Response> {
        const opts = extend(options, { method: "GET" });
        return this.fetch(url, opts);
    }

    public post(url: string, options: FetchOptions = {}): Promise<Response> {
        const opts = extend(options, { method: "POST" });
        return this.fetch(url, opts);
    }

    public patch(url: string, options: FetchOptions = {}): Promise<Response> {
        const opts = extend(options, { method: "PATCH" });
        return this.fetch(url, opts);
    }

    public delete(url: string, options: FetchOptions = {}): Promise<Response> {
        const opts = extend(options, { method: "DELETE" });
        return this.fetch(url, opts);
    }
}

interface RetryContext {
    attempts: number;
    delay: number;
    reject: (reason?: any) => void;
    resolve: (value?: Response | PromiseLike<Response>) => void;
    retryCount: number;
}
