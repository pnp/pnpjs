import { isFunc } from "./util";

export type ValidProxyMethods = "apply" | "get" | "has" | "set";

export type ExtensionDelegateType<T extends Record<string, unknown>> = { (op: string, target: T, ...rest: any[]): void };

// eslint-disable-next-line @typescript-eslint/ban-types
export type ExtensionType<T extends Record<string, unknown> = {}> = Pick<ProxyHandler<T>, ValidProxyMethods> | ExtensionDelegateType<T> | Record<any, any>;

let _enableExtensions = false;

const ObjExtensionsSym = Symbol.for("PnPObjectExtensions");

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

                const r = Reflect.construct(clz, args, newTarget);

                const proxied = new Proxy(r, {
                    apply: (target: any, _thisArg: any, argArray?: any) => {
                        // TODO:: ensure we set the proper "this"?? - we likely always need to use proxied here based on how Proxy seems to operate for chained operations
                        // const th = typeof thisArg === "undefined" ? proxied : thisArg;
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
// eslint-disable-next-line @typescript-eslint/ban-types
export function extend<T extends object>(target: T, extensions: ExtensionType | ExtensionType[]): T {

    _enableExtensions = true;

    if (!Reflect.has(target, ObjExtensionsSym)) {
        Reflect.set(target, ObjExtensionsSym, []);
    }

    extendCol(<ExtensionType[]>Reflect.get(target, ObjExtensionsSym), extensions);

    return target;
}

function extendCol(a: ExtensionType[], e: ExtensionType | ExtensionType[]) {
    if (Array.isArray(e)) {
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

    if (_enableExtensions) {

        const extensions: ExtensionType[] = [];

        // we need to invoke extensions tied to this object
        if (Reflect.has(target, ObjExtensionsSym)) {
            extensions.push(...Reflect.get(target, ObjExtensionsSym));
        }

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
