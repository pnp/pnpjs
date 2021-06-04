import { IQueryable2, queryableDefaultRequest } from "./queryable-2";
import { objectDefinedNotNull } from "@pnp/common";

function ensureInit(method: string, init?: RequestInit): RequestInit {

    if (!objectDefinedNotNull(init)) {
        init = { headers: {} };
    }

    init.method = method;

    return init;
}

export function get<T = any>(q: IQueryable2, init?: RequestInit): Promise<T> {
    return Reflect.apply(queryableDefaultRequest, q, [ensureInit("GET", init)]);
}

export function post<T = any>(q: IQueryable2, init?: RequestInit): Promise<T> {
    return Reflect.apply(queryableDefaultRequest, q, [ensureInit("POST", init)]);
}

export function put<T = any>(q: IQueryable2, init?: RequestInit): Promise<T> {
    return Reflect.apply(queryableDefaultRequest, q, [ensureInit("PUT", init)]);
}

export function del<T = any>(q: IQueryable2, init?: RequestInit): Promise<T> {
    return Reflect.apply(queryableDefaultRequest, q, [ensureInit("DELETE", init)]);
}
