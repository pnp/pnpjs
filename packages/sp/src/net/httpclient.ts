import { DigestCache } from "./digestcache";
import { Util } from "../utils/util";
import { RuntimeConfig } from "../configuration/pnplibconfig";
import { APIUrlException } from "../utils/exceptions";
import { mergeHeaders, FetchOptions } from "./utils";
import { RequestClient } from "../request/requestclient";

export interface HttpClientImpl {
    fetch(url: string, options: FetchOptions): Promise<Response>;
}

export class HttpClient implements RequestClient {

    private _digestCache: DigestCache;
    private _impl: HttpClientImpl;

    constructor() {
        this._impl = RuntimeConfig.spFetchClientFactory();
        this._digestCache = new DigestCache(this);
    }

    public fetch(url: string, options: FetchOptions = {}): Promise<Response> {

        let opts = Util.extend(options, { cache: "no-cache", credentials: "same-origin" }, true);

        const headers = new Headers();

        // first we add the global headers so they can be overwritten by any passed in locally to this call
        mergeHeaders(headers, RuntimeConfig.spHeaders);

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
            headers.append("X-ClientService-ClientTag", "PnPCoreJS:$$Version$$");
        }

        opts = Util.extend(opts, { headers: headers });

        if (opts.method && opts.method.toUpperCase() !== "GET") {

            // if we have either a request digest or an authorization header we don't need a digest
            if (!headers.has("X-RequestDigest") && !headers.has("Authorization")) {
                const index = url.indexOf("_api/");
                if (index < 0) {
                    throw new APIUrlException();
                }
                const webUrl = url.substr(0, index);
                return this._digestCache.getDigest(webUrl)
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
        options = Util.extend(options, { headers: rawHeaders });

        const retry = (ctx: RetryContext): void => {

            this._impl.fetch(url, options).then((response) => ctx.resolve(response)).catch((response) => {

                // Check if request was throttled - http status code 429
                // Check if request failed due to server unavailable - http status code 503
                if (response.status !== 429 && response.status !== 503) {
                    ctx.reject(response);
                }

                // grab our current delay
                const delay = ctx.delay;

                // Increment our counters.
                ctx.delay *= 2;
                ctx.attempts++;

                // If we have exceeded the retry count, reject.
                if (ctx.retryCount <= ctx.attempts) {
                    ctx.reject(response);
                }

                // Set our retry timeout for {delay} milliseconds.
                setTimeout(Util.getCtxCallback(this, retry, ctx), delay);
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
        const opts = Util.extend(options, { method: "GET" });
        return this.fetch(url, opts);
    }

    public post(url: string, options: FetchOptions = {}): Promise<Response> {
        const opts = Util.extend(options, { method: "POST" });
        return this.fetch(url, opts);
    }

    public patch(url: string, options: FetchOptions = {}): Promise<Response> {
        const opts = Util.extend(options, { method: "PATCH" });
        return this.fetch(url, opts);
    }

    public delete(url: string, options: FetchOptions = {}): Promise<Response> {
        const opts = Util.extend(options, { method: "DELETE" });
        return this.fetch(url, opts);
    }
}

interface RetryContext {
    attempts: number;
    delay: number;
    reject: (reason?: any) => void;
    resolve: (value?: {} | PromiseLike<{}>) => void;
    retryCount: number;
}
