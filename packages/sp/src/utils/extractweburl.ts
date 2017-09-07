export function extractWebUrl(candidateUrl: string) {

    if (candidateUrl === null) {
        return "";
    }

    const index = candidateUrl.indexOf("_api/");

    if (index > -1) {
        return candidateUrl.substr(0, index);
    }

    // if all else fails just give them what they gave us back
    return candidateUrl;
}
