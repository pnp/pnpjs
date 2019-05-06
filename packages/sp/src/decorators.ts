import { headers } from "@pnp/odata";
import { stringIsNullOrEmpty } from "@pnp/common";
import { spPostDelete } from "./operations";
import { ISharePointQueryable } from "./sharepointqueryable";

/**
 * Class Decorators
 */

/**
 * Decorator used to specify the default path for SharePointQueryable objects
 * 
 * @param path 
 */
export function defaultPath(path: string) {

    return function <T extends { new(...args: any[]): {} }>(target: T) {

        return class extends target {
            constructor(...args: any[]) {
                super(args[0], args.length > 1 && args[1] !== undefined ? args[1] : path);
            }
        };
    };
}

/**
 * Adds the a delete method to the tagged class taking no parameters and calling spPostDelete
 */
export function deleteable() {
    return function <T extends { new(...args: any[]): {} }>(target: T) {

        return class extends target {
            public delete(this: ISharePointQueryable): Promise<void> {
                return spPostDelete(this);
            }
        };
    };
}

export interface IDeleteable {
    /**
     * Delete this instance
     */
    delete(): Promise<void>;
}

export function deleteableWithETag() {
    return function <T extends { new(...args: any[]): {} }>(target: T) {

        return class extends target {
            public delete(this: ISharePointQueryable, eTag = "*"): Promise<void> {
                return spPostDelete(this, headers({
                    "IF-Match": eTag,
                    "X-HTTP-Method": "DELETE",
                }));
            }
        };
    };
}

export interface IDeleteableWithETag {
    /**
     * Delete this instance
     *
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    delete(eTag?: string): Promise<void>;
}

/**
 * Method Decorators
 */

/**
 * Includes this method name in the X-ClientService-ClientTag used to record pnpjs usage
 * 
 * @param name Method name, displayed in the 
 */
export function clientTagMethod(name: string) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {

        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }
        const originalMethod = descriptor.value;

        descriptor.value = async function (this: ISharePointQueryable, ...args: any[]) {

            this.configure(headers({ "X-PnPjs-Tracking": name }));
            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}
clientTagMethod.getClientTag = (h: Headers, deleteFromCollection = true): string => {
    if (h.has("X-PnPjs-Tracking")) {
        const methodName = h.get("X-PnPjs-Tracking");
        if (deleteFromCollection) {
            h.delete("X-PnPjs-Tracking");
        }
        if (!stringIsNullOrEmpty(methodName)) {
            return methodName;
        }
    }
    return "";
};
clientTagMethod.configure = <T extends ISharePointQueryable>(o: T, name: string): T => {
    return o.configure(headers({ "X-PnPjs-Tracking": name }));
};

 // TODO::?
// performance tracking method decorator
// redirect to graph api




