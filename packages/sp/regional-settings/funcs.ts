import { _SharePointQueryable, SharePointQueryable } from "../sharepointqueryable";
import { spPost } from "../operations";
import { body } from "@pnp/odata";

export function getValueForUICultureBinder(propName: string): (this: _SharePointQueryable, cultureName: string) => Promise<string> {
    return function (this: _SharePointQueryable, cultureName: string): Promise<string> {
        return spPost(this.clone(SharePointQueryable, `${propName}/getValueForUICulture`), body({ cultureName }));
    };
}
