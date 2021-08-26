import { assign, objectDefinedNotNull } from "./util.js";
import { safeGlobal } from "./safe-global.js";

export interface IConfigOptions {
    headers?: string[][] | { [key: string]: string } | Headers;
    mode?: "navigate" | "same-origin" | "no-cors" | "cors";
    credentials?: "omit" | "same-origin" | "include";
    cache?: "default" | "no-store" | "reload" | "no-cache" | "force-cache" | "only-if-cached";
}

export interface IFetchOptions extends IConfigOptions {
    method?: string;
    body?: any;
}

export interface IHttpClientImpl {
    fetch(url: string, options: IFetchOptions): Promise<Response>;
}

export interface IRequestClient {
    fetch(url: string, options?: IFetchOptions): Promise<Response>;
    fetchRaw(url: string, options?: IFetchOptions): Promise<Response>;
    get(url: string, options?: IFetchOptions): Promise<Response>;
    post(url: string, options?: IFetchOptions): Promise<Response>;
    patch(url: string, options?: IFetchOptions): Promise<Response>;
    delete(url: string, options?: IFetchOptions): Promise<Response>;
}

export function mergeHeaders(target: Headers, source: HeadersInit): void {

    if (objectDefinedNotNull(source)) {
        const temp = new Request("", { headers: source });
        temp.headers.forEach((value: string, name: string) => {
            target.append(name, value);
        });
    }
}

export function mergeOptions(target: IConfigOptions, source: IConfigOptions): void {

    if (objectDefinedNotNull(source)) {
        const headers = assign(target.headers || {}, source.headers);
        target = assign(target, source);
        target.headers = headers;
    }
}

/**
 * Parses out the root of the request url to use as the resource when getting the token
 *
  * @param url The url to parse
 */
export function getADALResource(url: string): string {
    const u = new URL(url);
    return `${u.protocol}//${u.hostname}`;
}

/**
 * Makes requests using the global/window fetch API
 */
export class FetchClient implements IHttpClientImpl {

    public fetch(url: string, options: IFetchOptions): Promise<Response> {

        return safeGlobal.fetch(url, options);
    }
}

/**
 * Makes requests using the fetch API adding the supplied token to the Authorization header
 */
export class BearerTokenFetchClient extends FetchClient {

    constructor(public token: string | null) {
        super();
    }

    public fetch(url: string, options: IFetchOptions = {}): Promise<Response> {

        const headers = new Headers();

        mergeHeaders(headers, options.headers);

        headers.set("Authorization", `Bearer ${this.token}`);

        options.headers = headers;

        return super.fetch(url, options);
    }
}

export interface ILambdaTokenFactoryParams {
    /**
     * Url to which the request for which we are requesting a token will be sent
     */
    url: string;
    /**
     * Any options supplied for the request
     */
    options: IFetchOptions;
}

export class LambdaFetchClient extends BearerTokenFetchClient {

    constructor(private tokenFactory: (parms: ILambdaTokenFactoryParams) => Promise<string>) {
        super(null);
    }

    /**
     * Executes a fetch request using the supplied url and options
     *
     * @param url Absolute url of the request
     * @param options Any options
     */
    public async fetch(url: string, options: IFetchOptions): Promise<Response> {

        this.token = await this.tokenFactory({ url, options });
        return super.fetch(url, options);
    }
}


