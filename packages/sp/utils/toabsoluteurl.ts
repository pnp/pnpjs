import { combine, isUrlAbsolute, hOP, safeGlobal } from "@pnp/common";
import { SPRuntimeConfig } from "../splibconfig";

/**
 * Ensures that a given url is absolute for the current web based on context
 *
 * @param candidateUrl The url to make absolute
 *
 */
export async function toAbsoluteUrl(candidateUrl: string): Promise<string> {

    if (isUrlAbsolute(candidateUrl)) {
        // if we are already absolute, then just return the url
        return candidateUrl;
    }

    if (SPRuntimeConfig.baseUrl !== null) {
        // base url specified either with baseUrl of spfxContext config property
        return combine(SPRuntimeConfig.baseUrl, candidateUrl);
    }

    if (safeGlobal._spPageContextInfo !== undefined) {

        // operating in classic pages
        if (hOP(safeGlobal._spPageContextInfo, "webAbsoluteUrl")) {
            return combine(safeGlobal._spPageContextInfo.webAbsoluteUrl, candidateUrl);
        } else if (hOP(safeGlobal._spPageContextInfo, "webServerRelativeUrl")) {
            return combine(safeGlobal._spPageContextInfo.webServerRelativeUrl, candidateUrl);
        }
    }

    // does window.location exist and have a certain path part in it?
    if (safeGlobal.location !== undefined) {
        const baseUrl = safeGlobal.location.toString().toLowerCase();
        ["/_layouts/", "/siteassets/"].forEach((s: string) => {
            const index = baseUrl.indexOf(s);
            if (index > 0) {
                return combine(baseUrl.substr(0, index), candidateUrl);
            }
        });
    }

    return candidateUrl;
}
