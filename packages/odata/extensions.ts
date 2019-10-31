import { isFunc, isArray, TypedHash } from "@pnp/common";

export type ValidProxyMethods = "apply" | "get" | "has" | "set";

export type ExtensionDelegateType<T extends object> = { (op: string, target: T, ...rest: any[]): void };

export type ExtensionType<T extends object = {}> = Pick<ProxyHandler<T>, ValidProxyMethods> | ExtensionDelegateType<T> | TypedHash<any>;

let _enableExtensions = false;
const globaExtensions: ExtensionType[] = [];

const ObjExtensionsSym = Symbol("__extensions");

/**
 * Creates global extensions across all invokable objets
 * 
 * @param e The global extensions to apply
 */
export const extendGlobal = (e: ExtensionType | ExtensionType[]) => {

    _enableExtensions = true;

    extendCol(globaExtensions, e);
};

/**
 * Applies the supplied extensions to the single instance
 * 
 * @param o Object to which extensions are applied
 * @param e Extensions to apply
 */
export const extendObj = <T extends object>(o: T, e: ExtensionType | ExtensionType[]): T => {

    _enableExtensions = true;

    if (!Reflect.has(o, ObjExtensionsSym)) {
        Reflect.set(o, ObjExtensionsSym, []);
    }

    extendCol(<ExtensionType[]>Reflect.get(o, ObjExtensionsSym), e);

    return o;
};

/**
 * Allows applying extensions to all instances created from the supplied factory
 * 
 * @param factory 
 * @param h 
 */
export const extendFactory = <T extends (...args: any[]) => any>(factory: T, e: ExtensionType | ExtensionType[]): void => {

    _enableExtensions = true;

    if ((<any>factory).__proto__[ObjExtensionsSym] === undefined) {
        (<any>factory).__proto__[ObjExtensionsSym] = [];
    }

    extendCol((<any>factory).__proto__[ObjExtensionsSym], e);
};

function extendCol(a: ExtensionType[], e: ExtensionType | ExtensionType[]) {
    if (isArray(e)) {
        // @ts-ignore
        a.push(...e);
    } else {
        // @ts-ignore
        a.push(e);
    }
}

/**
 * Clears all global extensions
 */
export const clearExtensions = () => {
    globaExtensions.length = 0;
};

/**
 * Disables all extensions
 */
export const disableExtensions = () => {
    _enableExtensions = false;
};

/**
 * Enables all extensions
 */
export const enableExtensions = () => {
    _enableExtensions = true;
};

export const doFactoryExtensions = <T extends object = {}>(factory: (args: any[]) => T, args: any[]): T => {

    let o = factory(args);

    if ((<any>factory).__proto__[ObjExtensionsSym]) {
        o = extendObj(o, (<any>factory).__proto__[ObjExtensionsSym]);
    }

    return o;
};

export function extensionOrDefault(op: ValidProxyMethods, or: (...args: any[]) => any, target: any, ...rest: any[]): any {

    if (_enableExtensions) {

        const ec: ExtensionType[] = [];

        // we need to first invoke extensions tied to only this object
        if (Reflect.has(target, ObjExtensionsSym)) {
            ec.push(...Reflect.get(target, ObjExtensionsSym));
        }

        // second we need to process any global extensions
        ec.push(...globaExtensions);

        for (let i = 0; i < ec.length; i++) {
            const h = ec[i];

            let r = undefined;

            if (isFunc(h)) {

                // this extension is a function which we call
                r = (<any>h)(op, target, ...rest);

            } else if (op === "get" && Reflect.has(h, rest[0])) {

                // this extension is a named extension meaning we are overriding a specific method/property
                r = Reflect.get(h, rest[0], target);

            } else if (Reflect.has(h, op)) {

                // this extension is a ProxyHandler that has a handler defined for {op} so we pass control and see if we get a result
                r = Reflect.get(h, op)(target, ...rest);

            }

            if (typeof r !== "undefined") {
                // if a extension returned a result, we return that
                // this means that extensions overrides any other extensions and no more are executed
                return r;
            }
        }
    }

    return or(target, ...rest);
}
