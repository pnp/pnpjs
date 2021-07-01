import { _OLD_SharePointQueryable, OLD_SharePointQueryable } from "../sharepointqueryable.js";
import { OLD_spPost } from "../operations.js";
import { body } from "@pnp/queryable";

export function getValueForUICultureBinder(propName: string): (this: _OLD_SharePointQueryable, cultureName: string) => Promise<string> {
    return function (this: _OLD_SharePointQueryable, cultureName: string): Promise<string> {
        return OLD_spPost(this.clone(OLD_SharePointQueryable, `${propName}/getValueForUICulture`), body({ cultureName }));
    };
}
