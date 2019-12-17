import { IObjectPath } from "./objectpath";

/**
 * Transforms an array of object paths into a request xml body. Does not do placeholder substitutions.
 * 
 * @param objectPaths The object paths for which we want to generate a body
 */
export function writeObjectPathBody(objectPaths: IObjectPath[]): string {

    const actions: string[] = [];
    const paths: string[] = [];

    objectPaths.forEach(op => {
        paths.push(op.path);
        actions.push(...op.actions);
    });

    // create our xml payload
    return [
        `<Request xmlns="http://schemas.microsoft.com/sharepoint/clientquery/2009" SchemaVersion="15.0.0.0" LibraryVersion="16.0.0.0" ApplicationName="PnPjs">`,
        "<Actions>",
        actions.join(""),
        "</Actions>",
        "<ObjectPaths>",
        paths.join(""),
        "</ObjectPaths>",
        "</Request>",
    ].join("");
}
