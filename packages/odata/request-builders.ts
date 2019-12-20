import { jsS, ITypedHash } from "@pnp/common";

export function body<T = unknown, U = any>(o: U, previous?: T): T & { body: string } {
    return Object.assign({ body: jsS(o) }, previous);
}

export function headers<T = unknown, U extends ITypedHash<string> = {}>(o: U, previous?: T): T & { headers: U } {
    return Object.assign({ headers: o }, previous);
}
