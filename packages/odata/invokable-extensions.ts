import { isFunc, isArray, ITypedHash, getGUID } from "@pnp/common";

export type ValidProxyMethods = "apply" | "get" | "has" | "set";

export type ExtensionDelegateType<T extends object> = { (op: string, target: T, ...rest: any[]): void };

export type ExtensionType<T extends object = {}> = Pick<ProxyHandler<T>, ValidProxyMethods> | ExtensionDelegateType<T> | ITypedHash<any>;

let _enableExtensions = false;
const globalExtensions: ExtensionType[] = [];
const factoryExtensions: Map<string, ExtensionType[]> = new Map<string, ExtensionType[]>();

const ObjExtensionsSym = Symbol.for("43f7a601");

/**
 * Creates global extensions across all invokable objects
 * 
 * @param e The global extensions to apply
 */
export const extendGlobal = (e: ExtensionType | ExtensionType[]) => {

    _enableExtensions = true;
    extendCol(globalExtensions, e);
};

/**
 * Applies the supplied extensions to a single instance
 * 
 * @param target Object to which extensions are applied
 * @param extensions Extensions to apply
 */
export const extendObj = <T extends object>(target: T, extensions: ExtensionType | ExtensionType[]): T => {

    _enableExtensions = true;

    if (!Reflect.has(target, ObjExtensionsSym)) {
        Reflect.set(target, ObjExtensionsSym, []);
    }

    extendCol(<ExtensionType[]>Reflect.get(target, ObjExtensionsSym), extensions);

    return target;
};

/**
 * Allows applying extensions to all instances created from the supplied factory
 * 
 * @param factory The Invokable Factory method to extend
 * @param extensions Extensions to apply
 */
export const extendFactory = <T extends (...args: any[]) => any>(factory: T, extensions: ExtensionType | ExtensionType[]): void => {

    _enableExtensions = true;

    // factoryExtensions
    const proto = Reflect.getPrototypeOf(factory);

    if (!Reflect.has(proto, ObjExtensionsSym)) {

        Reflect.defineProperty(proto, ObjExtensionsSym, {
            value: getGUID(),
        });
    }

    const key = proto[ObjExtensionsSym];

    if (!factoryExtensions.has(key)) {
        factoryExtensions.set(key, []);
    }

    extendCol(factoryExtensions.get(key), extensions);
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
export const clearGlobalExtensions = () => {
    globalExtensions.length = 0;
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

/**
 * Applies a set of extension previously applied to a factory using extendFactory to an object created from that factory
 * 
 * @param factory 
 * @param args 
 */
export const applyFactoryExtensions = <T extends object = {}>(factory: (args: any[]) => T, args: any[]): T => {

    let o = factory(args);

    const proto = Reflect.getPrototypeOf(factory);

    if (Reflect.has(proto, ObjExtensionsSym)) {

        const extensions = factoryExtensions.get(Reflect.get(proto, ObjExtensionsSym));

        o = extendObj(o, extensions);
    }

    return o;
};

export function extensionOrDefault(op: ValidProxyMethods, or: (...args: any[]) => any, target: any, ...rest: any[]): any {

    if (_enableExtensions) {

        const extensions: ExtensionType[] = [];

        // we need to first invoke extensions tied to only this object
        if (Reflect.has(target, ObjExtensionsSym)) {
            extensions.push(...Reflect.get(target, ObjExtensionsSym));
        }

        // second we need to process any global extensions
        extensions.push(...globalExtensions);

        for (let i = 0; i < extensions.length; i++) {
            const extension = extensions[i];

            let result = undefined;

            if (isFunc(extension)) {

                // this extension is a function which we call
                result = (<any>extension)(op, target, ...rest);

            } else if (op === "get" && Reflect.has(extension, rest[0])) {

                // this extension is a named extension meaning we are overriding a specific method/property
                result = Reflect.get(extension, rest[0], target);

            } else if (Reflect.has(extension, op)) {

                // this extension is a ProxyHandler that has a handler defined for {op} so we pass control and see if we get a result
                result = Reflect.get(extension, op)(target, ...rest);
            }

            if (typeof result !== "undefined") {
                // if a extension returned a result, we return that
                // this means that this extension overrides any other extensions and no more are executed
                // first extension in the list to return "wins"
                return result;
            }
        }
    }

    return or(target, ...rest);
}
