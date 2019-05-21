import { isFunc, isArray } from "@pnp/common";

export type ValidProxyMethods = "apply" | "get" | "has" | "set";

export type IHook<T extends object = {}> = Pick<ProxyHandler<T>, ValidProxyMethods> | { (op: string, target: T, ...rest: any[]): void } | { [key: string]: any };

let _enableHooks = false;
const hooks: IHook[] = [];

const ObjHooksSym = Symbol("__hooks");

export function hookOr(op: ValidProxyMethods, or: (...args: any[]) => any, target: any, ...rest: any[]): any {

    if (_enableHooks) {

        const hc: IHook[] = [];

        // we need to first invoke hooks tied to only this object
        if (Reflect.has(target, ObjHooksSym)) {
            hc.push(...Reflect.get(target, ObjHooksSym));
        }

        // second we need to process any global hooks
        hc.push(...hooks);

        for (let i = 0; i < hc.length; i++) {
            const h = hc[i];

            let r = undefined;

            if (isFunc(h)) {

                // this hook is a function which we call
                r = (<any>h)(op, target, ...rest);

            } else if (op === "get" && Reflect.has(h, rest[0])) {

                // this hook is a named hook meaning we are overriding a specific method/property
                r = Reflect.get(h, rest[0], target);

            } else if (Reflect.has(h, op)) {

                // this hook is a ProxyHandler that has a handler defined for {op} so we pass control and see if we get a result
                r = Reflect.get(h, op)(target, ...rest);

            }

            if (typeof r !== "undefined") {
                // if a hook returned a result, we return that
                // this means that hooks override any other behaviors
                return r;
            }
        }
    }

    return or(target, ...rest);
}

/**
 * Creates global hooks across all invokable objets
 * 
 * @param h The global hooks to apply
 */
export const hook = (h: IHook | IHook[]) => {

    _enableHooks = true;

    if (isArray(h)) {
        // @ts-ignore
        hooks.push(...h);
    } else {
        // @ts-ignore
        hooks.push(h);
    }
};

/**
 * Clears all global hooks
 */
export const clearHooks = () => {
    hooks.length = 0;
};

/**
 * Clears all global hooks
 */
export const disableHooks = () => {
    _enableHooks = false;
};

/**
 * Clears all global hooks
 */
export const enableHooks = () => {
    _enableHooks = true;
};

/**
 * Applies the supplied hooks to the single instance
 * 
 * @param o Object to which hooks are applied
 * @param h Hooks to apply
 */
export const hookObj = <T extends object>(o: T, h: IHook | IHook[]): T => {

    _enableHooks = true;

    if (!Reflect.has(o, ObjHooksSym)) {
        Reflect.set(o, ObjHooksSym, []);
    }

    if (isArray(h)) {
        // @ts-ignore
        (<IHook[]>Reflect.get(o, ObjHooksSym)).push(...h);
    } else {
        // @ts-ignore
        (<IHook[]>Reflect.get(o, ObjHooksSym)).push(h);
    }

    return o;
};

/**
 * Allows applying hooks to all instances created from the supplied factory
 * 
 * @param factory 
 * @param h 
 */
export const hookFactory = <T extends (...args: any[]) => any>(factory: T, h: IHook | IHook[]): void => {

    _enableHooks = true;

    if ((<any>factory).__proto__[ObjHooksSym] === undefined) {
        (<any>factory).__proto__[ObjHooksSym] = [];
    }

    if (isArray(h)) {
        // @ts-ignore
        (<IHook[]>(<any>factory).__proto__[ObjHooksSym]).push(...h);
    } else {
        // @ts-ignore
        (<IHook[]>(<any>factory).__proto__[ObjHooksSym]).push(h);
    }
};

export const doFactoryHooks = <T extends object = {}>(factory: (args: any[]) => T, args: any[]): T => {

    let o = factory(args);

    if ((<any>factory).__proto__[ObjHooksSym]) {
        o = hookObj(o, (<any>factory).__proto__[ObjHooksSym]);
    }

    return o;
};
