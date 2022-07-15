import { stringIsNullOrEmpty } from "@pnp/core";

/**
 * Encodes path portions of SharePoint urls such as decodedUrl=`encodePath(pathStr)`
 *
 * @param value The string path to encode
 * @returns A path encoded for use in SP urls
 */
export function encodePath(value: string): string {

    if (stringIsNullOrEmpty(value)) {
        return "";
    }

    // replace all instance of ' with ''
    if (/!(@.*?)::(.*?)/ig.test(value)) {

        return value.replace(/!(@.*?)::(.*)$/ig, (match, labelName, v) => {
            return `!${labelName}::${v.replace(/'/ig, "''")}`;
        });

    } else {
        return encodeURIComponent(value.replace(/'/ig, "''"));
    }
}
