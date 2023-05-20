import { getGUID, isArray, isFunc } from "./util.js";

export type ValidProxyMethods = "apply" | "get" | "has" | "set";

export type ExtensionDelegateType<T extends Record<string, unknown>> = { (op: string, target: T, ...rest: any[]): void };

// eslint-disable-next-line @typescript-eslint/ban-types
export type ExtensionType<T extends Record<string, unknown> = {}> = Pick<ProxyHandler<T>, ValidProxyMethods> | ExtensionDelegateType<T> | Record<any, any>;

let _enableExtensions = false;

const ObjExtensionsSym = Symbol.for("PnPExt");

const factoryExtensions: Map<string, ExtensionType[]> = new Map<string, ExtensionType[]>();

/**
 * Decorator factory wrapping any tagged class in the extension proxy, enabling the use of object extensions
 *
 * @description MUST be applied last (i.e. be the first decorator in the list top to bottom applied to a class)
 *
 * @returns Decorator implementation
 */
export function extendable() {

    return (target: any) => {

        return new Proxy(target, {

            construct(clz, args, newTarget: any) {

                let r: object = Reflect.construct(clz, args, newTarget);

                // this block handles the factory function extensions by picking
                // them off the factory and applying them to the created object
                const proto: any = Reflect.getPrototypeOf(target);

                if (Reflect.has(proto, ObjExtensionsSym)) {

                    const extensions = factoryExtensions.get(Reflect.get(proto, ObjExtensionsSym));

                    if (extensions) {
                        r = extend(r, extensions);
                    }
                }

                const proxied = new Proxy(r, {
                    apply: (target: any, _thisArg: any, argArray?: any) => {
                        // eslint-disable-next-line @typescript-eslint/ban-types
                        return extensionOrDefault("apply", (...a: [Function, any, ArrayLike<any>]) => Reflect.apply(...a), target, proxied, argArray);
                    },
                    get: (target: any, p: PropertyKey, receiver: any) => {
                        // eslint-disable-next-line @typescript-eslint/ban-types
                        return extensionOrDefault("get", (...a: [Object, PropertyKey, any]) => Reflect.get(...a), target, p, receiver);
                    },
                    has: (target: any, p: PropertyKey) => {
                        // eslint-disable-next-line @typescript-eslint/ban-types
                        return extensionOrDefault("has", (...a: [object, PropertyKey]) => Reflect.has(...a), target, p);
                    },
                    set: (target: any, p: PropertyKey, value: any, receiver: any) => {
                        // eslint-disable-next-line @typescript-eslint/ban-types
                        return extensionOrDefault("set", (...a: [object, PropertyKey, any, any]) => Reflect.set(...a), target, p, value, receiver);
                    },
                });

                return proxied;
            },
        });
    };
}

/**
 * Applies the supplied extensions to a single instance
 *
 * @param target Object to which extensions are applied
 * @param extensions Extensions to apply
 */
export function extend<T extends object>(target: T, extensions: ExtensionType | ExtensionType[]): T {

    _enableExtensions = true;

    if (!Reflect.has(target, ObjExtensionsSym)) {
        Reflect.defineProperty(target, ObjExtensionsSym, {
            writable: true,
            value: [],
        });
    }

    extendCol(<ExtensionType[]>Reflect.get(target, ObjExtensionsSym), extensions);

    return target;
}

/**
 * Allows applying extensions to all instances created from the supplied factory
 *
 * @param factory The Invokable Factory method to extend
 * @param extensions Extensions to apply
 */
export function extendFactory<T extends (...args: any[]) => any>(factory: T, extensions: ExtensionType | ExtensionType[]): void {

    _enableExtensions = true;

    // factoryExtensions
    const proto = Reflect.getPrototypeOf(factory);

    if (proto) {
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
    }
}

function extendCol(a: ExtensionType[], e: ExtensionType | ExtensionType[]) {
    if (isArray(e)) {
        a.push(...e);
    } else {
        a.push(e);
    }
}

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
 * Executes the extended functionality if present, or the default action
 *
 * @param op Current operation type
 * @param or The default non-extended functionality
 * @param target The current "this" to which the current call applies
 * @param rest Any arguments required for the called method
 * @returns Whatever the underlying extension or method returns
 */
function extensionOrDefault(op: ValidProxyMethods, or: (...args: any[]) => any, target: any, ...rest: any[]): any {

    if (_enableExtensions && Reflect.has(target, ObjExtensionsSym)) {

        const extensions: ExtensionType[] = [...Reflect.get(target, ObjExtensionsSym)];

        let result = undefined;

        for (let i = 0; i < extensions.length; i++) {

            const extension = extensions[i];

            if (isFunc(extension)) {

                // this extension is a function which we call
                result = (<any>extension)(op, target, ...rest);

            } else if (op === "get" && Reflect.has(extension, rest[0])) {

                // this extension is a named extension meaning we are adding/overriding a specific method/property
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
