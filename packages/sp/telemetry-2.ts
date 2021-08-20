import { OLD_ISharePointQueryable } from "./sharepointqueryable.js";
import { stringIsNullOrEmpty } from "@pnp/core";

// TODO:: rethink all this.

/**
 * Includes this method name in the X-ClientService-ClientTag used to record pnpjs usage
 *
 * @param name Method name, displayed in the
 */
export function tag(name: string) {

    return function (target: any, key: string, descriptor: PropertyDescriptor) {


        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }
        const originalMethod = descriptor.value;

        descriptor.value = async function (this: OLD_ISharePointQueryable, ...args: any[]) {

            // TODO:: reimagine this
            // this.configure(headers({ "X-PnPjs-Tracking": name }));
            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}
tag.getClientTag = (h: Headers, deleteFromCollection = true): string => {
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
tag.configure = <T>(o: T, name: string): T => {
    // TODO:: we need to set this up as a pre observer that handles doing this
    return o; // .configure(headers({ "X-PnPjs-Tracking": name }));
};
tag.isTagged = <T>(o: T): boolean => {
    return false; // .data.options.headers && o.data.options.headers["X-PnPjs-Tracking"];
};
