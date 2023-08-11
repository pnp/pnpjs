import { _SPQueryable, SPQueryable, spPost } from "../spqueryable.js";
import { body } from "@pnp/queryable";

export function getValueForUICultureBinder(propName: string): (this: _SPQueryable, cultureName: string) => Promise<string> {

    return function (this: _SPQueryable, cultureName: string): Promise<string> {
        return spPost(SPQueryable(this, `${propName}/getValueForUICulture`), body({ cultureName }));
    };
}
