import { IQueryableInternal } from "./queryable";
import { objectDefinedNotNull } from "@pnp/core";

function ensureInit(method: string, init?: RequestInit): RequestInit {

    if (!objectDefinedNotNull(init)) {
        init = { headers: {} };
    }

    init.method = method;

    return init;
}

export type Operation = <T = any>(this: IQueryableInternal, init?: RequestInit) => Promise<T>;

export function get<T = any>(this: IQueryableInternal, init?: RequestInit): Promise<T> {
    return this.start(ensureInit("GET", init));
}

export function post<T = any>(this: IQueryableInternal, init?: RequestInit): Promise<T> {
    return this.start(ensureInit("POST", init));
}

export function put<T = any>(this: IQueryableInternal, init?: RequestInit): Promise<T> {
    return this.start(ensureInit("PUT", init));
}

export function patch<T = any>(this: IQueryableInternal, init?: RequestInit): Promise<T> {
    return this.start(ensureInit("PATCH", init));
}

export function del<T = any>(this: IQueryableInternal, init?: RequestInit): Promise<T> {
    return this.start(ensureInit("DELETE", init));
}

export function op<T>(q: IQueryableInternal, operation: Operation, init?: RequestInit): Promise<T> {
    return Reflect.apply(operation, q, [init]);
}
