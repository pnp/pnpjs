import { ISharePointQueryable } from "./sharepointqueryable";
import { stringIsNullOrEmpty } from "@pnp/common";
import { headers } from "@pnp/odata";

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

        descriptor.value = async function (this: ISharePointQueryable, ...args: any[]) {

            this.configure(headers({ "X-PnPjs-Tracking": name }));
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
tag.configure = <T extends ISharePointQueryable>(o: T, name: string): T => {
    return o.configure(headers({ "X-PnPjs-Tracking": name }));
};
tag.isTagged = <T extends ISharePointQueryable>(o: T): T => {
    return o.data.options.headers && o.data.options.headers["X-PnPjs-Tracking"];
};
