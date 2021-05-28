import { Queryable2, queryableDefaultRequest2 } from "./queryable-2";

export function get<T = any>(q: Queryable2, init: RequestInit = { method: "GET", headers: {} }): Promise<T> {
    return Reflect.apply(queryableDefaultRequest2, q, [init]);
}

export function post<T = any>(q: Queryable2, init: RequestInit = { method: "POST", headers: {} }): Promise<T> {
    return Reflect.apply(queryableDefaultRequest2, q, [init]);
}

export function put<T = any>(q: Queryable2, init: RequestInit = { method: "POST", headers: {} }): Promise<T> {
    return Reflect.apply(queryableDefaultRequest2, q, [init]);
}

export function del<T = any>(q: Queryable2, init: RequestInit = { method: "DELETE", headers: {} }): Promise<T> {
    return Reflect.apply(queryableDefaultRequest2, q, [init]);
}
