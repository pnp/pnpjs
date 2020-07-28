import {
    assign,
    mergeHeaders,
    IFetchOptions,
    IRequestClient,
    getCtxCallback,
    IHttpClientImpl,
    combine,
    dateAdd,
} from "@pnp/common";
import { SPRuntimeConfig } from "./splibconfig";
import { extractWebUrl } from "./utils/extractweburl";
import { tag } from "./telemetry";
import { ODataParser } from "@pnp/odata";

export class SPHttpClient implements IRequestClient {

    protected _digestCache: IGetDigest;

    constructor(protected _impl: IHttpClientImpl = SPRuntimeConfig.fetchClientFactory()) {
        this._digestCache = getDigestFactory(this);
    }

    public async fetch(url: string, options: IFetchOptions = {}): Promise<Response> {

        let opts = assign(options, { cache: "no-cache", credentials: "same-origin" }, true);

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

            const methodName = tag.getClientTag(headers);
            let clientTag = `PnPCoreJS:$$Version$$:${methodName}`;

            if (clientTag.length > 32) {
                clientTag = clientTag.substr(0, 32);
            }

            headers.append("X-ClientService-ClientTag", clientTag);
        }

        opts = assign(opts, { headers: headers });

        // if we have either a request digest or an authorization header we don't need a digest
        if (opts.method && opts.method.toUpperCase() !== "GET" && !headers.has("X-RequestDigest") && !headers.has("Authorization")) {

            const digest = await this._digestCache(extractWebUrl(url));
            headers.append("X-RequestDigest", digest);
        }

        return this.fetchRaw(url, opts);
    }

    public fetchRaw(url: string, options: IFetchOptions = {}): Promise<Response> {

        // here we need to normalize the headers
        const rawHeaders = new Headers();
        mergeHeaders(rawHeaders, options.headers);
        options = assign(options, { headers: rawHeaders });

        const retry = (ctx: IRetryContext): void => {

            // handles setting the proper timeout for a retry
            const setRetry = (response: Response) => {
                let delay: number;

                if (response.headers.has("Retry-After")) {
                    // if we have gotten a header, use that value as the delay value in seconds
                    delay = parseInt(response.headers.get("Retry-After"), 10) * 1000;
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

                if (response.status === 503 || response.status === 504) {
                    // http status code 503 or 504, we can retry this
                    setRetry(response);
                } else {
                    ctx.reject(response);
                }
            });
        };

        return new Promise((resolve, reject) => {

            retry.call(this, <IRetryContext>{
                attempts: 0,
                delay: 100,
                reject: reject,
                resolve: resolve,
                retryCount: 7,
            });
        });
    }

    public get(url: string, options: IFetchOptions = {}): Promise<Response> {
        const opts = assign(options, { method: "GET" });
        return this.fetch(url, opts);
    }

    public post(url: string, options: IFetchOptions = {}): Promise<Response> {
        const opts = assign(options, { method: "POST" });
        return this.fetch(url, opts);
    }

    public patch(url: string, options: IFetchOptions = {}): Promise<Response> {
        const opts = assign(options, { method: "PATCH" });
        return this.fetch(url, opts);
    }

    public delete(url: string, options: IFetchOptions = {}): Promise<Response> {
        const opts = assign(options, { method: "DELETE" });
        return this.fetch(url, opts);
    }
}

interface IRetryContext {
    attempts: number;
    delay: number;
    reject: (reason?: any) => void;
    resolve: (value?: Response | PromiseLike<Response>) => void;
    retryCount: number;
}

interface ICachedDigest {
    expiration: Date;
    value: string;
}

interface IGetDigest {
    (webUrl: string): Promise<string>;
}

// allows for the caching of digests across all HttpClient's which each have their own DigestCache wrapper.
const digests = new Map<string, ICachedDigest>();

function getDigestFactory(client: SPHttpClient): IGetDigest {

    return async (webUrl: string) => {

        const cachedDigest: ICachedDigest = digests.get(webUrl);

        if (cachedDigest !== undefined) {
            const now = new Date();
            if (now < cachedDigest.expiration) {
                return cachedDigest.value;
            }
        }

        const url = combine(webUrl, "/_api/contextinfo");

        const headers = {
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose;charset=utf-8",
        };

        const resp = await client.fetchRaw(url, {
            cache: "no-cache",
            credentials: "same-origin",
            headers: assign(headers, SPRuntimeConfig.headers, true),
            method: "POST",
        });

        const parsed = await (new ODataParser()).parse(resp).then(r => r.GetContextWebInformation);

        const newCachedDigest: ICachedDigest = {
            expiration: dateAdd(new Date(), "second", parsed.FormDigestTimeoutSeconds),
            value: parsed.FormDigestValue,
        };

        digests.set(webUrl, newCachedDigest);

        return newCachedDigest.value;
    };
}
