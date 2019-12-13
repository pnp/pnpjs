export function type<T = unknown>(n: string, a: T): T & { "@odata.type": string} {
    return Object.assign({ "@odata.type": n }, a);
}
