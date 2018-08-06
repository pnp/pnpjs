import { stringIsNullOrEmpty } from "@pnp/common";

export function extractWebUrl(candidateUrl: string) {

    if (stringIsNullOrEmpty(candidateUrl)) {
        return "";
    }

    let index = candidateUrl.indexOf("_api/");

    if (index < 0) {
        index = candidateUrl.indexOf("_vti_bin/");
    }

    if (index > -1) {
        return candidateUrl.substr(0, index);
    }

    // if all else fails just give them what they gave us back
    return candidateUrl;
}
