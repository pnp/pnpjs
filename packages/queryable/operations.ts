import { IQueryable2 } from "./queryable-2";
import { objectDefinedNotNull } from "@pnp/core";

function ensureInit(method: string, init?: RequestInit): RequestInit {

    if (!objectDefinedNotNull(init)) {
        init = { headers: {} };
    }

    init.method = method;

    return init;
}

export type Operation = <T = any>(this: IQueryable2, init?: RequestInit) => Promise<T>;

export function get<T = any>(this: IQueryable2, init?: RequestInit): Promise<T> {
    return this.execute(ensureInit("GET", init));
}

export function post<T = any>(this: IQueryable2, init?: RequestInit): Promise<T> {
    return this.execute(ensureInit("POST", init));
}

export function put<T = any>(this: IQueryable2, init?: RequestInit): Promise<T> {
    return this.execute(ensureInit("PUT", init));
}

export function del<T = any>(this: IQueryable2, init?: RequestInit): Promise<T> {
    return this.execute(ensureInit("DELETE", init));
}

// TODO:: maybe we can clean this pattern up a bit, but we need to expose the protected execute within get, post, put, del
// we could always just
export function op<T>(q: IQueryable2, operation: Operation, init?: RequestInit): Promise<T> {
    return Reflect.apply(operation, q, [init]);
}

