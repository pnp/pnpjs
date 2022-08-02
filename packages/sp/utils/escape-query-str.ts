import { stringIsNullOrEmpty } from "@pnp/core";

// deprecated, will be removed in future versions, no longer used internally
export function escapeQueryStrValue(value: string): string {

    if (stringIsNullOrEmpty(value)) {
        return "";
    }

    // replace all instance of ' with ''
    if (/!(@.*?)::(.*?)/ig.test(value)) {

        return value.replace(/!(@.*?)::(.*)$/ig, (match, labelName, v) => {
            return `!${labelName}::${v.replace(/'/ig, "''")}`;
        });

    } else {
        return value.replace(/'/ig, "''");
    }
}
