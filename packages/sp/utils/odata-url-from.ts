import { combine, hOP, isUrlAbsolute } from "@pnp/core";
import { extractWebUrl } from "./extract-web-url.js";

export function odataUrlFrom(candidate: any): string {

    const parts: string[] = [];
    const s = ["odata.type", "odata.editLink", "__metadata", "odata.metadata", "odata.id"];

    if (hOP(candidate, s[0]) && candidate[s[0]] === "SP.Web") {

        // webs return an absolute url in the id
        if (hOP(candidate, s[4])) {
            parts.push(candidate[s[4]]);
        } else if (hOP(candidate, s[2])) {
            // we are dealing with verbose, which has an absolute uri
            parts.push(candidate.__metadata.uri);
        }

    } else {

        if (hOP(candidate, s[3]) && hOP(candidate, s[1])) {
            // we are dealign with minimal metadata (default)

            // some entities return an abosolute url in the editlink while for others it is relative
            // without the _api. This code is meant to handle both situations
            const editLink = isUrlAbsolute(candidate[s[1]]) ? candidate[s[1]].split("_api")[1] : candidate[s[1]];

            parts.push(extractWebUrl(candidate[s[3]]), "_api", editLink);
        } else if (hOP(candidate, s[1])) {
            parts.push("_api", candidate[s[1]]);
        } else if (hOP(candidate, s[2])) {
            // we are dealing with verbose, which has an absolute uri
            parts.push(candidate.__metadata.uri);
        }
    }

    if (parts.length < 1) {
        return "";
    }

    return combine(...parts);
}
