import { stringIsNullOrEmpty } from "@pnp/common";

export function escapeQueryStrValue(value: string): string {

    if (stringIsNullOrEmpty(value)) {
        return "";
    }

    // replace all instance of ' with ''
    return encodeURIComponent(value.replace(/\'/ig, "''"));
}
