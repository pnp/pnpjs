import { combine, isUrlAbsolute, DefaultRuntime, stringIsNullOrEmpty, ILibraryConfiguration, ISPFXContext, hOP } from "@pnp/common";
import { ISPConfigurationPart, ISPConfigurationProps } from "../splibconfig";

/**
 * Ensures that a given url is absolute for the current web based on context
 *
 * @param candidateUrl The url to make absolute
 *
 */
export async function toAbsoluteUrl(candidateUrl: string, runtime = DefaultRuntime): Promise<string> {

    if (isUrlAbsolute(candidateUrl)) {
        // if we are already absolute, then just return the url
        return candidateUrl;
    }

    const { baseUrl, fetchClientFactory } = runtime.get<ISPConfigurationPart, ISPConfigurationProps>("sp");

    if (!stringIsNullOrEmpty(baseUrl)) {
        // base url specified either with baseUrl of spfxContext config property
        return combine(baseUrl, candidateUrl);
    }

    // use a passed context if provided, if not see if we get one from the current runtime
    const context = runtime.get<ILibraryConfiguration, ISPFXContext>("spfxContext");
    if (context) {
        return combine(context.pageContext.web.absoluteUrl, candidateUrl);
    }

    // to make the existing node client work in a backwards compatible way we do the following (hacky thing)
    // get the client
    // see if it has a siteUrl property
    // use that to absolute the url
    if (fetchClientFactory) {
        const tempClient = fetchClientFactory();
        if (hOP(tempClient, "siteUrl")) {
            return combine((<{ siteUrl: string }><unknown>tempClient).siteUrl, candidateUrl);
        }
    }

    // scream test
    // if (safeGlobal._spPageContextInfo !== undefined) {

    //     // operating in classic pages
    //     if (hOP(safeGlobal._spPageContextInfo, "webAbsoluteUrl")) {
    //         return combine(safeGlobal._spPageContextInfo.webAbsoluteUrl, candidateUrl);
    //     } else if (hOP(safeGlobal._spPageContextInfo, "webServerRelativeUrl")) {
    //         return combine(safeGlobal._spPageContextInfo.webServerRelativeUrl, candidateUrl);
    //     }
    // }

    // // does window.location exist and have a certain path part in it?
    // if (safeGlobal.location !== undefined) {
    //     baseUrl = safeGlobal.location.toString().toLowerCase();
    //     ["/_layouts/", "/siteassets/"].forEach((s: string) => {
    //         const index = baseUrl.indexOf(s);
    //         if (index > 0) {
    //             return combine(baseUrl.substr(0, index), candidateUrl);
    //         }
    //     });
    // }

    return candidateUrl;
}
