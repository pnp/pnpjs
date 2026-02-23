import { stringIsNullOrEmpty } from "@pnp/core";

export function extractWebUrl(candidateUrl: string): string {

    if (stringIsNullOrEmpty(candidateUrl)) {
        return "";
    }

    let index = candidateUrl.indexOf("_api/");

    if (index < 0) {
        index = candidateUrl.indexOf("_vti_bin/");
    }

    if (index > -1) {
        return candidateUrl.substring(0, index);
    }

    // if all else fails just give them what they gave us back
    return candidateUrl;
}
