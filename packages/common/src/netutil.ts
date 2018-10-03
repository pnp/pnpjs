import { extend, objectDefinedNotNull } from "./util";

declare var global: { fetch(url: string, options: any): Promise<Response> };

export interface ConfigOptions {
    headers?: string[][] | { [key: string]: string } | Headers;
    mode?: "navigate" | "same-origin" | "no-cors" | "cors";
    credentials?: "omit" | "same-origin" | "include";
    cache?: "default" | "no-store" | "reload" | "no-cache" | "force-cache" | "only-if-cached";
}

export interface FetchOptions extends ConfigOptions {
    method?: string;
    body?: any;
}

export interface HttpClientImpl {
    fetch(url: string, options: FetchOptions): Promise<Response>;
}

export interface RequestClient {
    fetch(url: string, options?: FetchOptions): Promise<Response>;
    fetchRaw(url: string, options?: FetchOptions): Promise<Response>;
    get(url: string, options?: FetchOptions): Promise<Response>;
    post(url: string, options?: FetchOptions): Promise<Response>;
    patch(url: string, options?: FetchOptions): Promise<Response>;
    delete(url: string, options?: FetchOptions): Promise<Response>;
}

export function mergeHeaders(target: Headers, source: any): void {
    if (source !== undefined && source !== null) {
        const temp = <any>new Request("", { headers: source });
        temp.headers.forEach((value: string, name: string) => {
            target.append(name, value);
        });
    }
}

export function mergeOptions(target: ConfigOptions, source: ConfigOptions): void {

    if (objectDefinedNotNull(source)) {
        const headers = extend(target.headers || {}, source.headers!);
        target = extend(target, source);
        target.headers = headers;
    }
}

/**
 * Makes requests using the global/window fetch API
 */
export class FetchClient implements HttpClientImpl {
    public fetch(url: string, options: FetchOptions): Promise<Response> {
        return global.fetch(url, options);
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

    public fetch(url: string, options: FetchOptions = {}): Promise<Response> {

        const headers = new Headers();

        mergeHeaders(headers, options.headers);

        headers.set("Authorization", `Bearer ${this._token}`);

        options.headers = headers;

        return super.fetch(url, options);
    }
}
