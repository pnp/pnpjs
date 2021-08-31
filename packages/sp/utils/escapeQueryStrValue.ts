import { stringIsNullOrEmpty } from "@pnp/core";

export function escapeQueryStrValue(value: string): string {

    if (stringIsNullOrEmpty(value)) {
        return "";
    }

    // replace all instance of ' with ''

    if (/!(@.*?)::(.*?)/ig.test(value)) {
        // to ensure our param aliasing still works we need to treat these special or we'll hear about it
        // so we encode JUST the part that will end up in the url
        return value.replace(/!(@.*?)::(.*)$/ig, (match, labelName, v) => {
            return `!${labelName}::${encodeURIComponent(v.replace(/'/ig, "''"))}`;
        });
    } else {
        return encodeURIComponent(value.replace(/'/ig, "''"));
    }
}
