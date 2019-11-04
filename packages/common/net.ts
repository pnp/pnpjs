import { assign, objectDefinedNotNull } from "./util";

declare var global: { fetch(url: string, options: any): Promise<Response> };

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
 * Makes requests using the global/window fetch API
 */
export class FetchClient implements IHttpClientImpl {

    public fetch(url: string, options: IFetchOptions): Promise<Response> {

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

    public fetch(url: string, options: IFetchOptions = {}): Promise<Response> {

        const headers = new Headers();

        mergeHeaders(headers, options.headers);

        headers.set("Authorization", `Bearer ${this._token}`);

        options.headers = headers;

        return super.fetch(url, options);
    }
}
