export interface ConfigOptions {
    headers?: string[][] | { [key: string]: string };
    mode?: "navigate" | "same-origin" | "no-cors" | "cors";
    credentials?: "omit" | "same-origin" | "include";
    cache?: "default" | "no-store" | "reload" | "no-cache" | "force-cache" | "only-if-cached";
}

export interface FetchOptions extends ConfigOptions {
    method?: string;
    body?: any;
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
    if (typeof source !== "undefined" && source !== null) {
        const temp = <any>new Request("", { headers: source });
        temp.headers.forEach((value: string, name: string) => {
            target.append(name, value);
        });
    }
}
