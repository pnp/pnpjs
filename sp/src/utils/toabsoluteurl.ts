declare var global: { location: string, _spPageContextInfo?: { webAbsoluteUrl?: string, webServerRelativeUrl?: string } };
import { combine, isUrlAbsolute, hOP } from "@pnp/common";
import { SPRuntimeConfig } from "../config/splibconfig";

/**
 * Ensures that a given url is absolute for the current web based on context
 *
 * @param candidateUrl The url to make absolute
 *
 */
export function toAbsoluteUrl(candidateUrl: string): Promise<string> {

    return new Promise((resolve) => {

        if (isUrlAbsolute(candidateUrl)) {
            // if we are already absolute, then just return the url
            return resolve(candidateUrl);
        }

        if (SPRuntimeConfig.baseUrl !== null) {
            // base url specified either with baseUrl of spfxContext config property
            return resolve(combine(SPRuntimeConfig.baseUrl, candidateUrl));
        }

        if (global._spPageContextInfo !== undefined) {

            // operating in classic pages
            if (hOP(global._spPageContextInfo, "webAbsoluteUrl")) {
                return resolve(combine(global._spPageContextInfo.webAbsoluteUrl, candidateUrl));
            } else if (hOP(global._spPageContextInfo, "webServerRelativeUrl")) {
                return resolve(combine(global._spPageContextInfo.webServerRelativeUrl, candidateUrl));
            }
        }

        // does window.location exist and have a certain path part in it?
        if (global.location !== undefined) {
            const baseUrl = global.location.toString().toLowerCase();
            ["/_layouts/", "/siteassets/"].forEach((s: string) => {
                const index = baseUrl.indexOf(s);
                if (index > 0) {
                    return resolve(combine(baseUrl.substr(0, index), candidateUrl));
                }
            });
        }

        return resolve(candidateUrl);
    });
}
