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
            // we do not need to encodeURIComponent v as it will be encoded automatically when it is added as a query string param
            // we do need to double any ' chars
            return `!${labelName}::${v.replace(/'/ig, "''")}`;
        });

    } else {

        // because this is a literal path value we encodeURIComponent after doubling any ' chars
        return encodeURIComponent(value.replace(/'/ig, "''"));
    }
}
