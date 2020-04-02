import { assign, objectDefinedNotNull } from "./util";
import { ISPFXContext } from "./spfxcontextinterface";
import { safeGlobal } from "./safe-global";

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
        const headers = assign(target.headers || {}, source.headers!);
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

    constructor(private _token: string | null) {
        super();
    }

    public get token() {
        return this._token || "";
    }

    public set token(token: string) {
        this._token = token;
    }

    public fetch(url: string, options: IFetchOptions = {}): Promise<Response> {

        const headers = new Headers();

        mergeHeaders(headers, options.headers);

        headers.set("Authorization", `Bearer ${this._token}`);

        options.headers = headers;

        return super.fetch(url, options);
    }
}

/**
 * Client wrapping the aadTokenProvider available from SPFx >= 1.6
 */
export class SPFxAdalClient extends BearerTokenFetchClient {

    /**
     * 
     * @param context provide the appropriate SPFx Context object
     */
    constructor(private context: ISPFXContext) {
        super(null);
    }

    /**
     * Executes a fetch request using the supplied url and options
     * 
     * @param url Absolute url of the request
     * @param options Any options
     */
    public async fetch(url: string, options: IFetchOptions): Promise<Response> {

        const token = await this.getToken(getADALResource(url));
        this.token = token;
        return super.fetch(url, options);
    }

    /**
     * Gets an AAD token for the provided resource using the SPFx AADTokenProvider
     * 
     * @param resource Resource for which a token is to be requested (ex: https://graph.microsoft.com)
     */
    public async getToken(resource: string): Promise<string> {

        const provider = await this.context.aadTokenProviderFactory.getTokenProvider();
        return provider.getToken(resource);
    }
}
